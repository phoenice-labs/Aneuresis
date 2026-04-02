import type { ReactNode } from 'react'

export interface ServiceSample {
  serviceNum: string
  docType: string
  docTitle: string
  docNumber: string
  version: string
  date: string
  classification: string
  content: ReactNode
}

/* shared micro-helpers */
function H({ t }: { t: string }) { return <div className="sdoc-h2">{t}</div> }
function P({ children }: { children: ReactNode }) { return <p className="sdoc-p">{children}</p> }
function InfoBox({ children }: { children: ReactNode }) { return <div className="sdoc-info-box">{children}</div> }
function Th({ cols }: { cols: string[] }) {
  return <thead><tr>{cols.map(c => <th key={c}>{c}</th>)}</tr></thead>
}
function ApprovalBlock() {
  return (
    <div className="sdoc-approval-block">
      {['Prepared By', 'Reviewed By', 'Approved By'].map(role => (
        <div className="sdoc-approval-cell" key={role}>
          <div className="sdoc-sig-line" />
          <div className="sdoc-sig-role">{role}</div>
          <div>Name / Title</div>
          <div>Date: ___________</div>
        </div>
      ))}
    </div>
  )
}

/* S01 — mRNA Vaccine Design Advisory Brief */
const s01: ReactNode = (
  <>
    <H t="1. Executive Summary" />
    <P>
      This advisory brief provides mRNA construct design and LNP formulation strategy recommendations
      for the YFV-mRNA-LNP vaccine candidate targeting Yellow Fever virus (YFV) prM/E antigen.
      Recommendations are grounded in direct mRNA vaccine development experience with Sanofi Pasteur,
      CureVac, and InCell Art, and validated through PET-CT in vivo delivery imaging published in
      <em> Nature Biomedical Engineering (2019)</em>.
    </P>

    <H t="2. mRNA Construct Specifications" />
    <table className="sdoc-table">
      <Th cols={['Construct Element', 'Recommended Specification', 'Rationale']} />
      <tbody>
        {([
          ["5' Cap Analog", 'CleanCap AG (TriLink)', 'Superior translation efficiency vs. ARCA; ~2× protein yield in mammalian cells'],
          ["5' UTR", 'Xenopus β-globin hybrid (optimized)', 'Validated for high translation initiation in muscle and APCs; reduced innate immune activation'],
          ['Open Reading Frame', 'YFV prM/E with prefusion stabilization (K279E)', 'prM/E coexpression required for VLP formation; stabilizing mutation improves Th2 response'],
          ['Codon Optimization', 'Human codon usage (CAI ≥ 0.85)', 'Avoid rare codons; optimize GC content 50–65%; remove cryptic splice sites'],
          ["3' UTR", 'AES + mtRNR1 tandem', 'Extended half-life in vivo; validated in GATECH/Sanofi YFV program'],
          ['Poly-A Tail', '120 nt encoded poly-A', 'Longer tail improves stability and translation; encoded preferred over enzymatic'],
          ['Nucleotide Modification', 'N1-methylpseudouridine (m1Ψ)', 'Reduces innate immune sensing (TLR7/8); increases translational output 10–100×'],
        ] as string[][]).map(r => <tr key={r[0]}>{r.map((c,i) => <td key={i}>{c}</td>)}</tr>)}
      </tbody>
    </table>

    <H t="3. LNP Formulation Matrix" />
    <InfoBox>
      <p className="sdoc-p" style={{ marginBottom: 0 }}>
        <strong>Target application:</strong> Intramuscular injection (0.5 mL) · <strong>Target cell:</strong> Muscle myocytes + dendritic cells at injection site · <strong>mRNA dose range:</strong> 1–30 µg
      </p>
    </InfoBox>
    <table className="sdoc-table">
      <Th cols={['Parameter', 'Option A (MC3-based)', 'Option B (ALC-0315-based)', 'Option C (SM-102-based)', 'Recommendation']} />
      <tbody>
        {([
          ['Ionizable Lipid', 'DLin-MC3-DMA (pKa 6.44)', 'ALC-0315 (pKa 6.09)', 'SM-102 (pKa 6.68)', 'ALC-0315 — lowest systemic exposure'],
          ['N/P Ratio', '6:1', '6:1', '8:1', '6:1 for IM delivery'],
          ['Mol% Composition', 'MC3/DSPC/Chol/PEG-2000 50:10:38.5:1.5', 'ALC-0315/DSPC/Chol/ALC-0159 46.3:9.4:42.7:1.6', 'SM-102/DSPC/Chol/PEG 50:10:38.5:1.5', 'ALC-0315 formulation'],
          ['Encapsulation Efficiency', '≥90%', '≥93%', '≥88%', 'All acceptable; target ≥90%'],
          ['Particle Size (Z-avg)', '80–120 nm', '80–100 nm', '80–110 nm', 'Option B — tightest distribution'],
          ['PDI', '<0.15', '<0.10', '<0.18', 'Option B — superior uniformity'],
          ['In vitro Expression', 'HEK293: moderate', 'HEK293: high', 'HEK293: moderate-high', 'Option B — highest expression'],
        ] as string[][]).map(r => <tr key={r[0]}>{r.map((c,i) => <td key={i}>{c}</td>)}</tr>)}
      </tbody>
    </table>

    <H t="4. Recommended Delivery Platform & Key Considerations" />
    <P>
      <strong>Recommended platform:</strong> ALC-0315-based LNP (Option B) formulated by ethanol injection
      microfluidics (NanoAssemblr or equivalent), 0.5 mL IM injection in deltoid. Adjuvant: none required —
      mRNA/LNP is inherently immunostimulatory at low doses via residual dsRNA sensing.
    </P>
    <ol className="sdoc-ol">
      <li><strong>Cold chain:</strong> Storage at −20°C in sucrose-containing buffer; avoid repeated freeze-thaw. ALC-0315 formulations show superior stability at 5°C vs. MC3-based.</li>
      <li><strong>In vitro validation sequence:</strong> BHK-21 / HEK293 expression → C6/36 neutralization (PRNT80) → primary human monocyte-derived DC cytokine profiling.</li>
      <li><strong>Immunogenicity endpoint:</strong> Anti-YFV E protein IgG titer by ELISA + PRNT80 neutralization titer; target PRNT80 ≥ 1:40 at day 14 in BALB/c model.</li>
      <li><strong>PET imaging validation:</strong> [¹⁸F]-FDG-labeled LNP PET-CT (as published in Lindsay &amp; Bhosle et al., Nat Biomed Eng 2019) recommended to confirm IM depot retention and lymph node trafficking before dose escalation.</li>
    </ol>
    <ApprovalBlock />
  </>
)

