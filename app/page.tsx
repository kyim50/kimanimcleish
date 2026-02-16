'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
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

interface SpotifyTrack {
  title: string
  artist: string
  album: string
  albumArt: string | null
  albumArtSmall: string | null
  songUrl: string
  previewUrl: string | null
}

interface SpotifyData {
  isPlaying: boolean
  nowPlaying: SpotifyTrack | null
  recentTracks: SpotifyTrack[]
  topTracks: SpotifyTrack[]
}

export default function Home() {
  const [text, setText] = useState('')
  const fullText = 'hey, kimani here'
  const projectSection = useInView()
  const spotifySection = useInView()
  const [spotify, setSpotify] = useState<SpotifyData | null>(null)
  const [spotifyTab, setSpotifyTab] = useState<'recent' | 'top'>('recent')
  const projectTitle = useTextScramble('Latest Project', projectSection.isVisible)
  const spotifyTitle = useTextScramble(spotify?.isPlaying ? 'Now Playing' : 'Recently Played', spotifySection.isVisible)
  const tilt0 = useTilt(10)
  const tilt1 = useTilt(10)
  const tilt2 = useTilt(10)
  const tilt3 = useTilt(10)
  const tilts = [tilt0, tilt1, tilt2, tilt3]
  const { theme } = useTheme()
  const isLight = theme === 'light'

  const fetchSpotify = useCallback(async () => {
    try {
      const res = await fetch('/api/spotify')
      if (res.ok) {
        const data = await res.json()
        setSpotify(data)
      }
    } catch {
      /* silently fail */
    }
  }, [])

  useEffect(() => {
    fetchSpotify()
    const interval = setInterval(fetchSpotify, 30000)
    return () => clearInterval(interval)
  }, [fetchSpotify])

  useEffect(() => {
    let i = 0
    const timer = setInterval(() => {
      if (i < fullText.length) {
        setText(fullText.slice(0, i + 1))
        i++
      } else {
        clearInterval(timer)
      }
    }, 100)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="max-w-3xl mx-auto px-6 pt-16">
      {/* Hero Section */}
      <section className="py-4">
        {/* ASCII art greeting */}
        <div className="mb-6">
          <pre className="ascii-art text-gray-600 text-[10px] animate-fade-in animate-float leading-[1.2]">
{`  ~$ whoami
  > kimani_mcleish
  ~$ status
  > building cool things...`}
          </pre>
        </div>

        <h1 className="text-4xl mb-4 animate-fade-in-up">
          <span className="typing-cursor">
            {text.split('').map((char, i) => (
              <span key={i} className={i < 5 ? 'font-bold' : 'font-light'}>
                {char}
              </span>
            ))}
          </span>
        </h1>
        <p className="text-base text-gray-400 leading-relaxed max-w-xl animate-fade-in-up delay-300">
          4th year BSc. Computer Science student at the University of Technology, Jamaica
          trying to document the journey of building intelligent applications and creating
          digital experiences. <span className="ascii-icon text-gray-500 text-xs animate-bounce-subtle inline-block">[JA]</span>
        </p>

        {/* Scrolling marquee */}
        <div className="overflow-hidden mt-8 animate-fade-in delay-500">
          <div className="flex whitespace-nowrap animate-marquee">
            <span className="ascii-art text-gray-700 text-[10px] mx-4">
              :: react :: next.js :: typescript :: node.js :: firebase :: react native :: tailwind :: postgresql :: azure :: aws :: react :: next.js :: typescript :: node.js :: firebase :: react native :: tailwind :: postgresql :: azure :: aws ::
            </span>
          </div>
        </div>

        {/* ASCII divider */}
        <div className="ascii-art text-gray-700 text-[10px] mt-6 animate-fade-in delay-600 animate-shimmer rounded">
{`  +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+`}
        </div>
      </section>

      {/* Latest Project */}
      <section ref={projectSection.ref} className="mb-12">
        <div className={`flex justify-between items-center mb-4 ${projectSection.isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h2 className="text-lg font-semibold flex items-center gap-2 font-mono">
            {projectTitle}
          </h2>
          <div className="flex gap-6 text-gray-500 text-xs">
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              11 projects
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Active development
            </span>
          </div>
        </div>

        <div className={`aspect-video rounded-lg overflow-hidden mb-4 hover:shadow-lg transition-shadow duration-500 ${isLight ? 'bg-gray-100 hover:shadow-black/5' : 'bg-[#111] hover:shadow-white/5'} ${projectSection.isVisible ? 'animate-scale-in delay-100' : 'opacity-0'}`}>
          <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm">
            <pre className="ascii-art text-gray-500 text-[9px] animate-text-glow leading-[1.3]">
{`        _____________________________
       /                            /|
      /  coming soon . . .         / |
     /                            /  |
    /____________________________/   |
    |  ________________________  |   |
    | |  > npm run build       | |   |
    | |                        | |   |
    | |  compiling modules...  | |   /
    | |  optimizing assets...  | |  /
    | |  bundling pages...     | | /
    | |________________________| |/
    |____________________________|`}
            </pre>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { name: 'Waddle Together', icon: "<'>", url: 'https://github.com/kyim50' },
            { name: 'Quests', icon: '{#}', url: 'https://github.com/kyim50' },
            { name: 'Squire', icon: '/|\\', url: 'https://github.com/kyim50' },
            { name: 'Verro', icon: '[~]', url: 'https://github.com/kyim50' },
          ].map((project, i) => (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              key={project.name}
            >
              <div
                ref={tilts[i].ref}
                onMouseMove={tilts[i].handleMouseMove}
                onMouseLeave={tilts[i].handleMouseLeave}
                className={`tilt-card aspect-video rounded-md overflow-hidden hover:shadow-lg transition-colors duration-300 cursor-pointer group relative ${isLight ? 'bg-gray-100 hover:bg-gray-200 hover:shadow-black/5' : 'bg-[#111] hover:bg-[#1a1a1a] hover:shadow-white/5'} ${projectSection.isVisible ? `animate-fade-in-up delay-${(i + 2) * 100}` : 'opacity-0'}`}
              >
                <div className="tilt-shine" />
                <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                  <span className={`ascii-icon text-gray-500 text-sm font-mono group-hover:animate-bounce-subtle transition-all duration-300 ${isLight ? 'group-hover:text-black' : 'group-hover:text-white'}`}>{project.icon}</span>
                  <span className="text-gray-600 text-xs group-hover:text-gray-400 transition-colors duration-300">{project.name}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Now Playing */}
      <section ref={spotifySection.ref} className="mb-12">
        <div className={`flex justify-between items-center mb-4 ${spotifySection.isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h2 className="text-lg font-semibold flex items-center gap-2 font-mono">
            {spotifyTitle}
            <svg className="w-5 h-5 text-[#1DB954]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
          </h2>
          {spotify?.isPlaying && (
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-[#1DB954] rounded-full animate-pulse" />
              <span className="text-[#1DB954] text-xs">Live</span>
            </div>
          )}
        </div>

        {spotify?.nowPlaying ? (
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${spotifySection.isVisible ? 'animate-fade-in-up delay-200' : 'opacity-0'}`}>
            {/* Now Playing Card - Left */}
            <a
              href={spotify.nowPlaying.songUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-5 rounded-lg relative transition-all duration-500 hover:shadow-lg group ${
                isLight
                  ? 'bg-gradient-to-br from-[#e8f5e8] to-[#f3f3f3] hover:from-[#dff0df] hover:to-[#eee] hover:shadow-[#1DB954]/15'
                  : 'bg-gradient-to-br from-[#1a2a1a] to-[#111] hover:from-[#1f331f] hover:to-[#161616] hover:shadow-[#1DB954]/10'
              }`}
            >
              <div className="w-full aspect-square bg-black/20 rounded-md mb-4 overflow-hidden">
                {spotify.nowPlaying.albumArt ? (
                  <img
                    src={spotify.nowPlaying.albumArt}
                    alt={spotify.nowPlaying.album}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <pre className="ascii-art text-white/20 text-[8px] animate-float-slow">
{`  ♪───╮
  │   │
  │   ●
  │  ●●
  ╰──●●`}
                    </pre>
                  </div>
                )}
              </div>

              <h3 className="text-lg font-semibold mb-0.5 truncate group-hover:text-[#1DB954] transition-colors duration-300">{spotify.nowPlaying.title}</h3>
              <p className="text-sm text-gray-400 truncate">{spotify.nowPlaying.artist}</p>

              <div className="flex items-center justify-between mt-3">
                {spotify.isPlaying ? (
                  <div className="flex items-end gap-[3px] h-3">
                    {[1, 2, 3, 4].map((bar) => (
                      <div
                        key={bar}
                        className="w-[3px] bg-[#1DB954] rounded-full"
                        style={{
                          animation: `bounce-subtle ${0.4 + bar * 0.15}s ease-in-out infinite`,
                          height: `${6 + (bar % 3) * 4}px`,
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-600 text-xs">Last played</span>
                )}
                <span className="text-gray-600 text-xs group-hover:text-[#1DB954] transition-colors duration-300 flex items-center gap-1.5">
                  Open in Spotify
                  <svg className="w-4 h-4 text-[#1DB954]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                  </svg>
                </span>
              </div>
            </a>

            {/* Tracks - Right */}
            <div className="flex flex-col">
              {/* Tab Switcher */}
              <div className="flex items-center gap-4 mb-3">
                {(['recent', 'top'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSpotifyTab(tab)}
                    className="relative text-xs font-mono transition-all duration-200 pb-1.5"
                    style={{
                      color: spotifyTab === tab
                        ? '#1DB954'
                        : (isLight ? '#999' : '#555'),
                      borderBottom: spotifyTab === tab
                        ? '2px solid #1DB954'
                        : '2px solid transparent',
                    }}
                  >
                    <span className="mr-1" style={{ opacity: spotifyTab === tab ? 1 : 0.4 }}>&gt;</span>
                    {tab === 'recent' ? 'recent' : 'top_tracks'}
                  </button>
                ))}
              </div>

              {/* Track List */}
              <div className="flex flex-col gap-2 min-h-[280px]">
                {(spotifyTab === 'recent' ? spotify.recentTracks : (spotify.topTracks || [])).slice(0, 4).map((track, i) => (
                  <a
                    key={`${spotifyTab}-${track.title}-${i}`}
                    href={track.songUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 rounded-lg flex items-center gap-3 hover:shadow-lg transition-all duration-300 cursor-pointer group ${
                      isLight
                        ? 'bg-gradient-to-r from-[#eee] to-[#f3f3f3] hover:from-[#e5e5e5] hover:to-[#eee] hover:shadow-[#1DB954]/10'
                        : 'bg-gradient-to-r from-[#1a1a1a] to-[#111] hover:from-[#222] hover:to-[#1a1a1a] hover:shadow-[#1DB954]/5'
                    }`}
                  >
                    <div
                      className="w-12 h-12 rounded flex-shrink-0 overflow-hidden"
                      style={{ backgroundColor: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(0,0,0,0.2)' }}
                    >
                      {track.albumArt ? (
                        <img
                          src={track.albumArtSmall || track.albumArt}
                          alt={track.album}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600 text-[8px] font-mono">
                          [~]
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold truncate group-hover:text-[#1DB954] transition-colors duration-300">{track.title}</h4>
                      <p className="text-xs text-gray-400 truncate">{track.artist}</p>
                    </div>
                    <svg className="w-4 h-4 text-[#1DB954] opacity-40 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                    </svg>
                  </a>
                ))}
                {(spotifyTab === 'recent' ? spotify.recentTracks : (spotify.topTracks || [])).length === 0 && (
                  <div className="flex-1 flex flex-col items-center justify-center gap-2">
                    <pre className="ascii-art text-[9px] animate-float-slow" style={{ color: isLight ? '#ccc' : '#333' }}>
{`  ♪───╮
  │   │
  │   ●
  ╰───●`}
                    </pre>
                    <span className="text-gray-500 text-xs font-mono">no {spotifyTab === 'recent' ? 'recent' : 'top'} tracks</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className={`p-8 rounded-lg text-center ${isLight ? 'bg-gray-100' : 'bg-[#111]'} ${spotifySection.isVisible ? 'animate-fade-in-up delay-200' : 'opacity-0'}`}>
            <pre className="ascii-art text-gray-600 text-[9px] mb-3 inline-block animate-float-slow">
{`  ♪───╮
  │   │
  │   ●
  │  ●●
  ╰──●●`}
            </pre>
            <p className="text-gray-500 text-sm">Nothing playing right now</p>
            <p className="text-gray-700 text-xs mt-1">check back later...</p>
          </div>
        )}
      </section>

      <Footer />
    </div>
  )
}
