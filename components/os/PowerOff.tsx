'use client'
import { useEffect } from 'react'
import { useOS, useOSActions } from './store'

export default function PowerOff() {
  const a = useOSActions()
  const mode = useOS((s) => s.off)
  useEffect(() => {
    if (mode !== 'shutdown') return
    const on = () => a.powerOn()
    const t = setTimeout(() => { window.addEventListener('keydown', on); window.addEventListener('pointerdown', on) }, 600)
    return () => { clearTimeout(t); window.removeEventListener('keydown', on); window.removeEventListener('pointerdown', on) }
  }, [mode, a])
  return (
    <div className={`off ${mode}`} role="status">
      {mode === 'shutdown' ? (
        <p className="mono">it is now safe to close this tab.<br /><span>click or press any key to power on.</span></p>
      ) : <p className="mono">restarting…</p>}
    </div>
  )
}
