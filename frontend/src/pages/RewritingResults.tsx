import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header'; 
import { 
  PartyPopper, 
  FileCheck2, 
  Target, 
  X, 
  Check, 
  ArrowLeft, 
  RotateCcw, 
  Trophy 
} from 'lucide-react';

interface ResultState {
  score: number;
  accuracy: number;
  totalWords: number;
  correctCount: number;
  missedQuestions: any[];
  gameConfig: any;
}

const RewritingResults: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state as ResultState;

  useEffect(() => {
    if (!data) navigate('/minigameHub');
    window.scrollTo(0, 0);
  }, [data, navigate]);

  if (!data) return null;

  return (
    <div className="bg-[#fcf8fa] min-h-screen flex flex-col font-display text-[#1b0d14]">
      <Header />

      <main className="flex-grow flex justify-center py-10 px-4 animate-fadeIn">
        <div className="max-w-[960px] w-full flex flex-col">
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4">
              {data.accuracy === 100 ? <Trophy className="text-yellow-500" size={48} /> : <PartyPopper className="text-primary" size={48} />}
            </div>
            <h1 className="tracking-tight text-[40px] font-extrabold leading-tight">
                {data.accuracy === 100 ? "Perfect Score!" : "Well Done!"}
            </h1>
            <h2 className="text-primary text-2xl font-bold mt-1">よくできました！</h2>
            <p className="text-[#1b0d14]/60 mt-2 font-medium">Bạn đã hoàn thành phiên luyện tập gõ chữ.</p>
          </div>

          <div className="flex flex-wrap gap-4 pb-6">
            <div className="flex min-w-[180px] flex-1 flex-col gap-2 rounded-xl p-6 bg-white shadow-sm border border-[#f3e7ed]">
              <div className="flex items-center gap-2 text-primary">
                <FileCheck2 size={18} />
                <p className="text-sm font-bold uppercase tracking-wider">Total Score</p>
              </div>
              <p className="tracking-tight text-3xl font-bold leading-tight">{data.score}</p>
            </div>
            <div className="flex min-w-[180px] flex-1 flex-col gap-2 rounded-xl p-6 bg-white shadow-sm border border-[#f3e7ed]">
              <div className="flex items-center gap-2 text-primary">
                <Target size={18} />
                <p className="text-sm font-bold uppercase tracking-wider">Accuracy</p>
              </div>
              <p className="tracking-tight text-3xl font-bold leading-tight">{data.accuracy}%</p>
            </div>
          </div>

          {data.missedQuestions.length > 0 ? (
            <>
              <div className="flex items-center justify-between pb-3 pt-5">
                <h2 className="text-[22px] font-bold leading-tight tracking-tight">Cần chú ý (Câu trả lời sai)</h2>
                <span className="text-primary font-bold text-sm bg-primary/10 px-3 py-1 rounded-full">
                  {data.missedQuestions.length} câu cần xem lại
                </span>
              </div>

              <div className="py-3">
                <div className="overflow-hidden rounded-xl border border-[#e7cfdb] bg-white shadow-sm">
                  <table className="w-full text-left">
                    <thead className="bg-[#fcf8fa] border-b border-[#e7cfdb]">
                      <tr>
                        <th className="px-6 py-4 text-sm font-bold uppercase tracking-widest text-[#9a4c73]">Nghĩa</th>
                        <th className="px-6 py-4 text-sm font-bold uppercase tracking-widest text-[#9a4c73]">Bạn viết</th>
                        <th className="px-6 py-4 text-sm font-bold uppercase tracking-widest text-[#9a4c73]">Đáp án đúng</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e7cfdb]">
                      {data.missedQuestions.map((q, idx) => (
                        <tr key={idx}>
                          <td className="px-6 py-6 font-bold text-lg">{q.meaning}</td>
                          <td className="px-6 py-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-sm font-bold border border-red-100">
                              <X size={14} /> {q.yourAnswer || "(Trống)"}
                            </div>
                          </td>
                          <td className="px-6 py-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-50 text-green-600 text-sm font-bold border border-green-100">
                              <Check size={14} /> {q.correctAnswer}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="py-10 text-center bg-green-50 rounded-2xl border border-green-100 mt-5">
                {/* <p className="text-green-600 font-bold text-xl">Tuyệt vời! Bạn không sai câu nào. ✨</p> */}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 p-8">
            <button 
                onClick={() => navigate('/minigameHub')}
                className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-xl h-12 px-6 bg-[#f3e7ed] text-[#1b0d14] text-base font-bold transition-all hover:bg-gray-200"
            >
              <ArrowLeft size={20} className="mr-2" /> Về trang Game
            </button>
            <button 
                onClick={() => navigate('/rewritinggame', { state: data.gameConfig })}
                className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-xl h-12 px-6 border-2 border-primary text-primary text-base font-bold transition-all hover:bg-primary/5"
            >
              <RotateCcw size={20} className="mr-2" /> Chơi lại bộ này
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RewritingResults;