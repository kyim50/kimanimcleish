'use client'
import { memo, useEffect, useRef } from 'react'

type Piece = { k: 'f'; c: string; l: number; t: number; w: number; h: number; r: number } | { k: 'c'; src: string; l: number; t: number; w: number; r: number }

const V: Piece[][] = [
  [
    { k: 'f', c: 'sage', l: -2, t: 57, w: 22, h: 48, r: -3 },
    { k: 'f', c: 'blue', l: 78, t: 4, w: 28, h: 43, r: 4 },
    { k: 'f', c: 'mustard', l: 82.5, t: 44, w: 22, h: 31, r: -5 },
    { k: 'c', src: 'h-compass', l: 85.6, t: 65, w: 15.5, r: -8 },
    { k: 'c', src: 'h-gosse', l: 85.5, t: 12, w: 16.5, r: 6 },
    { k: 'c', src: 'h-kingst', l: -2.6, t: 71, w: 16.5, r: -4 },
  ],
  [
    { k: 'f', c: 'clay', l: -3, t: -4, w: 24, h: 44, r: 3 },
    { k: 'f', c: 'mustard', l: 70, t: 56, w: 34, h: 52, r: -4 },
    { k: 'f', c: 'sage', l: 36, t: 70, w: 28, h: 40, r: 2 },
    { k: 'c', src: 'h-harbour', l: 80, t: 6, w: 19, r: 5 },
    { k: 'c', src: 'h-market', l: -1.5, t: 64, w: 18, r: -6 },
    { k: 'c', src: 'h-gosse', l: 73, t: 62, w: 15, r: -3 },
  ],
  [
    { k: 'f', c: 'blue', l: -4, t: 48, w: 40, h: 60, r: -2 },
    { k: 'f', c: 'clay', l: 74, t: 0, w: 32, h: 50, r: 5 },
    { k: 'f', c: 'sage', l: 80, t: 58, w: 24, h: 50, r: -4 },
    { k: 'c', src: 'h-kingst', l: 81, t: 8, w: 17, r: 4 },
    { k: 'c', src: 'h-compass', l: -1, t: 6, w: 15, r: -7 },
    { k: 'c', src: 'h-harbour', l: 6, t: 66, w: 18, r: 3 },
  ],
]

function Wallpaper({ variant, settle, blur = false }: { variant: number; settle?: boolean; blur?: boolean }) {
  const pieces = V[variant % V.length]
  const ref = useRef<HTMLDivElement>(null)
  // subtle parallax: the collage layers drift a few px with the mouse
  useEffect(() => {
    const el = ref.current
    if (!el || document.documentElement.dataset.motion === 'reduce' || (document.documentElement.dataset.motion !== 'full' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) || !window.matchMedia('(hover: hover)').matches) return
    let raf = 0, nx = 0, ny = 0
    const on = (e: PointerEvent) => {
      nx = (e.clientX / window.innerWidth - 0.5) * 2; ny = (e.clientY / window.innerHeight - 0.5) * 2
      if (!raf) raf = requestAnimationFrame(() => { raf = 0; el.style.setProperty('--mx', nx.toFixed(3)); el.style.setProperty('--my', ny.toFixed(3)) })
    }
    window.addEventListener('pointermove', on, { passive: true })
    return () => { window.removeEventListener('pointermove', on); cancelAnimationFrame(raf) }
  }, [])
  return (
    <div ref={ref} className={`wall${settle ? ' settle' : ''}${blur ? ' wall-blur' : ''}`} aria-hidden>
      <div className="wall-map" style={{ backgroundImage: 'url(/os/hay.webp)' }} />
      {pieces.map((p, i) =>
        p.k === 'f' ? (
          <div key={i} className={`wall-piece field f-${p.c}`}
            style={{ left: `${p.l}%`, top: `${p.t}%`, width: `${p.w}vw`, height: `${p.h}vh`, ['--r' as string]: `${p.r}deg`, ['--dp' as string]: 5 + (i % 3) * 3, animationDelay: `${i * 70}ms` }} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={i} alt="" src={`/os/${p.src}.webp`} className="wall-piece cut" loading="eager" decoding="async"
            style={{ left: `${p.l}%`, top: `${p.t}%`, width: `${p.w}vw`, ['--r' as string]: `${p.r}deg`, ['--dp' as string]: 9 + (i % 3) * 4, animationDelay: `${i * 70}ms` }} />
        ),
      )}
      <div className="wall-grain" />
    </div>
  )
}
export default memo(Wallpaper)
