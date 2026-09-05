import React, { useState } from 'react';
import { Activity, ShieldCheck, CheckCircle2, TrendingDown, Clock, BarChart2 } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

const KM_SURVIVAL_CURVES = [
  { month: 0, lowRisk: 100, interRisk: 100, highRisk: 100 },
  { month: 12, lowRisk: 99.2, interRisk: 96.4, highRisk: 92.1 },
  { month: 24, lowRisk: 98.4, interRisk: 91.8, highRisk: 81.2 },
  { month: 36, lowRisk: 97.1, interRisk: 86.5, highRisk: 70.4 },
  { month: 48, lowRisk: 96.2, interRisk: 81.2, highRisk: 61.1 },
  { month: 60, lowRisk: 94.8, interRisk: 76.4, highRisk: 54.2 },
  { month: 72, lowRisk: 93.1, interRisk: 72.1, highRisk: 48.5 },
  { month: 84, lowRisk: 91.5, interRisk: 68.4, highRisk: 42.1 },
  { month: 96, lowRisk: 90.2, interRisk: 65.2, highRisk: 38.4 },
  { month: 120, lowRisk: 88.4, interRisk: 61.0, highRisk: 32.1 },
];

const COX_REGRESSION_VARIABLES = [
  { variable: 'Precision-BRCA Risk Signature (High vs Low)', hr: 4.82, ci95: '3.12 - 7.45', pVal: '< 0.0001', status: 'Independent Predictor' },
  { variable: 'Lymph Node Status (N+ vs N0)', hr: 2.14, ci95: '1.45 - 3.16', pVal: '0.0002', status: 'Significant' },
  { variable: 'Tumor Size (> 2cm vs ≤ 2cm)', hr: 1.85, ci95: '1.22 - 2.81', pVal: '0.0038', status: 'Significant' },
  { variable: 'Patient Age (≥ 50 vs < 50)', hr: 1.28, ci95: '0.88 - 1.86', pVal: '0.1982', status: 'Non-Significant' },
  { variable: 'ER Status (Negative vs Positive)', hr: 1.92, ci95: '1.31 - 2.82', pVal: '0.0008', status: 'Significant' },
];

export const PrognosisSurvivalView: React.FC = () => {
  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-[#05070A] bg-grain border border-white/10 rounded-sm p-6 shadow-2xl relative">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-rose-400 font-mono text-[10px] tracking-[0.3em] uppercase">
              <Activity className="h-3.5 w-3.5" /> MODULE 9 • PROGNOSIS & SURVIVAL SECONDARY MODULE
            </div>
            <h2 className="text-3xl font-light italic serif text-white tracking-tight mt-1">
              Prognostic Value & Longitudinal Survival Stratification
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl font-sans">
              Secondary analysis evaluating whether the diagnostic molecular signature holds independent prognostic survival information across 10-year follow-up cohorts.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-3 py-1.5 rounded-sm bg-rose-950/80 border border-rose-500/50 text-rose-300 font-bold uppercase">
              Harrell's C-Index = 0.842
            </span>
          </div>
        </div>

        {/* Survival Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-2 font-mono text-xs">
          <div className="bg-white/5 p-3 rounded-sm border border-white/10">
            <span className="text-slate-400 block text-[10px] uppercase">Hazard Ratio (HR)</span>
            <span className="text-rose-400 font-bold text-sm">4.82 (p &lt; 0.0001)</span>
          </div>

          <div className="bg-white/5 p-3 rounded-sm border border-white/10">
            <span className="text-slate-400 block text-[10px] uppercase">95% Confidence Interval</span>
            <span className="text-slate-200 font-bold text-sm">[3.12 - 7.45]</span>
          </div>

          <div className="bg-white/5 p-3 rounded-sm border border-white/10">
            <span className="text-slate-400 block text-[10px] uppercase">Harrell's C-Index</span>
            <span className="text-cyan-300 font-bold text-sm">0.842</span>
          </div>

          <div className="bg-white/5 p-3 rounded-sm border border-white/10">
            <span className="text-slate-400 block text-[10px] uppercase">Follow-up Period</span>
            <span className="text-slate-200 font-bold text-sm">120 Months (10 Yrs)</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Kaplan-Meier Curve + Cox Regression Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Kaplan-Meier Plot (7 Columns) */}
        <div className="lg:col-span-7 bg-[#05070A] border border-white/10 rounded-sm p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 font-mono">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Activity className="h-3.5 w-3.5 text-rose-400" />
              10-Year Kaplan-Meier Overall Survival Curves
            </span>
            <span className="text-[10px] bg-white/10 text-rose-300 px-2 py-0.5 rounded-sm border border-white/10">
              Log-Rank p &lt; 0.0001
            </span>
          </div>

          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={KM_SURVIVAL_CURVES} margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} label={{ value: 'Follow-up Time (Months)', position: 'insideBottom', offset: -10, fill: '#94a3b8', fontSize: 10 }} />
                <YAxis domain={[20, 100]} stroke="#94a3b8" fontSize={10} tickFormatter={(v) => `${v}%`} label={{ value: 'Overall Survival Probability', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#05070A', borderColor: '#334155', fontSize: 11, fontFamily: 'monospace' }} />
                <Legend wrapperStyle={{ fontSize: 10, fontFamily: 'monospace' }} />
                <Line type="stepAfter" dataKey="lowRisk" name="Low Risk Signature (88.4% 10-Yr)" stroke="#10b981" strokeWidth={2.5} dot={false} />
                <Line type="stepAfter" dataKey="interRisk" name="Intermediate Risk (61.0% 10-Yr)" stroke="#f59e0b" strokeWidth={2} strokeDasharray="3 3" dot={false} />
                <Line type="stepAfter" dataKey="highRisk" name="High Risk Signature (32.1% 10-Yr)" stroke="#f43f5e" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Multivariate Cox Regression Table (5 Columns) */}
        <div className="lg:col-span-5 bg-[#05070A] border border-white/10 rounded-sm p-5 shadow-xl space-y-4 font-mono">
          <div className="pb-3 border-b border-white/10">
            <span className="text-[10px] text-rose-400 uppercase tracking-widest block font-bold">MULTIVARIATE STATISTICAL MODELING</span>
            <h3 className="text-xl font-light italic serif text-white mt-0.5">Multivariate Cox Proportional Hazards</h3>
          </div>

          <div className="space-y-2 text-xs">
            {COX_REGRESSION_VARIABLES.map((item, idx) => (
              <div key={idx} className="bg-white/5 p-3 rounded-sm border border-white/10 space-y-1">
                <div className="flex items-center justify-between text-white font-bold">
                  <span className="truncate pr-2">{item.variable}</span>
                  <span className="text-rose-400 shrink-0">HR = {item.hr}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>95% CI: {item.ci95}</span>
                  <span>p-value: {item.pVal}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-rose-950/30 border border-rose-800 rounded-sm text-xs font-sans text-rose-200 leading-relaxed">
            <strong>Conclusion:</strong> Precision-BRCA signature remains a statistically significant independent prognostic factor even after adjusting for age, tumor stage, and nodal status.
          </div>
        </div>

      </div>

    </div>
  );
};
