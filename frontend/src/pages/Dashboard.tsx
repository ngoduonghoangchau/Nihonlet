import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/useRedux';
import Header from '../components/Header';
import { api } from '../api/axios'; 
import { 
  Layers, 
  Plus, 
  Flame, 
  BadgeCheck, 
  Wand2, 
  Zap, 
  Loader2, 
  Trash2, 
  Lock,
  X,
  AlertTriangle 
} from 'lucide-react';

// const DECK_IMAGES = [
//   "https://images.unsplash.com/photo-1583409209821-aa5dcdc23872?w=600&auto=format&fit=crop",
//   "https://plus.unsplash.com/premium_photo-1690749740487-01bbb8e51e71?q=80&w=765&auto=format&fit=crop",
//   "https://plus.unsplash.com/premium_photo-1661878091370-4ccb8763756a?q=80&w=1632&auto=format&fit=crop"
// ];

interface DeckItem {
  deckId: number;
  title: string;
  description?: string;
  cardsCount: number;
  masteryPercent: number;
  isBulkCreated: boolean;
  displayImage?: string; 
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  
  const { user } = useAppSelector((state) => state.auth);
  const isPremiumUser = user?.roles?.includes('Premium') || false;

  const [decks, setDecks] = useState<DeckItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // STATE QUẢN LÝ MODAL
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deckToDelete, setDeckToDelete] = useState<DeckItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const DECK_LIMIT = 10;
  const isLimitReached = !isPremiumUser && decks.length >= DECK_LIMIT;

  // Assign a stable image per deck using deckId as seed
// const fetchDecks = async () => {
//     try {
//       setLoading(true);
//       const response = await api.get('/Flashcards/decks');
      
//       // Kiểm tra: Nếu response.data.data tồn tại thì dùng nó, nếu không thì dùng response.data
//       const rawData = response.data.data || response.data;

//       // Bảo vệ code: Nếu vẫn không phải mảng thì gán mảng rỗng
//       const dataArray = Array.isArray(rawData) ? rawData : [];
      
//       const processedDecks = dataArray.map((deck: DeckItem) => ({
//         ...deck,
//         displayImage: DECK_IMAGES[deck.deckId % DECK_IMAGES.length]
//       }));

