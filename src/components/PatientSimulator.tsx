import React, { useState } from 'react';
import { PATIENT_PRESETS } from '../data/patientPresets';
import { PatientProfile, BiomarkerGene, MolecularSubtype, PrognosticRiskLevel } from '../types';
import { BiomarkerImpactVisualizer } from './BiomarkerImpactVisualizer';
import { PathwayNetworkGraph } from './PathwayNetworkGraph';
import { ModelProvenancePanel } from './ModelProvenancePanel';
import { ReasoningAuditChain } from './ReasoningAuditChain';
import { Activity, Dna, Pill, ShieldAlert, Sparkles, Sliders, RefreshCw, ChevronRight, CheckCircle2, Award, Zap, Layers, Upload, ShieldCheck, AlertTriangle } from 'lucide-react';

interface PatientSimulatorProps {
  currentPatient: PatientProfile;
  setCurrentPatient: (patient: PatientProfile) => void;
  onGenerateAiReport: () => void;
  onOpenUploadModal: () => void;
  isGeneratingReport: boolean;
}

export const PatientSimulator: React.FC<PatientSimulatorProps> = ({
  currentPatient,
  setCurrentPatient,
  onGenerateAiReport,
  onOpenUploadModal,
  isGeneratingReport
}) => {
  const [activePresetId, setActivePresetId] = useState<string>('pt-001');
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Handle Preset Selection
  const handleSelectPreset = (presetId: string) => {
    setActivePresetId(presetId);
    const selected = PATIENT_PRESETS.find(p => p.id === presetId);
    if (selected) {
      setCurrentPatient({ ...selected });
    }
  };

  // Recalculate model metrics based on gene inputs
  const handleGeneExpressionChange = (geneIndex: number, newExpression: number) => {
    const updatedTopGenes = [...currentPatient.topGenes];
    const geneObj = updatedTopGenes[geneIndex];
    geneObj.expressionLevel = parseFloat(newExpression.toFixed(1));

    // Dynamic SHAP and status recalculation
    const diff = geneObj.expressionLevel - geneObj.baselineMean;
    if (diff > 1.5) {
      geneObj.status = 'Overexpressed';
    } else if (diff < -1.5) {
      geneObj.status = 'Underexpressed';
    } else {
      geneObj.status = 'Wildtype';
    }

    // Dynamic recalculation of subtype & risk
    let newCancerProb = currentPatient.cancerProbability;
    let newSubtype: MolecularSubtype = currentPatient.molecularSubtype;
    let newRisk: PrognosticRiskLevel = currentPatient.prognosticRisk;
    let newFiveYearRisk = currentPatient.fiveYearRisk;

    // Check key drivers
    const erbb2 = updatedTopGenes.find(g => g.gene === 'ERBB2')?.expressionLevel || 3;
    const esr1 = updatedTopGenes.find(g => g.gene === 'ESR1')?.expressionLevel || 6;
    const mki67 = updatedTopGenes.find(g => g.gene === 'MKI67')?.expressionLevel || 3.5;
    const brca1 = updatedTopGenes.find(g => g.gene === 'BRCA1')?.expressionLevel || 4.5;

    if (erbb2 > 8.0) {
      newSubtype = 'HER2-enriched';
      newRisk = 'High';
      newFiveYearRisk = Math.min(85, Math.max(50, Math.round(erbb2 * 6)));
    } else if (esr1 > 7.0 && mki67 < 4.5) {
      newSubtype = 'Luminal A';
      newRisk = 'Low';
      newFiveYearRisk = Math.max(5, Math.round(mki67 * 2.5));
    } else if (esr1 > 6.0 && mki67 >= 4.5) {
      newSubtype = 'Luminal B';
      newRisk = 'Intermediate';
      newFiveYearRisk = Math.min(55, Math.round(mki67 * 5));
    } else if (esr1 < 3.0 && erbb2 < 4.0) {
      newSubtype = 'Basal-like';
      newRisk = 'High';
      newFiveYearRisk = Math.min(90, Math.max(60, Math.round((mki67 + (10 - brca1)) * 5)));
    }

    setCurrentPatient({
      ...currentPatient,
      topGenes: updatedTopGenes,
      molecularSubtype: newSubtype,
      prognosticRisk: newRisk,
      fiveYearRisk: newFiveYearRisk
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Patient Preset Selection */}
      <div className="bg-[#05070A] bg-grain border border-white/10 rounded-sm p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-[10px] tracking-[0.3em] uppercase">
              <Zap className="h-3.5 w-3.5" /> PRECISION ONCOLOGY INFERENCE UNIT
            </div>
            <h2 className="text-3xl font-light italic serif text-white tracking-tight mt-1">
              Precision Oncology Decision Support Dashboard
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl font-sans">
              Real-time computational prediction combining transcriptomic SHAP features, clinical staging, subtyping, and drug sensitivity.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={onOpenUploadModal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-sm bg-white/5 hover:bg-white/10 text-slate-200 font-mono text-xs border border-white/15 uppercase tracking-wider transition-all"
            >
              <Upload className="h-3.5 w-3.5 text-cyan-400" />
              <span>Upload Custom VCF/CSV</span>
            </button>

            <button
              onClick={onGenerateAiReport}
              disabled={isGeneratingReport}
              className="flex items-center gap-2 px-4 py-2 rounded-sm bg-white/10 hover:bg-white/15 border border-cyan-400/60 text-cyan-300 font-mono text-xs uppercase tracking-wider shadow-lg transition-all disabled:opacity-50"
            >
              {isGeneratingReport ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin text-cyan-300" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Generate AI Report</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('provenance-dossier-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-sm bg-cyan-950/40 hover:bg-cyan-900/40 text-cyan-300 font-mono text-xs border border-cyan-500/40 uppercase tracking-wider transition-all"
              title="Inspect Model & Evidence Provenance Panel"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
              <span>Provenance Dossier</span>
            </button>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-sm bg-white/5 hover:bg-white/10 text-slate-300 font-mono text-xs border border-white/10 uppercase tracking-wider transition-all"
            >
              <Sliders className="h-3.5 w-3.5 text-cyan-400" />
              <span>{isEditing ? 'Close Sliders' : 'Adjust Expression'}</span>
            </button>
          </div>
        </div>

        {/* Preset Profiles Selector Bar */}
        <div className="pt-4">
          <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400 mb-2 block">
            Select Patient Benchmark Cohort:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
            {PATIENT_PRESETS.map((preset) => {
              const isActive = preset.id === activePresetId;
              const dType = preset.dataType || (preset.patientId.startsWith('TCGA') ? 'TCGA RESEARCH SAMPLE' : 'SYNTHETIC DEMO');
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset.id)}
                  className={`text-left p-3 rounded-sm border text-xs transition-all ${
                    isActive
                      ? 'bg-white/10 border-cyan-400 text-white shadow-lg ring-1 ring-cyan-400/50'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold font-mono mb-1">
                    <span className="truncate">{preset.name.split('(')[0]}</span>
                    {isActive && <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0" />}
                  </div>
                  <div className="text-[10px] font-mono opacity-80 truncate mb-1">
                    {preset.molecularSubtype} • {preset.prognosticRisk} Risk
                  </div>
                  <div className={`text-[8px] font-mono uppercase px-1.5 py-0.5 rounded-sm inline-block font-bold ${
                    dType === 'TCGA RESEARCH SAMPLE'
                      ? 'bg-blue-950 text-blue-300 border border-blue-800'
                      : dType === 'RECONSTRUCTED DEMONSTRATION CASE'
                      ? 'bg-purple-950 text-purple-300 border border-purple-800'
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}>
                    {dType}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Prominent Patient Identity & Data Provenance Banner */}
      <div className="bg-[#05070A] border border-white/10 rounded-sm px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg font-mono text-xs">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-slate-400 uppercase text-[10px]">Active Sample:</span>
          <span className="text-white font-bold text-sm tracking-wide">{currentPatient.patientId}</span>
          <span className="text-cyan-400">({currentPatient.name})</span>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold font-mono px-2.5 py-1 rounded-sm border uppercase tracking-wider ${
            currentPatient.dataType === 'TCGA RESEARCH SAMPLE' || (!currentPatient.dataType && currentPatient.patientId.startsWith('TCGA'))
              ? 'bg-blue-950 text-blue-300 border-blue-500/60 shadow-md'
              : currentPatient.dataType === 'SYNTHETIC DEMO'
              ? 'bg-amber-950 text-amber-300 border-amber-500/60 shadow-md'
              : currentPatient.dataType === 'RECONSTRUCTED DEMONSTRATION CASE'
              ? 'bg-purple-950 text-purple-300 border-purple-500/60 shadow-md'
              : 'bg-emerald-950 text-emerald-300 border-emerald-500/60 shadow-md'
          }`}>
            DATA TYPE: {currentPatient.dataType || (currentPatient.patientId.startsWith('TCGA') ? 'TCGA RESEARCH SAMPLE' : 'SYNTHETIC DEMO')}
          </span>
        </div>
      </div>

      {/* Main Showcase Banner matching Artistic Flair styling */}
      <div className="bg-[#05070A] border border-white/10 rounded-sm p-8 shadow-2xl relative bg-grain">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Subtype Display with Georgia/Instrument Serif */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-[10px] font-mono uppercase tracking-[0.4em] opacity-40 text-cyan-400 block">
              PREDICTED MOLECULAR SUBTYPE
            </span>
            <div>
              <h1 className="text-6xl sm:text-7xl font-light italic serif tracking-tighter-2 text-white leading-none">
                {currentPatient.molecularSubtype}
              </h1>
              <div className="flex items-center gap-2 mt-3">
                <span className={`w-2.5 h-2.5 rounded-full ${currentPatient.prognosticRisk === 'High' ? 'bg-red-500' : currentPatient.prognosticRisk === 'Intermediate' ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                <span className={`text-xs font-mono uppercase tracking-widest font-bold ${currentPatient.prognosticRisk === 'High' ? 'text-red-400' : currentPatient.prognosticRisk === 'Intermediate' ? 'text-amber-400' : 'text-emerald-400'}`}>
                  Prognostic Risk: {currentPatient.prognosticRisk} ({currentPatient.fiveYearRisk}% 5-Yr Recurrence)
                </span>
              </div>
            </div>

            {/* Contributing Biomarkers Vector */}
            <div className="pt-4 border-t border-white/10">
              <h3 className="text-[10px] font-mono uppercase tracking-[0.3em] opacity-40 mb-3 text-slate-300">
                Top Contributing SHAP Drivers
              </h3>
              <div className="grid grid-cols-2 gap-y-2 text-xs font-mono border-l border-white/10 pl-4">
                {currentPatient.topGenes.slice(0, 4).map((gene) => (
                  <React.Fragment key={gene.gene}>
                    <div className="opacity-80 text-slate-300">{gene.gene} ({gene.pathway.split(' ')[0]})</div>
                    <div className="text-right text-cyan-400 font-bold">
                      {gene.shapValue >= 0 ? `+${gene.shapValue.toFixed(1)} σ` : `${gene.shapValue.toFixed(1)} σ`}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Central Giant Probability Gauge */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center relative py-4 border-y lg:border-y-0 lg:border-x border-white/10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[180px] sm:text-[220px] font-black opacity-5 select-none tracking-tighter font-mono pointer-events-none">
              {currentPatient.cancerProbability}
            </div>
            <div className="relative z-10 text-center">
              <div className="text-8xl sm:text-9xl font-bold font-mono leading-none mb-1 flex items-start justify-center text-white">
                {currentPatient.cancerProbability}<span className="text-3xl sm:text-4xl mt-3 opacity-50 text-cyan-400">%</span>
              </div>
              <div className="text-[10px] font-mono uppercase tracking-[0.5em] font-semibold opacity-80 text-cyan-300">
                Cancer Probability Index
              </div>
              
              <div className="mt-8 w-56 mx-auto">
                <div className="flex justify-between text-[10px] font-mono uppercase mb-1.5 opacity-60">
                  <span>5-Year Predicted Risk</span>
                  <span className="text-rose-400 font-bold">{currentPatient.fiveYearRisk}%</span>
                </div>
                <div className="w-full h-[3px] bg-white/10 rounded-none overflow-hidden">
                  <div
                    className="h-full bg-red-500 transition-all duration-500"
                    style={{ width: `${currentPatient.fiveYearRisk}%` }}
                  />
                </div>
              </div>

              <div className="mt-5 px-3 py-1 bg-amber-950/50 border border-amber-500/30 rounded-xs text-[9px] font-mono text-amber-300 uppercase tracking-wider inline-block max-w-[280px] leading-normal shadow-xs">
                Illustrative Computational Output — Not Clinically Validated
              </div>
            </div>
          </div>

          {/* Right Primary Pathways & Therapeutic Evidence Match */}
          <div className="lg:col-span-3 space-y-6">
            <div className="space-y-3">
              <h3 className="text-[10px] font-mono uppercase tracking-[0.3em] opacity-40 text-slate-300">
                Dysregulated Pathways
              </h3>
              <ul className="text-xs font-mono space-y-2">
                {currentPatient.pathways.map((pw, i) => (
                  <li key={i} className="flex justify-between border-b border-white/5 pb-1.5">
                    <span className="text-slate-300 truncate pr-2">{pw}</span>
                    <span className="text-cyan-400 font-bold">ACTIVE</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-mono uppercase tracking-[0.3em] opacity-40 text-slate-300">
                  Therapeutic Evidence Match
                </h3>
                <span className="text-[9px] font-mono text-cyan-400 uppercase">ESCAT / NCCN</span>
              </div>
              <div className="flex flex-col space-y-2">
                {currentPatient.targets.map((tgt) => (
                  <div key={tgt.drug} className="border-b border-white/5 pb-1.5">
                    <div className="text-lg serif italic text-cyan-200 hover:text-cyan-300 transition-colors">
                      {tgt.drug}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                      <span className="text-emerald-400 font-bold">{tgt.evidenceLevel}</span>
                      <span>•</span>
                      <span>Target: {tgt.gene}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* CORE REASONING LAYER: Prediction → Confidence → Evidence → Mechanism → Therapeutic Evidence */}
      <ReasoningAuditChain patient={currentPatient} />

      {/* CORE VISUALIZATION 1: SHAP Biomarker Impact Visualizer (Interactive Hover/Click for Details) */}
      <BiomarkerImpactVisualizer
        genes={currentPatient.topGenes}
        cancerProbability={currentPatient.cancerProbability}
      />

      {/* CORE VISUALIZATION 2: Major Biological Pathways Network Graph */}
      <PathwayNetworkGraph />

      {/* Main Grid: Patient Inputs vs Computational Output Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (5 Cols): Patient Clinical Data & Gene Slider Controls */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Clinical Profile Summary Card */}
          <div className="bg-[#05070A] border border-white/10 rounded-sm p-5 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4 flex-wrap gap-2">
              <div className="flex items-center gap-2 text-white font-mono text-xs uppercase tracking-wider">
                <Dna className="h-3.5 w-3.5 text-cyan-400" />
                <span>Clinical Demographics &amp; Histology</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-cyan-400 bg-white/5 px-2 py-0.5 rounded-sm border border-white/10">
                  {currentPatient.patientId}
                </span>
                <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-sm border uppercase ${
                  currentPatient.dataType === 'TCGA RESEARCH SAMPLE' || (!currentPatient.dataType && currentPatient.patientId.startsWith('TCGA'))
                    ? 'bg-blue-950 text-blue-300 border-blue-500/50'
                    : currentPatient.dataType === 'SYNTHETIC DEMO'
                    ? 'bg-amber-950 text-amber-300 border-amber-500/50'
                    : currentPatient.dataType === 'RECONSTRUCTED DEMONSTRATION CASE'
                    ? 'bg-purple-950 text-purple-300 border-purple-500/50'
                    : 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                }`}>
                  DATA TYPE: {currentPatient.dataType || (currentPatient.patientId.startsWith('TCGA') ? 'TCGA RESEARCH SAMPLE' : 'SYNTHETIC DEMO')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-white/5 p-3 rounded-sm border border-white/10">
                <span className="text-slate-400 block text-[10px] uppercase mb-0.5">Age / Status</span>
                <span className="font-semibold text-slate-200">{currentPatient.age} yrs • {currentPatient.menopausalStatus}</span>
              </div>
              <div className="bg-white/5 p-3 rounded-sm border border-white/10">
                <span className="text-slate-400 block text-[10px] uppercase mb-0.5">Tumor Stage</span>
                <span className="font-semibold text-slate-200">{currentPatient.tumorStage} ({currentPatient.tumorSize} cm)</span>
              </div>
              <div className="bg-white/5 p-3 rounded-sm border border-white/10">
                <span className="text-slate-400 block text-[10px] uppercase mb-0.5">Nodal Status</span>
                <span className="font-semibold text-slate-200">{currentPatient.nodeStatus}</span>
              </div>
              <div className="bg-white/5 p-3 rounded-sm border border-white/10">
                <span className="text-slate-400 block text-[10px] uppercase mb-0.5">Receptor IHC</span>
                <span className="font-semibold text-slate-200">
                  ER:{currentPatient.erStatus[0]} PR:{currentPatient.prStatus[0]} HER2:{currentPatient.her2Status[0]}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10">
              <p className="text-xs text-slate-400 serif italic">
                "{currentPatient.notes}"
              </p>
            </div>
          </div>

          {/* Interactive Gene Expression Sliders Card */}
          {isEditing && (
            <div className="bg-[#05070A] border border-white/10 rounded-sm p-5 shadow-lg animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2 text-white font-mono text-xs uppercase tracking-wider">
                  <Sliders className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Transcriptomic Drivers (log2 TPM)</span>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">Interactive Sliders</span>
              </div>

              <div className="space-y-3 text-xs">
                {currentPatient.topGenes.map((gene, idx) => (
                  <div key={gene.gene} className="bg-white/5 p-3 rounded-sm border border-white/10">
                    <div className="flex items-center justify-between mb-1.5 font-mono">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-cyan-300">{gene.gene}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-white/10 text-slate-300 border border-white/10">
                          {gene.pathway}
                        </span>
                      </div>
                      <span className="text-slate-200 font-bold">
                        {gene.expressionLevel} TPM
                      </span>
                    </div>

                    <input
                      type="range"
                      min="0.0"
                      max="14.0"
                      step="0.1"
                      value={gene.expressionLevel}
                      onChange={(e) => handleGeneExpressionChange(idx, parseFloat(e.target.value))}
                      className="w-full accent-cyan-400 h-1 bg-white/10 rounded-none cursor-pointer"
                    />

                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mt-1">
                      <span>Baseline Normal: {gene.baselineMean}</span>
                      <span className={`font-semibold uppercase ${
                        gene.status === 'Overexpressed' || gene.status === 'Amplified' ? 'text-rose-400' :
                        gene.status === 'Underexpressed' ? 'text-cyan-400' : 'text-emerald-400'
                      }`}>
                        {gene.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column (7 Cols): Candidate Drugs & DepMap Dependency */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#05070A] border border-white/10 rounded-sm p-5 shadow-lg space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-cyan-400 flex items-center gap-1.5">
                  <Pill className="h-3.5 w-3.5 text-cyan-400" />
                  Therapeutic Evidence Match (Biomarker Actionability &amp; DepMap Sensitivity)
                </h4>
                <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-sm border border-emerald-800/50">
                  ESCAT / NCCN Curated
                </span>
              </div>

              {/* Scientific nuance notice (as instructed: don't let UI imply therapy is automatically appropriate) */}
              <div className="bg-amber-950/20 border border-amber-500/30 rounded-sm p-2.5 mb-3 flex items-start gap-2 text-[11px] text-amber-200/90 font-sans">
                <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-amber-300 font-mono text-[10px] uppercase block">Clinical Context &amp; Governance Notice:</strong>
                  Therapeutic Evidence Matches represent computational biomarker alignments derived from published literature and NCCN/ESCAT guidelines; they do not imply automated patient eligibility or substitute for multidisciplinary tumor board consultation.
                </span>
              </div>

              <div className="space-y-3">
                {currentPatient.targets.map((tgt, i) => (
                  <div key={i} className="bg-white/5 p-4 rounded-sm border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-light italic serif text-lg text-cyan-300">{tgt.drug}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-white/10 text-cyan-300 border border-white/10">
                          Target: {tgt.gene}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                          {tgt.evidenceLevel} (NCCN Cat 1)
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1.5 font-sans">
                        {tgt.mechanism}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 text-xs shrink-0 font-mono bg-black/40 px-3 py-2 rounded-sm border border-white/10">
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase">DepMap CERES</span>
                        <span className="text-cyan-300 font-bold">{tgt.depmapScore}</span>
                      </div>
                      <div className="border-l border-white/10 pl-3">
                        <span className="text-slate-400 block text-[9px] uppercase">GDSC IC50</span>
                        <span className="text-cyan-300 font-bold">{tgt.gdscIc50} uM</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Model & Evidence Provenance Section */}
      <div id="provenance-dossier-section" className="pt-2">
        <ModelProvenancePanel patient={currentPatient} />
      </div>

    </div>
  );
};
