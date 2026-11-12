import Link from 'next/link'
import Logo from '@/components/os/Logo'
import WindowArt from '@/components/os/art/WindowArt'
import s from './Shell.module.css'

/** A paper reading page for the blog. The desktop is a client app, so /blog routes are plain server pages inside a scroller. */
export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className={s.scroll}>
      <header className={s.top}>
        <Link href="/" className={s.grow}><Logo size={22} />kimani.os</Link>
        <Link href="/blog">Blog</Link>
        <Link href="/work">Work</Link>
        <Link href="/contact">Contact</Link>
      </header>
      <main className={s.wrap}>
        <div className={s.sheet}>
          <WindowArt app="blog" />
          <div className={s.inner}>{children}</div>
        </div>
      </main>
    </div>
  )
}
