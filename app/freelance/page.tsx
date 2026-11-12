import { pageMeta } from '@/lib/seo'
import RouteSeo from '@/components/os/Seo'

export const metadata = pageMeta({ title: 'Freelance software builds in Jamaica', description: 'Freelance builds by Kimani McLeish: apps, backends, payment gateways, data pipelines and infrastructure for Jamaican clients, built as real production systems.', path: '/freelance' })
export default function Page() { return <RouteSeo route="freelance" /> }
