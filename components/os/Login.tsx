'use client'
import { useEffect, useRef, useState } from 'react'
import { useOSActions } from './store'
import Wallpaper from './Wallpaper'

const REPLIES: Record<string, string> = {
  hunter2: 'nope. that one is famous.',
  '1234': 'bold choice. still no.',
  '123456': 'bold choice. still no.',
  admin: 'you are not admin. you are a guest. a welcome one.',
  qwerty: 'my keyboard says no.',
  letmein: 'fine. come in.',
}

export default function Login({ wallpaper }: { wallpaper: number }) {
  const a = useOSActions()
  const [val, setVal] = useState('')
  const [msg, setMsg] = useState('')
  const [shake, setShake] = useState(0)
  const busy = useRef(false)
  useEffect(() => {
    const f = () => { setMsg('told you.'); setShake(1) }
    window.addEventListener('kos-try-password', f)
    return () => window.removeEventListener('kos-try-password', f)
  }, [])

  const enter = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (busy.current) return
    const v = val.trim().toLowerCase()
    if (v === 'password') { setMsg('told you.'); setShake((s) => s + 1); setVal(''); return }
    busy.current = true
    if (REPLIES[v]) { setMsg(REPLIES[v]); setTimeout(() => a.login('guest'), 1000) } else a.login(v ? 'visitor' : 'guest')
  }

  return (
    <div className="login">
      <Wallpaper variant={wallpaper} blur />
      <form className="login-card" onSubmit={enter}>
        <span className="avatar"><img src="/os/kimani-avatar.webp" alt="Kimani" width={96} height={96} /></span>
        <h1>kimani</h1>
        <div key={shake} className={`pw${shake ? ' shake' : ''}`}>
          <input type="password" placeholder="password" value={val} onChange={(e) => setVal(e.target.value)} aria-label="Password" autoComplete="off" />
          <button type="submit" aria-label="Log in">→</button>
        </div>
        <p className={`hint mono${msg ? ' say' : ''}`} role="status">{msg || "hint: don't try password"}</p>
        <button type="button" className="guest" onClick={() => a.login('guest')}>continue as guest</button>
      </form>
    </div>
  )
}
