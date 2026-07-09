import { useRef, useEffect } from 'react'
import type { PortfolioItem } from '../data/portfolio'

interface Props {
  items: PortfolioItem[]
}

export default function ExperimentShowcase({ items }: Props) {
  const rafRef = useRef(0)
  const topStripRef = useRef<HTMLDivElement>(null)
  const bottomStripRef = useRef<HTMLDivElement>(null)
  const autoScroll = useRef(true)
  const dragData = useRef<{ startX: number; startScroll: number; el: HTMLDivElement } | null>(null)

  const half = Math.ceil(items.length / 2)
  const topItems = items.slice(0, half)
  const bottomItems = items.slice(half)

  useEffect(() => {
    const isMobile = window.innerWidth < 600
    const SPEED = isMobile ? 0.3 : 0.8 // px per frame

    function tick() {
      if (!autoScroll.current) { rafRef.current = requestAnimationFrame(tick); return }

      const top = topStripRef.current
      const bottom = bottomStripRef.current
      if (top) {
        top.scrollLeft += SPEED
        if (top.scrollLeft >= top.scrollWidth / 2) top.scrollLeft = 0
      }
      if (bottom) {
        bottom.scrollLeft -= SPEED
        if (bottom.scrollLeft <= 0) bottom.scrollLeft = bottom.scrollWidth / 2
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  function handleMouseDown(e: React.MouseEvent, el: HTMLDivElement | null) {
    if (!el) return
    autoScroll.current = false
    dragData.current = { startX: e.clientX, startScroll: el.scrollLeft, el }
    el.style.cursor = 'grabbing'
  }

  function handleMouseMove(e: React.MouseEvent) {
    const d = dragData.current
    if (!d) return
    d.el.scrollLeft = d.startScroll - (e.clientX - d.startX)
  }

  function handleMouseUp() {
    const d = dragData.current
    if (d) d.el.style.cursor = ''
    dragData.current = null
    autoScroll.current = true
  }

  return (
    <section className="section experiment-section" data-od-id="experiments"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div style={{ textAlign: 'center', maxWidth: '56ch', margin: '0 auto var(--gap-xl)', paddingInline: 'var(--gutter)' }}>
        <p className="section-label">Selected Works</p>
        <h2 style={{ marginBottom: 'var(--gap-md)' }}>Work that moves culture.</h2>
        <p className="lead" style={{ maxWidth: '100%', marginTop: 'var(--gap-sm)' }}>
          A look at projects shipped by our member teams across STEM, Creative Media, and Professional Services.
        </p>
      </div>

      {/* Top row */}
      <div className="experiment-strip" ref={topStripRef}
        onMouseDown={(e) => handleMouseDown(e, topStripRef.current)}
        onMouseMove={handleMouseMove}
      >
        <div className="experiment-track">
          {[...topItems, ...topItems].map((item, i) => (
            <a key={`${item.title}-${i}`} href={item.url} target="_blank" rel="noopener noreferrer" className="experiment-card" style={{ backgroundImage: `url("${item.image}")` }}
              draggable={false}
            >
              <span className="works-bento-link-icon" aria-hidden="true">↗</span>
              <div className="works-bento-body">
                <span className="works-bento-cat">{item.category}</span>
                <h3>{item.title}</h3>
                <p className="works-bento-desc">{item.description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Bottom row */}
      <div className="experiment-strip" ref={bottomStripRef}
        onMouseDown={(e) => handleMouseDown(e, bottomStripRef.current)}
        onMouseMove={handleMouseMove}
      >
        <div className="experiment-track">
          {[...bottomItems, ...bottomItems].map((item, i) => (
            <a key={`${item.title}-${i}`} href={item.url} target="_blank" rel="noopener noreferrer" className="experiment-card" style={{ backgroundImage: `url("${item.image}")` }}
              draggable={false}
            >
              <span className="works-bento-link-icon" aria-hidden="true">↗</span>
              <div className="works-bento-body">
                <span className="works-bento-cat">{item.category}</span>
                <h3>{item.title}</h3>
                <p className="works-bento-desc">{item.description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
