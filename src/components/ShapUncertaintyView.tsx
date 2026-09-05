import React, { useState } from 'react';
import { HelpCircle, AlertCircle, ArrowUpRight, ArrowDownRight, Info, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';

interface ShapFeature {
  gene: string;
  shapValue: number; // positive = risk increase, negative = risk decrease
  expression: string;
  oddsRatio: number;
  ciLower: number;
  ciUpper: number;
  direction: 'Risk Enriched' | 'Protective / Suppressor';
  description: string;
}

const SHAP_DRIVERS: ShapFeature[] = [
  { gene: 'ERBB2', shapValue: 0.28, expression: 'High (Log2 TPM 8.4)', oddsRatio: 3.42, ciLower: 2.51, ciUpper: 4.65, direction: 'Risk Enriched', description: 'Strongest driver of malignant risk in HER2+ subtype.' },
  { gene: 'MKI67', shapValue: 0.24, expression: 'High (Log2 TPM 7.2)', oddsRatio: 2.85, ciLower: 2.12, ciUpper: 3.82, direction: 'Risk Enriched', description: 'Cellular proliferation marker elevates risk.' },
  { gene: 'MYC', shapValue: 0.19, expression: 'High (Log2 TPM 6.9)', oddsRatio: 2.45, ciLower: 1.84, ciUpper: 3.26, direction: 'Risk Enriched', description: 'Amplified oncogenic transcription factor.' },
  { gene: 'CDK4', shapValue: 0.15, expression: 'High (Log2 TPM 6.1)', oddsRatio: 2.15, ciLower: 1.62, ciUpper: 2.85, direction: 'Risk Enriched', description: 'Cyclin dependent kinase driving G1/S phase.' },
  { gene: 'EGFR', shapValue: 0.12, expression: 'High (Log2 TPM 5.8)', oddsRatio: 1.95, ciLower: 1.48, ciUpper: 2.58, direction: 'Risk Enriched', description: 'EGFR pathway activation in basal-like tumors.' },
  { gene: 'CCND1', shapValue: 0.09, expression: 'Moderate (Log2 TPM 5.2)', oddsRatio: 1.72, ciLower: 1.32, ciUpper: 2.24, direction: 'Risk Enriched', description: 'Cyclin D1 cell cycle driver.' },
  { gene: 'MAP3K1', shapValue: -0.08, expression: 'Low (Log2 TPM 2.1)', oddsRatio: 0.62, ciLower: 0.45, ciUpper: 0.84, direction: 'Protective / Suppressor', description: 'Loss of kinase expression reduces apoptotic control.' },
  { gene: 'PTEN', shapValue: -0.14, expression: 'Low (Log2 TPM 1.8)', oddsRatio: 0.48, ciLower: 0.35, ciUpper: 0.66, direction: 'Protective / Suppressor', description: 'Phosphatase tumor suppressor loss increases risk score.' },
  { gene: 'TP53', shapValue: -0.18, expression: 'Mutated / Loss', oddsRatio: 0.38, ciLower: 0.26, ciUpper: 0.54, direction: 'Protective / Suppressor', description: 'Loss of wildtype p53 checkpoint function.' },
  { gene: 'BRCA1', shapValue: -0.22, expression: 'Low (Log2 TPM 1.4)', oddsRatio: 0.29, ciLower: 0.19, ciUpper: 0.42, direction: 'Protective / Suppressor', description: 'Loss of wildtype BRCA1 DNA repair capacity.' },
];

export const ShapUncertaintyView: React.FC = () => {
  const [selectedGene, setSelectedGene] = useState<string>('ERBB2');

  const selectedFeature = SHAP_DRIVERS.find(d => d.gene === selectedGene) || SHAP_DRIVERS[0];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-[#05070A] bg-grain border border-white/10 rounded-sm p-6 shadow-2xl relative">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-[10px] tracking-[0.3em] uppercase">
              <Sparkles className="h-3.5 w-3.5" /> MODULE 7 • SHAP EXPLAINABILITY & PREDICTION UNCERTAINTY
            </div>
            <h2 className="text-3xl font-light italic serif text-white tracking-tight mt-1">
              TreeSHAP Feature Attribution & Conformal Uncertainty
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl font-sans">
              Additive Shapley feature attribution for individual patient predictions combined with 95% bootstrap confidence intervals and conformal prediction intervals.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-3 py-1.5 rounded-sm bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 font-bold uppercase">
              TreeSHAP Engine v2.4 Active
            </span>
          </div>
        </div>

        {/* Prediction Uncertainty Summary Box */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4 pt-2 font-mono text-xs">
          <div className="bg-white/5 p-3 rounded-sm border border-white/10">
            <span className="text-slate-400 block text-[10px] uppercase">Cancer Probability</span>
            <span className="text-cyan-300 font-bold text-base">0.94 (94.2%)</span>
            <span className="text-[9px] text-amber-300/90 block font-sans mt-1 leading-tight">Illustrative Computational Output — Not Clinically Validated</span>
          </div>

          <div className="bg-white/5 p-3 rounded-sm border border-white/10">
            <span className="text-slate-400 block text-[10px] uppercase">Prediction Uncertainty</span>
            <span className="text-emerald-400 font-bold text-base flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              LOW UNCERTAINTY
            </span>
          </div>

          <div className="bg-white/5 p-3 rounded-sm border border-white/10">
            <span className="text-slate-400 block text-[10px] uppercase">95% Bootstrap CI</span>
            <span className="text-slate-200 font-bold text-sm">[0.910 - 0.968]</span>
          </div>

          <div className="bg-white/5 p-3 rounded-sm border border-white/10">
            <span className="text-slate-400 block text-[10px] uppercase">Conformal Interval</span>
            <span className="text-slate-200 font-bold text-sm">[0.885 - 0.982]</span>
          </div>
        </div>

        {/* Essential Clinical Disclaimer Notice */}
        <div className="mt-4 p-3 rounded-sm bg-amber-500/10 border border-amber-500/30 flex items-center gap-2.5 text-xs font-mono">
          <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0" />
          <span className="text-amber-200/90 font-sans">
            <strong className="text-amber-300 uppercase font-mono">Methodological Disclaimer:</strong> Explainability and SHAP values describe internal algorithmic feature attribution and model behavior, NOT proof of direct biological causation.
          </span>
        </div>
      </div>

      {/* Main Grid: SHAP Chart + Interpretable Regression Odds Ratios */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SHAP Feature Attribution Plot (7 Columns) */}
        <div className="lg:col-span-7 bg-[#05070A] border border-white/10 rounded-sm p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 font-mono">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              TreeSHAP Additive Feature Value Contributions
            </span>
            <span className="text-[10px] bg-white/10 text-cyan-300 px-2 py-0.5 rounded-sm border border-white/10">
              Base Value = 0.12
            </span>
          </div>

          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SHAP_DRIVERS} layout="vertical" margin={{ top: 10, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#94a3b8" fontSize={10} domain={[-0.3, 0.35]} label={{ value: 'SHAP Value (Impact on Model Output)', position: 'insideBottom', offset: -10, fill: '#94a3b8', fontSize: 10 }} />
                <YAxis type="category" dataKey="gene" stroke="#94a3b8" fontSize={10} width={70} />
                <Tooltip 
                  content={({ payload }) => {
                    if (payload && payload.length) {
                      const d = payload[0].payload as ShapFeature;
                      return (
                        <div className="bg-[#05070A] border border-cyan-500 p-2.5 rounded-sm font-mono text-xs shadow-2xl">
                          <div className="font-bold text-cyan-300">{d.gene}</div>
                          <div className="text-slate-300">SHAP: {d.shapValue > 0 ? `+${d.shapValue}` : d.shapValue}</div>
                          <div className="text-slate-300">Odds Ratio: {d.oddsRatio} (95% CI: {d.ciLower}-{d.ciUpper})</div>
                          <div className="text-slate-400 text-[10px] mt-1">{d.description}</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="shapValue" onClick={(entry) => setSelectedGene(entry.gene)} radius={[2, 2, 2, 2]}>
                  {SHAP_DRIVERS.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.shapValue > 0 ? '#06b6d4' : '#f43f5e'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Selected Gene Odds Ratio Inspector (5 Columns) */}
        <div className="lg:col-span-5 bg-[#05070A] border border-white/10 rounded-sm p-5 shadow-xl space-y-4 font-mono">
          <div className="pb-3 border-b border-white/10">
            <span className="text-[10px] text-cyan-400 uppercase tracking-widest block font-bold">INTERPRETABLE REGRESSION METRICS</span>
            <h3 className="text-2xl font-bold text-white mt-0.5">{selectedFeature.gene}</h3>
            <span className="text-xs text-slate-400">{selectedFeature.expression}</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="bg-white/5 p-3.5 rounded-sm border border-white/10">
              <span className="text-slate-400 block text-[10px] uppercase">Odds Ratio (OR)</span>
              <span className="text-cyan-300 text-xl font-bold">{selectedFeature.oddsRatio.toFixed(2)}</span>
              <span className="text-slate-400 text-[10px] block mt-0.5">
                95% CI: [{selectedFeature.ciLower.toFixed(2)} - {selectedFeature.ciUpper.toFixed(2)}]
              </span>
            </div>

            <div className="bg-white/5 p-3.5 rounded-sm border border-white/10">
              <span className="text-slate-400 block text-[10px] uppercase">Direction of Association</span>
              <span className={`text-sm font-bold flex items-center gap-1.5 mt-0.5 ${selectedFeature.shapValue > 0 ? 'text-cyan-300' : 'text-rose-400'}`}>
                {selectedFeature.shapValue > 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                {selectedFeature.direction}
              </span>
            </div>

            <p className="text-xs text-slate-300 font-sans leading-relaxed border-t border-white/5 pt-3">
              {selectedFeature.description}
            </p>

            <div className="pt-2">
              <span className="text-[10px] uppercase text-slate-400 block mb-2">Select Driver Gene:</span>
              <div className="flex flex-wrap gap-1.5">
                {SHAP_DRIVERS.map(d => (
                  <button
                    key={d.gene}
                    onClick={() => setSelectedGene(d.gene)}
                    className={`px-2.5 py-1 rounded-sm border text-[10px] transition-all ${
                      selectedGene === d.gene
                        ? 'bg-cyan-400 text-black font-bold border-cyan-300'
                        : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {d.gene}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
