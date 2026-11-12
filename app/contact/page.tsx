import { pageMeta } from '@/lib/seo'
import RouteSeo from '@/components/os/Seo'

export const metadata = pageMeta({ title: 'Contact', description: 'Email, GitHub and LinkedIn for Kimani McLeish, software engineer in Kingston, Jamaica. Open to freelance builds.', path: '/contact' })
export default function Page() { return <RouteSeo route="contact" /> }