/* S02 — Antiviral Study Design Protocol */
const s02: ReactNode = (
  <>
    <H t="1. Study Objective" />
    <InfoBox>
      <p className="sdoc-p" style={{ marginBottom: 0 }}>
        <strong>Compound:</strong> NiV-Inh-07 (Nipah virus fusion inhibitor, small molecule) ·
        <strong> Virus:</strong> Nipah virus Malaysia strain (NiV-M) ·
        <strong> Primary Objective:</strong> Determine IC₅₀ and CC₅₀ in BSL-4-compatible cell models;
        characterize mechanism of inhibition (fusion vs. entry vs. replication).
      </p>
    </InfoBox>

    <H t="2. Cell Model Selection Rationale" />
    <table className="sdoc-table">
      <Th cols={['Cell Model', 'BSL Requirement', 'NiV Tropism', 'Assay Throughput', 'Recommended Use', 'Rationale']} />
      <tbody>
        {([
          ['Vero-E6', 'BSL-4 (live NiV)', 'High (EPHB2+)', 'High (96/384-well)', 'Primary plaque assay, IC₅₀ screen', 'Gold-standard NiV propagation; well-characterized CPE'],
          ['A549 (lung)', 'BSL-4 (live NiV)', 'Moderate (Ephrin-B2/B3+)', 'Medium', 'Physiologically relevant lung model', 'Mimics respiratory NiV entry; monitors IFN response'],
          ['iPSC-Neuron', 'BSL-4 (live NiV)', 'High (EPHB2++)', 'Low (specialist culture)', 'Mechanistic CNS tropism study', 'NiV encephalitis mechanism; used after IC₅₀ confirmed'],
          ['Pseudotyped VSV-NiV', 'BSL-2 (pseudovirus)', 'High (entry only)', 'Very High (384-well)', 'High-throughput primary screen', 'Entry/fusion inhibitor screen pre-BSL-4 confirmation'],
          ['Vero STAT1−/−', 'BSL-4', 'Very High', 'Medium', 'Enhanced replication for low-MOI studies', 'Increased viral yield; useful for mechanistic replication studies'],
        ] as string[][]).map(r => <tr key={r[0]}>{r.map((c,i) => <td key={i}>{c}</td>)}</tr>)}
      </tbody>
    </table>

    <H t="3. Assay Panel" />
    <table className="sdoc-table">
      <Th cols={['Assay', 'Platform', 'Endpoint', 'Timeline', 'Purpose']} />
      <tbody>
        {([
          ['Plaque reduction assay (PRNT)', 'Vero-E6 / BSL-4', 'PRNT₅₀ / PRNT₈₀', 'Day 0–5', 'Primary antiviral efficacy endpoint'],
          ['Duplex RT-qPCR (N gene + actin)', 'Vero-E6 / A549', 'Viral RNA copies/cell', 'Day 0–3', 'Rapid quantification; correlates with PRNT'],
          ['Cytotoxicity (CellTiter-Glo)', 'All cell models', 'CC₅₀ (µM)', 'Parallel to antiviral', 'Selectivity index (SI = CC₅₀/IC₅₀)'],
          ['Bioplex cytokine (13-plex)', 'A549 supernatant', 'IFN-α/β, IL-6, CXCL10', 'Day 1, 2, 3', 'Innate immune modulation by compound'],
          ['IFA (anti-NiV N antibody)', 'Vero-E6 / A549', 'Infected cell count (% inhibition)', 'Day 2', 'Visual confirmation of viral inhibition'],
          ['Time-of-addition study', 'Vero-E6', 'Stage-specific IC₅₀', 'Day 0 only', 'Mechanism: pre-entry vs. post-entry vs. replication'],
        ] as string[][]).map(r => <tr key={r[0]}>{r.map((c,i) => <td key={i}>{c}</td>)}</tr>)}
      </tbody>
    </table>

    <H t="4. Statistical Design & Controls" />
    <P>
      Each compound concentration tested in <strong>triplicate wells, n = 3 independent biological replicates</strong>.
      IC₅₀ and CC₅₀ calculated by nonlinear regression (4-parameter logistic model, GraphPad Prism).
      Selectivity Index (SI) = CC₅₀/IC₅₀; target SI ≥ 10 for advancement.
    </P>
    <ul className="sdoc-list">
      <li><strong>Positive control (antiviral):</strong> Ribavirin (NiV-validated) at 10, 50, 100 µM — run every plate</li>
      <li><strong>Negative control:</strong> DMSO vehicle (0.1% v/v final) — 8 wells per plate</li>
      <li><strong>Cytotoxicity positive control:</strong> Hygromycin B 100 µg/mL — confirms assay window</li>
      <li><strong>MOI:</strong> 0.01 (plaque/PRNT), 0.1 (RT-qPCR/bioplex) — mimics physiological infection</li>
    </ul>
    <ApprovalBlock />
  </>
)

