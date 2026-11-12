import Link from 'next/link'
import { cases, experience, earlierRoles, stack, credentials, about, bio, builds, clients, gets, steps, proof, socials, EMAIL, earlier } from '@/lib/content'
import { person, website, caseLd } from '@/lib/seo'

export type SeoRoute = 'home' | 'work' | 'experience' | 'freelance' | 'resume' | 'contact' | 'music' | 'trash' | `case:${string}`

const Ld = ({ data }: { data: object }) => <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />

function CaseText({ slug }: { slug: string }) {
  const c = cases.find((x) => x.slug === slug)
  if (!c) return null
  return (
    <>
      <h1>{c.name}: {c.blurb}</h1>
      <p>{c.file}. {c.meta}. {c.status}.</p>
      <p>My role: {c.role}</p>
      <h2>The problem</h2>
      {c.problem.map((p) => <p key={p}>{p}</p>)}
      <h2>Numbers</h2>
      <ul>{c.numbers.map((n) => <li key={n.label}>{n.n} {n.label}</li>)}</ul>
      <h2>What I built</h2>
      {c.built.map((b) => (<div key={b.kind}><h3>{b.kind}</h3><ul>{b.items.map((i) => <li key={i}>{i}</li>)}</ul></div>))}
      <h2>Hard problems</h2>
      {c.hard.map((h) => (<div key={h.title}><h3>{h.title}</h3><p>{h.body}</p></div>))}
      <h2>Stack</h2>
      {c.chips.map((g) => <p key={g.group}>{g.group}: {g.items.join(', ')}.</p>)}
      {c.shots.length > 0 && <ul>{c.shots.map((s) => <li key={s.src}><img src={s.src} alt={s.alt} width={900} height={1956} loading="lazy" /></li>)}</ul>}
      {c.links.map((l) => <p key={l.href}><a href={l.href}>{l.label}</a></p>)}
    </>
  )
}

/** Real text for crawlers. The desktop draws itself in the browser, so every route also carries this, visually hidden but readable. */
export default function RouteSeo({ route }: { route: SeoRoute }) {
  let body: React.ReactNode
  let ld: object[] = []
  if (route.startsWith('case:')) {
    const c = cases.find((x) => x.slug === route.slice(5))
    body = <CaseText slug={route.slice(5)} />
    ld = c ? [caseLd(c)] : []
  } else if (route === 'home') {
    ld = [person, website]
    body = (
      <>
        <h1>Kimani McLeish, software engineer in Kingston, Jamaica</h1>
        <p>{bio.line1} {bio.line2}</p>
        {about.map((p) => <p key={p}>{p}</p>)}
        <h2>Case files</h2>
        <ul>{cases.map((c) => <li key={c.slug}><Link href={`/work/${c.slug}`}>{c.name}</Link>: {c.blurb}</li>)}</ul>
        <p><Link href="/experience">Experience</Link>, <Link href="/freelance">freelance builds</Link>, <Link href="/resume">résumé</Link>, <Link href="/contact">contact</Link>, <Link href="/blog">blog</Link>.</p>
      </>
    )
  } else if (route === 'work') {
    body = (
      <>
        <h1>Work: case files by Kimani McLeish</h1>
        <ul>{cases.map((c) => <li key={c.slug}><Link href={`/work/${c.slug}`}>{c.name}</Link>: {c.blurb} {c.stack}.</li>)}</ul>
        <h2>Earlier work</h2>
        <ul>{earlier.map((e) => <li key={e.name}>{e.name}: {e.line}</li>)}</ul>
      </>
    )
  } else if (route === 'experience') {
    body = (
      <>
        <h1>Experience: Kimani McLeish, software engineer</h1>
        {experience.map((x) => (<div key={x.org + x.dates}><h2>{x.role}, {x.org}</h2><p>{x.dates}, {x.place}</p><ul>{x.points.map((p) => <li key={p}>{p}</li>)}</ul></div>))}
        {earlierRoles.map((x) => <div key={x.org}><h2>{x.role}, {x.org}</h2><p>{x.dates}. {x.line}</p></div>)}
        <h2>Stack</h2>
        {stack.map((g) => <p key={g.group}>{g.group}: {g.items.join(', ')}.</p>)}
        <h2>Education and credentials</h2>
        <ul>{credentials.map(([k, v]) => <li key={k}>{k}: {v}</li>)}</ul>
      </>
    )
  } else if (route === 'freelance') {
    body = (
      <>
        <h1>Freelance software engineering in Jamaica: real production systems</h1>
        <h2>What you get</h2><ul>{gets.map((g) => <li key={g}>{g}</li>)}</ul>
        <h2>How it works</h2><ol>{steps.map(([t, d]) => <li key={t}>{t}: {d}</li>)}</ol>
        <h2>Example builds</h2><ul>{builds.map((b) => <li key={b.title}>{b.title}: {b.line}</li>)}</ul>
        <h2>Where it runs in production</h2><ul>{clients.map((c) => <li key={c.name}>{c.name}: {c.line}</li>)}</ul>
        <h2>The proof</h2><ul>{proof.map((p) => <li key={p}>{p}</li>)}</ul>
        <p><a href={`mailto:${EMAIL}`}>Email Kimani</a></p>
      </>
    )
  } else if (route === 'resume') {
    body = (
      <>
        <h1>Résumé: Kimani McLeish, software engineer</h1>
        <p>{bio.line1}</p>
        <p><a href="/Kimani-McLeish-Resume.pdf">Download the résumé (PDF)</a></p>
        {experience.slice(0, 4).map((x) => <p key={x.org + x.dates}>{x.role}, {x.org}, {x.dates}.</p>)}
      </>
    )
  } else if (route === 'contact') {
    body = (
      <>
        <h1>Contact Kimani McLeish</h1>
        <p>Email <a href={`mailto:${EMAIL}`}>{EMAIL}</a>. Open to freelance builds and engineering roles.</p>
        <ul>{socials.map((s) => <li key={s.label}><a href={s.href}>{s.label}</a></li>)}</ul>
      </>
    )
  } else if (route === 'music') {
    body = (<><h1>Music: what Kimani is listening to</h1><p>A live feed of the tracks playing and recently played, from Spotify.</p></>)
  } else {
    body = (<><h1>Trash</h1><p>The old portfolio, a perfectly good cream-coloured page, and three bugs fixed.</p></>)
  }
  return (
    <>
      <article className="sr-only">{body}</article>
      {ld.map((d, i) => <Ld key={i} data={d} />)}
    </>
  )
}
