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
      <div className="absolute inset-0 transition-opacity bg-black/30 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-sm p-8 text-center transform bg-white shadow-2xl rounded-3xl animate-bounce-in font-literata">
        <button
          onClick={onClose}
          className="absolute p-2 transition bg-gray-100 rounded-full top-4 right-4 hover:bg-gray-200"
        >
          <X size={20} className="text-gray-500" />
        </button>

        <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-yellow-100 rounded-full">
          <span className="text-4xl">🚧</span>
        </div>

        <h3 className="mb-2 text-2xl font-bold text-gray-800 font-lalezar">{title}</h3>
        <p className="mb-6 text-gray-500">Tính năng này đang được đội ngũ NihonLet xây dựng. Hãy quay lại sau nhé!</p>

        <button
          onClick={onClose}
          className="w-full py-3 font-bold text-white transition bg-pink-500 shadow-lg rounded-xl font-lalezar hover:bg-pink-600 shadow-pink-200"
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
    } else if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF5F7] text-gray-800 font-literata relative overflow-hidden">
      {/* Background Decoration Circles */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-pink-200 rounded-full blur-[100px] opacity-40 animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-blue-200 rounded-full blur-[100px] opacity-40 animate-pulse-slow delay-1000"></div>

      {/* --- HEADER KHU VỰC CÁ NHÂN --- */}
      <header className="relative z-10 flex flex-col items-center justify-between gap-6 px-6 pt-10 pb-6 md:px-12 md:flex-row">
        <div className="text-center md:text-left animate-slide-down">
          <h1 className="text-4xl text-gray-800 font-lalezar">
            Konnichiwa, <span className="text-pink-500">Student-san!</span> 👋
          </h1>
          <p className="mt-1 text-sm text-gray-500 font-lemonada">Hôm nay bạn muốn học gì nào?</p>
        </div>

        {/* Gamification Stats */}
        <div className="flex gap-4 delay-100 animate-slide-down">
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-orange-100 rounded-full shadow-sm">
            <Flame className="text-orange-500 fill-orange-500" size={20} />
            <span className="pt-1 text-lg font-bold text-orange-600 font-lalezar">12 Ngày</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-yellow-100 rounded-full shadow-sm">
            <Trophy className="text-yellow-500 fill-yellow-500" size={20} />
            <span className="pt-1 text-lg font-bold text-yellow-600 font-lalezar">1500 XP</span>
          </div>
        </div>
      </header>

      {/* --- SEARCH BAR --- */}
      <div className="container relative z-10 px-6 mx-auto mb-10">
        <div className="relative max-w-2xl mx-auto group animate-fade-in-up">
          <input
            type="text"
            placeholder="Tìm kiếm bài học, từ vựng, ngữ pháp..."
            className="w-full py-4 pr-6 transition-all bg-white border-2 border-transparent shadow-md outline-none pl-14 rounded-2xl focus:border-pink-300 focus:shadow-pink-100 font-literata placeholder:text-gray-400 placeholder:italic"
          />
          <Search
            className="absolute text-gray-400 transition-colors transform -translate-y-1/2 left-5 top-1/2 group-focus-within:text-pink-500"
            size={24}
          />
        </div>
      </div>

      {/* --- MAIN GRID --- */}
      <main className="container relative z-10 px-6 pb-20 mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
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
                <div className="p-2 transition-colors rounded-full bg-gray-50 group-hover:bg-gray-100">
                  {item.isLocked ? (
                    <Lock size={20} className="text-gray-400" />
                  ) : (
                    <ChevronRight size={20} className="text-gray-400 group-hover:text-pink-500" />
                  )}
                </div>
              </div>

              {/* Text Content */}
              <div>
                <h3 className="mb-1 text-2xl font-bold text-gray-800 transition-colors font-lalezar group-hover:text-pink-600">
                  {item.title}
                </h3>
                <p className="text-sm font-light text-gray-500 font-lemonada">{item.subtitle}</p>
              </div>

              {/* Decorative Shape */}
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-gray-50 to-transparent rounded-tl-[100px] rounded-br-[32px] -z-10 group-hover:scale-150 transition-transform duration-500 origin-bottom-right"></div>
            </div>
          ))}
        </div>
      </main>

      {/* --- SOCIAL FOOTER (Floating) --- */}
      <div className="fixed left-0 z-20 flex justify-center w-full pointer-events-none bottom-8">
        <div className="flex gap-4 px-6 py-3 delay-500 border border-white rounded-full shadow-lg pointer-events-auto bg-white/80 backdrop-blur-md animate-bounce-in">
          <span className="hidden pt-1 mr-2 text-lg text-gray-600 font-lalezar md:block">Kết nối với chúng tôi:</span>
          <a
            href="#"
            className="p-2 text-blue-600 transition-transform bg-blue-100 rounded-full hover:scale-125 hover:shadow-md"
          >
            <Facebook size={20} />
          </a>
          <a
            href="#"
            className="p-2 text-pink-600 transition-transform bg-pink-100 rounded-full hover:scale-125 hover:shadow-md"
          >
            <Instagram size={20} />
          </a>
          <a
            href="#"
            className="p-2 text-red-600 transition-transform bg-red-100 rounded-full hover:scale-125 hover:shadow-md"
          >
            <Youtube size={20} />
          </a>
          <a
            href="#"
            className="p-2 text-black transition-transform rounded-full bg-black/10 hover:scale-125 hover:shadow-md"
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
