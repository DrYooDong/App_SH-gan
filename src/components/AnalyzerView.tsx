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
  Layers
} from 'lucide-react';

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

            {/* Advanced Specialized Inputs Toggle */}
            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAdvancedInputs(!showAdvancedInputs)}
                className="text-xs text-teal-700 font-bold hover:text-teal-900 flex items-center space-x-1"
              >
                <span>{showAdvancedInputs ? 'Ẩn xét nghiệm chuyên khoa bổ trợ' : '+ Thêm xét nghiệm chuyên khoa (CK, Creatinine, Ferritin)'}</span>
              </button>

              {showAdvancedInputs && (
                <div className="grid grid-cols-3 gap-2.5 mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <label className="text-[10px] font-bold text-slate-700 block">Creatine Kinase (CK)</label>
                    <input
                      type="number"
                      value={currentLabs.ck ?? ''}
                      onChange={(e) => setCurrentLabs(p => ({ ...p, ck: Number(e.target.value) }))}
                      className="w-full px-2 py-1 text-xs bg-white border border-slate-300 rounded-lg mt-1"
                      placeholder="U/L"
                    />
                    <span className="text-[9px] text-slate-500">Bệnh cơ vân</span>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-700 block">Creatinine máu</label>
                    <input
                      type="number"
                      step="0.1"
                      value={currentLabs.creatinine ?? ''}
                      onChange={(e) => setCurrentLabs(p => ({ ...p, creatinine: Number(e.target.value) }))}
                      className="w-full px-2 py-1 text-xs bg-white border border-slate-300 rounded-lg mt-1"
                      placeholder="mg/dL"
                    />
                    <span className="text-[9px] text-slate-500">Tính MELD</span>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-700 block">Ferritin</label>
                    <input
                      type="number"
                      value={currentLabs.ferritin ?? ''}
                      onChange={(e) => setCurrentLabs(p => ({ ...p, ferritin: Number(e.target.value) }))}
                      className="w-full px-2 py-1 text-xs bg-white border border-slate-300 rounded-lg mt-1"
                      placeholder="ng/mL"
                    />
                    <span className="text-[9px] text-slate-500">Bệnh ứ sắt</span>
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
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-teal-300 transition-colors">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Tỷ số De Ritis (AST/ALT)</span>
                  <div className="flex items-baseline space-x-1.5 mt-0.5">
                    <span className={`text-xl font-black ${analysis.deRitisRatio >= 2 ? 'text-amber-700' : 'text-slate-900'}`}>
                      {analysis.deRitisRatio}
                    </span>
                    <span className="text-[10px] font-bold text-slate-700">
                      {analysis.deRitisRatio >= 2 ? 'Gợi ý Rượu / Xơ' : analysis.deRitisRatio < 1 ? 'Ưu thế ALT' : '~ 1.0'}
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-400 block mt-1">Ty thể vs Bào tương</span>
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
    </div>
  );
};
