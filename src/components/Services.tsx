import { useState, lazy, Suspense } from 'react'
import { SERVICE_SAMPLES } from '../data/serviceSamples'

const SampleModal = lazy(() => import('./SampleModal'))

interface Service {
  num: string; icon: string; bg: string; name: string
  desc: string; tags: string[]
}

const SERVICES: Service[] = [
  {
    num: '01', icon: '🧬', bg: '#0d948822',
    name: 'mRNA Vaccine Design & LNP Formulation Strategy',
    desc: 'Expert advisory on mRNA construct design, codon optimization strategy, 5\'/3\' UTR selection, cap analog choice, and poly-A tail engineering. LNP formulation selection — ionizable lipid species, N/P ratio, PEGylation density — and delivery route advisory. In vitro expression platform selection for candidate validation. Grounded in direct Yellow Fever mRNA vaccine development with Sanofi Pasteur, CureVac, and InCell Art.',
    tags: ['mRNA Construct Design', 'LNP Formulation', 'Codon Optimization', 'Delivery Advisory'],
  },
  {
    num: '02', icon: '🦠', bg: '#f59e0b22',
    name: 'Antiviral Study Design & In Vitro Model Selection',
    desc: 'Design of antiviral drug efficacy and mechanism studies for high-risk pathogens. Selection of appropriate cell-based assay formats: plaque assay, duplex RT-qPCR, ELISA, bioplex multiplex cytokine profiling, IFA/IHC. BSL requirement mapping, throughput optimization, and complete study protocol writing. Grounded in NIH-NIAID Study Director role leading studies for Nipah, SARS-CoV, and Ebola virus inhibitor programs.',
    tags: ['Antiviral Efficacy', 'Plaque Assay Design', 'RT-qPCR', 'Study Protocols'],
  },
  {
    num: '03', icon: '🫀', bg: '#3b82f622',
    name: 'Organ-on-Chip & Organoid Platform Advisory',
    desc: 'Platform selection and study design advisory for Lung-on-chip, Liver-on-chip, Brain organoid, and co-culture systems. NAMs implementation roadmap — from platform evaluation through assay integration and data interpretation. Vendor comparison (Emulate, CN Bio, custom microfluidic). Grounded in leading NIH\'s 3Rs initiative establishing these platforms for antiviral drug development at federal scale.',
    tags: ['Organ-on-Chip', 'Organoids', 'NAMs Roadmap', 'Platform Selection'],
  },
  {
    num: '04', icon: '🔄', bg: '#8b5cf622',
    name: '3Rs / NAMs Compliance Strategy',
    desc: 'Strategic advisory for replacing animal models with NAMs for regulatory submissions. Writing 3Rs justification documents, alternative model validation strategies, and regulatory acceptance frameworks. Assessment of current animal model requirements and identification of validated NAM replacements. Grounded in leading NIH\'s formal 3Rs initiative and establishing organ-on-chip as an accepted alternative across federal antiviral programs.',
    tags: ['3Rs Strategy', 'NAMs Compliance', 'Regulatory Justification', 'Model Validation'],
  },
  {
    num: '05', icon: '📝', bg: '#10b98122',
    name: 'Scientific & Regulatory Technical Writing',
    desc: 'Peer-reviewed manuscript preparation, SOPs, study protocols, NIH grant sections, program summaries, and regulatory briefing documents — authored to journal and NIH standards. First and co-author in Nature Biomedical Engineering, Biomaterials, and Nucleic Acids Research. Includes literature synthesis, data narrative construction, multi-draft quality control, and final publication-ready deliverables across infectious disease and vaccine domains.',
    tags: ['Manuscript Writing', 'SOPs', 'NIH Grants', 'Regulatory Briefs'],
  },
  {
    num: '06', icon: '🏛️', bg: '#ef444422',
    name: 'NIH Grant Writing & Portfolio Strategy',
    desc: 'NIH R01/R21 specific aims and research strategy section drafting, reviewer perspective advisory, and portfolio positioning for infectious disease and virology programs. Grounded in direct NIAID Program Officer experience reviewing and scoring grants — we know what reviewers look for because we have been the reviewers. Includes portfolio gap analysis, programmatic alignment advisory, and PA/RFA identification.',
    tags: ['R01/R21 Writing', 'Specific Aims', 'Reviewer Perspective', 'Portfolio Strategy'],
  },
  {
    num: '07', icon: '📊', bg: '#14b8a622',
    name: 'Pre-existing Research Data Analysis',
    desc: 'Remote analysis and interpretation of RNA-Seq datasets, qPCR array data, bioplex multiplex cytokine data, IFA/IHC image quantification, and flow cytometry data. Transformation of raw experimental results into publication-ready summaries, pathway enrichment narratives, and biological interpretation reports. Grounded in multi-institution data experience across NIH-NIAID, GATECH, and Emory virology and vaccine programs.',
    tags: ['RNA-Seq Analysis', 'qPCR Arrays', 'Bioplex Data', 'IFA/IHC Interpretation'],
  },
  {
    num: '08', icon: '🌐', bg: '#6366f122',
    name: 'Infectious Disease Research Program Advisory',
    desc: 'Translational science strategy for hepatitis (B/C/D), respiratory viruses (RSV, influenza, SARS-CoV-2), and emerging pathogens. Public-private partnership advisory, NIH funding landscape analysis, global health equity framing, and US-Japan CMSM program alignment. Grounded in NIAID Program Officer portfolio management overseeing national Hepatitis translational science programs and 2025 US-Japan CMSM Secretariat service.',
    tags: ['Program Strategy', 'Hepatitis Portfolio', 'Translational Science', 'Global Health'],
  },
]

export default function Services() {
  const [openSample, setOpenSample] = useState<string | null>(null)
  const activeSample = SERVICE_SAMPLES.find(s => s.serviceNum === openSample) ?? null

  return (
    <section className="services" id="services">
      <div className="container">
        <span className="section-label">What We Offer</span>
        <h2 className="section-title">Our Services</h2>
        <p className="section-subtitle">
          Eight specialized consulting services in infectious disease research, mRNA vaccine strategy,
          advanced cell models, and scientific communication — all delivered as expert advisory
          and documentation work, home-deliverable and fully independent.
        </p>

        <div className="services-grid">
          {SERVICES.map((s) => (
            <div className="service-card" key={s.num}>
              <div className="service-icon" style={{ background: s.bg }}>
                {s.icon}
              </div>
              <div className="service-num">{s.num}</div>
              <h3 className="service-name">{s.name}</h3>
              <p className="service-desc">{s.desc}</p>
              <div className="service-tags">
                {s.tags.map((t) => (
                  <span className="service-tag" key={t}>{t}</span>
                ))}
              </div>
              <button
                className="service-sample-btn"
                onClick={() => setOpenSample(s.num)}
                aria-label={`View sample output for ${s.name}`}
              >
                📄 View Sample Output
              </button>
            </div>
          ))}
        </div>
      </div>

      {activeSample && (
        <Suspense fallback={null}>
          <SampleModal sample={activeSample} onClose={() => setOpenSample(null)} />
        </Suspense>
      )}
    </section>
  )
}
