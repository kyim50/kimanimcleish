'use client'
import { useOSActions } from '../store'
import { cases, earlier } from '@/lib/content'
import WindowArt from '../art/WindowArt'
import s from './Apps.module.css'
import { Stamp } from '../Stamp'

const MINI: Record<string, { f: string; cuts: string[]; stamp: string; ink?: boolean }> = {
  swiftpay: { f: '#E6CB5A', cuts: ['/os/art/kingshouse.webp', '/os/art/counter.webp'], stamp: '/os/stub.webp' },
  cardioscore: { f: '#C8714E', cuts: ['/os/art/ackee.webp', '/os/art/bird.webp'], stamp: '/os/harbour-1903.webp' },
  verro: { f: '#83A0C2', cuts: ['/os/art/actor.webp', '/os/art/bluemtn.webp'], stamp: '/os/map-1798.webp' },
  vault: { f: '#2a2926', cuts: ['/os/art/anchor.webp', '/os/art/counter.webp'], stamp: '/os/counter.webp', ink: true },
}

function MiniArt({ slug, name }: { slug: string; name: string }) {
  const m = MINI[slug]
  if (!m) return <span className={s.ph}>{name}</span>
  return (
    <span className="mini" style={{ background: m.f }} aria-hidden>
      <i className={`mini-dots${m.ink ? ' ink' : ''}`} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="mini-cut a" src={m.cuts[0]} alt="" loading="lazy" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="mini-cut b" src={m.cuts[1]} alt="" loading="lazy" />
      <span className="mini-stamp"><Stamp src={m.stamp} /></span>
      <b className="mini-name">{name}</b>
    </span>
  )
}

export default function Work() {
  const a = useOSActions()
  return (
    <>
      <WindowArt app="work" />
      <div className={s.pad}>
        <p className={s.path}>~/work/ · {cases.length} case files</p>
        <div className={s.files}>
          {cases.map((c) => (
            <button key={c.slug} type="button" className={s.file} onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); a.open(`case:${c.slug}` as Parameters<typeof a.open>[0], { x: r.left + r.width / 2, y: r.top + r.height / 2 }) }}>
              <span className={s.thumb}>
                {c.shots[0] ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={c.shots[0].src} alt="" loading="lazy" /> : <MiniArt slug={c.slug} name={c.name} />}
              </span>
              <span className={s.fn}><b>{c.name}</b><span>{c.file} · {c.meta}</span></span>
            </button>
          ))}
        </div>
        <h3 className={s.h3}>Earlier work</h3>
        <ul className={s.earlier}>
          {earlier.map((e) => <li key={e.name}><b>{e.name}</b><span>{e.line}</span></li>)}
        </ul>
      </div>
    </>
  )
}
