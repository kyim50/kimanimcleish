'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

const ThemeContext = createContext<{
  theme: Theme
  toggle: () => void
}>({ theme: 'dark', toggle: () => {} })

export function useTheme() {
  return useContext(ThemeContext)
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  const body = document.body

  root.setAttribute('data-theme', theme)
  root.classList.remove('dark', 'light')
  root.classList.add(theme)

  if (theme === 'light') {
    body.style.backgroundColor = '#ffffff'
    body.style.color = '#111111'
  } else {
    body.style.backgroundColor = '#000000'
    body.style.color = '#ffffff'
  }
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme | null
    const initial = stored || 'dark'
    setTheme(initial)
    applyTheme(initial)
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    applyTheme(theme)
    localStorage.setItem('theme', theme)
  }, [theme, mounted])

  const toggle = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark')

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}
