import React, { useState } from 'react';
import { BIOMARKER_DICTIONARY } from '../data/biomarkerData';
import { BiomarkerInfo } from '../types/cdss';
import { 
  Search, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  Info, 
  Clock, 
  FileText,
  Sparkles,
  GitBranch,
  BookOpen,
  ExternalLink
} from 'lucide-react';

const BIOMARKER_CROSS_LINKS: Record<string, {
  flowcharts: { id: string; branchId?: string; label: string; desc: string }[];
  topics: { id: string; label: string; desc: string }[];
}> = {
  'alt': {
    flowcharts: [
      { id: 'algo-transaminases', label: 'Lưu Đồ Tiếp Cận Tăng Aminotransferase', desc: 'Phân tầng nguy cơ theo bội số ULN (33 U/L nam, 25 U/L nữ)' }
    ],
    topics: [
      { id: 'de-ritis-ratio', label: 'Chuyên Đề Tỷ Số De Ritis (AST/ALT)', desc: 'Ý nghĩa vị trí bào tương vs ty thể và thanh thải t½' },
      { id: 'microscopic-anatomy', label: 'Giải Phẫu Vi Thể & Tổn Thương Vùng Zone 3', desc: 'Nhạy cảm chuyển hóa P450 và sốc gan' }
    ]
  },
  'ast': {
    flowcharts: [
      { id: 'algo-transaminases', label: 'Lưu Đồ Tiếp Cận Tăng Aminotransferase', desc: 'Tiếp cận tăng AST ưu thế và nguy cơ suy gan' }
    ],
    topics: [
      { id: 'de-ritis-ratio', label: 'Chuyên Đề Tỷ Số De Ritis (AST/ALT)', desc: 'Tại sao AST/ALT > 2 gợi ý bệnh gan do rượu' },
      { id: 'pitfalls-interfering', label: 'Bẫy Xét Nghiệm: Tan Máu Trong Ống Nghiệm', desc: 'Hồng cầu chứa AST gấp 40 lần huyết thanh gây tăng giả' }
    ]
  },
  'alp': {
    flowcharts: [
      { id: 'algo-cholestasis', label: 'Lưu Đồ Tiếp Cận Men Ứ Mật (ALP & GGT)', desc: 'Khẳng định nguồn gốc gan và phân biệt tắc ngoài vs trong gan' }
    ],
    topics: [
      { id: 'cholestasis-approach', label: 'Tiếp Cận Hội Chứng Ứ Mật & Tỷ Số R-Ratio', desc: 'Tính R-ratio phân biệt tổn thương tế bào gan vs ứ mật' }
    ]
  },
  'ggt': {
    flowcharts: [
      { id: 'algo-cholestasis', branchId: 'alp-isolated', label: 'Lưu Đồ Tiếp Cận ALP Đơn Độc', desc: 'GGT làm chìa khóa loại trừ nguyên nhân từ xương' }
    ],
    topics: [
      { id: 'cholestasis-approach', label: 'Tiếp Cận Hội Chứng Ứ Mật & Tỷ Số R-Ratio', desc: 'GGT màng vi quản mật và tính nhạy cảm với rượu/thuốc' }
    ]
  },
  'tbili': {
    flowcharts: [
      { id: 'algo-bilirubin', label: 'Lưu Đồ Tiếp Cận Vàng Da & Bilirubin', desc: 'Cây quyết định phân loại vàng da trước, tại và sau gan' }
    ],
    topics: [
      { id: 'bilirubin-metabolism', label: 'Chuyển Hóa Bilirubin & Vàng Da Lâm Sàng', desc: 'Enzyme UGT1A1, tán huyết vs Hội chứng Gilbert' }
    ]
  },
  'dbili': {
    flowcharts: [
      { id: 'algo-bilirubin', branchId: 'bili-conjugated', label: 'Lưu Đồ Tiếp Cận Tăng Bilirubin Trực Tiếp', desc: 'Dấu hiệu chắc chắn của tắc mật hoặc bệnh tế bào gan nặng' }
    ],
    topics: [
      { id: 'bilirubin-metabolism', label: 'Chuyển Hóa Bilirubin & Vàng Da Lâm Sàng', desc: 'Bilirubin liên hợp tan trong nước gây vàng da sẫm nước tiểu' }
    ]
  },
  'alb': {
    flowcharts: [
      { id: 'algo-transaminases', branchId: 'severe-massive', label: 'Lưu Đồ Đánh Giá Suy Gan Cấp (ALF)', desc: 'Khảo sát song song Albumin và INR để phân tầng suy chức năng' }
    ],
    topics: [
      { id: 'core-concept', label: 'Bản Chất LFTs: Tổn Thương vs Chức Năng Tổng Hợp', desc: 'Albumin là thước đo năng lực tổng hợp dài hạn (t½ 21 ngày)' }
    ]
  },
  'inr': {
    flowcharts: [
      { id: 'algo-transaminases', branchId: 'severe-massive', label: 'Lưu Đồ Đánh Giá Suy Gan Cấp (ALF)', desc: 'INR ≥ 1.5 kèm bệnh não gan là tiêu chuẩn cấp cứu ghép gan' }
    ],
    topics: [
      { id: 'core-concept', label: 'Bản Chất LFTs: Tổn Thương vs Chức Năng Tổng Hợp', desc: 'Thời gian Prothrombin đo các yếu tố đông máu chu kỳ ngắn (Yếu tố VII t½ 6h)' }
    ]
  },
  'plt': {
    flowcharts: [
      { id: 'algo-transaminases', branchId: 'borderline-mild', label: 'Lưu Đồ Tiếp Cận Men Gan Mạn Tính', desc: 'Tiểu cầu là thành phần thiết yếu tính điểm xơ hóa FIB-4 & APRI' }
    ],
    topics: [
      { id: 'pitfalls-interfering', label: 'Bẫy Xét Nghiệm & Yếu Tố Gây Nhiễu', desc: 'Cảnh giác vón tiểu cầu do EDTA (Pseudothrombocytopenia)' }
    ]
  },
  'ck': {
    flowcharts: [
      { id: 'algo-transaminases', label: 'Lưu Đồ Tiếp Cận Tăng Aminotransferase', desc: 'Loại trừ nguồn gốc cơ bắp khi AST tăng vượt trội ALT' }
    ],
    topics: [
      { id: 'de-ritis-ratio', label: 'Chuyên Đề Tỷ Số De Ritis (AST/ALT)', desc: 'Tỷ lệ AST trong mô cơ bắp là 17:1 so với ALT' },
      { id: 'pitfalls-interfering', label: 'Bẫy Xét Nghiệm & Yếu Tố Gây Nhiễu', desc: 'Phân biệt tiêu cơ vân với tổn thương gan thực thụ' }
    ]
  }
};

