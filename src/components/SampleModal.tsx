import { useEffect } from 'react'
import type { ServiceSample } from '../data/serviceSamples'

interface Props {
  sample: ServiceSample
  onClose: () => void
}

export default function SampleModal({ sample, onClose }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const wmRows = Array.from({ length: 18 })
  const wmCols = Array.from({ length: 4 })

  return (
    <div className="sm-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="sm-panel" onClick={(e) => e.stopPropagation()}>

        {/* Repeating diagonal watermark */}
        <div className="sm-wm-layer" aria-hidden="true">
          {wmRows.map((_, r) =>
            wmCols.map((_, c) => (
              <span
                key={`${r}-${c}`}
                className="sm-wm-text"
                style={{ top: `${r * 155 - 30}px`, left: `${c * 340 - 60}px` }}
              >
                SAMPLE
              </span>
            ))
          )}
        </div>

        {/* Document */}
        <div className="sm-doc">

          {/* Header */}
          <div className="sm-doc-header">
            <div className="sm-doc-brand">
              <div className="sm-doc-logo">BVS</div>
              <div>
                <div className="sm-doc-firm">BioViro Sciences LLC</div>
                <div className="sm-doc-tagline">Infectious Disease · mRNA Vaccines · Advanced Cell Models</div>
              </div>
            </div>
            <div className="sm-doc-meta">
              <div><span>Document No.</span>{sample.docNumber}</div>
              <div><span>Version</span>{sample.version}</div>
              <div><span>Date</span>{sample.date}</div>
              <div><span>Classification</span><strong>{sample.classification}</strong></div>
            </div>
          </div>

          {/* Title bar */}
          <div className="sm-doc-titlebar">
            <div className="sm-doc-type">{sample.docType}</div>
            <div className="sm-doc-title">{sample.docTitle}</div>
          </div>

          {/* Excerpt notice */}
          <div className="sm-excerpt-notice">
            ⚠ SAMPLE EXCERPT — Illustrative deliverable only. Actual deliverables are fully
            customized to client product, scientific context, and program requirements.
            All data shown is hypothetical.
          </div>

          {/* Scrollable content */}
          <div className="sm-doc-body">{sample.content}</div>

          {/* Document footer */}
          <div className="sm-doc-footer">
            <span>CONFIDENTIAL — SAMPLE ONLY — Not for regulatory submission</span>
            <span>© 2025 BioViro Sciences LLC · All Rights Reserved</span>
          </div>
        </div>

        {/* Sticky bottom controls */}
        <div className="sm-controls">
          <button className="sm-close-btn" onClick={onClose}>✕ Close Preview</button>
          <span className="sm-ctrl-note">Press Esc to close · Scroll to read full document</span>
        </div>
      </div>
    </div>
  )
}
