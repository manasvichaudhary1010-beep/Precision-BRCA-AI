import React, { useState } from 'react';
import { Database, Dna, Layers, Activity, Search, Sparkles, Network, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Cell } from 'recharts';

interface GeneDiscoveryItem {
  gene: string;
  log2FC: number;
  pVal: number; // -log10
  mutationFreq: number;
  cnvGainFreq: number;
  cptacProteinCorr: number;
  pathway: string;
  status: 'Significant Driver' | 'Moderate Driver' | 'Baseline';
}

const DISCOVERY_GENES: GeneDiscoveryItem[] = [
  { gene: 'BRCA1', log2FC: -2.85, pVal: 14.2, mutationFreq: 18.4, cnvGainFreq: 4.2, cptacProteinCorr: 0.88, pathway: 'DNA Repair & Homologous Recombination', status: 'Significant Driver' },
  { gene: 'ERBB2', log2FC: 3.42, pVal: 18.5, mutationFreq: 6.8, cnvGainFreq: 22.4, cptacProteinCorr: 0.94, pathway: 'HER2 Receptor Tyrosine Kinase Signaling', status: 'Significant Driver' },
  { gene: 'TP53', log2FC: -1.92, pVal: 12.8, mutationFreq: 34.2, cnvGainFreq: 12.1, cptacProteinCorr: 0.72, pathway: 'p53 Cell Cycle Checkpoint Control', status: 'Significant Driver' },
  { gene: 'PIK3CA', log2FC: 2.15, pVal: 11.4, mutationFreq: 36.5, cnvGainFreq: 14.8, cptacProteinCorr: 0.81, pathway: 'PI3K/AKT/mTOR Survival Pathway', status: 'Significant Driver' },
  { gene: 'MKI67', log2FC: 4.12, pVal: 22.1, mutationFreq: 1.2, cnvGainFreq: 8.4, cptacProteinCorr: 0.91, pathway: 'Cellular Proliferation & Ki-67 Index', status: 'Significant Driver' },
  { gene: 'ESR1', log2FC: 2.94, pVal: 15.6, mutationFreq: 11.2, cnvGainFreq: 5.8, cptacProteinCorr: 0.89, pathway: 'Estrogen Receptor α Signaling', status: 'Significant Driver' },
  { gene: 'EGFR', log2FC: 2.45, pVal: 9.8, mutationFreq: 4.1, cnvGainFreq: 11.2, cptacProteinCorr: 0.76, pathway: 'EGF Receptor Tyrosine Kinase Cascade', status: 'Significant Driver' },
  { gene: 'CDK4', log2FC: 2.82, pVal: 13.1, mutationFreq: 3.5, cnvGainFreq: 16.2, cptacProteinCorr: 0.85, pathway: 'G1/S Phase Transition & Cyclin D', status: 'Significant Driver' },
  { gene: 'MYC', log2FC: 3.18, pVal: 16.4, mutationFreq: 2.8, cnvGainFreq: 28.5, cptacProteinCorr: 0.82, pathway: 'Oncogenic Transcription Factor Network', status: 'Significant Driver' },
  { gene: 'CCND1', log2FC: 2.65, pVal: 10.9, mutationFreq: 2.1, cnvGainFreq: 19.4, cptacProteinCorr: 0.79, pathway: 'Cyclin D1 Cell Cycle Driver', status: 'Significant Driver' },
  { gene: 'PTEN', log2FC: -2.25, pVal: 11.8, mutationFreq: 8.9, cnvGainFreq: 2.1, cptacProteinCorr: 0.84, pathway: 'Tumor Suppressor Phosphatase Regulation', status: 'Significant Driver' },
  { gene: 'MAP3K1', log2FC: -1.78, pVal: 8.5, mutationFreq: 12.4, cnvGainFreq: 3.2, cptacProteinCorr: 0.68, pathway: 'MAPK Stress Response Cascade', status: 'Significant Driver' },
  { gene: 'ACTB', log2FC: 0.12, pVal: 0.8, mutationFreq: 0.2, cnvGainFreq: 0.1, cptacProteinCorr: 0.15, pathway: 'Housekeeping Cytoskeleton', status: 'Baseline' },
  { gene: 'GAPDH', log2FC: -0.05, pVal: 0.4, mutationFreq: 0.1, cnvGainFreq: 0.0, cptacProteinCorr: 0.10, pathway: 'Glycolysis Control', status: 'Baseline' }
];

const PATHWAY_DATA = [
  { name: 'PI3K/AKT/mTOR Pathway', enrichment: 8.9, genes: 'PIK3CA, PTEN, AKT1', pval: '2.4e-12' },
  { name: 'G1/S Phase Cell Cycle', enrichment: 7.8, genes: 'CDK4, CCND1, MYC', pval: '1.1e-10' },
  { name: 'HER2 Receptor Signaling', enrichment: 9.4, genes: 'ERBB2, GRB7, PGAP3', pval: '4.8e-15' },
  { name: 'DNA Repair & HR Deficiency', enrichment: 8.2, genes: 'BRCA1, BRCA2, TP53', pval: '8.1e-11' },
  { name: 'Estrogen Receptor Signaling', enrichment: 7.1, genes: 'ESR1, FOXA1, GATA3', pval: '5.2e-09' }
];

