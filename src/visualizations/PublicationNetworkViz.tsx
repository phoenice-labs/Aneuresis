import { useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'

const W = 760
const H = 420

interface NodeDatum extends d3.SimulationNodeDatum {
  id: string
  type: 'paper' | 'area' | 'technique' | 'collab'
  label: string
  detail: string
  r: number
  color: string
}

interface LinkDatum extends d3.SimulationLinkDatum<NodeDatum> {
  source: string | NodeDatum
  target: string | NodeDatum
}

const NODES: NodeDatum[] = [
  { id: 'p1', type: 'paper', label: 'Nature Biomed Eng 2019', detail: 'mRNA-LNP delivery visualization via PET-CT imaging. First in vivo demonstration of organ-level mRNA biodistribution in NHP models. Published in collaboration with Sanofi and GATECH.', r: 22, color: '#f59e0b' },
  { id: 'p2', type: 'paper', label: 'Biomaterials 2018', detail: 'In vitro to in vivo mRNA expression correlation in muscle tissue. Established hydrogel 2D/3D model validation framework used across four institutional collaborators.', r: 20, color: '#f59e0b' },
  { id: 'p3', type: 'paper', label: 'Nucleic Acids Res 2017', detail: 'Single-cell mRNA trafficking analysis using multiplexed IHC and RNA-Seq. Characterized the endosomal escape bottleneck quantitatively for the first time.', r: 18, color: '#f59e0b' },
  { id: 'ra1', type: 'area', label: 'mRNA Vaccines', detail: 'Core research area spanning platform development, antigen design, codon optimization, and immunogenicity assessment for mRNA-based vaccine candidates.', r: 16, color: '#0d9488' },
  { id: 'ra2', type: 'area', label: 'LNP Delivery', detail: 'Lipid nanoparticle formulation science — ionizable lipid design, PEG-lipid optimization, endosomal escape mechanisms, and organ targeting strategies.', r: 14, color: '#0d9488' },
  { id: 'ra3', type: 'area', label: 'Infectious Disease', detail: 'BSL-2 to BSL-4 pathogen research including NiV, SARS-CoV-2, HCV/HBV, and Ebola. In vitro model selection, antiviral assay design, and MCM development.', r: 15, color: '#0d9488' },
  { id: 'ra4', type: 'area', label: 'Organoids/OoC', detail: 'Organ-on-chip and organoid platform research — design, validation, and application to antiviral drug testing and toxicology studies.', r: 14, color: '#0d9488' },
  { id: 'ra5', type: 'area', label: 'Antiviral Science', detail: 'Antiviral compound screening, dose-response characterization, mechanism-of-action studies, and in vitro to clinical translation frameworks.', r: 13, color: '#0d9488' },
  { id: 't1', type: 'technique', label: 'PET-CT Imaging', detail: 'Positron emission tomography combined with CT for whole-body mRNA-LNP biodistribution studies in non-human primates.', r: 10, color: '#3b82f6' },
  { id: 't2', type: 'technique', label: 'RNA-Seq', detail: 'Bulk and single-cell transcriptomics for gene expression profiling, pathway analysis, and viral response characterization.', r: 10, color: '#3b82f6' },
  { id: 't3', type: 'technique', label: 'qPCR Array', detail: 'High-throughput quantitative PCR arrays for simultaneous profiling of 96–384 target genes in antiviral and vaccine studies.', r: 10, color: '#3b82f6' },
  { id: 't4', type: 'technique', label: 'Flow Cytometry', detail: 'Multi-parameter flow cytometry for immune cell phenotyping, intracellular cytokine staining, and apoptosis assays.', r: 9, color: '#3b82f6' },
  { id: 't5', type: 'technique', label: 'Hydrogel 2D/3D', detail: 'Custom hydrogel scaffolds for 2D culture and 3D organoid formation — key for physiologically relevant LNP transfection models.', r: 9, color: '#3b82f6' },
  { id: 't6', type: 'technique', label: 'Single-Cell IHC', detail: 'Single-cell immunohistochemistry for spatial protein expression mapping in tissue sections and organoid models.', r: 9, color: '#3b82f6' },
  { id: 't7', type: 'technique', label: 'Bioplex Multiplex', detail: 'Luminex-based multiplex cytokine/chemokine profiling — simultaneous measurement of 30–50 analytes from single samples.', r: 9, color: '#3b82f6' },
  { id: 't8', type: 'technique', label: 'Minigenome System', detail: 'BSL-2 surrogate viral replication system (minigenome assay) for studying BSL-3/4 pathogen biology under safe containment conditions.', r: 9, color: '#3b82f6' },
  { id: 'c1', type: 'collab', label: 'Sanofi Pasteur', detail: 'Strategic vaccine development partner. Joint research on mRNA-LNP platform optimization for prophylactic vaccine applications.', r: 11, color: '#8b5cf6' },
  { id: 'c2', type: 'collab', label: 'CureVac', detail: 'mRNA therapeutics collaborator. Joint publications on in vitro to in vivo expression correlation for non-replicating mRNA platforms.', r: 10, color: '#8b5cf6' },
  { id: 'c3', type: 'collab', label: 'NIH-NIAID', detail: 'Federal research partner. Collaborative studies on infectious disease models, antiviral MCM development, and 3Rs/NAMs implementation.', r: 12, color: '#8b5cf6' },
  { id: 'c4', type: 'collab', label: 'GATECH', detail: 'Georgia Institute of Technology — primary academic research hub. Nanomaterials, bioengineering, and organ-on-chip platform development.', r: 11, color: '#8b5cf6' },
  { id: 'c5', type: 'collab', label: 'Emory University', detail: 'Emory School of Medicine collaborator. Infectious disease clinical translation, NHP studies, and BSL-3 research infrastructure.', r: 10, color: '#8b5cf6' },
]

const LINK_PAIRS: [string, string][] = [
  ['p1', 'ra1'], ['p1', 'ra2'], ['p1', 't1'], ['p1', 'c4'],
  ['p2', 'ra1'], ['p2', 'ra2'], ['p2', 't5'], ['p2', 'c4'], ['p2', 'c1'], ['p2', 'c2'],
  ['p3', 'ra1'], ['p3', 't2'], ['p3', 'c4'],
  ['ra1', 'c1'], ['ra1', 'c2'], ['ra1', 'c3'],
  ['ra3', 'c3'], ['ra4', 'c3'], ['ra5', 'c3'],
  ['ra3', 't7'], ['ra3', 't8'], ['ra4', 't3'], ['ra4', 't4'],
  ['t6', 'ra4'], ['t6', 'ra5'],
]

const LINKS: LinkDatum[] = LINK_PAIRS.map(([s, t]) => ({ source: s, target: t }))

const TYPE_LABELS = ['paper', 'area', 'technique', 'collab'] as const
const TYPE_NAMES: Record<string, string> = {
  paper: 'Publication',
  area: 'Research Area',
  technique: 'Technique',
  collab: 'Institution',
}

export default function PublicationNetworkViz() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [selectedNode, setSelectedNode] = useState<NodeDatum | null>(null)

  useEffect(() => {
    if (!svgRef.current) return
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const nodes: NodeDatum[] = NODES.map(n => ({ ...n }))
    const links: LinkDatum[] = LINKS.map(l => ({ ...l }))

    // Glow filter for hovered nodes
    const defs = svg.append('defs')
    const filter = defs
      .append('filter')
      .attr('id', 'pubGlow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%')
    filter.append('feGaussianBlur').attr('stdDeviation', '4').attr('result', 'blur')
    const feMerge = filter.append('feMerge')
    feMerge.append('feMergeNode').attr('in', 'blur')
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic')

    const sim = d3
      .forceSimulation<NodeDatum>(nodes)
      .force(
        'link',
        d3
          .forceLink<NodeDatum, LinkDatum>(links)
          .id(d => d.id)
          .distance(90)
          .strength(0.6),
      )
      .force('charge', d3.forceManyBody<NodeDatum>().strength(-180))
      .force('center', d3.forceCenter<NodeDatum>(W / 2, H / 2))
      .force('collide', d3.forceCollide<NodeDatum>(d => d.r + 5))

    // Start all nodes near center for explosion animation
    nodes.forEach(n => {
      n.x = W / 2 + (Math.random() - 0.5) * 60
      n.y = H / 2 + (Math.random() - 0.5) * 60
    })

    const linkSel = svg
      .append('g')
      .selectAll<SVGLineElement, LinkDatum>('line')
      .data(links)
      .join('line')
      .attr('stroke', 'rgba(255,255,255,0.18)')
      .attr('stroke-width', 1.2)

    const nodeG = svg
      .append('g')
      .selectAll<SVGGElement, NodeDatum>('g')
      .data(nodes)
      .join('g')
      .style('cursor', 'pointer')

    nodeG
      .append('circle')
      .attr('r', d => d.r)
      .attr('fill', d => d.color + '30')
      .attr('stroke', d => d.color)
      .attr('stroke-width', 2)

    nodeG
      .append('text')
      .attr('y', d => d.r + 12)
      .attr('text-anchor', 'middle')
      .style('fill', 'rgba(255,255,255,0.75)')
      .style('font-size', '9px')
      .style('pointer-events', 'none')
      .text(d => d.label)

    nodeG
      .on('mouseover', function (_event, d) {
        const connectedIds = new Set<string>()
        links.forEach(l => {
          const src = (l.source as NodeDatum).id
          const tgt = (l.target as NodeDatum).id
          if (src === d.id) connectedIds.add(tgt)
          if (tgt === d.id) connectedIds.add(src)
        })
        connectedIds.add(d.id)
        nodeG.attr('opacity', nd => (connectedIds.has(nd.id) ? 1 : 0.2))
        linkSel.attr('opacity', lk => {
          const src = (lk.source as NodeDatum).id
          const tgt = (lk.target as NodeDatum).id
          return src === d.id || tgt === d.id ? 0.9 : 0.08
        })
        d3.select(this).select('circle').attr('filter', 'url(#pubGlow)')
      })
      .on('mouseout', function () {
        nodeG.attr('opacity', 1)
        linkSel.attr('opacity', 1)
        d3.select(this).select('circle').attr('filter', null)
      })
      .on('click', (_event, d) => setSelectedNode(d))

    const drag = d3
      .drag<SVGGElement, NodeDatum>()
      .on('start', (event, d) => {
        if (!event.active) sim.alphaTarget(0.3).restart()
        d.fx = d.x
        d.fy = d.y
      })
      .on('drag', (event, d) => {
        d.fx = event.x
        d.fy = event.y
      })
      .on('end', (event, d) => {
        if (!event.active) sim.alphaTarget(0)
        d.fx = null
        d.fy = null
      })

    nodeG.call(drag)

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
      const node = NODES.find(n => n.type === type)!
      legend
        .append('circle')
        .attr('cx', 7)
        .attr('cy', i * 18 + 7)
        .attr('r', 6)
        .attr('fill', node.color + '30')
        .attr('stroke', node.color)
        .attr('stroke-width', 1.5)
      legend
        .append('text')
        .attr('x', 18)
        .attr('y', i * 18 + 11)
        .style('fill', 'rgba(255,255,255,0.65)')
        .style('font-size', '10px')
        .text(TYPE_NAMES[type])
    })

    return () => {
      sim.stop()
    }
  }, [])

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', color: 'white' }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          background: 'linear-gradient(135deg, #0a1628 0%, #112240 50%, #0d2b1a 100%)',
          borderRadius: 10,
        }}
      />
      {selectedNode ? (
        <div
          style={{
            marginTop: 12,
            background: `linear-gradient(135deg, ${selectedNode.color}15, rgba(15,32,68,0.6))`,
            border: `1px solid ${selectedNode.color}50`,
            borderRadius: 10,
            padding: '16px 20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div
              style={{ width: 10, height: 10, borderRadius: '50%', background: selectedNode.color }}
            />
            <span
              style={{
                fontSize: '0.65rem',
                color: selectedNode.color,
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              {TYPE_NAMES[selectedNode.type]}
            </span>
            <span style={{ fontWeight: 700, fontSize: '0.95rem', marginLeft: 4 }}>
              {selectedNode.label}
            </span>
          </div>
          <p
            style={{
              fontSize: '0.85rem',
              color: 'rgba(255,255,255,0.75)',
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            {selectedNode.detail}
          </p>
        </div>
      ) : (
        <div
          style={{
            marginTop: 8,
            textAlign: 'center',
            color: 'rgba(255,255,255,0.3)',
            fontSize: '0.8rem',
            padding: '8px',
          }}
        >
          ↑ Drag nodes to explore · Hover to highlight connections · Click for details
        </div>
      )}
    </div>
  )
}
