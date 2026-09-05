import React, { useState } from 'react';
import { ShieldCheck, BarChart2, CheckCircle2, ArrowUpRight, Activity } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

const MODEL_COMPARISON_DATA = [
  { metric: 'ROC-AUC', model1Molecular: 0.968, model2Clinical: 0.782, model3Combined: 0.984 },
  { metric: 'Accuracy', model1Molecular: 0.945, model2Clinical: 0.742, model3Combined: 0.968 },
  { metric: 'Sensitivity', model1Molecular: 0.954, model2Clinical: 0.715, model3Combined: 0.972 },
  { metric: 'Specificity', model1Molecular: 0.968, model2Clinical: 0.768, model3Combined: 0.982 },
];

export const ClinicalComparisonView: React.FC = () => {
  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-[#05070A] bg-grain border border-white/10 rounded-sm p-6 shadow-2xl relative">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-[10px] tracking-[0.3em] uppercase">
              <ShieldCheck className="h-3.5 w-3.5" /> MODULE 11 • CLINICAL VS MOLECULAR MODEL COMPARISON
            </div>
            <h2 className="text-3xl font-light italic serif text-white tracking-tight mt-1">
              3-Model Incremental Utility & Clinical Reclassification
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl font-sans">
              Evaluating whether molecular multi-omics features provide true incremental predictive value over baseline clinical variables (Age, Tumor Stage, Nodal Status, ER/PR/HER2 receptor IHC).
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-3 py-1.5 rounded-sm bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-bold uppercase">
              NRI = +28.4% (p &lt; 0.001)
            </span>
          </div>
        </div>

        {/* Reclassification Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 pt-2 font-mono text-xs">
          <div className="bg-white/5 p-3 rounded-sm border border-white/10">
            <span className="text-slate-400 block text-[10px] uppercase">Net Reclassification Index (NRI)</span>
            <span className="text-emerald-400 font-bold text-base flex items-center gap-1">
              <ArrowUpRight className="h-4 w-4" />
              +28.4% (p &lt; 0.0001)
            </span>
            <span className="text-slate-400 text-[10px] block mt-0.5">Significant correct reclassification of patient risk</span>
          </div>

          <div className="bg-white/5 p-3 rounded-sm border border-white/10">
            <span className="text-slate-400 block text-[10px] uppercase">Integrated Discrimination (IDI)</span>
            <span className="text-emerald-400 font-bold text-base flex items-center gap-1">
              <ArrowUpRight className="h-4 w-4" />
              +0.142 (p &lt; 0.0001)
            </span>
            <span className="text-slate-400 text-[10px] block mt-0.5">Expanded probability difference between events and non-events</span>
          </div>

          <div className="bg-white/5 p-3 rounded-sm border border-white/10">
            <span className="text-slate-400 block text-[10px] uppercase">Combined Model AUC</span>
            <span className="text-cyan-300 font-bold text-base">0.984 vs 0.782 Clinical</span>
            <span className="text-slate-400 text-[10px] block mt-0.5">+0.202 AUC gain over clinical baseline</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Bar Chart Comparison + 3 Model Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Comparison Bar Chart (7 Columns) */}
        <div className="lg:col-span-7 bg-[#05070A] border border-white/10 rounded-sm p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 font-mono">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <BarChart2 className="h-3.5 w-3.5 text-cyan-400" />
              3-Model Metric Comparison
            </span>
            <span className="text-[10px] bg-white/10 text-cyan-300 px-2 py-0.5 rounded-sm border border-white/10">
              n = 2,518 Patients
            </span>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MODEL_COMPARISON_DATA} margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="metric" stroke="#94a3b8" fontSize={10} />
                <YAxis domain={[0.6, 1.0]} stroke="#94a3b8" fontSize={10} tickFormatter={(v) => v.toFixed(2)} />
                <Tooltip contentStyle={{ backgroundColor: '#05070A', borderColor: '#334155', fontSize: 11, fontFamily: 'monospace' }} />
                <Legend wrapperStyle={{ fontSize: 10, fontFamily: 'monospace' }} />
                <Bar dataKey="model2Clinical" name="Model 2: Clinical Baseline" fill="#64748b" radius={[2, 2, 0, 0]} />
                <Bar dataKey="model1Molecular" name="Model 1: Molecular Signature" fill="#06b6d4" radius={[2, 2, 0, 0]} />
                <Bar dataKey="model3Combined" name="Model 3: Combined (Clinical + Molecular)" fill="#10b981" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3 Model Cards Breakdown (5 Columns) */}
        <div className="lg:col-span-5 space-y-3 font-mono text-xs">
          <div className="bg-[#05070A] border border-slate-700 p-4 rounded-sm space-y-1">
            <div className="text-[10px] text-slate-400 uppercase font-bold">MODEL 2 • BASELINE CLINICAL MODEL</div>
            <div className="text-white font-bold text-sm">Age + Stage + Nodal + Receptor IHC</div>
            <p className="text-slate-400 font-sans text-[11px] pt-1">AUC: 0.782 | Accuracy: 74.2% | Brier: 0.185</p>
          </div>

          <div className="bg-[#05070A] border border-cyan-500/50 p-4 rounded-sm space-y-1">
            <div className="text-[10px] text-cyan-400 uppercase font-bold">MODEL 1 • MOLECULAR MULTI-OMICS SIGNATURE</div>
            <div className="text-cyan-300 font-bold text-sm">12-Gene Precision Multi-Omics Signature</div>
            <p className="text-slate-300 font-sans text-[11px] pt-1">AUC: 0.968 | Accuracy: 94.5% | Brier: 0.082</p>
          </div>

          <div className="bg-[#05070A] border border-emerald-500 p-4 rounded-sm space-y-1 shadow-lg">
            <div className="text-[10px] text-emerald-400 uppercase font-bold">MODEL 3 • COMBINED CLINICAL + MOLECULAR</div>
            <div className="text-emerald-300 font-bold text-sm">Full Integrated Decision Support System</div>
            <p className="text-slate-200 font-sans text-[11px] pt-1">AUC: 0.984 | Accuracy: 96.8% | Brier: 0.048</p>
          </div>
        </div>

      </div>

    </div>
  );
};
