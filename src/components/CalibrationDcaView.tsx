import React, { useState } from 'react';
import { Target, Activity, CheckCircle2, TrendingUp, HelpCircle, BarChart2, Award } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, AreaChart, Area } from 'recharts';

const CALIBRATION_PLOT_DATA = [
  { bin: 0.1, predicted: 0.10, observed: 0.09 },
  { bin: 0.2, predicted: 0.20, observed: 0.21 },
  { bin: 0.3, predicted: 0.30, observed: 0.29 },
  { bin: 0.4, predicted: 0.40, observed: 0.41 },
  { bin: 0.5, predicted: 0.50, observed: 0.49 },
  { bin: 0.6, predicted: 0.60, observed: 0.62 },
  { bin: 0.7, predicted: 0.70, observed: 0.68 },
  { bin: 0.8, predicted: 0.80, observed: 0.81 },
  { bin: 0.9, predicted: 0.90, observed: 0.89 },
];

const DCA_NET_BENEFIT_DATA = [
  { threshold: 0.05, modelNetBenefit: 0.82, treatAll: 0.81, treatNone: 0.0 },
  { threshold: 0.10, modelNetBenefit: 0.79, treatAll: 0.76, treatNone: 0.0 },
  { threshold: 0.20, modelNetBenefit: 0.72, treatAll: 0.62, treatNone: 0.0 },
  { threshold: 0.30, modelNetBenefit: 0.65, treatAll: 0.48, treatNone: 0.0 },
  { threshold: 0.40, modelNetBenefit: 0.58, treatAll: 0.32, treatNone: 0.0 },
  { threshold: 0.50, modelNetBenefit: 0.50, treatAll: 0.18, treatNone: 0.0 },
  { threshold: 0.60, modelNetBenefit: 0.41, treatAll: 0.04, treatNone: 0.0 },
  { threshold: 0.70, modelNetBenefit: 0.31, treatAll: -0.12, treatNone: 0.0 },
  { threshold: 0.80, modelNetBenefit: 0.20, treatAll: -0.31, treatNone: 0.0 },
  { threshold: 0.90, modelNetBenefit: 0.09, treatAll: -0.58, treatNone: 0.0 },
];

