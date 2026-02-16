import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { api } from "../api/axios";

import {
  Sparkles,
  CheckCircle2,
  Lightbulb,
  Shuffle,
  Trophy,
  RefreshCcw,
  ArrowLeft,
  Loader2,
  XCircle,
} from "lucide-react";

interface CardTile {
  id: string;
  cardId: number;
  text: string;
  lang: "JAPANESE" | "VIETNAMESE";
  status: "default" | "selected" | "matched" | "correct" | "wrong"; // Thêm correct và wrong
}

const MatchingGame1: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const gameConfig = location.state as { selectedDeckIds: number[]; wordCount: number };

  const [tiles, setTiles] = useState<CardTile[]>([]);
  const [firstSelection, setFirstSelection] = useState<CardTile | null>(null);
  const [secondSelection, setSecondSelection] = useState<CardTile | null>(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  const initGame = useCallback(async () => {
    if (!gameConfig) {
      navigate("/minigameSelect");
      return;
    }
    try {
      setLoading(true);
      const res = await api.post("/Gamification/get-cards", {
        deckIds: gameConfig.selectedDeckIds,
        limit: gameConfig.wordCount,
      });

      const rawData = res.data.data || res.data;

      // Kiểm tra chắc chắn nó là mảng trước khi dùng forEach
      if (!Array.isArray(rawData)) {
        console.error("Dữ liệu trả về không phải là mảng:", rawData);
        setTiles([]);
        return;
      }

      const newTiles: CardTile[] = [];
      rawData.forEach((card: any) => {
        newTiles.push({
          id: `jp-${card.cardId}`,
          cardId: card.cardId,
          text: card.kanji,
          lang: "JAPANESE",
          status: "default",
        });
        newTiles.push({
          id: `vn-${card.cardId}`,
          cardId: card.cardId,
          text: card.meaning,
          lang: "VIETNAMESE",
          status: "default",
        });
      });
      // --------------------

      setTiles(newTiles.sort(() => Math.random() - 0.5));
      setScore(0);
    } catch (error) {
      console.error("Lỗi khởi tạo game:", error);
    } finally {
      setLoading(false);
    }
  }, [gameConfig, navigate]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleCardClick = (tile: CardTile) => {
    // Không cho phép click nếu đang xử lý cặp thứ 2 hoặc thẻ đã matched/correct
    if (tile.status === "matched" || tile.status === "selected" || tile.status === "correct" || secondSelection) return;

    setTiles((prev) => prev.map((t) => (t.id === tile.id ? { ...t, status: "selected" } : t)));

    if (!firstSelection) {
      setFirstSelection(tile);
    } else {
      setSecondSelection(tile);
      checkMatch(firstSelection, tile);
    }
  };

  const checkMatch = (card1: CardTile, card2: CardTile) => {
    const ids = [card1.id, card2.id];

    if (card1.cardId === card2.cardId) {
      // --- ĐÚNG: TÔ XANH ---
      setTiles((prev) => prev.map((t) => (ids.includes(t.id) ? { ...t, status: "correct" } : t)));

      setTimeout(() => {
        setTiles((prev) => prev.map((t) => (t.cardId === card1.cardId ? { ...t, status: "matched" } : t)));
        setScore((s) => s + 100);
        setFirstSelection(null);
        setSecondSelection(null);
      }, 600); // Đợi 0.6s để người dùng thấy màu xanh
    } else {
      // --- SAI: TÔ ĐỎ ---
      setTiles((prev) => prev.map((t) => (ids.includes(t.id) ? { ...t, status: "wrong" } : t)));

      setTimeout(() => {
        setTiles((prev) => prev.map((t) => (ids.includes(t.id) ? { ...t, status: "default" } : t)));
        setFirstSelection(null);
        setSecondSelection(null);
      }, 1000); // Đợi 1s để người dùng thấy màu đỏ và ghi nhớ
    }
  };

  useEffect(() => {
    if (tiles.length > 0 && tiles.every((t) => t.status === "matched")) {
      handleGameWin();
    }
  }, [tiles]);

  const handleGameWin = async () => {
    const finalScore = score + 500;
    const totalPairs = tiles.length / 2;
    const uniqueCards = tiles.reduce((acc: any[], current) => {
      if (current.lang === "JAPANESE") {
        const pair = tiles.find((t) => t.cardId === current.cardId && t.lang === "VIETNAMESE");
        acc.push({ ja: current.text, vi: pair?.text || "" });
      }
      return acc;
    }, []);

    try {
      await api.post("/Gamification/save-session", {
        wordCount: gameConfig.wordCount,
        selectedDecksJson: JSON.stringify(gameConfig.selectedDeckIds),
        totalScore: finalScore,
        accuracy: 100,
      });
    } catch (e) {
      console.error("Lưu kết quả thất bại", e);
    }

    navigate("/matching-results", {
      state: {
        score: finalScore,
        pairsMatched: totalPairs,
        totalPairs: totalPairs,
        reviewData: uniqueCards,
        gameConfig: gameConfig,
      },
    });
  };

  const matchedCount = tiles.filter((t) => t.status === "matched").length;
  const progress = tiles.length > 0 ? (matchedCount / tiles.length) * 100 : 0;

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcf8fa]">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );

  return (
    <div className="bg-[#fcf8fa] min-h-screen text-[#1b0d14] font-display">
      <Header />
      <main className="max-w-[1000px] mx-auto px-4 py-8 animate-fadeIn">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-[#9a4c73] font-bold hover:text-primary transition-colors"
        >
          <ArrowLeft size={20} /> Quit Game
        </button>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-6 border border-[#f3e7ed] shadow-sm">
            <div className="flex items-center gap-2 text-[#9a4c73] mb-1">
              <Sparkles size={16} className="text-primary" />
              <p className="text-xs font-bold uppercase tracking-wider">Score</p>
            </div>
            <p className="text-4xl font-black text-primary">{score}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-[#f3e7ed] shadow-sm">
            <div className="flex items-center gap-2 text-[#9a4c73] mb-1">
              <CheckCircle2 size={16} className="text-primary" />
              <p className="text-xs font-bold uppercase tracking-wider">Matched</p>
            </div>
            <p className="text-4xl font-black">
              {matchedCount / 2} / {tiles.length / 2}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#f3e7ed] shadow-sm mb-8">
          <div className="flex justify-between items-end mb-3">
            <p className="font-bold">Progress</p>
            <p className="text-primary font-black">{Math.round(progress)}%</p>
          </div>
          <div className="rounded-full bg-[#f3e7ed] h-3.5 overflow-hidden">
            <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {tiles.map((tile) => {
            const isMatched = tile.status === "matched";
            const isSelected = tile.status === "selected";
            const isCorrect = tile.status === "correct";
            const isWrong = tile.status === "wrong";

            return (
              <div
                key={tile.id}
                onClick={() => handleCardClick(tile)}
                className={`
                  relative aspect-square rounded-[2rem] flex flex-col items-center justify-center p-4 text-center transition-all duration-300 cursor-pointer shadow-sm
                  ${isMatched ? "bg-gray-100 opacity-0 pointer-events-none scale-90" : "bg-white border-2 border-[#f3e7ed]"}
                  ${isSelected ? "bg-[#fef1f7] border-primary scale-105 shadow-xl z-10" : "hover:border-primary/40 hover:-translate-y-1"}
                  ${isCorrect ? "bg-green-50 border-green-500 scale-105 z-10 border-[3px]" : ""}
                  ${isWrong ? "bg-red-50 border-red-500 scale-105 z-10 border-[3px]" : ""}
                `}
              >
                <h3
                  className={`
                  font-black mb-1 transition-colors duration-300
                  ${tile.text.length > 6 ? "text-xl" : "text-3xl"} 
                  ${isSelected ? "text-primary" : ""}
                  ${isCorrect ? "text-green-600" : ""}
                  ${isWrong ? "text-red-600" : ""}
                `}
                >
                  {tile.text}
                </h3>

                <span
                  className={`
                  text-[10px] font-black uppercase tracking-widest transition-colors duration-300
                  ${isSelected ? "text-primary" : "text-[#9a4c73]/40"}
                  ${isCorrect ? "text-green-500" : ""}
                  ${isWrong ? "text-red-500" : ""}
                `}
                >
                  {isCorrect ? "CORRECT" : isWrong ? "WRONG" : tile.lang}
                </span>

                {/* Thêm Icon phản hồi nhỏ */}
                {isCorrect && (
                  <CheckCircle2 className="absolute top-4 right-4 text-green-500 animate-bounce" size={20} />
                )}
                {isWrong && <XCircle className="absolute top-4 right-4 text-red-500 animate-shake" size={20} />}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default MatchingGame1;
