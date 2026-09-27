import React, { useState, useEffect } from 'react';
import { PatientLabs, CDSSAnalysis } from './types/cdss';
import { AppSettings } from './types/settings';
import { loadSettings, saveSettings } from './utils/settingsStore';
import { calculateAnalysis } from './utils/calculator';
import { Navbar, ActiveTab } from './components/Navbar';
import { AnalyzerView } from './components/AnalyzerView';
import { CaseLibraryView } from './components/CaseLibraryView';
import { KnowledgeHubView } from './components/KnowledgeHubView';
import { ReportModal } from './components/ReportModal';
import { SettingsModal } from './components/SettingsModal';
import { CLINICAL_CASES } from './data/caseLibrary';
import { 
  ShieldCheck, 
  ExternalLink, 
  Stethoscope, 
  BookOpen, 
  GitBranch, 
  Activity, 
  HeartHandshake
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('analyzer');
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());

  // Listen for external settings change events
  useEffect(() => {
    const handleSettingsChange = (e: Event) => {
      const customEvent = e as CustomEvent<AppSettings>;
      if (customEvent.detail) {
        setSettings(customEvent.detail);
      }
    };
    window.addEventListener('hepa_settings_changed', handleSettingsChange);
    return () => window.removeEventListener('hepa_settings_changed', handleSettingsChange);
  }, []);

  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);

    // If ULN thresholds changed, sync current patient labs ULN
    setCurrentLabs(prev => {
      let altUln = prev.gender === 'male' ? newSettings.customUln.altMale : newSettings.customUln.altFemale;
      let astUln = prev.gender === 'male' ? newSettings.customUln.astMale : newSettings.customUln.astFemale;
      return {
        ...prev,
        altUln,
        astUln,
        alpUln: newSettings.customUln.alp
      };
    });
  };

  // Initial default state (seeded with a rich clinical scenario: Hepatitis B flare)
  const [currentLabs, setCurrentLabs] = useState<PatientLabs>(() => {
    const initial = CLINICAL_CASES[0].labs;
    const initialSettings = loadSettings();
    return {
      ...initial,
      altUln: initial.gender === 'male' ? initialSettings.customUln.altMale : initialSettings.customUln.altFemale,
      astUln: initial.gender === 'male' ? initialSettings.customUln.astMale : initialSettings.customUln.astFemale,
      alpUln: initialSettings.customUln.alp
    };
  });

  const analysis: CDSSAnalysis = calculateAnalysis(currentLabs);

  const handleSelectCaseToAnalyze = (labs: PatientLabs) => {
    setCurrentLabs({ ...labs });
    setActiveTab('analyzer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans antialiased selection:bg-teal-500 selection:text-white">
      {/* Top Professional Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'analyzer' && (
          <AnalyzerView
            currentLabs={currentLabs}
            setCurrentLabs={setCurrentLabs}
            onOpenReportModal={() => setIsReportModalOpen(true)}
            onOpenSettings={() => setIsSettingsModalOpen(true)}
            settings={settings}
          />
        )}

        {activeTab === 'cases' && (
          <CaseLibraryView
            onSelectCaseToAnalyze={handleSelectCaseToAnalyze}
          />
        )}

        {(activeTab === 'knowledge' || activeTab === 'flowcharts' || activeTab === 'guide' || activeTab === 'biomarkers') && (
          <KnowledgeHubView />
        )}
      </main>

      {/* Medical Report / Print Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        labs={currentLabs}
        analysis={analysis}
        settings={settings}
      />

      {/* Settings & Export Center Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        currentLabs={currentLabs}
        analysis={analysis}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onImportLabs={(importedLabs) => {
          setCurrentLabs(importedLabs);
          setActiveTab('analyzer');
        }}
      />

      {/* Professional Medical Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-8 px-4 sm:px-6 lg:px-8 mt-12 text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
          
          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center space-x-2 text-white font-extrabold text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400"></span>
              <span>HepaCDSS - Hệ Thống Hỗ Trợ Quyết Định Sinh Hóa Gan</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-lg">
              Được xây dựng nhằm mục đích lưu trữ kinh nghiệm, tra cứu nhanh thư viện tri thức chuyên môn và hỗ trợ tư duy logic lâm sàng cho bác sĩ chuyên khoa Tiêu hóa - Gan mật, Hồi sức cấp cứu và Bác sĩ gia đình.
            </p>
            <div className="flex items-center space-x-2 pt-1 text-[11px] text-teal-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Dự án phi lợi nhuận lưu trữ kiến thức y khoa, không lưu trữ dữ liệu định danh bệnh nhân.</span>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-slate-200 font-bold text-xs uppercase tracking-wider block">
              Tài Liệu Hướng Dẫn Nền Tảng
            </span>
            <ul className="space-y-1.5 text-[11px] text-slate-400">
              <li>• ACG Clinical Guideline: Abnormal Liver Chemistries (Am J Gastroenterol 2017)</li>
              <li>• WHO Training Workshop: Interpretation of Liver Function Tests (Session 4)</li>
              <li>• The De Ritis Ratio: The Test of Time (Clin Biochem Rev 2013)</li>
              <li>• Reviews in Gastroenterology & Hepatology (Gastroenterology 2026)</li>
            </ul>
          </div>

          <div className="space-y-2">
            <span className="text-slate-200 font-bold text-xs uppercase tracking-wider block">
              Tính Năng Trọng Tâm
            </span>
            <ul className="space-y-1.5 text-[11px] text-slate-400">
              <li>• Phân loại tổn thương R-ratio & AST/ALT De Ritis</li>
              <li>• Tự động tính thang điểm xơ hóa FIB-4, APRI</li>
              <li>• 12 Ca lâm sàng thực tế mẫu minh họa sinh động</li>
              <li>• Lưu đồ tiếp cận 3 phân nhánh tương tác</li>
              <li>• Xuất phiếu hội chẩn và in báo cáo PDF chuẩn mực</li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto pt-6 mt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
          <span>© 2026 HepaCDSS Medical Decision Support Project. All Rights Reserved.</span>
          <span>Khuyến cáo: Mọi phân tích chỉ có giá trị tham khảo hỗ trợ chuyên môn, quyết định điều trị sau cùng thuộc về bác sĩ lâm sàng.</span>
        </div>
      </footer>
    </div>
  );
}
