'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useOSActions } from '../store'
import { defByPath } from '../routes'
import WindowArt from '../art/WindowArt'
import Blocks from '@/components/blog/Blocks'
import type { Post } from '@/lib/blog'
import p from '@/components/blog/Prose.module.css'
import s from './Browser.module.css'

type Tab = { id: number; hist: string[]; idx: number }
const HOME = '/blog'
const ico = (d: string) => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d={d} /></svg>
const fmt = (d: string) => new Date(d + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })

export default function Browser({ start = HOME }: { start?: string }) {
  const a = useOSActions()
  const [posts, setPosts] = useState<Post[] | null>(null)
  const [tabs, setTabs] = useState<Tab[]>([{ id: 1, hist: [start], idx: 0 }])
  const [cur, setCur] = useState(1)
  const [spin, setSpin] = useState(false)
  const [nonce, setNonce] = useState(0)
  const next = useRef(2)
  const cursor = tabs.find((t) => t.id === cur) ?? tabs[0]
  const curPath = cursor.hist[cursor.idx]
  useEffect(() => { a.setBlogPath(curPath) }, [curPath, a])

  const load = useCallback(() => { fetch('/api/blog').then((r) => r.json()).then((d) => setPosts(d.posts)).catch(() => setPosts([])) }, [])
  useEffect(() => { load() }, [load])

  const tab = tabs.find((t) => t.id === cur) ?? tabs[0]
  const path = tab.hist[tab.idx]
  const slug = path.startsWith('/blog/') ? path.slice(6) : null
  const post = slug ? posts?.find((x) => x.slug === slug) : undefined
  const title = (t: Tab) => { const pp = t.hist[t.idx]; const sl = pp.startsWith('/blog/') ? pp.slice(6) : null; return sl ? posts?.find((x) => x.slug === sl)?.title ?? 'Post' : 'Blog' }
  const upd = (fn: (t: Tab) => Tab) => setTabs((ts) => ts.map((t) => (t.id === tab.id ? fn(t) : t)))
  const go = (to: string) => { upd((t) => ({ ...t, hist: [...t.hist.slice(0, t.idx + 1), to], idx: t.idx + 1 })); setNonce((n) => n + 1) }
  const back = () => { upd((t) => ({ ...t, idx: Math.max(0, t.idx - 1) })); setNonce((n) => n + 1) }
  const fwd = () => { upd((t) => ({ ...t, idx: Math.min(t.hist.length - 1, t.idx + 1) })); setNonce((n) => n + 1) }
  const reload = () => { setSpin(true); setPosts(null); setTimeout(() => { load(); setSpin(false); setNonce((n) => n + 1) }, 600) }
  const newTab = () => { const id = next.current++; setTabs((ts) => [...ts, { id, hist: [HOME], idx: 0 }]); setCur(id) }
  const close = (id: number) => {
    if (tabs.length === 1) { setTabs([{ id: next.current++, hist: [HOME], idx: 0 }]); setCur(next.current - 1); return }
    const rest = tabs.filter((t) => t.id !== id); setTabs(rest); if (cur === id) setCur(rest[rest.length - 1].id)
  }

  const onLink = (href: string, e: React.MouseEvent) => {
    if (/^https?:\/\//i.test(href)) { e.preventDefault(); window.open(href, '_blank', 'noopener,noreferrer'); return }
    if (href.startsWith('/blog')) { e.preventDefault(); go(href.replace(/\/$/, '') || HOME); return }
    const def = defByPath(href)
    if (def) { e.preventDefault(); a.open(def.id) }
  }

  return (
    <div className={s.browser}>
      <div className={s.tabs} role="tablist">
        {tabs.map((t) => (
          <div key={t.id} role="tab" aria-selected={t.id === cur} tabIndex={0} className={`${s.tab} ${t.id === cur ? s.on : ''}`} onClick={() => setCur(t.id)} onKeyDown={(e) => { if (e.key === 'Enter') setCur(t.id) }}>
            <span>{title(t)}</span>
            <button type="button" className={s.x} aria-label={`Close tab ${title(t)}`} onClick={(e) => { e.stopPropagation(); close(t.id) }}>{ico('M6 6l12 12M18 6L6 18')}</button>
          </div>
        ))}
        <button type="button" className={s.plus} aria-label="New tab" onClick={newTab}>{ico('M12 5v14M5 12h14')}</button>
      </div>
      <div className={s.bar}>
        <button type="button" className={s.nav} aria-label="Back" disabled={tab.idx === 0} onClick={back}>{ico('M15 5l-7 7 7 7')}</button>
        <button type="button" className={s.nav} aria-label="Forward" disabled={tab.idx >= tab.hist.length - 1} onClick={fwd}>{ico('M9 5l7 7-7 7')}</button>
        <button type="button" className={s.nav} aria-label="Reload" onClick={reload}><span className={spin ? s.spin : ''} style={{ display: 'grid' }}>{ico('M20 12a8 8 0 1 1-2.6-5.9M20 4v5h-5')}</span></button>
        <div className={s.url} aria-label="Address"><i>kimani.os</i>{path}</div>
      </div>
      <div key={nonce} className={`${s.page} ${s.fade}`}>
        <div className={s.sheet}>
          <WindowArt app="blog" />
          <div className={s.inner}>
            {posts === null ? (
              <p className={p.meta}>Loading…</p>
            ) : slug ? (
              post ? (
                <article>
                  <div className={p.meta}>{post.draft && <span className={p.draft}>Draft</span>}<time dateTime={post.date}>{fmt(post.date)}</time><span>{post.minutes} min read</span></div>
                  <h2 className={s.h1}>{post.title}</h2>
                  {post.summary && <p className={s.lede}>{post.summary}</p>}
                  <div className={p.prose}><Blocks blocks={post.blocks} onLink={onLink} /></div>
                  <button type="button" className={s.back} onClick={() => go(HOME)}>All posts</button>
                </article>
              ) : (
                <div className={p.empty}><h2>Page not found</h2><p>That post is not here. <a href="/blog" onClick={(e) => { e.preventDefault(); go(HOME) }}>Back to the blog</a>.</p></div>
              )
            ) : (
              <>
                <h2 className={s.h1}>Blog</h2>
                <p className={s.lede}>Notes on building apps, backends and data pipelines from Kingston.</p>
                {posts.length === 0 ? (
                  <div className={p.empty}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/os/art/res-doc.webp" alt="A blank paper page" width={150} height={198} />
                    <h2>Nothing here yet</h2><p>The first post is being written. Check back soon.</p>
                  </div>
                ) : (
                  <ul className={p.list}>
                    {posts.map((x) => (
                      <li key={x.slug}>
                        <button type="button" className={p.post} onClick={() => go(`/blog/${x.slug}`)}>
                          <div className={p.meta}>{x.draft && <span className={p.draft}>Draft</span>}<time dateTime={x.date}>{fmt(x.date)}</time><span>{x.minutes} min read</span></div>
                          <h2>{x.title}</h2><p>{x.summary}</p>
                          {x.tags.length > 0 && <ul className={p.chips}>{x.tags.map((t) => <li key={t}>{t}</li>)}</ul>}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
