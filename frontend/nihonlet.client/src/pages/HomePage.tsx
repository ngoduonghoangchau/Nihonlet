import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Layers, PenTool, ArrowRight, ChevronDown, Star, Zap } from "lucide-react";

// --- Components phụ trợ ---

// 1. Component để tạo hiệu ứng xuất hiện khi cuộn chuột
const RevealOnScroll = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"} ${className}`}
    >
      {children}
    </div>
  );
};

// 2. Component Hạt Hoa Anh Đào rơi (Background Animation)
const SakuraBackground = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
    {[...Array(15)].map((_, i) => (
      <div
        key={i}
        className="absolute animate-float-sakura opacity-40"
        style={{
          left: `${Math.random() * 100}%`,
          top: `-${Math.random() * 20}%`,
          animationDuration: `${8 + Math.random() * 10}s`,
          animationDelay: `${Math.random() * 5}s`,
          transform: `scale(${0.5 + Math.random() * 0.5})`,
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#F472B6">
          <path d="M12 2C9 7 4 9 4 9s5 2 8 7c3-5 8-7 8-7s-5-2-8-7z" />
        </svg>
      </div>
    ))}
  </div>
);

// --- Main Component ---

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800 font-literata overflow-x-hidden">
      <SakuraBackground />

      {/* --- HEADER --- */}
      <header className="fixed top-0 w-full bg-white/70 backdrop-blur-md z-50 border-b border-pink-100">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-3xl font-lalezar text-pink-600 tracking-wider cursor-pointer">NIHONLET</div>
          <div className="hidden md:flex space-x-8 font-bold text-sm tracking-widest text-gray-600">
            <a href="#flashcard" className="hover:text-pink-500 transition">
              TỪ VỰNG
            </a>
            <a href="#reading" className="hover:text-pink-500 transition">
              ĐỌC HIỂU
            </a>
            <a href="/grammar" className="hover:text-pink-500 transition">
              NGỮ PHÁP
            </a>
          </div>
          <Link
            to="/login"
            className="px-6 py-2 bg-gray-900 text-white rounded-full font-lalezar hover:bg-pink-600 transition-colors shadow-lg"
          >
            Đăng nhập
          </Link>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Hero Text */}
          <div className="z-10 animate-fade-in-up">
            <span className="inline-block px-4 py-1 rounded-full bg-pink-100 text-pink-600 font-bold text-sm mb-6 border border-pink-200">
              ✨ Học tiếng Nhật phong cách mới
            </span>
            <h1 className="text-6xl md:text-8xl font-lalezar leading-none text-gray-900 mb-6">
              CHINH PHỤC <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                NIHONGO
              </span>
            </h1>
            <p className="text-xl text-gray-500 mb-8 max-w-lg leading-relaxed font-lemonada">
              Không còn nhàm chán. Trải nghiệm phương pháp học tập tương tác, hình ảnh sinh động và lộ trình cá nhân
              hóa.
            </p>
            <div className="flex space-x-4">
              <button className="px-8 py-4 bg-pink-500 text-white rounded-2xl font-bold font-lalezar text-xl shadow-pink-300 shadow-xl hover:shadow-2xl hover:bg-pink-600 hover:-translate-y-1 transition-all flex items-center">
                <Zap className="mr-2" /> Bắt đầu ngay
              </button>
              <button className="px-8 py-4 bg-white text-gray-800 border-2 border-gray-100 rounded-2xl font-bold font-lalezar text-xl hover:border-pink-300 hover:text-pink-500 transition-all">
                Tìm hiểu thêm
              </button>
            </div>
          </div>

          {/* Hero Visual (3D effect composition) */}
          <div className="relative h-[600px] hidden lg:flex justify-center items-center z-10">
            {/* Circle Background */}
            <div className="absolute w-[500px] h-[500px] bg-gradient-to-tr from-pink-200 to-purple-100 rounded-full animate-pulse-slow blur-3xl opacity-60"></div>

            {/* Floating Cards Animation */}
            <div className="relative w-full h-full perspective-1000">
              {/* Card 1 */}
              <div className="absolute top-[20%] left-[10%] bg-white p-6 rounded-3xl shadow-2xl animate-float-slow border-l-8 border-blue-400 w-64 z-20">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    <BookOpen size={24} />
                  </div>
                  <span className="font-bold text-gray-700">Đọc hiểu N3</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full w-[70%] bg-blue-400"></div>
                </div>
              </div>

              {/* Card 2 (Main) */}
              <div className="absolute top-[35%] left-[30%] bg-white p-6 rounded-3xl shadow-2xl animate-float-medium border-l-8 border-pink-500 w-72 z-30">
                <img
                  src="https://media.istockphoto.com/id/1137578281/vector/fuji-mountain-with-cherry-blossom.jpg?s=612x612&w=0&k=20&c=L_qjW5u-gS7pBd-X7h_mJ1CX_C_B4W-J8tqZ6_yv-Cg="
                  alt="Japan"
                  className="rounded-xl mb-4 h-32 w-full object-cover"
                />
                <h3 className="font-bold text-lg mb-1">Hành trình 30 ngày</h3>
                <div className="flex text-yellow-400">
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                </div>
              </div>

              {/* Card 3 */}
              <div className="absolute bottom-[20%] right-[10%] bg-white p-6 rounded-3xl shadow-2xl animate-float-fast border-l-8 border-orange-400 w-64 z-20">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                    <Layers size={24} />
                  </div>
                  <span className="font-bold text-gray-700">10 New Words</span>
                </div>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs">Sakura</span>
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs">Sushi</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-pink-400">
          <ChevronDown size={32} />
        </div>
      </section>

      {/* --- FEATURE 1: FLASHCARD --- */}
      <section id="flashcard" className="py-24 bg-white relative">
        <div className="container mx-auto px-6">
          <RevealOnScroll className="flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-1/2 order-2 md:order-1 relative group">
              <div className="absolute inset-0 bg-green-200 rounded-[50px] rotate-6 group-hover:rotate-3 transition-transform duration-500"></div>
              <img
                src="https://img.freepik.com/free-vector/students-learning-foreign-language-with-vocabulary_74855-11070.jpg"
                alt="Flashcard Learning"
                className="relative rounded-[50px] shadow-2xl z-10 w-full object-cover border-4 border-white"
              />
            </div>
            <div className="w-full md:w-1/2 order-1 md:order-2">
              <div className="p-3 bg-green-100 rounded-2xl w-fit text-green-600 mb-6">
                <Layers size={32} />
              </div>
              <h2 className="text-5xl font-lalezar text-gray-900 mb-6">Flashcard Thông Minh</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed font-lemonada text-sm">
                Học từ vựng nhanh gấp 3 lần nhờ phương pháp lặp lại ngắt quãng (Spaced Repetition). Hình ảnh trực quan,
                âm thanh sống động giúp bạn ghi nhớ sâu và lâu hơn.
              </p>
              <button className="group flex items-center font-bold text-green-600 hover:text-green-700 transition">
                Học từ vựng ngay <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* --- FEATURE 2: READING --- */}
      <section id="reading" className="py-24 bg-gradient-to-b from-blue-50 to-white relative overflow-hidden">
        {/* Decoration */}
        <div className="absolute -right-20 top-40 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-30"></div>

        <div className="container mx-auto px-6">
          <RevealOnScroll className="flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-1/2">
              <div className="p-3 bg-blue-100 rounded-2xl w-fit text-blue-600 mb-6">
                <BookOpen size={32} />
              </div>
              <h2 className="text-5xl font-lalezar text-gray-900 mb-6">Thư Viện Đọc Hiểu</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed font-lemonada text-sm">
                Kho tàng truyện cổ tích, tin tức và bài đọc văn hóa Nhật Bản. Tra từ điển ngay trên đoạn văn, dịch nghĩa
                từng câu và luyện dịch song ngữ.
              </p>
              <button className="group flex items-center font-bold text-blue-600 hover:text-blue-700 transition">
                Khám phá thư viện <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
            <div className="w-full md:w-1/2 relative group">
              <div className="absolute inset-0 bg-blue-200 rounded-tr-[80px] rounded-bl-[80px] -rotate-6 group-hover:-rotate-3 transition-transform duration-500"></div>
              <img
                src="https://img.freepik.com/free-vector/gradient-world-book-day-background_23-2149325463.jpg"
                alt="Reading"
                className="relative rounded-tr-[80px] rounded-bl-[80px] shadow-2xl z-10 w-full object-cover border-4 border-white"
              />
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* --- FEATURE 3: GRAMMAR --- */}
      <section id="grammar" className="py-24 bg-white relative">
        <div className="container mx-auto px-6">
          <RevealOnScroll className="flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-1/2 order-2 md:order-1 relative group">
              <div className="absolute inset-0 bg-orange-200 rounded-full scale-90 group-hover:scale-100 transition-transform duration-500"></div>
              <img
                src="https://img.freepik.com/free-vector/pro-grammar-abstract-concept-vector-illustration-professional-writer-grammar-correction-software-copywriting-service-app-editor-online-check-text-quality-punctuation-mark-abstract-metaphor_335657-2277.jpg"
                alt="Grammar"
                className="relative rounded-2xl shadow-2xl z-10 w-full object-cover border-4 border-white"
              />
            </div>
            <div className="w-full md:w-1/2 order-1 md:order-2">
              <div className="p-3 bg-orange-100 rounded-2xl w-fit text-orange-600 mb-6">
                <PenTool size={32} />
              </div>
              <h2 className="text-5xl font-lalezar text-gray-900 mb-6">Ngữ Pháp Cô Đọng</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed font-lemonada text-sm">
                Tổng hợp 500+ mẫu ngữ pháp từ N5 đến N1. Giải thích chi tiết, ví dụ thực tế và bài tập trắc nghiệm giúp
                bạn nắm vững cấu trúc câu.
              </p>
              <button className="group flex items-center font-bold text-orange-600 hover:text-orange-700 transition">
                Ôn luyện ngữ pháp <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* --- CTA FOOTER --- */}
      <footer className="py-20 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-5xl font-lalezar mb-6">Bạn đã sẵn sàng?</h2>
          <p className="text-gray-400 mb-10 max-w-2xl mx-auto font-lemonada text-sm">
            Tham gia cùng hàng ngàn người học khác và chinh phục tiếng Nhật ngay hôm nay. Hoàn toàn miễn phí để bắt đầu.
          </p>
          <Link
            to="/login"
            className="inline-block px-10 py-4 bg-white text-gray-900 rounded-full font-bold text-xl hover:bg-pink-500 hover:text-white transition-all shadow-lg transform hover:scale-105"
          >
            Tạo tài khoản miễn phí
          </Link>
        </div>

        {/* Footer Decor */}
        <div className="absolute bottom-0 left-0 opacity-10 w-64 h-64 bg-pink-500 rounded-full blur-3xl"></div>
        <div className="absolute top-0 right-0 opacity-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
      </footer>

      {/* Style CSS nội bộ cho animation (Copy-Paste là chạy) */}
      <style>{`
                @keyframes float-sakura {
                    0% { transform: translateY(0) rotate(0deg) translateX(0); opacity: 0; }
                    10% { opacity: 0.8; }
                    100% { transform: translateY(100vh) rotate(360deg) translateX(100px); opacity: 0; }
                }
                .animate-float-sakura { animation: float-sakura linear infinite; }
                
                @keyframes float-slow {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }

                @keyframes float-medium {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-15px); }
                }
                .animate-float-medium { animation: float-medium 5s ease-in-out infinite; }

                @keyframes float-fast {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                .animate-float-fast { animation: float-fast 4s ease-in-out infinite; }

                @keyframes pulse-slow {
                    0%, 100% { transform: scale(1); opacity: 0.6; }
                    50% { transform: scale(1.05); opacity: 0.4; }
                }
                .animate-pulse-slow { animation: pulse-slow 8s infinite; }
                
                .perspective-1000 { perspective: 1000px; }
            `}</style>
    </div>
  );
};

export default HomePage;
