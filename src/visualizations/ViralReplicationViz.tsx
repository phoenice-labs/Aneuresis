import { useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'

const W = 760
const H = 320
const M = { top: 30, right: 150, bottom: 50, left: 65 }
const IW = W - M.left - M.right
const IH = H - M.top - M.bottom

interface CurvePoint { t: number; v: number }
interface CurveConfig {
  name: string
  color: string
  peakTiter: number
  finalTiter: number
  peakTime: number
  pctReduction: string
  clinicalMeaning: string
}

const CURVE_CONFIGS: CurveConfig[] = [
  {
    name: 'Control (no drug)', color: '#ef4444', peakTiter: 7.5, finalTiter: 7.2, peakTime: 36,
    pctReduction: '0%',
    clinicalMeaning: 'Unconstrained viral replication. Peak titer 7.5 log₁₀ TCID₅₀/mL at 36 hpi represents maximum viral load. Reference baseline for all efficacy calculations.',
  },
  {
    name: 'Low Dose (1×IC50)', color: '#f97316', peakTiter: 6.0, finalTiter: 5.8, peakTime: 40,
    pctReduction: '~62%',
    clinicalMeaning: '1×IC50 achieves ~50% enzyme/target inhibition in vitro. In vivo, significantly higher doses needed due to protein binding and tissue distribution effects.',
  },
  {
    name: 'Mid Dose (5×IC50)', color: '#f59e0b', peakTiter: 4.2, finalTiter: 3.5, peakTime: 48,
    pctReduction: '~95%',
    clinicalMeaning: '5×IC50 approaches EC90 range for most antivirals. Significant viral suppression with delayed peak and accelerated clearance — models therapeutic window.',
  },
  {
    name: 'High Dose (10×IC50)', color: '#10b981', peakTiter: 2.8, finalTiter: 2.2, peakTime: 36,
    pctReduction: '>99%',
    clinicalMeaning: '10×IC50 near-complete suppression. Viral replication kept near inoculum titer — models complete therapeutic control or prophylactic efficacy.',
  },
]

const TIMES = [0, 6, 12, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72]

function ctrlV(t: number, moiOff: number): number {
  const base = 2 + moiOff
  const v = base + 5.5 / (1 + Math.exp(-0.2 * (t - 30)))
  return Math.min(7.5 + moiOff, v - (t > 40 ? (t - 40) * 0.006 : 0))
}

function makeCurveData(cfg: CurveConfig, isControl: boolean, drugTime: number, moiOff: number): CurvePoint[] {
  if (isControl) return TIMES.map(t => ({ t, v: ctrlV(t, moiOff) }))

  function treatedTarget(t: number): number {
    const base = 2 + moiOff * 0.4
    const peak = cfg.peakTiter + moiOff * 0.25
    const v = base + (peak - base) / (1 + Math.exp(-0.14 * (t - cfg.peakTime)))
    const decline = t > cfg.peakTime ? (t - cfg.peakTime) * (peak - cfg.finalTiter) / (72 - cfg.peakTime) * 0.9 : 0
    return Math.max(2 + moiOff * 0.3, v - decline)
  }

  return TIMES.map(t => {
    if (t <= drugTime) return { t, v: ctrlV(t, moiOff) }
    const blend = Math.min(1, (t - drugTime) / 18)
    return { t, v: ctrlV(t, moiOff) * (1 - blend) + treatedTarget(t) * blend }
  })
}

export default function ViralReplicationViz() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [drugTime, setDrugTime] = useState(0)
  const [moi, setMoi] = useState(0.01)
  const [hoveredCurve, setHoveredCurve] = useState<CurveConfig | null>(null)

  useEffect(() => {
    if (!svgRef.current) return
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const moiOff = Math.max(0, Math.log10(moi / 0.001) * 0.3)
    const allCurveData = CURVE_CONFIGS.map((cfg, i) => ({
      cfg,
      points: makeCurveData(cfg, i === 0, drugTime, moiOff),
    }))

    const g = svg.append('g').attr('transform', `translate(${M.left},${M.top})`)

    const xScale = d3.scaleLinear().domain([0, 72]).range([0, IW])
    const yScale = d3.scaleLinear().domain([0, 8]).range([IH, 0])

    // Horizontal grid lines
    for (let y = 0; y <= 8; y += 1) {
      g.append('line')
        .attr('x1', 0).attr('x2', IW)
        .attr('y1', yScale(y)).attr('y2', yScale(y))
        .attr('stroke', 'rgba(255,255,255,0.05)').attr('stroke-width', 1)
    }

    // Axes
    const xAxis = d3.axisBottom<number>(xScale)
      .tickValues([0, 12, 24, 36, 48, 60, 72])
      .tickFormat(d => `${d}`)
    const yAxis = d3.axisLeft<number>(yScale)
      .ticks(8)
      .tickFormat(d => `${d}`)

    const xAxisG = g.append('g').attr('transform', `translate(0,${IH})`).call(xAxis)
    xAxisG.selectAll<SVGTextElement, unknown>('text').style('fill', 'rgba(255,255,255,0.6)').style('font-size', '11px')
    xAxisG.selectAll<SVGLineElement, unknown>('line, path').style('stroke', 'rgba(255,255,255,0.3)')

    const yAxisG = g.append('g').call(yAxis)
    yAxisG.selectAll<SVGTextElement, unknown>('text').style('fill', 'rgba(255,255,255,0.6)').style('font-size', '11px')
    yAxisG.selectAll<SVGLineElement, unknown>('line, path').style('stroke', 'rgba(255,255,255,0.3)')

    // Axis labels
    g.append('text').attr('x', IW / 2).attr('y', IH + 40)
      .attr('text-anchor', 'middle')
      .style('fill', 'rgba(255,255,255,0.6)').style('font-size', '12px')
      .text('Hours Post Infection (hpi)')

    g.append('text').attr('transform', 'rotate(-90)').attr('x', -IH / 2).attr('y', -52)
      .attr('text-anchor', 'middle')
      .style('fill', 'rgba(255,255,255,0.6)').style('font-size', '12px')
      .text('Viral Titer (log₁₀ TCID₅₀/mL)')

    // IC50 threshold reference line
    g.append('line')
      .attr('x1', 0).attr('x2', IW)
      .attr('y1', yScale(4.5)).attr('y2', yScale(4.5))
      .attr('stroke', 'rgba(255,255,255,0.35)').attr('stroke-dasharray', '5,4').attr('stroke-width', 1)
    g.append('text').attr('x', IW + 4).attr('y', yScale(4.5) + 4)
      .style('fill', 'rgba(255,255,255,0.45)').style('font-size', '10px').text('IC₅₀ Threshold')

    // Drug addition vertical marker
    if (drugTime > 0) {
      g.append('line')
        .attr('x1', xScale(drugTime)).attr('x2', xScale(drugTime))
        .attr('y1', 0).attr('y2', IH)
        .attr('stroke', '#14b8a6').attr('stroke-dasharray', '6,3').attr('stroke-width', 1.5)
      g.append('text').attr('x', xScale(drugTime) + 4).attr('y', 14)
        .style('fill', '#14b8a6').style('font-size', '10px')
        .text(`Drug added: ${drugTime}h`)
    }

    // Line generator
    const lineGen = d3.line<CurvePoint>()
      .x(d => xScale(d.t))
      .y(d => yScale(d.v))
      .curve(d3.curveCatmullRom)

    // Track all path elements for cross-highlight
    const pathElements: SVGPathElement[] = []

    // Draw curves
    allCurveData.forEach(({ cfg, points }, i) => {
      const path = g.append('path')
        .datum(points)
        .attr('fill', 'none')
        .attr('stroke', cfg.color)
        .attr('stroke-width', 2)
        .attr('d', lineGen)
        .style('cursor', 'pointer')

      const pathEl = path.node()
      if (pathEl) pathElements.push(pathEl)

      const totalLength = (path.node() as SVGPathElement).getTotalLength()
      path
        .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
        .attr('stroke-dashoffset', totalLength)
        .transition().delay(i * 200).duration(1200)
        .attr('stroke-dashoffset', 0)

      path
        .on('mouseover', function () {
          pathElements.forEach(el => d3.select(el).attr('stroke-width', 1.5).attr('opacity', 0.35))
          d3.select(this).attr('stroke-width', 3.5).attr('opacity', 1)
          setHoveredCurve(cfg)
        })
        .on('mouseout', function () {
          pathElements.forEach(el => d3.select(el).attr('stroke-width', 2).attr('opacity', 1))
          setHoveredCurve(null)
        })
    })

    // Legend
    CURVE_CONFIGS.forEach((cfg, i) => {
      const ly = 10 + i * 22
      g.append('rect').attr('x', IW + 10).attr('y', ly).attr('width', 14).attr('height', 3)
        .attr('fill', cfg.color).attr('rx', 1)
      g.append('text').attr('x', IW + 28).attr('y', ly + 5)
        .style('fill', 'rgba(255,255,255,0.75)').style('font-size', '10px').text(cfg.name)
    })

    // Crosshair hover overlay
    const hoverLine = g.append('line')
      .attr('y1', 0).attr('y2', IH)
      .attr('stroke', 'rgba(255,255,255,0.25)').attr('stroke-width', 1)
      .style('display', 'none')

    g.append('rect').attr('width', IW).attr('height', IH).attr('fill', 'transparent')
      .on('mousemove', function (event: MouseEvent) {
        const [mx] = d3.pointer(event)
        const xVal = xScale.invert(mx)
        const closest = TIMES.reduce((a, b) => Math.abs(b - xVal) < Math.abs(a - xVal) ? b : a)
        hoverLine.style('display', null).attr('x1', xScale(closest)).attr('x2', xScale(closest))
      })
      .on('mouseleave', () => hoverLine.style('display', 'none'))
  }, [drugTime, moi])

  const moiSliderVal = Math.round(
    (Math.log10(moi) - Math.log10(0.001)) / (Math.log10(1) - Math.log10(0.001)) * 100
  )

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', color: 'white' }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
      />

      {/* Controls */}
      <div style={{ display: 'flex', gap: 24, padding: '12px 16px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>
            Time of Drug Addition (hpi):{' '}
            <span style={{ color: '#14b8a6', fontWeight: 700 }}>{drugTime}h</span>
          </div>
          <input
            type="range" min={0} max={24} value={drugTime}
            onChange={e => setDrugTime(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#0d9488' }}
          />
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>
            Multiplicity of Infection (MOI):{' '}
            <span style={{ color: '#14b8a6', fontWeight: 700 }}>{moi.toFixed(3)}</span>
          </div>
          <input
            type="range" min={0} max={100} value={moiSliderVal}
            onChange={e =>
              setMoi(Math.pow(10, Math.log10(0.001) + (Number(e.target.value) / 100) * (Math.log10(1) - Math.log10(0.001))))
            }
            style={{ width: '100%', accentColor: '#0d9488' }}
          />
        </div>
      </div>

      {/* Info panel */}
      {hoveredCurve ? (
        <div style={{
          marginTop: 8,
          background: `linear-gradient(135deg, ${hoveredCurve.color}15, rgba(15,32,68,0.6))`,
          border: `1px solid ${hoveredCurve.color}50`,
          borderRadius: 10,
          padding: '16px 20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: hoveredCurve.color }} />
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{hoveredCurve.name}</span>
            <span style={{ marginLeft: 'auto', color: hoveredCurve.color, fontWeight: 700, fontSize: '0.85rem' }}>
              Peak: {hoveredCurve.peakTiter.toFixed(1)} log₁₀ &nbsp;·&nbsp; Reduction vs Control: {hoveredCurve.pctReduction}
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, margin: 0 }}>
            {hoveredCurve.clinicalMeaning}
          </p>
        </div>
      ) : (
        <div style={{ marginTop: 8, textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', padding: '8px' }}>
          ↑ Hover a curve to see dose-response details · Adjust sliders to simulate treatment parameters
        </div>
      )}
    </div>
  )
}
