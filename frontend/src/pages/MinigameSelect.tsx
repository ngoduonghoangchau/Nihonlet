import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../api/axios";
import Header from "../components/Header";
import {
  ArrowLeft,
  Settings2,
  Layers,
  Search,
  PlayCircle,
  Loader2,
  AlertCircle,
  ChevronDown,
  CheckCircle2,
  X,
  AlertTriangle
} from 'lucide-react';

interface GameDeck {
  id: number;
  title: string;
  description: string;
  cardsCount: number;
}

const MinigameSelect: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const selectedGame = location.state?.selectedGame || 'matching';

  const [loading, setLoading] = useState(true);
  const [decks, setDecks] = useState<GameDeck[]>([]);
  const [selectedSets, setSelectedSets] = useState<number[]>([]);
  const [wordCount, setWordCount] = useState("10");
  const [searchQuery, setSearchQuery] = useState("");

  // STATE QUẢN LÝ MODAL THÔNG BÁO
  const [modal, setModal] = useState({
    isOpen: false,
    message: ''
  });

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        setLoading(true);
        const res = await api.get('/Gamification/available-decks');
        const rawData = res.data.data || res.data; 
        setDecks(Array.isArray(rawData) ? rawData : []);
      } catch (error) {
        console.error("Lỗi lấy bộ thẻ:", error);
        setDecks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDecks();
  }, []);

  const isMaxReached = selectedSets.length >= 3;

  const totalCardsSelected = useMemo(() => {
    if (!Array.isArray(decks)) return 0;
    return decks
      .filter(d => selectedSets.includes(d.id))
      .reduce((sum, d) => sum + d.cardsCount, 0);
  }, [selectedSets, decks]);

  const handleToggleSet = (id: number) => {
    if (selectedSets.includes(id)) {
      setSelectedSets((prev) => prev.filter((s) => s !== id));
    } else if (!isMaxReached) {
      setSelectedSets((prev) => [...prev, id]);
    }
  };

  const handleStartGame = async () => {
    // THAY ALERT BẰNG MODAL
    if (totalCardsSelected < 5) {
      setModal({
        isOpen: true,
        message: `Các bộ thẻ đã chọn chỉ có ${totalCardsSelected} thẻ. Cần ít nhất 5 thẻ để bắt đầu trò chơi!`
      });
      return;
    }

    try {
      const payload = {
        selectedDeckIds: selectedSets,
        wordCount: wordCount === 'all' ? totalCardsSelected : parseInt(wordCount)
      };
      
      const res = await api.post('/Gamification/start-matching', payload);
      
      if (res.status === 200) {
        const targetRoute = selectedGame === 'matching' ? '/matchinggame1' : '/rewritinggame';
        navigate(targetRoute, { state: payload });
      }
    } catch (error: any) {
      // THAY ALERT BẰNG MODAL
      setModal({
        isOpen: true,
        message: error.response?.data?.message || "Đã có lỗi xảy ra khi khởi tạo trò chơi."
      });
    }
  };

  return (
    <div className="bg-[#fcf8fa] min-h-screen flex flex-col font-display text-[#1b0d14] relative">
      <Header />

      <main className="flex-grow flex flex-col items-center py-12 px-6">
        <div className="max-w-[900px] w-full animate-fadeIn">
          
          <div className="flex flex-col gap-6 mb-8">
            <button
              onClick={() => navigate("/minigameHub")}
              className="flex items-center gap-2 text-[#9a4c73] hover:text-primary transition-colors w-fit group font-bold"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span>Back to Minigame Hub</span>
            </button>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight flex items-center gap-3">
                  Select Your Sets <span className="text-2xl">🎴</span>
                </h1>
                <p className="text-[#9a4c73] text-lg mt-2">
                  Chế độ chơi: <span className="text-primary font-bold uppercase">{selectedGame}</span>
                </p>
              </div>

              <div className="flex gap-3 w-full md:w-auto">
                <div className="bg-white border border-[#f3e7ed] px-5 py-3 rounded-2xl flex items-center gap-4 shadow-sm">
                  <Settings2 className="text-primary" size={24} />
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-[#9a4c73]/50 tracking-widest">Words</span>
                    <select 
                      value={wordCount} 
                      onChange={e => setWordCount(e.target.value)} 
                      className="font-black text-primary outline-none bg-transparent cursor-pointer"
                    >
                      <option value="5">5 thẻ</option>
                      <option value="10">10 thẻ</option>
                      <option value="15">15 thẻ</option>
                      <option value="all">Tất cả</option>
                    </select>
                  </div>
                </div>
                <div className="bg-white border border-[#f3e7ed] px-5 py-3 rounded-2xl flex items-center gap-4 shadow-sm">
                  <Layers className="text-primary" size={24} />
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-[#9a4c73]/50 tracking-widest">Selected</span>
                    <span className="font-black text-primary">{selectedSets.length}/3 bộ</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#f3e7ed] rounded-[2.5rem] p-6 md:p-8 shadow-xl relative overflow-hidden">
            
            <div className="relative mb-8">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9a4c73]/30" />
              <input
                type="text"
                placeholder="Tìm kiếm bộ thẻ của bạn..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-[#fcf8fa] border border-[#f3e7ed] rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
              />
            </div>

            {loading ? (
              <div className="py-24 flex flex-col items-center gap-4">
                <Loader2 className="animate-spin text-primary" size={40} />
                <p className="text-[#9a4c73] font-bold animate-pulse">Đang tải bộ thẻ...</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[450px] overflow-y-auto px-4 py-2 custom-scrollbar">
                {Array.isArray(decks) && decks
                  .filter(d => d.title.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(set => {
                    const isSelected = selectedSets.includes(set.id);
                    const isDisabled = isMaxReached && !isSelected;

                    return (
                      <label 
                        key={set.id} 
                        className={`flex items-center p-5 rounded-[1.5rem] border-2 transition-all duration-300 relative
                          ${isSelected 
                            ? 'border-primary bg-primary/5 shadow-md scale-[1.02] z-10' 
                            : isDisabled 
                              ? 'border-gray-50 opacity-40 grayscale-[0.6] cursor-not-allowed' 
                              : 'border-[#f3e7ed] hover:border-primary/30 cursor-pointer bg-white'
                          }`}
                      >
                        <input 
                          type="checkbox" 
                          checked={isSelected} 
                          onChange={() => handleToggleSet(set.id)}
                          disabled={isDisabled}
                          className="hidden" 
                        />
                        
                        <div className={`size-6 rounded-lg border-2 flex items-center justify-center transition-colors shrink-0
                          ${isSelected ? 'bg-primary border-primary text-white' : 'border-[#f3e7ed] bg-white'}`}
                        >
                          {isSelected && <CheckCircle2 size={16} />}
                        </div>

                        <div className="ml-5 flex-1 min-w-0">
                          <h3 className={`font-bold text-lg transition-colors truncate ${isSelected ? 'text-primary' : 'text-[#1b0d14]'}`}>
                            {set.title}
                          </h3>
                          <p className="text-sm text-[#9a4c73]/70">{set.cardsCount} thẻ từ vựng</p>
                        </div>

                        {isSelected && (
                           <div className="bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter animate-fadeIn shrink-0">
                             Selected
                           </div>
                        )}
                      </label>
                    );
                  })}

                {(!decks || decks.length === 0) && !loading && (
                  <div className="text-center py-10">
                    <AlertCircle className="mx-auto text-gray-300 mb-2" size={40} />
                    <p className="text-gray-400 font-bold">Bạn chưa có bộ thẻ nào.</p>
                  </div>
                )}
              </div>
            )}

            <div className="mt-10 pt-8 border-t border-[#f3e7ed] flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-2 text-primary font-bold text-sm bg-primary/5 px-4 py-2 rounded-full border border-primary/10">
                <AlertCircle size={18} />
                <span>Tổng cộng {totalCardsSelected} thẻ sẽ được sử dụng</span>
              </div>

              <button
                onClick={handleStartGame}
                disabled={selectedSets.length === 0}
                className="w-full md:w-auto px-16 py-4 bg-primary text-white rounded-2xl font-black text-xl shadow-xl shadow-primary/20 hover:brightness-110 active:scale-95 disabled:grayscale disabled:opacity-50 transition-all flex items-center justify-center gap-3 group"
              >
                <PlayCircle size={24} className="group-hover:rotate-12 transition-transform" />
                Play Now
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* --- MODAL THÔNG BÁO TĨNH --- */}
      {modal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop mờ */}
          <div 
            className="absolute inset-0 bg-[#1b0d14]/40 backdrop-blur-sm" 
            onClick={() => setModal({ ...modal, isOpen: false })}
          />
          
          {/* Hộp thoại nội dung */}
          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 max-w-md w-full shadow-2xl relative z-10 border border-[#f3e7ed] text-center">
            <button 
              onClick={() => setModal({ ...modal, isOpen: false })}
              className="absolute top-6 right-6 text-[#9a4c73] hover:text-primary transition-colors"
            >
              <X size={24} />
            </button>

            <div className="flex flex-col items-center">
              <div className="size-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                <AlertTriangle size={40} />
              </div>

              <h3 className="text-2xl font-black mb-4">Lưu ý trò chơi</h3>
              
              <p className="text-[#9a4c73] font-medium leading-relaxed mb-8 px-4">
                {modal.message}
              </p>

              <button 
                onClick={() => setModal({ ...modal, isOpen: false })}
                className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #f3e7ed; border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #e0d0d8; }
      `,
        }}
      />
    </div>
  );
};

export default MinigameSelect;
