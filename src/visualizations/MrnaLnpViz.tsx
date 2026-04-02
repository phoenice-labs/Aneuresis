import { useState, useMemo } from 'react'

const W = 760
const H = 320

interface StepData {
  id: number
  x: number
  label: string
  shortLabel: string
  color: string
  bio: string
  why: string
}

const STEPS: StepData[] = [
  {
    id: 1, x: 65, label: 'mRNA-LNP Complex', shortLabel: 'LNP Complex',
    color: '#0d9488',
    bio: 'Lipid nanoparticle (LNP) encapsulates mRNA, protecting it from nuclease degradation in circulation. Composed of ionizable lipid, DSPC, cholesterol, and PEG-lipid at optimized molar ratios.',
    why: 'LNP composition — ionizable lipid species, N/P ratio, PEG density — directly determines circulation half-life, tissue distribution, and cellular uptake efficiency.',
  },
  {
    id: 2, x: 175, label: 'Cell Membrane Binding', shortLabel: 'Binding',
    color: '#0891b2',
    bio: 'LNP adsorbs to the target cell membrane via electrostatic interactions and ApoE-mediated LDL receptor recognition at near-neutral pH. Serum protein adsorption (corona formation) modulates cell tropism.',
    why: 'Ionizable lipid pKa and surface charge determine binding affinity and cell-type specificity — critical for targeting muscle vs. liver vs. lymph node for different vaccine applications.',
  },
  {
    id: 3, x: 285, label: 'Endosomal Uptake', shortLabel: 'Uptake',
    color: '#7c3aed',
    bio: 'LNP is internalized via clathrin-mediated endocytosis into early endosomes at neutral pH (~7.2). The majority (~98%) of endocytosed LNPs are trafficked to late endosomes and lysosomes without escape.',
    why: 'Endocytosis pathway and trafficking kinetics determine what fraction of mRNA cargo reaches the cytoplasm — the primary bottleneck in LNP transfection efficiency.',
  },
  {
    id: 4, x: 395, label: 'Endosomal Escape', shortLabel: 'Escape',
    color: '#dc2626',
    bio: 'Late endosome acidification (pH ~5.5–6.0) protonates the ionizable lipid, dramatically increasing its positive charge. This triggers LNP-endosomal membrane fusion and cargo release into the cytoplasm.',
    why: 'This pH-triggered escape step is the primary rate-limiting determinant of transfection efficiency. Ionizable lipid pKa optimization (target 6.0–6.5) is the central challenge in LNP design for vaccines.',
  },
  {
    id: 5, x: 505, label: 'mRNA Release', shortLabel: 'Release',
    color: '#d97706',
    bio: 'Free mRNA strands are released into the cytoplasm, stabilized by N1-methylpseudouridine (m1\u03a8) modifications that reduce TLR7/8 and RIG-I innate immune sensing while enhancing translational efficiency.',
    why: 'mRNA stability in the cytoplasm depends on nucleotide modifications, poly-A tail length, and 5\'/3\' UTR optimization — all of which are tunable at the construct design stage.',
  },
  {
    id: 6, x: 615, label: 'Ribosomal Translation', shortLabel: 'Translation',
    color: '#059669',
    bio: 'Ribosomes cap-dependently bind at the 5\' end and scan for the AUG start codon, initiating protein synthesis. Multiple ribosomes form polysomes for parallel translation from a single mRNA template.',
    why: 'Codon optimization (target CAI \u2265 0.85), Kozak consensus strength, and cap analog type (CleanCap AG vs. ARCA) directly control translation initiation rate and protein yield per mRNA molecule.',
  },
  {
    id: 7, x: 700, label: 'Antigen Expression', shortLabel: 'Antigen',
    color: '#0d9488',
    bio: 'The encoded antigen (e.g., prefusion-stabilized spike or YFV E protein) is synthesized, processed through the secretory pathway, and presented on MHC I/II — activating CD8+ T cells, CD4+ T cells, and B cells.',
    why: 'Expression level, duration, and cellular localization of the antigen determine the breadth, magnitude, and durability of the adaptive immune response — the ultimate measure of vaccine efficacy.',
  },
]

const FLOW_START = 65
const FLOW_END = 700
const FLOW_Y = 155

