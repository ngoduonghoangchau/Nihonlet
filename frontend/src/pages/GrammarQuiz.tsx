import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Bot, 
  ArrowRight, 
  GraduationCap, 
  HelpCircle 
} from 'lucide-react';

const GrammarQuiz: React.FC = () => {
  const [showExplanation, setShowExplanation] = useState(true);

  return (
    <div className="bg-[#FCF8FA] min-h-screen flex flex-col font-display text-[#1b0d14]">
      
      {/* --- QUIZ SESSION HEADER --- */}
      <header className="px-8 py-4 flex justify-between items-center bg-white border-b border-gray-100">
        <div className="flex items-center gap-3 text-primary">
          <div className="bg-primary p-1.5 rounded-lg text-white">
            <GraduationCap size={24} fill="currentColor" />
          </div>
          <h1 className="text-xl font-black tracking-tight text-[#1b0d14]">Grammar Quiz Session</h1>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-[10px] font-black text-primary uppercase tracking-widest">Level</p>
            <p className="text-sm font-bold text-[#1b0d14]">N5 Beginner</p>
          </div>
          <button className="px-6 py-2 bg-[#f3e7ed] text-[#1b0d14] font-bold rounded-xl hover:bg-pink-100 transition-colors">
            Quit
          </button>
          <div className="size-10 rounded-full bg-pink-200 border-2 border-white shadow-sm" />
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center py-10 px-4">
        <div className="max-w-[900px] w-full flex flex-col gap-6">
          
          {/* --- PROGRESS BAR --- */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#f3e7ed]">
            <div className="flex justify-between items-end mb-4">
              <p className="text-lg font-bold text-[#1b0d14]">Question 13 of 20</p>
              <p className="text-primary text-sm font-black uppercase tracking-wider">65% Complete</p>
            </div>
            <div className="rounded-full bg-[#f3e7ed] h-4 overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-700" style={{width: '65%'}}></div>
            </div>
          </div>

          {/* --- QUESTION CARD --- */}
          <div className="bg-white rounded-[2rem] shadow-xl border border-[#f3e7ed] overflow-hidden">
            
            {/* Question Title */}
            <div className="p-8 pb-4">
              <div className="flex items-center gap-3 text-primary mb-6">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <HelpCircle size={20} />
                </div>
                <h2 className="text-xl font-black">Choose the correct polite form.</h2>
              </div>
              
              <div className="text-center py-10">
                <h1 className="text-6xl font-black tracking-tight text-[#1b0d14]">
                  私は学生 <span className="inline-block border-b-8 border-primary px-6 text-primary mx-2">_____</span> 。
                </h1>
              </div>
            </div>

            {/* --- OPTIONS GRID (4 ANSWERS) --- */}
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Option 1: Incorrect */}
              <div className="group p-5 border-2 border-red-200 bg-red-50 rounded-[1.5rem] flex justify-between items-center cursor-pointer transition-all hover:shadow-md">
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-full bg-red-500 text-white flex items-center justify-center font-black">1</div>
                  <span className="text-2xl font-bold text-[#1b0d14]">だ</span>
                </div>
                <XCircle className="text-red-500" size={28} />
              </div>

              {/* Option 2: Correct */}
              <div className="group p-5 border-2 border-emerald-500 bg-emerald-50 rounded-[1.5rem] flex justify-between items-center cursor-pointer transition-all shadow-md">
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black">2</div>
                  <span className="text-2xl font-bold text-[#1b0d14]">です</span>
                </div>
                <CheckCircle2 className="text-emerald-500" size={28} />
              </div>

              {/* Option 3: Neutral */}
              <div className="group p-5 border-2 border-[#f3e7ed] bg-white rounded-[1.5rem] flex justify-between items-center cursor-pointer transition-all hover:border-primary/30">
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-full border-2 border-[#f3e7ed] text-gray-300 flex items-center justify-center font-black">3</div>
                  <span className="text-2xl font-bold text-[#1b0d14]">で</span>
                </div>
              </div>

              {/* Option 4: Neutral */}
              <div className="group p-5 border-2 border-[#f3e7ed] bg-white rounded-[1.5rem] flex justify-between items-center cursor-pointer transition-all hover:border-primary/30">
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-full border-2 border-[#f3e7ed] text-gray-300 flex items-center justify-center font-black">4</div>
                  <span className="text-2xl font-bold text-[#1b0d14]">ではない</span>
                </div>
              </div>
            </div>

            {/* --- EXPLANATION & NEXT BUTTON --- */}
            {showExplanation && (
              <div className="bg-[#E9FBF4] p-8 border-t border-emerald-100 animate-slideUp relative">
                <div className="flex items-start gap-5 mb-6">
                  <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-600">
                    <Bot size={32} />
                  </div>
                  <div className="max-w-[70%]">
                    <h4 className="text-emerald-800 font-black text-lg mb-2 uppercase tracking-wide">Correct! Explanation:</h4>
                    <p className="text-emerald-700 text-sm leading-relaxed font-medium">
                      In Japanese, <span className="font-bold">です (desu)</span> is the polite form of the copula "to be." 
                      Since the sentence uses a polite tone, <span className="font-bold text-emerald-800 underline">です</span> is the correct choice. 
                      だ (da) is the informal version, and ではない (de wa nai) is the negative form.
                    </p>
                  </div>
                </div>

                {/* Next Question Button positioned bottom right */}
                <div className="flex justify-end mt-4">
                  <button className="bg-primary text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                    Next Question <ArrowRight size={20} className="stroke-[3px]" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default GrammarQuiz;