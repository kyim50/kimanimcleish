'use client'

import { useEffect, useState } from 'react'

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = Math.max(0, window.scrollY)
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight > 0) {
        setProgress(Math.max(0, Math.min(100, Math.round((scrollTop / docHeight) * 100))))
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const totalBlocks = 20
  const clampedProgress = Math.max(0, Math.min(100, progress))
  const filled = Math.max(0, Math.min(totalBlocks, Math.round((clampedProgress / 100) * totalBlocks)))
  const empty = totalBlocks - filled

  return (
    <div className="scroll-progress-bar" aria-hidden="true">
      <span className="text-gray-400 dark:text-gray-600 font-mono text-[10px] tracking-tight">
        [{'█'.repeat(filled)}{'░'.repeat(empty)}] {clampedProgress}%
      </span>
    </div>
  )
}
