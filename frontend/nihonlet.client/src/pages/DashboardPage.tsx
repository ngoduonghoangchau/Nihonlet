import React, { useState } from "react";
import {
  BookOpen,
  BarChart2,
  MessageCircle,
  Mic,
  Layers,
  PenTool,
  Search,
  X,
  Lock,
  ChevronRight,
  Flame,
  Trophy,
  Facebook,
  Youtube,
  Instagram,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

// --- DATA CẤU HÌNH CÁC TÍNH NĂNG ---
const DASHBOARD_ITEMS = [
  {
    id: "stats",
    title: "Thống Kê",
    subtitle: "Theo dõi tiến độ",
    icon: BarChart2,
    color: "from-yellow-400 to-orange-500",
    shadow: "shadow-orange-200",
    isLocked: true, // Tính năng đang phát triển
  },
  {
    id: "reading",
    title: "Đọc Hiểu",
    subtitle: "Thư viện sách",
    icon: BookOpen,
    color: "from-blue-400 to-cyan-500",
    shadow: "shadow-blue-200",
    isLocked: false,
    path: "/reading",
  },
  {
    id: "flashcard",
    title: "Flashcard",
    subtitle: "Ôn tập từ vựng",
    icon: Layers,
    color: "from-green-400 to-emerald-500",
    shadow: "shadow-green-200",
    isLocked: false,
    path: "/myflashcardlibrary",
  },
  {
    id: "ai",
    title: "Hội Thoại AI",
    subtitle: "Luyện phản xạ",
    icon: MessageCircle,
    color: "from-purple-400 to-indigo-500",
    shadow: "shadow-purple-200",
    isLocked: true, // Tính năng đang phát triển
  },
  {
    id: "grammar",
    title: "Ngữ Pháp",
    subtitle: "Cấu trúc câu",
    icon: PenTool,
    color: "from-pink-400 to-rose-500",
    shadow: "shadow-pink-200",
    isLocked: false,
    path: "/grammar",
  },
  {
    id: "speaking",
    title: "Phát Âm",
    subtitle: "Chỉnh sửa giọng",
    icon: Mic,
    color: "from-red-400 to-red-600",
    shadow: "shadow-red-200",
    isLocked: true, // Tính năng đang phát triển
  },
];

// --- COMPONENT POPUP (MODAL) ---
const Modal = ({ isOpen, onClose, title }: { isOpen: boolean; onClose: () => void; title: string }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop Blur */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      {/* Modal Content */}
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full relative z-10 shadow-2xl transform animate-bounce-in text-center font-literata">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
        >
          <X size={20} className="text-gray-500" />
        </button>

        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🚧</span>
        </div>

        <h3 className="text-2xl font-bold text-gray-800 mb-2 font-lalezar">{title}</h3>
        <p className="text-gray-500 mb-6">Tính năng này đang được đội ngũ NihonLet xây dựng. Hãy quay lại sau nhé!</p>

        <button
          onClick={onClose}
          className="w-full py-3 bg-pink-500 text-white rounded-xl font-bold font-lalezar hover:bg-pink-600 transition shadow-lg shadow-pink-200"
        >
          Đã hiểu
        </button>
      </div>
    </div>
  );
};

