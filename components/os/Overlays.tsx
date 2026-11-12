'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useOS, useOSActions, useStoreRef, useReduced } from './store'
import { LOFI } from './lofi'
import Logo from './Logo'
import { Eq } from './SpotifyWidget'
import { cases, EMAIL } from '@/lib/content'
import { DEFS, type WinId } from './routes'

/* ---------- command palette ---------- */
type Cmd = { label: string; hint: string; run: () => void }

export function Palette() {
  const a = useOSActions()
  const theme = useOS((s) => s.theme)
  const [q, setQ] = useState('')
  const [i, setI] = useState(0)
  const input = useRef<HTMLInputElement>(null)
  useEffect(() => { input.current?.focus() }, [])
  const close = () => a.set({ overlay: null })
  const all: Cmd[] = useMemo(() => [
    ...DEFS.filter((d) => d.icon).map((d): Cmd => ({ label: `Open ${d.label}`, hint: 'app', run: () => a.open(d.id as WinId) })),
    ...cases.map((c): Cmd => ({ label: `Case file: ${c.name}`, hint: 'work', run: () => a.open(`case:${c.slug}`) })),
    { label: 'Hire me: email Kimani', hint: 'command', run: () => { window.location.href = `mailto:${EMAIL}?subject=Freelance%20build` } },
    { label: `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`, hint: 'command · M', run: a.toggleTheme },
    { label: 'Change wallpaper', hint: 'command', run: a.cycleWallpaper },
    { label: 'Sort desktop icons', hint: 'command', run: a.sortIcons },
    { label: 'Keyboard shortcuts', hint: 'help · ?', run: () => a.set({ overlay: 'shortcuts' }) },
    { label: 'About this site', hint: 'help', run: () => a.set({ overlay: 'about' }) },
    { label: 'Control panel', hint: 'system', run: () => a.set({ overlay: 'control' }) },
    { label: 'Show desktop', hint: 'command · F11', run: a.showDesktop },
    { label: 'Close all windows', hint: 'command', run: a.closeAll },
    { label: 'Enter sleep', hint: 'system', run: () => a.set({ overlay: 'saver' }) },
    { label: 'Lo-fi: play or pause', hint: 'music', run: a.lofiToggle },
    { label: 'Restart', hint: 'system', run: a.restart },
    { label: 'Log out', hint: 'system', run: a.logout },
    { label: 'Shut down', hint: 'system', run: a.shutdown },
  ], [a, theme])
  const res = all.filter((c) => (c.label + ' ' + c.hint).toLowerCase().includes(q.toLowerCase()))
  const run = (c?: Cmd) => { if (!c) return; a.set({ overlay: null }); c.run() }
  return (
    <div className="scrim" onPointerDown={(e) => { if (e.target === e.currentTarget) close() }}>
      <div className="palette" role="dialog" aria-label="Command palette"
        onKeyDown={(e) => {
          if (e.key === 'Escape') { e.stopPropagation(); close() }
          else if (e.key === 'ArrowDown') { e.preventDefault(); setI((x) => Math.min(res.length - 1, x + 1)) }
          else if (e.key === 'ArrowUp') { e.preventDefault(); setI((x) => Math.max(0, x - 1)) }
          else if (e.key === 'Enter') run(res[i])
        }}>
        <input ref={input} value={q} onChange={(e) => { setQ(e.target.value); setI(0) }} placeholder="Search apps, case files, commands…" aria-label="Search" />
        <ul role="listbox">
          {res.slice(0, 9).map((c, n) => (
            <li key={c.label} role="option" aria-selected={n === i}>
              <button type="button" className={n === i ? 'on' : ''} onMouseEnter={() => setI(n)} onClick={() => run(c)}><span>{c.label}</span><span className="mono">{c.hint}</span></button>
            </li>
          ))}
          {!res.length && <li className="none">nothing matches “{q}”. try “work”.</li>}
        </ul>
      </div>
    </div>
  )
}

