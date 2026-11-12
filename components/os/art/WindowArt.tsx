import type { CSSProperties } from 'react'
import { Stamp } from '../Stamp'
import s from './WindowArt.module.css'

type Field = 'sage' | 'blue' | 'mustard' | 'clay' | 'ink'
type Spec = { field: Field; cuts: string[]; stamp: string | 'term'; no: string }

const A = (n: string) => `/os/art/${n}.webp`

const I = (n: string) => `/os/icons/${n}.webp`
const SPECS: Record<string, Spec> = {
  welcome: { field: 'sage', cuts: [A('welcome-me'), A('cite-kingston'), A('tabi-plans')], stamp: I('welcome'), no: '01' },
  work: { field: 'blue', cuts: [A('cite-map'), A('tabi-quest'), A('swift-card')], stamp: I('work'), no: '02' },
  experience: { field: 'mustard', cuts: [A('exp-ibm'), A('exp-hospital'), A('exp-campus')], stamp: I('experience'), no: '03' },
  freelance: { field: 'clay', cuts: [A('free-spike'), A('free-pos'), A('swift-receipt')], stamp: I('freelance'), no: '04' },
  resume: { field: 'sage', cuts: [A('res-page'), A('res-doc'), A('res-note')], stamp: I('resume'), no: '05' },
  terminal: { field: 'ink', cuts: [A('term-win'), A('term-git'), A('vault-hud')], stamp: 'term', no: '06' },
  music: { field: 'clay', cuts: [A('mus-vinyl'), A('mus-speakers'), A('mus-flyer')], stamp: I('music'), no: '07' },
  trash: { field: 'blue', cuts: [A('trash-a'), A('trash-b'), A('trash-c')], stamp: I('trash'), no: '08' },
  browser: { field: 'blue', cuts: [A('browser-win'), A('cite-kingston'), A('tabi-plans')], stamp: I('browser'), no: '09' },
  blog: { field: 'mustard', cuts: [A('res-doc'), A('cite-kingston'), A('res-note')], stamp: I('browser'), no: '09' },
  'case-cite': { field: 'sage', cuts: [A('cite-map'), A('cite-kingston'), A('cite-alerts')], stamp: I('case-cite'), no: '01' },
  'case-tabi': { field: 'blue', cuts: [A('tabi-quest'), A('tabi-plans'), A('tabi-map')], stamp: I('case-tabi'), no: '02' },
  'case-swiftpay': { field: 'mustard', cuts: [A('swift-card'), A('swift-ncr'), A('swift-receipt')], stamp: I('case-swiftpay'), no: '03' },
  'case-cardioscore': { field: 'clay', cuts: [A('cardio-watch'), A('cardio-ecg'), A('cardio-heart')], stamp: I('case-cardioscore'), no: '04' },
  'case-verro': { field: 'blue', cuts: [A('verro-easel'), A('verro-canvas'), A('verro-palette')], stamp: I('case-verro'), no: '05' },
  'case-vault': { field: 'ink', cuts: [A('vault-terminal'), A('vault-git'), A('vault-hud')], stamp: I('case-vault'), no: '06' },
}

const POS = [
  { left: '46%', top: 12, w: 124, r: -5 },
  { left: '64%', top: -6, w: 138, r: 4 },
  { left: '82%', top: 16, w: 116, r: -3 },
]

// one jagged torn edge, generated once so server and client agree
const TORN = (() => {
  let d = 'M0 14'
  for (let x = 0; x <= 1000; x += 14) d += ` L${x} ${(4 + 5 * Math.abs(Math.sin(x * 0.37) * Math.cos(x * 0.11 + 1))).toFixed(1)}`
  return d + ' L1000 14 Z'
})()

export default function WindowArt({ app, className }: { app: string; className?: string }) {
  const spec = SPECS[app] ?? SPECS['case-cite']
  return (
    <div className={`${s.art} ${s[spec.field]} ${className ?? ''}`} aria-hidden>
      <div className={s.dots} />
      <div className={s.stamp} style={{ ['--d' as string]: '40ms' } as CSSProperties}>
        <Stamp src={spec.stamp === 'term' ? undefined : spec.stamp} term={spec.stamp === 'term'} big />
      </div>
      <span className={s.no}>No. {spec.no}</span>
      {spec.cuts.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={src + i} src={src} alt="" className={`${s.cut} ${i === 2 ? s.hideSm : ''}`} loading="eager" decoding="async"
          style={{ left: POS[i].left, top: POS[i].top, width: POS[i].w, ['--r' as string]: `${POS[i].r}deg`, ['--d' as string]: `${120 + i * 90}ms` } as CSSProperties} />
      ))}
      <svg className={s.torn} viewBox="0 0 1000 14" preserveAspectRatio="none"><path d={TORN} /></svg>
    </div>
  )
}
