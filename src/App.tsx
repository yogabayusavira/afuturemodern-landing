import { useState } from 'react'
import './style.css'
import TalentModal from './components/TalentModal'
import ProjectModal from './components/ProjectModal'

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [talentModalOpen, setTalentModalOpen] = useState(false)
  const [projectModalOpen, setProjectModalOpen] = useState(false)

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 70
      window.scrollTo({ top, behavior: 'smooth' })
    }
    setMobileOpen(false)
  }

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
                <svg viewBox="0 0 115 24" fill="none"><rect x="0" y="0" width="10" height="10" fill="currentColor" opacity="0.9"/><rect x="12" y="0" width="10" height="10" fill="currentColor" opacity="0.7"/><rect x="0" y="12" width="10" height="10" fill="currentColor" opacity="0.5"/><rect x="12" y="12" width="10" height="10" fill="currentColor" opacity="0.6"/><text x="30" y="16" fontSize="15" fontWeight="600" fill="currentColor" fontFamily="system-ui,sans-serif">Microsoft</text></svg>
                <svg viewBox="0 0 88 24" fill="none"><text x="0" y="17" fontSize="17" fontWeight="700" fill="currentColor" fontFamily="system-ui,sans-serif">amazon</text><path d="M4 20 Q28 26 72 20" stroke="currentColor" strokeWidth="1.8" fill="none"/></svg>
                <svg viewBox="0 0 90 24" fill="none"><text x="0" y="17" fontSize="16" fontWeight="600" fill="currentColor" fontFamily="system-ui,sans-serif" letterSpacing="2">CALTECH</text></svg>
                <svg viewBox="0 0 105 24" fill="none"><text x="0" y="18" fontSize="20" fontWeight="800" fill="currentColor" fontFamily="Georgia,serif" fontStyle="italic">Cal</text><text x="38" y="17" fontSize="11" fill="currentColor" opacity="0.7" fontFamily="system-ui,sans-serif" letterSpacing="1">BERKELEY</text></svg>
                <svg viewBox="0 0 148 24" fill="none"><circle cx="10" cy="14" r="8" stroke="currentColor" strokeWidth="1.5" opacity="0.6"/><circle cx="10" cy="14" r="4" stroke="currentColor" strokeWidth="1" opacity="0.4"/><text x="24" y="17" fontSize="14" fontWeight="500" fill="currentColor" fontFamily="system-ui,sans-serif" letterSpacing="2">SMITHSONIAN</text></svg>
                <svg viewBox="0 0 130 24" fill="none"><rect x="0" y="7" width="2" height="10" rx="1" fill="currentColor" opacity="0.6"/><circle cx="13" cy="14" r="8" stroke="currentColor" strokeWidth="1.2" opacity="0.5"/><circle cx="13" cy="14" r="3" fill="currentColor" opacity="0.3"/><text x="28" y="17" fontSize="14" fontWeight="600" fill="currentColor" fontFamily="Georgia,serif">Columbia</text><text x="82" y="17" fontSize="10" fill="currentColor" opacity="0.6" fontFamily="system-ui,sans-serif">RECORDS</text></svg>
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

        {/* ── Purpose & Vision ── */}
        <section className="section" data-od-id="purpose-vision">
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
        <section className="section" data-od-id="how-it-works" id="how-it-works">
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

        {/* ── People ── */}
        <section className="section" data-od-id="people">
          <div className="container">
            <p className="section-label">People-powered, exclusively</p>
            <h2 style={{ marginBottom: 'var(--gap-md)', maxWidth: '36ch' }}>The resumes speak for themselves.</h2>
            <p className="lead" style={{ maxWidth: '100%' }}>The people who built this are already reputed in their fields. Top performers at the companies they passed through. Founding hires at platforms that went on to IPO. Engineers at Caltech, Berkeley, and the Smithsonian. Designers and writers at Columbia Records, Bad Boy, Mad Decent, Complex. Operators at Microsoft, Amazon, Lenovo, Bird, WebMD, and the LADWP.</p>
            <div className="disclaimer-fine">Contributor affiliations are listed for context only and do not imply endorsement of Future Modern Builderberg LLC or $BUILD.Store.</div>
          </div>
        </section>

        {/* ── Pillars ── */}
        <section className="section" data-od-id="pillars" id="pillars">
          <div className="container">
            <div style={{ textAlign: 'center', maxWidth: '52ch', margin: '0 auto var(--gap-xl)' }}>
              <p className="section-label">How we're organized</p>
              <h2 style={{ marginBottom: 'var(--gap-md)' }}>Three pillars, one cooperative</h2>
              <p className="lead" style={{ marginTop: 'var(--gap-sm)', maxWidth: '100%' }}>Every member sits in at least one pillar. Many sit across two. A handful move freely through all three. The pillar framing is how opportunities are routed and how teams are built for serious briefs.</p>
            </div>
            <div className="grid-3">
              <div className="pillar-card">
                <div className="pillar-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 8v8M15 8v8M12 8v8"/></svg>
                </div>
                <h3>STEM</h3>
                <p>Full-stack engineering, AI/ML, blockchain, security, data, research.</p>
              </div>
              <div className="pillar-card">
                <div className="pillar-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>
                </div>
                <h3>Creative Media</h3>
                <p>Music, film, editorial, design, direction, post-production.</p>
              </div>
              <div className="pillar-card">
                <div className="pillar-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                </div>
                <h3>Professional Services</h3>
                <p>Strategy, legal, finance, operations, management consulting.</p>
              </div>
            </div>
            <div style={{ marginTop: 'var(--gap-2xl)' }}>
              <p className="section-label">Core Competencies</p>
              <p className="lead" style={{ maxWidth: '100%', marginBottom: 'var(--gap-lg)' }}>Future Modern assembles across disciplines when a brief calls for it. These are the capabilities represented across the cooperative and its service partners.</p>
              <div className="comp-grid">
                <div className="comp-col">
                  <h3 className="comp-heading">Technical</h3>
                  <div className="comp-divider" />
                  <p className="comp-text">Web Design · Web Development · Blockchain Development · Data Science &amp; Machine Learning · Mechanical Engineering · Robotics · Electrical Engineering · Network Administration &amp; Cybersecurity · Scientific Liaison · Technical Writing</p>
                </div>
                <div className="comp-col">
                  <h3 className="comp-heading">Creative</h3>
                  <div className="comp-divider" />
                  <p className="comp-text">Content Marketing · Advertising · Music · Product Design · Graphic Design · Game Design · Fashion Design · Film Direction · Event Planning</p>
                </div>
                <div className="comp-col">
                  <h3 className="comp-heading">Business &amp; Professional</h3>
                  <div className="comp-divider" />
                  <p className="comp-text">Managed Services · Product Management · Consulting · Strategy · Psychiatry &amp; Psychology · Family Medicine · Health Law · Employment Law · Pharmaceuticals · Medical Writing</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Venture Labor ── */}
        <section className="section" data-od-id="venture-labor">
          <div className="container">
            <p className="section-label">The contract</p>
            <h2 style={{ marginBottom: 'var(--gap-md)' }}>Venture Labor.</h2>
            <p className="lead" style={{ marginBottom: 'var(--gap-lg)', maxWidth: '100%' }}>Venture Capital pools money and goes looking for labor to multiply it. Venture Labor is the inversion. People who can do the work pool their skill and time, and the upside on what gets shipped belongs to the people who shipped it.</p>
            <p className="lead" style={{ marginBottom: 'var(--gap-lg)', maxWidth: '100%', color: 'var(--fg)' }}>The cooperative is the structure. The people are the proof.</p>
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
          </div>
        </section>



        {/* ── People-Powered ── */}
        <section className="section" data-od-id="people-powered">
          <div className="container">
            <p className="section-label">What "people-powered" means</p>
            <h2 style={{ marginBottom: 'var(--gap-xl)' }}>Four commitments that define the model.</h2>
            <div className="module-grid">
              {[
                { title: 'Earned, not bought', body: "Access is earned through invitation, application and vetting, or contribution to the cooperative's infrastructure. The whitelist is not for sale." },
                { title: 'Admin-authored framing', body: 'Members submit objective fields — price, timeline, work samples. The cooperative authors positioning so the work speaks for itself, not the cold-pitch voice.' },
                { title: '85% to the people who shipped', body: 'One 15% house cut funds shared infrastructure. No agency middleman. No stacked platform tax.' },
                { title: 'Attribution is permanent', body: 'The ledger compounds across years. Contributions do not reset to zero when a contract closes.' },
              ].map(({ title, body }) => (
                <div className="module-item" key={title}>
                  <h3 style={{ color: 'var(--accent)', marginBottom: '6px' }}>{title}</h3>
                  <p style={{ color: 'var(--muted)', fontSize: '14px' }}>{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Values ── */}
        <section className="section" data-od-id="values">
          <div className="container">
            <p className="section-label">Provenance · Discernment · Equity</p>
            <h2 style={{ marginBottom: 'var(--gap-xl)' }}>Core values</h2>
            <div className="values-grid">
              <div className="value-item">
                <h3>Provenance</h3>
                <p>Resources and acknowledgement flow back to original ideas and the labor that moves culture forward. Attribution is permanent.</p>
              </div>
              <div className="value-item">
                <h3>Discernment</h3>
                <p>Future Modern curates contributors, vets incoming RFPs, and assembles cross-pillar teams the way a strong agency partner would.</p>
              </div>
              <div className="value-item">
                <h3>Equity</h3>
                <p>Eighty-five percent of contract revenue flows to the people who shipped. $BUILD tokens accrue with contribution. The platform is owned by the people building it.</p>
              </div>
              <div className="value-item">
                <h3>Truth and inquiry</h3>
                <p>Where we are unsure, we say so. Where we are certain, we ship.</p>
              </div>
              <div className="value-item" style={{ gridColumn: '1/-1' }}>
                <h3>Tried and true × cutting edge</h3>
                <p>Future Modern combines proven operations with new technology and strategy. The engineering follows the operations, not the other way around.</p>
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
