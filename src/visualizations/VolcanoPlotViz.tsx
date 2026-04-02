import { useState, useEffect, useRef, useMemo } from 'react'
import * as d3 from 'd3'

const W = 760
const H = 380
const M = { top: 30, right: 40, bottom: 55, left: 65 }
const IW = W - M.left - M.right
const IH = H - M.top - M.bottom

type Pathway = 'IFN Signaling' | 'Antiviral Response' | 'Apoptosis' | 'Viral Entry' | 'Other'
type Regulation = 'up' | 'down' | 'ns'

interface Gene {
  id: string
  name: string
  log2FC: number
  negLog10P: number
  pathway: Pathway
  regulated: Regulation
}

const NAMED_GENES: Omit<Gene, 'id' | 'regulated'>[] = [
  { name: 'IFNB1',   log2FC: 4.8,  negLog10P: 12.3, pathway: 'IFN Signaling' },
  { name: 'MX1',     log2FC: 3.9,  negLog10P: 11.1, pathway: 'IFN Signaling' },
  { name: 'OAS1',    log2FC: 3.4,  negLog10P: 10.5, pathway: 'Antiviral Response' },
  { name: 'IFIT1',   log2FC: 4.2,  negLog10P: 9.8,  pathway: 'Antiviral Response' },
  { name: 'ISG15',   log2FC: 3.1,  negLog10P: 9.2,  pathway: 'IFN Signaling' },
  { name: 'ACE2',    log2FC: 2.8,  negLog10P: 8.4,  pathway: 'Viral Entry' },
  { name: 'TMPRSS2', log2FC: 2.1,  negLog10P: 7.6,  pathway: 'Viral Entry' },
  { name: 'BCL2',    log2FC: -2.9, negLog10P: 8.9,  pathway: 'Apoptosis' },
  { name: 'CASP3',   log2FC: -3.4, negLog10P: 9.5,  pathway: 'Apoptosis' },
  { name: 'NPC1',    log2FC: 1.8,  negLog10P: 6.2,  pathway: 'Viral Entry' },
  { name: 'EPHB2',   log2FC: 1.5,  negLog10P: 5.8,  pathway: 'Viral Entry' },
]

const PATHWAY_COLORS: Record<Pathway, string> = {
  'IFN Signaling':      '#22d3ee',
  'Antiviral Response': '#10b981',
  'Apoptosis':          '#f59e0b',
  'Viral Entry':        '#a78bfa',
  'Other':              '#64748b',
}

function classifyReg(log2FC: number, negLog10P: number): Regulation {
  if (log2FC > 1 && negLog10P > 1.3) return 'up'
  if (log2FC < -1 && negLog10P > 1.3) return 'down'
  return 'ns'
}

function generateGenes(): Gene[] {
  const genes: Gene[] = NAMED_GENES.map((g, i) => ({
    ...g, id: `named_${i}`, regulated: classifyReg(g.log2FC, g.negLog10P),
  }))

  const pathways: Pathway[] = ['IFN Signaling', 'Antiviral Response', 'Apoptosis', 'Viral Entry', 'Other']
  const n = 189

  for (let i = 0; i < n; i++) {
    const seed1 = Math.sin(i * 127.1 + 311.7) * 43758.5453
    const seed2 = Math.sin(i * 269.5 + 183.3) * 43758.5453
    const seed3 = Math.sin(i * 419.2 + 571.1) * 43758.5453
    const r1 = seed1 - Math.floor(seed1)
    const r2 = seed2 - Math.floor(seed2)
    const r3 = seed3 - Math.floor(seed3)

    const u1 = Math.max(1e-10, r1)
    const u2 = r2
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
    const log2FC = Math.max(-5.5, Math.min(5.5, z * 1.8))

    const pBase = r3 * 4.0
    const pBoost = Math.abs(log2FC) > 2 ? Math.abs(log2FC) * 1.2 : 0
    const negLog10P = Math.max(0, Math.min(13, pBase + pBoost))

    const pathway = pathways[Math.floor(r3 * 5)]
    genes.push({
      id: `gen_${i}`,
      name: `Gene_${i + 1}`,
      log2FC,
      negLog10P,
      pathway,
      regulated: classifyReg(log2FC, negLog10P),
    })
  }
  return genes
}

const ALL_GENES = generateGenes()

type PathwayFilter = 'All' | Pathway

const PATHWAY_OPTIONS: PathwayFilter[] = ['All', 'IFN Signaling', 'Antiviral Response', 'Apoptosis', 'Viral Entry']

