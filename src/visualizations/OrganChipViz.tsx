import { useState, useEffect, useRef } from 'react'

// ─── Layout constants ────────────────────────────────────────────────────────
const W = 760
const H = 330

const CHIP_X = 40
const CHIP_Y = 20
const CHIP_W = W - 80       // 680

const TOP_CH_H = 65
const CELL_LAYER_H = 38
const MEMBRANE_H = 14
const BOT_CELL_H = 38
const BOT_CH_H = 65
const CHIP_H = TOP_CH_H + CELL_LAYER_H + MEMBRANE_H + BOT_CELL_H + BOT_CH_H  // 220

// Derived Y positions (all absolute within SVG)
const TOP_CELL_Y = CHIP_Y + TOP_CH_H                             // 85
const MEMB_Y     = TOP_CELL_Y + CELL_LAYER_H                     // 123
const BOT_CELL_Y = MEMB_Y + MEMBRANE_H                           // 137
const BOT_CH_Y   = BOT_CELL_Y + BOT_CELL_H                       // 175

const CELL_COUNT = 22
const CELL_W = CHIP_W / CELL_COUNT

// ─── Types ───────────────────────────────────────────────────────────────────
type OrganTab = 'LUNG' | 'LIVER' | 'BRAIN'

interface OrganConfig {
  topCellColor: string
  botCellColor: string
  topCellLabel: string
  botCellLabel: string
  topParticleColor: string
  botParticleColor: string
  topChannelLabel: string
  botChannelLabel: string
  specialLabel: string
  bsl: string
  throughput: string
  keyQuestion: string
  cellTypes: string
}

// ─── Organ configurations ────────────────────────────────────────────────────
const ORGAN_CONFIGS: Record<OrganTab, OrganConfig> = {
  LUNG: {
    topCellColor: '#93c5fd', botCellColor: '#5eead4',
    topCellLabel: 'Airway Epithelial (Ciliated)', botCellLabel: 'Lung Endothelial',
    topParticleColor: 'rgba(255,255,255,0.55)', botParticleColor: 'rgba(94,234,212,0.5)',
    topChannelLabel: 'AIR / MEDIA CHANNEL →', botChannelLabel: '← VASCULAR CHANNEL',
    specialLabel: 'BLOOD-AIR BARRIER', bsl: 'BSL-2/3',
    throughput: '8–16 chips/experiment',
    keyQuestion: 'Viral aerosol infection, mucociliary clearance, antiviral barrier function — critical for SARS-CoV-2, Nipah, and influenza models.',
    cellTypes: 'NCI-H441, NHBE, Calu-3 (epithelial) · HULEC-5A, HMVEC-L (endothelial)',
  },
  LIVER: {
    topCellColor: '#fcd34d', botCellColor: '#86efac',
    topCellLabel: 'Hepatocytes (Polygonal)', botCellLabel: 'Liver Sinusoidal Endothelial',
    topParticleColor: 'rgba(252,211,77,0.5)', botParticleColor: 'rgba(134,239,172,0.5)',
    topChannelLabel: 'BILE CANALICULI FLOW →', botChannelLabel: '← SINUSOIDAL FLOW',
    specialLabel: 'HEPATIC BARRIER', bsl: 'BSL-2',
    throughput: '12–24 chips/experiment',
    keyQuestion: 'HCV/HBV life cycle, drug metabolism, hepatotoxicity, liver-targeted LNP delivery — key for antiviral PK/PD studies.',
    cellTypes: 'HepaRG, PHH, HepG2 (hepatocytes) · LSEC primary / ScienCell (endothelial)',
  },
  BRAIN: {
    topCellColor: '#c4b5fd', botCellColor: '#a5f3fc',
    topCellLabel: 'Astrocytes (Stellate)', botCellLabel: 'Brain Microvascular Endothelial',
    topParticleColor: 'rgba(196,181,253,0.45)', botParticleColor: 'rgba(165,243,252,0.45)',
    topChannelLabel: 'CSF / PARENCHYMA →', botChannelLabel: '← BLOOD VESSEL CHANNEL',
    specialLabel: 'BLOOD-BRAIN BARRIER', bsl: 'BSL-2/3',
    throughput: '6–12 chips/experiment',
    keyQuestion: 'Nipah neuroinvasion, viral encephalitis, BBB permeability, CNS-targeted drug delivery across the blood-brain barrier.',
    cellTypes: 'iPSC-astrocytes, hNPC (parenchyma) · hCMEC/D3, BMEC (endothelial)',
  },
}

