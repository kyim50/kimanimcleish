import { pageMeta } from '@/lib/seo'
import RouteSeo from '@/components/os/Seo'

export const metadata = pageMeta({ title: 'Trash', description: 'The old portfolio, a cream-coloured page and three bugs fixed, in the trash.', path: '/trash' })
export default function Page() { return <RouteSeo route="trash" /> }