/* S03 — Organ-on-Chip Platform Advisory */
const s03: ReactNode = (
  <>
    <H t="1. Client Objective" />
    <P>
      Advisory for selecting and implementing an organ-on-chip (OoC) platform for antiviral drug
      efficacy testing targeting respiratory and hepatotropic viruses (SARS-CoV-2, HBV, HCV).
      Deliverable includes platform comparison, implementation roadmap, and BSL compatibility assessment.
    </P>

    <H t="2. Platform Comparison Matrix" />
    <table className="sdoc-table">
      <Th cols={['Platform', 'Vendor', 'Organ Types', 'Throughput', 'BSL-3 Compatible', 'mRNA/LNP Compatible', 'Regulatory Precedent', 'Cost/Chip']} />
      <tbody>
        {([
          ['Organ Chip (Zoë system)', 'Emulate Bio', 'Lung, Liver, Intestine, Brain, Kidney', 'Low-medium (12 chips/run)', 'Yes (validated)', 'Yes', 'FDA, EMA precedent; NIAID-funded studies', '~$200–400'],
          ['PhysioMimix OoC', 'CN Bio', 'Liver (primary focus), Lung, Gut', 'Medium (6-well format)', 'Yes (cabinet-contained)', 'Yes', 'Emerging regulatory acceptance', '~$150–250'],
          ['HUMIMIC Chip', 'TissUse', 'Multi-organ (up to 4-organ circuit)', 'Low', 'BSL-2 standard (BSL-3 adaptable)', 'Yes (custom protocol)', 'Research-grade; limited regulatory dossier', '~$100–200'],
          ['Custom PDMS microfluidic', 'In-house fabrication', 'Any (custom)', 'Very low', 'Depends on fab', 'Yes', 'Must be fully validated de novo', '~$20–80'],
          ['OrganoPlate (Mimetas)', 'Mimetas', 'Gut, Liver, Brain, Kidney', 'High (96/384-well format)', 'BSL-2 standard', 'Yes', 'Regulatory interest; EMA workshop precedent', '~$50–150'],
        ] as string[][]).map(r => <tr key={r[0]}>{r.map((c,i) => <td key={i}>{c}</td>)}</tr>)}
      </tbody>
    </table>

    <H t="3. Recommended Implementation Roadmap" />
    <ol className="sdoc-ol">
      <li>
        <strong>Phase 1 (Months 1–6): Lung-on-chip — SARS-CoV-2 antiviral model.</strong>{' '}
        Emulate Lung Chip with primary human alveolar epithelial cells (AT2) + human pulmonary
        microvascular endothelial cells. BSL-3 validated protocol (Emulate validated with SARS-CoV-2).
        Endpoint: plaque reduction, cytokine profiling (bioplex), tight junction integrity (TEER).
      </li>
      <li>
        <strong>Phase 2 (Months 4–9): Liver-on-chip — HBV/HCV antiviral model.</strong>{' '}
        CN Bio PhysioMimix with primary human hepatocytes + Kupffer cells. Long-term culture (&gt;28 days)
        required for HBV chronicity modeling. Endpoint: HBsAg/HBeAg ELISA, HBV pgRNA RT-qPCR,
        ALT/AST secretion, CYP3A4 activity (compound toxicity biomarker).
      </li>
      <li>
        <strong>Phase 3 (Months 8–15): Brain organoid co-culture — Nipah/SARS-CoV-2 neurotropism.</strong>{' '}
        iPSC-derived cerebral organoids (Stem Cell Technologies protocol) co-cultured with
        microglia precursors. BSL-4 adaptation protocol required. Endpoint: NiV-N IFA, neuronal
        survival (MAP2/NeuN), inflammatory mediators (IFN-β, IL-6, TNF-α).
      </li>
    </ol>

    <H t="4. Key Technical Considerations" />
    <ul className="sdoc-list">
      <li><strong>BSL compatibility:</strong> All BSL-3/4 work requires a closed, biosafety-validated chip design — confirm with Emulate or CN Bio BSL-3 adaptation kits before procurement.</li>
      <li><strong>Primary cell sourcing:</strong> Establish donor-matched cell banks early; batch variability is the primary source of inter-experiment variability in OoC systems.</li>
      <li><strong>Assay integration:</strong> LNP/mRNA delivery to OoC systems requires perfusion-compatible formulations — avoid high-viscosity buffers; validate endothelial barrier integrity post-LNP exposure.</li>
      <li><strong>NAMs regulatory strategy:</strong> For IND-enabling studies, prepare a 3Rs justification document aligned with FDA CDER/CBER emerging technology guidance and ICH S1 revisions.</li>
    </ul>
    <ApprovalBlock />
  </>
)

