'use client'
import { useEffect, useRef, useState } from 'react'
import * as content from '@/lib/content'
import { EMAIL, experience, bio, cases, steps, gets } from '@/lib/content'
import type { WinId } from '../routes'

type Line = { k: 'in' | 'out' | 'ok' | 'err' | 'dim' | 'q'; t: string; cwd?: string }
type Mode = 'shell' | 'name' | 'email' | 'message' | 'confirm' | 'busy'

export type LofiHost = { status: () => { playing: boolean; title: string; vol: number; muted: boolean }; play: () => void; pause: () => void; next: () => void; prev: () => void; setVol: (n: number) => void; mute: () => void }
export type TermHost = {
  lofi?: LofiHost
  open: (id: WinId, el?: HTMLElement | null) => void
  exit: () => void
  theme: 'light' | 'dark'
  setTheme: (t: 'light' | 'dark') => void
}

const COMMANDS = ['help', 'ls', 'cd', 'pwd', 'cat', 'open', 'hire', 'contact', 'whoami', 'neofetch', 'sudo', 'rm', 'exit', 'clear', 'theme', 'coffee', 'echo', 'date', 'stack', 'lofi', 'vol', 'blog']
const ROOT = ['about.txt', 'work/', 'experience.log', 'freelance.md', 'resume.pdf', 'music/', 'trash/']
const WORK = cases.map((c) => c.slug + '/')
const APPS: Record<string, WinId> = {
  browser: 'browser', blog: 'browser', welcome: 'welcome', work: 'work', 'work/': 'work', experience: 'experience', 'experience.log': 'experience', freelance: 'freelance', 'freelance.md': 'freelance',
  resume: 'resume', 'resume.pdf': 'resume', terminal: 'terminal', music: 'music', trash: 'trash', 'about.txt': 'welcome',
  cite: 'case:cite', verro: 'case:verro', vault: 'case:vault', tabi: 'case:tabi', swiftpay: 'case:swiftpay', cardioscore: 'case:cardioscore',
}
const OPENABLE = Object.keys(APPS).filter((k) => !k.endsWith('/'))

const SPLASH = [
  'kimani_contact v2.0',
  'type help, or just say hi.',
]

