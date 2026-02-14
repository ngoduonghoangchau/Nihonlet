import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import {
  ChevronRight,
  BarChart3,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Play,
  MessageCircle,
  Loader2,
  BookOpen
} from 'lucide-react';
import api from '../api/axios';

interface GrammarTopic {
  id?: number;       // Thêm id để dự phòng trường hợp backend trả về "id"
  topicId?: number;  // Giữ topicId
  title: string;
  level: string;
  description: string;
  status: "Completed" | "Learning" | "NotStarted"; // Khớp với backend
  progressPercent: number;
}

const GrammarLibrary: React.FC = () => {
  const navigate = useNavigate();
  const [activeLevel, setActiveLevel] = useState<'N5' | 'N4'>('N5');
  const [topics, setTopics] = useState<GrammarTopic[]>([]);
  const [loading, setLoading] = useState(true);

  const getStatusUI = (topic: GrammarTopic) => {
    switch (topic.status) {
      case "Completed":
        return {
          label: "Mastered",
          color: "bg-green-100 text-green-600",
          icon: <CheckCircle2 size={20} className="text-green-500" />,
          sessionText: "Perfected"
        };
      case "Learning":
        return {
          label: "Learning",
          color: "bg-pink-50 text-primary",
          icon: <Sparkles size={20} className="text-primary" />,
          sessionText: `${Math.round(topic.progressPercent)}% Progress`
        };
      case "NotStarted":
      default:
        return {
          label: "New",
          color: "bg-blue-100 text-blue-600",
          icon: null,
          sessionText: "Start Unit"
        };
    }
  };
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setLoading(true);
        console.log("Đang gọi API cho Level:", activeLevel); // Log 1

        const response = await api.get('/Grammar/topics', {
          params: { level: activeLevel }
        });

        console.log("Dữ liệu nhận được từ Backend:", response.data); // Log 2
        setTopics(response.data);
      } catch (error) {
        console.error("Lỗi gọi API:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, [activeLevel]);

  return (
    <div className="bg-[#fcf8fa] min-h-screen flex flex-col font-display text-[#1b0d14]">
      <Header />

      <main className="flex-grow">
        <div className="max-w-[1200px] mx-auto px-6 py-10">

          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <nav className="flex items-center gap-2 text-[#9a4c73] text-sm mb-4 font-medium">
                <span className="hover:text-primary cursor-pointer transition-colors">Learning</span>
                <ChevronRight size={14} />
                <span className="font-bold text-[#1b0d14]">Grammar Topics</span>
              </nav>
              <h2 className="text-4xl font-black text-[#1b0d14] mb-3 tracking-tight">Grammar Topics Library</h2>
              <p className="text-[#9a4c73] text-lg leading-relaxed font-medium">
                Master the foundations of Japanese. Explore curated paths for <span className="text-primary font-bold">{activeLevel}</span> learners.
              </p>
            </div>

            {/* <div className="flex gap-3">
              <button className="flex-1 md:flex-none bg-white border border-[#e7cfdb] text-[#1b0d14] px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#f3e7ed] transition-all shadow-sm">
                <BarChart3 size={18} /> Stats
              </button>
            </div> */} Dont touch this for now, will add later
          </div>

          {/* Tab Selection */}
          <div className="flex gap-2 mb-8 bg-white p-1.5 rounded-2xl border border-[#e7cfdb] max-w-md shadow-sm">
            {(['N5', 'N4'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setActiveLevel(lvl)}
                className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${activeLevel === lvl ? 'bg-primary text-white shadow-lg' : 'text-[#9a4c73] hover:bg-[#f3e7ed]'
                  }`}
              >
                {lvl} {lvl === 'N5' ? 'Beginner' : 'Elementary'}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <Loader2 className="animate-spin text-primary mb-4" size={48} />
              <p className="text-[#9a4c73] font-bold text-lg animate-pulse">Loading {activeLevel} Topics...</p>
            </div>
          ) : topics.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {topics.map((topic) => {
                const ui = getStatusUI(topic);
                // Lấy ID chính xác (ưu tiên id nếu có, không thì dùng topicId)
                const tId = topic.id || topic.topicId;

                return (
                  <div
                    key={tId}
                    onClick={() => tId && navigate(`/grammar-quiz/${tId}`)}
                    className="group bg-white rounded-3xl border border-[#e7cfdb] p-6 shadow-sm hover:border-primary hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col"
                  >
                    {/* Progress indicator line at the top */}
                    {topic.status !== "NotStarted" && (
                      <div className="absolute top-0 left-0 h-1.5 bg-primary transition-all duration-1000" style={{ width: `${topic.progressPercent}%` }} />
                    )}

                    <div className="flex justify-between items-start mb-6">
                      <span className={`text-[10px] font-black px-2.5 py-1.5 rounded-lg uppercase tracking-widest ${ui.color} shadow-sm`}>
                        {ui.label}
                      </span>
                      <div className="transition-transform group-hover:scale-125 duration-300">
                        {ui.icon}
                      </div>
                    </div>

                    <h3 className="text-2xl font-black mb-2 text-[#1b0d14] line-clamp-1 group-hover:text-primary transition-colors">{topic.title}</h3>
                    <p className="text-[#9a4c73] text-sm mb-6 font-medium line-clamp-2 leading-relaxed min-h-[40px]">{topic.description}</p>

                    {/* Show progress bar only for "Learning" status */}
                    {topic.status === "Learning" && (
                      <div className="space-y-2 mb-6 animate-in fade-in slide-in-from-bottom-2">
                        <div className="flex justify-between text-[10px] font-black text-primary uppercase tracking-tighter">
                          <span>MASTERING PROGRESS</span>
                          <span>{Math.round(topic.progressPercent)}%</span>
                        </div>
                        <div className="w-full bg-[#f3e7ed] h-2 rounded-full overflow-hidden shadow-inner">
                          <div className="bg-primary h-full transition-all duration-1000 ease-out" style={{ width: `${topic.progressPercent}%` }} />
                        </div>
                      </div>
                    )}

                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-dashed border-[#e7cfdb]">
                      <span className={`text-xs font-black uppercase tracking-tight ${topic.status === 'Learning' ? 'text-primary' : 'text-[#9a4c73]/60'}`}>
                        {ui.sessionText}
                      </span>
                      <div className={`size-10 rounded-2xl flex items-center justify-center transition-all duration-300 ${topic.status === 'Learning' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-[#f3e7ed] text-[#1b0d14] group-hover:bg-primary group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary/30'
                        }`}>
                        {topic.status === 'Learning' ? <Play size={16} fill="currentColor" /> : <ArrowRight size={18} />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-[2.5rem] p-20 border-2 border-dashed border-[#e7cfdb] text-center shadow-inner">
              <div className="bg-[#f3e7ed] size-24 rounded-3xl flex items-center justify-center text-primary mx-auto mb-8 shadow-sm">
                <BookOpen size={48} />
              </div>
              <h3 className="text-3xl font-black text-[#1b0d14] mb-2 tracking-tight">Library Shelf Empty</h3>
              <p className="text-[#9a4c73] font-medium text-lg">We are still curating {activeLevel} lessons for you. Check back soon!</p>
            </div>
          )}
        </div>
      </main>

      {/* Floating Support Button */}
      <button className="fixed bottom-8 right-8 size-16 bg-primary text-white rounded-[2rem] shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 hover:rotate-6 transition-all z-50">
        <MessageCircle size={32} />
      </button>
    </div>
  );
};

export default GrammarLibrary;