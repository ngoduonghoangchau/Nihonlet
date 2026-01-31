import React, { useState } from 'react';
import Header from '../components/Header'; // Giả định Header đã có sẵn
import { 
  ArrowLeft, 
  Settings2, 
  Layers, 
  Search, 
  Filter, 
  ChevronDown, 
  AlertCircle, 
  PlayCircle 
} from 'lucide-react';

const MinigameSelect: React.FC = () => {
  const [wordCount, setWordCount] = useState("10");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSets, setSelectedSets] = useState<number[]>([1, 2, 3]);

  const sets = [
    { id: 1, title: "JLPT N5 Essentials", level: "JLPT N5", levelColor: "bg-blue-100 text-blue-700", desc: "Basic greetings, numbers, and daily life vocabulary.", count: 24, disabled: false },
    { id: 2, title: "Food & Dining", level: "JLPT N4", levelColor: "bg-purple-100 text-purple-700", desc: "Restaurant phrases, ingredients, and tastes.", count: 18, disabled: false },
    { id: 3, title: "Travel Phrases", level: "JLPT N5", levelColor: "bg-blue-100 text-blue-700", desc: "Directions, transport, and hotel booking terms.", count: 32, disabled: false },
    { id: 4, title: "Kanji - Nature", level: null, levelColor: "", desc: "Common kanji characters for natural elements.", count: 15, disabled: true },
    { id: 5, title: "Body Parts", level: null, levelColor: "", desc: "Head to toe vocabulary.", count: 20, disabled: true },
  ];

  const handleToggleSet = (id: number, disabled: boolean) => {
    if (disabled) return;
    setSelectedSets(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : (prev.length < 3 ? [...prev, id] : prev)
    );
  };

  return (
    <div className="bg-[#fcf8fa] min-h-screen flex flex-col font-display text-[#1b0d14]">
      <Header />

      <main className="flex-grow flex flex-col items-center py-12 px-6">
        <div className="max-w-[900px] w-full">
          
          {/* Back Button */}
          <div className="flex flex-col gap-6 mb-8">
            <a className="flex items-center gap-2 text-[#9a4c73] hover:text-primary transition-colors w-fit group" href="#">
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-bold">Back to Minigames</span>
            </a>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#1b0d14]">Select Your Sets</h1>
                  <span className="text-3xl">🎴</span>
                </div>
                <p className="text-primary font-bold text-lg mb-2">Select up to 3 sets to play</p>
                <p className="text-[#9a4c73] text-lg max-w-lg">
                  Choose which vocabulary lists you want to practice in the <strong className="text-primary font-bold">Matching Game</strong>.
                </p>
              </div>

              {/* Quick Settings Cards */}
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="bg-white border border-[#f3e7ed] px-5 py-3 rounded-xl flex items-center gap-4 shadow-sm min-w-[170px]">
                  <div className="bg-[#fef1f7] p-2.5 rounded-lg">
                    <Settings2 size={24} className="text-primary" />
                  </div>
                  <div className="flex flex-col w-full">
                    <label className="text-[10px] uppercase font-bold text-[#9a4c73]/50 tracking-wider">Words to study</label>
                    <div className="relative w-full">
                      <select 
                        value={wordCount}
                        onChange={(e) => setWordCount(e.target.value)}
                        className="appearance-none bg-transparent font-black text-primary text-xl focus:outline-none cursor-pointer p-0 pr-6 border-none focus:ring-0 w-full"
                      >
                        <option value="5">5 Words</option>
                        <option value="10">10 Words</option>
                        <option value="15">15 Words</option>
                        <option value="all">All Words</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-primary pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-[#f3e7ed] px-5 py-3 rounded-xl flex items-center gap-4 shadow-sm min-w-[200px]">
                  <div className="bg-[#fef1f7] p-2.5 rounded-lg">
                    <Layers size={24} className="text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-[#9a4c73]/50 tracking-wider">Total Cards</span>
                    <span className="text-2xl font-black text-primary leading-none">74 <span className="text-sm text-[#9a4c73]/40 font-bold ml-1">selected</span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Selection Card */}
          <div className="bg-white border border-[#f3e7ed] rounded-[2rem] p-6 md:p-8 shadow-xl relative">
            
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9a4c73]/40" />
                <input 
                  className="w-full pl-12 pr-4 py-3 bg-[#fcf8fa] border border-[#f3e7ed] rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-[#9a4c73]/30 font-medium" 
                  placeholder="Search your sets..." 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9a4c73]" />
                  <select className="appearance-none pl-10 pr-9 py-3 bg-[#fcf8fa] hover:bg-[#fef1f7] border border-[#f3e7ed] rounded-xl font-bold text-[#9a4c73] transition-colors cursor-pointer outline-none focus:ring-2 focus:ring-primary h-full">
                    <option value="all">All Levels</option>
                    <option value="n5">JLPT N5</option>
                    <option value="n4">JLPT N4</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9a4c73] pointer-events-none" />
                </div>
                <button className="px-4 py-3 bg-[#fcf8fa] hover:bg-[#fef1f7] border border-[#f3e7ed] rounded-xl font-bold text-[#9a4c73] transition-colors flex items-center gap-2 text-sm whitespace-nowrap">
                  Select All
                </button>
              </div>
            </div>

            {/* List of Sets */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {sets.map((set) => (
                <label 
                  key={set.id}
                  className={`group relative flex items-center p-4 rounded-2xl border-2 transition-all ${
                    set.disabled 
                    ? 'bg-gray-50 border-transparent opacity-50 cursor-not-allowed grayscale-[0.5]' 
                    : 'bg-[#fef1f7]/50 hover:bg-[#fef1f7] border-primary/20 hover:border-primary/40 cursor-pointer'
                  }`}
                >
                  <input 
                    type="checkbox" 
                    checked={selectedSets.includes(set.id)}
                    disabled={set.disabled}
                    onChange={() => handleToggleSet(set.id, set.disabled)}
                    className="w-6 h-6 rounded-md border-2 border-primary/30 text-primary focus:ring-primary/20 transition-all mr-4 cursor-pointer disabled:cursor-not-allowed"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`font-bold text-lg text-[#1b0d14] ${!set.disabled && 'group-hover:text-primary transition-colors'}`}>
                        {set.title}
                      </h3>
                      {set.level && (
                        <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md ${set.levelColor}`}>
                          {set.level}
                        </span>
                      )}
                    </div>
                    <p className={`text-sm font-medium ${set.disabled ? 'text-[#9a4c73]/40' : 'text-[#9a4c73]/60'}`}>
                      {set.desc}
                    </p>
                  </div>
                  <div className="ml-4 flex items-center gap-1.5 text-[#9a4c73]/40 font-bold text-sm bg-white/50 px-3 py-1.5 rounded-lg transition-colors">
                    <Layers size={14} />
                    <span>{set.count}</span>
                  </div>
                </label>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 pt-6 border-t border-[#f3e7ed] flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-2 text-primary font-bold text-sm bg-primary/10 px-4 py-2 rounded-full">
                <AlertCircle size={18} />
                <span>You can select a maximum of 3 sets</span>
              </div>
              
              <button className="w-full md:w-auto px-12 py-4 bg-gradient-to-r from-primary to-[#d93587] hover:brightness-110 text-white rounded-2xl font-black text-xl shadow-xl shadow-primary/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 group">
                <PlayCircle size={24} className="group-hover:rotate-12 transition-transform" />
                Start Game
              </button>
            </div>
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #f3e7ed; border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #e0d0d8; }
      `}} />
    </div>
  );
};

export default MinigameSelect;