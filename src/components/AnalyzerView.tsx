import React, { useState } from 'react';
import { PatientLabs, CDSSAnalysis, ClinicalCase } from '../types/cdss';
import { AppSettings } from '../types/settings';
import { calculateAnalysis } from '../utils/calculator';
import { CLINICAL_CASES } from '../data/caseLibrary';
import { generateConsultationPDF } from '../utils/pdfGenerator';
import { 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight, 
  Download, 
  Info, 
  RotateCcw, 
  Sparkles, 
  Stethoscope, 
  TrendingUp, 
  Zap, 
  HelpCircle,
  FileSpreadsheet,
  Printer,
  ChevronDown,
  ChevronUp,
  Settings,
  Maximize2,
  Minimize2,
  Activity,
  ArrowRight,
  Layers,
  FlaskConical,
  ShieldAlert,
  Clock,
  Dna,
  X,
  Award,
  BookOpen,
  Pill,
  AlertOctagon,
  ShieldCheck,
  Search
} from 'lucide-react';
import { 
  ALL_DILI_AGENTS, 
  DILI_PHENOTYPES, 
  TOP_DILI_PRESCRIPTION_DRUGS, 
  DIRECT_HEPATOTOXINS, 
  INDIRECT_HEPATOTOXINS, 
  HERBAL_SUPPLEMENT_TOXINS 
} from '../data/diliDatabase';

interface AnalyzerViewProps {
  currentLabs: PatientLabs;
  setCurrentLabs: React.Dispatch<React.SetStateAction<PatientLabs>>;
  onOpenReportModal: () => void;
  onOpenSettings?: () => void;
  settings?: AppSettings;
}

