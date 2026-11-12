import { pageMeta } from '@/lib/seo'
import RouteSeo from '@/components/os/Seo'

export const metadata = pageMeta({ title: 'Résumé', description: 'The résumé of Kimani McLeish, software engineer in Kingston, Jamaica: backend, data pipelines, infrastructure and mobile apps. Download the PDF.', path: '/resume' })
export default function Page() { return <RouteSeo route="resume" /> }