/* ---------- shortcuts ---------- */
export function Shortcuts() {
  const a = useOSActions()
  const rows: [string[], string][] = [
    [['⌘', 'K'], 'Command palette'], [['/'], 'Search'], [['?'], 'This sheet'], [['M'], 'Toggle theme'],
    [['F11'], 'Show desktop (or ⌘ F3)'], [['Shift', 'W'], 'Close focused window'], [['Esc'], 'Close menus and dialogs'], [['Enter'], 'Open the selected icon'],
    [['dbl-click'], 'Maximise a window / open an icon'], [['drag to edge'], 'Snap a window to a half'],
  ]
  return (
    <div className="scrim" onPointerDown={(e) => { if (e.target === e.currentTarget) a.set({ overlay: null }) }}>
      <div className="card-modal" role="dialog" aria-label="Keyboard shortcuts">
        <h2>Shortcuts</h2>
        <dl>{rows.map(([k, d]) => <div key={d}><dt>{k.map((x) => <kbd className="kbd" key={x}>{x}</kbd>)}</dt><dd>{d}</dd></div>)}</dl>
        <button type="button" className="btn k sm" autoFocus onClick={() => a.set({ overlay: null })}>Got it</button>
      </div>
    </div>
  )
}

/* ---------- about ---------- */
export function About() {
  const a = useOSActions()
  return (
    <div className="scrim" onPointerDown={(e) => { if (e.target === e.currentTarget) a.set({ overlay: null }) }}>
      <div className="card-modal about" role="dialog" aria-label="About kimaniOS">
        <div className="mark"><Logo size={64} title="kimani.os" /></div>
        <h2>kimaniOS</h2>
        <p className="mono ver">Version 1.0 · Kingston build · Nov 2026</p>
        <p className="mono built"><b>built with</b><br />Next.js · Geist · motion<br />too much coffee</p>
        <button type="button" className="btn k sm" autoFocus onClick={() => a.set({ overlay: null })}>OK</button>
      </div>
    </div>
  )
}

/* ---------- empty trash dialog ---------- */
export function EmptyTrash() {
  const a = useOSActions()
  return (
    <div className="scrim" onPointerDown={(e) => { if (e.target === e.currentTarget) a.set({ overlay: null }) }}>
      <div className="card-modal" role="alertdialog" aria-label="Empty Trash">
        <h2>Empty the trash?</h2>
        <p>It&apos;s 3 items and one old portfolio with feelings. This can&apos;t be undone (probably).</p>
        <div className="row">
          <button type="button" className="btn sm" autoFocus onClick={() => a.set({ overlay: null })}>Cancel</button>
          <button type="button" className="btn k sm" onClick={() => { a.set({ overlay: null }); a.toast("it grew back. the trash can't be emptied, it has sentimental value.", 'Nope.') }}>Empty</button>
        </div>
      </div>
    </div>
  )
}

/* ---------- context menu ---------- */
export function ContextMenu() {
  const a = useOSActions()
  const pos = useOS((s) => s.ctx)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => { ref.current?.querySelector<HTMLElement>('button')?.focus() }, [])
  if (!pos) return null
  const close = () => a.set({ overlay: null, ctx: null })
  const items: [string, () => void][] = [
    ['New Folder', () => a.toast('disk is full of Cite. try again after the next deploy.', 'New Folder')],
    ['Change wallpaper', a.cycleWallpaper],
    ['Sort icons', a.sortIcons],
    ['Open terminal', () => a.open('terminal')],
    ['Show desktop', a.showDesktop],
    ['Close all windows', a.closeAll],
    ['Enter sleep', () => a.set({ overlay: 'saver' })],
    ['About this site', () => a.set({ overlay: 'about' })],
  ]
  return (
    <div className="scrim clear" onPointerDown={(e) => { if (e.target === e.currentTarget) close() }} onContextMenu={(e) => { e.preventDefault(); close() }}>
      <div ref={ref} className="ctx" role="menu" style={{ left: Math.min(pos.x, window.innerWidth - 220), top: Math.min(pos.y, window.innerHeight - 290) }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') close()
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault()
            const b = Array.from(ref.current!.querySelectorAll<HTMLElement>('button')); const c = b.indexOf(document.activeElement as HTMLElement)
            b[(c + (e.key === 'ArrowDown' ? 1 : b.length - 1)) % b.length].focus()
          }
        }}>
        {items.map(([l, f]) => <button key={l} role="menuitem" type="button" onClick={() => { a.set({ overlay: null, ctx: null }); f() }}>{l}</button>)}
      </div>
    </div>
  )
}

