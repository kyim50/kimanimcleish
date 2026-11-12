'use client'
import { useRef, useState } from 'react'
import { useOSActions } from '../store'
import { bio, cases } from '@/lib/content'

const rect = (e: React.MouseEvent) => { const r = (e.currentTarget as HTMLElement).getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 } }

export default function Welcome() {
  const a = useOSActions()
  const [tab, setTab] = useState<'about' | 'work' | 'log' | 'hire'>('about')
  const scroller = useRef<HTMLDivElement>(null)
  const go = (id: string) => scroller.current?.querySelector(`#${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  const tabs: [typeof tab, string, string][] = [['about', '◐', 'About'], ['work', '▦', 'Work'], ['log', '☰', 'Log'], ['hire', '✦', 'Hire']]
  const pickTab = (t: typeof tab, e: React.MouseEvent) => {
    setTab(t)
    if (t === 'work') a.open('work', rect(e))
    if (t === 'log') a.open('experience', rect(e))
    if (t === 'hire') a.open('freelance', rect(e))
  }
  return (
    <div className="welcome">
      <aside className="side">
        <button type="button" className="search" onClick={() => a.set({ overlay: 'palette' })}><span>Search kimani…</span><kbd className="kbd">/</kbd></button>
        <div className="tabs" role="tablist">
          {tabs.map(([k, g, l]) => (
            <button key={k} type="button" role="tab" aria-selected={tab === k} className={`tab${tab === k ? ' on' : ''}`} onClick={(e) => pickTab(k, e)}><b>{g}</b>{l}</button>
          ))}
        </div>
        <nav className="toc" aria-label="Contents">
          <button type="button" className="on" onClick={() => go('hey')}>hey, kimani here</button>
          <button type="button" onClick={() => go('now')}>What I&apos;m doing now</button>
          <button type="button" onClick={() => go('selected')}>Selected work</button>
          <small>Case files</small>
          {cases.map((c) => (
            <button key={c.slug} type="button" onClick={(e) => a.open(`case:${c.slug}`, rect(e))}>{c.name} — {({ cite: 'live map', tabi: 'social game', swiftpay: 'payments', cardioscore: 'health', verro: 'art marketplace', vault: 'dev HUD' } as Record<string, string>)[c.slug]}</button>
          ))}
          <small>Elsewhere</small>
          <button type="button" onClick={(e) => a.open('experience', rect(e))}>Experience log</button>
          <button type="button" onClick={(e) => a.open('freelance', rect(e))}>Freelance builds</button>
          <button type="button" onClick={(e) => a.open('resume', rect(e))}>Résumé</button>
        </nav>
      </aside>
      <div className="content" ref={scroller}>
        <div className="photo"><img src="/os/kimani.webp" alt="Kimani McLeish on the rocks by the sea, Jamaica" width={523} height={646} /></div>
        <section id="hey">
          <div className="h1" role="heading" aria-level={2}><span className="ln">hey, kimani here.</span><span className="ln">I build production systems,</span><span className="ln"><span className="hl sweep">end to end.</span></span></div>
          <p className="lead">{bio.line1} Team lead at <span className="hl b">I.D.L.E. Creationz</span> and Sagicor Innovation Lab. Building Cite.</p>
        </section>
        <section id="now" className="now">
          <span className="k">leading</span><span>software team, I.D.L.E. Creationz</span>
          <span className="k">securing</span><span>14 AWS servers, Sagicor Innovation Lab</span>
          <span className="k">building</span><span>Cite, a live map of Kingston</span>
        </section>
        <section id="selected" className="cards">
          {cases.slice(0, 2).map((c, i) => (
            <button key={c.slug} type="button" className={`card vol${i ? ' t' : ''}`} onClick={(e) => a.open(`case:${c.slug}`, rect(e))}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <span className="shot"><img src={c.shots[0].src} alt="" loading="lazy" /></span>
              <span className="tx"><b>{c.name}</b>{i === 0 ? 'The live map of UTech, UWI Mona and Kingston. Alerts confirmed by neighbours, events, tickets.' : 'A location-based social app. A 96K-line Go backend that only stores rough location.'}<span className="m">{c.file} · {i === 0 ? 'iOS + ANDROID' : 'GO + POSTGIS'}</span></span>
            </button>
          ))}
        </section>
        <div className="row">
          <button type="button" className="btn k" onClick={(e) => a.open('work', rect(e))}>Open work/</button>
          <button type="button" className="btn" onClick={(e) => a.open('freelance', rect(e))}>Hire me for a build</button>
          <button type="button" className="btn" onClick={(e) => a.open('resume', rect(e))}>resume.pdf</button>
        </div>
      </div>
    </div>
  )
}