export const AnalyzerView: React.FC<AnalyzerViewProps> = ({
  currentLabs,
  setCurrentLabs,
  onOpenReportModal,
  onOpenSettings,
  settings
}) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>('');
  const [showAdvancedInputs, setShowAdvancedInputs] = useState<boolean>(false);
  const [showPreAnalyticalInputs, setShowPreAnalyticalInputs] = useState<boolean>(false);
  const [showDiliInputs, setShowDiliInputs] = useState<boolean>(false);
  const [showDeRitisModal, setShowDeRitisModal] = useState<boolean>(false);
  const [showQCModal, setShowQCModal] = useState<boolean>(false);
  const [showDILIModal, setShowDILIModal] = useState<boolean>(false);
  const [diliModalTab, setDiliModalTab] = useState<'phenotypes' | 'drugs' | 'timeline'>('phenotypes');
  const [diliSearchQuery, setDiliSearchQuery] = useState<string>('');
  const [isContextCollapsed, setIsContextCollapsed] = useState<boolean>(false);
  const [activeResultsFilter, setActiveResultsFilter] = useState<'all' | 'analysis' | 'differentials' | 'recommendations'>('all');
  const [isWideResultsMode, setIsWideResultsMode] = useState<boolean>(false);
  const [mobileTab, setMobileTab] = useState<'inputs' | 'results' | 'all'>('inputs');

  // Compute CDSS analysis
  const analysis: CDSSAnalysis = calculateAnalysis(currentLabs);

  const handleGenderChange = (gender: 'male' | 'female') => {
    const defaultAltMale = settings?.customUln.altMale ?? 33;
    const defaultAltFemale = settings?.customUln.altFemale ?? 25;
    const defaultAstMale = settings?.customUln.astMale ?? 33;
    const defaultAstFemale = settings?.customUln.astFemale ?? 25;

    setCurrentLabs(prev => ({
      ...prev,
      gender,
      altUln: gender === 'male' ? defaultAltMale : defaultAltFemale,
      astUln: gender === 'male' ? defaultAstMale : defaultAstFemale
    }));
  };

  const handleSelectCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    const c = CLINICAL_CASES.find(item => item.id === caseId);
    if (c) {
      setCurrentLabs({ ...c.labs });
      if (typeof window !== 'undefined' && window.innerWidth < 1024) {
        setMobileTab('results');
      }
    }
  };

  const handleReset = () => {
    setSelectedCaseId('');
    setCurrentLabs({
      age: 45,
      gender: 'male',
      bmi: 24.5,
      alt: 28,
      altUln: settings?.customUln.altMale ?? 33,
      ast: 26,
      astUln: settings?.customUln.astMale ?? 33,
      alp: 85,
      alpUln: settings?.customUln.alp ?? 120,
      ggt: 32,
      ggtUln: 50,
      totalBilirubin: 0.8,
      directBilirubin: 0.2,
      albumin: 4.2,
      inr: 1.0,
      platelets: 230,
      ultrasoundBiliaryDilatation: 'not-done'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-5 space-y-4 pb-24 lg:pb-6">
      {/* Top Banner: Quick Case Selector & Layout Mode */}
      <div className="bg-slate-900 rounded-2xl p-4 sm:p-5 text-white border border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 bg-teal-500/20 text-teal-300 rounded-lg">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              </span>
              <h2 className="text-base sm:text-lg font-bold">Thư Viện Ca Mẫu Sẵn & Phân Tích CDSS Tức Thì</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300">
              Chọn nhanh bệnh cảnh chuyên khoa mẫu hoặc nhập kết quả xét nghiệm để hệ thống phân tầng tổn thương gan theo ACG 2017 & WHO.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedCaseId}
              onChange={(e) => handleSelectCase(e.target.value)}
              className="bg-slate-800 text-teal-200 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none w-full sm:w-auto sm:max-w-xs min-h-[40px]"
            >
              <option value="">-- Chọn nhanh ca mẫu lâm sàng --</option>
              {CLINICAL_CASES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title} ({c.category})
                </option>
              ))}
            </select>

            <button
              onClick={handleReset}
              className="p-2.5 rounded-xl text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors flex items-center justify-center border border-slate-700/80 shadow-xs shrink-0 min-h-[40px] min-w-[40px]"
              title="Đặt lại thông số bình thường"
              aria-label="Đặt lại thông số"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setIsWideResultsMode(!isWideResultsMode)}
              className={`hidden lg:flex items-center justify-center p-2.5 rounded-xl text-xs font-bold transition-all border shadow-xs shrink-0 ${
                isWideResultsMode 
                  ? 'bg-teal-600 text-white border-teal-500' 
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-700'
              }`}
              title={isWideResultsMode ? "Chuyển về tỷ lệ hiển thị thông thường" : "Mở rộng hiển thị Kết Quả, Chẩn Đoán & Khuyến Cáo"}
              aria-label="Chuyển đổi kích thước hiển thị kết quả"
            >
              {isWideResultsMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile-Adaptive Mode Switcher (< lg) */}
      <div className="lg:hidden bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setMobileTab('inputs')}
            className={`py-2 px-1 rounded-lg flex items-center justify-center space-x-1.5 transition-all min-h-[42px] ${
              mobileTab === 'inputs'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">1. Nhập Liệu</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileTab('results')}
            className={`py-2 px-1 rounded-lg flex items-center justify-center space-x-1.5 transition-all min-h-[42px] ${
              mobileTab === 'results'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">2. Kết Quả</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
          </button>

          <button
            type="button"
            onClick={() => setMobileTab('all')}
            className={`py-2 px-1 rounded-lg flex items-center justify-center space-x-1.5 transition-all min-h-[42px] ${
              mobileTab === 'all'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Cả Hai</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Form Inputs (Left) vs CDSS Insights & Differentials (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Clinical & Lab Inputs */}
        <div className={`${isWideResultsMode ? 'lg:col-span-4 xl:col-span-3' : 'lg:col-span-4'} space-y-4 ${
          mobileTab === 'results' ? 'hidden lg:block' : 'block'
        }`}>
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
            
            {/* Box 1: Thông Tin Bệnh Nhân & Bối Cảnh - Tinh Chỉnh Gọn Gàng */}
            <div className="border border-slate-200/90 rounded-xl bg-slate-50/70 p-3 space-y-2 transition-all">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold text-slate-900 flex items-center space-x-1.5 uppercase tracking-wide">
                  <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                  <span>1. Bệnh Nhân & Bối Cảnh</span>
                </h3>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] text-teal-700 font-semibold bg-teal-50 px-1.5 py-0.5 rounded border border-teal-100">
                    ACG 2017
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsContextCollapsed(!isContextCollapsed)}
                    className="text-slate-500 hover:text-slate-800 p-0.5 rounded"
                    title={isContextCollapsed ? 'Mở rộng thông tin' : 'Thu gọn bớt'}
                  >
                    {isContextCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Collapsed Summary Strip */}
              {isContextCollapsed ? (
                <div className="flex items-center justify-between py-1 text-xs text-slate-700">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900">
                      {currentLabs.gender === 'male' ? 'Nam' : 'Nữ'}, {currentLabs.age || '--'}t
                    </span>
                    <span className="text-slate-400">•</span>
                    <span>BMI {currentLabs.bmi || '--'}</span>
                    <span className="text-slate-400">•</span>
                    <span>Rượu: {currentLabs.alcoholIntake || 0}g/t</span>
                  </div>
                  <button
                    onClick={() => setIsContextCollapsed(false)}
                    className="text-[11px] font-bold text-teal-600 hover:text-teal-800 underline"
                  >
                    Sửa
                  </button>
                </div>
              ) : (
                /* Expanded Compact Form */
                <div className="space-y-2 pt-0.5">
                  {/* Row 1: Gender, Age, BMI, Alcohol in responsive layout */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-1.5">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Giới tính</label>
                      <div className="grid grid-cols-2 gap-0.5 p-0.5 bg-slate-200/80 rounded-lg text-center">
                        <button
                          type="button"
                          onClick={() => handleGenderChange('male')}
                          className={`py-1.5 sm:py-1 text-xs sm:text-[11px] font-bold rounded transition-all min-h-[36px] sm:min-h-0 flex items-center justify-center ${
                            currentLabs.gender === 'male'
                              ? 'bg-teal-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Nam
                        </button>
                        <button
                          type="button"
                          onClick={() => handleGenderChange('female')}
                          className={`py-1.5 sm:py-1 text-xs sm:text-[11px] font-bold rounded transition-all min-h-[36px] sm:min-h-0 flex items-center justify-center ${
                            currentLabs.gender === 'female'
                              ? 'bg-teal-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Nữ
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Tuổi</label>
                      <input
                        type="number"
                        value={currentLabs.age ?? ''}
                        onChange={(e) => setCurrentLabs(p => ({ ...p, age: Number(e.target.value) }))}
                        className="w-full px-2 py-1.5 sm:py-1 text-xs font-semibold bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-500 focus:outline-none text-center min-h-[36px] sm:min-h-0"
                        placeholder="Tuổi"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">BMI</label>
                      <input
                        type="number"
                        step="0.1"
                        value={currentLabs.bmi ?? ''}
                        onChange={(e) => setCurrentLabs(p => ({ ...p, bmi: Number(e.target.value) }))}
                        className="w-full px-2 py-1.5 sm:py-1 text-xs font-semibold bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-500 focus:outline-none text-center min-h-[36px] sm:min-h-0"
                        placeholder="kg/m²"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Rượu (g/tuần)</label>
                      <input
                        type="number"
                        value={currentLabs.alcoholIntake ?? ''}
                        onChange={(e) => setCurrentLabs(p => ({ ...p, alcoholIntake: Number(e.target.value) }))}
                        className="w-full px-2 py-1.5 sm:py-1 text-xs font-semibold bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-500 focus:outline-none text-center min-h-[36px] sm:min-h-0"
                        placeholder="g cồn"
                        title="Gam cồn mỗi tuần"
                      />
                    </div>
                  </div>

                  {/* Row 2: Red-flag Clinical signs as clickable toggles */}
                  <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-slate-200/60">
                    <button
                      type="button"
                      onClick={() => setCurrentLabs(p => ({ ...p, hasEncephalopathy: !p.hasEncephalopathy }))}
                      className={`flex items-center space-x-1.5 p-1.5 rounded-lg text-[11px] font-bold transition-all border text-left ${
                        currentLabs.hasEncephalopathy
                          ? 'bg-rose-100 border-rose-300 text-rose-900 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${currentLabs.hasEncephalopathy ? 'bg-rose-600' : 'bg-slate-300'}`} />
                      <span className="line-clamp-1">Bệnh não gan</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCurrentLabs(p => ({ ...p, hasAscites: !p.hasAscites }))}
                      className={`flex items-center space-x-1.5 p-1.5 rounded-lg text-[11px] font-bold transition-all border text-left ${
                        currentLabs.hasAscites
                          ? 'bg-amber-100 border-amber-300 text-amber-900 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${currentLabs.hasAscites ? 'bg-amber-600' : 'bg-slate-300'}`} />
                      <span className="line-clamp-1">Cổ trướng/Phù</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Section 2: Transaminases (Hepatocellular Injury) */}
            <div className="border-t border-slate-100 pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  <span>2. Men Transaminase (Tế bào gan)</span>
                </h3>
                <span className="text-[10px] text-slate-500">Tế bào chất vs Ty thể</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-rose-50/50 border border-rose-100 rounded-xl space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-rose-900">ALT (SGPT)</label>
                    <span className="text-[10px] font-semibold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                      {analysis.altMultiples}x ULN
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <input
                      type="number"
                      value={currentLabs.alt}
                      onChange={(e) => setCurrentLabs(p => ({ ...p, alt: Number(e.target.value) }))}
                      className="w-full px-2.5 py-1.5 text-sm font-bold text-rose-950 bg-white border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    />
                    <span className="text-xs text-rose-800 font-mono">U/L</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 pt-0.5">
                    <span>ULN chuẩn:</span>
                    <input
                      type="number"
                      value={currentLabs.altUln}
                      onChange={(e) => setCurrentLabs(p => ({ ...p, altUln: Number(e.target.value) }))}
                      className="w-12 text-right border-b border-dashed border-slate-400 bg-transparent font-mono"
                    />
                  </div>
                </div>

                <div className="p-3 bg-rose-50/50 border border-rose-100 rounded-xl space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-rose-900">AST (SGOT)</label>
                    <span className="text-[10px] font-semibold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                      {analysis.astMultiples}x ULN
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <input
                      type="number"
                      value={currentLabs.ast}
                      onChange={(e) => setCurrentLabs(p => ({ ...p, ast: Number(e.target.value) }))}
                      className="w-full px-2.5 py-1.5 text-sm font-bold text-rose-950 bg-white border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    />
                    <span className="text-xs text-rose-800 font-mono">U/L</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 pt-0.5">
                    <span>ULN chuẩn:</span>
                    <input
                      type="number"
                      value={currentLabs.astUln}
                      onChange={(e) => setCurrentLabs(p => ({ ...p, astUln: Number(e.target.value) }))}
                      className="w-12 text-right border-b border-dashed border-slate-400 bg-transparent font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Cholestasis & Bilirubin */}
            <div className="border-t border-slate-100 pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>3. Men Ứ Mật & Bilirubin</span>
                </h3>
                <span className="text-[10px] text-slate-500">Màng vi quản mật</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-amber-900">ALP (Kiềm Thổ)</label>
                    <span className="text-[10px] font-semibold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                      {analysis.alpMultiples}x ULN
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <input
                      type="number"
                      value={currentLabs.alp}
                      onChange={(e) => setCurrentLabs(p => ({ ...p, alp: Number(e.target.value) }))}
                      className="w-full px-2.5 py-1.5 text-sm font-bold text-amber-950 bg-white border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                    <span className="text-xs text-amber-800 font-mono">U/L</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 pt-0.5">
                    <span>ULN chuẩn:</span>
                    <input
                      type="number"
                      value={currentLabs.alpUln}
                      onChange={(e) => setCurrentLabs(p => ({ ...p, alpUln: Number(e.target.value) }))}
                      className="w-12 text-right border-b border-dashed border-slate-400 bg-transparent font-mono"
                    />
                  </div>
                </div>

                <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-amber-900">GGT</label>
                    <span className="text-[10px] text-amber-800">Xác nhận gan</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <input
                      type="number"
                      value={currentLabs.ggt ?? ''}
                      onChange={(e) => setCurrentLabs(p => ({ ...p, ggt: Number(e.target.value) }))}
                      className="w-full px-2.5 py-1.5 text-sm font-bold text-amber-950 bg-white border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      placeholder="U/L"
                    />
                    <span className="text-xs text-amber-800 font-mono">U/L</span>
                  </div>
                  <p className="text-[10px] text-slate-500">ULN: ~35-50 U/L</p>
                </div>
              </div>

              {/* Bilirubin */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <label className="text-xs font-bold text-slate-800 block">Total Bilirubin</label>
                  <div className="flex items-center space-x-1">
                    <input
                      type="number"
                      step="0.1"
                      value={currentLabs.totalBilirubin}
                      onChange={(e) => setCurrentLabs(p => ({ ...p, totalBilirubin: Number(e.target.value) }))}
                      className="w-full px-2.5 py-1.5 text-sm font-bold text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                    <span className="text-xs text-slate-600 font-mono">mg/dL</span>
                  </div>
                  <p className="text-[10px] text-slate-500">Bình thường: &lt;1.2 mg/dL</p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-800">Direct Bilirubin</label>
                    <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-1 rounded">
                      {analysis.conjugatedPercent}%
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <input
                      type="number"
                      step="0.1"
                      value={currentLabs.directBilirubin}
                      onChange={(e) => setCurrentLabs(p => ({ ...p, directBilirubin: Number(e.target.value) }))}
                      className="w-full px-2.5 py-1.5 text-sm font-bold text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                    <span className="text-xs text-slate-600 font-mono">mg/dL</span>
                  </div>
                  <p className="text-[10px] text-slate-500">Liên hợp &gt;50%: Tổn thương gan/mật</p>
                </div>
              </div>

              {/* Ultrasound Biliary Dilatation */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Hình ảnh siêu âm đường mật (USG Abdomen):
                </label>
                <div className="grid grid-cols-3 gap-1 p-1 bg-white border border-slate-200 rounded-lg text-xs">
                  <button
                    type="button"
                    onClick={() => setCurrentLabs(p => ({ ...p, ultrasoundBiliaryDilatation: 'dilated' }))}
                    className={`py-1 rounded font-medium transition-all ${
                      currentLabs.ultrasoundBiliaryDilatation === 'dilated'
                        ? 'bg-amber-500 text-white font-bold shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Dãn đường mật
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentLabs(p => ({ ...p, ultrasoundBiliaryDilatation: 'non-dilated' }))}
                    className={`py-1 rounded font-medium transition-all ${
                      currentLabs.ultrasoundBiliaryDilatation === 'non-dilated'
                        ? 'bg-teal-600 text-white font-bold shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Không dãn
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentLabs(p => ({ ...p, ultrasoundBiliaryDilatation: 'not-done' }))}
                    className={`py-1 rounded font-medium transition-all ${
                      currentLabs.ultrasoundBiliaryDilatation === 'not-done'
                        ? 'bg-slate-700 text-white font-bold shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Chưa làm
                  </button>
                </div>
              </div>
            </div>

            {/* Section 4: Synthetic Function & Fibrosis */}
            <div className="border-t border-slate-100 pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <span>4. Chức Năng Tổng Hợp & Xơ Hóa</span>
                </h3>
                <span className="text-[10px] text-slate-500">Albumin, INR, FIB-4</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Albumin</label>
                  <div className="flex items-center space-x-1">
                    <input
                      type="number"
                      step="0.1"
                      value={currentLabs.albumin ?? ''}
                      onChange={(e) => setCurrentLabs(p => ({ ...p, albumin: Number(e.target.value) }))}
                      className="w-full px-2 py-2 sm:py-1.5 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 min-h-[38px] sm:min-h-0"
                      placeholder="g/dL"
                    />
                  </div>
                  <p className="text-[9px] text-slate-500 mt-0.5">t½ 21 ngày (mạn)</p>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">PT / INR</label>
                  <div className="flex items-center space-x-1">
                    <input
                      type="number"
                      step="0.1"
                      value={currentLabs.inr ?? ''}
                      onChange={(e) => setCurrentLabs(p => ({ ...p, inr: Number(e.target.value) }))}
                      className={`w-full px-2 py-2 sm:py-1.5 text-xs font-semibold rounded-lg focus:ring-2 border min-h-[38px] sm:min-h-0 ${
                        currentLabs.inr && currentLabs.inr >= 1.5 
                          ? 'bg-rose-50 border-rose-300 text-rose-900 font-bold' 
                          : 'bg-slate-50 border-slate-300 text-slate-800'
                      }`}
                      placeholder="INR"
                    />
                  </div>
                  <p className="text-[9px] text-slate-500 mt-0.5">ALF nếu ≥1.5</p>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Tiểu Cầu</label>
                  <div className="flex items-center space-x-1">
                    <input
                      type="number"
                      value={currentLabs.platelets ?? ''}
                      onChange={(e) => setCurrentLabs(p => ({ ...p, platelets: Number(e.target.value) }))}
                      className="w-full px-2 py-2 sm:py-1.5 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 min-h-[38px] sm:min-h-0"
                      placeholder="x10⁹/L"
                    />
                  </div>
                  <p className="text-[9px] text-slate-500 mt-0.5">Dự báo xơ gan</p>
                </div>
              </div>
            </div>

            {/* Section 5: Secondary Biomarkers & Autoimmune Serology (Altaihani 2024) */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <button
                type="button"
                onClick={() => setShowAdvancedInputs(!showAdvancedInputs)}
                className="w-full py-2 px-3 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-xl text-xs font-bold transition-all flex items-center justify-between border border-teal-200/80 shadow-xs"
              >
                <span className="flex items-center space-x-1.5">
                  <FlaskConical className="w-3.5 h-3.5 text-teal-600" />
                  <span>5. Dấu ấn Khối u, Chuyển hóa & Miễn dịch (Altaihani 2024)</span>
                </span>
                {showAdvancedInputs ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showAdvancedInputs && (
                <div className="p-3 bg-slate-50/90 rounded-xl border border-slate-200 space-y-3">
                  {/* Row 1: Tumor Markers */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Dấu ấn khối u gan mật (Tumor Markers)
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-slate-700 block">AFP (ng/mL)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={currentLabs.afp ?? ''}
                          onChange={(e) => setCurrentLabs(p => ({ ...p, afp: Number(e.target.value) }))}
                          className="w-full px-2 py-1 text-xs bg-white border border-slate-300 rounded-lg mt-0.5"
                          placeholder="HCC: >400"
                        />
                        <span className="text-[9px] text-slate-500">HCC / Tái tạo gan</span>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-700 block">CA 19-9 (U/mL)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={currentLabs.ca199 ?? ''}
                          onChange={(e) => setCurrentLabs(p => ({ ...p, ca199: Number(e.target.value) }))}
                          className="w-full px-2 py-1 text-xs bg-white border border-slate-300 rounded-lg mt-0.5"
                          placeholder="BT: <37"
                        />
                        <span className="text-[9px] text-slate-500">U mật / Theo dõi PSC</span>
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Iron Studies & Wilson & Thyroid */}
                  <div className="pt-2 border-t border-slate-200/60">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Bilan Sắt, Đồng & Tuyến Giáp
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-slate-700 block">Ferritin (ng/mL)</label>
                        <input
                          type="number"
                          value={currentLabs.ferritin ?? ''}
                          onChange={(e) => setCurrentLabs(p => ({ ...p, ferritin: Number(e.target.value) }))}
                          className="w-full px-2 py-1 text-xs bg-white border border-slate-300 rounded-lg mt-0.5"
                          placeholder="ng/mL"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-700 block">Bão hòa Transf. (%)</label>
                        <input
                          type="number"
                          step="1"
                          value={currentLabs.transferrinSat ?? ''}
                          onChange={(e) => setCurrentLabs(p => ({ ...p, transferrinSat: Number(e.target.value) }))}
                          className="w-full px-2 py-1 text-xs bg-white border border-slate-300 rounded-lg mt-0.5"
                          placeholder="≥45% HFE"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-700 block">Ceruloplasmin</label>
                        <input
                          type="number"
                          step="1"
                          value={currentLabs.ceruloplasmin ?? ''}
                          onChange={(e) => setCurrentLabs(p => ({ ...p, ceruloplasmin: Number(e.target.value) }))}
                          className="w-full px-2 py-1 text-xs bg-white border border-slate-300 rounded-lg mt-0.5"
                          placeholder="<20 Wilson"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div>
                        <label className="text-[10px] font-bold text-slate-700 block">TSH (µIU/mL)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={currentLabs.tsh ?? ''}
                          onChange={(e) => setCurrentLabs(p => ({ ...p, tsh: Number(e.target.value) }))}
                          className="w-full px-2 py-1 text-xs bg-white border border-slate-300 rounded-lg mt-0.5"
                          placeholder="0.4 - 4.0"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-700 block">LDH (U/L)</label>
                        <input
                          type="number"
                          value={currentLabs.ldh ?? ''}
                          onChange={(e) => setCurrentLabs(p => ({ ...p, ldh: Number(e.target.value) }))}
                          className="w-full px-2 py-1 text-xs bg-white border border-slate-300 rounded-lg mt-0.5"
                          placeholder="50 - 150"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Row 3: Autoimmune Serology Toggles */}
                  <div className="pt-2 border-t border-slate-200/60">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Tự kháng thể gan mật (Serology)
                    </span>
                    <div className="grid grid-cols-3 gap-1.5 text-xs">
                      <div>
                        <label className="text-[9px] font-bold text-slate-600 block">AMA (PBC &gt;95%)</label>
                        <select
                          value={currentLabs.ama ?? 'unknown'}
                          onChange={(e) => setCurrentLabs(p => ({ ...p, ama: e.target.value as any }))}
                          className="w-full p-1 text-[11px] bg-white border border-slate-300 rounded-md font-semibold"
                        >
                          <option value="unknown">Chưa làm</option>
                          <option value="positive">Dương tính (+)</option>
                          <option value="negative">Âm tính (-)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-slate-600 block">ANA / ASMA (AIH-1)</label>
                        <select
                          value={currentLabs.ana ?? 'unknown'}
                          onChange={(e) => setCurrentLabs(p => ({ ...p, ana: e.target.value as any, asma: e.target.value as any }))}
                          className="w-full p-1 text-[11px] bg-white border border-slate-300 rounded-md font-semibold"
                        >
                          <option value="unknown">Chưa làm</option>
                          <option value="positive">Dương tính (+)</option>
                          <option value="negative">Âm tính (-)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-slate-600 block">p-ANCA (PSC)</label>
                        <select
                          value={currentLabs.pAnca ?? 'unknown'}
                          onChange={(e) => setCurrentLabs(p => ({ ...p, pAnca: e.target.value as any }))}
                          className="w-full p-1 text-[11px] bg-white border border-slate-300 rounded-md font-semibold"
                        >
                          <option value="unknown">Chưa làm</option>
                          <option value="positive">Dương tính (+)</option>
                          <option value="negative">Âm tính (-)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Row 4: Extra Parameters (Creatinine, CK, PT seconds) */}
                  <div className="pt-2 border-t border-slate-200/60 grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-700 block">CK cơ (U/L)</label>
                      <input
                        type="number"
                        value={currentLabs.ck ?? ''}
                        onChange={(e) => setCurrentLabs(p => ({ ...p, ck: Number(e.target.value) }))}
                        className="w-full px-2 py-1 text-xs bg-white border border-slate-300 rounded-lg mt-0.5"
                        placeholder="Tiêu cơ"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-700 block">Creatinine (mg/dL)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={currentLabs.creatinine ?? ''}
                        onChange={(e) => setCurrentLabs(p => ({ ...p, creatinine: Number(e.target.value) }))}
                        className="w-full px-2 py-1 text-xs bg-white border border-slate-300 rounded-lg mt-0.5"
                        placeholder="MELD"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-700 block">PT (giây)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={currentLabs.prothrombinTimeSeconds ?? ''}
                        onChange={(e) => setCurrentLabs(p => ({ ...p, prothrombinTimeSeconds: Number(e.target.value) }))}
                        className="w-full px-2 py-1 text-xs bg-white border border-slate-300 rounded-lg mt-0.5"
                        placeholder="10.9-12.5s"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Section 6: Pre-analytical Quality & Interfering Factors Checklist (Altaihani 2024) */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <button
                type="button"
                onClick={() => setShowPreAnalyticalInputs(!showPreAnalyticalInputs)}
                className="w-full py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl text-xs font-bold transition-all flex items-center justify-between border border-amber-200/80 shadow-xs"
              >
                <span className="flex items-center space-x-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                  <span>6. Bẫy Tiền Phân Tích & Yếu Tố Nhiễu (Altaihani 2024)</span>
                </span>
                {showPreAnalyticalInputs ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showPreAnalyticalInputs && (
                <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200 space-y-2 text-xs">
                  <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wide block">
                    Đánh dấu các tình huống mẫu máu & tiền sử để hệ thống hiệu chỉnh:
                  </span>
                  
                  <div className="space-y-1.5">
                    <label className="flex items-start space-x-2 cursor-pointer p-1.5 rounded hover:bg-amber-100/50 transition-colors">
                      <input
                        type="checkbox"
                        checked={Boolean(currentLabs.sampleHemolysis)}
                        onChange={(e) => setCurrentLabs(p => ({ ...p, sampleHemolysis: e.target.checked }))}
                        className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
                      />
                      <div>
                        <span className="font-bold text-slate-800 text-[11px] block">Mẫu máu bị tán huyết (In vitro Hemolysis)</span>
                        <span className="text-[10px] text-slate-500 block leading-tight">Hồng cầu chứa AST gấp 40x huyết tương; vỡ hồng cầu gây tăng giả AST và LDH.</span>
                      </div>
                    </label>

                    <label className="flex items-start space-x-2 cursor-pointer p-1.5 rounded hover:bg-amber-100/50 transition-colors">
                      <input
                        type="checkbox"
                        checked={Boolean(currentLabs.sampleLipemia)}
                        onChange={(e) => setCurrentLabs(p => ({ ...p, sampleLipemia: e.target.checked }))}
                        className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
                      />
                      <div>
                        <span className="font-bold text-slate-800 text-[11px] block">Huyết thanh đục mỡ (Lipemia)</span>
                        <span className="text-[10px] text-slate-500 block leading-tight">Tán xạ quang phổ ở bước sóng 340 nm gây nhiễu phản ứng NADH đo ALT/AST.</span>
                      </div>
                    </label>

                    <label className="flex items-start space-x-2 cursor-pointer p-1.5 rounded hover:bg-amber-100/50 transition-colors">
                      <input
                        type="checkbox"
                        checked={Boolean(currentLabs.metronidazoleUse)}
                        onChange={(e) => setCurrentLabs(p => ({ ...p, metronidazoleUse: e.target.checked }))}
                        className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
                      />
                      <div>
                        <span className="font-bold text-slate-800 text-[11px] block">Đang dùng kháng sinh Metronidazole</span>
                        <span className="text-[10px] text-slate-500 block leading-tight">Hấp thụ quang gần 340 nm làm giảm giả tạo kết quả đo ALT (IFCC).</span>
                      </div>
                    </label>

                    <label className="flex items-start space-x-2 cursor-pointer p-1.5 rounded hover:bg-amber-100/50 transition-colors">
                      <input
                        type="checkbox"
                        checked={Boolean(currentLabs.sampleDelayed)}
                        onChange={(e) => setCurrentLabs(p => ({ ...p, sampleDelayed: e.target.checked }))}
                        className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
                      />
                      <div>
                        <span className="font-bold text-slate-800 text-[11px] block">Mẫu để quá 8h ở nhiệt độ phòng (15-30°C)</span>
                        <span className="text-[10px] text-slate-500 block leading-tight">Vi phạm quy chuẩn bảo quản mẫu của bài báo Altaihani 2024.</span>
                      </div>
                    </label>

                    <label className="flex items-start space-x-2 cursor-pointer p-1.5 rounded hover:bg-amber-100/50 transition-colors">
                      <input
                        type="checkbox"
                        checked={Boolean(currentLabs.isNonFasting)}
                        onChange={(e) => setCurrentLabs(p => ({ ...p, isNonFasting: e.target.checked }))}
                        className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
                      />
                      <div>
                        <span className="font-bold text-slate-800 text-[11px] block">Lấy máu sau ăn nhiều mỡ (Non-fasting)</span>
                        <span className="text-[10px] text-slate-500 block leading-tight">Có thể làm tăng ALT tới 30 U/L và giải phóng ALP ruột (nhóm máu O/B).</span>
                      </div>
                    </label>

                    <label className="flex items-start space-x-2 cursor-pointer p-1.5 rounded hover:bg-amber-100/50 transition-colors">
                      <input
                        type="checkbox"
                        checked={Boolean(currentLabs.strenuousExercise)}
                        onChange={(e) => setCurrentLabs(p => ({ ...p, strenuousExercise: e.target.checked }))}
                        className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
                      />
                      <div>
                        <span className="font-bold text-slate-800 text-[11px] block">Tập thể thao nặng / Chấn thương cơ trong 48h</span>
                        <span className="text-[10px] text-slate-500 block leading-tight">Phóng thích AST cơ bắp (tỷ lệ mô 17:1), làm tăng tỷ số AST/ALT giả.</span>
                      </div>
                    </label>

                    <label className="flex items-start space-x-2 cursor-pointer p-1.5 rounded hover:bg-amber-100/50 transition-colors">
                      <input
                        type="checkbox"
                        checked={Boolean(currentLabs.suspectedAlcoholWithin24h)}
                        onChange={(e) => setCurrentLabs(p => ({ ...p, suspectedAlcoholWithin24h: e.target.checked }))}
                        className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
                      />
                      <div>
                        <span className="font-bold text-slate-800 text-[11px] block">Uống rượu bia trong vòng 24 giờ qua</span>
                        <span className="text-[10px] text-slate-500 block leading-tight">Thời điểm AST/ALT đạt đỉnh cao nhất trước khi AST được thanh thải nhanh (t½ 18h).</span>
                      </div>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Section 7: NEJM 2019 DILI & Phenotyping Screening */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <button
                type="button"
                onClick={() => setShowDiliInputs(!showDiliInputs)}
                className="w-full py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-900 rounded-xl text-xs font-bold transition-all flex items-center justify-between border border-rose-200/80 shadow-xs"
              >
                <span className="flex items-center space-x-1.5">
                  <Pill className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>7. Độc Tính Thuốc &amp; Thảo Dược (NEJM DILI Engine)</span>
                </span>
                <div className="flex items-center space-x-1">
                  {(currentLabs.suspectedDrug || currentLabs.hasPruritus || currentLabs.isUsingAnabolicSteroids || currentLabs.isUsingHerbalSupplements || currentLabs.isUsingCheckpointInhibitor) && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                  )}
                  {showDiliInputs ? <ChevronUp className="w-4 h-4 text-rose-700" /> : <ChevronDown className="w-4 h-4 text-rose-700" />}
                </div>
              </button>

              {showDiliInputs && (
                <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-200 space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-rose-900 uppercase tracking-wide">
                      Tiền sử phơi nhiễm thuốc &amp; thực phẩm chức năng:
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowDILIModal(true)}
                      className="text-[10px] text-rose-700 hover:text-rose-900 font-bold underline flex items-center space-x-1"
                    >
                      <BookOpen className="w-3 h-3" />
                      <span>Tra cứu NEJM</span>
                    </button>
                  </div>

                  {/* Drug Selector & Custom Input */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 block">Thuốc / Tác nhân nghi ngờ</label>
                    <select
                      value={currentLabs.suspectedDrug || ''}
                      onChange={(e) => setCurrentLabs(p => ({ ...p, suspectedDrug: e.target.value }))}
                      className="w-full px-2 py-1.5 text-xs font-medium bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                    >
                      <option value="">-- Chọn thuốc phổ biến hoặc nhập tự do bên dưới --</option>
                      <optgroup label="Top Kháng Sinh Gây DILI (NEJM Table 3)">
                        {TOP_DILI_PRESCRIPTION_DRUGS.filter(d => d.category === 'Antibiotic').map((d, i) => (
                          <option key={i} value={d.name}>{d.name} ({d.nameVi})</option>
                        ))}
                      </optgroup>
                      <optgroup label="NSAID &amp; Giảm Đau">
                        <option value="Diclofenac">Diclofenac (Voltaren)</option>
                        <option value="Acetaminophen (Paracetamol) overdose">Paracetamol quá liều / ngộ độc cấp</option>
                        <option value="Aspirin">Aspirin</option>
                      </optgroup>
                      <optgroup label="Thuốc Miễn Dịch &amp; Ung Thư (Độc Tính Gián Tiếp)">
                        <option value="Pembrolizumab (Keytruda - Anti-PD-1)">Pembrolizumab (Anti-PD-1 - Checkpoint Inhibitor)</option>
                        <option value="Nivolumab (Opdivo - Anti-PD-1)">Nivolumab (Anti-PD-1)</option>
                        <option value="Ipilimumab (Yervoy - Anti-CTLA-4)">Ipilimumab (Anti-CTLA-4)</option>
                        <option value="Rituximab (Anti-CD20)">Rituximab (Kháng CD20 - Tái hoạt HBV)</option>
                        <option value="Azathioprine / 6-MP">Azathioprine / 6-Mercaptopurine</option>
                        <option value="Intravenous Amiodarone">Amiodarone tiêm tĩnh mạch</option>
                      </optgroup>
                      <optgroup label="Thảo Dược &amp; Thể Hình (HDS)">
                        <option value="Green tea extract (Camellia sinensis / Catechins)">Tinh chất trà xanh (viên uống giảm cân)</option>
                        <option value="Anabolic-Androgenic Steroids (AAS)">Steroid đồng hóa tăng cơ (gymer thể hình)</option>
                        <option value="Amanita phalloides toxin">Độc tố nấm tán trắng (Amanita)</option>
                      </optgroup>
                    </select>

                    <input
                      type="text"
                      value={currentLabs.suspectedDrug || ''}
                      onChange={(e) => setCurrentLabs(p => ({ ...p, suspectedDrug: e.target.value }))}
                      placeholder="Hoặc gõ tên thuốc / thảo dược cụ thể..."
                      className="w-full px-2 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  {/* Latency Days */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Thời gian từ khi bắt đầu dùng thuốc tới khi khởi phát (ngày):
                    </label>
                    <input
                      type="number"
                      value={currentLabs.drugLatencyDays ?? ''}
                      onChange={(e) => setCurrentLabs(p => ({ ...p, drugLatencyDays: e.target.value ? Number(e.target.value) : undefined }))}
                      placeholder="Ví dụ: 36 (ngày)"
                      className="w-full px-2 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                    />
                    <p className="text-[9px] text-slate-500 mt-0.5">1-5 ngày: Trực tiếp | 5-90 ngày: Đặc ứng | &gt;90 ngày: Mạn/tự miễn</p>
                  </div>

                  {/* DILI Phenotype Checkboxes */}
                  <div className="space-y-1.5 pt-1 border-t border-rose-200/60">
                    <span className="text-[10px] font-bold text-slate-600 block uppercase">Đặc điểm lâm sàng chỉ điểm (NEJM 2019):</span>

                    <label className="flex items-start space-x-2 cursor-pointer p-1 rounded hover:bg-rose-100/50 transition-colors">
                      <input
                        type="checkbox"
                        checked={Boolean(currentLabs.hasPruritus)}
                        onChange={(e) => setCurrentLabs(p => ({ ...p, hasPruritus: e.target.checked }))}
                        className="mt-0.5 rounded text-rose-600 focus:ring-rose-500"
                      />
                      <div>
                        <span className="font-bold text-slate-800 text-[11px] block">Ngứa da xuất hiện sớm &amp; dữ dội</span>
                        <span className="text-[10px] text-slate-500 block leading-tight">Chỉ điểm viêm gan ứ mật (Cholestatic) hoặc ứ mật đơn thuần (Bland cholestasis).</span>
                      </div>
                    </label>

                    <label className="flex items-start space-x-2 cursor-pointer p-1 rounded hover:bg-rose-100/50 transition-colors">
                      <input
                        type="checkbox"
                        checked={Boolean(currentLabs.hasImmunoallergicFeatures)}
                        onChange={(e) => setCurrentLabs(p => ({ ...p, hasImmunoallergicFeatures: e.target.checked }))}
                        className="mt-0.5 rounded text-rose-600 focus:ring-rose-500"
                      />
                      <div>
                        <span className="font-bold text-slate-800 text-[11px] block">Sốt + Phát ban da + Tăng bạch cầu ái toan</span>
                        <span className="text-[10px] text-slate-500 block leading-tight">Hội chứng quá mẫn dị ứng miễn dịch (DRESS, Stevens-Johnson do Allopurinol, Phenytoin).</span>
                      </div>
                    </label>

                    <label className="flex items-start space-x-2 cursor-pointer p-1 rounded hover:bg-rose-100/50 transition-colors">
                      <input
                        type="checkbox"
                        checked={Boolean(currentLabs.isUsingAnabolicSteroids)}
                        onChange={(e) => setCurrentLabs(p => ({ ...p, isUsingAnabolicSteroids: e.target.checked }))}
                        className="mt-0.5 rounded text-rose-600 focus:ring-rose-500"
                      />
                      <div>
                        <span className="font-bold text-slate-800 text-[11px] block">Tập gym dùng Steroid đồng hóa (Anabolic Steroids)</span>
                        <span className="text-[10px] text-slate-500 block leading-tight">Gây ứ mật đơn thuần (Bland cholestasis) - Vàng da đậm nhưng men gan gần bình thường.</span>
                      </div>
                    </label>

                    <label className="flex items-start space-x-2 cursor-pointer p-1 rounded hover:bg-rose-100/50 transition-colors">
                      <input
                        type="checkbox"
                        checked={Boolean(currentLabs.isUsingHerbalSupplements)}
                        onChange={(e) => setCurrentLabs(p => ({ ...p, isUsingHerbalSupplements: e.target.checked }))}
                        className="mt-0.5 rounded text-rose-600 focus:ring-rose-500"
                      />
                      <div>
                        <span className="font-bold text-slate-800 text-[11px] block">Dùng thảo dược giảm cân / Tinh chất trà xanh</span>
                        <span className="text-[10px] text-slate-500 block leading-tight">Nguyên nhân DILI chiếm 20% hiện nay; nồng độ Catechins cao gây viêm hoại tử gan cấp.</span>
                      </div>
                    </label>

                    <label className="flex items-start space-x-2 cursor-pointer p-1 rounded hover:bg-rose-100/50 transition-colors">
                      <input
                        type="checkbox"
                        checked={Boolean(currentLabs.isUsingCheckpointInhibitor)}
                        onChange={(e) => setCurrentLabs(p => ({ ...p, isUsingCheckpointInhibitor: e.target.checked }))}
                        className="mt-0.5 rounded text-rose-600 focus:ring-rose-500"
                      />
                      <div>
                        <span className="font-bold text-slate-800 text-[11px] block">Đang dùng thuốc ức chế điểm kiểm soát (ICI)</span>
                        <span className="text-[10px] text-slate-500 block leading-tight">Độc tính gián tiếp (Indirect): Kích hoạt tế bào T tự phản ứng tấn công gan; cần corticoid.</span>
                      </div>
                    </label>

                    <label className="flex items-start space-x-2 cursor-pointer p-1 rounded hover:bg-rose-100/50 transition-colors">
                      <input
                        type="checkbox"
                        checked={Boolean(currentLabs.isUsingImmunosuppressant)}
                        onChange={(e) => setCurrentLabs(p => ({ ...p, isUsingImmunosuppressant: e.target.checked }))}
                        className="mt-0.5 rounded text-rose-600 focus:ring-rose-500"
                      />
                      <div>
                        <span className="font-bold text-slate-800 text-[11px] block">Dùng thuốc ức chế miễn dịch (Anti-CD20 Rituximab)</span>
                        <span className="text-[10px] text-slate-500 block leading-tight">Nguy cơ bùng phát tái hoạt Viêm gan virus B (HBV Reactivation) tối cấp.</span>
                      </div>
                    </label>

                    <label className="flex items-start space-x-2 cursor-pointer p-1 rounded hover:bg-rose-100/50 transition-colors">
                      <input
                        type="checkbox"
                        checked={Boolean(currentLabs.hasLacticAcidosis)}
                        onChange={(e) => setCurrentLabs(p => ({ ...p, hasLacticAcidosis: e.target.checked }))}
                        className="mt-0.5 rounded text-rose-600 focus:ring-rose-500"
                      />
                      <div>
                        <span className="font-bold text-slate-800 text-[11px] block">Toan lactic máu / Độc tính ty thể</span>
                        <span className="text-[10px] text-slate-500 block leading-tight">Thoái hóa mỡ vi thể kèm toan chuyển hóa nặng (Stavudine, Linezolid, Aspirin / Reye).</span>
                      </div>
                    </label>

                    <label className="flex items-start space-x-2 cursor-pointer p-1 rounded hover:bg-rose-100/50 transition-colors">
                      <input
                        type="checkbox"
                        checked={Boolean(currentLabs.hasSinusoidalObstructionSigns)}
                        onChange={(e) => setCurrentLabs(p => ({ ...p, hasSinusoidalObstructionSigns: e.target.checked }))}
                        className="mt-0.5 rounded text-rose-600 focus:ring-rose-500"
                      />
                      <div>
                        <span className="font-bold text-slate-800 text-[11px] block">Đau HSP + Gan to + Báng bụng sau ghép tủy / hóa trị</span>
                        <span className="text-[10px] text-slate-500 block leading-tight">Hội chứng tắc xoang gan (SOS/VOD do Busulfan, Cyclophosphamide).</span>
                      </div>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Automated CDSS Engine & Differential Diagnoses (High-Visibility Focus) */}
        <div className={`${isWideResultsMode ? 'lg:col-span-8 xl:col-span-9' : 'lg:col-span-8'} space-y-4 ${
          mobileTab === 'inputs' ? 'hidden lg:block' : 'block'
        }`}>
          
          {/* Critical Red Flag Alerts */}
          {analysis.isAcuteLiverFailureWarning && (
            <div className="p-4 bg-rose-50 border-2 border-rose-500 rounded-2xl flex items-start space-x-3 shadow-md animate-pulse">
              <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-extrabold text-rose-900 uppercase tracking-wide">
                  CẢNH BÁO TỐI KHẨN: NGUY CƠ SUY GAN CẤP (ACUTE LIVER FAILURE - ALF)!
                </h4>
                <p className="text-xs text-rose-800 mt-1 leading-relaxed">
                  Bệnh nhân có tổn thương hoại tử tế bào gan đi kèm rối loạn đông máu (INR ≥ 1.5) và rối loạn tri giác (bệnh não gan / asterixis) mà không có tiền sử xơ gan trước đó. Theo ACG 2017 & AASLD, cần liên hệ khẩn cấp Trung tâm Ghép Gan / Hồi sức Gan Mật để chuẩn bị điều trị hỗ trợ gan tích cực!
                </p>
              </div>
            </div>
          )}

          {analysis.isMassiveTransaminitisWarning && (
            <div className="p-4 bg-amber-50 border-2 border-amber-500 rounded-2xl flex items-start space-x-3 shadow-sm">
              <Zap className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-extrabold text-amber-900 uppercase">
                  TĂNG TRANSAMINASE MỨC ĐỘ KHỔNG LỒ (&gt; 10,000 U/L)
                </h4>
                <p className="text-xs text-amber-800 mt-1">
                  Mức tăng này gần như chỉ gặp trong 3 trường hợp: (1) Ngộ độc Acetaminophen (Paracetamol); (2) Sốc gan / Viêm gan thiếu máu cục bộ (Ischemic hepatopathy); (3) Ngộ độc nấm độc (Amanita). Chỉ định ngay N-Acetylcysteine tĩnh mạch nếu nghi ngờ ngộ độc Paracetamol.
                </p>
              </div>
            </div>
          )}

          {/* NEJM 2019 Hy's Law Emergency Red Flag Alert */}
          {analysis.diliAnalysis?.hysLaw.isPositive && (
            <div className="p-4 bg-rose-50 border-2 border-rose-600 rounded-2xl flex items-start space-x-3 shadow-md animate-pulse">
              <AlertOctagon className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1.5 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h4 className="text-sm font-black text-rose-900 uppercase tracking-wide">
                    🚨 BÁO ĐỘNG ĐỎ: BỆNH NHÂN THỎA TIÊU CHUẨN ĐỊNH LUẬT HY (HY'S LAW - NEJM 2019)
                  </h4>
                  <span className="px-2 py-0.5 bg-rose-600 text-white text-[10px] font-black rounded uppercase tracking-wider self-start sm:self-auto">
                    Tử vong / Ghép gan ≥ 10%
                  </span>
                </div>
                <p className="text-xs text-rose-900 leading-relaxed font-semibold">
                  {analysis.diliAnalysis.hysLaw.message}
                </p>
                <div className="p-2.5 bg-white/90 rounded-xl border border-rose-200 text-[11px] text-rose-950 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  <div>• Tiêu chí ALT/AST: <strong>{currentLabs.alt} U/L</strong> (≥ 3x ULN: <span className="text-rose-700 font-bold">ĐẠT</span>)</div>
                  <div>• Tiêu chí Bilirubin: <strong>{currentLabs.totalBilirubin} mg/dL</strong> (≥ 2x ULN: <span className="text-rose-700 font-bold">ĐẠT</span>)</div>
                  <div>• Loại trừ tắc mật: <strong>Chỉ số R = {analysis.rRatio}</strong> (R &gt; 5: Tế bào gan thuần túy)</div>
                  <div>• Hành động cấp bách: <strong className="text-rose-900 underline">ĐÌNH CHỈ NGAY THUỐC NGHI NGỜ</strong></div>
                </div>
              </div>
            </div>
          )}

          {/* NEJM 2019 DILI Phenotype Comprehensive Analysis Card */}
          {analysis.diliAnalysis?.isSuspected && (
            <div className="p-4 bg-rose-50/50 border-2 border-rose-200 rounded-2xl space-y-3 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rose-200/60 pb-2">
                <div className="flex items-center space-x-2">
                  <Pill className="w-5 h-5 text-rose-600 shrink-0" />
                  <div>
                    <span className="text-xs font-black text-rose-950 uppercase tracking-wide block">
                      Đánh Giá Kiểu Hình Tổn Thương Gan Do Thuốc (NEJM 2019 DILI Engine)
                    </span>
                    <span className="text-[10px] text-slate-500">Hoofnagle JH, Björnsson ES. N Engl J Med 2019; 381:264-73</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 text-[10px] font-black rounded uppercase tracking-wider ${
                    analysis.diliAnalysis.mechanism === 'Direct' ? 'bg-rose-200 text-rose-900 border border-rose-300' :
                    analysis.diliAnalysis.mechanism === 'Indirect' ? 'bg-purple-200 text-purple-900 border border-purple-300' :
                    'bg-amber-200 text-amber-900 border border-amber-300'
                  }`}>
                    Cơ chế: {analysis.diliAnalysis.mechanism}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowDILIModal(true)}
                    className="px-2.5 py-1 bg-white hover:bg-rose-100 text-rose-800 rounded-lg text-xs font-bold transition-all border border-rose-300 shadow-2xs flex items-center space-x-1"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Tra Cứu 10 Kiểu Hình</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-rose-200 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Kiểu hình lâm sàng (Phenotype):</span>
                  <span className="font-extrabold text-rose-950 text-sm block">
                    {analysis.diliAnalysis.phenotypeVi}
                  </span>
                  <span className="text-[11px] text-slate-500 italic block">
                    ({analysis.diliAnalysis.phenotype})
                  </span>
                  {analysis.diliAnalysis.implicatedAgent && (
                    <div className="pt-1 text-[11px] text-slate-700">
                      Thuốc / Tác nhân nghi ngờ: <strong className="text-rose-900">{analysis.diliAnalysis.implicatedAgent}</strong>
                    </div>
                  )}
                  {analysis.diliAnalysis.latencyDays !== undefined && (
                    <div className="text-[11px] text-slate-700">
                      Thời gian ủ bệnh: <strong>{analysis.diliAnalysis.latencyDays} ngày</strong>
                    </div>
                  )}
                  {analysis.diliAnalysis.latencyAssessment && (
                    <div className="text-[10px] text-slate-500 leading-tight">
                      {analysis.diliAnalysis.latencyAssessment}
                    </div>
                  )}
                  {analysis.diliAnalysis.geneticHlaNote && (
                    <div className="text-[10px] text-purple-700 font-medium">
                      🧬 {analysis.diliAnalysis.geneticHlaNote}
                    </div>
                  )}
                </div>

                <div className="p-3 bg-white rounded-xl border border-rose-200 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Khuyến cáo hành động theo NEJM:</span>
                  <ul className="space-y-1 text-[11px] text-slate-700">
                    {analysis.diliAnalysis.recommendedActions.map((act, i) => (
                      <li key={i} className="flex items-start space-x-1.5">
                        <span className="text-rose-600 font-bold shrink-0">•</span>
                        <span className="leading-relaxed">{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Pre-analytical & Interfering Factor Warning Banner (Altaihani 2024) */}
          {analysis.preAnalyticalAlerts.length > 0 && (

            <div className="p-4 bg-amber-50 border-2 border-amber-400 rounded-2xl space-y-2 shadow-xs">
              <div className="flex items-center space-x-2 text-amber-900 font-extrabold text-sm">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
                <span className="uppercase tracking-wide">Cảnh Báo Tiền Phân Tích & Bẫy Nhiễu Mẫu Thử (Altaihani et al. 2024)</span>
              </div>
              <ul className="space-y-1.5 text-xs text-amber-900/90 pl-1">
                {analysis.preAnalyticalAlerts.map((alert, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-amber-600 font-bold shrink-0">•</span>
                    <span className="leading-relaxed font-medium">{alert}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-1.5 flex items-center justify-between text-[11px] text-amber-800 border-t border-amber-200/60">
                <span>Tuân thủ quy tắc bảo quản mẫu: Nhiệt độ phòng tối đa 8h, bảo quản 2-8°C tối đa 48h, trữ đông -20°C rã đông 1 lần.</span>
                <button
                  type="button"
                  onClick={() => setShowQCModal(true)}
                  className="font-bold underline hover:text-amber-950 whitespace-nowrap ml-2"
                >
                  Xem chuẩn QC Westgard
                </button>
              </div>
            </div>
          )}

          {/* Secondary Biomarker & Tumor / Autoimmune Alerts (Altaihani 2024) */}
          {(analysis.secondaryBiomarkerAlerts.length > 0 || analysis.autoimmuneAlerts.length > 0) && (
            <div className="p-4 bg-purple-50 border-2 border-purple-300 rounded-2xl space-y-2 shadow-xs">
              <div className="flex items-center space-x-2 text-purple-900 font-extrabold text-sm">
                <Dna className="w-5 h-5 text-purple-700 shrink-0" />
                <span className="uppercase tracking-wide">Dấu Ấn Khối U & Miễn Dịch Chuyên Khoa (Altaihani et al. 2024)</span>
              </div>
              <ul className="space-y-1.5 text-xs text-purple-900/90 pl-1">
                {analysis.secondaryBiomarkerAlerts.map((alert, idx) => (
                  <li key={`sec-${idx}`} className="flex items-start space-x-2">
                    <span className="text-purple-600 font-bold shrink-0">•</span>
                    <span className="leading-relaxed font-medium">{alert}</span>
                  </li>
                ))}
                {analysis.autoimmuneAlerts.map((alert, idx) => (
                  <li key={`auto-${idx}`} className="flex items-start space-x-2">
                    <span className="text-purple-600 font-bold shrink-0">•</span>
                    <span className="leading-relaxed font-medium">{alert}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Dedicated Sub-Navigation for the 3 Core Output Sections */}
          <div className="bg-white rounded-2xl p-2 sm:p-2.5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveResultsFilter('all')}
                className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                  activeResultsFilter === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Tất Cả Kết Quả
              </button>

              <button
                type="button"
                onClick={() => setActiveResultsFilter('analysis')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                  activeResultsFilter === 'analysis'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>1. Kết Quả Phân Tích</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveResultsFilter('differentials')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                  activeResultsFilter === 'differentials'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>2. Chẩn Đoán Phân Biệt</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ml-0.5 ${
                  activeResultsFilter === 'differentials' ? 'bg-teal-700 text-teal-100' : 'bg-slate-200 text-slate-700'
                }`}>
                  {analysis.differentialDiagnoses.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveResultsFilter('recommendations')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                  activeResultsFilter === 'recommendations'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>3. Khuyến Cáo Xử Trí</span>
              </button>
            </div>

            {/* Quick Actions (Report / Settings) */}
            <div className="flex items-center space-x-1 shrink-0 ml-auto">
              <button
                type="button"
                onClick={() => setShowDeRitisModal(true)}
                className="px-2.5 py-1.5 rounded-xl text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 border border-teal-200/80 text-[11px] font-bold flex items-center space-x-1 transition-colors"
                title="Xem bảng ma trận De Ritis Sikaris 2013"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Bảng De Ritis</span>
              </button>

              <button
                type="button"
                onClick={onOpenReportModal}
                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center shadow-2xs"
                title="Xem phiếu hội chẩn trước khi in"
                aria-label="Xem phiếu hội chẩn"
              >
                <Printer className="w-4 h-4" />
              </button>

              {onOpenSettings && (
                <button
                  type="button"
                  onClick={onOpenSettings}
                  className="p-2 rounded-xl text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 border border-teal-200/80 transition-colors flex items-center justify-center shadow-2xs"
                  title="Cài đặt hệ thống, định dạng PDF & in ấn"
                  aria-label="Cài đặt hệ thống"
                >
                  <Settings className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* 1. Core Decision Summary Card: Kết Quả Phân Tích */}
          {(activeResultsFilter === 'all' || activeResultsFilter === 'analysis') && (
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    Phần 1: Kết Quả Phân Tích & Phân Tầng Kiểu Tổn Thương
                  </span>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mt-1">
                    {analysis.primaryImpression}
                  </h3>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${
                    analysis.pattern === 'Hepatocellular'
                      ? 'bg-rose-50 text-rose-800 border-rose-200'
                      : analysis.pattern === 'Cholestatic'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : analysis.pattern === 'Mixed'
                      ? 'bg-purple-50 text-purple-800 border-purple-200'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  }`}>
                    {analysis.pattern === 'Hepatocellular' ? 'Hoại tử tế bào gan' :
                     analysis.pattern === 'Cholestatic' ? 'Tắc mật / Ứ mật' :
                     analysis.pattern === 'Mixed' ? 'Tổn thương hỗn hợp' :
                     analysis.pattern === 'Isolated Hyperbilirubinemia' ? 'Tăng Bilirubin đơn độc' : 'Sinh hóa bình thường'}
                  </span>
                </div>
              </div>

              {/* Metric Badges Ribbon */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* R-ratio */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-teal-300 transition-colors">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Chỉ số R (R-ratio)</span>
                  <div className="flex items-baseline space-x-1.5 mt-0.5">
                    <span className="text-xl font-black text-slate-900">{analysis.rRatio}</span>
                    <span className="text-[10px] font-extrabold text-teal-700">
                      {analysis.rRatio > 5 ? '> 5 (Tế bào gan)' : analysis.rRatio < 2 ? '< 2 (Ứ mật)' : '2 - 5 (Hỗn hợp)'}
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-400 block mt-1">(ALT/ULN) / (ALP/ULN)</span>
                </div>

                {/* De Ritis */}
                <div 
                  onClick={() => setShowDeRitisModal(true)}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-teal-400 hover:bg-teal-50/30 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Tỷ số De Ritis</span>
                    <span className="text-[9px] font-bold text-teal-600 group-hover:underline">Bảng Table 2 ↗</span>
                  </div>
                  <div className="flex items-baseline space-x-1.5 mt-0.5">
                    <span className={`text-xl font-black ${
                      analysis.deRitisDetail.riskSeverity === 'critical' ? 'text-rose-600' :
                      analysis.deRitisDetail.riskSeverity === 'high' ? 'text-amber-600' :
                      analysis.deRitisDetail.riskSeverity === 'moderate' ? 'text-blue-600' : 'text-slate-900'
                    }`}>
                      {analysis.deRitisRatio}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      analysis.deRitisDetail.riskSeverity === 'critical' ? 'bg-rose-100 text-rose-800' :
                      analysis.deRitisDetail.riskSeverity === 'high' ? 'bg-amber-100 text-amber-800' :
                      analysis.deRitisDetail.riskSeverity === 'moderate' ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-800'
                    }`}>
                      {analysis.deRitisDetail.category}
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-500 block mt-1 truncate">
                    {analysis.deRitisDetail.clinicalMeaning}
                  </span>
                </div>

                {/* Severity */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-teal-300 transition-colors">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Mức độ tăng men</span>
                  <span className="text-xs font-black text-rose-700 block mt-1 line-clamp-1">
                    {analysis.severity}
                  </span>
                  <span className="text-[9px] text-slate-400 block mt-1">
                    ALT: {analysis.altMultiples}x ULN
                  </span>
                </div>

                {/* FIB-4 or Bilirubin Fraction */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-teal-300 transition-colors">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                    {analysis.fib4Score ? 'Chỉ số FIB-4' : 'Bilirubin liên hợp'}
                  </span>
                  <div className="flex items-baseline space-x-1.5 mt-0.5">
                    <span className="text-xl font-black text-slate-900">
                      {analysis.fib4Score ? analysis.fib4Score : `${analysis.conjugatedPercent}%`}
                    </span>
                    <span className="text-[10px] font-bold text-slate-700">
                      {analysis.fib4Score ? (analysis.fib4Score < 1.3 ? 'F0-F1' : analysis.fib4Score > 2.67 ? 'F3-F4' : 'Vùng xám') : (analysis.isConjugatedPredominant ? 'Trực tiếp >50%' : 'Gián tiếp')}
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-400 block mt-1 line-clamp-1">
                    {analysis.fib4Stage || 'Tỷ lệ liên hợp/toàn phần'}
                  </span>
                </div>
              </div>

              {/* Dedicated De Ritis In-Depth Analysis Card (Sikaris 2013 Table 2) */}
              <div className="p-4 bg-teal-50/60 rounded-xl border border-teal-200/80 space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-teal-100 pb-2">
                  <div className="flex items-center space-x-2">
                    <FlaskConical className="w-4 h-4 text-teal-700 shrink-0" />
                    <span className="text-xs font-extrabold text-teal-950 uppercase tracking-wide">
                      Đánh Giá Động Học De Ritis (AST/ALT = {analysis.deRitisRatio}) Theo Ken Sikaris (2013)
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-teal-800 bg-teal-100/80 px-2 py-0.5 rounded-full border border-teal-200">
                    Mức: {analysis.deRitisDetail.decisionLimitText}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 font-semibold text-[11px] block">Ý nghĩa lâm sàng:</span>
                    <p className="font-bold text-slate-900 mt-0.5">{analysis.deRitisDetail.clinicalMeaning}</p>
                    <p className="text-slate-700 mt-1 text-[11px] leading-relaxed">
                      {analysis.deRitisDetail.pathophysiologicalMechanism}
                    </p>
                  </div>

                  <div className="space-y-1.5 bg-white/80 p-2.5 rounded-lg border border-teal-100">
                    <div className="text-[11px]">
                      <span className="font-bold text-teal-900">Sinh học phân tử: </span>
                      <span className="text-slate-700">AST có 80% trong ty thể (mAST) và 20% trong bào tương; ALT chủ yếu trong bào tương.</span>
                    </div>
                    <div className="text-[11px]">
                      <span className="font-bold text-teal-900">Thời gian bán hủy t½: </span>
                      <span className="text-slate-700">AST t½ ~18h (thanh thải qua xoang gan nhanh gấp đôi) vs ALT t½ ~36-47h.</span>
                    </div>
                    {analysis.deRitisDetail.vitaminB6Note && (
                      <p className="text-amber-900 bg-amber-50 p-1.5 rounded border border-amber-200 text-[10px]">
                        <strong>⚠️ {analysis.deRitisDetail.vitaminB6Note}</strong>
                      </p>
                    )}
                  </div>
                </div>

                {analysis.deRitisDetail.prognosticAlert && (
                  <div className="p-2.5 bg-rose-50 border border-rose-300 rounded-lg text-xs text-rose-900 font-bold flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{analysis.deRitisDetail.prognosticAlert}</span>
                  </div>
                )}
              </div>

              {/* Key Clinical Findings List */}
              <div className="p-3.5 bg-slate-50/90 rounded-xl border border-slate-100 space-y-1.5">
                <span className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                  <Info className="w-3.5 h-3.5 text-teal-600" />
                  <span>Tổng hợp diễn giải sinh lý bệnh (Pathophysiology Synthesis):</span>
                </span>
                <ul className="space-y-1 text-xs text-slate-700">
                  {analysis.keyFindings.map((f, i) => (
                    <li key={i} className="flex items-start space-x-1.5">
                      <span className="text-teal-600 font-bold">•</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* 2. Differential Diagnoses Card: Chẩn Đoán Phân Biệt */}
          {(activeResultsFilter === 'all' || activeResultsFilter === 'differentials') && (
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    Phần 2: Suy Luận Lâm Sàng & Phân Tầng Nguy Cơ
                  </span>
                  <h4 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center space-x-2 mt-1">
                    <TrendingUp className="w-4 h-4 text-teal-600" />
                    <span>Chẩn Đoán Phân Biệt Xếp Theo Xác Suất Lâm Sàng</span>
                  </h4>
                </div>
                <span className="text-xs font-semibold text-slate-500">
                  {analysis.differentialDiagnoses.length} bệnh cảnh phù hợp
                </span>
              </div>

              {analysis.differentialDiagnoses.length === 0 ? (
                <p className="text-xs text-slate-500 italic p-4 text-center bg-slate-50 rounded-xl border border-slate-200">
                  Các chỉ số sinh hóa gan hiện nằm trong khoảng bình thường hoặc biến thiên tối thiểu. Không ghi nhận bằng chứng tổn thương gan cấp/mạn tính.
                </p>
              ) : (
                <div className="space-y-3">
                  {analysis.differentialDiagnoses.map((d, index) => (
                    <div 
                      key={index}
                      className="p-4 rounded-xl border transition-all hover:shadow-xs bg-slate-50/60 border-slate-200/90"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2">
                        <h5 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center space-x-2">
                          <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-extrabold shrink-0">
                            {index + 1}
                          </span>
                          <span>{d.disease}</span>
                        </h5>
                        <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border self-start sm:self-auto ${
                          d.likelihood === 'Rất cao' 
                            ? 'bg-rose-100 text-rose-800 border-rose-200'
                            : d.likelihood === 'Cao'
                            ? 'bg-amber-100 text-amber-800 border-amber-200'
                            : 'bg-blue-50 text-blue-800 border-blue-200'
                        }`}>
                          Xác suất: {d.likelihood}
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <p className="text-slate-700">
                          <strong className="text-slate-900 font-semibold">Bằng chứng & Cơ chế bệnh sinh: </strong>
                          {d.clues}
                        </p>
                        <p className="text-teal-900 bg-teal-50/70 p-2 rounded-lg border border-teal-100/80">
                          <strong className="text-teal-950 font-bold">Chỉ định xác chẩn tiếp theo: </strong>
                          {d.recommendedNextStep}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. Actionable Step-by-Step Clinical Orders: Khuyến Cáo Xử Trí */}
          {(activeResultsFilter === 'all' || activeResultsFilter === 'recommendations') && (
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Phần 3: Lộ Trình Can Thiệp Lâm Sàng
                  </span>
                  <h4 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center space-x-2 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Khuyến Cáo Kế Hoạch Xử Trí & Bilan Cận Lâm Sàng</span>
                  </h4>
                </div>
                <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                  ACG 2017 & WHO Manual
                </span>
              </div>

              <div className="space-y-2.5">
                {analysis.stepByStepRecommendations.map((rec, index) => (
                  <div key={index} className="flex items-start space-x-3 text-xs text-slate-800 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold flex items-center justify-center shrink-0 text-[11px] mt-0.5">
                      {index + 1}
                    </span>
                    <span className="leading-relaxed font-medium">{rec}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500">
                <span>Tuân thủ phác đồ hướng dẫn ACG Guidelines 2017 & WHO Training Workshop Session 4</span>
                <button 
                  type="button"
                  onClick={onOpenReportModal}
                  className="text-teal-700 hover:text-teal-900 font-bold flex items-center space-x-1"
                >
                  <span>Xem bản in bệnh án đầy đủ</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Sticky Mobile Quick Navigation Bars (< lg) */}
      {mobileTab === 'inputs' && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 p-3 shadow-2xl flex items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5 min-w-0">
            <span className={`w-3 h-3 rounded-full shrink-0 ${
              analysis.pattern === 'Hepatocellular' ? 'bg-rose-500' :
              analysis.pattern === 'Cholestatic' ? 'bg-amber-500' :
              analysis.pattern === 'Mixed' ? 'bg-purple-500' : 'bg-emerald-500'
            }`} />
            <div className="min-w-0">
              <span className="text-xs font-mono font-bold text-slate-200 block truncate">
                R={analysis.rRatio.toFixed(1)} • {
                  analysis.pattern === 'Hepatocellular' ? 'Tế bào gan' :
                  analysis.pattern === 'Cholestatic' ? 'Ứ mật' :
                  analysis.pattern === 'Mixed' ? 'Hỗn hợp' : 'Bình thường'
                }
              </span>
              <span className="text-[10px] text-teal-300 font-medium block truncate">
                {analysis.primaryImpression}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setMobileTab('results');
              window.scrollTo({ top: 80, behavior: 'smooth' });
            }}
            className="px-3.5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold shrink-0 flex items-center space-x-1.5 shadow-md min-h-[44px]"
          >
            <span>Xem Kết Quả</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {mobileTab === 'results' && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 p-3 shadow-2xl flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              setMobileTab('inputs');
              window.scrollTo({ top: 80, behavior: 'smooth' });
            }}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 rounded-xl text-xs font-bold flex items-center space-x-1.5 min-h-[44px]"
          >
            <RotateCcw className="w-3.5 h-3.5 text-teal-400" />
            <span>← Sửa Số Liệu</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onOpenReportModal}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 flex items-center justify-center min-h-[44px] min-w-[44px]"
              title="Xem & in phiếu hội chẩn"
              aria-label="Xem phiếu hội chẩn"
            >
              <Printer className="w-4 h-4" />
            </button>

            {onOpenSettings && (
              <button
                type="button"
                onClick={onOpenSettings}
                className="p-2.5 bg-teal-700 hover:bg-teal-600 text-white rounded-xl flex items-center justify-center min-h-[44px] min-w-[44px]"
                title="Cài đặt hệ thống & xuất PDF"
                aria-label="Cài đặt hệ thống"
              >
                <Settings className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Modal 1: De Ritis Table 2 Matrix Interactive Explorer (Sikaris 2013) */}
      {showDeRitisModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between sticky top-0 z-10 border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300">
                  <FlaskConical className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold tracking-tight">
                    Ma Trận Quyết Định Lâm Sàng Tỷ Số De Ritis (Table 2 - Sikaris 2013)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Botros M & Sikaris KA. <em>Clin Biochem Rev</em> 2013; 34:117-130
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDeRitisModal(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 space-y-5 text-xs sm:text-sm">
              {/* Current Patient Banner */}
              <div className="p-3.5 bg-teal-50 rounded-xl border border-teal-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wide block">Bệnh nhân hiện tại</span>
                  <div className="flex items-baseline space-x-2 mt-0.5">
                    <span className="text-lg font-black text-teal-950">AST/ALT = {analysis.deRitisRatio}</span>
                    <span className="text-xs text-teal-800 font-semibold">(AST {currentLabs.ast} U/L, ALT {currentLabs.alt} U/L)</span>
                  </div>
                </div>
                <div className="sm:text-right">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-teal-600 text-white inline-block">
                    Phân nhóm: {analysis.deRitisDetail.category} ({analysis.deRitisDetail.clinicalMeaning})
                  </span>
                </div>
              </div>

              {/* Table 2 Matrix Reproduction */}
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <div className="bg-slate-100 p-2.5 font-bold text-slate-800 text-xs flex justify-between items-center">
                  <span>BẢNG 2: GIỚI HẠN QUYẾT ĐỊNH LÂM SÀNG CỦA TỶ SỐ DE RITIS</span>
                  <span className="text-[10px] text-slate-500">Clinical decision limits applied to De Ritis ratio</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-800 text-white text-center font-bold">
                        <th className="p-2.5 text-left border-r border-slate-700">Tình trạng lâm sàng</th>
                        <th className="p-2.5 border-r border-slate-700 w-1/4">&lt; 1.0</th>
                        <th className="p-2.5 border-r border-slate-700 w-1/4">1.0 đến &lt; 1.5</th>
                        <th className="p-2.5 border-r border-slate-700 w-1/5">1.5 đến &lt; 2.0</th>
                        <th className="p-2.5 w-1/5">≥ 2.0</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-center">
                      <tr className={analysis.deRitisDetail.category === 'Healthy' ? 'bg-teal-50/80 font-bold' : ''}>
                        <td className="p-2.5 text-left font-semibold text-slate-900 border-r border-slate-200">
                          Người khỏe mạnh (Healthy)
                        </td>
                        <td colSpan={2} className="p-2.5 bg-slate-50/50 border-r border-slate-200">
                          <div className="space-y-0.5">
                            <div>Nam: bình thường lên tới <strong>1.3</strong></div>
                            <div>Nữ: bình thường lên tới <strong>1.7</strong></div>
                          </div>
                        </td>
                        <td className="p-2.5 border-r border-slate-200 text-slate-700">Trẻ em</td>
                        <td className="p-2.5 text-slate-700">Trẻ sơ sinh (&gt;3.0 lúc sinh, &lt;2.0 sau ngày 5)</td>
                      </tr>

                      <tr className={analysis.deRitisDetail.category === 'Acute Viral' ? 'bg-teal-50/80 font-bold' : ''}>
                        <td className="p-2.5 text-left font-semibold text-slate-900 border-r border-slate-200">
                          Viêm gan virus cấp (Acute Viral Hepatitis)
                        </td>
                        <td className="p-2.5 bg-emerald-50 text-emerald-800 border-r border-slate-200">
                          Đang thoái lui / Hồi phục (Resolving, 0.5 - 0.7)
                        </td>
                        <td colSpan={2} className="p-2.5 bg-amber-50 text-amber-900 border-r border-slate-200">
                          Đang nặng lên (Worsening) • <em>Nếu ALT 200-500: nguy cơ &gt;1000 U/L tăng 40x</em>
                        </td>
                        <td className="p-2.5 bg-rose-50 text-rose-900 font-extrabold">
                          Bùng phát / Tối cấp (Fulminant, tử vong cao)
                        </td>
                      </tr>

                      <tr className={analysis.deRitisDetail.category === 'Alcoholic' ? 'bg-teal-50/80 font-bold' : ''}>
                        <td className="p-2.5 text-left font-semibold text-slate-900 border-r border-slate-200">
                          Viêm gan do rượu (Alcoholic Hepatitis)
                        </td>
                        <td className="p-2.5 text-slate-600 border-r border-slate-200">
                          Đang thoái lui (Resolving)
                        </td>
                        <td className="p-2.5 text-slate-500 border-r border-slate-200">--</td>
                        <td className="p-2.5 bg-amber-50 text-amber-800 border-r border-slate-200">
                          Lạm dụng rượu gần đây (Alcohol abuse)
                        </td>
                        <td className="p-2.5 bg-rose-50 text-rose-800 font-extrabold">
                          Viêm gan rượu cấp tính (Acute Hepatitis &gt;2:1)
                        </td>
                      </tr>

                      <tr className={analysis.deRitisDetail.category === 'Chronic Liver' ? 'bg-teal-50/80 font-bold' : ''}>
                        <td className="p-2.5 text-left font-semibold text-slate-900 border-r border-slate-200">
                          Bệnh gan mạn tính (Chronic Liver Disease)
                        </td>
                        <td className="p-2.5 bg-emerald-50 text-emerald-800 border-r border-slate-200">
                          Ổn định (Stable)
                        </td>
                        <td colSpan={2} className="p-2.5 bg-blue-50 text-blue-900 border-r border-slate-200">
                          Nguy cơ xơ hóa gan (Fibrosis risk F2-F3, &gt;1.09)
                        </td>
                        <td className="p-2.5 bg-slate-100 text-slate-700">
                          Xơ gan F4 / Giảm sống còn / Nguyên nhân khác
                        </td>
                      </tr>

                      <tr className={analysis.deRitisDetail.category === 'Muscle Disease' ? 'bg-teal-50/80 font-bold' : ''}>
                        <td className="p-2.5 text-left font-semibold text-slate-900 border-r border-slate-200">
                          Bệnh lý cơ vân (Muscle Disease)
                        </td>
                        <td className="p-2.5 text-slate-700 border-r border-slate-200">
                          Bệnh cơ mạn (Chronic)
                        </td>
                        <td className="p-2.5 text-slate-700 border-r border-slate-200">
                          Đang hồi phục (Resolving)
                        </td>
                        <td colSpan={2} className="p-2.5 bg-amber-50 text-amber-900 font-bold">
                          Chấn thương cơ cấp / Tiêu cơ vân (Acute Rhabdomyolysis)
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* In-depth Pharmacokinetics Explanations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <h5 className="font-bold text-slate-900 flex items-center space-x-1.5">
                    <Clock className="w-4 h-4 text-teal-600" />
                    <span>Động học thanh thải xoang gan & Thời gian bán hủy:</span>
                  </h5>
                  <ul className="space-y-1.5 text-slate-700 leading-relaxed">
                    <li>• <strong>AST t½ = 18 giờ</strong>: Bị đại thực bào và tế bào nội mô xoang mạch gan bắt giữ tiêu hủy nhanh gấp đôi ALT.</li>
                    <li>• <strong>ALT t½ = 36 - 47 giờ</strong>: Thanh thải chậm, tồn lưu lâu trong máu.</li>
                    <li>• Do đó, sau một tổn thương gan cấp (hoặc chấn thương cơ) ngừng lại, AST hạ nhanh hơn nhiều so với ALT, khiến tỷ số AST/ALT tụt dần về dưới 1.0.</li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <h5 className="font-bold text-slate-900 flex items-center space-x-1.5">
                    <Award className="w-4 h-4 text-amber-600" />
                    <span>Đặc thù Rượu & Thiếu Hụt Vitamin B6:</span>
                  </h5>
                  <ul className="space-y-1.5 text-slate-700 leading-relaxed">
                    <li>• Cồn tấn công trực tiếp màng ty thể, giải phóng isoenzyme <strong>mAST (chiếm 80% AST tế bào gan)</strong>.</li>
                    <li>• Người nghiện rượu suy dinh dưỡng thiếu hụt <strong>Pyridoxal-5'-phosphate (B6)</strong>, cofactor cần thiết cho cả 2 men. Thiếu B6 làm giảm nồng độ enzyme ALT đo được mạnh hơn AST, tạo nên tỷ số ảo &gt; 2:1.</li>
                    <li>• Uống rượu trong vòng 24h có AST/ALT cao nhất vì AST chưa kịp bị xoang gan đào thải.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setShowDeRitisModal(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                Đóng Cửa Sổ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Quality Control & Specimen Handling (Altaihani 2024) */}
      {showQCModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
            {/* Header */}
            <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between sticky top-0 z-10 border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold tracking-tight">
                    Quản Lý Chất Lượng Xét Nghiệm & Kiểm Soát Tiền Phân Tích
                  </h3>
                  <p className="text-xs text-slate-400">
                    Theo bài báo tổng quan y học bệnh học lâm sàng (Altaihani et al. 2024)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowQCModal(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 sm:p-6 space-y-4 text-xs sm:text-sm">
              {/* Storage Protocols */}
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
                <h4 className="font-extrabold text-amber-950 text-xs sm:text-sm uppercase tracking-wide flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>1. Quy chuẩn thời gian & Nhiệt độ bảo quản huyết thanh:</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                  <div className="p-3 bg-white rounded-lg border border-amber-200">
                    <span className="font-bold text-slate-900 block">+15°C đến +30°C</span>
                    <span className="text-slate-600 text-[11px] block mt-1">Nhiệt độ phòng</span>
                    <span className="text-rose-700 font-extrabold text-xs block mt-1">Tối đa 8 giờ!</span>
                    <span className="text-[10px] text-slate-400">Sau 8h bắt đầu thoái biến men.</span>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-amber-200">
                    <span className="font-bold text-slate-900 block">+2°C đến +8°C</span>
                    <span className="text-slate-600 text-[11px] block mt-1">Tủ mát chuyên dụng</span>
                    <span className="text-teal-700 font-extrabold text-xs block mt-1">Tối đa 48 giờ</span>
                    <span className="text-[10px] text-slate-400">Nếu xét nghiệm chưa chạy ngay.</span>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-amber-200">
                    <span className="font-bold text-slate-900 block">-15°C đến -20°C</span>
                    <span className="text-slate-600 text-[11px] block mt-1">Đông lạnh sâu</span>
                    <span className="text-blue-700 font-extrabold text-xs block mt-1">Chỉ rã đông 1 lần!</span>
                    <span className="text-[10px] text-slate-400">Đông tan nhiều lần phá hủy enzym.</span>
                  </div>
                </div>
              </div>

              {/* Westgard & IQCP */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm uppercase tracking-wide flex items-center space-x-2">
                  <Award className="w-4 h-4 text-teal-600" />
                  <span>2. Nội kiểm (QC) & Quy tắc Westgard:</span>
                </h4>
                <ul className="space-y-1.5 text-slate-700 leading-relaxed pl-1">
                  <li>• Bắt buộc chạy tối thiểu <strong>2 mức nồng độ control trong mỗi 24 giờ</strong> đối với xét nghiệm non-waived.</li>
                  <li>• Vi phạm quy tắc 1:3s hoặc R:4s: Cảnh báo sai số ngẫu nhiên lớn, hủy bỏ kết quả chạy mẻ đó ngay.</li>
                  <li>• Vi phạm quy tắc 2:2s, 4:1s hoặc 10:x: Sai số hệ thống do thuốc thử, calibration hoặc suy thoái bóng đèn đo quang.</li>
                  <li>• Kế hoạch IQCP (Individualized Quality Control Plan) đánh giá toàn diện sai số cả 3 thì: Trước - Trong - Sau phân tích.</li>
                </ul>
              </div>

              {/* Optical Interferences (Beer-Lambert Law) */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm uppercase tracking-wide flex items-center space-x-2">
                  <FlaskConical className="w-4 h-4 text-purple-600" />
                  <span>3. Cơ chế nhiễu quang phổ (Định luật Beer-Lambert):</span>
                </h4>
                <div className="space-y-1.5 text-slate-700">
                  <p>• <strong>Hemolysis (Tán huyết)</strong>: Hấp thụ cực đại ở 415 nm (320 - 580 nm) làm sai lệch Albumin, Lipase, GGT.</p>
                  <p>• <strong>Lipemia (Mỡ máu đục)</strong>: Tán xạ ánh sáng nặng ở 340 nm (bước sóng tiêu thụ NADH dùng định lượng ALT và AST).</p>
                  <p>• <strong>Metronidazole</strong>: Hấp thụ ánh sáng gần 340 nm làm giảm giả ALT.</p>
                  <p>• <strong>Nhịp sinh học ALT</strong>: Dao động tới 45% trong ngày, đạt đỉnh vào buổi chiều; cần chuẩn hóa mẫu lấy buổi sáng lúc đói.</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setShowQCModal(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                Đã Hiểu & Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: NEJM 2019 DILI Phenotypes & Drug Database Engine */}
      {showDILIModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between sticky top-0 z-10 border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-rose-500/20 text-rose-300">
                  <Pill className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold tracking-tight">
                    Cơ Sở Dữ Liệu &amp; 10 Kiểu Hình Tổn Thương Gan Do Thuốc (DILI)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Theo nghiên cứu kinh điển NEJM (Hoofnagle JH, Björnsson ES. N Engl J Med 2019; 381:264-73)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDILIModal(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="px-4 sm:px-6 pt-3 bg-slate-100 border-b border-slate-200 flex space-x-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => setDiliModalTab('phenotypes')}
                className={`pb-2.5 px-3 border-b-2 transition-all ${
                  diliModalTab === 'phenotypes'
                    ? 'border-rose-600 text-rose-900 font-black'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                10 Kiểu Hình Lâm Sàng (Table 2)
              </button>
              <button
                type="button"
                onClick={() => setDiliModalTab('drugs')}
                className={`pb-2.5 px-3 border-b-2 transition-all ${
                  diliModalTab === 'drugs'
                    ? 'border-rose-600 text-rose-900 font-black'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Top Thuốc &amp; Thảo Dược (Table 3)
              </button>
              <button
                type="button"
                onClick={() => setDiliModalTab('timeline')}
                className={`pb-2.5 px-3 border-b-2 transition-all ${
                  diliModalTab === 'timeline'
                    ? 'border-rose-600 text-rose-900 font-black'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Động Học Thời Gian (Figure 1)
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm flex-1">
              {/* TAB 1: 10 PHENOTYPES */}
              {diliModalTab === 'phenotypes' && (
                <div className="space-y-3">
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 flex items-start space-x-2">
                    <Info className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>
                      NEJM phân loại DILI thành 10 kiểu hình chính dựa trên 3 cơ chế: <strong>Direct</strong> (Độc tính trực tiếp phụ thuộc liều), <strong>Idiosyncratic</strong> (Đặc ứng cơ địa không phụ thuộc liều), và <strong>Indirect</strong> (Độc tính gián tiếp qua trung gian miễn dịch/bùng phát bệnh nền).
                    </span>
                  </div>

                  <div className="space-y-3">
                    {DILI_PHENOTYPES.map((p) => {
                      const isCurrent = analysis.diliAnalysis?.phenotype === p.nameEn;
                      return (
                        <div
                          key={p.id}
                          className={`p-4 rounded-xl border transition-all ${
                            isCurrent
                              ? 'bg-rose-50/80 border-rose-400 shadow-sm ring-2 ring-rose-300'
                              : 'bg-white border-slate-200 hover:border-rose-200'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-slate-100 pb-2">
                            <div>
                              <div className="flex items-center space-x-2">
                                <h4 className="font-extrabold text-slate-900 text-sm">
                                  {p.nameVi}
                                </h4>
                                {isCurrent && (
                                  <span className="px-2 py-0.5 bg-rose-600 text-white rounded text-[10px] font-bold animate-pulse">
                                    Khớp ca hiện tại
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-slate-500 font-mono italic">
                                {p.nameEn}
                              </span>
                            </div>

                            <span className={`px-2 py-0.5 text-[10px] font-black rounded uppercase self-start sm:self-auto ${
                              p.injuryType === 'Direct' ? 'bg-rose-100 text-rose-800' :
                              p.injuryType === 'Indirect' ? 'bg-purple-100 text-purple-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              Cơ chế: {p.injuryType}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2.5 text-xs">
                            <div>
                              <span className="text-[10px] font-bold text-slate-500 uppercase block">Thời gian ủ bệnh (Latency):</span>
                              <span className="text-slate-800 font-medium">{p.latency}</span>
                            </div>
                            <div>
                              <span className="text-[10px] font-bold text-slate-500 uppercase block">Mô hình biến đổi men gan:</span>
                              <span className="text-slate-800 font-medium">{p.enzymePattern}</span>
                            </div>
                            <div className="sm:col-span-2">
                              <span className="text-[10px] font-bold text-slate-500 uppercase block">Thuốc điển hình:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {p.typicalAgents.map((ag, i) => (
                                  <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded text-[11px] font-medium border border-slate-200">
                                    {ag}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="sm:col-span-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-1">
                              <div><strong>Lâm sàng: </strong>{p.clinicalFeatures}</div>
                              <div><strong>Tiên lượng: </strong>{p.prognosisAndMortality}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: DRUGS & HERBALS DATABASE */}
              {diliModalTab === 'drugs' && (
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={diliSearchQuery}
                        onChange={(e) => setDiliSearchQuery(e.target.value)}
                        placeholder="Tìm theo tên thuốc (Amoxicillin, Diclofenac, Pembrolizumab, Trà xanh...)"
                        className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium shrink-0">
                      Hiển thị {ALL_DILI_AGENTS.filter(a => a.name.toLowerCase().includes(diliSearchQuery.toLowerCase()) || a.nameVi.toLowerCase().includes(diliSearchQuery.toLowerCase())).length} thuốc/thảo dược
                    </span>
                  </div>

                  <div className="overflow-x-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-3">Hạng / Tên Thuốc</th>
                          <th className="py-2.5 px-3">Phân Nhóm</th>
                          <th className="py-2.5 px-3">Cơ Chế &amp; Kiểu Hình</th>
                          <th className="py-2.5 px-3">Ủ Bệnh (Latency)</th>
                          <th className="py-2.5 px-3">Ghi Chú Nguy Cơ &amp; Xử Trí</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {ALL_DILI_AGENTS
                          .filter(a => 
                            a.name.toLowerCase().includes(diliSearchQuery.toLowerCase()) || 
                            a.nameVi.toLowerCase().includes(diliSearchQuery.toLowerCase()) ||
                            a.category.toLowerCase().includes(diliSearchQuery.toLowerCase())
                          )
                          .map((drug, idx) => (
                            <tr key={idx} className="hover:bg-slate-50 transition-colors">
                              <td className="py-2.5 px-3">
                                <div className="font-extrabold text-slate-900 flex items-center space-x-1.5">
                                  {drug.rank && (
                                    <span className="px-1.5 py-0.2 bg-rose-100 text-rose-800 text-[10px] font-black rounded">
                                      #{drug.rank}
                                    </span>
                                  )}
                                  <span>{drug.name}</span>
                                </div>
                                <span className="text-[11px] text-slate-500 block">{drug.nameVi}</span>
                              </td>
                              <td className="py-2.5 px-3 text-slate-600 font-semibold">{drug.category}</td>
                              <td className="py-2.5 px-3">
                                <span className={`inline-block px-1.5 py-0.5 text-[9px] font-bold rounded uppercase mb-1 ${
                                  drug.mechanism === 'Direct' ? 'bg-rose-100 text-rose-800' :
                                  drug.mechanism === 'Indirect' ? 'bg-purple-100 text-purple-800' :
                                  'bg-amber-100 text-amber-800'
                                }`}>
                                  {drug.mechanism}
                                </span>
                                <span className="text-[11px] text-slate-800 block font-medium leading-tight">
                                  {drug.majorPhenotypes}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-slate-600 text-[11px]">{drug.typicalLatency}</td>
                              <td className="py-2.5 px-3 text-slate-700 text-[11px] max-w-xs space-y-1">
                                <p className="leading-tight">{drug.riskNotes}</p>
                                <p className="text-teal-800 font-semibold leading-tight">👉 {drug.actionGuidance}</p>
                                {drug.hlaAssociation && (
                                  <p className="text-[10px] text-purple-700 font-bold">🧬 {drug.hlaAssociation}</p>
                                )}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: DYNAMIC TIMELINE (FIGURE 1 NEJM) */}
              {diliModalTab === 'timeline' && (
                <div className="space-y-4">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700">
                    Mô phỏng 4 biểu đồ diễn tiến động học điển hình theo thời gian từ bài báo NEJM 2019 (Figure 1: Hoofnagle &amp; Björnsson):
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Panel A */}
                    <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-rose-900 text-xs">Panel A: Hoại Tử Gan Cấp Do Amiodarone IV</span>
                        <span className="px-2 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-bold rounded">Direct</span>
                      </div>
                      <p className="text-xs text-slate-600">
                        Nữ 48 tuổi tiêm Amiodarone liều nạp tĩnh mạch. Trong vòng 24 - 48h, ALT tăng vọt đỉnh &gt; 30x ULN trong khi ALP và Bilirubin tăng nhẹ. Khi ngừng thuốc, men gan giảm dốc đứng sau vài ngày.
                      </p>
                      <div className="h-20 bg-slate-50 rounded-lg p-2 flex items-end justify-between border border-slate-200 text-[9px] font-bold text-slate-500">
                        <div className="flex flex-col items-center"><div className="w-4 bg-slate-300 h-2 rounded-t"></div><span>Ngày 0</span></div>
                        <div className="flex flex-col items-center"><div className="w-4 bg-rose-600 h-16 rounded-t animate-pulse"></div><span className="text-rose-700">Đỉnh ALT (30x)</span></div>
                        <div className="flex flex-col items-center"><div className="w-4 bg-rose-400 h-8 rounded-t"></div><span>Ngày 3</span></div>
                        <div className="flex flex-col items-center"><div className="w-4 bg-rose-300 h-4 rounded-t"></div><span>Ngày 7</span></div>
                        <div className="flex flex-col items-center"><div className="w-4 bg-teal-500 h-2 rounded-t"></div><span>Hồi phục</span></div>
                      </div>
                    </div>

                    {/* Panel B */}
                    <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-rose-900 text-xs">Panel B: Viêm Gan Tế Bào Gan Cấp Do Diclofenac</span>
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded">Hy's Law</span>
                      </div>
                      <p className="text-xs text-slate-600">
                        Nữ 77 tuổi uống Diclofenac trị khớp. Sau 36 ngày, ALT tăng 30x ULN, vàng da đậm Bilirubin &gt; 6x ULN (thỏa Hy's Law). Hồi phục chậm chạp sau 12 - 24 tuần ngừng thuốc.
                      </p>
                      <div className="h-20 bg-slate-50 rounded-lg p-2 flex items-end justify-between border border-slate-200 text-[9px] font-bold text-slate-500">
                        <div className="flex flex-col items-center"><div className="w-4 bg-slate-300 h-2 rounded-t"></div><span>Tuần 0</span></div>
                        <div className="flex flex-col items-center"><div className="w-4 bg-rose-600 h-16 rounded-t"></div><span className="text-rose-700">Ngày 36 (ALT)</span></div>
                        <div className="flex flex-col items-center"><div className="w-4 bg-amber-500 h-12 rounded-t"></div><span className="text-amber-700">Bili đỉnh</span></div>
                        <div className="flex flex-col items-center"><div className="w-4 bg-slate-400 h-6 rounded-t"></div><span>Tuần 8</span></div>
                        <div className="flex flex-col items-center"><div className="w-4 bg-teal-500 h-2 rounded-t"></div><span>Tuần 24</span></div>
                      </div>
                    </div>

                    {/* Panel C */}
                    <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-amber-900 text-xs">Panel C: Viêm Gan Ứ Mật Do Cefazolin</span>
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded">Cholestatic</span>
                      </div>
                      <p className="text-xs text-slate-600">
                        Nam 68 tuổi tiêm duy nhất 1 liều Cefazolin mổ chỉnh hình. Sau 1 tuần xuất hiện ngứa da dữ dội, ALP tăng đỉnh &gt; 5x ULN trong khi ALT chỉ tăng nhẹ. Hồi phục hoàn toàn sau vài tuần.
                      </p>
                      <div className="h-20 bg-slate-50 rounded-lg p-2 flex items-end justify-between border border-slate-200 text-[9px] font-bold text-slate-500">
                        <div className="flex flex-col items-center"><div className="w-4 bg-slate-300 h-2 rounded-t"></div><span>1 liều IV</span></div>
                        <div className="flex flex-col items-center"><div className="w-4 bg-amber-500 h-14 rounded-t"></div><span className="text-amber-700">Tuần 1-2 (ALP)</span></div>
                        <div className="flex flex-col items-center"><div className="w-4 bg-amber-400 h-8 rounded-t"></div><span>Tuần 4</span></div>
                        <div className="flex flex-col items-center"><div className="w-4 bg-slate-300 h-4 rounded-t"></div><span>Tuần 8</span></div>
                        <div className="flex flex-col items-center"><div className="w-4 bg-teal-500 h-2 rounded-t"></div><span>Khỏi</span></div>
                      </div>
                    </div>

                    {/* Panel D */}
                    <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-purple-900 text-xs">Panel D: Ứ Mật Đơn Thuần Do Anabolic Steroid</span>
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-bold rounded">Bland Cholestasis</span>
                      </div>
                      <p className="text-xs text-slate-600">
                        Nam 39 tuổi tập thể hình dùng steroid uống 90 ngày. Bilirubin tăng vọt &gt; 20x ULN, ngứa dữ dội nhưng ALT và ALP chỉ tăng khiêm tốn. Vàng da kéo dài nhiều tháng rồi thoái lui.
                      </p>
                      <div className="h-20 bg-slate-50 rounded-lg p-2 flex items-end justify-between border border-slate-200 text-[9px] font-bold text-slate-500">
                        <div className="flex flex-col items-center"><div className="w-4 bg-slate-300 h-2 rounded-t"></div><span>Tháng 1-3</span></div>
                        <div className="flex flex-col items-center"><div className="w-4 bg-purple-600 h-16 rounded-t"></div><span className="text-purple-800">Bili &gt;20x</span></div>
                        <div className="flex flex-col items-center"><div className="w-4 bg-purple-400 h-12 rounded-t"></div><span>Tháng 4</span></div>
                        <div className="flex flex-col items-center"><div className="w-4 bg-purple-300 h-6 rounded-t"></div><span>Tháng 5</span></div>
                        <div className="flex flex-col items-center"><div className="w-4 bg-teal-500 h-2 rounded-t"></div><span>Tháng 6</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setShowDILIModal(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                Đóng Tra Cứu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


