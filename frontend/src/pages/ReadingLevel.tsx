import React from 'react';
import Header from '../components/Header'; // Import Header đã có sẵn
import { 
  Baby, 
  GraduationCap, 
  BookOpen, 
  FileText, 
  ArrowRight, 
  History 
} from 'lucide-react';

const ReadingLevel: React.FC = () => {
  const levels = [
    {
      title: "JLPT N5",
      difficulty: "Beginner",
      difficultyColor: "bg-green-100 text-green-600",
      icon: <Baby size={40} />,
      iconBg: "bg-pink-100 text-primary",
      description: "Basic vocabulary and simple sentence structures. Perfect for those just starting their journey.",
      includes: "Includes: Hiragana, Katakana, Basic Kanji",
      topics: 25,
      accent: "bg-primary",
      isLocked: false
    },
    {
      title: "JLPT N4",
      difficulty: "Elementary",
      difficultyColor: "bg-blue-100 text-blue-600",
      icon: <GraduationCap size={40} />,
      iconBg: "bg-blue-100 text-blue-500",
      description: "Everyday conversations and simple stories. Expand your grammar and reading speed.",
      includes: "Includes: Daily Life Topics, ~300 Kanji",
      topics: 32,
      accent: "bg-blue-400",
      isLocked: false
    },
    {
      title: "JLPT N3",
      difficulty: "Intermediate",
      difficultyColor: "bg-orange-100 text-orange-600",
      icon: <BookOpen size={40} />,
      iconBg: "bg-orange-100 text-orange-500",
      description: "Bridge the gap to advanced Japanese. Everyday situations to specific contexts.",
      includes: "",
      topics: 0,
      accent: "bg-orange-400",
      isLocked: true
    }
  ];

  return (
    <div className="bg-[#fcf8fa] min-h-screen flex flex-col font-body text-[#4a4a4a]">
      <Header />

      <main className="flex-grow container mx-auto px-6 py-12 animate-fadeIn">
        {/* Title Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold font-display text-gray-800 mb-4">
            Choose Your Level
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select a difficulty level to start practicing your Japanese reading comprehension. From beginner-friendly texts to more complex articles.
          </p>
        </div>

        {/* Level Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {levels.map((level, index) => (
            level.isLocked ? (
              // Locked Card (N3)
              <div key={index} className="group relative bg-white rounded-2xl shadow-sm opacity-60 overflow-hidden border border-dashed border-gray-300">
                <div className="absolute inset-0 bg-gray-50/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
                  <span className="bg-gray-200 text-gray-600 px-4 py-2 rounded-lg font-bold text-sm shadow-sm">Coming Soon</span>
                </div>
                <div className="p-8 flex flex-col h-full filter blur-[1px]">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`p-3 rounded-xl ${level.iconBg}`}>
                      {level.icon}
                    </div>
                    <span className={`${level.difficultyColor} text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider`}>
                      {level.difficulty}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold font-display text-gray-800 mb-2">{level.title}</h2>
                  <p className="text-gray-600 mb-6 flex-grow">{level.description}</p>
                  <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <FileText size={16} className="mr-1" />
                      {level.topics} Topics
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Active Cards (N5, N4)
              <a key={index} href="#" className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden border border-transparent hover:border-primary/30">
                <div className={`absolute top-0 left-0 w-full h-2 ${level.accent}`}></div>
                <div className="p-8 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`p-3 rounded-xl ${level.iconBg}`}>
                      {level.icon}
                    </div>
                    <span className={`${level.difficultyColor} text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider`}>
                      {level.difficulty}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold font-display text-gray-800 mb-2 group-hover:text-primary transition-colors">
                    {level.title}
                  </h2>
                  <p className="text-gray-600 mb-6 flex-grow">
                    {level.description}
                    <span className="text-sm italic opacity-75 mt-2 block">{level.includes}</span>
                  </p>
                  <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <FileText size={16} className="mr-1" />
                      {level.topics} Topics
                    </div>
                    <ArrowRight size={20} className="text-primary transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </a>
            )
          ))}
        </div>

        {/* Sample Lesson Preview Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="flex items-center space-x-2 mb-6">
            <History size={24} className="text-primary" />
            <h3 className="text-xl font-bold text-gray-800">Sample Lesson Preview</h3>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row gap-6 items-center border-l-4 border-primary">
            <div className="w-full md:w-1/3 h-40 bg-pink-50 rounded-lg flex items-center justify-center overflow-hidden relative">
              <img 
                alt="Cherry blossoms scenery" 
                className="w-full h-full object-cover opacity-80 hover:scale-110 transition-transform duration-700" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvZUMFjWRQai-4KwuoBL68GjgQ1A6RRAMKEQKTiSaXWHFQhblqyFnkqv9v1U9bZy4K7LyblCl4bAK0d2Kv3FeyydbF86uQOiJHzZaJOLDoLBD4GQofeLH_NX44qUCVJoIKOKZQUm5pBCbqg4icYc4LtYfMjxQ8RZ_hsYIMOccdtV5_PRrTI5d3qcP_trc82wi_Jly9CQgSDddjqrF59ELOAr09QMtXKrZ4eiCitAAuQLDPvWhhR6r1dEW6rw6r14cATb_bK09XQw"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-primary bg-pink-100 px-2 py-1 rounded">N5</span>
                <span className="text-xs text-gray-500">Lesson 06</span>
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-2">お花見 (Ohanami - Cherry Blossom Viewing)</h4>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                Learn vocabulary related to spring events and planning a trip. Practice reading invitations and schedules. "Issho ni ikimashou!"
              </p>
              <a className="inline-flex items-center text-primary hover:text-primary-dark font-medium text-sm transition-colors" href="#">
                Continue Reading <ArrowRight size={16} className="ml-1" />
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReadingLevel;