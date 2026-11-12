'use client'
import { useEffect, useRef, useState } from 'react'
import { cases, type Built } from '@/lib/content'
import WindowArt from '../art/WindowArt'
import s from './Case.module.css'

const ICON: Record<Built['kind'], string> = {
  Architecture: 'M3 4h7v6H3zM14 4h7v6h-7zM8.5 14h7v6h-7zM6.5 10v2.5h11V10M12 12.5V14',
  Backend: 'M4 5h16v5H4zM4 14h16v5H4zM8 7.5h.01M8 16.5h.01',
  Frontend: 'M4 5h16v11H4zM9 20h6M12 16v4',
  Infrastructure: 'M7 18a4 4 0 0 1-.5-7.97A5.5 5.5 0 0 1 17 9a3.5 3.5 0 0 1 .5 7z',
  Data: 'M5 6c0-1.7 3.1-3 7-3s7 1.3 7 3-3.1 3-7 3-7-1.3-7-3zM5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6',
}
const Icon = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d={d} /></svg>
)

export default function Case({ slug }: { slug: string }) {
  const c = cases.find((x) => x.slug === slug)
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState('problem')

  const sections = c ? [
    { id: 'problem', label: 'The problem' },
    { id: 'numbers', label: 'Numbers' },
    { id: 'built', label: 'What I built' },
    { id: 'hard', label: 'Hard problems' },
    { id: 'stack', label: 'Stack' },
    ...(c.shots.length ? [{ id: 'screens', label: 'Screens' }] : []),
    ...(c.links.length ? [{ id: 'links', label: 'Links' }] : []),
  ] : []

  useEffect(() => {
    const el = root.current
    if (!el) return
    const scroller = el.closest('.win-body, .mbody') as Element | null
    const io = new IntersectionObserver(
      (es) => { const v = es.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]; if (v) setActive(v.target.getAttribute('data-sec') || 'problem') },
      { root: scroller, rootMargin: '0px 0px -65% 0px' },
    )
    el.querySelectorAll('[data-sec]').forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [slug])

  if (!c) return null
  const go = (id: string) => { setActive(id); root.current?.querySelector(`[data-sec="${id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }

  return (
    <article className={s.case} ref={root}>
      <WindowArt app={`case-${c.slug}`} />
      <div className={s.body}>
        <p className={s.kicker}>{c.file} · {c.meta}</p>
        <h2 className={s.name}>{c.name}</h2>
        <p className={s.lead}>{c.blurb}</p>
        <p className={s.tags}><span className={s.status}>{c.status}</span></p>

        <div className={s.layout}>
          <nav className={s.toc} aria-label="Sections">
            {sections.map((x) => (
              <button key={x.id} type="button" className={active === x.id ? s.on : ''} onClick={() => go(x.id)}>{x.label}</button>
            ))}
          </nav>

          <div className={s.main}>
            <section data-sec="problem" className={s.sec}>
              <h3>The problem</h3>
              {c.problem.map((p) => <p key={p}>{p}</p>)}
              <div className={s.role}><b>My role</b><span>{c.role}</span></div>
            </section>

            <section data-sec="numbers" className={s.sec}>
              <h3>Numbers</h3>
              <ul className={s.stats}>{c.numbers.map((n) => <li key={n.label}><b>{n.n}</b><span>{n.label}</span></li>)}</ul>
            </section>

            <section data-sec="built" className={s.sec}>
              <h3>What I built</h3>
              <div className={s.cards}>
                {c.built.map((b) => (
                  <div key={b.kind} className={`${s.card} ${b.kind === 'Architecture' || b.kind === 'Data' || b.kind === 'Infrastructure' ? s.wide : ''}`}>
                    <h4><Icon d={ICON[b.kind]} />{b.kind}</h4>
                    <ul>{b.items.map((i) => <li key={i}>{i}</li>)}</ul>
                  </div>
                ))}
              </div>
            </section>

            <section data-sec="hard" className={s.sec}>
              <h3>Hard problems</h3>
              <ol className={s.hard}>
                {c.hard.map((h, i) => (
                  <li key={h.title}><span className={s.num}>{String(i + 1).padStart(2, '0')}</span><div><b>{h.title}</b><p>{h.body}</p></div></li>
                ))}
              </ol>
            </section>

            <section data-sec="stack" className={s.sec}>
              <h3>Stack</h3>
              {c.chips.map((g) => (
                <div key={g.group} className={s.grp}><small>{g.group}</small><ul className={s.chips}>{g.items.map((i) => <li key={i}>{i}</li>)}</ul></div>
              ))}
            </section>

            {c.shots.length > 0 && (
              <section data-sec="screens" className={s.sec}>
                <h3>Screens</h3>
                <div className={s.shots}>
                  {c.shots.map((x) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={x.src} src={x.src} alt={x.alt} loading="lazy" width={900} height={1956} />
                  ))}
                </div>
              </section>
            )}

            {c.links.length > 0 && (
              <section data-sec="links" className={s.sec}>
                <h3>Links</h3>
                <div className={s.links}>{c.links.map((l) => <a key={l.href} className={s.link} href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a>)}</div>
              </section>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
