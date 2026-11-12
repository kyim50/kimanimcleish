'use client'
import { useState } from 'react'
import { useOS, useOSActions, useReduced } from './store'
import LofiPlayer from './LofiPlayer'
import Wallpaper from './Wallpaper'

const S = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true as const }
export const IcMoon = () => <svg {...S}><path d="M20 14.5A8 8 0 019.5 4 8 8 0 1020 14.5z" /></svg>
export const IcMotion = () => <svg {...S}><path d="M4 12c3-6 5-6 8 0s5 6 8 0" /></svg>
export const IcDesk = () => <svg {...S}><rect x="3" y="4.5" width="18" height="12" rx="2" /><path d="M8 20h8M12 16.5V20" /><path d="M6.5 8h5" /></svg>
export const IcClose = () => <svg {...S}><rect x="4" y="5" width="16" height="14" rx="2" /><path d="M9.5 10l5 4M14.5 10l-5 4" /></svg>
export const IcSleep = () => <svg {...S}><path d="M14.5 4.5h5l-5 6h5M4 12.5h3.5l-3.5 4.5h3.5" /></svg>
export const IcWidget = () => <svg {...S}><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M8 15v-3M12 15V9M16 15v-5" /></svg>
export const IcSliders = () => <svg {...S}><path d="M4 7h9M17 7h3M4 17h3M11 17h9" /><circle cx="15" cy="7" r="2" /><circle cx="9" cy="17" r="2" /></svg>

function Tgl({ icon, label, on, onClick }: { icon: React.ReactNode; label: string; on?: boolean; onClick: () => void }) {
  return (
    <button type="button" className={`tile tgl${on ? ' on' : ''}`} aria-pressed={on === undefined ? undefined : on} onClick={onClick}>
      {icon}<span><b>{label}</b>{on !== undefined && <small className="mono">{on ? 'on' : 'off'}</small>}</span>
    </button>
  )
}

export default function ControlPanel() {
  const a = useOSActions()
  const mobile = useOS((s) => s.mobile)
  const theme = useOS((s) => s.theme)
  const wall = useOS((s) => s.wallpaper)
  const wdg = useOS((s) => s.widgetOn)
  const vw = useOS((s) => s.vw), vh = useOS((s) => s.vh)
  const reduced = useReduced()
  const [ox] = useState(() => {
    const b = document.querySelector<HTMLElement>('[data-cp-btn]')?.getBoundingClientRect()
    return b ? Math.max(20, Math.min(332, b.left + b.width / 2 - (window.innerWidth - 10 - 352))) : 300
  })
  const close = () => a.set({ overlay: null })
  const k = (mobile ? 104 : 98) / Math.max(vw, 320)
  return (
    <div className="scrim clear cp-scrim" onPointerDown={(e) => { if (e.target === e.currentTarget) close() }}>
      <div className={`cp${mobile ? ' mob' : ''}`} role="dialog" aria-label="Control panel" style={{ ['--ox' as string]: `${ox}px` }}
        onKeyDown={(e) => { if (e.key === 'Escape') close() }}>
        <div className="tile wide"><LofiPlayer /></div>
        <Tgl icon={<IcMoon />} label="Dark mode" on={theme === 'dark'} onClick={a.toggleTheme} />
        <Tgl icon={<IcMotion />} label="Reduce motion" on={reduced} onClick={() => a.setMotion(reduced ? 'full' : 'reduce')} />
        <div className="tile wide wp">
          <p className="mono k-label">wallpaper</p>
          <div className="wp-row">
            {[0, 1, 2].map((i) => (
              <button key={i} type="button" className={`wthumb${wall === i ? ' on' : ''}`} aria-label={`Wallpaper ${i + 1}`} aria-pressed={wall === i} onClick={() => a.setWallpaper(i)} style={{ height: Math.min(vh * k, 76) }}>
                <span className="wscale" style={{ width: vw, height: vh, transform: `scale(${k})` }}><Wallpaper variant={i} /></span>
              </button>
            ))}
          </div>
        </div>
        <button type="button" className="tile tgl" onClick={() => a.showDesktop()}><IcDesk /><span><b>Show desktop</b></span></button>
        <button type="button" className="tile tgl" onClick={() => { a.closeAll(); close() }}><IcClose /><span><b>Close all</b></span></button>
        <Tgl icon={<IcWidget />} label="Spotify widget" on={wdg} onClick={() => a.setWidgetOn(!wdg)} />
        <button type="button" className="tile tgl" onClick={() => a.set({ overlay: 'saver' })}><IcSleep /><span><b>Enter sleep</b></span></button>
      </div>
    </div>
  )
}
