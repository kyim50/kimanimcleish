import { experience, earlierRoles, stack, credentials, about, offClock, socials } from '@/lib/content'
import WindowArt from '../art/WindowArt'
import s from './Apps.module.css'

export default function Experience() {
  return (
    <>
      <WindowArt app="experience" />
      <div className={s.pad}>
        <p className={s.path}>experience.log · newest first</p>
        <ol className={s.timeline}>
          {experience.map((x, i) => (
            <li key={x.org + x.dates + i} className={s.job}>
              <p className={s.dates}>{x.dates} · {x.place}</p>
              <h3>{x.org}</h3>
              <p className={s.role}>{x.role}</p>
              <ul>{x.points.map((p) => <li key={p}>{p}</li>)}</ul>
            </li>
          ))}
          {earlierRoles.map((x) => (
            <li key={x.org + x.dates} className={s.job}>
              <p className={s.dates}>{x.dates}</p>
              <h3>{x.org}</h3>
              <p className={s.role}>{x.role}</p>
              <ul><li>{x.line}</li></ul>
            </li>
          ))}
        </ol>

        <h3 className={s.h3}>Stack</h3>
        {stack.map((g) => (
          <div key={g.group} className={s.group}>
            <small>{g.group}</small>
            <ul className={s.chips}>{g.items.map((i) => <li key={i}>{i}</li>)}</ul>
          </div>
        ))}

        <h3 className={s.h3}>Education and credentials</h3>
        <dl className={s.creds}>{credentials.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>

        <h3 className={s.h3}>About</h3>
        {about.map((p) => <p key={p} className={s.lede}>{p}</p>)}
        <ul className={s.chips} style={{ marginTop: 12 }}>{offClock.map(([k, v]) => <li key={k} title={v}>{k}: {v}</li>)}</ul>

        <h3 className={s.h3}>Find me</h3>
        <div className={s.socials}>{socials.map((x) => <a key={x.label} className={s.btn} href={x.href} target={x.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">{x.label}</a>)}</div>
      </div>
    </>
  )
}
