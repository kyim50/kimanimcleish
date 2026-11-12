export const EMAIL = 'kimanimac2005@gmail.com'
export const LINKEDIN = 'https://linkedin.com/in/kimani-mcleish'
export const GITHUB = 'https://github.com/kyim50'
export const INSTAGRAM = 'https://www.instagram.com/kimani.mcleish/'
export const SITE = 'kimanimcleish.com'
export const socials = [
  { label: 'GitHub', href: GITHUB },
  { label: 'LinkedIn', href: LINKEDIN },
  { label: 'Instagram', href: INSTAGRAM },
  { label: 'Email', href: `mailto:${EMAIL}` },
]

export const earlier = [
  { name: 'Squire', line: 'Location-based helper-matching app, built and deployed in 24 hours for the Intellibus Hackathon.' },
  { name: 'Stratos', line: 'Cloud file management on Azure Blob Storage. Microsoft Hackathon 2023 finalist.' },
  { name: 'Curaease', line: 'Medical AI symptom checker trained on 200k+ patient-doctor conversations.' },
  { name: 'Quests', line: 'Full-stack PWA with location tracking. Microsoft Hackathon 2024 finalist.' },
  { name: 'Waddle Together', line: 'Couple-themed mobile app with custom animations and interactive experiences.' },
]

export const experience = [
  {
    dates: '09/2026 to Present',
    role: 'Data Consultant (Project basis)',
    org: 'University Hospital of the West Indies',
    place: 'Kingston',
    points: [
      'Python (pandas, openpyxl) parsers that consolidate six months of Administrative, Doctors and Nurses staff listings into one dataset, across monthly changes in column layout.',
      'Excel exception reports flagging new and returning people by employee ID, TRN and name, with a review flag for name-only matches; every formula checked against an independent Python calculation.',
      'De-duplication and a payroll cross reference of fortnightly and monthly lists, reconciled to the source totals.',
    ],
  },
  {
    dates: '04/2026 to Present',
    role: 'Software Engineering Team Lead (Contract)',
    org: 'I.D.L.E. Creationz',
    place: 'Kingston, remote',
    points: [
      'A Jamaican creative and digital studio (design, video, web) serving many local clients.',
      'Leads the software engineering team, building full production systems for clients, frontend to backend.',
      'Includes payment gateway integrations.',
    ],
  },
  {
    dates: '04/2026 to Present',
    role: 'Cybersecurity & Infrastructure Team Lead (Contract)',
    org: 'Sagicor Innovation Lab',
    place: 'Kingston',
    points: [
      'Leads the team securing and scaling 14 AWS servers across two regions and 5 production databases.',
      'The platform passed an external penetration test.',
      'Built a blue-green GitHub Actions pipeline for zero-downtime releases across regions, plus UAT and dev environments that mirror production.',
      "Presented the security architecture to UTech's CTO and IT heads.",
      'Wrote infrastructure docs adopted by a 7-person team.',
    ],
  },
  {
    dates: '04/2026 to 06/2026',
    role: 'Back End Developer (Internship)',
    org: 'Syntecxhub',
    place: 'Remote, India',
    points: ['Back end development internship.'],
  },
  {
    dates: '12/2025 to Present',
    role: 'Software Engineer Intern',
    org: 'Intellibus',
    place: 'Kingston',
    points: [
      'Integrated a CMS into the AI Academy site.',
      'Builds production components from Figma: responsive Next.js interfaces integrated with backend APIs.',
    ],
  },
  {
    dates: '06/2025 to 03/2026',
    role: 'Software Engineer (Contract)',
    org: 'Sagicor Innovation Lab',
    place: 'Kingston',
    points: [
      'SwiftPay APIs and stored procedures. CardioScore.',
      'Co-built an insurance claim-form system that automated claims processing.',
      'Gathered requirements with RADA and Sagicor department heads.',
      'Wrote onboarding docs and led user training for SwiftPay, RootIQ and CardioScore.',
    ],
  },
]

export const earlierRoles = [
  { dates: '05/2023 to 06/2023', role: 'Assistant, VP Office and IT Management', org: 'University of Technology, Jamaica', line: 'Streamlined operations for the Networking Department.' },
]

export const about = [
  'Software engineer in Kingston, Jamaica, studying B.Sc. Computing at the University of Technology (expected Aug 2027).',
  'I take a product from the phone screen down to the database and the server it runs on: apps, backends, data pipelines, payments and infrastructure.',
  'Off the clock: painting and drawing, sabre fencing, street and portrait photography, dancehall and lo-fi.',
]

export const offClock = [
  ['Painting', 'Oils and watercolour.'],
  ['Drawing', 'Pencil and digital.'],
  ['Fencing', 'Sabre.'],
  ['Photography', 'Street and portrait.'],
]

export type StackGroup = { group: string; items: string[] }
export const stack: StackGroup[] = [
  { group: 'Languages', items: ['TypeScript', 'JavaScript', 'Go', 'Python', 'SQL', 'Swift', 'Rust', 'C++'] },
  { group: 'Mobile and web', items: ['React Native (Expo)', 'React', 'Next.js', 'Angular', 'Electron', 'TanStack Query', 'Zustand', 'Reanimated', 'Mapbox'] },
  { group: 'Backend', items: ['Node.js', 'Express', 'Go (sqlc)', 'Rust (axum)', 'REST', 'Socket.IO', 'WebRTC', 'JWT', 'WhatsApp Web.js'] },
  { group: 'Data', items: ['PostgreSQL', 'PostGIS', 'H3', 'MySQL (stored procedures)', 'MongoDB', 'Redis', 'DuckDB', 'dbt', 'Supabase', 'Firebase', 'pandas'] },
  { group: 'Cloud and infrastructure', items: ['AWS EC2', 'Docker', 'Kubernetes', 'Nginx', 'GitHub Actions', 'Azure App Services', 'Railway', 'Vercel', 'EAS Build and OTA'] },
  { group: 'APIs and AI', items: ['OpenAI', 'Gemini API', 'Stripe', 'PayPal', 'HandyPay', 'RevenueCat', 'Apple HealthKit', 'Fitbit (OAuth2)', 'OpenStreetMap Overpass'] },
  { group: 'Testing and security', items: ['Jest', 'Playwright', 'Go test', 'k6', 'Postman', 'UAT', 'Row-level security', 'Penetration-test hardening'] },
]

export const gets = [
  'The app: iOS, Android or web',
  'The backend and database design',
  'Data pipelines and integrations: payments, maps, AI',
  'Payment gateways',
  'Deployment, CI/CD and monitoring',
  'Security hardening',
  'Handover docs, so your team can run it',
]

export const steps = [
  ['Scope', 'A fixed brief and price.'],
  ['Build', 'Shippable pieces every week, with a preview link.'],
  ['Launch', 'Store submission and production deploy.'],
  ['Handover', 'Docs, training and a support window.'],
]

export const builds = [
  { title: 'Payment gateway integration', line: 'Card and local gateways wired into a client site or app, with signed webhooks, refunds and a reconciliation view.', tags: ['Node', 'Webhooks', 'Postgres'] },
  { title: 'Ticketing and door check-in', line: 'Tickets with QR codes, a scanner for staff, walk-up admissions and a scan log, so a re-entry works and the count is trustworthy.', tags: ['QR', 'Postgres', 'Realtime'] },
  { title: 'Chat-based payments assistant', line: 'A WhatsApp assistant that reads a plain-language transfer request, checks who is asking and runs it through a secured API.', tags: ['WhatsApp', 'OpenAI', 'Node'] },
  { title: 'Content management for non-technical staff', line: 'A CMS wired into a Next.js site so a team publishes posts without a redeploy.', tags: ['Next.js', 'CMS'] },
  { title: 'Internal team and project system', line: 'A web app for a creative studio to manage its team, projects and pricing in one place.', tags: ['Next.js', 'Supabase'] },
  { title: 'Data clean-up and reporting', line: 'Messy spreadsheets merged into one dataset, with exception reports that flag what changed and what is missing.', tags: ['Python', 'pandas', 'Excel'] },
  { title: 'Claims and form automation', line: 'A form system that moved a paper-style approval process into software.', tags: ['Forms', 'Workflow'] },
  { title: 'Servers, security and releases', line: 'Multi-region servers, hardened security groups, UAT that mirrors production and zero-downtime blue-green deploys.', tags: ['AWS', 'Docker', 'GitHub Actions'] },
  { title: 'Personal brand and portfolio sites', line: 'Fast, well-built sites for professionals.', tags: ['Next.js', 'Vercel'] },
]

