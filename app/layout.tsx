import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import AnimatedBackground from '@/components/AnimatedBackground'
import CursorGlow from '@/components/CursorGlow'
import ScrollProgress from '@/components/ScrollProgress'
import SpotifyPlayer from '@/components/SpotifyPlayer'
import ThemeProvider from '@/components/ThemeProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Kimani McLeish - Software Engineer',
  description: 'Software engineer and creative developer from Kingston, Jamaica building intelligent applications and digital experiences.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem('theme')||'dark';document.documentElement.setAttribute('data-theme',t);document.documentElement.classList.add(t);document.documentElement.style.colorScheme=t}catch(e){}` }} />
      </head>
      <body className={`${inter.className}`} style={{ backgroundColor: '#000', color: '#fff', transition: 'background-color 0.3s ease, color 0.3s ease' }}>
        <ThemeProvider>
          <CursorGlow />
          <AnimatedBackground />
          <Navigation />
          <ScrollProgress />
          <main className="relative z-10">{children}</main>
          <SpotifyPlayer />
        </ThemeProvider>
      </body>
    </html>
  )
}
