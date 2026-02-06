import React from 'react';
import { Search, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom'; // Sử dụng Link để không bị load lại trang

import logo from '../assets/logo.jpg'; 

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-[#f3e7ed]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            {/* 2. Dùng Link thay vì thẻ <a> để chuyển trang mượt mà */}
            <Link className="flex items-center gap-2 hover:opacity-80 transition-opacity" to="/dashboard">
              <img 
                // 3. SỬ DỤNG BIẾN LOGO ĐÃ IMPORT
                src={logo} 
                alt="Sakura Learn Logo" 
                className="h-9 w-auto rounded-lg object-contain"
              />
              <span className="text-xl font-bold tracking-tight text-[#1b0d14]">NihonLet</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link className="px-1 py-4 text-sm font-medium text-[#9a4c73] hover:text-primary transition-colors" to="/dashboard">Home</Link>
              <Link className="px-1 py-4 text-sm font-bold border-b-2 border-primary text-primary transition-colors" to="/dashboard">Flashcards</Link>
              <Link className="px-1 py-4 text-sm font-medium text-[#9a4c73] hover:text-primary transition-colors" to="/grammar-library">Grammar</Link>
              <Link className="px-1 py-4 text-sm font-medium text-[#9a4c73] hover:text-primary transition-colors" to="/minigamehub">Games</Link>
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
               {/* Thay đổi avatar ở đây nếu có ảnh user */}
               <div className="size-8 rounded-full border border-primary/20 bg-[#f3e7ed]"></div>
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