export const clients = [
  { name: 'I.D.L.E. Creationz', line: 'Software engineering team lead. Full production systems for Jamaican clients, payment gateways included.', href: 'https://idlecreationz.com' },
  { name: 'Syntecxhub', line: 'Back end developer, internship (04/2026 to 06/2026).', href: '' },
]

export const proof = [
  'Team lead at I.D.L.E. Creationz, shipping production systems, payment gateways included, for clients across Jamaica.',
  'Cite and Tabi, built solo to this standard and live.',
  'SwiftPay and CardioScore, shipped inside a company lab.',
  'Personal brand and portfolio sites for professionals.',
]

export const credentials = [
  ['Education', 'B.Sc. Computing, University of Technology, Jamaica.'],
  ['Certified', 'NVIDIA-Certified Associate: AI Infrastructure and Operations (NCA-AIIO), 2026 to 2028.'],
  ['Hackathons', "Microsoft Hackathon Jamaica, two-time finalist ('23/'24). Project Blue Mountain Hackathon. Intellibus Hackathon (Squire)."],
  ['Community', 'President, Future Developers Club (UTech). IEEE and SAPNA member.'],
]

export type Built = { kind: 'Architecture' | 'Backend' | 'Frontend' | 'Infrastructure' | 'Data'; items: string[] }

export type Case = {
  slug: 'cite' | 'tabi' | 'swiftpay' | 'cardioscore' | 'verro' | 'vault'
  name: string
  meta: string
  blurb: string
  points: string[]
  stack: string
  url?: string
  shots: { src: string; alt: string }[]
  file: string
  role: string
  status: string
  problem: string[]
  numbers: { n: string; label: string }[]
  built: Built[]
  hard: { title: string; body: string }[]
  chips: StackGroup[]
  links: { label: string; href: string }[]
}

