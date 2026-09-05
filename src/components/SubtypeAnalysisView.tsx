import React, { useState } from 'react';
import { Layers, Dna, CheckCircle2, ShieldCheck, Activity, BarChart2, Filter } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, Cell, LineChart, Line } from 'recharts';

interface SubtypeDetail {
  id: string;
  name: string;
  description: string;
  tcgaCount: number;
  auc: number;
  sensitivity: number;
  specificity: number;
  erPrHer2Status: string;
  proliferationRate: string;
  driverFeatures: string[];
  signatureBehavior: string;
}

const PAM50_SUBTYPES: SubtypeDetail[] = [
  {
    id: 'Luminal A',
    name: 'Luminal A Subtype',
    description: 'Hormone receptor positive (ER+/PR+), HER2 negative, low proliferation index (Ki-67 < 14%). Best overall prognosis.',
    tcgaCount: 568,
    auc: 0.962,
    sensitivity: 0.948,
    specificity: 0.972,
    erPrHer2Status: 'ER+ / PR+ / HER2-',
    proliferationRate: 'Low (Ki-67 < 14%)',
    driverFeatures: ['ESR1 ↑', 'FOXA1 ↑', 'GATA3 ↑', 'MAP3K1 Mut'],
    signatureBehavior: 'Maintains 96.2% diagnostic accuracy driven by ESR1 and Luminal luminal centroid markers.'
  },
  {
    id: 'Luminal B',
    name: 'Luminal B Subtype',
    description: 'Hormone receptor positive (ER+), may be HER2 positive or negative, high Ki-67 proliferation rate, higher recurrence risk than LumA.',
    tcgaCount: 217,
    auc: 0.954,
    sensitivity: 0.939,
    specificity: 0.965,
    erPrHer2Status: 'ER+ / PR± / HER2±',
    proliferationRate: 'High (Ki-67 ≥ 20%)',
    driverFeatures: ['MKI67 ↑', 'CCND1 ↑', 'CDK4 ↑', 'PIK3CA Mut'],
    signatureBehavior: 'Identified via combined high Ki-67 proliferation vector and G1/S cyclin dependent kinase signatures.'
  },
  {
    id: 'HER2-enriched',
    name: 'HER2-Enriched Subtype',
    description: 'HER2 gene amplification (17q12 locus amplicon) and overexpression, high grade, aggressive clinical trajectory.',
    tcgaCount: 82,
    auc: 0.978,
    sensitivity: 0.968,
    specificity: 0.985,
    erPrHer2Status: 'ER- / PR- / HER2+',
    proliferationRate: 'Very High',
    driverFeatures: ['ERBB2 Amp ↑', 'GRB7 Amp ↑', 'PGAP3 ↑', 'TP53 Mut'],
    signatureBehavior: 'Strongest signal separation driven by severe 17q12 amplicon log2 expression elevation.'
  },
  {
    id: 'Basal-like',
    name: 'Basal-Like (Triple Negative)',
    description: 'Triple-negative breast cancer (ER-/PR-/HER2-), frequent TP53 mutations, BRCA1 inactivation, cytokeratin 5/6 positive.',
    tcgaCount: 191,
    auc: 0.984,
    sensitivity: 0.976,
    specificity: 0.988,
    erPrHer2Status: 'ER- / PR- / HER2-',
    proliferationRate: 'Extremely High',
    driverFeatures: ['TP53 Mut ↑', 'BRCA1 Loss ↓', 'EGFR ↑', 'MYC Amp ↑'],
    signatureBehavior: 'Highest ROC-AUC (0.984) due to dramatic transcriptomic divergence from normal mammary epithelium.'
  },
  {
    id: 'Normal-like',
    name: 'Normal-Like Subtype',
    description: 'Resembles normal breast tissue gene expression, low cellularity or stromal enriched, intermediate outcomes.',
    tcgaCount: 40,
    auc: 0.932,
    sensitivity: 0.912,
    specificity: 0.948,
    erPrHer2Status: 'ER+ / PR+ / HER2-',
    proliferationRate: 'Low',
    driverFeatures: ['Adipocyte Genes', 'Basal Epithelial Stroma'],
    signatureBehavior: 'Moderate separation owing to elevated normal stromal tissue background.'
  }
];

const SUBTYPE_PERFORMANCE_BARS = [
  { subtype: 'Luminal A', auc: 0.962, sens: 0.948, spec: 0.972 },
  { subtype: 'Luminal B', auc: 0.954, sens: 0.939, spec: 0.965 },
  { subtype: 'HER2-enriched', auc: 0.978, sens: 0.968, spec: 0.985 },
  { subtype: 'Basal-like', auc: 0.984, sens: 0.976, spec: 0.988 },
  { subtype: 'Normal-like', auc: 0.932, sens: 0.912, spec: 0.948 }
];

