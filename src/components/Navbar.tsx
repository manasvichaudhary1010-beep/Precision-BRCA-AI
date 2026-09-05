import React from 'react';
import { Sparkles, Upload, Menu } from 'lucide-react';
import { PatientProfile } from '../types';

export type NavTab = 
  | 'simulator' 
  | 'explorer' 
  | 'subtypes' 
  | 'validation' 
  | 'calibration' 
  | 'shap' 
  | 'bioevidence' 
  | 'survival' 
  | 'targets' 
  | 'comparison' 
  | 'figures' 
  | 'evidence' 
  | 'titles'
  | 'provenance';

interface NavbarProps {
  currentPatient?: PatientProfile;
  onOpenAiReport: () => void;
  onOpenUploadModal: () => void;
  hasGeneratedReport: boolean;
  onToggleMobileSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPatient,
  onOpenAiReport,
  onOpenUploadModal,
  hasGeneratedReport,
  onToggleMobileSidebar
}) => {
  return (
    <header className="sticky top-0 z-20 bg-[#05070A]/95 backdrop-blur-md border-b border-white/10 text-slate-100 shadow-xl h-14">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between font-mono">
        
        {/* Left: Mobile Menu Toggle & App Branding */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-1.5 rounded-sm bg-white/5 border border-white/10 text-slate-300 hover:text-white"
            title="Open Workflow Navigation Menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-xs font-bold tracking-[0.3em] text-cyan-400 uppercase">
              PRECISION-BRCA 2.0
            </span>
          </div>

          <span className="hidden md:inline text-[9px] text-slate-400 uppercase tracking-widest pl-2 border-l border-white/10">
            COMPUTATIONAL ONCOLOGY RESEARCH PLATFORM
          </span>
        </div>

        {/* Center: Current Active Patient Profile Badge */}
        {currentPatient && (
          <div className="hidden sm:flex items-center gap-2.5 bg-white/5 px-3 py-1 rounded-sm border border-white/10 text-xs">
            <span className="text-slate-400 text-[10px] uppercase">Active:</span>
            <span className="text-cyan-300 font-bold">{currentPatient.patientId}</span>
            <span className="text-slate-400">({currentPatient.molecularSubtype})</span>
            
            {/* High Visibility Provenance Data Type Badge */}
            <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-sm border uppercase tracking-wider ${
              currentPatient.dataType === 'TCGA RESEARCH SAMPLE' || (!currentPatient.dataType && currentPatient.patientId.startsWith('TCGA'))
                ? 'bg-blue-950/90 text-blue-300 border-blue-500/50 shadow-sm'
                : currentPatient.dataType === 'SYNTHETIC DEMO'
                ? 'bg-amber-950/90 text-amber-300 border-amber-500/50 shadow-sm'
                : currentPatient.dataType === 'RECONSTRUCTED DEMONSTRATION CASE'
                ? 'bg-purple-950/90 text-purple-300 border-purple-500/50 shadow-sm'
                : 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50 shadow-sm'
            }`}>
              DATA TYPE: {currentPatient.dataType || (currentPatient.patientId.startsWith('TCGA') ? 'TCGA RESEARCH SAMPLE' : 'SYNTHETIC DEMO')}
            </span>
          </div>
        )}

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenUploadModal}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[11px] tracking-wider uppercase bg-white/5 hover:bg-white/10 text-slate-200 border border-white/15 transition-all"
          >
            <Upload className="h-3 w-3 text-cyan-400" />
            <span className="hidden sm:inline">Upload Profile</span>
          </button>

          <button
            onClick={onOpenAiReport}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-sm text-[11px] tracking-wider uppercase border transition-all ${
              hasGeneratedReport
                ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300 hover:bg-emerald-900/80'
                : 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300 hover:bg-cyan-900/80'
            }`}
          >
            <Sparkles className="h-3 w-3 text-cyan-400" />
            <span>{hasGeneratedReport ? 'View AI Synthesis' : 'AI Synthesis'}</span>
          </button>
        </div>

      </div>
    </header>
  );
};
