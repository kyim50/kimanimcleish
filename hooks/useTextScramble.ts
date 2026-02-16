'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`01'

export function useTextScramble(text: string, isVisible: boolean, speed = 30) {
  const [display, setDisplay] = useState(text)
  const hasAnimated = useRef(false)

  const scramble = useCallback(() => {
    if (hasAnimated.current) return
    hasAnimated.current = true

    let iteration = 0
    const maxIterations = text.length

    const interval = setInterval(() => {
      setDisplay(
        text
          .split('')
          .map((char, i) => {
            if (char === ' ') return ' '
            if (i < iteration) return text[i]
            return CHARS[Math.floor(Math.random() * CHARS.length)]
          })
          .join('')
      )

      iteration += 1 / 2

      if (iteration >= maxIterations) {
        setDisplay(text)
        clearInterval(interval)
      }
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed])

  useEffect(() => {
    if (isVisible && !hasAnimated.current) {
      const cleanup = scramble()
      return cleanup
    }
  }, [isVisible, scramble])

  return display
}
