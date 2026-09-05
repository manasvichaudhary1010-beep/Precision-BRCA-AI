import React, { useState } from 'react';
import { BookOpen, CheckCircle2, Star, Award, Copy, Download, FileText, Sparkles, Layers, ArrowRight } from 'lucide-react';

export const ManuscriptTitlesView: React.FC = () => {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const publicationSeries = [
    {
      type: 'PRIMARY MANUSCRIPT (CORE STUDY)',
      title: 'Development and External Evaluation of an Explainable Multi-Omic Diagnostic Signature for Breast Cancer',
      focus: 'Primary Diagnostic & External Validation Paper',
      journals: 'Nature Medicine / Cell Reports Medicine / Cancer Cell / Lancet Digital Health',
      rationale: 'Focuses strictly on the diagnostic biomarker discovery, zero-leakage external GEO cohort validation, calibration, DCA net benefit, and TreeSHAP explainability. Keeps the manuscript tight, rigorous, and highly publishable.',
      keyFigures: ['Figure 1: Workflow & Zero-Leakage Architecture', 'Figure 2: GEO External ROC-AUC Validation', 'Figure 3: Calibration & Decision Curve Analysis', 'Figure 4: TreeSHAP Feature Attribution'],
      status: 'Primary Focus (Recommended)'
    },
    {
      type: 'FOLLOW-UP PAPER PROPOSAL 1',
      title: 'Prognostic Stratification and Survival Validation of the Precision-BRCA Molecular Signature across Longitudinal Cohorts',
      focus: 'Secondary Survival & Prognostic Risk Paper',
      journals: 'Journal of Clinical Oncology (JCO) / Clinical Cancer Research / Annals of Oncology',
      rationale: 'Leverages the 10-year follow-up TCGA and GEO datasets to test whether the diagnostic signature possesses independent prognostic survival value (HR = 4.82, C-index = 0.842) beyond AJCC stage and nodal status.',
      keyFigures: ['Figure 5: Kaplan-Meier Survival Stratification', 'Figure 6: Multivariate Cox Proportional Hazards Model', 'Figure 7: Time-Dependent ROC AUC Curves'],
      status: 'Follow-Up Study 1'
    },
    {
      type: 'FOLLOW-UP PAPER PROPOSAL 2',
      title: 'Translational Precision Therapeutics: DepMap CRISPR Dependency and GDSC Drug Sensitivity Mapping in Breast Cancer',
      focus: 'Precision Oncology & Target Prioritization Paper',
      journals: 'Cancer Discovery / Science Translational Medicine / Theranostics',
      rationale: 'Translates the top candidate driver genes into therapeutic targets using DepMap CERES CRISPR knockout essentiality and GDSC chemical inhibitor IC50 screens.',
      keyFigures: ['Figure 8: DepMap Essentiality CERES Matrix', 'Figure 9: GDSC IC50 Sensitivity Response Vectors', 'Figure 10: Drug-Gene Interaction Network'],
      status: 'Follow-Up Study 2'
    }
  ];

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-[#05070A] bg-grain border border-white/10 rounded-sm p-6 shadow-2xl">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-[10px] tracking-[0.3em] uppercase mb-1">
          <BookOpen className="h-3.5 w-3.5" /> MODULE 12 • FOCUSED PUBLICATION STRATEGY & MANUSCRIPT BLUEPRINT
        </div>
        <h2 className="text-3xl font-light italic serif text-white tracking-tight">
          Focused Research Program & Publication Strategy
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl font-sans">
          Avoiding the trap of an over-broad software demo. Structuring a primary high-impact diagnostic manuscript supported by two focused follow-up papers.
        </p>
      </div>

      {/* 3 Publication Series Cards */}
      <div className="space-y-4">
        {publicationSeries.map((paper, idx) => (
          <div key={idx} className="bg-[#05070A] border border-white/10 rounded-sm p-6 shadow-xl space-y-4 font-mono">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
              <span className={`text-[10px] uppercase font-bold px-3 py-1 rounded-sm border tracking-widest ${
                idx === 0
                  ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50'
                  : 'bg-white/5 text-slate-300 border-white/10'
              }`}>
                {paper.type}
              </span>
              <span className="text-xs text-slate-400 font-sans">{paper.focus}</span>
            </div>

            <h3 className="text-2xl font-light italic serif text-white leading-snug">
              "{paper.title}"
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
              <div className="bg-white/5 p-3 rounded-sm border border-white/10">
                <span className="text-cyan-400 font-mono text-[10px] uppercase font-bold block mb-1">Target Journals:</span>
                <span className="text-slate-200">{paper.journals}</span>
              </div>

              <div className="bg-white/5 p-3 rounded-sm border border-white/10">
                <span className="text-cyan-400 font-mono text-[10px] uppercase font-bold block mb-1">Scientific Strategy & Rationale:</span>
                <span className="text-slate-300">{paper.rationale}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono">
              <div className="flex flex-wrap gap-1.5">
                {paper.keyFigures.map(fig => (
                  <span key={fig} className="px-2 py-0.5 bg-white/5 text-slate-300 border border-white/10 text-[10px] rounded-sm">
                    {fig}
                  </span>
                ))}
              </div>

              <button
                onClick={() => handleCopy(paper.title, idx)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-white/10 hover:bg-white/15 text-cyan-300 text-xs uppercase border border-cyan-400/50 transition-all shrink-0"
              >
                {copiedIdx === idx ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Paper Title</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

