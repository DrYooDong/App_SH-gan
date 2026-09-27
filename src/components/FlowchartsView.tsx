import React, { useState } from 'react';
import { CLINICAL_ALGORITHMS, ClinicalAlgorithm, FlowchartBranch } from '../data/guidelineAlgorithms';
import { DecisionTreeFlow } from './DecisionTreeFlow';
import { 
  GitBranch, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  ArrowDown, 
  ArrowRight, 
  Layers, 
  BookOpen,
  ChevronDown,
  ShieldAlert,
  Search,
  ExternalLink,
  Activity,
  Compass,
  Table
} from 'lucide-react';

const ALGO_CROSS_LINKS: Record<string, {
  biomarkers: { id: string; label: string; desc: string }[];
  topics: { id: string; label: string; desc: string }[];
}> = {
  'algo-transaminases': {
    biomarkers: [
      { id: 'alt', label: 'ALT (SGPT)', desc: 'Men tế bào gan (bào tương, t½ 47h)' },
      { id: 'ast', label: 'AST (SGOT)', desc: 'Men ty thể (80% mAST, t½ 17h)' }
    ],
    topics: [
      { id: 'de-ritis-ratio', label: 'Chuyên đề Tỷ Số De Ritis (AST/ALT)', desc: 'Ý nghĩa ty thể vs bào tương & tiên lượng' },
      { id: 'microscopic-anatomy', label: 'Giải Phẫu Vi Thể & Tổn Thương Gan Vùng 3 (Zone 3)', desc: 'Thiếu oxy hoại tử và độc chất NAPQI' }
    ]
  },
  'algo-cholestasis': {
    biomarkers: [
      { id: 'alp', label: 'ALP (Phosphatase Kiềm)', desc: 'Enzyme vi quản mật & chỉ dấu ứ mật' },
      { id: 'ggt', label: 'GGT', desc: 'Xác nhận nguồn gốc gan của ALP (loại trừ xương)' }
    ],
    topics: [
      { id: 'cholestasis-approach', label: 'Tiếp Cận Hội Chứng Ứ Mật & Tỷ Số R-Ratio', desc: 'R-ratio chuẩn hóa ACG phân định tổn thương' }
    ]
  },
  'algo-bilirubin': {
    biomarkers: [
      { id: 'tbili', label: 'Bilirubin Toàn Phần', desc: 'Đánh giá mức độ vàng da' },
      { id: 'dbili', label: 'Bilirubin Trực Tiếp', desc: 'Phân đoạn liên hợp vs gián tiếp tự do' }
    ],
    topics: [
      { id: 'bilirubin-metabolism', label: 'Chuyển Hóa Bilirubin & Tiếp Cận Vàng Da', desc: 'Enzym UGT1A1, tán huyết vs Gilbert' }
    ]
  }
};

export interface FlowchartsViewProps {
  selectedAlgoId?: string;
  onSelectAlgo?: (algoId: string) => void;
  selectedBranchId?: string;
  onSelectBranch?: (branchId: string) => void;
  onNavigateToBiomarker?: (markerId: string) => void;
  onNavigateToTopic?: (topicId: string) => void;
  hideStandaloneHeader?: boolean;
}