export const MultiOmicsExplorerView: React.FC = () => {
  const [selectedGene, setSelectedGene] = useState<string>('ERBB2');
  const [selectedDatabase, setSelectedDatabase] = useState<string>('TCGA-BRCA');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const currentGene = DISCOVERY_GENES.find(g => g.gene === selectedGene) || DISCOVERY_GENES[1];

  const filteredGenes = DISCOVERY_GENES.filter(g => 
    g.gene.toLowerCase().includes(searchTerm.toLowerCase()) || 
    g.pathway.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-[#05070A] bg-grain border border-white/10 rounded-sm p-6 shadow-2xl relative">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-[10px] tracking-[0.3em] uppercase">
              <Database className="h-3.5 w-3.5" /> MODULE 1 & 2 • MULTI-OMICS DATA EXPLORER & BIOMARKER DISCOVERY
            </div>
            <h2 className="text-3xl font-light italic serif text-white tracking-tight mt-1">
              Multi-Omics Repository & Differential Biomarker Engine
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl font-sans">
              Harmonized integration across TCGA-BRCA, GEO, GTEx, CPTAC Proteomics, cBioPortal, DepMap, and GDSC. Cross-referencing transcriptomics, somatic mutations, CNVs, and CPTAC protein expression.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            {['TCGA-BRCA', 'GTEx Normal', 'CPTAC Proteomics', 'cBioPortal'].map((db) => (
              <button
                key={db}
                onClick={() => setSelectedDatabase(db)}
                className={`px-3 py-1.5 rounded-sm border uppercase text-[10px] transition-all ${
                  selectedDatabase === db
                    ? 'bg-cyan-950/80 text-cyan-300 border-cyan-400/60 font-bold'
                    : 'bg-white/5 text-slate-400 border-white/10 hover:text-slate-200'
                }`}
              >
                {db}
              </button>
            ))}
          </div>
        </div>

        {/* Multi-Omics Layer Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-2">
          <div className="bg-white/5 p-3 rounded-sm border border-white/10">
            <span className="text-slate-400 block text-[10px] font-mono uppercase">TCGA Tumor Cohort</span>
            <span className="text-cyan-300 font-mono font-bold text-sm">n = 1,098 Profiles</span>
          </div>
          <div className="bg-white/5 p-3 rounded-sm border border-white/10">
            <span className="text-slate-400 block text-[10px] font-mono uppercase">GTEx Normal Tissue</span>
            <span className="text-cyan-300 font-mono font-bold text-sm">n = 291 Controls</span>
          </div>
          <div className="bg-white/5 p-3 rounded-sm border border-white/10">
            <span className="text-slate-400 block text-[10px] font-mono uppercase">CPTAC Proteomics</span>
            <span className="text-cyan-300 font-mono font-bold text-sm">122 Matched Proteins</span>
          </div>
          <div className="bg-white/5 p-3 rounded-sm border border-white/10">
            <span className="text-slate-400 block text-[10px] font-mono uppercase">FDR Threshold</span>
            <span className="text-emerald-400 font-mono font-bold text-sm">q &lt; 0.001 (Log2FC &gt; 2.0)</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Volcano Plot + Gene Multi-Omics Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Volcano Plot & Pathways (7 Columns) */}
        <div className="lg:col-span-7 bg-[#05070A] border border-white/10 rounded-sm p-5 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 font-mono">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Activity className="h-3.5 w-3.5 text-cyan-400" />
              Differential Transcriptomic Volcano Plot (TCGA vs GTEx)
            </span>
            <span className="text-[10px] text-cyan-300 bg-white/10 px-2 py-0.5 rounded-sm border border-white/10">
              20,530 Genes Analyzed
            </span>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis 
                  dataKey="log2FC" 
                  name="Log2 Fold Change" 
                  stroke="#94a3b8" 
                  fontSize={10} 
                  label={{ value: 'Log2 Fold Change (Tumor / Normal)', position: 'insideBottom', offset: -10, fill: '#94a3b8', fontSize: 10 }} 
                />
                <YAxis 
                  dataKey="pVal" 
                  name="-log10 p-value" 
                  stroke="#94a3b8" 
                  fontSize={10} 
                  label={{ value: '-log10(p-value)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10 }} 
                />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ payload }) => {
                    if (payload && payload.length) {
                      const data = payload[0].payload as GeneDiscoveryItem;
                      return (
                        <div className="bg-[#05070A] border border-cyan-500/50 p-2.5 rounded-sm font-mono text-xs shadow-2xl">
                          <div className="font-bold text-cyan-300">{data.gene}</div>
                          <div className="text-slate-300">Log2FC: {data.log2FC.toFixed(2)}</div>
                          <div className="text-slate-300">-log10 p: {data.pVal.toFixed(1)}</div>
                          <div className="text-slate-400 text-[10px] mt-1">{data.pathway}</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter 
                  data={DISCOVERY_GENES} 
                  onClick={(entry) => setSelectedGene(entry.gene)}
                >
                  {DISCOVERY_GENES.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={
                        entry.gene === selectedGene 
                          ? '#38bdf8' 
                          : entry.status === 'Significant Driver' 
                          ? (entry.log2FC > 0 ? '#06b6d4' : '#f43f5e') 
                          : '#64748b'
                      } 
                      stroke={entry.gene === selectedGene ? '#ffffff' : 'none'}
                      strokeWidth={2}
                      r={entry.gene === selectedGene ? 8 : 5}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {/* Pathway Enrichment Bar Chart */}
          <div className="pt-4 border-t border-white/10 space-y-3 font-mono">
            <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <Layers className="h-3.5 w-3.5" />
                GO / KEGG Pathway Enrichment
              </span>
              <span className="text-[10px] text-slate-400">FDR Controlled</span>
            </div>

            <div className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PATHWAY_DATA} layout="vertical" margin={{ left: 10, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis type="number" stroke="#94a3b8" fontSize={9} label={{ value: 'Fold Enrichment', position: 'insideBottom', offset: -5, fill: '#94a3b8', fontSize: 9 }} />
                  <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={9} width={150} />
                  <Tooltip contentStyle={{ backgroundColor: '#05070A', borderColor: '#334155', fontSize: 10, fontFamily: 'monospace' }} />
                  <Bar dataKey="enrichment" fill="#06b6d4" radius={[0, 2, 2, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Multi-Omics Gene Inspector (5 Columns) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-[#05070A] border border-white/10 rounded-sm p-5 shadow-xl space-y-4">
            
            {/* Search & Select Gene Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase">
                <Dna className="h-4 w-4" />
                <span>Selected Gene Inspector</span>
              </div>

              <div className="relative">
                <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2" />
                <input
                  type="text"
                  placeholder="Filter gene..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-sm pl-8 pr-2 py-1 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-32"
                />
              </div>
            </div>

            {/* Selected Gene Title & Pathway */}
            <div className="bg-cyan-950/40 border border-cyan-800 p-4 rounded-sm">
              <div className="flex items-baseline justify-between font-mono">
                <span className="text-2xl font-bold text-cyan-300">{currentGene.gene}</span>
                <span className="text-[10px] px-2 py-0.5 bg-cyan-900/60 border border-cyan-500/50 text-cyan-200 rounded-sm uppercase font-bold">
                  {currentGene.status}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono mt-1">{currentGene.pathway}</p>
            </div>

            {/* 6 Multi-Omics Metric Cards */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-white/5 p-3 rounded-sm border border-white/10">
                <span className="text-slate-400 block text-[10px] uppercase">Log2 Fold Change</span>
                <span className={`font-bold text-sm ${currentGene.log2FC > 0 ? 'text-cyan-300' : 'text-rose-400'}`}>
                  {currentGene.log2FC > 0 ? `+${currentGene.log2FC}` : currentGene.log2FC}
                </span>
              </div>

              <div className="bg-white/5 p-3 rounded-sm border border-white/10">
                <span className="text-slate-400 block text-[10px] uppercase">-log10 p-value</span>
                <span className="font-bold text-sm text-cyan-300">{currentGene.pVal}</span>
              </div>

              <div className="bg-white/5 p-3 rounded-sm border border-white/10">
                <span className="text-slate-400 block text-[10px] uppercase">Somatic Mutation Freq</span>
                <span className="font-bold text-sm text-amber-300">{currentGene.mutationFreq}%</span>
              </div>

              <div className="bg-white/5 p-3 rounded-sm border border-white/10">
                <span className="text-slate-400 block text-[10px] uppercase">CNV Amplification</span>
                <span className="font-bold text-sm text-purple-300">{currentGene.cnvGainFreq}%</span>
              </div>

              <div className="bg-white/5 p-3 rounded-sm border border-white/10">
                <span className="text-slate-400 block text-[10px] uppercase">CPTAC Proteomic Corr</span>
                <span className="font-bold text-sm text-emerald-300">r = {currentGene.cptacProteinCorr}</span>
              </div>

              <div className="bg-white/5 p-3 rounded-sm border border-white/10">
                <span className="text-slate-400 block text-[10px] uppercase">GTEx Tissue Norm</span>
                <span className="font-bold text-sm text-slate-200">291 Controls</span>
              </div>
            </div>

            {/* Gene Selection Quick List */}
            <div className="pt-2 border-t border-white/10">
              <span className="text-[10px] font-mono uppercase text-slate-400 block mb-2">Select Top Candidate Gene:</span>
              <div className="flex flex-wrap gap-1.5 font-mono text-xs">
                {filteredGenes.map(g => (
                  <button
                    key={g.gene}
                    onClick={() => setSelectedGene(g.gene)}
                    className={`px-2.5 py-1 rounded-sm border text-[11px] transition-all ${
                      selectedGene === g.gene
                        ? 'bg-cyan-400 text-black font-bold border-cyan-300'
                        : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {g.gene}
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
