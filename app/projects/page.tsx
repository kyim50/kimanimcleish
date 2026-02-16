'use client'

import { useEffect, useState, useRef } from 'react'
import Footer from '@/components/Footer'
import { useTextScramble } from '@/hooks/useTextScramble'
import { useTilt } from '@/hooks/useTilt'
import { useTheme } from '@/components/ThemeProvider'

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, isVisible }
}

function useAnimatedCounter(target: number, isVisible: boolean, duration = 1200) {
  const [count, setCount] = useState(0)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!isVisible || hasAnimated.current) return
    hasAnimated.current = true
    const startTime = Date.now()
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress >= 1) clearInterval(timer)
    }, 30)
    return () => clearInterval(timer)
  }, [isVisible, target, duration])

  return count
}

const PIPELINE_STAGES = [
  { label: 'fetching deps', icon: '  [>    ]', ascii: '  npm install ...' },
  { label: 'compiling', icon: '  [=>   ]', ascii: '  tsc --build ...' },
  { label: 'bundling', icon: '  [==>  ]', ascii: '  webpack --mode prod ...' },
  { label: 'testing', icon: '  [===> ]', ascii: '  jest --runInBand ...' },
  { label: 'deploying', icon: '  [====>]', ascii: '  vercel --prod ...' },
  { label: 'live!', icon: '  [=====]', ascii: '  ✓ deployed to production' },
]

export default function Projects() {
  const headerSection = useInView()
  const listSection = useInView()
  const statsSection = useInView()
  const projectsTitle = useTextScramble('Projects', headerSection.isVisible)
  const { theme } = useTheme()
  const isLight = theme === 'light'

  const [pipelineStage, setPipelineStage] = useState(0)
  const [activeFilter, setActiveFilter] = useState('all')
  const [expandedProject, setExpandedProject] = useState<number | null>(null)

  const tilt0 = useTilt(6)
  const tilt1 = useTilt(6)
  const tilt2 = useTilt(6)
  const tilt3 = useTilt(6)
  const tilt4 = useTilt(6)
  const tilt5 = useTilt(6)
  const tilt6 = useTilt(6)
  const tilt7 = useTilt(6)
  const tilts = [tilt0, tilt1, tilt2, tilt3, tilt4, tilt5, tilt6, tilt7]

  const projectCount = useAnimatedCounter(8, statsSection.isVisible)
  const techCount = useAnimatedCounter(12, statsSection.isVisible)
  const hackathonCount = useAnimatedCounter(2, statsSection.isVisible, 800)

  useEffect(() => {
    const interval = setInterval(() => {
      setPipelineStage((prev) => (prev + 1) % PIPELINE_STAGES.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const projects = [
    {
      title: 'Curaease',
      description: 'Medical AI symptom checker trained on 200k+ patient-doctor conversations with 90% diagnostic accuracy.',
      icon: '{+}',
      url: 'https://github.com/kyim50',
      category: 'ai',
      details: 'Built a RAG pipeline that processes medical queries through a fine-tuned model, cross-referencing a vectorized knowledge base of 200k+ conversations for accurate symptom analysis.',
      tech: [
        { name: 'TypeScript', color: 'bg-blue-500' },
        { name: 'Next.js', color: 'bg-gray-600' },
        { name: 'Open Router', color: 'bg-green-500' },
        { name: 'RAG', color: 'bg-purple-500' },
      ],
    },
    {
      title: 'Waddle Together',
      description: 'Couple-themed mobile application featuring custom animations and interactive experiences.',
      icon: "<'>",
      url: 'https://github.com/kyim50',
      category: 'mobile',
      details: 'Features real-time sync between partners, custom Lottie animations, shared calendars, and a widget system for home screens. Published on TestFlight.',
      tech: [
        { name: 'React Native', color: 'bg-cyan-500' },
        { name: 'TypeScript', color: 'bg-blue-500' },
        { name: 'Firebase', color: 'bg-orange-500' },
      ],
    },
    {
      title: 'Squire',
      description: 'Location-based helper-matching app developed and deployed in 24 hours for the Intellibus Hackathon.',
      icon: '/|\\',
      url: 'https://github.com/kyim50',
      category: 'web',
      details: 'Uses geolocation to match helpers with nearby requesters in real-time. Features live map tracking, push notifications, and a reputation system.',
      tech: [
        { name: 'Next.js', color: 'bg-gray-600' },
        { name: 'Geolocation API', color: 'bg-green-500' },
        { name: 'Firebase', color: 'bg-orange-500' },
      ],
    },
    {
      title: 'Quests',
      description: 'Full-stack PWA with location tracking, finalist at Microsoft Hackathon 2024.',
      icon: '{#}',
      url: 'https://github.com/kyim50',
      category: 'web',
      details: 'A gamified task management PWA with real-world location-based quests. Uses Mapbox for interactive maps and Firebase for real-time multiplayer features.',
      tech: [
        { name: 'React', color: 'bg-cyan-500' },
        { name: 'Mapbox API', color: 'bg-blue-500' },
        { name: 'Firebase', color: 'bg-orange-500' },
        { name: 'PWA', color: 'bg-green-500' },
      ],
    },
    {
      title: 'Verro',
      description: 'Art commission marketplace combining Pinterest-style discovery with Tinder-style matching.',
      icon: '[~]',
      url: 'https://github.com/kyim50',
      category: 'mobile',
      details: 'Features a recommendation engine for art styles, a swipe-based artist discovery flow, and integrated payment processing for commissions.',
      tech: [
        { name: 'React', color: 'bg-cyan-500' },
        { name: 'Node.js', color: 'bg-green-500' },
        { name: 'Supabase', color: 'bg-emerald-500' },
        { name: 'REST API', color: 'bg-blue-500' },
      ],
    },
    {
      title: 'CardioScore',
      description: 'Cardiovascular health assessment tool with risk calculation and personalized insights.',
      icon: '<3>',
      url: 'https://github.com/kyim50',
      category: 'mobile',
      details: 'Independently built from concept to deployment at Sagicor. Uses medical algorithms to calculate cardiovascular risk scores with personalized health recommendations.',
      tech: [
        { name: 'React', color: 'bg-cyan-500' },
        { name: 'TypeScript', color: 'bg-blue-500' },
        { name: 'Health APIs', color: 'bg-green-500' },
      ],
    },
    {
      title: 'Swifpay',
      description: 'Payment system backend with REST API architecture for Sagicor Lab.',
      icon: '[$]',
      url: 'https://github.com/kyim50',
      category: 'backend',
      details: 'Designed and implemented a scalable REST API for processing payments, with transaction logging, webhook integrations, and comprehensive error handling.',
      tech: [
        { name: 'Node.js', color: 'bg-green-500' },
        { name: 'TypeScript', color: 'bg-blue-500' },
        { name: 'REST API', color: 'bg-gray-600' },
      ],
    },
    {
      title: 'Stratos',
      description: 'Cloud-based file management using Azure Blob Storage, finalist at Microsoft Hackathon 2023.',
      icon: '(~)',
      url: 'https://github.com/kyim50',
      category: 'web',
      details: 'A cloud file manager with drag-and-drop uploads, folder organization, sharing links, and real-time storage analytics powered by Azure.',
      tech: [
        { name: 'Azure', color: 'bg-blue-500' },
        { name: 'React', color: 'bg-cyan-500' },
        { name: 'REST API', color: 'bg-green-500' },
      ],
    },
  ]

  const filters = [
    { id: 'all', label: 'all', cmd: 'ls -la' },
    { id: 'web', label: 'web', cmd: 'ls web/' },
    { id: 'mobile', label: 'mobile', cmd: 'ls mobile/' },
    { id: 'ai', label: 'ai/ml', cmd: 'ls ai/' },
    { id: 'backend', label: 'backend', cmd: 'ls backend/' },
  ]

  const filteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter((p) => p.category === activeFilter)

  return (
    <div className="max-w-3xl mx-auto px-6 pt-16">
      <section className="py-4">
        {/* ASCII art header */}
        <div ref={headerSection.ref}>
          <div className={`ascii-art text-gray-700 text-[10px] mb-4 ${headerSection.isVisible ? 'animate-fade-in animate-float' : 'opacity-0'}`}>
{`   ╭─────────────────────────╮
   │  ~/projects $ ls -la    │
   │  total 8 projects       │
   │  drwxr-xr-x  shipped/   │
   │  status: all live [ok]  │
   ╰─────────────────────────╯`}
          </div>

          <h1 className={`text-3xl font-semibold mb-2 font-mono ${headerSection.isVisible ? 'animate-fade-in-up delay-200' : 'opacity-0'}`}>
            {projectsTitle}
          </h1>

          {/* Tech stack marquee */}
          <div className={`overflow-hidden mb-6 ${headerSection.isVisible ? 'animate-fade-in delay-400' : 'opacity-0'}`}>
            <div className="flex whitespace-nowrap animate-marquee">
              <span className="ascii-art text-gray-700 text-[10px] mx-4">
                :: react :: next.js :: typescript :: firebase :: node.js :: react native :: angular :: azure :: postgresql :: react :: next.js :: typescript :: firebase :: node.js :: react native :: angular :: azure :: postgresql ::
              </span>
            </div>
          </div>
        </div>

        {/* Build Pipeline Animation */}
        <div className={`mb-8 rounded-lg p-4 font-mono ${isLight ? 'bg-gray-100' : 'bg-[#0a0a0a]'} ${headerSection.isVisible ? 'animate-fade-in-up delay-300' : 'opacity-0'}`}>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
            </div>
            <span className="text-gray-500 text-[10px]">build-pipeline.sh</span>
          </div>
          <div className="space-y-1">
            {PIPELINE_STAGES.map((stage, i) => (
              <div
                key={stage.label}
                className={`text-[11px] transition-all duration-500 ${
                  i < pipelineStage
                    ? 'text-green-500'
                    : i === pipelineStage
                    ? (isLight ? 'text-gray-800' : 'text-white')
                    : 'text-gray-600'
                }`}
              >
                <span className="inline-block w-[90px]">
                  {i < pipelineStage ? '  [=====]' : i === pipelineStage ? stage.icon : '  [     ]'}
                </span>
                <span className={i === pipelineStage ? 'terminal-cursor' : ''}>
                  {i <= pipelineStage ? stage.ascii : `  waiting...`}
                </span>
                {i < pipelineStage && <span className="text-green-500 ml-2">✓</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Stats Row */}
        <div ref={statsSection.ref} className={`grid grid-cols-3 gap-3 mb-8 ${statsSection.isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          {[
            { label: 'projects shipped', value: projectCount, icon: '>>>' },
            { label: 'technologies', value: techCount, icon: '::' },
            { label: 'hackathon finals', value: hackathonCount, icon: '**' },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${isLight ? 'bg-gray-100 hover:bg-gray-200' : 'bg-[#0a0a0a] hover:bg-[#111]'} ${statsSection.isVisible ? `animate-fade-in-up delay-${(i + 1) * 100}` : 'opacity-0'}`}
            >
              <span className={`text-lg font-bold font-mono ${isLight ? 'text-gray-900' : 'text-white'}`}>
                {stat.value}
              </span>
              <div className="flex flex-col">
                <span className="text-gray-500 text-[10px] font-mono leading-tight">{stat.label}</span>
                <span className="ascii-icon text-gray-600 text-[9px]">{stat.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ASCII divider */}
        <div className="ascii-art text-gray-700 text-[10px] mb-4 animate-shimmer rounded">
{`  +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+`}
        </div>

        {/* Filter Tabs */}
        <div className={`flex flex-wrap items-center gap-2 mb-6 ${headerSection.isVisible ? 'animate-fade-in-up delay-500' : 'opacity-0'}`}>
          <span className="text-gray-500 text-[10px] font-mono mr-1">~/projects $</span>
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => { setActiveFilter(filter.id); setExpandedProject(null) }}
              className={`px-3 py-1 rounded-md text-[11px] font-mono transition-all duration-300 ${
                activeFilter === filter.id
                  ? isLight
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-black'
                  : isLight
                    ? 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800'
                    : 'bg-[#111] text-gray-500 hover:bg-[#1a1a1a] hover:text-gray-300'
              }`}
            >
              {filter.cmd}
            </button>
          ))}
        </div>

        {/* Project filter result count */}
        <div className="text-gray-500 text-[10px] font-mono mb-4">
          {`  > found ${filteredProjects.length} project${filteredProjects.length !== 1 ? 's' : ''} matching "${activeFilter === 'all' ? '*' : activeFilter}/"`}
        </div>

        {/* Project List */}
        <div ref={listSection.ref} className="space-y-1.5">
          {filteredProjects.map((project, i) => {
            const tiltIdx = projects.indexOf(project)
            const tilt = tilts[tiltIdx]
            const isExpanded = expandedProject === tiltIdx

            return (
              <div
                key={project.title}
                ref={tilt.ref}
                onMouseMove={tilt.handleMouseMove}
                onMouseLeave={tilt.handleMouseLeave}
                className={`tilt-card rounded-lg transition-all duration-300 overflow-hidden ${isLight ? 'bg-gray-50 hover:bg-gray-100 hover:shadow-lg hover:shadow-black/5' : 'bg-[#0a0a0a] hover:bg-[#111] hover:shadow-lg hover:shadow-white/5'} ${listSection.isVisible ? `animate-fade-in-up delay-${Math.min((i + 1) * 100, 800)}` : 'opacity-0'}`}
              >
                <div className="tilt-shine" />
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex justify-between items-start gap-6 group p-4 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault()
                    setExpandedProject(isExpanded ? null : tiltIdx)
                  }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="ascii-icon text-gray-500 text-xs font-mono group-hover:text-green-400 group-hover:animate-bounce-subtle inline-block transition-colors duration-300">{project.icon}</span>
                      <span className="ascii-art text-gray-700 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">&gt;</span>
                      <h3 className="text-sm font-semibold group-hover:text-green-400 transition-colors duration-300">{project.title}</h3>
                      <svg
                        className={`w-3 h-3 text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    <p className="text-gray-400 text-xs leading-relaxed max-w-md ml-0 group-hover:ml-6 transition-all duration-300">
                      {project.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2.5 max-w-[320px] justify-end">
                    {project.tech.map((t) => (
                      <span
                        key={t.name}
                        className={`${t.color} px-2.5 py-1 rounded-full text-[10px] font-medium group-hover:scale-110 transition-transform duration-200`}
                      >
                        {t.name}
                      </span>
                    ))}
                  </div>
                </a>

                {/* Expanded Details */}
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    isExpanded ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className={`px-4 pb-4 pt-0 border-t ${isLight ? 'border-gray-200' : 'border-[#1a1a1a]'}`}>
                    <div className="flex items-start gap-3 mt-3">
                      <pre className="ascii-art text-gray-600 text-[9px] flex-shrink-0 leading-[1.2]">
{`  ┌──┐
  │>>│
  └──┘`}
                      </pre>
                      <div className="flex-1">
                        <p className="text-gray-400 text-xs leading-relaxed">{project.details}</p>
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 mt-2 text-[10px] font-mono text-green-500 hover:text-green-400 transition-colors duration-200"
                        >
                          view source
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* No results */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <pre className="ascii-art text-gray-600 text-[9px] inline-block animate-float-slow">
{`  ╭───────────────────╮
  │  no results found │
  │  try "ls -la"     │
  ╰───────────────────╯`}
            </pre>
          </div>
        )}

        {/* ASCII footer art */}
        <div className="ascii-art text-gray-600 text-[9px] mt-10 text-center">
          <div className="animate-pulse-glow">
{`  ╭───────────────────────────────╮
  │  EOF  .  8/8 shipped  [done]  │
  │  0 bugs (that i know of)      │
  │                               │
  │  ┌──┐                         │
  │  │ok│  << all systems go      │
  │  └──┘                         │
  ╰───────────────────────────────╯`}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
