import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { api } from '../api/axios';
import { 
  ChevronLeft, 
  ChevronRight, 
  RefreshCw, 
  Loader2, 
  ArrowLeft,
  BookOpen
} from 'lucide-react';

interface CardDto {
  cardId: number;
  kanji?: string;
  reading: string;
  meaning: string;
  exampleSentence?: string;
  exampleTranslation?: string;
}

interface DeckDetailsDto {
  deckId: number;
  title: string;
  description?: string;
  cards: CardDto[];
}

const StudySession: React.FC = () => {
  const { id } = useParams<{ id: string }>(); 
  const navigate = useNavigate();

  const [deck, setDeck] = useState<DeckDetailsDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

useEffect(() => {
  const fetchDeck = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/Decks/${id}`);
      setDeck(response.data);
    } catch (error) {
      console.error("Lỗi khi tải bộ thẻ:", error);
    } finally {
      setLoading(false);
    }
  };
  if (id) fetchDeck();
}, [id]);

  // 2. Hàm cập nhật Mastery về Backend
  const syncMastery = async (newIndex: number) => {
    if (!deck) return;
    const currentProgress = Math.round(((newIndex + 1) / deck.cards.length) * 100);
    try {
      await api.patch(`/Decks/${id}/mastery`, {
        masteryPercent: currentProgress
      });
    } catch (error) {
      console.error("Lỗi cập nhật Mastery:", error);
    }
  };

  const handleFlip = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  const nextCard = () => {
    if (deck && currentIndex < deck.cards.length - 1) {
      const nextIndex = currentIndex + 1;
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentIndex(nextIndex);
        syncMastery(nextIndex); // Cập nhật tiến độ khi qua thẻ mới
      }, 150);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(prev => prev - 1), 150);
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#FCF8FA]">
      <Loader2 className="animate-spin text-primary" size={48} />
    </div>
  );

  if (!deck || deck.cards.length === 0) return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
      <p className="text-[#9a4c73] font-bold text-lg">Bộ thẻ này hiện chưa có nội dung.</p>
      <button onClick={() => navigate('/dashboard')} className="text-primary font-bold underline">Quay lại thư viện</button>
    </div>
  );

  const currentCard = deck.cards[currentIndex];
  const progress = ((currentIndex + 1) / deck.cards.length) * 100;

  return (
    <div className="bg-[#FCF8FA] min-h-screen flex flex-col font-display text-[#1b0d14]">
      <Header />

      <main className="flex-1 flex flex-col items-center py-8 px-4 max-w-[1000px] mx-auto w-full animate-fadeIn">
        
        {/* PROGRESS SECTION */}
        <div className="w-full mb-8">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="flex items-center gap-2 text-[#9a4c73] hover:text-primary mb-6 transition-colors font-bold group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
            Back to Library
          </button>
          
          <div className="flex justify-between items-end mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                 <BookOpen size={18} className="text-primary" />
                 <h2 className="text-2xl sm:text-3xl font-black tracking-tight">{deck.title}</h2>
              </div>
              <p className="text-[#9a4c73] font-medium text-xs sm:text-sm">Card {currentIndex + 1} of {deck.cards.length}</p>
            </div>
            <div className="text-right">
              <p className="text-primary font-black text-xs sm:text-sm mb-1 uppercase tracking-wider">{Math.round(progress)}% Completed</p>
            </div>
          </div>
          <div className="h-3 w-full bg-pink-100 rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* FLASHCARD CONTAINER */}
        <div className="flex items-center justify-center gap-4 sm:gap-8 w-full flex-1">
          
          <button 
            disabled={currentIndex === 0}
            onClick={prevCard}
            className={`size-10 sm:size-12 rounded-full bg-white shadow-xl flex items-center justify-center transition-all active:scale-90 shrink-0 ${currentIndex === 0 ? 'opacity-20 cursor-not-allowed' : 'text-gray-400 hover:text-primary'}`}
          >
            <ChevronLeft size={28} />
          </button>

          {/* 3D Flip Card */}
          <div className="w-full max-w-[600px] aspect-[4/3] perspective-1000">
            <div 
              className={`relative w-full h-full transition-transform duration-700 transform-style-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
              onClick={() => handleFlip()}
            >
              
              {/* MẶT TRƯỚC (Kanji & Reading) */}
              <div className="absolute inset-0 bg-white rounded-[3rem] shadow-2xl border border-pink-50 flex flex-col items-center justify-center p-8 backface-hidden z-20">
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <p className="text-primary text-xl sm:text-2xl font-medium mb-4">{currentCard.reading}</p>
                  <h1 className="text-5xl sm:text-7xl font-black tracking-tighter text-[#1b0d14]">
                    {currentCard.kanji || currentCard.reading}
                  </h1>
                </div>
                <div className="flex items-center gap-2 text-[#9a4c73]/40 font-bold text-[10px] uppercase tracking-widest">
                  <RefreshCw size={14} /> Click to flip
                </div>
              </div>

              {/* MẶT SAU (Meaning & Example - ĐÃ FIX KHOẢNG CÁCH) */}
              <div className="absolute inset-0 bg-white rounded-[3rem] shadow-2xl border border-pink-50 flex flex-col items-center justify-center p-8 sm:p-12 backface-hidden rotate-y-180 z-10 overflow-y-auto">
                
                {/* Ý nghĩa */}
                <div className="flex flex-col items-center mb-6">
                  <span className="px-4 py-1 bg-pink-50 text-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-3">
                    Meaning
                  </span>
                  <h2 className="text-3xl sm:text-5xl font-black text-[#1b0d14] text-center leading-tight">
                    {currentCard.meaning}
                  </h2>
                </div>

                {/* Ví dụ (Nằm sát dưới Meaning) */}
                {currentCard.exampleSentence && (
                  <div className="w-full flex flex-col items-center">
                    <span className="px-4 py-1 bg-pink-50 text-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-3">
                      Example
                    </span>
                    <div className="w-full bg-[#F8F5F7] rounded-[2rem] p-5 sm:p-6 flex flex-col items-center text-center">
                      <p className="text-lg sm:text-xl font-black mb-1.5 text-[#1b0d14] leading-relaxed">
                        {currentCard.exampleSentence}
                      </p>
                      <p className="text-[#9a4c73] text-sm sm:text-base italic font-medium">
                        {currentCard.exampleTranslation}
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-6 flex items-center gap-2 text-[#9a4c73]/40 font-bold text-[10px] uppercase tracking-widest">
                  <RefreshCw size={12} /> Click to flip back
                </div>
              </div>

            </div>
          </div>

          <button 
            disabled={currentIndex === deck.cards.length - 1}
            onClick={nextCard}
            className={`size-10 sm:size-12 rounded-full bg-white shadow-xl flex items-center justify-center transition-all active:scale-90 shrink-0 ${currentIndex === deck.cards.length - 1 ? 'opacity-20 cursor-not-allowed' : 'text-gray-400 hover:text-primary'}`}
          >
            <ChevronRight size={28} />
          </button>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
      `}} />
    </div>
  );
};

export default StudySession;