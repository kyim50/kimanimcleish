import { NextResponse } from 'next/server'

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN

const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token'
const NOW_PLAYING_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing'
const RECENTLY_PLAYED_ENDPOINT = 'https://api.spotify.com/v1/me/player/recently-played?limit=5'
const TOP_TRACKS_ENDPOINT = 'https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=5'

/* ── Cache on globalThis to survive Next.js dev hot reloads ── */
interface CacheEntry<T> {
  data: T
  timestamp: number
}

interface SpotifyCache {
  token?: CacheEntry<string>
  nowPlaying?: CacheEntry<ReturnType<typeof formatTrack> | null>
  recentTracks?: CacheEntry<ReturnType<typeof formatTrack>[]>
  topTracks?: CacheEntry<ReturnType<typeof formatTrack>[]>
}

const g = globalThis as typeof globalThis & { __spotifyCache?: SpotifyCache }
if (!g.__spotifyCache) g.__spotifyCache = {}
const cache = g.__spotifyCache

const TTL = {
  token: 55 * 60 * 1000,
  nowPlaying: 10 * 1000,
  recentTracks: 60 * 1000,
  topTracks: 5 * 60 * 1000,
}

function isFresh<T>(entry: CacheEntry<T> | undefined, ttl: number): entry is CacheEntry<T> {
  return !!entry && Date.now() - entry.timestamp < ttl
}

/* ── Token ── */
async function getAccessToken(): Promise<string> {
  if (isFresh(cache.token, TTL.token)) return cache.token.data

  const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')

  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: REFRESH_TOKEN!,
    }),
  })

  const { access_token } = await response.json()
  cache.token = { data: access_token, timestamp: Date.now() }
  return access_token
}

/* ── Types ── */
interface SpotifyArtist { name: string }
interface SpotifyImage { url: string; height: number; width: number }
interface SpotifyTrack {
  name: string
  artists: SpotifyArtist[]
  album: { name: string; images: SpotifyImage[] }
  external_urls: { spotify: string }
  preview_url: string | null
}

function formatTrack(track: SpotifyTrack) {
  return {
    title: track.name,
    artist: track.artists.map((a) => a.name).join(', '),
    album: track.album.name,
    albumArt: track.album.images[0]?.url ?? null,
    albumArtSmall: track.album.images[track.album.images.length - 1]?.url ?? null,
    songUrl: track.external_urls.spotify,
    previewUrl: track.preview_url,
  }
}

/* ── Fetchers with cache ── */
async function fetchNowPlaying(token: string) {
  if (isFresh(cache.nowPlaying, TTL.nowPlaying)) return cache.nowPlaying.data

  const res = await fetch(NOW_PLAYING_ENDPOINT, {
    headers: { Authorization: `Bearer ${token}` },
  })

  let nowPlaying: ReturnType<typeof formatTrack> | null = null
  if (res.status === 200) {
    const data = await res.json()
    if (data.currently_playing_type === 'track' && data.item) {
      nowPlaying = formatTrack(data.item)
    }
  }

  cache.nowPlaying = { data: nowPlaying, timestamp: Date.now() }
  return nowPlaying
}

async function fetchRecentTracks(token: string) {
  if (isFresh(cache.recentTracks, TTL.recentTracks)) return cache.recentTracks.data

  const res = await fetch(RECENTLY_PLAYED_ENDPOINT, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (res.status === 200) {
    const data = await res.json()
    const tracks = data.items
      ? data.items.map((item: { track: SpotifyTrack }) => formatTrack(item.track))
      : []
    cache.recentTracks = { data: tracks, timestamp: Date.now() }
    return tracks
  }

  // Rate limited or error – return stale cache, don't overwrite with empty
  return (cache.recentTracks as CacheEntry<ReturnType<typeof formatTrack>[]> | undefined)?.data ?? []
}

async function fetchTopTracks(token: string) {
  if (isFresh(cache.topTracks, TTL.topTracks)) return cache.topTracks.data

  const res = await fetch(TOP_TRACKS_ENDPOINT, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (res.status === 200) {
    const data = await res.json()
    const tracks = data.items
      ? data.items.map((track: SpotifyTrack) => formatTrack(track))
      : []
    cache.topTracks = { data: tracks, timestamp: Date.now() }
    return tracks
  }

  // Rate limited or error – return stale cache, don't overwrite with empty
  return (cache.topTracks as CacheEntry<ReturnType<typeof formatTrack>[]> | undefined)?.data ?? []
}

/* ── Main handler ── */
export async function GET() {
  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    return NextResponse.json({ isPlaying: false, recentTracks: [], topTracks: [] }, { status: 200 })
  }

  try {
    const token = await getAccessToken()

    const [nowPlaying, recentTracks, topTracks] = await Promise.all([
      fetchNowPlaying(token),
      fetchRecentTracks(token),
      fetchTopTracks(token),
    ])

    if (nowPlaying) {
      return NextResponse.json({
        isPlaying: true,
        nowPlaying,
        recentTracks,
        topTracks,
      })
    }

    return NextResponse.json({
      isPlaying: false,
      nowPlaying: recentTracks[0] || null,
      recentTracks: recentTracks.slice(1),
      topTracks,
    })
  } catch {
    return NextResponse.json({ isPlaying: false, nowPlaying: null, recentTracks: [], topTracks: [] }, { status: 200 })
  }
}
