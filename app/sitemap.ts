import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'
import { cases } from '@/lib/content'
import { getPosts } from '@/lib/blog'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const top = ['', '/work', '/experience', '/freelance', '/resume', '/contact', '/music', '/blog']
  return [
    ...top.map((p) => ({ url: `${SITE_URL}${p}`, lastModified: now, changeFrequency: 'monthly' as const, priority: p === '' ? 1 : 0.8 })),
    ...cases.map((c) => ({ url: `${SITE_URL}/work/${c.slug}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.9 })),
    ...getPosts().map((p) => ({ url: `${SITE_URL}/blog/${p.slug}`, lastModified: new Date(p.date), changeFrequency: 'yearly' as const, priority: 0.7 })),
  ]
}