/* S04 — 3Rs / NAMs Compliance Strategy Report */
const s04: ReactNode = (
  <>
    <H t="1. 3Rs Compliance Framework" />
    <P>
      This report provides a 3Rs (Replacement, Reduction, Refinement) compliance strategy for
      antiviral drug development programs targeting BSL-3/4 pathogens. Framework is aligned with
      FDA CDER/CBER NAMs guidance (2023), NIH 3Rs initiative priorities, and EU Directive 2010/63/EU.
    </P>
    <InfoBox>
      <p className="sdoc-p" style={{ marginBottom: 0 }}>
        <strong>Scope:</strong> Antiviral efficacy testing for Nipah virus, SARS-CoV-2, and HCV/HBV ·
        <strong> Current animal models in use:</strong> Syrian golden hamster (SARS-CoV-2), ferret (NiV), chimpanzee (HCV) ·
        <strong> Target:</strong> Replace ≥60% of primary animal studies with validated NAMs by Year 2.
      </p>
    </InfoBox>

    <H t="2. Proposed NAM Alternatives" />
    <table className="sdoc-table">
      <Th cols={['Current Animal Model', 'Pathogen', 'Proposed NAM Replacement', 'NAM Type', 'Validation Status', 'Regulatory Acceptance', 'Estimated Timeline']} />
      <tbody>
        {([
          ['Syrian golden hamster (intratracheal SARS-CoV-2)', 'SARS-CoV-2', 'Human Lung-on-Chip (Emulate, AT2+HMVEC)', 'Organ-on-Chip', 'NIAID-validated (BSL-3)', 'FDA CDER emerging technology; ICCVAM endorsed', '3–6 months'],
          ['Ferret intranasal NiV challenge', 'Nipah virus', 'iPSC-derived airway organoid (BSL-4)', 'Organoid', 'Research-grade; requires platform validation', 'Not yet accepted for IND-enabling; supplementary data', '9–12 months'],
          ['Chimpanzee HCV rechallenge model', 'HCV', 'Human Liver-on-Chip (CN Bio, primary hepatocytes)', 'Organ-on-Chip', 'Validated (CN Bio/NIH collaboration)', 'FDA/EMA accepted for mechanistic studies', '3–6 months'],
          ['Murine HBV hydrodynamic injection model', 'HBV', 'HBV-infected HepaRG + Kupffer co-culture', 'Advanced cell model', 'Widely validated; multiple publications', 'Accepted for efficacy assessment in IND packages', 'Immediate'],
          ['NHP cytokine storm model (NiV high dose)', 'Nipah virus', 'PBMC + Lung-on-chip cytokine storm model', 'Multi-organ chip', 'Conceptual; requires validation study', 'Supplementary data only at this stage', '12–18 months'],
        ] as string[][]).map(r => <tr key={r[0]}>{r.map((c,i) => <td key={i}>{c}</td>)}</tr>)}
      </tbody>
    </table>

    <H t="3. 3Rs Justification Document Structure" />
    <ol className="sdoc-ol">
      <li><strong>Scientific justification for NAM:</strong> Mechanism-based argument that the NAM recapitulates the relevant biology (e.g., NiV entry via EPHB2 in airway epithelium).</li>
      <li><strong>Validation evidence summary:</strong> Assay performance characteristics, concordance with existing in vivo data, sensitivity/specificity analysis.</li>
      <li><strong>Regulatory precedent and agency positions:</strong> FDA, ICCVAM, ECVAM, ICH M3(R2) alignment; reference to accepted 3Rs NAMs in peer-reviewed submissions.</li>
      <li><strong>Residual animal use justification:</strong> Where animal studies cannot yet be replaced — Refinement and Reduction plan for remaining in vivo work.</li>
      <li><strong>Implementation timeline and resource requirements:</strong> Platform acquisition, cell sourcing, assay validation milestones, and budget estimate.</li>
    </ol>
    <ApprovalBlock />
  </>
)

/* S05 — Scientific Writing: Draft Abstract + NIH R01 Aims */
const s05: ReactNode = (
  <>
    <H t="Section 1: Sample Draft Abstract — mRNA Vaccine Paper" />
    <InfoBox>
      <p className="sdoc-p" style={{ marginBottom: 0 }}>
        <strong>Manuscript title (draft):</strong> "Lipid Nanoparticle-Delivered mRNA Encoding
        Prefusion-Stabilized Yellow Fever Virus Envelope Antigen Elicits Durable Neutralizing
        Antibody Responses in a Murine Model" · <strong>Target journal:</strong> npj Vaccines ·
        <strong> Status:</strong> Draft abstract for client review
      </p>
    </InfoBox>
    <P>
      <strong>Background:</strong> Yellow fever virus (YFV) remains a significant global health
      burden, with conventional live-attenuated YFV-17D vaccine contraindicated in
      immunocompromised individuals and traveler populations. mRNA-based vaccines offer a
      thermostable, rapid-manufacturing alternative without the safety liabilities of replication-competent
      platforms.
    </P>
    <P>
      <strong>Methods:</strong> We designed and evaluated a lipid nanoparticle (LNP)-encapsulated
      mRNA construct encoding a codon-optimized, prefusion-stabilized YFV prM/E antigen with
      N1-methylpseudouridine (m1Ψ) modification and ALC-0315-based LNP formulation. BALB/c mice
      received two 5 µg IM immunizations (prime/boost, 21-day interval). Immunogenicity was assessed
      by anti-YFV E IgG ELISA, plaque reduction neutralization test (PRNT₈₀), and YFV-specific
      CD4+/CD8+ T-cell responses by intracellular cytokine staining (ICS). In vivo mRNA biodistribution
      was characterized by PET-CT imaging using [¹⁸F]-radiolabeled lipid reporter.
    </P>
    <P>
      <strong>Results:</strong> YFV mRNA-LNP vaccination elicited geometric mean PRNT₈₀ titers of
      1:1,280 (± 420 SD) at day 42, exceeding WHO-defined seroprotection threshold (PRNT₈₀ ≥ 1:10)
      in 100% of vaccinated animals. PET-CT imaging confirmed IM depot formation with axillary lymph
      node trafficking at 6 h post-injection, consistent with previously published PET imaging data
      (Lindsay &amp; Bhosle et al., <em>Nat Biomed Eng</em> 2019). Durable antibody titers were
      maintained at 6-month follow-up with &lt;2-fold titer decay.
    </P>
    <P>
      <strong>Conclusions:</strong> LNP-delivered m1Ψ-modified mRNA encoding prefusion-stabilized
      YFV E antigen is highly immunogenic in mice, with a formulation and construct strategy
      translatable to human clinical application. These findings support advancement to NHP immunogenicity
      and challenge studies.
    </P>

    <H t="Section 2: Sample NIH R01 Specific Aims Framework" />
    <P>
      <strong>Project Title:</strong> Organ-on-Chip Models for Antiviral Drug Efficacy Assessment
      in High-Containment Pathogens · <strong>PA:</strong> PA-23-074 (NIAID R01) ·
      <strong> Project Period:</strong> 5 years
    </P>
    <P>
      <strong>Overall Objective:</strong> Establish and validate organ-on-chip (OoC) platforms as
      3Rs-compliant, physiologically relevant models for antiviral drug efficacy testing against
      BSL-3/4 pathogens, with specific application to Nipah virus (NiV), SARS-CoV-2, and HCV.
    </P>
    <ol className="sdoc-ol">
      <li>
        <strong>Aim 1: Establish BSL-3-compatible human Lung-on-Chip model for NiV and SARS-CoV-2 antiviral drug testing.</strong>{' '}
        Hypothesis: Human alveolar AT2/HMVEC Lung-on-Chip (Emulate platform) recapitulates NiV/SARS-CoV-2
        infection tropism and cytokine storm phenotype observed in BSL-4 animal models. We will
        characterize infection kinetics (MOI 0.01–1.0), validate antiviral response (remdesivir,
        NiV fusion inhibitor), and establish endpoint concordance with hamster SARS-CoV-2 data.
      </li>
      <li>
        <strong>Aim 2: Validate antiviral activity readouts and cross-platform concordance.</strong>{' '}
        Hypothesis: OoC-derived IC₅₀ values will correlate (Pearson r ≥ 0.85) with matched BSL-4
        in vivo PK/PD efficacy data across 6 reference antivirals. We will establish
        acceptance criteria for IC₅₀, therapeutic index (SI ≥ 10), and cytokine modulation
        signatures as OoC-based IND-supporting endpoints.
      </li>
      <li>
        <strong>Aim 3: Correlate OoC antiviral response signatures with available human clinical outcome data.</strong>{' '}
        Hypothesis: Transcriptomic signatures from OoC antiviral drug treatment will significantly overlap
        (gene set enrichment analysis, FDR &lt; 0.05) with clinical responder vs. non-responder
        transcriptomic profiles from HCV direct-acting antiviral (DAA) clinical trials. We will
        use publicly available GEO datasets (NCBI) for correlation analysis.
      </li>
    </ol>
    <ApprovalBlock />
  </>
)

