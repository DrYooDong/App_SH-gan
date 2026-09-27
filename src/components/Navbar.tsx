import React from 'react';
import { Activity, Compass, FileText, Stethoscope, Settings, ShieldCheck, Sparkles } from 'lucide-react';

export type ActiveTab = 'analyzer' | 'cases' | 'knowledge' | 'flowcharts' | 'guide' | 'biomarkers';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenReportModal?: () => void;
  onOpenSettings?: () => void;
  onQuickPresetSelect?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenReportModal,
  onOpenSettings
}) => {
  const isKnowledgeActive = activeTab === 'knowledge' || activeTab === 'flowcharts' || activeTab === 'guide' || activeTab === 'biomarkers';

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('analyzer')}>
            <div className="w-10 h-10 rounded-lg bg-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-teal-300 via-emerald-200 to-cyan-400 bg-clip-text text-transparent">
                  HepaCDSS
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-teal-950 text-teal-300 border border-teal-800 rounded">
                  Y Khoa Chuẩn Chỉnh
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Hệ Thống Hỗ Trợ Ra Quyết Định Sinh Hóa Gan (ACG & WHO)
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1.5">
            <button
              onClick={() => setActiveTab('analyzer')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'analyzer'
                  ? 'bg-teal-600/25 text-teal-300 border border-teal-500/40 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              <span>Phân Tích CDSS</span>
            </button>

            <button
              onClick={() => setActiveTab('cases')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'cases'
                  ? 'bg-teal-600/25 text-teal-300 border border-teal-500/40 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>12 Ca Lâm Sàng Mẫu</span>
            </button>

            <button
              onClick={() => setActiveTab('knowledge')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                isKnowledgeActive
                  ? 'bg-teal-600/25 text-teal-300 border border-teal-500/40 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Thư Viện Kiến Thức & Lưu Đồ</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-900/80 text-teal-300 font-bold border border-teal-700/50">
                Gộp 3 trong 1
              </span>
            </button>
          </nav>

          {/* Settings & Print Action */}
          <div className="flex items-center space-x-2">
            {onOpenSettings && (
              <button
                onClick={onOpenSettings}
                className="p-2 rounded-xl text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-all border border-slate-700/80 shadow-xs group"
                title="Cài đặt hệ thống, xuất PDF và in ấn chuyên khoa"
                aria-label="Cài đặt hệ thống"
              >
                <Settings className="w-4 h-4 transition-transform group-hover:rotate-45 text-teal-400" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="md:hidden flex items-center justify-between overflow-x-auto py-2.5 space-x-2 border-t border-slate-800 scrollbar-none text-xs">
          <button
            onClick={() => setActiveTab('analyzer')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1.5 ${
              activeTab === 'analyzer' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-300 bg-slate-800'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Phân Tích CDSS</span>
          </button>
          
          <button
            onClick={() => setActiveTab('cases')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1.5 ${
              activeTab === 'cases' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-300 bg-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>12 Ca Mẫu</span>
          </button>

          <button
            onClick={() => setActiveTab('knowledge')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1.5 ${
              isKnowledgeActive ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-300 bg-slate-800'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Thư Viện Kiến Thức</span>
          </button>

          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-400 border border-slate-700/80 shadow-xs shrink-0 flex items-center justify-center"
              title="Cài đặt hệ thống, xuất PDF và in ấn chuyên khoa"
              aria-label="Cài đặt hệ thống"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Sub-banner: Medical specialist repository disclaimer */}
      <div className="bg-slate-950 px-4 py-1 text-center border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-center space-x-2">
        <ShieldCheck className="w-3.5 h-3.5 text-teal-400 shrink-0" />
        <span>
          Thư viện lưu trữ kinh nghiệm chuyên môn lâm sàng cho Bác sĩ. Không lưu trữ thông tin nhận diện bệnh nhân cụ thể.
        </span>
      </div>
    </header>
  );
};