/* ---------- calendar ---------- */
export function Calendar() {
  const a = useOSActions()
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Jamaica' }))
  const y = now.getFullYear(), m = now.getMonth()
  const first = new Date(y, m, 1).getDay()
  const days = new Date(y, m + 1, 0).getDate()
  const cells = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)]
  return (
    <div className="scrim clear" onPointerDown={(e) => { if (e.target === e.currentTarget) a.set({ overlay: null }) }}>
      <div className="cal" role="dialog" aria-label="Calendar" onKeyDown={(e) => { if (e.key === 'Escape') a.set({ overlay: null }) }}>
        <p className="mono">{now.toLocaleString('en-US', { month: 'long', year: 'numeric' })}</p>
        <div className="grid">{['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <span key={i} className="dn">{d}</span>)}{cells.map((c, i) => <span key={i} className={c === now.getDate() ? 'today' : ''}>{c}</span>)}</div>
      </div>
    </div>
  )
}

/* ---------- toast ---------- */
export function Toast() {
  const t = useOS((s) => s.toast)
  if (!t) return null
  return (
    <div className="toast" role="status" key={t.id}>
      {t.title && <b>{t.title}</b>}{t.msg}
    </div>
  )
}

/* ---------- matrix rain cameo (the only place rain lives) ---------- */
export function Rain() {
  const a = useOSActions()
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const c = ref.current!, ctx = c.getContext('2d')!
    c.width = window.innerWidth; c.height = window.innerHeight
    const size = 16, cols = Math.ceil(c.width / size)
    const drops = Array.from({ length: cols }, () => Math.random() * -30)
    const chars = '01$#@%&*+=<>/{}[]:;~'
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0, last = 0
    const t0 = performance.now()
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop)
      if (t - last < 45) return
      last = t
      ctx.fillStyle = 'rgba(0,0,0,0.1)'; ctx.fillRect(0, 0, c.width, c.height)
      ctx.fillStyle = '#22ff66'; ctx.font = '13px ui-monospace, monospace'
      for (let i = 0; i < cols; i++) {
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * size, drops[i] * size)
        if (drops[i] * size > c.height && Math.random() > 0.96) drops[i] = 0
        drops[i]++
      }
      if (t - t0 > 3000) a.set({ overlay: null })
    }
    if (reduce) { const tm = setTimeout(() => a.set({ overlay: null }), 1200); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, c.width, c.height); return () => clearTimeout(tm) }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [a])
  return (
    <div className="rain" onPointerDown={() => a.set({ overlay: null })}>
      <canvas ref={ref} />
      <p className="mono">old-portfolio-matrix-rain/ · rest in peace</p>
    </div>
  )
}

/* ---------- konami ---------- */
export function Konami() {
  const a = useOSActions()
  useEffect(() => { const t = setTimeout(() => a.set({ overlay: null }), 3600); return () => clearTimeout(t) }, [a])
  const stamps = ['plan-1745', 'tram', 'clocktower', 'market', 'menu', 'speakers', 'counter', 'flyer', 'harbour-1903', 'king-street', 'map-1798', 'stub']
  return (
    <div className="konami" aria-hidden>
      {Array.from({ length: 22 }, (_, i) => (
        <span key={i} className="kst" style={{ left: `${(i * 37) % 96}%`, animationDelay: `${(i % 7) * 0.18}s`, ['--rot' as string]: `${(i * 53) % 40 - 20}deg`, backgroundImage: `url(/os/${stamps[i % stamps.length]}.webp)` }} />
      ))}
      <p className="mono">+30 lives. you found the stamp rain.</p>
    </div>
  )
}

