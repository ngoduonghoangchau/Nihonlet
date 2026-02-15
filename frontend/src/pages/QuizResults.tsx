import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { 
  PartyPopper, 
  TrendingUp, 
  BookOpen, 
  ExternalLink, 
  History, 
  Library,
  ChevronLeft,
  Frown,
  Trophy,
  Target,
  Award
} from 'lucide-react';

const QuizResults: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { score = 0, total = 0, topicId = null } = location.state || {};
  const accuracy = total > 0 ? Math.round((score / total) * 100) : 0;

  const getFeedback = () => {
    if (accuracy === 100) return { 
        title: "Tuyệt đỉnh!", 
        desc: "Bạn đã hoàn toàn làm chủ kiến thức!", 
        icon: <Trophy className="w-10 h-10 md:w-14 md:h-14 text-yellow-500" />,
        color: "bg-yellow-50",
        borderColor: "border-yellow-200",
        textColor: "text-yellow-600"
    };
    if (accuracy >= 80) return { 
        title: "Tuyệt vời!", 
        desc: "Bạn nắm vững kiến thức rất tốt.", 
        icon: <PartyPopper className="w-10 h-10 md:w-14 md:h-14 text-emerald-500" />,
        color: "bg-emerald-50",
        borderColor: "border-emerald-200",
        textColor: "text-emerald-600"
    };
    if (accuracy >= 50) return { 
        title: "Cố gắng tốt!", 
        desc: "Bạn đang đi đúng hướng, hãy tiếp tục!", 
        icon: <TrendingUp className="w-10 h-10 md:w-14 md:h-14 text-orange-500" />,
        color: "bg-orange-50",
        borderColor: "border-orange-200",
        textColor: "text-orange-600"
    };
    return { 
        title: "Cần nỗ lực!", 
        desc: "Thử lại để cải thiện điểm số nhé.", 
        icon: <Frown className="w-10 h-10 md:w-14 md:h-14 text-rose-500" />,
        color: "bg-rose-50",
        borderColor: "border-rose-200",
        textColor: "text-rose-600"
    };
  };

  const feedback = getFeedback();

  if (!location.state) {
    return (
      <div className="bg-[#FCF8FA] min-h-screen w-full flex flex-col items-center justify-center p-6 font-display overflow-hidden">
        <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-[#f3e7ed] text-center max-w-sm w-full">
            <Library className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-black text-[#1b0d14] mb-2">Oops! Trống trơn...</h2>
            <button 
                onClick={() => navigate('/grammar-library')} 
                className="w-full bg-primary text-white py-3 rounded-xl font-black shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
            >
            <ChevronLeft className="w-4 h-4" /> Thư viện
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FCF8FA] min-h-screen w-full overflow-x-hidden flex flex-col font-display">
      <Header />
      
      <main className="flex-1 flex justify-center py-8 md:py-12 px-4 md:px-8 animate-in fade-in zoom-in-95 duration-500">
        
        <div className="w-full max-w-[450px] md:max-w-[700px] flex flex-col gap-5 md:gap-6">
          
          {/* --- HERO CARD (Đã giảm size) --- */}
          <div className={`relative bg-white rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-10 shadow-lg border-2 ${feedback.borderColor} text-center overflow-hidden flex flex-col items-center`}>
            <div className={`absolute top-0 left-0 right-0 h-24 ${feedback.color} opacity-40`}></div>
            
            <div className="relative z-10 flex flex-col items-center w-full">
              <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full bg-white shadow-md border-4 ${feedback.borderColor} flex items-center justify-center mb-4`}>
                {feedback.icon}
              </div>
              
              <h1 className="text-[#1b0d14] text-2xl md:text-3xl font-black mb-1 tracking-tight">
                  {feedback.title}
              </h1>
              <p className="text-[#9a4c73] text-xs md:text-sm font-medium max-w-xs mx-auto">
                  {feedback.desc}
              </p>
            </div>
          </div>

          {/* --- STATS GRID (Đã giảm size) --- */}
          <div className="grid grid-cols-2 gap-4 md:gap-5">
            <div className="bg-white p-5 md:p-7 rounded-[1.25rem] md:rounded-[1.5rem] border-2 border-[#f3e7ed] shadow-sm flex flex-col items-center justify-center text-center">
              <div className="bg-blue-50 p-2 md:p-3 rounded-xl mb-3 text-blue-500">
                  <Target className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <span className="text-[10px] md:text-xs font-black text-[#9a4c73] uppercase tracking-widest mb-1">Số câu đúng</span>
              <div className="flex items-baseline gap-1">
                  <span className="text-3xl md:text-4xl font-black text-[#1b0d14]">{score}</span>
                  <span className="text-sm md:text-lg font-bold text-gray-400">/{total}</span>
              </div>
            </div>

            <div className="bg-white p-5 md:p-7 rounded-[1.25rem] md:rounded-[1.5rem] border-2 border-[#f3e7ed] shadow-sm flex flex-col items-center justify-center text-center">
              <div className={`${feedback.color} p-2 md:p-3 rounded-xl mb-3 ${feedback.textColor}`}>
                  <Award className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <span className="text-[10px] md:text-xs font-black text-[#9a4c73] uppercase tracking-widest mb-1">Độ chính xác</span>
              <p className={`text-3xl md:text-4xl font-black ${feedback.textColor}`}>{accuracy}%</p>
            </div>
          </div>

          {/* --- GỢI Ý (Gọn hơn) --- */}
          <div className="bg-white rounded-[1.25rem] md:rounded-[1.5rem] shadow-sm border-2 border-[#f3e7ed] overflow-hidden">
            <div className="p-4 md:p-5 border-b border-[#f3e7ed] flex items-center gap-2 bg-gray-50/50">
              <BookOpen className="text-primary w-4 h-4 md:w-5 md:h-5" />
              <h3 className="font-black text-sm md:text-base text-[#1b0d14] uppercase tracking-wide">Gợi ý cho bạn</h3>
            </div>
            <div className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 md:p-5 bg-[#fcf8fa] border-2 border-[#f3e7ed] rounded-xl">
                  <div className="text-center sm:text-left">
                    <h4 className="font-black text-[#1b0d14] text-base md:text-lg">
                      {accuracy === 100 ? 'Học bài tiếp theo' : 'Ôn tập lại ngay'}
                    </h4>
                    <p className="text-[10px] md:text-xs font-medium text-[#9a4c73]">
                       Dựa trên kết quả bài làm vừa rồi
                    </p>
                  </div>
                  <button 
                    onClick={() => navigate('/grammar-library')}
                    className="w-full sm:w-auto text-primary bg-white border-2 border-[#f3e7ed] px-6 py-2.5 rounded-lg hover:text-white hover:bg-primary hover:border-primary flex items-center justify-center gap-2 font-bold text-xs md:text-sm transition-all"
                  >
                    Khám phá <ExternalLink size={14} />
                  </button>
                </div>
            </div>
          </div>

          {/* --- BUTTONS (Gọn hơn) --- */}
          <div className="flex flex-row gap-3 md:gap-4">
            <button 
              onClick={() => navigate(`/grammar-quiz/${topicId}`)}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 md:py-4 bg-primary text-white rounded-xl font-black text-sm md:text-base hover:brightness-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
            >
              <History size={18} /> Làm lại
            </button>
            <button 
              onClick={() => navigate('/grammar-library')}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 md:py-4 bg-white border-2 border-[#f3e7ed] text-gray-600 rounded-xl font-black text-sm md:text-base hover:border-primary hover:text-primary active:scale-95 transition-all"
            >
              <Library size={18} /> Thư viện
            </button>
          </div>
          
        </div>
      </main>
    </div>
  );
};

export default QuizResults;