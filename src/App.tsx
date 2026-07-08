import { useState, useRef, useEffect } from 'react'
import './style.css'
import TalentModal from './components/TalentModal'
import ProjectModal from './components/ProjectModal'

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [talentModalOpen, setTalentModalOpen] = useState(false)
  const [projectModalOpen, setProjectModalOpen] = useState(false)

  // Wave lines connecting People section → three Pillar cards
  const waveWrapperRef = useRef<HTMLDivElement>(null)
  const stemCardRef = useRef<HTMLDivElement>(null)
  const creativeCardRef = useRef<HTMLDivElement>(null)
  const proCardRef = useRef<HTMLDivElement>(null)
  const [waveData, setWaveData] = useState<{ vb: string; s: string; c: string; p: string } | null>(null)

  // Mouse-follow leaning dollar sign
  const dollarRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = dollarRef.current
    const wrap = document.getElementById('hero-heading')
    if (!el || !wrap) return

    const maxLean = 10
    let current = 0, vel = 0, target = 0, rafId = 0

    function tick() {
      vel += (target - current) * 0.06
      vel *= 0.82
      current += vel
      if (Math.abs(current) > maxLean) current = Math.sign(current) * maxLean
      el!.style.transform = `rotate(${current}deg)`
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    function onMove(e: MouseEvent) {
      const r = wrap!.getBoundingClientRect()
      const pct = (e.clientX - r.left) / r.width
      target = (pct - 0.5) * 2 * maxLean
    }

    window.addEventListener('mousemove', onMove, { passive: true })

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  useEffect(() => {
    function measure() {
      const wrapper = waveWrapperRef.current
      const stemEl = stemCardRef.current
      const cEl = creativeCardRef.current
      const pEl = proCardRef.current
      if (!wrapper || !stemEl || !cEl || !pEl) return

      const wR = wrapper.getBoundingClientRect()
      const W = wR.width
      const H = wR.height

      function pt(el: HTMLElement) {
        const r = el.getBoundingClientRect()
        return { x: r.left - wR.left + r.width / 2, y: r.top - wR.top }
      }

      const s = pt(stemEl), c = pt(cEl), p = pt(pEl)

      function mkPath(ex: number, ey: number, startYFrac: number) {
        const sy = H * startYFrac
        const swing = W * 0.12
        const cp1 = { x: -swing, y: sy + (ey - sy) * 0.25 }
        const cp2 = { x: ex + swing * 0.5, y: sy + (ey - sy) * 0.7 }
        return `M 0 ${sy.toFixed(1)} C ${cp1.x.toFixed(1)} ${cp1.y.toFixed(1)}, ${cp2.x.toFixed(1)} ${cp2.y.toFixed(1)}, ${ex.toFixed(1)} ${ey.toFixed(1)}`
      }

      setWaveData({
        vb: `0 0 ${W.toFixed(0)} ${H.toFixed(0)}`,
        s: mkPath(s.x, s.y, 0.08),
        c: mkPath(c.x, c.y, 0.10),
        p: mkPath(p.x, p.y, 0.12),
      })
    }

    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  return (
    <div className="landing-page">
      {/* ── Top Navigation ── */}
      <header className="topnav" data-od-id="topnav">
        <div className="container topnav-inner">
          <div className="logo">
            <img src="/mr2sbkcq-turtle.png" alt="" style={{ height: '32px', width: 'auto' }} />
            <div className="logo-text">
              <span className="logo-title">$Build<span>.</span>Store</span>
              <span className="logo-sub">FUTURE MODERN</span>
            </div>
          </div>
          <div className="nav-actions" style={{ gap: 'var(--gap-md)', paddingRight: '4px' }}>
            <button className="btn btn-join" onClick={() => setTalentModalOpen(true)}>Join the cooperative</button>
            <button className="btn btn-primary" onClick={() => setProjectModalOpen(true)}>Start a project</button>
          </div>
          <button className="nav-toggle" aria-label="Menu" onClick={() => setMobileOpen(true)}>☰</button>
        </div>
      </header>

      {/* ── Mobile Overlay ── */}
      <div className={`mobile-overlay${mobileOpen ? ' open' : ''}`} id="mobileOverlay">
        <div className="mobile-overlay-header">
          <div className="logo">
            <img src="/mr2sbkcq-turtle.png" alt="" style={{ height: '26px', width: 'auto' }} />
            <div className="logo-text">
              <span className="logo-title">$Build<span>.</span>Store</span>
              <span className="logo-sub">FUTURE MODERN</span>
            </div>
          </div>
          <button className="close-btn" onClick={() => setMobileOpen(false)}>✕</button>
        </div>
        <div style={{ marginTop: 'var(--gap-xl)', display: 'flex', flexDirection: 'column', gap: 'var(--gap-sm)' }}>
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => { setMobileOpen(false); setProjectModalOpen(true) }}>Start a project</button>
          <button className="btn btn-join" style={{ width: '100%', justifyContent: 'center' }} onClick={() => { setMobileOpen(false); setTalentModalOpen(true) }}>Join the cooperative</button>
        </div>
      </div>

      <main id="content">

        {/* ── Hero ── */}
        <section className="section hero" data-od-id="hero">
          <video className="hero-video-bg" autoPlay muted loop playsInline>
            <source src="/mr2tkz2i-0702.mp4" type="video/mp4" />
          </video>
          <div className="hero-overlay" />
          <div className="container hero-center">
            <p className="eyebrow">Future Modern cooperative</p>
            <div className="hero-heading-wrap" id="hero-heading">
              <h1><span ref={dollarRef} className="hero-dollar" aria-hidden="true">$</span>BUILD<br />A TEAM</h1>
            </div>
            <p className="lead" style={{ marginInline: 'auto', maxWidth: '62ch' }}>
              Build a handpicked team from our network of experienced STEM, Creative Media, and Professional Services contributors.
            </p>
            <div className="hero-cta">
              <button className="btn btn-primary" onClick={() => setProjectModalOpen(true)}>Start a project</button>
              <button className="btn btn-join" onClick={() => setTalentModalOpen(true)}>Join the cooperative</button>
            </div>
            <p className="hero-text-link"><a href="#" onClick={(e) => { e.preventDefault(); (window as any).Calendly?.initPopupWidget({ url: 'https://calendly.com/properpreparationism' }) }}>Prefer to talk first? Schedule a call →</a></p>
            <div className="cred-strip">
              <p>Contributors have shipped work at</p>
              <div className="cred-logos">
                <svg viewBox="0 0 115 24" fill="none"><rect x="0" y="0" width="10" height="10" fill="currentColor" opacity="0.9" /><rect x="12" y="0" width="10" height="10" fill="currentColor" opacity="0.7" /><rect x="0" y="12" width="10" height="10" fill="currentColor" opacity="0.5" /><rect x="12" y="12" width="10" height="10" fill="currentColor" opacity="0.6" /><text x="30" y="16" fontSize="15" fontWeight="600" fill="currentColor" fontFamily="system-ui,sans-serif">Microsoft</text></svg>
                <svg viewBox="0 0 88 24" fill="none"><text x="0" y="17" fontSize="17" fontWeight="700" fill="currentColor" fontFamily="system-ui,sans-serif">amazon</text><path d="M4 20 Q28 26 72 20" stroke="currentColor" strokeWidth="1.8" fill="none" /></svg>
                <svg viewBox="0 0 90 24" fill="none"><text x="0" y="17" fontSize="16" fontWeight="600" fill="currentColor" fontFamily="system-ui,sans-serif" letterSpacing="2">CALTECH</text></svg>
                <svg viewBox="0 0 105 24" fill="none"><text x="0" y="18" fontSize="20" fontWeight="800" fill="currentColor" fontFamily="Georgia,serif" fontStyle="italic">Cal</text><text x="38" y="17" fontSize="11" fill="currentColor" opacity="0.7" fontFamily="system-ui,sans-serif" letterSpacing="1">BERKELEY</text></svg>
                <svg viewBox="0 0 148 24" fill="none"><circle cx="10" cy="14" r="8" stroke="currentColor" strokeWidth="1.5" opacity="0.6" /><circle cx="10" cy="14" r="4" stroke="currentColor" strokeWidth="1" opacity="0.4" /><text x="24" y="17" fontSize="14" fontWeight="500" fill="currentColor" fontFamily="system-ui,sans-serif" letterSpacing="2">SMITHSONIAN</text></svg>
                <svg viewBox="0 0 130 24" fill="none"><rect x="0" y="7" width="2" height="10" rx="1" fill="currentColor" opacity="0.6" /><circle cx="13" cy="14" r="8" stroke="currentColor" strokeWidth="1.2" opacity="0.5" /><circle cx="13" cy="14" r="3" fill="currentColor" opacity="0.3" /><text x="28" y="17" fontSize="14" fontWeight="600" fill="currentColor" fontFamily="Georgia,serif">Columbia</text><text x="82" y="17" fontSize="10" fill="currentColor" opacity="0.6" fontFamily="system-ui,sans-serif">RECORDS</text></svg>
                <svg viewBox="0 0 80 24" fill="none"><text x="0" y="17" fontSize="17" fontWeight="600" fill="currentColor" fontFamily="system-ui,sans-serif">WebMD</text></svg>
                <svg viewBox="0 0 96 24" fill="none"><text x="0" y="17" fontSize="17" fontWeight="700" fill="currentColor" fontFamily="system-ui,sans-serif" letterSpacing="3">COMPLEX</text></svg>
              </div>
            </div>
          </div>
        </section>

        {/* ── About ── */}
        <section className="section" data-od-id="about">
          <div className="container">
            <p className="section-label">About Future Modern</p>
            <div style={{ marginBottom: 'var(--gap-xl)', maxWidth: '72ch' }}>
              <h2 style={{ marginBottom: 'var(--gap-md)' }}>The radical curation network unifying art and technology to distribute equity.</h2>
              <p className="lead" style={{ maxWidth: '100%' }}>Future Modern Builderberg LLC is people-powered, exclusively. A cooperative of creatives, professionals, scientists, and techies who are already reputed in their fields — and who built this because the economics owed to the people doing the work weren't getting paid out anywhere else.</p>
            </div>
            <div className="grid-3" style={{ marginTop: 'var(--gap-xl)' }}>
              <div className="principle-card">
                <h3>For workers, not capitalists</h3>
                <p style={{ color: 'var(--muted)', fontSize: '15px' }}>Built by the people doing the work, structured to return value to those who create it.</p>
              </div>
              <div className="principle-card">
                <h3>People-powered, exclusively</h3>
                <p style={{ color: 'var(--muted)', fontSize: '15px' }}>No institutional capital. No outside ownership. The cooperative is the structure. The people are the proof.</p>
              </div>
              <div className="principle-card">
                <h3>Access is earned, not sold</h3>
                <p style={{ color: 'var(--muted)', fontSize: '15px' }}>Through invitation, application, or contribution — never a transaction.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Purpose & How It Works Wave Wrapper ── */}
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          {/* Subtle Decorative Wave spanning from right side of screen to left side */}
          <svg
            className="section-wave"
            viewBox="0 0 1200 800"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: '0',
              top: '0',
              height: '100%',
              width: '100%',
              zIndex: 0,
              opacity: 0.45,
              pointerEvents: 'none',
              maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)'
            }}
          >
            <path d="M 1200 80 C -200 230, 1400 530, 0 680" stroke="var(--accent)" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
            <path d="M 1200 110 C -200 260, 1400 560, 0 710" stroke="var(--magenta)" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
            <path d="M 1200 140 C -200 290, 1400 590, 0 740" stroke="var(--green)" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
          </svg>

          {/* ── Purpose & Vision ── */}
          <section className="section" data-od-id="purpose-vision" style={{ position: 'relative', zIndex: 1 }}>
            <div className="container">
              <div className="grid-2">
                <div>
                  <p className="section-label">Purpose</p>
                  <h2 style={{ marginBottom: 'var(--gap-md)' }}>The wave others ride.</h2>
                  <p className="lead" style={{ maxWidth: '100%' }}>We exist to acknowledge and compensate the expression of original ideas and labor that move culture forward. Provenance first — then everything else.</p>
                  <p className="lead" style={{ maxWidth: '100%', marginTop: 'var(--gap-md)', fontSize: '15px', color: 'var(--fg)' }}>In one sentence: the radical curation network unifying art and technology to distribute equity.</p>
                </div>
                <div>
                  <p className="section-label">Vision</p>
                  <h2 style={{ marginBottom: 'var(--gap-md)' }}>Capital, redistributed.</h2>
                  <p className="lead" style={{ maxWidth: '100%' }}>To redistribute human and financial capital from concentrated powers to dynamic grassroots communities. To construct a world where community integrates with life, art, appreciation, and passion.</p>
                  <p className="lead" style={{ maxWidth: '100%', marginTop: 'var(--gap-md)', fontSize: '15px', color: 'var(--fg)' }}>Driven and debonair. Strong, aggressive, absurd, weird — self-assured and dynamic, creative and perceptive. We tackle missions with diligence, grit, and daring.</p>
                </div>
              </div>
              <div className="rare-block">
                <div className="rare-left">
                  <p className="section-label">Tagline</p>
                  <div className="rare-display">Rare<sup className="infinity-sup">∞</sup></div>
                </div>
                <div className="rare-right">
                  <p className="rare-copy">For savvy seekers and independent creators who share a deep value for cultural contribution. We provide content, services, and resources counter to those currently found in legacy media and traditional industry, which fail to cater to their appetites.</p>
                </div>
              </div>
            </div>
          </section>

          {/* ── How It Works ── */}
          <section className="section" data-od-id="how-it-works" id="how-it-works" style={{ position: 'relative', zIndex: 1 }}>
            <div className="container">
              <div className="process-intro">
                <p className="section-label">$BUILD with the best.</p>
                <h2 style={{ marginBottom: 'var(--gap-md)' }}>How Future<br />Modern works</h2>
                <p className="lead process-lead">Future Modern assembles handpicked teams around your project instead of flooding you with resumes. Submit your RFP and budget, review a curated set of qualified options, choose your lead, and track delivery in real time.</p>
              </div>
              <div className="stack" style={{ gap: 'var(--gap-md)' }}>
                {[
                  { n: '01', title: 'Tell us about your project', body: 'Submit your RFP and budget. Our automated matcher narrows the field within the zone of possible agreement.' },
                  { n: '02', title: 'Choose from 3–5 options', body: 'Not a flood of resumes. A curated set of qualified member teams, skill-filtered to your project.' },
                  { n: '03', title: 'Pick your lead, stay in the loop', body: 'Once awarded, the team runs delivery independently while you stay aligned through milestones and updates.' },
                  { n: '04', title: 'Closeout and distribution', body: 'Once work is delivered and payment is collected, revenue is distributed automatically to the contributors who shipped it. Attribution and contribution records remain with the cooperative.' },
                ].map(({ n, title, body }) => (
                  <div className="step-card" key={n}>
                    <span className="step-deco" aria-hidden="true">{n}</span>
                    <div className="step-content">
                      <p className="step-label">{n}</p>
                      <h3 style={{ marginBottom: '4px' }}>{title}</h3>
                      <p style={{ color: 'var(--muted)', fontSize: '14px' }}>{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* ── People & Pillars Wave Wrapper ── */}
        <div ref={waveWrapperRef} style={{ position: 'relative', overflow: 'hidden' }}>
          {/* Measured wave lines from left edge → each pillar card top-center */}
          {waveData && (
            <svg
              viewBox={waveData.vb}
              fill="none"
              aria-hidden="true"
              style={{
                position: 'absolute', left: 0, top: 0,
                width: '100%', height: '100%',
                zIndex: 0, pointerEvents: 'none', opacity: 0.4,
                maskImage: 'linear-gradient(to bottom, transparent, black 10%)',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%)',
              }}
            >
              <path d={waveData.s} stroke="var(--accent)" strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" />
              <path d={waveData.c} stroke="var(--magenta)" strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" />
              <path d={waveData.p} stroke="var(--green)" strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" />
            </svg>
          )}

          {/* ── People ── */}
          <section className="section" data-od-id="people" style={{ position: 'relative', zIndex: 1 }}>
            <div className="container">
              <p className="section-label">People-powered, exclusively</p>
              <h2 style={{ marginBottom: 'var(--gap-md)', maxWidth: '36ch' }}>The resumes speak for themselves.</h2>
              <p className="lead" style={{ maxWidth: '100%' }}>The people who built this are already reputed in their fields. Top performers at the companies they passed through. Founding hires at platforms that went on to IPO. Engineers at Caltech, Berkeley, and the Smithsonian. Designers and writers at Columbia Records, Bad Boy, Mad Decent, Complex. Operators at Microsoft, Amazon, Lenovo, Bird, WebMD, and the LADWP.</p>
              <div className="disclaimer-fine">Contributor affiliations are listed for context only and do not imply endorsement of Future Modern Builderberg LLC or $BUILD.Store.</div>
            </div>
          </section>

          {/* ── Pillars ── */}
          <section className="section" data-od-id="pillars" id="pillars" style={{ position: 'relative', zIndex: 1 }}>
            <div className="container">
              <div style={{ textAlign: 'center', maxWidth: '52ch', margin: '0 auto var(--gap-xl)' }}>
                <p className="section-label">How we're organized</p>
                <h2 style={{ marginBottom: 'var(--gap-md)', textDecoration: 'underline', textUnderlineOffset: '6px', textDecorationThickness: '2px', textDecorationColor: 'var(--accent)' }}>The Three Pillars</h2>
                <p className="lead" style={{ marginTop: 'var(--gap-sm)', maxWidth: '100%' }}>Every member sits in at least one pillar. Many sit across two. A handful move freely through all three. The pillar framing is how opportunities are routed and how teams are built for serious briefs.</p>
              </div>
              <div className="grid-3">
                <div className="pillar-card card-stem" ref={stemCardRef}>
                  <div className="pillar-card-content">
                    <h3>STEM</h3>
                    <p>Full-stack engineering, AI/ML, blockchain, security, data, research, and more.</p>
                  </div>
                </div>
                <div className="pillar-card card-creative" ref={creativeCardRef}>
                  <div className="pillar-card-content">
                    <h3>Creative Media</h3>
                    <p>Music, film, editorial, design, direction, post-production, and more.</p>
                  </div>
                </div>
                <div className="pillar-card card-pro" ref={proCardRef}>
                  <div className="pillar-card-content">
                    <h3>Professional Services</h3>
                    <p>Strategy, legal, finance, operations, management consulting, and more.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>


        {/* ── Venture Labor ── */}
        <div className="contract-section-bg">
          {/* 4a. Contract-wide decor: vertical currents framing both sides */}
          <div className="decor-layer decor-contract" aria-hidden="true">
            <svg viewBox="0 0 1440 1600" preserveAspectRatio="xMidYMid slice" fill="none">
              <path d="M200 0 Q100 200 200 400 Q300 600 150 800 Q0 1000 200 1200 Q300 1400 200 1600" stroke="var(--accent)" strokeWidth="1.2" opacity="0.07" />
              <path d="M280 0 Q180 200 280 400 Q380 600 230 800 Q80 1000 280 1200 Q380 1400 280 1600" stroke="var(--magenta)" strokeWidth="0.8" opacity="0.05" />
              <path d="M1200 0 Q1300 200 1200 400 Q1100 600 1250 800 Q1400 1000 1200 1200 Q1100 1400 1200 1600" stroke="var(--accent)" strokeWidth="1" opacity="0.06" />
              <path d="M1120 0 Q1020 200 1120 400 Q1220 600 1070 800 Q920 1000 1120 1200 Q1220 1400 1120 1600" stroke="var(--green)" strokeWidth="0.6" opacity="0.04" />
              <circle cx="210" cy="150" r="2.5" fill="var(--accent)" opacity="0.35" />
              <circle cx="160" cy="380" r="2" fill="var(--accent)" opacity="0.25" />
              <circle cx="230" cy="620" r="2.5" fill="var(--accent)" opacity="0.2" />
              <circle cx="140" cy="850" r="1.5" fill="var(--accent)" opacity="0.15" />
              <circle cx="260" cy="1100" r="2" fill="var(--magenta)" opacity="0.2" />
              <circle cx="180" cy="1350" r="1.5" fill="var(--magenta)" opacity="0.15" />
              <circle cx="1180" cy="200" r="2" fill="var(--accent)" opacity="0.3" />
              <circle cx="1120" cy="450" r="2.5" fill="var(--green)" opacity="0.25" />
              <circle cx="1210" cy="700" r="2" fill="var(--green)" opacity="0.2" />
              <circle cx="1100" cy="950" r="1.5" fill="var(--accent)" opacity="0.15" />
              <circle cx="1220" cy="1250" r="2" fill="var(--magenta)" opacity="0.2" />
              <circle cx="1140" cy="1500" r="1.5" fill="var(--magenta)" opacity="0.12" />
            </svg>
          </div>
          {/* 4b. Venture Labor subsection: arrow-like sweep from left */}
          <div className="decor-layer decor-contract" aria-hidden="true" style={{ maskImage: 'linear-gradient(to bottom, black 0%, black 60%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 60%, transparent 100%)' }}>
            <svg viewBox="0 0 1440 600" preserveAspectRatio="xMidYMid slice" fill="none">
              <path d="M-100 200 Q300 100 600 250 Q900 400 1200 200 Q1400 80 1540 150" stroke="var(--accent)" strokeWidth="1.5" opacity="0.08" />
              <path d="M-100 260 Q350 150 650 300 Q950 450 1250 240 Q1450 120 1540 190" stroke="var(--magenta)" strokeWidth="1" opacity="0.06" />
              <path d="M-100 320 Q400 200 700 350 Q1000 500 1300 280 Q1500 160 1540 230" stroke="var(--green)" strokeWidth="0.7" opacity="0.04" />
              <circle cx="400" cy="180" r="2" fill="var(--accent)" opacity="0.3" />
              <circle cx="750" cy="300" r="2.5" fill="var(--accent)" opacity="0.25" />
              <circle cx="1100" cy="220" r="2" fill="var(--magenta)" opacity="0.2" />
              <circle cx="600" cy="400" r="1.5" fill="var(--green)" opacity="0.15" />
              <circle cx="1300" cy="280" r="2" fill="var(--accent)" opacity="0.2" />
            </svg>
          </div>
        <section className="section" data-od-id="venture-labor" style={{ position: 'relative' }}>
          <div className="container">
            <p className="section-label">The contract</p>
            <h2 style={{ marginBottom: 'var(--gap-md)' }}>Venture Labor.</h2>
            <p className="lead" style={{ marginBottom: 'var(--gap-lg)', maxWidth: '100%' }}>Venture Capital pools money and goes looking for labor to multiply it. Venture Labor is the inversion. People who can do the work pool their skill and time, and the upside on what gets shipped belongs to the people who shipped it.</p>
            <p className="lead" style={{ marginBottom: 'var(--gap-lg)', maxWidth: '100%', color: 'var(--fg)' }}>The cooperative is the structure. The people are the proof.</p>
            <div className="compare-wrap">
              <div className="compare-grid">
                <div className="compare-card vc">
                  <h3>Venture Capital</h3>
                  <p style={{ color: 'var(--muted)' }}>Capital seeks labor.</p>
                </div>
                <div className="compare-card vl">
                  <h3 style={{ color: 'var(--accent)' }}>Venture Labor</h3>
                  <p style={{ color: 'var(--muted)' }}>Labor creates ownership.</p>
                </div>
              </div>
              <svg className="compare-arrow" viewBox="0 0 100 40" fill="none" aria-hidden="true">
                <path d="M8 20 Q25 4 50 20 Q75 36 92 20" stroke="var(--accent)" strokeWidth="1.5" opacity="0.6" />
                <path d="M8 22 Q28 8 50 22 Q72 36 92 22" stroke="var(--magenta)" strokeWidth="1" opacity="0.4" />
                <path d="M82 16l10 4-10 6" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
              </svg>
            </div>
          </div>
        </section>



        {/* ── People-Powered ── */}
        <section className="section" data-od-id="people-powered" style={{ position: 'relative' }}>
          {/* 4c. People-Powered decor: ascending flow from bottom-right */}
          <div className="decor-layer" aria-hidden="true" style={{
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 25%, black 90%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 25%, black 90%, transparent 100%)'
          }}>
            <svg viewBox="0 0 1440 600" preserveAspectRatio="xMidYMid slice" fill="none">
              <path d="M1540 400 Q1200 300 900 450 Q600 600 300 400 Q100 250 -100 350" stroke="var(--green)" strokeWidth="1" opacity="0.06" />
              <path d="M1540 460 Q1250 350 950 500 Q650 650 350 450 Q150 300 -100 400" stroke="var(--accent)" strokeWidth="0.7" opacity="0.04" />
              <circle cx="1200" cy="350" r="2" fill="var(--green)" opacity="0.25" />
              <circle cx="950" cy="480" r="2.5" fill="var(--green)" opacity="0.2" />
              <circle cx="700" cy="520" r="2" fill="var(--accent)" opacity="0.2" />
              <circle cx="500" cy="420" r="1.5" fill="var(--accent)" opacity="0.15" />
              <circle cx="300" cy="350" r="2" fill="var(--magenta)" opacity="0.2" />
              <circle cx="1100" cy="500" r="1.5" fill="var(--magenta)" opacity="0.15" />
            </svg>
          </div>
          <div className="container">
            <div className="grid-2" style={{ alignItems: 'center' }}>
              <div>
                <p className="section-label">What "people-powered" means</p>
                <h2 style={{ marginBottom: 'var(--gap-sm)' }}>Four commitments that define the model.</h2>
                <p className="lead" style={{ fontSize: '15px', color: 'var(--muted)', marginBottom: 'var(--gap-lg)', maxWidth: '100%', lineHeight: '1.6' }}>
                  Future Modern is a worker-owned cooperative designed to reverse wealth extraction from labor. By combining managed services with software-driven coordination, we run on a lean 15% house cut that funds shared operations, routing 85% of revenue straight to the contributors.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-md)' }}>
                  {[
                    { title: 'Earned, not bought', body: "Access is earned through invitation, application and vetting, or contribution to the cooperative's infrastructure. The whitelist is not for sale." },
                    { title: 'Admin-authored framing', body: 'Members submit objective fields — price, timeline, work samples. The cooperative authors positioning so the work speaks for itself, not the cold-pitch voice.' },
                    { title: '85% to the people who shipped', body: 'Eighty-five percent of all client revenue goes directly to the member teams who delivered the work.' },
                    { title: 'Attribution is permanent', body: 'The ledger compounds across years. Contributions do not reset to zero when a contract closes.' },
                  ].map(({ title, body }) => (
                    <div key={title} style={{ borderLeft: '2px solid var(--accent)', paddingLeft: 'var(--gap-md)' }}>
                      <h3 style={{ color: 'var(--fg)', fontSize: '16px', marginBottom: '4px' }}>{title}</h3>
                      <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: '1.5' }}>{body}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="waterfall-card">
                <div className="waterfall-header">
                  <span className="waterfall-tagline">“Workers built it. Capital kept it.”</span>
                  <h3>The Revenue Waterfall</h3>
                </div>

                <div className="waterfall-bars">
                  {/* 85% Bar */}
                  <div className="waterfall-bar-group">
                    <div className="waterfall-bar-header">
                      <span className="waterfall-pct text-green">85%</span>
                      <span className="waterfall-label">Direct to Labor (You)</span>
                    </div>
                    <div className="waterfall-progress-bg">
                      <div className="waterfall-progress-fill accent-green" style={{ width: '85%' }}></div>
                    </div>
                    <p className="waterfall-subtext">No agency middlemen. No stacked platform taxes. Paid directly to the contributors who ship the code, design, and services.</p>
                  </div>

                  {/* 15% Bar */}
                  <div className="waterfall-bar-group">
                    <div className="waterfall-bar-header">
                      <span className="waterfall-pct text-muted">15%</span>
                      <span className="waterfall-label">Cooperative Operations</span>
                    </div>
                    <div className="waterfall-progress-bg">
                      <div className="waterfall-progress-fill accent-muted" style={{ width: '15%' }}></div>
                    </div>
                    <div className="waterfall-details">
                      <span>12% Active Administration</span>
                      <span>3% Treasury &amp; Liquidity</span>
                    </div>
                  </div>
                </div>

                <div className="waterfall-footer">
                  <div style={{ fontWeight: '600', color: 'var(--white)', fontSize: '13px', marginBottom: '14px' }}>
                    Platform comparison:
                  </div>
                  <div className="platform-comparison">
                    <div className="platform-row">
                      <span className="platform-status status-bad">✕</span>
                      <span className="platform-name">Upwork</span>
                      <span className="platform-fees">5%–10% client service fee + $0.99–$14.99 initiation. Freelancers pay ~10% variable fee + $0.60–$2.40/application in Connects. Double-sided extraction.</span>
                    </div>
                    <div className="platform-row">
                      <span className="platform-status status-bad">✕</span>
                      <span className="platform-name">Fiverr</span>
                      <span className="platform-fees">20% seller transaction fee + 5.5% buyer service surcharge</span>
                    </div>
                    <div className="platform-row">
                      <span className="platform-status status-bad">✕</span>
                      <span className="platform-name">Toptal</span>
                      <span className="platform-fees">Typical 40% to 50% client margin / markups with zero builder equity</span>
                    </div>
                    <div className="platform-row">
                      <span className="platform-status status-good">✓</span>
                      <span className="platform-name">$BUILD.Store</span>
                      <span className="platform-fees" style={{ background: 'linear-gradient(90deg, #10b981, #ffffff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: '600', display: 'inline-block' }}>15% flat operations fee · 85% to direct labor · Permanent equity</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Values & Standing ── */}
        <section className="section" data-od-id="values-standing" id="values" style={{ position: 'relative' }}>
          {/* 4d. Values & Standing decor: bilateral convergence */}
          <div className="decor-layer" aria-hidden="true" style={{
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 85%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 85%, transparent 100%)'
          }}>
            <svg viewBox="0 0 1440 600" preserveAspectRatio="xMidYMid slice" fill="none">
              <path d="M-100 100 Q200 200 400 150 Q600 100 720 200 Q840 300 1040 200 Q1240 100 1540 200" stroke="var(--accent)" strokeWidth="1" opacity="0.06" />
              <path d="M-100 160 Q250 260 450 210 Q650 160 770 260 Q890 360 1090 260 Q1290 160 1540 260" stroke="var(--magenta)" strokeWidth="0.7" opacity="0.04" />
              <path d="M-100 220 Q300 320 500 270 Q700 220 820 320 Q940 420 1140 320 Q1340 220 1540 340" stroke="var(--green)" strokeWidth="0.5" opacity="0.03" />
              <circle cx="250" cy="180" r="2" fill="var(--accent)" opacity="0.25" />
              <circle cx="550" cy="220" r="2.5" fill="var(--accent)" opacity="0.2" />
              <circle cx="720" cy="280" r="2" fill="var(--magenta)" opacity="0.25" />
              <circle cx="900" cy="240" r="2.5" fill="var(--green)" opacity="0.2" />
              <circle cx="1100" cy="280" r="2" fill="var(--accent)" opacity="0.2" />
              <circle cx="1300" cy="220" r="1.5" fill="var(--magenta)" opacity="0.15" />
              <circle cx="450" cy="350" r="1.5" fill="var(--green)" opacity="0.15" />
              <circle cx="1050" cy="400" r="2" fill="var(--accent)" opacity="0.15" />
            </svg>
          </div>
          <div className="container">
            <div className="values-standing-split">
              {/* Left Column: Core Values */}
              <div className="values-column">
                <div className="values-card">
                  <p className="section-label">Provenance · Discernment · Equity</p>
                  <h2 style={{ marginBottom: 'var(--gap-lg)' }}>Core values</h2>

                  <div className="values-list">
                    <div className="value-list-item">
                      <h3>Provenance</h3>
                      <p>Resources and acknowledgement flow back to original ideas and the labor that moves culture forward. Attribution is permanent.</p>
                    </div>
                    <div className="value-list-item">
                      <h3>Discernment</h3>
                      <p>Future Modern curates contributors, vets incoming RFPs, and assembles cross-pillar teams the way a strong agency partner would.</p>
                    </div>
                    <div className="value-list-item">
                      <h3>Equity</h3>
                      <p>Eighty-five percent of contract revenue flows to the people who shipped. $BUILD tokens accrue with contribution. The platform is owned by the people building it.</p>
                    </div>
                    <div className="value-list-item">
                      <h3>Truth and inquiry</h3>
                      <p>Where we are unsure, we say so. Where we are certain, we ship.</p>
                    </div>
                    <div className="value-list-item">
                      <h3>Tried and true × cutting edge</h3>
                      <p>Future Modern combines proven operations with new technology and strategy. The engineering follows the operations, not the other way around.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Member Cards */}
              <div className="standing-column">
                <p className="section-label">Cooperative Standing</p>
                <h3 style={{ marginBottom: 'var(--gap-sm)' }}>Members shipping the work</h3>
                <p className="lead" style={{ marginBottom: 'var(--gap-lg)' }}>
                  Each contributor holds a standing tier within the cooperative's player-card system: Champion's Court gold, Future Modernist magenta, promotion-eligible blue, good standing green, and probation grey.
                </p>

                <div className="standing-grid-2col">
                  <InteractiveStandingCard
                    photo="/Jamar McCarthy.jpg"
                    tier="tier-champion"
                    hasSheen
                    name="Jamar"
                    role="Cooperative Builder • Strategist"
                  />
                  <InteractiveStandingCard
                    photo="/Big Baby Gandhi.jpg"
                    tier="tier-future-modernist"
                    name="Big Baby Gandhi"
                    role="Musician • Producer • PharmD • Marketing"
                  />
                  <InteractiveStandingCard
                    photo="/Chibu O..jpg"
                    tier="tier-future-modernist"
                    name="Chibu"
                    role="Data • Economist"
                  />
                  <InteractiveStandingCard
                    photo="/Sunny Su.jpg"
                    tier="tier-promotion"
                    name="Sunny"
                    role="Brand • UI/UX • Product Designer"
                  />
                  <InteractiveStandingCard
                    photo="/Sahtyre.jpg"
                    tier="tier-promotion"
                    name="Sahtyre"
                    role="Musician • VFX • Video Editing • 3D Design"
                  />
                  <InteractiveStandingCard
                    photo="/Bayu.jpg"
                    tier="tier-good-standing"
                    name="Bayu"
                    role="UI/UX • Marketing Funnel • Lead Gen"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        </div>

        {/* 4e. Membership + Footer decor: taper outward */}
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <div className="decor-layer decor-bottom" aria-hidden="true">
            <svg viewBox="0 0 1440 500" preserveAspectRatio="xMidYMid slice" fill="none">
              <path d="M400 0 Q200 100 300 250 Q400 400 200 500" stroke="var(--accent)" strokeWidth="1" opacity="0.06" />
              <path d="M480 0 Q280 100 380 250 Q480 400 280 500" stroke="var(--magenta)" strokeWidth="0.7" opacity="0.04" />
              <path d="M960 0 Q1160 100 1060 250 Q960 400 1160 500" stroke="var(--accent)" strokeWidth="1" opacity="0.06" />
              <path d="M1040 0 Q1240 100 1140 250 Q1040 400 1240 500" stroke="var(--green)" strokeWidth="0.7" opacity="0.04" />
              <circle cx="350" cy="150" r="2" fill="var(--accent)" opacity="0.2" />
              <circle cx="280" cy="350" r="1.5" fill="var(--accent)" opacity="0.15" />
              <circle cx="1050" cy="200" r="2" fill="var(--green)" opacity="0.25" />
              <circle cx="1120" cy="380" r="1.5" fill="var(--green)" opacity="0.15" />
              <circle cx="720" cy="120" r="2" fill="var(--magenta)" opacity="0.2" />
              <circle cx="700" cy="300" r="1.5" fill="var(--magenta)" opacity="0.15" />
            </svg>
          </div>
          {/* 4f. Final CTA halo + constellation */}
          <div className="decor-layer" aria-hidden="true" style={{
            maskImage: 'radial-gradient(ellipse at 50% 40%, black 0%, black 30%, transparent 65%)',
            WebkitMaskImage: 'radial-gradient(ellipse at 50% 40%, black 0%, black 30%, transparent 65%)'
          }}>
            <svg viewBox="0 0 1440 500" preserveAspectRatio="xMidYMid slice" fill="none">
              <ellipse cx="720" cy="220" rx="420" ry="200" stroke="var(--accent)" strokeWidth="0.8" opacity="0.2" fill="none" />
              <ellipse cx="720" cy="220" rx="340" ry="160" stroke="var(--magenta)" strokeWidth="0.6" opacity="0.15" fill="none" />
              <ellipse cx="720" cy="220" rx="260" ry="120" stroke="var(--green)" strokeWidth="0.5" opacity="0.12" fill="none" />
              <ellipse cx="720" cy="220" rx="180" ry="80" stroke="var(--accent)" strokeWidth="0.4" opacity="0.08" fill="none" />
              <circle cx="580" cy="140" r="2" fill="var(--accent)" opacity="0.35" />
              <circle cx="860" cy="160" r="2.5" fill="var(--accent)" opacity="0.3" />
              <circle cx="500" cy="220" r="1.5" fill="var(--accent)" opacity="0.25" />
              <circle cx="940" cy="240" r="1.5" fill="var(--magenta)" opacity="0.25" />
              <circle cx="660" cy="100" r="2" fill="var(--magenta)" opacity="0.3" />
              <circle cx="780" cy="90" r="1.5" fill="var(--green)" opacity="0.25" />
              <circle cx="450" cy="300" r="2" fill="var(--accent)" opacity="0.2" />
              <circle cx="990" cy="320" r="2" fill="var(--green)" opacity="0.2" />
              <circle cx="600" cy="350" r="1.5" fill="var(--magenta)" opacity="0.15" />
              <circle cx="840" cy="360" r="1.5" fill="var(--accent)" opacity="0.15" />
            </svg>
          </div>

        {/* ── Membership ── */}
        <section className="section" data-od-id="membership" id="membership" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div className="container membership-card">
            <p className="eyebrow">The Future Modernist</p>
            <h2 style={{ marginBottom: 'var(--gap-md)' }}>A creator at heart — artist, engineer, builder.</h2>
            <p className="lead" style={{ margin: '0 auto var(--gap-lg)' }}>We have specialists, plenty of them. But the people who shape this cooperative are renaissance figures: comfortable directing a shoot in the morning, shipping a smart contract in the afternoon, sitting in a policy room that night.</p>
            <div className="hero-cta" style={{ justifyContent: 'center' }}>
              <button className="btn btn-primary" onClick={() => setProjectModalOpen(true)}>Start a project</button>
              <button className="btn btn-join" onClick={() => setTalentModalOpen(true)}>Join the cooperative</button>
            </div>
          </div>
        </section>
        </div>

      </main>

      {/* ── Footer ── */}
      <footer className="pagefoot">
        <div className="container pagefoot-inner">
          <div className="logo">
            <img src="/mr2sbkcq-turtle.png" alt="" style={{ height: '24px', width: 'auto' }} />
            <div className="logo-text">
              <span className="logo-title" style={{ fontSize: '14px' }}>$Build<span>.</span>Store</span>
              <span className="logo-sub" style={{ fontSize: '10px' }}>FUTURE MODERN</span>
            </div>
          </div>
          <div className="pagefoot-links">
            <a href="#">About</a>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Whitelist</a>
          </div>
          <span style={{ fontSize: '12px' }}>© Future Modern Builderberg LLC</span>
        </div>
      </footer>

      <TalentModal isOpen={talentModalOpen} onClose={() => setTalentModalOpen(false)} />
      <ProjectModal isOpen={projectModalOpen} onClose={() => setProjectModalOpen(false)} />
    </div>
  )
}