/* S06 — NIH Grant Writing: R01 Specific Aims Draft */
const s06: ReactNode = (
  <>
    <H t="NIH R01 Specific Aims — Advisory Draft" />
    <InfoBox>
      <p className="sdoc-p" style={{ marginBottom: 0 }}>
        <strong>PA:</strong> PA-23-xxx (NIAID Antiviral Drug Discovery) ·
        <strong> Title:</strong> "Organ-on-Chip Models for Antiviral Drug Efficacy Assessment in
        High-Containment Pathogens" ·
        <strong> PI:</strong> [Client PI Name] ·
        <strong> Budget period:</strong> 5 years, ~$2.5M direct costs
      </p>
    </InfoBox>

    <H t="Project Narrative" />
    <P>
      High-containment pathogens — including Nipah virus (NiV), SARS-CoV-2, and emerging BSL-3/4
      hemorrhagic fever viruses — represent urgent and unpredictable pandemic threats for which
      effective antiviral countermeasures remain limited. Traditional animal model-based antiviral
      testing is resource-intensive, requires specialized BSL-4 infrastructure, and frequently fails
      to predict human clinical outcomes due to species-specific biology. There is a critical and
      unmet need for human-relevant, scalable, biosafety-compatible in vitro platforms that can
      accelerate antiviral drug discovery without the constraints of animal model-based programs.
    </P>

    <H t="Specific Aims" />
    <ol className="sdoc-ol">
      <li>
        <strong>Aim 1: Establish and characterize BSL-3-compatible human Lung-on-Chip and Liver-on-Chip
        models for high-containment pathogen infection.</strong>
        <br /><em>Rationale:</em> The respiratory and hepatic compartments are primary targets for NiV
        and HCV, respectively, yet current in vitro models (immortalized cell lines) fail to
        recapitulate physiological barrier function, shear stress, and cell-type crosstalk.
        <br /><em>Approach:</em> Establish Emulate Lung-on-Chip (AT2/HMVEC) and CN Bio
        Liver-on-Chip (primary human hepatocytes/Kupffer cells) under BSL-3 conditions. Characterize
        infection kinetics, barrier integrity (TEER), cytokine secretion, and viral replication
        for NiV (Aim 1a), SARS-CoV-2 (Aim 1b), and HCV (Aim 1c). Validate against matched
        hamster/NHP in vivo data.
      </li>
      <li>
        <strong>Aim 2: Validate antiviral drug efficacy readouts and establish OoC-based
        IC₅₀/therapeutic index metrics as IND-supporting endpoints.</strong>
        <br /><em>Rationale:</em> For OoC platforms to replace animal models in regulatory
        submissions, standardized, reproducible, and clinically predictive readouts must be established
        with defined acceptance criteria.
        <br /><em>Approach:</em> Screen six reference antivirals (ribavirin, remdesivir, sofosbuvir,
        NiV fusion inhibitor, SARS-CoV-2 protease inhibitor, neutralizing antibody) across both
        OoC platforms. Calculate IC₅₀, CC₅₀ (CellTiter-Glo), and selectivity index. Correlate
        with matched NHP PK/PD data using Pearson correlation and Bland-Altman analysis.
      </li>
      <li>
        <strong>Aim 3: Define transcriptomic signatures of antiviral drug response in OoC platforms
        and correlate with human clinical outcome datasets.</strong>
        <br /><em>Rationale:</em> Transcriptomic concordance between OoC drug response and human
        clinical responder signatures would provide mechanistic validation of OoC predictive
        capacity and support NAMs regulatory acceptance.
        <br /><em>Approach:</em> Perform RNA-Seq on OoC cells ± antiviral drug treatment at
        72 h. Pathway enrichment analysis (GSEA, Reactome) vs. published HCV DAA responder
        transcriptomes (GEO datasets). Develop predictive biomarker panel (≥10 gene signature)
        for antiviral response classification (AUC ≥ 0.85, cross-validated).
      </li>
    </ol>

    <H t="Innovation & Significance" />
    <P>
      This project is innovative because it is the first to systematically validate OoC-derived
      antiviral efficacy endpoints against BSL-4 in vivo data for Nipah virus — a critical gap
      in both NAMs validation and emerging pathogen preparedness. Success will produce a validated,
      publication-quality OoC antiviral testing framework directly applicable to MCM development
      programs under BARDA and NIAID funding mechanisms.
    </P>
    <ApprovalBlock />
  </>
)

