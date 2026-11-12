import { EMAIL, LINKEDIN, gets, steps, proof, builds, clients } from '@/lib/content'
import WindowArt from '../art/WindowArt'
import s from './Apps.module.css'

export default function Freelance() {
  return (
    <>
      <WindowArt app="freelance" />
      <div className={s.pad}>
        <p className={s.path}>freelance.md</p>
        <h2 className={s.h2}>I take on freelance builds: <span className="hl">real production systems,</span> not prototypes.</h2>
        <div className={s.two}>
          <section>
            <h3>What you get</h3>
            <ul className={s.checks}>{gets.map((g) => <li key={g}>{g}</li>)}</ul>
          </section>
          <section>
            <h3>How it works</h3>
            <ol className={s.steps}>{steps.map(([t, d], i) => <li key={t}><i>0{i + 1}</i><b>{t}</b><span>{d}</span></li>)}</ol>
          </section>
        </div>

        <h3 className={s.h3}>Example builds</h3>
        <ul className={s.builds}>
          {builds.map((b) => (
            <li key={b.title}><b>{b.title}</b><p>{b.line}</p><ul className={s.chips}>{b.tags.map((t) => <li key={t}>{t}</li>)}</ul></li>
          ))}
        </ul>

        <h3 className={s.h3}>Where it runs in production</h3>
        <ul className={s.clients}>
          {clients.map((c) => (
            <li key={c.name}><b>{c.name}</b>{c.line}{c.href && <> <a href={c.href} target="_blank" rel="noopener noreferrer">{c.href.replace('https://', '')}</a></>}</li>
          ))}
        </ul>

        <h3 className={s.h3}>The proof</h3>
        <ul className={s.proof}>{proof.map((p) => <li key={p}>{p}</li>)}</ul>
        <div style={{ display: 'flex', gap: 10, marginTop: 24, flexWrap: 'wrap' }}>
          <a className={s.btn} href={`mailto:${EMAIL}?subject=Freelance%20build`}>Have something to build? Email me</a>
          <a className={`${s.btn} ${s.soft}`} href={LINKEDIN} target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
      </div>
    </>
  )
}
