import React from 'react';
import Header from '../components/Header';
import { PartyPopper, TrendingUp, BookOpen, ExternalLink, History, Library } from 'lucide-react';

const QuizResults: React.FC = () => {
  return (
    <div className="bg-background-light min-h-screen">
      <div className="layout-container flex h-full grow flex-col">
        <Header />
        <main className="flex flex-1 justify-center py-10 px-4 animate-fadeIn">
          <div className="layout-content-container flex flex-col max-w-[800px] flex-1 gap-8">
            {/* Header Card */}
            <div className="relative bg-white rounded-2xl p-10 shadow-lg border border-[#f3e7ed] text-center overflow-hidden">
              <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mb-2 animate-bounce">
                  <PartyPopper className="text-primary" size={48} />
                </div>
                <h1 className="text-[#1b0d14] text-4xl font-bold">Quiz Completed!</h1>
                <p className="text-[#9a4c73] text-lg">Amazing job! You've completed the Grammar Basics quiz.</p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-[#f3e7ed] shadow-sm flex flex-col items-center">
                <span className="text-xs font-bold text-[#9a4c73] uppercase mb-1">Total Score</span>
                <p className="text-3xl font-bold text-[#1b0d14]">18/20</p>
                <div className="w-full bg-[#f3e7ed] h-1.5 rounded-full mt-4 overflow-hidden">
                  <div className="bg-primary h-full" style={{ width: '90%' }}></div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-[#f3e7ed] shadow-sm flex flex-col items-center">
                <span className="text-xs font-bold text-[#9a4c73] uppercase mb-1">Accuracy</span>
                <p className="text-3xl font-bold text-[#1b0d14]">90%</p>
                <div className="flex items-center gap-1 mt-4 text-emerald-500 font-bold text-sm">
                  <TrendingUp size={16} /> Personal Best!
                </div>
              </div>
            </div>

            {/* Topics Review Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#f3e7ed] overflow-hidden">
              <div className="p-6 border-b border-[#f3e7ed] flex items-center gap-2">
                <BookOpen className="text-primary" size={24} />
                <h3 className="font-bold text-lg text-[#1b0d14]">Topics to Review</h3>
              </div>
              <div className="p-6 space-y-4">
                {['Negative Copula: ではない vs じゃない', 'Polite Present Tense: ます form'].map((topic, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-[#fcf8fa] border border-[#f3e7ed] rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col">
                      {/* Chữ topic đã được chuyển sang màu đen #1b0d14 */}
                      <span className="font-bold text-[#1b0d14]">{topic}</span>
                      <span className="text-sm text-[#9a4c73]">Accuracy check needed</span>
                    </div>
                    <button className="text-primary hover:text-[#d93a89] flex items-center gap-1 font-bold text-sm">
                      Study <ExternalLink size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white rounded-xl font-bold hover:brightness-110 active:scale-95 transition-all shadow-md">
                <History size={20} /> Review Mistakes
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-primary text-primary rounded-xl font-bold hover:bg-pink-50 active:scale-95 transition-all">
                <Library size={20} /> Return to Library
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default QuizResults;