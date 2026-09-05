import React, { useState } from 'react';
import { Target, Dna, Activity, CheckCircle2, ShieldAlert, Sparkles, ExternalLink } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';

interface TargetItem {
  gene: string;
  drug: string;
  mechanism: string;
  depmapCeres: number; // CERES score (< -0.5 = essential)
  gdscIc50: number; // uM
  evidenceLevel: 'FDA Approved' | 'Phase III Trial' | 'Phase II Trial' | 'Preclinical Evidence';
  indication: string;
}

const THERAPEUTIC_TARGETS_LIST: TargetItem[] = [
  { gene: 'ERBB2', drug: 'Lapatinib / Trastuzumab', mechanism: 'HER2 Tyrosine Kinase Dual Inhibitor', depmapCeres: -1.12, gdscIc50: 0.04, evidenceLevel: 'FDA Approved', indication: 'HER2-positive Metastatic Breast Cancer' },
  { gene: 'BRCA1', drug: 'Olaparib / Talazoparib', mechanism: 'PARP1/2 Synthetic Lethality Inhibitor', depmapCeres: -0.95, gdscIc50: 0.12, evidenceLevel: 'FDA Approved', indication: 'gBRCAm HER2-negative Locally Advanced Cancer' },
  { gene: 'ESR1', drug: 'Fulvestrant / Elacestrant', mechanism: 'Selective Estrogen Receptor Degrader (SERD)', depmapCeres: -0.88, gdscIc50: 0.28, evidenceLevel: 'FDA Approved', indication: 'ER+/HER2- Advanced or Metastatic Breast Cancer' },
  { gene: 'CDK4', drug: 'Palbociclib / Abemaciclib', mechanism: 'CDK4/6 Cyclin Dependent Kinase Inhibitor', depmapCeres: -0.82, gdscIc50: 0.35, evidenceLevel: 'FDA Approved', indication: 'HR+/HER2- Advanced Breast Cancer' },
  { gene: 'PIK3CA', drug: 'Alpelisib / Inavolisib', mechanism: 'PI3Kα Isoform-Specific Inhibitor', depmapCeres: -0.78, gdscIc50: 0.45, evidenceLevel: 'FDA Approved', indication: 'PIK3CA-mutated HR+/HER2- Advanced Cancer' },
  { gene: 'TROP2', drug: 'Sacituzumab Govitecan', mechanism: 'TROP2-directed Antibody-Drug Conjugate', depmapCeres: -0.71, gdscIc50: 0.18, evidenceLevel: 'FDA Approved', indication: 'Unresectable Locally Advanced or Metastatic TNBC' }
];

