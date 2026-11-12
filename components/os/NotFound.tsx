'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Wallpaper from './Wallpaper'
import TerminalView from './apps/Terminal'
import { DEFS } from './routes'

export default function NotFoundTerminal() {
  const pathname = usePathname()
  const [theme, setThemeState] = useState<'light' | 'dark'>('light')
  useEffect(() => { setThemeState((document.documentElement.getAttribute('data-theme') as 'light' | 'dark') || 'light') }, [])
  const setTheme = (t: 'light' | 'dark') => { setThemeState(t); document.documentElement.setAttribute('data-theme', t); try { localStorage.setItem('kos_theme', t) } catch { /* */ } }
  return (
    <div className="os nf">
      <Wallpaper variant={1} />
      <main className="nf-in">
        <p className="mono k-label">error 404</p>
        <h1>command not found<span className="cur">_</span></h1>
        <section className="win static" aria-label="terminal">
          <div className="tb"><span className="dots"><i className="dot c" /><i className="dot m" /><i className="dot x" /></span><span className="t">terminal — lost</span></div>
          <TerminalView page host={{
            theme, setTheme,
            exit: () => { window.location.assign('/') },
            open: (id) => { const d = DEFS.find((x) => x.id === id); window.location.assign(d ? d.path : '/') },
          }} banner={[`kimsh: ${pathname}: no such file or directory`, 'try ls, open work, or exit to go home.']} />
        </section>
      </main>
    </div>
  )
}
