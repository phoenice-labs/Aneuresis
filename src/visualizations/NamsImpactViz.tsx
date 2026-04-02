import { useState } from 'react'

// ─── Types ───────────────────────────────────────────────────────────────────
type CardId = 'replace' | 'reduce' | 'refine'

interface ThreeRCard {
  id: CardId
  title: string
  subtitle: string
  color: string
  icon: string
  stat: string
  statLabel: string
  description: string
  examples: string[]
}

// ─── 3R data ─────────────────────────────────────────────────────────────────
const THREE_R_CARDS: ThreeRCard[] = [
  {
    id: 'replace',
    title: 'Replace',
    subtitle: 'Eliminate animal models entirely',
    color: '#0d9488',
    icon: '🔬',
    stat: '~60%',
    statLabel: 'of safety assays can be replaced',
    description:
      'OECD-validated in vitro methods for skin sensitization (h-CLAT, U-SENS), eye irritation (EpiOcular), and phototoxicity (3T3 NRU) provide regulatory-accepted data without animal testing. Organ-on-chip platforms with human primary cells now substitute for rodent safety models in multiple FDA-accepted submissions.',
    examples: [
      'Reconstructed human epidermis (RhE) for skin sensitization & irritation',
      'EpiOcular / SkinEthic for corneal & eye irritation',
      'h-CLAT / U-SENS / ARE-Nrf2 for skin sensitization',
      'In silico QSAR models for genotoxicity & ADMET prediction',
    ],
  },
  {
    id: 'reduce',
    title: 'Reduce',
    subtitle: 'Minimize animals per study',
    color: '#f59e0b',
    icon: '📊',
    stat: '75%',
    statLabel: 'fewer animals per IND-enabling study',
    description:
      'Organ-on-chip and microphysiological systems enable high-throughput screening with fewer biological replicates than whole-animal studies. Predictive PK/PD models built from in vitro data reduce confirmatory in vivo groups. Human organoid primary screens triage candidates before any animal work begins.',
    examples: [
      'Lung-chip PK/PD data informing dose range-finding (eliminates pilot groups)',
      'AI-QSAR triage reducing redundant in vivo genotoxicity repeats',
      'Human gut organoid primary screening (replaces rodent ADME)',
      'Microphysiological systems reducing MTD study animal numbers',
    ],
  },
  {
    id: 'refine',
    title: 'Refine',
    subtitle: 'Improve welfare and data quality',
    color: '#14b8a6',
    icon: '🎯',
    stat: '3×',
    statLabel: 'better translational accuracy vs rodent',
    description:
      'Human-derived NAMs provide more physiologically relevant data than animal models for many mechanistic pathways. Reduced reliance on imprecise animal endpoints means fewer inconclusive studies and fewer repeat experiments — improving both animal welfare and scientific reproducibility.',
    examples: [
      'Human lung-chip modeling SARS-CoV-2 cytokine storm (impossible in mice)',
      'iPSC-derived cardiomyocytes for hERG / QT safety (avoids dog telemetry)',
      'Humanized gut microbiome chips for microbiome-drug interactions',
      'Patient-derived tumor organoids for precision oncology (avoids xenografts)',
    ],
  },
]

// ─── Grid config ─────────────────────────────────────────────────────────────
const GRID_COLS = 5
const GRID_ROWS = 5
const CELLS = GRID_COLS * GRID_ROWS  // 25 per panel

