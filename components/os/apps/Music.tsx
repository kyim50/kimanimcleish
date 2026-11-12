'use client'
import { useOS } from '../store'
import { Eq, TrackRow } from '../SpotifyWidget'
import WindowArt from '../art/WindowArt'
import LofiPlayer from '../LofiPlayer'

export default function Music() {
  const sp = useOS((s) => s.spotify)
  const has = !!(sp.nowPlaying || sp.recentTracks.length || sp.topTracks.length)
  return (
    <>
      <WindowArt app="music" />
      <div className="pad music">
        <p className="mono k-label">lo-fi · five CC0 tracks</p>
        <div className="music-lofi"><LofiPlayer playlist /></div>
        {has ? (
          <>
            <p className="mono k-label" style={{ marginTop: 26 }}>spotify</p>
            {sp.nowPlaying && (<><h3 className="mono k-label">{sp.isPlaying ? <>now playing <Eq /></> : 'last played'}</h3><ul className="tracks"><TrackRow t={sp.nowPlaying} i={0} /></ul></>)}
            {sp.recentTracks.length > 0 && (<><h3 className="mono k-label">recently played</h3><ul className="tracks">{sp.recentTracks.map((t, i) => <TrackRow key={t.songUrl + i} t={t} i={i} />)}</ul></>)}
            {sp.topTracks.length > 0 && (<><h3 className="mono k-label">top tracks, lately</h3><ul className="tracks">{sp.topTracks.map((t, i) => <TrackRow key={t.songUrl + i} t={t} i={i} />)}</ul></>)}
          </>
        ) : (
          <p className="quiet" style={{ marginTop: 22 }}>spotify is offline right now, so the lo-fi above is the soundtrack. recently played will be back when it reconnects.</p>
        )}
      </div>
    </>
  )
}
