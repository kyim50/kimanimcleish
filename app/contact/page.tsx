'use client'

import { useEffect, useState, useRef } from 'react'
import Footer from '@/components/Footer'
import { useTextScramble } from '@/hooks/useTextScramble'
import { useTheme } from '@/components/ThemeProvider'

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, isVisible }
}

export default function Contact() {
  const contactSection = useInView()
  const formSection = useInView()
  const statusSection = useInView()
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()
  const isLight = theme === 'light'

  type TermLine = { text: string; type: 'system' | 'prompt' | 'input' | 'success' | 'error' }
  type TermStep = 'greeting' | 'name' | 'email' | 'message' | 'confirm' | 'sending' | 'done'

  const [termStep, setTermStep] = useState<TermStep>('greeting')
  const [termHistory, setTermHistory] = useState<TermLine[]>([])
  const [termInput, setTermInput] = useState('')
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [pingResult, setPingResult] = useState<string | null>(null)
  const [signalFrame, setSignalFrame] = useState(0)
  const termRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setSignalFrame((prev) => (prev + 1) % 4)
    }, 600)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (termRef.current) {
      termRef.current.scrollTop = termRef.current.scrollHeight
    }
  }, [termHistory, termStep])

  useEffect(() => {
    if (formSection.isVisible && termStep === 'greeting') {
      const lines: TermLine[] = [
        { text: 'kimani_contact v1.0.0', type: 'system' },
        { text: '──────────────────────────────', type: 'system' },
        { text: '', type: 'system' },
        { text: "hey! thanks for stopping by.", type: 'system' },
        { text: "let's get your message to kimani.", type: 'system' },
        { text: '', type: 'system' },
      ]
      lines.forEach((line, i) => {
        setTimeout(() => {
          setTermHistory((prev) => [...prev, line])
          if (i === lines.length - 1) {
            setTimeout(() => {
              setTermHistory((prev) => [...prev, { text: 'what should i call you?', type: 'prompt' }])
              setTermStep('name')
            }, 300)
          }
        }, i * 120)
      })
    }
  }, [formSection.isVisible, termStep])

  const contactTitle = useTextScramble('Contact', mounted)

  const signalFrames = [
    `     (     
    ( (    
   ( ( (   
  ( ( ( (  
   ( ( (   
    ( (    
     (     `,
    `      )    
     ) )   
    ) ) )  
   ) ) ) ) 
    ) ) )  
     ) )   
      )    `,
    `    ((     
   (( ((   
  (( (( (( 
   (( ((   
    ((     
             
             `,
    `     ))    
    )) ))  
   )) )) ))
    )) ))  
     ))    
             
             `,
  ]

  const handlePing = () => {
    setPingResult(null)
    setTimeout(() => setPingResult('64 bytes from kimani: time=1ms TTL=64'), 300)
    setTimeout(() => setPingResult('64 bytes from kimani: time=1ms TTL=64\nResponse: "hey! message me below"'), 1200)
    setTimeout(() => setPingResult(null), 4000)
  }

  const handleTerminalSubmit = () => {
    const value = termInput.trim()
    if (!value) return

    setTermInput('')

    if (termStep === 'name') {
      setTermHistory((prev) => [
        ...prev,
        { text: value, type: 'input' },
        { text: '', type: 'system' },
      ])
      setFormData((prev) => ({ ...prev, name: value }))
      setTimeout(() => {
        setTermHistory((prev) => [
          ...prev,
          { text: `nice to meet you, ${value}!`, type: 'system' },
          { text: 'what\'s your email? (so kimani can reply)', type: 'prompt' },
        ])
        setTermStep('email')
      }, 300)
    } else if (termStep === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        setTermHistory((prev) => [
          ...prev,
          { text: value, type: 'input' },
          { text: 'hmm, that doesn\'t look like a valid email. try again?', type: 'error' },
        ])
        return
      }
      setTermHistory((prev) => [
        ...prev,
        { text: value, type: 'input' },
        { text: '', type: 'system' },
      ])
      setFormData((prev) => ({ ...prev, email: value }))
      setTimeout(() => {
        setTermHistory((prev) => [
          ...prev,
          { text: 'got it.', type: 'system' },
          { text: 'now type your message:', type: 'prompt' },
        ])
        setTermStep('message')
      }, 300)
    } else if (termStep === 'message') {
      setTermHistory((prev) => [
        ...prev,
        { text: value, type: 'input' },
        { text: '', type: 'system' },
      ])
      setFormData((prev) => ({ ...prev, message: value }))
      setTimeout(() => {
        setTermHistory((prev) => [
          ...prev,
          { text: '── message preview ──', type: 'system' },
          { text: `from:    ${formData.name} <${formData.email}>`, type: 'system' },
          { text: `message: ${value}`, type: 'system' },
          { text: '────────────────────', type: 'system' },
          { text: '', type: 'system' },
          { text: 'send it? (y/n)', type: 'prompt' },
        ])
        setTermStep('confirm')
      }, 400)
    } else if (termStep === 'confirm') {
      const answer = value.toLowerCase()
      setTermHistory((prev) => [...prev, { text: value, type: 'input' }])

      if (answer === 'y' || answer === 'yes') {
        setTermStep('sending')
        const sendLines: TermLine[] = [
          { text: '', type: 'system' },
          { text: 'establishing connection...', type: 'system' },
          { text: 'encrypting payload...', type: 'system' },
          { text: 'sending to kimani@inbox...', type: 'system' },
          { text: '', type: 'system' },
          { text: '✓ message sent successfully!', type: 'success' },
          { text: 'kimani will get back to you soon.', type: 'success' },
          { text: '', type: 'system' },
          { text: 'type "new" to send another, or "clear" to reset.', type: 'system' },
        ]
        sendLines.forEach((line, i) => {
          setTimeout(() => {
            setTermHistory((prev) => [...prev, line])
            if (i === 5) {
              const subject = encodeURIComponent(`Portfolio message from ${formData.name}`)
              const body = encodeURIComponent(`${formData.message}\n\n---\nFrom: ${formData.name}\nEmail: ${formData.email}`)
              window.open(`mailto:kimanimac2005@gmail.com?subject=${subject}&body=${body}`, '_self')
            }
            if (i === sendLines.length - 1) {
              setTermStep('done')
            }
          }, i * 350)
        })
      } else {
        setTermHistory((prev) => [
          ...prev,
          { text: 'message cancelled. type your message again:', type: 'prompt' },
        ])
        setTermStep('message')
      }
    } else if (termStep === 'done') {
      if (value.toLowerCase() === 'new') {
        setFormData({ name: '', email: '', message: '' })
        setTermHistory([])
        setTermStep('greeting')
      } else if (value.toLowerCase() === 'clear') {
        setTermHistory([])
        setFormData({ name: '', email: '', message: '' })
        setTermStep('greeting')
      }
    }
  }

  const contacts = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      ascii: '[@]',
      title: 'Email',
      value: 'kimanimac2005@gmail.com',
      href: 'mailto:kimanimac2005@gmail.com',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
      ascii: '[*]',
      title: 'Instagram',
      value: '@kimani.mcleish',
      href: 'https://www.instagram.com/kimani.mcleish/',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      ascii: '[in]',
      title: 'LinkedIn',
      value: 'in/kimani-mcleish',
      href: 'https://www.linkedin.com/in/kimani-mcleish-9249802a1/',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
        </svg>
      ),
      ascii: '[<>]',
      title: 'Discord',
      value: 'Join Server',
      href: '#',
    },
  ]

  const now = new Date()
  const jamaicaTime = now.toLocaleTimeString('en-US', { timeZone: 'America/Jamaica', hour: '2-digit', minute: '2-digit', hour12: true })
  const jamaicaHour = parseInt(now.toLocaleString('en-US', { timeZone: 'America/Jamaica', hour: 'numeric', hour12: false }))
  const isAwake = jamaicaHour >= 8 && jamaicaHour < 24

  return (
    <div className="max-w-3xl mx-auto px-6 pt-16">
      <section className="py-4">
        {/* ASCII Signal Animation + Mailbox */}
        <div className="flex items-start gap-6 mb-4">
          <div className="ascii-art text-gray-700 text-[10px] animate-fade-in animate-float">
{`   ╭──────────────────╮
   │  ┌──┐  MAILBOX   │
   │  │@@│  ~~~~~~~~   │
   │  │@@│  new: 1     │
   │  └──┘             │
   ╰──────────────────╯`}
          </div>
        </div>

        <h1 className="text-3xl font-semibold mb-1 animate-fade-in-up font-mono">
          {contactTitle} <span className="ascii-icon text-gray-500 text-sm animate-pop inline-block">[--]</span>
        </h1>
        <p className="text-gray-400 mb-6 animate-fade-in-up delay-100">Lets connect.</p>

        {/* Status Section */}
        <div ref={statusSection.ref} className={`grid grid-cols-3 gap-3 mb-8 ${statusSection.isVisible ? 'animate-fade-in-up delay-200' : 'opacity-0'}`}>
          <div className={`flex items-center gap-3 p-3 rounded-lg ${isLight ? 'bg-gray-100' : 'bg-[#0a0a0a]'}`}>
            <span className={`text-xs font-mono font-semibold ${isLight ? 'text-gray-900' : 'text-white'}`}>EST</span>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 font-mono leading-tight">timezone</span>
              <span className="text-[9px] text-gray-600 font-mono">{jamaicaTime}</span>
            </div>
          </div>
          <div className={`flex items-center gap-3 p-3 rounded-lg ${isLight ? 'bg-gray-100' : 'bg-[#0a0a0a]'}`}>
            <div className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isAwake ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
              <span className={`text-xs font-mono font-semibold ${isLight ? 'text-gray-900' : 'text-white'}`}>
                {isAwake ? 'online' : 'sleeping'}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 font-mono leading-tight">status</span>
              <span className="text-[9px] text-gray-600 font-mono">{isAwake ? 'likely coding' : 'zzz...'}</span>
            </div>
          </div>
          <div className={`flex items-center gap-3 p-3 rounded-lg ${isLight ? 'bg-gray-100' : 'bg-[#0a0a0a]'}`}>
            <span className={`text-xs font-mono font-semibold ${isLight ? 'text-gray-900' : 'text-white'}`}>&lt;24h</span>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 font-mono leading-tight">response</span>
              <span className="text-[9px] text-gray-600 font-mono">usually faster</span>
            </div>
          </div>
        </div>

        {/* Ping Button */}
        <div className={`mb-8 ${statusSection.isVisible ? 'animate-fade-in-up delay-300' : 'opacity-0'}`}>
          <button
            onClick={handlePing}
            className={`w-full text-left p-3 rounded-lg font-mono text-[11px] transition-all duration-300 group ${isLight ? 'bg-gray-100 hover:bg-gray-200' : 'bg-[#0a0a0a] hover:bg-[#111]'}`}
          >
            <span className="text-gray-500">~ $</span>{' '}
            <span className={`transition-colors duration-300 ${isLight ? 'text-gray-800 group-hover:text-black' : 'text-gray-300 group-hover:text-white'}`}>
              ping kimani --say-hello
            </span>
            <span className="terminal-cursor text-green-500 ml-1">_</span>
          </button>
          {pingResult && (
            <div className={`mt-2 p-3 rounded-lg font-mono text-[11px] animate-fade-in ${isLight ? 'bg-gray-50' : 'bg-[#060606]'}`}>
              {pingResult.split('\n').map((line, i) => (
                <div key={i} className={i === 0 ? 'text-gray-500' : 'text-green-500 mt-1'}>{line}</div>
              ))}
            </div>
          )}
        </div>

        {/* ASCII divider */}
        <div className="ascii-art text-gray-700 text-[10px] mb-6 animate-shimmer rounded">
{`  +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+`}
        </div>

        {/* Contact Cards */}
        <p className="text-gray-400 text-sm mb-4 animate-fade-in-up delay-200">
          Connect with me through any of these platforms. <span className="ascii-icon text-gray-500 text-xs animate-wiggle inline-block">{`{..}`}</span>
        </p>

        <div ref={contactSection.ref} className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10">
          {contacts.map((contact, i) => (
            <a
              key={contact.title}
              href={contact.href}
              target={contact.href.startsWith('http') ? '_blank' : undefined}
              rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className={`border p-4 rounded-lg flex items-center gap-4 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group ${isLight ? 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-black/5' : 'border-[#222] hover:border-[#444] hover:bg-[#0a0a0a] hover:shadow-white/5'} ${contactSection.isVisible ? `animate-fade-in-up delay-${(i + 1) * 100}` : 'opacity-0'}`}
            >
              <div className={`text-gray-400 group-hover:scale-110 transition-all duration-300 ${isLight ? 'group-hover:text-black' : 'group-hover:text-white'}`}>{contact.icon}</div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold group-hover:text-blue-400 transition-colors duration-300">{contact.title}</h3>
                <p className="text-gray-500 text-xs">{contact.value}</p>
              </div>
              <span className="ascii-icon text-gray-600 text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover:animate-bounce-subtle">{contact.ascii}</span>
            </a>
          ))}
        </div>

        {/* Interactive Terminal */}
        <div ref={formSection.ref} className={`mb-4 ${formSection.isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <div
            className="rounded-lg overflow-hidden border transition-colors duration-300"
            style={{
              backgroundColor: isLight ? '#fff' : '#060606',
              borderColor: isLight ? '#e5e7eb' : '#1a1a1a',
            }}
            onClick={() => inputRef.current?.focus()}
          >
            {/* Terminal header bar */}
            <div
              className="flex items-center gap-2 px-3 py-1.5 border-b transition-colors duration-300"
              style={{
                backgroundColor: isLight ? '#f3f4f6' : '#0a0a0a',
                borderColor: isLight ? '#e5e7eb' : '#1a1a1a',
              }}
            >
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500/60" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
                <div className="w-2 h-2 rounded-full bg-green-500/60" />
              </div>
              <span className="text-gray-400 text-[9px] font-mono flex-1 text-center">~/contact/send-message</span>
              <span className="text-gray-500 text-[9px] font-mono">bash</span>
            </div>

            {/* Terminal body */}
            <div ref={termRef} className="p-3 min-h-[200px] max-h-[300px] overflow-y-auto font-mono text-[11px] leading-relaxed">
              {/* History lines */}
              {termHistory.map((line, i) => (
                <div
                  key={i}
                  className={`${
                    line.type === 'system' ? (isLight ? 'text-gray-600' : 'text-gray-500')
                    : line.type === 'prompt' ? (isLight ? 'text-green-700' : 'text-green-500')
                    : line.type === 'input' ? (isLight ? 'text-gray-900' : 'text-white')
                    : line.type === 'success' ? (isLight ? 'text-green-600' : 'text-green-400')
                    : line.type === 'error' ? 'text-red-500'
                    : (isLight ? 'text-gray-600' : 'text-gray-400')
                  }`}
                >
                  {line.type === 'prompt' && <span className={`mr-1 ${isLight ? 'text-green-700' : 'text-green-500'}`}>&gt;</span>}
                  {line.type === 'input' && <span className={`mr-1 ${isLight ? 'text-gray-400' : 'text-gray-600'}`}>$</span>}
                  {line.type === 'success' && <span className="mr-1">✓</span>}
                  {line.type === 'error' && <span className="mr-1">!</span>}
                  {line.text || '\u00A0'}
                </div>
              ))}

              {/* Active input line */}
              {(termStep === 'name' || termStep === 'email' || termStep === 'message' || termStep === 'confirm' || termStep === 'done') && (
                <div className="flex items-center">
                  <span className={`mr-1 ${isLight ? 'text-green-700' : 'text-green-500'}`}>$</span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={termInput}
                    onChange={(e) => setTermInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleTerminalSubmit()
                    }}
                    className="flex-1 outline-none font-mono text-[11px] border-none"
                    style={{
                      backgroundColor: 'transparent',
                      color: isLight ? '#111' : '#fff',
                      caretColor: isLight ? '#15803d' : '#22c55e',
                      WebkitTextFillColor: isLight ? '#111' : '#fff',
                    }}
                    autoFocus
                  />
                  <span className={`terminal-cursor ${isLight ? 'text-green-700' : 'text-green-500'}`}>_</span>
                </div>
              )}

              {/* Waiting state during greeting/sending */}
              {(termStep === 'greeting' || termStep === 'sending') && (
                <div className="text-gray-600">
                  <span className="terminal-cursor">_</span>
                </div>
              )}
            </div>
          </div>
        </div>

      </section>

      <Footer />
    </div>
  )
}
