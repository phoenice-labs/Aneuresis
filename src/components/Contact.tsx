import { useState } from 'react'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section className="contact" id="contact">
      <div className="container">
        <span className="section-label">Get In Touch</span>
        <h2 className="section-title">Engage Our Team</h2>
        <p className="section-subtitle">
          Ready to advance your infectious disease program? Whether you need mRNA vaccine
          design advisory, antiviral study design, organ-on-chip strategy, or NIH grant
          positioning — we are here.
        </p>

        <div className="contact-inner">
          {/* Left: Info & pitch */}
          <div className="contact-info">
            {[
              { icon: '📧', text: 'info@bioviro-sciences.com' },
              { icon: '📍', text: 'Rockville, MD — Available Nationwide & Remotely' },
              { icon: '🕐', text: 'Response within 24 business hours' },
            ].map((item) => (
              <div className="contact-item" key={item.text}>
                <div className="contact-item-icon">{item.icon}</div>
                <span>{item.text}</span>
              </div>
            ))}

            <div className="contact-pitch">
              <div className="contact-pitch-title">The BioViro Advantage</div>
              <p className="contact-pitch-text">
                BioViro Sciences was built from inside NIH-NIAID and GATECH research programs —
                not from the outside looking in. We understand what NIAID study sections look for
                because we have sat on them. We know how organ-on-chip platforms perform in antiviral
                settings because we built them at federal scale. We know how mRNA vaccines behave
                in vivo because we published the PET-CT imaging data in Nature Biomedical Engineering.
              </p>
              <p className="contact-pitch-text">
                <strong style={{ color: 'rgba(255,255,255,0.85)' }}>Engagements start at a 90-minute strategy call.</strong>
                {' '}Project-based, hourly, and retainer options available.
              </p>
            </div>
          </div>

          {/* Right: Form */}
          <div>
            {submitted ? (
              <div style={{
                background: 'rgba(13,148,136,0.2)',
                border: '1px solid rgba(13,148,136,0.5)',
                borderRadius: 12,
                padding: 40,
                textAlign: 'center',
                color: 'white',
              }}>
                <div style={{ fontSize: '3rem', marginBottom: 16 }}>✅</div>
                <h3 style={{ color: 'white', marginBottom: 12 }}>Message Received!</h3>
                <p style={{ color: 'rgba(255,255,255,0.7)' }}>
                  Thank you for reaching out. Our team will respond within 24 business hours.
                </p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input className="form-input" type="text" placeholder="Jane" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input className="form-input" type="text" placeholder="Smith" required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Organization</label>
                  <input className="form-input" type="text" placeholder="Pharma / Biotech / Academic Institution" />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input className="form-input" type="email" placeholder="jane@organization.com" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Service of Interest</label>
                  <select className="form-select form-input">
                    <option value="">Select a service...</option>
                    <option>mRNA Vaccine Design &amp; LNP Formulation Strategy</option>
                    <option>Antiviral Study Design &amp; In Vitro Model Selection</option>
                    <option>Organ-on-Chip &amp; Organoid Platform Advisory</option>
                    <option>3Rs / NAMs Compliance Strategy</option>
                    <option>Scientific &amp; Regulatory Technical Writing</option>
                    <option>NIH Grant Writing &amp; Portfolio Strategy</option>
                    <option>Pre-existing Research Data Analysis</option>
                    <option>Infectious Disease Research Program Advisory</option>
                    <option>Multiple / General Inquiry</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Tell us about your project</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Briefly describe your program, scientific challenge, or project scope..."
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                  Send Message →
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
