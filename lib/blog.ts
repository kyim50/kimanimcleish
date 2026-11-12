import fs from 'node:fs'
import path from 'node:path'
import { parseMarkdown, plain, type Block } from './markdown'

export type PostMeta = { slug: string; title: string; date: string; summary: string; tags: string[]; draft: boolean; minutes: number }
export type Post = PostMeta & { blocks: Block[] }

const DIR = path.join(process.cwd(), 'content', 'blog')
// Drafts show in development only.
const showDrafts = () => process.env.NODE_ENV !== 'production'

function frontmatter(raw: string): { data: Record<string, string>; body: string } {
  const m = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(raw.replace(/\r\n?/g, '\n'))
  if (!m) return { data: {}, body: raw }
  const data: Record<string, string> = {}
  for (const l of m[1].split('\n')) { const k = /^([A-Za-z_]+):\s*(.*)$/.exec(l); if (k) data[k[1]] = k[2].trim().replace(/^["']|["']$/g, '') }
  return { data, body: m[2] }
}

function read(file: string): Post {
  const { data, body } = frontmatter(fs.readFileSync(path.join(DIR, file), 'utf8'))
  const blocks = parseMarkdown(body)
  const words = blocks.reduce((n, b) => n + ('c' in b ? plain(b.c).split(/\s+/).length : 'items' in b ? b.items.reduce((m, it) => m + plain(it).split(/\s+/).length, 0) : 0), 0)
  const tags = (data.tags || '').replace(/^\[|\]$/g, '').split(',').map((t) => t.trim()).filter(Boolean)
  return {
    slug: file.replace(/\.md$/, ''),
    title: data.title || file.replace(/\.md$/, ''),
    date: data.date || '1970-01-01',
    summary: data.summary || '',
    tags,
    draft: data.draft === 'true',
    minutes: Math.max(1, Math.round(words / 200)),
    blocks,
  }
}

export function getPosts(): Post[] {
  if (!fs.existsSync(DIR)) return []
  return fs.readdirSync(DIR).filter((f) => f.endsWith('.md'))
    .map(read).filter((p) => showDrafts() || !p.draft)
    .sort((a, b) => b.date.localeCompare(a.date))
}
export const getPost = (slug: string) => getPosts().find((p) => p.slug === slug)
export const fmtDate = (d: string) => new Date(d + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
