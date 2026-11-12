import { pageMeta } from '@/lib/seo'
import RouteSeo from '@/components/os/Seo'

export const metadata = pageMeta({ title: 'Music', description: 'What Kimani McLeish is listening to right now, live from Spotify.', path: '/music' })
export default function Page() { return <RouteSeo route="music" /> }
