import { pageMeta } from '@/lib/seo'
import RouteSeo from '@/components/os/Seo'

export const metadata = pageMeta({ title: 'Work: case files', description: 'Six case files by Kimani McLeish, a software engineer in Kingston: Cite, Tabi, SwiftPay, CardioScore, Verro and Vault, with the problem, the build, the hard parts and the numbers.', path: '/work' })
export default function Page() { return <RouteSeo route="work" /> }