export const cases: Case[] = [
  {
    slug: 'cite', name: 'Cite', file: 'CASE FILE 01', meta: 'iOS + Android · live', url: 'https://joincite.com',
    status: 'Adopted by the UTech Students\' Union',
    role: 'Founder. Designed and built the app, both backends, the data pipeline, the infrastructure and the website.',
    blurb: 'The live map of UTech, UWI Mona and Kingston: places, events and tickets, area alerts confirmed by neighbours, local businesses and moving vendors. Adopted by the UTech Students\' Union as an app for students.',
    problem: [
      'Most maps tell you what exists. Cite tells you what is true right now: the second-floor bathroom is locked, the campus cafe has a queue out the door, a road is flooded, there is free lunch in ten minutes.',
      'The useful half of local knowledge never reaches Google Maps: it is too small, too temporary or too specific to the people nearby. Cite is Jamaica-first, built for a campus and for a neighbourhood during a disruption.',
      'It has been adopted by the UTech Students\' Union as an app for students, so people on campus find rooms, events and what is open without asking around.',
    ],
    numbers: [
      { n: 'UTech SU', label: 'adopted by the UTech Students\' Union as an app for students' },
      { n: '183K', label: 'lines of app source (TypeScript), plus 88K of tests' },
      { n: '72K', label: 'lines of hand-written Go, plus 49K of tests' },
      { n: '119', label: 'SQL migrations' },
      { n: '9,500', label: 'automated tests counted in source (8.1K Jest, 1.36K Go)' },
      { n: '5', label: 'event sources pulled every 6 hours' },
      { n: '12 / 26', label: 'dbt models / data tests' },
    ],
    built: [
      { kind: 'Architecture', items: [
        'A modular monolith: one deployable per backend, split into clear internal modules, plus the Go service. The Express API keeps controllers, services, routes, middleware and validation apart, with a service module per area (pins, reports, area alerts, events, ticketing and event fees, groups, chat, moderation, notifications, business, flyers and event import). The Go service mirrors that with a package per concern (pins, events, alerts, safety, search, places, ingest, jobs, notify, realtime, billing, eventdoor).',
        'Why: a small team, simple deploys, and modules with their own boundaries that can be split out later. Go and Rust took over routes and jobs one at a time on exactly that seam.',
        'Expo app on iOS and Android, an Express API, a Go API and worker that take routes over from Express one at a time, and a Rust geo engine. Postgres with PostGIS is the source of truth.',
        'The phone never queries Supabase for data, only for sign-in. Every read and write goes through the API, which is what lets Postgres row-level security stay deny-all.',
        'A write-diff harness replays each moved write route against Express and Go and compares the response, the database change, the pushes and the live updates before a route moves.',
      ] },
      { kind: 'Backend', items: [
        'Pins, reports, area alerts, events, groups, reviews, saved items, tickets, vendors and claimed businesses, as REST plus a Socket.IO layer for chat, presence and live location.',
        'A trust-and-safety layer: polymorphic flagging, reputation-weighted auto-hide, penalties scoped to the abused capability, and a moderator queue that groups flags by target.',
        'Event ticketing and a door tool: QR tickets, a scanner for staff, walk-up admissions and an append-only scan log.',
        'Natural-language search through OpenAI with a keyword fallback; image uploads checked by magic bytes and capped at 50 megapixels; rate limits keyed on the account.',
      ] },
      { kind: 'Frontend', items: [
        'Expo SDK 57, React Native 0.86 and React 19 in TypeScript, with expo-router, a Mapbox map with custom styling, bottom sheets and Reanimated gestures.',
        'TanStack Query with a persister so the map opens already filled when offline; Zustand for local state.',
        'Live turn-by-turn walking navigation, 3D indoor campus maps, a paper-and-ink design system and a guest mode.',
        'The marketing site, operator tools (vendor, console, door, post, admin) and a blog on plain HTML and CSS, no framework.',
      ] },
      { kind: 'Infrastructure', items: [
        'Railway for the Go API, Go worker, Express and the geo engine; Supabase for Postgres and auth; Redis for rate limits, locks and live fan-out.',
        'GitHub Actions run typecheck, lint (as a ratchet that only fails if warnings grow) and tests; EAS Build and over-the-air updates ship the app.',
        'k6 load tests against a staging copy, with a guard that refuses to run against production.',
      ] },
      { kind: 'Data', items: [
        'An ingestion pipeline pulls events from 5 web sources every 6 hours with per-host rate limits, idempotent upserts and cross-source dedup.',
        'A validation layer skips bad records with a counted reason (no location, vague venue, outside Jamaica), so every run has a data-quality report.',
        'AI enrichment: a vision model reads flyers and recovers venues, with strict JSON output, a 0.6 confidence threshold, geocoding fallbacks and a moderator queue.',
        'A national seed of emergency and public places from OpenStreetMap, and about 12 scheduled jobs that run on exactly one server through Redis locks.',
        'A DuckDB star schema (3 fact tables, 5 dimensions) loaded nightly to keep the history the app deletes, with 12 dbt models and 26 data tests on GitHub Actions.',
      ] },
    ],
    hard: [
      { title: 'Walking directions that follow campus paths', body: 'A route over the OpenStreetMap graph came out about 1.9 times longer on campus, where paths cut through buildings and plazas. A custom obstacle-grid router and a Kalman-filtered GPS pipeline removed those detours.' },
      { title: 'Things that expire on purpose', body: 'Each report type has a lifetime and a ceiling, and every reply extends it without ever making it immortal. Missing-person alerts are the exception: they never auto-delete, they drop to local-only and ask the poster to confirm.' },
      { title: 'Trust with deny-all row-level security', body: 'Every table has RLS on with no policies, so the key in the app bundle reads nothing. Authorisation lives in one place, the API. Penalties attach to the abused capability, so deleting an account resets nothing.' },
      { title: 'Paid for the door, never touching ticket money', body: 'Jamaica is not supported by Stripe Connect and holding ticket money is custody, so Cite invoices a percentage of door-scanned value instead. Walk-up admissions and a scan log make that count honest for cash events.' },
      { title: 'Reading official notices without inventing words', body: 'Monitors turn NWA closures, NWC lock-offs, JCF curfews, Met Service warnings, NHC, USGS, JPS and JIS posts into alerts. AI only finds places and times in prose; the text people read comes from the agency\'s own words. A notice is read once.' },
      { title: 'Moving a live backend to Go and Rust without a rewrite', body: 'Go took the scheduled jobs and the read routes first, checked by the write-diff harness. Map clustering was ported to Rust and parity-tested against a corpus recorded from the TypeScript original.' },
      { title: 'Duplicates that are not duplicates', body: 'Two rooms on either side of a wall share nearly the same coordinates. Cite parses room codes, so 47A2 beside 47A1 is a different place while 47A1 posted twice is caught.' },
    ],
    chips: [
      { group: 'App', items: ['React Native (Expo)', 'TypeScript', 'expo-router', 'Mapbox', 'Reanimated', 'TanStack Query', 'Zustand'] },
      { group: 'Backend', items: ['Express', 'Go', 'Rust', 'Socket.IO', 'OpenAI'] },
      { group: 'Data', items: ['PostgreSQL', 'PostGIS', 'Redis', 'DuckDB', 'dbt', 'Supabase'] },
      { group: 'Infra and testing', items: ['Railway', 'GitHub Actions', 'EAS', 'Jest', 'Playwright', 'k6'] },
    ],
    links: [{ label: 'joincite.com', href: 'https://joincite.com' }],
    points: ['Adopted by the UTech Students\' Union', 'Modular monolith: Express and Go, split by module', 'Event ingestion from 5 web sources every 6 hours', 'AI flyer reading with a moderator queue', 'DuckDB star schema, 12 dbt models, 26 data tests', 'Campus walking navigation', 'Deny-all row-level security', '9,500 automated tests'],
    stack: 'React Native (Expo), TypeScript, Node, Go, Rust, PostgreSQL/PostGIS, Redis, Mapbox',
    shots: [
      { src: '/work/cite/map.webp', alt: 'Cite live map screen' },
      { src: '/work/cite/alerts.webp', alt: 'Cite area alert screen' },
      { src: '/work/cite/events.webp', alt: 'Cite event screen' },
      { src: '/work/cite/near-you.webp', alt: 'Cite map with nearby piles of pins' },
      { src: '/work/cite/indoor.webp', alt: 'Cite campus mode with indoor rooms' },
      { src: '/work/cite/door.webp', alt: 'Cite event with RSVP and a ticket QR code' },
      { src: '/work/cite/report.webp', alt: 'Cite report sheet' },
      { src: '/work/cite/walk.webp', alt: 'Cite turn-by-turn walking route' },
      { src: '/work/cite/groups.webp', alt: 'Cite private group map' },
    ],
  },
  {
    slug: 'tabi', name: 'Tabi', file: 'CASE FILE 02', meta: 'Go + PostGIS · live', url: 'https://jointabi.com',
    status: 'Live',
    role: 'Built the app and the Go backend.',
    blurb: 'Meet people by doing small things together: pick a short plan on a map, meet at a public place, level up as you go.',
    problem: [
      'Open-ended socialising is hard for people who find it awkward. Tabi swaps swiping and group chats for a short, time-boxed plan at a public place: a coffee before class, a pickup game, an hour of revision.',
      'It starts in Kingston, is for adults 18 and over, and treats safety as a feature that stays free.',
    ],
    numbers: [
      { n: '96K', label: 'lines of Go backend' },
      { n: '138', label: 'versioned migrations' },
      { n: '147', label: 'Go test files, run against a real Postgres' },
      { n: '30 days', label: 'venue catalogue refresh from OpenStreetMap' },
    ],
    built: [
      { kind: 'Architecture', items: ['A mobile app on a Go backend over PostgreSQL with PostGIS. Row-level security on the schema.'] },
      { kind: 'Backend', items: [
        'Quests with a kind, a time, a length and a public meeting point; check-in when both people arrive or by scanning each other\'s code.',
        'XP, classes earned from what you do most, bosses, dungeons, raids, streaks and parties of up to five.',
        'A safety timer on every quest that asks everyone if they are okay, an SOS that alerts trusted contacts, and block and report.',
      ] },
      { kind: 'Frontend', items: ['A world drawn in a fine grid of ASCII art, with a mascot you dress with gear you earn, guild halls and rooms you decorate.'] },
      { kind: 'Data', items: [
        'H3 cells, so the system stores only a rough location. Live location is shared only with people on the quest, only while it is on, and is never stored.',
        'Append-only event ledgers feed transactional batch jobs that build world and regional leaderboards with window functions and advisory locks.',
        'A Postgres job queue (FOR UPDATE SKIP LOCKED, retries, crashed-worker recovery) runs aggregation, data-retention and notification jobs.',
        'An ETL pulls OpenStreetMap venues through the Overpass API, maps raw tags to a venue catalogue and refreshes it every 30 days with retries.',
      ] },
    ],
    hard: [
      { title: 'Knowing where people are without keeping where they are', body: 'H3 cells let the backend match and rank by area while storing only rough location. Live position exists only for the length of a quest.' },
      { title: 'A queue with no queue server', body: 'Scheduled work runs on a Postgres job queue using SKIP LOCKED, with retries and recovery when a worker dies mid-job.' },
      { title: 'Leaderboards you can rebuild', body: 'Gameplay is stored as append-only ledgers, so the world and regional boards can be recomputed from history instead of being patched in place.' },
    ],
    chips: [
      { group: 'Backend', items: ['Go', 'PostgreSQL', 'PostGIS', 'H3', 'Row-level security'] },
      { group: 'Data', items: ['Overpass ETL', 'Job queue', 'Window functions', 'Advisory locks'] },
    ],
    links: [{ label: 'jointabi.com', href: 'https://jointabi.com' }],
    points: ['A ~96K-line Go backend', '138 versioned migrations with RLS', 'H3 cells, rough location only', 'Postgres job queue, SKIP LOCKED', 'OpenStreetMap ETL'],
    stack: 'Go, PostgreSQL/PostGIS, H3',
    shots: [
      { src: '/work/tabi/map.webp', alt: 'Tabi map screen' },
      { src: '/work/tabi/quest.webp', alt: 'Tabi quest screen' },
      { src: '/work/tabi/dungeons.webp', alt: 'Tabi dungeons screen' },
      { src: '/work/tabi/guild.webp', alt: 'Tabi guild hall' },
      { src: '/work/tabi/room.webp', alt: 'Tabi decorated room' },
      { src: '/work/tabi/dragon.webp', alt: 'Tabi dragon screen' },
      { src: '/work/tabi/character.webp', alt: 'Tabi character and skill screen' },
      { src: '/work/tabi/home.webp', alt: 'Tabi home screen' },
    ],
  },
  {
    slug: 'swiftpay', name: 'SwiftPay', file: 'CASE FILE 03', meta: 'Sagicor Innovation Lab',
    status: 'In use at the lab',
    role: 'Software engineer (contract), then infrastructure lead. Built the APIs, the database logic and the WhatsApp assistant, ran the servers, and trained users.',
    blurb: 'Payments for 12,000+ university students.',
    problem: [
      'A financial transaction platform for more than 12,000 university students that needed reliable transfers and balances, and a way to reach students where they already are.',
      'Requirements came from stakeholders including RADA and Sagicor department heads across IT, insurance and health, in recurring review meetings.',
    ],
    numbers: [
      { n: '12,000+', label: 'university students served' },
      { n: '2', label: 'AWS regions (us-east-2, us-west-2)' },
      { n: '0', label: 'downtime on releases, through blue-green deploys' },
    ],
    built: [
      { kind: 'Backend', items: [
        'Node.js and Express REST APIs for transfers, balances and JWT-protected endpoints.',
        'Multi-step transaction logic moved into MySQL stored procedures called directly by the API, cutting round-trips and average query response time.',
        'A WhatsApp AI assistant (WhatsApp Web.js and OpenAI) that parses plain-language transfer commands, authenticates the user by phone number and runs the payment through secured API endpoints.',
      ] },
      { kind: 'Infrastructure', items: [
        'Backend infrastructure on AWS EC2 across two regions, with a blue-green GitHub Actions pipeline for zero-downtime releases.',
        'UAT and development environments that mirror production.',
      ] },
      { kind: 'Architecture', items: ['Onboarding documentation for software-engineering roles in the lab, user test-case documents, and user training for SwiftPay, RootIQ and CardioScore.'] },
    ],
    hard: [
      { title: 'A production outage in the OTP service', body: 'A MSSQL connection failure was traced to an EC2 security-group misconfiguration. Fixing it restored the OTP authentication service.' },
      { title: 'Commands in plain English, money in a strict API', body: 'The assistant only turns a message into a request. Identity comes from the phone number and the payment still goes through the same secured endpoints as everything else.' },
    ],
    chips: [
      { group: 'Backend', items: ['Node.js', 'Express', 'MySQL', 'Stored procedures', 'JWT'] },
      { group: 'AI and chat', items: ['WhatsApp Web.js', 'OpenAI'] },
      { group: 'Infra', items: ['AWS EC2', 'GitHub Actions'] },
    ],
    links: [],
    points: ['Node/Express REST APIs: transfers, balances, JWT', 'Transaction logic in MySQL stored procedures', 'A WhatsApp AI assistant for secured payments'],
    stack: 'Node.js, Express, MySQL',
    shots: [],
  },
  {
    slug: 'cardioscore', name: 'CardioScore', file: 'CASE FILE 04', meta: 'Sagicor Innovation Lab',
    status: 'Built at the lab',
    role: 'Built the app, the backend and the deployment pipeline.',
    blurb: 'A health analytics app with a native Swift bridge to Apple HealthKit and Fitbit sign-in, a score from your data, and a comparison with your age band.',
    problem: [
      'People\'s health data sits in separate places: a watch, a phone, a Fitbit account. CardioScore gathers it into one view and one score, on iOS and Android.',
    ],
    numbers: [
      { n: '13K', label: 'lines of JavaScript in the app' },
      { n: '~900', label: 'lines in the Express backend' },
      { n: '7', label: 'ingest endpoints (activity, heart, sleep, body, vitals, health, history)' },
      { n: '6', label: 'age bands for cohort comparison' },
    ],
    built: [
      { kind: 'Architecture', items: ['An app that tries the best source for each platform and falls back: HealthKit on iOS, Health Connect on Android, then Fitbit, then the backend as a last resort.'] },
      { kind: 'Frontend', items: [
        'React Native (Expo) with a native Swift bridge to Apple HealthKit, activity rings, history and browse views, and charts.',
        'Fitbit OAuth2 sign-in, and a Samsung Health manager for Android.',
      ] },
      { kind: 'Backend', items: [
        'Express with MySQL and bcrypt auth. Raw payloads are stored first, then normalised into heart, sleep, activity, body and vitals tables.',
        'An insights service for streaks, personal bests, consistency and an overall health score, and a cohort service that compares a user with others in the same age band, adults only.',
      ] },
      { kind: 'Infrastructure', items: ['Deployed on AWS EC2 with a CI/CD pipeline across iOS and Android.'] },
    ],
    hard: [
      { title: 'Four sources, one picture', body: 'Each platform exposes health data differently. A priority chain picks the best available source and falls through to the next, so a user without a watch still gets a score.' },
      { title: 'Comparing people fairly', body: 'Scores are compared inside age bands worked out from date of birth, and only for adults, so the comparison means something.' },
    ],
    chips: [
      { group: 'App', items: ['React Native (Expo)', 'Swift', 'Apple HealthKit', 'Health Connect', 'Fitbit OAuth2'] },
      { group: 'Backend', items: ['Node.js', 'Express', 'MySQL', 'bcrypt'] },
      { group: 'Infra', items: ['AWS EC2', 'CI/CD'] },
    ],
    links: [],
    points: ['Native Swift bridge to Apple HealthKit', 'Fitbit OAuth2 integration', 'Full backend, plus CI/CD on AWS EC2'],
    stack: 'Swift, React Native (Expo), Fitbit OAuth2, MySQL, AWS EC2',
    shots: [],
  },
  {
    slug: 'verro', name: 'Verro', file: 'CASE FILE 05', meta: 'iOS + Android · App Store',
    status: 'Approved by Apple, tested with 50+ early users',
    role: 'Built and shipped it.',
    blurb: 'An artist marketplace: Pinterest-style discovery, Tinder-style matching and real payments.',
    problem: ['Commissioning art online means scrolling endless portfolios. Verro lets people discover artists and artwork the way they browse a feed, and pay for commissions inside the app.'],
    numbers: [
      { n: '50+', label: 'early users in testing' },
      { n: '3', label: 'discovery modes: Pinterest grid, TikTok scroll, Tinder swipe' },
      { n: '2', label: 'payment providers, Stripe and PayPal' },
    ],
    built: [
      { kind: 'Backend', items: [
        'A recommendation engine: tag-weighted interaction scoring (views, likes, saves) personalises each feed, plus an AI similarity layer using Gemini embedding vectors to surface related artwork.',
        'Payments with Stripe and PayPal, including a custom top-up wallet for in-app balances.',
      ] },
      { kind: 'Frontend', items: ['Three discovery modes, with client state in TanStack Query.'] },
      { kind: 'Data', items: ['Supabase for data, Redis caching for low-latency feeds, AWS for hosting.'] },
    ],
    hard: [{ title: 'A feed that learns', body: 'Every view, like and save nudges tag weights, and embeddings fill the gaps for artwork with little history.' }],
    chips: [{ group: 'Stack', items: ['React Native', 'Node', 'Supabase', 'Redis', 'AWS', 'Stripe', 'PayPal', 'Gemini', 'TanStack Query'] }],
    links: [],
    points: ['Tag-weighted recommendations plus Gemini embeddings', 'Stripe and PayPal with a top-up wallet', 'Pinterest, TikTok and Tinder discovery modes'],
    stack: 'React Native, Node, Supabase, Redis, AWS, Stripe, PayPal',
    shots: [],
  },
  {
    slug: 'vault', name: 'Vault', file: 'CASE FILE 06', meta: 'macOS · Electron',
    status: 'Desktop app',
    role: 'Built it.',
    blurb: 'A developer HUD for macOS: git vitals per repo, a markdown task workspace and an AI usage meter in one window.',
    problem: ['Developers keep repo state, tasks and AI usage in different places. Vault puts them in one customisable heads-up display.'],
    numbers: [{ n: '3', label: 'model providers routed: Anthropic, OpenAI, local Ollama' }],
    built: [
      { kind: 'Architecture', items: ['A universal macOS app in Electron.'] },
      { kind: 'Backend', items: [
        'A multi-provider matrix routes headless command execution to the matching CLI (Anthropic, OpenAI or local Ollama) and re-aims the usage meter per provider.',
        'A zero-config markdown engine with a native filesystem watcher for live updates.',
      ] },
      { kind: 'Frontend', items: ['Per-repo git vitals and a shareable JSON theming and layout system.'] },
    ],
    hard: [{ title: 'One meter, three providers', body: 'Each provider reports usage differently, so the meter is re-pointed per provider instead of assuming one shape.' }],
    chips: [{ group: 'Stack', items: ['Electron', 'JavaScript', 'Markdown', 'Anthropic CLI', 'OpenAI CLI', 'Ollama'] }],
    links: [],
    points: ['Per-repo git vitals', 'Multi-provider AI usage meter', 'Live markdown task workspace'],
    stack: 'Electron, JavaScript, Ollama',
    shots: [],
  },
]

export const bio = {
  line1: 'Software engineer in Kingston, Jamaica. The app, the backend, the data pipelines and the infrastructure that keeps it running.',
  line2: 'Team lead at I.D.L.E. Creationz and Sagicor Innovation Lab. Building Cite.',
}
