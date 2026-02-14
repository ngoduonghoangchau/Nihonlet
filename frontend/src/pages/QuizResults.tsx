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
  
  // Nhận dữ liệu từ trang Quiz gửi sang
  const { score = 0, total = 0, topicId = null } = location.state || {};
  
  // Tính toán phần trăm chính xác
  const accuracy = total > 0 ? Math.round((score / total) * 100) : 0;

  // Logic hiển thị giao diện động dựa trên điểm số
  const getFeedback = () => {
    if (accuracy === 100) return { 
        title: "Tuyệt đỉnh!", 
        desc: "Bạn đã hoàn toàn làm chủ kiến thức của chủ đề này!", 
        icon: <Trophy className="w-12 h-12 md:w-16 md:h-16 text-yellow-500" />,
        color: "bg-yellow-50",
        borderColor: "border-yellow-200",
        textColor: "text-yellow-600",
        barColor: "bg-yellow-500"
    };
    if (accuracy >= 80) return { 
        title: "Kết quả tuyệt vời!", 
        desc: "Bạn nắm vững kiến thức nền tảng rất tốt.", 
        icon: <PartyPopper className="w-12 h-12 md:w-16 md:h-16 text-emerald-500" />,
        color: "bg-emerald-50",
        borderColor: "border-emerald-200",
        textColor: "text-emerald-600",
        barColor: "bg-emerald-500"
    };
    if (accuracy >= 50) return { 
        title: "Cố gắng tốt!", 
        desc: "Bạn đang đi đúng hướng, hãy tiếp tục luyện tập nhé!", 
        icon: <TrendingUp className="w-12 h-12 md:w-16 md:h-16 text-orange-500" />,
        color: "bg-orange-50",
        borderColor: "border-orange-200",
        textColor: "text-orange-600",
        barColor: "bg-orange-500"
    };
    return { 
        title: "Cần nỗ lực hơn!", 
        desc: "Hãy xem lại phần giải thích và thử lại để cải thiện điểm số.", 
        icon: <Frown className="w-12 h-12 md:w-16 md:h-16 text-rose-500" />,
        color: "bg-rose-50",
        borderColor: "border-rose-200",
        textColor: "text-rose-600",
        barColor: "bg-rose-500"
    };
  };

  const feedback = getFeedback();

  // Màn hình lỗi nếu không có dữ liệu
  if (!location.state) {
    return (
      <div className="bg-[#FCF8FA] min-h-screen w-full flex flex-col items-center justify-center p-6 font-display overflow-hidden">
        <div className="bg-white p-10 rounded-[2rem] shadow-xl border border-[#f3e7ed] text-center max-w-md w-full">
            <Library className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-black text-[#1b0d14] mb-2">Oops! Trống trơn...</h2>
            <p className="text-[#9a4c73] mb-8 font-medium">Không tìm thấy dữ liệu kết quả bài làm của bạn.</p>
            <button 
                onClick={() => navigate('/grammar-library')} 
                className="w-full bg-primary text-white py-4 rounded-2xl font-black shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
            <ChevronLeft className="w-5 h-5" /> Quay lại Thư viện
            </button>
        </div>
      </div>
    );
  }

  return (
    // FIX: Thêm w-full và overflow-x-hidden để chặn mảng đen do tràn viền trên iPad
    <div className="bg-[#FCF8FA] min-h-screen w-full overflow-x-hidden flex flex-col font-display">
      <Header />
      
      {/* FIX: Thêm padding ngang (px-4 md:px-8) để thẻ không chạm sát mép màn hình iPad */}
      <main className="flex-1 flex justify-center py-6 md:py-16 px-4 md:px-8 animate-in fade-in zoom-in-95 duration-500">
        
        {/* FIX: Nới rộng max-w trên iPad (md:max-w-[800px]) để hiển thị cân đối hơn */}
        <div className="w-full max-w-[500px] md:max-w-[800px] lg:max-w-[900px] flex flex-col gap-6 md:gap-8">
          
          {/* --- HERO CARD --- */}
          <div className={`relative bg-white rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-14 shadow-xl border-2 ${feedback.borderColor} text-center overflow-hidden flex flex-col items-center`}>
            <div className={`absolute top-0 left-0 right-0 h-32 ${feedback.color} opacity-50`}></div>
            
            <div className="relative z-10 flex flex-col items-center w-full">
              <div className={`w-24 h-24 md:w-28 md:h-28 rounded-full bg-white shadow-lg border-4 ${feedback.borderColor} flex items-center justify-center mb-6 animate-bounce-short`}>
                {feedback.icon}
              </div>
              
              <h1 className="text-[#1b0d14] text-3xl md:text-5xl font-black mb-3 tracking-tight break-words">
                  {feedback.title}
              </h1>
              <p className="text-[#9a4c73] text-sm md:text-lg font-medium max-w-md mx-auto">
                  {feedback.desc}
              </p>
            </div>
          </div>

          {/* --- STATS GRID --- */}
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            <div className="bg-white p-6 md:p-10 rounded-[1.5rem] md:rounded-[2rem] border-2 border-[#f3e7ed] shadow-sm flex flex-col items-center justify-center text-center">
              <div className="bg-blue-50 p-3 md:p-4 rounded-2xl mb-4 text-blue-500">
                  <Target className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <span className="text-xs md:text-sm font-black text-[#9a4c73] uppercase tracking-widest mb-1 md:mb-2">Số câu đúng</span>
              <div className="flex items-baseline gap-1">
                  <span className="text-4xl md:text-6xl font-black text-[#1b0d14]">{score}</span>
                  <span className="text-lg md:text-2xl font-bold text-gray-400">/{total}</span>
              </div>
            </div>

            <div className="bg-white p-6 md:p-10 rounded-[1.5rem] md:rounded-[2rem] border-2 border-[#f3e7ed] shadow-sm flex flex-col items-center justify-center text-center">
              <div className={`${feedback.color} p-3 md:p-4 rounded-2xl mb-4 ${feedback.textColor}`}>
                  <Award className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <span className="text-xs md:text-sm font-black text-[#9a4c73] uppercase tracking-widest mb-1 md:mb-2">Độ chính xác</span>
              <p className={`text-4xl md:text-6xl font-black ${feedback.textColor}`}>{accuracy}%</p>
            </div>
          </div>

          {/* --- GỢI Ý --- */}
          <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-sm border-2 border-[#f3e7ed] overflow-hidden">
            <div className="p-5 md:p-6 border-b border-[#f3e7ed] flex items-center gap-3 bg-gray-50/50">
              <BookOpen className="text-primary w-5 h-5 md:w-6 md:h-6" />
              <h3 className="font-black text-base md:text-lg text-[#1b0d14] uppercase tracking-wide">Gợi ý cho bạn</h3>
            </div>
            <div className="p-5 md:p-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 md:p-6 bg-[#fcf8fa] border-2 border-[#f3e7ed] rounded-2xl hover:border-primary/30 transition-colors">
                  <div className="text-center sm:text-left">
                    <h4 className="font-black text-[#1b0d14] text-lg md:text-xl mb-1 md:mb-2">
                      {accuracy === 100 ? 'Chinh phục bài học mới' : 'Ôn tập lại chủ đề này'}
                    </h4>
                    <p className="text-xs md:text-sm font-medium text-[#9a4c73]">
                       Dựa trên tỉ lệ chính xác {accuracy}% của bài vừa làm
                    </p>
                  </div>
                  <button 
                    onClick={() => navigate('/grammar-library')}
                    className="w-full sm:w-auto text-primary bg-white border-2 border-[#f3e7ed] px-8 py-4 rounded-xl hover:text-white hover:bg-primary hover:border-primary flex items-center justify-center gap-2 font-bold text-sm md:text-base transition-all whitespace-nowrap"
                  >
                    Khám phá <ExternalLink className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </div>
            </div>
          </div>

          {/* --- BUTTONS --- */}
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 mt-2">
            <button 
              onClick={() => navigate(`/grammar-quiz/${topicId}`)}
              className="flex-1 flex items-center justify-center gap-2 px-8 py-4 md:py-6 bg-primary text-white rounded-2xl font-black text-base md:text-lg hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-primary/20"
            >
              <History className="w-5 h-5 md:w-6 md:h-6" /> Làm lại bài
            </button>
            <button 
              onClick={() => navigate('/grammar-library')}
              className="flex-1 flex items-center justify-center gap-2 px-8 py-4 md:py-6 bg-white border-2 border-[#f3e7ed] text-gray-600 rounded-2xl font-black text-base md:text-lg hover:border-primary hover:text-primary active:scale-95 transition-all"
            >
              <Library className="w-5 h-5 md:w-6 md:h-6" /> Thư viện
            </button>
          </div>
          
        </div>
      </main>
    </div>
  );
};

export default QuizResults;