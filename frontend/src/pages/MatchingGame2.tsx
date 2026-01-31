import React from 'react';
import Header from '../components/Header';
import { PartyPopper, Sparkles, ListChecks, CheckCircle2, RotateCcw, LayoutGrid } from 'lucide-react';

const MatchingGame2: React.FC = () => {
  return (
    <div className="bg-background-light min-h-screen text-[#1b0d14] font-display flex flex-col">
      <Header />
      <main className="flex-grow max-w-[800px] mx-auto px-4 py-8 w-full animate-fadeIn">
        <div className="text-center mb-10 relative">
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-6 animate-bounce">
            <PartyPopper size={48} className="text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-[#1b0d14] mb-2">Match Complete!</h1>
          <p className="text-[#9a4c73] text-lg">You've mastered this vocabulary set.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          <div className="flex flex-col items-center justify-center gap-2 rounded-2xl p-8 bg-white border border-primary/10 shadow-md">
            <div className="flex items-center gap-2 text-[#9a4c73] mb-1">
              <Sparkles size={20} />
              <p className="text-base font-medium uppercase">Total Score</p>
            </div>
            <p className="text-5xl font-bold text-primary">2,500</p>
            <div className="mt-2 text-xs font-bold text-white bg-primary px-3 py-1 rounded-full">+500 Bonus</div>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 rounded-2xl p-8 bg-white border border-primary/10 shadow-md">
            <div className="flex items-center gap-2 text-[#9a4c73] mb-1">
              <ListChecks size={20} />
              <p className="text-base font-medium uppercase">Performance</p>
            </div>
            <p className="text-5xl font-bold">12/12</p>
            <p className="text-sm font-medium text-gray-500">Pairs Matched</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-primary/10 shadow-md overflow-hidden mb-10">
          <div className="p-6 border-b border-primary/10 bg-primary/5 flex justify-between items-center">
            <h3 className="font-bold text-lg text-[#1b0d14]">Vocabulary Review</h3>
            <span className="text-xs font-bold text-primary bg-white px-3 py-1 rounded-full border border-primary/20">Perfect Score</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-4 font-medium">Japanese</th>
                  <th className="px-6 py-4 font-medium">Vietnamese</th>
                  <th className="px-6 py-4 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/5">
                {[
                  { ja: '猫 (Neko)', vi: 'Con mèo' },
                  { ja: '食べる (Taberu)', vi: 'Ăn' },
                  { ja: '水 (Mizu)', vi: 'Nước' },
                ].map((item, idx) => (
                  <tr key={idx} className="hover:bg-primary/5 transition-colors">
                    <td className="px-6 py-4 text-lg font-medium text-[#1b0d14]">{item.ja}</td>
                    <td className="px-6 py-4 text-gray-600">{item.vi}</td>
                    <td className="px-6 py-4 text-right">
                      <CheckCircle2 size={20} className="text-primary ml-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="flex-1 py-4 px-8 bg-primary text-white font-bold text-lg rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2">
            <RotateCcw size={20} /> Play Again
          </button>
          <button className="flex-1 py-4 px-8 bg-white text-primary border-2 border-primary/20 font-bold text-lg rounded-xl hover:bg-primary/5 active:scale-95 transition-all flex items-center justify-center gap-2">
            <LayoutGrid size={20} /> Back to Games Hub
          </button>
        </div>
      </main>
    </div>
  );
};

export default MatchingGame2;