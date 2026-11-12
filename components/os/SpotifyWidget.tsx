'use client'
import { useEffect, useRef, useState } from 'react'
import { useOS, prefersReduced, type Track } from './store'

export const Eq = () => <span className="eq" aria-hidden><i /><i /><i /><i /></span>

export function TrackRow({ t, i, playing }: { t: Track; i: number; playing?: boolean }) {
  return (
    <li className="trow" style={{ ['--i' as string]: i }}>
      <a href={t.songUrl} target="_blank" rel="noopener noreferrer">
        <span className="art">{t.albumArtSmall || t.albumArt ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={(t.albumArtSmall || t.albumArt)!} alt="" loading="lazy" referrerPolicy="no-referrer" /> : <span className="mono">♪</span>}</span>
        <span className="tt"><b>{t.title}</b><span>{t.artist}</span></span>
        {playing && <Eq />}
      </a>
    </li>
  )
}

export default function SpotifyWidget({ compact = false }: { compact?: boolean }) {
  const sp = useOS((s) => s.spotify)
  const [tab, setTab] = useState<'now' | 'recent' | 'top'>('now')
  const none = !sp.nowPlaying && !sp.recentTracks.length && !sp.topTracks.length
  const tabs: ['now' | 'recent' | 'top', string][] = [['now', 'Now'], ['recent', 'Recent'], ['top', 'Top']]
  const list = tab === 'recent' ? sp.recentTracks : tab === 'top' ? sp.topTracks : sp.nowPlaying ? [sp.nowPlaying] : []
  return (
    <aside className={`widget${compact ? ' compact' : ''}`} aria-label="Spotify">
      <div className="wtabs" role="tablist">
        <span className="wtitle mono">spotify</span>
        {tabs.map(([k, l]) => <button key={k} type="button" role="tab" aria-selected={tab === k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{l}</button>)}
      </div>
      {none || !sp.loaded ? (
        <div className="wempty">
          <span className="speak" style={{ backgroundImage: 'url(/os/speakers.webp)' }} aria-hidden />
          <p><b>nothing playing</b><span>the speakers are quiet right now.</span></p>
        </div>
      ) : tab === 'now' && sp.nowPlaying ? (
        <div className="wnow" key="now">
          <span className="bigart">{sp.nowPlaying.albumArt ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={sp.nowPlaying.albumArt} alt="" referrerPolicy="no-referrer" /> : <span className="mono">♪</span>}</span>
          <a href={sp.nowPlaying.songUrl} target="_blank" rel="noopener noreferrer" className="wnt">
            <span className="mono lab">{sp.isPlaying ? <>now playing <Eq /></> : 'last played'}</span>
            <b>{sp.nowPlaying.title}</b><span>{sp.nowPlaying.artist}</span>
          </a>
        </div>
      ) : (
        <ul className="tracks" key={tab}>
          {list.length ? list.slice(0, compact ? 4 : 5).map((t, i) => <TrackRow key={t.songUrl + i} t={t} i={i} />) : <li className="wempty small">nothing here yet.</li>}
        </ul>
      )}
    </aside>
  )
}

/** The desktop widget: drag it anywhere. Position is remembered and kept on screen. */
export function DraggableWidget() {
  const on = useOS((s) => s.widgetOn)
  const vw = useOS((s) => s.vw), vh = useOS((s) => s.vh)
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const drag = useRef<{ sx: number; sy: number; bx: number; by: number; lx: number; tilt: number; moved: boolean; x: number; y: number } | null>(null)

  const clamp = (x: number, y: number) => {
    const w = ref.current?.offsetWidth ?? 280, h = ref.current?.offsetHeight ?? 160
    return { x: Math.max(8, Math.min(window.innerWidth - w - 8, x)), y: Math.max(56, Math.min(window.innerHeight - h - 8, y)) }
  }
  useEffect(() => {
    try {
      const j = JSON.parse(localStorage.getItem('kos_wdg') || 'null'); if (j && typeof j.x === 'number') setPos(clamp(j.x, j.y))
      const q = new URLSearchParams(window.location.search).get('wdgpos') // dev screenshots only
      if (q && process.env.NODE_ENV === 'development') { const [x, y] = q.split(',').map(Number); setPos(clamp(x, y)) }
    } catch { /* */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => { if (pos) setPos(clamp(pos.x, pos.y)) /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [vw, vh])

  const down = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('a,button')) return
    if (e.pointerType === 'mouse' && e.button !== 0) return
    const r = ref.current!.getBoundingClientRect()
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { sx: e.clientX, sy: e.clientY, bx: r.left, by: r.top, lx: e.clientX, tilt: 0, moved: false, x: r.left, y: r.top }
  }
  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (!d || !ref.current) return
    if (!d.moved && Math.abs(e.clientX - d.sx) + Math.abs(e.clientY - d.sy) < 4) return
    d.moved = true
    const rm = prefersReduced()
    const c = clamp(d.bx + e.clientX - d.sx, d.by + e.clientY - d.sy)
    d.x = c.x; d.y = c.y
    d.tilt = rm ? 0 : Math.max(-3, Math.min(3, d.tilt * 0.75 + (e.clientX - d.lx) * 0.2))
    d.lx = e.clientX
    const el = ref.current
    el.dataset.drag = '1'
    el.style.transition = 'none'
    el.style.transform = `translate3d(${c.x - d.bx}px,${c.y - d.by}px,0) rotate(${d.tilt}deg) scale(1.02)`
  }
  const up = () => {
    const d = drag.current
    drag.current = null
    const el = ref.current
    if (!d || !d.moved || !el) return
    delete el.dataset.drag
    // commit left/top at the same spot, then spring the tilt back to level
    el.style.transform = `rotate(${d.tilt}deg)`
    setPos({ x: d.x, y: d.y })
    try { localStorage.setItem('kos_wdg', JSON.stringify({ x: d.x, y: d.y })) } catch { /* */ }
    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.style.transition = 'transform .55s cubic-bezier(.34,1.7,.5,1)'
      el.style.transform = ''
      setTimeout(() => { el.style.transition = '' }, 600)
    }))
  }
  if (!on) return null
  return (
    <div ref={ref} className="wdg" style={pos ? { left: pos.x, top: pos.y, right: 'auto' } : undefined}
      onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
      <SpotifyWidget />
    </div>
  )
}
