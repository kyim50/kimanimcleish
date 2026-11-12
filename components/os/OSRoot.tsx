'use client'
import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { AnimatePresence } from 'motion/react'
import { StoreProvider, createStore, placeWin, useOS, useOSActions, useStoreRef, type Store, type Spotify } from './store'
import Wallpaper from './Wallpaper'
import MenuBar from './MenuBar'
import DesktopIcons from './DesktopIcons'
import Frame from './Window'
import Dock from './Dock'
import Boot from './Boot'
import Login from './Login'
import PowerOff from './PowerOff'
import Mobile from './Mobile'
import { DraggableWidget } from './SpotifyWidget'
import { Palette, Shortcuts, About, EmptyTrash, ContextMenu, Calendar, Toast, Rain, Konami, Screensaver } from './Overlays'
import ControlPanel from './ControlPanel'

const MOCK: Spotify = {
  loaded: true, isPlaying: true,
  nowPlaying: { title: 'Sweet Life', artist: 'Frank Ocean', albumArt: '/os/speakers.webp', albumArtSmall: '/os/speakers.webp', songUrl: 'https://open.spotify.com' },
  recentTracks: [
    { title: 'Nights', artist: 'Frank Ocean', albumArt: '/os/plan-1745.webp', albumArtSmall: '/os/plan-1745.webp', songUrl: 'https://open.spotify.com' },
    { title: 'Redbone', artist: 'Childish Gambino', albumArt: '/os/tram.webp', albumArtSmall: '/os/tram.webp', songUrl: 'https://open.spotify.com' },
    { title: 'Pink + White', artist: 'Frank Ocean', albumArt: '/os/market.webp', albumArtSmall: '/os/market.webp', songUrl: 'https://open.spotify.com' },
  ],
  topTracks: [
    { title: 'Self Control', artist: 'Frank Ocean', albumArt: '/os/clocktower.webp', albumArtSmall: '/os/clocktower.webp', songUrl: 'https://open.spotify.com' },
    { title: 'Location', artist: 'Khalid', albumArt: '/os/menu.webp', albumArtSmall: '/os/menu.webp', songUrl: 'https://open.spotify.com' },
  ],
}

function Desktop() {
  const store = useStoreRef()
  const a = useOSActions()
  const wins = useOS((s) => s.wins)
  const focused = useOS((s) => [...s.wins].filter((w) => !w.min).sort((x, y) => y.z - x.z)[0]?.id)
  const vw = useOS((s) => s.vw), vh = useOS((s) => s.vh)
  const overlay = useOS((s) => s.overlay)
  const wall = useOS((s) => s.wallpaper)
  const settle = useOS((s) => s.settle)
  const snap = useOS((s) => s.snapPreview)
  return (
    <div className={`os-desktop${settle ? ' settling' : ''}`} onPointerDown={(e) => { if (store.get().menu && !(e.target as HTMLElement).closest('.bar')) store.set({ menu: null }) }}>
      <Wallpaper variant={wall} settle={settle} />
      <DesktopIcons />
      <DraggableWidget />
      <div className="win-layer">
        <AnimatePresence>
          {wins.map((w) => <Frame key={w.id} win={w} focused={w.id === focused} vw={vw} vh={vh} />)}
        </AnimatePresence>
      </div>
      {snap && <div key={snap} className={`snap-prev ${snap}`} />}
      <MenuBar />
      <Dock />
      <Toast />
      {overlay === 'palette' && <Palette />}
      {overlay === 'shortcuts' && <Shortcuts />}
      {overlay === 'about' && <About />}
      {overlay === 'empty-trash' && <EmptyTrash />}
      {overlay === 'ctx' && <ContextMenu />}
      {overlay === 'cal' && <Calendar />}
      {overlay === 'rain' && <Rain />}
      {overlay === 'konami' && <Konami />}
      {overlay === 'saver' && <Screensaver wallpaper={wall} />}
      {overlay === 'control' && <ControlPanel />}
    </div>
  )
}

