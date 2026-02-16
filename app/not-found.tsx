'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

const GLITCH_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`'

export default function NotFound() {
  const [glitchText, setGlitchText] = useState('page_not_found')
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [currentInput, setCurrentInput] = useState('')
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      const text = 'page_not_found'
      const glitched = text.split('').map((char, i) => {
        if (Math.random() > 0.9) {
          return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
        }
        return char
      }).join('')
      setGlitchText(glitched)

      setTimeout(() => setGlitchText('page_not_found'), 150)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setTimeout(() => setShowHint(true), 4000)
  }, [])

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase()
    let response = ''

    if (trimmed === 'help') {
      response = 'available: help, home, ls, whoami, clear, sudo'
    } else if (trimmed === 'home' || trimmed === 'cd /' || trimmed === 'cd /home') {
      response = 'redirecting...'
      setCommandHistory((prev) => [...prev, `> ${cmd}`, response])
      setTimeout(() => { window.location.href = '/' }, 800)
      return
    } else if (trimmed === 'ls') {
      response = '/home  /about  /projects  /contact'
    } else if (trimmed === 'whoami') {
      response = 'lost_visitor_404'
    } else if (trimmed === 'clear') {
      setCommandHistory([])
      return
    } else if (trimmed.startsWith('sudo')) {
      response = 'nice try. you are not in the sudoers file.'
    } else if (trimmed === 'cd about' || trimmed === 'cd /about') {
      response = 'redirecting to /about...'
      setCommandHistory((prev) => [...prev, `> ${cmd}`, response])
      setTimeout(() => { window.location.href = '/about' }, 800)
      return
    } else if (trimmed === 'cd projects' || trimmed === 'cd /projects') {
      response = 'redirecting to /projects...'
      setCommandHistory((prev) => [...prev, `> ${cmd}`, response])
      setTimeout(() => { window.location.href = '/projects' }, 800)
      return
    } else if (trimmed === 'cd contact' || trimmed === 'cd /contact') {
      response = 'redirecting to /contact...'
      setCommandHistory((prev) => [...prev, `> ${cmd}`, response])
      setTimeout(() => { window.location.href = '/contact' }, 800)
      return
    } else if (trimmed === '') {
      return
    } else {
      response = `command not found: ${trimmed}. type "help" for options.`
    }

    setCommandHistory((prev) => [...prev, `> ${cmd}`, response])
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-lg w-full">
        <pre className="ascii-art text-gray-600 text-[10px] mb-6 inline-block leading-[1.3] animate-fade-in">
{`   ╭──────────────────────────────────────╮
   │                                      │
   │   ██╗  ██╗ ██████╗ ██╗  ██╗         │
   │   ██║  ██║██╔═████╗██║  ██║         │
   │   ███████║██║██╔██║███████║         │
   │   ╚════██║████╔╝██║╚════██║         │
   │        ██║╚██████╔╝     ██║         │
   │        ╚═╝ ╚═════╝      ╚═╝         │
   │                                      │
   │   ${glitchText.padEnd(20)}               │
   │                                      │
   ╰──────────────────────────────────────╯`}
        </pre>

        <h1 className="text-2xl font-semibold mb-2 animate-fade-in-up">Page Not Found</h1>
        <p className="text-gray-400 text-sm mb-6 animate-fade-in-up delay-100">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Interactive Terminal */}
        <div className="text-left mb-6 animate-fade-in-up delay-300">
          <div className="rounded-lg overflow-hidden bg-[#0a0a0a] border border-[#222]">
            <div className="flex items-center gap-2 px-3 py-2 bg-[#111] border-b border-[#222]">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500/70" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/70" />
                <div className="w-2 h-2 rounded-full bg-green-500/70" />
              </div>
              <span className="text-gray-500 text-[10px] font-mono">~/lost</span>
            </div>
            <div className="p-3 max-h-32 overflow-y-auto">
              {commandHistory.map((line, i) => (
                <div
                  key={i}
                  className={`text-[11px] font-mono ${
                    line.startsWith('>') ? 'text-gray-300' : 'text-gray-500'
                  } ${line.includes('redirecting') ? 'text-green-500' : ''} ${line.includes('not found') || line.includes('nice try') ? 'text-red-400' : ''}`}
                >
                  {line}
                </div>
              ))}
              <div className="flex items-center gap-1 text-[11px] font-mono">
                <span className="text-green-500">~$</span>
                <input
                  type="text"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleCommand(currentInput)
                      setCurrentInput('')
                    }
                  }}
                  className="flex-1 bg-transparent text-gray-300 outline-none"
                  placeholder={showHint ? 'type "help" or "home"...' : ''}
                  autoFocus
                />
                <span className="terminal-cursor text-green-500">_</span>
              </div>
            </div>
          </div>
        </div>

        <Link
          href="/"
          className="inline-block border border-gray-200 dark:border-[#333] px-6 py-2 rounded-lg text-sm text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] hover:border-gray-300 dark:hover:border-[#555] hover:text-black dark:hover:text-white transition-all duration-300 font-mono animate-fade-in-up delay-400"
        >
          ~$ cd /home
        </Link>

        {/* Fun glitch ASCII */}
        <div className="ascii-art text-gray-700 text-[9px] mt-8 animate-pulse-glow">
{`  ╭──────────────────────────────╮
  │  error: page.tsx not found   │
  │  suggestion: go home?        │
  │                              │
  │  ¯\\_(ツ)_/¯                  │
  ╰──────────────────────────────╯`}
        </div>
      </div>
    </div>
  )
}
