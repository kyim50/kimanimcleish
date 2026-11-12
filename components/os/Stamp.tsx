export function Stamp({ src, term, big }: { src?: string; term?: boolean; big?: boolean }) {
  return (
    <span className={`stamp${term ? ' term' : ''}${big ? ' big' : ''}`} aria-hidden>
      <span style={src ? { backgroundImage: `url(${src})` } : undefined}>{term ? '>_' : null}</span>
    </span>
  )
}
