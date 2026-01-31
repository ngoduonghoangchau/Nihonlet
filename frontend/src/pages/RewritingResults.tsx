import React from 'react';
import Header from '../components/Header'; // Import Header đã có sẵn
import { 
  PartyPopper, 
  FileCheck2, 
  Target, 
  X, 
  Check, 
  ArrowLeft, 
  RotateCcw, 
  ArrowRight 
} from 'lucide-react';

const QuizResults: React.FC = () => {
  // Dữ liệu các câu bị sai
  const missedQuestions = [
    {
      id: 1,
      meaning: "Ăn",
      yourAnswer: "たべました",
      correctAnswer: "たべる"
    },
    {
      id: 2,
      meaning: "Con mèo",
      yourAnswer: "いぬ",
      correctAnswer: "ねこ"
    }
  ];

  return (
    <div className="bg-[#fcf8fa] min-h-screen flex flex-col font-display text-[#1b0d14]">
      <Header />

      <main className="flex-grow flex justify-center py-10 px-4 animate-fadeIn">
        <div className="max-w-[960px] w-full flex flex-col">
          
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4">
              <PartyPopper className="text-primary" size={48} />
            </div>
            <h1 className="tracking-tight text-[40px] font-extrabold leading-tight">Well Done!</h1>
            <h2 className="text-primary text-2xl font-bold mt-1">よくできました！</h2>
            <p className="text-[#1b0d14]/60 mt-2 font-medium">
              You successfully completed the "Daily Vocabulary Challenge"
            </p>
          </div>

          {/* Stats Grid */}
          <div className="flex flex-wrap gap-4 pb-6">
            <div className="flex min-w-[180px] flex-1 flex-col gap-2 rounded-xl p-6 bg-white shadow-sm border border-[#f3e7ed]">
              <div className="flex items-center gap-2 text-primary">
                <FileCheck2 size={18} />
                <p className="text-sm font-bold uppercase tracking-wider">Total Score</p>
              </div>
              <p className="tracking-tight text-3xl font-bold leading-tight">8/10</p>
            </div>
            <div className="flex min-w-[180px] flex-1 flex-col gap-2 rounded-xl p-6 bg-white shadow-sm border border-[#f3e7ed]">
              <div className="flex items-center gap-2 text-primary">
                <Target size={18} />
                <p className="text-sm font-bold uppercase tracking-wider">Accuracy</p>
              </div>
              <p className="tracking-tight text-3xl font-bold leading-tight">80%</p>
            </div>
          </div>

          {/* Focus Areas Section */}
          <div className="flex items-center justify-between pb-3 pt-5">
            <h2 className="text-[22px] font-bold leading-tight tracking-tight">
              Focus Areas (Missed Questions)
            </h2>
            <span className="text-primary font-bold text-sm bg-primary/10 px-3 py-1 rounded-full">
              {missedQuestions.length} Items to Review
            </span>
          </div>

          {/* Table of Mistakes */}
          <div className="py-3">
            <div className="overflow-hidden rounded-xl border border-[#e7cfdb] bg-white shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-[#fcf8fa] border-b border-[#e7cfdb]">
                  <tr>
                    <th className="px-6 py-4 text-sm font-bold">Meaning (Vietnamese)</th>
                    <th className="px-6 py-4 text-sm font-bold">Your Answer</th>
                    <th className="px-6 py-4 text-sm font-bold">Correct Answer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e7cfdb]">
                  {missedQuestions.map((q) => (
                    <tr key={q.id}>
                      <td className="px-6 py-6 font-medium">
                        <span className="text-lg">{q.meaning}</span>
                      </td>
                      <td className="px-6 py-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-sm font-bold border border-red-100">
                          <X size={14} />
                          {q.yourAnswer}
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-50 text-green-600 text-sm font-bold border border-green-100">
                          <Check size={14} />
                          {q.correctAnswer}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 p-8">
            <button className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-xl h-12 px-6 bg-[#f3e7ed] text-[#1b0d14] text-base font-bold transition-all hover:bg-gray-200">
              <ArrowLeft size={20} className="mr-2" />
              Back to List
            </button>
            <button className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-xl h-12 px-6 border-2 border-primary text-primary text-base font-bold transition-all hover:bg-primary/5">
              <RotateCcw size={20} className="mr-2" />
              Retry Quiz
            </button>
            <button className="flex min-w-[200px] cursor-pointer items-center justify-center rounded-xl h-12 px-8 bg-primary text-white text-base font-bold transition-all hover:opacity-90 shadow-lg shadow-primary/20">
              Next Lesson
              <ArrowRight size={20} className="ml-2" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuizResults;