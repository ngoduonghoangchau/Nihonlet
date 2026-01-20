import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  // URL ảnh lâu đài Nhật Bản có phong cách anime/art hơn để giống thiết kế
  const CASTLE_IMAGE = "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=1000&auto=format&fit=crop";

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 font-lemonada">
      {/* Container chính */}
      <div className="max-w-[1440px] w-full flex flex-col md:flex-row items-stretch justify-center gap-8 md:gap-0">
        {/* --- LEFT SIDE: Illustration & Art --- */}
        <div className="w-full md:w-1/2 relative min-h-[600px] flex flex-col items-center pt-10 overflow-hidden">
          {/* 1. TEXT SECTION */}
          <div className="text-center z-20">
            <p className="text-gray-400 tracking-[0.3em] text-sm font-light mb-1 font-lalezar uppercase">LEARN</p>
            <h1 className="text-[5rem] leading-[0.85] text-[#FF4081] font-lalezar tracking-tighter drop-shadow-sm">
              JAPANESE
            </h1>
            <p className="text-[#FF4081] tracking-[0.2em] text-sm font-lalezar mt-2">LANGUAGE AND CULTURE</p>
          </div>

          {/* 2. ILLUSTRATION COMPOSITION */}
          <div className="relative w-full h-full mt-[-20px] flex justify-center items-end">
            {/* Mặt trời đỏ (The Red Sun) */}
            <div className="absolute top-[15%] left-1/2 transform -translate-x-1/2 w-[450px] h-[450px] bg-[#FF5252] rounded-full z-0 shadow-xl opacity-90"></div>

            {/* Các đám mây trang trí (SVG Clouds) - Giả lập style vector của Figma */}
            <div className="absolute top-[20%] left-[10%] text-pink-200 opacity-80 animate-pulse delay-700 z-0">
              <CloudSVG size={80} />
            </div>
            <div className="absolute top-[10%] right-[15%] text-pink-300 opacity-60 animate-pulse z-0">
              <CloudSVG size={60} />
            </div>
            <div className="absolute bottom-[20%] left-[5%] text-pink-300 opacity-90 z-30">
              <CloudSVG size={100} />
            </div>
            <div className="absolute bottom-[30%] right-[5%] text-pink-200 opacity-80 z-0">
              <CloudSVG size={90} />
            </div>

            {/* Hình ảnh lâu đài đã được xử lý Mask để hòa trộn vào nền */}
            <div className="relative z-10 w-[500px] h-[500px] mt-10">
              <img
                src={CASTLE_IMAGE}
                alt="Himeji Castle"
                className="w-full h-full object-cover object-center"
                style={{
                  // Cắt hình theo dạng trái tim/đám mây phía dưới để giống thiết kế
                  maskImage:
                    "linear-gradient(to bottom, black 40%, transparent 95%), radial-gradient(circle at center bottom, transparent 0%, black 100%)",
                  WebkitMaskImage: "linear-gradient(to bottom, black 50%, transparent 100%)",
                }}
              />

              {/* Lớp phủ hoa anh đào phía dưới chân lâu đài */}
              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white via-transparent to-transparent z-20"></div>
            </div>

            {/* Hiệu ứng hoa rơi */}
            <div className="absolute inset-0 pointer-events-none z-30">
              {[...Array(8)].map((_, i) => (
                <span
                  key={i}
                  className="absolute text-pink-400 animate-float"
                  style={{
                    left: `${10 + Math.random() * 80}%`,
                    top: `${Math.random() * 50}%`,
                    animationDuration: `${5 + Math.random() * 5}s`,
                    opacity: 0.6,
                  }}
                >
                  ✿
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* --- RIGHT SIDE: Form Login --- */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-20 lg:px-32 py-10 bg-white z-20">
          {/* Header */}
          <div className="mb-10">
            <h2 className="text-6xl font-literata italic font-bold text-black mb-4">
              Welcome<span className="not-italic">!</span>
            </h2>
            <p className="text-gray-600 text-sm font-lemonada font-light">
              <a href="#" className="font-bold underline decoration-2 decoration-black hover:text-[#5655D6] transition">
                Create a free account
              </a>{" "}
              or login to get started
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <label className="block text-xl font-literata text-gray-800">Email</label>
              <input
                type="email"
                placeholder="abc1234@gmail.com"
                className="w-full bg-[#E0E0E0] text-gray-700 px-6 py-4 rounded-full outline-none focus:ring-2 focus:ring-[#5655D6]/50 transition-all font-literata placeholder:text-gray-500 placeholder:font-literata placeholder:text-lg"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-xl font-literata text-gray-800">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="• • • • • • • •"
                  className="w-full bg-[#E0E0E0] text-gray-700 px-6 py-4 rounded-full outline-none focus:ring-2 focus:ring-[#5655D6]/50 transition-all font-literata placeholder:text-gray-500 text-xl tracking-widest"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-800"
                >
                  {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end pt-1">
              <a href="#" className="text-sm font-bold font-literata text-black hover:text-[#5655D6] transition">
                Quên mật khẩu?
              </a>
            </div>

            {/* Main Button */}
            <button
              type="button"
              className="w-full bg-[#5655D6] hover:bg-[#4544b8] text-white py-4 rounded-full shadow-lg transform hover:-translate-y-1 transition-all duration-200 text-2xl font-lalezar tracking-wide mt-4"
            >
              Đăng nhập
            </button>

            {/* Social Login */}
            <div className="space-y-4 mt-6">
              <button
                type="button"
                className="w-full bg-[#D1D1D1] hover:bg-[#c1c1c1] text-gray-700 py-3 rounded-full flex items-center justify-center transition-all text-xl font-lalezar group relative"
              >
                <div className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                  {/* Google Icon */}
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                </div>
                <span className="pl-8">Đăng nhập với Google</span>
              </button>

              <button
                type="button"
                className="w-full bg-[#D1D1D1] hover:bg-[#c1c1c1] text-gray-700 py-3 rounded-full flex items-center justify-center transition-all text-xl font-lalezar group relative"
              >
                <div className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                  {/* Facebook Icon */}
                  <svg width="18" height="18" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </div>
                <span className="pl-8">Đăng nhập với Facebook</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Global Styles for Animations */}
      <style>{`
        @keyframes float {
            0% { transform: translateY(0) rotate(0deg); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateY(100px) rotate(180deg); opacity: 0; }
        }
        .animate-float { animation: float 6s linear infinite; }
      `}</style>
    </div>
  );
};

// Component Mây SVG để tái tạo style illustration của Figma
const CloudSVG = ({ size }: { size: number }) => (
  <svg width={size} height={size * 0.6} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.5 12C18.5 9.79086 16.7091 8 14.5 8C14.269 8 14.0436 8.01979 13.8249 8.058C13.4334 5.76709 11.4468 4 9 4C6.11586 4 3.75054 6.22941 3.52843 9.06253C1.54228 9.57946 0 11.4429 0 13.5C0 16.5376 2.46243 19 5.5 19H18.5C21.5376 19 24 16.5376 24 13.5C24 10.4624 21.5376 8 18.5 8V12Z" />
  </svg>
);

export default LoginPage;
