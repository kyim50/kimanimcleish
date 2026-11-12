'use client'
import { memo, useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { useOSActions, useStoreRef, useOS, useReduced, type Win } from './store'
import { defById, MENU_H } from './routes'
import { appFor } from './appmap'

const TOP = MENU_H

function rectOf(w: Win, vw: number, vh: number) {
  if (w.max) return { x: 0, y: TOP, w: vw, h: vh - TOP }
  if (w.snap === 'l') return { x: 6, y: TOP, w: vw / 2 - 9, h: vh - TOP - 70 }
  if (w.snap === 'r') return { x: vw / 2 + 3, y: TOP, w: vw / 2 - 9, h: vh - TOP - 70 }
  return { x: w.x, y: w.y, w: w.w, h: w.h }
}

const Frame = memo(function Frame({ win, focused, vw, vh }: { win: Win; focused: boolean; vw: number; vh: number }) {
  const a = useOSActions()
  const store = useStoreRef()
  const rm = useReduced()
  const outer = useRef<HTMLDivElement>(null)
  const dlg = useRef<HTMLDivElement>(null)
  const drag = useRef<{ sx: number; sy: number; bx: number; by: number; moved: boolean; restored: boolean; lx: number; tilt: number } | null>(null)
  const def = defById(win.id)
  const r = rectOf(win, vw, vh)
  const focusReq = useOS((s) => s.focusReq === win.id)

  useEffect(() => {
    if (focusReq && dlg.current) { dlg.current.focus({ preventScroll: true }); store.set({ focusReq: null }) }
  }, [focusReq, store])

  // brief size transition only when maximising or snapping
  const prevMode = useRef(`${win.max}${win.snap}`)
  useEffect(() => {
    const m = `${win.max}${win.snap}`
    if (m !== prevMode.current && outer.current && !rm) {
      prevMode.current = m
      outer.current.classList.add('rect-anim')
      const t = setTimeout(() => outer.current?.classList.remove('rect-anim'), 260)
      return () => clearTimeout(t)
    }
    prevMode.current = m
  }, [win.max, win.snap, rm])

  const down = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return
    if (e.pointerType === 'mouse' && e.button !== 0) return
    if (win.max) return
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { sx: e.clientX, sy: e.clientY, bx: r.x, by: r.y, moved: false, restored: false, lx: e.clientX, tilt: 0 }
  }
  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (!d || !outer.current) return
    const dx = e.clientX - d.sx, dy = e.clientY - d.sy
    if (!d.moved && Math.abs(dx) + Math.abs(dy) < 4) return
    if (!d.moved) outer.current.dataset.drag = '1'
    d.moved = true
    if (win.snap && !d.restored && win.prev) {
      d.restored = true
      const p = win.prev
      d.bx = e.clientX - p.w / 2; d.by = e.clientY - 16; d.sx = e.clientX; d.sy = e.clientY
      a.setRect(win.id, { x: d.bx, y: d.by, w: p.w, h: p.h }, true)
      return
    }
    const x = d.bx + (e.clientX - d.sx), y = Math.max(TOP, Math.min(vh - 60, d.by + (e.clientY - d.sy)))
    const vx = e.clientX - d.lx
    d.lx = e.clientX
    d.tilt = rm ? 0 : Math.max(-2.2, Math.min(2.2, d.tilt * 0.8 + vx * 0.18))
    outer.current.style.transition = 'none'
    outer.current.style.transform = `translate3d(${x - outer.current.offsetLeft}px,${y - outer.current.offsetTop}px,0) rotate(${d.tilt}deg)`
    const side = e.clientX <= 8 ? 'l' : e.clientX >= vw - 8 ? 'r' : e.clientY <= TOP - 4 ? 't' : null
    if (store.get().snapPreview !== side) store.set({ snapPreview: side })
  }
  const up = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    drag.current = null
    if (!d || !d.moved || !outer.current) return
    const side = e.clientX <= 8 ? 'l' : e.clientX >= vw - 8 ? 'r' : e.clientY <= TOP - 4 ? 't' : null
    const x = d.bx + (e.clientX - d.sx), y = Math.max(TOP, Math.min(vh - 60, d.by + (e.clientY - d.sy)))
    const el = outer.current
    delete el.dataset.drag
    // settle: keep the tilt, then spring it back to level
    el.style.transform = d.tilt ? `rotate(${d.tilt}deg)` : ''
    if (d.tilt) requestAnimationFrame(() => requestAnimationFrame(() => {
      el.style.transition = 'transform .55s cubic-bezier(.34,1.7,.5,1)'
      el.style.transform = ''
      setTimeout(() => { el.style.transition = '' }, 600)
    }))
    else el.style.transition = ''
    if (side) a.snap(win.id, side)
    else { a.setRect(win.id, { x, y }); store.set({ snapPreview: null }) }
  }

  const rdown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation()
    e.currentTarget.setPointerCapture(e.pointerId)
    const sx = e.clientX, sy = e.clientY, w0 = r.w, h0 = r.h
    const el = outer.current!
    const mv = (ev: PointerEvent) => {
      el.style.width = Math.max(340, Math.min(vw - r.x, w0 + ev.clientX - sx)) + 'px'
      el.style.height = Math.max(220, Math.min(vh - r.y, h0 + ev.clientY - sy)) + 'px'
    }
    const end = () => {
      window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', end)
      a.setRect(win.id, { w: el.offsetWidth, h: el.offsetHeight }, true)
      a.setRect(win.id, { x: r.x, y: r.y })
    }
    window.addEventListener('pointermove', mv); window.addEventListener('pointerup', end)
  }

  const hidden = rm ? { opacity: 0 } : { opacity: 0, scale: 0.1, x: win.origin.x - (r.x + r.w / 2), y: win.origin.y - (r.y + r.h / 2) }
  return (
    <div
      ref={outer}
      className="win-pos"
      style={{ left: r.x, top: r.y, width: r.w, height: r.h, zIndex: win.z, pointerEvents: win.min ? 'none' : undefined }}
      onPointerDownCapture={() => a.focus(win.id)}
      aria-hidden={win.min || undefined}
      {...(win.min ? ({ inert: '' } as object) : {})}
    >
      <motion.div
        ref={dlg}
        role="dialog" aria-label={def.title} tabIndex={-1}
        className={`win${focused ? ' focused' : ''}`}
        initial={hidden}
        animate={win.min ? hidden : { opacity: 1, scale: 1, x: 0, y: 0 }}
        exit={hidden}
        transition={rm ? { duration: 0.01 } : { type: 'spring', stiffness: 360, damping: 34, mass: 0.9 }}
      >
        <div className="tb" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onDoubleClick={() => a.toggleMax(win.id)}>
          <span className="dots">
            <button type="button" className="tl-btn c" aria-label={`Close ${def.title}`} onClick={() => a.close(win.id)}><i><b>×</b></i></button>
            <button type="button" className="tl-btn m" aria-label={`Minimise ${def.title}`} onClick={() => a.minimise(win.id)}><i><b>−</b></i></button>
            <button type="button" className="tl-btn x" aria-label={win.max ? `Exit full screen ${def.title}` : `Full screen ${def.title}`} onClick={() => a.toggleMax(win.id)}><i><b>{win.max ? '↙' : '↗'}</b></i></button>
          </span>
          <span className="t">{win.id === 'terminal' ? 'terminal — contact' : `~/${def.title}`}</span>
        </div>
        <div className="win-body">{appFor(win.id, { page: false })}</div>
        {!win.max && !win.snap && <div className="grip" onPointerDown={rdown} aria-hidden />}
      </motion.div>
    </div>
  )
})

export default Frame
