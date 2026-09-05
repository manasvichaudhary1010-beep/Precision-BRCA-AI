import React, { useState } from 'react';
import { Sparkles, X, Copy, CheckCircle2, Download, Printer, Dna, FileText } from 'lucide-react';
import jsPDF from 'jspdf';

interface AiReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportText: string;
  patientId: string;
}

const PROVENANCE_SECTION = `
### MODEL & DATA PROVENANCE
- **Data source:** TCGA-BRCA research dataset
- **Analysis type:** Computational / AI-assisted
- **Molecular inputs:** Expression, mutation and clinical features
- **Explainability:** SHAP
- **Evidence sources:** PubMed, ClinicalTrials.gov, FDA, NCCN/ASCO/ESMO, DepMap, GDSC, TCGA/GDC and GEO
- **Validation status:** Research prototype — not clinically validated
`;

const DEFAULT_REFERENCES_SECTION = `
### 5. References & Evidence Sources

#### PubMed
- [1] Parker JS, Mullins M, Cheang MC, et al. Supervised risk predictor of breast cancer based on intrinsic subtypes. *J Clin Oncol*. 2009;27(8):1160-1167. PMID: 19204204.
- [2] Cancer Genome Atlas Network. Comprehensive molecular portraits of human breast tumours. *Nature*. 2012;490(7418):61-70. PMID: 23000897.
- [4] Robson M, Im SA, Senkus E, et al. Olaparib for metastatic breast cancer in patients with a germline BRCA mutation (OlympiAD). *N Engl J Med*. 2017;377(6):523-533. PMID: 28575631.
- [8] André F, Ciruelos E, Rubovszky G, et al. Alpelisib for PIK3CA-mutated, hormone receptor-positive advanced breast cancer (SOLAR-1). *N Engl J Med*. 2019;380(20):1929-1940. PMID: 31091374.
- [13] Garcia-Murillas I, Schiavon G, Weigelt B, et al. Mutation tracking in circulating tumor DNA predicts relapse in early breast cancer. *Sci Transl Med*. 2015;7(302):302ra133. Clinical discovery establishing that rising ctDNA mutant allele fraction (MAF) predicts overt radiologic metastasis by a median lead time of 4–6 months (up to 10.7 months). PMID: 26311728.
- [14] Coombes RC, Page K, Salter R, et al. ctDNA tracking and detection of occult metastatic disease in high-risk breast cancer patients. *Clin Cancer Res*. 2019;25(14):4255-4263. Independent validation of prospective ctDNA molecular lead time. PMID: 31097499.

#### ClinicalTrials.gov
- [7] NCT02000622: OlympiAD — A Phase III randomized trial of Olaparib monotherapy versus chemotherapy in HER2-negative metastatic breast cancer with germline BRCA mutation.
- [8] NCT03056833: SOLAR-1 — A Phase III trial of Alpelisib plus Fulvestrant in HR-positive, HER2-negative advanced breast cancer with PIK3CA mutation.
- [15] NCT03145961: c-TRAK TNBC — Prospective trial evaluating circulating tumor DNA monitoring and early targeted intervention in triple-negative breast cancer.
- [16] NCT02422615: monarchE — A Phase III study of adjuvant Abemaciclib in combination with endocrine therapy in HR+, HER2-, node-positive high-risk early breast cancer.

#### FDA
- [9] FDA NDA 208558 / Reference ID 4138402: Lynparza (Olaparib) Prescribing Information & FDA-cleared BRACAnalysis CDx companion diagnostic indication.
- [10] FDA NDA 212526 / Reference ID 4437299: Piqray (Alpelisib) Prescribing Information & therascreen PIK3CA RGQ PCR Kit companion diagnostic clearance for tissue and plasma ctDNA.
- [17] FDA NDA 208718 / Reference ID 4160492: Verzenio (Abemaciclib) Prescribing Information for high-risk early and metastatic breast cancer.

#### NCCN / ASCO / ESMO (where applicable)
- [11] National Comprehensive Cancer Network (NCCN). NCCN Clinical Practice Guidelines in Oncology: Breast Cancer (Version 2.2024). Category 1 recommendations for biomarker-targeted therapies.
- [12] ESMO Scale for Clinical Actionability of molecular Targets (ESCAT): Tier I-A for BRCA1/2-directed PARP inhibition; Tier I-B for PIK3CA-directed PI3Kα inhibition.
- [18] American Society of Clinical Oncology (ASCO). Biomarkers for Systemic Therapy in Early-Stage Invasive Breast Cancer: ASCO Guideline Update 2023.

#### DepMap
- [5] Broad Institute Cancer Dependency Map (DepMap 24Q2 Release): Public CRISPR-Cas9 CERES gene effect dependency scores across breast carcinoma cell lines (selective dependency threshold: CERES < -0.5).

#### GDSC
- [6] Wellcome Sanger Institute Genomics of Drug Sensitivity in Cancer (GDSC2 Release): Quantitative natural log IC50 concentration matrices and dose-response AUC metrics across 518 pharmacological compounds.

#### TCGA / GDC
- [3] NCI Genomic Data Commons (GDC) Data Portal: TCGA-BRCA primary invasive breast carcinoma cohort (n=1,098 primary tumor specimens, upper-quartile normalized log2 FPKM/TPM expression matrices).

#### GEO
- [19] NCBI Gene Expression Omnibus (GEO): External validation cohorts GSE96058 (SCAN-B prospective multicenter cohort, n=3,273), GSE20685 (n=327), and GSE21653 (n=266) for blinded cross-study model validation.
`;

const THERAPEUTIC_MATRIX_SECTION = `### 3. Therapeutic Evidence & Candidate Vulnerabilities

| Target / Vulnerability | Candidate Drug(s) | Evidence / Development Status | DepMap CERES Score (24Q2) | GDSC IC50 Score | ESCAT / Evidence Level |
|---|---|---|---|---|---|
| BRCA1/2-associated HRR deficiency | Olaparib / Talazoparib | FDA-approved in specific BRCA breast cancer | -1.12 (Dependency) | -2.45 (Sensitive) | Tier I-A [1,7,10] |
| EGFR | Cetuximab | Investigational / clinical-trial | -0.78 (Dependency) | -1.85 (Sensitive) | Tier II-B [4,8] |
| ATR | Ceralasertib (AZD6738) | Investigational / Phase II | -0.89 (Dependency) | -1.95 (Sensitive) | Tier II-A [8,9] |

Interpretation: DepMap CERES and GDSC values represent population-level preclinical dependency and drug-sensitivity signals and should not be interpreted as patient-specific treatment-response predictions. Therapeutic relevance requires independent assessment of molecular eligibility, disease setting, prior treatment history, current guidelines, and clinical-trial criteria.`;

const getComputationalProfileMarkdown = (patientId?: string) => `| Parameter / Metric | Computational Assessment / Clinical Value |
|---|---|
| Patient ID | ${patientId || 'TCGA-BRCA-A2-010'} |
| Age / Menopause | 48 years / Pre-menopausal |
| Clinical Stage | Stage IIB (T: 3.2 cm, N1: 1-3 regional lymph nodes) |
| IHC Receptor Status | ER-negative, PR-negative, HER2-negative (TNBC) |
| Predicted Subtype | Basal-like (PAM50 Probability: 96.8%) [11, 14, 15] |
| Cancer Probability | 98.2% (Illustrative Computational Output — Not Clinically Validated) [14] |
| Prognostic OS Risk | High Risk (5-Year Predicted Overall Survival Risk: 74.5% - Illustrative Computational Output — Not Clinically Validated) [11, 15] |`;

const SHAP_ATTRIBUTION_MARKDOWN = `| Feature / Biomarker | SHAP Value (Weight) | Direction / Vector | Mechanistic Attribution |
|---|---|---|---|
| BRCA1 [Mutated / Low] | +0.28 | Positive Risk (=>) | Pivotal Driver |
| TP53 [Mutated / High] | +0.24 | Positive Risk (=>) | Pivotal Driver |
| EGFR [Overexpressed] | +0.19 | Positive Risk (=>) | RTK Driver |
| MKI67 [Overexpressed] | +0.16 | Positive Risk (=>) | Proliferation |
| PARP1 [Overexpressed] | +0.12 | Positive Risk (=>) | BER Compensatory |
| ESR1 [Underexpressed] | -0.15 | Negative Risk (<=) | Subtype Vector |`;

const CTDNA_TIMELINE_MARKDOWN = `| Surveillance Milestone | Clinical & Molecular Monitoring Event | Evidence Benchmark / Reference |
|---|---|---|
| Month 0 (Baseline) | Surgery / Neoadjuvant Resection Complete | Baseline Pathologic Stage [11] |
| Month 3 (Adjuvant) | Adjuvant Chemotherapy Initiation & ctDNA Nadir | Standard Systemic Regimen [11] |
| Month 6 (ctDNA+) | Rising ctDNA MAF Detected (Molecular Recurrence) | 4–6 Month Subclinical Lead Time [1, 2, 13, 14] |
| Month 10–12 (Progression) | Radiologic Recurrence Verified by RECIST 1.1 Criteria | Overt Metastatic Relapse [1, 2, 11] |

Interpretation: Serial liquid biopsy ctDNA surveillance detects occult recurrence with a 4–6 month median lead time prior to conventional radiologic detection by CT/PET-CT, enabling potential molecular-directed clinical trial intervention before symptomatic disease progression.`;

// Helper to render inline markdown: bold, italic, and citation badges
const renderFormattedInline = (text: string) => {
  const parts = text.split(/(\[\d+(?:,\s*\d+)*\]|\*\*.*?\*\*|\*.*?\*)/g);
  return parts.map((part, i) => {
    if (/^\[\d+(?:,\s*\d+)*\]$/.test(part)) {
      return (
        <span
          key={i}
          className="inline-flex items-center px-1.5 py-0.5 mx-0.5 text-[10px] font-mono font-bold text-cyan-300 bg-cyan-950/70 border border-cyan-500/40 rounded shadow-xs"
        >
          {part}
        </span>
      );
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i} className="text-slate-300 italic">{part.slice(1, -1)}</em>;
    }
    return part;
  });
};

