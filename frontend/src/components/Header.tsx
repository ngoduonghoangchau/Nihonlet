import React from "react";
import { Search, LogOut, Crown, Sparkles } from "lucide-react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import logo from "../assets/logo.jpg";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { logout, isAuthenticated, user } = useAuth();

  // Nếu isActive là true, sẽ hiện chữ đậm và thanh hồng ở dưới
  // const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  //   `px-1 py-4 text-sm transition-colors ${
  //     isActive
  //       ? "font-bold border-b-2 border-primary text-primary" // Class khi đang chọn
  //       : "font-medium text-[#9a4c73] hover:text-primary"    // Class khi không chọn
  //   }`;

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
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `px-1 py-4 text-sm font-medium transition-colors ${
                    isActive ? "text-primary border-b-2" : "text-[#9a4c73] hover:text-primary hover:border-b-2"
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/create-flashcard"
                className={({ isActive }) =>
                  `px-1 py-4 text-sm font-medium transition-colors ${
                    isActive ? "text-primary border-b-2" : "text-[#9a4c73] hover:text-primary hover:border-b-2"
                  }`
                }
              >
                Flashcards
              </NavLink>
              <NavLink
                to="/grammar-library"
                className={({ isActive }) =>
                  `px-1 py-4 text-sm font-medium transition-colors ${
                    isActive ? "text-primary border-b-2" : "text-[#9a4c73] hover:text-primary hover:border-b-2"
                  }`
                }
              >
                Grammar
              </NavLink>
              <NavLink
                to="/reading-level"
                className={({ isActive }) =>
                `px-1 py-4 text-sm font-medium transition-colors ${
                 isActive
                 ? "text-primary border-b-2"
                 : "text-[#9a4c73] hover:text-primary hover:border-b-2"
                  }`
                }
              >
              Reading
             </NavLink>

              <NavLink
                to="/minigamehub"
                className={({ isActive }) =>
                  `px-1 py-4 text-sm font-medium transition-colors ${
                    isActive ? "text-primary border-b-2" : "text-[#9a4c73] hover:text-primary hover:border-b-2"
                  }`
                }
              >
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
            {isAuthenticated &&
              (user?.isPremium ? (
                <Link
                  to="/subscription"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-xs font-bold shadow-sm hover:shadow-md transition-all hover:scale-[1.02]"
                >
                  <Crown size={14} />
                  Premium
                </Link>
              ) : (
                <Link
                  to="/pricing"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold hover:bg-primary hover:text-white transition-all"
                >
                  <Sparkles size={14} />
                  Upgrade
                </Link>
              ))}
            <div className="h-6 w-[1px] bg-[#f3e7ed] mx-1"></div>
            <div className="flex items-center gap-3">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt="User Avatar"
                  className="size-8 rounded-full border border-primary/20 bg-[#f3e7ed] object-cover"
                />
              ) : (
                <div className="size-8 rounded-full border border-primary/20 bg-[#f3e7ed]"></div>
              )}
              {isAuthenticated && (
                <button
                  onClick={async () => {
                    await logout();
                    navigate("/login");
                  }}
                  className="flex items-center gap-1 text-[#9a4c73] hover:text-red-500 transition-colors text-sm font-bold cursor-pointer"
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
