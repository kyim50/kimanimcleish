import { pageMeta } from '@/lib/seo'
import RouteSeo from '@/components/os/Seo'

export const metadata = pageMeta({ title: 'Kimani McLeish, software engineer in Kingston', description: 'Software engineer in Kingston, Jamaica building production systems end to end: the app, the backend, the data pipelines and the infrastructure. Creator of Cite, adopted by the UTech Students\' Union. Open to freelance builds.', path: '/' })
export default function Page() { return <RouteSeo route="home" /> }
