import React from 'react';
import Header from '../components/Header'; // Import Header đã có sẵn
import { 
  PartyPopper, 
  CheckCircle2, 
  PieChart, 
  Check, 
  X, 
  RotateCcw, 
  ArrowLeft 
} from 'lucide-react';

const ReadingResults: React.FC = () => {
  // Dữ liệu giả lập kết quả các câu hỏi
  const questions = [
    {
      id: 1,
      title: "Question 1",
      questionText: <><span>アン：</span><ruby>何曜日<rt>なんようび</rt></ruby>ですか。</>,
      yourAnswer: <><ruby>日曜日<rt>にchiyoubi</rt></ruby></>,
      correct: true
    },
    {
      id: 2,
      title: "Question 2",
      questionText: <><span>メル：</span><ruby>何<rt>なに</rt></ruby>を　しますか。</>,
      yourAnswer: <><ruby>勉強<rt>benkyou</rt></ruby></>,
      correctAnswer: <><ruby>お花見<rt>hanami</rt></ruby></>,
      correct: false
    },
    {
      id: 3,
      title: "Question 3",
      questionText: "Meeting time check",
      yourAnswer: "午前",
      correct: true
    },
    {
      id: 4,
      title: "Question 4",
      questionText: "Cost check",
      yourAnswer: "2,500円",
      correct: true
    },
    {
      id: 5,
      title: "Question 5",
      questionText: "Item check",
      yourAnswer: "お弁当",
      correct: true
    }
  ];

  return (
    <div className="bg-[#fff1f2] min-h-screen flex flex-col font-display text-[#333333]">
      <style>{`
        ruby { display: inline-flex; flex-direction: column-reverse; vertical-align: bottom; align-items: center; }
        rt { font-size: 0.6em; line-height: 1; margin-bottom: -0.2em; user-select: none; color: #ec4899; }
      `}</style>
      
      <Header />

      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full animate-fadeIn">
        
        {/* Top Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-pink-100 rounded-full mb-6 shadow-inner">
            <PartyPopper size={60} className="text-primary" />
          </div>
          <h1 className="text-4xl font-extrabold text-[#1b0d14] mb-2">Reading Completed!</h1>
          <p className="text-lg text-gray-600">
            Great job! You've finished the reading practice for <span className="text-primary font-japanese font-bold">お花見</span>.
          </p>
        </div>

        {/* Score Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-soft p-6 border border-pink-100 flex flex-col items-center justify-center text-center transform hover:scale-105 transition-all duration-300">
            <div className="bg-green-100 p-3 rounded-full mb-3">
              <CheckCircle2 size={32} className="text-emerald-500" />
            </div>
            <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">Questions Correct</h3>
            <p className="text-4xl font-bold text-[#1b0d14]">4<span className="text-xl text-gray-400 font-normal">/5</span></p>
          </div>

          <div className="bg-white rounded-2xl shadow-soft p-6 border border-pink-100 flex flex-col items-center justify-center text-center transform hover:scale-105 transition-all duration-300">
            <div className="bg-blue-100 p-3 rounded-full mb-3">
              <PieChart size={32} className="text-blue-500" />
            </div>
            <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">Accuracy</h3>
            <p className="text-4xl font-bold text-[#1b0d14]">80%</p>
          </div>
        </div>

        {/* Question Summary Table */}
        <div className="bg-white rounded-2xl shadow-soft border border-pink-100 overflow-hidden mb-10">
          <div className="px-6 py-4 bg-pink-50 border-b border-pink-100 flex justify-between items-center">
            <h2 className="font-bold text-lg text-[#1b0d14]">Question Summary</h2>
            <span className="text-sm text-gray-500 font-medium">5 Questions Total</span>
          </div>

          <div className="divide-y divide-gray-100">
            {questions.map((q) => (
              <div 
                key={q.id} 
                className={`p-6 hover:bg-pink-50/50 transition-colors ${!q.correct ? 'bg-red-50/30' : ''}`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4 mt-1">
                    <span className={`flex items-center justify-center w-8 h-8 rounded-full ${q.correct ? 'bg-green-100 text-emerald-500' : 'bg-red-100 text-red-500'}`}>
                      {q.correct ? <Check size={18} /> : <X size={18} />}
                    </span>
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-[#1b0d14] text-sm">{q.title}</h3>
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${q.correct ? 'bg-green-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {q.correct ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{q.questionText}</p>
                    <p className="text-sm font-japanese text-[#1b0d14]">
                      Your answer: <span className={`font-bold ${!q.correct ? 'line-through decoration-red-500 decoration-2 text-gray-400' : ''}`}>{q.yourAnswer}</span>
                    </p>
                    {!q.correct && (
                      <p className="text-sm font-japanese text-emerald-600 mt-1">
                        Correct answer: <span className="font-bold">{q.correctAnswer}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="w-full sm:w-auto px-8 py-3 bg-white text-primary font-bold rounded-xl border-2 border-primary/30 hover:bg-pink-50 shadow-sm transition-all flex items-center justify-center">
            <RotateCcw size={20} className="mr-2" />
            Review Answers
          </button>
          <button className="w-full sm:w-auto px-8 py-3 bg-primary hover:bg-pink-600 text-white font-bold rounded-xl shadow-lg hover:shadow-primary/40 transition-all transform hover:-translate-y-1 flex items-center justify-center">
            <ArrowLeft size={20} className="mr-2" />
            Return to Articles
          </button>
        </div>
      </main>
    </div>
  );
};

export default ReadingResults;