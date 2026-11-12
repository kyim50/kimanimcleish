'use client'
import { useOS, useOSActions } from './store'
import { defById, type WinId } from './routes'

export default function Dock() {
  const a = useOSActions()
  const ids = useOS((s) => s.wins.map((w) => w.id).join('|'))
  const wins = useOS((s) => s.wins)
  const focused = useOS((s) => [...s.wins].filter((w) => !w.min).sort((x, y) => y.z - x.z)[0]?.id)
  void ids
  if (!wins.length) return null
  return (
    <nav className="dock" aria-label="Open windows">
      {wins.map((w) => {
        const d = defById(w.id as WinId)
        const caseWin = w.id.startsWith('case:')
        return (
          <button key={w.id} type="button" data-dock={w.id} className={`dk${w.id === focused ? ' on' : ''}${w.min ? ' min' : ''}`}
            onClick={() => (w.min || w.id !== focused ? a.focus(w.id) : a.minimise(w.id))} aria-label={`${d.label}${w.min ? ' (minimised)' : ''}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {d.stamp && <img src={d.stamp} alt="" width={20} height={20} className="dk-ic" />}<span className="mono">{caseWin ? d.title : d.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
