import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, ChevronRight, RotateCcw, 
  ArrowLeft, Bookmark, Lightbulb, 
  CheckCircle2, XCircle, LayoutGrid, Loader2 
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

const FlashcardLearning = () => {
  const { id } = useParams(); // Lấy ID bộ thẻ từ URL
  const navigate = useNavigate();

  // --- STATE QUẢN LÝ DỮ LIỆU ---
  const [cards, setCards] = useState([]); // Danh sách thẻ từ API
  const [setTitle, setSetTitle] = useState(""); // Tên bộ thẻ
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // --- GỌI API KHI TRANG LOAD ---
  useEffect(() => {
    const fetchFlashcardDetail = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5024/api/FlashcardSet/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${localStorage.getItem('token')}` // Mở lại khi dùng Token
          }
        });

        if (response.ok) {
          const data = await response.json();
          setCards(data.flashcards || []); // Lấy mảng flashcards từ DTO chi tiết
          setSetTitle(data.title); // Lấy tiêu đề bộ thẻ
        } else {
          alert("Không thể tải dữ liệu bộ thẻ này!");
          navigate('/myflashcardlibrary');
        }
      } catch (error) {
        console.error("Lỗi kết nối:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcardDetail();
  }, [id, navigate]);

  // --- LOGIC ĐIỀU KHIỂN ---
  const currentCard = cards[currentIndex];

  const handleFlip = () => setIsFlipped(!isFlipped);
  
  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  // --- GIAO DIỆN KHI ĐANG TẢI ---
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF0F3]/30">
        <Loader2 className="animate-spin text-pink-500 mb-4" size={48} />
        <p className="font-bold text-gray-500 uppercase tracking-widest">Đang chuẩn bị thẻ học...</p>
      </div>
    );
  }

  // --- GIAO DIỆN KHI KHÔNG CÓ THẺ ---
  if (cards.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF0F3]/30">
        <h2 className="text-2xl font-bold mb-4">Bộ thẻ này hiện đang trống!</h2>
        <button onClick={() => navigate('/myflashcardlibrary')} className="text-pink-600 font-bold underline"> Quay lại thư viện </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF0F3]/30 font-sans text-gray-800 pt-24">
      {/* --- HEADER --- */}
      <header className="fixed top-0 w-full bg-white/70 backdrop-blur-md z-50 border-b border-pink-100">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-3xl font-lalezar text-pink-600 tracking-wider cursor-pointer" onClick={() => navigate('/')}>
            NIHONLET
          </div>
          <div className="hidden md:flex space-x-8 font-bold text-sm tracking-widest text-gray-600">
            <a href="#vocabulary" className="text-pink-500 uppercase border-b-2 border-pink-500 pb-1">TỪ VỰNG</a>
            <a href="#reading" className="hover:text-pink-500 transition uppercase">ĐỌC HIỂU</a>
            <a href="#grammar" className="hover:text-pink-500 transition uppercase">NGỮ PHÁP</a>
          </div>
          <button className="px-6 py-2 bg-gray-900 text-white rounded-full font-bold hover:bg-pink-600 transition-colors shadow-lg text-sm">
            Đăng nhập
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Tên bộ thẻ đang học */}
        <div className="text-center mb-6">
            <h2 className="text-xl font-black text-gray-400 uppercase tracking-widest">{setTitle}</h2>
        </div>

        <div className="flex items-center justify-between mb-8">
          <button onClick={() => navigate('/myflashcardlibrary')} className="flex items-center gap-2 bg-[#FFC1CC]/40 hover:bg-[#FFC1CC] px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm">
            <ArrowLeft size={16} /> Quay Lại
          </button>
          
          <div className="flex-1 px-10">
            <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-[#FFC1CC] h-full transition-all duration-500" 
                style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <span className="text-sm font-bold text-gray-500 whitespace-nowrap">{currentIndex + 1}/{cards.length} card</span>
        </div>

        <div className="flex justify-center mb-6">
          <span className="bg-[#FFC1CC]/30 px-6 py-1.5 rounded-xl text-xs font-black uppercase tracking-[0.2em] text-pink-600">
            {currentCard?.level || 'N/A'} Word
          </span>
        </div>

        {/* --- FLASHCARD --- */}
        <div className="relative h-[450px] w-full max-w-[600px] mx-auto perspective-1000">
          <div 
            className={`relative w-full h-full transition-transform duration-700 transform-style-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
            onClick={handleFlip}
          >
            {/* MẶT TRƯỚC */}
            <div className="absolute inset-0 bg-white rounded-[3rem] shadow-xl border border-pink-50 flex flex-col items-center justify-center backface-hidden p-10">
              <div className="absolute top-8 right-10 text-gray-300 hover:text-pink-400">
                <Bookmark size={28} />
              </div>
              <h2 className="text-8xl font-black text-gray-800 transition-all">{currentCard?.frontText}</h2>
              <p className="mt-8 text-gray-400 font-bold uppercase tracking-widest text-xs italic">Chạm để lật thẻ</p>
            </div>

            {/* MẶT SAU */}
            <div className="absolute inset-0 bg-white rounded-[3rem] shadow-xl border border-pink-50 flex flex-col items-center justify-center backface-hidden rotate-y-180 p-10">
              <span className="text-pink-400 font-black uppercase tracking-[0.3em] text-xs mb-4">Ý Nghĩa</span>
              <h2 className="text-5xl font-black text-gray-800 mb-10">{currentCard?.backText}</h2>
              
              <div className="w-full border-t border-pink-100 pt-8 mt-4 text-center">
                <p className="text-xs font-black text-gray-300 uppercase tracking-widest mb-3">Ví dụ minh họa</p>
                <p className="text-xl font-medium text-gray-600 leading-relaxed italic">
                  "{currentCard?.exampleSentence || "Chưa có ví dụ cho từ này."}"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* --- ĐIỀU KHIỂN --- */}
        <div className="flex items-center justify-center gap-6 mt-12">
          <button onClick={handlePrev} disabled={currentIndex === 0} className="p-3 text-gray-300 hover:text-pink-500 disabled:opacity-20 transition-all">
            <ChevronLeft size={40} />
          </button>
          
          <button onClick={handleFlip} className="bg-[#FFC1CC]/40 hover:bg-[#FFC1CC] px-12 py-4 rounded-2xl font-black flex items-center gap-3 transition-all shadow-md active:scale-95">
            FLIP <RotateCcw size={20} />
          </button>

          <button onClick={handleNext} disabled={currentIndex === cards.length - 1} className="p-3 text-gray-300 hover:text-pink-500 disabled:opacity-20 transition-all">
            <ChevronRight size={40} />
          </button>
        </div>

        {/* --- TIẾN TRÌNH (Tạm thời để tĩnh hoặc xử lý sau) --- */}
        <div className="mt-16 bg-white rounded-[2.5rem] p-10 border border-pink-50 shadow-sm max-w-[650px] mx-auto">
            {/* Phần này giữ nguyên giao diện */}
        </div>

        <div className="flex justify-center gap-4 mt-10 mb-20">
          <button className="flex items-center gap-2 bg-white border border-pink-100 hover:bg-pink-50 px-8 py-4 rounded-2xl font-black transition-all text-gray-700 shadow-sm"><CheckCircle2 size={20} className="text-pink-400" /> Remember</button>
          <button className="flex items-center gap-2 bg-white border border-pink-100 hover:bg-pink-50 px-8 py-4 rounded-2xl font-black transition-all text-gray-700 shadow-sm"><XCircle size={20} className="text-pink-400" /> Forgot</button>
          <button className="flex items-center gap-2 bg-white border border-pink-100 hover:bg-pink-50 px-8 py-4 rounded-2xl font-black transition-all text-gray-700 shadow-sm"><RotateCcw size={20} className="text-pink-400" /> Reset</button>
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-white pt-24 pb-12 border-t border-pink-50">
        {/* Footer giữ nguyên */}
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .font-lalezar { font-family: 'Lalezar', cursive; }
      `}} />
    </div>
  );
};

export default FlashcardLearning;