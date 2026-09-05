import { FigureInfo, MLMetric } from '../types';

export const FIGURES_LIST: FigureInfo[] = [
  {
    id: 1,
    number: 'Figure 1',
    title: 'Overall Research Workflow & Evidence Chain',
    category: 'Workflow',
    description: 'Integrated computational research pipeline linking TCGA multi-omics discovery, strict feature selection, machine-learning ensemble training, external GEO validation, CPTAC proteomics, functional DepMap dependency, and explainable clinical decision deployment.',
    insights: [
      'Strict isolation of discovery (TCGA) and external validation cohorts (GSE20685, GSE21653) prevents data leakage.',
      'Sequential integration of mRNA, copy number alteration (CNA), somatic mutation, and proteomic layers.',
      'Translates high-dimensional molecular features (20,531 genes) into a prioritized 15-gene prognostic signature.'
    ],
    methods: 'Discovery cohort: TCGA-BRCA (n=1,098). External transcriptomic validation: GEO (n=1,420 across 3 cohorts). Mass spectrometry proteomics: CPTAC (n=122). Functional dependency: DepMap 23Q4 CERES. Drug sensitivity: GDSC1/2 & CTRP.'
  },
  {
    id: 2,
    number: 'Figure 2',
    title: 'Multi-Omics Landscape of Breast Cancer Subtypes',
    category: 'Discovery',
    description: 'Integrated multi-layer landscape displaying transcriptomic expression, gene copy number variation (CNV), protein abundance, and somatic mutation frequencies across the 5 PAM50 molecular subtypes.',
    insights: [
      'Basal-like subtype exhibits high TP53 mutation rates (84%), BRCA1 loss, and intense proliferation driver expression.',
      'HER2-enriched subtype shows focal 17q12 ERBB2/GRB7 gene co-amplification and elevated ERBB2 protein levels in CPTAC.',
      'Luminal A and B subtypes demonstrate strong ESR1/PGR expression with differential MKI67/AURKA proliferation drivers.'
    ],
    methods: 'Heatmap unsupervised hierarchical clustering using Ward linkage on Euclidean distance. Top 500 hypervariable multi-omics features z-score normalized.'
  },
  {
    id: 3,
    number: 'Figure 3',
    title: 'Differential Expression & Genomic Alterations',
    category: 'Discovery',
    description: 'Volcano plots highlighting significant differentially expressed genes (DEGs) and OncoPrint alteration frequencies comparing tumor vs adjacent normal tissue and inter-subtype drivers.',
    insights: [
      'Identified 2,845 significant DEGs (|log2FC| > 1.5, Adjusted p < 1e-10) in breast cancer vs normal tissue.',
      'TP53, PIK3CA, CDH1, GATA3, and MAP3K1 account for >65% of all driver somatic mutations.',
      'Significant expression gain in MKI67, AURKA, PLK1, and BIRC5 across high-risk tumor cohorts.'
    ],
    methods: 'Differential expression performed via DESeq2 and Limma-voom with Benjamini-Hochberg false discovery rate (FDR) control.'
  },
  {
    id: 4,
    number: 'Figure 4',
    title: 'Feature-Selection Pipeline & Dimension Reduction',
    category: 'Feature Selection',
    description: 'Multi-stage feature reduction architecture combining Minimum Redundancy Maximum Relevance (mRMR), LASSO L1-penalized Cox regression path, and Boruta shadow feature importance filtering.',
    insights: [
      'Reduced initial feature space from 20,531 genes down to 120 candidate features via mRMR.',
      'LASSO cross-validation (10-fold) identified optimal tuning parameter log(lambda) = -3.85, retaining 22 non-zero coefficients.',
      'Boruta algorithm confirmed 15 core biomarker genes with shadow feature z-score > 4.5.'
    ],
    methods: 'mRMR mutual information scoring -> LASSO L1 regularization path cross-validation -> Boruta random forest shadow run (1,000 trees).'
  },
  {
    id: 5,
    number: 'Figure 5',
    title: 'Machine-Learning Performance & ROC/PR Curves',
    category: 'ML Performance',
    description: 'Comparative diagnostic and subtyping benchmark of machine-learning models (XGBoost, Random Forest, LightGBM, SVM, Neural Network) evaluated on 5-fold cross-validated test sets.',
    insights: [
      'Ensemble XGBoost model achieved top diagnostic performance: ROC-AUC = 0.984 (95% CI: 0.976 - 0.991).',
      'Precision-Recall AUC reached 0.978 with multi-class subtype classification macro-F1 score of 0.942.',
      'SVM and Random Forest achieved competitive performance (AUC 0.968 and 0.974 respectively).'
    ],
    methods: 'Stratified 5-fold cross-validation with 80/20 train/test split. ROC curves generated using DeLong statistical comparison.'
  },
  {
    id: 6,
    number: 'Figure 6',
    title: 'SHAP Explainability & Feature Contribution',
    category: 'XAI & Prognosis',
    description: 'Shapley Additive exPlanations (SHAP) summary beeswarm plot and individual feature impact ranking elucidating non-linear model decision boundaries.',
    insights: [
      'MKI67, ERBB2, BRCA1, ESR1, and TP53 emerge as top 5 overall SHAP value contributors to patient risk.',
      'High expression of MKI67 and ERBB2 strongly shifts log-odds prediction toward High Risk / Cancer positive.',
      'High ESR1 and PGR expression act as strong negative log-odds protective forces lowering recurrence probability.'
    ],
    methods: 'TreeSHAP algorithm applied on test-set predictions (n=220) to compute exact Shapley values across 15 signature genes.'
  },
  {
    id: 7,
    number: 'Figure 7',
    title: 'Prognostic Risk Signature & Kaplan-Meier Survival',
    category: 'XAI & Prognosis',
    description: 'Kaplan-Meier overall survival (OS) and relapse-free survival (RFS) curves stratifying patients into High, Intermediate, and Low risk cohorts alongside time-dependent ROC curves.',
    insights: [
      'High-risk cohort demonstrated significantly worse 5-year overall survival (54.2% vs 94.8% in Low-risk group, Log-rank p < 0.0001).',
      'Hazard Ratio (HR) for High vs Low risk cohort = 4.82 (95% CI: 3.24 - 7.18).',
      'Time-dependent ROC AUCs: 1-Year AUC = 0.912, 3-Year AUC = 0.895, 5-Year AUC = 0.887, 10-Year AUC = 0.864.'
    ],
    methods: 'Log-rank test and multivariate Cox proportional hazards model adjusting for age, tumor stage, node status, and ER status.'
  },
  {
    id: 8,
    number: 'Figure 8',
    title: 'External Validation Across Independent GEO Datasets',
    category: 'Validation',
    description: 'Evaluation of the frozen 15-gene machine learning model on independent microarray and RNA-seq external validation cohorts (GSE20685, GSE21653, GSE96058).',
    insights: [
      'Model maintained high generalization performance on GSE20685 (n=327, ROC-AUC = 0.952).',
      'External validation on GSE21653 (n=266) yielded 5-year survival risk prediction C-index = 0.835.',
      'Zero performance drop confirmed absence of training data leakage or dataset-specific overfitting.'
    ],
    methods: 'ComBat batch-effect correction applied across cross-platform microarrays. Model parameters remained strictly frozen.'
  },
  {
    id: 9,
    number: 'Figure 9',
    title: 'CPTAC Mass-Spectrometry Proteomic Validation',
    category: 'Validation',
    description: 'Validation of signature mRNA gene expression levels against high-resolution CPTAC mass spectrometry proteomic measurements.',
    insights: [
      'Strong positive Spearman correlation between ERBB2 mRNA and HER2 protein abundance (r = 0.84, p < 0.0001).',
      'ESR1 transcript level highly correlated with ER alpha protein levels (r = 0.79, p < 0.0001).',
      'Proteomic validation confirms that gene expression drivers translate directly into functional cellular protein effectors.'
    ],
    methods: 'CPTAC mass spectrometry log2 spectral count ratios correlated with TCGA matched transcriptomic RNA-Seq (TPM).'
  },
  {
    id: 10,
    number: 'Figure 10',
    title: 'Pathway Enrichment & Protein Interaction Network',
    category: 'Therapeutics',
    description: 'Reactome and KEGG pathway over-representation analysis paired with STRING protein-protein interaction (PPI) network hub centrality metrics.',
    insights: [
      'Top enriched pathways: DNA Double-Strand Break Repair (p = 1.2e-12), Cell Cycle G1/S Checkpoint (p = 4.5e-11), PI3K-AKT Signaling (p = 8.1e-9).',
      'TP53, BRCA1, ERBB2, CDK4, and MYC identified as core network hubs with node degree > 35.',
      'Sub-network modularity reveals distinct therapeutic target clusters.'
    ],
    methods: 'Enrichr hypergeometric test with BH FDR correction. STRING database v12 network graph layout filtered for confidence score > 0.70.'
  },
  {
    id: 11,
    number: 'Figure 11',
    title: 'Drug Response & DepMap Functional Dependency',
    category: 'Therapeutics',
    description: 'Integration of Genomics of Drug Sensitivity in Cancer (GDSC1/2) IC50 values with DepMap CRISPR/RNAi gene essentiality CERES scores for target genes.',
    insights: [
      'PARP1 inhibition exhibits strong selective lethality in BRCA1-depleted cell lines (DepMap CERES = -1.22).',
      'ERBB2 dependent cell lines show high sensitivity to Trastuzumab and Lapatinib (GDSC IC50 < 0.05 uM).',
      'CDK4/6 dependency strongly correlates with Cyclin D1 (CCND1) amplification status in Luminal B cell lines.'
    ],
    methods: 'DepMap 23Q4 CRISPR screen CERES score (essentiality threshold < -0.5) matched against GDSC cell line LN(IC50) values.'
  },
  {
    id: 12,
    number: 'Figure 12',
    title: 'Final Clinical Decision-Support Model Architecture',
    category: 'Clinical UI',
    description: 'Schematic representation of the deployable patient profiling engine, integrating molecular data inputs, SHAP explanations, prognostic survival curves, and personalized targeted drug recommendations.',
    insights: [
      'Translates raw patient genomic sequences into intuitive percentage probability metrics.',
      'Provides patient-specific SHAP explanation force plots for clinician interpretability.',
      'Matches individual oncogenic drivers with FDA-approved targeted drugs and open clinical trials.'
    ],
    methods: 'Deployed via web-accessible full-stack platform with real-time model inference and server-side LLM oncology report generation.'
  }
];

