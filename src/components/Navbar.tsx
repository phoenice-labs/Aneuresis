import { useEffect, useState } from 'react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="navbar-inner">
        <div className="navbar-logo">
          <div className="navbar-logo-icon">BV</div>
          <div className="navbar-logo-text">
            <span className="navbar-logo-name">BioViro Sciences</span>
            <span className="navbar-logo-sub">
              LLC · Est. 2025 · Infectious Disease · mRNA Vaccines
            </span>
          </div>
        </div>

        <ul className="navbar-links">
          {[
            { label: 'About', id: 'about' },
            { label: 'Services', id: 'services' },
            { label: 'Simulations', id: 'simulations' },
            { label: 'Credentials', id: 'credentials' },
          ].map(({ label, id }) => (
            <li key={id}>
              <a href={`#${id}`} onClick={(e) => { e.preventDefault(); navTo(id) }}>{label}</a>
            </li>
          ))}
          <li>
            <a
              href="#contact"
              className="navbar-cta"
              onClick={(e) => { e.preventDefault(); navTo('contact') }}
            >
              Engage Our Team
            </a>
          </li>
        </ul>
      </div>
    </nav>
  )
}