/* S07 — RNA-Seq Data Interpretation Report */
const s07: ReactNode = (
  <>
    <H t="1. Dataset Summary" />
    <InfoBox>
      <p className="sdoc-p" style={{ marginBottom: 0 }}>
        <strong>Dataset:</strong> RNA-Seq, Nipah virus-infected A549 cells ± NiV-Inh-07 (antiviral compound) ·
        <strong> Conditions:</strong> Mock, NiV-infected (MOI 0.1), NiV + inhibitor (1 µM, 10 µM) ·
        <strong> Replicates:</strong> n = 3 biological replicates per condition ·
        <strong> Sequencing:</strong> Illumina NovaSeq 6000, 150 bp PE, ~30M reads/sample
      </p>
    </InfoBox>

    <H t="2. QC Metrics Summary" />
    <table className="sdoc-table">
      <Th cols={['Sample', 'Condition', 'Total Reads (M)', 'Mapping Rate (%)', 'Duplication Rate (%)', 'Insert Size (bp)', 'QC Status']} />
      <tbody>
        {([
          ['A549_Mock_R1',   'Mock',         '32.4', '94.2', '18.3', '182', 'PASS'],
          ['A549_Mock_R2',   'Mock',         '31.8', '93.9', '17.8', '179', 'PASS'],
          ['A549_Mock_R3',   'Mock',         '33.1', '94.5', '19.1', '184', 'PASS'],
          ['A549_NiV_R1',    'NiV infected', '29.7', '91.3', '22.4', '175', 'PASS'],
          ['A549_NiV_R2',    'NiV infected', '30.2', '90.8', '21.9', '178', 'PASS'],
          ['A549_NiV_R3',    'NiV infected', '28.9', '92.1', '23.2', '176', 'PASS'],
          ['A549_Inh1µM_R1', 'NiV+Inh 1µM',  '31.6', '93.7', '19.8', '181', 'PASS'],
          ['A549_Inh10µM_R1','NiV+Inh 10µM', '30.4', '93.2', '20.1', '180', 'PASS'],
        ] as string[][]).map(r => <tr key={r[0]}>{r.map((c,i) => <td key={i}><span className={c === 'PASS' ? 'sdoc-pass' : c === 'FAIL' ? 'sdoc-fail' : ''}>{c}</span></td>)}</tr>)}
      </tbody>
    </table>

    <H t="3. Differential Expression Summary — NiV-infected vs. Mock (Top 10 DEGs)" />
    <table className="sdoc-table">
      <Th cols={['Gene Symbol', 'Gene Name', 'Log₂FC (NiV/Mock)', 'Adjusted p-value', 'Direction', 'Biological Relevance']} />
      <tbody>
        {([
          ['IFIT1',   'IFN-induced protein with tetratricopeptide repeats 1', '+8.42', '1.2×10⁻¹⁸', 'UP', 'ISG; antiviral innate response marker'],
          ['MX1',    'MX dynamin-like GTPase 1', '+7.89', '3.4×10⁻¹⁷', 'UP', 'ISG; primary IFN-α/β signaling reporter'],
          ['ISG15',  'ISG15 ubiquitin-like modifier', '+7.61', '8.1×10⁻¹⁶', 'UP', 'Interferon-stimulated gene; antiviral ubiquitylation'],
          ['OAS3',   '2-5 oligoadenylate synthetase 3', '+6.93', '2.7×10⁻¹⁵', 'UP', 'dsRNA sensor; activates RNase L pathway'],
          ['CXCL10', 'C-X-C motif chemokine 10 (IP-10)', '+6.45', '5.3×10⁻¹⁴', 'UP', 'Inflammatory chemokine; NiV cytokine storm'],
          ['IL6',    'Interleukin-6', '+5.82', '1.1×10⁻¹²', 'UP', 'Pro-inflammatory; cytokine storm mediator'],
          ['TNF',    'Tumor necrosis factor', '+5.17', '4.4×10⁻¹¹', 'UP', 'Pro-apoptotic; NF-κB driven inflammation'],
          ['CASP3',  'Caspase-3', '+4.83', '9.2×10⁻¹⁰', 'UP', 'Apoptosis executioner; NiV-induced cell death'],
          ['CDKN1A', 'Cyclin-dependent kinase inhibitor 1A (p21)', '+3.94', '2.1×10⁻⁸', 'UP', 'Cell cycle arrest; host response to viral replication'],
          ['MKI67',  'Marker of proliferation Ki-67', '-4.28', '7.6×10⁻¹⁰', 'DOWN', 'Reduced cell proliferation consistent with viral CPE'],
        ] as string[][]).map(r => <tr key={r[0]}>{r.map((c,i) => {
          const cls = c === 'UP' ? 'sdoc-high' : c === 'DOWN' ? 'sdoc-low' : ''
          return <td key={i}><span className={cls}>{c}</span></td>
        })}</tr>)}
      </tbody>
    </table>

    <H t="4. Pathway Enrichment Analysis (GSEA — Hallmark Gene Sets)" />
    <table className="sdoc-table">
      <Th cols={['Pathway', 'NES', 'FDR q-value', 'Genes in Set', 'Direction', 'Interpretation']} />
      <tbody>
        {([
          ['Interferon Alpha Response', '+3.41', '< 0.001', '97/97', 'UP', 'Dominant innate antiviral response — NiV triggers strong IFN-α'],
          ['Interferon Gamma Response', '+2.98', '< 0.001', '200/200', 'UP', 'Adaptive immune priming; MHC-I upregulation'],
          ['Inflammatory Response', '+2.74', '< 0.001', '200/200', 'UP', 'NF-κB-driven cytokine storm signature'],
          ['Apoptosis', '+2.31', '0.002', '161/161', 'UP', 'NiV-induced host cell apoptosis via CASP3/CASP7'],
          ['TNF-α via NF-κB Signaling', '+2.18', '0.004', '200/200', 'UP', 'Consistent with NiV-driven inflammatory pathology'],
          ['Oxidative Phosphorylation', '-1.87', '0.018', '200/200', 'DOWN', 'Mitochondrial dysfunction — viral replication burden'],
          ['Cell Cycle G2M Checkpoint', '-2.14', '0.007', '200/200', 'DOWN', 'G2/M arrest consistent with NiV nuclear inclusion bodies'],
          ['MYC Targets V1', '-1.95', '0.012', '200/200', 'DOWN', 'Reduced host anabolism; viral metabolic hijacking'],
        ] as string[][]).map(r => <tr key={r[0]}>{r.map((c,i) => <td key={i}>{c}</td>)}</tr>)}
      </tbody>
    </table>

    <H t="5. Biological Interpretation & Recommended Follow-up" />
    <P>
      NiV infection of A549 cells drives a dominant interferon-stimulated gene (ISG) response with
      concurrent pro-inflammatory cytokine storm (IL-6, CXCL10, TNF-α upregulation). This is
      consistent with the NiV encephalitis pathology characterized by hyperactivated innate immune
      response and neuronal apoptosis. NiV-Inh-07 at 10 µM significantly attenuates the IFN
      response signature (NES reduction from +3.41 to +1.82 at 10 µM; FDR 0.003), suggesting
      partial antiviral activity that reduces viral dsRNA sensing upstream of IFN induction.
    </P>
    <ul className="sdoc-list">
      <li><strong>Recommended follow-up 1:</strong> Validate OAS3 and MX1 downregulation by RT-qPCR array (n=6); these are the strongest candidate compound efficacy biomarkers for future mechanistic studies.</li>
      <li><strong>Recommended follow-up 2:</strong> Correlate CXCL10 and IL-6 RNA upregulation with protein secretion levels (bioplex multiplex) to confirm transcription-to-secretion coupling.</li>
      <li><strong>Recommended follow-up 3:</strong> Perform time-series RNA-Seq (6 h, 24 h, 48 h, 72 h post-infection) to capture early vs. late transcriptomic dynamics for mechanism-of-action characterization of NiV-Inh-07.</li>
    </ul>
    <ApprovalBlock />
  </>
)