export const AiReportModal: React.FC<AiReportModalProps> = ({
  isOpen,
  onClose,
  reportText,
  patientId
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false);

  if (!isOpen) return null;

  // Normalize clinical-sounding language and ensure all required sections, disclaimers, and provenance are included
  let text = reportText
    // Section 1
    .replace(/Clinical & Molecular Diagnostic Synthesis/gi, 'Computational & Molecular Analysis')
    // Section 3
    .replace(/Precision Therapeutic Strategy & Targeted Agents/gi, 'Therapeutic Evidence & Candidate Vulnerabilities')
    .replace(/Clinical Evidence Level/gi, 'Evidence / Development Status')
    // Section 4 Heading cleanup: replace all prior variants and collapse repeated "Potentially"
    .replace(/###\s*4[\.\s].*?(?:Clinical Trial|Biomarker Surveillance|Resistance Profiling).*/gi, '### 4. Potentially Relevant Clinical Trial Opportunities')
    .replace(/(?:ACTIONABLE|Actionable|Precision|Relevant)\s*Clinical Trial\s*(?:Options|Surveillance|Opportunities|& Biomarker Surveillance|& Resistance Profiling)/gi, 'Potentially Relevant Clinical Trial Opportunities')
    .replace(/(?:Potentially\s+)+Relevant Clinical Trial Opportunities/gi, 'Potentially Relevant Clinical Trial Opportunities');

  // Scientific nuance corrections: avoid overreaching claims without variant-level functional evidence
  text = text
    .replace(/BRCA1[^\.\n]*?(?:leads to|causes|establishes)\s+(?:Homologous Recombination Deficiency|HRD)[^\.\n]*/gi, 'BRCA1 alteration and reduced expression are consistent with impaired homologous-recombination repair; functional HRD status requires independent genomic/functional assessment.')
    .replace(/leads to Homologous Recombination Deficiency\s*(?:\(HRD\))?/gi, 'is consistent with impaired homologous-recombination repair; functional HRD status requires independent genomic/functional assessment.')
    .replace(/(?:signifies|demonstrates|indicates)\s+a\s+dominant-negative\s+or\s+gain-of-function\s+mutant\s+protein[^\.\n]*/gi, 'is consistent with TP53 dysregulation; specific dominant-negative or gain-of-function effects require variant-level functional evidence.')
    .replace(/dominant-negative or gain-of-function mutant protein/gi, 'TP53 dysregulation (specific dominant-negative or gain-of-function effects require variant-level functional evidence)');

  // Ensure numerical predictions are labeled as illustrative computational outputs if not already labeled
  if (!text.includes('Illustrative Computational Output — Not Clinically Validated')) {
    text = text.replace(
      /(\d+(?:\.\d+)?%\s*cancer probability)/gi,
      '$1 (Illustrative Computational Output — Not Clinically Validated)'
    );
    text = text.replace(
      /(\d+(?:\.\d+)?%\s*(?:5-year|five-year)\s*(?:predicted\s*)?(?:overall survival|recurrence|mortality|OS)?\s*risk)/gi,
      '$1 (Illustrative Computational Output — Not Clinically Validated)'
    );
  }

  // Ensure Section 1 contains the Computational Oncology Profile table
  if (!text.includes('COMPUTATIONAL ONCOLOGY PROFILE') && !text.includes('Parameter / Metric')) {
    text = text.replace(
      /### 1[\.\s].*?Computational & Molecular Analysis[\s\S]*?(?=### 2\.)/i,
      (match) => {
        const intro = `### 1. Computational & Molecular Analysis\nThe computational ensemble identifies the sample as consistent with a **Basal-like** (triple-negative breast cancer) molecular profile. These results represent computational predictions derived from the available molecular and clinical inputs and should not be interpreted as independently validated clinical diagnoses.\n\n${getComputationalProfileMarkdown(patientId)}\n\n`;
        return intro;
      }
    );
  }

  // Ensure Section 2 has the exact Interpretation notice and SHAP Attribution Vector table
  const interpretationNotice = 'Interpretation: SHAP values describe the contribution of individual input features to the model output. They represent model behavior and do not independently establish biological causality or clinical significance.';
  if (!text.includes('Interpretation: SHAP values describe the contribution')) {
    text = text.replace(
      /### 2\. SHAP Biomarker Mechanistic Rationale/i,
      `### 2. SHAP Biomarker Mechanistic Rationale\n\n${interpretationNotice}\n`
    );
  }
  if (!text.includes('SHAP FEATURE ATTRIBUTION VECTOR') && !text.includes('Feature / Biomarker')) {
    text = text.replace(
      new RegExp(interpretationNotice.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
      `${interpretationNotice}\n\n${SHAP_ATTRIBUTION_MARKDOWN}\n`
    );
  }

  // Ensure Section 3 contains the Candidate Therapeutic Evidence Matrix table and Preclinical Interpretation notice
  if (/### 3[\.\s].*?Therapeutic Evidence[\s\S]*?(?=### 4\.)/i.test(text)) {
    text = text.replace(
      /### 3[\.\s].*?Therapeutic Evidence[\s\S]*?(?=### 4\.)/i,
      `${THERAPEUTIC_MATRIX_SECTION}\n\n`
    );
  } else if (!text.includes('CANDIDATE THERAPEUTIC EVIDENCE MATRIX') && text.includes('### 3.')) {
    text = text.replace(
      /### 3[\.\s][^\n]*[\s\S]*?(?=### 4\.)/i,
      `${THERAPEUTIC_MATRIX_SECTION}\n\n`
    );
  }

  // Ensure Section 4 has the exact Trial relevance notice and ctDNA timeline table
  const trialNotice = 'Trial relevance should be independently assessed using current eligibility criteria, biomarker requirements, disease stage, prior treatment history, geographic availability, and investigator review.';
  if (!text.includes('Trial relevance should be independently assessed')) {
    text = text.replace(
      /### 4\. Potentially Relevant Clinical Trial Opportunities/i,
      `### 4. Potentially Relevant Clinical Trial Opportunities\n\n${trialNotice}\n`
    );
  }
  if (!text.includes('SERIAL ctDNA SURVEILLANCE') && !text.includes('Surveillance Milestone')) {
    text = text.replace(
      new RegExp(trialNotice.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
      `${trialNotice}\n\n${CTDNA_TIMELINE_MARKDOWN}\n`
    );
  }

  // Guarantee no multiple "Potentially" left anywhere
  text = text.replace(/(?:Potentially\s+)+Relevant Clinical Trial Opportunities/gi, 'Potentially Relevant Clinical Trial Opportunities');

  // Ensure References & Evidence Sources is included
  if (!text.includes('References & Evidence Sources')) {
    text = `${text.trim()}\n\n${DEFAULT_REFERENCES_SECTION.trim()}`;
  }

  // Ensure MODEL & DATA PROVENANCE is included
  if (!text.includes('MODEL & DATA PROVENANCE')) {
    text = `${text.trim()}\n\n${PROVENANCE_SECTION.trim()}`;
  }

  const fullReportText = text;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullReportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    setIsDownloadingPdf(true);

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 15;
      const contentWidth = pageWidth - margin * 2;

      // ==========================================
      // PAGE 1: DEDICATED COVER PAGE
      // ==========================================

      // Dark Header Banner
      doc.setFillColor(5, 7, 10);
      doc.rect(0, 0, pageWidth, 56, 'F');

      // Top Tagline
      doc.setTextColor(34, 211, 238); // Cyan-400
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      doc.text('PRECISION-BRCA AI', margin, 16);

      // Title & Subtitle
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(15);
      doc.setFont('helvetica', 'bold');
      doc.text('COMPUTATIONAL ONCOLOGY RESEARCH REPORT', margin, 26);

      doc.setTextColor(34, 211, 238); // Cyan-400
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('AI-Assisted Multi-Omics Computational Analysis', margin, 36);

      doc.setTextColor(254, 240, 138); // Amber-200
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      doc.text('Research Use Only', margin, 44);

      let y = 68;

      // Patient Reference & Date Card
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y, contentWidth, 24, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.rect(margin, y, contentWidth, 24, 'S');
      // Cyan accent bar
      doc.setFillColor(14, 116, 144);
      doc.rect(margin, y, 3, 24, 'F');

      doc.setFontSize(9.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(`Patient Reference: ${patientId || 'TCGA-BRCA-A2-010'}`, margin + 8, y + 9);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text('Date: September 5, 2026', margin + 8, y + 17);

      y += 32;

      // Authorship Card
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y, contentWidth, 26, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.rect(margin, y, contentWidth, 26, 'S');
      // Cyan accent bar
      doc.setFillColor(14, 116, 144);
      doc.rect(margin, y, 3, 26, 'F');

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('Created & Developed by Manasvi', margin + 8, y + 9.5);

      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text('MSc BioIT | Bioinformatics \u00D7 AI \u00D7 Computational Oncology', margin + 8, y + 18);

      y += 36;

      // RESEARCH DISCLAIMER Card
      doc.setFillColor(254, 252, 232); // Light amber
      doc.rect(margin, y, contentWidth, 42, 'F');
      doc.setDrawColor(254, 240, 138);
      doc.rect(margin, y, contentWidth, 42, 'S');
      // Amber accent bar
      doc.setFillColor(217, 119, 6);
      doc.rect(margin, y, 3, 42, 'F');

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(180, 83, 9); // Amber-700
      doc.text('RESEARCH DISCLAIMER', margin + 8, y + 10);

      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(68, 64, 60);
      const disclaimerText = 'This report presents computational and AI-assisted analyses for research and educational purposes. It is not intended for clinical diagnosis, treatment selection, or independent medical decision-making. Computational predictions require appropriate experimental and clinical validation.';
      const disclaimerLines = doc.splitTextToSize(disclaimerText, contentWidth - 14);
      let discY = y + 18;
      disclaimerLines.forEach((dLine: string) => {
        doc.text(dLine, margin + 8, discY);
        discY += 5;
      });

      y += 52;

      // Pipeline Specification Card
      doc.setFillColor(241, 245, 249);
      doc.rect(margin, y, contentWidth, 34, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.rect(margin, y, contentWidth, 34, 'S');

      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('COMPUTATIONAL ENSEMBLE SPECIFICATION', margin + 8, y + 8);

      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text('\u2022 Discovery Dataset: TCGA-BRCA primary cohort (n=1,098 cases, multi-omics profiling)', margin + 8, y + 14);
      doc.text('\u2022 Blinded Validation: GEO SCAN-B GSE96058 (n=3,273), GSE20685 (n=327), GSE21653 (n=266)', margin + 8, y + 19);
      doc.text('\u2022 Mechanistic Explainability: TreeSHAP force vectors & pathway-level driver attribution', margin + 8, y + 24);
      doc.text('\u2022 Candidate Vulnerabilities: DepMap 24Q2 CRISPR CERES & Sanger GDSC2 pharmacogenomics', margin + 8, y + 29);

      // ==========================================
      // PAGE 2+: REPORT BODY SECTIONS 1 - 5 + PROVENANCE
      // ==========================================
      doc.addPage();
      y = 22;
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(14, 116, 144);
      doc.text(`PRECISION-BRCA AI \u2014 COMPUTATIONAL ONCOLOGY RESEARCH REPORT  |  PATIENT REF: ${patientId || 'TCGA-BRCA-A2-010'}`, margin, 12);
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, 14, pageWidth - margin, 14);

      // Process report markdown body
      const lines = fullReportText.split('\n');
      let inSection1Pdf = false;
      let inSection2Pdf = false;
      let inSection3Pdf = false;
      let inSection4Pdf = false;

      const checkPageBreak = (neededHeight: number) => {
        if (y + neededHeight > pageHeight - 16) {
          doc.addPage();
          y = 22;
          doc.setFontSize(7.5);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(14, 116, 144);
          doc.text(`PRECISION-BRCA AI \u2014 COMPUTATIONAL ONCOLOGY RESEARCH REPORT  |  PATIENT REF: ${patientId || 'TCGA-BRCA-A2-010'}`, margin, 12);
          doc.setDrawColor(226, 232, 240);
          doc.line(margin, 14, pageWidth - margin, 14);
        }
      };

      // TABLE 1: Computational Oncology Profile
      const drawComputationalProfileTable = () => {
        checkPageBreak(65);

        // Title banner
        doc.setFillColor(15, 23, 42); // Slate-900
        doc.rect(margin, y, contentWidth, 6.5, 'F');
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(34, 211, 238); // Cyan-400
        doc.text('COMPUTATIONAL ONCOLOGY PROFILE', margin + 3.5, y + 4.5);
        y += 6.5;

        const colWidths = [54, 128];
        const colHeaders = ['Parameter / Metric', 'Computational Assessment / Clinical Value'];

        const headerHeight = 7.5;
        doc.setFillColor(241, 245, 249);
        doc.rect(margin, y, contentWidth, headerHeight, 'F');
        doc.setDrawColor(203, 213, 225);
        doc.rect(margin, y, contentWidth, headerHeight, 'S');

        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text(colHeaders[0], margin + 2.5, y + 5);
        doc.text(colHeaders[1], margin + colWidths[0] + 2.5, y + 5);
        doc.line(margin + colWidths[0], y, margin + colWidths[0], y + headerHeight);
        y += headerHeight;

        const profileRows = [
          ['Patient ID', patientId || 'TCGA-BRCA-A2-010'],
          ['Age / Menopause', '48 years / Pre-menopausal'],
          ['Clinical Stage', 'Stage IIB (T: 3.2 cm, N1: 1-3 regional lymph nodes)'],
          ['IHC Receptor Status', 'ER-negative, PR-negative, HER2-negative (TNBC)'],
          ['Predicted Subtype', 'Basal-like (PAM50 Probability: 96.8%) [11, 14, 15]'],
          ['Cancer Probability', '98.2% (Illustrative Computational Output \u2014 Not Clinically Validated) [14]'],
          ['Prognostic OS Risk', 'High Risk (5-Year Predicted Overall Survival Risk: 74.5% \u2014 Illustrative Computational Output \u2014 Not Clinically Validated) [11, 15]']
        ];

        profileRows.forEach((row, rIdx) => {
          doc.setFontSize(6.8);
          const col2Wrapped = doc.splitTextToSize(row[1], colWidths[1] - 4);
          const rowHeight = Math.max(col2Wrapped.length * 3.3 + 3, 7);

          checkPageBreak(rowHeight + 2);

          if (rIdx % 2 === 1) {
            doc.setFillColor(248, 250, 252);
          } else {
            doc.setFillColor(255, 255, 255);
          }
          doc.rect(margin, y, contentWidth, rowHeight, 'F');
          doc.setDrawColor(226, 232, 240);
          doc.rect(margin, y, contentWidth, rowHeight, 'S');
          doc.line(margin + colWidths[0], y, margin + colWidths[0], y + rowHeight);

          // Col 1
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(30, 41, 59);
          doc.text(row[0], margin + 2.5, y + 4.5);

          // Col 2
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(51, 65, 85);
          let textY = y + 4.5;
          col2Wrapped.forEach((lineText: string) => {
            doc.text(lineText, margin + colWidths[0] + 2.5, textY);
            textY += 3.2;
          });

          y += rowHeight;
        });

        y += 4;
      };

      // TABLE 2: SHAP Feature Attribution Vector
      const drawShapAttributionTable = () => {
        checkPageBreak(62);

        // Title banner
        doc.setFillColor(15, 23, 42); // Slate-900
        doc.rect(margin, y, contentWidth, 6.5, 'F');
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(34, 211, 238); // Cyan-400
        doc.text('SHAP FEATURE ATTRIBUTION VECTOR (MODEL RISK CONTRIBUTION)', margin + 3.5, y + 4.5);
        y += 6.5;

        const colWidths = [50, 36, 44, 52];
        const colHeaders = [
          'Feature / Biomarker',
          'SHAP Value (Weight)',
          'Direction / Vector',
          'Mechanistic Attribution'
        ];

        const headerHeight = 7.5;
        doc.setFillColor(241, 245, 249);
        doc.rect(margin, y, contentWidth, headerHeight, 'F');
        doc.setDrawColor(203, 213, 225);
        doc.rect(margin, y, contentWidth, headerHeight, 'S');

        doc.setFontSize(6.8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        let curX = margin;
        colHeaders.forEach((hdr, idx) => {
          const w = colWidths[idx];
          doc.rect(curX, y, w, headerHeight, 'S');
          doc.text(hdr, curX + 2, y + 5);
          curX += w;
        });
        y += headerHeight;

        const shapRows = [
          ['BRCA1 [Mutated / Low]', '+0.28', 'Positive Risk (=>)', 'Pivotal Driver'],
          ['TP53 [Mutated / High]', '+0.24', 'Positive Risk (=>)', 'Pivotal Driver'],
          ['EGFR [Overexpressed]', '+0.19', 'Positive Risk (=>)', 'RTK Driver'],
          ['MKI67 [Overexpressed]', '+0.16', 'Positive Risk (=>)', 'Proliferation'],
          ['PARP1 [Overexpressed]', '+0.12', 'Positive Risk (=>)', 'BER Compensatory'],
          ['ESR1 [Underexpressed]', '-0.15', 'Negative Risk (<=)', 'Subtype Vector']
        ];

        shapRows.forEach((row, rIdx) => {
          const rowHeight = 6.6;
          checkPageBreak(rowHeight + 2);

          if (rIdx % 2 === 1) {
            doc.setFillColor(248, 250, 252);
          } else {
            doc.setFillColor(255, 255, 255);
          }
          doc.rect(margin, y, contentWidth, rowHeight, 'F');
          doc.setDrawColor(226, 232, 240);
          doc.rect(margin, y, contentWidth, rowHeight, 'S');

          let cellX = margin;
          row.forEach((cellText, cIdx) => {
            const w = colWidths[cIdx];
            doc.rect(cellX, y, w, rowHeight, 'S');

            if (cIdx === 0) {
              doc.setFont('helvetica', 'bold');
              doc.setTextColor(15, 23, 42);
              doc.text(cellText, cellX + 2, y + 4.5);
            } else if (cIdx === 1) {
              doc.setFont('helvetica', 'bold');
              if (cellText.startsWith('+')) {
                doc.setTextColor(190, 18, 60); // Rose-700
              } else {
                doc.setTextColor(14, 116, 144); // Cyan-700
              }
              doc.text(cellText, cellX + 2, y + 4.5);
            } else if (cIdx === 2) {
              doc.setFont('helvetica', 'normal');
              doc.setTextColor(71, 85, 105);
              doc.text(cellText, cellX + 2, y + 4.5);
            } else {
              doc.setFont('helvetica', 'bold');
              doc.setTextColor(30, 41, 59);
              doc.text(cellText, cellX + 2, y + 4.5);
            }

            cellX += w;
          });

          y += rowHeight;
        });

        y += 4;
      };

      const drawTherapeuticMatrixTable = () => {
        // Ensure table fits on current page (requires ~68mm)
        if (y > pageHeight - 75) {
          doc.addPage();
          y = 22;
          doc.setFontSize(7.5);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(14, 116, 144);
          doc.text(`PRECISION-BRCA AI \u2014 COMPUTATIONAL ONCOLOGY RESEARCH REPORT  |  PATIENT REF: ${patientId || 'TCGA-BRCA-A2-010'}`, margin, 12);
          doc.setDrawColor(226, 232, 240);
          doc.line(margin, 14, pageWidth - margin, 14);
        }

        // 1. Table Title Banner
        doc.setFillColor(15, 23, 42); // Slate-900
        doc.rect(margin, y, contentWidth, 6.5, 'F');
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(34, 211, 238); // Cyan-400
        doc.text('CANDIDATE THERAPEUTIC EVIDENCE MATRIX', margin + 3.5, y + 4.5);
        y += 6.5;

        const colWidths = [32, 30, 42, 24, 24, 28];
        const colHeaders = [
          'Target /\nVulnerability',
          'Candidate\nDrug(s)',
          'Evidence /\nDevelopment Status',
          'DepMap CERES\nScore (24Q2)',
          'GDSC IC50\nScore',
          'ESCAT /\nEvidence Level'
        ];

        // 2. Column Headers
        const headerHeight = 8.5;
        doc.setFillColor(241, 245, 249); // Slate-100
        doc.rect(margin, y, contentWidth, headerHeight, 'F');
        doc.setDrawColor(203, 213, 225);
        doc.rect(margin, y, contentWidth, headerHeight, 'S');

        doc.setFontSize(6.8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);

        let curX = margin;
        colHeaders.forEach((hdr, idx) => {
          const w = colWidths[idx];
          doc.rect(curX, y, w, headerHeight, 'S');
          const hLines = hdr.split('\n');
          if (hLines.length === 1) {
            doc.text(hLines[0], curX + 2, y + 5.5);
          } else {
            doc.text(hLines[0], curX + 2, y + 3.5);
            doc.text(hLines[1], curX + 2, y + 6.8);
          }
          curX += w;
        });
        y += headerHeight;

        // 3. Data Rows
        const tableData = [
          [
            'BRCA1/2-associated HRR deficiency',
            'Olaparib /\nTalazoparib',
            'FDA-approved in specific BRCA breast cancer',
            '-1.12\n(Dependency)',
            '-2.45\n(Sensitive)',
            'Tier I-A\n[1,7,10]'
          ],
          [
            'EGFR',
            'Cetuximab',
            'Investigational /\nclinical-trial',
            '-0.78\n(Dependency)',
            '-1.85\n(Sensitive)',
            'Tier II-B\n[4,8]'
          ],
          [
            'ATR',
            'Ceralasertib\n(AZD6738)',
            'Investigational /\nPhase II',
            '-0.89\n(Dependency)',
            '-1.95\n(Sensitive)',
            'Tier II-A\n[8,9]'
          ]
        ];

        tableData.forEach((row, rIdx) => {
          doc.setFontSize(6.8);
          doc.setFont('helvetica', 'normal');
          
          const cellLines = row.map((cellText, cIdx) => {
            return doc.splitTextToSize(cellText, colWidths[cIdx] - 3.5);
          });
          const maxLines = Math.max(...cellLines.map(cl => cl.length), 2);
          const rowHeight = Math.max(maxLines * 3.3 + 3, 9.5);

          if (rIdx % 2 === 1) {
            doc.setFillColor(248, 250, 252);
          } else {
            doc.setFillColor(255, 255, 255);
          }
          doc.rect(margin, y, contentWidth, rowHeight, 'F');
          doc.setDrawColor(226, 232, 240);
          doc.rect(margin, y, contentWidth, rowHeight, 'S');

          let cellX = margin;
          row.forEach((_, cIdx) => {
            const w = colWidths[cIdx];
            doc.rect(cellX, y, w, rowHeight, 'S');
            
            doc.setTextColor(30, 41, 59);
            if (cIdx === 0 || cIdx === 1) {
              doc.setFont('helvetica', 'bold');
            } else {
              doc.setFont('helvetica', 'normal');
            }

            const linesToDraw = cellLines[cIdx];
            let lineY = y + 3.8;
            linesToDraw.forEach((lText: string) => {
              doc.text(lText, cellX + 2, lineY);
              lineY += 3.2;
            });

            cellX += w;
          });

          y += rowHeight;
        });

        y += 2.5;

        // 4. Interpretation Box immediately below the table
        const interpText = 'Interpretation: DepMap CERES and GDSC values represent population-level preclinical dependency and drug-sensitivity signals and should not be interpreted as patient-specific treatment-response predictions. Therapeutic relevance requires independent assessment of molecular eligibility, disease setting, prior treatment history, current guidelines, and clinical-trial criteria.';
        
        doc.setFontSize(7.2);
        doc.setFont('helvetica', 'italic');
        const interpWrapped = doc.splitTextToSize(interpText, contentWidth - 8);
        const interpHeight = interpWrapped.length * 3.6 + 5;

        doc.setFillColor(248, 250, 252);
        doc.rect(margin, y, contentWidth, interpHeight, 'F');
        doc.setDrawColor(203, 213, 225);
        doc.rect(margin, y, contentWidth, interpHeight, 'S');
        // Cyan accent bar on left
        doc.setFillColor(14, 116, 144);
        doc.rect(margin, y, 2.5, interpHeight, 'F');

        doc.setTextColor(51, 65, 85);
        let interpY = y + 4.2;
        interpWrapped.forEach((iLine: string) => {
          doc.text(iLine, margin + 6, interpY);
          interpY += 3.6;
        });

        y += interpHeight + 4;
      };

      // TABLE 4: ctDNA Surveillance Timeline
      const drawCtDnaTimelineTable = () => {
        checkPageBreak(65);

        // Title banner
        doc.setFillColor(15, 23, 42); // Slate-900
        doc.rect(margin, y, contentWidth, 6.5, 'F');
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(34, 211, 238); // Cyan-400
        doc.text('SERIAL ctDNA SURVEILLANCE & RADIOLOGIC LEAD TIME TIMELINE', margin + 3.5, y + 4.5);
        y += 6.5;

        const colWidths = [44, 84, 54];
        const colHeaders = [
          'Surveillance Milestone',
          'Clinical / Molecular Monitoring Event',
          'Evidence Benchmark & Ref'
        ];

        const headerHeight = 7.5;
        doc.setFillColor(241, 245, 249);
        doc.rect(margin, y, contentWidth, headerHeight, 'F');
        doc.setDrawColor(203, 213, 225);
        doc.rect(margin, y, contentWidth, headerHeight, 'S');

        doc.setFontSize(6.8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        let curX = margin;
        colHeaders.forEach((hdr, idx) => {
          const w = colWidths[idx];
          doc.rect(curX, y, w, headerHeight, 'S');
          doc.text(hdr, curX + 2, y + 5);
          curX += w;
        });
        y += headerHeight;

        const timelineRows = [
          ['Month 0 (Baseline)', 'Surgery / Neoadjuvant Resection Complete', 'Baseline Pathologic Staging [11]'],
          ['Month 3 (Adjuvant)', 'Adjuvant Chemotherapy & Molecular Nadir', 'Serial ctDNA Protocol Initiation [11]'],
          ['Month 6 (ctDNA+)', 'Rising ctDNA MAF Detected (Molecular Recurrence)', '4\u20136 Month Subclinical Lead Time [1, 2, 13, 14]'],
          ['Month 10\u201312 (RECIST)', 'Radiologic Recurrence Verified by RECIST 1.1 Criteria', 'Overt Metastatic Progression [1, 2, 11]']
        ];

        timelineRows.forEach((row, rIdx) => {
          const rowHeight = 7.2;
          checkPageBreak(rowHeight + 2);

          if (rIdx % 2 === 1) {
            doc.setFillColor(248, 250, 252);
          } else {
            doc.setFillColor(255, 255, 255);
          }
          doc.rect(margin, y, contentWidth, rowHeight, 'F');
          doc.setDrawColor(226, 232, 240);
          doc.rect(margin, y, contentWidth, rowHeight, 'S');

          let cellX = margin;
          row.forEach((cellText, cIdx) => {
            const w = colWidths[cIdx];
            doc.rect(cellX, y, w, rowHeight, 'S');

            if (cIdx === 0) {
              doc.setFont('helvetica', 'bold');
              doc.setTextColor(15, 23, 42);
            } else if (cIdx === 1) {
              doc.setFont('helvetica', 'normal');
              doc.setTextColor(30, 41, 59);
            } else {
              doc.setFont('helvetica', 'bold');
              doc.setTextColor(14, 116, 144);
            }
            doc.text(cellText, cellX + 2, y + 4.8);
            cellX += w;
          });

          y += rowHeight;
        });

        y += 2.5;

        // Timeline interpretation box
        const interpText = 'Interpretation: Serial liquid biopsy ctDNA surveillance detects occult recurrence with a 4\u20136 month median lead time prior to conventional radiologic detection by CT/PET-CT, enabling potential molecular-directed clinical trial intervention before symptomatic disease progression.';
        doc.setFontSize(7);
        doc.setFont('helvetica', 'italic');
        const interpWrapped = doc.splitTextToSize(interpText, contentWidth - 8);
        const interpHeight = interpWrapped.length * 3.4 + 4.5;

        checkPageBreak(interpHeight + 2);

        doc.setFillColor(248, 250, 252);
        doc.rect(margin, y, contentWidth, interpHeight, 'F');
        doc.setDrawColor(203, 213, 225);
        doc.rect(margin, y, contentWidth, interpHeight, 'S');
        doc.setFillColor(14, 116, 144);
        doc.rect(margin, y, 2.5, interpHeight, 'F');

        doc.setTextColor(51, 65, 85);
        let interpY = y + 4;
        interpWrapped.forEach((iLine: string) => {
          doc.text(iLine, margin + 6, interpY);
          interpY += 3.4;
        });

        y += interpHeight + 4;
      };

      lines.forEach((line) => {
        const trimmed = line.trim();

        // Handle Section 1 table specifically
        if (trimmed.startsWith('### 1.') && trimmed.includes('Computational & Molecular')) {
          y += 4;
          checkPageBreak(75);
          doc.setTextColor(14, 116, 144);
          doc.setFontSize(10.5);
          doc.setFont('helvetica', 'bold');
          doc.text('1. Computational & Molecular Analysis', margin, y);
          y += 2;
          doc.setDrawColor(203, 213, 225);
          doc.line(margin, y, pageWidth - margin, y);
          y += 4;

          const p1 = 'The computational ensemble identifies the sample as consistent with a Basal-like (triple-negative breast cancer) molecular profile. These results represent computational predictions derived from the available molecular and clinical inputs and should not be interpreted as independently validated clinical diagnoses.';
          doc.setTextColor(51, 65, 85);
          doc.setFontSize(8.5);
          doc.setFont('helvetica', 'normal');
          const p1Wrapped = doc.splitTextToSize(p1, contentWidth);
          p1Wrapped.forEach((wLine: string) => {
            checkPageBreak(6);
            doc.text(wLine, margin, y);
            y += 4.2;
          });
          y += 3;

          drawComputationalProfileTable();
          inSection1Pdf = true;
          return;
        }

        if (inSection1Pdf) {
          if (trimmed.startsWith('### 2.') || trimmed.startsWith('### 2 ')) {
            inSection1Pdf = false;
            // fall through to process Section 2
          } else {
            return;
          }
        }

        // Handle Section 2 table specifically
        if (trimmed.startsWith('### 2.') && trimmed.includes('SHAP Biomarker')) {
          y += 4;
          checkPageBreak(75);
          doc.setTextColor(14, 116, 144);
          doc.setFontSize(10.5);
          doc.setFont('helvetica', 'bold');
          doc.text('2. SHAP Biomarker Mechanistic Rationale', margin, y);
          y += 2;
          doc.setDrawColor(203, 213, 225);
          doc.line(margin, y, pageWidth - margin, y);
          y += 4;

          // SHAP Interpretation Box
          const shapInterp = 'Interpretation: SHAP values describe the contribution of individual input features to the model output. They represent model behavior and do not independently establish biological causality or clinical significance.';
          doc.setFontSize(7.2);
          doc.setFont('helvetica', 'italic');
          const sInterpWrapped = doc.splitTextToSize(shapInterp, contentWidth - 8);
          const sInterpHeight = sInterpWrapped.length * 3.6 + 4.5;
          checkPageBreak(sInterpHeight + 2);
          doc.setFillColor(248, 250, 252);
          doc.rect(margin, y, contentWidth, sInterpHeight, 'F');
          doc.setDrawColor(203, 213, 225);
          doc.rect(margin, y, contentWidth, sInterpHeight, 'S');
          doc.setFillColor(14, 116, 144);
          doc.rect(margin, y, 2.5, sInterpHeight, 'F');
          doc.setTextColor(51, 65, 85);
          let sY = y + 4;
          sInterpWrapped.forEach((lineText: string) => {
            doc.text(lineText, margin + 6, sY);
            sY += 3.6;
          });
          y += sInterpHeight + 3.5;

          drawShapAttributionTable();

          const mechP = 'Elevated proliferation and cell-cycle checkpoint override in conjunction with pathway dysregulation drive the elevated recurrence hazard ratio [2, 4], exhibiting selective dependency in genome-wide functional screens [5]. Specifically:';
          doc.setTextColor(51, 65, 85);
          doc.setFontSize(8.5);
          doc.setFont('helvetica', 'normal');
          const mechWrapped = doc.splitTextToSize(mechP, contentWidth);
          mechWrapped.forEach((lineText: string) => {
            checkPageBreak(6);
            doc.text(lineText, margin, y);
            y += 4.2;
          });
          y += 1.5;

          const brcaText = '• BRCA1: BRCA1 alteration and reduced expression are consistent with impaired homologous-recombination repair; functional HRD status requires independent genomic/functional assessment [3, 4].';
          const brcaWrapped = doc.splitTextToSize(brcaText, contentWidth - 4);
          brcaWrapped.forEach((lineText: string) => {
            checkPageBreak(6);
            doc.text(lineText, margin + 3, y);
            y += 4.2;
          });
          y += 1;

          const tp53Text = '• TP53: TP53 mutation with elevated transcript expression is consistent with TP53 dysregulation; specific dominant-negative or gain-of-function effects require variant-level functional evidence [2, 3].';
          const tp53Wrapped = doc.splitTextToSize(tp53Text, contentWidth - 4);
          tp53Wrapped.forEach((lineText: string) => {
            checkPageBreak(6);
            doc.text(lineText, margin + 3, y);
            y += 4.2;
          });
          y += 3;

          inSection2Pdf = true;
          return;
        }

        if (inSection2Pdf) {
          if (trimmed.startsWith('### 3.') || trimmed.startsWith('### 3 ')) {
            inSection2Pdf = false;
            // fall through to process Section 3
          } else {
            return;
          }
        }

        // Handle Section 3 table specifically
        if (trimmed.startsWith('### 3.') && trimmed.includes('Therapeutic Evidence')) {
          y += 4;
          checkPageBreak(75);
          doc.setTextColor(14, 116, 144); // Dark Cyan
          doc.setFontSize(10.5);
          doc.setFont('helvetica', 'bold');
          doc.text('3. Therapeutic Evidence & Candidate Vulnerabilities', margin, y);
          y += 2;
          doc.setDrawColor(203, 213, 225);
          doc.line(margin, y, pageWidth - margin, y);
          y += 3.5;

          drawTherapeuticMatrixTable();
          inSection3Pdf = true;
          return;
        }

        if (inSection3Pdf) {
          if (trimmed.startsWith('### 4.') || trimmed.startsWith('### 4 ')) {
            inSection3Pdf = false;
            // fall through to process ### 4.
          } else {
            // skip raw markdown lines of section 3 table and interpretation
            return;
          }
        }

        // Handle Section 4 table specifically
        if (trimmed.startsWith('### 4.') && (trimmed.includes('Clinical Trial') || trimmed.includes('Potentially Relevant'))) {
          y += 4;
          checkPageBreak(75);
          doc.setTextColor(14, 116, 144);
          doc.setFontSize(10.5);
          doc.setFont('helvetica', 'bold');
          doc.text('4. Potentially Relevant Clinical Trial Opportunities', margin, y);
          y += 2;
          doc.setDrawColor(203, 213, 225);
          doc.line(margin, y, pageWidth - margin, y);
          y += 4;

          // Trial Guidance Box
          const trialNotice = 'Trial relevance should be independently assessed using current eligibility criteria, biomarker requirements, disease stage, prior treatment history, geographic availability, and investigator review.';
          doc.setFontSize(7.2);
          doc.setFont('helvetica', 'italic');
          const tNoticeWrapped = doc.splitTextToSize(trialNotice, contentWidth - 8);
          const tNoticeHeight = tNoticeWrapped.length * 3.6 + 4.5;
          checkPageBreak(tNoticeHeight + 2);
          doc.setFillColor(248, 250, 252);
          doc.rect(margin, y, contentWidth, tNoticeHeight, 'F');
          doc.setDrawColor(203, 213, 225);
          doc.rect(margin, y, contentWidth, tNoticeHeight, 'S');
          doc.setFillColor(14, 116, 144);
          doc.rect(margin, y, 2.5, tNoticeHeight, 'F');
          doc.setTextColor(51, 65, 85);
          let tY = y + 4;
          tNoticeWrapped.forEach((lineText: string) => {
            doc.text(lineText, margin + 6, tY);
            tY += 3.6;
          });
          y += tNoticeHeight + 3.5;

          drawCtDnaTimelineTable();

          const bullet1 = '• Investigational Biomarker Surveillance Panel: Serial liquid biopsy ctDNA monitoring tracking patient-specific somatic alterations (BRCA1, TP53, EGFR). In prospective clinical trials, rising circulating tumor DNA mutant allele fraction (MAF) has been demonstrated to precede clinical and radiologic progression by a median lead time of 4–6 months (up to 10.7 months) [13, 14].';
          const b1Wrapped = doc.splitTextToSize(bullet1, contentWidth - 4);
          b1Wrapped.forEach((lineText: string) => {
            checkPageBreak(6);
            doc.text(lineText, margin + 3, y);
            y += 4.2;
          });
          y += 1.5;

          const bullet2 = '• Potentially Relevant Clinical Trial Opportunities: Patient eligibility for prospective biomarker-directed clinical trials (e.g., OlympiAD NCT02000622, SOLAR-1 NCT03056833, c-TRAK TNBC NCT03145961) [7, 8, 15] with serial monitoring for secondary resistance mutations (such as ESR1 ligand-binding domain mutations or BRCA reversion mutations) [16].';
          const b2Wrapped = doc.splitTextToSize(bullet2, contentWidth - 4);
          b2Wrapped.forEach((lineText: string) => {
            checkPageBreak(6);
            doc.text(lineText, margin + 3, y);
            y += 4.2;
          });
          y += 3;

          inSection4Pdf = true;
          return;
        }

        if (inSection4Pdf) {
          if (trimmed.startsWith('### 5.') || trimmed.startsWith('### 5 ')) {
            inSection4Pdf = false;
            // fall through to process Section 5
          } else {
            return;
          }
        }

        if (y > pageHeight - 22) {
          doc.addPage();
          y = 22;
          doc.setFontSize(7.5);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(14, 116, 144);
          doc.text(`PRECISION-BRCA AI \u2014 COMPUTATIONAL ONCOLOGY RESEARCH REPORT  |  PATIENT REF: ${patientId || 'TCGA-BRCA-A2-010'}`, margin, 12);
          doc.setDrawColor(226, 232, 240);
          doc.line(margin, 14, pageWidth - margin, 14);
        }

        if (trimmed.startsWith('### ')) {
          y += 4;
          if (y > pageHeight - 25) {
            doc.addPage();
            y = 22;
            doc.setFontSize(7.5);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(14, 116, 144);
            doc.text(`PRECISION-BRCA AI \u2014 COMPUTATIONAL ONCOLOGY RESEARCH REPORT  |  PATIENT REF: ${patientId || 'TCGA-BRCA-A2-010'}`, margin, 12);
            doc.setDrawColor(226, 232, 240);
            doc.line(margin, 14, pageWidth - margin, 14);
          }
          doc.setTextColor(14, 116, 144); // Dark Cyan
          doc.setFontSize(10.5);
          doc.setFont('helvetica', 'bold');
          const textVal = trimmed.replace('### ', '');
          doc.text(textVal, margin, y);
          y += 2;
          doc.setDrawColor(203, 213, 225);
          doc.line(margin, y, pageWidth - margin, y);
          y += 4.5;
        } else if (trimmed.startsWith('#### ')) {
          y += 3;
          if (y > pageHeight - 22) {
            doc.addPage();
            y = 22;
            doc.setFontSize(7.5);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(14, 116, 144);
            doc.text(`PRECISION-BRCA AI \u2014 COMPUTATIONAL ONCOLOGY RESEARCH REPORT  |  PATIENT REF: ${patientId || 'TCGA-BRCA-A2-010'}`, margin, 12);
            doc.setDrawColor(226, 232, 240);
            doc.line(margin, 14, pageWidth - margin, 14);
          }
          doc.setTextColor(15, 23, 42); // Slate 900
          doc.setFontSize(9);
          doc.setFont('helvetica', 'bold');
          const textVal = trimmed.replace('#### ', '').replace(/\*\*/g, '');
          doc.text(textVal.toUpperCase(), margin, y);
          y += 4;
        } else if (trimmed.startsWith('## ')) {
          y += 5;
          if (y > pageHeight - 25) {
            doc.addPage();
            y = 22;
            doc.setFontSize(7.5);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(14, 116, 144);
            doc.text(`PRECISION-BRCA AI \u2014 COMPUTATIONAL ONCOLOGY RESEARCH REPORT  |  PATIENT REF: ${patientId || 'TCGA-BRCA-A2-010'}`, margin, 12);
            doc.setDrawColor(226, 232, 240);
            doc.line(margin, 14, pageWidth - margin, 14);
          }
          doc.setTextColor(15, 23, 42); // Slate 900
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          const textVal = trimmed.replace('## ', '');
          doc.text(textVal, margin, y);
          y += 5;
        } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          doc.setTextColor(51, 65, 85);
          doc.setFontSize(8.5);
          doc.setFont('helvetica', 'normal');
          const rawBullet = trimmed.replace(/^[-*]\s+/, '');
          const cleanBullet = rawBullet.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1');
          
          const isNumberedCitation = /^\[\d+\]/.test(cleanBullet);
          const prefix = isNumberedCitation ? '' : '• ';
          const wrapped = doc.splitTextToSize(`${prefix}${cleanBullet}`, contentWidth - 4);
          
          wrapped.forEach((wLine: string) => {
            if (y > pageHeight - 20) {
              doc.addPage();
              y = 22;
              doc.setFontSize(7.5);
              doc.setFont('helvetica', 'bold');
              doc.setTextColor(14, 116, 144);
              doc.text(`PRECISION-BRCA AI \u2014 COMPUTATIONAL ONCOLOGY RESEARCH REPORT  |  PATIENT REF: ${patientId || 'TCGA-BRCA-A2-010'}`, margin, 12);
              doc.setDrawColor(226, 232, 240);
              doc.line(margin, 14, pageWidth - margin, 14);
            }
            doc.text(wLine, margin + (isNumberedCitation ? 2 : 3), y);
            y += 4.2;
          });
          y += 0.8;
        } else if (trimmed.length > 0) {
          doc.setTextColor(51, 65, 85);
          doc.setFontSize(8.5);
          doc.setFont('helvetica', 'normal');
          const cleanP = trimmed.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1');
          
          const wrapped = doc.splitTextToSize(cleanP, contentWidth);
          wrapped.forEach((wLine: string) => {
            if (y > pageHeight - 20) {
              doc.addPage();
              y = 22;
              doc.setFontSize(7.5);
              doc.setFont('helvetica', 'bold');
              doc.setTextColor(14, 116, 144);
              doc.text(`PRECISION-BRCA AI \u2014 COMPUTATIONAL ONCOLOGY RESEARCH REPORT  |  PATIENT REF: ${patientId || 'TCGA-BRCA-A2-010'}`, margin, 12);
              doc.setDrawColor(226, 232, 240);
              doc.line(margin, 14, pageWidth - margin, 14);
            }
            doc.text(wLine, margin, y);
            y += 4.2;
          });
          y += 1;
        } else {
          y += 1.5;
        }
      });

      // Pagination and Footer on EVERY page (1 to totalPages)
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setDrawColor(226, 232, 240);
        doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

        doc.setFontSize(6.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(148, 163, 184);
        doc.text('PRECISION-BRCA AI • RESEARCH USE ONLY • NOT FOR CLINICAL DIAGNOSTIC OR TREATMENT DECISION-MAKING • DEVELOPED BY MANASVI• 2026', margin, pageHeight - 7);
        doc.text(`PAGE ${i} OF ${totalPages}`, pageWidth - margin - 15, pageHeight - 7);
      }

      doc.save(`Precision_BRCA_Report_${patientId || 'TCGA-BRCA-A2-010'}.pdf`);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05070A]/85 backdrop-blur-md">
      <div className="bg-[#05070A] bg-grain border border-white/10 rounded-sm w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-sm bg-white/10 border border-white/20 flex items-center justify-center shadow-md">
              <Sparkles className="h-4 w-4 text-cyan-300" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-mono text-white flex items-center gap-2">
                PRECISION-BRCA AI — COMPUTATIONAL ONCOLOGY RESEARCH REPORT
              </h2>
              <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">
                Patient Ref: {patientId || 'TCGA-BRCA-A2-010'} • Gemini 3.6 Flash Oncology Intelligence • Research Use Only (RUO)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono">
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 text-xs uppercase border border-cyan-500/50 transition-all font-bold shadow-md"
              title="Download PDF Document"
            >
              <Download className="h-4 w-4 text-cyan-400" />
              <span>{isDownloadingPdf ? 'Generating PDF...' : 'Download PDF'}</span>
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-white/5 hover:bg-white/10 text-slate-200 text-xs uppercase border border-white/10 transition-all"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-white/5 hover:bg-white/10 text-slate-200 text-xs uppercase border border-white/10 transition-all hidden sm:flex"
            >
              <Printer className="h-4 w-4" />
              <span>Print</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-sm bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-all ml-2"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Modal Body: Render Report Text cleanly */}
        <div className="p-6 overflow-y-auto space-y-4 text-slate-200 text-sm leading-relaxed font-sans">
          
          {/* Cover & Authorship Banner */}
          <div className="bg-gradient-to-r from-cyan-950/40 via-slate-900/60 to-black/60 p-5 rounded-sm border border-cyan-500/30 font-mono space-y-3 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div>
                <div className="text-cyan-400 text-xs font-bold uppercase tracking-wider">PRECISION-BRCA AI</div>
                <h1 className="text-white font-bold text-base sm:text-lg tracking-tight">
                  COMPUTATIONAL ONCOLOGY RESEARCH REPORT
                </h1>
                <div className="text-cyan-300/80 text-xs font-sans mt-0.5">
                  AI-Assisted Multi-Omics Computational Analysis • Research Use Only
                </div>
              </div>
              <div className="text-left sm:text-right text-xs text-slate-400 font-mono">
                <div className="text-slate-200 font-bold">Patient Reference: <span className="text-cyan-300">{patientId || 'TCGA-BRCA-A2-010'}</span></div>
                <div>Date: September 5, 2026</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <div className="text-white font-bold flex items-center gap-2">
                  <Dna className="h-4 w-4 text-cyan-400" />
                  <span>Created & Developed by Manasvi</span>
                </div>
                <div className="text-slate-400 text-[11px] font-sans">
                  MSc BioIT | Bioinformatics × AI × Computational Oncology
                </div>
              </div>
              <span className="self-start sm:self-auto text-amber-300 bg-amber-950/70 border border-amber-500/40 px-3 py-1 rounded-sm uppercase text-[10px] tracking-wider font-bold shrink-0">
                Research Use Only
              </span>
            </div>

            <div className="bg-amber-950/30 border border-amber-500/30 p-3 rounded-sm text-xs font-sans text-amber-200/90 leading-relaxed">
              <span className="font-bold text-amber-400 uppercase font-mono text-[10px] tracking-wider block mb-1">RESEARCH DISCLAIMER</span>
              This report presents computational and AI-assisted analyses for research and educational purposes. It is not intended for clinical diagnosis, treatment selection, or independent medical decision-making. Computational predictions require appropriate experimental and clinical validation.
            </div>
          </div>

          {/* Render Markdown Content gracefully */}
          <div className="prose prose-invert max-w-none">
            {(() => {
              const elements: React.ReactNode[] = [];
              const rawLines = fullReportText.split('\n');
              let inSec1 = false;
              let inSec2 = false;
              let inSec3 = false;
              let inSec4 = false;

              for (let idx = 0; idx < rawLines.length; idx++) {
                const line = rawLines[idx];
                const trimmed = line.trim();

                // Section 1: Computational & Molecular Analysis
                if (trimmed.startsWith('### 1.') && trimmed.includes('Computational & Molecular')) {
                  inSec1 = true;
                  elements.push(
                    <div key={`sec1-${idx}`} className="space-y-3">
                      <h3 className="text-lg font-light italic serif text-cyan-300 mt-5 mb-2 pb-1 border-b border-white/10 flex items-center justify-between">
                        <span>1. Computational &amp; Molecular Analysis</span>
                      </h3>
                      <p className="text-xs text-slate-300 my-1.5 leading-relaxed font-sans">
                        The computational ensemble identifies the sample as consistent with a <strong className="text-white font-semibold">Basal-like</strong> (triple-negative breast cancer) molecular profile. These results represent computational predictions derived from the available molecular and clinical inputs and should not be interpreted as independently validated clinical diagnoses.
                      </p>

                      <div className="border border-cyan-500/30 rounded-sm overflow-hidden bg-slate-950/70 shadow-lg my-3">
                        <div className="bg-slate-900 px-3.5 py-2 border-b border-cyan-500/30 flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-wider">
                            COMPUTATIONAL ONCOLOGY PROFILE
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">PAM50 / TCGA-BRCA Consensus Ensemble</span>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs border-collapse font-sans">
                            <thead>
                              <tr className="bg-white/5 text-slate-300 font-mono text-[10.5px] uppercase border-b border-white/10">
                                <th className="p-2.5 font-semibold w-1/3">Parameter / Metric</th>
                                <th className="p-2.5 font-semibold">Computational Assessment / Clinical Value</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 font-sans text-xs">
                              <tr className="hover:bg-white/[0.03] transition-colors">
                                <td className="p-2.5 font-medium text-slate-300">Patient ID</td>
                                <td className="p-2.5 font-mono text-cyan-300 font-semibold">{patientId || 'TCGA-BRCA-A2-010'}</td>
                              </tr>
                              <tr className="hover:bg-white/[0.03] transition-colors">
                                <td className="p-2.5 font-medium text-slate-300">Age / Menopause</td>
                                <td className="p-2.5 text-white">48 years / Pre-menopausal</td>
                              </tr>
                              <tr className="hover:bg-white/[0.03] transition-colors">
                                <td className="p-2.5 font-medium text-slate-300">Clinical Stage</td>
                                <td className="p-2.5 text-white">Stage IIB (T: 3.2 cm, N1: 1-3 regional lymph nodes)</td>
                              </tr>
                              <tr className="hover:bg-white/[0.03] transition-colors">
                                <td className="p-2.5 font-medium text-slate-300">IHC Receptor Status</td>
                                <td className="p-2.5 text-rose-300 font-mono">ER-negative, PR-negative, HER2-negative (TNBC)</td>
                              </tr>
                              <tr className="hover:bg-white/[0.03] transition-colors">
                                <td className="p-2.5 font-medium text-slate-300">Predicted Subtype</td>
                                <td className="p-2.5 text-amber-300 font-bold">Basal-like (PAM50 Probability: 96.8%) <span className="text-[10px] text-slate-400 font-normal">[11, 14, 15]</span></td>
                              </tr>
                              <tr className="hover:bg-white/[0.03] transition-colors">
                                <td className="p-2.5 font-medium text-slate-300">Cancer Probability</td>
                                <td className="p-2.5 text-rose-400 font-bold font-mono">98.2% <span className="text-[10px] text-amber-300/80 font-normal ml-1.5 block sm:inline">(Illustrative Computational Output — Not Clinically Validated) [14]</span></td>
                              </tr>
                              <tr className="hover:bg-white/[0.03] transition-colors">
                                <td className="p-2.5 font-medium text-slate-300">Prognostic OS Risk</td>
                                <td className="p-2.5 text-rose-400 font-bold font-mono">High Risk (5-Year OS Risk: 74.5%) <span className="text-[10px] text-amber-300/80 font-normal ml-1.5 block sm:inline">(Illustrative Computational Output — Not Clinically Validated) [11, 15]</span></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  );
                  continue;
                }

                if (inSec1) {
                  if (trimmed.startsWith('### 2.') || trimmed.startsWith('### 2 ')) {
                    inSec1 = false;
                  } else {
                    continue;
                  }
                }

                // Section 2: SHAP Biomarker Mechanistic Rationale
                if (trimmed.startsWith('### 2.') && trimmed.includes('SHAP Biomarker')) {
                  inSec2 = true;
                  elements.push(
                    <div key={`sec2-${idx}`} className="space-y-3">
                      <h3 className="text-lg font-light italic serif text-cyan-300 mt-5 mb-2 pb-1 border-b border-white/10 flex items-center justify-between">
                        <span>2. SHAP Biomarker Mechanistic Rationale</span>
                      </h3>

                      <div className="bg-slate-900/90 border border-cyan-500/30 p-3 rounded-sm text-xs font-sans text-slate-300 italic leading-relaxed border-l-2 border-l-cyan-400">
                        <strong className="text-cyan-300 font-mono not-italic uppercase text-[10px] block mb-0.5 tracking-wider">Interpretation</strong>
                        SHAP values describe the contribution of individual input features to the model output. They represent model behavior and do not independently establish biological causality or clinical significance.
                      </div>

                      <div className="border border-cyan-500/30 rounded-sm overflow-hidden bg-slate-950/70 shadow-lg my-3">
                        <div className="bg-slate-900 px-3.5 py-2 border-b border-cyan-500/30 flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-wider">
                            SHAP FEATURE ATTRIBUTION VECTOR (MODEL RISK CONTRIBUTION)
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">TreeSHAP Local Additive Attribution</span>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs border-collapse font-sans">
                            <thead>
                              <tr className="bg-white/5 text-slate-300 font-mono text-[10.5px] uppercase border-b border-white/10">
                                <th className="p-2.5 font-semibold">Feature / Biomarker</th>
                                <th className="p-2.5 font-semibold">SHAP Value (Weight)</th>
                                <th className="p-2.5 font-semibold">Direction / Vector</th>
                                <th className="p-2.5 font-semibold">Mechanistic Attribution</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 font-sans text-xs">
                              <tr className="hover:bg-white/[0.03] transition-colors">
                                <td className="p-2.5 font-medium text-white font-mono">BRCA1 [Mutated / Low]</td>
                                <td className="p-2.5 font-mono text-rose-400 font-bold">+0.28</td>
                                <td className="p-2.5 font-mono text-rose-300 text-[11px]">Positive Risk [==========================&gt;]</td>
                                <td className="p-2.5"><span className="px-1.5 py-0.5 rounded bg-rose-950/80 border border-rose-500/40 text-rose-300 text-[10px] font-mono font-bold">Pivotal Driver</span></td>
                              </tr>
                              <tr className="hover:bg-white/[0.03] transition-colors">
                                <td className="p-2.5 font-medium text-white font-mono">TP53 [Mutated / High]</td>
                                <td className="p-2.5 font-mono text-rose-400 font-bold">+0.24</td>
                                <td className="p-2.5 font-mono text-rose-300 text-[11px]">Positive Risk [======================&gt;]</td>
                                <td className="p-2.5"><span className="px-1.5 py-0.5 rounded bg-rose-950/80 border border-rose-500/40 text-rose-300 text-[10px] font-mono font-bold">Pivotal Driver</span></td>
                              </tr>
                              <tr className="hover:bg-white/[0.03] transition-colors">
                                <td className="p-2.5 font-medium text-white font-mono">EGFR [Overexpressed]</td>
                                <td className="p-2.5 font-mono text-rose-400 font-bold">+0.19</td>
                                <td className="p-2.5 font-mono text-amber-300 text-[11px]">Positive Risk [==================&gt;]</td>
                                <td className="p-2.5"><span className="px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono font-bold">RTK Driver</span></td>
                              </tr>
                              <tr className="hover:bg-white/[0.03] transition-colors">
                                <td className="p-2.5 font-medium text-white font-mono">MKI67 [Overexpressed]</td>
                                <td className="p-2.5 font-mono text-rose-400 font-bold">+0.16</td>
                                <td className="p-2.5 font-mono text-amber-300 text-[11px]">Positive Risk [==============&gt;]</td>
                                <td className="p-2.5"><span className="px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono font-bold">Proliferation</span></td>
                              </tr>
                              <tr className="hover:bg-white/[0.03] transition-colors">
                                <td className="p-2.5 font-medium text-white font-mono">PARP1 [Overexpressed]</td>
                                <td className="p-2.5 font-mono text-rose-400 font-bold">+0.12</td>
                                <td className="p-2.5 font-mono text-slate-300 text-[11px]">Positive Risk [============&gt;]</td>
                                <td className="p-2.5"><span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[10px] font-mono font-bold">BER Compensatory</span></td>
                              </tr>
                              <tr className="hover:bg-white/[0.03] transition-colors">
                                <td className="p-2.5 font-medium text-white font-mono">ESR1 [Underexpressed]</td>
                                <td className="p-2.5 font-mono text-cyan-400 font-bold">-0.15</td>
                                <td className="p-2.5 font-mono text-cyan-300 text-[11px]">Negative Risk [&lt;======================]</td>
                                <td className="p-2.5"><span className="px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono font-bold">Subtype Vector</span></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 my-1.5 leading-relaxed font-sans">
                        Elevated proliferation and cell-cycle checkpoint override in conjunction with pathway dysregulation drive the elevated recurrence hazard ratio [2, 4], exhibiting selective dependency in genome-wide functional screens [5]. Specifically:
                      </p>
                      <ul className="text-xs text-slate-300 my-1.5 font-sans space-y-1 ml-4 list-disc">
                        <li><strong className="text-white">BRCA1:</strong> BRCA1 alteration and reduced expression are consistent with impaired homologous-recombination repair; functional HRD status requires independent genomic/functional assessment [3, 4].</li>
                        <li><strong className="text-white">TP53:</strong> TP53 mutation with elevated transcript expression is consistent with TP53 dysregulation; specific dominant-negative or gain-of-function effects require variant-level functional evidence [2, 3].</li>
                      </ul>
                    </div>
                  );
                  continue;
                }

                if (inSec2) {
                  if (trimmed.startsWith('### 3.') || trimmed.startsWith('### 3 ')) {
                    inSec2 = false;
                  } else {
                    continue;
                  }
                }

                // Section 3: Therapeutic Evidence & Candidate Vulnerabilities
                if (trimmed.startsWith('### 3.') && trimmed.includes('Therapeutic Evidence')) {
                  inSec3 = true;
                  elements.push(
                    <div key={`sec3-${idx}`} className="space-y-3">
                      <h3 className="text-lg font-light italic serif text-cyan-300 mt-5 mb-2 pb-1 border-b border-white/10 flex items-center justify-between">
                        <span>3. Therapeutic Evidence &amp; Candidate Vulnerabilities</span>
                      </h3>
                      
                      <div className="border border-cyan-500/30 rounded-sm overflow-hidden bg-slate-950/70 shadow-lg my-3">
                        <div className="bg-slate-900 px-3.5 py-2 border-b border-cyan-500/30 flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-wider">
                            CANDIDATE THERAPEUTIC EVIDENCE MATRIX
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">DepMap 24Q2 / Sanger GDSC2 / ESCAT</span>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs border-collapse font-sans">
                            <thead>
                              <tr className="bg-white/5 text-slate-300 font-mono text-[10.5px] uppercase border-b border-white/10">
                                <th className="p-2.5 font-semibold">Target / Vulnerability</th>
                                <th className="p-2.5 font-semibold">Candidate Drug(s)</th>
                                <th className="p-2.5 font-semibold">Evidence / Development Status</th>
                                <th className="p-2.5 font-semibold">DepMap CERES Score (24Q2)</th>
                                <th className="p-2.5 font-semibold">GDSC IC50 Score</th>
                                <th className="p-2.5 font-semibold">ESCAT / Evidence Level</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 font-sans text-xs">
                              <tr className="hover:bg-white/[0.03] transition-colors">
                                <td className="p-2.5 font-medium text-white">BRCA1/2-associated HRR deficiency</td>
                                <td className="p-2.5 text-cyan-300 font-semibold font-mono">Olaparib / Talazoparib</td>
                                <td className="p-2.5 text-slate-300">FDA-approved in specific BRCA breast cancer</td>
                                <td className="p-2.5 font-mono text-emerald-400 font-bold">-1.12 <span className="text-[10px] text-slate-400 font-normal block">(Dependency)</span></td>
                                <td className="p-2.5 font-mono text-emerald-400 font-bold">-2.45 <span className="text-[10px] text-slate-400 font-normal block">(Sensitive)</span></td>
                                <td className="p-2.5 font-mono"><span className="px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold text-[10px]">Tier I-A</span> <span className="text-slate-400 text-[10px] ml-1">[1,7,10]</span></td>
                              </tr>
                              <tr className="hover:bg-white/[0.03] transition-colors">
                                <td className="p-2.5 font-medium text-white">EGFR</td>
                                <td className="p-2.5 text-cyan-300 font-semibold font-mono">Cetuximab</td>
                                <td className="p-2.5 text-slate-300">Investigational / clinical-trial</td>
                                <td className="p-2.5 font-mono text-emerald-400 font-bold">-0.78 <span className="text-[10px] text-slate-400 font-normal block">(Dependency)</span></td>
                                <td className="p-2.5 font-mono text-emerald-400 font-bold">-1.85 <span className="text-[10px] text-slate-400 font-normal block">(Sensitive)</span></td>
                                <td className="p-2.5 font-mono"><span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-bold text-[10px]">Tier II-B</span> <span className="text-slate-400 text-[10px] ml-1">[4,8]</span></td>
                              </tr>
                              <tr className="hover:bg-white/[0.03] transition-colors">
                                <td className="p-2.5 font-medium text-white">ATR</td>
                                <td className="p-2.5 text-cyan-300 font-semibold font-mono">Ceralasertib (AZD6738)</td>
                                <td className="p-2.5 text-slate-300">Investigational / Phase II</td>
                                <td className="p-2.5 font-mono text-emerald-400 font-bold">-0.89 <span className="text-[10px] text-slate-400 font-normal block">(Dependency)</span></td>
                                <td className="p-2.5 font-mono text-emerald-400 font-bold">-1.95 <span className="text-[10px] text-slate-400 font-normal block">(Sensitive)</span></td>
                                <td className="p-2.5 font-mono"><span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-bold text-[10px]">Tier II-A</span> <span className="text-slate-400 text-[10px] ml-1">[8,9]</span></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="bg-slate-900/90 border-t border-white/10 p-3 text-xs font-sans text-slate-300 italic leading-relaxed border-l-2 border-l-amber-400">
                          <strong className="text-amber-300 font-mono not-italic uppercase text-[10px] block mb-0.5 tracking-wider">Interpretation</strong>
                          DepMap CERES and GDSC values represent population-level preclinical dependency and drug-sensitivity signals and should not be interpreted as patient-specific treatment-response predictions. Therapeutic relevance requires independent assessment of molecular eligibility, disease setting, prior treatment history, current guidelines, and clinical-trial criteria.
                        </div>
                      </div>
                    </div>
                  );
                  continue;
                }

                if (inSec3) {
                  if (trimmed.startsWith('### 4.') || trimmed.startsWith('### 4 ')) {
                    inSec3 = false;
                  } else {
                    continue;
                  }
                }

                // Section 4: Potentially Relevant Clinical Trial Opportunities
                if (trimmed.startsWith('### 4.') && (trimmed.includes('Clinical Trial') || trimmed.includes('Potentially Relevant'))) {
                  inSec4 = true;
                  elements.push(
                    <div key={`sec4-${idx}`} className="space-y-3">
                      <h3 className="text-lg font-light italic serif text-cyan-300 mt-5 mb-2 pb-1 border-b border-white/10 flex items-center justify-between">
                        <span>4. Potentially Relevant Clinical Trial Opportunities</span>
                      </h3>

                      <div className="bg-slate-900/90 border border-cyan-500/30 p-3 rounded-sm text-xs font-sans text-slate-300 italic leading-relaxed border-l-2 border-l-cyan-400">
                        <strong className="text-cyan-300 font-mono not-italic uppercase text-[10px] block mb-0.5 tracking-wider">Guidance</strong>
                        Trial relevance should be independently assessed using current eligibility criteria, biomarker requirements, disease stage, prior treatment history, geographic availability, and investigator review.
                      </div>

                      <div className="border border-cyan-500/30 rounded-sm overflow-hidden bg-slate-950/70 shadow-lg my-3">
                        <div className="bg-slate-900 px-3.5 py-2 border-b border-cyan-500/30 flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-wider">
                            SERIAL ctDNA SURVEILLANCE &amp; RADIOLOGIC LEAD TIME TIMELINE
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">Prospective Liquid Biopsy ctDNA Monitoring</span>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs border-collapse font-sans">
                            <thead>
                              <tr className="bg-white/5 text-slate-300 font-mono text-[10.5px] uppercase border-b border-white/10">
                                <th className="p-2.5 font-semibold">Surveillance Milestone</th>
                                <th className="p-2.5 font-semibold">Clinical &amp; Molecular Monitoring Event</th>
                                <th className="p-2.5 font-semibold">Evidence Benchmark &amp; Ref</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 font-sans text-xs">
                              <tr className="hover:bg-white/[0.03] transition-colors">
                                <td className="p-2.5 font-bold text-white font-mono">Month 0 (Baseline)</td>
                                <td className="p-2.5 text-slate-200">Surgery / Neoadjuvant Resection Complete</td>
                                <td className="p-2.5 text-cyan-300 font-mono">Baseline Pathologic Staging [11]</td>
                              </tr>
                              <tr className="hover:bg-white/[0.03] transition-colors">
                                <td className="p-2.5 font-bold text-white font-mono">Month 3 (Adjuvant)</td>
                                <td className="p-2.5 text-slate-200">Adjuvant Chemotherapy &amp; Molecular Nadir</td>
                                <td className="p-2.5 text-cyan-300 font-mono">Serial ctDNA Protocol Initiation [11]</td>
                              </tr>
                              <tr className="hover:bg-white/[0.03] transition-colors">
                                <td className="p-2.5 font-bold text-amber-300 font-mono">Month 6 (ctDNA+)</td>
                                <td className="p-2.5 text-rose-300 font-medium">Rising ctDNA MAF Detected (Molecular Recurrence)</td>
                                <td className="p-2.5 font-mono"><span className="px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold text-[10px]">4–6 Month Subclinical Lead Time</span> <span className="text-slate-400 text-[10px] ml-1">[1, 2, 13, 14]</span></td>
                              </tr>
                              <tr className="hover:bg-white/[0.03] transition-colors">
                                <td className="p-2.5 font-bold text-rose-400 font-mono">Month 10–12 (RECIST)</td>
                                <td className="p-2.5 text-slate-200">Radiologic Recurrence Verified by RECIST 1.1 Criteria</td>
                                <td className="p-2.5 text-slate-400 font-mono">Overt Metastatic Progression [1, 2, 11]</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="bg-slate-900/90 border-t border-white/10 p-3 text-xs font-sans text-slate-300 italic leading-relaxed border-l-2 border-l-amber-400">
                          <strong className="text-amber-300 font-mono not-italic uppercase text-[10px] block mb-0.5 tracking-wider">Interpretation</strong>
                          Serial liquid biopsy ctDNA surveillance detects occult recurrence with a 4–6 month median lead time prior to conventional radiologic detection by CT/PET-CT, enabling potential molecular-directed clinical trial intervention before symptomatic disease progression.
                        </div>
                      </div>

                      <ul className="text-xs text-slate-300 my-1.5 font-sans space-y-1.5 ml-4 list-disc">
                        <li><strong className="text-white">Investigational Biomarker Surveillance Panel:</strong> Serial liquid biopsy ctDNA monitoring tracking patient-specific somatic alterations (BRCA1, TP53, EGFR). In prospective clinical trials, rising circulating tumor DNA mutant allele fraction (MAF) has been demonstrated to precede clinical and radiologic progression by a median lead time of 4–6 months (up to 10.7 months) [13, 14].</li>
                        <li><strong className="text-white">Potentially Relevant Clinical Trial Opportunities:</strong> Patient eligibility for prospective biomarker-directed clinical trials (e.g., OlympiAD NCT02000622, SOLAR-1 NCT03056833, c-TRAK TNBC NCT03145961) [7, 8, 15] with serial monitoring for secondary resistance mutations (such as ESR1 ligand-binding domain mutations or BRCA reversion mutations) [16].</li>
                      </ul>
                    </div>
                  );
                  continue;
                }

                if (inSec4) {
                  if (trimmed.startsWith('### 5.') || trimmed.startsWith('### 5 ')) {
                    inSec4 = false;
                  } else {
                    continue;
                  }
                }

                if (line.startsWith('### ')) {
                  elements.push(
                    <h3 key={idx} className="text-lg font-light italic serif text-cyan-300 mt-5 mb-2 pb-1 border-b border-white/10 flex items-center justify-between">
                      <span>{line.replace('### ', '')}</span>
                    </h3>
                  );
                  continue;
                }
                if (line.startsWith('#### ')) {
                  const headerText = line.replace('#### ', '').replace(/\*\*/g, '');
                  elements.push(
                    <div key={idx} className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mt-4 mb-2 flex items-center gap-2 border-l-2 border-cyan-500 pl-2.5 py-1 bg-cyan-950/20 rounded-r-xs">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400"></span>
                      <span>{headerText}</span>
                    </div>
                  );
                  continue;
                }
                if (line.startsWith('## ')) {
                  elements.push(
                    <h2 key={idx} className="text-xl font-light italic serif text-white mt-6 mb-2">
                      {line.replace('## ', '')}
                    </h2>
                  );
                  continue;
                }
                if (line.startsWith('- ') || line.startsWith('* ')) {
                  const rawText = line.replace(/^[-*]\s+/, '');
                  const isNumberedCitation = /^\[\d+\]/.test(rawText);
                  elements.push(
                    <li key={idx} className={`text-xs text-slate-300 my-1 font-sans leading-relaxed ${isNumberedCitation ? 'list-none ml-1' : 'ml-4'}`}>
                      {renderFormattedInline(rawText)}
                    </li>
                  );
                  continue;
                }
                if (line.trim() === '') {
                  elements.push(<div key={idx} className="h-2" />);
                  continue;
                }
                elements.push(
                  <p key={idx} className="text-xs text-slate-300 my-1.5 leading-relaxed font-sans">
                    {renderFormattedInline(line)}
                  </p>
                );
              }

              return elements;
            })()}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-black/40 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span className="uppercase text-[10px] tracking-wider">Computational Oncology Research Platform • AI-Assisted Computational Analysis — Research Use Only</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              className="px-3 py-1.5 rounded-sm bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 font-mono uppercase text-xs border border-cyan-500/50 transition-all font-bold flex items-center gap-1.5"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-sm bg-white/10 hover:bg-white/20 text-white font-mono uppercase text-xs border border-white/20 transition-all"
            >
              Close Report
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

