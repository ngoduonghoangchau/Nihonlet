import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/useRedux';
import Header from '../components/Header';
import { api } from '../api/axios'; 
import { AxiosError } from 'axios';
import { 
  Save, 
  Trash2, 
  Plus, 
  ChevronRight, 
  LayoutList, 
  Loader2, 
  AlertCircle,
  CheckCircle2,
  Lock,
  ArrowLeft,
  AlertTriangle, // Thêm icon cảnh báo
  X
} from 'lucide-react';

interface CardItem {
  reading: string;
  kanji: string;
  meaning: string;
  exampleSentence: string;
}

const CreateFlashcard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const isPremiumUser = user?.roles?.includes('Premium') || false;

  // --- STATE DỮ LIỆU ---
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [bulkText, setBulkText] = useState(''); 
  const [delimiter, setDelimiter] = useState('\t');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // STATE KIỂM TRA QUYỀN VÀ MODAL
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAccessLimitModalOpen, setIsAccessLimitModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isNoCardsModalOpen, setIsNoCardsModalOpen] = useState(false); // Modal cho lỗi trống thẻ
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [bulkCards, setBulkCards] = useState<CardItem[]>([]);
  const [manualCards, setManualCards] = useState<CardItem[]>([]);

  // 1. KIỂM TRA GIỚI HẠN KHI VÀO TRANG
  useEffect(() => {
    const verifyAccess = async () => {
      if (isPremiumUser) {
        setIsVerifying(false);
        return;
      }
      try {
        const response = await api.get('/Flashcards/decks');
        if (response.data.length >= 10) {
          setIsAccessLimitModalOpen(true);
        } else {
          setIsVerifying(false);
        }
      } catch (error) {
        console.error("Lỗi xác thực:", error);
        navigate('/dashboard');
      }
    };
    verifyAccess();
  }, [isPremiumUser, navigate]);

  // 2. XỬ LÝ PARSE DỮ LIỆU BULK
  useEffect(() => {
    if (!isPremiumUser || !bulkText.trim()) {
      setBulkCards([]);
      return;
    }
    const lines = bulkText.split('\n').filter(line => line.trim() !== '');
    const parsed = lines.map(line => {
      const parts = line.split(delimiter);
      return {
        reading: parts[0]?.trim() || '',
        kanji: parts[1]?.trim() || '',
        meaning: parts[2]?.trim() || '',
        exampleSentence: parts[3]?.trim() || '',
      };
    });
    setBulkCards(parsed);
    setErrors(prev => {
        const newErrs = { ...prev };
        Object.keys(newErrs).forEach(key => {
            if (key.includes('-reading') || key.includes('-meaning')) delete newErrs[key];
        });
        return newErrs;
    });
  }, [bulkText, delimiter, isPremiumUser]);

  const allCards = useMemo(() => [...bulkCards, ...manualCards], [bulkCards, manualCards]);

  const handleBulkChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBulkText(e.target.value);
  };

  const clearError = (fieldKey: string) => {
    if (errors[fieldKey]) {
      setErrors(prev => {
        const newErrs = { ...prev };
        delete newErrs[fieldKey];
        return newErrs;
      });
    }
  };

  const updateCardField = (index: number, field: keyof CardItem, value: string) => {
    clearError(`${index}-${field}`);
    if (index < bulkCards.length) {
      const updated = [...bulkCards];
      updated[index] = { ...updated[index], [field]: value };
      setBulkCards(updated);
    } else {
      const manualIdx = index - bulkCards.length;
      const updated = [...manualCards];
      updated[manualIdx] = { ...updated[manualIdx], [field]: value };
      setManualCards(updated);
    }
  };

  const removeCard = (index: number) => {
    if (index < bulkCards.length) {
      setBulkCards(bulkCards.filter((_, i) => i !== index));
    } else {
      const manualIdx = index - bulkCards.length;
      setManualCards(manualCards.filter((_, i) => i !== manualIdx));
    }
  };

  const addManualCard = () => {
    setManualCards([...manualCards, { reading: '', kanji: '', meaning: '', exampleSentence: '' }]);
  };

  // 3. HÀM LƯU BỘ THẺ
  const handleSaveDeck = async () => {
    const newErrors: Record<string, string> = {};
    if (title.trim().length < 3) newErrors.title = "Tên bộ thẻ phải từ 3 ký tự trở lên.";
    
    // THAY THẾ ALERT BẰNG MODAL
    if (allCards.length === 0) { 
      setIsNoCardsModalOpen(true); 
      return; 
    }

    allCards.forEach((card, index) => {
      if (!card.reading.trim()) newErrors[`${index}-reading`] = "Không được để trống.";
      if (!card.meaning.trim()) newErrors[`${index}-meaning`] = "Không được để trống.";
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 0 });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        description: description?.trim(),
        isBulkCreated: isPremiumUser && bulkText.trim().length > 0, 
        cards: allCards.map(c => ({
          reading: c.reading.trim(),
          kanji: c.kanji?.trim() || null,
          meaning: c.meaning.trim(),
          exampleSentence: c.exampleSentence?.trim() || null
        }))
      };

      const response = await api.post('/Flashcards/decks', payload);
      if (response.status === 200 || response.status === 201) {
        setIsSuccessModalOpen(true);
      }
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      // Bạn có thể cân nhắc dùng Modal lỗi ở đây sau này nếu muốn
      alert(error.response?.data?.message || "Lỗi lưu bộ thẻ.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isVerifying && !isAccessLimitModalOpen) {
    return (
      <div className="bg-[#fcf8fa] min-h-screen flex flex-col items-center justify-center font-display">
        <Loader2 className="animate-spin text-primary size-10" />
      </div>
    );
  }

  return (
    <div className="bg-[#fcf8fa] min-h-screen flex flex-col text-[#1b0d14] font-display relative">
      <Header />
      
      <main className="flex-grow max-w-[1000px] w-full mx-auto px-6 py-10 animate-fadeIn space-y-12">
        <section>
          <nav className="flex items-center gap-2 text-xs font-bold text-primary mb-4 uppercase tracking-widest">
            <span className='cursor-pointer' onClick={() => navigate('/dashboard')}>Decks</span>
            <ChevronRight size={14} />
            <span className="opacity-60">Create New Set</span>
          </nav>
          <h1 className="text-4xl font-black tracking-tight mb-2">Advanced Flashcard Creator</h1>
          <p className="text-[#9a4c73] text-lg font-medium">Xây dựng bộ thẻ tiếng Nhật nhanh chóng và hiệu quả.</p>
        </section>

        {/* Section 1: Meta */}
        <section className="bg-white rounded-3xl p-8 shadow-sm border border-[#f3e7ed] space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold ml-1">Deck Title <span className='text-red-400'>*</span></label>
              <input 
                value={title}
                onChange={(e) => { setTitle(e.target.value); clearError('title'); }}
                className={`w-full h-12 px-5 rounded-xl bg-[#f8f5f7] border-2 transition-all outline-none focus:ring-2 focus:ring-primary/20 
                    ${errors.title ? 'border-red-500' : 'border-transparent'}`} 
                placeholder="Ví dụ: JLPT N5 - Bài 1" 
              />
              {errors.title && <p className="text-red-500 text-xs font-bold ml-1">{errors.title}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold ml-1">Category / Tags</label>
              <input className="w-full h-12 px-5 rounded-xl bg-[#f8f5f7] border-none focus:ring-2 focus:ring-primary/20 transition-all outline-none" placeholder="Japanese, JLPT N5" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold ml-1">Description (Optional)</label>
            <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                className="w-full min-h-[100px] p-5 rounded-xl bg-[#f8f5f7] border-none outline-none resize-none" 
                placeholder="Mô tả bộ thẻ..." 
            />
          </div>
        </section>

        {/* Section 2: Bulk Creation */}
        <section className="bg-white rounded-3xl p-8 shadow-sm border border-[#f3e7ed] relative">
          {!isPremiumUser && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 rounded-3xl flex items-center justify-center p-10 text-center">
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-primary/20 max-w-sm scale-110">
                    <AlertCircle className="mx-auto text-primary mb-4" size={40} />
                    <h4 className="font-bold text-lg mb-2">Tính năng Premium</h4>
                    <p className="text-sm text-[#9a4c73] mb-6 font-medium">Nâng cấp Premium để sử dụng tính năng nhập dữ liệu hàng loạt.</p>
                    <button onClick={() => navigate('/pricing')} className="bg-primary text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg">Nâng cấp ngay</button>
                </div>
            </div>
          )}
          <div className="flex items-center gap-3 mb-8">
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><LayoutList size={22} /></div>
            <h3 className="text-2xl font-black">Bulk Creation</h3>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <textarea 
                value={bulkText}
                onChange={handleBulkChange}
                disabled={!isPremiumUser}
                placeholder="Nhập: Reading [TAB] Kanji [TAB] Meaning [TAB] Example..."
                className="w-full min-h-[250px] p-6 rounded-2xl bg-[#f8f5f7] border-none font-mono text-sm outline-none leading-relaxed" 
              />
            </div>
            <div className="lg:col-span-4 space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-wider text-primary">Dấu phân cách</label>
                <div className="flex gap-2">
                  <button onClick={() => setDelimiter('\t')} className={`flex-1 py-2 rounded-lg text-xs font-bold border-2 ${delimiter === '\t' ? 'border-primary text-primary' : 'bg-gray-50 border-transparent'}`}>Tab</button>
                  <button onClick={() => setDelimiter(',')} className={`flex-1 py-2 rounded-lg text-xs font-bold border-2 ${delimiter === ',' ? 'border-primary text-primary' : 'bg-gray-50 border-transparent'}`}>Phẩy</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: List Cards */}
        <section className="space-y-6 pb-24">
          <h3 className="text-2xl font-black">Danh sách thẻ ({allCards.length})</h3>
          <div className="space-y-4">
            {allCards.map((card, i) => (
              <div key={i} className="bg-white rounded-3xl p-8 shadow-sm border border-[#f3e7ed] flex gap-8 relative group">
                <span className="text-gray-200 font-black text-2xl absolute left-6 top-8">{i + 1}</span>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 ml-8">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-primary tracking-widest">Hiragana/Katakana *</label>
                    <input 
                        value={card.reading} 
                        onChange={(e) => updateCardField(i, 'reading', e.target.value)} 
                        className={`w-full h-11 px-5 rounded-xl bg-[#f8f5f7] border-2 outline-none ${errors[`${i}-reading`] ? 'border-red-500' : 'border-transparent'}`} 
                    />
                    {errors[`${i}-reading`] && <p className="text-red-500 text-[10px] font-bold ml-1">{errors[`${i}-reading`]}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-primary tracking-widest">Kanji</label>
                    <input value={card.kanji} onChange={(e) => updateCardField(i, 'kanji', e.target.value)} className="w-full h-11 px-5 rounded-xl bg-[#f8f5f7] border-none focus:ring-1 focus:ring-primary/30 outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-primary tracking-widest">Meaning *</label>
                    <input 
                        value={card.meaning} 
                        onChange={(e) => updateCardField(i, 'meaning', e.target.value)} 
                        className={`w-full h-11 px-5 rounded-xl bg-[#f8f5f7] border-2 outline-none ${errors[`${i}-meaning`] ? 'border-red-500' : 'border-transparent'}`} 
                    />
                    {errors[`${i}-meaning`] && <p className="text-red-500 text-[10px] font-bold ml-1">{errors[`${i}-meaning`]}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-primary tracking-widest text-[#9a4c73]/60">Example Sentence</label>
                    <input 
                        value={card.exampleSentence} 
                        onChange={(e) => updateCardField(i, 'exampleSentence', e.target.value)} 
                        className="w-full h-11 px-5 rounded-xl bg-[#f8f5f7] border-none focus:ring-1 focus:ring-primary/30 outline-none" 
                    />
                  </div>
                </div>
                <button onClick={() => removeCard(i)} className="text-gray-300 hover:text-red-500 mt-2 transition-colors"><Trash2 size={20} /></button>
              </div>
            ))}
          </div>
          <button onClick={addManualCard} className="w-full py-8 rounded-[2rem] border-2 border-dashed border-pink-200 bg-white flex flex-col items-center justify-center gap-2 hover:bg-primary/5 transition-all outline-none">
            <Plus className="text-primary" size={32} />
            <span className="font-bold text-primary text-sm uppercase">Thêm thẻ thủ công</span>
          </button>
        </section>
      </main>

      {/* FOOTER ACTIONS */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 border-t border-[#f3e7ed] px-6 py-5 flex items-center justify-between z-40 backdrop-blur-md">
          <button onClick={() => navigate('/dashboard')} className="text-sm font-bold text-[#9a4c73] hover:text-primary transition-colors">Hủy bỏ</button>
          <button onClick={handleSaveDeck} disabled={isSubmitting} className="px-12 py-4 rounded-xl bg-primary text-white font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all">
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} 
            Lưu bộ thẻ
          </button>
      </div>

      {/* MODAL 1: CHẶN TRUY CẬP (Khi đủ 10 bộ thẻ) */}
      {isAccessLimitModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#1b0d14]/40 backdrop-blur-sm" />
          <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl relative text-center">
              <div className="size-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-6">
                <Lock size={40} />
              </div>
              <h3 className="text-2xl font-black mb-4 text-[#1b0d14]">Deck Limit Reached</h3>
              <p className="text-[#9a4c73] font-medium leading-relaxed mb-8">
                ⚠️ Bạn đã đạt giới hạn 10 bộ thẻ cho tài khoản FREE. Vui lòng nâng cấp Premium để tiếp tục tạo không giới hạn!
              </p>
              <div className="flex flex-col gap-3">
                <button onClick={() => navigate('/pricing')} className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-lg">Upgrade to Premium</button>
                <button onClick={() => navigate(-1)} className="w-full py-4 bg-[#f8f5f7] text-[#9a4c73] font-bold rounded-2xl flex items-center justify-center gap-2">
                  <ArrowLeft size={18} /> Quay lại
                </button>
              </div>
          </div>
        </div>
      )}

      {/* MODAL 2: THÀNH CÔNG */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#1b0d14]/40 backdrop-blur-sm" />
          <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl relative text-center">
              <CheckCircle2 className="mx-auto text-green-500 mb-6" size={60} />
              <h3 className="text-2xl font-black mb-2 text-[#1b0d14]">Thành công!</h3>
              <p className="text-[#9a4c73] font-medium leading-relaxed mb-8">Bộ thẻ của bạn đã được tạo và lưu trữ thành công vào thư viện.</p>
              <button onClick={() => navigate('/dashboard')} className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-lg">Về Dashboard</button>
          </div>
        </div>
      )}

      {/* MODAL 3: CẢNH BÁO TRỐNG THẺ (MỚI) */}
      {isNoCardsModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#1b0d14]/40 backdrop-blur-sm" />
          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 max-w-sm w-full shadow-2xl relative border border-[#f3e7ed] text-center z-10">
            <button 
              onClick={() => setIsNoCardsModalOpen(false)}
              className="absolute top-6 right-6 text-[#9a4c73] hover:text-primary transition-colors"
            >
              <X size={24} />
            </button>
            <div className="flex flex-col items-center">
              <div className="size-20 rounded-3xl bg-red-50 flex items-center justify-center text-red-500 mb-6">
                <AlertTriangle size={40} />
              </div>
              <h3 className="text-2xl font-black mb-4 text-[#1b0d14]">Missing Content</h3>
              <p className="text-[#9a4c73] font-medium leading-relaxed mb-8 px-4">
                Vui lòng thêm ít nhất một thẻ để lưu bộ thẻ.
              </p>
              <button 
                onClick={() => setIsNoCardsModalOpen(false)}
                className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateFlashcard;