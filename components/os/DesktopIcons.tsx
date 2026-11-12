'use client'
import { useEffect, useRef, useState } from 'react'
import { DEFS, defById, type WinId } from './routes'
import { useOS, useOSActions, useStoreRef } from './store'
import { Stamp } from './Stamp'

const CELL_H = 90, COL_W = 112, ICON_W = 104, ICON_H = 96

export function defaultPos(i: number, vh: number) {
  const rows = Math.max(3, Math.floor((vh - 60) / CELL_H))
  return { x: 18 + Math.floor(i / rows) * COL_W, y: 54 + (i % rows) * CELL_H }
}

export default function DesktopIcons() {
  const a = useOSActions()
  const store = useStoreRef()
  const icons = useOS((s) => s.icons)
  const sel = useOS((s) => s.sel)
  const vh = useOS((s) => s.vh)
  const vw = useOS((s) => s.vw)
  const settle = useOS((s) => s.settle)
  const list = DEFS.filter((d) => d.icon)
  const [band, setBand] = useState<null | { x: number; y: number; w: number; h: number }>(null)
  const drag = useRef<{ id: string; sx: number; sy: number; bx: number; by: number; moved: boolean; el: HTMLElement } | null>(null)

  const pos = (id: string, i: number) => icons[id] ?? defaultPos(i, vh)

  const openIcon = (id: WinId, el: HTMLElement) => {
    const r = el.getBoundingClientRect()
    a.open(id, { x: r.left + r.width / 2, y: r.top + r.height / 2 })
  }

  const down = (e: React.PointerEvent<HTMLButtonElement>, id: WinId, i: number) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    store.set({ sel: [id], menu: null })
    const p = pos(id, i)
    const wrap = e.currentTarget.parentElement as HTMLElement
    drag.current = { id, sx: e.clientX, sy: e.clientY, bx: p.x, by: p.y, moved: false, el: wrap }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const move = (e: React.PointerEvent<HTMLButtonElement>) => {
    const d = drag.current
    if (!d) return
    const dx = e.clientX - d.sx, dy = e.clientY - d.sy
    if (!d.moved && Math.abs(dx) + Math.abs(dy) < 5) return
    d.moved = true
    d.el.style.transform = `translate3d(${dx}px,${dy}px,0)`
    d.el.style.zIndex = '5'
  }
  const up = (e: React.PointerEvent<HTMLButtonElement>, id: WinId) => {
    const d = drag.current
    drag.current = null
    if (!d) return
    if (d.moved) {
      const x = Math.max(0, Math.min(vw - ICON_W, Math.round((d.bx + e.clientX - d.sx) / 8) * 8))
      const y = Math.max(58, Math.min(vh - ICON_H - 10, Math.round((d.by + e.clientY - d.sy) / 8) * 8))
      d.el.style.transform = ''; d.el.style.zIndex = ''
      a.setIcon(id, x, y)
    } else if (e.pointerType === 'touch') {
      openIcon(id, e.currentTarget)
    }
  }

  // rubber band
  const bandStart = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget || e.button !== 0) return
    store.set({ sel: [], menu: null, overlay: store.get().overlay === 'ctx' || store.get().overlay === 'cal' ? null : store.get().overlay })
    const sx = e.clientX, sy = e.clientY
    let started = false
    const mv = (ev: PointerEvent) => {
      if (!started && Math.abs(ev.clientX - sx) + Math.abs(ev.clientY - sy) < 5) return
      started = true
      const r = { x: Math.min(sx, ev.clientX), y: Math.min(sy, ev.clientY), w: Math.abs(ev.clientX - sx), h: Math.abs(ev.clientY - sy) }
      setBand(r)
      const hit = list.filter((d, i) => {
        const p = store.get().icons[d.id] ?? defaultPos(i, store.get().vh)
        return p.x < r.x + r.w && p.x + ICON_W > r.x && p.y < r.y + r.h && p.y + ICON_H > r.y
      }).map((d) => d.id)
      store.set({ sel: hit })
    }
    const end = () => { setBand(null); window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', end) }
    window.addEventListener('pointermove', mv); window.addEventListener('pointerup', end)
  }

  useEffect(() => {
    // keep saved positions on screen after a resize
    const out = Object.entries(icons).filter(([, p]) => p.x > vw - 40 || p.y > vh - 40)
    if (out.length) out.forEach(([id]) => { const i = list.findIndex((d) => d.id === id); const p = defaultPos(i, vh); a.setIcon(id, p.x, p.y) })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vw, vh])

  return (
    <div className="desk" onPointerDown={bandStart}
      onContextMenu={(e) => { e.preventDefault(); store.set({ overlay: 'ctx', ctx: { x: e.clientX, y: e.clientY }, menu: null }) }}>
      {list.map((d, i) => {
        const p = pos(d.id, i)
        return (
          <div key={d.id} className={`ic${sel.includes(d.id) ? ' sel' : ''}${settle ? ' pop' : ''}`} style={{ left: p.x, top: p.y, ['--d' as string]: `${260 + i * 70}ms` }}>
            <button
              type="button" data-icon={d.id} className="ic-btn"
              onPointerDown={(e) => down(e, d.id, i)} onPointerMove={move} onPointerUp={(e) => up(e, d.id)} onPointerCancel={() => { drag.current = null }}
              onDoubleClick={(e) => openIcon(d.id, e.currentTarget)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); openIcon(d.id, e.currentTarget) } else if (e.key === ' ') { e.preventDefault(); store.set({ sel: [d.id] }) } }}
              onFocus={() => store.set({ sel: [d.id] })}
              aria-label={`${defById(d.id).label} — double-click or press Enter to open`}
            >
              <Stamp src={d.stamp} />
              <span className="lbl">{d.label}</span>
            </button>
          </div>
        )
      })}
      {band && <div className="band" style={{ left: band.x, top: band.y, width: band.w, height: band.h }} />}
    </div>
  )
}
