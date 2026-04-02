export default function About() {
  return (
    <section className="about" id="about">
      <div className="container">
        <div className="about-inner">
          {/* Left column */}
          <div className="about-left">
            <div className="about-portrait">
              <div className="about-portrait-initials" style={{ fontSize: '4rem', color: 'rgba(255,255,255,0.15)', fontFamily: 'Playfair Display, serif', fontWeight: 700 }}>
                BV
              </div>
              <div className="about-portrait-badge">NIH-NIAID · GATECH · Emory · Est. 2025</div>
            </div>

            <div className="about-orgs">
              {['NIH / NIAID', 'GATECH / Sanofi', 'Emory University', 'CYGNUS Technologies', 'US-Japan CMSM'].map((o) => (
                <span className="about-org-tag" key={o}>{o}</span>
              ))}
            </div>

            <div className="about-philosophy">
              <div className="about-philosophy-quote">
                "We translate the rigor of federal infectious disease research into precise,
                actionable advisory — bridging the gap between molecular science and
                program-level strategy."
              </div>
              <div className="about-philosophy-attr">— BioViro Sciences LLC</div>
            </div>
          </div>

          {/* Right column */}
          <div className="about-right">
            <span className="section-label">Our Scientific Foundation</span>
            <h2 className="section-title">
              Built from the <em>Inside</em> of Discovery
            </h2>

            <p className="about-intro">
              BioViro Sciences LLC was founded at the intersection of NIH virology research,
              mRNA vaccine development, and advanced cell model innovation — giving our clients
              the strategic perspective of scientists who have worked at the bench, at the program
              level, and at the international policy table.
            </p>

            <p className="about-body">
              As Study Director at NIH-NIAID, our team led in vitro antiviral studies for
              high-risk pathogens including Nipah virus, SARS-CoV, and Ebola at BSL-4
              containment levels. We established organ-on-chip platforms — Lung, Liver, and Brain
              — as 3Rs-compliant alternatives to animal models, becoming one of the first federal
              research programs to implement NAMs for antiviral drug development at scale.
            </p>

            <p className="about-body">
              Our mRNA vaccine expertise was forged through direct collaboration with Sanofi Pasteur,
              CureVac, and InCell Art at GATECH — developing Yellow Fever mRNA vaccine candidates,
              optimizing LNP delivery systems, and validating expression via PET-CT imaging. That
              work was published in <em>Nature Biomedical Engineering</em> (2019), establishing
              our first-hand understanding of the full mRNA delivery pathway from construct design
              to in vivo biodistribution.
            </p>

            <p className="about-body">
              As a Program Director at NIAID, we oversaw the national Hepatitis translational
              science portfolio, designed mRNA vaccine grant programs, and served as US Secretariat
              for the US-Japan Cooperative Medical Sciences Program (2025). That breadth — from
              molecule to portfolio — is what makes our advisory work unusually precise.
            </p>

            <div className="about-highlights">
              {[
                { num: 'NIH Study Director',   label: 'Led antiviral studies for Nipah, SARS, Ebola at BSL-4 containment' },
                { num: 'Nature-Published',     label: 'First/co-author in Nature Biomed Eng, Biomaterials, Nucleic Acids Res' },
                { num: '3Rs Pioneer',          label: 'Established Lung/Liver/Brain organ-on-chip platforms at NIH-NIAID' },
                { num: 'Program Director',     label: 'Oversaw national Hepatitis portfolio, mRNA vaccine strategy, US-Japan CMSM' },
              ].map((h) => (
                <div className="about-highlight" key={h.num}>
                  <div className="about-highlight-num">{h.num}</div>
                  <div className="about-highlight-label">{h.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