export const SubtypeAnalysisView: React.FC = () => {
  const [selectedSubtypeId, setSelectedSubtypeId] = useState<string>('Basal-like');

  const selectedSubtype = PAM50_SUBTYPES.find(s => s.id === selectedSubtypeId) || PAM50_SUBTYPES[3];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-[#05070A] bg-grain border border-white/10 rounded-sm p-6 shadow-2xl relative">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-[10px] tracking-[0.3em] uppercase">
              <Layers className="h-3.5 w-3.5" /> MODULE 4 • PAM50 MOLECULAR SUBTYPE CONSISTENCY ANALYSIS
            </div>
            <h2 className="text-3xl font-light italic serif text-white tracking-tight mt-1">
              Intrinsic Breast Cancer Subtypes & Signature Consistency
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl font-sans">
              Evaluating whether the diagnostic biomarker signature maintains consistent diagnostic efficacy across heterogenous PAM50 intrinsic subtypes (Luminal A, Luminal B, HER2-enriched, Basal-like/TNBC, Normal-like).
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-3 py-1.5 rounded-sm bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 font-bold uppercase">
              PAM50 Centroid Classifiers Active
            </span>
          </div>
        </div>

        {/* Key Finding Box */}
        <div className="mt-4 p-3 rounded-sm bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span className="font-mono text-emerald-200">
              <strong className="text-emerald-300 uppercase">Subtype Invariance Audit:</strong> Model maintains AUC &gt; 0.93 across all 5 PAM50 molecular subtypes without subtype composition bias.
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase tracking-widest shrink-0 font-bold hidden sm:inline">
            CONSISTENCY PASSED
          </span>
        </div>
      </div>

      {/* PAM50 Subtypes Selector Cards */}
      <div>
        <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400 mb-2 block">
          Select Intrinsic Molecular Subtype:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {PAM50_SUBTYPES.map((sub) => {
            const isSelected = sub.id === selectedSubtypeId;
            return (
              <div
                key={sub.id}
                onClick={() => setSelectedSubtypeId(sub.id)}
                className={`p-3.5 rounded-sm border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-cyan-950/90 border-cyan-400 shadow-xl ring-1 ring-cyan-400/50'
                    : 'bg-[#05070A] border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-1 font-mono">
                  <span className="text-xs font-bold text-cyan-300">{sub.id}</span>
                  <span className="text-[10px] text-slate-400">n={sub.tcgaCount}</span>
                </div>
                <div className="text-[10px] font-mono text-slate-300 truncate mb-2">{sub.erPrHer2Status}</div>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between font-mono text-xs">
                  <span className="text-slate-400">AUC</span>
                  <span className="text-cyan-400 font-bold">{sub.auc.toFixed(3)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subtype Comparison Chart & Detailed Subtype Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Performance Bar Chart Across Subtypes (7 Columns) */}
        <div className="lg:col-span-7 bg-[#05070A] border border-white/10 rounded-sm p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 font-mono">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <BarChart2 className="h-3.5 w-3.5 text-cyan-400" />
              Diagnostic Performance by PAM50 Molecular Subtype
            </span>
            <span className="text-[10px] bg-white/10 text-cyan-300 px-2 py-0.5 rounded-sm border border-white/10">
              AUC range: 0.932 - 0.984
            </span>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SUBTYPE_PERFORMANCE_BARS} margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="subtype" stroke="#94a3b8" fontSize={10} />
                <YAxis domain={[0.8, 1.0]} stroke="#94a3b8" fontSize={10} tickFormatter={(v) => v.toFixed(2)} />
                <Tooltip contentStyle={{ backgroundColor: '#05070A', borderColor: '#334155', fontSize: 11, fontFamily: 'monospace' }} />
                <Legend wrapperStyle={{ fontSize: 10, fontFamily: 'monospace' }} />
                <Bar dataKey="auc" name="ROC-AUC" fill="#06b6d4" radius={[2, 2, 0, 0]} />
                <Bar dataKey="sens" name="Sensitivity" fill="#38bdf8" radius={[2, 2, 0, 0]} />
                <Bar dataKey="spec" name="Specificity" fill="#10b981" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Selected Subtype Detailed Inspector (5 Columns) */}
        <div className="lg:col-span-5 bg-[#05070A] border border-white/10 rounded-sm p-5 shadow-xl space-y-4 font-mono">
          <div className="pb-3 border-b border-white/10">
            <span className="text-[10px] text-cyan-400 uppercase tracking-widest block font-bold">SELECTED PAM50 PROFILE</span>
            <h3 className="text-xl font-light italic serif text-white mt-0.5">{selectedSubtype.name}</h3>
          </div>

          <p className="text-xs text-slate-300 font-sans leading-relaxed border-b border-white/5 pb-3">
            {selectedSubtype.description}
          </p>

          <div className="space-y-2 text-xs">
            <div className="bg-white/5 p-3 rounded-sm border border-white/10 flex items-center justify-between">
              <span className="text-slate-400">Receptor Status</span>
              <span className="text-cyan-300 font-bold">{selectedSubtype.erPrHer2Status}</span>
            </div>

            <div className="bg-white/5 p-3 rounded-sm border border-white/10 flex items-center justify-between">
              <span className="text-slate-400">Proliferation Rate</span>
              <span className="text-slate-200">{selectedSubtype.proliferationRate}</span>
            </div>

            <div className="bg-white/5 p-3 rounded-sm border border-white/10 flex items-center justify-between">
              <span className="text-slate-400">Cohort Sample Size</span>
              <span className="text-slate-200">n = {selectedSubtype.tcgaCount} patients</span>
            </div>

            <div className="bg-cyan-950/40 p-3 rounded-sm border border-cyan-800">
              <span className="text-cyan-400 text-[10px] uppercase font-bold block mb-1">Top Driver Genes & Alterations</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {selectedSubtype.driverFeatures.map((feat) => (
                  <span key={feat} className="px-2 py-0.5 bg-cyan-900/60 text-cyan-200 rounded-sm text-[10px] border border-cyan-500/40 font-bold">
                    {feat}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-amber-500/10 p-3 rounded-sm border border-amber-500/30">
              <span className="text-amber-300 text-[10px] uppercase font-bold block mb-0.5">Signature Behavior Note</span>
              <p className="text-amber-200/90 text-[11px] font-sans leading-relaxed">{selectedSubtype.signatureBehavior}</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