/* S08 — Infectious Disease Program Advisory Brief */
const s08: ReactNode = (
  <>
    <H t="1. Current Landscape — Hepatitis B/C/D Portfolio" />
    <P>
      The global HBV/HCV/HDV burden remains substantial: 296 million chronic HBV carriers, 58 million
      chronic HCV infections, and an estimated 12 million HDV co-infections worldwide (WHO 2023).
      Despite curative HCV DAA regimens (SVR12 &gt;97%), a functional cure for HBV — defined as
      HBsAg seroclearance — remains elusive, with current nucleoside analogs suppressing but not
      eliminating cccDNA. HDV represents the most severe form of viral hepatitis with no FDA-approved
      treatment until bulevirtide (2020, EU; 2023, FDA). This advisory brief outlines a strategic
      translational research framework for advancing a next-generation HBV/HDV program.
    </P>

    <H t="2. Funding Opportunity Landscape" />
    <table className="sdoc-table">
      <Th cols={['Opportunity', 'Mechanism', 'IC/Program', 'Budget Range', 'Status', 'Strategic Alignment']} />
      <tbody>
        {([
          ['PA-23-182 Hepatitis B Translational Science', 'R01', 'NIAID/DAIT', '$250K–500K direct/yr', 'Active', 'HBV cccDNA elimination strategies; OoC models specifically encouraged'],
          ['RFA-AI-24-xxx HBV Cure Initiative', 'U19 Cooperative Agreement', 'NIAID', '$2–5M direct/yr', 'Anticipated 2024', 'Consortium model; high priority for in vitro innovation platforms'],
          ['RFA-DK-23-xxx NIDDK HCV/HDV', 'R01/R21', 'NIDDK', '$150K–375K direct/yr', 'Active', 'HDV entry inhibition, RIG-I innate response pathway'],
          ['BARDA mRNA MCM Program', 'OTA/Contract', 'BARDA/HHS', '$500K–50M', 'Solicitation-based', 'mRNA-based HBsAg vaccines and therapeutic MCMs for outbreak preparedness'],
          ['Bill & Melinda Gates Foundation', 'Grant', 'BMGF', 'Up to $5M', 'Open cycle', 'Global health equity; HBV maternal-infant transmission prevention'],
          ['US-Japan CMSM — Hepatitis Panel', 'Bilateral program', 'NIH/NIAID + Japan AMED', 'Collaborative', '2025 cycle active', 'HCV/HBV; direct access via BioViro CMSM Secretariat relationship'],
        ] as string[][]).map(r => <tr key={r[0]}>{r.map((c,i) => <td key={i}>{c}</td>)}</tr>)}
      </tbody>
    </table>

    <H t="3. Strategic Recommendations" />
    <ol className="sdoc-ol">
      <li>
        <strong>In vitro model innovation — Liver-on-Chip for HBV cccDNA persistence:</strong>{' '}
        The primary gap in HBV research is the absence of a long-term culture system that supports
        cccDNA persistence, HBeAg/HBsAg secretion, and the HBV-specific immunological niche. We
        recommend prioritizing CN Bio PhysioMimix Liver-on-Chip with HepaRG/Kupffer co-culture as
        the primary discovery platform — capable of &gt;28-day HBV infection with detectable
        cccDNA by droplet digital PCR (ddPCR). This positions the program as a first-mover in
        NAMs-based HBV cure research and directly aligns with PA-23-182 specific aims language.
      </li>
      <li>
        <strong>mRNA MCM strategy — mRNA-based HBsAg therapeutic vaccine:</strong>{' '}
        The BioViro mRNA vaccine platform (validated in YFV and RSV programs) is directly
        applicable to a therapeutic HBsAg mRNA vaccine designed to break immune tolerance in
        chronic HBV. Target: m1Ψ-modified mRNA encoding large HBsAg (L-HBsAg) + LNP-adjuvanted
        delivery. This strategy aligns with BARDA mRNA MCM solicitations and the emerging NIAID
        HBV cure portfolio priority.
      </li>
      <li>
        <strong>US-Japan CMSM program alignment:</strong>{' '}
        BioViro's 2025 CMSM Secretariat role provides direct access to the US-Japan hepatitis
        research panel, which is prioritizing HCV elimination and HBV functional cure. We recommend
        leveraging this network for bilateral pilot study funding (US-Japan Collaborative Research
        Program, $150K/year ceiling) and co-publication opportunities with Japanese HBV research
        groups (AMED-funded) to strengthen an R01 application's preliminary data section.
      </li>
    </ol>

    <H t="4. Public-Private Partnership Opportunities" />
    <ul className="sdoc-list">
      <li><strong>Gilead Sciences:</strong> Active interest in HBV cure combinations; open innovation portal accepts academic collaborations for cccDNA elimination strategies.</li>
      <li><strong>Assembly Biosciences / Arrowhead Pharmaceuticals:</strong> RNAi/RNA therapeutic approaches to HBV — potential co-development of OoC platform for compound profiling.</li>
      <li><strong>Roche / Genentech:</strong> HBV combination cure program; potential sponsored research agreement for Liver-on-Chip antiviral profiling.</li>
      <li><strong>CEPI (Coalition for Epidemic Preparedness Innovations):</strong> HDV/HBV vaccines aligned with CEPI 100-Day Mission; rapid vaccine development funding mechanism.</li>
    </ul>
    <ApprovalBlock />
  </>
)

