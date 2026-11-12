'use client'
import { useOS, useOSActions, useStoreRef } from '../store'
import { LOFI } from '../lofi'
import TerminalView from './Terminal'

export default function TerminalWin() {
  const a = useOSActions()
  const store = useStoreRef()
  const theme = useOS((s) => s.theme)
  const focusReq = useOS((s) => s.focusReq === 'terminal')
  return (
    <TerminalView
      autoFocus={focusReq}
      host={{
        lofi: {
          status: () => { const l = store.get().lofi; return { playing: l.playing, title: LOFI[l.idx].title, vol: l.vol, muted: l.muted } },
          play: () => a.lofiPlay(), pause: () => a.lofiPause(), next: () => a.lofiNext(), prev: () => a.lofiPrev(), setVol: a.lofiVol, mute: a.lofiMute,
        },
        theme, setTheme: a.setTheme, exit: () => a.close('terminal'),
        open: (id, el) => { const r = el?.getBoundingClientRect(); a.open(id, r ? { x: r.left, y: r.top } : undefined) },
      }}
    />
  )
}
