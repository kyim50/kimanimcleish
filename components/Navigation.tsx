'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useRef, useCallback } from 'react'
import { useTheme } from './ThemeProvider'

function MagneticLink({ href, children, className, style }: { href: string; children: React.ReactNode; className: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLAnchorElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const deltaX = (e.clientX - centerX) * 0.25
    const deltaY = (e.clientY - centerY) * 0.25
    ref.current.style.transform = `translate(${deltaX}px, ${deltaY}px)`
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (!ref.current) return
    ref.current.style.transform = 'translate(0px, 0px)'
  }, [])

  return (
    <Link
      ref={ref}
      href={href}
      className={`${className} magnetic-el`}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </Link>
  )
}

export default function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { theme, toggle } = useTheme()
  const isLight = theme === 'light'

  const links = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/projects', label: 'Projects' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md transition-colors duration-300"
        style={{ backgroundColor: isLight ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)' }}
      >
        <div className="max-w-3xl mx-auto flex justify-between items-center px-6 py-4">
          <Link href="/" className="flex items-center group">
            <span
              className="font-mono text-sm transition-colors duration-300 group-hover:animate-glitch tracking-tight"
              style={{ color: isLight ? '#555' : '#9ca3af' }}
            >[km]</span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex gap-1">
            {links.map((link) => {
              const isActive = pathname === link.href
              return (
                <li key={link.href}>
                  <MagneticLink
                    href={link.href}
                    className={`px-3 py-1.5 rounded-md text-sm transition-all duration-200 inline-block ${
                      isActive
                        ? isLight
                          ? 'bg-[#e8e8e8] text-[#111] font-medium'
                          : 'bg-[#1a1a1a] text-white font-medium'
                        : isLight
                          ? 'text-[#555] hover:text-[#111] hover:bg-[#f0f0f0]'
                          : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
                    }`}
                  >
                    {link.label}
                  </MagneticLink>
                </li>
              )
            })}
          </ul>

          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggle}
              className="w-8 h-8 flex items-center justify-center rounded-md transition-colors duration-300 hover:opacity-80"
              style={{ color: isLight ? '#555' : '#9ca3af' }}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Hamburger button - mobile only */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden w-8 h-8 flex flex-col items-center justify-center gap-1.5 transition-colors"
              style={{ color: isLight ? '#555' : '#9ca3af' }}
              aria-label="Toggle menu"
            >
              <span className={`w-5 h-px bg-current transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-[4px]' : ''}`} />
              <span className={`w-5 h-px bg-current transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`} />
              <span className={`w-5 h-px bg-current transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-[4px]' : ''}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-40 backdrop-blur-lg flex flex-col items-center justify-center transition-all duration-500 md:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        style={{ backgroundColor: isLight ? 'rgba(255,255,255,0.95)' : 'rgba(0,0,0,0.95)' }}
      >
        <pre className="ascii-art text-[9px] mb-8 leading-[1.3]" style={{ color: isLight ? '#aaa' : '#374151' }}>
{`  ╭──────────────────╮
  │  ~/navigation    │
  │  > ls -la        │
  ╰──────────────────╯`}
        </pre>
        <ul className="flex flex-col items-center gap-6">
          {links.map((link, i) => (
            <li
              key={link.href}
              className={`transition-all duration-500 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
              style={{ transitionDelay: isOpen ? `${(i + 1) * 80}ms` : '0ms' }}
            >
              <Link
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-2xl font-mono transition-colors duration-300"
                style={{ color: pathname === link.href ? (isLight ? '#111' : '#fff') : (isLight ? '#888' : '#6b7280') }}
              >
                <span className="text-sm mr-2" style={{ color: isLight ? '#aaa' : '#374151' }}>{`>`}</span>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <pre className="ascii-art text-[9px] mt-8 leading-[1.3]" style={{ color: isLight ? '#aaa' : '#374151' }}>
{`  ───────────────────`}
        </pre>
      </div>
    </>
  )
}
