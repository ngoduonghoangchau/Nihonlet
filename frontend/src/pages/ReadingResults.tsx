import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { 
  PartyPopper, 
  CheckCircle2, 
  PieChart, 
  Check, 
  X, 
  RotateCcw, 
  ArrowLeft,
  Frown,
  ListChecks
} from 'lucide-react';

const ReadingResults: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Nhận dữ liệu từ trang ReadingExercise (Thêm catId ở đây)
  const { questions, selectedAnswers, results, level, catId } = location.state || {};

  // 2. Xử lý trường hợp không có dữ liệu
  if (!questions || !results) {
    return (
      <div className="bg-[#fff1f2] min-h-screen flex flex-col font-display text-[#333333]">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center p-10 animate-fadeIn">
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md border border-pink-100">
            <div className="bg-gray-100 p-4 rounded-full inline-flex mb-4">
              <ListChecks size={40} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy kết quả</h2>
            <p className="text-gray-600 mb-6">Bạn cần hoàn thành bài tập đọc hiểu trước khi xem kết quả.</p>
            <button 
              onClick={() => navigate(`/reading-list?level=${level || 'N5'}${catId ? `&catId=${catId}` : ''}`)}
              className="w-full px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-md hover:bg-pink-600 transition-all"
            >
              Quay lại danh sách bài học
            </button>
          </div>
        </main>
      </div>
    );
  }

  // 3. Tính toán thống kê
  const totalQuestions = questions.length;
  const correctCount = questions.filter((q: any) => results[q.questionId]?.isCorrect).length;
  const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  
  return (
    <div className="bg-[#fff1f2] min-h-screen flex flex-col font-display text-[#333333]">
      <style>{`
        ruby { display: inline-flex; flex-direction: column-reverse; vertical-align: bottom; align-items: center; }
        rt { font-size: 0.6em; line-height: 1; margin-bottom: -0.2em; user-select: none; color: #ec4899; }
      `}</style>
      
      <Header />

      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full animate-fadeIn">
        
        {/* Top Header Section */}
        <div className="text-center mb-10">
          <div className={`inline-flex items-center justify-center p-4 rounded-full mb-6 shadow-inner ${accuracy >= 50 ? 'bg-pink-100' : 'bg-gray-100'}`}>
            {accuracy >= 80 ? (
              <PartyPopper size={60} className="text-primary" />
            ) : accuracy >= 50 ? (
              <CheckCircle2 size={60} className="text-primary" />
            ) : (
              <Frown size={60} className="text-gray-400" />
            )}
          </div>
          <h1 className="text-4xl font-extrabold text-[#1b0d14] mb-2">
            {accuracy >= 80 ? "Xuất sắc!" : accuracy >= 50 ? "Làm tốt lắm!" : "Cần cố gắng thêm!"}
          </h1>
          <p className="text-lg text-gray-600">Bạn đã hoàn thành bài luyện đọc.</p>
        </div>

        {/* Score Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-soft p-6 border border-pink-100 flex flex-col items-center justify-center text-center transform hover:scale-105 transition-all duration-300">
            <div className="bg-green-100 p-3 rounded-full mb-3">
              <CheckCircle2 size={32} className="text-emerald-500" />
            </div>
            <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">Số câu đúng</h3>
            <p className="text-4xl font-bold text-[#1b0d14]">{correctCount}<span className="text-xl text-gray-400 font-normal">/{totalQuestions}</span></p>
          </div>

          <div className="bg-white rounded-2xl shadow-soft p-6 border border-pink-100 flex flex-col items-center justify-center text-center transform hover:scale-105 transition-all duration-300">
            <div className="bg-blue-100 p-3 rounded-full mb-3">
              <PieChart size={32} className="text-blue-500" />
            </div>
            <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">Độ chính xác</h3>
            <p className="text-4xl font-bold text-[#1b0d14]">{accuracy}%</p>
          </div>
        </div>

        {/* Question Summary Table */}
        <div className="bg-white rounded-2xl shadow-soft border border-pink-100 overflow-hidden mb-10">
          <div className="px-6 py-4 bg-pink-50 border-b border-pink-100 flex justify-between items-center">
            <h2 className="font-bold text-lg text-[#1b0d14]">Chi tiết câu trả lời</h2>
            <span className="text-sm text-gray-500 font-medium">Tổng cộng {totalQuestions} câu</span>
          </div>

          <div className="divide-y divide-gray-100">
            {questions.map((q: any, index: number) => {
              const userSelectedId = selectedAnswers[q.questionId];
              const result = results[q.questionId];
              const isCorrect = result?.isCorrect;
              
              const userOption = q.options.find((o: any) => o.optionId === userSelectedId);
              const correctOption = q.options.find((o: any) => o.optionId === result?.correctOptionId);

              return (
                <div 
                  key={q.questionId} 
                  className={`p-6 hover:bg-pink-50/50 transition-colors ${!isCorrect ? 'bg-red-50/30' : ''}`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-4 mt-1">
                      <span className={`flex items-center justify-center w-8 h-8 rounded-full ${isCorrect ? 'bg-green-100 text-emerald-500' : 'bg-red-100 text-red-500'}`}>
                        {isCorrect ? <Check size={18} /> : <X size={18} />}
                      </span>
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-[#1b0d14] text-sm">Câu hỏi {index + 1}</h3>
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${isCorrect ? 'bg-green-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                          {isCorrect ? 'Chính xác' : 'Chưa chính xác'}
                        </span>
                      </div>
                      <p className="text-gray-800 font-medium text-base mb-3">{q.questionText}</p>
                      
                      <div className="space-y-1">
                        <p className="text-sm text-[#1b0d14]">
                          Bạn chọn: <span className={`font-bold ${!isCorrect ? 'text-red-600 line-through decoration-2' : 'text-emerald-600'}`}>{userOption?.optionText || "Chưa chọn"}</span>
                        </p>
                        {!isCorrect && correctOption && (
                          <p className="text-sm text-emerald-600 font-bold">
                            Đáp án đúng: {correctOption.optionText}
                          </p>
                        )}
                      </div>

                      {result?.explanation && (
                        <div className="mt-3 p-3 bg-white/60 rounded-lg border border-gray-200 text-sm text-gray-600 italic">
                          <span className="font-bold not-italic mr-1">Giải thích:</span> {result.explanation}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-8 py-3 bg-white text-primary font-bold rounded-xl border-2 border-primary/30 hover:bg-pink-50 shadow-sm transition-all flex items-center justify-center"
          >
            <RotateCcw size={20} className="mr-2" />
            Làm lại bài
          </button>

          <button 
            // FIX LỖI Ở ĐÂY: Đã kẹp thêm catId vào URL
            onClick={() => navigate(`/reading-list?level=${level || 'N5'}${catId ? `&catId=${catId}` : ''}`)}
            className="w-full sm:w-auto px-8 py-3 bg-primary hover:bg-pink-600 text-white font-bold rounded-xl shadow-lg hover:shadow-primary/40 transition-all transform hover:-translate-y-1 flex items-center justify-center"
          >
            <ArrowLeft size={20} className="mr-2" />
            Về danh sách bài đọc
          </button>
        </div>
      </main>
    </div>
  );
};

export default ReadingResults;