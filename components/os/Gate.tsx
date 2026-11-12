'use client'
import { usePathname } from 'next/navigation'
import OSRoot from './OSRoot'
import { defByPath } from './routes'

/** The desktop for known routes (plus each route's server-rendered text for crawlers); everything else renders its own page (blog, the 404 terminal). */
export default function Gate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const def = defByPath(pathname)
  if (!def) return <>{children}</>
  // /blog: the desktop shows the Browser window; the server-rendered post stays in the page, visually hidden, for crawlers
  return <><OSRoot />{def.id === 'browser' ? <div className="sr-only">{children}</div> : children}</>
}
