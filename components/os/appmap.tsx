'use client'
import type { WinId } from './routes'
import Welcome from './apps/Welcome'
import Work from './apps/Work'
import Case from './apps/Case'
import Experience from './apps/Experience'
import Freelance from './apps/Freelance'
import Resume from './apps/Resume'
import Music from './apps/Music'
import Trash from './apps/Trash'
import TerminalWin from './apps/TerminalWin'
import Browser from './apps/Browser'
import { useStoreRef } from './store'

function BlogWin() {
  const st = useStoreRef()
  return <Browser start={st.get().blogPath} />
}

export function appFor(id: WinId, _o: { page: boolean }) {
  void _o
  switch (id) {
    case 'welcome': return <Welcome />
    case 'work': return <Work />
    case 'experience': return <Experience />
    case 'freelance': return <Freelance />
    case 'resume': return <Resume />
    case 'music': return <Music />
    case 'trash': return <Trash />
    case 'terminal': return <TerminalWin />
    case 'browser': return <BlogWin />
    default:
      if (id.startsWith('case:')) return <Case slug={id.slice(5)} />
      return null
  }
}
