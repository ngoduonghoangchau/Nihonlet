import React, { useState } from 'react';
import Header from '../components/Header';
import { 
  Sparkles, 
  CheckCircle2, 
  Lightbulb, 
  Shuffle, 
  Check 
} from 'lucide-react';

const MatchingGame1: React.FC = () => {
  // Dữ liệu mẫu cho các thẻ
  const gameCards = [
    { id: 1, text: "猫", lang: "JAPANESE", status: "matched" },
    { id: 2, text: "Con mèo", lang: "VIETNAMESE", status: "matched" },
    { id: 3, text: "食べる", lang: "JAPANESE", status: "selected" },
    { id: 4, text: "Ăn", lang: "VIETNAMESE", status: "default" },
    { id: 5, text: "水", lang: "JAPANESE", status: "default" },
    { id: 6, text: "Nước", lang: "VIETNAMESE", status: "default" },
    { id: 7, text: "学校", lang: "JAPANESE", status: "default" },
    { id: 8, text: "Trường học", lang: "VIETNAMESE", status: "default" },
    { id: 9, text: "犬", lang: "JAPANESE", status: "default" },
    { id: 10, text: "Con chó", lang: "VIETNAMESE", status: "default" },
    { id: 11, text: "先生", lang: "JAPANESE", status: "default" },
    { id: 12, text: "Thầy giáo", lang: "VIETNAMESE", status: "default" },
  ];

  return (
    <div className="bg-[#fcf8fa] min-h-screen text-[#1b0d14] font-display">
      <Header />
      
      <main className="max-w-[1200px] mx-auto px-4 py-8 animate-fadeIn">
        {/* --- STATS SECTION --- */}
        <div className="flex flex-wrap gap-4 mb-6 w-full">
          <div className="flex min-w-[180px] flex-1 flex-col gap-2 rounded-2xl p-6 bg-white border border-[#f3e7ed] shadow-sm">
            <div className="flex items-center gap-2 text-[#9a4c73]">
              <Sparkles size={16} className="text-primary" />
              <p className="text-sm font-bold uppercase tracking-wider">Total Score</p>
            </div>
            <p className="text-4xl font-black text-primary">1,250</p>
          </div>
          <div className="flex min-w-[180px] flex-1 flex-col gap-2 rounded-2xl p-6 bg-white border border-[#f3e7ed] shadow-sm">
            <div className="flex items-center gap-2 text-[#9a4c73]">
              <CheckCircle2 size={16} className="text-primary" />
              <p className="text-sm font-bold uppercase tracking-wider">Pairs Found</p>
            </div>
            <p className="text-4xl font-black text-[#1b0d14]">6 / 12</p>
          </div>
        </div>

        {/* --- PROGRESS SECTION --- */}
        <div className="bg-white rounded-2xl p-6 border border-[#f3e7ed] shadow-sm mb-8">
          <div className="flex justify-between items-end mb-3">
            <div>
              <p className="text-lg font-bold text-[#1b0d14]">Current Progress</p>
              <p className="text-[#9a4c73] text-sm font-medium">Keep going! You're halfway there.</p>
            </div>
            <p className="text-primary font-black text-2xl">50%</p>
          </div>
          <div className="rounded-full bg-[#f3e7ed] h-3.5 overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-700 rounded-full" 
              style={{ width: '50%' }}
            ></div>
          </div>
        </div>

        <div className="relative">
          {/* --- SIDEBAR CONTROLS --- */}
          <div className="absolute -left-20 top-0 hidden xl:flex flex-col gap-4">
            <button className="size-14 rounded-full bg-white border border-[#f3e7ed] flex items-center justify-center text-[#9a4c73] hover:text-primary hover:border-primary transition-all shadow-md">
              <Lightbulb size={24} />
            </button>
            <button className="size-14 rounded-full bg-white border border-[#f3e7ed] flex items-center justify-center text-[#9a4c73] hover:text-primary hover:border-primary transition-all shadow-md">
              <Shuffle size={24} />
            </button>
          </div>

          {/* --- GAME GRID --- */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            {gameCards.map((card) => {
              // Xử lý các trạng thái của Card
              const isMatched = card.status === "matched";
              const isSelected = card.status === "selected";

              return (
                <div 
                  key={card.id}
                  className={`
                    relative aspect-square rounded-[2rem] flex flex-col items-center justify-center p-6 text-center transition-all duration-300 cursor-pointer shadow-sm
                    ${isMatched ? 'bg-gray-50/50 border-2 border-transparent opacity-40 grayscale pointer-events-none' : ''}
                    ${isSelected ? 'bg-[#fef1f7] border-[3px] border-primary scale-105 shadow-xl' : 'bg-white border-2 border-transparent hover:border-primary/40 hover:-translate-y-1'}
                    ${!isMatched && !isSelected ? 'hover:shadow-md' : ''}
                  `}
                >
                  {/* Checkmark cho thẻ đã khớp */}
                  {isMatched && (
                    <div className="absolute top-4 right-4 text-gray-400">
                      <CheckCircle2 size={24} fill="#f3e7ed" />
                    </div>
                  )}

                  {/* Nội dung chữ */}
                  <h3 className={`
                    font-black tracking-tight mb-2
                    ${card.text.length > 5 ? 'text-2xl' : 'text-4xl'}
                    ${isSelected ? 'text-primary' : 'text-[#1b0d14]'}
                  `}>
                    {card.text}
                  </h3>

                  {/* Nhãn ngôn ngữ */}
                  <span className={`
                    text-[10px] font-black uppercase tracking-widest
                    ${isSelected ? 'text-primary' : 'text-[#9a4c73] opacity-40'}
                  `}>
                    {isSelected ? 'SELECTED' : card.lang}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MatchingGame1;