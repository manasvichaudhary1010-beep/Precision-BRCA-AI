import React, { useState } from 'react';
import { 
  Activity, Database, FileSpreadsheet, ShieldCheck, BookOpen, 
  Sparkles, Upload, Layers, Dna, Target, TrendingUp, BarChart2,
  ChevronLeft, ChevronRight, X, Microscope, LayoutDashboard, CheckCircle2, Bookmark
} from 'lucide-react';
import { NavTab } from './Navbar';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenAiReport: () => void;
  onOpenUploadModal: () => void;
  hasGeneratedReport: boolean;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
}

interface WorkflowGroup {
  groupNumber: string;
  groupName: string;
  items: {
    id: NavTab;
    label: string;
    icon: React.FC<{ className?: string }>;
    badge?: string;
  }[];
}

const WORKFLOW_GROUPS: WorkflowGroup[] = [
  {
    groupNumber: '01',
    groupName: 'OVERVIEW',
    items: [
      { id: 'simulator', label: 'Dashboard', icon: LayoutDashboard }
    ]
  },
  {
    groupNumber: '02',
    groupName: 'MOLECULAR DISCOVERY',
    items: [
      { id: 'explorer', label: 'Multi-Omics', icon: Dna },
      { id: 'subtypes', label: 'Subtypes', icon: Layers },
      { id: 'validation', label: 'GEO Cohorts', icon: Database, badge: 'n=1,420' }
    ]
  },
  {
    groupNumber: '03',
    groupName: 'CLINICAL INTELLIGENCE',
    items: [
      { id: 'comparison', label: '3-Model Clinical', icon: BarChart2 },
      { id: 'calibration', label: 'DCA Net Benefit', icon: TrendingUp },
      { id: 'survival', label: 'Survival', icon: Activity },
      { id: 'shap', label: 'SHAP & Uncertainty', icon: Sparkles }
    ]
  },
  {
    groupNumber: '04',
    groupName: 'VALIDATION',
    items: [
      { id: 'bioevidence', label: '6-Layer Evidence', icon: Microscope },
      { id: 'validation', label: 'External Validation', icon: ShieldCheck },
      { id: 'provenance', label: 'Model Provenance', icon: Bookmark, badge: 'Audited' }
    ]
  },
  {
    groupNumber: '05',
    groupName: 'THERAPEUTICS',
    items: [
      { id: 'targets', label: 'DepMap Therapeutics', icon: Target }
    ]
  },
  {
    groupNumber: '06',
    groupName: 'PUBLICATION',
    items: [
      { id: 'figures', label: '12 Figures', icon: FileSpreadsheet },
      { id: 'evidence', label: 'Method Rigor', icon: CheckCircle2 },
      { id: 'titles', label: 'Paper Strategy', icon: BookOpen }
    ]
  }
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAiReport,
  onOpenUploadModal,
  hasGeneratedReport,
  isOpenMobile,
  setIsOpenMobile
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpenMobile(false)}
        />
      )}

      {/* Left Sidebar Main Container */}
      <aside className={`
        fixed lg:sticky top-0 z-50 lg:z-30 h-screen bg-[#05070A] border-r border-white/10
        flex flex-col transition-all duration-300 shadow-2xl font-mono text-xs select-none
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'w-16' : 'w-64'}
      `}>
        
        {/* Sidebar Brand Header */}
        <div className="h-16 px-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-black/50">
          {!isCollapsed ? (
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('simulator')}>
              <span className="text-base">🧬</span>
              <div>
                <h1 className="text-xs font-bold tracking-[0.2em] text-cyan-400 uppercase flex items-center gap-1.5">
                  PRECISION-BRCA AI
                </h1>
                <span className="text-[9px] text-slate-400 block tracking-wider font-sans -mt-0.5">
                  Multi-Omics Oncology
                </span>
              </div>
            </div>
          ) : (
            <div className="mx-auto cursor-pointer" onClick={() => setActiveTab('simulator')} title="Precision-BRCA AI">
              <span className="text-lg">🧬</span>
            </div>
          )}

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex items-center justify-center h-7 w-7 rounded-sm bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-all ml-auto"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setIsOpenMobile(false)}
            className="lg:hidden h-8 w-8 flex items-center justify-center rounded-sm bg-white/5 border border-white/10 text-slate-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Action Button Bar */}
        <div className="p-3 border-b border-white/10 bg-white/[0.02] space-y-2 shrink-0">
          <button
            onClick={() => {
              onOpenUploadModal();
              setIsOpenMobile(false);
            }}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-sm border uppercase tracking-wider text-[11px] transition-all ${
              isCollapsed ? 'justify-center px-0' : 'justify-start'
            } bg-white/5 hover:bg-white/10 text-slate-200 border-white/15`}
            title="Upload Patient Profile"
          >
            <Upload className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
            {!isCollapsed && <span>Upload Profile</span>}
          </button>

          <button
            onClick={() => {
              onOpenAiReport();
              setIsOpenMobile(false);
            }}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-sm border uppercase tracking-wider text-[11px] transition-all ${
              isCollapsed ? 'justify-center px-0' : 'justify-start'
            } ${
              hasGeneratedReport
                ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300 hover:bg-emerald-900/80'
                : 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300 hover:bg-cyan-900/80'
            }`}
            title="AI Synthesis & Oncology Report"
          >
            <Sparkles className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
            {!isCollapsed && <span>{hasGeneratedReport ? 'View AI Synthesis' : 'AI Synthesis'}</span>}
          </button>
        </div>

        {/* Workflow Group Navigation Items List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-5 scrollbar-thin scrollbar-thumb-white/10">
          {WORKFLOW_GROUPS.map((group) => (
            <div key={group.groupNumber} className="space-y-1">
              
              {/* Group Title Section */}
              {!isCollapsed ? (
                <div className="text-[9px] font-mono tracking-[0.15em] font-semibold text-slate-500 px-2.5 pb-1 flex items-center gap-1.5 uppercase">
                  <span className="text-cyan-400/80 font-bold">{group.groupNumber} —</span>
                  <span className="text-slate-400">{group.groupName}</span>
                </div>
              ) : (
                <div className="w-full h-px bg-white/10 my-2" title={`${group.groupNumber} — ${group.groupName}`} />
              )}

              {/* Group Items */}
              <div className="space-y-0.5">
                {group.items.map((item, itemIdx) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={`${item.id}-${itemIdx}`}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsOpenMobile(false);
                      }}
                      className={`
                        w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-sm border text-left transition-all relative group
                        ${isCollapsed ? 'justify-center px-0' : ''}
                        ${isActive
                          ? 'bg-cyan-950/90 text-cyan-300 border-cyan-400/80 font-bold shadow-md ring-1 ring-cyan-400/30'
                          : 'bg-transparent text-slate-400 border-transparent hover:bg-white/5 hover:text-slate-200 hover:border-white/10'
                        }
                      `}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                      
                      {!isCollapsed && (
                        <div className="flex items-center justify-between w-full overflow-hidden">
                          <span className="truncate text-[11px] font-sans tracking-tight">{item.label}</span>
                          {item.badge && (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-sm bg-cyan-950 text-cyan-300 border border-cyan-500/30 ml-1 shrink-0">
                              {item.badge}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Active Left Border Accent */}
                      {isActive && (
                        <span className="absolute left-0 top-1 bottom-1 w-1 bg-cyan-400 rounded-r-sm" />
                      )}
                    </button>
                  );
                })}
              </div>

            </div>
          ))}
        </div>

        {/* Sidebar Footer Info */}
        {!isCollapsed && (
          <div className="p-3 border-t border-white/10 bg-black/50 text-[10px] text-slate-500 font-mono space-y-1 shrink-0">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-300 font-bold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Computationally Validated</span>
            </div>
            <div className="flex items-center justify-between text-[9px] text-slate-500">
              <span>RESEARCH PROTOTYPE</span>
              <span className="text-cyan-400 font-bold">v2.0</span>
            </div>
            <div className="text-[9px] text-slate-400 pt-1 border-t border-white/5 space-y-0.5">
              <div className="font-semibold text-slate-300 truncate">Created & Developed by Manasvi</div>
              <div className="text-[8.5px] text-slate-500 truncate">MSc BioIT | Bioinformatics × AI</div>
            </div>
          </div>
        )}

      </aside>
    </>
  );
};
