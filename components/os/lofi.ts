export type LofiTrack = { id: string; title: string; artist: string; src: string }
export const LOFI: LofiTrack[] = [
  { id: 'when-time-called-me-darling', title: 'When Time Called Me Darling', artist: 'HoliznaCC0', src: '/os/lofi/when-time-called-me-darling.mp3' },
  { id: 'washed-up', title: 'Washed Up', artist: 'HoliznaCC0', src: '/os/lofi/washed-up.mp3' },
  { id: 'wave-maker', title: 'Wave Maker', artist: 'HoliznaCC0', src: '/os/lofi/wave-maker.mp3' },
  { id: 'saturation', title: 'Saturation', artist: 'HoliznaCC0', src: '/os/lofi/saturation.mp3' },
  { id: 'down-time', title: 'Down Time', artist: 'HoliznaCC0', src: '/os/lofi/down-time.mp3' },
]
export const fmtTime = (s: number) => (isFinite(s) && s > 0 ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}` : '0:00')
