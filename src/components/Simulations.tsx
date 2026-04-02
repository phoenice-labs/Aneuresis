import { useState, Suspense, lazy } from 'react'

const MrnaLnpViz           = lazy(() => import('../visualizations/MrnaLnpViz'))
const ViralReplicationViz  = lazy(() => import('../visualizations/ViralReplicationViz'))
const OrganChipViz         = lazy(() => import('../visualizations/OrganChipViz'))
const NamsImpactViz        = lazy(() => import('../visualizations/NamsImpactViz'))
const PublicationNetworkViz = lazy(() => import('../visualizations/PublicationNetworkViz'))
const NihFundingViz        = lazy(() => import('../visualizations/NihFundingViz'))
const VolcanoPlotViz       = lazy(() => import('../visualizations/VolcanoPlotViz'))
const PathogenNetworkViz   = lazy(() => import('../visualizations/PathogenNetworkViz'))

interface TabConfig {
  id: string
  label: string
  service: string
  title: string
  desc: string
}

const TABS: TabConfig[] = [
  {
    id: 'mrna',
    label: '🧬 mRNA-LNP',
    service: 'Service 01 — mRNA Vaccine Design & LNP Formulation Strategy',
    title: 'mRNA-LNP Transfection Pathway — Interactive Mechanism Simulator',
    desc: 'Explore the seven-step intracellular journey of a lipid nanoparticle from cell membrane binding to antigen expression. Each step is clickable — revealing the underlying biology and explaining how it directly informs LNP formulation choices, mRNA construct design, and delivery route optimization.',
  },
  {
    id: 'viral',
    label: '🦠 Viral Kinetics',
    service: 'Service 02 — Antiviral Study Design & In Vitro Model Selection',
    title: 'Viral Replication Kinetics Simulator — Multi-Dose Response Explorer',
    desc: 'Simulate how antiviral compounds suppress viral replication across dose levels and time points. Adjust drug concentration and time of addition to visualize the therapeutic window, IC50 response curves, and how our study design frameworks optimize these variables for in vitro model selection.',
  },
  {
    id: 'chip',
    label: '🫀 Organ-on-Chip',
    service: 'Service 03 — Organ-on-Chip & Organoid Platform Advisory',
    title: 'Organ-on-Chip Platform — Live Microfluidic Simulation',
    desc: 'Explore the three core organ chip platforms we design and implement — Lung, Liver, and Brain. Each shows the microfluidic architecture, cell layer organization, and fluid dynamics. Introduce virus to see infection propagation across the epithelial layer.',
  },
  {
    id: 'nams',
    label: '🔄 3Rs / NAMs',
    service: 'Service 04 — 3Rs / NAMs Compliance Strategy',
    title: '3Rs Impact Visualizer — Replace · Reduce · Refine',
    desc: 'Visualize the scientific and ethical impact of replacing traditional animal models with New Alternative Models (NAMs). Adjust the NAMs implementation level to see animal savings, data quality improvements, and 3Rs compliance across a research program.',
  },
  {
    id: 'network',
    label: '📝 Pub Network',
    service: 'Service 05 — Scientific & Regulatory Technical Writing',
    title: 'Scientific Knowledge Network — Publication Impact Graph',
    desc: 'An interactive force-directed map of our scientific publication portfolio — papers, research areas, techniques, and institutional collaborators. Hover any node to see connections. Click a paper node for citation details.',
  },
  {
    id: 'nih',
    label: '🏛️ NIH Landscape',
    service: 'Service 06 — NIH Grant Writing & Portfolio Strategy',
    title: 'NIH Funding Landscape — NIAID Research Priority Explorer',
    desc: 'Explore the NIAID infectious disease funding landscape as interactive bubbles sized by funding volume and annotated with success rates, PA numbers, and strategic positioning. Click any bubble to see our advisory recommendation.',
  },
  {
    id: 'volcano',
    label: '📊 RNA-Seq Volcano',
    service: 'Service 07 — Pre-existing Research Data Analysis',
    title: 'RNA-Seq Volcano Plot — Differential Expression Explorer',
    desc: 'An interactive differential expression volcano plot representing the kind of RNA-Seq data we analyze remotely. Hover genes for details, select a pathway to highlight IFN signaling, antiviral response, apoptosis, or viral entry gene clusters.',
  },
  {
    id: 'pathogen',
    label: '🌐 ID Network',
    service: 'Service 08 — Infectious Disease Research Program Advisory',
    title: 'Pathogen-Host-Intervention Network — Global ID Research Landscape',
    desc: 'A force-directed network mapping the infectious disease research landscape: BSL-2 to BSL-4 pathogens, host model systems, and intervention platforms. Drag nodes, hover for details, toggle Advisory Focus to see where BioViro Sciences works.',
  },
]

const VIZ_MAP = {
  mrna:     MrnaLnpViz,
  viral:    ViralReplicationViz,
  chip:     OrganChipViz,
  nams:     NamsImpactViz,
  network:  PublicationNetworkViz,
  nih:      NihFundingViz,
  volcano:  VolcanoPlotViz,
  pathogen: PathogenNetworkViz,
} as const

const VizFallback = () => (
  <div style={{
    width: '100%', height: 360, display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem',
  }}>
    Loading visualization...
  </div>
)

export default function Simulations() {
  const [activeTab, setActiveTab] = useState<keyof typeof VIZ_MAP>('mrna')
  const current = TABS.find(t => t.id === activeTab) ?? TABS[0]
  const Viz = VIZ_MAP[activeTab]

  return (
    <section className="simulations" id="simulations">
      <div className="container">
        <span className="section-label">Interactive Simulations</span>
        <h2 className="section-title">See Our Expertise in Action</h2>
        <p className="section-subtitle">
          Eight interactive visualizations — one for each BioViro Sciences service area.
          Explore the science, data, and platforms that define our advisory capabilities.
        </p>

        <div className="sim-tabs" style={{ flexWrap: 'wrap', gap: '6px' }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`sim-tab${activeTab === tab.id ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.id as keyof typeof VIZ_MAP)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="sim-panel">
          <div className="sim-panel-header">
            <div className="sim-service-tag">{current.service}</div>
            <div className="sim-panel-title">{current.title}</div>
            <div className="sim-panel-desc">{current.desc}</div>
          </div>
          <Suspense fallback={<VizFallback />}>
            <Viz />
          </Suspense>
        </div>
      </div>
    </section>
  )
}
