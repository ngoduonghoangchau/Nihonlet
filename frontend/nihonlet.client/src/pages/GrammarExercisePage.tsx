import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Check, X } from 'lucide-react';

// Định nghĩa cấu trúc cho một câu hỏi ngữ pháp
// Định nghĩa các Entities
export interface GrammarQuestionOption {
  id: number;
  label: string;
  content: string;
  isCorrect: boolean;
}

export interface GrammarQuestion {
  id: number;
  questionText: string;
  explanation?: string;
  options: GrammarQuestionOption[];
}

export interface GrammarExercise {
  id: number;
  level: string;
  title: string;
  questions: GrammarQuestion[];
}

export interface GrammarUserAnswer {
  questionId: number;
  selectedOptionId: number;
  isCorrect: boolean;
}

const GrammarExercisePage: React.FC = () => {
  const { topicId } = useParams();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [userAnswers, setUserAnswers] = useState<GrammarUserAnswer[]>([]);
  const [showResults, setShowResults] = useState(false);

  const [exercise, setExercise] = useState<GrammarExercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchExercise = async () => {
      if (!topicId) return;
      setLoading(true);
      try {
        // Gọi API để lấy dữ liệu từ Database
        // Bỏ toUpperCase() để gửi đúng id từ URL, backend sẽ xử lý case-insensitive
        const response = await fetch(`/api/grammarexercises/by-level/${topicId}`);
        
        const contentType = response.headers.get("content-type");
        if (response.ok && contentType && contentType.includes("application/json")) {
          const data = await response.json();
          console.log("Fetched exercise data:", data); // Log dữ liệu để kiểm tra
          setExercise(data);
        } else {
          console.error("Failed to fetch exercise:", response.status, response.statusText);
          setErrorMsg(`Lỗi tải bài tập: ${response.status} ${response.statusText}`);
          if (contentType && !contentType.includes("application/json")) {
            console.error("Received HTML instead of JSON. Check API URL or Proxy configuration.");
            setErrorMsg("Lỗi kết nối: Server trả về HTML thay vì JSON.");
          }
          setExercise(null);
        }
      } catch (error) {
        console.error("Error fetching exercise:", error);
        setErrorMsg("Lỗi kết nối đến Server.");
        setExercise(null);
      } finally {
        setLoading(false);
      }
    };

    fetchExercise();
  }, [topicId]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;
  }

  if (!exercise || !exercise.questions || exercise.questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-600 font-literata bg-[#FFF5F7]">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center border border-pink-100 max-w-md mx-4">
          <p className="text-xl font-bold mb-2 text-gray-800">Không tìm thấy bài tập</p>
          <p className="text-gray-500 mb-4">Chủ đề: <span className="font-mono text-pink-600">{topicId}</span></p>
          {errorMsg && <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm mb-6 text-left">{errorMsg}</div>}
          <Link to="/grammar" className="inline-block px-6 py-3 bg-pink-500 text-white rounded-xl font-bold hover:bg-pink-600 transition shadow-lg shadow-pink-200">
            Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  const currentQuestion = exercise.questions[currentQuestionIndex];
  
  // Tính điểm dựa trên danh sách câu trả lời
  const score = userAnswers.filter(a => a.isCorrect).length;

  const handleOptionSelect = (optionId: number) => {
    if (isAnswerChecked) return; // Không cho chọn lại khi đã kiểm tra
    setSelectedOptionId(optionId);
  };

  const handleCheckAnswer = () => {
    if (selectedOptionId === null) return;
    
    const selectedOption = currentQuestion.options.find(o => o.id === selectedOptionId);
    const isCorrect = selectedOption?.isCorrect || false;

    setIsAnswerChecked(true);
    
    // Lưu kết quả trả lời
    const newAnswer: GrammarUserAnswer = {
      questionId: currentQuestion.id,
      selectedOptionId: selectedOptionId,
      isCorrect: isCorrect
    };
    
    setUserAnswers([...userAnswers, newAnswer]);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < exercise.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOptionId(null);
      setIsAnswerChecked(false);
    } else {
      setShowResults(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedOptionId(null);
    setIsAnswerChecked(false);
    setUserAnswers([]);
    setShowResults(false);
  };

  // Màn hình kết quả
  if (showResults) {
    return (
      <div className="min-h-screen bg-[#FFF5F7] flex items-center justify-center p-4 font-literata">
      <div className="max-w-2xl w-full p-8 bg-white rounded-3xl shadow-xl text-center border border-pink-100">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Kết quả bài tập</h2>
        <div className="py-8">
          <p className="text-xl mb-2">Bạn đã trả lời đúng</p>
          <p className="text-5xl font-bold text-pink-600 mb-6">
            {score} <span className="text-2xl text-gray-500">/ {exercise.questions.length}</span>
          </p>
          <p className="text-gray-600">
            {score === exercise.questions.length ? 'Xuất sắc! Bạn đã nắm vững ngữ pháp này.' : 'Hãy cố gắng luyện tập thêm nhé!'}
          </p>
          
          {/* Hiển thị chi tiết kết quả (Sử dụng GrammarUserAnswer) */}
          <div className="mt-8 text-left max-h-60 overflow-y-auto border rounded-xl p-4 bg-gray-50">
            <h4 className="font-bold text-gray-700 mb-3">Chi tiết bài làm:</h4>
            <div className="space-y-2">
              {userAnswers.map((answer, idx) => {
                const question = exercise.questions.find(q => q.id === answer.questionId);
                return (
                  <div key={idx} className="flex items-center justify-between text-sm border-b border-gray-200 pb-2 last:border-0">
                    <span className="text-gray-600 truncate max-w-[70%]">
                      Câu {idx + 1}: {question?.questionText}
                    </span>
                    <span className={`font-bold ${answer.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                      {answer.isCorrect ? 'Đúng' : 'Sai'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <button
          onClick={handleRestart}
          className="px-8 py-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors font-bold font-lalezar shadow-lg shadow-pink-200"
        >
          Làm lại
        </button>
        <div className="mt-6">
            <Link to="/grammar" className="text-gray-500 hover:text-pink-500 font-bold">
                Quay lại Danh sách chủ đề
            </Link>
        </div>
      </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF5F7] p-6 font-literata">
      <div className="max-w-2xl mx-auto mb-6">
        <Link to="/grammar" className="inline-flex items-center text-gray-600 hover:text-pink-600 transition-colors font-bold">
          <ArrowLeft className="mr-2" size={20} />
          Quay lại Danh sách chủ đề
        </Link>
      </div>

    <div className="max-w-2xl mx-auto p-8 bg-white rounded-3xl shadow-xl border border-pink-100">
      {/* Header & Progress */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">{exercise.title}</h2>
        <span className="text-sm text-gray-500 font-medium">
          Câu {currentQuestionIndex + 1} / {exercise.questions.length}
        </span>
      </div>

      <div className="mb-6 w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-pink-500 h-2.5 rounded-full transition-all duration-300 ease-out" 
          style={{ width: `${((currentQuestionIndex + 1) / exercise.questions.length) * 100}%` }}
        ></div>
      </div>

      {/* Question Section */}
      <div className="mb-8">
        <h3 className="text-2xl font-medium text-gray-900 mb-6 leading-relaxed">{currentQuestion.questionText}</h3>
        
        <div className="space-y-3">
          {currentQuestion.options.map((option) => {
            // Logic xác định style cho từng option dựa trên trạng thái đúng/sai
            let optionClass = "w-full p-4 text-left border-2 rounded-xl transition-all duration-200 flex items-center ";
            
            const isSelected = selectedOptionId === option.id;

            if (isAnswerChecked) {
              if (option.isCorrect) {
                optionClass += "bg-green-50 border-green-500 text-green-800"; // Đáp án đúng
              } else if (isSelected && !option.isCorrect) {
                optionClass += "bg-red-50 border-red-500 text-red-800"; // Đáp án sai người dùng chọn
              } else {
                optionClass += "bg-gray-50 border-gray-200 opacity-50"; // Các đáp án khác
              }
            } else {
              if (isSelected) {
                optionClass += "bg-pink-50 border-pink-500 text-pink-800 shadow-sm"; // Đang chọn
              } else {
                optionClass += "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300"; // Mặc định
              }
            }

            return (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option.id)}
                disabled={isAnswerChecked}
                className={optionClass}
              >
                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-300 mr-4 text-sm font-bold text-gray-600 shrink-0">
                  {option.label}
                </span>
                <span className="text-lg">{option.content}</span>
                
                {/* Icon chỉ thị đúng sai */}
                {isAnswerChecked && option.isCorrect && (
                  <span className="ml-auto text-green-600 font-bold"><Check size={20} /></span>
                )}
                {isAnswerChecked && isSelected && !option.isCorrect && (
                  <span className="ml-auto text-red-600 font-bold"><X size={20} /></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Explanation Section */}
      {isAnswerChecked && currentQuestion.explanation && (
        <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 text-blue-800 rounded-r-xl animate-fade-in">
          <p className="font-bold mb-1">Giải thích:</p>
          <p>{currentQuestion.explanation}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end pt-4 border-t border-gray-100">
        {!isAnswerChecked ? (
          <button
            onClick={handleCheckAnswer}
            disabled={selectedOptionId === null}
            className={`px-8 py-2.5 rounded-md text-white font-medium transition-colors shadow-sm ${
              selectedOptionId === null 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-pink-500 hover:bg-pink-600 shadow-pink-200'
            }`}
          >
            Kiểm tra
          </button>
        ) : (
          <button
            onClick={handleNextQuestion}
            className="px-8 py-2.5 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors font-medium shadow-lg shadow-pink-200 flex items-center"
          >
            {currentQuestionIndex < exercise.questions.length - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}
            <span className="ml-2">→</span>
          </button>
        )}
      </div>
    </div>
    <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default GrammarExercisePage;