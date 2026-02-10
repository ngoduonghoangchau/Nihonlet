import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  XCircle,
  Bot,
  ArrowRight,
  GraduationCap,
  HelpCircle,
  Loader2
} from 'lucide-react';
import api from '../api/axios'; // Đảm bảo đường dẫn này đúng với project của bạn
import { useAuth } from '../hooks/useAuth';

const GrammarQuiz: React.FC = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // --- State dữ liệu từ Backend ---
  const [questions, setQuestions] = useState<any[]>([]);
  const [topic, setTopic] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // --- State điều khiển Quiz ---
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [checkResult, setCheckResult] = useState<any>(null);
  const [score, setScore] = useState(0);

  // 1. Lấy dữ liệu khi vào trang
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
        console.error("Error loading quiz:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [topicId]);

  // 2. Logic kiểm tra đáp án (Gọi SubmitAnswerCommand)
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
      console.error("Error checking answer:", error);
    }
  };

  // 3. Chuyển câu hỏi
  const handleNext = async () => { // Thêm async
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedId(null);
      setIsChecked(false);
      setCheckResult(null);
    } else {
      // --- PHẦN CẬP NHẬT: LƯU KẾT QUẢ VÀO DATABASE ---
      // FIX: score đã được cập nhật trong handleCheck (setScore), nên không cần cộng thêm checkResult
      const finalScore = score;
      
      try {
        // Gọi API lưu tiến độ trước khi chuyển sang trang kết quả
        await api.post('/Grammar/update-progress', {
          userId: user?.id,
          topicId: parseInt(topicId!),
          correctAnswers: finalScore,
          totalQuestions: questions.length
        });
      } catch (error) {
        console.error("Lỗi lưu tiến độ:", error);
      }

      // Chuyển sang trang kết quả như cũ
      navigate('/quiz-results', { 
        state: { 
          score: finalScore, 
          total: questions.length, 
          topicId 
        } 
      });
    }
};

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FCF8FA]">
      <Loader2 className="animate-spin text-primary" size={40} />
    </div>
  );

  // if (questions.length === 0) return <div className="p-10 text-center">No questions found.</div>;
  // Thay thế đoạn: if (questions.length === 0) return ... bằng đoạn này:

  if (!loading && questions.length === 0) {
    return (
      <div className="bg-[#FCF8FA] min-h-screen flex flex-col font-display text-[#1b0d14]">
        {/* Giữ nguyên Header để người dùng vẫn có thể thoát */}
        <header className="px-8 py-4 flex justify-between items-center bg-white border-b border-gray-100">
          <div className="flex items-center gap-3 text-primary">
            <div className="bg-primary p-1.5 rounded-lg text-white">
              <GraduationCap size={24} fill="currentColor" />
            </div>
            <h1 className="text-xl font-black tracking-tight text-[#1b0d14]">
              {topic?.title || "Grammar Quiz"}
            </h1>
          </div>
          <button
            onClick={() => navigate('/grammar-library')}
            className="px-6 py-2 bg-[#f3e7ed] text-[#1b0d14] font-bold rounded-xl hover:bg-pink-100 transition-colors"
          >
            Back
          </button>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="max-w-[500px] w-full bg-white rounded-[2rem] p-12 shadow-xl border border-[#f3e7ed] text-center animate-in fade-in zoom-in duration-500">
            {/* Icon Bot với vòng tròn màu hồng nhạt đặc trưng */}
            <div className="bg-[#f3e7ed] size-24 rounded-[2rem] flex items-center justify-center text-primary mx-auto mb-8 shadow-inner">
              <Bot size={56} />
            </div>

            <h2 className="text-3xl font-black mb-4 tracking-tight">Oops! Trống trơn...</h2>

            <p className="text-[#64324d] font-medium mb-10 leading-relaxed text-lg">
              Có vẻ như bài học này chưa được chuẩn bị câu hỏi.
              Đừng lo lắng, hãy quay lại thư viện để khám phá các bài học khác nhé!
            </p>

            <button
              onClick={() => navigate('/grammar-library')}
              className="w-full bg-primary text-white py-5 rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              Quay lại Thư viện <ArrowRight size={22} className="stroke-[3px]" />
            </button>
          </div>
        </main>
      </div>
    );
  }
  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="bg-[#FCF8FA] min-h-screen flex flex-col font-display text-[#1b0d14]">

      {/* --- QUIZ SESSION HEADER --- */}
      <header className="px-8 py-4 flex justify-between items-center bg-white border-b border-gray-100">
        <div className="flex items-center gap-3 text-primary">
          <div className="bg-primary p-1.5 rounded-lg text-white">
            <GraduationCap size={24} fill="currentColor" />
          </div>
          <h1 className="text-xl font-black tracking-tight text-[#1b0d14]">
            {topic?.title || "Grammar Quiz"}
          </h1>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-[10px] font-black text-primary uppercase tracking-widest">Level</p>
            <p className="text-sm font-bold text-[#1b0d14]">{topic?.level || "N/A"}</p>
          </div>
          <button
            onClick={() => navigate('/grammar-library')}
            className="px-6 py-2 bg-[#f3e7ed] text-[#1b0d14] font-bold rounded-xl hover:bg-pink-100 transition-colors"
          >
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
              <p className="text-lg font-bold text-[#1b0d14]">Question {currentIndex + 1} of {questions.length}</p>
              <p className="text-primary text-sm font-black uppercase tracking-wider">{Math.round(progress)}% Complete</p>
            </div>
            <div className="rounded-full bg-[#f3e7ed] h-4 overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-700" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          {/* --- QUESTION CARD --- */}
          <div className="bg-white rounded-[2rem] shadow-xl border border-[#f3e7ed] overflow-hidden">

            <div className="p-8 pb-4">
              <div className="flex items-center gap-3 text-primary mb-6">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <HelpCircle size={20} />
                </div>
                <h2 className="text-xl font-black">Choose the correct answer.</h2>
              </div>

              <div className="text-center py-10">
                <h1 className="text-5xl md:text-6xl font-black tracking-tight text-[#1b0d14]">
                  {currentQuestion.questionText}
                </h1>
              </div>
            </div>

            {/* --- OPTIONS GRID --- */}
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options.map((option: any, index: number) => {
                const isSelected = selectedId === option.optionId;
                const isCorrect = isChecked && checkResult?.correctOptionId === option.optionId;
                const isWrong = isChecked && isSelected && !checkResult?.isCorrect;

                // Logic giữ nguyên Style gốc của bạn
                let containerClass = "border-2 border-[#f3e7ed] bg-white";
                if (isSelected && !isChecked) containerClass = "border-primary bg-pink-50 shadow-md";
                if (isCorrect) containerClass = "border-emerald-500 bg-emerald-50 shadow-md";
                if (isWrong) containerClass = "border-red-200 bg-red-50";

                return (
                  <div
                    key={option.optionId}
                    onClick={() => !isChecked && setSelectedId(option.optionId)}
                    className={`group p-5 rounded-[1.5rem] flex justify-between items-center cursor-pointer transition-all hover:shadow-md ${containerClass}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`size-10 rounded-full flex items-center justify-center font-black ${isCorrect ? "bg-emerald-500 text-white" :
                          isWrong ? "bg-red-500 text-white" :
                            isSelected ? "bg-primary text-white" : "border-2 border-[#f3e7ed] text-gray-300"
                        }`}>
                        {index + 1}
                      </div>
                      <span className="text-2xl font-bold text-[#1b0d14]">{option.optionText}</span>
                    </div>
                    {isCorrect && <CheckCircle2 className="text-emerald-500" size={28} />}
                    {isWrong && <XCircle className="text-red-500" size={28} />}
                  </div>
                );
              })}
            </div>

            {/* --- EXPLANATION & ACTION BUTTON --- */}
            {isChecked ? (
              <div className="bg-[#E9FBF4] p-8 border-t border-emerald-100 animate-slideUp relative">
                <div className="flex items-start gap-5 mb-6">
                  <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-600">
                    <Bot size={32} />
                  </div>
                  <div className="max-w-[70%]">
                    <h4 className="text-emerald-800 font-black text-lg mb-2 uppercase tracking-wide">
                      {checkResult?.isCorrect ? "Correct!" : "Explanation:"}
                    </h4>
                    <p className="text-emerald-700 text-sm leading-relaxed font-medium">
                      {checkResult?.explanation}
                    </p>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={handleNext}
                    className="bg-primary text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                  >
                    {currentIndex === questions.length - 1 ? "See Results" : "Next Question"}
                    <ArrowRight size={20} className="stroke-[3px]" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 pt-0 flex justify-end">
                <button
                  onClick={handleCheck}
                  disabled={selectedId === null}
                  className="bg-primary text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
                >
                  Check Answer
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default GrammarQuiz;