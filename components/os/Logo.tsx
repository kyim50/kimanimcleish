/** The [km] mark: two torn paper squares, a bold k on clay and an m on mustard. Papers and ink are fixed, so it reads on light and dark. The soft shadow drops out at small sizes. */
export default function Logo({ size = 20, className, title }: { size?: number; className?: string; title?: string }) {
  const shadow = size >= 24
  return (
    <svg viewBox="0 0 34 32" width={size} height={size * 32 / 34} className={className} role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true} focusable="false">
      <g transform="rotate(-6 11 16)">
        {shadow && <path d="M1.5 5L7 4.4L12 5.1L20 3.6L20.9 10L21.3 17L21.6 28.6L14 29L8 28.4L2.6 29.8L2.2 22L1.9 14Z" fill="#000" fillOpacity=".26" transform="translate(1 1.4)" />}
        <path d="M1.5 5L7 4.4L12 5.1L20 3.6L20.9 10L21.3 17L21.6 28.6L14 29L8 28.4L2.6 29.8L2.2 22L1.9 14Z" fill="#C8714E" />
        <path d="M7.00 9.20V23.20M7.00 18.20L13.40 12.20M9.80 15.60L13.80 23.20" stroke="#1F1E1C" strokeWidth="3.1" fill="none" strokeLinejoin="round" />
      </g>
      <g transform="rotate(4 22 17)">
        {shadow && <path d="M13 7.4L19 7.9L25 6.6L33 6L32.6 13L32.5 20L32.2 27L26 26.2L19 27L12.4 26.4L12.6 19L12.8 13Z" fill="#000" fillOpacity=".26" transform="translate(1 1.4)" />}
        <path d="M13 7.4L19 7.9L25 6.6L33 6L32.6 13L32.5 20L32.2 27L26 26.2L19 27L12.4 26.4L12.6 19L12.8 13Z" fill="#E6CB5A" />
        <path d="M15.01 21.72V12.92M15.01 16.09C15.01 10.81 21.17 10.81 21.17 16.09V21.72M21.17 16.09C21.17 10.81 27.33 10.81 27.33 16.09V21.72" stroke="#1F1E1C" strokeWidth="2.8" fill="none" strokeLinejoin="round" />
      </g>
    </svg>
  )
}
