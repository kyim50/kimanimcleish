import { cases } from '@/lib/content'
import { pageMeta, caseDescription } from '@/lib/seo'
import RouteSeo from '@/components/os/Seo'

export const dynamicParams = false
export function generateStaticParams() { return cases.map((c) => ({ slug: c.slug })) }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const c = cases.find((x) => x.slug === slug)
  return pageMeta({ title: c ? `${c.name} case file` : 'Case file', description: c ? caseDescription(c) : 'A case file by Kimani McLeish.', path: `/work/${slug}` })
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <RouteSeo route={`case:${slug}`} />
}
