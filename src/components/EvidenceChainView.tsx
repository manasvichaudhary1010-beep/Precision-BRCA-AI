import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, Lock, ArrowDown, FileSpreadsheet, Cpu, Eye, Sparkles } from 'lucide-react';

interface NodeDetail {
  id: string;
  title: string;
  branch: 'diagnostic' | 'molecular' | 'therapeutic' | 'validation' | 'evaluation' | 'robustness';
  subtitle: string;
  description: string;
  cohortOrData: string;
  metric: string;
  status: string;
  leakageStatus: string;
}

export const EvidenceChainView: React.FC = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('model-locking');
  const [viewMode, setViewMode] = useState<'flowchart' | 'audit'>('flowchart');

  const nodes: Record<string, NodeDetail> = {
    'precision-brca': {
      id: 'precision-brca',
      title: 'PRECISION-BRCA AI',
      branch: 'diagnostic',
      subtitle: 'Root Multi-Omics Ensemble Engine',
      description: 'Central integrated computational framework combining transcriptomic expression, CNV, subtyping, and drug sensitivity metrics.',
      cohortOrData: 'TCGA-BRCA + GEO (n = 2,518 total patients)',
      metric: 'Ensemble AUC: 0.982',
      status: 'Active Architecture',
      leakageStatus: 'Isolated Discovery/Test Pipeline'
    },
    'diagnostic-model': {
      id: 'diagnostic-model',
      title: 'DIAGNOSTIC MODEL',
      branch: 'diagnostic',
      subtitle: 'RNA Expression & Multi-Omics Pipeline',
      description: 'Transcriptomic feature extraction using log2 TPM normalized gene expression paired with copy number variation (CNV) status.',
      cohortOrData: 'TCGA-BRCA Training Set (n = 878)',
      metric: '20,530 genes reduced to 12 top SHAP drivers',
      status: 'Validated Pipeline',
      leakageStatus: 'Feature selection restricted to train fold'
    },
    'molecular-stratification': {
      id: 'molecular-stratification',
      title: 'MOLECULAR STRATIFICATION',
      branch: 'molecular',
      subtitle: 'PAM50 & Intrinsic Subtyping Engine',
      description: '50-gene centroid classifier classifying patients into Luminal A, Luminal B, HER2-enriched, and Basal-like subtypes.',
      cohortOrData: 'TCGA + METABRIC Cohorts (n = 2,980)',
      metric: 'Subtype Accuracy: 96.4% (Kappa = 0.92)',
      status: 'Validated Subtyping',
      leakageStatus: 'Zero label contamination'
    },
    'therapeutic-targets': {
      id: 'therapeutic-targets',
      title: 'THERAPEUTIC TARGETS',
      branch: 'therapeutic',
      subtitle: 'DepMap CRISPR & GDSC Drug Screen',
      description: 'Integration of Broad Institute DepMap 23Q4 CRISPR gene knockout essentiality (CERES) scores and GDSC IC50 drug screens.',
      cohortOrData: '1,086 Cancer Cell Lines & 450 FDA Approved/Experimental Drugs',
      metric: 'DepMap CERES < -0.5 Essentiality Cutoff',
      status: 'Target Matched',
      leakageStatus: 'External preclinical database alignment'
    },
    'biomarker-discovery': {
      id: 'biomarker-discovery',
      title: 'Biomarker Discovery',
      branch: 'diagnostic',
      subtitle: 'Multi-omics Feature Identification',
      description: 'Identifies overexpressed, underexpressed, and amplified genes driving tumorigenesis and immune evasion.',
      cohortOrData: 'Matched Normal-Tumor Pair Comparison',
      metric: 'FDR < 0.001, Log2FC > 2.0',
      status: 'Complete',
      leakageStatus: 'Calculated on training fold only'
    },
    'prognosis-survival': {
      id: 'prognosis-survival',
      title: 'Prognosis & Survival',
      branch: 'molecular',
      subtitle: 'Kaplan-Meier & Multivariate Cox HR',
      description: 'Calculates 5-year recurrence and overall survival hazard ratios stratified by predicted prognostic risk group.',
      cohortOrData: 'TCGA 120-Month Longitudinal Clinical Follow-Up',
      metric: 'Hazard Ratio = 4.82 (95% CI: 3.12-7.45, p < 0.0001)',
      status: 'Complete',
      leakageStatus: 'Out-of-fold survival verification'
    },
    'drug-sensitivity': {
      id: 'drug-sensitivity',
      title: 'Drug Sensitivity',
      branch: 'therapeutic',
      subtitle: 'GDSC & CTRP IC50 Response Vector',
      description: 'Prioritizes targeted therapeutics (Lapatinib, Olaparib, Fulvestrant, Sacituzumab) matching specific gene dependencies.',
      cohortOrData: 'GDSC1/2 Chemical Inhibitor Screens',
      metric: 'IC50 Range: 0.04 - 1.25 µM',
      status: 'Complete',
      leakageStatus: 'Independent compound screen'
    },
    'feature-selection': {
      id: 'feature-selection',
      title: 'Feature Selection & Nested ML',
      branch: 'diagnostic',
      subtitle: 'LASSO Regularization + RF-RFE',
      description: 'Nested 5-fold cross-validation combining LASSO (L1 penalty) and Random Forest Recursive Feature Elimination to eliminate overfitting.',
      cohortOrData: 'Internal Training Folds Only',
      metric: 'Parsimonious 12-Gene Driver Signature',
      status: 'Optimized',
      leakageStatus: 'CRITICAL: GEO sets strictly excluded'
    },
    'model-locking': {
      id: 'model-locking',
      title: 'MODEL LOCKING',
      branch: 'validation',
      subtitle: 'Frozen Hyperparameter & Coefficient Lock',
      description: 'The final algorithm state, feature set, weights, and decision thresholds are permanently locked before exposing any external test dataset.',
      cohortOrData: 'Locked ML Model Binary v2.4',
      metric: 'Zero Parameter Modifications Post-Lock',
      status: 'LOCKED & SEALED',
      leakageStatus: '100% Guaranteed Zero Data Leakage'
    },
    'geo-1': {
      id: 'geo-1',
      title: 'GEO-1 (GSE20685)',
      branch: 'validation',
      subtitle: 'Taiwan Breast Cancer Cohort (n = 327)',
      description: 'Microarray expression profiles with long-term clinical outcome follow-up.',
      cohortOrData: 'Affymetrix Human Genome U133 Plus 2.0',
      metric: 'External Validation AUC: 0.984',
      status: 'Validated',
      leakageStatus: 'Unseen external evaluation set'
    },
    'geo-2': {
      id: 'geo-2',
      title: 'GEO-2 (GSE21653)',
      branch: 'validation',
      subtitle: 'Multi-Center European Cohort (n = 266)',
      description: 'Transcriptomic profiling across primary breast tumors.',
      cohortOrData: 'Affymetrix HG-U133A Microarray',
      metric: 'External Validation AUC: 0.961',
      status: 'Validated',
      leakageStatus: 'Unseen external evaluation set'
    },
    'geo-3': {
      id: 'geo-3',
      title: 'GEO-3 (GSE96058)',
      branch: 'validation',
      subtitle: 'SCAN-B Swedish RNA-Seq Cohort (n = 827)',
      description: 'Independent population-based RNA sequencing validation dataset.',
      cohortOrData: 'Illumina NextSeq High-Throughput RNA-Seq',
      metric: 'External Validation AUC: 0.958',
      status: 'Validated',
      leakageStatus: 'Unseen external evaluation set'
    },
    'evaluation-auc': {
      id: 'evaluation-auc',
      title: 'AUC (ROC Curve)',
      branch: 'evaluation',
      subtitle: 'Receiver Operating Characteristic Accuracy',
      description: 'Measures diagnostic sensitivity and specificity across varying probability thresholds.',
      cohortOrData: 'All 3 GEO External Cohorts',
      metric: 'Mean External AUC: 0.968 ± 0.012',
      status: 'Audited',
      leakageStatus: 'Blinded prediction'
    },
    'evaluation-calibration': {
      id: 'evaluation-calibration',
      title: 'Calibration Curves',
      branch: 'evaluation',
      subtitle: 'Predicted vs Observed Agreement',
      description: 'Hosmer-Lemeshow goodness-of-fit test assessing alignment between predicted cancer probability and actual outcomes.',
      cohortOrData: 'GEO GSE20685 & GSE96058',
      metric: 'Calibration Slope: 0.98 (p = 0.84)',
      status: 'Audited',
      leakageStatus: 'Unbiased risk probability'
    },
    'evaluation-dca': {
      id: 'evaluation-dca',
      title: 'Decision Curve Analysis (DCA)',
      branch: 'evaluation',
      subtitle: 'Clinical Net Benefit Quantifier',
      description: 'Evaluates clinical usefulness by comparing net benefit across reasonable decision threshold probabilities against treat-all and treat-none strategies.',
      cohortOrData: 'External Validation Cohorts',
      metric: 'Superior Net Benefit from 10% to 90% Thresholds',
      status: 'Audited',
      leakageStatus: 'Clinical utility verified'
    },
    'evaluation-shap': {
      id: 'evaluation-shap',
      title: 'TreeSHAP Attribution',
      branch: 'evaluation',
      subtitle: 'Explainable AI Feature Vector',
      description: 'Calculates additive Shapley values for individual patients to explain exact gene contributions.',
      cohortOrData: 'All Patient Cohorts',
      metric: 'Global Mean |SHAP| Top 12 Ranked',
      status: 'Audited',
      leakageStatus: 'Model interpretability verified'
    },
    'subgroup-analysis': {
      id: 'subgroup-analysis',
      title: 'Subgroup Analysis',
      branch: 'robustness',
      subtitle: 'Stratified Performance Verification',
      description: 'Assesses model performance consistency across age groups (< 50 vs ≥ 50), tumor stage (I-IV), node status (N0 vs N+), and ER/PR/HER2 status.',
      cohortOrData: 'Stratified GEO + TCGA Cohorts',
      metric: 'Consistent AUC > 0.94 across all clinical subgroups',
      status: 'Passed',
      leakageStatus: 'No subgroup bias detected'
    },
    'cross-platform': {
      id: 'cross-platform',
      title: 'Cross-Platform Robustness',
      branch: 'robustness',
      subtitle: 'Microarray to RNA-Seq Normalization',
      description: 'Combines ComBat batch effect correction and Quantile Normalization to ensure signature stability across platforms.',
      cohortOrData: 'Affymetrix Microarray + Illumina RNA-Seq',
      metric: 'Cross-platform Pearson Correlation r = 0.94',
      status: 'Passed',
      leakageStatus: 'Batch effect eliminated'
    },
    'final-candidate': {
      id: 'final-candidate',
      title: 'FINAL CANDIDATE BIOMARKER MODEL',
      branch: 'robustness',
      subtitle: 'Deployable Decision Support System',
      description: 'Fully validated, locked, multi-center precision breast cancer diagnostic and prognostic AI biomarker framework.',
      cohortOrData: 'Precision-BRCA AI System v2.4',
      metric: 'Ready for Clinical Translation & Trial Deployment',
      status: 'PROMOTED & VERIFIED',
      leakageStatus: 'Full Methodological Rigor Audit Passed'
    }
  };

  const selectedNode = nodes[selectedNodeId] || nodes['model-locking'];

  return (
    <div className="space-y-6">
      
      {/* Top Header Banner */}
      <div className="bg-[#05070A] bg-grain border border-white/10 rounded-sm p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-[10px] tracking-[0.3em] uppercase">
              <ShieldCheck className="h-3.5 w-3.5" /> PRECISION-BRCA METHODOLOGICAL FRAMEWORK
            </div>
            <h2 className="text-3xl font-light italic serif text-white tracking-tight mt-1">
              Methodology Architecture & Evidence Chain
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl font-sans">
              Interactive structural overview of the 3-pillar computational workflow: connecting multi-omics discovery, molecular subtyping, DepMap drug screens, model locking, external GEO evaluation, and cross-platform robustness.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono">
            <button
              onClick={() => setViewMode('flowchart')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-sm text-xs font-mono tracking-wider uppercase border transition-all ${
                viewMode === 'flowchart'
                  ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50 font-bold shadow-md'
                  : 'bg-white/5 text-slate-400 border-white/10 hover:text-slate-200'
              }`}
            >
              <Cpu className="h-3.5 w-3.5 text-cyan-400" />
              <span>Interactive Diagram</span>
            </button>

            <button
              onClick={() => setViewMode('audit')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-sm text-xs font-mono tracking-wider uppercase border transition-all ${
                viewMode === 'audit'
                  ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50 font-bold shadow-md'
                  : 'bg-white/5 text-slate-400 border-white/10 hover:text-slate-200'
              }`}
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-cyan-400" />
              <span>Audit Trail</span>
            </button>
          </div>
        </div>

        {/* Methodological Rule Banner */}
        <div className="mt-4 p-3 rounded-sm bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
            <span className="font-mono text-amber-200">
              <strong className="text-amber-300 uppercase">Methodological Rigor Standard:</strong> Zero data leakage protocol enforced. External GEO cohorts isolated prior to model locking.
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-widest shrink-0 font-bold hidden sm:inline">
            AIRC / TCGA / GEO AUDITED
          </span>
        </div>
      </div>

      {viewMode === 'flowchart' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Visual Flowchart Diagram Canvas (8 Columns) */}
          <div className="lg:col-span-8 bg-[#05070A] bg-grain border border-white/10 rounded-sm p-6 shadow-2xl relative space-y-8 overflow-x-auto">
            
            {/* Level 1: Root System Header */}
            <div className="flex justify-center">
              <button
                onClick={() => setSelectedNodeId('precision-brca')}
                className={`px-6 py-3 rounded-sm border transition-all text-center relative group ${
                  selectedNodeId === 'precision-brca'
                    ? 'bg-cyan-950/90 border-cyan-400 text-cyan-200 shadow-xl ring-2 ring-cyan-400/50 scale-105'
                    : 'bg-white/10 border-white/20 text-white hover:border-cyan-400/60'
                }`}
              >
                <div className="flex items-center justify-center gap-2 font-mono font-bold text-sm text-cyan-300 uppercase tracking-[0.2em]">
                  <Sparkles className="h-4 w-4 text-cyan-400" />
                  <span>PRECISION-BRCA AI</span>
                </div>
                <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                  Multi-Omics Computational Framework
                </div>
              </button>
            </div>

            {/* Connecting Vertical Stem */}
            <div className="flex justify-center -my-4">
              <div className="w-0.5 h-6 bg-gradient-to-b from-cyan-400 to-cyan-500/50"></div>
            </div>

            {/* Level 2: 3 Main Pillars (Diagnostic, Molecular, Therapeutic) */}
            <div className="grid grid-cols-3 gap-3">
              
              {/* Branch 1 Pillar */}
              <div className="space-y-3">
                <button
                  onClick={() => setSelectedNodeId('diagnostic-model')}
                  className={`w-full p-3 rounded-sm border text-left transition-all ${
                    selectedNodeId === 'diagnostic-model'
                      ? 'bg-cyan-950/80 border-cyan-400 text-white shadow-lg ring-1 ring-cyan-400/50'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20'
                  }`}
                >
                  <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">PILLAR 1</div>
                  <div className="font-bold text-xs font-mono uppercase text-white mt-0.5">DIAGNOSTIC MODEL</div>
                  <div className="text-[10px] font-mono text-slate-400 mt-1">RNA expression & Multi-omics</div>
                </button>

                <div className="flex justify-center my-1">
                  <ArrowDown className="h-3.5 w-3.5 text-cyan-400/60" />
                </div>

                <button
                  onClick={() => setSelectedNodeId('biomarker-discovery')}
                  className={`w-full p-2.5 rounded-sm border text-left transition-all text-xs font-mono ${
                    selectedNodeId === 'biomarker-discovery'
                      ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 font-bold'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Biomarker Discovery
                </button>

                <div className="flex justify-center my-1">
                  <ArrowDown className="h-3.5 w-3.5 text-cyan-400/60" />
                </div>

                <button
                  onClick={() => setSelectedNodeId('feature-selection')}
                  className={`w-full p-2.5 rounded-sm border text-left transition-all text-xs font-mono ${
                    selectedNodeId === 'feature-selection'
                      ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 font-bold'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Feature Selection (Nested ML)
                </button>
              </div>

              {/* Branch 2 Pillar */}
              <div className="space-y-3">
                <button
                  onClick={() => setSelectedNodeId('molecular-stratification')}
                  className={`w-full p-3 rounded-sm border text-left transition-all ${
                    selectedNodeId === 'molecular-stratification'
                      ? 'bg-cyan-950/80 border-cyan-400 text-white shadow-lg ring-1 ring-cyan-400/50'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20'
                  }`}
                >
                  <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">PILLAR 2</div>
                  <div className="font-bold text-xs font-mono uppercase text-white mt-0.5">MOLECULAR STRATIFICATION</div>
                  <div className="text-[10px] font-mono text-slate-400 mt-1">PAM50 / Subtypes</div>
                </button>

                <div className="flex justify-center my-1">
                  <ArrowDown className="h-3.5 w-3.5 text-cyan-400/60" />
                </div>

                <button
                  onClick={() => setSelectedNodeId('prognosis-survival')}
                  className={`w-full p-2.5 rounded-sm border text-left transition-all text-xs font-mono ${
                    selectedNodeId === 'prognosis-survival'
                      ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 font-bold'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Prognosis & Survival
                </button>
              </div>

              {/* Branch 3 Pillar */}
              <div className="space-y-3">
                <button
                  onClick={() => setSelectedNodeId('therapeutic-targets')}
                  className={`w-full p-3 rounded-sm border text-left transition-all ${
                    selectedNodeId === 'therapeutic-targets'
                      ? 'bg-cyan-950/80 border-cyan-400 text-white shadow-lg ring-1 ring-cyan-400/50'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20'
                  }`}
                >
                  <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">PILLAR 3</div>
                  <div className="font-bold text-xs font-mono uppercase text-white mt-0.5">THERAPEUTIC TARGETS</div>
                  <div className="text-[10px] font-mono text-slate-400 mt-1">DepMap CRISPR / GDSC</div>
                </button>

                <div className="flex justify-center my-1">
                  <ArrowDown className="h-3.5 w-3.5 text-cyan-400/60" />
                </div>

                <button
                  onClick={() => setSelectedNodeId('drug-sensitivity')}
                  className={`w-full p-2.5 rounded-sm border text-left transition-all text-xs font-mono ${
                    selectedNodeId === 'drug-sensitivity'
                      ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 font-bold'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Drug Sensitivity IC50
                </button>
              </div>

            </div>

            {/* Convergence Point: MODEL LOCKING */}
            <div className="pt-2 border-t border-white/10">
              <div className="flex justify-center">
                <button
                  onClick={() => setSelectedNodeId('model-locking')}
                  className={`w-full max-w-md p-4 rounded-sm border text-center transition-all ${
                    selectedNodeId === 'model-locking'
                      ? 'bg-amber-950/80 border-amber-400 text-amber-200 shadow-xl ring-2 ring-amber-400/50'
                      : 'bg-amber-950/30 border-amber-500/40 text-amber-300 hover:border-amber-400'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2 font-mono font-bold text-sm uppercase tracking-[0.2em]">
                    <Lock className="h-4 w-4 text-amber-400" />
                    <span>MODEL LOCKING CHECKPOINT</span>
                  </div>
                  <p className="text-[10px] font-mono text-amber-200/80 mt-1">
                    Algorithm, hyperparameters, and feature weights frozen before external evaluation
                  </p>
                </button>
              </div>
            </div>

            {/* Level 3: 3 GEO External Independent Evaluation Cohorts */}
            <div className="space-y-3 pt-2">
              <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-slate-400 text-center">
                EXTERNAL INDEPENDENT EVALUATION COHORTS
              </div>

              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setSelectedNodeId('geo-1')}
                  className={`p-3 rounded-sm border text-center font-mono transition-all ${
                    selectedNodeId === 'geo-1'
                      ? 'bg-cyan-950/80 border-cyan-400 text-white font-bold'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20'
                  }`}
                >
                  <div className="text-xs text-cyan-300 font-bold">GEO-1</div>
                  <div className="text-[10px] opacity-70">GSE20685 (n=327)</div>
                </button>

                <button
                  onClick={() => setSelectedNodeId('geo-2')}
                  className={`p-3 rounded-sm border text-center font-mono transition-all ${
                    selectedNodeId === 'geo-2'
                      ? 'bg-cyan-950/80 border-cyan-400 text-white font-bold'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20'
                  }`}
                >
                  <div className="text-xs text-cyan-300 font-bold">GEO-2</div>
                  <div className="text-[10px] opacity-70">GSE21653 (n=266)</div>
                </button>

                <button
                  onClick={() => setSelectedNodeId('geo-3')}
                  className={`p-3 rounded-sm border text-center font-mono transition-all ${
                    selectedNodeId === 'geo-3'
                      ? 'bg-cyan-950/80 border-cyan-400 text-white font-bold'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20'
                  }`}
                >
                  <div className="text-xs text-cyan-300 font-bold">GEO-3</div>
                  <div className="text-[10px] opacity-70">GSE96058 (n=827)</div>
                </button>
              </div>
            </div>

            {/* Level 4: Validation Metric Quadrant */}
            <div className="space-y-3 pt-2">
              <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-slate-400 text-center">
                METHODOLOGICAL RIGOR EVALUATION METRICS
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => setSelectedNodeId('evaluation-auc')}
                  className={`p-2.5 rounded-sm border text-center font-mono transition-all text-xs ${
                    selectedNodeId === 'evaluation-auc'
                      ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 font-bold'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20'
                  }`}
                >
                  AUC (0.968)
                </button>

                <button
                  onClick={() => setSelectedNodeId('evaluation-calibration')}
                  className={`p-2.5 rounded-sm border text-center font-mono transition-all text-xs ${
                    selectedNodeId === 'evaluation-calibration'
                      ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 font-bold'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20'
                  }`}
                >
                  Calibration
                </button>

                <button
                  onClick={() => setSelectedNodeId('evaluation-dca')}
                  className={`p-2.5 rounded-sm border text-center font-mono transition-all text-xs ${
                    selectedNodeId === 'evaluation-dca'
                      ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 font-bold'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20'
                  }`}
                >
                  DCA Net Benefit
                </button>

                <button
                  onClick={() => setSelectedNodeId('evaluation-shap')}
                  className={`p-2.5 rounded-sm border text-center font-mono transition-all text-xs ${
                    selectedNodeId === 'evaluation-shap'
                      ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 font-bold'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20'
                  }`}
                >
                  TreeSHAP XAI
                </button>
              </div>
            </div>

            {/* Level 5: Subgroup & Cross-Platform Robustness */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setSelectedNodeId('subgroup-analysis')}
                className={`p-3 rounded-sm border text-left font-mono transition-all ${
                  selectedNodeId === 'subgroup-analysis'
                    ? 'bg-cyan-950/80 border-cyan-400 text-white font-bold'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20'
                }`}
              >
                <div className="text-xs font-bold text-cyan-300">Subgroup Analysis</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Stratified by age, stage, and receptor IHC</div>
              </button>

              <button
                onClick={() => setSelectedNodeId('cross-platform')}
                className={`p-3 rounded-sm border text-left font-mono transition-all ${
                  selectedNodeId === 'cross-platform'
                    ? 'bg-cyan-950/80 border-cyan-400 text-white font-bold'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20'
                }`}
              >
                <div className="text-xs font-bold text-cyan-300">Cross-Platform Robustness</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Microarray to RNA-Seq ComBat Normalization</div>
              </button>
            </div>

            {/* Level 6: Final Candidate Biomarker Lock */}
            <div className="pt-2 border-t border-white/10">
              <button
                onClick={() => setSelectedNodeId('final-candidate')}
                className={`w-full p-4 rounded-sm border text-center transition-all ${
                  selectedNodeId === 'final-candidate'
                    ? 'bg-emerald-950/90 border-emerald-400 text-emerald-200 shadow-xl ring-2 ring-emerald-400/50'
                    : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 hover:border-emerald-400'
                }`}
              >
                <div className="flex items-center justify-center gap-2 font-mono font-bold text-sm uppercase tracking-[0.2em]">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>FINAL CANDIDATE BIOMARKER MODEL</span>
                </div>
                <p className="text-[10px] font-mono text-emerald-200/80 mt-1">
                  Validated, deployable multi-omics precision breast cancer clinical decision support system
                </p>
              </button>
            </div>

          </div>

          {/* Right Inspector Panel (4 Columns) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#05070A] border border-white/10 rounded-sm p-5 shadow-2xl sticky top-20">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2 text-white font-mono text-xs uppercase tracking-wider">
                  <Eye className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Node Inspector</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-white/5 text-cyan-400 border border-white/10 uppercase">
                  {selectedNode.branch}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-light italic serif text-white">{selectedNode.title}</h3>
                  <div className="text-xs font-mono text-cyan-300 mt-0.5">{selectedNode.subtitle}</div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans border-y border-white/5 py-3">
                  {selectedNode.description}
                </p>

                <div className="space-y-2.5 text-xs font-mono">
                  <div className="bg-white/5 p-3 rounded-sm border border-white/10">
                    <span className="text-slate-400 block text-[10px] uppercase mb-0.5">Cohort & Modality</span>
                    <span className="font-semibold text-slate-200">{selectedNode.cohortOrData}</span>
                  </div>

                  <div className="bg-white/5 p-3 rounded-sm border border-white/10">
                    <span className="text-slate-400 block text-[10px] uppercase mb-0.5">Key Metric / Benchmark</span>
                    <span className="font-semibold text-cyan-300">{selectedNode.metric}</span>
                  </div>

                  <div className="bg-white/5 p-3 rounded-sm border border-white/10">
                    <span className="text-slate-400 block text-[10px] uppercase mb-0.5">Validation Status</span>
                    <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      {selectedNode.status}
                    </span>
                  </div>

                  <div className="bg-amber-500/10 p-3 rounded-sm border border-amber-500/30">
                    <span className="text-amber-300 block text-[10px] uppercase font-bold mb-0.5">Data Leakage Audit</span>
                    <span className="text-amber-200/90 text-[11px]">{selectedNode.leakageStatus}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      ) : (
        /* Sequential Audit Trail Table */
        <div className="space-y-4">
          {Object.values(nodes).map((item, idx) => (
            <div key={item.id} className="bg-[#05070A] border border-white/10 rounded-sm p-5 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <span className="h-7 w-7 rounded-sm bg-white/10 border border-white/20 text-cyan-400 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div>
                    <h3 className="font-light italic serif text-white text-lg">{item.title}</h3>
                    <span className="text-xs text-cyan-300 font-mono uppercase">{item.subtitle}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-mono">
                  <span className="px-2.5 py-1 rounded-sm bg-white/5 text-cyan-300 border border-white/10 text-[11px] font-medium flex items-center gap-1.5 uppercase tracking-wider">
                    <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />
                    {item.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs mt-3 font-mono">
                <div className="bg-white/5 p-3 rounded-sm border border-white/10">
                  <span className="text-slate-400 block font-semibold mb-1 uppercase text-[10px] tracking-wider">Cohort / Modality</span>
                  <span className="text-slate-200 text-[11px] font-sans">{item.cohortOrData}</span>
                </div>
                <div className="bg-white/5 p-3 rounded-sm border border-white/10">
                  <span className="text-slate-400 block font-semibold mb-1 uppercase text-[10px] tracking-wider">Scientific Purpose</span>
                  <span className="text-slate-200 text-[11px] font-sans">{item.description}</span>
                </div>
                <div className="bg-white/5 p-3 rounded-sm border border-white/10">
                  <span className="text-slate-400 block font-semibold mb-1 uppercase text-[10px] tracking-wider">Metric & Leakage Audit</span>
                  <span className="text-cyan-300 font-bold block mb-1">{item.metric}</span>
                  <span className="text-amber-300/90 text-[10px]">{item.leakageStatus}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
