'use client'
import { useEffect, useRef, useState } from 'react'
import { useOS, useOSActions, useStoreRef } from './store'
import { cases, EMAIL, LINKEDIN, GITHUB } from '@/lib/content'
import { Eq } from './SpotifyWidget'
import { IcSliders, IcDesk } from './ControlPanel'
import Logo from './Logo'

type Item = { label: string; run?: () => void; href?: string; kbd?: string; check?: boolean; sep?: boolean }

export default function MenuBar() {
  const a = useOSActions()
  const store = useStoreRef()
  const menu = useOS((s) => s.menu)
  const theme = useOS((s) => s.theme)
  const overlay = useOS((s) => s.overlay)
  const sp = useOS((s) => s.spotify)
  const playing = useOS((s) => s.lofi.playing)
  const [time, setTime] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const f = () => setTime(new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/Jamaica' }).format(new Date()))
    f()
    const id = setInterval(f, 15000)
    return () => clearInterval(id)
  }, [])

  const MENUS: { key: string; label: React.ReactNode; items: Item[] }[] = [
    { key: 'km', label: <Logo size={24} title="kimani.os" />, items: [
      { label: 'About this site', run: () => store.set({ overlay: 'about' }) },
      { label: 'Theme: Light', check: theme === 'light', run: () => a.setTheme('light'), kbd: 'M' },
      { label: 'Theme: Dark', check: theme === 'dark', run: () => a.setTheme('dark') },
      { label: '', sep: true },
      { label: 'Show desktop', run: () => a.showDesktop(), kbd: 'F11' },
      { label: 'Close all windows', run: () => a.closeAll() },
      { label: 'Enter sleep', run: () => store.set({ overlay: 'saver' }) },
      { label: '', sep: true },
      { label: 'Restart', run: () => a.restart() },
      { label: 'Log out', run: () => a.logout() },
      { label: 'Shut down', run: () => a.shutdown() },
    ] },
    { key: 'work', label: 'Work', items: [{ label: 'Open work/', run: () => a.open('work') }, { label: '', sep: true }, ...cases.map((c): Item => ({ label: `${c.name}`, run: () => a.open(`case:${c.slug}`) }))] },
    { key: 'exp', label: 'Experience', items: [{ label: 'Open experience log', run: () => a.open('experience') }, { label: 'Open resume.pdf', run: () => a.open('resume') }] },
    { key: 'free', label: 'Freelance', items: [{ label: 'Open freelance', run: () => a.open('freelance') }, { label: 'Hire me (email)', href: `mailto:${EMAIL}?subject=Freelance%20build` }] },
    { key: 'contact', label: 'Contact', items: [{ label: 'Open terminal', run: () => a.open('terminal') }, { label: 'Email', href: `mailto:${EMAIL}` }, { label: 'LinkedIn', href: LINKEDIN }, { label: 'GitHub', href: GITHUB }] },
  ]

  useEffect(() => {
    if (!menu) return
    const onDown = (e: PointerEvent) => { if (!ref.current?.contains(e.target as Node)) store.set({ menu: null }) }
    window.addEventListener('pointerdown', onDown)
    return () => window.removeEventListener('pointerdown', onDown)
  }, [menu, store])

  const keyNav = (e: React.KeyboardEvent, idx: number) => {
    const keys = MENUS.map((m) => m.key)
    if (e.key === 'ArrowRight') { store.set({ menu: keys[(idx + 1) % keys.length] }) }
    else if (e.key === 'ArrowLeft') { store.set({ menu: keys[(idx + keys.length - 1) % keys.length] }) }
    else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      const items = Array.from(ref.current?.querySelectorAll<HTMLElement>('[role=menuitem]') ?? [])
      const cur = items.indexOf(document.activeElement as HTMLElement)
      const n = e.key === 'ArrowDown' ? (cur + 1) % items.length : (cur + items.length - 1) % items.length
      items[n]?.focus()
    } else if (e.key === 'Escape') { store.set({ menu: null }); (ref.current?.querySelector('[aria-expanded=true]') as HTMLElement | null)?.focus() }
  }

  const np = sp.nowPlaying
  return (
    <header className="bar" ref={ref} role="menubar">
      {MENUS.map((m, i) => (
        <div key={m.key} className="mwrap" onKeyDown={(e) => keyNav(e, i)}>
          <button
            type="button" className={`mbtn${m.key === 'km' ? ' logo' : ''}${menu === m.key ? ' open' : ''}`} aria-haspopup="menu" aria-expanded={menu === m.key}
            onClick={() => store.set({ menu: menu === m.key ? null : m.key })}
            onPointerEnter={() => { if (menu && menu !== m.key) store.set({ menu: m.key }) }}
          >{m.label}</button>
          {menu === m.key && (
            <div className="dd" role="menu">
              {m.items.map((it, j) => it.sep ? <hr key={j} /> : it.href ? (
                <a key={j} role="menuitem" href={it.href} className="ddi" target={it.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" onClick={() => store.set({ menu: null })}>{it.label}</a>
              ) : (
                <button key={j} type="button" role="menuitem" className="ddi" onClick={() => { store.set({ menu: null }); it.run?.() }}>
                  <span>{it.check !== undefined ? (it.check ? '✓ ' : '   ') : ''}{it.label}</span>{it.kbd && <kbd className="kbd">{it.kbd}</kbd>}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
      <div className="r">
        {np && (
          <a className="np" href={np.songUrl} target="_blank" rel="noopener noreferrer" title={`${np.title}, ${np.artist}`}>
            {sp.isPlaying ? <Eq /> : <i />}<span className="trunc">{sp.isPlaying ? 'now playing' : 'last played'} · {np.title}</span>
          </a>
        )}
        {playing && (
          <button type="button" className="eqbtn" onClick={() => a.lofiToggle()} aria-label="Pause lo-fi" data-tip="Lo-fi playing. Click to pause"><Eq /></button>
        )}
        <button type="button" className="icobtn" data-cp-btn data-tip="Control panel" aria-label="Control panel" aria-expanded={overlay === 'control'}
          onClick={() => store.set({ overlay: overlay === 'control' ? null : 'control', menu: null })}><IcSliders /></button>
        <button type="button" className="icobtn" data-tip="Show desktop (F11)" aria-label="Show desktop" onClick={() => a.showDesktop()}><IcDesk /></button>
        <button type="button" className="clock" onClick={() => store.set({ overlay: store.get().overlay === 'cal' ? null : 'cal', menu: null })} aria-label="Calendar">
          <span suppressHydrationWarning>Kingston {time || '--:--'}</span>
        </button>
        <button type="button" className="kbtn" onClick={() => store.set({ overlay: 'palette' })} aria-label="Open command palette (Command K)"><kbd className="kbd">⌘</kbd> <kbd className="kbd">K</kbd></button>
        <button type="button" className="themebtn" onClick={a.toggleTheme} aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'} title="Theme (M)">
          {theme === 'dark'
            ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5" /></svg>
            : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 14.5A8 8 0 019.5 4 8 8 0 1020 14.5z" /></svg>}
        </button>
        <button type="button" className="cta" onClick={() => a.open('freelance')}>Hire me</button>
      </div>
    </header>
  )
}
