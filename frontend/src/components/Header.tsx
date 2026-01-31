import React from 'react';
import { Search, LogOut } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-[#f3e7ed]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <a className="flex items-center gap-2 hover:opacity-80 transition-opacity" href="/">
              {/* THAY THẾ ĐOẠN NÀY BẰNG LOGO CỦA BẠN */}
              <img 
                src="src/assets/logo.jpg" 
                alt="Sakura Learn Logo" 
                className="h-9 w-auto rounded-lg object-contain"
              />
              <span className="text-xl font-bold tracking-tight text-[#1b0d14]">NihonLet</span>
            </a>
            <nav className="hidden md:flex items-center gap-6">
              <a className="px-1 py-4 text-sm font-medium text-[#9a4c73] hover:text-primary transition-colors" href="#">Home</a>
              <a className="px-1 py-4 text-sm font-bold border-b-2 border-primary text-primary transition-colors" href="#">Flashcards</a>
              <a className="px-1 py-4 text-sm font-medium text-[#9a4c73] hover:text-primary transition-colors" href="#">Grammar</a>
              <a className="px-1 py-4 text-sm font-medium text-[#9a4c73] hover:text-primary transition-colors" href="#">Games</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center relative">
              <Search className="absolute left-3 text-[#9a4c73]" size={16} />
              <input 
                className="bg-[#f3e7ed] border-none rounded-full py-1.5 pl-10 pr-4 text-xs focus:ring-2 focus:ring-primary w-40 lg:w-64" 
                placeholder="Search..." 
                type="text" 
              />
            </div>
            <div className="h-6 w-[1px] bg-[#f3e7ed] mx-1"></div>
            <div className="flex items-center gap-3">
               <div className="size-8 rounded-full border border-primary/20 bg-cover bg-center" style={{backgroundImage: 'url("...")'}}></div>
               <button className="flex items-center gap-1 text-[#9a4c73] hover:text-red-500 transition-colors text-sm font-bold">
                 <LogOut size={18} />
                 <span>logout</span>
               </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;