export default function VolcanoPlotViz() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [pathwayFilter, setPathwayFilter] = useState<PathwayFilter>('All')
  const [hoveredGene, setHoveredGene] = useState<Gene | null>(null)

  const counts = useMemo(() => ({
    up: ALL_GENES.filter(g => g.regulated === 'up').length,
    down: ALL_GENES.filter(g => g.regulated === 'down').length,
    ns: ALL_GENES.filter(g => g.regulated === 'ns').length,
  }), [])

  useEffect(() => {
    if (!svgRef.current) return
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const g = svg.append('g').attr('transform', `translate(${M.left},${M.top})`)

    const xScale = d3.scaleLinear().domain([-6, 6]).range([0, IW])
    const yScale = d3.scaleLinear().domain([0, 15]).range([IH, 0])

    // Grid lines
    ;[-4, -2, 0, 2, 4].forEach(xv => {
      g.append('line')
        .attr('x1', xScale(xv)).attr('x2', xScale(xv))
        .attr('y1', 0).attr('y2', IH)
        .attr('stroke', 'rgba(255,255,255,0.04)').attr('stroke-width', 1)
    })
    ;[0, 3, 6, 9, 12].forEach(yv => {
      g.append('line')
        .attr('x1', 0).attr('x2', IW)
        .attr('y1', yScale(yv)).attr('y2', yScale(yv))
        .attr('stroke', 'rgba(255,255,255,0.04)').attr('stroke-width', 1)
    })

    // Significance threshold lines
    g.append('line')
      .attr('x1', 0).attr('x2', IW)
      .attr('y1', yScale(1.3)).attr('y2', yScale(1.3))
      .attr('stroke', 'rgba(255,255,255,0.4)').attr('stroke-dasharray', '5,4').attr('stroke-width', 1)
    g.append('text').attr('x', 4).attr('y', yScale(1.3) - 4)
      .style('fill', 'rgba(255,255,255,0.45)').style('font-size', '10px').text('padj = 0.05')

    g.append('line')
      .attr('x1', xScale(-1)).attr('x2', xScale(-1))
      .attr('y1', 0).attr('y2', IH)
      .attr('stroke', 'rgba(255,255,255,0.35)').attr('stroke-dasharray', '5,4').attr('stroke-width', 1)
    g.append('line')
      .attr('x1', xScale(1)).attr('x2', xScale(1))
      .attr('y1', 0).attr('y2', IH)
      .attr('stroke', 'rgba(255,255,255,0.35)').attr('stroke-dasharray', '5,4').attr('stroke-width', 1)

    // Axes
    const xAxis = d3.axisBottom<number>(xScale).ticks(12)
    const yAxis = d3.axisLeft<number>(yScale).ticks(8)

    const xAxisG = g.append('g').attr('transform', `translate(0,${IH})`).call(xAxis)
    xAxisG.selectAll<SVGTextElement, unknown>('text').style('fill', 'rgba(255,255,255,0.6)').style('font-size', '10px')
    xAxisG.selectAll<SVGLineElement, unknown>('line').style('stroke', 'rgba(255,255,255,0.3)')
    xAxisG.selectAll<SVGPathElement, unknown>('path').style('stroke', 'rgba(255,255,255,0.3)')

    const yAxisG = g.append('g').call(yAxis)
    yAxisG.selectAll<SVGTextElement, unknown>('text').style('fill', 'rgba(255,255,255,0.6)').style('font-size', '10px')
    yAxisG.selectAll<SVGLineElement, unknown>('line').style('stroke', 'rgba(255,255,255,0.3)')
    yAxisG.selectAll<SVGPathElement, unknown>('path').style('stroke', 'rgba(255,255,255,0.3)')

    g.append('text').attr('x', IW / 2).attr('y', IH + 44).attr('text-anchor', 'middle')
      .style('fill', 'rgba(255,255,255,0.6)').style('font-size', '12px').text('log₂(Fold Change)')
    g.append('text').attr('transform', 'rotate(-90)').attr('x', -IH / 2).attr('y', -52)
      .attr('text-anchor', 'middle').style('fill', 'rgba(255,255,255,0.6)').style('font-size', '12px').text('-log₁₀(adj. p-value)')

    // Dots
    const dotG = g.append('g')

    function getDotColor(gene: Gene): string {
      if (gene.regulated === 'up') return '#ef4444'
      if (gene.regulated === 'down') return '#3b82f6'
      return 'rgba(255,255,255,0.2)'
    }

    const dots = dotG.selectAll<SVGCircleElement, Gene>('circle')
      .data(ALL_GENES).join('circle')
      .attr('cx', d => xScale(d.log2FC))
      .attr('cy', d => yScale(d.negLog10P))
      .attr('r', 4)
      .attr('fill', d => getDotColor(d))
      .attr('opacity', 0)
      .attr('stroke', 'none')
      .style('cursor', 'pointer')

    // Animate in
    dots.transition()
      .delay((_d, i) => i * 3)
      .duration(400)
      .attr('opacity', d => d.regulated === 'ns' ? 0.25 : 0.8)

    // Apply pathway filter
    function applyFilter(filter: PathwayFilter) {
      if (filter === 'All') {
        dots.transition().duration(300)
          .attr('opacity', d => d.regulated === 'ns' ? 0.25 : 0.8)
          .attr('stroke', 'none')
          .attr('stroke-width', 0)
      } else {
        dots.transition().duration(300)
          .attr('opacity', d => d.pathway === filter ? 0.9 : 0.1)
          .attr('stroke', d => d.pathway === filter ? PATHWAY_COLORS[d.pathway as Pathway] : 'none')
          .attr('stroke-width', d => d.pathway === filter ? 2 : 0)
      }
    }

    applyFilter(pathwayFilter)

    // Hover interactions
    dots
      .on('mouseover', (_event, d) => { setHoveredGene(d) })
      .on('mouseout', () => { setHoveredGene(null) })

    // Named gene labels
    const namedSet = new Set(NAMED_GENES.map(g => g.name))
    const labeled = ALL_GENES.filter(g => namedSet.has(g.name))

    labeled.forEach(gene => {
      const cx = xScale(gene.log2FC)
      const cy = yScale(gene.negLog10P)
      const dx = gene.log2FC > 0 ? 8 : -8
      const anchor = gene.log2FC > 0 ? 'start' : 'end'
      g.append('line')
        .attr('x1', cx).attr('y1', cy)
        .attr('x2', cx + dx * 0.7).attr('y2', cy - 10)
        .attr('stroke', PATHWAY_COLORS[gene.pathway])
        .attr('stroke-width', 0.8).attr('opacity', 0.7)
      g.append('text')
        .attr('x', cx + dx).attr('y', cy - 10)
        .attr('text-anchor', anchor)
        .style('fill', PATHWAY_COLORS[gene.pathway])
        .style('font-size', '9px').style('font-weight', '700')
        .text(gene.name)
    })
  }, [pathwayFilter])

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', color: 'white' }}>
      {/* Pathway filter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 0 10px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>Highlight Pathway:</span>
        {PATHWAY_OPTIONS.map(opt => (
          <button
            key={opt}
            onClick={() => setPathwayFilter(opt)}
            style={{
              padding: '4px 12px', borderRadius: 5,
              border: `1px solid ${pathwayFilter === opt ? (opt === 'All' ? '#0d9488' : PATHWAY_COLORS[opt as Pathway]) : 'rgba(255,255,255,0.2)'}`,
              background: pathwayFilter === opt ? (opt === 'All' ? '#0d948820' : PATHWAY_COLORS[opt as Pathway] + '20') : 'transparent',
              color: pathwayFilter === opt ? (opt === 'All' ? '#14b8a6' : PATHWAY_COLORS[opt as Pathway]) : 'rgba(255,255,255,0.6)',
              fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
            }}
          >
            {opt}
          </button>
        ))}
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

      {/* Count badges */}
      <div style={{ display: 'flex', gap: 16, padding: '10px 4px', justifyContent: 'center' }}>
        <span style={{ fontSize: '0.82rem', color: '#ef4444', fontWeight: 700 }}>▲ {counts.up} Upregulated</span>
        <span style={{ fontSize: '0.82rem', color: '#3b82f6', fontWeight: 700 }}>▼ {counts.down} Downregulated</span>
        <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>— {counts.ns} Not Significant</span>
      </div>

      {/* Info panel */}
      {hoveredGene ? (
        <div style={{
          marginTop: 4,
          background: `${PATHWAY_COLORS[hoveredGene.pathway]}18`,
          border: `1px solid ${PATHWAY_COLORS[hoveredGene.pathway]}50`,
          borderRadius: 10, padding: '14px 18px',
          display: 'flex', gap: 24, flexWrap: 'wrap',
        }}>
          <div>
            <span style={{ fontSize: '0.65rem', color: PATHWAY_COLORS[hoveredGene.pathway], fontWeight: 700, letterSpacing: '0.12em' }}>GENE</span>
            <div style={{ fontWeight: 700, fontSize: '1rem', marginTop: 3 }}>{hoveredGene.name}</div>
          </div>
          <div>
            <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>log₂FC</span>
            <div style={{
              fontWeight: 700,
              color: hoveredGene.regulated === 'up' ? '#ef4444' : hoveredGene.regulated === 'down' ? '#3b82f6' : 'rgba(255,255,255,0.5)',
              fontSize: '0.95rem', marginTop: 3,
            }}>
              {hoveredGene.log2FC.toFixed(2)}
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>-log₁₀(p)</span>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', marginTop: 3 }}>{hoveredGene.negLog10P.toFixed(2)}</div>
          </div>
          <div>
            <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>PATHWAY</span>
            <div style={{ fontWeight: 600, fontSize: '0.88rem', color: PATHWAY_COLORS[hoveredGene.pathway], marginTop: 3 }}>{hoveredGene.pathway}</div>
          </div>
          <div>
            <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>REGULATION</span>
            <div style={{
              fontWeight: 700, fontSize: '0.88rem', marginTop: 3,
              color: hoveredGene.regulated === 'up' ? '#ef4444' : hoveredGene.regulated === 'down' ? '#3b82f6' : 'rgba(255,255,255,0.4)',
            }}>
              {hoveredGene.regulated === 'up' ? '▲ Upregulated' : hoveredGene.regulated === 'down' ? '▼ Downregulated' : '— Not Significant'}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ marginTop: 4, textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', padding: '8px' }}>
          ↑ Hover any point to inspect gene · Select pathway to highlight functional clusters
        </div>
      )}
    </div>
  )
}
