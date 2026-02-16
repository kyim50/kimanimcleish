import { NextResponse } from 'next/server'

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const SCOPES = [
  'user-read-currently-playing',
  'user-read-recently-played',
  'user-top-read',
].join(' ')

const REDIRECT_URI = 'http://127.0.0.1:3000/callback'

export async function GET() {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID!,
    scope: SCOPES,
    redirect_uri: REDIRECT_URI,
  })

  return NextResponse.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`)
}