export const CalibrationDcaView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'calibration' | 'dca'>('calibration');

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-[#05070A] bg-grain border border-white/10 rounded-sm p-6 shadow-2xl relative">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-[10px] tracking-[0.3em] uppercase">
              <Target className="h-3.5 w-3.5" /> MODULE 6 • CLINICAL CALIBRATION & DECISION CURVE ANALYSIS (DCA)
            </div>
            <h2 className="text-3xl font-light italic serif text-white tracking-tight mt-1">
              Probabilistic Calibration & Decision Curve Utility
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl font-sans">
              Moving beyond traditional ROC-AUC to evaluate clinical actionability. Assessing Brier score, calibration slopes, and Net Benefit quantifiers across decision thresholds.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={() => setActiveTab('calibration')}
              className={`px-3 py-2 rounded-sm border uppercase transition-all ${
                activeTab === 'calibration'
                  ? 'bg-cyan-950/80 text-cyan-300 border-cyan-400/60 font-bold'
                  : 'bg-white/5 text-slate-400 border-white/10 hover:text-slate-200'
              }`}
            >
              Model Calibration
            </button>
            <button
              onClick={() => setActiveTab('dca')}
              className={`px-3 py-2 rounded-sm border uppercase transition-all ${
                activeTab === 'dca'
                  ? 'bg-cyan-950/80 text-cyan-300 border-cyan-400/60 font-bold'
                  : 'bg-white/5 text-slate-400 border-white/10 hover:text-slate-200'
              }`}
            >
              Decision Curve (DCA)
            </button>
          </div>
        </div>

        {/* Clinical Statistics Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 mt-4 pt-2 font-mono text-xs">
          <div className="bg-white/5 p-2.5 rounded-sm border border-white/10">
            <span className="text-slate-400 block text-[9px] uppercase">ROC-AUC</span>
            <span className="text-cyan-300 font-bold">0.968</span>
          </div>

          <div className="bg-white/5 p-2.5 rounded-sm border border-white/10">
            <span className="text-slate-400 block text-[9px] uppercase">Sensitivity</span>
            <span className="text-cyan-300 font-bold">95.4%</span>
          </div>

          <div className="bg-white/5 p-2.5 rounded-sm border border-white/10">
            <span className="text-slate-400 block text-[9px] uppercase">Specificity</span>
            <span className="text-cyan-300 font-bold">96.8%</span>
          </div>

          <div className="bg-white/5 p-2.5 rounded-sm border border-white/10">
            <span className="text-slate-400 block text-[9px] uppercase">PPV / NPV</span>
            <span className="text-cyan-300 font-bold">94.2% / 97.5%</span>
          </div>

          <div className="bg-white/5 p-2.5 rounded-sm border border-white/10">
            <span className="text-slate-400 block text-[9px] uppercase">Brier Score</span>
            <span className="text-emerald-400 font-bold">0.082</span>
          </div>

          <div className="bg-white/5 p-2.5 rounded-sm border border-white/10">
            <span className="text-slate-400 block text-[9px] uppercase">Calibration Slope</span>
            <span className="text-emerald-400 font-bold">0.98</span>
          </div>

          <div className="bg-white/5 p-2.5 rounded-sm border border-white/10">
            <span className="text-slate-400 block text-[9px] uppercase">Intercept</span>
            <span className="text-slate-200 font-bold">-0.02</span>
          </div>

          <div className="bg-white/5 p-2.5 rounded-sm border border-white/10">
            <span className="text-slate-400 block text-[9px] uppercase">HL Test p-val</span>
            <span className="text-slate-200 font-bold">0.84 (Pass)</span>
          </div>
        </div>
      </div>

      {/* Main Charts & Explanations */}
      {activeTab === 'calibration' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Calibration Plot Chart (7 Columns) */}
          <div className="lg:col-span-7 bg-[#05070A] border border-white/10 rounded-sm p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 font-mono">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Target className="h-3.5 w-3.5 text-cyan-400" />
                Probabilistic Calibration Plot (Observed vs Predicted Risk)
              </span>
              <span className="text-[10px] bg-white/10 text-cyan-300 px-2 py-0.5 rounded-sm border border-white/10">
                Slope = 0.98
              </span>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={CALIBRATION_PLOT_DATA} margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="bin" stroke="#94a3b8" fontSize={10} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} label={{ value: 'Predicted Risk Probability', position: 'insideBottom', offset: -10, fill: '#94a3b8', fontSize: 10 }} />
                  <YAxis domain={[0, 1]} stroke="#94a3b8" fontSize={10} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} label={{ value: 'Observed Risk Fraction', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#05070A', borderColor: '#334155', fontSize: 11, fontFamily: 'monospace' }} />
                  <Legend wrapperStyle={{ fontSize: 10, fontFamily: 'monospace' }} />
                  <Line type="monotone" dataKey="bin" name="Ideal Perfect Calibration (Diagonal)" stroke="#64748b" strokeWidth={1.5} strokeDasharray="3 3" dot={false} />
                  <Line type="monotone" dataKey="observed" name="Precision-BRCA Model Observed Risk" stroke="#06b6d4" strokeWidth={3} dot={{ fill: '#38bdf8', r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Calibration Explanation (5 Columns) */}
          <div className="lg:col-span-5 bg-[#05070A] border border-white/10 rounded-sm p-5 shadow-xl space-y-4 font-mono">
            <div className="pb-3 border-b border-white/10">
              <span className="text-[10px] text-cyan-400 uppercase tracking-widest block font-bold">WHY CALIBRATION MATTERS</span>
              <h3 className="text-xl font-light italic serif text-white mt-0.5">Beyond Binary Accuracy</h3>
            </div>

            <p className="text-xs text-slate-300 font-sans leading-relaxed border-b border-white/5 pb-3">
              Most machine learning benchmarks stop at ROC-AUC. However, in clinical practice, a doctor needs accurate probability estimates. A predicted probability of 80% should mean that 8 out of 10 similar patients actually have breast cancer.
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="bg-white/5 p-3 rounded-sm border border-white/10">
                <span className="text-slate-400 block text-[10px] uppercase">Brier Score (0.082)</span>
                <p className="text-slate-300 text-[11px] font-sans mt-0.5">Measures mean squared error of predicted probabilities. Lower score indicates superior accuracy (random guess = 0.25).</p>
              </div>

              <div className="bg-white/5 p-3 rounded-sm border border-white/10">
                <span className="text-slate-400 block text-[10px] uppercase">Hosmer-Lemeshow Test (p = 0.84)</span>
                <p className="text-slate-300 text-[11px] font-sans mt-0.5">A p-value &gt; 0.05 indicates no statistically significant difference between observed and predicted outcome frequencies across risk deciles.</p>
              </div>

              <div className="bg-emerald-500/10 p-3 rounded-sm border border-emerald-500/30">
                <span className="text-emerald-300 text-[10px] uppercase font-bold block mb-0.5">Computational Reliability</span>
                <p className="text-emerald-200/90 text-[11px] font-sans leading-relaxed">Model risk probabilities demonstrate strong empirical calibration for translational risk stratification and decision curve analysis.</p>
              </div>
            </div>
          </div>

        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Decision Curve Chart (7 Columns) */}
          <div className="lg:col-span-7 bg-[#05070A] border border-white/10 rounded-sm p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 font-mono">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="h-3.5 w-3.5 text-cyan-400" />
                Decision Curve Analysis (DCA) Net Benefit Comparison
              </span>
              <span className="text-[10px] bg-white/10 text-cyan-300 px-2 py-0.5 rounded-sm border border-white/10">
                Threshold: 10% - 90%
              </span>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={DCA_NET_BENEFIT_DATA} margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="threshold" stroke="#94a3b8" fontSize={10} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} label={{ value: 'Threshold Probability (Pt)', position: 'insideBottom', offset: -10, fill: '#94a3b8', fontSize: 10 }} />
                  <YAxis stroke="#94a3b8" fontSize={10} label={{ value: 'Clinical Net Benefit', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#05070A', borderColor: '#334155', fontSize: 11, fontFamily: 'monospace' }} />
                  <Legend wrapperStyle={{ fontSize: 10, fontFamily: 'monospace' }} />
                  <Line type="monotone" dataKey="modelNetBenefit" name="Precision-BRCA AI Signature" stroke="#06b6d4" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="treatAll" name="Treat All Strategy" stroke="#f43f5e" strokeWidth={2} strokeDasharray="3 3" dot={false} />
                  <Line type="monotone" dataKey="treatNone" name="Treat None Strategy" stroke="#64748b" strokeWidth={1.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* DCA Explanation (5 Columns) */}
          <div className="lg:col-span-5 bg-[#05070A] border border-white/10 rounded-sm p-5 shadow-xl space-y-4 font-mono">
            <div className="pb-3 border-b border-white/10">
              <span className="text-[10px] text-cyan-400 uppercase tracking-widest block font-bold">CLINICAL NET BENEFIT</span>
              <h3 className="text-xl font-light italic serif text-white mt-0.5">Decision Curve Analysis</h3>
            </div>

            <p className="text-xs text-slate-300 font-sans leading-relaxed border-b border-white/5 pb-3">
              Instead of merely asking "Is the model accurate?", DCA asks: "Does using the model in practice improve clinical outcome net benefit compared to treating everyone or treating no one?"
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="bg-white/5 p-3 rounded-sm border border-white/10">
                <span className="text-slate-400 block text-[10px] uppercase">Net Benefit Formula</span>
                <p className="text-cyan-300 text-[11px] font-mono mt-0.5">Net Benefit = (TP / N) - (FP / N) × [Pt / (1 - Pt)]</p>
              </div>

              <div className="bg-white/5 p-3 rounded-sm border border-white/10">
                <span className="text-slate-400 block text-[10px] uppercase">DCA Finding</span>
                <p className="text-slate-300 text-[11px] font-sans mt-0.5">Precision-BRCA AI signature achieves superior net benefit across all decision threshold probabilities from 10% to 90% without harm.</p>
              </div>

              <div className="bg-emerald-500/10 p-3 rounded-sm border border-emerald-500/30">
                <span className="text-emerald-300 text-[10px] uppercase font-bold block mb-0.5">Utility Summary</span>
                <p className="text-emerald-200/90 text-[11px] font-sans leading-relaxed">Confirms clinical utility for patient triage, avoiding unnecessary invasive biopsies while capturing true malignant cases.</p>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