// ─── Component ───────────────────────────────────────────────────────────────
export default function NamsImpactViz() {
  const [namsLevel, setNamsLevel] = useState(30)
  const [selectedCard, setSelectedCard] = useState<ThreeRCard | null>(null)

  const namsCount  = Math.round((namsLevel / 100) * CELLS)  // 0–25
  const animalCount = CELLS - namsCount                      // 25–0

  // Derived display stats
  const animalsPerStudy = 25
  const totalTraditionalAnimals = animalCount * animalsPerStudy
  const costSavingPct = Math.round(namsLevel * 0.42)
  const timeReductionPct = Math.round(namsLevel * 0.38)

  function toggleCard(card: ThreeRCard) {
    setSelectedCard(prev => (prev?.id === card.id ? null : card))
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', color: 'white' }}>

      {/* ── Stats bar ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16 }}>
        {[
          { label: 'Animal Studies', value: `${animalCount}/25`, color: '#ef4444', sub: `~${totalTraditionalAnimals.toLocaleString()} animals` },
          { label: 'NAMs Studies', value: `${namsCount}/25`, color: '#0d9488', sub: `${namsLevel}% implemented` },
          { label: 'Cost Reduction', value: `${costSavingPct}%`, color: '#f59e0b', sub: 'vs. all-animal baseline' },
          { label: 'Time to Data', value: `−${timeReductionPct}%`, color: '#14b8a6', sub: 'faster vs. in vivo' },
        ].map(stat => (
          <div key={stat.label} style={{
            background: `${stat.color}12`,
            border: `1px solid ${stat.color}35`,
            borderRadius: 8, padding: '10px 14px',
          }}>
            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', fontWeight: 700 }}>
              {stat.label.toUpperCase()}
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: stat.color, marginTop: 2, lineHeight: 1 }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Comparison grids ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 40px 1fr', gap: 0, marginBottom: 16 }}>

        {/* Left: Traditional */}
        <div style={{
          background: 'rgba(239,68,68,0.06)',
          border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: '10px 0 0 10px',
          padding: '14px',
        }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#ef4444', letterSpacing: '0.12em', marginBottom: 10 }}>
            TRADITIONAL ANIMAL STUDIES
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
            gap: 4,
            marginBottom: 10,
          }}>
            {Array.from({ length: CELLS }, (_, i) => (
              <div key={i} title={`Study unit ${i + 1}`} style={{
                fontSize: '1.35rem',
                textAlign: 'center',
                lineHeight: 1,
                opacity: i < animalCount ? 1 : 0.1,
                transition: 'opacity 0.45s ease',
                filter: i < animalCount ? 'none' : 'grayscale(1)',
              }}>
                🐭
              </div>
            ))}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 8 }}>
            <span style={{ color: '#ef4444', fontWeight: 700 }}>{animalCount}</span> active studies
            &nbsp;·&nbsp;
            ~<span style={{ color: '#ef4444', fontWeight: 700 }}>{totalTraditionalAnimals.toLocaleString()}</span> animals
          </div>
        </div>

        {/* Centre arrow */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 4 }}>
          <div style={{ fontSize: '1.1rem', color: '#0d9488', lineHeight: 1 }}>→</div>
          <div style={{
            width: 1, flex: 1, background: 'linear-gradient(to bottom, rgba(13,148,136,0.4), rgba(13,148,136,0.05))',
          }} />
        </div>

        {/* Right: NAMs */}
        <div style={{
          background: 'rgba(13,148,136,0.06)',
          border: '1px solid rgba(13,148,136,0.2)',
          borderRadius: '0 10px 10px 0',
          padding: '14px',
        }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#0d9488', letterSpacing: '0.12em', marginBottom: 10 }}>
            NAMs-ENABLED STUDIES
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
            gap: 4,
            marginBottom: 10,
          }}>
            {Array.from({ length: CELLS }, (_, i) => (
              <div key={i} title={`NAMs study ${i + 1}`} style={{
                fontSize: '1.35rem',
                textAlign: 'center',
                lineHeight: 1,
                opacity: i < namsCount ? 1 : 0.1,
                transition: 'opacity 0.45s ease',
                filter: i < namsCount ? 'none' : 'grayscale(1)',
              }}>
                🔬
              </div>
            ))}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 8 }}>
            <span style={{ color: '#0d9488', fontWeight: 700 }}>{namsCount}</span> NAMs studies
            &nbsp;·&nbsp;
            0 animals required
          </div>
        </div>
      </div>

      {/* ── NAMs level slider ── */}
      <div style={{ marginBottom: 20, padding: '0 2px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.55)', fontWeight: 600, letterSpacing: '0.08em' }}>
            NAMs IMPLEMENTATION LEVEL
          </span>
          <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#14b8a6' }}>{namsLevel}%</span>
        </div>
        <div style={{ position: 'relative' }}>
          <input
            type="range" min={0} max={100} step={4} value={namsLevel}
            onChange={e => setNamsLevel(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#0d9488', height: 6 }}
          />
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)', marginTop: 4,
          }}>
            <span>0% — All animal</span>
            <span>50% — Hybrid</span>
            <span>100% — Full NAMs</span>
          </div>
        </div>
      </div>

      {/* ── 3R Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 12 }}>
        {THREE_R_CARDS.map(card => {
          const isSelected = selectedCard?.id === card.id
          return (
            <div
              key={card.id}
              onClick={() => toggleCard(card)}
              style={{
                cursor: 'pointer',
                background: isSelected ? `${card.color}18` : `${card.color}0a`,
                border: `1px solid ${isSelected ? card.color + '70' : card.color + '35'}`,
                borderRadius: 10,
                padding: '14px 16px',
                transition: 'all 0.2s ease',
                userSelect: 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: '1.25rem' }}>{card.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: card.color }}>{card.title}</div>
                  <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.3 }}>{card.subtitle}</div>
                </div>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: card.color, lineHeight: 1 }}>{card.stat}</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', marginTop: 3 }}>{card.statLabel}</div>
              <div style={{
                marginTop: 10, fontSize: '0.68rem', color: card.color + 'bb',
                textAlign: 'right', letterSpacing: '0.04em',
              }}>
                {isSelected ? '▲ Collapse' : '▼ Details'}
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Expanded card detail ── */}
      {selectedCard && (
        <div style={{
          background: `linear-gradient(135deg, ${selectedCard.color}12, rgba(10,22,40,0.7))`,
          border: `1px solid ${selectedCard.color}45`,
          borderRadius: 10,
          padding: '18px 22px',
          animation: 'fadeIn 0.2s ease',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: '1.4rem' }}>{selectedCard.icon}</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', color: selectedCard.color }}>{selectedCard.title}</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>{selectedCard.subtitle}</div>
            </div>
            <div style={{ marginLeft: 'auto', fontSize: '2rem', fontWeight: 700, color: selectedCard.color, lineHeight: 1 }}>
              {selectedCard.stat}
              <div style={{ fontSize: '0.7rem', fontWeight: 400, color: 'rgba(255,255,255,0.45)' }}>
                {selectedCard.statLabel}
              </div>
            </div>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.78)', lineHeight: 1.65, margin: '0 0 14px' }}>
            {selectedCard.description}
          </p>

          <div style={{ fontSize: '0.67rem', color: '#14b8a6', fontWeight: 700, letterSpacing: '0.12em', marginBottom: 8 }}>
            KEY EXAMPLES
          </div>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {selectedCard.examples.map((ex, i) => (
              <li key={i} style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: 4 }}>
                {ex}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!selectedCard && (
        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', padding: '6px' }}>
          ↑ Click a 3R card to explore strategies · Adjust the slider to see animal replacement in action
        </div>
      )}
    </div>
  )
}
