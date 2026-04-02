const SERVICE_CARDS = [
  { icon: '🧬', bg: '#0d9488', title: 'mRNA Vaccine Design & LNP Strategy', desc: 'Construct design · Codon optimization · LNP formulation' },
  { icon: '🦠', bg: '#f59e0b', title: 'Antiviral Study Design', desc: 'In vitro models · Plaque assay · RT-qPCR · Bioplex' },
  { icon: '🫀', bg: '#3b82f6', title: 'Organ-on-Chip Advisory', desc: 'Lung · Liver · Brain platforms · NAMs roadmap' },
  { icon: '🔄', bg: '#8b5cf6', title: '3Rs / NAMs Compliance Strategy', desc: 'Animal model replacement · Regulatory justification' },
  { icon: '📝', bg: '#10b981', title: 'Scientific & Regulatory Writing', desc: 'Manuscripts · SOPs · NIH grant sections · Protocols' },
  { icon: '🏛️', bg: '#ef4444', title: 'NIH Grant Writing & Portfolio Strategy', desc: 'R01/R21 aims · Reviewer perspective · Portfolio positioning' },
  { icon: '📊', bg: '#14b8a6', title: 'Pre-existing Research Data Analysis', desc: 'RNA-Seq · qPCR arrays · Bioplex · IFA/IHC interpretation' },
  { icon: '🌐', bg: '#6366f1', title: 'Infectious Disease Program Advisory', desc: 'Translational strategy · Hepatitis · Respiratory viruses' },
]

const LOOPED = [...SERVICE_CARDS, ...SERVICE_CARDS]

export default function Hero() {
  const navTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="hero" id="hero">
      <div className="hero-inner">

        {/* ── Left: Text content ── */}
        <div className="hero-content">

          <div className="hero-badge">
            <span className="hero-badge-dot" />
            NIH-NIAID · mRNA Vaccines · Organ-on-Chip · 15+ Years
          </div>

          <h1 className="hero-title">
            Where <em>Molecular Precision</em> Meets Scientific Vision
          </h1>

          <p className="hero-subtitle">
            BioViro Sciences LLC brings <em>15+ years</em> of NIH-NIAID and GATECH research
            experience to your infectious disease program. From mRNA vaccine construct
            optimization and LNP formulation strategy, to organ-on-chip platform advisory
            and NIH grant positioning — we deliver the scientific depth of federal research,
            packaged as targeted consulting deliverables.
          </p>

          <div className="hero-actions">
            <button className="btn btn-primary" onClick={() => navTo('services')}>
              Explore Our 8 Services
            </button>
            <button className="btn btn-outline" onClick={() => navTo('contact')}>
              Engage Our Team
            </button>
          </div>

          <div className="hero-stats">
            {[
              { num: '15+',      label: 'Years NIH, GATECH & Industry Research' },
              { num: '3',        label: 'Nature / Biomaterials / NAR Publications' },
              { num: '8',        label: 'Specialized Consulting Services' },
              { num: '3Rs/NAMs', label: 'Pioneer in Alternative Models' },
            ].map((s) => (
              <div className="hero-stat" key={s.num}>
                <div className="hero-stat-num">{s.num}</div>
                <div className="hero-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: Auto-scrolling service carousel ── */}
        <div className="hero-visual">
          <div className="hero-cards-track">
            {LOOPED.map((c, idx) => (
              <div className="hero-card" key={`${c.title}-${idx}`}>
                <div className="hero-card-icon" style={{ background: `${c.bg}22` }}>
                  {c.icon}
                </div>
                <div className="hero-card-body">
                  <div className="hero-card-title">{c.title}</div>
                  <div className="hero-card-desc">{c.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
