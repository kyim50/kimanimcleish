import { cases } from '@/lib/content'

export type WinId =
  | 'welcome' | 'work' | 'experience' | 'freelance' | 'resume' | 'terminal' | 'music' | 'trash' | 'browser'
  | 'case:cite' | 'case:tabi' | 'case:swiftpay' | 'case:cardioscore' | 'case:verro' | 'case:vault'

export type WinDef = {
  id: WinId
  path: string
  title: string // shown as ~/title
  label: string // desktop icon / dock label
  stamp?: string // old-print stamp image
  w: number
  h: number
  icon: boolean // has a desktop icon
}

export const iconFor = (id: string) => `/os/icons/${id.replace(':', '-')}.webp`

export const DEFS: WinDef[] = [
  { id: 'welcome', stamp: iconFor('welcome'), path: '/', title: 'welcome', label: 'welcome', w: 1010, h: 800, icon: true },
  { id: 'work', stamp: iconFor('work'), path: '/work', title: 'work/', label: 'work/', w: 760, h: 520, icon: true },
  { id: 'experience', stamp: iconFor('experience'), path: '/experience', title: 'experience', label: 'experience', w: 760, h: 620, icon: true },
  { id: 'freelance', stamp: iconFor('freelance'), path: '/freelance', title: 'freelance', label: 'freelance', w: 780, h: 640, icon: true },
  { id: 'resume', stamp: iconFor('resume'), path: '/resume', title: 'resume.pdf', label: 'resume.pdf', w: 720, h: 760, icon: true },
  { id: 'terminal', stamp: iconFor('terminal'), path: '/contact', title: 'terminal', label: 'terminal', w: 480, h: 310, icon: true },
  { id: 'music', stamp: iconFor('music'), path: '/music', title: 'music', label: 'music', w: 480, h: 560, icon: true },
  { id: 'browser', stamp: iconFor('browser'), path: '/blog', title: 'blog', label: 'browser', w: 900, h: 660, icon: true },
  { id: 'trash', stamp: iconFor('trash'), path: '/trash', title: 'trash', label: 'trash', w: 560, h: 420, icon: true },
  ...cases.map((c) => ({ id: `case:${c.slug}` as WinId, path: `/work/${c.slug}`, title: `work/${c.slug}`, label: c.name, stamp: iconFor(`case:${c.slug}`), w: 860, h: 640, icon: false })),
]

export const defById = (id: WinId) => DEFS.find((d) => d.id === id)!
export const defByPath = (p: string) => {
  const path = p.length > 1 ? p.replace(/\/$/, '') : p
  if (path === '/blog' || path.startsWith('/blog/')) return DEFS.find((d) => d.id === 'browser')
  return DEFS.find((d) => d.path === path)
}
export const ICON_IDS = DEFS.filter((d) => d.icon).map((d) => d.id)
export const MENU_H = 48
