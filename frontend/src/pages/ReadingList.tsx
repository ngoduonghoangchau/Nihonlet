import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import api from '../api/axios';
import { 
  ArrowLeft, 
  Filter, 
  BookOpen, 
  PlayCircle, 
  Star, 
  Loader2,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  ChevronRight,
  ChevronLeft, // Thêm icon cho phân trang
  FileText
} from 'lucide-react';

// --- Interfaces ---
interface ReadingCategoryDto {
  readingCategoryId?: number;
  ReadingCategoryId?: number;
  catId?: number;
  CatId?: number;
  id?: number;
  Id?: number;
  nameVi: string;
  nameJp: string;
  description?: string;
}

interface ReadingArticleDto {
  articleId: number;
  titleJp: string;
  titleVi: string;
  contentJp: string;
  contentFurigana?: string;
  level: string;
  catId: number;
  contentVi: string;
  status: 'Unlocked' | 'Locked';
}

interface OptionDto {
  optionId: number;
  optionText: string;
  isCorrect?: boolean;
}

interface QuestionDto {
  questionId: number;
  questionText: string;
  explanation?: string;
  options: OptionDto[];
}

const ReadingList: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentLevel = searchParams.get('level') || 'N5';
  const urlCatId = searchParams.get('catId');
  const selectedCatId = urlCatId && !isNaN(Number(urlCatId)) ? Number(urlCatId) : undefined;

  const [categories, setCategories] = useState<ReadingCategoryDto[]>([]);
  const [articles, setArticles] = useState<ReadingArticleDto[]>([]);
  const [loading, setLoading] = useState(true);

  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [questionsMap, setQuestionsMap] = useState<Record<number, QuestionDto[]>>({});
  const [loadingQ, setLoadingQ] = useState<Record<number, boolean>>({});
  
  // STATE MỚI: Trạng thái đóng/mở của bộ lọc chủ đề
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // STATE PHÂN TRANG
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const getCategoryId = (c: ReadingCategoryDto) => c.readingCategoryId || c.ReadingCategoryId || c.catId || c.CatId || c.id || c.Id;
  const selectedCategory = categories.find(c => getCategoryId(c) === selectedCatId);

  // 1. Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/Reading/categories');
        setCategories(response.data || []);
      } catch (error) {
        console.error("Lỗi khi tải danh mục:", error);
      }
    };
    fetchCategories();
  }, []);

  // 2. Fetch Articles
  useEffect(() => {
    const fetchArticles = async () => {
      if (selectedCatId === undefined) return;
      setLoading(true);
      try {
        const articleParams: any = { level: currentLevel };
        if (selectedCatId !== undefined) {
          articleParams.catId = selectedCatId;
        }
        const response = await api.get('/Reading/articles', { params: articleParams });
        setArticles(response.data || []);
        setCurrentPage(1); // Reset về trang 1 khi lấy dữ liệu mới
      } catch (error) {
        console.error("Lỗi khi tải danh sách bài đọc:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, [currentLevel, selectedCatId]);

  const handleCategorySelect = (catId: number | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (catId === null) {
      newParams.delete('catId');
    } else {
      newParams.set('catId', catId.toString());
    }
    setExpandedId(null);
    setIsFilterOpen(false); // Tự động đóng bộ lọc trên mobile sau khi chọn xong
    setCurrentPage(1); // Reset về trang 1 khi đổi bộ lọc
    setSearchParams(newParams);
  };

  // Render Furigana Tối ưu
  const renderFurigana = (jsonString: string | undefined, fallback: string) => {
    if (!jsonString) return <span>{fallback}</span>;
    try {
      const parts = JSON.parse(jsonString);
      return parts.map((part: any, index: number) => {
        if (typeof part === 'string') return <span key={index}>{part}</span>;
        return (
          <ruby key={index} className="mx-[1px]">
            {part.k}
            <rt className="font-bold text-primary opacity-90 tracking-tighter">{part.f}</rt>
          </ruby>
        );
      });
    } catch (e) {
      return <span>{fallback}</span>;
    }
  };

  const toggleExpand = async (articleId: number) => {
    if (expandedId === articleId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(articleId);
    if (!questionsMap[articleId]) {
      setLoadingQ(prev => ({ ...prev, [articleId]: true }));
      try {
        const res = await api.get(`/Reading/articles/${articleId}/questions`);
        setQuestionsMap(prev => ({ ...prev, [articleId]: res.data || [] }));
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingQ(prev => ({ ...prev, [articleId]: false }));
      }
    }
  };

  // Tính toán dữ liệu phân trang
  const indexOfLastArticle = currentPage * itemsPerPage;
  const indexOfFirstArticle = indexOfLastArticle - itemsPerPage;
  const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);
  const totalPages = Math.ceil(articles.length / itemsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- TRẠNG THÁI TRỐNG ---
  if (selectedCatId === undefined) {
    return (
      <div className="bg-[#FCF8FA] min-h-screen flex flex-col font-display text-[#1b0d14]">
        <Header />
        <div className="flex-grow flex flex-col items-center justify-center p-4">
            <div className="text-center max-w-md bg-white p-10 md:p-12 rounded-[2.5rem] shadow-xl border-2 border-[#f3e7ed] animate-in zoom-in-95 duration-500">
                <div className="bg-[#fcf8fa] w-24 h-24 rounded-[2rem] flex items-center justify-center text-primary mx-auto mb-6 shadow-inner">
                    <BookOpen className="w-12 h-12" />
                </div>
                <h2 className="text-xl md:text-2xl font-black text-[#1b0d14] mb-3">Chưa có chủ đề</h2>
                <p className="text-[#9a4c73] font-medium mb-8">Bạn cần chọn một chủ đề cụ thể từ Thư viện để bắt đầu luyện đọc.</p>
                <button 
                    onClick={() => navigate(`/reading-topics?level=${currentLevel}`)}
                    className="bg-primary text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 w-full"
                >
                    <ArrowLeft size={20} /> Quay lại danh mục
                </button>
            </div>
        </div>
      </div>
    );
  }

  // --- MÀN HÌNH CHÍNH ---
  return (
    <div className="bg-[#FCF8FA] min-h-screen flex flex-col font-display text-[#1b0d14]">
      <style>{`
        ruby { display: inline-flex; flex-direction: column-reverse; vertical-align: bottom; line-height: 2.2; }
        rt { display: block; line-height: 1; font-size: 0.55em; text-align: center; margin-bottom: 2px; transform: translateY(15%); }
        /* Tùy chỉnh thanh cuộn cho Sidebar */
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #f3e7ed; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #e7cfdb; }
      `}</style>
      
      <Header />

      <main className="flex-grow max-w-[1200px] mx-auto px-4 md:px-6 py-8 md:py-12 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* --- Tiêu đề & Breadcrumb --- */}
        <div className="mb-8 md:mb-12">
          <button 
            onClick={() => navigate(`/reading-topics?level=${currentLevel}`)}
            className="group inline-flex items-center gap-2 text-[#9a4c73] hover:text-primary font-bold text-sm mb-6 transition-colors bg-white px-4 py-2 rounded-xl border-2 border-[#f3e7ed] hover:border-primary/30 shadow-sm"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Quay lại Chủ đề
          </button>

          <div className="flex flex-col gap-2">
            <nav className="flex flex-wrap items-center gap-2 text-[#9a4c73] text-[10px] md:text-xs mb-1 font-medium uppercase tracking-wider">
              <span>Đọc hiểu</span>
              <ChevronRight size={12} />
              <span>Level {currentLevel}</span>
              <ChevronRight size={12} />
              <span className="font-black text-primary">Danh sách bài đọc</span>
            </nav>
            {/* GIẢM CỠ CHỮ TIÊU ĐỀ TRANG (text-3xl -> text-2xl, md:text-5xl -> md:text-4xl) */}
            <h2 className="text-2xl md:text-4xl font-black text-[#1b0d14] tracking-tight">
              {selectedCategory ? selectedCategory.nameVi : `Bài đọc ${currentLevel}`}
            </h2>
          </div>
        </div>

        {/* --- Layout Chia Cột --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          
          {/* SIDEBAR: Bộ Lọc (ĐÃ ĐƯỢC GỘP LẠI) */}
          <aside className="lg:col-span-4 xl:col-span-3">
            <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-sm p-4 md:p-6 border-2 border-[#f3e7ed] lg:sticky lg:top-24 z-10">
              {/* Header có thể click trên mobile để mở/đóng */}
              <div 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center justify-between cursor-pointer lg:cursor-default"
              >
                <h3 className="font-black text-sm md:text-base flex items-center gap-2 text-[#1b0d14] uppercase tracking-wider">
                  <Filter size={20} className="text-primary" /> Lọc chủ đề
                </h3>
                {/* Nút mũi tên chỉ hiện trên điện thoại */}
                <button className="lg:hidden p-1.5 bg-[#fcf8fa] text-primary rounded-xl transition-transform">
                  {isFilterOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
              </div>

              {/* Danh sách chủ đề - Ẩn trên mobile, hiện trên PC */}
              <div className={`mt-4 ${isFilterOpen ? 'block' : 'hidden lg:block'} animate-in fade-in slide-in-from-top-2`}>
                <ul className="space-y-2 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                  {categories.map((t) => {
                    const categoryId = getCategoryId(t);
                    if (!categoryId) return null;
                    
                    const isActive = selectedCatId === categoryId;
                    
                    return (
                      <li key={categoryId}>
                        <button 
                          onClick={() => handleCategorySelect(categoryId)}
                          className={`w-full flex items-center justify-between p-3 md:p-4 rounded-2xl transition-all font-bold text-sm md:text-base border-2 ${
                            isActive 
                            ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-[1.02]' 
                            : 'bg-white border-transparent text-[#9a4c73] hover:bg-[#fcf8fa] hover:border-[#f3e7ed]'
                          }`}
                        >
                          <span className="text-left line-clamp-1">{t.nameVi}</span>
                          {isActive && <ChevronRight size={18} />}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT: Danh sách bài tập */}
          <div className="lg:col-span-8 xl:col-span-9">
            {loading ? (
              <div className="flex flex-col justify-center items-center py-20 bg-white rounded-[2rem] border-2 border-[#f3e7ed]">
                <Loader2 className="animate-spin text-primary mb-4" size={48} />
                <p className="text-[#9a4c73] font-bold">Đang tải bài đọc...</p>
              </div>
            ) : articles.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[2rem] border-2 border-dashed border-[#e7cfdb] text-center">
                <FileText size={64} className="text-[#e7cfdb] mb-4" />
                <h3 className="text-lg md:text-xl font-black text-[#1b0d14] mb-2">Chưa có dữ liệu</h3>
                <p className="text-[#9a4c73] font-medium">Hiện tại chưa có bài đọc nào được cập nhật cho chủ đề này.</p>
              </div>
            ) : (
              <div className="space-y-4 md:space-y-6">
                {currentArticles.map((article, idx) => {
                  const isExpanded = expandedId === article.articleId;
                  const questions = questionsMap[article.articleId] || [];
                  const isLoadingQ = loadingQ[article.articleId];
                  const absoluteIndex = indexOfFirstArticle + idx + 1;

                  return (
                    <div 
                      key={article.articleId} 
                      className={`group bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-sm border-2 transition-all duration-300 ${
                        isExpanded ? 'border-primary shadow-lg shadow-primary/10' : 'border-[#f3e7ed] hover:border-primary/50'
                      }`}
                    >
                      {/* HEADER CARD */}
                      <div 
                        onClick={() => toggleExpand(article.articleId)}
                        className="p-4 md:p-6 flex items-start sm:items-center gap-3 md:gap-4 cursor-pointer relative"
                      >
                        <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center shrink-0 font-black text-lg md:text-xl transition-colors ${
                          isExpanded ? 'bg-primary text-white shadow-md' : 'bg-[#fcf8fa] text-primary'
                        }`}>
                          {absoluteIndex}
                        </div>
                        
                        <div className="flex-grow min-w-0 pr-2">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`flex items-center text-[10px] md:text-xs font-black uppercase tracking-widest px-2 py-1 rounded-lg ${article.level === 'N5' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                              <Star size={12} className="mr-1 fill-current" /> {article.level}
                            </span>
                          </div>
                          {/* GIẢM CỠ CHỮ BÀI ĐỌC (text-lg -> text-base, md:text-2xl -> md:text-xl) */}
                          <h4 className={`text-base md:text-xl font-black transition-colors leading-tight mb-1 truncate md:whitespace-normal ${isExpanded ? 'text-primary' : 'text-[#1b0d14]'}`}>
                            {article.titleJp}
                          </h4>
                          <p className="text-xs md:text-sm text-[#9a4c73] font-medium truncate">{article.titleVi}</p>
                        </div>

                        <div className="shrink-0 self-center flex items-center gap-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/reading-exercise/${article.articleId}`, { state: { catId: article.catId || selectedCatId } });
                            }}
                            className="flex items-center gap-1.5 md:gap-2 bg-primary text-white px-3 py-2 md:px-5 md:py-2.5 rounded-xl font-black text-[10px] md:text-sm shadow-md shadow-primary/20 hover:scale-105 active:scale-95 transition-all z-10"
                          >
                            <PlayCircle size={16} className="md:w-5 md:h-5" />
                            <span className="hidden sm:inline">Vào học</span>
                          </button>
                          <button className={`hidden md:flex p-2 md:p-2.5 rounded-full transition-all ${
                            isExpanded ? 'bg-pink-100 text-primary rotate-180' : 'bg-[#fcf8fa] text-[#9a4c73] group-hover:bg-pink-100'
                          }`}>
                            <ChevronDown size={20} className="w-5 h-5 md:w-6 md:h-6" />
                          </button>
                        </div>
                      </div>

                      {/* EXPANDED CONTENT */}
                      {isExpanded && (
                        <div className="px-5 md:px-8 pb-6 md:pb-8 border-t-2 border-dashed border-[#f3e7ed] pt-6 animate-in fade-in slide-in-from-top-4 duration-500">
                          
                          {/* Khung bài đọc */}
                          <div className="mb-8 bg-[#fcf8fa] p-5 md:p-8 rounded-[1.5rem] border-2 border-[#f3e7ed] shadow-inner relative">
                            <h5 className="font-black text-sm uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                              <BookOpen size={18} /> Xem trước bài đọc
                            </h5>
                            
                            <div className="text-lg md:text-2xl text-[#1b0d14] font-medium tracking-wide break-words text-justify md:text-left mb-6">
                              {renderFurigana(article.contentFurigana, article.contentJp)}
                            </div>
                            
                            <div className="border-t-2 border-dashed border-[#e7cfdb] pt-4 mt-4">
                              <p className="text-[#9a4c73] text-sm md:text-base italic font-medium leading-relaxed">
                                {article.contentVi}
                              </p>
                            </div>
                          </div>

                          {/* Khung Câu hỏi */}
                          <div>
                            <h5 className="font-black text-sm uppercase tracking-widest text-[#1b0d14] mb-5 flex items-center gap-2">
                              <HelpCircle size={18} className="text-primary" /> Câu hỏi ({questions.length})
                            </h5>
                            
                            {isLoadingQ ? (
                              <div className="flex justify-center py-6"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>
                            ) : (
                              <div className="grid grid-cols-1 gap-4">
                                {questions.map((q, qIdx) => (
                                  <div key={q.questionId} className="bg-white p-4 md:p-5 rounded-2xl border-2 border-[#f3e7ed] shadow-sm">
                                    <p className="font-black text-[#1b0d14] mb-3 text-sm md:text-base">
                                      <span className="text-primary mr-1">{qIdx + 1}.</span> {q.questionText}
                                    </p>
                                    <div className="flex flex-col gap-2">
                                      {q.options.map(opt => (
                                        <div 
                                          key={opt.optionId} 
                                          className={`p-3 rounded-xl border-2 text-xs md:text-sm transition-colors ${
                                            opt.isCorrect 
                                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-bold' 
                                            : 'bg-[#fcf8fa] border-transparent text-[#64324d] font-medium'
                                          }`}
                                        >
                                          {opt.optionText}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          {/* Nút To - Chuyển sang thi chính thức */}
                          <div className="mt-8 flex justify-center md:justify-end">
                             <button 
                               onClick={() => navigate(`/reading-exercise/${article.articleId}`, { state: { catId: article.catId || selectedCatId } })}
                               className="w-full md:w-auto bg-primary hover:brightness-110 text-white px-8 py-4 md:py-5 rounded-2xl font-black shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-2 active:scale-95 text-base md:text-lg"
                             >
                               <PlayCircle className="w-6 h-6" /> Vào phòng thi chính thức
                             </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* --- THANH PHÂN TRANG --- */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8 animate-in fade-in">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 md:p-3 rounded-xl border-2 border-[#f3e7ed] text-[#9a4c73] hover:border-primary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all bg-white"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <div className="flex gap-2">
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => paginate(i + 1)}
                          className={`w-10 h-10 md:w-12 md:h-12 rounded-xl font-black text-sm md:text-base transition-all duration-300 ${
                            currentPage === i + 1
                              ? 'bg-primary text-white shadow-md border-2 border-primary'
                              : 'bg-white border-2 border-[#f3e7ed] text-[#9a4c73] hover:border-primary/50'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 md:p-3 rounded-xl border-2 border-[#f3e7ed] text-[#9a4c73] hover:border-primary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all bg-white"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReadingList;