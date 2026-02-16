'use client'

import { useEffect, useState, useRef } from 'react'
import Footer from '@/components/Footer'
import { useTextScramble } from '@/hooks/useTextScramble'
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

export default function About() {
  const photos = [
    '/images/35aeffe1.png',
    '/images/IMG_5024.png',
  ]

  const artworks = [
    '/images/IMG_0804.png',
    '/images/IMG_0806.png',
    '/images/IMG_0807.png',
    '/images/IMG_0808.png',
    '/images/IMG_0929.png',
    '/images/IMG_2023.png',
    '/images/IMG_5324.png',
    '/images/IMG_8042.png',
    '/images/IMG_2842.png',
  ]

  const timeline = [
    {
      title: 'Intellibus',
      role: 'Software Engineer',
      period: 'Dec 2025 - Now',
      color: 'bg-blue-500',
      icon: '[>_]',
      description: [
        'designing and implementing UI/UX for the AI Academy platform',
        'leading frontend architecture decisions and creating reusable component libraries',
      ],
    },
    {
      title: 'Sagicor Innovation Lab',
      role: 'Software Developer',
      period: '2025 - Now',
      color: 'bg-green-500',
      icon: '[$$]',
      description: [
        'built CardioScore independently from concept to deployment',
        'developed backend REST API system for Swifpay payment platform',
        'designed UI components and modals for Root mobile application',
      ],
    },
    {
      title: 'University of Technology, Jamaica',
      role: 'B.S. Computer Science',
      period: '2022 - Present',
      color: 'bg-purple-500',
      icon: '[**]',
      description: [
        '4th year student with 70% scholarship',
        'GPA: 3.05/4.3',
        'Microsoft Hackathon Finalist 2023 & 2024',
      ],
    },
    {
      title: 'University of Technology',
      role: 'Assistant, VP Office & IT Management',
      period: 'May 2023 - Jun 2023',
      color: 'bg-green-500',
      icon: '[//]',
      description: ['streamlined operations for Networking Department'],
    },
  ]

  const projects = [
    {
      title: 'Curaease',
      description: 'Medical AI symptom checker trained on 200k+ patient-doctor conversations with 90% diagnostic accuracy.',
      icon: '{+}',
      tech: [
        { name: 'TypeScript', color: 'bg-blue-500' },
        { name: 'Next.js', color: 'bg-gray-600' },
        { name: 'Open Router', color: 'bg-green-500' },
        { name: 'RAG', color: 'bg-purple-500' },
      ],
    },
    {
      title: 'Waddle Together',
      description: 'Couple-themed mobile app featuring custom animations and interactive experiences.',
      icon: "<'>",
      tech: [
        { name: 'React Native', color: 'bg-cyan-500' },
        { name: 'TypeScript', color: 'bg-blue-500' },
        { name: 'Firebase', color: 'bg-orange-500' },
      ],
    },
    {
      title: 'Squire',
      description: 'Location-based helper-matching app built in 24 hours for the Intellibus Hackathon.',
      icon: '/|\\',
      tech: [
        { name: 'Next.js', color: 'bg-gray-600' },
        { name: 'Geolocation API', color: 'bg-green-500' },
        { name: 'Firebase', color: 'bg-orange-500' },
      ],
    },
  ]

  const hobbies = [
    { title: 'Painting', desc: 'putting feelings on canvas when code gets too logical', stat: 'oils & watercolour', icon: '[~~]' },
    { title: 'Drawing', desc: 'sketching ideas before they become pixels', stat: 'pencil & digital', icon: '[//]' },
    { title: 'Fencing', desc: 'solving problems with footwork and a blade', stat: 'sabre', icon: '[/|]' },
    { title: 'Photography', desc: 'capturing moments between the lines of code', stat: 'street & portrait', icon: '[o]' },
  ]

  const skills = [
    { name: 'TypeScript', level: 90, icon: 'TS' },
    { name: 'React / Next.js', level: 88, icon: '<>' },
    { name: 'React Native', level: 80, icon: 'RN' },
    { name: 'Node.js', level: 78, icon: 'NJ' },
    { name: 'Firebase', level: 75, icon: 'FB' },
    { name: 'PostgreSQL', level: 65, icon: 'PG' },
    { name: 'Azure / AWS', level: 60, icon: '~~' },
    { name: 'Python', level: 55, icon: 'PY' },
  ]

  const currentlyItems = [
    { label: 'building', value: 'AI Academy @ Intellibus', icon: '[>_]' },
    { label: 'learning', value: 'machine learning & RAG systems', icon: '[??]' },
    { label: 'reading', value: 'Designing Data-Intensive Apps', icon: '[==]' },
    { label: 'listening', value: 'lofi beats & dancehall', icon: '[~~]' },
    { label: 'playing', value: 'with new APIs', icon: '[>>]' },
  ]

  const [currentlyIdx, setCurrentlyIdx] = useState(0)
  const [currentlyFading, setCurrentlyFading] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentlyFading(true)
      setTimeout(() => {
        setCurrentlyIdx((prev) => (prev + 1) % currentlyItems.length)
        setCurrentlyFading(false)
      }, 400)
    }, 3500)
    return () => clearInterval(interval)
  }, [currentlyItems.length])

  const gallerySection = useInView()
  const artworkSection = useInView()
  const timelineSection = useInView()
  const projectsSection = useInView()
  const hobbiesSection = useInView()
  const skillsSection = useInView()
  const currentlySection = useInView()

  const { theme } = useTheme()
  const isLight = theme === 'light'
  const artworkTitle = useTextScramble('Artwork', artworkSection.isVisible)
  const timelineTitle = useTextScramble('Timeline', timelineSection.isVisible)
  const projectsTitle = useTextScramble('Projects', projectsSection.isVisible)
  const hobbiesTitle = useTextScramble('Hobbies', hobbiesSection.isVisible)
  const skillsTitle = useTextScramble('Tech Stack', skillsSection.isVisible)

  return (
    <div className="max-w-3xl mx-auto px-6 pt-16">
      <section className="py-4">
        {/* ASCII portrait */}
        <div className="flex items-start gap-4 mb-4">
          <div className="ascii-art text-gray-700 text-[10px] animate-fade-in animate-float">
{`   ╭──────────────╮
   │  ┌─┐    ┌─┐  │
   │  │o│    │o│  │
   │  └─┘    └─┘  │
   │      __      │
   │     /  \\     │
   │     \\__/     │
   ╰──────────────╯`}
          </div>
          <pre className="ascii-art text-gray-600 text-[9px] animate-wave mt-2 leading-tight">
{`  \\_/
 --*--
  / \\`}
          </pre>
        </div>

        <h1 className="text-3xl font-semibold mb-1 animate-fade-in-up">
          About <span className="ascii-icon text-gray-500 text-sm animate-pop inline-block">*</span>
        </h1>
        <p className="text-gray-400 mb-10 animate-fade-in-up delay-100">Who I am.</p>

        {/* Photos of me */}
        <div ref={gallerySection.ref} className="flex justify-center gap-5 mb-12">
          {photos.map((src, i) => {
            const rot = [-2, 2][i]
            return (
              <div
                key={i}
                className={`relative ${gallerySection.isVisible ? 'animate-fade-in' : 'opacity-0'}`}
                style={{
                  animationDelay: `${(i + 1) * 0.1}s`,
                  zIndex: 1,
                  transition: 'z-index 0s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.zIndex = '50'
                  const img = e.currentTarget.querySelector('img') as HTMLElement
                  if (img) {
                    img.style.transform = 'rotate(0deg) scale(1.15)'
                    img.style.boxShadow = isLight ? '0 12px 40px rgba(0,0,0,0.15)' : '0 12px 40px rgba(0,0,0,0.5)'
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.zIndex = '1'
                  const img = e.currentTarget.querySelector('img') as HTMLElement
                  if (img) {
                    img.style.transform = `rotate(${rot}deg) scale(1)`
                    img.style.boxShadow = 'none'
                  }
                }}
              >
                <img
                  src={src}
                  alt="Kimani McLeish"
                  className="w-[160px] h-[200px] object-cover cursor-pointer"
                  style={{
                    borderRadius: '10px',
                    transform: `rotate(${rot}deg)`,
                    transition: 'transform 0.4s ease, box-shadow 0.4s ease',
                  }}
                />
              </div>
            )
          })}
        </div>

        {/* Currently Section */}
        <div ref={currentlySection.ref} className={`mb-12 ${currentlySection.isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <div className={`p-4 rounded-lg font-mono ${isLight ? 'bg-gray-100' : 'bg-[#0a0a0a]'}`}>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-gray-500 text-[10px]">currently</span>
            </div>
            <div className="space-y-2">
              {currentlyItems.map((item, i) => (
                <div
                  key={item.label}
                  className={`flex items-center gap-3 transition-all duration-500 ${
                    i === currentlyIdx
                      ? currentlyFading ? 'opacity-30 translate-y-1' : 'opacity-100 translate-y-0'
                      : 'opacity-30'
                  }`}
                >
                  <span className={`text-[10px] w-16 text-right flex-shrink-0 ${i === currentlyIdx ? 'text-green-500' : 'text-gray-600'}`}>
                    {item.label}
                  </span>
                  <span className={`ascii-icon text-[10px] flex-shrink-0 ${i === currentlyIdx ? 'text-green-500' : 'text-gray-700'}`}>
                    {item.icon}
                  </span>
                  <span className={`text-xs truncate ${i === currentlyIdx ? (isLight ? 'text-gray-900' : 'text-white') : 'text-gray-600'}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Artwork section */}
        <div ref={artworkSection.ref} className="mb-16">
          <div className="flex items-center gap-3 mb-5">
            <h2 className={`text-lg font-semibold font-mono ${artworkSection.isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              {artworkTitle} <span className="ascii-icon text-gray-500 text-sm animate-pop inline-block">[~~]</span>
            </h2>
            <div className={`flex-1 h-px ${artworkSection.isVisible ? 'animate-reveal-line' : 'opacity-0'}`} style={{ backgroundColor: isLight ? '#eee' : '#1a1a1a' }} />
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {artworks.map((src, i) => {
              const rotations = [-2, 1.5, -1, 2.5, -1.5, 2, -2.5, 1, -1.5]
              const rot = rotations[i % rotations.length]
              return (
                <div
                  key={i}
                  className={`relative ${artworkSection.isVisible ? 'animate-fade-in' : 'opacity-0'}`}
                  style={{
                    animationDelay: `${Math.min((i + 1) * 0.1, 1)}s`,
                    zIndex: 1,
                    transition: 'z-index 0s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.zIndex = '50'
                    const img = e.currentTarget.querySelector('img') as HTMLElement
                    if (img) {
                      img.style.transform = 'rotate(0deg) scale(1.15)'
                      img.style.boxShadow = isLight ? '0 12px 40px rgba(0,0,0,0.15)' : '0 12px 40px rgba(0,0,0,0.5)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.zIndex = '1'
                    const img = e.currentTarget.querySelector('img') as HTMLElement
                    if (img) {
                      img.style.transform = `rotate(${rot}deg) scale(1)`
                      img.style.boxShadow = 'none'
                    }
                  }}
                >
                  <img
                    src={src}
                    alt={`Artwork ${i + 1}`}
                    className="w-[130px] h-[150px] object-cover cursor-pointer"
                    style={{
                      borderRadius: '10px',
                      transform: `rotate(${rot}deg)`,
                      transition: 'transform 0.4s ease, box-shadow 0.4s ease',
                    }}
                    loading="lazy"
                  />
                </div>
              )
            })}
          </div>
        </div>

        {/* ASCII terminal divider */}
        <div className="ascii-art text-gray-700 text-[10px] mb-8 text-center animate-fade-in animate-shimmer rounded p-2">
{`  ╔══════════════════════════════════════╗
  ║  ~/kimani/experience $ cat resume   ║
  ║  loading... ██████████░░░ 78%       ║
  ╚══════════════════════════════════════╝`}
        </div>

        {/* Timeline */}
        <div ref={timelineSection.ref} className="flex gap-12 mb-16">
          <h2 className={`text-xl font-semibold whitespace-nowrap pt-1 font-mono ${timelineSection.isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            {timelineTitle} <span className="ascii-icon text-gray-500 text-sm animate-wiggle inline-block">[~]</span>
          </h2>
          <div className="relative pl-8 flex-1">
            <div className="absolute left-1.5 top-2 bottom-0 w-px" style={{ backgroundColor: isLight ? '#ddd' : '#222' }} />
            {timeline.map((item, i) => (
              <div key={i} className={`relative mb-8 last:mb-0 ${timelineSection.isVisible ? `animate-fade-in-up delay-${(i + 1) * 100}` : 'opacity-0'}`}>
                <div className={`absolute -left-8 top-2 w-3 h-3 ${item.color} rounded-full border-2`} style={{ borderColor: isLight ? '#fff' : '#000' }} />
                <div className={`flex justify-between items-start gap-4 group p-2 -m-2 rounded-lg transition-all duration-300 ${isLight ? 'hover:bg-gray-100' : 'hover:bg-[#0a0a0a]'}`}>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold group-hover:text-blue-400 transition-colors duration-300">
                      <span className="ascii-icon text-gray-500 text-xs mr-1.5 group-hover:text-blue-400 transition-colors duration-300">{item.icon}</span>
                      {item.title}
                    </h3>
                    <p className="text-gray-400 text-sm italic">{item.role}</p>
                    <ul className="text-gray-500 text-xs mt-1 space-y-0.5">
                      {item.description.map((desc, j) => (
                        <li key={j}>&#8226; {desc}</li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-gray-600 text-xs whitespace-nowrap">{item.period}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ASCII divider */}
        <div className="ascii-art text-gray-700 text-[10px] mb-8 animate-pulse-glow">
{`  > ls projects/`}
        </div>

        {/* Projects */}
        <div ref={projectsSection.ref} className="flex gap-12 mb-16">
          <h2 className={`text-xl font-semibold whitespace-nowrap pt-1 font-mono ${projectsSection.isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            {projectsTitle} <span className="ascii-icon text-gray-500 text-sm animate-pop inline-block">{`</>`}</span>
          </h2>
          <div className="flex-1 space-y-6">
            {projects.map((project, i) => (
              <div key={i} className={`flex justify-between items-start gap-4 group p-2 -m-2 rounded-lg transition-all duration-300 ${isLight ? 'hover:bg-gray-100' : 'hover:bg-[#0a0a0a]'} ${projectsSection.isVisible ? `animate-fade-in-up delay-${(i + 1) * 100}` : 'opacity-0'}`}>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold group-hover:text-green-400 transition-colors duration-300">
                    <span className="ascii-icon text-gray-500 text-xs mr-1.5 group-hover:text-green-400 transition-colors duration-300">{project.icon}</span>
                    {project.title}
                  </h3>
                  <p className="text-gray-400 text-xs leading-relaxed mt-0.5">{project.description}</p>
                </div>
                <div className="flex flex-wrap gap-2.5 max-w-[320px] justify-end">
                  {project.tech.map((t) => (
                    <span
                      key={t.name}
                      className={`${t.color} px-2 py-0.5 rounded-full text-[10px] font-medium group-hover:scale-110 transition-transform duration-200`}
                    >
                      {t.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ASCII divider */}
        <div className="ascii-art text-gray-700 text-[10px] mb-8 animate-pulse-glow">
{`  > cat hobbies.txt`}
        </div>

        {/* Hobbies */}
        <div ref={hobbiesSection.ref} className="flex gap-12 mb-8">
          <h2 className={`text-xl font-semibold whitespace-nowrap pt-1 font-mono ${hobbiesSection.isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            {hobbiesTitle} <span className="ascii-icon text-gray-500 text-sm animate-wobble inline-block">(&gt;)</span>
          </h2>
          <div className="flex-1 grid grid-cols-2 gap-4">
            {hobbies.map((hobby, i) => (
              <div key={hobby.title} className={`group p-3 -m-2 rounded-lg transition-all duration-300 cursor-pointer ${isLight ? 'hover:bg-gray-100' : 'hover:bg-[#0a0a0a]'} ${hobbiesSection.isVisible ? `animate-fade-in-up delay-${(i + 1) * 100}` : 'opacity-0'}`}>
                <h3 className="text-sm font-semibold group-hover:text-yellow-400 transition-colors duration-300">
                  <span className="ascii-icon text-gray-500 text-xs mr-1.5 group-hover:text-yellow-400 group-hover:animate-bounce-subtle inline-block transition-colors duration-300">{hobby.icon}</span>
                  {hobby.title}
                </h3>
                <p className="text-gray-400 text-xs mt-0.5">{hobby.desc}</p>
                <p className="text-red-400 text-xs mt-1 group-hover:animate-wiggle">{hobby.stat}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ASCII divider */}
        <div className="ascii-art text-gray-700 text-[10px] mb-8 animate-pulse-glow">
{`  > cat skills.json`}
        </div>

        {/* Skills Section */}
        <div ref={skillsSection.ref} className="mb-6">
          <h2 className={`text-xl font-semibold font-mono mb-6 ${skillsSection.isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            {skillsTitle} <span className="ascii-icon text-gray-500 text-sm animate-wiggle inline-block">{`{}`}</span>
          </h2>

          <div className={`rounded-lg p-5 ${isLight ? 'bg-gray-100' : 'bg-[#0a0a0a]'}`}>
            <div className="space-y-4">
              {skills.map((skill, i) => {
                const totalBlocks = 20
                const filledBlocks = Math.round((skill.level / 100) * totalBlocks)
                const emptyBlocks = totalBlocks - filledBlocks
                const filled = '█'.repeat(filledBlocks)
                const empty = '░'.repeat(emptyBlocks)

                const colorClass = skill.level >= 80
                  ? 'text-green-500'
                  : skill.level >= 65
                  ? 'text-blue-400'
                  : 'text-yellow-500'

                return (
                  <div
                    key={skill.name}
                    className={`group cursor-default ${skillsSection.isVisible ? `animate-fade-in-up delay-${Math.min((i + 1) * 100, 800)}` : 'opacity-0'}`}
                  >
                    <div className="flex items-center gap-3 font-mono">
                      <span className={`text-[11px] w-[180px] flex-shrink-0 whitespace-nowrap text-gray-400 transition-colors duration-300 pr-3`}>
                        <span className={`${colorClass} opacity-60 mr-1.5`}>{skill.icon}</span>
                        {skill.name}
                      </span>
                      <span className="text-[12px] tracking-tight flex-shrink-0 select-none">
                        <span className="text-gray-600">[</span>
                        <span className={`${colorClass} transition-all duration-300`}>
                          {skillsSection.isVisible ? filled : ''}
                        </span>
                        <span className={`${isLight ? 'text-gray-300' : 'text-gray-800'}`}>
                          {skillsSection.isVisible ? empty : '░'.repeat(totalBlocks)}
                        </span>
                        <span className="text-gray-600">]</span>
                      </span>
                      <span className={`text-[10px] ${colorClass} opacity-70 ml-auto flex-shrink-0`}>
                        {skill.level}%
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Legend */}
            <div className={`mt-5 pt-4 font-mono ${isLight ? 'border-t border-gray-200' : 'border-t border-[#1a1a1a]'}`}>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-green-500 text-[11px]">██</span>
                  <span className="text-[10px] text-gray-500">80%+ <span className={`${isLight ? 'text-gray-400' : 'text-gray-600'}`}>proficient</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-400 text-[11px]">██</span>
                  <span className="text-[10px] text-gray-500">65-79% <span className={`${isLight ? 'text-gray-400' : 'text-gray-600'}`}>comfortable</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500 text-[11px]">██</span>
                  <span className="text-[10px] text-gray-500">&lt;65% <span className={`${isLight ? 'text-gray-400' : 'text-gray-600'}`}>learning</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>

      <Footer />
    </div>
  )
}
