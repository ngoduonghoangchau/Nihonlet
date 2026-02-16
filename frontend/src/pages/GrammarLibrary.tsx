import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import {
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Sparkles,
  Star,
  ArrowRight,
  Loader2,
  BookOpen,
  MoreHorizontal,
  Trophy
} from 'lucide-react';
import api from '../api/axios';

interface GrammarTopic {
  id?: number;
  topicId?: number;
  title: string;
  level: string;
  description: string;
  status: "Completed" | "Learning" | "NotStarted";
  progressPercent: number;
}

const GrammarLibrary: React.FC = () => {
  const navigate = useNavigate();
  const [activeLevel, setActiveLevel] = useState<'N5' | 'N4'>('N5');
  const [topics, setTopics] = useState<GrammarTopic[]>([]);
  const [loading, setLoading] = useState(true);

  // --- CÀI ĐẶT PHÂN TRANG (CỐ ĐỊNH 10 BÀI/TRANG) ---
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; 

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setLoading(true);
        const response = await api.get('/Grammar/topics', {
          params: { level: activeLevel }
        });
        // Hỗ trợ cả 2 trường hợp API trả về (có phân trang hoặc mảng phẳng)
        setTopics(response.data.items || response.data);
      } catch (error) {
        console.error("Lỗi gọi API:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, [activeLevel]);

  // --- LOGIC PHÂN TRANG FRONTEND ---
  // Cần lọc các topic hợp lệ trước khi tính toán
  const validTopics = topics.filter(t => t.id || t.topicId);
  const totalPages = Math.ceil(validTopics.length / pageSize);
  const indexOfLastItem = currentPage * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;
  const currentTopics = validTopics.slice(indexOfFirstItem, indexOfLastItem);

  const overallProgress = currentTopics.length > 0 
    ? Math.round(currentTopics.reduce((acc, curr) => acc + curr.progressPercent, 0) / currentTopics.length) 
    : 0;

  const getStatusUI = (topic: GrammarTopic) => {
    switch (topic.status) {
      case "Completed":
        return { label: "Xong", color: "bg-green-100 text-green-600", icon: <CheckCircle2 size={20} /> };
      case "Learning":
        return { label: "Học dở", color: "bg-pink-50 text-primary", icon: <Sparkles size={20} /> };
      default:
        return { label: "Mới", color: "bg-blue-100 text-blue-600", icon: <Star size={20} /> };
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const shift = window.innerWidth < 768 ? 1 : 2; 
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - shift && i <= currentPage + shift)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
    return pages;
  };

  return (
    <div className="bg-[#fcf8fa] min-h-screen flex flex-col font-display text-[#1b0d14]">
      <Header />
      <main className="flex-grow px-4 md:px-8">
        <div className="max-w-[1000px] mx-auto py-6 md:py-12">
          
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6 mb-8 text-center md:text-left">
              <div>
                <nav className="flex items-center justify-center md:justify-start gap-2 text-[#9a4c73] text-xs mb-2 uppercase font-bold">
                  <span>Học tập</span> <ChevronRight size={12} /> <span className="text-[#1b0d14]">Ngữ pháp</span>
                </nav>
                <h2 className="text-3xl md:text-5xl font-black text-[#1b0d14]">Thư viện {activeLevel}</h2>
              </div>
              
              <div className="flex w-full md:w-auto gap-2 bg-white p-1.5 rounded-2xl border-2 border-[#f3e7ed] shadow-sm">
                {(['N5', 'N4'] as const).map((lvl) => (
                  <button key={lvl} onClick={() => { setActiveLevel(lvl); setCurrentPage(1); }}
                    className={`flex-1 md:px-8 py-2.5 rounded-xl font-black transition-all ${activeLevel === lvl ? 'bg-primary text-white shadow-lg' : 'text-[#9a4c73] hover:bg-gray-50'}`}>{lvl}</button>
                ))}
              </div>
            </div>

            {/* Thanh tiến độ tổng */}
            <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-8 border-2 border-[#f3e7ed] shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <Trophy className="text-yellow-600 w-5 h-5 md:w-6 md:h-6" />
                        <span className="font-black text-[#1b0d14] uppercase text-[10px] md:text-xs tracking-widest">Tiến độ trang {currentPage}</span>
                    </div>
                    <span className="font-black text-primary text-xl md:text-2xl">{overallProgress}%</span>
                </div>
                <div className="h-3 md:h-4 w-full bg-[#f3e7ed] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-pink-400 to-primary transition-all duration-1000" style={{ width: `${overallProgress}%` }} />
                </div>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center py-20 gap-4">
              <Loader2 className="animate-spin text-primary w-12 h-12" />
              <p className="font-bold text-[#9a4c73] animate-pulse uppercase text-xs">Đang tải bài học...</p>
            </div>
          ) : currentTopics.length > 0 ? (
            <div className="flex flex-col gap-4 mb-10">
              {currentTopics.map((topic) => {
                const ui = getStatusUI(topic);
                const tId = topic.id || topic.topicId;
                return (
                  <div key={tId} onClick={() => tId && navigate(`/grammar-quiz/${tId}`)}
                    className="group bg-white rounded-[1.5rem] border-2 border-[#f3e7ed] p-5 shadow-sm hover:border-primary/50 hover:shadow-xl transition-all cursor-pointer flex flex-col md:flex-row items-center gap-4 md:gap-6 relative overflow-hidden"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary/10">
                       <div className="bg-primary w-full transition-all duration-700" style={{ height: `${topic.progressPercent}%` }} />
                    </div>

                    <div className="flex md:flex-col items-center justify-between w-full md:w-auto md:min-w-[100px] shrink-0">
                      <div className={`p-3 md:p-4 rounded-xl md:rounded-2xl ${ui.color} shadow-inner`}>{ui.icon}</div>
                      <span className="text-[10px] font-black uppercase opacity-60 md:mt-3">{ui.label}</span>
                    </div>

                    <div className="flex-grow text-center md:text-left">
                      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                        <h3 className="text-lg md:text-xl font-black text-[#1b0d14] group-hover:text-primary transition-colors">{topic.title}</h3>
                        
                        {/* --- PHẦN CHỈNH SỬA: Tăng kích thước và làm nổi bật % DONE --- */}
                        <span className="inline-flex items-center justify-center text-xs md:text-sm font-black bg-pink-100 border-2 border-pink-200 px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-primary self-center shadow-sm whitespace-nowrap">
                            {topic.progressPercent}% XONG
                        </span>
                        {/* ----------------------------------------------------------- */}

                      </div>
                      <p className="text-[#9a4c73] text-sm line-clamp-2 md:line-clamp-1">{topic.description}</p>
                    </div>

                    <div className="w-full md:w-auto mt-2 md:mt-0">
                        <div className="w-full md:size-12 rounded-xl md:rounded-2xl flex items-center justify-center bg-[#f3e7ed] group-hover:bg-primary group-hover:text-white text-[#1b0d14] font-bold py-3 md:py-0 transition-all">
                            <span className="md:hidden mr-2">Vào học</span>
                            <ArrowRight size={20} />
                        </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-[#e7cfdb]">
              <BookOpen size={48} className="mx-auto text-[#e7cfdb] mb-4" />
              <p className="font-bold text-[#1b0d14]">Chưa có bài học nào...</p>
            </div>
          )}

          {/* PHÂN TRANG RESPONSIVE */}
          {totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mt-4 pb-12">
              <button onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo({top:0, behavior:'smooth'}); }} 
                disabled={currentPage === 1}
                className="p-3 rounded-xl md:rounded-2xl border-2 border-[#f3e7ed] bg-white text-primary disabled:opacity-30 active:scale-90 transition-all">
                <ChevronLeft size={20} />
              </button>
              
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                {renderPageNumbers().map((page, index) => (
                  page === '...' ? <MoreHorizontal key={index} className="text-[#9a4c73] mx-0.5" size={16} /> :
                  <button key={index} onClick={() => { setCurrentPage(page as number); window.scrollTo({top:0, behavior:'smooth'}); }}
                    className={`size-10 md:size-11 rounded-xl font-black text-sm transition-all duration-300 ${currentPage === page ? 'bg-primary text-white shadow-md scale-110 border-2 border-primary' : 'bg-white border-2 border-[#f3e7ed] text-[#9a4c73] hover:border-primary'}`}>
                    {page}
                  </button>
                ))}
              </div>

              <button onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); window.scrollTo({top:0, behavior:'smooth'}); }} 
                disabled={currentPage === totalPages}
                className="p-3 rounded-xl md:rounded-2xl border-2 border-[#f3e7ed] bg-white text-primary disabled:opacity-30 active:scale-90 transition-all">
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default GrammarLibrary;