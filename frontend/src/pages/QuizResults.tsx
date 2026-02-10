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
  Frown
} from 'lucide-react';

const QuizResults: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Nhận dữ liệu từ trang Quiz gửi sang
  const { score = 0, total = 0, topicId = null } = location.state || {};
  
  // Tính toán phần trăm chính xác
  const accuracy = total > 0 ? Math.round((score / total) * 100) : 0;

  // Logic hiển thị lời nhắn dựa trên kết quả tiếng Việt
  const getFeedback = () => {
    if (accuracy === 100) return { 
        title: "Điểm tuyệt đối!", 
        desc: "Bạn đã hoàn toàn làm chủ kiến thức của chủ đề này!", 
        icon: <PartyPopper className="text-primary" size={48} /> 
    };
    if (accuracy >= 80) return { 
        title: "Kết quả tuyệt vời!", 
        desc: "Bạn nắm vững kiến thức nền tảng rất tốt.", 
        icon: <PartyPopper className="text-primary" size={48} /> 
    };
    if (accuracy >= 50) return { 
        title: "Cố gắng tốt!", 
        desc: "Bạn đang đi đúng hướng, hãy tiếp tục luyện tập nhé!", 
        icon: <TrendingUp className="text-emerald-500" size={48} /> 
    };
    return { 
        title: "Hãy tiếp tục học nhé!", 
        desc: "Hãy xem lại phần giải thích và thử lại để cải thiện điểm số.", 
        icon: <Frown className="text-orange-500" size={48} /> 
    };
  };

  const feedback = getFeedback();

  // Nếu không có dữ liệu, hiện thông báo lỗi
  if (!location.state) {
    return (
      <div className="bg-background-light min-h-screen flex flex-col items-center justify-center p-6">
        <Library size={64} className="text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-[#1b0d14]">Không tìm thấy dữ liệu kết quả</h2>
        <button onClick={() => navigate('/grammar-library')} className="mt-4 text-primary font-bold flex items-center gap-2">
          <ChevronLeft size={20} /> Quay lại Thư viện
        </button>
      </div>
    );
  }

  return (
    <div className="bg-background-light min-h-screen">
      <div className="layout-container flex h-full grow flex-col">
        <Header />
        <main className="flex flex-1 justify-center py-10 px-4 animate-fadeIn">
          <div className="layout-content-container flex flex-col max-w-[800px] flex-1 gap-8">
            
            {/* Thẻ Tiêu đề kết quả */}
            <div className="relative bg-white rounded-2xl p-10 shadow-lg border border-[#f3e7ed] text-center overflow-hidden">
              <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mb-2 animate-bounce">
                  {feedback.icon}
                </div>
                <h1 className="text-[#1b0d14] text-4xl font-bold">{feedback.title}</h1>
                <p className="text-[#9a4c73] text-lg">{feedback.desc}</p>
              </div>
            </div>

            {/* Bảng Thống kê */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-[#f3e7ed] shadow-sm flex flex-col items-center">
                <span className="text-xs font-bold text-[#9a4c73] uppercase mb-1">Tổng điểm</span>
                <p className="text-3xl font-bold text-[#1b0d14]">{score}/{total}</p>
                <div className="w-full bg-[#f3e7ed] h-1.5 rounded-full mt-4 overflow-hidden">
                  <div 
                    className="bg-primary h-full transition-all duration-1000" 
                    style={{ width: `${accuracy}%` }}
                  ></div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-[#f3e7ed] shadow-sm flex flex-col items-center">
                <span className="text-xs font-bold text-[#9a4c73] uppercase mb-1">Độ chính xác</span>
                <p className="text-3xl font-bold text-[#1b0d14]">{accuracy}%</p>
                <div className={`flex items-center gap-1 mt-4 font-bold text-sm ${accuracy >= 80 ? 'text-emerald-500' : 'text-orange-500'}`}>
                  {accuracy >= 80 ? <TrendingUp size={16} /> : null} 
                  {accuracy === 100 ? 'Đã thành thạo!' : accuracy >= 50 ? 'Tiến bộ ổn định' : 'Cần xem lại bài'}
                </div>
              </div>
            </div>

            {/* Phần Gợi ý bước tiếp theo */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#f3e7ed] overflow-hidden">
              <div className="p-6 border-b border-[#f3e7ed] flex items-center gap-2">
                <BookOpen className="text-primary" size={24} />
                <h3 className="font-bold text-lg text-[#1b0d14]">Gợi ý tiếp theo dành cho bạn</h3>
              </div>
              <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between p-4 bg-[#fcf8fa] border border-[#f3e7ed] rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col">
                      <span className="font-bold text-[#1b0d14]">
                        {accuracy === 100 ? 'Thử thách cấp độ tiếp theo' : 'Ôn tập lại chủ đề này'}
                      </span>
                      <span className="text-sm text-[#9a4c73]">
                         Dựa trên tỉ lệ chính xác {accuracy}% của bạn
                      </span>
                    </div>
                    <button 
                      onClick={() => navigate('/grammar-library')}
                      className="text-primary hover:text-[#d93a89] flex items-center gap-1 font-bold text-sm"
                    >
                      Khám phá <ExternalLink size={16} />
                    </button>
                  </div>
              </div>
            </div>

            {/* Các nút Hành động */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => navigate(`/grammar-quiz/${topicId}`)}
                className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white rounded-xl font-bold hover:brightness-110 active:scale-95 transition-all shadow-md"
              >
                <History size={20} /> Làm lại bài Quiz
              </button>
              <button 
                onClick={() => navigate('/grammar-library')}
                className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-primary text-primary rounded-xl font-bold hover:bg-pink-50 active:scale-95 transition-all"
              >
                <Library size={20} /> Quay lại Thư viện
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default QuizResults;