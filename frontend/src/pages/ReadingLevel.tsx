import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { 
  Baby, 
  GraduationCap, 
  FileText, 
  ArrowRight 
} from 'lucide-react';

const ReadingLevel: React.FC = () => {
  const navigate = useNavigate();

  // Chỉ giữ lại N5 và N4
  const levels = [
    {
      id: 'N5',
      title: "JLPT N5",
      difficulty: "Cơ bản",
      difficultyColor: "bg-green-100 text-green-600",
      icon: <Baby size={32} className="md:w-10 md:h-10" />,
      iconBg: "bg-pink-100 text-primary",
      description: "Từ vựng cơ bản và cấu trúc câu đơn giản. Lựa chọn hoàn hảo cho người mới bắt đầu.",
      includes: "Bao gồm: Hiragana, Katakana, Kanji cơ bản",
      topics: 25,
      accent: "bg-primary"
    },
    {
      id: 'N4',
      title: "JLPT N4",
      difficulty: "Sơ cấp",
      difficultyColor: "bg-blue-100 text-blue-600",
      icon: <GraduationCap size={32} className="md:w-10 md:h-10" />,
      iconBg: "bg-blue-100 text-blue-500",
      description: "Hội thoại hàng ngày và truyện ngắn. Mở rộng ngữ pháp và cải thiện tốc độ đọc hiểu.",
      includes: "Bao gồm: Chủ đề đời sống, ~300 Kanji",
      topics: 32,
      accent: "bg-blue-400"
    }
  ];

  return (
    <div className="bg-[#fcf8fa] min-h-screen flex flex-col font-display text-[#1b0d14]">
      <Header />

      <main className="flex-grow container mx-auto px-4 md:px-6 py-8 md:py-16 animate-in fade-in duration-500">
        
        {/* --- Tiêu đề (Title Section) --- */}
        <div className="text-center mb-10 md:mb-16 px-2">
          <h1 className="text-3xl md:text-5xl font-black text-[#1b0d14] mb-3 md:mb-4 tracking-tight">
            Chọn Cấp Độ Đọc Hiểu
          </h1>
          <p className="text-sm md:text-lg text-[#9a4c73] font-medium max-w-2xl mx-auto">
            Chọn một độ khó phù hợp để bắt đầu luyện tập. Từ những đoạn văn cơ bản cho đến các bài báo ngắn.
          </p>
        </div>

        {/* --- Lưới thẻ bài học (Thu gọn max-w-4xl và chia 2 cột) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          {levels.map((level, index) => (
            <div 
              key={index} 
              onClick={() => navigate(`/reading-topics?level=${level.id}`)}
              className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden border border-[#f3e7ed] hover:border-primary/30 cursor-pointer flex flex-col"
            >
              {/* Accent Line */}
              <div className={`absolute top-0 left-0 w-full h-1.5 md:h-2 ${level.accent} transition-all duration-300 group-hover:h-2.5`}></div>
              
              <div className="p-6 md:p-8 flex flex-col h-full mt-1">
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-3 rounded-xl ${level.iconBg} transition-transform duration-300 group-hover:scale-110`}>
                    {level.icon}
                  </div>
                  <span className={`${level.difficultyColor} text-[10px] md:text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider`}>
                    {level.difficulty}
                  </span>
                </div>
                
                <h2 className="text-xl md:text-2xl font-black text-[#1b0d14] mb-2 group-hover:text-primary transition-colors">
                  {level.title}
                </h2>
                
                <p className="text-[#9a4c73] text-sm md:text-base font-medium mb-6 flex-grow">
                  {level.description}
                  <span className="text-xs md:text-sm font-bold opacity-80 mt-3 block bg-[#fcf8fa] p-2 rounded-lg border border-[#f3e7ed]">
                    {level.includes}
                  </span>
                </p>
                
                <div className="border-t-2 border-dashed border-[#f3e7ed] pt-4 flex items-center justify-between">
                  <div className="flex items-center font-bold text-sm text-gray-500 group-hover:text-[#1b0d14] transition-colors">
                    <FileText size={16} className="mr-1" />
                    {level.topics} Chủ đề
                  </div>
                  <ArrowRight size={20} className="text-primary transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ReadingLevel;