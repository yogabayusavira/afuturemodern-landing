import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

interface ScrollCueProps {
  containerRef: React.RefObject<HTMLDivElement | null>
  isOpen: boolean
}

export default function ScrollCue({ containerRef, isOpen }: ScrollCueProps) {
  const [isScrollable, setIsScrollable] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  const elementRef = useRef<HTMLDivElement>(null)
  const wheelRef = useRef<SVGLineElement>(null)

  // Track screen size (mobile/desktop)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 640)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Detect prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  // Monitor overflow, scroll position, and interaction to trigger display
  useEffect(() => {
    const container = containerRef.current
    if (!container || !isOpen || dismissed) {
      setIsScrollable(false)
      return
    }

    const checkScroll = () => {
      const hasOverflow = container.scrollHeight > container.clientHeight
      // Only show if user is at least 15px away from bottom of content
      const notAtBottom = container.scrollTop < (container.scrollHeight - container.clientHeight - 15)
      setIsScrollable(hasOverflow && notAtBottom)
    }

    const handleInteraction = () => {
      setDismissed(true)
      setIsScrollable(false)
    }

    // Dismiss trigger if scrolled past a small threshold
    const handleScroll = () => {
      checkScroll()
      if (container.scrollTop > 10) {
        handleInteraction()
      }
    }

    // Perform check initially
    checkScroll()

    // Monitor modal resizing or dynamic layout height updates (e.g. content expansions)
    const resizeObserver = new ResizeObserver(() => {
      checkScroll()
    })
    resizeObserver.observe(container)

    // Event listeners on modal body scroll container
    container.addEventListener('scroll', handleScroll)
    container.addEventListener('wheel', handleInteraction, { passive: true })
    container.addEventListener('touchmove', handleInteraction, { passive: true })
    
    const handleKeyDown = (e: KeyboardEvent) => {
      const scrollKeys = ['ArrowUp', 'ArrowDown', 'Space', ' ', 'PageUp', 'PageDown', 'Home', 'End']
      if (scrollKeys.includes(e.key)) {
        handleInteraction()
      }
    }
    container.addEventListener('keydown', handleKeyDown)

    return () => {
      resizeObserver.disconnect()
      container.removeEventListener('scroll', handleScroll)
      container.removeEventListener('wheel', handleInteraction)
      container.removeEventListener('touchmove', handleInteraction)
      container.removeEventListener('keydown', handleKeyDown)
    }
  }, [containerRef, isOpen, dismissed])

  // GSAP animation
  useEffect(() => {
    if (!isScrollable || prefersReducedMotion) return

    let anim: gsap.core.Tween | gsap.core.Timeline | null = null

    if (!isMobile && wheelRef.current) {
      // Desktop: Restrained mouse wheel scroll downward movement
      anim = gsap.timeline({ repeat: -1 })
        .fromTo(wheelRef.current, { y: -3, opacity: 1 }, { y: 5, opacity: 0, duration: 1.2, ease: 'power2.inOut' })
        .to({}, { duration: 0.3 })
    } else if (isMobile && elementRef.current) {
      // Mobile: Restrained upward swipe-up indication
      anim = gsap.timeline({ repeat: -1 })
        .fromTo(elementRef.current, { y: 8, opacity: 0.2 }, { y: -8, opacity: 1, duration: 1.0, ease: 'power1.out' })
        .to(elementRef.current, { opacity: 0, duration: 0.4, ease: 'power1.in' })
        .to({}, { duration: 0.2 })
    }

    return () => {
      if (anim) anim.kill()
    }
  }, [isScrollable, isMobile, prefersReducedMotion])

  if (!isScrollable) return null

  return (
    <div className="scroll-cue-container">
      {prefersReducedMotion ? (
        <div className="scroll-cue-static">
          Scroll for more ↓
        </div>
      ) : isMobile ? (
        <div className="scroll-cue-mobile" ref={elementRef}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="17 13 12 8 7 13" />
            <polyline points="17 18 12 13 7 18" />
          </svg>
          <span>Swipe Up</span>
        </div>
      ) : (
        <div className="scroll-cue-desktop">
          <div ref={elementRef}>
            <svg width="16" height="26" viewBox="0 0 20 32" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="16" height="28" rx="8" />
              <line ref={wheelRef} x1="10" y1="8" x2="10" y2="14" />
            </svg>
          </div>
          <span>Scroll</span>
        </div>
      )}
    </div>
  )
}
