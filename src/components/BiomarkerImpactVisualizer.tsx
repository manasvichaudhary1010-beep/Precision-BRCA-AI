import React, { useState } from 'react';
import { BiomarkerGene } from '../types';
import { Activity, Info, Dna, HelpCircle, ArrowUpRight, ArrowDownRight, Layers, X, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

interface BiomarkerImpactVisualizerProps {
  genes: BiomarkerGene[];
  cancerProbability: number;
}

interface DetailedGeneInfo {
  gene: string;
  mutationDetail: string;
  tcgaFrequency: string;
  cnvState: string;
  functionSummary: string;
  clinicalImpact: string;
}

const GENE_DETAILS_DATABASE: Record<string, DetailedGeneInfo> = {
  BRCA1: {
    gene: 'BRCA1',
    mutationDetail: 'c.3132B>T (p.Gln1045*) Truncating Frameshift / LOH',
    tcgaFrequency: '12.4% in Basal-like TNBC',
    cnvState: 'Heterozygous Loss / High HRD Score (58)',
    functionSummary: 'E3 ubiquitin ligase component essential for homologous recombination DNA double-strand break repair.',
    clinicalImpact: 'BRCA1 alteration and reduced expression are consistent with impaired homologous-recombination repair and potential PARP inhibitor sensitivity (Olaparib, Talazoparib); functional HRD status requires independent genomic/functional assessment.'
  },
  TP53: {
    gene: 'TP53',
    mutationDetail: 'c.818G>A (p.Arg273His) DNA-binding domain missense',
    tcgaFrequency: '84.2% in TNBC, 31.5% in Luminal B',
    cnvState: '17p13.1 Deletion / Loss of Heterozygosity',
    functionSummary: 'Primary tumor suppressor master regulator controlling G1/S DNA damage checkpoint, apoptosis, and senescence.',
    clinicalImpact: 'TP53 mutation with elevated transcript expression is consistent with TP53 dysregulation; specific dominant-negative or gain-of-function effects require variant-level functional evidence.'
  },
  EGFR: {
    gene: 'EGFR',
    mutationDetail: 'Wildtype CDS with mRNA promoter hyperactivation',
    tcgaFrequency: '28.1% in Basal-like TNBC',
    cnvState: 'Diploid / Focal 7p11.2 Gain',
    functionSummary: 'Receptor tyrosine kinase driving downstream RAS-RAF-MEK-ERK and PI3K-AKT cell survival pathways.',
    clinicalImpact: 'High expression correlates with invasive phenotype in Triple-Negative Breast Cancer; targeted by Cetuximab.'
  },
  MKI67: {
    gene: 'MKI67',
    mutationDetail: 'Nuclear antigen overexpression (Ki-67 Index: 78%)',
    tcgaFrequency: 'Marker of proliferation in >90% high-grade tumors',
    cnvState: 'Transcriptional upregulation via E2F hyperactivation',
    functionSummary: 'Nuclear protein strictly required for cellular proliferation, chromatin organization, and mitotic spindle assembly.',
    clinicalImpact: 'Primary quantitative biomarker distinguishing Luminal A (<14%) from aggressive Luminal B and Basal-like subtypes.'
  },
  PARP1: {
    gene: 'PARP1',
    mutationDetail: 'Overexpressed catalytic subunit',
    tcgaFrequency: '42.6% overexpressed in HRD tumors',
    cnvState: '1q42 Gain / Transcriptional Upregulation',
    functionSummary: 'Poly(ADP-ribose) polymerase required for single-strand DNA break repair via base excision repair.',
    clinicalImpact: 'Target for PARP trapping therapy in homologous recombination deficient tumors.'
  },
  ESR1: {
    gene: 'ESR1',
    mutationDetail: 'Wildtype / Downregulated promoter methylation',
    tcgaFrequency: '72.3% expressed in Luminal A/B',
    cnvState: 'Diploid (Repressed in Basal-like, Amplified in Luminal)',
    functionSummary: 'Nuclear hormone receptor transcription factor driving luminal cell lineage differentiation.',
    clinicalImpact: 'Primary predictive marker for endocrine therapy (Tamoxifen, Aromatase Inhibitors, Fulvestrant).'
  },
  ERBB2: {
    gene: 'ERBB2',
    mutationDetail: 'Focal 17q12 Chromosomal Amplification (>10 copies)',
    tcgaFrequency: '15.8% in Breast Invasive Carcinoma',
    cnvState: 'High-Level Focal Amplification (Copy Number: 14.2)',
    functionSummary: 'Receptor tyrosine kinase (HER2) forming potent signaling heterodimers with HER3 to drive PI3K-AKT cell survival.',
    clinicalImpact: 'Indicates eligibility for HER2 targeted regimens (Trastuzumab, Pertuzumab, T-DXd, Tucatinib).'
  },
  GRB7: {
    gene: 'GRB7',
    mutationDetail: 'Co-amplified with ERBB2 on 17q12 amplicon',
    tcgaFrequency: '14.9% co-amplified with HER2',
    cnvState: 'High-Level Focal Amplification',
    functionSummary: 'Adapter protein with SH2 domain bridging tyrosine kinase receptors to downstream focal adhesion kinases.',
    clinicalImpact: 'Co-driver of metastatic cell migration in HER2-amplified breast cancers.'
  },
  PIK3CA: {
    gene: 'PIK3CA',
    mutationDetail: 'c.3140A>G (p.His1047Arg) Kinase Domain Hotspot',
    tcgaFrequency: '34.8% across all Breast Cancers',
    cnvState: '3q26.32 Gain / Somatic Mutation',
    functionSummary: 'Catalytic subunit p110alpha of class IA PI3K generating PIP3 to hyperactivate AKT and mTORC1.',
    clinicalImpact: 'Predicts response to PI3K alpha-selective inhibitor Alpelisib and Inavolisib in ER+ HR+ tumors.'
  },
  PGR: {
    gene: 'PGR',
    mutationDetail: 'Transcriptional target of ESR1',
    tcgaFrequency: '65.2% expressed in HR+ Breast Cancer',
    cnvState: 'Diploid / Downregulated in Luminal B vs Luminal A',
    functionSummary: 'Progesterone receptor functioning as steroid-activated transcription factor.',
    clinicalImpact: 'Used in immunohistochemistry to confirm functional ER pathway activity and favorable endocrine response.'
  },
  FOXA1: {
    gene: 'FOXA1',
    mutationDetail: 'Forkhead box pioneer factor overexpression',
    tcgaFrequency: '48.2% expressed in Luminal subtypes',
    cnvState: 'Diploid / Upregulated',
    functionSummary: 'Pioneer transcription factor opening chromatin for ER alpha binding to enhancer loci.',
    clinicalImpact: 'Defines luminal differentiation state and endocrine sensitivity.'
  },
  BCL2: {
    gene: 'BCL2',
    mutationDetail: 'Anti-apoptotic protein overexpression',
    tcgaFrequency: '58.4% overexpressed in Luminal A',
    cnvState: '18q21.33 Gain',
    functionSummary: 'Outer mitochondrial membrane protein blocking cytochrome C release and caspases.',
    clinicalImpact: 'Associated with indolent disease behavior and favorable prognosis in ER+ breast cancer.'
  },
  CCND1: {
    gene: 'CCND1',
    mutationDetail: '11q13 Focal Chromosomal Amplification',
    tcgaFrequency: '18.5% amplified in Breast Cancer',
    cnvState: 'Focal Copy Number Gain (Copy Number: 8.5)',
    functionSummary: 'Regulatory subunit forming active kinase complexes with CDK4/6 to phosphorylate Rb and drive G1/S transition.',
    clinicalImpact: 'Key driver of CDK4/6 inhibitor response (Palbociclib, Ribociclib).'
  },
  CDK4: {
    gene: 'CDK4',
    mutationDetail: 'Cyclin-dependent kinase 4 overexpression',
    tcgaFrequency: '12.1% overexpressed',
    cnvState: '12q14.1 Gain / Diploid',
    functionSummary: 'Catalytic kinase executing G1 to S phase cell cycle progression via retinoblastoma protein inactivation.',
    clinicalImpact: 'Direct target of FDA-approved CDK4/6 inhibitors.'
  },
  AURKA: {
    gene: 'AURKA',
    mutationDetail: 'Aurora kinase A mitotic overexpression',
    tcgaFrequency: '38.2% elevated in high-grade tumors',
    cnvState: '20q13.2 Gain',
    functionSummary: 'Mitotic centrosomal kinase regulating chromosome alignment and centrosome maturation.',
    clinicalImpact: 'High AURKA score marks aggressive high-proliferation Luminal B and TNBC tumors.'
  }
};

export const BiomarkerImpactVisualizer: React.FC<BiomarkerImpactVisualizerProps> = ({
  genes,
  cancerProbability
}) => {
  const [selectedGene, setSelectedGene] = useState<DetailedGeneInfo | null>(null);
  const [hoveredGene, setHoveredGene] = useState<string | null>(null);

  const getGeneDetails = (geneName: string): DetailedGeneInfo => {
    return (
      GENE_DETAILS_DATABASE[geneName] || {
        gene: geneName,
        mutationDetail: 'Somatic Expression Alteration',
        tcgaFrequency: 'Found in 18-35% of TCGA breast cohorts',
        cnvState: 'Diploid / Expression Variant',
        functionSummary: `Transcriptomic biomarker participating in regulatory cellular cascades.`,
        clinicalImpact: 'Informs molecular subtyping and risk assessment.'
      }
    );
  };

  return (
    <div className="bg-[#05070A] bg-grain border border-white/10 rounded-sm p-6 shadow-2xl relative">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10 mb-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-[10px] tracking-[0.3em] uppercase">
            <Activity className="h-3.5 w-3.5" /> SHAP EXPLAINABLE AI BIOMARKER ENGINE
          </div>
          <h2 className="text-2xl font-light italic serif text-white tracking-tight mt-1">
            Top Contributing Biomarkers & Impact Spectrum
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl font-sans">
            Shapley additive explanations (TreeSHAP) quantify each gene's exact contribution towards elevating (+) or reducing (-) the patient's predicted cancer probability ({cancerProbability}%).
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1 bg-white/5 text-cyan-300 border border-white/10 rounded-sm">
            Interactive Node Breakdown
          </span>
        </div>
      </div>

      {/* SHAP Waterfall / Impact Bar Stack */}
      <div className="space-y-3 mb-6">
        {genes.map((g) => {
          const isPositive = g.shapValue >= 0;
          const estimatedProbabilityDelta = Math.round(g.shapValue * 45 * 10) / 10; // % impact
          const details = getGeneDetails(g.gene);
          const isSelected = selectedGene?.gene === g.gene;
          const isHovered = hoveredGene === g.gene;

          return (
            <div
              key={g.gene}
              onClick={() => setSelectedGene(details)}
              onMouseEnter={() => setHoveredGene(g.gene)}
              onMouseLeave={() => setHoveredGene(null)}
              className={`p-3.5 rounded-sm border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-white/10 border-cyan-400 ring-1 ring-cyan-400/50 shadow-lg'
                  : isHovered
                  ? 'bg-white/5 border-cyan-500/50'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 font-mono">
                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-sm text-cyan-300 flex items-center gap-1.5">
                    <Dna className="h-3.5 w-3.5 text-cyan-400" />
                    {g.gene}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-sm bg-white/10 text-slate-300 border border-white/10">
                    {g.pathway}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-sm uppercase font-bold ${
                    g.status === 'Mutated' || g.status === 'Amplified' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                    g.status === 'Overexpressed' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                    'bg-cyan-950 text-cyan-300 border border-cyan-800'
                  }`}>
                    {g.status}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="text-slate-400 text-[11px]">
                    Expr: <strong className="text-slate-200">{g.expressionLevel} TPM</strong> (Base: {g.baselineMean})
                  </span>
                  <div className={`flex items-center font-bold px-2 py-0.5 rounded-sm ${
                    isPositive ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {isPositive ? <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" /> : <ArrowDownRight className="h-3.5 w-3.5 mr-0.5" />}
                    {isPositive ? `+${estimatedProbabilityDelta}% Risk` : `${estimatedProbabilityDelta}% Risk`}
                  </div>
                </div>
              </div>

              {/* Progress / Force Impact Visual Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span className="truncate">{details.mutationDetail}</span>
                  <span className="text-cyan-400 font-semibold">SHAP Force: {g.shapValue > 0 ? `+${g.shapValue.toFixed(2)}` : g.shapValue.toFixed(2)}</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-none overflow-hidden flex items-center relative">
                  <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/30 z-10" />
                  
                  {isPositive ? (
                    <div
                      className="h-full bg-gradient-to-r from-rose-500 to-red-400 ml-auto"
                      style={{
                        width: `${Math.min(50, Math.abs(g.shapValue) * 120)}%`,
                        marginRight: '0'
                      }}
                    />
                  ) : (
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-teal-500"
                      style={{
                        width: `${Math.min(50, Math.abs(g.shapValue) * 120)}%`,
                        marginLeft: `${50 - Math.min(50, Math.abs(g.shapValue) * 120)}%`
                      }}
                    />
                  )}
                </div>
              </div>

              {/* Click instruction prompt on hover */}
              <div className="mt-2 text-[10px] text-cyan-400/80 font-mono flex items-center justify-between">
                <span>TCGA Population Frequency: {details.tcgaFrequency}</span>
                <span className="underline uppercase tracking-wider">Click for Gene Function & Clinical Details &rarr;</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Gene Detail Modal / Expanded Card */}
      {selectedGene && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05070A]/85 backdrop-blur-md">
          <div className="bg-[#05070A] bg-grain border border-white/20 rounded-sm w-full max-w-2xl shadow-2xl p-6 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setSelectedGene(null)}
              className="absolute top-4 right-4 p-1.5 rounded-sm bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-all"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 text-cyan-400 font-mono text-[10px] tracking-[0.3em] uppercase mb-1">
              <Sparkles className="h-3.5 w-3.5" /> BIOMARKER MECHANISTIC BLUEPRINT
            </div>

            <h3 className="text-2xl font-light italic serif text-white mb-1 flex items-center gap-3">
              {selectedGene.gene}
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-sm bg-cyan-950 text-cyan-300 border border-cyan-800 not-italic">
                {selectedGene.cnvState.split('/')[0]}
              </span>
            </h3>

            <div className="space-y-4 my-4 text-xs font-mono">
              <div className="bg-white/5 p-3 rounded-sm border border-white/10">
                <span className="text-slate-400 block text-[10px] uppercase mb-1">Observed Variant / Mutation Profile</span>
                <span className="text-cyan-300 font-bold">{selectedGene.mutationDetail}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 p-3 rounded-sm border border-white/10">
                  <span className="text-slate-400 block text-[10px] uppercase mb-1">TCGA Prevalence</span>
                  <span className="text-slate-200">{selectedGene.tcgaFrequency}</span>
                </div>
                <div className="bg-white/5 p-3 rounded-sm border border-white/10">
                  <span className="text-slate-400 block text-[10px] uppercase mb-1">Copy Number Alteration</span>
                  <span className="text-slate-200">{selectedGene.cnvState}</span>
                </div>
              </div>

              <div className="bg-white/5 p-3 rounded-sm border border-white/10">
                <span className="text-slate-400 block text-[10px] uppercase mb-1">Molecular Function & Pathway Role</span>
                <p className="text-slate-200 font-sans leading-relaxed">{selectedGene.functionSummary}</p>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-sm">
                <span className="text-amber-300 block text-[10px] uppercase font-bold mb-1">Precision Clinical Actionability</span>
                <p className="text-amber-200/90 font-sans leading-relaxed">{selectedGene.clinicalImpact}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-end font-mono">
              <button
                onClick={() => setSelectedGene(null)}
                className="px-4 py-1.5 rounded-sm bg-white/10 hover:bg-white/20 text-white text-xs uppercase border border-white/20 transition-all"
              >
                Close Blueprint
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
