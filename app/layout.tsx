import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import Gate from '@/components/os/Gate'
import { SITE_URL, SITE_NAME, OG_IMAGE, OG_ALT } from '@/lib/site'

const sans = localFont({ src: './fonts/Geist-Variable.woff2', variable: '--font-sans', weight: '100 900', display: 'swap' })
const mono = localFont({ src: './fonts/GeistMono-Variable.woff2', variable: '--font-mono', weight: '100 900', display: 'swap' })

const description =
  'Kimani McLeish is a software engineer in Kingston, Jamaica building production systems end to end: the app, the backend, the data pipelines and the infrastructure. Open to freelance builds.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Kimani McLeish, software engineer in Kingston', template: `%s | ${SITE_NAME}` },
  description,
  applicationName: 'kimaniOS',
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  keywords: ['Kimani McLeish', 'software engineer', 'Kingston Jamaica', 'freelance developer Jamaica', 'Go', 'TypeScript', 'React Native', 'PostgreSQL'],
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  openGraph: { title: 'Kimani McLeish, software engineer in Kingston', description, url: SITE_URL, siteName: SITE_NAME, type: 'website', locale: 'en_JM', images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: OG_ALT }] },
  twitter: { card: 'summary_large_image', title: 'Kimani McLeish, software engineer in Kingston', description, images: [OG_IMAGE] },
}
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#F3EEE3' }

const PRE = `try{var d=document.documentElement;var t=localStorage.getItem('kos_theme')||'light';d.setAttribute('data-theme',t);d.style.colorScheme=t;if(location.pathname==='/'&&!sessionStorage.getItem('kos_user')&&!/[?&]os=desktop/.test(location.search))d.classList.add('pre')}catch(e){}`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: PRE }} /></head>
      <body>
        <Gate>{children}</Gate>
      </body>
    </html>
  )
}
