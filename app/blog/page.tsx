import Link from 'next/link'
import { pageMeta } from '@/lib/seo'
import { getPosts, fmtDate } from '@/lib/blog'
import Shell from '@/components/blog/Shell'
import s from '@/components/blog/Shell.module.css'
import p from '@/components/blog/Prose.module.css'

export const metadata = pageMeta({ title: 'Blog', description: 'Notes from Kimani McLeish, a software engineer in Kingston: building apps, backends and data pipelines, and the portfolio that is an operating system.', path: '/blog' })

export default function BlogIndex() {
  const posts = getPosts()
  return (
    <Shell>
      <h1 className={s.h1}>Blog</h1>
      <p className={s.lede}>Notes on building apps, backends and data pipelines from Kingston.</p>
      {posts.length === 0 ? (
        <div className={p.empty}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/os/art/res-doc.webp" alt="A blank paper page" width={150} height={198} />
          <h2>Nothing here yet</h2>
          <p>The first post is being written. In the meantime, read a <Link href="/work/cite">case file</Link>.</p>
        </div>
      ) : (
        <ul className={p.list}>
          {posts.map((x) => (
            <li key={x.slug}>
              <Link href={`/blog/${x.slug}`} className={p.post}>
                <div className={p.meta}>{x.draft && <span className={p.draft}>Draft</span>}<time dateTime={x.date}>{fmtDate(x.date)}</time><span>{x.minutes} min read</span></div>
                <h2>{x.title}</h2>
                <p>{x.summary}</p>
                {x.tags.length > 0 && <ul className={p.chips}>{x.tags.map((t) => <li key={t}>{t}</li>)}</ul>}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Shell>
  )
}