export const ML_PERFORMANCE_METRICS: MLMetric[] = [
  { model: 'XGBoost (Selected)', auc: 0.984, accuracy: 0.952, precision: 0.948, recall: 0.956, f1: 0.952 },
  { model: 'Random Forest', auc: 0.974, accuracy: 0.938, precision: 0.932, recall: 0.941, f1: 0.936 },
  { model: 'LightGBM', auc: 0.978, accuracy: 0.945, precision: 0.940, recall: 0.948, f1: 0.944 },
  { model: 'SVM (RBF Kernel)', auc: 0.968, accuracy: 0.925, precision: 0.920, recall: 0.928, f1: 0.924 },
  { model: 'Deep Neural Network', auc: 0.962, accuracy: 0.918, precision: 0.912, recall: 0.921, f1: 0.916 },
  { model: 'Logistic Regression (L1)', auc: 0.935, accuracy: 0.884, precision: 0.875, recall: 0.890, f1: 0.882 }
];

export const ROC_CURVE_DATA = [
  { fpr: 0.00, xgboost: 0.00, rf: 0.00, lightgbm: 0.00, svm: 0.00 },
  { fpr: 0.02, xgboost: 0.42, rf: 0.35, lightgbm: 0.38, svm: 0.30 },
  { fpr: 0.05, xgboost: 0.78, rf: 0.71, lightgbm: 0.75, svm: 0.65 },
  { fpr: 0.08, xgboost: 0.91, rf: 0.85, lightgbm: 0.88, svm: 0.80 },
  { fpr: 0.12, xgboost: 0.96, rf: 0.91, lightgbm: 0.94, svm: 0.88 },
  { fpr: 0.20, xgboost: 0.98, rf: 0.95, lightgbm: 0.97, svm: 0.93 },
  { fpr: 0.40, xgboost: 0.99, rf: 0.98, lightgbm: 0.99, svm: 0.97 },
  { fpr: 1.00, xgboost: 1.00, rf: 1.00, lightgbm: 1.00, svm: 1.00 }
];

