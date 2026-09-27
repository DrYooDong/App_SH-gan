import React, { useState } from 'react';
import { KNOWLEDGE_TOPICS, KnowledgeTopic } from '../data/referenceKnowledge';
import { 
  BookOpen, 
  Search, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  Bookmark, 
  Share2, 
  FileText,
  Lightbulb,
  GitBranch,
  ExternalLink,
  Activity
} from 'lucide-react';

const TOPIC_CROSS_LINKS: Record<string, {
  flowcharts: { id: string; branchId?: string; label: string; desc: string }[];
  biomarkers: { id: string; label: string; desc: string }[];
}> = {
  'core-concept': {
    flowcharts: [
      { id: 'algo-transaminases', label: 'Lưu Đồ Tăng Aminotransferase', desc: 'Phân loại hoại tử màng tế bào theo bội số ULN' }
    ],
    biomarkers: [
      { id: 'alb', label: 'Albumin', desc: 'Năng lực tổng hợp dài hạn (t½ ~ 21 ngày)' },
      { id: 'inr', label: 'INR (Prothrombin Time)', desc: 'Năng lực tổng hợp cấp tính (Yếu tố VII t½ ~ 6h)' },
      { id: 'alt', label: 'ALT (Alanine Aminotransferase)', desc: 'Chỉ dấu rò rỉ / hoại tử tế bào gan' }
    ]
  },
  'microscopic-anatomy': {
    flowcharts: [
      { id: 'algo-transaminases', branchId: 'severe-massive', label: 'Lưu Đồ Tăng Men Gan Nặng (>15x ULN)', desc: 'Hoại tử tiểu thùy vùng Zone 3 do sốc gan / thiếu oxy' }
    ],
    biomarkers: [
      { id: 'ast', label: 'AST (SGOT)', desc: 'Men ty thể mAST giải phóng khi hoại tử sâu vùng Zone 3' },
      { id: 'alt', label: 'ALT (SGPT)', desc: 'Men bào tương tế bào gan' }
    ]
  },
  'de-ritis-ratio': {
    flowcharts: [
      { id: 'algo-transaminases', branchId: 'borderline-mild', label: 'Lưu Đồ Tiếp Cận Aminotransferase', desc: 'Ứng dụng tỷ số AST/ALT trong phân biệt ALD vs MASLD' }
    ],
    biomarkers: [
      { id: 'ast', label: 'AST (SGOT)', desc: '80% ty thể, tăng ưu thế trong tổn thương do rượu' },
      { id: 'alt', label: 'ALT (SGPT)', desc: 'Bào tương, tăng ưu thế trong viêm gan virus cấp & mỡ' }
    ]
  },
  'cholestasis-approach': {
    flowcharts: [
      { id: 'algo-cholestasis', label: 'Lưu Đồ Tiếp Cận Men Ứ Mật (ALP & GGT)', desc: 'Khẳng định nguồn gốc và phân biệt tắc ngoài vs trong gan' }
    ],
    biomarkers: [
      { id: 'alp', label: 'ALP (Phosphatase Kiềm)', desc: 'Enzyme vi quản mật phân hủy este phosphat' },
      { id: 'ggt', label: 'GGT', desc: 'Chỉ dấu xác nhận nguồn gốc gan, không có ở xương' }
    ]
  },
  'bilirubin-metabolism': {
    flowcharts: [
      { id: 'algo-bilirubin', label: 'Lưu Đồ Tiếp Cận Vàng Da & Bilirubin', desc: 'Phân đoạn trực tiếp vs gián tiếp tự do' }
    ],
    biomarkers: [
      { id: 'tbili', label: 'Bilirubin Toàn Phần', desc: 'Đánh giá ngưỡng vàng da lâm sàng (>2.5 - 3.0 mg/dL)' },
      { id: 'dbili', label: 'Bilirubin Trực Tiếp', desc: 'Bilirubin liên hợp UGT1A1 tan trong nước qua nước tiểu' }
    ]
  },
  'pitfalls-interfering': {
    flowcharts: [
      { id: 'algo-transaminases', label: 'Lưu Đồ Tiếp Cận Men Gan (Loại trừ bẫy)', desc: 'Cảnh giác vỡ hồng cầu in vitro làm AST tăng đơn độc' }
    ],
    biomarkers: [
      { id: 'ck', label: 'Creatine Kinase (CK)', desc: 'Loại trừ tiêu cơ vân khi AST tăng vượt trội ALT' },
      { id: 'ast', label: 'AST (SGOT)', desc: 'Dễ tăng giả do tan máu trong ống nghiệm' },
      { id: 'plt', label: 'Tiểu Cầu (Platelets)', desc: 'Cảnh giác giả giảm tiểu cầu do chất chống đông EDTA' }
    ]
  }
};