export interface BiomarkersViewProps {
  activeMarkerId?: string;
  onSelectMarker?: (markerId: string) => void;
  onNavigateToFlowchart?: (algoId: string, branchId?: string) => void;
  onNavigateToTopic?: (topicId: string) => void;
  hideStandaloneHeader?: boolean;
}

export const BiomarkersView: React.FC<BiomarkersViewProps> = ({
  activeMarkerId: propMarkerId,
  onSelectMarker: propOnSelectMarker,
  onNavigateToFlowchart,
  onNavigateToTopic,
  hideStandaloneHeader = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [internalMarkerId, setInternalMarkerId] = useState<string>(BIOMARKER_DICTIONARY[0].id);

  const activeMarkerId = propMarkerId ?? internalMarkerId;

  const handleSelectMarker = (markerId: string) => {
    if (propOnSelectMarker) {
      propOnSelectMarker(markerId);
    } else {
      setInternalMarkerId(markerId);
    }
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setTimeout(() => {
        const el = document.getElementById('biomarker-detail-card');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const categories = [
    { id: 'all', label: 'Tất cả chỉ số' },
    { id: 'Hepatocellular', label: 'Tế bào gan (ALT, AST)' },
    { id: 'Cholestatic', label: 'Ứ mật (ALP, GGT)' },
    { id: 'Bilirubin', label: 'Bilirubin' },
    { id: 'Synthetic', label: 'Tổng hợp (Albumin, INR)' },
    { id: 'Specialized', label: 'Tiểu cầu & Xơ gan' },
    { id: 'Non-hepatic', label: 'Ngoài gan (CK)' }
  ];

  const filteredMarkers = BIOMARKER_DICTIONARY.filter(m => {
    const matchesCategory = selectedCategory === 'all' || m.category === selectedCategory;
    const matchesSearch = 
      m.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.nameVi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.causesOfElevation.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const activeMarker: BiomarkerInfo = 
    BIOMARKER_DICTIONARY.find(m => m.id === activeMarkerId) || BIOMARKER_DICTIONARY[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200 uppercase tracking-wider">
              Thư Viện Tra Cứu Sinh Học Phân Tử & Bệnh Học
            </span>
            <h2 className="text-xl font-black text-slate-900 flex items-center space-x-2.5 mt-1">
              <Activity className="w-6 h-6 text-teal-600" />
              <span>Giải Thích & Tra Cứu Các Chỉ Số Xét Nghiệm Bất Thường</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Tra cứu cơ chế sinh học phân tử, vị trí dưới tế bào, thời gian bán hủy t½ và các bẫy xét nghiệm của từng chỉ số.
            </p>
          </div>

          <div className="relative min-w-[280px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo mã chỉ số (ALT, AST, ALP...)"
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

      {/* Main Grid: Biomarkers List (Left) vs Detail Deep Dive (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Biomarker Card Selector */}
        <div className="lg:col-span-4 space-y-2.5">
          <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1">
            {filteredMarkers.map((marker) => {
              const isSelected = activeMarkerId === marker.id;
              return (
                <div
                  key={marker.id}
                  onClick={() => handleSelectMarker(marker.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-teal-600 bg-teal-50/50 shadow-sm ring-1 ring-teal-500/20'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-slate-900">
                      {marker.code}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">
                      {marker.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium mt-1">
                    {marker.nameVi}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
                    <span className="font-mono">{marker.normalRangeMale.split('(')[0]}</span>
                    <span className="text-teal-700 font-bold text-[10px]">Xem cơ chế →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Detailed Biomarker Explorer */}
        {activeMarker && (
          <div id="biomarker-detail-card" className="lg:col-span-8 space-y-5">
            <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-6">
              
              {/* Mobile Back Button (< lg) */}
              <div className="lg:hidden pb-2 border-b border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    window.scrollTo({ top: 120, behavior: 'smooth' });
                  }}
                  className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1.5 rounded-lg flex items-center space-x-1"
                >
                  <span>↑ Quay lại danh sách chỉ số</span>
                </button>
                <span className="text-[11px] font-mono text-slate-500 font-bold">
                  Đang xem: {activeMarker.code}
                </span>
              </div>

              {/* Header Info */}
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 text-xs font-extrabold rounded-md bg-teal-100 text-teal-800 uppercase">
                    {activeMarker.category}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Half-life: {activeMarker.halfLife}
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-900 mt-2">
                  {activeMarker.code} - {activeMarker.nameVi}
                </h3>
                <p className="text-xs text-slate-500 italic mt-0.5">
                  {activeMarker.nameEn}
                </p>
              </div>

              {/* Quick Specs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[10px] font-bold uppercase">Khoảng tham chiếu (Nam)</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">{activeMarker.normalRangeMale}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[10px] font-bold uppercase">Khoảng tham chiếu (Nữ)</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">{activeMarker.normalRangeFemale}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[10px] font-bold uppercase">Thời gian bán thải (t½)</span>
                  <span className="font-bold text-teal-800 mt-0.5 block">{activeMarker.halfLife}</span>
                </div>
              </div>

              {/* Cellular Origin & Role */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs">
                <div>
                  <strong className="text-slate-900 font-semibold block mb-0.5">Vị trí dưới tế bào & Nguồn gốc giải phẫu:</strong>
                  <p className="text-slate-700 leading-relaxed">{activeMarker.cellularOrigin}</p>
                </div>
                <div className="pt-2 border-t border-slate-200/60">
                  <strong className="text-slate-900 font-semibold block mb-0.5">Vai trò sinh lý học:</strong>
                  <p className="text-slate-700 leading-relaxed">{activeMarker.physiologicalRole}</p>
                </div>
              </div>

              {/* Causes of Abnormalities */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Các Nguyên Nhân Gây Tăng Chỉ Số (Causes of Elevation)</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {activeMarker.causesOfElevation.map((cause, idx) => (
                    <div key={idx} className="p-2.5 bg-rose-50/50 rounded-lg border border-rose-100 flex items-start space-x-2 text-slate-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                      <span className="font-medium leading-relaxed">{cause}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clinical Pearls */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-teal-800 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  <span>Kinh Nghiệm Lâm Sàng Bỏ Túi (Clinical Pearls)</span>
                </h4>
                <div className="space-y-2 text-xs text-slate-700">
                  {activeMarker.clinicalPearls.map((pearl, idx) => (
                    <div key={idx} className="p-3 bg-teal-50/60 rounded-xl border border-teal-100 flex items-start space-x-2">
                      <Sparkles className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      <span className="leading-relaxed font-medium text-teal-950">{pearl}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Testing Pitfalls */}
              <div className="p-4 bg-amber-50/80 rounded-xl border border-amber-200 text-xs space-y-2">
                <span className="font-bold text-amber-900 flex items-center space-x-1.5">
                  <Info className="w-4 h-4 text-amber-600" />
                  <span>Cảnh Giác Bẫy Xét Nghiệm & Yếu Tố Nhiễu (Testing Pitfalls):</span>
                </span>
                <ul className="space-y-1 text-amber-950 pl-5 list-disc">
                  {activeMarker.testingPitfalls.map((pitfall, idx) => (
                    <li key={idx} className="leading-relaxed">{pitfall}</li>
                  ))}
                </ul>
              </div>

              {/* Contextual Medical Bridges (Flowcharts & Topics) */}
              {BIOMARKER_CROSS_LINKS[activeMarkerId] && (
                <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 space-y-4">
                  <div className="border-b border-slate-800 pb-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
                      Mạng Lưới Ứng Dụng Lâm Sàng
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-white flex items-center space-x-2 mt-0.5">
                      <Layers className="w-4 h-4 text-teal-400" />
                      <span>Lưu Đồ & Chuyên Đề Tham Chiếu Của {activeMarker.code}</span>
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Related Flowcharts */}
                    {BIOMARKER_CROSS_LINKS[activeMarkerId].flowcharts.length > 0 && (
                      <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/80 space-y-2">
                        <span className="text-[11px] font-bold text-teal-300 uppercase tracking-wider block">
                          Lưu Đồ Quyết Định Tiếp Cận
                        </span>
                        {BIOMARKER_CROSS_LINKS[activeMarkerId].flowcharts.map((f, i) => (
                          <button
                            key={i}
                            onClick={() => onNavigateToFlowchart?.(f.id, f.branchId)}
                            className="w-full text-left p-2 rounded-lg bg-slate-900/90 hover:bg-slate-700/80 border border-slate-700 hover:border-teal-500/50 transition-all flex items-center justify-between group"
                          >
                            <div>
                              <div className="font-bold text-xs text-white group-hover:text-teal-300 transition-colors">
                                {f.label}
                              </div>
                              <div className="text-[11px] text-slate-400">
                                {f.desc}
                              </div>
                            </div>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-300 shrink-0 ml-1.5" />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Related Guide Topics */}
                    {BIOMARKER_CROSS_LINKS[activeMarkerId].topics.length > 0 && (
                      <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/80 space-y-2">
                        <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider block">
                          Chuyên Đề Đọc Sâu Liên Quan
                        </span>
                        {BIOMARKER_CROSS_LINKS[activeMarkerId].topics.map((t, i) => (
                          <button
                            key={i}
                            onClick={() => onNavigateToTopic?.(t.id)}
                            className="w-full text-left p-2 rounded-lg bg-slate-900/90 hover:bg-slate-700/80 border border-slate-700 hover:border-cyan-500/50 transition-all flex items-center justify-between group"
                          >
                            <div>
                              <div className="font-bold text-xs text-white group-hover:text-cyan-300 transition-colors">
                                {t.label}
                              </div>
                              <div className="text-[11px] text-slate-400">
                                {t.desc}
                              </div>
                            </div>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-300 shrink-0 ml-1.5" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}
      </div>
    </div>
  );
};