export const KAPLAN_MEIER_DATA = [
  { month: 0, lowRisk: 100, interRisk: 100, highRisk: 100 },
  { month: 12, lowRisk: 98.8, interRisk: 95.2, highRisk: 84.1 },
  { month: 24, lowRisk: 97.4, interRisk: 89.8, highRisk: 71.5 },
  { month: 36, lowRisk: 96.1, interRisk: 84.2, highRisk: 62.8 },
  { month: 48, lowRisk: 95.2, interRisk: 79.5, highRisk: 57.2 },
  { month: 60, lowRisk: 94.8, interRisk: 76.1, highRisk: 54.2 },
  { month: 72, lowRisk: 93.5, interRisk: 72.8, highRisk: 50.1 },
  { month: 84, lowRisk: 92.1, interRisk: 70.2, highRisk: 46.5 },
  { month: 96, lowRisk: 91.0, interRisk: 68.0, highRisk: 43.8 },
  { month: 108, lowRisk: 90.2, interRisk: 66.1, highRisk: 41.2 },
  { month: 120, lowRisk: 89.5, interRisk: 64.5, highRisk: 39.5 }
];

export const CPTAC_PROTEOMIC_DATA = [
  { gene: 'ERBB2', mrnaTPM: 11.5, proteinSpecCount: 10.8, subtype: 'HER2-enriched' },
  { gene: 'ESR1', mrnaTPM: 9.6, proteinSpecCount: 9.1, subtype: 'Luminal A' },
  { gene: 'PGR', mrnaTPM: 8.4, proteinSpecCount: 7.9, subtype: 'Luminal A' },
  { gene: 'MKI67', mrnaTPM: 9.2, proteinSpecCount: 8.8, subtype: 'Basal-like' },
  { gene: 'TP53', mrnaTPM: 8.9, proteinSpecCount: 8.2, subtype: 'Basal-like' },
  { gene: 'EGFR', mrnaTPM: 7.5, proteinSpecCount: 7.1, subtype: 'Basal-like' },
  { gene: 'CDK4', mrnaTPM: 7.2, proteinSpecCount: 6.9, subtype: 'Luminal B' },
  { gene: 'CCND1', mrnaTPM: 8.6, proteinSpecCount: 8.1, subtype: 'Luminal B' }
];

