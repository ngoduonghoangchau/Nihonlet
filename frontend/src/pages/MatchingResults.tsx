import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { 
  PartyPopper, 
  Sparkles, 
  ListChecks, 
  CheckCircle2, 
  RotateCcw, 
  LayoutGrid 
} from 'lucide-react';

interface ResultState {
  score: number;
  pairsMatched: number;
  totalPairs: number;
  reviewData: { ja: string; vi: string }[];
  gameConfig: any;
}

const MatchingResults: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const results = location.state as ResultState;

  useEffect(() => {
    if (!results) {
      navigate('/minigameHub');
    }
    window.scrollTo(0, 0); 
  }, [results, navigate]);

  if (!results) return null;

  return (
    <div className="bg-[#fcf8fa] min-h-screen text-[#1b0d14] font-display flex flex-col">
      <Header />

      <main className="flex-grow max-w-[800px] mx-auto px-4 py-8 w-full animate-fadeIn">
        {/* Header kết quả */}
        <div className="text-center mb-10 relative">
          {/* Hiệu ứng hạt giấy (Confetti) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 flex justify-center">
             <div className="absolute top-0 left-[20%] w-3 h-3 bg-pink-300 rounded-full animate-bounce"></div>
             <div className="absolute top-10 right-[20%] w-3 h-3 bg-primary rounded-full animate-ping"></div>
          </div>
          
          <div className="inline-flex items-center justify-center p-4 bg-[#f04299]/10 rounded-full mb-6">
            <PartyPopper className="text-[#f04299]" size={48} />
          </div>
          <h1 className="text-4xl font-black text-[#1b0d14] mb-2">Match Complete!</h1>
          <p className="text-[#9a4c73] text-lg font-medium">Tuyệt vời! Bạn đã hoàn thành thử thách này.</p>
        </div>

        {/* Score & Performance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          <div className="flex flex-col items-center justify-center gap-2 rounded-3xl p-8 bg-white border border-primary/10 shadow-sm">
            <div className="flex items-center gap-2 text-[#9a4c73] mb-1">
              <Sparkles size={20} className="text-[#f04299]" />
              <p className="text-base font-bold uppercase tracking-wider">Total Score</p>
            </div>
            <p className="text-6xl font-black text-[#f04299]">{results.score.toLocaleString()}</p>
            <div className="mt-2 text-[10px] font-black text-white bg-[#f04299] px-4 py-1.5 rounded-full uppercase tracking-widest">
                +500 Win Bonus
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-2 rounded-3xl p-8 bg-white border border-primary/10 shadow-sm">
            <div className="flex items-center gap-2 text-[#9a4c73] mb-1">
              <ListChecks size={20} className="text-[#f04299]" />
              <p className="text-base font-bold uppercase tracking-wider">Performance</p>
            </div>
            <p className="text-6xl font-black text-[#1b0d14]">{results.pairsMatched}/{results.totalPairs}</p>
            <p className="text-sm font-bold text-gray-400">Cặp thẻ đã khớp</p>
          </div>
        </div>

        {/* Vocabulary Review */}
        <div className="bg-white rounded-[2rem] border border-primary/10 shadow-sm overflow-hidden mb-10">
          <div className="p-6 border-b border-primary/5 bg-[#f04299]/5 flex justify-between items-center">
            <h3 className="font-black text-lg text-[#1b0d14] uppercase tracking-tight">Vocabulary Review</h3>
            <span className="text-[10px] font-black text-[#f04299] bg-white px-3 py-1 rounded-full border border-primary/20 uppercase tracking-widest">Perfect match</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-[10px] font-black uppercase text-[#9a4c73] tracking-widest">
                <tr>
                  <th className="px-8 py-4">Japanese</th>
                  <th className="px-8 py-4">Vietnamese</th>
                  <th className="px-8 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/5">
                {results.reviewData.map((item, index) => (
                  <tr key={index} className="hover:bg-primary/5 transition-colors group">
                    <td className="px-8 py-5 text-xl font-bold text-[#1b0d14]">{item.ja}</td>
                    <td className="px-8 py-5 text-[#9a4c73] font-medium">{item.vi}</td>
                    <td className="px-8 py-5 text-right">
                      <div className="inline-flex items-center justify-center size-8 bg-green-50 text-green-500 rounded-full">
                         <CheckCircle2 size={20} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => navigate('/matchinggame1', { state: results.gameConfig })}
            className="flex-1 py-5 px-8 bg-primary text-white font-black text-xl rounded-[1.5rem] shadow-xl shadow-primary/20 hover:brightness-110 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
          >
            <RotateCcw size={24} />
            Play Again
          </button>
          <button 
            onClick={() => navigate('/minigameHub')}
            className="flex-1 py-5 px-8 bg-white border-2 border-primary/20 text-primary font-black text-xl rounded-[1.5rem] hover:bg-primary/5 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
          >
            <LayoutGrid size={24} />
            Back to Hub
          </button>
        </div>
      </main>
    </div>
  );
};

export default MatchingResults;