export default function MrnaLnpViz() {
  const [activeStep, setActiveStep] = useState<number | null>(null)
  const [efficiency, setEfficiency] = useState(70)

  const particleDur = Math.max(1.8, 6 - efficiency * 0.038)
  const particleCount = Math.max(4, Math.round(efficiency / 7))

  const particles = useMemo(() =>
    Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      delay: -((i * (particleDur / particleCount))),
      color: i % 4 === 0 ? '#14b8a6' : i % 4 === 1 ? '#0d9488' : i % 4 === 2 ? '#f59e0b' : '#5eead4',
      r: 3.5 + (i % 3) * 0.5,
      yOff: (i % 5 - 2) * 3,
    }))
  , [particleCount, particleDur])

  const activeData = activeStep !== null ? STEPS.find(s => s.id === activeStep) ?? null : null

  return (
    <div style={{ width: '100%', fontFamily: 'Inter, sans-serif' }}>
      <div style={{
        background: 'linear-gradient(135deg, #0a1628 0%, #112240 50%, #0d2b1a 100%)',
        borderRadius: 12,
        padding: '20px 12px 12px',
        overflow: 'hidden',
      }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          style={{ width: '100%', height: 'auto', display: 'block' }}
          role="img"
          aria-label="mRNA-LNP transfection pathway diagram"
        >
          <defs>
            <filter id="bvGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="bvSoftGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <marker id="bvArrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="rgba(255,255,255,0.22)" />
            </marker>
          </defs>

          {/* Background grid lines */}
          {[60, 120, 180, 240, 300].map(y => (
            <line key={y} x1={20} y1={y} x2={W - 20} y2={y}
              stroke="rgba(255,255,255,0.03)" strokeWidth={1} />
          ))}

          {/* Title label */}
          <text x={W / 2} y={22} textAnchor="middle"
            fill="rgba(255,255,255,0.35)" fontSize={10} letterSpacing={3} fontFamily="Inter, sans-serif" fontWeight={700}>
            mRNA-LNP TRANSFECTION PATHWAY
          </text>

          {/* Main flow track */}
          <line x1={FLOW_START} y1={FLOW_Y} x2={FLOW_END} y2={FLOW_Y}
            stroke="rgba(255,255,255,0.08)" strokeWidth={1.5} strokeDasharray="5,4" />

          {/* Arrows between steps */}
          {STEPS.slice(0, -1).map((step, i) => {
            const next = STEPS[i + 1]
            return (
              <line key={`arr-${i}`}
                x1={step.x + 30} y1={FLOW_Y}
                x2={next.x - 30} y2={FLOW_Y}
                stroke="rgba(255,255,255,0.2)"
                strokeWidth={1.5}
                markerEnd="url(#bvArrow)"
              />
            )
          })}

          {/* Animated particles */}
          {particles.map((p) => (
            <circle key={p.id} cx={FLOW_START} cy={FLOW_Y + p.yOff} r={p.r} fill={p.color} opacity={0.85}>
              <animate
                attributeName="cx"
                from={FLOW_START}
                to={FLOW_END}
                dur={`${particleDur.toFixed(2)}s`}
                begin={`${p.delay.toFixed(2)}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0;0.9;0.9;0"
                keyTimes="0;0.08;0.88;1"
                dur={`${particleDur.toFixed(2)}s`}
                begin={`${p.delay.toFixed(2)}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}

          {/* Step nodes */}
          {STEPS.map((step) => {
            const isActive = activeStep === step.id
            return (
              <g key={step.id}
                onClick={() => setActiveStep(isActive ? null : step.id)}
                style={{ cursor: 'pointer' }}
                role="button"
                aria-label={`Step ${step.id}: ${step.label}`}
              >
                {/* Outer glow ring (active) */}
                {isActive && (
                  <circle cx={step.x} cy={FLOW_Y} r={40}
                    fill={`${step.color}20`}
                    stroke={step.color}
                    strokeWidth={1}
                    strokeOpacity={0.5}
                    filter="url(#bvSoftGlow)"
                  />
                )}

                {/* Node background circle */}
                <circle cx={step.x} cy={FLOW_Y} r={27}
                  fill={isActive ? step.color : `${step.color}28`}
                  stroke={isActive ? step.color : `${step.color}70`}
                  strokeWidth={isActive ? 2.5 : 1.5}
                />

                {/* Step number */}
                <text x={step.x} y={FLOW_Y + 5} textAnchor="middle"
                  fill="white" fontSize={12} fontWeight={800} fontFamily="Inter, sans-serif">
                  {String(step.id).padStart(2, '0')}
                </text>

                {/* Label below node */}
                <text x={step.x} y={FLOW_Y + 50} textAnchor="middle"
                  fill={isActive ? step.color : 'rgba(255,255,255,0.5)'}
                  fontSize={8.5}
                  fontWeight={isActive ? 700 : 500}
                  fontFamily="Inter, sans-serif"
                >
                  {step.shortLabel}
                </text>
              </g>
            )
          })}

          {/* Efficiency annotation */}
          <text x={W - 8} y={H - 8} textAnchor="end"
            fill="rgba(255,255,255,0.25)" fontSize={8.5} fontFamily="Inter, sans-serif">
            Efficiency: {efficiency}% · Click nodes to explore
          </text>
        </svg>

        {/* Slider */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '10px 16px 4px',
        }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', whiteSpace: 'nowrap' }}>
            Transfection Efficiency:
          </span>
          <input
            type="range" min={10} max={100} value={efficiency}
            onChange={(e) => setEfficiency(Number(e.target.value))}
            className="sim-slider"
            style={{ flex: 1 }}
            aria-label="Transfection efficiency percentage"
          />
          <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#14b8a6', minWidth: 42, textAlign: 'right' }}>
            {efficiency}%
          </span>
        </div>
      </div>

      {/* Info panel */}
      {activeData ? (
        <div style={{
          marginTop: 14,
          background: `linear-gradient(135deg, ${activeData.color}15 0%, rgba(15,32,68,0.6) 100%)`,
          border: `1px solid ${activeData.color}50`,
          borderRadius: 10,
          padding: '18px 22px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: activeData.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.78rem', fontWeight: 900, color: 'white', flexShrink: 0,
            }}>
              {String(activeData.id).padStart(2, '0')}
            </div>
            <div style={{ fontSize: '0.98rem', fontWeight: 700, color: 'white' }}>
              Step {activeData.id}: {activeData.label}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <div style={{
                fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em',
                color: activeData.color, marginBottom: 7, textTransform: 'uppercase',
              }}>
                What Happens
              </div>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.65, margin: 0 }}>
                {activeData.bio}
              </p>
            </div>
            <div>
              <div style={{
                fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em',
                color: '#f59e0b', marginBottom: 7, textTransform: 'uppercase',
              }}>
                Why It Matters for Formulation
              </div>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.65, margin: 0 }}>
                {activeData.why}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div style={{
          marginTop: 10,
          textAlign: 'center',
          color: 'rgba(255,255,255,0.3)',
          fontSize: '0.8rem',
          padding: '10px',
        }}>
          ↑ Click any numbered step node to explore the biology and formulation implications
        </div>
      )}
    </div>
  )
}
