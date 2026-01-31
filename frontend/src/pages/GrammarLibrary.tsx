import React, { useState } from 'react';
import Header from '../components/Header'; // Giả định Header đã có sẵn
import { 
  ChevronRight, 
  BarChart3, 
  CheckCircle2, 
  Sparkles, 
  History, 
  Star, 
  ArrowRight, 
  Play,
  MessageCircle 
} from 'lucide-react';

const GrammarLibrary: React.FC = () => {
  const [activeLevel, setActiveLevel] = useState<'N5' | 'N4'>('N5');

  const topics = [
    {
      id: 1,
      title: "～は ～です",
      subtitle: "Topic Sentence / Identity",
      status: "Mastered",
      statusColor: "bg-green-100 text-green-600",
      sessions: "12 Sessions",
      icon: <CheckCircle2 size={20} className="text-green-500" />,
      progress: null
    },
    {
      id: 2,
      title: "Particle に",
      subtitle: "Direction & Time Marker",
      status: "Learning",
      statusColor: "bg-pink-50 text-primary",
      sessions: "Resume Lesson",
      icon: <Sparkles size={20} className="text-primary" />,
      progress: 45
    },
    {
      id: 3,
      title: "Te-form",
      subtitle: "Verb Connection (て形)",
      status: "Review Ready",
      statusColor: "bg-orange-100 text-orange-600",
      sessions: "8 AI Exercises",
      icon: <History size={20} className="text-orange-500" />,
      progress: null
    },
    {
      id: 4,
      title: "Particle を",
      subtitle: "Direct Object Marker",
      status: "New",
      statusColor: "bg-blue-100 text-blue-600",
      sessions: "Introductory",
      icon: <Star size={20} className="text-blue-500" />,
      progress: null
    },
    {
      id: 5,
      title: "Question か",
      subtitle: "Interrogative Particle",
      status: "Mastered",
      statusColor: "bg-green-100 text-green-600",
      sessions: "Perfected",
      icon: <CheckCircle2 size={20} className="text-green-500" />,
      progress: null
    },
    {
      id: 6,
      title: "～ています",
      subtitle: "Continuous Actions",
      status: "Learning",
      statusColor: "bg-pink-50 text-primary",
      sessions: "20% Progress",
      icon: <Sparkles size={20} className="text-primary" />,
      progress: 20
    },
    {
      id: 7,
      title: "Adjectives",
      subtitle: "i-Type & na-Type",
      status: "New",
      statusColor: "bg-blue-100 text-blue-600",
      sessions: "Start Unit",
      icon: <Star size={20} className="text-blue-500" />,
      progress: null
    },
    {
      id: 8,
      title: "Counting",
      subtitle: "Basic Counters (つ, 人, 枚)",
      status: "Mastered",
      statusColor: "bg-green-100 text-green-600",
      sessions: "95% Mastery",
      icon: <CheckCircle2 size={20} className="text-green-500" />,
      progress: null
    }
  ];

  return (
    <div className="bg-[#fcf8fa] min-h-screen flex flex-col font-display text-[#1b0d14]">
      <Header />

      <main className="flex-grow">
        <div className="max-w-[1200px] mx-auto px-6 py-10">
          
          {/* Top Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <nav className="flex items-center gap-2 text-[#9a4c73] text-sm mb-4">
                <a className="hover:text-primary transition-colors" href="#">Learning</a>
                <ChevronRight size={14} />
                <span className="font-bold">Grammar Topics</span>
              </nav>
              <h2 className="text-4xl font-black text-[#1b0d14] mb-3">Grammar Topics Library</h2>
              <p className="text-[#9a4c73] text-lg leading-relaxed">
                Master the foundations of Japanese. Explore curated paths for beginners and elementary learners.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button className="flex-1 md:flex-none bg-white border border-[#e7cfdb] text-[#1b0d14] px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#f3e7ed] transition-all">
                <BarChart3 size={18} />
                Stats
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 bg-white p-1.5 rounded-2xl border border-[#e7cfdb] max-w-md">
            <button 
              onClick={() => setActiveLevel('N5')}
              className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all ${activeLevel === 'N5' ? 'bg-primary text-white shadow-sm' : 'text-[#9a4c73] hover:bg-[#f3e7ed]'}`}
            >
              N5 Beginner
            </button>
            <button 
              onClick={() => setActiveLevel('N4')}
              className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all ${activeLevel === 'N4' ? 'bg-primary text-white shadow-sm' : 'text-[#9a4c73] hover:bg-[#f3e7ed]'}`}
            >
              N4 Elementary
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {topics.map((topic) => (
              <div 
                key={topic.id} 
                className="group bg-white rounded-2xl border border-[#e7cfdb] p-6 shadow-sm hover:border-primary transition-all cursor-pointer relative overflow-hidden flex flex-col"
              >
                {topic.progress && (
                  <div className="absolute top-0 left-0 h-1 bg-primary transition-all" style={{ width: `${topic.progress}%` }} />
                )}
                
                <div className="flex justify-between items-start mb-6">
                  <span className={`text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest ${topic.statusColor}`}>
                    {topic.status}
                  </span>
                  {topic.icon}
                </div>

                <h3 className="text-3xl font-bold mb-1 text-[#1b0d14]">{topic.title}</h3>
                <p className="text-[#9a4c73] text-sm mb-6 font-medium">{topic.subtitle}</p>

                {topic.progress && (
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-[10px] font-bold text-primary">
                      <span>PROGRESS</span>
                      <span>{topic.progress}%</span>
                    </div>
                    <div className="w-full bg-[#f3e7ed] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-primary h-full transition-all" style={{ width: `${topic.progress}%` }} />
                    </div>
                  </div>
                )}

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-dashed border-[#e7cfdb]">
                  <span className={`text-xs font-bold ${topic.status === 'Learning' ? 'text-primary' : 'text-gray-400'}`}>
                    {topic.sessions}
                  </span>
                  <div className={`size-8 rounded-full flex items-center justify-center transition-colors ${topic.status === 'Learning' ? 'bg-primary text-white' : 'bg-[#f3e7ed] text-[#1b0d14] group-hover:bg-primary group-hover:text-white'}`}>
                    {topic.status === 'Learning' ? <Play size={14} fill="currentColor" /> : <ArrowRight size={16} />}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="mt-16 flex flex-col items-center gap-6">
            <button className="px-10 py-4 bg-[#f3e7ed] text-primary font-bold rounded-2xl hover:bg-primary hover:text-white transition-all shadow-sm">
              Load More Topics
            </button>
            <p className="text-[#9a4c73] text-sm">Showing 8 of 42 topics</p>
          </div>
        </div>
      </main>

      {/* FAB */}
      <button className="fixed bottom-8 right-8 size-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50">
        <MessageCircle size={28} />
      </button>
    </div>
  );
};

export default GrammarLibrary;