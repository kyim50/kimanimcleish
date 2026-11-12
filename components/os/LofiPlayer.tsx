'use client'
import { useOS, useOSActions } from './store'
import { LOFI, fmtTime } from './lofi'
import { Eq } from './SpotifyWidget'

const I = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': true as const }
export const IcPlay = () => <svg {...I}><path d="M7 4.5v15l12.5-7.5z" /></svg>
export const IcPause = () => <svg {...I}><path d="M6.5 4.5h4v15h-4zM13.5 4.5h4v15h-4z" /></svg>
export const IcPrev = () => <svg {...I}><path d="M6 5h2.5v14H6zM20 5v14L9.5 12z" /></svg>
export const IcNext = () => <svg {...I}><path d="M15.5 5H18v14h-2.5zM4 5v14l10.5-7z" /></svg>
export const IcVol = ({ off }: { off?: boolean }) => (
  <svg {...I} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" stroke="none" />
    {off ? <path d="M16 9.5l5 5M21 9.5l-5 5" /> : <><path d="M15.5 9a4 4 0 010 6" /><path d="M18 6.5a7.5 7.5 0 010 11" /></>}
  </svg>
)

/** The lo-fi player. Same store everywhere: control panel, music window, terminal. */
export default function LofiPlayer({ playlist = false }: { playlist?: boolean }) {
  const l = useOS((s) => s.lofi)
  const a = useOSActions()
  const tr = LOFI[l.idx]
  const pct = l.dur ? Math.min(100, (l.t / l.dur) * 100) : 0
  const seek = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    a.lofiSeek((e.clientX - r.left) / r.width)
  }
  return (
    <div className="lofi">
      <div className="lf-top">
        <div className="lf-art" aria-hidden><span style={{ backgroundImage: 'url(/os/speakers.webp)' }} />{l.playing && <Eq />}</div>
        <div className="lf-meta">
          <b>{tr.title}</b>
          <span>{tr.artist}</span>
          <small className="mono">CC0 · HoliznaCC0</small>
        </div>
      </div>
      <div className="lf-prog" role="slider" aria-label="Seek" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pct)} tabIndex={0}
        onPointerDown={seek}
        onKeyDown={(e) => { if (e.key === 'ArrowRight') a.lofiSeek((l.t + 5) / (l.dur || 1)); if (e.key === 'ArrowLeft') a.lofiSeek((l.t - 5) / (l.dur || 1)) }}>
        <i style={{ width: `${pct}%` }} />
      </div>
      <div className="lf-times mono"><span>{fmtTime(l.t)}</span><span>{fmtTime(l.dur)}</span></div>
      <div className="lf-ctl">
        <button type="button" className="lf-b" aria-label="Previous track" onClick={() => a.lofiPrev()}><IcPrev /></button>
        <button type="button" className="lf-b big" aria-label={l.playing ? 'Pause' : 'Play'} onClick={() => a.lofiToggle()}>{l.playing ? <IcPause /> : <IcPlay />}</button>
        <button type="button" className="lf-b" aria-label="Next track" onClick={() => a.lofiNext()}><IcNext /></button>
        <div className="lf-vol">
          <button type="button" className="lf-b" aria-label={l.muted || l.vol === 0 ? 'Unmute' : 'Mute'} onClick={() => a.lofiMute()}><IcVol off={l.muted || l.vol === 0} /></button>
          <input type="range" min={0} max={100} value={Math.round((l.muted ? 0 : l.vol) * 100)} aria-label="Volume" onChange={(e) => a.lofiVol(Number(e.target.value) / 100)} />
        </div>
      </div>
      {playlist && (
        <ol className="lf-list">
          {LOFI.map((t, i) => (
            <li key={t.id}>
              <button type="button" className={i === l.idx ? 'on' : ''} onClick={() => a.lofiSelect(i)}>
                <span className="mono">{String(i + 1).padStart(2, '0')}</span><b>{t.title}</b>{i === l.idx && l.playing ? <Eq /> : <span className="mono">{t.artist}</span>}
              </button>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
