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
  const stemCardRef    = useRef<HTMLDivElement>(null)
  const creativeCardRef = useRef<HTMLDivElement>(null)
  const proCardRef     = useRef<HTMLDivElement>(null)
  const [waveData, setWaveData] = useState<{ vb: string; s: string; c: string; p: string } | null>(null)

  useEffect(() => {
    function measure() {
      const wrapper = waveWrapperRef.current
      const stemEl  = stemCardRef.current
      const cEl     = creativeCardRef.current
      const pEl     = proCardRef.current
      if (!wrapper || !stemEl || !cEl || !pEl) return

      const wR = wrapper.getBoundingClientRect()
      const W = wR.width
      const H = wR.height

      // Return card top-center position relative to wrapper
      function pt(el: HTMLElement) {
        const r = el.getBoundingClientRect()
        return { x: r.left - wR.left + r.width / 2, y: r.top - wR.top }
      }

      const s = pt(stemEl), c = pt(cEl), p = pt(pEl)

      // Build S-curve: starts at left edge (x=0), ends at card top-center
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
            <h1>$BUILD<br />A TEAM</h1>
            <p className="lead" style={{ marginInline: 'auto', maxWidth: '62ch' }}>
              Build a handpicked team from our network of experienced STEM, Creative Media, and Professional Services contributors.
            </p>
            <div className="hero-cta">
              <button className="btn btn-primary" onClick={() => setProjectModalOpen(true)}>Start a project</button>
              <button className="btn btn-join" onClick={() => setTalentModalOpen(true)}>Join the cooperative</button>
            </div>
            <p className="hero-text-link"><a href="#" onClick={(e) => { e.preventDefault(); (window as any).Calendly?.initPopupWidget({ url: 'https://calendly.com/a-future-modern/' }) }}>Prefer to talk first? Schedule a call →</a></p>
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
                  <div className="rare-display">Rare∞</div>
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
                  { n: '01', title: 'Tell us your project', body: 'Submit your RFP and budget. Our automated matcher narrows the field within the zone of possible agreement.' },
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
              <path d={waveData.s} stroke="var(--accent)"  strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" />
              <path d={waveData.c} stroke="var(--magenta)" strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" />
              <path d={waveData.p} stroke="var(--green)"   strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" />
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
              <h2 style={{ marginBottom: 'var(--gap-md)' }}>Three pillars, one cooperative</h2>
              <p className="lead" style={{ marginTop: 'var(--gap-sm)', maxWidth: '100%' }}>Every member sits in at least one pillar. Many sit across two. A handful move freely through all three. The pillar framing is how opportunities are routed and how teams are built for serious briefs.</p>
            </div>
            <div className="grid-3">
              <div className="pillar-card card-stem" ref={stemCardRef}>
                <div className="pillar-card-content">
                  <h3>STEM</h3>
                  <p>Full-stack engineering, AI/ML, blockchain, security, data, research.</p>
                </div>
              </div>
              <div className="pillar-card card-creative" ref={creativeCardRef}>
                <div className="pillar-card-content">
                  <h3>Creative Media</h3>
                  <p>Music, film, editorial, design, direction, post-production.</p>
                </div>
              </div>
              <div className="pillar-card card-pro" ref={proCardRef}>
                <div className="pillar-card-content">
                  <h3>Professional Services</h3>
                  <p>Strategy, legal, finance, operations, management consulting.</p>
                </div>
              </div>
            </div>
            </div>
          </section>
        </div>

        {/* ── Core Competencies ── */}
        <section className="section" data-od-id="competencies" id="competencies">
          <div className="container">
            <div className="comp-intro">
              <p className="section-label">Core Competencies</p>
              <p className="lead">Future Modern assembles across disciplines when a brief calls for it. These are the capabilities represented across the cooperative and its service partners.</p>
            </div>
            <div className="comp-grid">
                <div className="comp-col col-stem">
                  <h3 className="comp-heading">STEM</h3>
                  <div className="comp-divider" />
                  <p className="comp-text">Web Design · Web Development · Blockchain Development · Data Science &amp; Machine Learning · Mechanical Engineering · Robotics · Electrical Engineering · Network Administration &amp; Cybersecurity · Scientific Liaison · Technical Writing</p>
                </div>
                <div className="comp-col col-creative">
                  <h3 className="comp-heading">Creative Media</h3>
                  <div className="comp-divider" />
                  <p className="comp-text">Content Marketing · Advertising · Music · Product Design · Graphic Design · Game Design · Fashion Design · Film Direction · Event Planning</p>
                </div>
                <div className="comp-col col-pro">
                  <h3 className="comp-heading">Professional Services</h3>
                  <div className="comp-divider" />
                  <p className="comp-text">Managed Services · Product Management · Consulting · Strategy · Psychiatry &amp; Psychology · Family Medicine · Health Law · Employment Law · Pharmaceuticals · Medical Writing</p>
                </div>
              </div>
            </div>
          </section>
          <div className="competencies-wave">
            <svg viewBox="0 0 1440 120" preserveAspectRatio="none" fill="none">
              <path d="M0 60 Q180 0 360 60 Q540 120 720 60 Q900 0 1080 60 Q1260 120 1440 60" stroke="var(--accent)" strokeWidth="1.5" opacity="0.35" fill="none" />
              <path d="M0 80 Q240 20 480 80 Q720 140 960 80 Q1200 20 1440 80" stroke="var(--magenta)" strokeWidth="1" opacity="0.25" fill="none" />
              <path d="M0 40 Q300 100 600 40 Q900 -20 1200 40 Q1350 70 1440 40" stroke="var(--magenta)" strokeWidth="2" opacity="0.15" fill="none" />
              <path d="M0 120 Q200 40 400 80 Q600 120 800 60 Q1000 0 1200 40 Q1320 60 1440 70" stroke="var(--accent)" strokeWidth="0.8" opacity="0.2" fill="none" />
            </svg>
          </div>

        {/* ── Venture Labor ── */}
        <section className="section" data-od-id="venture-labor" style={{ position: 'relative', overflow: 'hidden' }}>
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
        <section className="section" data-od-id="people-powered">
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
                      <span className="platform-fees">10% fee + pay-to-pitch connects ($1.20–$3.30+ per bid). Freelancers average 20–30 applications (~200–400 Connects / $30–$60+) just to land a single commoditized contract.</span>
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
                      <span className="platform-name">FM Co-op</span>
                      <span className="platform-fees" style={{ background: 'linear-gradient(90deg, #10b981, #ffffff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: '600', display: 'inline-block' }}>15% flat operations fee · 85% to direct labor · Permanent equity</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Values & Standing ── */}
        <section className="section" data-od-id="values-standing" id="values">
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
                  Each contributor holds a standing tier within the cooperative's player-card system: Champion's Court gold, Future Modernist magenta, promotion-eligible blue, and good standing green.
                </p>

                <div className="standing-grid-2col">
                  <InteractiveStandingCard 
                    photo="/Jamar McCarthy.jpg" 
                    tier="tier-champion" 
                    hasSheen 
                    name="Jamar McCarthy" 
                    role="Cooperative Builder • Strategist" 
                  />
                  <InteractiveStandingCard 
                    photo="/Big Baby Gandhi.jpg" 
                    tier="tier-future-modernist" 
                    name="Big Baby Gandhi" 
                    role="Rapper • Producer" 
                  />
                  <InteractiveStandingCard 
                    photo="/Chibu O..jpg"
                    tier="tier-future-modernist" 
                    name="Chibu O." 
                    role="Fullstack Engineer • Data" 
                  />
                  <InteractiveStandingCard 
                    photo="/Sunny Su.jpg" 
                    tier="tier-promotion" 
                    name="Sunny Su" 
                    role="Brand • UI/UX • Product Designer" 
                  />
                  <InteractiveStandingCard 
                    photo="/Sahtyre.jpg"
                    tier="tier-promotion" 
                    name="Sahtyre" 
                    role="Rapper" 
                  />
                  <InteractiveStandingCard 
                    photo="/Bayu.jpg"
                    tier="tier-good-standing" 
                    name="Bayu Savira" 
                    role="UI/UX • Marketing Funnel • Lead Gen" 
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Membership ── */}
        <section className="section" data-od-id="membership" id="membership" style={{ textAlign: 'center' }}>
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

function InteractiveStandingCard({ photo, tier, hasSheen, name, role }: { photo: string; tier: string; hasSheen?: boolean; name: string; role: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

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

  // Mouse handlers (desktop)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = (x / rect.width) - 0.5;
    const py = (y / rect.height) - 0.5;
    applyTilt(-py * 12, px * 12, true);
  };

  // Gyroscope handler (mobile)
  useEffect(() => {
    if (!isMobile) return;
    let listening = true;
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (!listening) return;
      const gamma = e.gamma ?? 0;  // left/right   ±90
      const beta  = e.beta ?? 0;   // front/back   ±180
      const tiltY = Math.max(-12, Math.min(12, gamma * 0.12));
      const tiltX = Math.max(-12, Math.min(12, (beta - 45) * -0.08));
      applyTilt(tiltX, tiltY);
    };

    const requestPermission = async () => {
      // iOS 13+ requires permission request
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        try {
          const perm = await (DeviceOrientationEvent as any).requestPermission();
          if (perm !== 'granted') return;
        } catch { return; }
      }
      window.addEventListener('deviceorientation', handleOrientation);
    };
    requestPermission();

    return () => { listening = false; window.removeEventListener('deviceorientation', handleOrientation); };
  }, [isMobile]);

  return (
    <div className="standing-item">
      <div
        ref={cardRef}
        className={`standing-card ${tier}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={resetTilt}
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
