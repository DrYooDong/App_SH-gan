import React, { useState, useRef } from 'react';
import { 
  Settings, 
  X, 
  Printer, 
  Download, 
  FileText, 
  Building2, 
  UserCheck, 
  Sliders, 
  RotateCcw, 
  ShieldCheck, 
  Upload, 
  Save, 
  CheckCircle2, 
  HelpCircle,
  AlertTriangle,
  FileSpreadsheet
} from 'lucide-react';
import { PatientLabs, CDSSAnalysis } from '../types/cdss';
import { AppSettings, DEFAULT_SETTINGS, HospitalHeaderConfig, UlnStandard } from '../types/settings';
import { generateConsultationPDF } from '../utils/pdfGenerator';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLabs: PatientLabs;
  analysis: CDSSAnalysis;
  onOpenReportModal: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onImportLabs?: (importedLabs: PatientLabs) => void;
}

type SettingsTab = 'export_print' | 'uln_standards' | 'units' | 'clinical' | 'backup_reset';

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentLabs,
  analysis,
  onOpenReportModal,
  settings,
  onUpdateSettings,
  onImportLabs
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('export_print');
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 2500);
  };

  const handleHeaderChange = <K extends keyof HospitalHeaderConfig>(field: K, value: HospitalHeaderConfig[K]) => {
    const updated: AppSettings = {
      ...settings,
      headerInfo: {
        ...settings.headerInfo,
        [field]: value
      }
    };
    onUpdateSettings(updated);
  };

  const handleUlnStandardChange = (standard: UlnStandard) => {
    let customUln = { ...settings.customUln };
    if (standard === 'acg2017') {
      customUln = {
        altMale: 33,
        altFemale: 25,
        astMale: 33,
        astFemale: 25,
        alp: 120,
        ggt: 50
      };
    } else if (standard === 'who') {
      customUln = {
        altMale: 45,
        altFemale: 35,
        astMale: 40,
        astFemale: 35,
        alp: 125,
        ggt: 55
      };
    }

    const updated: AppSettings = {
      ...settings,
      ulnStandard: standard,
      customUln
    };
    onUpdateSettings(updated);
    showToast(`Đã chuyển sang tiêu chuẩn: ${standard === 'acg2017' ? 'ACG 2017' : standard === 'who' ? 'WHO Training' : 'Tùy chỉnh'}`);
  };

  const handleExportJson = () => {
    const backupData = {
      version: '2.5',
      exportDate: new Date().toISOString(),
      patientLabs: currentLabs,
      analysisSummary: {
        pattern: analysis.pattern,
        rRatio: analysis.rRatio,
        deRitis: analysis.deRitisRatio,
        primaryImpression: analysis.primaryImpression
      },
      settings
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HepaCDSS_CaseBackup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Đã xuất file JSON dữ liệu ca lâm sàng!');
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.patientLabs && onImportLabs) {
          onImportLabs(parsed.patientLabs);
          showToast('Đã phục hồi dữ liệu xét nghiệm thành công!');
        }
        if (parsed.settings) {
          onUpdateSettings({ ...settings, ...parsed.settings });
        }
      } catch (err) {
        alert('File JSON không hợp lệ hoặc sai cấu trúc HepaCDSS.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleResetToDefault = () => {
    if (window.confirm('Bạn có chắc chắn muốn khôi phục toàn bộ cài đặt về tiêu chuẩn ACG 2017 mặc định?')) {
      onUpdateSettings(DEFAULT_SETTINGS);
      showToast('Đã đặt lại toàn bộ cài đặt về mặc định!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full my-6 shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-900 px-5 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-600/30 border border-teal-500/40 flex items-center justify-center text-teal-300">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base flex items-center space-x-2">
                <span>Trung Tâm Cài Đặt & Quản Lý Xuất Bản</span>
                <span className="text-[10px] bg-teal-950 text-teal-300 px-2 py-0.5 rounded border border-teal-800">
                  v2.5
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Cấu hình xuất PDF/In ấn, tiêu chuẩn ngưỡng sinh hóa ACG/WHO và đơn vị đo
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-100 px-5 py-2 border-b border-slate-200 flex items-center space-x-2 overflow-x-auto text-xs shrink-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('export_print')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
              activeTab === 'export_print'
                ? 'bg-white text-teal-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Xuất PDF & In Ấn</span>
          </button>

          <button
            onClick={() => setActiveTab('uln_standards')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
              activeTab === 'uln_standards'
                ? 'bg-white text-teal-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Ngưỡng ULN Tham Chiếu</span>
          </button>

          <button
            onClick={() => setActiveTab('units')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
              activeTab === 'units'
                ? 'bg-white text-teal-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Đơn Vị Đo Lường</span>
          </button>

          <button
            onClick={() => setActiveTab('clinical')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
              activeTab === 'clinical'
                ? 'bg-white text-teal-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Tùy Chọn Hỗ Trợ CDSS</span>
          </button>

          <button
            onClick={() => setActiveTab('backup_reset')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
              activeTab === 'backup_reset'
                ? 'bg-white text-teal-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Sao Lưu & Đặt Lại</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-slate-800 text-xs sm:text-sm flex-1">
          
          {/* TAB 1: EXPORT & PRINT */}
          {activeTab === 'export_print' && (
            <div className="space-y-6">
              {/* Quick Actions Panel */}
              <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-black text-teal-950 flex items-center space-x-2">
                    <FileSpreadsheet className="w-4 h-4 text-teal-600" />
                    <span>Hành Động Xuất Bản & Hội Chẩn Nhanh</span>
                  </h4>
                  <span className="text-[10px] text-teal-700 font-semibold bg-teal-100 px-2 py-0.5 rounded">
                    Sẵn sàng in ấn
                  </span>
                </div>
                <p className="text-xs text-teal-900">
                  Xuất toàn bộ kết quả phân tầng R-ratio, tỷ số De Ritis, chẩn đoán phân biệt và kế hoạch cận lâm sàng của ca bệnh hiện tại ra tài liệu chính thức.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenReportModal();
                    }}
                    className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-sm"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Xem Phiếu Báo Cáo & In Ấn Ngay</span>
                  </button>

                  <button
                    onClick={() => generateConsultationPDF(currentLabs, analysis, settings.headerInfo)}
                    className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white transition-all shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>Tải Nhanh File PDF (Chuẩn A4)</span>
                  </button>
                </div>
              </div>

              {/* Custom Header Form */}
              <div className="space-y-4">
                <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-slate-700" />
                    <span>Tùy Chỉnh Thông Tin Tiêu Đề Trên Phiếu In / PDF</span>
                  </h4>
                  <span className="text-[11px] text-slate-500">Tự động chèn vào đầu trang</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Tên Bệnh Viện / Cơ Sở Y Tế:
                    </label>
                    <input
                      type="text"
                      value={settings.headerInfo.hospitalName}
                      onChange={(e) => handleHeaderChange('hospitalName', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      placeholder="Ví dụ: Bệnh Viện Đa Khoa Trung Ương"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Khoa Phòng / Trung Tâm Điều Trị:
                    </label>
                    <input
                      type="text"
                      value={settings.headerInfo.department}
                      onChange={(e) => handleHeaderChange('department', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      placeholder="Ví dụ: Khoa Tiêu Hóa - Gan Mật"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Bác Sĩ Điều Trị / Hội Chẩn:
                    </label>
                    <input
                      type="text"
                      value={settings.headerInfo.doctorName}
                      onChange={(e) => handleHeaderChange('doctorName', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      placeholder="Ví dụ: BS.CKII / TS.BS Phan Duy"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Số Chứng Chỉ Hành Nghề (CCHN) / Chức Danh:
                    </label>
                    <input
                      type="text"
                      value={settings.headerInfo.licenseNumber}
                      onChange={(e) => handleHeaderChange('licenseNumber', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      placeholder="Ví dụ: CCHN: 018429/BYT"
                    />
                  </div>
                </div>

                {/* Checkbox Toggles for Signature & Stamp */}
                <div className="pt-2 flex flex-wrap gap-4 text-xs">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.headerInfo.showDoctorSignature}
                      onChange={(e) => handleHeaderChange('showDoctorSignature', e.target.checked)}
                      className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                    />
                    <span className="font-medium text-slate-700">
                      Hiển thị phần ký tên xác nhận của Bác sĩ ở cuối phiếu
                    </span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.headerInfo.showOfficialStamp}
                      onChange={(e) => handleHeaderChange('showOfficialStamp', e.target.checked)}
                      className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                    />
                    <span className="font-medium text-slate-700">
                      Hiển thị dấu xác nhận chuẩn Y khoa ACG/WHO
                    </span>
                  </label>
                </div>
              </div>

              {/* Data Export / Import */}
              <div className="border-t border-slate-200 pt-4 space-y-3">
                <h4 className="text-xs sm:text-sm font-black text-slate-900 flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-slate-700" />
                  <span>Sao Lưu & Chia Sẻ Ca Bệnh (JSON)</span>
                </h4>
                <p className="text-xs text-slate-600">
                  Xuất dữ liệu xét nghiệm của bệnh nhân hiện tại ra file JSON để lưu trữ hồ sơ nghiên cứu hoặc tải lại vào hệ thống bất kỳ lúc nào mà không cần nhập lại từ đầu.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleExportJson}
                    className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors border border-slate-300"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Xuất File JSON Ca Bệnh</span>
                  </button>

                  <label className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors border border-slate-300 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Nhập Ca Bệnh Từ JSON</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json"
                      onChange={handleImportJson}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ULN STANDARDS */}
          {activeTab === 'uln_standards' && (
            <div className="space-y-5">
              <div className="border-b border-slate-200 pb-2">
                <h4 className="text-xs sm:text-sm font-black text-slate-900">
                  Lựa Chọn Tiêu Chuẩn Ngưỡng Bình Thường Cao (ULN)
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Ngưỡng ULN quyết định trực tiếp việc tính số lần bội số men gan, chỉ số R-ratio và phân tầng mức độ tổn thương.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* ACG 2017 Option */}
                <div
                  onClick={() => handleUlnStandardChange('acg2017')}
                  className={`cursor-pointer p-4 rounded-2xl border-2 transition-all space-y-2 ${
                    settings.ulnStandard === 'acg2017'
                      ? 'border-teal-600 bg-teal-50/50 shadow-sm ring-2 ring-teal-500/20'
                      : 'border-slate-200 bg-slate-50/60 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-teal-900">ACG 2017 (Khuyến nghị)</span>
                    {settings.ulnStandard === 'acg2017' && (
                      <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Nam ALT ≤ 33 U/L, Nữ ALT ≤ 25 U/L. Khắc phục triệt để bẫy bỏ sót MASLD và viêm gan B/C giai đoạn sớm.
                  </p>
                </div>

                {/* WHO Option */}
                <div
                  onClick={() => handleUlnStandardChange('who')}
                  className={`cursor-pointer p-4 rounded-2xl border-2 transition-all space-y-2 ${
                    settings.ulnStandard === 'who'
                      ? 'border-teal-600 bg-teal-50/50 shadow-sm ring-2 ring-teal-500/20'
                      : 'border-slate-200 bg-slate-50/60 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900">WHO / Phòng Lab Phổ Thông</span>
                    {settings.ulnStandard === 'who' && (
                      <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Nam ALT ≤ 45 U/L, Nữ ALT ≤ 35 U/L. Phổ biến tại các trung tâm xét nghiệm quy ước trước đây.
                  </p>
                </div>

                {/* Custom Option */}
                <div
                  onClick={() => handleUlnStandardChange('custom')}
                  className={`cursor-pointer p-4 rounded-2xl border-2 transition-all space-y-2 ${
                    settings.ulnStandard === 'custom'
                      ? 'border-teal-600 bg-teal-50/50 shadow-sm ring-2 ring-teal-500/20'
                      : 'border-slate-200 bg-slate-50/60 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900">Tùy Chỉnh Theo Lab Bệnh Viện</span>
                    {settings.ulnStandard === 'custom' && (
                      <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Tự nhập chính xác giá trị ULN in trên phiếu xét nghiệm của máy phân tích (Cobas, Architect, Alinity).
                  </p>
                </div>
              </div>

              {/* Custom Input Form if selected */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <h5 className="text-xs font-bold text-slate-800">
                  Giá Trị Ngưỡng ULN Đang Áp Dụng (U/L):
                </h5>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">ALT Nam (U/L):</label>
                    <input
                      type="number"
                      value={settings.customUln.altMale}
                      onChange={(e) => onUpdateSettings({
                        ...settings,
                        customUln: { ...settings.customUln, altMale: Number(e.target.value) }
                      })}
                      className="w-full px-2.5 py-1 text-xs bg-white border border-slate-300 rounded-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">ALT Nữ (U/L):</label>
                    <input
                      type="number"
                      value={settings.customUln.altFemale}
                      onChange={(e) => onUpdateSettings({
                        ...settings,
                        customUln: { ...settings.customUln, altFemale: Number(e.target.value) }
                      })}
                      className="w-full px-2.5 py-1 text-xs bg-white border border-slate-300 rounded-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">AST Nam/Nữ (U/L):</label>
                    <input
                      type="number"
                      value={settings.customUln.astMale}
                      onChange={(e) => onUpdateSettings({
                        ...settings,
                        customUln: { ...settings.customUln, astMale: Number(e.target.value), astFemale: Number(e.target.value) }
                      })}
                      className="w-full px-2.5 py-1 text-xs bg-white border border-slate-300 rounded-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">ALP (Kiềm thổ) (U/L):</label>
                    <input
                      type="number"
                      value={settings.customUln.alp}
                      onChange={(e) => onUpdateSettings({
                        ...settings,
                        customUln: { ...settings.customUln, alp: Number(e.target.value) }
                      })}
                      className="w-full px-2.5 py-1 text-xs bg-white border border-slate-300 rounded-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">GGT (U/L):</label>
                    <input
                      type="number"
                      value={settings.customUln.ggt}
                      onChange={(e) => onUpdateSettings({
                        ...settings,
                        customUln: { ...settings.customUln, ggt: Number(e.target.value) }
                      })}
                      className="w-full px-2.5 py-1 text-xs bg-white border border-slate-300 rounded-lg font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: UNITS */}
          {activeTab === 'units' && (
            <div className="space-y-5">
              <div className="border-b border-slate-200 pb-2">
                <h4 className="text-xs sm:text-sm font-black text-slate-900">
                  Cấu Hình Đơn Vị Đo Lường Sinh Hóa
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Lựa chọn đơn vị đo tương thích với phòng xét nghiệm của bệnh viện bạn.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-slate-900 block">Đơn vị Men Gan (ALT, AST, ALP, GGT):</span>
                    <span className="text-xs text-slate-500">Đơn vị quốc tế (U/L) hoặc Microkatal/L</span>
                  </div>
                  <div className="flex items-center space-x-1 p-1 bg-white border border-slate-300 rounded-xl text-xs font-semibold">
                    <button
                      onClick={() => onUpdateSettings({
                        ...settings,
                        units: { ...settings.units, enzyme: 'u_l' }
                      })}
                      className={`px-3 py-1 rounded-lg ${settings.units.enzyme === 'u_l' ? 'bg-teal-600 text-white' : 'text-slate-700'}`}
                    >
                      U/L (Phổ biến)
                    </button>
                    <button
                      onClick={() => onUpdateSettings({
                        ...settings,
                        units: { ...settings.units, enzyme: 'ukat_l' }
                      })}
                      className={`px-3 py-1 rounded-lg ${settings.units.enzyme === 'ukat_l' ? 'bg-teal-600 text-white' : 'text-slate-700'}`}
                    >
                      µkat/L (SI)
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-slate-900 block">Đơn vị Bilirubin:</span>
                    <span className="text-xs text-slate-500">mg/dL hoặc µmol/L (Quy đổi: 1 mg/dL = 17.1 µmol/L)</span>
                  </div>
                  <div className="flex items-center space-x-1 p-1 bg-white border border-slate-300 rounded-xl text-xs font-semibold">
                    <button
                      onClick={() => onUpdateSettings({
                        ...settings,
                        units: { ...settings.units, bilirubin: 'mg_dl' }
                      })}
                      className={`px-3 py-1 rounded-lg ${settings.units.bilirubin === 'mg_dl' ? 'bg-teal-600 text-white' : 'text-slate-700'}`}
                    >
                      mg/dL
                    </button>
                    <button
                      onClick={() => onUpdateSettings({
                        ...settings,
                        units: { ...settings.units, bilirubin: 'umol_l' }
                      })}
                      className={`px-3 py-1 rounded-lg ${settings.units.bilirubin === 'umol_l' ? 'bg-teal-600 text-white' : 'text-slate-700'}`}
                    >
                      µmol/L
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-slate-900 block">Đơn vị Albumin:</span>
                    <span className="text-xs text-slate-500">g/dL hoặc g/L</span>
                  </div>
                  <div className="flex items-center space-x-1 p-1 bg-white border border-slate-300 rounded-xl text-xs font-semibold">
                    <button
                      onClick={() => onUpdateSettings({
                        ...settings,
                        units: { ...settings.units, albumin: 'g_dl' }
                      })}
                      className={`px-3 py-1 rounded-lg ${settings.units.albumin === 'g_dl' ? 'bg-teal-600 text-white' : 'text-slate-700'}`}
                    >
                      g/dL
                    </button>
                    <button
                      onClick={() => onUpdateSettings({
                        ...settings,
                        units: { ...settings.units, albumin: 'g_l' }
                      })}
                      className={`px-3 py-1 rounded-lg ${settings.units.albumin === 'g_l' ? 'bg-teal-600 text-white' : 'text-slate-700'}`}
                    >
                      g/L
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CLINICAL CDSS */}
          {activeTab === 'clinical' && (
            <div className="space-y-5">
              <div className="border-b border-slate-200 pb-2">
                <h4 className="text-xs sm:text-sm font-black text-slate-900">
                  Tùy Chọn Hỗ Trợ Lâm Sàng & Đào Tạo
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Tùy biến mức độ chi tiết và các thuật toán cảnh báo an toàn bệnh nhân.
                </p>
              </div>

              <div className="space-y-3">
                <label className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.clinicalOptions.enableRedFlagAlerts}
                    onChange={(e) => onUpdateSettings({
                      ...settings,
                      clinicalOptions: { ...settings.clinicalOptions, enableRedFlagAlerts: e.target.checked }
                    })}
                    className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4 mt-0.5"
                  />
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">
                      Bật Cảnh Báo Đỏ Cấp Cứu (Suy Gan Cấp ALF & Tăng Men &gt;10,000 U/L)
                    </span>
                    <span className="text-[11px] text-slate-600">
                      Hiển thị hộp cảnh báo màu đỏ nổi bật khi phát hiện INR ≥ 1.5 kèm bệnh não gan hoặc nồng độ hoại tử tế bào gan cực đại.
                    </span>
                  </div>
                </label>

                <label className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.clinicalOptions.autoCalculate}
                    onChange={(e) => onUpdateSettings({
                      ...settings,
                      clinicalOptions: { ...settings.clinicalOptions, autoCalculate: e.target.checked }
                    })}
                    className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4 mt-0.5"
                  />
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">
                      Tự động tính toán tức thời (Live Calculation)
                    </span>
                    <span className="text-[11px] text-slate-600">
                      Cập nhật liên tục R-ratio, tỷ số De Ritis, FIB-4 và chẩn đoán phân biệt ngay khi gõ từng con số.
                    </span>
                  </div>
                </label>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">
                      Chế độ hiển thị phân tích:
                    </span>
                    <span className="text-[11px] text-slate-600">
                      Chuẩn thực hành lâm sàng cô đọng hoặc Đào tạo nội trú chuyên sâu (kèm Zone 1-3)
                    </span>
                  </div>

                  <div className="flex items-center space-x-1 p-1 bg-white border border-slate-300 rounded-lg text-xs font-semibold">
                    <button
                      onClick={() => onUpdateSettings({
                        ...settings,
                        clinicalOptions: { ...settings.clinicalOptions, viewMode: 'clinical' }
                      })}
                      className={`px-3 py-1 rounded-md ${settings.clinicalOptions.viewMode === 'clinical' ? 'bg-teal-600 text-white' : 'text-slate-700'}`}
                    >
                      Lâm Sàng
                    </button>
                    <button
                      onClick={() => onUpdateSettings({
                        ...settings,
                        clinicalOptions: { ...settings.clinicalOptions, viewMode: 'academic' }
                      })}
                      className={`px-3 py-1 rounded-md ${settings.clinicalOptions.viewMode === 'academic' ? 'bg-teal-600 text-white' : 'text-slate-700'}`}
                    >
                      Học Thuật / Nội Trú
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: BACKUP & RESET */}
          {activeTab === 'backup_reset' && (
            <div className="space-y-5">
              <div className="border-b border-slate-200 pb-2">
                <h4 className="text-xs sm:text-sm font-black text-slate-900">
                  Quản Lý Dữ Liệu & Khôi Phục Hệ Thống
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Đặt lại toàn bộ các thông số về mặc định ban đầu hoặc dọn dẹp bộ nhớ tạm.
                </p>
              </div>

              <div className="p-4 bg-rose-50/60 border border-rose-200 rounded-2xl space-y-3">
                <div className="flex items-center space-x-2 text-rose-800">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span className="font-bold text-xs">Vùng Nguy Hiểm (Danger Zone)</span>
                </div>
                <p className="text-xs text-rose-900">
                  Thao tác này sẽ xóa mọi tùy chỉnh tiêu đề bệnh viện, ngưỡng ULN tùy chỉnh và đưa hệ thống về chuẩn mực ACG 2017 nguyên bản.
                </p>

                <button
                  onClick={handleResetToDefault}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center space-x-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Khôi Phục Cài Đặt Mặc Định ACG 2017</span>
                </button>
              </div>

              {/* Version Specs */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs text-slate-600">
                <h5 className="font-bold text-slate-900">Thông Tin Phiên Bản Y Khoa:</h5>
                <ul className="space-y-1 list-disc list-inside">
                  <li><strong>Hệ thống:</strong> HepaCDSS v2.5 (Clinical Decision Support System)</li>
                  <li><strong>Khuyến cáo chính:</strong> ACG Clinical Guideline: Evaluation of Abnormal Liver Chemistries (Kwo et al., Am J Gastroenterol 2017)</li>
                  <li><strong>Đào tạo WHO:</strong> Training of trainers on testing, diagnosis, and management (Session 4: Liver Function Tests)</li>
                  <li><strong>Xơ hóa gan:</strong> FIB-4 Index (Sterling et al., Hepatology 2006) & APRI (Wai et al., Hepatology 2003)</li>
                  <li><strong>Tổn thương gan do thuốc (DILI):</strong> Roussel Uclaf Causality Assessment Method (RUCAM R-ratio)</li>
                </ul>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-xs text-teal-700 font-medium">
            {saveToast ? (
              <span className="flex items-center space-x-1 font-bold text-teal-800 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{saveToast}</span>
              </span>
            ) : (
              <span>Cài đặt được lưu tự động trên trình duyệt của bạn</span>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Đóng Cài Đặt
          </button>
        </div>

      </div>
    </div>
  );
};
