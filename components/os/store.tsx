'use client'
import { createContext, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { DEFS, ICON_IDS, MENU_H, defById, defByPath, type WinId } from './routes'
import { LOFI } from './lofi'

export type Win = {
  id: WinId; x: number; y: number; w: number; h: number; z: number
  min: boolean; max: boolean; snap: null | 'l' | 'r'
  prev?: { x: number; y: number; w: number; h: number }
  origin: { x: number; y: number } // screen point the window zooms from / to
}
export type Phase = 'boot' | 'login' | 'desktop' | 'off'
export type Track = { title: string; artist: string; album?: string; albumArt: string | null; albumArtSmall: string | null; songUrl: string }
export type Spotify = { isPlaying: boolean; nowPlaying: Track | null; recentTracks: Track[]; topTracks: Track[]; loaded: boolean }
export type Overlay = null | 'palette' | 'shortcuts' | 'about' | 'ctx' | 'cal' | 'empty-trash' | 'rain' | 'konami' | 'saver' | 'control'

export type State = {
  phase: Phase
  off: 'shutdown' | 'restart'
  booted: boolean
  user: string | null
  theme: 'light' | 'dark'
  wins: Win[]
  zTop: number
  icons: Record<string, { x: number; y: number }>
  sel: string[]
  wallpaper: number
  overlay: Overlay
  ctx: { x: number; y: number } | null
  menu: string | null
  toast: { id: number; msg: string; title?: string } | null
  vw: number
  vh: number
  mobile: boolean | null
  snapPreview: null | 'l' | 'r' | 't'
  spotify: Spotify
  settle: boolean // login just happened: play the settle animation
  focusReq: WinId | null
  lastPt: { x: number; y: number; t: number } | null
  motion: 'system' | 'reduce' | 'full'
  blogPath: string
  widgetOn: boolean
  sd: WinId[] // windows hidden by Show desktop
  lofi: { playing: boolean; idx: number; vol: number; muted: boolean; t: number; dur: number }
}

export function prefersReduced() {
  if (typeof document === 'undefined') return false
  const m = document.documentElement.dataset.motion
  if (m === 'reduce') return true
  if (m === 'full') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

const EMPTY_SPOTIFY: Spotify = { isPlaying: false, nowPlaying: null, recentTracks: [], topTracks: [], loaded: false }

export function placeWin(id: WinId, vw: number, vh: number, index: number, z: number, origin?: { x: number; y: number }): Win {
  const d = defById(id)
  const availH = vh - MENU_H - 70
  const w = Math.min(d.w, vw - 200)
  const h = Math.min(d.h, availH)
  const term = id === 'terminal'
  const cx = term ? vw - w - 28 : 136 + 28 * (index % 6)
  const x = Math.max(8, Math.min(vw - w - 8, cx))
  const y = term ? Math.max(MENU_H, vh - h - 84) : Math.max(MENU_H, Math.min(vh - h - 70, MENU_H + 10 + 26 * (index % 6)))
  return { id, x, y, w, h, z, min: false, max: false, snap: null, origin: origin ?? { x: 60, y: vh / 2 } }
}

export function createStore(initialPath: string) {
  const start = defByPath(initialPath)?.id ?? 'welcome'
  let state: State = {
    phase: 'desktop', off: 'shutdown', booted: true, user: 'kimani', theme: 'light',
    wins: [placeWin(start, 1440, 900, 0, 1)], zTop: 1,
    icons: {}, sel: [], wallpaper: 0, overlay: null, ctx: null, menu: null, toast: null,
    vw: 1440, vh: 900, mobile: null, snapPreview: null, spotify: EMPTY_SPOTIFY, settle: false, focusReq: null, lastPt: null,
    motion: 'system', blogPath: initialPath.startsWith('/blog') ? initialPath : '/blog', widgetOn: true, sd: [], lofi: { playing: false, idx: 0, vol: 0.35, muted: false, t: 0, dur: 0 },
  }
  const subs = new Set<() => void>()
  let lastPushed = initialPath
  let toastId = 0

  const get = () => state
  const set = (patch: Partial<State> | ((s: State) => Partial<State>)) => {
    const p = typeof patch === 'function' ? patch(state) : patch
    state = { ...state, ...p }
    subs.forEach((f) => f())
  }
  const subscribe = (f: () => void) => { subs.add(f); return () => { subs.delete(f) } }

  const topVisible = (ws: Win[]) => [...ws].filter((w) => !w.min).sort((a, b) => b.z - a.z)[0]
  const push = (path: string) => {
    if (typeof window === 'undefined' || window.location.pathname === path) return
    lastPushed = path
    window.history.pushState(null, '', path)
  }
  const idPath = (id: WinId) => (id === 'browser' ? state.blogPath : defById(id).path)
  const pathFor = (w?: Win) => (w ? idPath(w.id) : '/')

  const iconOrigin = (id: WinId, from?: { x: number; y: number }) => {
    if (from) return from
    const lp = state.lastPt
    if (lp && Date.now() - lp.t < 700 && lp.y < state.vh - 8) return { x: lp.x, y: lp.y }
    const el = typeof document !== 'undefined' ? document.querySelector<HTMLElement>(`[data-icon="${id}"]`) : null
    if (el) { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 } }
    return { x: 80, y: state.vh / 2 }
  }

  /* ---------- lo-fi: one <audio> owned by the store, so it keeps playing with the panel closed ---------- */
  let audio: HTMLAudioElement | null = null
  let fadeTimer: ReturnType<typeof setInterval> | null = null
  let gestured = false
  let errCount = 0
  let lastT = 0
  const readPref = (): { state?: string; vol?: number; muted?: boolean; idx?: number } => { try { return JSON.parse(localStorage.getItem('kos_lofi') || '{}') } catch { return {} } }
  const savePref = (p: object) => { try { localStorage.setItem('kos_lofi', JSON.stringify({ ...readPref(), ...p })) } catch { /* */ } }
  const setLofi = (p: Partial<State['lofi']>) => set((s) => ({ lofi: { ...s.lofi, ...p } }))
  const stopFade = () => { if (fadeTimer) { clearInterval(fadeTimer); fadeTimer = null } }
  const ensureAudio = () => {
    if (audio || typeof window === 'undefined') return audio
    audio = new Audio()
    audio.preload = 'none'
    audio.addEventListener('play', () => setLofi({ playing: true }))
    audio.addEventListener('pause', () => setLofi({ playing: false }))
    audio.addEventListener('loadedmetadata', () => setLofi({ dur: audio!.duration || 0 }))
    audio.addEventListener('timeupdate', () => { const n = Date.now(); if (n - lastT > 240) { lastT = n; setLofi({ t: audio!.currentTime, dur: audio!.duration || 0 }) } })
    audio.addEventListener('ended', () => { errCount = 0; actions.lofiNext(true) })
    audio.addEventListener('error', () => { if (++errCount < LOFI.length) actions.lofiNext(true) })
    ;(window as unknown as { kosAudio?: HTMLAudioElement }).kosAudio = audio
    return audio
  }
  const loadTrack = (i: number) => {
    const a = ensureAudio(); if (!a) return
    const idx = ((i % LOFI.length) + LOFI.length) % LOFI.length
    a.src = LOFI[idx].src
    setLofi({ idx, t: 0, dur: 0 })
    savePref({ idx })
  }

  const actions = {
    lofiInit() {
      const p = readPref()
      const vol = typeof p.vol === 'number' ? Math.max(0, Math.min(1, p.vol)) : 0.35
      setLofi({ vol, muted: !!p.muted, idx: typeof p.idx === 'number' ? p.idx % LOFI.length : 0 })
      const a = ensureAudio(); if (a) { a.volume = vol; a.muted = !!p.muted }
    },
    lofiPlay(fade = false) {
      const a = ensureAudio(); if (!a) return
      const l = state.lofi
      if (!a.src || !a.src.endsWith(LOFI[l.idx].src)) loadTrack(l.idx)
      a.muted = l.muted
      stopFade()
      const target = l.vol
      if (fade) a.volume = 0; else a.volume = target
      savePref({ state: 'playing' })
      a.play().then(() => {
        if (!fade) return
        const t0 = Date.now()
        fadeTimer = setInterval(() => {
          const p = Math.min(1, (Date.now() - t0) / 2000)
          a.volume = target * p
          if (p >= 1) stopFade()
        }, 60)
      }).catch(() => { gestured = false /* blocked: retry on the next gesture */ })
    },
    lofiPause() { stopFade(); audio?.pause(); savePref({ state: 'paused' }) },
    lofiToggle() { if (state.lofi.playing) actions.lofiPause(); else actions.lofiPlay() },
    lofiNext(auto = false) { const was = state.lofi.playing || auto; loadTrack(state.lofi.idx + 1); if (was) actions.lofiPlay() },
    lofiPrev() { const was = state.lofi.playing; if (audio && audio.currentTime > 4) { audio.currentTime = 0; return } loadTrack(state.lofi.idx - 1); if (was) actions.lofiPlay() },
    lofiSelect(i: number) { loadTrack(i); actions.lofiPlay() },
    lofiSeek(f: number) { if (audio && audio.duration) { audio.currentTime = Math.max(0, Math.min(1, f)) * audio.duration; setLofi({ t: audio.currentTime }) } },
    lofiVol(v: number) {
      stopFade()
      const vol = Math.max(0, Math.min(1, v))
      if (audio) { audio.volume = vol; if (vol > 0) audio.muted = false }
      setLofi({ vol, muted: vol === 0 ? state.lofi.muted : false })
      savePref({ vol, muted: vol === 0 ? state.lofi.muted : false })
    },
    lofiMute() {
      const muted = !state.lofi.muted
      stopFade()
      if (audio) { audio.muted = muted; if (!muted) audio.volume = state.lofi.vol }
      setLofi({ muted }); savePref({ muted })
    },
    /** First real gesture after boot (Enter, y, click) or login: start the music unless the visitor paused it before. */
    lofiGesture() {
      if (gestured) return
      gestured = true
      if (readPref().state === 'paused') return
      actions.lofiPlay(true)
    },
    setBlogPath(p: string) { if (p === state.blogPath) return; set({ blogPath: p }); if (topVisible(state.wins)?.id === 'browser') push(p) },
    setWallpaper(n: number) { set({ wallpaper: n }); try { localStorage.setItem('kos_wall', String(n)) } catch { /* */ } },
    setMotion(m: 'system' | 'reduce' | 'full') { set({ motion: m }); try { localStorage.setItem('kos_motion', m) } catch { /* */ } },
    setWidgetOn(v: boolean) { set({ widgetOn: v }); try { localStorage.setItem('kos_wdgon', v ? '1' : '0') } catch { /* */ } },
    showDesktop() {
      const vis = state.wins.filter((w) => !w.min)
      if (vis.length) {
        const wins = state.wins.map((w) => {
          if (w.min) return w
          const el = document.querySelector<HTMLElement>(`[data-dock="${w.id}"]`)
          const r = el?.getBoundingClientRect()
          return { ...w, min: true, origin: r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : { x: state.vw / 2, y: state.vh } }
        })
        set({ wins, sd: vis.map((w) => w.id), menu: null, overlay: null })
        push('/')
      } else if (state.wins.length) {
        const ids = state.sd.length ? state.sd : state.wins.map((w) => w.id)
        const wins = state.wins.map((w) => (ids.includes(w.id) ? { ...w, min: false } : w))
        set({ wins, sd: [], menu: null, overlay: null })
        push(pathFor(topVisible(wins)))
      }
    },
    open(id: WinId, from?: { x: number; y: number }, opts: { focus?: boolean } = {}) {
      if (state.mobile) { set({ wins: [placeWin(id, state.vw, state.vh, 0, 1)], menu: null }); push(idPath(id)); return }
      const z = state.zTop + 1
      const exists = state.wins.some((w) => w.id === id)
      const origin = iconOrigin(id, from)
      if (state.sd.length) set({ sd: [] })
      set((s) => ({
        zTop: z, menu: null, overlay: s.overlay === 'palette' || s.overlay === 'ctx' ? null : s.overlay,
        focusReq: opts.focus === false ? null : id,
        wins: exists
          ? s.wins.map((w) => (w.id === id ? { ...w, z, min: false } : w))
          : [...s.wins, placeWin(id, s.vw, s.vh, s.wins.length, z, origin)],
      }))
      push(idPath(id))
    },
    focus(id: WinId) {
      if (state.sd.length) set({ sd: [] })
      const cur = topVisible(state.wins)
      if (cur && cur.id === id) return
      const z = state.zTop + 1
      set((s) => ({ zTop: z, wins: s.wins.map((w) => (w.id === id ? { ...w, z, min: false } : w)) }))
      push(idPath(id))
    },
    close(id: WinId) {
      const rest = state.wins.filter((w) => w.id !== id)
      if (state.mobile) { set({ wins: [] }); push('/'); return }
      set({ wins: rest })
      push(pathFor(topVisible(rest)))
    },
    minimise(id: WinId) {
      const dock = typeof document !== 'undefined' ? document.querySelector<HTMLElement>(`[data-dock="${id}"]`) : null
      const r = dock?.getBoundingClientRect()
      const origin = r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : { x: state.vw / 2, y: state.vh }
      const wins = state.wins.map((w) => (w.id === id ? { ...w, min: true, origin } : w))
      set({ wins })
      push(pathFor(topVisible(wins)))
    },
    toggleMax(id: WinId) {
      set((s) => ({
        wins: s.wins.map((w) => {
          if (w.id !== id) return w
          if (w.max || w.snap) return { ...w, max: false, snap: null, ...(w.prev ?? {}), prev: undefined }
          return { ...w, max: true, prev: { x: w.x, y: w.y, w: w.w, h: w.h } }
        }),
      }))
    },
    snap(id: WinId, side: 'l' | 'r' | 't' | null) {
      set((s) => ({
        snapPreview: null,
        wins: s.wins.map((w) => {
          if (w.id !== id) return w
          if (!side) return w
          if (side === 't') return { ...w, max: true, snap: null, prev: w.prev ?? { x: w.x, y: w.y, w: w.w, h: w.h } }
          return { ...w, snap: side, max: false, prev: w.prev ?? { x: w.x, y: w.y, w: w.w, h: w.h } }
        }),
      }))
    },
    setRect(id: WinId, r: Partial<Pick<Win, 'x' | 'y' | 'w' | 'h'>>, unsnap = false) {
      set((s) => ({
        wins: s.wins.map((w) => (w.id === id ? { ...w, ...r, ...(unsnap ? { snap: null, max: false, prev: undefined } : {}) } : w)),
      }))
    },
    closeAll() { set({ wins: [] }); push('/') },
    toast(msg: string, title?: string) {
      const id = ++toastId
      set({ toast: { id, msg, title } })
      setTimeout(() => { if (state.toast?.id === id) set({ toast: null }) }, 6000)
    },
    setTheme(t: 'light' | 'dark') {
      set({ theme: t })
      try {
        const r = document.documentElement
        r.setAttribute('data-theme', t); r.style.colorScheme = t
        localStorage.setItem('kos_theme', t)
      } catch { /* */ }
    },
    toggleTheme() { actions.setTheme(state.theme === 'dark' ? 'light' : 'dark') },
    cycleWallpaper() {
      const n = (state.wallpaper + 1) % 3
      set({ wallpaper: n })
      try { localStorage.setItem('kos_wall', String(n)) } catch { /* */ }
    },
    setIcon(id: string, x: number, y: number) {
      const icons = { ...state.icons, [id]: { x, y } }
      set({ icons })
      try { localStorage.setItem('kos_icons', JSON.stringify(icons)) } catch { /* */ }
    },
    sortIcons() {
      set({ icons: {} })
      try { localStorage.removeItem('kos_icons') } catch { /* */ }
    },
    login(user: string) {
      actions.lofiGesture()
      try { sessionStorage.setItem('kos_user', user) } catch { /* */ }
      set({ user, phase: 'desktop', settle: true })
      if (!state.mobile) {
        if (!state.wins.some((w) => w.id === 'welcome')) actions.open('welcome', { x: 60, y: 120 }, { focus: false })
        if (!state.wins.some((w) => w.id === 'terminal')) actions.open('terminal', { x: 60, y: state.vh - 130 }, { focus: false })
        push('/')
      }
      setTimeout(() => set({ settle: false }), 1800)
      setTimeout(() => actions.toast('Just one engineer and a lot of coffee. Press ? for shortcuts.', 'No cookies here.'), 1600)
    },
    logout() {
      try { sessionStorage.removeItem('kos_user') } catch { /* */ }
      set({ user: null, phase: 'login', wins: [], overlay: null, menu: null })
      push('/')
    },
    shutdown() {
      try { sessionStorage.removeItem('kos_user'); sessionStorage.removeItem('kos_booted') } catch { /* */ }
      set({ phase: 'off', off: 'shutdown', user: null, wins: [], overlay: null, menu: null })
      push('/')
    },
    restart() {
      try { sessionStorage.removeItem('kos_user'); sessionStorage.removeItem('kos_booted') } catch { /* */ }
      set({ phase: 'off', off: 'restart', user: null, wins: [], overlay: null, menu: null })
      push('/')
      setTimeout(() => set({ phase: 'boot' }), 1100)
    },
    powerOn() { set({ phase: 'boot' }) },
    finishBoot() {
      try { sessionStorage.setItem('kos_booted', '1') } catch { /* */ }
      set({ phase: 'login', booted: true })
    },
    external(path: string) { // URL changed without us (Back / Forward)
      if (path === lastPushed) return
      lastPushed = path
      const d = defByPath(path)
      if (!d) return
      const prev = topVisible(state.wins)
      const exists = state.wins.some((w) => w.id === d.id)
      const z = state.zTop + 1
      set((s) => {
        let wins = exists ? s.wins.map((w) => (w.id === d.id ? { ...w, z, min: false } : w)) : [...s.wins, placeWin(d.id, s.vw, s.vh, s.wins.length, z)]
        if (exists && prev && prev.id !== d.id) wins = wins.filter((w) => w.id !== prev.id)
        return { wins, zTop: z }
      })
    },
  }
  return { get, set, subscribe, actions }
}

export type Store = ReturnType<typeof createStore>
const Ctx = createContext<Store | null>(null)
export const StoreProvider = Ctx.Provider
export const useStoreRef = () => useContext(Ctx)!
export function useOS<T>(sel: (s: State) => T): T {
  const st = useContext(Ctx)!
  const last = useRef<{ s: State; v: T } | null>(null)
  const snap = () => {
    const s = st.get()
    if (last.current && last.current.s === s) return last.current.v
    const v = sel(s)
    if (last.current && Object.is(last.current.v, v)) { last.current.s = s; return last.current.v }
    last.current = { s, v }
    return v
  }
  return useSyncExternalStore(st.subscribe, snap, snap)
}
export const useOSActions = () => { const s = useContext(Ctx)!; return useMemo(() => ({ ...s.actions, set: s.set }), [s]) }
export { DEFS, ICON_IDS }

/** Reduce-motion: the control-panel override wins, otherwise the OS setting. */
export function useReduced() {
  const m = useOS((s) => s.motion)
  const [sys, setSys] = useState(false)
  useEffect(() => {
    const q = window.matchMedia('(prefers-reduced-motion: reduce)')
    setSys(q.matches)
    const f = () => setSys(q.matches)
    q.addEventListener('change', f)
    return () => q.removeEventListener('change', f)
  }, [])
  return m === 'reduce' || (m === 'system' && sys)
}
