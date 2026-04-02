import { useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'

const W = 760
const H = 440

type NodeType = 'pathogen' | 'host' | 'intervention'

interface NodeDatum extends d3.SimulationNodeDatum {
  id: string
  type: NodeType
  label: string
  sublabel: string
  color: string
  r: number
  detail: string
}

interface LinkDatum extends d3.SimulationLinkDatum<NodeDatum> {
  source: string | NodeDatum
  target: string | NodeDatum
  weight: number
  linkType: 'infection' | 'treatment' | 'platform'
}

const NODES: NodeDatum[] = [
  { id: 'niv',   type: 'pathogen',     label: 'Nipah Virus',    sublabel: 'BSL-4',        color: '#ef4444', r: 22, detail: 'Nipah virus (NiV) — emerging paramyxovirus with 40–75% case fatality rate. Fruit bat reservoir, human-to-human transmission documented. Priority BSL-4 pathogen for MCM development. BioViro Sciences advisory supports NiV minigenome assay design and organ-on-chip lung/brain infection models.' },
  { id: 'sars',  type: 'pathogen',     label: 'SARS-CoV-2',     sublabel: 'BSL-3',        color: '#f97316', r: 24, detail: 'SARS-CoV-2 — the COVID-19 causative agent. ACE2/TMPRSS2 entry, spike-mediated fusion. Extensive OoC modeling performed at BioViro Sciences partner institutions. Strong foundation for next-generation betacoronavirus preparedness research.' },
  { id: 'ebola', type: 'pathogen',     label: 'Ebola',          sublabel: 'BSL-4',        color: '#dc2626', r: 20, detail: 'Ebola virus (EBOV) — filovirus with up to 90% CFR. NPC1 endosomal receptor. Liver is primary target organ. iPSC-derived hepatocytes and liver-on-chip are validated surrogate models for BSL-4 EBOV research.' },
  { id: 'hcv',   type: 'pathogen',     label: 'HCV',            sublabel: 'BSL-2',        color: '#f59e0b', r: 20, detail: 'Hepatitis C Virus — major cause of chronic liver disease, cirrhosis, hepatocellular carcinoma. Functional cure possible with DAAs. Liver-on-chip and HepaRG cells are gold-standard in vitro models. Strong NIAID funding priority.' },
  { id: 'hbv',   type: 'pathogen',     label: 'HBV',            sublabel: 'BSL-2',        color: '#fbbf24', r: 18, detail: 'Hepatitis B Virus — cccDNA-driven chronic infection, 296M people affected globally. Functional cure remains elusive. Primary human hepatocytes and differentiated HepaRG are key in vitro models for cccDNA targeting studies.' },
  { id: 'hiv',   type: 'pathogen',     label: 'HIV',            sublabel: 'BSL-2+',       color: '#fb923c', r: 21, detail: 'HIV — 38M people living with HIV. Broadly neutralizing antibodies (bNAbs) and cure strategies are DAIDS funding priorities. iPSC-derived T cells and macrophages for reservoir reactivation studies.' },
  { id: 'lung',  type: 'host',         label: 'Lung Chip',      sublabel: 'Organ-on-Chip', color: '#3b82f6', r: 19, detail: 'Lung-on-chip — airway epithelium + endothelium under physiological shear stress. Key model for respiratory virus infection (NiV, SARS-CoV-2, influenza), antiviral efficacy testing, and inhaled drug delivery studies.' },
  { id: 'liver', type: 'host',         label: 'Liver Chip',     sublabel: 'Organoid',     color: '#06b6d4', r: 19, detail: 'Liver-on-chip / liver organoid — hepatocyte function, drug metabolism, viral lifecycle. Key for HCV/HBV cure research, Ebola surrogate models, antiviral PK/PD, and hepatotoxicity assessment.' },
  { id: 'brain', type: 'host',         label: 'Brain Organoid', sublabel: '3D Model',     color: '#8b5cf6', r: 18, detail: 'Brain organoid / BBB chip — neuroinvasion, viral encephalitis, BBB permeability. Critical for Nipah neurological disease modeling, CNS antiviral delivery, and neuro-immune interaction studies.' },
  { id: 'vero',  type: 'host',         label: 'Vero-E6',        sublabel: 'Cell Line',    color: '#64748b', r: 14, detail: 'Vero-E6 — gold-standard BSL-3 cell line for respiratory virus replication and antiviral IC50 determination. Used for SARS-CoV-2, NiV, and HIV passaging. Standard for in vitro antiviral screening.' },
  { id: 'ipsc',  type: 'host',         label: 'iPSC-derived',   sublabel: 'Primary-like', color: '#475569', r: 15, detail: 'iPSC-derived cells — disease-relevant primary-like models (hepatocytes, T cells, macrophages, neurons). Genetically definable, scalable, and compatible with personalized medicine approaches.' },
  { id: 'mrna',  type: 'intervention', label: 'mRNA Vaccine',   sublabel: 'MCM',          color: '#10b981', r: 21, detail: 'mRNA-LNP vaccine platform — rapid antigen design, scalable manufacturing, demonstrated efficacy for SARS-CoV-2. BioViro Sciences core expertise: LNP formulation, antigen optimization, immunogenicity assessment, and in vitro-to-NHP translation.' },
  { id: 'mab',   type: 'intervention', label: 'mAb Therapy',    sublabel: 'Biologic',     color: '#059669', r: 18, detail: 'Monoclonal antibody therapeutics — broadly neutralizing antibodies (bNAbs) for HIV, Ebola, HBV. BioViro Sciences supports mAb characterization, in vitro neutralization assay design, and mechanism-of-action studies.' },
  { id: 'smd',   type: 'intervention', label: 'Small Molecule', sublabel: 'Antiviral',    color: '#34d399', r: 17, detail: 'Small molecule antivirals — direct-acting antivirals (DAAs) for HCV/HBV, protease/polymerase inhibitors, entry inhibitors. BioViro Sciences provides IC50/EC50 assay design, ADMET prediction frameworks, and resistance profiling.' },
  { id: 'ooc',   type: 'intervention', label: 'OoC Platform',   sublabel: 'NAMs',         color: '#6ee7b7', r: 16, detail: 'Organ-on-Chip as intervention platform — replacing animal studies, enabling physiological drug testing, 3Rs compliance. BioViro Sciences advisory covers OoC platform selection, validation, and regulatory submission strategy.' },
]

const RAW_LINKS: { s: string; t: string; w: number; lt: 'infection' | 'treatment' | 'platform' }[] = [
  { s: 'niv',   t: 'lung',  w: 3, lt: 'infection' },
  { s: 'niv',   t: 'brain', w: 2, lt: 'infection' },
  { s: 'niv',   t: 'liver', w: 1, lt: 'infection' },
  { s: 'sars',  t: 'lung',  w: 3, lt: 'infection' },
  { s: 'sars',  t: 'vero',  w: 2, lt: 'infection' },
  { s: 'sars',  t: 'ipsc',  w: 1, lt: 'infection' },
  { s: 'ebola', t: 'liver', w: 3, lt: 'infection' },
  { s: 'ebola', t: 'ipsc',  w: 2, lt: 'infection' },
  { s: 'hcv',   t: 'liver', w: 3, lt: 'infection' },
  { s: 'hcv',   t: 'ipsc',  w: 2, lt: 'infection' },
  { s: 'hbv',   t: 'liver', w: 3, lt: 'infection' },
  { s: 'hiv',   t: 'ipsc',  w: 3, lt: 'infection' },
  { s: 'hiv',   t: 'vero',  w: 1, lt: 'infection' },
  { s: 'mrna',  t: 'niv',   w: 2, lt: 'treatment' },
  { s: 'mrna',  t: 'sars',  w: 3, lt: 'treatment' },
  { s: 'mrna',  t: 'hcv',   w: 1, lt: 'treatment' },
  { s: 'mrna',  t: 'hbv',   w: 2, lt: 'treatment' },
  { s: 'mab',   t: 'hiv',   w: 3, lt: 'treatment' },
  { s: 'mab',   t: 'hbv',   w: 2, lt: 'treatment' },
  { s: 'mab',   t: 'ebola', w: 1, lt: 'treatment' },
  { s: 'smd',   t: 'hcv',   w: 3, lt: 'treatment' },
  { s: 'smd',   t: 'hbv',   w: 2, lt: 'treatment' },
  { s: 'smd',   t: 'sars',  w: 2, lt: 'treatment' },
  { s: 'smd',   t: 'niv',   w: 1, lt: 'treatment' },
  { s: 'ooc',   t: 'lung',  w: 3, lt: 'platform' },
  { s: 'ooc',   t: 'liver', w: 3, lt: 'platform' },
  { s: 'ooc',   t: 'brain', w: 2, lt: 'platform' },
  { s: 'lung',  t: 'mrna',  w: 1, lt: 'platform' },
  { s: 'liver', t: 'mab',   w: 1, lt: 'platform' },
]

const LINKS: LinkDatum[] = RAW_LINKS.map(({ s, t, w, lt }) => ({ source: s, target: t, weight: w, linkType: lt }))

const TYPE_LABELS: NodeType[] = ['pathogen', 'host', 'intervention']
const TYPE_NAMES: Record<NodeType, string> = { pathogen: 'Pathogen', host: 'Host System', intervention: 'Intervention' }
const TYPE_SAMPLE_COLORS: Record<NodeType, string> = { pathogen: '#ef4444', host: '#3b82f6', intervention: '#10b981' }

export default function PathogenNetworkViz() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [selectedNode, setSelectedNode] = useState<NodeDatum | null>(null)
  const [advisoryMode, setAdvisoryMode] = useState(false)
  const simRef = useRef<d3.Simulation<NodeDatum, LinkDatum> | null>(null)
  const nodesRef = useRef<NodeDatum[]>([])
  const nodeGRef = useRef<d3.Selection<SVGGElement, NodeDatum, SVGGElement, unknown> | null>(null)
  const linkSelRef = useRef<d3.Selection<SVGLineElement, LinkDatum, SVGGElement, unknown> | null>(null)

  useEffect(() => {
    if (!svgRef.current) return
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const nodes: NodeDatum[] = NODES.map(n => ({
      ...n,
      x: W / 2 + (Math.random() - 0.5) * 80,
      y: H / 2 + (Math.random() - 0.5) * 80,
    }))
    nodesRef.current = nodes
    const links: LinkDatum[] = LINKS.map(l => ({ ...l }))

    // Defs — glow filters
    const defs = svg.append('defs')

    const glow = defs.append('filter').attr('id', 'pathGlow').attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%')
    glow.append('feGaussianBlur').attr('stdDeviation', '5').attr('result', 'blur')
    const feMerge = glow.append('feMerge')
    feMerge.append('feMergeNode').attr('in', 'blur')
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic')

    const tealGlow = defs.append('filter').attr('id', 'tealGlow').attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%')
    tealGlow.append('feGaussianBlur').attr('stdDeviation', '4').attr('result', 'blur')
    tealGlow.append('feFlood').attr('flood-color', '#0d9488').attr('flood-opacity', '0.6').attr('result', 'color')
    tealGlow.append('feComposite').attr('in', 'color').attr('in2', 'blur').attr('operator', 'in').attr('result', 'shadow')
    const feMerge2 = tealGlow.append('feMerge')
    feMerge2.append('feMergeNode').attr('in', 'shadow')
    feMerge2.append('feMergeNode').attr('in', 'SourceGraphic')

    const sim = d3.forceSimulation<NodeDatum>(nodes)
      .force('link', d3.forceLink<NodeDatum, LinkDatum>(links).id(d => d.id).distance(100).strength(d => d.weight * 0.15))
      .force('charge', d3.forceManyBody<NodeDatum>().strength(-250))
      .force('center', d3.forceCenter<NodeDatum>(W / 2, H / 2))
      .force('collide', d3.forceCollide<NodeDatum>(d => d.r + 8))
    simRef.current = sim

    const linkSel = svg.append('g').selectAll<SVGLineElement, LinkDatum>('line')
      .data(links).join('line')
      .attr('stroke', d => d.linkType === 'treatment' ? '#10b98150' : d.linkType === 'platform' ? '#06b6d450' : 'rgba(255,255,255,0.15)')
      .attr('stroke-width', d => d.weight * 0.9)
    linkSelRef.current = linkSel

    const nodeG = svg.append('g').selectAll<SVGGElement, NodeDatum>('g')
      .data(nodes).join('g')
      .style('cursor', 'pointer')
    nodeGRef.current = nodeG

    // Node circles
    nodeG.append('circle')
      .attr('r', d => d.r)
      .attr('fill', d => d.color + '30')
      .attr('stroke', d => d.color)
      .attr('stroke-width', 2)

    // BSL sublabel above node (pathogens only) — fixed: use datum callback directly
    nodeG.filter(d => d.type === 'pathogen').append('text')
      .attr('y', d => -d.r - 2)
      .attr('text-anchor', 'middle')
      .style('fill', 'rgba(255,100,100,0.8)')
      .style('font-size', '8px')
      .style('font-weight', '700')
      .style('pointer-events', 'none')
      .text(d => d.sublabel)

    // Main label below node
    nodeG.append('text')
      .attr('y', d => d.r + 13)
      .attr('text-anchor', 'middle')
      .style('fill', 'rgba(255,255,255,0.8)')
      .style('font-size', '10px')
      .style('font-weight', '600')
      .style('pointer-events', 'none')
      .text(d => d.label)

    // Sub label
    nodeG.append('text')
      .attr('y', d => d.r + 23)
      .attr('text-anchor', 'middle')
      .style('fill', 'rgba(255,255,255,0.4)')
      .style('font-size', '8px')
      .style('pointer-events', 'none')
      .text(d => d.sublabel)

    // Hover: highlight connected subgraph
    nodeG
      .on('mouseover', function(_event, d) {
        const connectedIds = new Set<string>()
        links.forEach(l => {
          const src = (l.source as NodeDatum).id
          const tgt = (l.target as NodeDatum).id
          if (src === d.id) connectedIds.add(tgt)
          if (tgt === d.id) connectedIds.add(src)
        })
        connectedIds.add(d.id)
        nodeG.attr('opacity', nd => connectedIds.has(nd.id) ? 1 : 0.15)
        linkSel.attr('opacity', lk => {
          const src = (lk.source as NodeDatum).id
          const tgt = (lk.target as NodeDatum).id
          return src === d.id || tgt === d.id ? 0.9 : 0.05
        })
        d3.select(this).select('circle').attr('filter', 'url(#pathGlow)')
      })
      .on('mouseout', function() {
        nodeG.attr('opacity', 1)
        linkSel.attr('opacity', 1)
        d3.select(this).select('circle').attr('filter', null)
      })
      .on('click', (_event, d) => setSelectedNode(d))

    // Drag behaviour
    const drag = d3.drag<SVGGElement, NodeDatum>()
      .on('start', (event, d) => {
        if (!event.active) sim.alphaTarget(0.3).restart()
        d.fx = d.x; d.fy = d.y
      })
      .on('drag', (event, d) => { d.fx = event.x; d.fy = event.y })
      .on('end', (event, d) => {
        if (!event.active) sim.alphaTarget(0)
        d.fx = null; d.fy = null
      })
    nodeG.call(drag)

    // Tick — update positions
    sim.on('tick', () => {
      linkSel
        .attr('x1', d => (d.source as NodeDatum).x ?? 0)
        .attr('y1', d => (d.source as NodeDatum).y ?? 0)
        .attr('x2', d => (d.target as NodeDatum).x ?? 0)
        .attr('y2', d => (d.target as NodeDatum).y ?? 0)
      nodeG.attr('transform', d => `translate(${d.x ?? 0},${d.y ?? 0})`)
    })

    // Legend
    const legend = svg.append('g').attr('transform', 'translate(12,12)')
    TYPE_LABELS.forEach((type, i) => {
      legend.append('circle')
        .attr('cx', 7).attr('cy', i * 18 + 7).attr('r', 7)
        .attr('fill', TYPE_SAMPLE_COLORS[type] + '30')
        .attr('stroke', TYPE_SAMPLE_COLORS[type]).attr('stroke-width', 1.5)
      legend.append('text')
        .attr('x', 18).attr('y', i * 18 + 11)
        .style('fill', 'rgba(255,255,255,0.65)').style('font-size', '10px')
        .text(TYPE_NAMES[type])
    })

    return () => { sim.stop() }
  }, [])

  // Advisory mode: highlight intervention edges and nodes
  useEffect(() => {
    const linkSel = linkSelRef.current
    const nodeG = nodeGRef.current
    if (!linkSel || !nodeG) return

    if (advisoryMode) {
      linkSel.transition().duration(400)
        .attr('stroke', (d: LinkDatum) =>
          d.linkType === 'treatment' || d.linkType === 'platform' ? '#0d9488' : 'rgba(255,255,255,0.05)'
        )
        .attr('stroke-width', (d: LinkDatum) =>
          d.linkType === 'treatment' || d.linkType === 'platform' ? d.weight * 2 : 0.5
        )
        .attr('filter', (d: LinkDatum) =>
          d.linkType === 'treatment' || d.linkType === 'platform' ? 'url(#tealGlow)' : null
        )

      nodeG.filter((d: NodeDatum) => d.type === 'intervention')
        .select('circle').transition().duration(400)
        .attr('stroke-width', 3)
        .attr('filter', 'url(#tealGlow)')
    } else {
      linkSel.transition().duration(400)
        .attr('stroke', (d: LinkDatum) =>
          d.linkType === 'treatment' ? '#10b98150' : d.linkType === 'platform' ? '#06b6d450' : 'rgba(255,255,255,0.15)'
        )
        .attr('stroke-width', (d: LinkDatum) => d.weight * 0.9)
        .attr('filter', null)

      nodeG.selectAll<SVGCircleElement, NodeDatum>('circle').transition().duration(400)
        .attr('stroke-width', 2)
        .attr('filter', null)
    }
  }, [advisoryMode])

  function handleRestart() {
    const sim = simRef.current
    const nodes = nodesRef.current
    if (!sim || !nodes) return
    nodes.forEach(n => {
      n.x = W / 2 + (Math.random() - 0.5) * 200
      n.y = H / 2 + (Math.random() - 0.5) * 200
      n.fx = null
      n.fy = null
    })
    sim.alpha(1).restart()
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', color: 'white' }}>
      <div style={{ display: 'flex', gap: 8, padding: '0 0 10px', flexWrap: 'wrap', alignItems: 'center' }}>
        <button
          onClick={() => setAdvisoryMode(m => !m)}
          style={{
            padding: '7px 16px', borderRadius: 6,
            border: `1px solid ${advisoryMode ? '#0d9488' : 'rgba(255,255,255,0.2)'}`,
            background: advisoryMode ? '#0d948825' : 'transparent',
            color: advisoryMode ? '#14b8a6' : 'rgba(255,255,255,0.6)',
            fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer',
          }}
        >
          {advisoryMode ? '✦ Advisory Focus: ON' : '✦ Show Advisory Focus'}
        </button>
        <button
          onClick={handleRestart}
          style={{
            padding: '7px 14px', borderRadius: 6,
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'transparent',
            color: 'rgba(255,255,255,0.6)',
            cursor: 'pointer', fontSize: '0.8rem',
          }}
        >
          ↺ Restart
        </button>
        {advisoryMode && (
          <span style={{ fontSize: '0.75rem', color: '#14b8a6', fontStyle: 'italic' }}>
            Highlighting intervention edges — where BioViro Sciences operates
          </span>
        )}
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        style={{
          width: '100%', height: 'auto', display: 'block',
          background: 'linear-gradient(135deg, #0a1628 0%, #112240 50%, #0d2b1a 100%)',
          borderRadius: 10,
        }}
      />

      {selectedNode ? (
        <div style={{
          marginTop: 12,
          background: `linear-gradient(135deg, ${selectedNode.color}15, rgba(15,32,68,0.6))`,
          border: `1px solid ${selectedNode.color}50`,
          borderRadius: 10, padding: '16px 20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: selectedNode.color }} />
            <span style={{ fontSize: '0.65rem', color: selectedNode.color, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              {TYPE_NAMES[selectedNode.type]}
            </span>
            <span style={{ fontWeight: 700, fontSize: '0.95rem', marginLeft: 4 }}>{selectedNode.label}</span>
            <span style={{
              fontSize: '0.78rem',
              background: selectedNode.color + '25',
              border: `1px solid ${selectedNode.color}40`,
              borderRadius: 4, padding: '2px 8px',
              color: selectedNode.color,
            }}>
              {selectedNode.sublabel}
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.65, margin: 0 }}>
            {selectedNode.detail}
          </p>
        </div>
      ) : (
        <div style={{ marginTop: 8, textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', padding: '8px' }}>
          ↑ Drag nodes · Hover to highlight connections · Click for details · Toggle Advisory Focus to see BioViro Sciences service intersections
        </div>
      )}
    </div>
  )
}
