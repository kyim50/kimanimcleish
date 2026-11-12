'use client'
import { useState } from 'react'
import { useOSActions } from '../store'
import WindowArt from '../art/WindowArt'
import s from './Apps.module.css'

const FILES: { name: string; kind: string; note: string }[] = [
  { name: 'old-portfolio-matrix-rain/', kind: 'folder', note: 'the old site. it had a lot of rain.' },
  { name: 'editorial-v1/', kind: 'folder', note: 'a perfectly good cream-coloured page.' },
  { name: 'bugs-fixed.txt', kind: 'text', note: '3 lines' },
]

export default function Trash() {
  const a = useOSActions()
  const [open, setOpen] = useState<string | null>(null)
  const pick = (n: string) => {
    if (n.startsWith('old-portfolio')) { setOpen(null); a.set({ overlay: 'rain' }); return }
    setOpen(n)
    if (n.startsWith('editorial')) a.toast('too cream.', 'editorial-v1/')
  }
  return (
    <>
      <WindowArt app="trash" />
      <div className={s.pad}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
          <span className={s.path} style={{ margin: 0 }}>trash · {FILES.length} items</span>
          <button type="button" className={`${s.btn} ${s.soft}`} onClick={() => a.set({ overlay: 'empty-trash' })}>Empty Trash</button>
        </div>
        <ul className={s.tfiles}>
          {FILES.map((f) => (
            <li key={f.name}>
              <button type="button" onClick={() => pick(f.name)} className={open === f.name ? s.on : ''}>
                <span className="mono">{f.kind === 'folder' ? '▸' : '≡'} {f.name}</span><span>{f.note}</span>
              </button>
            </li>
          ))}
        </ul>
        {open === 'bugs-fixed.txt' && (
          <pre className={`mono ${s.cat}`}>{`bugs-fixed.txt\n\n1. it worked on my machine. now it works on yours.\n2. removed the rain. (kept the rain, in here.)\n3. fixed the bug where i said "just one more feature".`}</pre>
        )}
        {open?.startsWith('editorial') && <p className={s.quiet}>&quot;too cream.&quot;</p>}
      </div>
    </>
  )
}
