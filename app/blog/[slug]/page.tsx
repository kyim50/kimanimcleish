import Link from 'next/link'
import { notFound } from 'next/navigation'
import { pageMeta, person } from '@/lib/seo'
import { abs } from '@/lib/site'
import { getPosts, getPost, fmtDate } from '@/lib/blog'
import Shell from '@/components/blog/Shell'
import Blocks from '@/components/blog/Blocks'
import s from '@/components/blog/Shell.module.css'
import p from '@/components/blog/Prose.module.css'

export const dynamicParams = false
export function generateStaticParams() { return getPosts().map((x) => ({ slug: x.slug })) }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}
  return { ...pageMeta({ title: post.title, description: post.summary, path: `/blog/${slug}`, type: 'article', published: post.date, tags: post.tags }), ...(post.draft ? { robots: { index: false, follow: false } } : {}) }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()
  const ld = {
    '@context': 'https://schema.org', '@type': 'BlogPosting', headline: post.title, description: post.summary, datePublished: post.date,
    author: { '@type': 'Person', name: person.name, url: abs('/') }, mainEntityOfPage: abs(`/blog/${slug}`), image: abs('/og.jpg'), keywords: post.tags.join(', '),
  }
  return (
    <Shell>
      <article>
        <div className={p.meta}>{post.draft && <span className={p.draft}>Draft, only you can see this</span>}<time dateTime={post.date}>{fmtDate(post.date)}</time><span>{post.minutes} min read</span></div>
        <h1 className={s.h1}>{post.title}</h1>
        {post.summary && <p className={s.lede}>{post.summary}</p>}
        <div className={p.prose}><Blocks blocks={post.blocks} /></div>
        {post.tags.length > 0 && <ul className={p.chips} style={{ marginTop: 28 }}>{post.tags.map((t) => <li key={t}>{t}</li>)}</ul>}
      </article>
      <div className={s.foot}><Link href="/blog" className={s.btn}>All posts</Link><Link href="/" className={s.btn}>Back to the desktop</Link></div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, '\\u003c') }} />
    </Shell>
  )
}
