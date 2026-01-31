import React from 'react';
import Header from '../components/Header';
import { 
  Sun, 
  Plane, 
  GraduationCap, 
  Sparkles, 
  ShoppingBag, 
  Utensils, 
  HeartPulse, 
  Heart, 
  Lock, 
  CheckCircle2, 
  ArrowLeft 
} from 'lucide-react';

const ReadingTopic: React.FC = () => {
  const topics = [
    {
      title: "Daily Life",
      desc: "daily routines, time, and schedules",
      icon: <Sun size={32} />,
      progress: 75,
      lessons: "9/12 Lessons Completed",
      status: "normal"
    },
    {
      title: "Travel & Outings",
      desc: "trips, planning, and asking directions",
      icon: <Plane size={32} />,
      progress: 10,
      lessons: "1/10 Lessons Completed",
      status: "new"
    },
    {
      title: "School Life",
      desc: "classroom, subjects, and studying",
      icon: <GraduationCap size={32} />,
      progress: 0,
      lessons: "0/8 Lessons Completed",
      status: "normal"
    },
    {
      title: "Culture & Events",
      desc: "festivals, customs, and holidays",
      icon: <Sparkles size={32} />,
      progress: 45,
      lessons: "5/11 Lessons Completed",
      status: "normal"
    },
    {
      title: "Shopping",
      desc: "prices, items, and supermarkets",
      icon: <ShoppingBag size={32} />,
      progress: 100,
      lessons: "Completed",
      status: "completed"
    },
    {
      title: "Food & Dining",
      desc: "ordering food, recipes, and taste",
      icon: <Utensils size={32} />,
      progress: 0,
      lessons: "0/9 Lessons Completed",
      status: "normal"
    },
    {
      title: "Health & Body",
      desc: "symptoms, body parts, and doctors",
      icon: <HeartPulse size={32} />,
      progress: 0,
      lessons: "0/6 Lessons Completed",
      status: "normal"
    },
    {
      title: "Family & Friends",
      desc: "introductions and relationships",
      icon: <Heart size={32} />,
      progress: 0,
      lessons: "Locked",
      status: "locked"
    }
  ];

  return (
    <div className="bg-[#fff1f2] min-h-screen flex flex-col font-body text-[#374151]">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full animate-fadeIn">
        {/* Nút quay lại */}
        <div className="mb-8">
          <button className="group flex items-center gap-2 text-gray-500 hover:text-primary transition-colors">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Levels (N5 - N1)</span>
          </button>
        </div>

        {/* Tiêu đề trang */}
        <div className="text-center mb-12">
          <span className="inline-block py-1 px-3 rounded-full bg-pink-200 text-primary-dark text-xs font-bold tracking-wider uppercase mb-3">
            Level N5
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-800 mb-4">
            Choose a Reading Topic
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Select a topic to start your reading practice. Each lesson includes vocabulary lists, comprehension questions, and audio.
          </p>
        </div>

        {/* Lưới các chủ đề */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {topics.map((topic, index) => (
            <a 
              key={index}
              href="#" 
              className={`group bg-white rounded-2xl p-6 border-2 border-pink-300 hover:border-primary shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden ${
                topic.status === 'locked' ? 'opacity-70 grayscale cursor-not-allowed' : ''
              }`}
            >
              {topic.status === 'new' && (
                <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-black px-3 py-1 rounded-bl-xl tracking-widest">NEW</div>
              )}
              {topic.status === 'locked' && (
                <div className="absolute top-3 right-3 text-gray-400">
                  <Lock size={18} />
                </div>
              )}

              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-transform duration-300 ${
                topic.status === 'locked' ? 'bg-gray-100 text-gray-400' : 'bg-pink-50 text-primary group-hover:scale-110'
              }`}>
                {topic.icon}
              </div>

              <h3 className={`font-display font-bold text-xl mb-2 ${topic.status === 'locked' ? 'text-gray-600' : 'text-gray-800 group-hover:text-primary'}`}>
                {topic.title}
              </h3>
              <p className="text-sm text-gray-500 mb-4 font-body">{topic.desc}</p>

              <div className="mt-auto w-full">
                {topic.status !== 'locked' ? (
                  <>
                    <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                      <div className="bg-primary h-2 rounded-full transition-all duration-1000" style={{ width: `${topic.progress}%` }}></div>
                    </div>
                    {topic.status === 'completed' ? (
                      <span className="text-xs text-green-500 font-bold flex justify-center items-center gap-1">
                        <CheckCircle2 size={14} /> Completed
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400 font-medium">{topic.lessons}</span>
                    )}
                  </>
                ) : (
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Locked</p>
                )}
              </div>
            </a>
          ))}
        </div>

        {/* Section thông tin bổ sung */}
        <section className="mt-16 bg-white rounded-3xl p-8 md:p-12 shadow-md flex flex-col md:flex-row items-center gap-8 border border-pink-100">
          <div className="w-full md:w-1/2">
            <h3 className="text-2xl font-display font-bold text-gray-800 mb-4">Why read in Japanese?</h3>
            <ul className="space-y-3">
              {[
                "Improves vocabulary retention in context.",
                "Helps you understand natural grammar usage.",
                "Exposure to kanji and reading speed practice."
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="text-primary mt-1 shrink-0" size={18} />
                  <span className="text-gray-600">{text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full md:w-1/2 relative h-48 rounded-2xl overflow-hidden bg-pink-50 flex items-center justify-center">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/sakura.png')]"></div>
            <div className="text-center z-10 px-6">
              <p className="font-display text-primary font-bold text-xl mb-2">Did you know?</p>
              <p className="text-gray-600 italic leading-relaxed">
                "Hanami (Flower Viewing) is a centuries-old Japanese tradition of enjoying the transient beauty of flowers."
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ReadingTopic;