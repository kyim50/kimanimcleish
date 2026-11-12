import type { Metadata } from 'next'
import { SITE_NAME, OG_IMAGE, OG_ALT, abs } from './site'
import { GITHUB, LINKEDIN, INSTAGRAM, cases, type Case } from './content'

export function pageMeta(o: { title: string; description: string; path: string; type?: 'website' | 'article'; published?: string; tags?: string[] }): Metadata {
  const full = `${o.title} | ${SITE_NAME}`
  return {
    title: o.title,
    description: o.description,
    alternates: { canonical: o.path },
    openGraph: {
      title: full, description: o.description, url: abs(o.path), siteName: SITE_NAME, type: o.type ?? 'website', locale: 'en_JM',
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: OG_ALT }],
      ...(o.type === 'article' ? { publishedTime: o.published, tags: o.tags } : {}),
    },
    twitter: { card: 'summary_large_image', title: full, description: o.description, images: [OG_IMAGE] },
  }
}

export const person = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Kimani McLeish',
  jobTitle: 'Software engineer',
  url: abs('/'),
  image: abs('/os/kimani.webp'),
  email: 'mailto:kimanimac2005@gmail.com',
  address: { '@type': 'PostalAddress', addressLocality: 'Kingston', addressCountry: 'JM' },
  alumniOf: { '@type': 'CollegeOrUniversity', name: 'University of Technology, Jamaica' },
  worksFor: [{ '@type': 'Organization', name: 'I.D.L.E. Creationz', url: 'https://idlecreationz.com' }, { '@type': 'Organization', name: 'Sagicor Innovation Lab' }],
  sameAs: [GITHUB, LINKEDIN, INSTAGRAM],
  knowsAbout: ['Software engineering', 'Backend development', 'Data pipelines', 'PostgreSQL', 'Go', 'TypeScript', 'React Native', 'AWS'],
}

export const website = { '@context': 'https://schema.org', '@type': 'WebSite', name: SITE_NAME, url: abs('/'), inLanguage: 'en' }

export function caseLd(c: Case) {
  const author = { '@type': 'Person', name: 'Kimani McLeish', url: abs('/'), sameAs: [GITHUB, LINKEDIN] }
  const app = c.slug === 'cite' || c.slug === 'tabi'
  return {
    '@context': 'https://schema.org',
    '@type': app ? 'SoftwareApplication' : 'CreativeWork',
    name: c.name,
    description: c.blurb,
    url: abs(`/work/${c.slug}`),
    image: c.shots[0] ? abs(c.shots[0].src) : abs('/og.jpg'),
    author,
    creator: author,
    keywords: c.chips.flatMap((g) => g.items).join(', '),
    ...(app ? { applicationCategory: c.slug === 'cite' ? 'NavigationApplication' : 'SocialNetworkingApplication', operatingSystem: 'iOS, Android', ...(c.url ? { sameAs: c.url } : {}) } : {}),
  }
}

export const caseDescription = (c: Case) => `${c.name} case file: ${c.blurb} Role: ${c.role}`.slice(0, 300)
export const caseSlugs = () => cases.map((c) => c.slug)
