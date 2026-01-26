import React from 'react';
import { ArrowLeft, Files, ClipboardList } from 'lucide-react';

const MiniGamePage = () => {
  // Định nghĩa các mã màu theo yêu cầu để dễ quản lý
  const colorPointBack = "rgb(255 193 204)"; // rgb(255 193 204)
  const colorCardBorder = "rgb(251 207 232)"; // rgb(251 207 232)

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      {/* HEADER - Giữ nguyên theo yêu cầu */}
      <header className="fixed top-0 w-full bg-white/70 backdrop-blur-md z-50 border-b border-pink-100">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-3xl font-bold text-pink-600 tracking-wider cursor-pointer">
            NIHONLET
          </div>
          <div className="hidden md:flex space-x-8 font-bold text-sm tracking-widest text-gray-600">
            <a href="#vocabulary" className="text-pink-500 uppercase border-b-2 border-pink-500 pb-1">TỪ VỰNG</a>
            <a href="#reading" className="hover:text-pink-500 transition uppercase">ĐỌC HIỂU</a>
            <a href="#grammar" className="hover:text-pink-500 transition uppercase">NGỮ PHÁP</a>
          </div>
          <button className="px-6 py-2 bg-gray-900 text-white rounded-full font-bold hover:bg-pink-600 transition-colors shadow-lg text-sm">
            Đăng nhập
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="pt-32 pb-20 container mx-auto px-4">
        
        {/* Top Info Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-4">
          {/* Nút Quay Lại với màu rgb(255 193 204) */}
          <button 
            style={{ backgroundColor: colorPointBack }}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-gray-700 hover:opacity-90 transition-opacity shadow-sm"
          >
            <ArrowLeft size={18} /> QUAY LẠI
          </button>

          <div className="bg-white border-2 border-pink-100 px-12 py-3 rounded-2xl shadow-sm text-center">
            <h2 className="text-xl font-bold text-pink-600">Mini Game</h2>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Level 1</p>
          </div>

          {/* Ô Điểm với màu rgb(255 193 204) */}
          <div 
            style={{ backgroundColor: colorPointBack }}
            className="px-10 py-2.5 rounded-xl font-bold text-gray-700 shadow-sm"
          >
            ĐIỂM: 0
          </div>
        </div>

        {/* Title Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">Nhớ Chữ</h1>
          <p className="text-gray-500 text-lg italic font-medium">Rèn trí nhớ từ vựng qua hình thức game vui</p>
        </div>

        {/* Game Modes Grid */}
        <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto px-4">
          
          {/* Chế độ So Khớp */}
          <div 
            style={{ borderColor: colorCardBorder }}
            className="group bg-transparent border-[3px] p-12 rounded-[2.5rem] flex flex-col items-center text-center hover:shadow-xl hover:shadow-pink-50 transition-all duration-300 cursor-pointer"
          >
            <div className="bg-pink-50 p-5 rounded-3xl mb-6 group-hover:scale-110 transition-transform duration-300">
              <Files size={48} className="text-pink-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3 no-underline">
              Chế Độ So Khớp
            </h3>
            <p className="text-gray-500 leading-relaxed max-w-[240px]">
              Ghép đôi từ tiếng Nhật với nghĩa Tiếng Việt
            </p>
          </div>

          {/* Chế độ Viết Lại */}
          <div 
            style={{ borderColor: colorCardBorder }}
            className="group bg-transparent border-[3px] p-12 rounded-[2.5rem] flex flex-col items-center text-center hover:shadow-xl hover:shadow-pink-50 transition-all duration-300 cursor-pointer"
          >
            <div className="bg-pink-50 p-5 rounded-3xl mb-6 group-hover:scale-110 transition-transform duration-300">
              <ClipboardList size={48} className="text-pink-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3 no-underline">
              Chế Độ Viết Lại
            </h3>
            <p className="text-gray-500 leading-relaxed max-w-[240px]">
              Nhập lại Kana hoặc Romanji từ Kanji
            </p>
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-pink-50/30 pt-20 pb-10 border-t border-pink-100 mt-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center mb-16">
            <div className="flex items-center gap-10 mb-10">
              <div className="flex flex-col items-center">
                <div className="text-3xl font-black text-pink-600 tracking-tighter">NIHONLET</div>
                <div className="h-1 w-full bg-pink-200 mt-1 rounded-full"></div>
              </div>
              <div className="h-14 w-[1px] bg-pink-200 hidden md:block"></div>
              <p className="text-pink-800 font-bold tracking-wide hidden md:block uppercase text-sm">Nihongo For Everyone</p>
            </div>

            <div className="w-full max-w-md">
              <p className="text-center font-bold text-gray-700 mb-4">Subscribe to get our Newsletter</p>
              <div className="relative flex items-center">
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  className="w-full py-4 px-6 rounded-full border-2 border-pink-100 focus:border-pink-300 focus:outline-none transition-all bg-white"
                />
                <button className="absolute right-1.5 px-8 py-2.5 bg-black text-white rounded-full font-bold hover:bg-pink-600 transition-all text-sm shadow-lg">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-xs font-bold uppercase tracking-widest text-pink-400 border-t border-pink-100 pt-10">
            <a href="#" className="hover:text-pink-600 transition-colors">Careers</a>
            <span className="text-pink-100">|</span>
            <a href="#" className="hover:text-pink-600 transition-colors">Privacy Policy</a>
            <span className="text-pink-100">|</span>
            <a href="#" className="hover:text-pink-600 transition-colors">Terms & Conditions</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MiniGamePage;