export default function TerminalView({ host, banner = SPLASH, autoFocus, page }: { host: TermHost; banner?: string[]; autoFocus?: boolean; page?: boolean }) {
  const [lines, setLines] = useState<Line[]>(() => banner.map((t) => ({ k: 'dim' as const, t })))
  const [mode, setMode] = useState<Mode>('shell')
  const [cwd, setCwd] = useState('~')
  const [val, setVal] = useState('')
  const hist = useRef<string[]>([])
  const hi = useRef(-1)
  const form = useRef({ name: '', email: '', message: '' })
  const body = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const born = useRef(0)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const later = (f: () => void, ms: number) => { timers.current.push(setTimeout(f, ms)) }

  useEffect(() => { born.current = Date.now(); return () => timers.current.forEach(clearTimeout) }, [])
  useEffect(() => { if (body.current) body.current.scrollTop = body.current.scrollHeight }, [lines, mode])
  useEffect(() => { if (autoFocus) input.current?.focus({ preventScroll: true }) }, [autoFocus, mode])

  const out = (...l: Line[]) => setLines((p) => [...p, ...l])
  const o = (t: string, k: Line['k'] = 'out'): Line => ({ k, t })

  const neofetch = (): string[] => {
    const mins = Math.max(1, Math.round((Date.now() - born.current) / 60000))
    return [
      '    [km]            kimani@kingston',
      '   .----.           ---------------',
      '   |    |           OS       kimaniOS 1.0',
      '   | km |           Host     Next.js 16 · React 18 · motion',
      '   |    |           Shell    kimsh',
      '   `----`           Uptime   ' + mins + ' min',
      '                    Theme    ' + host.theme,
      '                    Stack    Go, TypeScript, Postgres, Swift',
      '                    Teams    I.D.L.E. Creationz, Sagicor Innovation Lab',
      '                    Building Cite (joincite.com), Tabi (jointabi.com)',
      '                    Coffee   yes',
    ]
  }

  const complete = (v: string) => {
    const parts = v.split(/\s+/)
    if (parts.length <= 1) {
      const m = COMMANDS.filter((c) => c.startsWith(parts[0]))
      return { opts: m, base: '', word: parts[0] }
    }
    const cmd = parts[0]
    const word = parts[parts.length - 1]
    const pool = cmd === 'open' ? OPENABLE : cmd === 'cd' ? (cwd === '~' ? ['work', 'music', 'trash', '..'] : ['..']) : cmd === 'cat' ? ['about.txt', 'experience.log', 'freelance.md', 'resume.pdf'] : cmd === 'theme' ? ['light', 'dark'] : cmd === 'ls' ? ['work'] : []
    return { opts: pool.filter((c) => c.startsWith(word)), base: parts.slice(0, -1).join(' ') + ' ', word }
  }

  const onTab = () => {
    const { opts, base, word } = complete(val)
    if (!opts.length) return
    if (opts.length === 1) { setVal(base + opts[0] + (parts0(val) ? ' ' : '')); return }
    let p = opts[0]
    for (const s of opts) while (!s.startsWith(p)) p = p.slice(0, -1)
    if (p.length > word.length) setVal(base + p)
    else out(o(opts.join('   '), 'dim'))
  }
  const parts0 = (v: string) => v.split(/\s+/).length <= 1

  const run = (raw: string) => {
    const cmd = raw.trim()
    const [c, ...args] = cmd.split(/\s+/)
    const arg = args.join(' ')
    const echo: Line = { k: 'in', t: raw, cwd }
    if (!cmd) { out(echo); return }
    hist.current.unshift(cmd); hi.current = -1
    switch (c.toLowerCase()) {
      case 'help':
        out(echo, o('commands:'), o('  ls, cd, pwd, cat <file>   look around'), o('  open <app>                open a window (work, cite, resume, music, trash ...)'),
          o('  hire, contact             send me a message'), o('  whoami, neofetch          about this machine'), o('  theme [light|dark]        switch the theme'),
          o('  clear, exit               tidy up / close'), o('  and a couple more you can find.', 'dim'))
        return
      case 'ls': {
        const list = (cwd === '~/work' && !arg) || arg === 'work' || arg === 'work/' ? WORK : ROOT
        out(echo, o(list.join('   ')))
        return
      }
      case 'pwd': out(echo, o(cwd === '~' ? '/home/kimani' : '/home/kimani/' + cwd.slice(2))); return
      case 'cd': {
        const t = arg.replace(/\/$/, '')
        if (!t || t === '~' || t === '..') { setCwd('~'); out(echo); return }
        if (t === 'work') { setCwd('~/work'); out(echo); return }
        if (t === 'music' || t === 'trash') { out(echo, o(`opening ${t} …`, 'ok')); host.open(t as WinId); return }
        if (cwd === '~/work' && cases.some((x) => x.slug === t)) { out(echo, o(`opening work/${t} …`, 'ok')); host.open(`case:${t}` as WinId); return }
        out(echo, o(`cd: no such directory: ${arg}`, 'err'))
        return
      }
      case 'cat': {
        const f = arg.replace(/^~\//, '')
        if (f === 'about.txt') out(echo, o(bio.line1), o(bio.line2))
        else if (f === 'experience.log') out(echo, ...experience.map((x) => o(`${x.dates.padEnd(20)} ${x.org}, ${x.role}`)))
        else if (f === 'freelance.md') out(echo, o('# freelance'), o('real production systems, not prototypes.'), o(steps.map(([s]) => s).join(' > ')), ...gets.map((g) => o('- ' + g)))
        else if (f === 'resume.pdf') out(echo, o('binary file. try: open resume', 'dim'))
        else if (!f) out(echo, o('cat: which file?', 'err'))
        else out(echo, o(`cat: ${f}: no such file`, 'err'))
        return
      }
      case 'open': {
        const k = arg.toLowerCase()
        const id = APPS[k]
        if (!id) { out(echo, o(k ? `open: no such app: ${k}` : 'open: which app? try: ' + OPENABLE.slice(0, 6).join(', '), 'err')); return }
        out(echo, o(`→ opening ${k} …`, 'ok')); host.open(id); return
      }
      case 'hire': case 'contact':
        out(echo, o('what should i call you?', 'q')); setMode('name'); return
      case 'whoami': out(echo, o('kimani. software engineer. kingston, jamaica.')); return
      case 'neofetch': out(echo, ...neofetch().map((t) => o(t))); return
      case 'sudo': out(echo, o('nice try. you are not in the sudoers file. this incident will be reported (to the coffee machine).', 'err')); return
      case 'rm':
        if (/-rf?\s*\/?\*?$|-rf\s+\//.test(cmd) || cmd.includes('-rf /')) out(echo, o("rm: refusing to delete the internet. also my résumé.", 'err'))
        else out(echo, o('rm: permission denied. everything here is load-bearing.', 'err'))
        return
      case 'exit': out(echo, o('bye.', 'dim')); later(host.exit, 250); return
      case 'clear': setLines([]); return
      case 'theme': {
        const t = arg === 'dark' || arg === 'light' ? arg : host.theme === 'dark' ? 'light' : 'dark'
        host.setTheme(t); out(echo, o(`theme: ${t}`, 'ok')); return
      }
      case 'coffee': out(echo, o('      ( (   '), o('       ) )  '), o('    ........'), o('    |      |]'), o('    \\      /'), o('     `----\''), o('brewing… one cup of coffee, as requested.', 'dim')); return
      case 'lofi': case 'vol': {
        const L = host.lofi
        if (!L) { out(echo, o('lofi: no player on this page. try the desktop.', 'dim')); return }
        const [sub, val] = args
        const st = () => L.status()
        if (c === 'vol' || /^\d+$/.test(sub ?? '') || sub === 'vol' || sub === 'volume') {
          const raw = c === 'vol' ? sub : /^\d+$/.test(sub) ? sub : val
          if (raw === 'mute') { L.mute(); out(echo, o(st().muted ? 'muted.' : 'unmuted.', 'ok')); return }
          if (raw === undefined) { out(echo, o(`volume ${Math.round(st().vol * 100)}%${st().muted ? ' (muted)' : ''}`)); return }
          const n = Number(raw)
          if (!isFinite(n) || n < 0 || n > 100) { out(echo, o('vol: 0 to 100, please.', 'err')); return }
          L.setVol(n / 100); out(echo, o(`volume ${Math.round(n)}%`, 'ok')); return
        }
        if (sub === 'play') { L.play(); out(echo, o('playing. lo-fi, CC0, HoliznaCC0.', 'ok')) }
        else if (sub === 'pause' || sub === 'stop') { L.pause(); out(echo, o('paused. it will stay paused.', 'ok')) }
        else if (sub === 'next') { L.next(); out(echo, o(`now: ${st().title}`, 'ok')) }
        else if (sub === 'prev') { L.prev(); out(echo, o(`now: ${st().title}`, 'ok')) }
        else if (sub === 'mute') { L.mute(); out(echo, o(st().muted ? 'muted.' : 'unmuted.', 'ok')) }
        else if (!sub || sub === 'status') out(echo, o(`${st().playing ? 'playing' : 'paused'}: ${st().title}, HoliznaCC0`), o(`volume ${Math.round(st().vol * 100)}%${st().muted ? ' (muted)' : ''}  ·  lofi play | pause | next | prev | <0-100>`, 'dim'))
        else out(echo, o('lofi: play, pause, next, prev, or a number 0 to 100.', 'err'))
        return
      }
      case 'blog': out(echo, o('→ opening the browser at /blog …', 'ok')); host.open('browser'); return
      case 'stack': {
        const st = (content as unknown as { stack?: { group: string; items: string[] }[] }).stack
        if (!st?.length) { out(echo, o('stack: nothing on the shelf yet.', 'dim')); return }
        out(echo, ...st.map((g) => o(`${g.group.padEnd(14)} ${g.items.join(', ')}`)))
        return
      }
      case 'echo': out(echo, o(arg)); return
      case 'date': out(echo, o(new Date().toLocaleString('en-US', { timeZone: 'America/Jamaica', dateStyle: 'full', timeStyle: 'short' }) + ' (kingston)')); return
      default: out(echo, o(`kimsh: command not found: ${c}. type "help" for options.`, 'err'))
    }
  }

  const submit = () => {
    const v = val
    setVal('')
    if (mode === 'shell') { run(v); return }
    const t = v.trim()
    if (!t) return
    out({ k: 'in', t: v, cwd: '>' })
    if (mode === 'name') {
      form.current.name = t
      later(() => { out(o(`nice to meet you, ${t}.`), o("what's your email? (so kimani can reply)", 'q')); setMode('email') }, 150)
      setMode('busy')
    } else if (mode === 'email') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)) { out(o("that doesn't look like a valid email. try again?", 'err')); return }
      form.current.email = t
      setMode('busy')
      later(() => { out(o('got it.'), o('now type your message:', 'q')); setMode('message') }, 150)
    } else if (mode === 'message') {
      form.current.message = t
      setMode('busy')
      later(() => {
        const f = form.current
        out(o('-- message preview --', 'dim'), o(`from:    ${f.name} <${f.email}>`), o(`message: ${t}`), o('---------------------', 'dim'), o('send it? (y/n)', 'q'))
        setMode('confirm')
      }, 200)
    } else if (mode === 'confirm') {
      const a = t.toLowerCase()
      if (a === 'y' || a === 'yes') {
        setMode('busy')
        out(o('opening your mail app …', 'dim'))
        later(() => {
          const f = form.current
          const subject = encodeURIComponent(`Portfolio message from ${f.name}`)
          const bodyTxt = encodeURIComponent(`${f.message}\n\n---\nFrom: ${f.name}\nEmail: ${f.email}`)
          window.open(`mailto:${EMAIL}?subject=${subject}&body=${bodyTxt}`, '_self')
          out(o('message ready to send.', 'ok'), o('kimani will get back to you soon.', 'ok'), o('back to the shell. type help if you like.', 'dim'))
          setMode('shell')
        }, 500)
      } else { out(o('cancelled. type your message again:', 'q')); setMode('message') }
    }
  }

  // ?run=<command> for demos and screenshots
  useEffect(() => {
    const r = new URLSearchParams(window.location.search).get('run')
    if (r) later(() => run(r), 120)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const shown = (c: string) => (c === '~' ? '~/kimani' : c.replace('~/', '~/kimani/'))
  const prompt = mode === 'shell' ? `${shown(cwd)} $` : '>'
  return (
    <div className={`term${page ? ' term-page' : ''}`} ref={body} onClick={() => input.current?.focus({ preventScroll: true })} role="log" aria-live="polite">
      {lines.map((l, i) => (
        <div key={i} className={`tl ${l.k}`}>
          {l.k === 'in' ? <><span className="p">{l.cwd === '>' ? '>' : `${shown(l.cwd ?? '~')} $`}</span> {l.t}</> : l.k === 'q' ? <><span className="p">&gt;</span> {l.t}</> : l.t || ' '}
        </div>
      ))}
      <label className="tl inl">
        <span className="p">{mode === 'shell' ? prompt : '>'}</span>
        <span className="sr-only">Terminal input</span>
        <input
          ref={input} value={val} onChange={(e) => setVal(e.target.value)} disabled={mode === 'busy'}
          autoComplete="off" autoCapitalize="off" spellCheck={false}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit()
            else if (e.key === 'Tab') { e.preventDefault(); if (mode === 'shell') onTab() }
            else if (e.key === 'ArrowUp') { e.preventDefault(); if (hist.current.length) { hi.current = Math.min(hist.current.length - 1, hi.current + 1); setVal(hist.current[hi.current]) } }
            else if (e.key === 'ArrowDown') { e.preventDefault(); hi.current = Math.max(-1, hi.current - 1); setVal(hi.current < 0 ? '' : hist.current[hi.current]) }
            else if (e.key === 'l' && e.ctrlKey) { e.preventDefault(); setLines([]) }
          }}
        />
      </label>
    </div>
  )
}
