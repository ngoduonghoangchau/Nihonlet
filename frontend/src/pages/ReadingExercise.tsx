import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import {
  Eye,
  EyeOff,
  ClipboardCheck,
  Loader2,
  CheckCircle2,
  XCircle,
  Bot,
  ArrowRight,
  ArrowLeft,
  Headphones,
  Languages,
  BookOpen,
  Trophy
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../hooks/useAuth';

// --- Interfaces ---
interface OptionDto {
  optionId: number;
  optionText: string;
}

interface QuestionDto {
  questionId: number;
  questionText: string;
  explanation: string;
  options: OptionDto[];
}

interface ReadingArticleDto {
  articleId: number;
  titleJp: string;
  titleVi: string;
  contentJp: string;
  contentFurigana: string;
  contentVi: string;
  audioUrl: string;
  level: string;
  catId: number;
  CatId?: number; // Thêm trường hợp backend trả về PascalCase
}

const ReadingExercise: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // State quản lý dữ liệu
  const [article, setArticle] = useState<ReadingArticleDto | null>(null);
  const [questions, setQuestions] = useState<QuestionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextArticleId, setNextArticleId] = useState<number | null>(null);

  // State điều khiển UI
  const [showFurigana, setShowFurigana] = useState(true);
  const [showTranslation, setShowTranslation] = useState(false);

  // State quản lý trắc nghiệm
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [results, setResults] = useState<Record<number, any>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Lấy catId từ state được truyền từ ReadingList (fallback an toàn)
  const stateCatId = location.state?.catId;

  const allQuestionsAnswered = questions.length > 0 && Object.keys(selectedAnswers).length === questions.length;

  // 1. Fetch dữ liệu
  useEffect(() => {
    setSelectedAnswers({});
    setResults({});
    setIsSubmitted(false);
    setNextArticleId(null);

    const fetchData = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [articleRes, questionsRes] = await Promise.all([
          api.get(`/Reading/articles/${id}`),
          api.get(`/Reading/articles/${id}/questions`)
        ]);

        setArticle(articleRes.data);
        setQuestions(questionsRes.data || []);

        if (articleRes.data) {
          try {
            const listRes = await api.get('/Reading/articles', {
              params: { level: articleRes.data.level, catId: articleRes.data.catId }
            });
            const articles = listRes.data || [];
            const currentIndex = articles.findIndex((a: any) => a.articleId === articleRes.data.articleId);
            if (currentIndex !== -1 && currentIndex < articles.length - 1) {
              setNextArticleId(articles[currentIndex + 1].articleId);
            }
          } catch (err) {
            console.error("Lỗi tìm bài tiếp theo:", err);
          }
        }
      } catch (error) {
        console.error("Lỗi gọi API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // 2. Render Furigana
  const renderFuriganaContent = (jsonString: string) => {
    if (!jsonString) return <span>{article?.contentJp}</span>;
    try {
      const parts = JSON.parse(jsonString);
      return parts.map((part: any, index: number) => {
        if (typeof part === 'string') return <span key={index}>{part}</span>;
        return (
          <ruby key={index}>
            {part.k}
            {showFurigana && <rt>{part.f}</rt>}
          </ruby>
        );
      });
    } catch (e) {
      return <span>{article?.contentJp}</span>;
    }
  };

  // 3. Nộp bài
  const handleSubmitAll = async () => {
    if (!allQuestionsAnswered) {
      alert("Vui lòng hoàn thành tất cả câu hỏi trước khi nộp bài!");
      return;
    }

    setSubmitting(true);
    let correctCount = 0;
    const newResults: Record<number, any> = {};

    try {
      for (const q of questions) {
        const res = await api.post('/Reading/submit-answer', {
          userId: user?.id,
          questionId: q.questionId,
          selectedOptionId: selectedAnswers[q.questionId]
        });
        newResults[q.questionId] = res.data;
        if (res.data.isCorrect) correctCount++;
      }

      setResults(newResults);
      setIsSubmitted(true);

      await api.post('/Reading/update-progress', {
        userId: user?.id,
        articleId: article?.articleId,
        correctAnswers: correctCount,
        totalQuestions: questions.length
      });

    } catch (error) {
      console.error("Lỗi nộp bài:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col bg-[#FCF8FA] font-display">
      <Header />
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="animate-spin text-primary w-12 h-12" />
      </div>
    </div>
  );

  if (!article) return (
    <div className="min-h-screen flex flex-col bg-[#FCF8FA] font-display items-center justify-center">
      <BookOpen className="w-16 h-16 text-gray-300 mb-4" />
      <h2 className="text-2xl font-black text-[#1b0d14] mb-4">Không tìm thấy bài đọc</h2>
      <button onClick={() => navigate(-1)} className="bg-primary text-white px-6 py-3 rounded-xl font-bold">Quay lại</button>
    </div>
  );

  // Xác định catId ưu tiên: article.catId -> article.CatId -> stateCatId
  const currentCatId = article?.catId || article?.CatId || stateCatId;

  return (
    <div className="bg-[#FCF8FA] min-h-screen flex flex-col font-display text-[#1b0d14]">
      {/* CSS Tuỳ chỉnh */}
      <style>{`
        ruby { display: inline-flex; flex-direction: column-reverse; vertical-align: bottom; line-height: 2.2; margin: 0 2px; }
        rt { display: block; line-height: 1; font-size: 0.55em; text-align: center; margin-bottom: 2px; transform: translateY(15%); color: #ec4899; font-weight: 900; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e7cfdb; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d93a89; }
      `}</style>

      <Header />

      <main className="flex-grow max-w-[1400px] mx-auto px-4 md:px-6 py-6 md:py-8 w-full animate-in fade-in zoom-in-95 duration-500">

        {/* --- HEADER BÀI HỌC MỚI (Tối ưu bố cục ngang) --- */}
        <header className="mb-6 md:mb-8 bg-white rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-6 shadow-sm border-2 border-[#f3e7ed] flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-6">

          {/* Trái: Nút Back + Cấp độ + Tiêu đề */}
          <div className="flex flex-col min-w-0 flex-1 gap-2">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(`/reading-list?level=${article.level}&catId=${currentCatId}`)}
                className="shrink-0 flex items-center justify-center w-10 h-10 md:w-auto md:px-4 md:py-2 bg-[#fcf8fa] hover:bg-primary border-2 border-[#e7cfdb] hover:border-primary rounded-xl text-[#9a4c73] hover:text-white transition-all active:scale-95 group"
                title="Quay lại danh sách"
              >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span className="hidden md:inline ml-1 font-bold text-sm">Quay lại</span>
              </button>

              <span className="shrink-0 bg-primary text-white text-[10px] md:text-xs font-black uppercase tracking-widest px-2.5 py-1.5 md:px-3 md:py-2 rounded-lg shadow-sm">
                {article.level}
              </span>

              <h1 className="text-xl md:text-2xl lg:text-3xl font-black text-[#1b0d14] tracking-tight truncate flex-1">
                {article.titleJp}
              </h1>
            </div>
            {/* Phụ đề Tiếng Việt */}
            <p className="text-[#9a4c73] font-medium text-xs md:text-sm pl-[3.25rem] md:pl-[8rem] truncate">
              {article.titleVi}
            </p>
          </div>

          {/* Phải: Công tắc bật/tắt (Dàn ngang hoàn toàn trên Mobile) */}
          <div className="flex flex-row w-full lg:w-auto gap-2 md:gap-3 shrink-0 mt-2 lg:mt-0">
            <button
              onClick={() => setShowFurigana(!showFurigana)}
              className={`flex-1 lg:flex-none flex items-center justify-center gap-1.5 md:gap-2 font-black text-xs md:text-sm px-2 md:px-5 py-2.5 md:py-3 rounded-xl border-2 transition-all duration-300 active:scale-95 ${showFurigana
                  ? 'bg-primary border-primary text-white shadow-md shadow-primary/20'
                  : 'bg-[#fcf8fa] border-[#e7cfdb] text-[#9a4c73] hover:bg-pink-50'
                }`}
            >
              {showFurigana ? <Eye size={16} /> : <EyeOff size={16} />}
              Phiên âm
            </button>

            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className={`flex-1 lg:flex-none flex items-center justify-center gap-1.5 md:gap-2 font-black text-xs md:text-sm px-2 md:px-5 py-2.5 md:py-3 rounded-xl border-2 transition-all duration-300 active:scale-95 ${showTranslation
                  ? 'bg-[#1b0d14] border-[#1b0d14] text-white shadow-md shadow-black/20'
                  : 'bg-[#fcf8fa] border-[#e7cfdb] text-[#9a4c73] hover:bg-gray-50'
                }`}
            >
              <Languages size={16} />
              Bản dịch
            </button>
          </div>
        </header>

        {/* --- GRID CHÍNH (Layout 2 cột) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">

          {/* CỘT TRÁI: NỘI DUNG ĐỌC */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">

            {/* Hộp Đọc Tiếng Nhật */}
            <div className="bg-white rounded-[2rem] shadow-sm p-6 md:p-10 lg:p-12 border-2 border-[#f3e7ed] relative">

              {/* Audio Player (Nếu có) */}
              {article.audioUrl && (
                <div className="mb-8 md:mb-10 bg-[#fcf8fa] p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-4 border-2 border-[#e7cfdb] shadow-inner">
                  <div className="bg-primary text-white p-3 rounded-xl shadow-md shrink-0">
                    <Headphones size={24} />
                  </div>
                  <audio controls src={article.audioUrl} className="w-full h-10 outline-none" />
                </div>
              )}

              {/* Văn bản tiếng Nhật */}
              <div className="text-xl md:text-2xl lg:text-3xl font-medium text-[#1b0d14] tracking-wide text-justify md:text-left leading-loose break-words">
                {renderFuriganaContent(article.contentFurigana)}
              </div>
            </div>

            {/* Hộp Dịch Nghĩa (Chỉ hiện khi toggle bật) */}
            {showTranslation && (
              <div className="bg-[#E9FBF4] rounded-[2rem] p-6 md:p-10 border-2 border-emerald-200 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-emerald-500 text-white p-2 rounded-xl">
                    <Languages size={20} />
                  </div>
                  <h4 className="font-black text-emerald-800 text-lg uppercase tracking-widest">Bản dịch tham khảo</h4>
                </div>
                <p className="text-emerald-900 text-base md:text-lg leading-relaxed font-medium italic">
                  {article.contentVi}
                </p>
              </div>
            )}
          </div>

          {/* CỘT PHẢI: TRẮC NGHIỆM (Sticky) */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="bg-white rounded-[2rem] shadow-xl border-2 border-[#f3e7ed] overflow-hidden lg:sticky lg:top-24 flex flex-col max-h-[calc(100vh-120px)]">

              {/* Header Trắc nghiệm */}
              <div className="bg-[#fcf8fa] px-6 md:px-8 py-5 border-b-2 border-[#e7cfdb] flex items-center justify-between shrink-0">
                <h3 className="font-black text-[#1b0d14] text-lg uppercase tracking-wider flex items-center gap-2">
                  <ClipboardCheck className="text-primary" size={24} /> Trắc nghiệm
                </h3>
                <span className="bg-white border-2 border-[#e7cfdb] text-[#9a4c73] px-3 py-1 rounded-xl font-black text-sm">
                  {Object.keys(selectedAnswers).length} / {questions.length}
                </span>
              </div>

              {/* Danh sách câu hỏi (Cuộn mượt) */}
              <div className="p-6 md:p-8 space-y-8 md:space-y-10 overflow-y-auto custom-scrollbar flex-1">
                {questions?.map((q, idx) => (
                  <div key={q.questionId} className="space-y-4">
                    {/* Tiêu đề câu hỏi */}
                    <div className="flex items-start gap-3">
                      <span className="shrink-0 w-8 h-8 rounded-xl bg-primary text-white font-black flex items-center justify-center text-sm shadow-md">
                        {idx + 1}
                      </span>
                      <p className="text-base md:text-lg font-black text-[#1b0d14] leading-snug pt-1">
                        {q.questionText}
                      </p>
                    </div>

                    {/* Các lựa chọn (A, B, C, D) */}
                    <div className="ml-0 sm:ml-11 space-y-3">
                      {q.options?.map((opt, optIdx) => {
                        const isSelected = selectedAnswers[q.questionId] === opt.optionId;
                        const res = results[q.questionId];
                        const isCorrect = res?.correctOptionId === opt.optionId;
                        const isWrong = isSelected && isSubmitted && !res?.isCorrect;

                        // Logic CSS cho các trạng thái nút
                        let containerClass = "border-2 border-[#e7cfdb] bg-white text-[#1b0d14] hover:border-primary/50 hover:bg-[#fcf8fa]";
                        let letterClass = "bg-[#f3e7ed] text-[#9a4c73]";

                        if (isSelected && !isSubmitted) {
                          containerClass = "border-primary bg-pink-50 shadow-md scale-[1.02]";
                          letterClass = "bg-primary text-white";
                        }
                        if (isSubmitted) {
                          if (isCorrect) {
                            containerClass = "border-emerald-500 bg-emerald-50 shadow-md";
                            letterClass = "bg-emerald-500 text-white";
                          }
                          else if (isWrong) {
                            containerClass = "border-rose-300 bg-rose-50 opacity-80";
                            letterClass = "bg-rose-400 text-white";
                          }
                          else {
                            containerClass = "border-[#f3e7ed] bg-gray-50 opacity-50 grayscale cursor-not-allowed";
                          }
                        }

                        return (
                          <button
                            key={opt.optionId}
                            disabled={isSubmitted}
                            onClick={() => setSelectedAnswers(prev => ({ ...prev, [q.questionId]: opt.optionId }))}
                            className={`w-full flex items-center justify-between p-3 md:p-4 rounded-2xl transition-all duration-300 text-left ${containerClass}`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm shrink-0 transition-colors ${letterClass}`}>
                                {String.fromCharCode(65 + optIdx)}
                              </div>
                              <span className={`font-bold text-sm md:text-base ${isSubmitted && isCorrect ? 'text-emerald-800' : ''}`}>
                                {opt.optionText}
                              </span>
                            </div>
                            <div className="shrink-0 ml-2">
                              {isSubmitted && isCorrect && <CheckCircle2 size={24} className="text-emerald-500" />}
                              {isSubmitted && isWrong && <XCircle size={24} className="text-rose-500" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Giải thích (Bot Box) */}
                    {isSubmitted && results[q.questionId] && (
                      <div className="ml-0 sm:ml-11 p-5 md:p-6 bg-emerald-50 rounded-2xl border-2 border-emerald-100 flex items-start gap-3 md:gap-4 animate-in fade-in slide-in-from-top-2">
                        <Bot size={28} className="text-emerald-600 shrink-0 mt-1" />
                        <div>
                          <h4 className="font-black text-emerald-800 text-xs uppercase tracking-widest mb-1">
                            Giải thích:
                          </h4>
                          <p className="text-sm text-emerald-900 font-medium leading-relaxed">
                            {q.explanation}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Footer Controls (Nút Nộp Bài / Chuyển Trang) */}
              <div className="p-6 bg-white border-t-2 border-[#f3e7ed] shrink-0">
                {!isSubmitted ? (
                  <button
                    onClick={handleSubmitAll}
                    disabled={submitting || !allQuestionsAnswered}
                    className={`w-full font-black py-4 md:py-5 rounded-2xl text-base md:text-lg flex items-center justify-center gap-2 transition-all duration-300 ${submitting || !allQuestionsAnswered
                        ? 'bg-gray-100 border-2 border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-primary hover:brightness-110 text-white shadow-xl shadow-primary/20 active:scale-95'
                      }`}
                  >
                    {submitting && <Loader2 className="animate-spin" size={20} />}
                    Nộp bài để xem kết quả
                  </button>
                ) : (
                  <div className="flex flex-col gap-3 animate-in fade-in zoom-in-95">
                    <button
                      onClick={() => navigate('/reading-result', { state: { questions, selectedAnswers, results, level: article?.level, catId: currentCatId } })}
                      className="w-full bg-[#1b0d14] text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-black transition-colors"
                    >
                      <Trophy size={20} /> Phân tích kết quả
                    </button>

                    {nextArticleId ? (
                      <button
                        onClick={() => navigate(`/reading-exercise/${nextArticleId}`)}
                        className="w-full bg-primary hover:brightness-110 text-white font-black py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
                      >
                        Làm bài tiếp theo <ArrowRight size={20} />
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate(`/reading-list?level=${article?.level}&catId=${currentCatId}`)}
                        className="w-full bg-white border-2 border-[#e7cfdb] text-[#9a4c73] hover:text-primary hover:border-primary font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
                      >
                        Hoàn thành chủ đề này
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default ReadingExercise;