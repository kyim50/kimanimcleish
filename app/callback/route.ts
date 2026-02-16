import { NextRequest, NextResponse } from 'next/server'

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET
const REDIRECT_URI = 'http://127.0.0.1:3000/callback'

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  const error = request.nextUrl.searchParams.get('error')

  if (error) {
    return new NextResponse(
      `<html>
        <body style="background:#000;color:#fff;font-family:monospace;padding:40px;">
          <h2 style="color:#e74c3c;">Authorization Error</h2>
          <p>Spotify returned: <strong>${error}</strong></p>
          <p style="color:#666;">Try again: <a href="/api/spotify/auth" style="color:#1DB954;">Re-authorize</a></p>
        </body>
      </html>`,
      { headers: { 'Content-Type': 'text/html' } }
    )
  }

  if (!code) {
    return new NextResponse(
      `<html>
        <body style="background:#000;color:#fff;font-family:monospace;padding:40px;">
          <h2 style="color:#e74c3c;">No Code</h2>
          <p>No authorization code received. Start the flow from the beginning:</p>
          <p><a href="/api/spotify/auth" style="color:#1DB954;font-size:18px;">Click here to authorize</a></p>
        </body>
      </html>`,
      { headers: { 'Content-Type': 'text/html' } }
    )
  }

  const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
    }),
  })

  const data = await response.json()

  if (data.error) {
    return new NextResponse(
      `<html>
        <body style="background:#000;color:#fff;font-family:monospace;padding:40px;">
          <h2 style="color:#e74c3c;">Token Error</h2>
          <p>${data.error}: ${data.error_description || 'Unknown error'}</p>
          <p style="color:#666;">Try again: <a href="/api/spotify/auth" style="color:#1DB954;">Re-authorize</a></p>
        </body>
      </html>`,
      { headers: { 'Content-Type': 'text/html' } }
    )
  }

  return new NextResponse(
    `<html>
      <body style="background:#000;color:#fff;font-family:monospace;padding:40px;">
        <h2 style="color:#1DB954;">New Refresh Token</h2>
        <p>Copy this into your <code>.env.local</code> as <code>SPOTIFY_REFRESH_TOKEN</code>:</p>
        <pre style="background:#111;padding:16px;border-radius:8px;word-break:break-all;white-space:pre-wrap;border:1px solid #333;">${data.refresh_token}</pre>
        <p style="color:#666;margin-top:16px;">Scopes granted: ${data.scope}</p>
        <p style="color:#666;">Then restart your dev server.</p>
      </body>
    </html>`,
    { headers: { 'Content-Type': 'text/html' } }
  )
}
