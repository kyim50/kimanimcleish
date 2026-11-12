import type { Block, Inline } from '@/lib/markdown'

export function Inlines({ c, onLink }: { c: Inline[]; onLink?: (href: string, e: React.MouseEvent) => void }) {
  return (
    <>
      {c.map((x, i) => {
        if (x.t === 'text') return x.v
        if (x.t === 'b') return <strong key={i}><Inlines c={x.c} onLink={onLink} /></strong>
        if (x.t === 'i') return <em key={i}><Inlines c={x.c} onLink={onLink} /></em>
        if (x.t === 'code') return <code key={i}>{x.v}</code>
        const ext = /^https?:\/\//i.test(x.href)
        return <a key={i} href={x.href} {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})} onClick={onLink ? (e) => onLink(x.href, e) : undefined}><Inlines c={x.c} onLink={onLink} /></a>
      })}
    </>
  )
}

/** Renders parsed Markdown. Works on the server and inside the Browser window. */
export default function Blocks({ blocks, onLink }: { blocks: Block[]; onLink?: (href: string, e: React.MouseEvent) => void }) {
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.t) {
          case 'h': { const H = `h${b.level}` as 'h2' | 'h3' | 'h4'; return <H key={i} id={b.id}><Inlines c={b.c} onLink={onLink} /></H> }
          case 'p': return <p key={i}><Inlines c={b.c} onLink={onLink} /></p>
          case 'ul': return <ul key={i}>{b.items.map((it, j) => <li key={j}><Inlines c={it} onLink={onLink} /></li>)}</ul>
          case 'ol': return <ol key={i}>{b.items.map((it, j) => <li key={j}><Inlines c={it} onLink={onLink} /></li>)}</ol>
          case 'code': return <pre key={i} data-lang={b.lang || undefined}><code>{b.v}</code></pre>
          case 'quote': return <blockquote key={i}><Inlines c={b.c} onLink={onLink} /></blockquote>
          case 'img': // eslint-disable-next-line @next/next/no-img-element
            return <figure key={i}><img src={b.src} alt={b.alt} loading="lazy" />{b.alt && <figcaption>{b.alt}</figcaption>}</figure>
          case 'hr': return <hr key={i} />
        }
      })}
    </>
  )
}