let _gyroListening = false;

function InteractiveStandingCard({ photo, tier, hasSheen, name, role }: { photo: string; tier: string; hasSheen?: boolean; name: string; role: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const gyroRef = useRef<() => void>(null);
  const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

  useEffect(() => () => gyroRef.current?.(), []);

  const applyTilt = (tiltX: number, tiltY: number, instant = false) => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = `perspective(800px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
    card.style.transition = instant ? 'transform 0.05s linear' : 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
  };

  const resetTilt = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = `perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    card.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
  };

  // Desktop: mouse parallax
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    applyTilt(-((y / rect.height) - 0.5) * 12, ((x / rect.width) - 0.5) * 12, true);
  };

  // Mobile: start gyro on first card tap (user gesture required for iOS permission)
  const handleCardTap = async () => {
    if (!isMobile || _gyroListening) return;
    _gyroListening = true;

    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const perm = await (DeviceOrientationEvent as any).requestPermission();
        if (perm !== 'granted') { _gyroListening = false; return; }
      } catch { _gyroListening = false; return; }
    }

    const handler = (e: DeviceOrientationEvent) => {
      const gamma = e.gamma ?? 0;
      const beta = e.beta ?? 0;
      const tiltY = Math.max(-12, Math.min(12, gamma * 0.12));
      const tiltX = Math.max(-12, Math.min(12, (beta - 45) * -0.08));
      applyTilt(tiltX, tiltY);
    };

    window.addEventListener('deviceorientation', handler);
    gyroRef.current = () => window.removeEventListener('deviceorientation', handler);
  };

  return (
    <div className="standing-item">
      <div
        ref={cardRef}
        className={`standing-card ${tier}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={resetTilt}
        onClick={handleCardTap}
        style={{
          transformStyle: 'preserve-3d',
          transform: 'perspective(800px) rotateX(0deg) rotateY(0deg)',
          transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)'
        }}
      >
        <img src={photo} alt={`${name} — ${role} — Future Modern cooperative member`} className="standing-photo" style={{ transform: 'translateZ(-10px) scale(1.15)', transformStyle: 'preserve-3d' }} />
        <div className="standing-overlay" style={{ transform: 'translateZ(1px)' }} />
        <div className="standing-watermark" style={{ transform: 'translateZ(15px)' }}>Future Modern</div>
        {hasSheen && <div className="standing-sheen" style={{ transform: 'translateZ(20px)' }} aria-hidden="true" />}
      </div>
      <div className="standing-info">
        <div className="standing-name">{name}</div>
        <div className="standing-role">{role}</div>
      </div>
    </div>
  );
}