function Brain({ pathname }: { pathname: string }) {
  const store = useStoreRef()
  const a = useOSActions()
  const phase = useOS((s) => s.phase)
  const mobile = useOS((s) => s.mobile)
  const wall = useOS((s) => s.wallpaper)
  const theme = useOS((s) => s.theme)
  const init = useRef(false)

  // boot decision, saved state, viewport
  useEffect(() => {
    if (init.current) return
    init.current = true
    const q = new URLSearchParams(window.location.search)
    let theme: 'light' | 'dark' = 'light'
    try { theme = (q.get('theme') as 'light' | 'dark') || (localStorage.getItem('kos_theme') as 'light' | 'dark') || 'light' } catch { /* */ }
    let wallpaper = 0, icons = {}
    try { wallpaper = Number(localStorage.getItem('kos_wall') || 0) || 0; icons = JSON.parse(localStorage.getItem('kos_icons') || '{}') } catch { /* */ }
    const m = window.matchMedia('(max-width: 767px)').matches
    let user: string | null = null, booted = false
    try { user = sessionStorage.getItem('kos_user'); booted = !!sessionStorage.getItem('kos_booted') } catch { /* */ }
    const atRoot = pathname === '/'
    const force = q.get('os')
    let phase: 'boot' | 'login' | 'desktop' = 'desktop'
    if (force === 'boot') phase = 'boot'
    else if (force === 'login' || force === 'login-error') phase = 'login'
    else if (force) phase = 'desktop'
    else if (atRoot && !user) phase = booted ? 'login' : 'boot'
    if (phase === 'desktop' && !user) { user = 'guest'; try { sessionStorage.setItem('kos_user', user); sessionStorage.setItem('kos_booted', '1') } catch { /* */ } }
    let motion: 'system' | 'reduce' | 'full' = 'system', widgetOn = true
    try { motion = (localStorage.getItem('kos_motion') as typeof motion) || 'system'; widgetOn = localStorage.getItem('kos_wdgon') !== '0' } catch { /* */ }
    a.lofiInit()
    if (q.get('os') === 'sleep') store.set({ overlay: 'saver' })
    if (q.get('os') === 'control') setTimeout(() => store.set({ overlay: 'control' }), 50)
    document.documentElement.classList.remove('pre')
    store.set({ phase, user, theme, wallpaper, icons, motion, widgetOn, mobile: m, vw: window.innerWidth, vh: window.innerHeight, booted })
    document.documentElement.setAttribute('data-theme', theme)
    const st = store.get()
    if (m) { if (st.wins[0]?.id === 'welcome') store.set({ wins: [] }) }
    else store.set({ wins: st.wins.map((w, i) => ({ ...placeWin(w.id, window.innerWidth, window.innerHeight, i, w.z), origin: w.origin })) })
    if (phase !== 'desktop' && !m) store.set({ wins: [] }) // nothing under the boot/login: login opens welcome + terminal
    if (q.get('os') === 'postlogin' && !m) { store.set({ wins: [] }); setTimeout(() => a.login('guest'), 0) }
    if (q.get('max') === '1' && !m) { const f = store.get().wins[0]; if (f) a.toggleMax(f.id) }
    if (q.get('os') === 'palette') store.set({ overlay: 'palette' })
    if (q.get('os') === 'ctx') store.set({ overlay: 'ctx', ctx: { x: 520, y: 300 } })
    if (q.get('os') === 'about') store.set({ overlay: 'about' })
    if (q.get('os') === 'shortcuts') store.set({ overlay: 'shortcuts' })
    if (q.get('os') === 'login-error') setTimeout(() => window.dispatchEvent(new CustomEvent('kos-try-password')), 400)
    if (q.get('mock') === 'spotify' && process.env.NODE_ENV === 'development') store.set({ spotify: MOCK })
    if (q.get('toast')) a.toast('Just one engineer and a lot of coffee. Press ? for shortcuts.', 'No cookies here.')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // remember where the last click landed: windows open from there
  useEffect(() => {
    const f = (e: PointerEvent) => { store.set({ lastPt: { x: e.clientX, y: e.clientY, t: Date.now() } }) }
    window.addEventListener('pointerdown', f, true)
    return () => window.removeEventListener('pointerdown', f, true)
  }, [store])

  // viewport
  useEffect(() => {
    const f = () => store.set({ vw: window.innerWidth, vh: window.innerHeight, mobile: window.matchMedia('(max-width: 767px)').matches })
    window.addEventListener('resize', f)
    return () => window.removeEventListener('resize', f)
  }, [store])

  // Back / Forward
  useEffect(() => { if (store.get().phase === 'desktop') a.external(pathname) }, [pathname, a, store])

  // spotify polling (silent on failure)
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('mock') === 'spotify' && process.env.NODE_ENV === 'development') return
    let dead = false
    const load = async () => {
      try {
        const r = await fetch('/api/spotify')
        if (!r.ok) throw 0
        const j = await r.json()
        if (!dead) store.set({ spotify: { isPlaying: !!j.isPlaying, nowPlaying: j.nowPlaying ?? null, recentTracks: j.recentTracks ?? [], topTracks: j.topTracks ?? [], loaded: true } })
      } catch { if (!dead) store.set((s) => ({ spotify: { ...s.spotify, loaded: true } })) }
    }
    load()
    const id = setInterval(load, 45000)
    return () => { dead = true; clearInterval(id) }
  }, [store])

  // theme attr
  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); document.documentElement.style.colorScheme = theme }, [theme])

  // reduce-motion override
  const motionPref = useOS((s) => s.motion)
  useEffect(() => {
    const r = document.documentElement
    if (motionPref === 'system') r.removeAttribute('data-motion'); else r.setAttribute('data-motion', motionPref)
  }, [motionPref])

  // first real gesture after boot starts the lo-fi (unless the visitor paused it before)
  useEffect(() => {
    if (phase === 'boot' || phase === 'off') return
    const g = (e: Event) => {
      if (e instanceof KeyboardEvent && (e.key === 'Escape' || e.metaKey || e.ctrlKey || e.altKey)) return
      a.lofiGesture()
    }
    window.addEventListener('pointerdown', g); window.addEventListener('keydown', g)
    return () => { window.removeEventListener('pointerdown', g); window.removeEventListener('keydown', g) }
  }, [phase, a])

  // keyboard shortcuts
  useEffect(() => {
    const typing = (t: EventTarget | null) => { const el = t as HTMLElement | null; return !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable) }
    const kon = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
    let ki = 0
    const onKey = (e: KeyboardEvent) => {
      const s = store.get()
      if (s.phase !== 'desktop') return
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); store.set({ overlay: s.overlay === 'palette' ? null : 'palette' }); return }
      if (e.key === 'F11' || (e.metaKey && e.key === 'F3')) { e.preventDefault(); a.showDesktop(); return }
      if (e.key === 'Escape') {
        if (s.overlay) store.set({ overlay: null, ctx: null })
        else if (s.menu) store.set({ menu: null })
        return
      }
      if (e.key === 'W' && e.shiftKey) {
        const f = [...s.wins].filter((w) => !w.min).sort((x, y) => y.z - x.z)[0]
        if (f) { e.preventDefault(); a.close(f.id) }
        return
      }
      if (typing(e.target)) return
      if (!typing(e.target)) {
        ki = e.key === kon[ki] || e.key.toLowerCase() === kon[ki] ? ki + 1 : (e.key === kon[0] ? 1 : 0)
        if (ki === kon.length) { ki = 0; store.set({ overlay: 'konami' }) }
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key === '/') { e.preventDefault(); store.set({ overlay: 'palette' }) }
      else if (e.key === '?') { store.set({ overlay: 'shortcuts' }) }
      else if (e.key.toLowerCase() === 'm' && !e.shiftKey) a.toggleTheme()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [store, a])

  // idle screensaver (60s)
  useEffect(() => {
    if (phase !== 'desktop') return
    let t = setTimeout(go, 60000)
    function go() { if (!store.get().overlay) store.set({ overlay: 'saver' }) }
    const reset = () => { clearTimeout(t); t = setTimeout(go, 60000) }
    const evs = ['pointermove', 'pointerdown', 'keydown'] as const
    evs.forEach((e) => window.addEventListener(e, reset, { passive: true }))
    return () => { clearTimeout(t); evs.forEach((e) => window.removeEventListener(e, reset)) }
  }, [phase, store])

  if (phase === 'boot') return <Boot />
  if (phase === 'login') return <Login wallpaper={wall} />
  if (phase === 'off') return <PowerOff />
  return null
}

export default function OSRoot() {
  const pathname = usePathname()
  const ref = useRef<Store | null>(null)
  if (!ref.current) ref.current = createStore(pathname)
  return (
    <StoreProvider value={ref.current}>
      <Inner pathname={pathname} />
    </StoreProvider>
  )
}

function Inner({ pathname }: { pathname: string }) {
  const mobile = useOS((s) => s.mobile)
  const phase = useOS((s) => s.phase)
  const wall = useOS((s) => s.wallpaper)
  const settle = useOS((s) => s.settle)
  const overlay = useOS((s) => s.overlay)
  return (
    <div id="os" className={`os${mobile === null ? ' unk' : ''}`}>
      {phase !== 'off' && (mobile ? (<><Wallpaper variant={wall} settle={settle} /><Mobile /><Toast />{overlay === 'control' && <ControlPanel />}</>) : <Desktop />)}
      <Brain pathname={pathname} />
    </div>
  )
}
