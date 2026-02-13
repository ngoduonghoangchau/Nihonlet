import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks/useRedux";
import Header from "../components/Header";
import { api } from "../api/axios";
import { Layers, Plus, Flame, BadgeCheck, Wand2, Zap, Loader2, Trash2, Lock } from "lucide-react";

const DECK_IMAGES = [
  "https://images.unsplash.com/photo-1583409209821-aa5dcdc23872?w=600&auto=format&fit=crop",
  "https://plus.unsplash.com/premium_photo-1690749740487-01bbb8e51e71?q=80&w=765&auto=format&fit=crop",
  "https://plus.unsplash.com/premium_photo-1661878091370-4ccb8763756a?q=80&w=1632&auto=format&fit=crop",
];

interface DeckItem {
  deckId: number;
  title: string;
  description?: string;
  cardsCount: number;
  masteryPercent: number;
  isBulkCreated: boolean;
  displayImage?: string; // Thêm trường này để lưu ảnh ngẫu nhiên
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const { user } = useAppSelector((state) => state.auth);
  const isPremiumUser = user?.roles?.includes("Premium") || false;

  const [decks, setDecks] = useState<DeckItem[]>([]);
  const [loading, setLoading] = useState(true);

  const DECK_LIMIT = 10;
  const isLimitReached = !isPremiumUser && decks.length >= DECK_LIMIT;

  // Assign a stable image per deck using deckId as seed
  const fetchDecks = async () => {
    try {
      setLoading(true);
      const response = await api.get("/Flashcards/decks");
      console.log(response);
      const processedDecks = response.data.data.map((deck: DeckItem) => ({
        ...deck,
        displayImage: DECK_IMAGES[deck.deckId % DECK_IMAGES.length],
      }));

      setDecks(processedDecks);
    } catch (error) {
      console.error("Lỗi lấy danh sách bộ thẻ:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDeck = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Bạn có muốn xóa bộ thẻ này không?")) {
      try {
        await api.delete(`/Flashcards/decks/${id}`);
        setDecks((prev) => prev.filter((d) => d.deckId !== id));
      } catch (error) {
        alert("Lỗi khi xóa bộ thẻ.");
      }
    }
  };

  useEffect(() => {
    fetchDecks();
  }, []);

  const goToCreatePage = () => {
    if (isLimitReached) {
      alert(
        "⚠️ Bạn đã đạt giới hạn 10 bộ thẻ cho tài khoản FREE. Vui lòng nâng cấp Premium để tiếp tục tạo không giới hạn!",
      );
      return;
    }
    navigate("/create-flashcard");
  };

