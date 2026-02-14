import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  XCircle,
  Bot,
  ArrowRight,
  GraduationCap,
  HelpCircle,
  Loader2,
  X
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../hooks/useAuth';

const GrammarQuiz: React.FC = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [questions, setQuestions] = useState<any[]>([]);
  const [topic, setTopic] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [checkResult, setCheckResult] = useState<any>(null);
  const [score, setScore] = useState(0);

  // 1. Lấy dữ liệu bài học và câu hỏi
  useEffect(() => {
    const loadData = async () => {
      try {
        const [topicRes, questionsRes] = await Promise.all([
          api.get(`/Grammar/topics/${topicId}`),
          api.get(`/Grammar/topics/${topicId}/questions`)
        ]);
        setTopic(topicRes.data);
        setQuestions(questionsRes.data);
      } catch (error) {
        console.error("Lỗi tải bài tập:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [topicId]);

  // 2. Logic kiểm tra đáp án
  const handleCheck = async () => {
    if (selectedId === null || isChecked) return;
    try {
      const response = await api.post('/Grammar/submit-answer', {
        userId: user?.id,
        questionId: questions[currentIndex].questionId,
        selectedOptionId: selectedId
      });
      setCheckResult(response.data);
      setIsChecked(true);
      if (response.data.isCorrect) setScore(prev => prev + 1);
    } catch (error) {
      console.error("Lỗi kiểm tra đáp án:", error);
    }
  };

  // 3. Chuyển câu hỏi & Lưu tiến độ
  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedId(null);
      setIsChecked(false);
      setCheckResult(null);
    } else {
      const finalScore = score;
      try {
        await api.post('/Grammar/update-progress', {
          userId: user?.id,
          topicId: parseInt(topicId!),
          correctAnswers: finalScore,
          totalQuestions: questions.length
        });
      } catch (error) {
        console.error("Lỗi lưu tiến độ:", error);
      }
      navigate('/quiz-results', { state: { score: finalScore, total: questions.length, topicId } });
    }
  };

  // --- MÀN HÌNH LOADING ---
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FCF8FA]">
      <Loader2 className="animate-spin text-primary w-10 h-10" />
    </div>
  );

  // --- MÀN HÌNH TRỐNG (Không có câu hỏi) ---
  if (!loading && questions.length === 0) {
    return (
      <div className="bg-[#FCF8FA] min-h-screen flex flex-col font-display text-[#1b0d14]">
        <header className="px-4 md:px-8 py-4 flex justify-between items-center bg-white border-b border-gray-100">
          <div className="flex items-center gap-2 text-primary">
            <GraduationCap className="w-6 h-6" fill="currentColor" />
            <h1 className="text-lg md:text-xl font-black tracking-tight text-[#1b0d14]">Ngữ pháp</h1>
          </div>
          <button onClick={() => navigate('/grammar-library')} className="p-2 text-gray-500 hover:text-red-500 transition-colors bg-gray-50 hover:bg-red-50 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </header>
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-10">
          <div className="max-w-[500px] w-full bg-white rounded-[2rem] p-8 md:p-12 shadow-xl border border-[#f3e7ed] text-center">
            <div className="bg-[#f3e7ed] w-20 h-20 md:w-24 md:h-24 rounded-[2rem] flex items-center justify-center text-primary mx-auto mb-6 md:mb-8">
              <Bot className="w-10 h-10 md:w-12 md:h-12" />
            </div>
            <h2 className="text-2xl md:text-3xl font-black mb-4">Trống trơn...</h2>
            <p className="text-[#64324d] font-medium mb-8 leading-relaxed">
              Bài học này chưa có câu hỏi nào được chuẩn bị. Hãy quay lại sau nhé!
            </p>
            <button
              onClick={() => navigate('/grammar-library')}
              className="w-full bg-primary text-white py-4 rounded-2xl font-black shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              Quay lại Thư viện <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </main>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  // --- MÀN HÌNH QUIZ CHÍNH ---
  return (
    <div className="bg-[#FCF8FA] min-h-screen flex flex-col font-display text-[#1b0d14]">
      
      {/* HEADER TỐI ƯU MOBILE & TIẾN ĐỘ */}
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="px-3 md:px-8 h-14 md:h-20 flex justify-between items-center gap-2 md:gap-4">
          
          {/* Thông tin bài học (Bên trái) */}
          <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0"> 
            <div className="bg-primary/10 p-1.5 md:p-2.5 rounded-lg md:rounded-xl text-primary shrink-0">
              <GraduationCap className="w-4 h-4 md:w-6 md:h-6" />
            </div>
            <div className="flex flex-col justify-center min-w-0">
                <h1 className="text-sm md:text-lg font-black text-[#1b0d14] tracking-tight truncate leading-tight">
                    {topic?.title || "Luyện tập ngữ pháp"}
                </h1>
                <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest hidden sm:block">
                   Cấp độ {topic?.level || "N5"}
                </p>
            </div>
          </div>

          {/* Bộ đếm & Nút thoát (Bên phải) */}
          <div className="flex items-center gap-2 md:gap-6 shrink-0">
             <div className="flex items-center gap-1 bg-[#fcf8fa] border border-[#f3e7ed] px-2.5 py-1 md:px-3 md:py-1.5 rounded-full shadow-sm">
                <span className="text-xs md:text-base font-black text-primary">
                    {currentIndex + 1}
                </span>
                <span className="text-[9px] md:text-xs font-bold text-gray-400 mt-0.5">
                    / {questions.length}
                </span>
             </div>

             <button
                onClick={() => navigate('/grammar-library')}
                className="w-7 h-7 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-gray-50 md:bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all active:scale-90 border border-transparent hover:border-red-100"
                title="Thoát bài học"
             >
                <X className="w-4 h-4 md:w-6 md:h-6 stroke-[3px]" />
             </button>
          </div>
        </div>

        {/* Thanh tiến độ siêu mỏng (Slim Progress Bar) */}
        <div className="w-full h-1 md:h-1.5 bg-gray-100">
            <div 
                className="h-full bg-primary shadow-[0_0_10px_rgba(233,30,99,0.5)] transition-all duration-700 ease-out rounded-r-full"
                style={{ width: `${progress}%` }}
            />
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center py-4 md:py-12 px-3 md:px-6">
        <div className="w-full max-w-[600px] lg:max-w-[1000px] flex flex-col gap-4 md:gap-8">
          
          {/* KHUNG CÂU HỎI */}
          <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl border border-[#f3e7ed] overflow-hidden flex flex-col mt-2 md:mt-0">
            
            {/* Phần hiển thị câu hỏi */}
            <div className="p-5 md:p-10 border-b border-gray-50">
              <div className="flex items-center gap-2 text-primary mb-4">
                <HelpCircle className="w-4 h-4 md:w-6 md:h-6" />
                <h2 className="text-[10px] md:text-base font-black uppercase tracking-widest opacity-70">Chọn đáp án đúng</h2>
              </div>

              <div className="text-center py-6 md:py-12">
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-black tracking-tight text-[#1b0d14] leading-tight break-words">
                  {currentQuestion.questionText}
                </h1>
              </div>
            </div>

            {/* Lưới đáp án (1 cột mobile, 2 cột desktop) */}
            <div className="p-4 md:p-10 grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6 bg-gray-50/30">
              {currentQuestion.options.map((option: any, index: number) => {
                const isSelected = selectedId === option.optionId;
                const isCorrect = isChecked && checkResult?.correctOptionId === option.optionId;
                const isWrong = isChecked && isSelected && !checkResult?.isCorrect;

                let containerClass = "border-2 border-[#f3e7ed] bg-white";
                if (isSelected && !isChecked) containerClass = "border-primary bg-pink-50 shadow-md scale-[1.02]";
                if (isCorrect) containerClass = "border-emerald-500 bg-emerald-50 shadow-md";
                if (isWrong) containerClass = "border-red-200 bg-red-50 opacity-80";

                return (
                  <div
                    key={option.optionId}
                    onClick={() => !isChecked && setSelectedId(option.optionId)}
                    className={`group p-4 md:p-6 rounded-2xl md:rounded-[1.5rem] flex justify-between items-center cursor-pointer transition-all duration-300 ${containerClass}`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Viên thuốc A, B, C, D */}
                      <div className={`w-8 h-8 md:w-12 md:h-12 rounded-xl flex items-center justify-center font-black text-sm md:text-xl shrink-0 transition-colors ${
                        isCorrect ? "bg-emerald-500 text-white" :
                        isWrong ? "bg-red-500 text-white" :
                        isSelected ? "bg-primary text-white" : "bg-[#f3e7ed] text-[#9a4c73]"
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="text-base md:text-2xl font-bold text-[#1b0d14]">{option.optionText}</span>
                    </div>
                    
                    <div className="shrink-0">
                      {isCorrect && <CheckCircle2 className="text-emerald-500 w-6 h-6 md:w-8 md:h-8" />}
                      {isWrong && <XCircle className="text-red-500 w-6 h-6 md:w-8 md:h-8" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* KHU VỰC NÚT BẤM (Footer) */}
            <div className="p-5 md:p-10 border-t border-gray-100 bg-white">
              {isChecked ? (
                <div className="flex flex-col lg:flex-row items-center gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-start gap-4 flex-1 w-full lg:w-auto">
                    <div className={`p-3 rounded-2xl shrink-0 shadow-sm ${checkResult?.isCorrect ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                      <Bot className="w-7 h-7 md:w-10 md:h-10" />
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-black text-xs md:text-lg uppercase tracking-wider mb-1 ${checkResult?.isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>
                        {checkResult?.isCorrect ? "Tuyệt vời! Chính xác" : "Giải thích:"}
                      </h4>
                      <p className="text-[#64324d] text-xs md:text-base font-medium leading-relaxed">
                        {checkResult?.explanation}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleNext}
                    className="w-full lg:w-auto bg-primary text-white px-10 py-4 md:py-5 rounded-2xl font-black text-sm md:text-xl flex items-center justify-center gap-3 shadow-xl shadow-primary/30 hover:brightness-110 hover:-translate-y-1 active:scale-95 transition-all"
                  >
                    {currentIndex === questions.length - 1 ? "Xem kết quả" : "Câu tiếp theo"}
                    <ArrowRight className="w-5 h-5 md:w-6 md:h-6 stroke-[3px]" />
                  </button>
                </div>
              ) : (
                <div className="flex justify-center md:justify-end">
                  <button
                    onClick={handleCheck}
                    disabled={selectedId === null}
                    className="w-full md:w-auto bg-primary text-white px-16 py-4 md:py-5 rounded-2xl font-black text-sm md:text-xl shadow-xl shadow-primary/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-30 disabled:grayscale disabled:hover:translate-y-0"
                  >
                    Kiểm tra đáp án
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default GrammarQuiz;