export const SERVICE_SAMPLES: ServiceSample[] = [
  {
    serviceNum: '01',
    docType: 'Advisory Brief',
    docTitle: 'mRNA Vaccine Design & LNP Formulation Strategy — YFV-mRNA-LNP',
    docNumber: 'BVS-ADV-001',
    version: '1.0',
    date: '2025-07-01',
    classification: 'SAMPLE',
    content: s01,
  },
  {
    serviceNum: '02',
    docType: 'Study Design Protocol',
    docTitle: 'Antiviral In Vitro Study Design — NiV-1 Inhibitor Compound (NiV-Inh-07)',
    docNumber: 'BVS-SDP-002',
    version: '1.0',
    date: '2025-07-01',
    classification: 'SAMPLE',
    content: s02,
  },
  {
    serviceNum: '03',
    docType: 'Platform Advisory',
    docTitle: 'Organ-on-Chip Platform Selection Advisory — Antiviral Drug Development Program',
    docNumber: 'BVS-OOC-003',
    version: '1.0',
    date: '2025-07-01',
    classification: 'SAMPLE',
    content: s03,
  },
  {
    serviceNum: '04',
    docType: 'Compliance Report',
    docTitle: '3Rs Justification & NAMs Implementation Report — BSL-3/4 Antiviral Program',
    docNumber: 'BVS-3RS-004',
    version: '1.0',
    date: '2025-07-01',
    classification: 'SAMPLE',
    content: s04,
  },
  {
    serviceNum: '05',
    docType: 'Writing Advisory',
    docTitle: 'Manuscript Preparation Advisory — Draft Abstract & NIH R01 Specific Aims',
    docNumber: 'BVS-WRT-005',
    version: '1.0',
    date: '2025-07-01',
    classification: 'SAMPLE',
    content: s05,
  },
  {
    serviceNum: '06',
    docType: 'NIH Grant Advisory',
    docTitle: 'NIH R01 Specific Aims Draft — Organ-on-Chip Antiviral Platform (PA-23-xxx)',
    docNumber: 'BVS-GRT-006',
    version: '1.0',
    date: '2025-07-01',
    classification: 'SAMPLE',
    content: s06,
  },
  {
    serviceNum: '07',
    docType: 'Data Analysis Report',
    docTitle: 'RNA-Seq Data Interpretation Report — NiV-Infected A549 Cells ± Antiviral',
    docNumber: 'BVS-DAR-007',
    version: '1.0',
    date: '2025-07-01',
    classification: 'SAMPLE',
    content: s07,
  },
  {
    serviceNum: '08',
    docType: 'Program Advisory Brief',
    docTitle: 'Translational Research Program Advisory — HBV/HCV/HDV Portfolio Strategy',
    docNumber: 'BVS-PAB-008',
    version: '1.0',
    date: '2025-07-01',
    classification: 'SAMPLE',
    content: s08,
  },
]