export const FlowchartsView: React.FC<FlowchartsViewProps> = ({
  selectedAlgoId: propAlgoId,
  onSelectAlgo: propOnSelectAlgo,
  selectedBranchId: propBranchId,
  onSelectBranch: propOnSelectBranch,
  onNavigateToBiomarker,
  onNavigateToTopic,
  hideStandaloneHeader = false
}) => {
  const [internalAlgoId, setInternalAlgoId] = useState<string>('algo-transaminases');
  const [internalBranchId, setInternalBranchId] = useState<string>('borderline-mild');
  const [flowPresentation, setFlowPresentation] = useState<'interactive_flow' | 'branch_matrix' | 'mermaid'>('interactive_flow');

  const selectedAlgoId = propAlgoId ?? internalAlgoId;
  const selectedBranchId = propBranchId ?? internalBranchId;

  const ALGO_TO_TREE: Record<string, string> = {
    'algo-transaminases': 'tree-transaminases',
    'algo-cholestasis': 'tree-cholestasis',
    'algo-bilirubin': 'tree-bilirubin'
  };

  const currentAlgo: ClinicalAlgorithm = 
    CLINICAL_ALGORITHMS.find(a => a.id === selectedAlgoId) || CLINICAL_ALGORITHMS[0];

  const currentBranch: FlowchartBranch = 
    currentAlgo.branches.find(b => b.id === selectedBranchId) || currentAlgo.branches[0];

  const handleSelectAlgo = (algoId: string) => {
    if (propOnSelectAlgo) {
      propOnSelectAlgo(algoId);
    } else {
      setInternalAlgoId(algoId);
    }
    const algo = CLINICAL_ALGORITHMS.find(a => a.id === algoId);
    if (algo && algo.branches.length > 0) {
      if (propOnSelectBranch) {
        propOnSelectBranch(algo.branches[0].id);
      } else {
        setInternalBranchId(algo.branches[0].id);
      }
    }
  };

  const handleSelectBranch = (branchId: string) => {
    if (propOnSelectBranch) {
      propOnSelectBranch(branchId);
    } else {
      setInternalBranchId(branchId);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-5">
      
      {/* Outer Standalone Banner - rendered ONLY when NOT embedded inside KnowledgeHub */}
      {!hideStandaloneHeader && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200 uppercase tracking-wider">
                Hướng Dẫn Lâm Sàng Chuẩn Y Khoa
              </span>
              <h2 className="text-xl font-black text-slate-900 flex items-center space-x-2 mt-1">
                <GitBranch className="w-5 h-5 text-teal-600" />
                <span>Lưu Đồ Tiếp Cận Sinh Hóa Gan (ACG 2017 & WHO)</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Các cây quyết định chẩn đoán chuẩn mực giúp bác sĩ tối ưu hóa lộ trình chỉ định xét nghiệm và xử trí.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Clinical Syndrome Selector Bar & Presentation View Switcher */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* 3 Main ACG Clinical Syndromes */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Chọn Hội Chứng Lâm Sàng Khởi Điểm:
            </span>
            <div className="flex flex-wrap gap-2 pt-0.5">
              {CLINICAL_ALGORITHMS.map((algo) => {
                const isSelected = selectedAlgoId === algo.id;
                return (
                  <button
                    key={algo.id}
                    onClick={() => handleSelectAlgo(algo.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                      isSelected
                        ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20 ring-2 ring-teal-500/30'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/80'
                    }`}
                  >
                    <GitBranch className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-teal-600'}`} />
                    <span>{algo.title.replace('Lưu Đồ Tiếp Cận ', '')}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Presentation Mode Selector */}
          <div className="space-y-1 lg:text-right">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Giao Diện Khảo Sát:
            </span>
            <div className="flex items-center space-x-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 font-bold text-xs">
              <button
                onClick={() => setFlowPresentation('interactive_flow')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  flowPresentation === 'interactive_flow'
                    ? 'bg-white text-teal-700 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-teal-600" />
                <span>Cây Quyết Định</span>
              </button>

              <button
                onClick={() => setFlowPresentation('branch_matrix')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  flowPresentation === 'branch_matrix'
                    ? 'bg-white text-teal-700 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Table className="w-3.5 h-3.5 text-teal-600" />
                <span>Ma Trận Phân Nhánh</span>
              </button>

              <button
                onClick={() => setFlowPresentation('mermaid')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  flowPresentation === 'mermaid'
                    ? 'bg-white text-teal-700 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-teal-600" />
                <span>Mã Mermaid</span>
              </button>
            </div>
          </div>

        </div>

        {/* Algorithm Reference & Contextual Note */}
        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
          <div>
            <strong className="text-slate-700 font-semibold">Tài liệu tham chiếu: </strong>
            <span>{currentAlgo.sourceGuideline}</span>
          </div>
          <div className="text-[11px] text-teal-700 font-medium">
            💡 {currentAlgo.overview.slice(0, 120)}...
          </div>
        </div>
      </div>

      {/* RENDER VIEW ACCORDING TO SELECTED PRESENTATION */}
      {flowPresentation === 'interactive_flow' && (
        <DecisionTreeFlow 
          selectedTreeId={ALGO_TO_TREE[selectedAlgoId]}
          onSelectTree={(treeId) => {
            const algoKey = Object.keys(ALGO_TO_TREE).find(k => ALGO_TO_TREE[k] === treeId);
            if (algoKey) handleSelectAlgo(algoKey);
          }}
          hideHeader={true}
          viewMode="interactive"
        />
      )}

      {flowPresentation === 'mermaid' && (
        <DecisionTreeFlow 
          selectedTreeId={ALGO_TO_TREE[selectedAlgoId]}
          onSelectTree={(treeId) => {
            const algoKey = Object.keys(ALGO_TO_TREE).find(k => ALGO_TO_TREE[k] === treeId);
            if (algoKey) handleSelectAlgo(algoKey);
          }}
          hideHeader={true}
          viewMode="mermaid"
        />
      )}

      {flowPresentation === 'branch_matrix' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
              <Layers className="w-4 h-4 text-teal-600" />
              <span>{currentAlgo.title}</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Chọn nhánh để xem chi tiết
            </span>
          </div>

          {/* Branch Selector Nodes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {currentAlgo.branches.map((branch) => {
              const isSelected = selectedBranchId === branch.id;
              return (
                <div
                  key={branch.id}
                  onClick={() => handleSelectBranch(branch.id)}
                  className={`cursor-pointer rounded-2xl p-4 border-2 transition-all text-left space-y-2 relative ${
                    isSelected
                      ? 'border-teal-600 bg-teal-50/40 shadow-sm ring-2 ring-teal-500/20'
                      : 'border-slate-200 bg-slate-50/60 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`w-3 h-3 rounded-full ${
                      branch.color === 'rose'
                        ? 'bg-rose-500'
                        : branch.color === 'amber'
                        ? 'bg-amber-500'
                        : branch.color === 'emerald'
                        ? 'bg-emerald-500'
                        : branch.color === 'sky'
                        ? 'bg-sky-500'
                        : 'bg-indigo-500'
                    }`} />
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      isSelected ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {isSelected ? 'Đang chọn' : 'Xem nhánh'}
                    </span>
                  </div>

                  <h4 className="text-sm font-extrabold text-slate-900">
                    {branch.title}
                  </h4>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {branch.conditionDescription}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Selected Branch Deep-Dive Panel */}
          {currentBranch && (
            <div className="mt-6 p-5 sm:p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-5">
              <div className="border-b border-slate-200 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span>
                  <h4 className="text-base font-black text-slate-900">
                    Chi Tiết Phân Nhánh: {currentBranch.title}
                  </h4>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  <strong>Bối cảnh lâm sàng: </strong>{currentBranch.conditionDescription}
                </p>
              </div>

              {/* Steps & Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                
                {/* Clinical Actions */}
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-3">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-teal-800 flex items-center space-x-1.5 border-b border-slate-100 pb-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    <span>Khai Thác & Xử Trí Ban Đầu</span>
                  </h5>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {currentBranch.clinicalActions.map((action, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <span className="w-4 h-4 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                          {i + 1}
                        </span>
                        <span className="leading-relaxed">{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Further Investigations */}
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-3">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-blue-800 flex items-center space-x-1.5 border-b border-slate-100 pb-2">
                    <GitBranch className="w-4 h-4 text-blue-600" />
                    <span>Chỉ Định Cận Lâm Sàng Chuyên Sâu</span>
                  </h5>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {currentBranch.furtherInvestigations.map((inv, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                          {i + 1}
                        </span>
                        <span className="leading-relaxed">{inv}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Key Diagnostic Pearls */}
              <div className="bg-amber-50/70 rounded-xl p-4 border border-amber-200 text-xs space-y-1.5">
                <span className="font-bold text-amber-900 flex items-center space-x-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>Kinh Nghiệm Lâm Sàng Bỏ Túi (Diagnostic Pearls):</span>
                </span>
                <ul className="space-y-1 text-amber-950 pl-5 list-disc">
                  {currentBranch.keyDiagnosticPearls.map((pearl, i) => (
                    <li key={i} className="leading-relaxed">{pearl}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Contextual Medical Bridges (Cross-navigation to Biomarkers & Guide) - RENDERED IN ALL MODES */}
      {ALGO_CROSS_LINKS[selectedAlgoId] && (
        <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 border border-slate-800 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
                Mạng Lưới Tri Thức Đồng Bộ
              </span>
              <h4 className="text-sm font-bold text-white flex items-center space-x-2 mt-0.5">
                <Activity className="w-4 h-4 text-teal-400" />
                <span>Chỉ Số Xét Nghiệm & Chuyên Đề Đọc Thêm Cho Hội Chứng Này</span>
              </h4>
            </div>
            <span className="text-[11px] text-slate-400">
              Nhấp để chuyển trực tiếp đến thư viện phân tích chuyên sâu
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Linked Biomarkers */}
            <div className="bg-slate-800/80 rounded-xl p-3.5 border border-slate-700/80 space-y-2">
              <span className="text-xs font-bold text-teal-300 flex items-center space-x-1.5">
                <Search className="w-3.5 h-3.5 text-teal-400" />
                <span>Tra Cứu Nhanh Dấu Ấn Sinh Học Phân Tử</span>
              </span>
              <div className="space-y-2">
                {ALGO_CROSS_LINKS[selectedAlgoId].biomarkers.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => onNavigateToBiomarker?.(b.id)}
                    className="w-full text-left p-2.5 rounded-lg bg-slate-900/90 hover:bg-slate-700/80 border border-slate-700 hover:border-teal-500/50 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div>
                      <div className="font-bold text-xs text-white group-hover:text-teal-300 transition-colors">
                        {b.label}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {b.desc}
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-300 shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>

            {/* Linked Guide Topics */}
            <div className="bg-slate-800/80 rounded-xl p-3.5 border border-slate-700/80 space-y-2">
              <span className="text-xs font-bold text-cyan-300 flex items-center space-x-1.5">
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                <span>Chuyên Đề Đọc Sâu WHO & ACG</span>
              </span>
              <div className="space-y-2">
                {ALGO_CROSS_LINKS[selectedAlgoId].topics.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => onNavigateToTopic?.(t.id)}
                    className="w-full text-left p-2.5 rounded-lg bg-slate-900/90 hover:bg-slate-700/80 border border-slate-700 hover:border-cyan-500/50 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div>
                      <div className="font-bold text-xs text-white group-hover:text-cyan-300 transition-colors">
                        {t.label}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {t.desc}
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-300 shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