/* ---------- sleep screen: a paper flip clock ---------- */
const LINES = [
  'kimani is probably shipping something.',
  'the pen test passed. the coffee is at 87%.',
  'somewhere, a cron job is running on time.',
  'postgres is warm. it is always warm.',
  'no cookies here. just paper.',
  'back soon. the dock is only resting.',
]

/** One paper card with a split-flap half-flip when its text changes. */
function FlipCard({ text, small }: { text: string; small?: boolean }) {
  const [old, setOld] = useState(text)
  const [go, setGo] = useState(false)
  useEffect(() => {
    if (text === old) return
    setGo(true)
    const id = setTimeout(() => { setOld(text); setGo(false) }, 760)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])
  return (
    <div className={`flip${small ? ' sm' : ''}${go ? ' go' : ''}`} aria-hidden>
      <div className="fh t"><span>{text}</span></div>
      <div className="fh b"><span>{go ? old : text}</span></div>
      {go && <div className="fh t ft"><span>{old}</span></div>}
      {go && <div className="fh b fb"><span>{text}</span></div>}
    </div>
  )
}

export function Screensaver({ wallpaper }: { wallpaper: number }) {
  void wallpaper
  const store = useStoreRef()
  const lofi = useOS((s) => s.lofi)
  const reduced = useReduced()
  const [now, setNow] = useState<Date | null>(null)
  const [off, setOff] = useState(0)
  const [line, setLine] = useState(0)
  const [out, setOut] = useState(false)

  useEffect(() => {
    const tick = () => setNow(new Date(Date.now() + off))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [off])
  useEffect(() => { const id = setInterval(() => setLine((l) => (l + 1) % LINES.length), 7000); return () => clearInterval(id) }, [])
  // dev hook: force a minute flip (window.kosFlip() or ?flip=<ms>)
  useEffect(() => {
    const flip = () => setOff((o) => o + 60000)
    ;(window as unknown as { kosFlip?: () => void }).kosFlip = flip
    const q = new URLSearchParams(window.location.search).get('flip')
    const id = q ? setTimeout(flip, Number(q) || 1200) : undefined
    return () => { if (id) clearTimeout(id) }
  }, [])

  // any motion or key wakes it, with a fade
  useEffect(() => {
    let armed = false
    const wake = () => {
      if (!armed) return
      setOut(true)
      setTimeout(() => store.set({ overlay: null }), reduced ? 10 : 560)
    }
    const arm = setTimeout(() => { armed = true }, 700)
    let moved = 0
    const mv = (e: PointerEvent) => { moved += Math.abs(e.movementX) + Math.abs(e.movementY); if (moved > 6) wake() }
    window.addEventListener('pointermove', mv); window.addEventListener('keydown', wake); window.addEventListener('pointerdown', wake); window.addEventListener('wheel', wake)
    return () => { clearTimeout(arm); window.removeEventListener('pointermove', mv); window.removeEventListener('keydown', wake); window.removeEventListener('pointerdown', wake); window.removeEventListener('wheel', wake) }
  }, [store, reduced])

  const d = now ?? new Date()
  const parts = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'America/Jamaica' }).formatToParts(d)
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? ''
  const hh = get('hour').padStart(2, '0'), mm = get('minute'), ap = get('dayPeriod').toUpperCase()
  const day = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'America/Jamaica' }).format(d)

  return (
    <div className={`saver${out ? ' out' : ''}`} role="presentation">
      <div className="fc-grain" />
      <div className="fc">
        <p className="fc-day mono" suppressHydrationWarning>{day}</p>
        <div className="fc-row" aria-label={`${hh}:${mm} ${ap}`}>
          <FlipCard text={hh} />
          <div className="fc-colon" aria-hidden><i /><i /></div>
          <FlipCard text={mm} />
          <div className="fc-ampm"><FlipCard text={ap} small /></div>
        </div>
        {lofi.playing
          ? <p className="fc-line mono"><Eq /> lo-fi · {LOFI[lofi.idx].title}, HoliznaCC0</p>
          : <p key={line} className="fc-line j">{LINES[line]}</p>}
      </div>
    </div>
  )
}
