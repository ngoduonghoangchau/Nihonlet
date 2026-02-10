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
  AlertCircle 
} from 'lucide-react';

interface CardItem {
  reading: string;
  kanji: string;
  meaning: string;
  exampleSentence: string;
  isManual?: boolean; // phân biệt manual và bulk
}

const CreateFlashcard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const isPremiumUser = user?.roles?.includes('Premium') || false;

  // --- STATE ---
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [bulkText, setBulkText] = useState(''); 
  const [delimiter, setDelimiter] = useState('\t');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tách biệt thẻ Bulk và thẻ Manual để tránh bị ghi đè 
  const [bulkCards, setBulkCards] = useState<CardItem[]>([]);
  const [manualCards, setManualCards] = useState<CardItem[]>([]);

 
  useEffect(() => {
    if (!isPremiumUser || !bulkText.trim()) {
      setBulkCards([]);
      return;
    }

    const lines = bulkText.split('\n').filter(line => line.trim() !== '');
    const parsed = lines.map(line => {
      // Logic split an toàn hơn cho dấu phẩy
      const parts = line.split(delimiter);
      return {
        reading: parts[0]?.trim() || '',
        kanji: parts[1]?.trim() || '',
        meaning: parts[2]?.trim() || '',
        exampleSentence: parts[3]?.trim() || '',
        isManual: false
      };
    });
    setBulkCards(parsed);
  }, [bulkText, delimiter, isPremiumUser]);

  // Gộp cả 2 nguồn dữ liệu để hiển thị và lưu
  const allCards = useMemo(() => [...bulkCards, ...manualCards], [bulkCards, manualCards]);

  const handleBulkChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBulkText(e.target.value);
  };

  // Cập nhật thẻ khi người dùng sửa trực tiếp ở list bên dưới
  const updateCardField = (index: number, field: keyof CardItem, value: string) => {
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
    setManualCards([...manualCards, { reading: '', kanji: '', meaning: '', exampleSentence: '', isManual: true }]);
  };

  // --- HÀM LƯU BỘ THẺ ---
  const handleSaveDeck = async () => {
    if (title.trim().length < 3) {
      alert("Tên bộ thẻ phải từ 3 ký tự trở lên.");
      return;
    }

    if (allCards.length === 0) {
      alert("Vui lòng thêm ít nhất một thẻ.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        description: description?.trim(),
        // Chỉ đánh dấu là Bulk nếu thực sự có dùng ô bulkText
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
        alert("🎉 Tạo bộ thẻ thành công!");
        navigate('/dashboard');
      }
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      alert(error.response?.data?.message || "Lỗi lưu bộ thẻ.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#fcf8fa] min-h-screen flex flex-col text-[#1b0d14] font-display">
      <Header />
      
      <main className="flex-grow max-w-[1000px] w-full mx-auto px-6 py-10 animate-fadeIn space-y-12">
        
        {/* Breadcrumbs */}
        <section>
          <nav className="flex items-center gap-2 text-xs font-bold text-primary mb-4 uppercase tracking-widest">
            <span className='cursor-pointer hover:underline' onClick={() => navigate('/dashboard')}>Decks</span>
            <ChevronRight size={14} />
            <span className="opacity-60">Create New Set</span>
          </nav>
          <h1 className="text-4xl font-black tracking-tight mb-2">Advanced Flashcard Creator</h1>
          <p className="text-[#9a4c73] text-lg">Xây dựng bộ thẻ tiếng Nhật nhanh chóng và hiệu quả.</p>
        </section>

        {/* Section 1: Meta */}
        <section className="bg-white rounded-3xl p-8 shadow-sm border border-[#f3e7ed] space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold ml-1">Deck Title <span className='text-red-400'>*</span></label>
              <input 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full h-12 px-5 rounded-xl bg-[#f8f5f7] border-none focus:ring-2 focus:ring-primary/20 transition-all" 
                placeholder="Ví dụ: Từ vựng N5 - Bài 1" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold ml-1">Category / Tags</label>
              <input className="w-full h-12 px-5 rounded-xl bg-[#f8f5f7] border-none focus:ring-2 focus:ring-primary/20 transition-all" placeholder="Japanese, JLPT N5" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold ml-1">Description (Optional)</label>
            <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full min-h-[100px] p-5 rounded-xl bg-[#f8f5f7] border-none focus:ring-2 focus:ring-primary/20 transition-all resize-none" 
                placeholder="Mô tả ngắn gọn về bộ thẻ này..." 
            />
          </div>
        </section>

        {/* Section 2: Bulk Creation */}
        <section className="bg-white rounded-3xl p-8 shadow-sm border border-[#f3e7ed] relative">
          {!isPremiumUser && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 rounded-3xl flex items-center justify-center p-10 text-center">
                <div className="bg-white p-8 rounded-2xl shadow-2xl border border-primary/20 max-w-sm">
                    <AlertCircle className="mx-auto text-primary mb-4" size={48} />
                    <h4 className="font-bold text-xl mb-2">Tính năng Premium</h4>
                    <p className="text-sm text-[#9a4c73] mb-6">Nâng cấp Premium để sử dụng tính năng nhập dữ liệu hàng loạt.</p>
                    <button onClick={() => navigate('/pricing')} className="bg-primary text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg hover:scale-105 transition-transform">Nâng cấp ngay</button>
                </div>
            </div>
          )}

          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><LayoutList size={22} /></div>
              <h3 className="text-2xl font-black">Bulk Creation</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-2">
              <textarea 
                value={bulkText}
                onChange={handleBulkChange}
                disabled={!isPremiumUser}
                placeholder="Nhập dữ liệu tại đây..."
                className="w-full min-h-[250px] p-6 rounded-2xl bg-[#f8f5f7] border-none font-mono text-sm text-[#9a4c73] focus:ring-2 focus:ring-primary/10 transition-all leading-relaxed" 
              />
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-wider text-primary">Dấu phân cách</label>
                <div className="flex gap-2">
                  <button onClick={() => setDelimiter('\t')} className={`flex-1 py-2 rounded-lg text-xs font-bold border-2 ${delimiter === '\t' ? 'border-primary bg-primary/5 text-primary' : 'border-transparent bg-[#f8f5f7]'}`}>Tab</button>
                  <button onClick={() => setDelimiter(',')} className={`flex-1 py-2 rounded-lg text-xs font-bold border-2 ${delimiter === ',' ? 'border-primary bg-primary/5 text-primary' : 'border-transparent bg-[#f8f5f7]'}`}>Phẩy (,)</button>
                </div>
              </div>
              <div className="bg-[#fef1f7] p-5 rounded-xl text-[10px] space-y-3 border border-primary/10">
                <p className="font-bold text-primary uppercase border-b border-primary/10 pb-1">Hướng dẫn nhập liệu</p>
                <p>Mỗi dòng là một thẻ. Các cột cách nhau bằng dấu <span className="font-bold text-primary">{delimiter === '\t' ? 'TAB' : 'Phẩy'}</span>.</p>
                <div className="space-y-1 font-medium italic opacity-70">
                  <p>1. Hiragana/Katakana</p>
                  <p>2. Kanji (tùy chọn)</p>
                  <p>3. Nghĩa tiếng Việt</p>
                  <p>4. Ví dụ (tùy chọn)</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: List Cards */}
        <section className="space-y-6">
          <div className="flex justify-between items-end">
            <h3 className="text-2xl font-black">Danh sách thẻ ({allCards.length})</h3>
          </div>

          <div className="space-y-4">
            {allCards.map((card, i) => (
              <div key={i} className="bg-white rounded-3xl p-8 shadow-sm border border-[#f3e7ed] flex gap-8 relative group">
                <span className="text-gray-200 font-black text-2xl absolute left-6 top-8">{i + 1}</span>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 ml-8">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-primary tracking-widest">Hiragana/Katakana</label>
                    <input value={card.reading} onChange={(e) => updateCardField(i, 'reading', e.target.value)} className="w-full h-11 px-5 rounded-xl bg-[#f8f5f7] border-none focus:ring-1 focus:ring-primary/30" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-primary tracking-widest">Kanji</label>
                    <input value={card.kanji} onChange={(e) => updateCardField(i, 'kanji', e.target.value)} className="w-full h-11 px-5 rounded-xl bg-[#f8f5f7] border-none focus:ring-1 focus:ring-primary/30" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-primary tracking-widest">Meaning</label>
                    <input value={card.meaning} onChange={(e) => updateCardField(i, 'meaning', e.target.value)} className="w-full h-11 px-5 rounded-xl bg-[#f8f5f7] border-none focus:ring-1 focus:ring-primary/30" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-primary tracking-widest">Example</label>
                    <input value={card.exampleSentence} onChange={(e) => updateCardField(i, 'exampleSentence', e.target.value)} className="w-full h-11 px-5 rounded-xl bg-[#f8f5f7] border-none focus:ring-1 focus:ring-primary/30" />
                  </div>
                </div>
                <button onClick={() => removeCard(i)} className="text-gray-200 hover:text-red-500 transition-colors mt-2"><Trash2 size={20} /></button>
              </div>
            ))}
          </div>

          <button onClick={addManualCard} className="w-full py-8 rounded-[2rem] border-2 border-dashed border-pink-200 bg-white hover:bg-primary/5 transition-all group flex flex-col items-center justify-center gap-2">
            <Plus className="text-primary group-hover:scale-125 transition-transform" size={32} />
            <span className="font-bold text-primary text-sm">Thêm thẻ thủ công</span>
          </button>
        </section>
      </main>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-[#f3e7ed] z-50">
        <div className="max-w-[1000px] mx-auto px-6 py-5 flex items-center justify-between">
          <button onClick={() => navigate('/dashboard')} className="text-sm font-bold text-[#9a4c73] hover:text-primary transition-colors">Hủy bỏ</button>
          <button onClick={handleSaveDeck} disabled={isSubmitting} className="px-12 py-4 rounded-xl bg-primary text-white font-bold shadow-xl shadow-primary/20 hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-2">
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} 
            Lưu bộ thẻ
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateFlashcard;