'use client'
import { useEffect, useState } from 'react'
import { useOS, useOSActions } from './store'
import { DEFS, defById } from './routes'
import { Stamp } from './Stamp'
import { appFor } from './appmap'
import SpotifyWidget, { Eq } from './SpotifyWidget'
import { IcSliders } from './ControlPanel'
import Logo from './Logo'

export default function Mobile() {
  const a = useOSActions()
  const wins = useOS((s) => s.wins)
  const theme = useOS((s) => s.theme)
  const playing = useOS((s) => s.lofi.playing)
  const cur = wins[0]?.id
  const [time, setTime] = useState('')
  useEffect(() => {
    const f = () => setTime(new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/Jamaica' }).format(new Date()))
    f(); const id = setInterval(f, 15000); return () => clearInterval(id)
  }, [])
  const icons = DEFS.filter((d) => d.icon)
  return (
    <div className="mob">
      <header className="mbar"><Logo size={22} title="kimani.os" /><span suppressHydrationWarning>{time}</span>
        <span className="mbar-r">
          {playing && <button type="button" onClick={() => a.lofiToggle()} aria-label="Pause lo-fi"><Eq /></button>}
          <button type="button" data-cp-btn onClick={() => a.set({ overlay: 'control' })} aria-label="Control panel"><IcSliders /></button>
        </span>
        <button type="button" onClick={a.toggleTheme} aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}>{theme === 'dark' ? '☀' : '☾'}</button></header>
      <div className="mhome">
        <h1>hey, kimani here<span className="cur">_</span></h1>
        <p>software engineer in kingston, jamaica. building production systems end to end.</p>
        <SpotifyWidget compact />
        <ul className="micons">
          {icons.map((d) => (
            <li key={d.id}>
              <button type="button" data-icon={d.id} onClick={() => a.open(d.id)}>
                <Stamp src={d.stamp} />
                <span className="lbl">{d.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      {cur && (
        <section className="msheet" role="dialog" aria-label={defById(cur).title}>
          <div className="mtop"><button type="button" onClick={() => a.close(cur)}>‹ home</button><span className="mono">~/{defById(cur).title}</span></div>
          <div className="mbody">{appFor(cur, { page: false })}</div>
        </section>
      )}
    </div>
  )
}