  return (
    <div className="bg-background-light font-display text-[#1b0d14] min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-64 flex-col gap-6 py-8 pr-8 animate-fadeIn">
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-bold text-[#9a4c73] px-3 uppercase tracking-widest mb-1">Library</h3>
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#f3e7ed] text-primary font-bold cursor-pointer">
              <Layers size={20} />
              <span className="text-sm">All Flashcards</span>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 py-8 px-4 sm:px-6 lg:px-0">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div className="flex flex-col gap-1">
              <h2 className="text-3xl font-black tracking-tight text-[#1b0d14]">Flashcard Library</h2>
              <p className="text-[#9a4c73] text-base font-medium">
                {isLimitReached
                  ? "Bạn đã đạt tối đa giới hạn bộ thẻ cho phép."
                  : `Bạn đang có ${decks.length} bộ thẻ. Tiếp tục cố gắng nhé!`}
              </p>
            </div>

            <button
              onClick={goToCreatePage}
              disabled={isLimitReached}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold shadow-lg transition-all active:scale-95 ${
                isLimitReached ? "bg-gray-400 cursor-not-allowed" : "bg-primary text-white hover:opacity-90"
              }`}
            >
              {isLimitReached ? <Lock size={20} /> : <Plus size={20} />}
              <span>{isLimitReached ? "Limit Reached" : "Create New Set"}</span>
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { label: "Daily Streak", val: "14 Days", icon: Flame, color: "text-primary" },
              {
                label: "Total Cards",
                val: decks.reduce((acc, d) => acc + d.cardsCount, 0),
                icon: Layers,
                color: "text-primary",
              },
              {
                label: "Mastery Avg",
                val:
                  decks.length > 0
                    ? `${Math.round(decks.reduce((acc, d) => acc + d.masteryPercent, 0) / decks.length)}%`
                    : "0%",
                icon: BadgeCheck,
                color: "text-green-500",
              },
              {
                label: "Bulk Decks",
                val: decks.filter((d) => d.isBulkCreated).length,
                icon: Wand2,
                color: "text-blue-500",
              },
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
            {loading ? (
              <div className="col-span-full py-20 flex justify-center">
                <Loader2 className="animate-spin text-primary" size={40} />
              </div>
            ) : (
              <>
                {decks.map((deck) => (
                  <div
                    key={deck.deckId}
                    onClick={() => navigate(`/study-session/${deck.deckId}`)}
                    className="bg-white rounded-[2rem] border border-[#f3e7ed] overflow-hidden hover:shadow-xl transition-all group cursor-pointer flex flex-col relative"
                  >
                    <div
                      className="relative h-44 w-full bg-center bg-cover"
                      // 3. SỬ DỤNG ẢNH ĐÃ GÁN NGẪU NHIÊN
                      style={{ backgroundImage: `url(${deck.displayImage})` }}
                    >
                      <button
                        onClick={(e) => handleDeleteDeck(deck.deckId, e)}
                        className="absolute top-4 left-4 p-2.5 
                                    bg-white/90 text-primary         
                                    rounded-xl shadow-sm z-20
                                    opacity-0 group-hover:opacity-100
                                    hover:bg-primary hover:text-white  
                                    transition-all duration-300 active:scale-90"
                        title="Xóa bộ thẻ"
                      >
                        <Trash2 size={18} />
                      </button>
                      <div
                        className={`absolute top-4 right-4 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-md flex items-center gap-1.5 ${
                          deck.isBulkCreated ? "bg-primary text-white" : "bg-white/90 text-primary"
                        }`}
                      >
                        {deck.isBulkCreated && <Zap size={10} fill="currentColor" />}
                        Mastered: {deck.masteryPercent}%
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-1 gap-4">
                      <div>
                        <h3 className="font-bold text-xl text-[#1b0d14] group-hover:text-primary transition-colors line-clamp-1">
                          {deck.title}
                        </h3>
                        <p className="text-[#9a4c73] text-sm mt-1">
                          {deck.cardsCount} Cards • {deck.isBulkCreated ? "Bulk" : "Manual"}
                        </p>
                      </div>

                      <div className="w-full bg-[#f3e7ed] h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-primary h-full rounded-full transition-all duration-700"
                          style={{ width: `${deck.masteryPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {/* ---  NÚT ADD MORE SETS --- */}
                <div
                  onClick={goToCreatePage}
                  className={`border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center p-10 gap-4 text-center group transition-all cursor-pointer min-h-[300px] 
                      ${
                        isLimitReached
                          ? "border-gray-200 bg-gray-50/50 cursor-not-allowed opacity-70"
                          : "border-[#f3e7ed] bg-[#fcf8fa]/50 hover:border-primary"
                      }`}
                >
                  <div
                    className={`size-14 rounded-full flex items-center justify-center transition-all shadow-sm
                    ${
                      isLimitReached
                        ? "bg-gray-200 text-gray-400"
                        : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white"
                    }`}
                  >
                    {isLimitReached ? <Lock size={28} /> : <Plus size={28} />}
                  </div>
                  <div>
                    <h3 className={`font-bold text-lg ${isLimitReached ? "text-gray-400" : "text-[#1b0d14]"}`}>
                      {isLimitReached ? "Deck Limit Reached" : "Add More Sets"}
                    </h3>
                    <p className="text-[#9a4c73] text-sm mt-1 max-w-[200px] mx-auto">
                      {isLimitReached ? "Upgrade to Premium for unlimited decks" : "Tạo thêm bộ thẻ mới"}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