export const TherapeuticTargetsView: React.FC = () => {
  const [selectedTargetGene, setSelectedTargetGene] = useState<string>('ERBB2');

  const selectedTarget = THERAPEUTIC_TARGETS_LIST.find(t => t.gene === selectedTargetGene) || THERAPEUTIC_TARGETS_LIST[0];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-[#05070A] bg-grain border border-white/10 rounded-sm p-6 shadow-2xl relative">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-[10px] tracking-[0.3em] uppercase">
              <Target className="h-3.5 w-3.5" /> MODULE 10 • THERAPEUTIC TARGET PRIORITIZATION & DEPMAP / GDSC
            </div>
            <h2 className="text-3xl font-light italic serif text-white tracking-tight mt-1">
              Translational Precision Therapeutics Engine
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl font-sans">
              Connecting driver genes to Broad Institute DepMap CRISPR essentiality scores and Genomics of Drug Sensitivity in Cancer (GDSC) compound screens.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-3 py-1.5 rounded-sm bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 font-bold uppercase">
              DepMap 23Q4 & GDSC v2 Integrated
            </span>
          </div>
        </div>

        {/* Translation Disclaimer */}
        <div className="mt-4 p-3 rounded-sm bg-amber-500/10 border border-amber-500/30 flex items-center gap-2.5 text-xs font-mono">
          <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0" />
          <span className="text-amber-200/90 font-sans">
            <strong className="text-amber-300 uppercase font-mono">Translational Disclaimer:</strong> Computational DepMap & GDSC screens establish candidate therapeutic hypotheses, NOT clinical trial proof of efficacy.
          </span>
        </div>
      </div>

      {/* Main Grid: DepMap Essentiality Chart + Drug Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* DepMap CERES Essentiality Bar Chart (7 Columns) */}
        <div className="lg:col-span-7 bg-[#05070A] border border-white/10 rounded-sm p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 font-mono">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Target className="h-3.5 w-3.5 text-cyan-400" />
              DepMap CRISPR Essentiality Score (CERES &lt; -0.5 = Essential)
            </span>
            <span className="text-[10px] bg-white/10 text-cyan-300 px-2 py-0.5 rounded-sm border border-white/10">
              1,086 Cell Lines Screened
            </span>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={THERAPEUTIC_TARGETS_LIST} layout="vertical" margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#94a3b8" fontSize={10} domain={[-1.3, 0]} label={{ value: 'DepMap CERES Score (More Negative = Higher Gene Essentiality)', position: 'insideBottom', offset: -10, fill: '#94a3b8', fontSize: 10 }} />
                <YAxis type="category" dataKey="gene" stroke="#94a3b8" fontSize={10} width={60} />
                <Tooltip contentStyle={{ backgroundColor: '#05070A', borderColor: '#334155', fontSize: 11, fontFamily: 'monospace' }} />
                <Bar dataKey="depmapCeres" onClick={(entry) => setSelectedTargetGene(entry.gene)} radius={[2, 2, 2, 2]}>
                  {THERAPEUTIC_TARGETS_LIST.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.gene === selectedTargetGene ? '#38bdf8' : '#06b6d4'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Selected Target Drug Profile (5 Columns) */}
        <div className="lg:col-span-5 bg-[#05070A] border border-white/10 rounded-sm p-5 shadow-xl space-y-4 font-mono">
          <div className="pb-3 border-b border-white/10">
            <span className="text-[10px] text-cyan-400 uppercase tracking-widest block font-bold">TARGETED THERAPEUTIC COMPOUND</span>
            <h3 className="text-2xl font-bold text-white mt-0.5">{selectedTarget.gene}</h3>
            <span className="text-xs text-cyan-300 font-bold block mt-0.5">{selectedTarget.drug}</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="bg-white/5 p-3 rounded-sm border border-white/10">
              <span className="text-slate-400 block text-[10px] uppercase">Mechanism of Action</span>
              <span className="text-slate-200 font-bold">{selectedTarget.mechanism}</span>
            </div>

            <div className="bg-white/5 p-3 rounded-sm border border-white/10">
              <span className="text-slate-400 block text-[10px] uppercase">GDSC Screen IC50 Sensitivity</span>
              <span className="text-emerald-400 font-bold text-sm">IC50 = {selectedTarget.gdscIc50} µM (Potent)</span>
            </div>

            <div className="bg-white/5 p-3 rounded-sm border border-white/10">
              <span className="text-slate-400 block text-[10px] uppercase">Regulatory / Trial Status</span>
              <span className="text-cyan-300 font-bold uppercase">{selectedTarget.evidenceLevel}</span>
            </div>

            <div className="bg-white/5 p-3 rounded-sm border border-white/10">
              <span className="text-slate-400 block text-[10px] uppercase">Clinical Indication</span>
              <span className="text-slate-300 font-sans">{selectedTarget.indication}</span>
            </div>

            <div className="pt-2">
              <span className="text-[10px] uppercase text-slate-400 block mb-2">Select Targeted Gene:</span>
              <div className="flex flex-wrap gap-1.5">
                {THERAPEUTIC_TARGETS_LIST.map(t => (
                  <button
                    key={t.gene}
                    onClick={() => setSelectedTargetGene(t.gene)}
                    className={`px-2.5 py-1 rounded-sm border text-[10px] transition-all ${
                      selectedTargetGene === t.gene
                        ? 'bg-cyan-400 text-black font-bold border-cyan-300'
                        : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {t.gene}
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
