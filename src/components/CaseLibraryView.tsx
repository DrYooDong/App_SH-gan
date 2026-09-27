import React, { useState } from 'react';
import { CLINICAL_CASES } from '../data/caseLibrary';
import { ClinicalCase, PatientLabs } from '../types/cdss';
import { calculateAnalysis } from '../utils/calculator';
import { generateConsultationPDF } from '../utils/pdfGenerator';
import { 
  BookMarked, 
  Search, 
  Filter, 
  ArrowRight, 
  FileDown, 
  CheckCircle, 
  Activity, 
  Tag, 
  ExternalLink,
  GraduationCap,
  X
} from 'lucide-react';

interface CaseLibraryViewProps {
  onSelectCaseToAnalyze: (labs: PatientLabs) => void;
}

export const CaseLibraryView: React.FC<CaseLibraryViewProps> = ({ onSelectCaseToAnalyze }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeCaseModal, setActiveCaseModal] = useState<ClinicalCase | null>(null);

  const categories = [
    { id: 'all', label: 'Tất cả (12 Ca)' },
    { id: 'Viral', label: 'Viêm gan virus' },
    { id: 'Alcohol', label: 'Do rượu (ALD)' },
    { id: 'Metabolic', label: 'Chuyển hóa (MASLD)' },
    { id: 'Biliary', label: 'Đường mật (Sỏi/Ứ mật)' },
    { id: 'Toxic/DILI', label: 'Độc chất & Thuốc' },
    { id: 'Autoimmune', label: 'Tự miễn (AIH/PBC)' },
    { id: 'Genetic', label: 'Di truyền (Wilson/Gilbert)' },
    { id: 'Emergency', label: 'Cấp cứu & Sốc gan' }
  ];

  const filteredCases = CLINICAL_CASES.filter((c) => {
    const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
    const matchesSearch = 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.history.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.expertCommentary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.teachingPoints.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900 flex items-center space-x-2.5">
              <BookMarked className="w-6 h-6 text-teal-600" />
              <span>Thư Viện Ca Lâm Sàng Mẫu Chuyên Khoa Gan Mật</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Tổng hợp 12 ca bệnh kinh điển minh họa các hình thái sinh hóa đặc trưng theo ACG 2017, WHO và y văn quốc tế.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative min-w-[280px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm theo bệnh, triệu chứng, thuốc..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Case Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCases.map((c) => {
          const analysis = calculateAnalysis(c.labs);
          return (
            <div
              key={c.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between hover:shadow-md transition-all hover:border-teal-300 group"
            >
              <div className="space-y-3">
                {/* Badge Category & Pattern */}
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-100 text-slate-700 uppercase tracking-wider">
                    {c.category}
                  </span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                    analysis.pattern === 'Hepatocellular'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : analysis.pattern === 'Cholestatic'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : analysis.pattern === 'Mixed'
                      ? 'bg-purple-50 text-purple-700 border-purple-200'
                      : 'bg-teal-50 text-teal-700 border-teal-200'
                  }`}>
                    {analysis.pattern}
                  </span>
                </div>

                {/* Case Title & Patient */}
                <div>
                  <h3 className="text-sm font-black text-slate-900 group-hover:text-teal-700 transition-colors">
                    {c.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{c.patientProfile}</p>
                </div>

                {/* Key Lab Highlights Bar */}
                <div className="grid grid-cols-3 gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-100 text-center">
                  <div>
                    <span className="text-[9px] text-slate-500 block">ALT / AST</span>
                    <span className="text-xs font-black text-slate-900">
                      {c.labs.alt} / {c.labs.ast}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 block">De Ritis</span>
                    <span className={`text-xs font-black ${analysis.deRitisRatio >= 2 ? 'text-amber-700' : 'text-slate-900'}`}>
                      {analysis.deRitisRatio}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 block">ALP / T.Bili</span>
                    <span className="text-xs font-black text-slate-900">
                      {c.labs.alp} / {c.labs.totalBilirubin}
                    </span>
                  </div>
                </div>

                {/* Snippet History */}
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {c.history}
                </p>

                {/* Teaching Point snippet */}
                <div className="text-[11px] text-teal-900 bg-teal-50/70 p-2.5 rounded-lg border border-teal-100/60 space-y-1">
                  <span className="font-bold flex items-center space-x-1 text-teal-950">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Điểm cốt lõi:</span>
                  </span>
                  <p className="line-clamp-2 italic text-slate-700">
                    "{c.teachingPoints[0]}"
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setActiveCaseModal(c)}
                  className="text-xs font-bold text-slate-700 hover:text-slate-900 py-1.5 px-2.5 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Xem Chi Tiết
                </button>

                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => generateConsultationPDF(c.labs, analysis)}
                    className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
                    title="Tải PDF tóm tắt ca này"
                  >
                    <FileDown className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onSelectCaseToAnalyze(c.labs)}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
                  >
                    <span>Phân Tích</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Case Modal */}
      {activeCaseModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="px-2 py-0.5 text-xs font-bold bg-teal-100 text-teal-800 rounded">
                  {activeCaseModal.category}
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">
                  {activeCaseModal.title}
                </h3>
                <p className="text-xs text-slate-500">{activeCaseModal.patientProfile}</p>
              </div>

              <button
                onClick={() => setActiveCaseModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors shadow-2xs"
                title="Đóng cửa sổ"
                aria-label="Đóng"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* History */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Bệnh Sử Lâm Sàng
              </h4>
              <p className="text-xs sm:text-sm text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
                {activeCaseModal.history}
              </p>
            </div>

            {/* Lab Values Grid */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Kết Quả Sinh Hóa Chi Tiết
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">ALT</span>
                  <span className="font-bold text-rose-700 text-sm">{activeCaseModal.labs.alt} U/L</span>
                  <span className="text-[10px] text-slate-400 block">ULN: {activeCaseModal.labs.altUln}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">AST</span>
                  <span className="font-bold text-rose-700 text-sm">{activeCaseModal.labs.ast} U/L</span>
                  <span className="text-[10px] text-slate-400 block">ULN: {activeCaseModal.labs.astUln}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">ALP</span>
                  <span className="font-bold text-amber-700 text-sm">{activeCaseModal.labs.alp} U/L</span>
                  <span className="text-[10px] text-slate-400 block">ULN: {activeCaseModal.labs.alpUln}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">GGT</span>
                  <span className="font-bold text-amber-700 text-sm">{activeCaseModal.labs.ggt ?? '-'} U/L</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">Bilirubin Toàn Phần</span>
                  <span className="font-bold text-slate-900 text-sm">{activeCaseModal.labs.totalBilirubin} mg/dL</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">Bilirubin Trực Tiếp</span>
                  <span className="font-bold text-slate-900 text-sm">{activeCaseModal.labs.directBilirubin} mg/dL</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">Albumin / INR</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {activeCaseModal.labs.albumin ?? '-'} g/dL / {activeCaseModal.labs.inr ?? '-'}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">Tiểu Cầu</span>
                  <span className="font-bold text-slate-900 text-sm">{activeCaseModal.labs.platelets ?? '-'} x10⁹/L</span>
                </div>
              </div>
              {activeCaseModal.labs.notes && (
                <p className="text-xs text-slate-600 mt-2 italic bg-slate-50 p-2 rounded">
                  * Ghi chú xét nghiệm chuyên sâu: {activeCaseModal.labs.notes}
                </p>
              )}
            </div>

            {/* Teaching Points */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Các Điểm Đúc Kết Kinh Nghiệm Chuyên Khoa
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-800 bg-teal-50/50 p-3.5 rounded-xl border border-teal-100">
                {activeCaseModal.teachingPoints.map((tp, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <CheckCircle className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                    <span>{tp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Expert Commentary */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Bình Luận Chuyên Gia & Chiến Lược Điều Trị
              </h4>
              <p className="text-xs sm:text-sm text-slate-800 bg-slate-100 p-3 rounded-xl leading-relaxed">
                {activeCaseModal.expertCommentary}
              </p>
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
              <button
                onClick={() => {
                  const labs = activeCaseModal.labs;
                  const an = calculateAnalysis(labs);
                  generateConsultationPDF(labs, an);
                }}
                className="p-2.5 rounded-xl text-xs font-bold border border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900 flex items-center justify-center transition-colors shadow-2xs"
                title="Xuất phiếu tóm tắt PDF ca này"
                aria-label="Xuất PDF ca này"
              >
                <FileDown className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  onSelectCaseToAnalyze(activeCaseModal.labs);
                  setActiveCaseModal(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white flex items-center space-x-1.5 shadow-sm"
              >
                <span>Nạp Vào Bộ Phân Tích CDSS</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
