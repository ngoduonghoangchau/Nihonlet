import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { api } from '../api/axios';
import { 
  ArrowRight, 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  Trophy, 
  RefreshCcw,
  ArrowLeft 
} from 'lucide-react';

interface Card {
  cardId: number;
  kanji: string;
  reading: string; // Hiragana
  meaning: string; // Vietnamese
}

const RewritingGame: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const gameConfig = location.state as { selectedDeckIds: number[], wordCount: number };

  // --- STATE ---
  const [cards, setCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [missedQuestions, setMissedQuestions] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // 1. Khởi tạo Game và lấy dữ liệu từ Backend
  const initGame = useCallback(async () => {
    if (!gameConfig) {
      navigate('/minigameSelect');
      return;
    }
    try {
      setLoading(true);
      const res = await api.post('/Gamification/get-cards', {
        deckIds: gameConfig.selectedDeckIds,
        limit: gameConfig.wordCount
      });
      setCards(res.data);
      setCurrentIndex(0);
      setScore(0);
      setCorrectCount(0);
      setIsFinished(false);
      setFeedback(null);
      setInputValue('');
    } catch (error) {
      console.error("Lỗi tải dữ liệu cards:", error);
      alert("Không thể tải dữ liệu bài học.");
    } finally {
      setLoading(false);
    }
  }, [gameConfig, navigate]);

  useEffect(() => { initGame(); }, [initGame]);

  // 2. Logic kiểm tra đáp án
  const handleSubmit = () => {
  if (feedback !== null || !inputValue.trim()) return;

  const currentCard = cards[currentIndex];
  const userValue = inputValue.trim();
  const isCorrect = userValue === currentCard.kanji || userValue === currentCard.reading;

  if (isCorrect) {
    setFeedback('correct');
    setScore(prev => prev + 100);
    setCorrectCount(prev => prev + 1);
  } else {
    setFeedback('wrong');
    // LƯU LẠI CÂU SAI ĐỂ HIỂN THỊ Ở TRANG KẾT QUẢ
    setMissedQuestions(prev => [...prev, {
      id: currentCard.cardId,
      meaning: currentCard.meaning,
      yourAnswer: userValue,
      correctAnswer: currentCard.kanji || currentCard.reading
    }]);
  }

  setTimeout(() => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setInputValue('');
      setFeedback(null);
    } else {
      handleFinishGame();
    }
  }, 1200);
};

  const handleFinishGame = async () => {
  const finalScore = score + (feedback === 'correct' ? 100 : 0);
  const accuracy = Math.round(((correctCount + (feedback === 'correct' ? 1 : 0)) / cards.length) * 100);

  try {
    await api.post('/Gamification/save-rewriting', {
      wordCount: cards.length,
      selectedDecksJson: JSON.stringify(gameConfig.selectedDeckIds),
      totalScore: finalScore,
      accuracy: accuracy
    });
  } catch (e) {
    console.error("Lỗi lưu kết quả");
  }

  navigate('/rewriting-results', {
    state: {
      score: finalScore,
      accuracy: accuracy,
      totalWords: cards.length,
      correctCount: correctCount + (feedback === 'correct' ? 1 : 0),
      missedQuestions: missedQuestions,
      gameConfig: gameConfig 
    }
  });
};

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fcf8fa]">
      <Loader2 className="animate-spin text-primary mb-4" size={48} />
      <p className="text-primary font-bold animate-pulse">Đang chuẩn bị bài học...</p>
    </div>
  );

  const currentCard = cards[currentIndex];
  const progressPercent = ((currentIndex + 1) / cards.length) * 100;

  return (
    <div className={`bg-[#fcf8fa] min-h-screen flex flex-col transition-all duration-500 ${
      feedback === 'correct' ? 'bg-green-50/50' : feedback === 'wrong' ? 'bg-red-50/50' : ''
    }`}>
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 animate-fadeIn">
        <div className="w-full max-w-[800px] flex flex-col gap-10">
          
          {/* Thanh tiến trình */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e7cfdb]">
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <p className="text-[#9a4c73] font-black uppercase text-xs tracking-widest">Rewriting Progress</p>
                <p className="text-sm font-black text-[#1b0d14]">{currentIndex + 1} / {cards.length} Words</p>
              </div>
              <div className="rounded-full bg-[#f3e7ed] h-3.5 overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-700 ease-out rounded-full" 
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Khu vực câu hỏi */}
          <div className="flex flex-col items-center gap-8 py-10 text-center">
            <div className="space-y-4">
              <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                Meaning
              </span>
              <h1 className="text-[#1b0d14] text-[56px] md:text-[80px] font-black leading-tight drop-shadow-sm">
                {currentCard?.meaning}
              </h1>
            </div>

            {/* Ô nhập liệu */}
            <div className="w-full max-w-[550px] relative group">
              <input 
                autoFocus
                disabled={feedback !== null}
                className={`w-full rounded-[2.5rem] border-4 bg-white h-24 p-8 text-4xl text-center outline-none transition-all shadow-2xl
                  ${feedback === 'correct' ? 'border-green-500 text-green-600' : 
                    feedback === 'wrong' ? 'border-red-500 text-red-600' : 
                    'border-[#f3e7ed] focus:border-primary text-[#1b0d14]'}
                `} 
                placeholder="Hiragana or Kanji..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              
              {/* Feedback Icons */}
              <div className="absolute -right-20 top-1/2 -translate-y-1/2 hidden lg:block">
                {feedback === 'correct' && <CheckCircle2 className="text-green-500 animate-bounce" size={56} />}
                {feedback === 'wrong' && <XCircle className="text-red-500 animate-pulse" size={56} />}
              </div>
            </div>

            {/* Hiển thị đáp án nếu sai */}
            {/* Hiển thị đáp án tối giản khi sai - Đã cập nhật nền trắng */}
              {feedback === 'wrong' && (
                <div className="animate-fadeIn mt-4">
                      <p className="text-white/60 text-[10px] mb-2 uppercase font-black tracking-widest">
                        Đáp án đúng là:
                      </p>
                    <div className="flex gap-3 justify-center">
                       {/* Ô Hiragana/Reading */}
                      <span className="bg-white text-primary px-6 py-2 rounded-2xl font-black text-2xl shadow-lg border-2 border-white">
                        {currentCard.reading}
                      </span>
                       {/* Ô Kanji (nếu có và khác Hiragana) */}
                        {currentCard.kanji && currentCard.kanji !== currentCard.reading && (
                      <span className="bg-white text-primary px-6 py-2 rounded-2xl font-black text-2xl shadow-lg border-2 border-white">
                        {currentCard.kanji}
                      </span>
                       )}
                    </div>
                </div>
              )}
          </div>
        </div>
      </main>

      {/* Footer điều khiển */}
      <footer className="border-t border-[#f3e7ed] bg-white p-6">
         <div className="max-w-[800px] mx-auto flex justify-between items-center">
            <button 
                onClick={() => navigate('/minigameHub')}
                className="text-[#9a4c73] font-bold flex items-center gap-2 hover:text-red-500 transition-colors"
            >
                <ArrowLeft size={20} /> Quit Session
            </button>
            <div className="flex gap-4">
                <button 
                    onClick={() => {
                        setFeedback('wrong');
                        setTimeout(() => {
                            if (currentIndex < cards.length - 1) {
                                setCurrentIndex(prev => prev + 1);
                                setInputValue('');
                                setFeedback(null);
                            } else {
                                handleFinishGame();
                            }
                        }, 1000);
                    }}
                    className="text-[#9a4c73] font-bold hover:text-primary transition-colors"
                >
                    Skip Word
                </button>
                <button 
                    onClick={handleSubmit}
                    disabled={feedback !== null || !inputValue.trim()}
                    className="bg-primary text-white font-black px-14 py-4 rounded-2xl shadow-xl hover:brightness-110 disabled:opacity-50 transition-all flex items-center gap-2"
                >
                    Submit <ArrowRight size={22} />
                </button>
            </div>
         </div>
      </footer>


    </div>
  );
};

export default RewritingGame;