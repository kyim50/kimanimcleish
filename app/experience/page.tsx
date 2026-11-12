import { pageMeta } from '@/lib/seo'
import RouteSeo from '@/components/os/Seo'

export const metadata = pageMeta({ title: 'Experience', description: "Kimani McLeish's experience: team lead at I.D.L.E. Creationz and Sagicor Innovation Lab, data consultant at UHWI, and a full stack list from Go and TypeScript to AWS and PostgreSQL.", path: '/experience' })
export default function Page() { return <RouteSeo route="experience" /> }
