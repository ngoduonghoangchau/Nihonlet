import React from 'react';
import Header from '../components/Header';
import { Layers, Star, Plus, Flame, BadgeCheck, Wand2, Zap } from 'lucide-react';

const Dashboard: React.FC = () => {
  const decks = [
    {
      title: "JLPT N5 Kanji",
      cards: 50,
      detail: "Last studied 2 days ago",
      progress: 80,
      badge: "Mastered: 80%",
      image: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=500&auto=format&fit=crop",
    },
    {
      title: "Restaurant Phrases",
      cards: 24,
      detail: "New content available",
      progress: 40,
      badge: "Mastered: 80%",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAT8HdAE_NGETb9NAG6YL3ooTNf2EOQss1Qph3ralDD0rL1ZMzp1qgXxwtqhYq8qBAjbGIqQzWSl0iyvnBTlgspOWQV1rS9lpyVHZt9ZCZ5F1PbyPb1PUyVeZyQbjcbBA8Nw9KcMBEIlQRTFce1Ch3lOiqxLQ0lBSSp9P8Yo8Ibxq35Waloo-pplcr65kskw-tIR7Qi0LSF73NJJ7eNykvVl4j4G0zwBGgWWW1XKWxlV-yUmZzevULVhy0-2qpUGqdeTohaM5GV_g",
    },
    {
      title: "Common Verbs",
      cards: 120,
      detail: "Manual",
      progress: 92,
      badge: "Mastered: 92%",
      image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=500&auto=format&fit=crop",
      color: "bg-green-500"
    },
    {
      title: "Basic Hiragana",
      cards: 46,
      detail: "Last studied today",
      progress: 35,
      badge: "Mastered: 35%",
      image: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=500&auto=format&fit=crop",
    },
    {
      title: "Travel Essentials",
      cards: 62,
      detail: "Manual",
      progress: 15,
      badge: "Mastered: 15%",
      image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=500&auto=format&fit=crop",
      isAI: false
    }
  ];

  return (
    <div className="bg-background-light font-display text-[#1b0d14] min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-64 flex-col gap-6 py-8 pr-8 animate-fadeIn">
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-bold text-[#9a4c73] px-3 uppercase tracking-widest mb-1">Library</h3>
            <a className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#f3e7ed] text-primary font-bold transition-all" href="#">
              <Layers size={20} />
              <span className="text-sm">All Flashcards</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#9a4c73] hover:bg-white transition-all" href="#">
              <Star size={20} />
              <span className="text-sm">Favorites</span>
            </a>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 py-8 px-4 sm:px-6 lg:px-0">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div className="flex flex-col gap-1">
              <h2 className="text-3xl font-black tracking-tight text-[#1b0d14]">Flashcard Library</h2>
              <p className="text-[#9a4c73] text-base font-medium">You've mastered 842 cards so far. Keep it up!</p>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-sm font-bold shadow-lg hover:opacity-90 transition-all active:scale-95">
              <Plus size={20} />
              <span>Create New Set</span>
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { label: 'Daily Streak', val: '14 Days', icon: Flame, color: 'text-primary' },
              { label: 'Total Cards', val: '1,248', icon: Layers, color: 'text-primary' },
              { label: 'Mastery', val: '67%', icon: BadgeCheck, color: 'text-green-500' },
              { label: 'AI Decks', val: '12', icon: Wand2, color: 'text-blue-500' },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-[#f3e7ed] flex flex-col justify-center">
                <p className="text-[10px] text-[#9a4c73] font-bold uppercase mb-2 tracking-widest">{stat.label}</p>
                <div className="flex items-center gap-3">
                  <stat.icon className={`${stat.color}`} size={24} />
                  <span className="text-2xl font-black">{stat.val}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Decks Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {decks.map((deck, idx) => (
              <div key={idx} className="bg-white rounded-[2rem] border border-[#f3e7ed] overflow-hidden hover:shadow-xl transition-all group cursor-pointer flex flex-col">
                {/* Card Header (Image) */}
                <div className="relative h-44 w-full bg-center bg-cover" style={{ backgroundImage: `url(${deck.image})` }}>
                  {/* Badge */}
                  <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-md flex items-center gap-1.5 ${
                    deck.isAI ? 'bg-primary text-white' : 'bg-white/90 text-primary'
                  }`}>
                    {deck.isAI && <Zap size={10} fill="currentColor" />}
                    {deck.badge}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex flex-col flex-1 gap-4">
                  <div>
                    <h3 className="font-bold text-xl text-[#1b0d14] group-hover:text-primary transition-colors">{deck.title}</h3>
                    <p className="text-[#9a4c73] text-sm mt-1">{deck.cards} Cards • {deck.detail}</p>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-[#f3e7ed] h-2.5 rounded-full overflow-hidden">
                    <div 
                      className={`${deck.color || 'bg-primary'} h-full rounded-full transition-all duration-700`} 
                      style={{ width: `${deck.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Add More Sets Card */}
            <div className="border-2 border-dashed border-[#f3e7ed] rounded-[2rem] flex flex-col items-center justify-center p-10 gap-4 text-center group hover:border-primary transition-all cursor-pointer bg-[#fcf8fa]/50 min-h-[300px]">
              <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                <Plus size={28} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-[#1b0d14]">Add More Sets</h3>
                <p className="text-[#9a4c73] text-sm mt-1 max-w-[200px] mx-auto">Create More Flashcard</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;