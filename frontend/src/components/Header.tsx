import React from "react";
import { Search, LogOut } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import logo from "../assets/logo.jpg";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth();

  // Nếu isActive là true, sẽ hiện chữ đậm và thanh hồng ở dưới
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-1 py-4 text-sm transition-colors ${
      isActive
        ? "font-bold border-b-2 border-primary text-primary" // Class khi đang chọn
        : "font-medium text-[#9a4c73] hover:text-primary"    // Class khi không chọn
    }`;

 return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-[#f3e7ed]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link className="flex items-center gap-2 hover:opacity-80 transition-opacity" to="/dashboard">
              <img
                src={logo}
                alt="Sakura Learn Logo"
                className="h-9 w-auto rounded-lg object-contain"
              />
              <span className="text-xl font-bold tracking-tight text-[#1b0d14]">NihonLet</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              {/* Lưu ý: Nếu Home và Flashcards dùng chung 1 link /dashboard, 
                  bạn nên cân nhắc đổi một trong hai sang link khác hoặc dùng logic so sánh pathname thủ công.
                  Ở đây tôi giả định bạn sẽ có các route riêng biệt cho mỗi tab. */}
              
              <NavLink to="/home" className={navLinkClass}>
                Home
              </NavLink>

              <NavLink to="/dashboard" className={navLinkClass}>
                Flashcards
              </NavLink>

              <NavLink to="/grammar-library" className={navLinkClass}>
                Grammar
              </NavLink>

              <NavLink to="/minigamehub" className={navLinkClass}>
                Games
              </NavLink>
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
              <div className="size-8 rounded-full border border-primary/20 bg-[#f3e7ed]"></div>
              {isAuthenticated && (
                <button
                  onClick={async () => {
                    await logout();
                    navigate("/login");
                  }}
                  className="flex items-center gap-1 text-[#9a4c73] hover:text-red-500 transition-colors text-sm font-bold"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
