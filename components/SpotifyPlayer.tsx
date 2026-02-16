'use client'

import { useEffect, useState, useCallback } from 'react'
import { useTheme } from './ThemeProvider'

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

function getTrackId(url: string): string | null {
  const match = url.match(/track\/([a-zA-Z0-9]+)/)
  return match ? match[1] : null
}

export default function SpotifyPlayer() {
  const [spotify, setSpotify] = useState<SpotifyData | null>(null)
  const [expanded, setExpanded] = useState(false)
  const [showEmbed, setShowEmbed] = useState(false)
  const { theme } = useTheme()
  const isLight = theme === 'light'

  const fetchSpotify = useCallback(async () => {
    try {
      const res = await fetch('/api/spotify')
      if (res.ok) setSpotify(await res.json())
    } catch { /* silent */ }
  }, [])

  useEffect(() => {
    fetchSpotify()
    const id = setInterval(fetchSpotify, 30000)
    return () => clearInterval(id)
  }, [fetchSpotify])

  const displayTrack = spotify?.nowPlaying || spotify?.recentTracks?.[0] || null
  const trackId = displayTrack?.songUrl ? getTrackId(displayTrack.songUrl) : null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 8,
      }}
    >
      {/* Spotify embed player (shows above the pill when active) */}
      <div
        style={{
          width: showEmbed ? 300 : 0,
          height: showEmbed ? 80 : 0,
          opacity: showEmbed ? 1 : 0,
          overflow: 'hidden',
          borderRadius: 12,
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          transformOrigin: 'bottom right',
          transform: showEmbed ? 'scale(1)' : 'scale(0.9)',
        }}
      >
        {trackId && (
          <iframe
            src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`}
            width="300"
            height="80"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            style={{ border: 'none', borderRadius: 12 }}
          />
        )}
      </div>

      {/* Main pill */}
      <div
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: isLight ? '#f3f3f3' : '#111111',
          border: `1px solid ${isLight ? '#ddd' : '#2a2a2a'}`,
          borderRadius: 999,
          padding: 5,
          gap: 0,
          transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: isLight ? '0 4px 24px rgba(0,0,0,0.1)' : '0 4px 24px rgba(0,0,0,0.6)',
          cursor: 'pointer',
          overflow: 'hidden',
          maxWidth: expanded ? 340 : 46,
          height: 46,
          whiteSpace: 'nowrap',
        }}
        onClick={() => {
          if (trackId) setShowEmbed(!showEmbed)
        }}
      >
        {/* Album art circle */}
        <div
          style={{
            width: 36,
            height: 36,
            minWidth: 36,
            minHeight: 36,
            borderRadius: '50%',
            overflow: 'hidden',
            flexShrink: 0,
            backgroundColor: isLight ? '#e8e8e8' : '#1a1a1a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {displayTrack?.albumArtSmall || displayTrack?.albumArt ? (
            <img
              src={(displayTrack.albumArtSmall || displayTrack.albumArt)!}
              alt=""
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              className={showEmbed ? 'animate-spin-slow' : ''}
            />
          ) : (
            <svg style={{ width: 20, height: 20 }} fill="#1DB954" viewBox="0 0 24 24">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
          )}
        </div>

        {/* Track info (always rendered, visibility via max-width) */}
        <div
          style={{
            overflow: 'hidden',
            transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            opacity: expanded ? 1 : 0,
            marginLeft: expanded ? 10 : 0,
            maxWidth: expanded ? 240 : 0,
          }}
        >
          {displayTrack ? (
            <>
              <p style={{
                fontSize: 12,
                fontWeight: 600,
                color: isLight ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.9)',
                margin: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {displayTrack.title}
              </p>
              <p style={{
                fontSize: 10,
                color: isLight ? '#888' : '#666',
                margin: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {displayTrack.artist}
              </p>
            </>
          ) : (
            <p style={{ fontSize: 11, color: isLight ? '#999' : '#555', margin: 0 }}>Loading...</p>
          )}
        </div>

        {/* Play/pause indicator */}
        <div
          style={{
            overflow: 'hidden',
            transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            opacity: expanded ? 0.6 : 0,
            marginLeft: expanded ? 8 : 0,
            marginRight: expanded ? 4 : 0,
            maxWidth: expanded ? 20 : 0,
            flexShrink: 0,
          }}
        >
          {showEmbed ? (
            <svg style={{ width: 14, height: 14 }} fill="#1DB954" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
          ) : (
            <svg style={{ width: 14, height: 14 }} fill="#1DB954" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </div>
      </div>

      {/* Green dot indicator when embed is playing */}
      {showEmbed && (
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            right: 6,
            width: 10,
            height: 10,
            backgroundColor: '#1DB954',
            borderRadius: '50%',
            border: `2px solid ${isLight ? '#f3f3f3' : '#111111'}`,
          }}
          className="animate-pulse"
        />
      )}
    </div>
  )
}
