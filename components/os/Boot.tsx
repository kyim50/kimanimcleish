'use client'
import { useEffect, useRef, useState } from 'react'
import { useOSActions } from './store'
import Logo from './Logo'

const LOG = [
  'kimaniOS 1.0 (kingston build), booting',
  '[ ok ] mounting ~/cite ........ 5 sources, every 6 hours, no complaints',
  '[ ok ] mounting ~/tabi ........ 138 migrations applied, 0 regrets',
  '[ ok ] warming up postgres .... it was already warm. it is always warm.',
  '[ ok ] securing 14 servers .... 14 of 14. the pen test passed, in fact.',
  '[ .. ] loading coffee ......... 87%',
  '[warn] coffee at 87%. proceeding anyway, as one does.',
  '[ ok ] cookies ................ none. no cookies were harmed.',
]
const PROMPT = "press enter to proceed, or y if you'd like to proceed."
const JOKES = ['that is not enter.', 'close. but no.', 'y is also accepted. there are two options.', 'bold. still not enter.', 'the key you want is enter. big one. right side.']

export default function Boot() {
  const a = useOSActions()
  const [lines, setLines] = useState<string[]>([])
  const [typing, setTyping] = useState('')
  const [ready, setReady] = useState(false)
  const [reply, setReply] = useState('')
  const readyRef = useRef(false)
  const jokeN = useRef(0)
  const skipTyping = useRef(false)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let dead = false
    const timers: ReturnType<typeof setTimeout>[] = []
    const all = [...LOG, '', PROMPT]
    const done = () => { readyRef.current = true; setReady(true) }
    if (reduce) { setLines(all); setTyping(''); done() }
    else {
      let li = 0
      const nextLine = () => {
        if (dead) return
        if (skipTyping.current) { setLines(all); setTyping(''); done(); return }
        if (li >= all.length) { done(); return }
        const full = all[li]
        let ci = 0
        const step = () => {
          if (dead) return
          if (skipTyping.current) { setLines(all); setTyping(''); done(); return }
          ci = Math.min(full.length, ci + 4)
          setTyping(full.slice(0, ci))
          if (ci < full.length) timers.push(setTimeout(step, 14))
          else { setLines((l) => [...l, full]); setTyping(''); li++; timers.push(setTimeout(nextLine, full === '' ? 120 : 110)) }
        }
        step()
      }
      timers.push(setTimeout(nextLine, 250))
    }
    const proceed = () => { if (!readyRef.current) { skipTyping.current = true; return } a.lofiGesture(); a.finishBoot() }
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key === 'Enter' || e.key.toLowerCase() === 'y') { e.preventDefault(); proceed() }
      else if (e.key.length === 1 || e.key === 'Escape') {
        if (!readyRef.current) { skipTyping.current = true; return }
        setReply(JOKES[jokeN.current++ % JOKES.length])
      }
    }
    const onPtr = () => proceed()
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onPtr)
    return () => { dead = true; timers.forEach(clearTimeout); window.removeEventListener('keydown', onKey); window.removeEventListener('pointerdown', onPtr) }
  }, [a])

  return (
    <div className="boot" role="status" aria-label="Starting kimaniOS">
      <div className="boot-head"><Logo size={34} title="kimani.os" /><span className="mono">kimaniOS terminal</span></div>
      <pre className="boot-log mono">
        {lines.map((l, i) => <span key={i} className={l.startsWith('[warn]') ? 'w' : l.startsWith('press') ? 'pr' : ''}>{l}{'\n'}</span>)}
        {!ready && <span>{typing}<i className="bcur" /></span>}
        {ready && <span className="reply">{reply ? `> ${reply}\n` : ''}<span className="mono">$ </span><i className="bcur" /></span>}
      </pre>
      <button type="button" className="skip mono" onClick={(e) => { e.stopPropagation(); a.lofiGesture(); a.finishBoot() }}>skip intro</button>
    </div>
  )
}
