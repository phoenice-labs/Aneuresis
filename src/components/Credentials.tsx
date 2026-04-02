export default function Credentials() {
  const stats = [
    { icon: '🔬', value: '15+', label: 'Years of NIH, GATECH & Industry Research' },
    { icon: '📰', value: '3', label: 'High-Impact Publications (Nature, Biomaterials, NAR)' },
    { icon: '🏛️', value: 'NIH-NIAID', label: 'Study Director & Program Officer' },
    { icon: '🌐', value: 'US-Japan', label: 'CMSM Secretariat (2025)' },
    { icon: '🎤', value: '2×', label: 'Invited Speaker (Emulate MPS Events)' },
    { icon: '📋', value: '5+', label: 'Institutions Spanning Academic & Federal Research' },
  ]

  const trust = [
    {
      icon: '🧬',
      title: 'NIH-NIAID Study Director Experience',
      detail: 'We have led antiviral in vitro studies at the highest NIH containment levels for Nipah, SARS, and Ebola. Our study designs are built for scientific rigor and safety compliance from day one.',
    },
    {
      icon: '🔬',
      title: 'mRNA Vaccine Platform Depth',
      detail: 'Our mRNA vaccine expertise spans construct design through delivery optimization, grounded in collaborative work with Sanofi Pasteur and CureVac on Yellow Fever and RSV programs — validated in Nature Biomedical Engineering.',
    },
    {
      icon: '🫀',
      title: 'Organ-on-Chip & Organoid Pioneer',
      detail: 'We established lung, liver, and brain organ-on-chip platforms as part of NIH\'s 3Rs initiative — giving our clients a roadmap that has already been built and validated in a federal research context.',
    },
    {
      icon: '🏛️',
      title: 'Program-Level Strategic View',
      detail: 'As a NIAID Program Officer overseeing a national Hepatitis research portfolio, we understand how funding priorities, portfolio gaps, and translational science strategy intersect — knowledge that makes our grant and advisory work unusually precise.',
    },
    {
      icon: '🌐',
      title: 'International Scientific Leadership',
      detail: 'Our representation at the US-Japan Cooperative Medical Sciences Program (2025) and co-organization of the NIAID HCV Consortium Meeting (Oxford, 2024) reflects the kind of global scientific network we bring to every engagement.',
    },
    {
      icon: '📝',
      title: 'Publication-Quality Scientific Communication',
      detail: 'First and co-author in Nature Biomedical Engineering, Biomaterials, and Nucleic Acids Research — our scientific writing is held to the highest publication standards, not just regulatory adequacy.',
    },
  ]

  const pubs = [
    {
      journal: 'Nature Biomedical Engineering (2019)',
      why: 'Our first-hand experience with in vivo mRNA delivery visualization directly informs LNP formulation strategy and delivery route advisory for our clients.',
      text: 'Lindsay KE, Bhosle SM et al. Visualization of mRNA delivery to muscle via a PET imaging reporter.',
    },
    {
      journal: 'Biomaterials (2018)',
      why: 'Our in vitro–to–in vivo translation expertise underpins every study design and model selection recommendation we make.',
      text: 'Bhosle SM, Loomis KH et al. Bridging the gap between in vitro and in vivo muscle IVT mRNA expression.',
    },
    {
      journal: 'Nucleic Acids Research (2017)',
      why: 'Single-cell resolution understanding of mRNA trafficking informs our mRNA construct optimization and formulation advisory at the molecular level.',
      text: 'Kirschman JL, Bhosle S et al. Single-cell mRNA transfection studies: delivery, kinetics, and biology.',
    },
  ]

  return (
    <section className="credentials" id="credentials">
      <div className="container">
        <span className="section-label">Why Trust Us</span>
        <h2 className="section-title">Scientific Authority, Institutionally Proven</h2>
        <p className="section-subtitle">
          Every deliverable BioViro Sciences produces is backed by direct institutional
          experience — not interpreted from literature, but lived inside the programs that
          generate it.
        </p>

        <div className="credentials-grid">
          {stats.map((s) => (
            <div className="cred-card" key={s.value}>
              <div className="cred-icon">{s.icon}</div>
              <div className="cred-value">{s.value}</div>
              <div className="cred-label">{s.label}</div>
            </div>
          ))}
        </div>

        <span className="section-label" style={{ marginBottom: 16, display: 'block' }}>
          What Our Scientific Foundation Means for Your Project
        </span>
        <div className="awards-grid">
          {trust.map((t) => (
            <div className="award-item award-item--trust" key={t.title}>
              <span className="award-icon">{t.icon}</span>
              <div className="award-body">
                <div className="award-name">{t.title}</div>
                <div className="award-detail">{t.detail}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="publications-section">
          <span className="section-label" style={{ marginBottom: 4, display: 'block' }}>
            Peer-Reviewed Science Behind Our Services
          </span>
          <p className="section-subtitle" style={{ marginBottom: 24, fontSize: '0.9rem' }}>
            Our publications are not a résumé item — they are proof of the scientific depth
            that every consulting engagement draws from.
          </p>
          <div className="pub-list">
            {pubs.map((p) => (
              <div className="pub-item" key={p.journal}>
                <div style={{ flex: 1 }}>
                  <span className="pub-journal">{p.journal}</span>
                  <span className="pub-why">→ Why this matters: {p.why}</span>
                  <div style={{ marginTop: 4, color: 'rgba(0,0,0,0.55)', fontSize: '0.82rem' }}>{p.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
