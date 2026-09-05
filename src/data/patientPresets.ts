import { PatientProfile } from '../types';

export const PATIENT_PRESETS: PatientProfile[] = [
  {
    id: 'pt-001',
    patientId: 'TCGA-BRCA-A2-010',
    name: 'Patient #001 (Basal-like Triple-Negative High Risk)',
    dataType: 'TCGA RESEARCH SAMPLE',
    age: 48,
    menopausalStatus: 'Pre-menopausal',
    tumorStage: 'Stage IIB',
    tumorSize: 3.2,
    nodeStatus: 'N1 (1-3 nodes)',
    erStatus: 'Negative',
    prStatus: 'Negative',
    her2Status: 'Negative',
    cancerProbability: 98.2,
    molecularSubtype: 'Basal-like',
    subtypeConfidence: 96.8,
    prognosticRisk: 'High',
    fiveYearRisk: 74.5,
    topGenes: [
      { gene: 'BRCA1', shapValue: +0.28, expressionLevel: 1.2, baselineMean: 4.5, status: 'Mutated', pathway: 'DNA Repair' },
      { gene: 'TP53', shapValue: +0.24, expressionLevel: 8.9, baselineMean: 3.1, status: 'Mutated', pathway: 'P53 Signaling' },
      { gene: 'EGFR', shapValue: +0.19, expressionLevel: 7.4, baselineMean: 2.8, status: 'Overexpressed', pathway: 'RTK-RAS' },
      { gene: 'MKI67', shapValue: +0.16, expressionLevel: 9.1, baselineMean: 3.5, status: 'Overexpressed', pathway: 'Cell Cycle' },
      { gene: 'PARP1', shapValue: +0.12, expressionLevel: 8.3, baselineMean: 3.2, status: 'Overexpressed', pathway: 'DNA Repair' },
      { gene: 'ESR1', shapValue: -0.15, expressionLevel: 0.8, baselineMean: 6.2, status: 'Underexpressed', pathway: 'Estrogen Receptor' }
    ],
    pathways: ['DNA repair deficiency', 'Cell cycle acceleration (G1/S checkpoint loss)', 'PI3K-AKT dysregulation', 'P53 inactivation'],
    targets: [
      { gene: 'PARP1', drug: 'Olaparib / Talazoparib', mechanism: 'Synthetic lethality in BRCA1/2 deficient cells via PARP trapping', depmapScore: -1.12, gdscIc50: -2.45, evidenceLevel: 'FDA Approved' },
      { gene: 'EGFR', drug: 'Cetuximab', mechanism: 'Anti-EGFR monoclonal antibody inhibiting RTK proliferation', depmapScore: -0.78, gdscIc50: -1.85, evidenceLevel: 'Phase III Trial' },
      { gene: 'ATR', drug: 'Ceralasertib', mechanism: 'Inhibition of DNA damage response kinase ATR', depmapScore: -0.89, gdscIc50: -1.95, evidenceLevel: 'Phase II Trial' }
    ],
    notes: 'Classic Triple-Negative Breast Cancer (TNBC) presenting with germline BRCA1 mutation and high tumor mutational burden. High SHAP contribution from MKI67 and PARP1 indicating strong cell cycle driver signaling.'
  },
  {
    id: 'pt-002',
    patientId: 'TCGA-BRCA-E2-A10',
    name: 'Patient #002 (Luminal A Low Risk ER+)',
    dataType: 'TCGA RESEARCH SAMPLE',
    age: 62,
    menopausalStatus: 'Post-menopausal',
    tumorStage: 'Stage I',
    tumorSize: 1.4,
    nodeStatus: 'N0 (0 nodes)',
    erStatus: 'Positive',
    prStatus: 'Positive',
    her2Status: 'Negative',
    cancerProbability: 91.5,
    molecularSubtype: 'Luminal A',
    subtypeConfidence: 94.2,
    prognosticRisk: 'Low',
    fiveYearRisk: 8.2,
    topGenes: [
      { gene: 'ESR1', shapValue: -0.32, expressionLevel: 9.8, baselineMean: 6.2, status: 'Overexpressed', pathway: 'Estrogen Receptor' },
      { gene: 'PGR', shapValue: -0.26, expressionLevel: 8.6, baselineMean: 4.8, status: 'Overexpressed', pathway: 'Estrogen Receptor' },
      { gene: 'FOXA1', shapValue: -0.18, expressionLevel: 7.9, baselineMean: 4.1, status: 'Overexpressed', pathway: 'Luminal Differentiation' },
      { gene: 'BCL2', shapValue: -0.14, expressionLevel: 8.1, baselineMean: 4.5, status: 'Overexpressed', pathway: 'Apoptosis Regulation' },
      { gene: 'MKI67', shapValue: -0.22, expressionLevel: 1.9, baselineMean: 3.5, status: 'Underexpressed', pathway: 'Cell Cycle' },
      { gene: 'PIK3CA', shapValue: +0.08, expressionLevel: 5.2, baselineMean: 4.0, status: 'Mutated', pathway: 'PI3K-AKT' }
    ],
    pathways: ['Estrogen receptor alpha transcriptional pathway', 'Luminal cell lineage specification', 'Intact p53 signaling', 'Low mitotic index'],
    targets: [
      { gene: 'ESR1', drug: 'Tamoxifen / Fulvestrant / Letrozole', mechanism: 'Selective Estrogen Receptor Modulation / Degradation', depmapScore: -0.92, gdscIc50: -3.10, evidenceLevel: 'FDA Approved' },
      { gene: 'PIK3CA', drug: 'Alpelisib', mechanism: 'PI3K alpha-selective inhibitor for PIK3CA mutant hormone receptor tumors', depmapScore: -0.65, gdscIc50: -1.42, evidenceLevel: 'FDA Approved' }
    ],
    notes: 'Low proliferation Luminal A profile with high ESR1/PGR expression and favorable 5-year survival probability. Minimal risk of distant recurrence.'
  },
  {
    id: 'pt-003',
    patientId: 'TCGA-BRCA-BH-A01',
    name: 'Patient #003 (HER2-Enriched High Risk Amplified)',
    dataType: 'TCGA RESEARCH SAMPLE',
    age: 55,
    menopausalStatus: 'Post-menopausal',
    tumorStage: 'Stage IIIA',
    tumorSize: 4.1,
    nodeStatus: 'N2 (4-9 nodes)',
    erStatus: 'Negative',
    prStatus: 'Negative',
    her2Status: 'Positive',
    cancerProbability: 97.6,
    molecularSubtype: 'HER2-enriched',
    subtypeConfidence: 98.1,
    prognosticRisk: 'High',
    fiveYearRisk: 62.1,
    topGenes: [
      { gene: 'ERBB2', shapValue: +0.42, expressionLevel: 11.8, baselineMean: 3.0, status: 'Amplified', pathway: 'HER2-RTK' },
      { gene: 'GRB7', shapValue: +0.28, expressionLevel: 10.2, baselineMean: 2.5, status: 'Amplified', pathway: 'HER2 Co-amplicon' },
      { gene: 'PIK3CA', shapValue: +0.18, expressionLevel: 7.6, baselineMean: 4.0, status: 'Mutated', pathway: 'PI3K-AKT' },
      { gene: 'EGFR', shapValue: +0.12, expressionLevel: 6.1, baselineMean: 2.8, status: 'Overexpressed', pathway: 'RTK-RAS' },
      { gene: 'MKI67', shapValue: +0.15, expressionLevel: 8.4, baselineMean: 3.5, status: 'Overexpressed', pathway: 'Cell Cycle' },
      { gene: 'ESR1', shapValue: -0.10, expressionLevel: 1.1, baselineMean: 6.2, status: 'Underexpressed', pathway: 'Estrogen Receptor' }
    ],
    pathways: ['HER2/ERBB2 receptor tyrosine kinase signaling', 'PI3K-AKT-mTOR pathway activation', '17q12 amplicon overexpression', 'MAPK cascade'],
    targets: [
      { gene: 'ERBB2', drug: 'Trastuzumab + Pertuzumab / T-DXd', mechanism: 'Anti-HER2 monoclonal antibody pairing & antibody-drug conjugate', depmapScore: -1.35, gdscIc50: -3.85, evidenceLevel: 'FDA Approved' },
      { gene: 'ERBB2', drug: 'Tucatinib / Lapatinib', mechanism: 'Small molecule HER2 kinase domain inhibitor', depmapScore: -1.18, gdscIc50: -2.90, evidenceLevel: 'FDA Approved' },
      { gene: 'PIK3CA', drug: 'Inavolisib', mechanism: 'PI3K alpha inhibitor with mutant degradation', depmapScore: -0.74, gdscIc50: -1.65, evidenceLevel: 'FDA Approved' }
    ],
    notes: 'Strong ERBB2/GRB7 gene amplification on 17q12 chromosome locus driving extreme receptor tyrosine kinase signaling and high prognostic recurrence risk.'
  },
  {
    id: 'pt-004',
    patientId: 'TCGA-BRCA-AC-A2F',
    name: 'Patient #004 (Luminal B High Proliferation Intermediate Risk)',
    dataType: 'TCGA RESEARCH SAMPLE',
    age: 51,
    menopausalStatus: 'Post-menopausal',
    tumorStage: 'Stage IIA',
    tumorSize: 2.6,
    nodeStatus: 'N1 (1-3 nodes)',
    erStatus: 'Positive',
    prStatus: 'Negative',
    her2Status: 'Negative',
    cancerProbability: 95.1,
    molecularSubtype: 'Luminal B',
    subtypeConfidence: 91.7,
    prognosticRisk: 'Intermediate',
    fiveYearRisk: 34.8,
    topGenes: [
      { gene: 'ESR1', shapValue: -0.18, expressionLevel: 7.2, baselineMean: 6.2, status: 'Overexpressed', pathway: 'Estrogen Receptor' },
      { gene: 'MKI67', shapValue: +0.26, expressionLevel: 7.8, baselineMean: 3.5, status: 'Overexpressed', pathway: 'Cell Cycle' },
      { gene: 'CCND1', shapValue: +0.22, expressionLevel: 8.5, baselineMean: 3.8, status: 'Amplified', pathway: 'Cell Cycle G1' },
      { gene: 'CDK4', shapValue: +0.17, expressionLevel: 7.1, baselineMean: 3.6, status: 'Overexpressed', pathway: 'Cell Cycle G1' },
      { gene: 'AURKA', shapValue: +0.19, expressionLevel: 6.9, baselineMean: 2.4, status: 'Overexpressed', pathway: 'Mitotic Spindle' },
      { gene: 'PGR', shapValue: +0.05, expressionLevel: 2.1, baselineMean: 4.8, status: 'Underexpressed', pathway: 'Estrogen Receptor' }
    ],
    pathways: ['Estrogen receptor positivity with loss of PGR', 'CDK4/6-Cyclin D1 cell cycle transition', 'High mitotic proliferation score', 'E2F transcription factor activation'],
    targets: [
      { gene: 'CDK4', drug: 'Palbociclib / Ribociclib / Abemaciclib', mechanism: 'Reversible CDK4/6 kinase inhibition blocking G1/S transition', depmapScore: -0.98, gdscIc50: -2.75, evidenceLevel: 'FDA Approved' },
      { gene: 'ESR1', drug: 'Fulvestrant + CDK4/6 inhibitor', mechanism: 'Combination endocrine plus cell cycle inhibition', depmapScore: -0.85, gdscIc50: -2.30, evidenceLevel: 'FDA Approved' }
    ],
    notes: 'Luminal B profile featuring ER positivity combined with aggressive MKI67/AURKA proliferation metrics. Indicated for endocrine therapy combined with CDK4/6 inhibitors.'
  },
  {
    id: 'pt-005',
    patientId: 'TCGA-BRCA-A7-078',
    name: 'Patient #005 (Normal-like Low Tumor Content)',
    dataType: 'RECONSTRUCTED DEMONSTRATION CASE',
    age: 59,
    menopausalStatus: 'Post-menopausal',
    tumorStage: 'Stage I',
    tumorSize: 1.1,
    nodeStatus: 'N0 (0 nodes)',
    erStatus: 'Positive',
    prStatus: 'Positive',
    her2Status: 'Negative',
    cancerProbability: 88.4,
    molecularSubtype: 'Normal-like',
    subtypeConfidence: 89.1,
    prognosticRisk: 'Low',
    fiveYearRisk: 6.1,
    topGenes: [
      { gene: 'CD36', shapValue: -0.21, expressionLevel: 6.4, baselineMean: 6.1, status: 'Wildtype', pathway: 'Adipocyte Signaling' },
      { gene: 'FABP4', shapValue: -0.19, expressionLevel: 7.1, baselineMean: 6.8, status: 'Wildtype', pathway: 'Fatty Acid Metabolism' },
      { gene: 'ESR1', shapValue: -0.15, expressionLevel: 6.8, baselineMean: 6.2, status: 'Overexpressed', pathway: 'Estrogen Receptor' },
      { gene: 'MKI67', shapValue: -0.28, expressionLevel: 1.4, baselineMean: 3.5, status: 'Underexpressed', pathway: 'Cell Cycle' },
      { gene: 'TP53', shapValue: -0.12, expressionLevel: 3.0, baselineMean: 3.1, status: 'Wildtype', pathway: 'P53 Signaling' }
    ],
    pathways: ['Adipocyte lipid transport and metabolism', 'Baseline stromal gene signature', 'Low proliferation capacity', 'Normal tissue background'],
    targets: [
      { gene: 'ESR1', drug: 'Anastrozole / Letrozole', mechanism: 'Aromatase inhibition preventing peripheral estrogen conversion', depmapScore: -0.52, gdscIc50: -1.90, evidenceLevel: 'FDA Approved' }
    ],
    notes: 'Normal-like expression profile characterized by prominent stromal and adipose gene signatures (CD36, FABP4) with low mitotic index.'
  }
];
