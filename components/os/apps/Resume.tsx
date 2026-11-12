import WindowArt from '../art/WindowArt'
import s from './Apps.module.css'

export default function Resume() {
  return (
    <div className={s.resume}>
      <WindowArt app="resume" />
      <div className={s.rbar}>
        <span>Kimani-McLeish-Resume.pdf · 2 pages</span>
        <a className={s.btn} href="/Kimani-McLeish-Resume.pdf" download>Download</a>
      </div>
      <div className={s.pages}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/os/resume-1.webp" alt="Résumé, page 1" width={1100} height={1423} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/os/resume-2.webp" alt="Résumé, page 2" width={1100} height={1423} loading="lazy" />
      </div>
    </div>
  )
}
