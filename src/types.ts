export type MolecularSubtype = 'Basal-like' | 'HER2-enriched' | 'Luminal A' | 'Luminal B' | 'Normal-like';

export type PrognosticRiskLevel = 'Low' | 'Intermediate' | 'High';

export type PatientDataType = 
  | 'TCGA RESEARCH SAMPLE'
  | 'SYNTHETIC DEMO'
  | 'RECONSTRUCTED DEMONSTRATION CASE'
  | 'UPLOADED PATIENT';

export type AppModuleId = 
  | 'dashboard'
  | 'explorer'
  | 'discovery'
  | 'model'
  | 'subtypes'
  | 'validation'
  | 'calibration'
  | 'shap'
  | 'bio_validation'
  | 'prognosis'
  | 'therapeutics'
  | 'clinical_comp'
  | 'manuscript';

export interface BiomarkerGene {
  gene: string;
  shapValue: number; // positive increases risk, negative decreases risk
  expressionLevel: number; // log2 TPM or Z-score
  baselineMean: number;
  status: 'Overexpressed' | 'Underexpressed' | 'Mutated' | 'Amplified' | 'Wildtype';
  pathway: string;
  oddsRatio?: number;
  confidenceInterval?: [number, number];
  pVal?: string;
  mutationFreq?: number; // %
  cnvGainFreq?: number; // %
  cptacProteinCorr?: number;
}

export interface TherapeuticTarget {
  gene: string;
  drug: string;
  mechanism: string;
  depmapScore: number; // CERES score (more negative = more essential, e.g. -0.85)
  gdscIc50: number; // Log IC50 uM
  evidenceLevel: 'FDA Approved' | 'Phase III Trial' | 'Phase II Trial' | 'Preclinical Evidence';
  clinicalIndication?: string;
}

export interface UncertaintyMetrics {
  confidenceInterval95: [number, number]; // e.g. [0.91, 0.97]
  conformalInterval: [number, number]; // e.g. [0.88, 0.98]
  uncertaintyLevel: 'Low' | 'Moderate' | 'High';
  bootstrapStdErr: number;
}

export interface ClinicalModelComparison {
  model1MolecularAuc: number;
  model2ClinicalAuc: number;
  model3CombinedAuc: number;
  netReclassificationIndex: number; // e.g. +28.4%
  integratedDiscriminationIndex: number; // e.g. +0.142
  cIndexImprovement: number; // e.g. 0.76 -> 0.88
}

export interface PatientProfile {
  id: string;
  patientId: string;
  name: string;
  dataType?: PatientDataType;
  age: number;
  menopausalStatus: 'Pre-menopausal' | 'Post-menopausal';
  tumorStage: 'Stage I' | 'Stage IIA' | 'Stage IIB' | 'Stage IIIA' | 'Stage IIIB' | 'Stage IV';
  tumorSize: number; // cm
  nodeStatus: 'N0 (0 nodes)' | 'N1 (1-3 nodes)' | 'N2 (4-9 nodes)' | 'N3 (10+ nodes)';
  erStatus: 'Positive' | 'Negative';
  prStatus: 'Positive' | 'Negative';
  her2Status: 'Positive' | 'Negative';
  cancerProbability: number; // e.g. 0.94
  uncertainty?: UncertaintyMetrics;
  molecularSubtype: MolecularSubtype;
  subtypeConfidence: number; // e.g. 96.4%
  prognosticRisk: PrognosticRiskLevel;
  fiveYearRisk: number; // % predicted 5-year recurrence/mortality risk
  topGenes: BiomarkerGene[];
  pathways: string[];
  targets: TherapeuticTarget[];
  clinicalComparison?: ClinicalModelComparison;
  provenance?: ProvenanceDossier;
  notes: string;
}

export interface ModelProvenanceData {
  algorithm: string;
  ensembleArchitecture: string;
  trainingCohort: string;
  trainingSampleCount: number;
  featureSelectionScheme: string;
  externalValidation: 'Yes (Multi-Cohort Hold-out)' | 'No';
  externalValidationCohorts: {
    cohortName: string;
    sampleSize: number;
    platform: string;
    auroc: number;
    auprc: number;
  }[];
  aurocDiscovery: number;
  aurocDiscoveryCi: [number, number];
  auprcDiscovery: number;
  auprcDiscoveryCi: [number, number];
  brierScore: number;
  brierBaseline: number;
  calibrationSlope: number;
  calibrationIntercept: number;
  hosmerLemeshowPVal: number;
  calibrationMethod: string;
  patientConfidenceInterval95: [number, number];
  conformalInterval95: [number, number];
  bootstrapStdError: number;
}

