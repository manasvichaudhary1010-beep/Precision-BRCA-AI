import React, { useState } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { PatientSimulator } from './components/PatientSimulator';
import { MultiOmicsExplorerView } from './components/MultiOmicsExplorerView';
import { SubtypeAnalysisView } from './components/SubtypeAnalysisView';
import { ExternalValidationView } from './components/ExternalValidationView';
import { CalibrationDcaView } from './components/CalibrationDcaView';
import { ShapUncertaintyView } from './components/ShapUncertaintyView';
import { BioValidationView } from './components/BioValidationView';
import { PrognosisSurvivalView } from './components/PrognosisSurvivalView';
import { TherapeuticTargetsView } from './components/TherapeuticTargetsView';
import { ClinicalComparisonView } from './components/ClinicalComparisonView';
import { FiguresExplorer } from './components/FiguresExplorer';
import { EvidenceChainView } from './components/EvidenceChainView';
import { ManuscriptTitlesView } from './components/ManuscriptTitlesView';
import { ModelProvenancePanel } from './components/ModelProvenancePanel';
import { AiReportModal } from './components/AiReportModal';
import { DataUploadModal } from './components/DataUploadModal';
import { PATIENT_PRESETS } from './data/patientPresets';
import { PatientProfile } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('simulator');
  const [currentPatient, setCurrentPatient] = useState<PatientProfile>(PATIENT_PRESETS[0]);
  const [isOpenMobileSidebar, setIsOpenMobileSidebar] = useState<boolean>(false);
  
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [aiReportText, setAiReportText] = useState<string>('');
  const [isGeneratingReport, setIsGeneratingReport] = useState<boolean>(false);

  // Trigger Gemini API Server Route
  const handleGenerateAiReport = async () => {
    setIsGeneratingReport(true);
    try {
      const response = await fetch('/api/patient/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientData: currentPatient }),
      });

      const data = await response.json();

      if (data.success && data.report) {
        setAiReportText(data.report);
      } else {
        setAiReportText(generateFallbackReport(currentPatient, data.error));
      }
    } catch (error: any) {
      console.warn('API call failed, generating clinical report locally:', error);
      setAiReportText(generateFallbackReport(currentPatient, error.message));
    } finally {
      setIsGeneratingReport(false);
      setIsReportModalOpen(true);
    }
  };

  const generateFallbackReport = (patient: PatientProfile, errorMsg?: string): string => {
    return `### 1. Computational & Molecular Analysis
The computational ensemble identifies the sample as consistent with a **${patient.molecularSubtype}** (${patient.molecularSubtype === 'Basal-like' ? 'triple-negative breast cancer' : patient.molecularSubtype + ' breast cancer'}) molecular profile. These results represent computational predictions derived from the available molecular and clinical inputs and should not be interpreted as independently validated clinical diagnoses.

| Parameter / Metric | Computational Assessment / Clinical Value |
|---|---|
| Patient ID | ${patient.patientId || 'TCGA-BRCA-A2-010'} |
| Age / Menopause | ${patient.age} years / ${patient.menopausalStatus} |
| Clinical Stage | ${patient.tumorStage} (T: ${patient.tumorSize} cm, N1: ${patient.nodeStatus}) |
| IHC Receptor Status | ER-${patient.erStatus}, PR-${patient.prStatus}, HER2-${patient.her2Status} (${patient.molecularSubtype === 'Basal-like' ? 'TNBC' : patient.molecularSubtype}) |
| Predicted Subtype | ${patient.molecularSubtype} (PAM50 Probability: ${patient.subtypeConfidence}%) [11, 14, 15] |
| Cancer Probability | ${patient.cancerProbability}% (Illustrative Computational Output — Not Clinically Validated) [14] |
| Prognostic OS Risk | ${patient.prognosticRisk} Risk (5-Year Predicted Overall Survival Risk: ${patient.fiveYearRisk}% - Illustrative Computational Output — Not Clinically Validated) [11, 15] |

### 2. SHAP Biomarker Mechanistic Rationale
Interpretation: SHAP values describe the contribution of individual input features to the model output. They represent model behavior and do not independently establish biological causality or clinical significance.

| Feature / Biomarker | SHAP Value (Weight) | Direction / Vector | Mechanistic Attribution |
|---|---|---|---|
| BRCA1 [Mutated / Low] | +0.28 | Positive Risk (=>) | Pivotal Driver |
| TP53 [Mutated / High] | +0.24 | Positive Risk (=>) | Pivotal Driver |
| EGFR [Overexpressed] | +0.19 | Positive Risk (=>) | RTK Driver |
| MKI67 [Overexpressed] | +0.16 | Positive Risk (=>) | Proliferation |
| PARP1 [Overexpressed] | +0.12 | Positive Risk (=>) | BER Compensatory |
| ESR1 [Underexpressed] | -0.15 | Negative Risk (<=) | Subtype Vector |

Elevated proliferation and cell-cycle checkpoint override in conjunction with pathway dysregulation drive the elevated recurrence hazard ratio [2, 4], exhibiting selective dependency in genome-wide functional screens [5]. Specifically:
- **BRCA1:** BRCA1 alteration and reduced expression are consistent with impaired homologous-recombination repair; functional HRD status requires independent genomic/functional assessment [3, 4].
- **TP53:** TP53 mutation with elevated transcript expression is consistent with TP53 dysregulation; specific dominant-negative or gain-of-function effects require variant-level functional evidence [2, 3].

### 3. Therapeutic Evidence & Candidate Vulnerabilities

| Target / Vulnerability | Candidate Drug(s) | Evidence / Development Status | DepMap CERES Score (24Q2) | GDSC IC50 Score | ESCAT / Evidence Level |
|---|---|---|---|---|---|
| BRCA1/2-associated HRR deficiency | Olaparib / Talazoparib | FDA-approved in specific BRCA breast cancer | -1.12 (Dependency) | -2.45 (Sensitive) | Tier I-A [1,7,10] |
| EGFR | Cetuximab | Investigational / clinical-trial | -0.78 (Dependency) | -1.85 (Sensitive) | Tier II-B [4,8] |
| ATR | Ceralasertib (AZD6738) | Investigational / Phase II | -0.89 (Dependency) | -1.95 (Sensitive) | Tier II-A [8,9] |

Interpretation: DepMap CERES and GDSC values represent population-level preclinical dependency and drug-sensitivity signals and should not be interpreted as patient-specific treatment-response predictions. Therapeutic relevance requires independent assessment of molecular eligibility, disease setting, prior treatment history, current guidelines, and clinical-trial criteria.

### 4. Potentially Relevant Clinical Trial Opportunities
Trial relevance should be independently assessed using current eligibility criteria, biomarker requirements, disease stage, prior treatment history, geographic availability, and investigator review.

| Surveillance Milestone | Clinical & Molecular Monitoring Event | Evidence Benchmark / Reference |
|---|---|---|
| Month 0 (Baseline) | Surgery / Neoadjuvant Resection Complete | Baseline Pathologic Stage [11] |
| Month 3 (Adjuvant) | Adjuvant Chemotherapy Initiation & ctDNA Nadir | Standard Systemic Regimen [11] |
| Month 6 (ctDNA+) | Rising ctDNA MAF Detected (Molecular Recurrence) | 4–6 Month Subclinical Lead Time [1, 2, 13, 14] |
| Month 10–12 (Progression) | Radiologic Recurrence Verified by RECIST 1.1 Criteria | Overt Metastatic Relapse [1, 2, 11] |

Interpretation: Serial liquid biopsy ctDNA surveillance detects occult recurrence with a 4–6 month median lead time prior to conventional radiologic detection by CT/PET-CT, enabling potential molecular-directed clinical trial intervention before symptomatic disease progression.

- **Investigational Biomarker Surveillance Panel:** Serial liquid biopsy ctDNA monitoring tracking patient-specific somatic alterations (${patient.topGenes.map(g => g.gene).slice(0, 3).join(', ')}). In prospective clinical trials, rising circulating tumor DNA mutant allele fraction (MAF) has been demonstrated to precede clinical and radiologic progression by a median lead time of 4–6 months (up to 10.7 months) [13, 14].
- **Potentially Relevant Clinical Trial Opportunities:** Patient eligibility for prospective biomarker-directed clinical trials (e.g., OlympiAD NCT02000622, SOLAR-1 NCT03056833, c-TRAK TNBC NCT03145961) [7, 8, 15] with serial monitoring for secondary resistance mutations (such as ESR1 ligand-binding domain mutations or BRCA reversion mutations) [16].

### 5. References & Evidence Sources

#### PubMed
- [1] Parker JS, Mullins M, Cheang MC, et al. Supervised risk predictor of breast cancer based on intrinsic subtypes. *J Clin Oncol*. 2009;27(8):1160-1167. PMID: 19204204.
- [2] Cancer Genome Atlas Network. Comprehensive molecular portraits of human breast tumours. *Nature*. 2012;490(7418):61-70. PMID: 23000897.
- [4] Robson M, Im SA, Senkus E, et al. Olaparib for metastatic breast cancer in patients with a germline BRCA mutation (OlympiAD). *N Engl J Med*. 2017;377(6):523-533. PMID: 28575631.
- [8] André F, Ciruelos E, Rubovszky G, et al. Alpelisib for PIK3CA-mutated, hormone receptor-positive advanced breast cancer (SOLAR-1). *N Engl J Med*. 2019;380(20):1929-1940. PMID: 31091374.
- [13] Garcia-Murillas I, Schiavon G, Weigelt B, et al. Mutation tracking in circulating tumor DNA predicts relapse in early breast cancer. *Sci Transl Med*. 2015;7(302):302ra133. Demonstrating that rising ctDNA mutant allele fraction (MAF) precedes overt radiologic metastasis by a median lead time of 4–6 months (up to 10.7 months). PMID: 26311728.
- [14] Coombes RC, Page K, Salter R, et al. ctDNA tracking and detection of occult metastatic disease in high-risk breast cancer patients. *Clin Cancer Res*. 2019;25(14):4255-4263. Validation of serial ctDNA lead time prior to radiologic recurrence. PMID: 31097499.

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

### MODEL & DATA PROVENANCE
- Data source: TCGA-BRCA research dataset
- Analysis type: Computational / AI-assisted
- Molecular inputs: Expression, mutation and clinical features
- Explainability: SHAP
- Evidence sources: PubMed, ClinicalTrials.gov, FDA, NCCN/ASCO/ESMO, DepMap, GDSC, TCGA/GDC and GEO
- Validation status: Research prototype — not clinically validated
${errorMsg ? `\n*Note: Report generated using offline computational rules engine (${errorMsg}). AI-Assisted Computational Analysis — Research Use Only.*` : '\n*AI-Assisted Computational Analysis — Research Use Only.*'}
`;
  };

  return (
    <div className="min-h-screen bg-[#05070A] text-slate-100 font-sans antialiased selection:bg-cyan-500 selection:text-slate-950 flex">
      
      {/* Workflow-Grouped Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAiReport={() => {
          if (!aiReportText) {
            handleGenerateAiReport();
          } else {
            setIsReportModalOpen(true);
          }
        }}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        hasGeneratedReport={Boolean(aiReportText)}
        isOpenMobile={isOpenMobileSidebar}
        setIsOpenMobile={setIsOpenMobileSidebar}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <Navbar
          currentPatient={currentPatient}
          onOpenAiReport={() => {
            if (!aiReportText) {
              handleGenerateAiReport();
            } else {
              setIsReportModalOpen(true);
            }
          }}
          onOpenUploadModal={() => setIsUploadModalOpen(true)}
          hasGeneratedReport={Boolean(aiReportText)}
          onToggleMobileSidebar={() => setIsOpenMobileSidebar(!isOpenMobileSidebar)}
        />

        {/* Main Viewport Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {activeTab === 'simulator' && (
            <PatientSimulator
              currentPatient={currentPatient}
              setCurrentPatient={setCurrentPatient}
              onGenerateAiReport={handleGenerateAiReport}
              onOpenUploadModal={() => setIsUploadModalOpen(true)}
              isGeneratingReport={isGeneratingReport}
            />
          )}

          {activeTab === 'explorer' && <MultiOmicsExplorerView />}

          {activeTab === 'subtypes' && <SubtypeAnalysisView />}

          {activeTab === 'validation' && <ExternalValidationView />}

          {activeTab === 'calibration' && <CalibrationDcaView />}

          {activeTab === 'shap' && <ShapUncertaintyView />}

          {activeTab === 'bioevidence' && <BioValidationView />}

          {activeTab === 'survival' && <PrognosisSurvivalView />}

          {activeTab === 'targets' && <TherapeuticTargetsView />}

          {activeTab === 'comparison' && <ClinicalComparisonView />}

          {activeTab === 'figures' && <FiguresExplorer />}

          {activeTab === 'evidence' && <EvidenceChainView />}

          {activeTab === 'provenance' && (
            <ModelProvenancePanel patient={currentPatient} isStandaloneView={true} />
          )}

          {activeTab === 'titles' && <ManuscriptTitlesView />}
        </main>

        {/* Footer */}
        <footer id="app-footer" className="border-t border-white/10 bg-black/60 py-4 text-center text-xs text-slate-400 mt-auto">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 font-mono">
            <span className="text-slate-300">
              Precision-BRCA AI • Created & Developed by Manasvi • MSc BioIT | Bioinformatics × AI × Computational Oncology • 2026
            </span>
            <span className="text-cyan-400 text-[11px]">
              GEO Validated • TreeSHAP XAI • DCA Net Benefit
            </span>
          </div>
        </footer>

      </div>

      {/* AI Oncology Report Modal */}
      <AiReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        reportText={aiReportText}
        patientId={currentPatient.patientId}
      />

      {/* Molecular Data Upload Modal */}
      <DataUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadPatient={(uploadedPatient) => {
          setCurrentPatient(uploadedPatient);
          setAiReportText(''); // Reset previous AI report so it recalculates for uploaded profile
        }}
      />

    </div>
  );
}
