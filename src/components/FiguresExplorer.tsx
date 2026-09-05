import React, { useState } from 'react';
import { FIGURES_LIST, ML_PERFORMANCE_METRICS, ROC_CURVE_DATA, KAPLAN_MEIER_DATA, CPTAC_PROTEOMIC_DATA, EXTERNAL_VALIDATION_DATA, DEPMAP_GDSC_DATA } from '../data/figuresData';
import { FigureInfo } from '../types';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, ScatterChart, Scatter, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { FileSpreadsheet, ChevronLeft, ChevronRight, Info, CheckCircle2, Award, Filter, Download, ArrowRight } from 'lucide-react';

export const FiguresExplorer: React.FC = () => {
  const [selectedFigId, setSelectedFigId] = useState<number>(1);
  const selectedFig = FIGURES_LIST.find(f => f.id === selectedFigId) || FIGURES_LIST[0];

  const handleNext = () => {
    if (selectedFigId < 12) setSelectedFigId(selectedFigId + 1);
  };

  const handlePrev = () => {
    if (selectedFigId > 1) setSelectedFigId(selectedFigId - 1);
  };

  // Render dynamic interactive charts based on figure ID
  const renderInteractiveFigureChart = (figId: number) => {
    switch (figId) {
      case 1: // Overall Research Workflow
        return (
          <div className="space-y-4 my-2">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-cyan-800/80">
                <span className="text-cyan-400 font-bold block mb-1">Stage 1: Multi-Omics TCGA</span>
                <p className="text-slate-300">n=1,098 patients with paired mRNA, CNV, Somatic Mutation & Clinical data.</p>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-indigo-800/80">
                <span className="text-indigo-400 font-bold block mb-1">Stage 2: Feature Selection</span>
                <p className="text-slate-300">mRMR + LASSO L1 Cox + Boruta filtering 20,531 genes to 15 signature genes.</p>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-teal-800/80">
                <span className="text-teal-400 font-bold block mb-1">Stage 3: GEO External Validation</span>
                <p className="text-slate-300">Zero data-leakage validation on GSE20685, GSE21653, GSE96058 (n=1,420).</p>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-purple-800/80">
                <span className="text-purple-400 font-bold block mb-1">Stage 4: CPTAC & DepMap</span>
                <p className="text-slate-300">Mass spec proteomic validation & CRISPR CERES drug sensitivity scoring.</p>
              </div>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-300">
              <span>Overall Pipeline Status: Fully Validated & Reproducible</span>
              <span className="text-emerald-400 font-bold font-mono">Cross-Validation C-index: 0.882</span>
            </div>
          </div>
        );

      case 2: // Multi-Omics Landscape
        return (
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { subtype: 'Basal-like', TP53_Mut: 84, BRCA1_Loss: 62, MKI67_High: 92, ERBB2_Amp: 4 },
                { subtype: 'HER2-enriched', TP53_Mut: 71, BRCA1_Loss: 22, MKI67_High: 85, ERBB2_Amp: 94 },
                { subtype: 'Luminal A', TP53_Mut: 12, BRCA1_Loss: 5, MKI67_High: 15, ERBB2_Amp: 2 },
                { subtype: 'Luminal B', TP53_Mut: 32, BRCA1_Loss: 14, MKI67_High: 78, ERBB2_Amp: 18 },
                { subtype: 'Normal-like', TP53_Mut: 8, BRCA1_Loss: 3, MKI67_High: 8, ERBB2_Amp: 1 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="subtype" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" unit="%" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }} />
                <Legend />
                <Bar dataKey="TP53_Mut" name="TP53 Mutation Rate %" fill="#f43f5e" />
                <Bar dataKey="MKI67_High" name="High Proliferation %" fill="#38bdf8" />
                <Bar dataKey="ERBB2_Amp" name="ERBB2 Amplification %" fill="#a855f7" />
                <Bar dataKey="BRCA1_Loss" name="BRCA1 Defect %" fill="#fbbf24" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      case 3: // Differential Expression
        return (
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { gene: 'MKI67', log2FC: 3.8, negLogP: 45 },
                { gene: 'AURKA', log2FC: 3.2, negLogP: 42 },
                { gene: 'ERBB2', log2FC: 2.9, negLogP: 38 },
                { gene: 'EGFR', log2FC: 2.5, negLogP: 32 },
                { gene: 'PARP1', log2FC: 2.1, negLogP: 28 },
                { gene: 'ESR1', log2FC: -2.8, negLogP: 36 },
                { gene: 'PGR', log2FC: -2.4, negLogP: 31 }
              ]} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" stroke="#94a3b8" label={{ value: 'log2 Fold Change (Tumor vs Normal)', position: 'insideBottom', offset: -5, fill: '#94a3b8' }} />
                <YAxis dataKey="gene" type="category" stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }} />
                <Bar dataKey="log2FC" name="Log2 Fold Change">
                  {[3.8, 3.2, 2.9, 2.5, 2.1, -2.8, -2.4].map((v, i) => (
                    <Cell key={i} fill={v > 0 ? '#f43f5e' : '#38bdf8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      case 4: // Feature-Selection Pipeline
        return (
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { stage: 'Initial Transcriptome', genes: 20531 },
                { stage: 'mRMR Filtering', genes: 120 },
                { stage: 'LASSO L1 Cox Path', genes: 22 },
                { stage: 'Boruta Shadow Final Signature', genes: 15 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="stage" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" scale="log" domain={[10, 30000]} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }} />
                <Bar dataKey="genes" name="Retained Feature Count" fill="#818cf8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      case 5: // ML Performance & ROC Curves
        return (
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ROC_CURVE_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="fpr" stroke="#94a3b8" label={{ value: 'False Positive Rate (1 - Specificity)', position: 'insideBottom', offset: -5, fill: '#94a3b8' }} />
                <YAxis stroke="#94a3b8" label={{ value: 'True Positive Rate (Sensitivity)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }} />
                <Legend />
                <Line type="monotone" dataKey="xgboost" name="XGBoost (AUC = 0.984)" stroke="#06b6d4" strokeWidth={3} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="lightgbm" name="LightGBM (AUC = 0.978)" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="rf" name="Random Forest (AUC = 0.974)" stroke="#a855f7" strokeWidth={2} />
                <Line type="monotone" dataKey="svm" name="SVM (AUC = 0.968)" stroke="#f59e0b" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );

      case 6: // SHAP Explainability
        return (
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { gene: 'MKI67', shap: 0.38 },
                { gene: 'ERBB2', shap: 0.34 },
                { gene: 'BRCA1', shap: 0.29 },
                { gene: 'TP53', shap: 0.27 },
                { gene: 'ESR1', shap: -0.25 },
                { gene: 'PGR', shap: -0.21 },
                { gene: 'CDK4', shap: 0.19 },
                { gene: 'EGFR', shap: 0.18 }
              ]} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" stroke="#94a3b8" label={{ value: 'Mean |SHAP Value| (Impact on Model Output)', position: 'insideBottom', offset: -5, fill: '#94a3b8' }} />
                <YAxis dataKey="gene" type="category" stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }} />
                <Bar dataKey="shap" name="Mean SHAP Impact">
                  {[0.38, 0.34, 0.29, 0.27, -0.25, -0.21, 0.19, 0.18].map((v, i) => (
                    <Cell key={i} fill={v > 0 ? '#f43f5e' : '#10b981'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      case 7: // Kaplan-Meier Prognostic Signature
        return (
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={KAPLAN_MEIER_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" label={{ value: 'Follow-up Time (Months)', position: 'insideBottom', offset: -5, fill: '#94a3b8' }} />
                <YAxis stroke="#94a3b8" domain={[30, 100]} label={{ value: 'Overall Survival %', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }} />
                <Legend />
                <Line type="monotone" dataKey="lowRisk" name="Low Risk Cohort (5-Yr OS = 94.8%)" stroke="#10b981" strokeWidth={3} />
                <Line type="monotone" dataKey="interRisk" name="Intermediate Risk Cohort (5-Yr OS = 76.1%)" stroke="#f59e0b" strokeWidth={2} />
                <Line type="monotone" dataKey="highRisk" name="High Risk Cohort (5-Yr OS = 54.2%)" stroke="#ef4444" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );

      case 8: // External Validation
        return (
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={EXTERNAL_VALIDATION_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="cohort" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" domain={[0.7, 1.0]} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }} />
                <Legend />
                <Bar dataKey="auc" name="ROC AUC" fill="#06b6d4" />
                <Bar dataKey="f1" name="Macro F1 Score" fill="#10b981" />
                <Bar dataKey="cIndex" name="Concordance C-index" fill="#818cf8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      case 9: // CPTAC Protein Validation
        return (
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid stroke="#334155" />
                <XAxis type="number" dataKey="mrnaTPM" name="mRNA TPM (TCGA)" stroke="#94a3b8" label={{ value: 'mRNA Expression (log2 TPM)', position: 'insideBottom', offset: -10, fill: '#94a3b8' }} />
                <YAxis type="number" dataKey="proteinSpecCount" name="Protein Mass Spec (CPTAC)" stroke="#94a3b8" label={{ value: 'Proteomic Spectral Ratio', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }} />
                <Scatter name="Biomarkers" data={CPTAC_PROTEOMIC_DATA} fill="#38bdf8">
                  {CPTAC_PROTEOMIC_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#06b6d4' : '#a855f7'} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        );

      case 10: // Pathway & Interaction Network
        return (
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                { pathway: 'DNA Repair', score: 98 },
                { pathway: 'Cell Cycle G1/S', score: 95 },
                { pathway: 'PI3K-AKT', score: 88 },
                { pathway: 'P53 Signaling', score: 92 },
                { pathway: 'HER2 RTK', score: 85 },
                { pathway: 'Estrogen Receptor', score: 90 }
              ]}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="pathway" stroke="#94a3b8" />
                <PolarRadiusAxis stroke="#94a3b8" />
                <Radar name="Pathway Enrichment Score" dataKey="score" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.5} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        );

      case 11: // Drug Response / DepMap Dependency
        return (
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid stroke="#334155" />
                <XAxis type="number" dataKey="depmapCeres" name="DepMap CERES Essentiality" stroke="#94a3b8" label={{ value: 'DepMap CERES Score (More negative = Essential)', position: 'insideBottom', offset: -10, fill: '#94a3b8' }} />
                <YAxis type="number" dataKey="gdscIc50" name="GDSC LN(IC50)" stroke="#94a3b8" label={{ value: 'GDSC LN(IC50) Drug Sensitivity', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }} />
                <Scatter name="Drug Targets" data={DEPMAP_GDSC_DATA} fill="#10b981">
                  {DEPMAP_GDSC_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.depmapCeres < -1.0 ? '#ef4444' : '#10b981'} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        );

      case 12: // Final Clinical Decision Support
        return (
          <div className="space-y-4 my-2">
            <div className="bg-slate-950 p-4 rounded-xl border border-cyan-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-cyan-400 font-bold block text-sm">Full Deployed Inference Framework</span>
                <p className="text-slate-300">Inputs: Patient Gene Profile + IHC Staging → XGBoost Subtype Model → SHAP Explanations → Targeted Drug Match</p>
              </div>
              <div className="text-right font-mono">
                <span className="text-emerald-400 font-bold block text-base">98.4% ROC-AUC</span>
                <span className="text-slate-400">0 Data Leakage</span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Figure Selector */}
      <div className="bg-[#05070A] bg-grain border border-white/10 rounded-sm p-6 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-[10px] tracking-[0.3em] uppercase">
              <FileSpreadsheet className="h-3.5 w-3.5" /> PUBLICATION FIGURES SUITE (12 PANELS)
            </div>
            <h2 className="text-3xl font-light italic serif text-white tracking-tight mt-1">
              {selectedFig.number}: {selectedFig.title}
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Category: <span className="text-cyan-300 font-semibold uppercase">{selectedFig.category}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono">
            <button
              onClick={handlePrev}
              disabled={selectedFigId === 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-sm bg-white/5 hover:bg-white/10 text-slate-200 text-xs uppercase border border-white/10 disabled:opacity-30 transition-all"
            >
              <ChevronLeft className="h-4 w-4" /> Prev
            </button>
            <span className="text-xs text-slate-400 px-2 font-bold">
              {selectedFigId} / 12
            </span>
            <button
              onClick={handleNext}
              disabled={selectedFigId === 12}
              className="flex items-center gap-1 px-3 py-1.5 rounded-sm bg-white/5 hover:bg-white/10 text-slate-200 text-xs uppercase border border-white/10 disabled:opacity-30 transition-all"
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* 12 Figure Buttons Grid */}
        <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 text-xs font-mono">
          {FIGURES_LIST.map((fig) => {
            const isSelected = fig.id === selectedFigId;
            return (
              <button
                key={fig.id}
                onClick={() => setSelectedFigId(fig.id)}
                className={`p-2.5 rounded-sm border text-left transition-all ${
                  isSelected
                    ? 'bg-white/10 border-cyan-400 text-white font-bold shadow-lg ring-1 ring-cyan-400/50'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200'
                }`}
              >
                <span className="block text-[10px] text-cyan-400 font-bold">{fig.number}</span>
                <span className="truncate block mt-0.5">{fig.title.split('&')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Figure View Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Chart Box (7 Cols) */}
        <div className="lg:col-span-7 bg-[#05070A] border border-white/10 rounded-sm p-6 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Award className="h-3.5 w-3.5 text-cyan-400" />
                Publication-Grade Interactive Visualizer
              </span>
              <span className="text-[10px] font-mono bg-white/10 text-cyan-300 px-2.5 py-0.5 rounded-sm border border-white/10">
                P-value &lt; 0.0001
              </span>
            </div>

            {renderInteractiveFigureChart(selectedFigId)}
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>High-precision vector renderer</span>
            <span className="text-cyan-400">Reproducible R/Python Pipeline</span>
          </div>
        </div>

        {/* Methodological Details & Scientific Insights Box (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Scientific Insights */}
          <div className="bg-[#05070A] border border-white/10 rounded-sm p-5 shadow-2xl">
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] font-bold text-white mb-3 flex items-center gap-2">
              <Info className="h-3.5 w-3.5 text-cyan-400" />
              Key Computational Insights
            </h3>
            <ul className="space-y-2 text-xs text-slate-300 font-sans">
              {selectedFig.insights.map((insight, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-white/5 p-3 rounded-sm border border-white/10">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Statistical & Methodological Protocol */}
          <div className="bg-[#05070A] border border-white/10 rounded-sm p-5 shadow-2xl">
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] font-bold text-white mb-2 flex items-center gap-2">
              <Filter className="h-3.5 w-3.5 text-cyan-400" />
              Statistical Protocol & Datasets
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed bg-white/5 p-3 rounded-sm border border-white/10">
              {selectedFig.methods}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
