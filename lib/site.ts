/** One place to change the site's address. */
export const SITE_URL = 'https://kimanimcleish.vercel.app'
export const SITE_NAME = 'Kimani McLeish'
export const OG_IMAGE = '/og.jpg'
export const OG_ALT = 'Kimani McLeish, software engineer in Kingston, Jamaica: a paste-up of old Kingston maps and app screens'
export const abs = (path: string) => (path.startsWith('http') ? path : `${SITE_URL}${path === '/' ? '' : path}`)
