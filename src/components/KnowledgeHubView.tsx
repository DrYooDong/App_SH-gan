import React, { useState } from 'react';
import { FlowchartsView } from './FlowchartsView';
import { GuideView } from './GuideView';
import { BiomarkersView } from './BiomarkersView';
import { CLINICAL_ALGORITHMS } from '../data/guidelineAlgorithms';
import { KNOWLEDGE_TOPICS } from '../data/referenceKnowledge';
import { BIOMARKER_DICTIONARY } from '../data/biomarkerData';
import { 
  GitBranch, 
  BookOpen, 
  Activity, 
  Search, 
  X, 
  ArrowLeft, 
  Compass, 
  Sparkles,
  Layers,
  ChevronRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export type KnowledgeSubTab = 'flowcharts' | 'guide' | 'biomarkers';

interface NavigationHistoryItem {
  tab: KnowledgeSubTab;
  label: string;
  itemTitle?: string;
}

export const KnowledgeHubView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<KnowledgeSubTab>('flowcharts');
  
  // Selection states for sub-views
  const [selectedAlgoId, setSelectedAlgoId] = useState<string>('algo-transaminases');
  const [selectedBranchId, setSelectedBranchId] = useState<string>('borderline-mild');
  const [selectedTopicId, setSelectedTopicId] = useState<string>(KNOWLEDGE_TOPICS[0].id);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string>(BIOMARKER_DICTIONARY[0].id);

  // Cross-navigation history breadcrumb
  const [historyTrail, setHistoryTrail] = useState<NavigationHistoryItem | null>(null);

  // Global search query
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);

  // Cross navigation handlers
  const handleNavigateToFlowchart = (algoId: string, branchId?: string) => {
    const prevItemTitle = activeSubTab === 'guide' 
      ? KNOWLEDGE_TOPICS.find(t => t.id === selectedTopicId)?.title
      : BIOMARKER_DICTIONARY.find(m => m.id === selectedMarkerId)?.code;

    setHistoryTrail({
      tab: activeSubTab,
      label: activeSubTab === 'guide' ? 'Chuyên Đề' : 'Từ Điển Chỉ Số',
      itemTitle: prevItemTitle
    });

    setSelectedAlgoId(algoId);
    if (branchId) {
      setSelectedBranchId(branchId);
    } else {
      const algo = CLINICAL_ALGORITHMS.find(a => a.id === algoId);
      if (algo && algo.branches.length > 0) {
        setSelectedBranchId(algo.branches[0].id);
      }
    }
    setActiveSubTab('flowcharts');
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  const handleNavigateToTopic = (topicId: string) => {
    const prevItemTitle = activeSubTab === 'flowcharts'
      ? CLINICAL_ALGORITHMS.find(a => a.id === selectedAlgoId)?.title
      : BIOMARKER_DICTIONARY.find(m => m.id === selectedMarkerId)?.code;

    setHistoryTrail({
      tab: activeSubTab,
      label: activeSubTab === 'flowcharts' ? 'Lưu Đồ' : 'Từ Điển Chỉ Số',
      itemTitle: prevItemTitle
    });

    setSelectedTopicId(topicId);
    setActiveSubTab('guide');
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  const handleNavigateToBiomarker = (markerId: string) => {
    const prevItemTitle = activeSubTab === 'flowcharts'
      ? CLINICAL_ALGORITHMS.find(a => a.id === selectedAlgoId)?.title
      : KNOWLEDGE_TOPICS.find(t => t.id === selectedTopicId)?.title;

    setHistoryTrail({
      tab: activeSubTab,
      label: activeSubTab === 'flowcharts' ? 'Lưu Đồ' : 'Chuyên Đề',
      itemTitle: prevItemTitle
    });

    setSelectedMarkerId(markerId);
    setActiveSubTab('biomarkers');
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  const handleBackToHistory = () => {
    if (historyTrail) {
      setActiveSubTab(historyTrail.tab);
      setHistoryTrail(null);
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }
  };

  // Global search filtering across all three data domains
  const searchClean = globalSearch.trim().toLowerCase();
  const searchResults = searchClean.length >= 2 ? {
    algorithms: CLINICAL_ALGORITHMS.filter(a => 
      a.title.toLowerCase().includes(searchClean) ||
      a.overview.toLowerCase().includes(searchClean) ||
      a.branches.some(b => b.title.toLowerCase().includes(searchClean) || b.conditionDescription.toLowerCase().includes(searchClean))
    ),
    topics: KNOWLEDGE_TOPICS.filter(t => 
      t.title.toLowerCase().includes(searchClean) ||
      t.summary.toLowerCase().includes(searchClean) ||
      t.category.toLowerCase().includes(searchClean)
    ),
    biomarkers: BIOMARKER_DICTIONARY.filter(m => 
      m.code.toLowerCase().includes(searchClean) ||
      m.nameVi.toLowerCase().includes(searchClean) ||
      m.nameEn.toLowerCase().includes(searchClean) ||
      m.cellularOrigin.toLowerCase().includes(searchClean) ||
      m.causesOfElevation.some(c => c.toLowerCase().includes(searchClean))
    )
  } : null;

  const totalResultsCount = searchResults 
    ? searchResults.algorithms.length + searchResults.topics.length + searchResults.biomarkers.length 
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Consolidated Master Hub Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200 uppercase tracking-wider">
                Thư Viện Tri Thức & Tra Cứu Y Khoa Toàn Diện
              </span>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                ACG 2017 & WHO Training
              </span>
            </div>
            
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center space-x-2.5 tracking-tight">
              <Compass className="w-6 h-6 text-teal-600 shrink-0" />
              <span>Cẩm Nang & Lưu Đồ Sinh Hóa Gan Lâm Sàng</span>
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Tích hợp đồng bộ 3 trụ cột chuyên môn: <strong>Lưu Đồ Tiếp Cận</strong> (Cây quyết định ACG), <strong>Hướng Dẫn Đọc LFTs</strong> (Chuyên đề chuyên sâu WHO Session 4) và <strong>Giải Thích Chỉ Số</strong> (Từ điển sinh học phân tử & bẫy xét nghiệm).
            </p>
          </div>

          {/* Master Global Search Bar */}
          <div className="relative w-full lg:w-80 shrink-0">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={globalSearch}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Tra cứu toàn thư viện (ALT, De Ritis, ứ mật, Zone 3, sỏi...)"
                className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 focus:bg-white focus:outline-none transition-all placeholder:text-slate-400 font-medium"
              />
              {globalSearch && (
                <button 
                  onClick={() => setGlobalSearch('')}
                  className="absolute right-2.5 top-2.5 p-0.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Live Search Quick Results Dropdown */}
            {searchResults && isSearchFocused && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-slate-900 text-white rounded-2xl shadow-xl border border-slate-700/80 p-3 z-50 max-h-96 overflow-y-auto space-y-3">
                <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 border-b border-slate-800 pb-2">
                  <span>Kết quả tìm kiếm cho: <strong>"{globalSearch}"</strong></span>
                  <span className="font-bold text-teal-400">{totalResultsCount} kết quả</span>
                </div>

                {totalResultsCount === 0 ? (
                  <div className="py-4 text-center text-xs text-slate-400">
                    Không tìm thấy nội dung phù hợp. Hãy thử từ khóa khác như "ALT", "De Ritis", "Ứ mật", "Bilirubin"...
                  </div>
                ) : (
                  <>
                    {/* Flowcharts Results */}
                    {searchResults.algorithms.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider px-1">
                          Lưu Đồ Quyết Định ({searchResults.algorithms.length})
                        </span>
                        {searchResults.algorithms.map((algo) => (
                          <button
                            key={algo.id}
                            onClick={() => {
                              setSelectedAlgoId(algo.id);
                              setActiveSubTab('flowcharts');
                              setIsSearchFocused(false);
                            }}
                            className="w-full text-left p-2 rounded-lg bg-slate-800 hover:bg-slate-700/90 text-xs flex items-center justify-between transition-colors group"
                          >
                            <div>
                              <div className="font-bold text-white group-hover:text-teal-300">
                                {algo.title}
                              </div>
                              <div className="text-[10px] text-slate-400 line-clamp-1">
                                {algo.subtitle}
                              </div>
                            </div>
                            <GitBranch className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-300 shrink-0 ml-2" />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Guide Topics Results */}
                    {searchResults.topics.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider px-1">
                          Chuyên Đề Hướng Dẫn ({searchResults.topics.length})
                        </span>
                        {searchResults.topics.map((t) => (
                          <button
                            key={t.id}
                            onClick={() => {
                              setSelectedTopicId(t.id);
                              setActiveSubTab('guide');
                              setIsSearchFocused(false);
                            }}
                            className="w-full text-left p-2 rounded-lg bg-slate-800 hover:bg-slate-700/90 text-xs flex items-center justify-between transition-colors group"
                          >
                            <div>
                              <div className="font-bold text-white group-hover:text-cyan-300">
                                {t.title}
                              </div>
                              <div className="text-[10px] text-slate-400 line-clamp-1">
                                {t.summary}
                              </div>
                            </div>
                            <BookOpen className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-300 shrink-0 ml-2" />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Biomarkers Results */}
                    {searchResults.biomarkers.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider px-1">
                          Từ Điển Chỉ Số ({searchResults.biomarkers.length})
                        </span>
                        {searchResults.biomarkers.map((m) => (
                          <button
                            key={m.id}
                            onClick={() => {
                              setSelectedMarkerId(m.id);
                              setActiveSubTab('biomarkers');
                              setIsSearchFocused(false);
                            }}
                            className="w-full text-left p-2 rounded-lg bg-slate-800 hover:bg-slate-700/90 text-xs flex items-center justify-between transition-colors group"
                          >
                            <div>
                              <div className="font-bold text-white group-hover:text-amber-300">
                                {m.code} - {m.nameVi}
                              </div>
                              <div className="text-[10px] text-slate-400 line-clamp-1">
                                {m.cellularOrigin}
                              </div>
                            </div>
                            <Activity className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-300 shrink-0 ml-2" />
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

        </div>

        {/* 3 Pillars Segmented Master Control Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          
          {/* Tab 1: Flowcharts */}
          <button
            onClick={() => {
              setActiveSubTab('flowcharts');
              setHistoryTrail(null);
            }}
            className={`p-4 rounded-2xl border text-left transition-all relative ${
              activeSubTab === 'flowcharts'
                ? 'border-teal-600 bg-teal-50/50 shadow-sm ring-2 ring-teal-500/20'
                : 'border-slate-200 bg-slate-50/60 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold transition-all ${
                activeSubTab === 'flowcharts' ? 'bg-teal-600 text-white shadow-sm' : 'bg-slate-200 text-slate-700'
              }`}>
                <GitBranch className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                3 Lưu Đồ ACG
              </span>
            </div>
            <div className="text-sm font-extrabold text-slate-900">
              1. Lưu Đồ Tiếp Cận
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
              Transaminases, ứ mật ALP/GGT, vàng da & Bilirubin
            </p>
          </button>

          {/* Tab 2: Guide */}
          <button
            onClick={() => {
              setActiveSubTab('guide');
              setHistoryTrail(null);
            }}
            className={`p-4 rounded-2xl border text-left transition-all relative ${
              activeSubTab === 'guide'
                ? 'border-teal-600 bg-teal-50/50 shadow-sm ring-2 ring-teal-500/20'
                : 'border-slate-200 bg-slate-50/60 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold transition-all ${
                activeSubTab === 'guide' ? 'bg-teal-600 text-white shadow-sm' : 'bg-slate-200 text-slate-700'
              }`}>
                <BookOpen className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                6 Chuyên Đề Sâu
              </span>
            </div>
            <div className="text-sm font-extrabold text-slate-900">
              2. Hướng Dẫn Đọc LFTs
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
              Giải phẫu Zone 1-3, De Ritis, R-ratio, bẫy xét nghiệm
            </p>
          </button>

          {/* Tab 3: Biomarkers */}
          <button
            onClick={() => {
              setActiveSubTab('biomarkers');
              setHistoryTrail(null);
            }}
            className={`p-4 rounded-2xl border text-left transition-all relative ${
              activeSubTab === 'biomarkers'
                ? 'border-teal-600 bg-teal-50/50 shadow-sm ring-2 ring-teal-500/20'
                : 'border-slate-200 bg-slate-50/60 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold transition-all ${
                activeSubTab === 'biomarkers' ? 'bg-teal-600 text-white shadow-sm' : 'bg-slate-200 text-slate-700'
              }`}>
                <Activity className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                9 Chỉ Số Phân Tử
              </span>
            </div>
            <div className="text-sm font-extrabold text-slate-900">
              3. Giải Thích Chỉ Số
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
              ALT, AST, ALP, GGT, Bilirubin, Albumin, INR, CK, PLT
            </p>
          </button>

        </div>

        {/* Dynamic Context Breadcrumb / Back Button */}
        {historyTrail && (
          <div className="bg-slate-100 border border-slate-300 rounded-xl p-3 flex items-center justify-between text-xs animate-in fade-in duration-200">
            <div className="flex items-center space-x-2 text-slate-700">
              <span className="font-semibold text-slate-900">Chuyển tiếp ngữ cảnh:</span>
              <span>Đang duyệt qua từ <em>{historyTrail.label}</em></span>
              {historyTrail.itemTitle && (
                <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  {historyTrail.itemTitle}
                </span>
              )}
            </div>
            <button
              onClick={handleBackToHistory}
              className="flex items-center space-x-1.5 px-3 py-1 bg-white hover:bg-slate-200 text-slate-800 font-bold rounded-lg border border-slate-300 transition-all shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại {historyTrail.label}</span>
            </button>
          </div>
        )}

      </div>

      {/* Render Active Sub-View with coordinated states */}
      <div className="pt-1">
        {activeSubTab === 'flowcharts' && (
          <FlowchartsView
            selectedAlgoId={selectedAlgoId}
            onSelectAlgo={setSelectedAlgoId}
            selectedBranchId={selectedBranchId}
            onSelectBranch={setSelectedBranchId}
            onNavigateToBiomarker={handleNavigateToBiomarker}
            onNavigateToTopic={handleNavigateToTopic}
            hideStandaloneHeader={true}
          />
        )}

        {activeSubTab === 'guide' && (
          <GuideView
            selectedTopicId={selectedTopicId}
            onSelectTopic={setSelectedTopicId}
            onNavigateToFlowchart={handleNavigateToFlowchart}
            onNavigateToBiomarker={handleNavigateToBiomarker}
            hideStandaloneHeader={true}
          />
        )}

        {activeSubTab === 'biomarkers' && (
          <BiomarkersView
            activeMarkerId={selectedMarkerId}
            onSelectMarker={setSelectedMarkerId}
            onNavigateToFlowchart={handleNavigateToFlowchart}
            onNavigateToTopic={handleNavigateToTopic}
            hideStandaloneHeader={true}
          />
        )}
      </div>

    </div>
  );
};
