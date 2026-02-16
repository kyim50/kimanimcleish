'use client'

import { useEffect, useState, useRef } from 'react'
import { useTheme } from './ThemeProvider'

interface Cloud {
  id: number
  art: string
  top: number
  speed: number
  opacity: number
  size: number
}

interface Bird {
  id: number
  top: number
  speed: number
  delay: number
  flip: boolean
}

interface Star {
  id: number
  top: number
  left: number
  delay: number
  char: string
}

interface Particle {
  id: number
  top: number
  left: number
  delay: number
  char: string
}

interface MatrixColumn {
  id: number
  left: number
  speed: number
  delay: number
  chars: string
  opacity: number
}

interface CodeSnippet {
  id: number
  top: number
  left: number
  delay: number
  speed: number
  text: string
  opacity: number
}

interface CircuitLine {
  id: number
  top: number
  left: number
  width: number
  delay: number
  vertical: boolean
}

export default function AnimatedBackground() {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()
  const isLight = theme === 'light'
  const scrollRef = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const starsLayerRef = useRef<HTMLDivElement>(null)
  const matrixLayerRef = useRef<HTMLDivElement>(null)
  const codeLayerRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const handleScroll = () => {
      scrollRef.current = window.scrollY
    }

    const animate = () => {
      const y = scrollRef.current
      if (starsLayerRef.current) {
        starsLayerRef.current.style.transform = `translateY(${y * 0.05}px)`
      }
      if (matrixLayerRef.current) {
        matrixLayerRef.current.style.transform = `translateY(${y * 0.02}px)`
      }
      if (codeLayerRef.current) {
        codeLayerRef.current.style.transform = `translateY(${y * 0.08}px)`
      }
      rafRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(rafRef.current)
    }
  }, [mounted])

  if (!mounted) return null

  const clouds: Cloud[] = [
    { id: 1, art: '_(  )_', top: 8, speed: 45, opacity: 0.06, size: 12 },
    { id: 2, art: '(__    )', top: 15, speed: 60, opacity: 0.04, size: 10 },
    { id: 3, art: '_(   )__', top: 25, speed: 80, opacity: 0.05, size: 11 },
    { id: 4, art: '(    )', top: 35, speed: 55, opacity: 0.03, size: 10 },
    { id: 5, art: '__(  )_', top: 50, speed: 70, opacity: 0.04, size: 12 },
    { id: 6, art: '_(  )__', top: 65, speed: 50, opacity: 0.05, size: 11 },
    { id: 7, art: '(   )', top: 78, speed: 65, opacity: 0.03, size: 10 },
    { id: 8, art: '__(   )_', top: 88, speed: 75, opacity: 0.04, size: 12 },
  ]

  const birds: Bird[] = [
    { id: 1, top: 12, speed: 18, delay: 0, flip: false },
    { id: 2, top: 22, speed: 22, delay: 4, flip: true },
    { id: 3, top: 38, speed: 15, delay: 8, flip: false },
    { id: 4, top: 55, speed: 20, delay: 2, flip: true },
    { id: 5, top: 70, speed: 17, delay: 6, flip: false },
    { id: 6, top: 45, speed: 25, delay: 10, flip: true },
  ]

  const stars: Star[] = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    top: Math.round((i * 37 + 13) % 95),
    left: Math.round((i * 53 + 7) % 95),
    delay: (i * 0.7) % 5,
    char: ['*', '.', '+', '*', '.', '`'][i % 6],
  }))

  const particles: Particle[] = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    top: Math.round((i * 41 + 19) % 90),
    left: Math.round((i * 61 + 11) % 90),
    delay: (i * 1.3) % 6,
    char: ['~', '-', '.', '`', ',', '~'][i % 6],
  }))

  const matrixChars = '01{}[]<>/\\|=-+*#@&%$!?;:_.~^'
  const matrixColumns: MatrixColumn[] = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    left: Math.round((i * 39 + 2) % 97),
    speed: 8 + (i * 2.3) % 14,
    delay: (i * 1.3) % 8,
    chars: Array.from({ length: 12 + (i % 8) }, (_, j) =>
      matrixChars[(i * 7 + j * 13) % matrixChars.length]
    ).join('\n'),
    opacity: 0.08 + (i % 4) * 0.03,
  }))

  const codeSnippets: CodeSnippet[] = [
    { id: 0, top: 10, left: 5, delay: 0, speed: 20, text: 'const x = () => {', opacity: 0.08 },
    { id: 1, top: 30, left: 80, delay: 4, speed: 25, text: 'if (true) {', opacity: 0.06 },
    { id: 2, top: 50, left: 15, delay: 8, speed: 22, text: 'return null;', opacity: 0.08 },
    { id: 3, top: 70, left: 70, delay: 2, speed: 18, text: '} catch (e) {', opacity: 0.06 },
    { id: 4, top: 20, left: 90, delay: 6, speed: 24, text: 'async function', opacity: 0.08 },
    { id: 5, top: 85, left: 40, delay: 10, speed: 20, text: 'npm run dev', opacity: 0.06 },
    { id: 6, top: 45, left: 55, delay: 3, speed: 26, text: 'git commit -m', opacity: 0.08 },
    { id: 7, top: 60, left: 25, delay: 7, speed: 21, text: '<Component />', opacity: 0.06 },
    { id: 8, top: 15, left: 65, delay: 11, speed: 23, text: 'import { }', opacity: 0.08 },
    { id: 9, top: 75, left: 10, delay: 5, speed: 19, text: '=> Promise<>', opacity: 0.06 },
  ]

  const circuitLines: CircuitLine[] = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    top: Math.round((i * 47 + 5) % 90),
    left: Math.round((i * 59 + 3) % 90),
    width: 30 + (i * 17) % 70,
    delay: (i * 1.7) % 8,
    vertical: i % 3 === 0,
  }))

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* Stars layer - slowest parallax */}
      <div ref={starsLayerRef} className="absolute inset-0 will-change-transform">
        {stars.map((star) => (
          <span
            key={`star-${star.id}`}
            className="absolute ascii-art star-twinkle"
            style={{
              top: `${star.top}%`,
              left: `${star.left}%`,
              animationDelay: `${star.delay}s`,
              fontSize: '11px',
              color: isLight ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.15)',
            }}
          >
            {star.char}
          </span>
        ))}

        {/* Floating particles */}
        {particles.map((p) => (
          <span
            key={`particle-${p.id}`}
            className="absolute ascii-art particle-drift"
            style={{
              top: `${p.top}%`,
              left: `${p.left}%`,
              animationDelay: `${p.delay}s`,
              fontSize: '11px',
              color: isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
            }}
          >
            {p.char}
          </span>
        ))}
      </div>

      {/* Matrix rain layer - medium parallax */}
      <div ref={matrixLayerRef} className="absolute inset-0 will-change-transform">
        {matrixColumns.map((col) => (
          <pre
            key={`matrix-${col.id}`}
            className="absolute ascii-art matrix-column"
            style={{
              left: `${col.left}%`,
              top: 0,
              animationDuration: `${col.speed}s`,
              animationDelay: `${col.delay}s`,
              fontSize: '12px',
              lineHeight: '1.6',
              color: isLight ? `rgba(0, 130, 40, ${col.opacity * 1.8})` : `rgba(0, 255, 70, ${col.opacity})`,
            }}
          >
            {col.chars}
          </pre>
        ))}

        {/* Circuit board pattern */}
        {circuitLines.map((line) => (
          <div
            key={`circuit-${line.id}`}
            className="absolute circuit-line"
            style={{
              top: `${line.top}%`,
              left: `${line.left}%`,
              width: line.vertical ? '1px' : `${line.width}px`,
              height: line.vertical ? `${line.width}px` : '1px',
              background: isLight ? 'rgba(0, 130, 40, 0.06)' : 'rgba(0, 255, 70, 0.04)',
              animationDuration: `${4 + line.delay}s`,
              animationDelay: `${line.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Code snippets layer - fastest parallax */}
      <div ref={codeLayerRef} className="absolute inset-0 will-change-transform">
        {codeSnippets.map((snippet) => (
          <span
            key={`code-${snippet.id}`}
            className="absolute ascii-art code-float"
            style={{
              top: `${snippet.top}%`,
              left: `${snippet.left}%`,
              animationDuration: `${snippet.speed}s`,
              animationDelay: `${snippet.delay}s`,
              fontSize: '10px',
              color: isLight ? `rgba(30, 80, 160, ${snippet.opacity * 1.5})` : `rgba(100, 200, 255, ${snippet.opacity})`,
            }}
          >
            {snippet.text}
          </span>
        ))}
      </div>

      {/* Clouds drifting - no parallax (fixed feel) */}
      {clouds.map((cloud) => (
        <div
          key={`cloud-${cloud.id}`}
          className="absolute ascii-art cloud-drift"
          style={{
            top: `${cloud.top}%`,
            animationDuration: `${cloud.speed}s`,
            opacity: isLight ? cloud.opacity * 2 : cloud.opacity,
            fontSize: `${cloud.size}px`,
            color: isLight ? '#aaa' : 'white',
          }}
        >
          {cloud.art}
        </div>
      ))}

      {/* Birds flying - no parallax */}
      {birds.map((bird) => (
        <div
          key={`bird-${bird.id}`}
          className={`absolute ascii-art ${bird.flip ? 'bird-fly-left' : 'bird-fly-right'}`}
          style={{
            top: `${bird.top}%`,
            animationDuration: `${bird.speed}s`,
            animationDelay: `${bird.delay}s`,
            fontSize: '11px',
            color: isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.07)',
          }}
        >
          <span className="bird-flap">{bird.flip ? 'v' : 'v'}</span>
        </div>
      ))}
    </div>
  )
}
