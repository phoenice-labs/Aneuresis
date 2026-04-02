import { useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'

const W = 760
const H = 400

interface BubbleData extends d3.SimulationNodeDatum {
  id: string
  label: string
  funding: number
  successRate: number
  pa: string
  division: string
  color: string
  detail: string
  r: number
}

const RAW_BUBBLES = [
  {
    id: 'hcv',
    label: 'Hepatitis C',
    funding: 180,
    successRate: 22,
    pa: 'PA-24-185',
    division: 'DAIT',
    color: '#ef4444',
    detail:
      'HCV cure strategies, DAA resistance, HCV-HIV coinfection, novel in vitro models. Key NIAID priority: eradication strategy development. Organ-on-chip liver models are specifically called out in recent program announcements.',
  },
  {
    id: 'hbv',
    label: 'Hepatitis B',
    funding: 145,
    successRate: 19,
    pa: 'PA-24-186',
    division: 'DAIT',
    color: '#f97316',
    detail:
      'HBV functional cure, cccDNA targeting, immune control, mAb MCMs. US-Japan CMSM priority area. BioViro Sciences advisory: pair with HCV for portfolio efficiency — overlapping liver chip models and antiviral endpoints.',
  },
  {
    id: 'hiv',
    label: 'HIV/AIDS',
    funding: 520,
    successRate: 24,
    pa: 'PA-23-178',
    division: 'DAIDS',
    color: '#dc2626',
    detail:
      'HIV cure strategies, broadly neutralizing antibodies, HIV-HBV coinfection. Largest NIAID portfolio ($520M+). BioViro Sciences strategy: target cure research with complementary in vitro models demonstrating latency reactivation.',
  },
  {
    id: 'mrna',
    label: 'mRNA Vaccines',
    funding: 290,
    successRate: 26,
    pa: 'PAR-24-099',
    division: 'DAIT',
    color: '#10b981',
    detail:
      'mRNA-LNP platform development, antigen design, novel adjuvant strategies, rapid response platforms. Highest success rate in our portfolio analysis. Strong fit for BioViro Sciences LNP formulation and mRNA design services.',
  },
  {
    id: 'resp',
    label: 'Respiratory Viruses',
    funding: 340,
    successRate: 21,
    pa: 'PA-23-290',
    division: 'DMID',
    color: '#3b82f6',
    detail:
      'SARS-CoV-2, influenza, RSV, Nipah. BSL3/4 pathogen research, organ-on-chip lung models explicitly emphasized. BioViro Sciences: our lung-on-chip advisory directly supports this funding priority.',
  },
  {
    id: 'epi',
    label: 'Emerging Pathogens',
    funding: 210,
    successRate: 18,
    pa: 'PA-24-012',
    division: 'DMID',
    color: '#8b5cf6',
    detail:
      'Ebola, Marburg, Nipah preparedness. High-containment in vitro models, MCM development priority. BSL-4 surrogate system design is a critical need — directly in BioViro Sciences expertise domain.',
  },
  {
    id: 'nam',
    label: 'NAMs / OoC',
    funding: 95,
    successRate: 28,
    pa: 'PAR-23-215',
    division: 'OD',
    color: '#06b6d4',
    detail:
      'New Alternative Models initiative. 3Rs compliance, organ-on-chip validation, reduced animal use. Highest success rate (28%) with lowest competition. Strategic recommendation: submit here first to establish NAMs credentials.',
  },
  {
    id: 'bio',
    label: 'Biodefense',
    funding: 265,
    successRate: 20,
    pa: 'BARDA-OPS',
    division: 'DMID',
    color: '#a855f6',
    detail:
      'BSL3/4 pathogen countermeasures, antiviral stockpile, rapid response platforms. BARDA co-funding opportunities — often paired with NIAID for dual-mechanism funding. Strong leverage opportunity for qualifying projects.',
  },
]

const BUBBLES: BubbleData[] = RAW_BUBBLES.map(b => ({
  ...b,
  r: Math.sqrt(b.funding) * 2.2,
}))

const DIVISIONS = ['DAIT', 'DAIDS', 'DMID', 'OD']
const DIV_COLORS: Record<string, string> = {
  DAIT: '#ef4444',
  DAIDS: '#3b82f6',
  DMID: '#8b5cf6',
  OD: '#06b6d4',
}

export default function NihFundingViz() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [selectedBubble, setSelectedBubble] = useState<BubbleData | null>(null)

  useEffect(() => {
    if (!svgRef.current) return
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const nodes: BubbleData[] = BUBBLES.map(b => ({
      ...b,
      x: W / 2 + (Math.random() - 0.5) * 100,
      y: H / 2 + (Math.random() - 0.5) * 100,
    }))

    const sim = d3
      .forceSimulation<BubbleData>(nodes)
      .force('charge', d3.forceManyBody<BubbleData>().strength(10))
      .force('center', d3.forceCenter<BubbleData>(W / 2, H / 2 - 10))
      .force('collide', d3.forceCollide<BubbleData>(d => d.r + 4).strength(0.85))
      .alphaDecay(0.025)

    // Arc generator for success-rate rings
    const arcGen = d3
      .arc<BubbleData>()
      .innerRadius(d => d.r + 3)
      .outerRadius(d => d.r + 6)
      .startAngle(0)
      .endAngle(d => (d.successRate / 30) * 2 * Math.PI)

    const bubbleG = svg
      .append('g')
      .selectAll<SVGGElement, BubbleData>('g')
      .data(nodes)
      .join('g')
      .style('cursor', 'pointer')

    // Main circle
    bubbleG
      .append('circle')
      .attr('r', d => d.r)
      .attr('fill', d => d.color + '4d')
      .attr('stroke', d => d.color)
      .attr('stroke-width', 1.5)
      .attr('opacity', 0)
      .transition()
      .delay((_, i) => i * 120)
      .duration(800)
      .attr('opacity', 1)

    // Success-rate arc
    bubbleG
      .append('path')
      .attr('d', d => arcGen(d) ?? '')
      .attr('fill', d => d.color)
      .attr('opacity', 0.7)

    // Primary label
    bubbleG
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('y', -8)
      .style('fill', 'white')
      .style('font-size', '11px')
      .style('font-weight', '700')
      .style('pointer-events', 'none')
      .text(d => d.label)

    // Funding sub-label
    bubbleG
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('y', 6)
      .style('fill', 'rgba(255,255,255,0.65)')
      .style('font-size', '9px')
      .style('pointer-events', 'none')
      .text(d => `$${d.funding}M`)

    // Success rate label
    bubbleG
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('y', 18)
      .style('fill', 'rgba(255,255,255,0.5)')
      .style('font-size', '8px')
      .style('pointer-events', 'none')
      .text(d => `${d.successRate}% success`)

    bubbleG
      .on('mouseover', function (_event, d) {
        d3.select(this)
          .select('circle')
          .transition()
          .duration(200)
          .attr('fill', d.color + '80')
          .attr('r', d.r + 3)
      })
      .on('mouseout', function (_event, d) {
        d3.select(this)
          .select('circle')
          .transition()
          .duration(200)
          .attr('fill', d.color + '4d')
          .attr('r', d.r)
      })
      .on('click', (_event, d) => setSelectedBubble(d))

    sim.on('tick', () => {
      bubbleG.attr('transform', d => `translate(${d.x ?? W / 2},${d.y ?? H / 2})`)
    })

    // Division legend
    const lg = svg.append('g').attr('transform', `translate(12,${H - 70})`)
    lg.append('text')
      .attr('y', 0)
      .style('fill', 'rgba(255,255,255,0.5)')
      .style('font-size', '9px')
      .style('font-weight', '700')
      .text('NIAID DIVISION')
    DIVISIONS.forEach((div, i) => {
      lg.append('rect')
        .attr('x', 0)
        .attr('y', i * 14 + 8)
        .attr('width', 8)
        .attr('height', 8)
        .attr('rx', 2)
        .attr('fill', DIV_COLORS[div])
      lg.append('text')
        .attr('x', 12)
        .attr('y', i * 14 + 16)
        .style('fill', 'rgba(255,255,255,0.65)')
        .style('font-size', '9px')
        .text(div)
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
      {selectedBubble ? (
        <div
          style={{
            marginTop: 12,
            background: `linear-gradient(135deg, ${selectedBubble.color}18, rgba(15,32,68,0.6))`,
            border: `1px solid ${selectedBubble.color}60`,
            borderRadius: 10,
            padding: '16px 20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 12,
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: selectedBubble.color,
              }}
            />
            <span style={{ fontWeight: 700, fontSize: '1rem' }}>{selectedBubble.label}</span>
            <span
              style={{
                background: selectedBubble.color + '30',
                border: `1px solid ${selectedBubble.color}60`,
                borderRadius: 4,
                padding: '2px 8px',
                fontSize: '0.75rem',
                color: selectedBubble.color,
                fontWeight: 700,
              }}
            >
              {selectedBubble.pa}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
              Division: <span style={{ color: 'white' }}>{selectedBubble.division}</span>
            </span>
            <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
              Portfolio:{' '}
              <span style={{ color: '#f59e0b', fontWeight: 700 }}>${selectedBubble.funding}M</span>
            </span>
            <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
              Success Rate:{' '}
              <span style={{ color: '#10b981', fontWeight: 700 }}>
                {selectedBubble.successRate}%
              </span>
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
            {selectedBubble.detail}
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
          ↑ Click any bubble to see funding detail, PA number, and BioViro Sciences strategic
          recommendation
        </div>
      )}
    </div>
  )
}
