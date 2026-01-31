import React, { useState } from 'react';
import Header from '../components/Header';
import { ArrowRight } from 'lucide-react';

const RewritingGame: React.FC = () => {
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="bg-background-light min-h-screen flex flex-col transition-colors">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 animate-fadeIn">
        <div className="w-full max-w-[960px] flex flex-col gap-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-[#e7cfdb]">
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <p className="text-[#1b0d14] font-semibold">Session Progress</p>
                <p className="text-sm font-bold text-[#1b0d14]">13 / 20 Words</p>
              </div>
              <div className="rounded-full bg-[#e7cfdb] h-3 overflow-hidden">
                <div className="h-full bg-primary" style={{width: '65%'}}></div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-6 py-10">
            <h1 className="text-primary text-[64px] md:text-[80px] font-bold">学習</h1>
            <p className="text-[#9a4c73] text-lg">Type the reading in Kana or Romaji</p>
            <div className="w-full max-w-[520px] relative">
              <input 
                autoFocus
                className="w-full rounded-xl border-2 border-[#e7cfdb] bg-white h-20 p-6 text-3xl text-center focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none text-[#1b0d14]" 
                placeholder="e.g. benkyou"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-primary text-white p-3 rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity">
                <ArrowRight size={24} />
              </button>
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t border-[#e7cfdb] bg-white p-6">
         <div className="max-w-[960px] mx-auto flex justify-between items-center">
            <button className="text-[#9a4c73] font-bold flex items-center gap-2 hover:text-primary transition-colors">Skip Word</button>
            <button className="bg-primary text-white font-bold px-12 py-3 rounded-xl shadow-lg hover:opacity-90 transition-opacity">Submit</button>
         </div>
      </footer>
    </div>
  );
};

export default RewritingGame;