export interface GuideViewProps {
  selectedTopicId?: string;
  onSelectTopic?: (topicId: string) => void;
  onNavigateToFlowchart?: (algoId: string, branchId?: string) => void;
  onNavigateToBiomarker?: (markerId: string) => void;
  hideStandaloneHeader?: boolean;
}

export const GuideView: React.FC<GuideViewProps> = ({
  selectedTopicId: propTopicId,
  onSelectTopic: propOnSelectTopic,
  onNavigateToFlowchart,
  onNavigateToBiomarker,
  hideStandaloneHeader = false
}) => {
  const [internalTopicId, setInternalTopicId] = useState<string>(KNOWLEDGE_TOPICS[0].id);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const selectedTopicId = propTopicId ?? internalTopicId;

  const currentTopic: KnowledgeTopic = 
    KNOWLEDGE_TOPICS.find(t => t.id === selectedTopicId) || KNOWLEDGE_TOPICS[0];

  const handleSelectTopic = (topicId: string) => {
    if (propOnSelectTopic) {
      propOnSelectTopic(topicId);
    } else {
      setInternalTopicId(topicId);
    }
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setTimeout(() => {
        const el = document.getElementById('guide-chapter-content');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const filteredTopics = KNOWLEDGE_TOPICS.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200 uppercase tracking-wider">
              Cẩm Nang Y Khoa Chuyên Biệt
            </span>
            <h2 className="text-xl font-black text-slate-900 flex items-center space-x-2.5 mt-1">
              <BookOpen className="w-6 h-6 text-teal-600" />
              <span>Hướng Dẫn Đọc & Phân Tích Sinh Hóa Gan Chuẩn Y Khoa</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Biên soạn chuẩn chỉnh theo tài liệu tập huấn WHO Session 4, khuyến cáo ACG 2017 & tổng quan quốc tế.
            </p>
          </div>

          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm chủ đề hoặc từ khóa..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Topic Index (Left) vs Chapter Content (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Topic Navigation Menu */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-2 pb-1 border-b border-slate-100">
              Mục Lục Chuyên Đề ({filteredTopics.length})
            </h3>

            <div className="space-y-1.5">
              {filteredTopics.map((topic) => {
                const isSelected = selectedTopicId === topic.id;
                return (
                  <button
                    key={topic.id}
                    onClick={() => handleSelectTopic(topic.id)}
                    className={`w-full text-left p-3 rounded-xl transition-all flex items-start justify-between space-x-2 ${
                      isSelected
                        ? 'bg-teal-600 text-white shadow-sm font-bold'
                        : 'text-slate-700 hover:bg-slate-100 font-medium'
                    }`}
                  >
                    <div className="space-y-1 pr-1">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider font-bold ${
                        isSelected ? 'bg-teal-800 text-teal-200' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {topic.category}
                      </span>
                      <h4 className="text-xs font-bold leading-tight block">
                        {topic.title}
                      </h4>
                      <p className={`text-[11px] line-clamp-1 ${isSelected ? 'text-teal-100' : 'text-slate-500'}`}>
                        {topic.summary}
                      </p>
                    </div>

                    <ChevronRight className={`w-4 h-4 shrink-0 mt-2 ${
                      isSelected ? 'text-white' : 'text-slate-400'
                    }`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Guidelines bibliography widget */}
          <div className="p-4 bg-slate-900 rounded-2xl text-white space-y-2 text-xs">
            <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider block">
              Tài Liệu Cốt Lõi
            </span>
            <p className="text-slate-300">
              • <strong>WHO Training Workshop</strong>: Session 4 - Interpretation of liver function tests.
            </p>
            <p className="text-slate-300">
              • <strong>ACG Guidelines 2017</strong>: Evaluation of Abnormal Liver Chemistries (Am J Gastroenterol).
            </p>
            <p className="text-slate-300">
              • <strong>Clin Biochem Rev 2013</strong>: The De Ritis Ratio: The Test of Time.
            </p>
            <p className="text-slate-300">
              • <strong>Gastroenterology 2026</strong>: Reviews in Basic & Clinical Gastroenterology.
            </p>
          </div>
        </div>

        {/* Right Side: Chapter Detail Display */}
        <div id="guide-chapter-content" className="lg:col-span-8">
          <div className="bg-white rounded-2xl p-5 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            
            {/* Mobile Back to Topics Button (< lg) */}
            <div className="lg:hidden pb-2 border-b border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  window.scrollTo({ top: 120, behavior: 'smooth' });
                }}
                className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1.5 rounded-lg flex items-center space-x-1"
              >
                <span>↑ Quay lại mục lục</span>
              </button>
              <span className="text-[11px] text-slate-500 font-bold truncate max-w-[180px]">
                {currentTopic.title}
              </span>
            </div>

            {/* Header info */}
            <div className="border-b border-slate-100 pb-4 space-y-2">
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <span className="px-2 py-0.5 font-bold rounded bg-teal-50 text-teal-800 uppercase tracking-wider text-[10px]">
                  {currentTopic.category}
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Thời gian đọc: {currentTopic.readTime}</span>
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                {currentTopic.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 italic">
                {currentTopic.summary}
              </p>
            </div>

            {/* Markdown Content formatted */}
            <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed space-y-4">
              {currentTopic.contentMarkdown.split('\n\n').map((paragraph, index) => {
                if (paragraph.startsWith('### ')) {
                  return (
                    <h3 key={index} className="text-base font-extrabold text-slate-900 pt-2 border-b border-slate-100 pb-1">
                      {paragraph.replace('### ', '')}
                    </h3>
                  );
                }
                if (paragraph.startsWith('|')) {
                  // Table rendering
                  const rows = paragraph.trim().split('\n');
                  const headers = rows[0].split('|').filter(c => c.trim().length > 0);
                  const dataRows = rows.slice(2).map(r => r.split('|').filter(c => c.trim().length > 0));
                  return (
                    <div key={index} className="overflow-x-auto my-3">
                      <table className="min-w-full text-xs border border-slate-200 rounded-lg">
                        <thead className="bg-slate-100 text-slate-800 font-bold">
                          <tr>
                            {headers.map((h, hi) => (
                              <th key={hi} className="px-3 py-2 text-left border-b border-slate-200">
                                {h.trim()}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {dataRows.map((dr, ri) => (
                            <tr key={ri} className={ri % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'}>
                              {dr.map((c, ci) => (
                                <td key={ci} className="px-3 py-2 text-slate-700">
                                  {c.trim()}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                }
                if (paragraph.startsWith('* ') || paragraph.startsWith('1. ')) {
                  const items = paragraph.split('\n');
                  return (
                    <ul key={index} className="space-y-1.5 pl-4 list-disc text-slate-700">
                      {items.map((item, ii) => (
                        <li key={ii} className="leading-relaxed">
                          {item.replace(/^\* |^[0-9]+\. /, '')}
                        </li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <p key={index} className="text-slate-700 leading-relaxed">
                    {paragraph}
                  </p>
                );
              })}
            </div>

            {/* Key Takeaways Box */}
            <div className="mt-8 p-5 bg-teal-50/70 rounded-2xl border border-teal-200/80 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-teal-900 flex items-center space-x-1.5">
                <Lightbulb className="w-4 h-4 text-teal-600" />
                <span>Điểm Khắc Cốt Ghi Tâm Cho Bác Sĩ (Key Takeaways)</span>
              </h4>

              <div className="space-y-2">
                {currentTopic.keyTakeaways.map((takeaway, idx) => (
                  <div key={idx} className="flex items-start space-x-2 text-xs text-teal-950">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span className="font-medium leading-relaxed">{takeaway}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contextual Medical Bridges (Flowcharts & Biomarkers) */}
            {TOPIC_CROSS_LINKS[selectedTopicId] && (
              <div className="mt-6 bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 space-y-4">
                <div className="border-b border-slate-800 pb-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
                    Chuyển Tiếp Thực Hành Lâm Sàng
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-white flex items-center space-x-2 mt-0.5">
                    <GitBranch className="w-4 h-4 text-teal-400" />
                    <span>Lưu Đồ & Dấu Ấn Sinh Học Đi Kèm Chuyên Đề Này</span>
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Related Flowcharts */}
                  {TOPIC_CROSS_LINKS[selectedTopicId].flowcharts.length > 0 && (
                    <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/80 space-y-2">
                      <span className="text-[11px] font-bold text-teal-300 uppercase tracking-wider block">
                        Lưu Đồ Tiếp Cận Khuyến Nghị
                      </span>
                      {TOPIC_CROSS_LINKS[selectedTopicId].flowcharts.map((f, i) => (
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

                  {/* Related Biomarkers */}
                  {TOPIC_CROSS_LINKS[selectedTopicId].biomarkers.length > 0 && (
                    <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/80 space-y-2">
                      <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider block">
                        Tra Cứu Chỉ Số Cụ Thể
                      </span>
                      {TOPIC_CROSS_LINKS[selectedTopicId].biomarkers.map((b, i) => (
                        <button
                          key={i}
                          onClick={() => onNavigateToBiomarker?.(b.id)}
                          className="w-full text-left p-2 rounded-lg bg-slate-900/90 hover:bg-slate-700/80 border border-slate-700 hover:border-cyan-500/50 transition-all flex items-center justify-between group"
                        >
                          <div>
                            <div className="font-bold text-xs text-white group-hover:text-cyan-300 transition-colors">
                              {b.label}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {b.desc}
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
      </div>
    </div>
  );
};