// --- COMPONENT TRANG DASHBOARD ---
const DashboardPage = () => {
  const navigate = useNavigate(); // 2. Khởi tạo hàm điều hướng
  const [modalInfo, setModalInfo] = useState<{ isOpen: boolean; title: string }>({ isOpen: false, title: "" });

  const handleCardClick = (item: (typeof DASHBOARD_ITEMS)[0]) => {
    if (item.isLocked) {
      setModalInfo({ isOpen: true, title: item.title });
    } else if (item.path) { // 3. Kiểm tra nếu có đường dẫn
      navigate(item.path); // 4. Thực hiện chuyển trang thực tế
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF5F7] text-gray-800 font-literata relative overflow-hidden">
      {/* Background Decoration Circles */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-pink-200 rounded-full blur-[100px] opacity-40 animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-blue-200 rounded-full blur-[100px] opacity-40 animate-pulse-slow delay-1000"></div>

      {/* --- HEADER KHU VỰC CÁ NHÂN --- */}
      <header className="relative pt-10 pb-6 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6 z-10">
        <div className="text-center md:text-left animate-slide-down">
          <h1 className="text-4xl font-lalezar text-gray-800">
            Konnichiwa, <span className="text-pink-500">Student-san!</span> 👋
          </h1>
          <p className="text-gray-500 font-lemonada text-sm mt-1">Hôm nay bạn muốn học gì nào?</p>
        </div>

        {/* Gamification Stats */}
        <div className="flex gap-4 animate-slide-down delay-100">
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-orange-100">
            <Flame className="text-orange-500 fill-orange-500" size={20} />
            <span className="font-bold text-orange-600 font-lalezar text-lg pt-1">12 Ngày</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-yellow-100">
            <Trophy className="text-yellow-500 fill-yellow-500" size={20} />
            <span className="font-bold text-yellow-600 font-lalezar text-lg pt-1">1500 XP</span>
          </div>
        </div>
      </header>

      {/* --- SEARCH BAR --- */}
      <div className="container mx-auto px-6 mb-10 relative z-10">
        <div className="max-w-2xl mx-auto relative group animate-fade-in-up">
          <input
            type="text"
            placeholder="Tìm kiếm bài học, từ vựng, ngữ pháp..."
            className="w-full py-4 pl-14 pr-6 bg-white rounded-2xl shadow-md border-2 border-transparent focus:border-pink-300 focus:shadow-pink-100 outline-none transition-all font-literata placeholder:text-gray-400 placeholder:italic"
          />
          <Search
            className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors"
            size={24}
          />
        </div>
      </div>

      {/* --- MAIN GRID --- */}
      <main className="container mx-auto px-6 pb-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {DASHBOARD_ITEMS.map((item, index) => (
            <div
              key={item.id}
              onClick={() => handleCardClick(item)}
              className="group relative bg-white rounded-[32px] p-6 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border border-white/50"
              style={{
                animation: `fadeInUp 0.6s ease-out forwards ${index * 0.1}s`,
                opacity: 0, // Start hidden for animation
              }}
            >
              {/* Card Background Glow on Hover */}
              <div
                className={`absolute inset-0 rounded-[32px] bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
              ></div>

              <div className="flex items-start justify-between mb-6">
                {/* Icon Container */}
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-lg ${item.shadow} transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}
                >
                  <item.icon size={32} strokeWidth={2.5} />
                </div>

                {/* Arrow or Lock Icon */}
                <div className="p-2 bg-gray-50 rounded-full group-hover:bg-gray-100 transition-colors">
                  {item.isLocked ? (
                    <Lock size={20} className="text-gray-400" />
                  ) : (
                    <ChevronRight size={20} className="text-gray-400 group-hover:text-pink-500" />
                  )}
                </div>
              </div>

              {/* Text Content */}
              <div>
                <h3 className="text-2xl font-bold text-gray-800 font-lalezar mb-1 group-hover:text-pink-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 font-lemonada font-light">{item.subtitle}</p>
              </div>

              {/* Decorative Shape */}
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-gray-50 to-transparent rounded-tl-[100px] rounded-br-[32px] -z-10 group-hover:scale-150 transition-transform duration-500 origin-bottom-right"></div>
            </div>
          ))}
        </div>
      </main>

      {/* --- SOCIAL FOOTER (Floating) --- */}
      <div className="fixed bottom-8 left-0 w-full flex justify-center pointer-events-none z-20">
        <div className="flex gap-4 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full shadow-lg pointer-events-auto animate-bounce-in delay-500 border border-white">
          <span className="text-gray-600 font-lalezar text-lg pt-1 mr-2 hidden md:block">Kết nối với chúng tôi:</span>
          <a
            href="#"
            className="p-2 bg-blue-100 rounded-full text-blue-600 hover:scale-125 transition-transform hover:shadow-md"
          >
            <Facebook size={20} />
          </a>
          <a
            href="#"
            className="p-2 bg-pink-100 rounded-full text-pink-600 hover:scale-125 transition-transform hover:shadow-md"
          >
            <Instagram size={20} />
          </a>
          <a
            href="#"
            className="p-2 bg-red-100 rounded-full text-red-600 hover:scale-125 transition-transform hover:shadow-md"
          >
            <Youtube size={20} />
          </a>
          <a
            href="#"
            className="p-2 bg-black/10 rounded-full text-black hover:scale-125 transition-transform hover:shadow-md"
          >
            {/* Tiktok SVG */}
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3V0Z" />
            </svg>
          </a>
        </div>
      </div>

      {/* --- MODAL LOGIC RENDER --- */}
      <Modal
        isOpen={modalInfo.isOpen}
        onClose={() => setModalInfo({ ...modalInfo, isOpen: false })}
        title={modalInfo.title}
      />

      {/* --- CSS ANIMATIONS --- */}
      <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes bounceIn {
                    0% { opacity: 0; transform: scale(0.3); }
                    50% { opacity: 1; transform: scale(1.05); }
                    70% { transform: scale(0.9); }
                    100% { transform: scale(1); }
                }
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.4; transform: scale(1); }
                    50% { opacity: 0.6; transform: scale(1.1); }
                }
                .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
                .animate-slide-down { animation: slideDown 0.8s ease-out forwards; }
                .animate-bounce-in { animation: bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
                .animate-pulse-slow { animation: pulse-slow 8s infinite; }
                .delay-100 { animation-delay: 0.1s; }
                .delay-500 { animation-delay: 0.5s; }
                .delay-1000 { animation-delay: 1s; }
            `}</style>
    </div>
  );
};

export default DashboardPage;
