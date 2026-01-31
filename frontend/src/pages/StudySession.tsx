import React, { useState } from 'react';
import Header from '../components/Header';
import { ChevronLeft, ChevronRight, RefreshCw, Settings, Timer, Box } from 'lucide-react';

const StudySession: React.FC = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Logic lật thẻ: Ngăn chặn sự kiện lan tỏa nếu nhấn vào nút bên trong thẻ
  const handleFlip = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="bg-[#FCF8FA] min-h-screen flex flex-col font-display text-[#1b0d14]">
      <Header />

      <main className="flex-1 flex flex-col items-center py-12 px-4 max-w-[1000px] mx-auto w-full">
        
        {/* PROGRESS SECTION */}
        <div className="w-full mb-12">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h2 className="text-3xl font-black tracking-tight mb-1">Daily Review</h2>
              <p className="text-primary font-bold text-sm">JLPT N3 Vocabulary</p>
            </div>
            <div className="text-right">
              <p className="text-primary font-black text-sm mb-1 uppercase tracking-wider">65% Completed</p>
              <p className="text-[#9a4c73] text-[10px] font-bold">Streak: 15 cards</p>
            </div>
          </div>
          <div className="h-4 w-full bg-pink-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-700 ease-out shadow-[0_0_15px_rgba(244,63,94,0.3)]" 
              style={{ width: '65%' }}
            ></div>
          </div>
        </div>

        {/* FLASHCARD CONTAINER */}
        <div className="flex items-center justify-center gap-6 w-full flex-1">
          
          <button className="size-12 rounded-full bg-white shadow-xl flex items-center justify-center text-gray-400 hover:text-primary transition-all active:scale-90 shrink-0">
            <ChevronLeft size={28} />
          </button>

          {/* Logic 1: Perspective Container */}
          <div className="w-full max-w-[650px] aspect-[4/3] perspective-1000">
            {/* Logic 2: Transform-style-3d Wrapper */}
            <div 
              className={`relative w-full h-full transition-transform duration-700 transform-style-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
              onClick={() => handleFlip()}
            >
              
              {/* MẶT TRƯỚC (FRONT SIDE) */}
              <div 
                className="absolute inset-0 bg-white rounded-[40px] shadow-2xl border border-pink-50 flex flex-col items-center justify-center p-12 backface-hidden z-20"
              >
                <div className="flex-1 flex flex-col items-center justify-center">
                  <p className="text-primary text-3xl font-medium mb-4">すばらしい</p>
                  <h1 className="text-7xl md:text-8xl font-black tracking-tighter text-[#1b0d14]">素晴らしい</h1>
                </div>
                
                <button 
                  onClick={handleFlip}
                  className="mt-8 flex items-center gap-2 px-10 py-4 bg-primary text-white font-black rounded-3xl shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
                >
                  <RefreshCw size={20} className="stroke-[3px]" />
                  <span>Flip Card</span>
                </button>
              </div>

              {/* MẶT SAU (BACK SIDE) */}
              <div className="absolute inset-0 bg-white rounded-[40px] shadow-2xl border border-pink-50 flex flex-col items-center p-12 backface-hidden rotate-y-180 z-10 overflow-y-auto">

                <div className="flex flex-col items-center mb-8">
                  <span className="px-5 py-1.5 bg-pink-50 text-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-6">Meaning</span>
                  <h2 className="text-6xl font-black mb-2 text-[#1b0d14]">Wonderful</h2>
                  <p className="text-[#9a4c73] text-xl font-medium">Splendid, magnificent</p>
                </div>

                <div className="w-full border-t border-dashed border-pink-100 my-4" />

                <div className="w-full flex flex-col items-center mt-6">
                  <span className="px-5 py-1.5 bg-pink-50 text-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-6">Example</span>
                  <div className="w-full bg-[#F8F5F7] rounded-3xl p-8 flex flex-col items-center text-center">
                    <p className="text-2xl font-black mb-2 text-[#1b0d14]">今日は素晴らしい天気です。</p>
                    <p className="text-primary font-bold text-sm mb-4">Kyō wa subarashii tenki desu.</p>
                    <p className="text-[#9a4c73] text-lg italic font-medium">"The weather is wonderful today."</p>
                  </div>
                </div>

                <button 
                  onClick={handleFlip}
                  className="mt-auto flex items-center gap-2 px-10 py-4 bg-primary text-white font-black rounded-3xl shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
                >
                  <RefreshCw size={20} className="stroke-[3px]" />
                  <span>Flip Card</span>
                </button>
              </div>

            </div>
          </div>

          <button className="size-12 rounded-full bg-white shadow-xl flex items-center justify-center text-gray-400 hover:text-primary transition-all active:scale-90 shrink-0">
            <ChevronRight size={28} />
          </button>
        </div>
      </main>

      {/* --- INLINE STYLES CHO HIỆU ỨNG 3D --- */}
      <style dangerouslySetInnerHTML={{ __html: `
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}} />
    </div>
  );
};

export default StudySession;