// ─── Deterministic particle definitions ──────────────────────────────────────
const PARTICLES = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  dur: 3 + (i % 3) * 0.8,
  delay: -(i * 0.4),
  r: (3 + (i % 3)) / 2,
  // y-offsets: spread within a 65px channel (leave 8px margin top/bottom)
  yOff: 8 + (i % 5) * 10,
}))

const VIRUS_COUNT = 6
const VIRUS_DEFS = Array.from({ length: VIRUS_COUNT }, (_, i) => ({
  id: i,
  dur: 2 + i * 0.35,
  delay: -(i * 0.55),
  yOff: 10 + (i % 4) * 13,
}))

// ─── Component ───────────────────────────────────────────────────────────────
interface InfectionState {
  cells: boolean[]
  active: boolean
}

export default function OrganChipViz() {
  const [activeTab, setActiveTab] = useState<OrganTab>('LUNG')
  const [infection, setInfection] = useState<InfectionState>({ cells: Array(CELL_COUNT).fill(false), active: false })
  const [selectedLayer, setSelectedLayer] = useState<'top' | 'bot' | null>(null)
  const animRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const cfg = ORGAN_CONFIGS[activeTab]
  const allInfected = infection.cells.every(Boolean)

  // Progressive infection animation
  useEffect(() => {
    if (!infection.active) return
    let idx = 0
    function infect() {
      if (idx >= CELL_COUNT) return
      setInfection(prev => {
        const cells = [...prev.cells]
        cells[idx] = true
        return { ...prev, cells }
      })
      idx++
      animRef.current = setTimeout(infect, 270)
    }
    animRef.current = setTimeout(infect, 300)
    return () => { if (animRef.current) clearTimeout(animRef.current) }
  }, [infection.active])

  function reset() {
    if (animRef.current) clearTimeout(animRef.current)
    setInfection({ cells: Array(CELL_COUNT).fill(false), active: false })
  }

  function handleTabChange(tab: OrganTab) {
    reset()
    setActiveTab(tab)
    setSelectedLayer(null)
  }

  function toggleLayer(layer: 'top' | 'bot') {
    setSelectedLayer(s => s === layer ? null : layer)
  }

  const layerInfo = selectedLayer === 'top'
    ? { label: cfg.topCellLabel, color: cfg.topCellColor }
    : selectedLayer === 'bot'
    ? { label: cfg.botCellLabel, color: cfg.botCellColor }
    : null

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', color: 'white' }}>

      {/* ── Tab & action buttons ── */}
      <div style={{ display: 'flex', gap: 8, padding: '0 0 12px', flexWrap: 'wrap' }}>
        {(['LUNG', 'LIVER', 'BRAIN'] as OrganTab[]).map(tab => (
          <button key={tab} onClick={() => handleTabChange(tab)} style={{
            padding: '7px 20px', borderRadius: 6,
            border: `1px solid ${activeTab === tab ? '#0d9488' : 'rgba(255,255,255,0.2)'}`,
            background: activeTab === tab ? '#0d9488' : 'transparent',
            color: 'white', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', letterSpacing: '0.08em',
          }}>
            {tab}
          </button>
        ))}

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button
            onClick={() => setInfection(prev => ({ ...prev, active: !prev.active }))}
            disabled={infection.active && allInfected}
            style={{
              padding: '7px 16px', borderRadius: 6, border: '1px solid #ef4444',
              background: infection.active ? '#ef444420' : 'transparent',
              color: '#ef4444', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer',
            }}
          >
            {infection.active ? '🦠 Infecting...' : '🦠 Introduce Virus'}
          </button>
          <button onClick={reset} style={{
            padding: '7px 12px', borderRadius: 6,
            border: '1px solid rgba(255,255,255,0.2)', background: 'transparent',
            color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '0.8rem',
          }}>
            Reset
          </button>
        </div>
      </div>

      {/* ── SVG chip cross-section ── */}
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
        <defs>
          <clipPath id="chipClip">
            <rect x={CHIP_X} y={CHIP_Y} width={CHIP_W} height={CHIP_H} rx={10} />
          </clipPath>
        </defs>

        {/* Chip body */}
        <rect x={CHIP_X} y={CHIP_Y} width={CHIP_W} height={CHIP_H}
          rx={10} fill="#0d1f35" stroke="#1e3a5f" strokeWidth={2} />

        {/* ── Top channel ── */}
        <rect x={CHIP_X} y={CHIP_Y} width={CHIP_W} height={TOP_CH_H}
          fill="#07111f" clipPath="url(#chipClip)" />
        <text x={CHIP_X + 14} y={CHIP_Y + TOP_CH_H / 2 + 5}
          fill="rgba(255,255,255,0.3)" fontSize={10} fontWeight={700} letterSpacing={1}>
          {cfg.topChannelLabel}
        </text>

        {/* Top channel flow particles */}
        <g clipPath="url(#chipClip)">
          {PARTICLES.map(p => (
            <circle key={`tp-${p.id}`} cy={CHIP_Y + p.yOff} r={p.r} fill={cfg.topParticleColor}>
              <animate attributeName="cx"
                from={CHIP_X} to={CHIP_X + CHIP_W}
                dur={`${p.dur}s`} begin={`${p.delay}s`} repeatCount="indefinite" />
            </circle>
          ))}

          {/* Virus particles when infection active */}
          {infection.active && VIRUS_DEFS.map(p => (
            <circle key={`vp-${p.id}`} cy={CHIP_Y + p.yOff} r={4}
              fill="rgba(239,68,68,0.85)" stroke="#ef4444" strokeWidth={1}>
              <animate attributeName="cx"
                from={CHIP_X} to={CHIP_X + CHIP_W}
                dur={`${p.dur}s`} begin={`${p.delay}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </g>

        {/* ── Top epithelial cell layer ── */}
        <rect x={CHIP_X} y={TOP_CELL_Y} width={CHIP_W} height={CELL_LAYER_H}
          fill={cfg.topCellColor + '18'} style={{ cursor: 'pointer' }}
          onClick={() => toggleLayer('top')} />
        {Array.from({ length: CELL_COUNT }, (_, i) => (
          <rect key={`tc-${i}`}
            x={CHIP_X + i * CELL_W + 1} y={TOP_CELL_Y + 2}
            width={CELL_W - 2} height={CELL_LAYER_H - 4}
            rx={3}
            fill={infection.cells[i] ? '#ef4444' : cfg.topCellColor}
            opacity={0.72}
            style={{ cursor: 'pointer', transition: 'fill 0.35s ease' }}
            onClick={() => toggleLayer('top')}
          />
        ))}

        {/* Cilia lines for LUNG */}
        {activeTab === 'LUNG' && Array.from({ length: CELL_COUNT }, (_, i) =>
          Array.from({ length: 4 }, (_, j) => (
            <line key={`cil-${i}-${j}`}
              x1={CHIP_X + i * CELL_W + 3 + j * 5} y1={TOP_CELL_Y + 2}
              x2={CHIP_X + i * CELL_W + 3 + j * 5} y2={TOP_CELL_Y - 6}
              stroke={cfg.topCellColor} strokeWidth={1} opacity={0.55} />
          ))
        )}

        <text x={CHIP_X + 8} y={TOP_CELL_Y + CELL_LAYER_H / 2 + 4}
          fill="rgba(255,255,255,0.65)" fontSize={9} fontWeight={600}
          style={{ pointerEvents: 'none' }}>
          {cfg.topCellLabel}
        </text>

        {/* ── Porous membrane ── */}
        {Array.from({ length: 60 }, (_, i) => (
          <line key={`m-${i}`}
            x1={CHIP_X + (i / 60) * CHIP_W + 2} y1={MEMB_Y + MEMBRANE_H / 2}
            x2={CHIP_X + (i / 60) * CHIP_W + CHIP_W / 60 - 2} y2={MEMB_Y + MEMBRANE_H / 2}
            stroke="rgba(255,255,255,0.3)" strokeWidth={1} strokeDasharray="3,3" />
        ))}

        {/* Central barrier label badge */}
        <rect x={W / 2 - 82} y={MEMB_Y - 3} width={164} height={MEMBRANE_H + 6}
          rx={4} fill="#0d948828" stroke="#0d9488" strokeWidth={1} />
        <text x={W / 2} y={MEMB_Y + MEMBRANE_H / 2 + 4}
          textAnchor="middle" fill="#14b8a6" fontSize={9} fontWeight={700} letterSpacing={1.5}>
          {cfg.specialLabel}
        </text>

        {/* ── Bottom endothelial cell layer ── */}
        <rect x={CHIP_X} y={BOT_CELL_Y} width={CHIP_W} height={BOT_CELL_H}
          fill={cfg.botCellColor + '18'} style={{ cursor: 'pointer' }}
          onClick={() => toggleLayer('bot')} />
        {Array.from({ length: CELL_COUNT }, (_, i) => (
          <rect key={`bc-${i}`}
            x={CHIP_X + i * CELL_W + 1} y={BOT_CELL_Y + 2}
            width={CELL_W - 2} height={BOT_CELL_H - 4}
            rx={3} fill={cfg.botCellColor} opacity={0.58}
            style={{ cursor: 'pointer' }}
            onClick={() => toggleLayer('bot')}
          />
        ))}
        <text x={CHIP_X + 8} y={BOT_CELL_Y + BOT_CELL_H / 2 + 4}
          fill="rgba(255,255,255,0.65)" fontSize={9} fontWeight={600}
          style={{ pointerEvents: 'none' }}>
          {cfg.botCellLabel}
        </text>

        {/* ── Bottom channel ── */}
        <rect x={CHIP_X} y={BOT_CH_Y} width={CHIP_W} height={BOT_CH_H}
          fill="#07111f" clipPath="url(#chipClip)" />
        <text x={CHIP_X + CHIP_W - 185} y={BOT_CH_Y + BOT_CH_H / 2 + 5}
          fill="rgba(255,255,255,0.3)" fontSize={10} fontWeight={700} letterSpacing={1}>
          {cfg.botChannelLabel}
        </text>

        {/* Bottom channel flow particles (right-to-left) */}
        <g clipPath="url(#chipClip)">
          {PARTICLES.map(p => (
            <circle key={`bp-${p.id}`} cy={BOT_CH_Y + p.yOff} r={p.r} fill={cfg.botParticleColor}>
              <animate attributeName="cx"
                from={CHIP_X + CHIP_W} to={CHIP_X}
                dur={`${p.dur + 0.5}s`} begin={`${p.delay - 0.3}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </g>

        {/* ── Selection highlight rings ── */}
        {selectedLayer === 'top' && (
          <rect x={CHIP_X} y={TOP_CELL_Y} width={CHIP_W} height={CELL_LAYER_H}
            fill="none" stroke="#f59e0b" strokeWidth={2} />
        )}
        {selectedLayer === 'bot' && (
          <rect x={CHIP_X} y={BOT_CELL_Y} width={CHIP_W} height={BOT_CELL_H}
            fill="none" stroke="#f59e0b" strokeWidth={2} />
        )}
      </svg>

      {/* ── Info panel ── */}
      {layerInfo ? (
        <div style={{
          marginTop: 10,
          background: `${layerInfo.color}12`,
          border: `1px solid ${layerInfo.color}45`,
          borderRadius: 10, padding: '16px 20px',
        }}>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 8, color: layerInfo.color }}>
            {layerInfo.label}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <div style={{ fontSize: '0.65rem', color: '#14b8a6', fontWeight: 700, letterSpacing: '0.12em', marginBottom: 5 }}>
                CELL TYPES
              </div>
              <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.75)', margin: 0, lineHeight: 1.6 }}>
                {cfg.cellTypes}
              </p>
            </div>
            <div>
              <div style={{ fontSize: '0.65rem', color: '#14b8a6', fontWeight: 700, letterSpacing: '0.12em', marginBottom: 5 }}>
                KEY RESEARCH QUESTION
              </div>
              <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.75)', margin: 0, lineHeight: 1.6 }}>
                {cfg.keyQuestion}
              </p>
            </div>
          </div>
          <div style={{ marginTop: 10, display: 'flex', gap: 20, fontSize: '0.8rem' }}>
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>
              BSL: <span style={{ color: '#f59e0b', fontWeight: 700 }}>{cfg.bsl}</span>
            </span>
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>
              Throughput: <span style={{ color: '#f59e0b', fontWeight: 700 }}>{cfg.throughput}</span>
            </span>
          </div>
        </div>
      ) : (
        <div style={{ marginTop: 8, textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', padding: '8px' }}>
          ↑ Click a cell layer to see details · Switch organ tabs · Introduce virus to watch infection spread
        </div>
      )}
    </div>
  )
}
