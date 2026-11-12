/** A small, safe Markdown reader. It produces data (never HTML), so nothing is injected: headings, paragraphs, lists, code, quotes, rules, links and images. */
export type Inline =
  | { t: 'text'; v: string }
  | { t: 'b'; c: Inline[] }
  | { t: 'i'; c: Inline[] }
  | { t: 'code'; v: string }
  | { t: 'a'; href: string; c: Inline[] }
export type Block =
  | { t: 'h'; level: 2 | 3 | 4; id: string; c: Inline[] }
  | { t: 'p'; c: Inline[] }
  | { t: 'ul' | 'ol'; items: Inline[][] }
  | { t: 'code'; lang: string; v: string }
  | { t: 'quote'; c: Inline[] }
  | { t: 'img'; src: string; alt: string }
  | { t: 'hr' }

export const safeHref = (h: string) => (/^(https?:\/\/|mailto:|\/|#)/i.test(h.trim()) ? h.trim() : '#')
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
export const plain = (c: Inline[]): string => c.map((x) => ('v' in x ? x.v : plain(x.c))).join('')

export function inline(s: string): Inline[] {
  const out: Inline[] = []
  let i = 0, buf = ''
  const flush = () => { if (buf) { out.push({ t: 'text', v: buf }); buf = '' } }
  while (i < s.length) {
    const ch = s[i]
    if (ch === '\\' && i + 1 < s.length) { buf += s[i + 1]; i += 2; continue }
    if (ch === '`') { const e = s.indexOf('`', i + 1); if (e > i) { flush(); out.push({ t: 'code', v: s.slice(i + 1, e) }); i = e + 1; continue } }
    if ((ch === '*' && s[i + 1] === '*') || (ch === '_' && s[i + 1] === '_')) { const m = ch + ch, e = s.indexOf(m, i + 2); if (e > i + 2) { flush(); out.push({ t: 'b', c: inline(s.slice(i + 2, e)) }); i = e + 2; continue } }
    if (ch === '*' || ch === '_') { const e = s.indexOf(ch, i + 1); if (e > i + 1 && s[i + 1] !== ' ' && (ch === '*' || /\W/.test(s[i - 1] ?? ' '))) { flush(); out.push({ t: 'i', c: inline(s.slice(i + 1, e)) }); i = e + 1; continue } }
    if (ch === '[') {
      const m = /^\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/.exec(s.slice(i))
      if (m) { flush(); out.push({ t: 'a', href: safeHref(m[2]), c: inline(m[1]) }); i += m[0].length; continue }
    }
    buf += ch; i++
  }
  flush()
  return out
}

export function parseMarkdown(src: string): Block[] {
  const lines = src.replace(/\r\n?/g, '\n').split('\n')
  const blocks: Block[] = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    if (!line.trim()) { i++; continue }
    const fence = /^```\s*([\w+-]*)\s*$/.exec(line)
    if (fence) {
      const buf: string[] = []; i++
      while (i < lines.length && !/^```\s*$/.test(lines[i])) buf.push(lines[i++])
      i++; blocks.push({ t: 'code', lang: fence[1], v: buf.join('\n') }); continue
    }
    const h = /^(#{1,4})\s+(.*)$/.exec(line)
    if (h) { const c = inline(h[2].trim()); blocks.push({ t: 'h', level: Math.min(4, Math.max(2, h[1].length)) as 2 | 3 | 4, id: slugify(plain(c)), c }); i++; continue }
    if (/^(-{3,}|\*{3,})\s*$/.test(line)) { blocks.push({ t: 'hr' }); i++; continue }
    const img = /^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)\s*$/.exec(line)
    if (img) { const src = img[2]; blocks.push({ t: 'img', src: /^(https?:\/\/|\/)/.test(src) ? src : '/' + src, alt: img[1] }); i++; continue }
    if (/^>\s?/.test(line)) { const buf: string[] = []; while (i < lines.length && /^>\s?/.test(lines[i])) buf.push(lines[i++].replace(/^>\s?/, '')); blocks.push({ t: 'quote', c: inline(buf.join(' ')) }); continue }
    const li = /^(\s*)([-*]|\d+\.)\s+/.exec(line)
    if (li) {
      const ordered = /\d/.test(li[2]); const items: Inline[][] = []
      while (i < lines.length && /^(\s*)([-*]|\d+\.)\s+/.test(lines[i])) { items.push(inline(lines[i].replace(/^(\s*)([-*]|\d+\.)\s+/, ''))); i++ }
      blocks.push({ t: ordered ? 'ol' : 'ul', items }); continue
    }
    const buf: string[] = []
    while (i < lines.length && lines[i].trim() && !/^(#{1,4}\s|```|>\s?|(\s*)([-*]|\d+\.)\s+|!\[)/.test(lines[i])) buf.push(lines[i++].trim())
    blocks.push({ t: 'p', c: inline(buf.join(' ')) })
  }
  return blocks
}