export interface PatientEvidenceData {
  erStatus: {
    status: 'Positive' | 'Negative';
    allredScore: string;
    positivePercent: number;
    ihcIntensity: 'Strong (3+)' | 'Moderate (2+)' | 'Weak (1+)' | 'None (0)';
  };
  prStatus: {
    status: 'Positive' | 'Negative';
    allredScore: string;
    positivePercent: number;
    ihcIntensity: 'Strong (3+)' | 'Moderate (2+)' | 'Weak (1+)' | 'None (0)';
  };
  her2Status: {
    status: 'Positive' | 'Negative';
    ihcScore: '0' | '1+' | '2+' | '3+';
    fishRatio?: number;
    fishResult: 'Amplified' | 'Non-Amplified' | 'Equivocal' | 'N/A';
  };
  ki67: {
    percentIndex: number;
    interpretation: 'High (>20%)' | 'Intermediate (10-20%)' | 'Low (<10%)';
    stainingMethod: string;
    pam50ProliferationScore: number;
  };
  somaticMutations: {
    gene: string;
    hgvsCdna: string;
    hgvsProtein: string;
    vaf: number;
    clinVar: 'Pathogenic' | 'Likely Pathogenic' | 'VUS' | 'Benign';
    cosmicId?: string;
    exon: string;
    functionalImpact: string;
  }[];
  expressionSignatures: {
    signatureName: string;
    score: number;
    percentile: number;
    riskClassification: string;
    clinicalReference: string;
  }[];
  pathways: {
    pathwayName: string;
    database: 'KEGG' | 'Reactome' | 'MSigDB Hallmarks';
    enrichmentScore: number;
    fdrQValue: number;
    leadingEdgeGenes: string[];
    activationState: 'Activated' | 'Suppressed' | 'Dysregulated';
  }[];
}

export interface TherapeuticEvidenceItem {
  targetGene: string;
  drugName: string;
  guidelineSource: string;
  evidenceLevel: 'ESCAT Level I-A' | 'ESCAT Level I-B' | 'ESCAT Level II-A' | 'OncoKB Level 1' | 'OncoKB Level 2';
  regulatoryStatus: string;
  clinicalTrial: {
    trialName: string;
    nctId: string;
    phase: string;
    primaryEndpoint: string;
    citation: string;
  };
  literatureCitation: {
    authors: string;
    title: string;
    journal: string;
    year: number;
    pmid: string;
  };
  lastVerifiedDate: string;
  curatorReviewBoard: string;
}

export interface ProvenanceDossier {
  model: ModelProvenanceData;
  patientEvidence: PatientEvidenceData;
  therapeuticEvidence: TherapeuticEvidenceItem[];
  provenanceHash: string;
  timestamp: string;
  complianceLevel: 'CLIA / CAP Research Grade' | 'Investigational Use Only';
}

export interface FigureInfo {
  id: number;
  number: string;
  title: string;
  category: 'Workflow' | 'Discovery' | 'Feature Selection' | 'ML Performance' | 'XAI & Prognosis' | 'Validation' | 'Therapeutics' | 'Clinical UI' | 'Calibration & DCA' | 'Clinical Comparison';
  description: string;
  insights: string[];
  methods: string;
}

export interface MLMetric {
  model: string;
  auc: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  brierScore?: number;
}

export interface CalibrationMetrics {
  brierScore: number;
  calibrationSlope: number;
  calibrationIntercept: number;
  hosmerLemeshowPVal: number;
  sensitivity: number;
  specificity: number;
  ppv: number;
  npv: number;
}

export interface EvidenceStep {
  step: number;
  name: string;
  dataset: string;
  sampleCount: string;
  purpose: string;
  rigorMeasure: string;
  status: 'Validated' | 'Reproduced';
}