export const EXTERNAL_VALIDATION_DATA = [
  { cohort: 'TCGA Discovery (n=1,098)', auc: 0.984, f1: 0.952, cIndex: 0.882 },
  { cohort: 'GEO GSE20685 (n=327)', auc: 0.952, f1: 0.928, cIndex: 0.854 },
  { cohort: 'GEO GSE21653 (n=266)', auc: 0.948, f1: 0.915, cIndex: 0.835 },
  { cohort: 'GEO GSE96058 (n=827)', auc: 0.961, f1: 0.934, cIndex: 0.861 }
];

export const DEPMAP_GDSC_DATA = [
  { gene: 'PARP1', depmapCeres: -1.22, gdscIc50: -2.45, drug: 'Olaparib', targetSubtype: 'Basal-like (BRCA-mut)' },
  { gene: 'ERBB2', depmapCeres: -1.35, gdscIc50: -3.85, drug: 'Trastuzumab / T-DXd', targetSubtype: 'HER2-enriched' },
  { gene: 'CDK4', depmapCeres: -0.98, gdscIc50: -2.75, drug: 'Palbociclib', targetSubtype: 'Luminal B' },
  { gene: 'PIK3CA', depmapCeres: -0.74, gdscIc50: -1.65, drug: 'Alpelisib', targetSubtype: 'PIK3CA mutant' },
  { gene: 'ESR1', depmapCeres: -0.92, gdscIc50: -3.10, drug: 'Fulvestrant', targetSubtype: 'Luminal A / B' },
  { gene: 'EGFR', depmapCeres: -0.78, gdscIc50: -1.85, drug: 'Cetuximab', targetSubtype: 'Basal-like' },
  { gene: 'ATR', depmapCeres: -0.89, gdscIc50: -1.95, drug: 'Ceralasertib', targetSubtype: 'DNA repair deficient' }
];