//       setDecks(processedDecks);
//     } catch (error) {
//       console.error("Lỗi lấy danh sách bộ thẻ:", error);
//     } finally {
//       setLoading(false);
//     }
//   };
const fetchDecks = async () => {
  try {
    setLoading(true);
    const response = await api.get('/Flashcards/decks');
    
    // Kiểm tra cấu trúc data (giả sử backend bọc trong .data)
    const rawData = response.data.data || response.data;
    const dataArray = Array.isArray(rawData) ? rawData : [];

    const processedDecks = dataArray.map((deck: DeckItem) => ({
      ...deck,
      // Sử dụng dịch vụ Picsum với seed là deckId
      // Mỗi deckId khác nhau sẽ ra 1 ảnh khác nhau, nhưng deckId cũ sẽ luôn ra ảnh cũ
      displayImage: `https://picsum.photos/seed/${deck.deckId}/600/400`
    }));

    setDecks(processedDecks);
  } catch (error) {
    console.error("Lỗi lấy danh sách bộ thẻ:", error);
  } finally {
    setLoading(false);
  }
};

  // 1. MỞ MODAL XÁC NHẬN XÓA
  const openDeleteModal = (deck: DeckItem, e: React.MouseEvent) => {
    e.stopPropagation(); 
    setDeckToDelete(deck);
    setIsDeleteModalOpen(true);
  };

  // 2. HÀM THỰC THI XÓA THẬT SỰ
  const confirmDelete = async () => {
    if (!deckToDelete) return;
    
    setIsDeleting(true);
    try {
      await api.delete(`/Flashcards/decks/${deckToDelete.deckId}`);
      setDecks(prev => prev.filter(d => d.deckId !== deckToDelete.deckId)); 
      setIsDeleteModalOpen(false);
      setDeckToDelete(null);
    } catch (error) {
      console.error("Lỗi khi xóa bộ thẻ.");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchDecks();
  }, []);

  const goToCreatePage = () => {
    if (isLimitReached) {
      setIsLimitModalOpen(true);
      return;
    }
    navigate('/create-flashcard');
  };

  return (
    <div className="bg-background-light font-display text-[#1b0d14] min-h-screen flex flex-col relative">
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
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold shadow-lg transition-all active:scale-95 bg-primary text-white hover:opacity-90`}
            >
              {isLimitReached ? <Lock size={20} /> : <Plus size={20} />}
              <span>{isLimitReached ? "Limit Reached" : "Create New Set"}</span>
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {[
                { label: 'Daily Streak', val: '14 Days', icon: Flame, color: 'text-primary' },
                { label: 'Total Cards', val: decks.reduce((acc, d) => acc + d.cardsCount, 0), icon: Layers, color: 'text-primary' },
                { label: 'Mastery Avg', val: decks.length > 0 ? `${Math.round(decks.reduce((acc, d) => acc + d.masteryPercent, 0) / decks.length)}%` : '0%', icon: BadgeCheck, color: 'text-green-500' },
                { label: 'Bulk Decks', val: decks.filter(d => d.isBulkCreated).length, icon: Wand2, color: 'text-blue-500' },
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
                        style={{ backgroundImage: `url(${deck.displayImage})` }}
                    >
                      {/* NÚT XÓA MỞ MODAL */}
                      <button 
                          onClick={(e) => openDeleteModal(deck, e)}
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
                      <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-md flex items-center gap-1.5 ${
                        deck.isBulkCreated ? 'bg-primary text-white' : 'bg-white/90 text-primary'
                      }`}>
                        {deck.isBulkCreated && <Zap size={10} fill="currentColor" />}
                        Mastered: {deck.masteryPercent}%
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-1 gap-4">
                      <div>
                        <h3 className="font-bold text-xl text-[#1b0d14] group-hover:text-primary transition-colors line-clamp-1">{deck.title}</h3>
                        <p className="text-[#9a4c73] text-sm mt-1">{deck.cardsCount} Cards • {deck.isBulkCreated ? 'Bulk' : 'Manual'}</p>
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

                {/* Add More Sets */}
                <div 
                    onClick={goToCreatePage}
                    className={`border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center p-10 gap-4 text-center group transition-all cursor-pointer min-h-[300px] 
                      ${isLimitReached 
                        ? 'border-gray-200 bg-gray-50/50 hover:border-primary/50' 
                        : 'border-[#f3e7ed] bg-[#fcf8fa]/50 hover:border-primary'}`}
                >
                  <div className={`size-14 rounded-full flex items-center justify-center transition-all shadow-sm
                    ${isLimitReached 
                      ? 'bg-gray-100 text-[#9a4c73]' 
                      : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white'}`}
                  >
                    {isLimitReached ? <Lock size={28} /> : <Plus size={28} />}
                  </div>
                  <div>
                    <h3 className={`font-bold text-lg ${isLimitReached ? 'text-[#9a4c73]' : 'text-[#1b0d14]'}`}>
                      {isLimitReached ? 'Limit Reached' : 'Add More Sets'}
                    </h3>
                    <p className="text-[#9a4c73] text-sm mt-1 max-w-[200px] mx-auto">
                      {isLimitReached 
                        ? 'Upgrade for more sets' 
                        : 'Tạo thêm bộ thẻ mới'}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      {/* MODAL 1: THÔNG BÁO GIỚI HẠN */}
      {isLimitModalOpen && (
        <div className="fixed inset-0 bg-[#1b0d14]/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 max-w-md w-full shadow-2xl relative animate-scaleIn border border-[#f3e7ed]">
            <button onClick={() => setIsLimitModalOpen(false)} className="absolute top-6 right-6 text-[#9a4c73] hover:text-primary transition-colors">
              <X size={24} />
            </button>
            <div className="flex flex-col items-center text-center">
              <div className="size-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mb-6"><Lock size={40} /></div>
              <h3 className="text-2xl font-black mb-4">Deck Limit Reached</h3>
              <p className="text-[#9a4c73] font-medium leading-relaxed mb-8">⚠️ Bạn đã đạt giới hạn 10 bộ thẻ cho tài khoản FREE. Vui lòng nâng cấp Premium để tiếp tục tạo không giới hạn!</p>
              <div className="flex flex-col gap-3 w-full">
                <button onClick={() => navigate('/pricing')} className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all">Upgrade to Premium</button>
                <button onClick={() => setIsLimitModalOpen(false)} className="w-full py-4 bg-[#f8f5f7] text-[#9a4c73] font-bold rounded-2xl hover:bg-[#f3e7ed] transition-all">Maybe later</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: XÁC NHẬN XÓA BỘ THẺ (MỚI) */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-[#1b0d14]/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 max-w-md w-full shadow-2xl relative animate-scaleIn border border-[#f3e7ed]">
            <div className="flex flex-col items-center text-center">
              {/* Icon cảnh báo */}
              <div className="size-20 rounded-3xl bg-red-50 flex items-center justify-center text-red-500 mb-6">
                <AlertTriangle size={40} />
              </div>

              <h3 className="text-2xl font-black mb-2 text-[#1b0d14]">Delete this deck?</h3>
              <p className="text-[#9a4c73] font-medium leading-relaxed mb-8 px-4">
                Bạn có chắc chắn muốn xóa bộ thẻ <span className="text-primary font-bold">"{deckToDelete?.title}"</span>? Hành động này không thể hoàn tác.
              </p>

              <div className="flex flex-col gap-3 w-full">
                <button 
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="w-full py-4 bg-red-500 text-white font-bold rounded-2xl shadow-lg shadow-red-200 hover:bg-red-600 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  {isDeleting ? <Loader2 className="animate-spin" size={20} /> : <Trash2 size={20} />}
                  Delete Permanently
                </button>
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={isDeleting}
                  className="w-full py-4 bg-[#f8f5f7] text-[#9a4c73] font-bold rounded-2xl hover:bg-[#f3e7ed] transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;