import React, { useState } from 'react';
import { Plus, Trash2, Save, Type, Languages, GraduationCap, Quote, ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreateFlashcardSet = () => {
  const navigate = useNavigate();
  
  // State quản lý tiêu đề bộ thẻ và trạng thái loading
  const [setTitle, setSetTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Danh sách các thẻ Flashcard trong bộ
  const [flashcards, setFlashcards] = useState([
    { frontText: '', backText: '', exampleSentence: '', level: 'N5' }
  ]);

  const levels = ['N5', 'N4'];

  const handleInputChange = (index, field, value) => {
    const newCards = [...flashcards];
    newCards[index][field] = value;
    setFlashcards(newCards);
  };

  const addCard = () => {
    setFlashcards([...flashcards, { frontText: '', backText: '', exampleSentence: '', level: 'N5' }]);
  };

  const removeCard = (index) => {
    if (flashcards.length > 1) {
      const newCards = flashcards.filter((_, i) => i !== index);
      setFlashcards(newCards);
    }
  };

  // --- HÀM LƯU BỘ THẺ VỀ BACKEND ---
  const handleSave = async () => {
    // 1. Kiểm tra đầu vào
    if (!setTitle.trim()) {
      alert("Vui lòng nhập tiêu đề cho bộ thẻ!");
      return;
    }

    const hasEmptyCard = flashcards.some(c => !c.frontText.trim() || !c.backText.trim());
    if (hasEmptyCard) {
      alert("Mặt trước và mặt sau của các thẻ không được để trống!");
      return;
    }

    setIsSaving(true);

    // 2. Chuẩn bị Command gửi cho .NET API
    const command = {
      title: setTitle,
      cards: flashcards.map(c => ({
        frontText: c.frontText,
        backText: c.backText,
        level: c.level,
        exampleSentence: c.exampleSentence || ""
      }))
    };

    try {
      // Gọi API đến Localhost của bạn
      const response = await fetch('http://localhost:5024/api/FlashcardSet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Token lấy từ khi đăng nhập
        },
        body: JSON.stringify(command)
      });

      if (response.ok) {
        alert("🎉 Tạo bộ Flashcard thành công!");
        // --- CHUYỂN TRANG SAU KHI TẠO THÀNH CÔNG ---
        navigate('/myflashcardlibrary'); 
      } else {
        const errorMsg = await response.text();
        alert("Lỗi server: " + errorMsg);
      }
    } catch (error) {
      console.error("Lỗi kết nối API:", error);
      alert("Không thể kết nối tới server. Hãy chắc chắn API đang chạy ở port 5024!");
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    if (window.confirm("Quay lại trang trước? Mọi thay đổi sẽ không được lưu.")) {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF0F3] pb-20 font-sans">
      {/* Header */}
      <div className="bg-white shadow-sm p-6 sticky top-0 z-20 border-b border-pink-100">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Tạo Bộ Flashcard</h1>
            <p className="text-xs text-pink-400 font-bold uppercase tracking-[0.2em]">Nihonlet System</p>
          </div>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-[#FFC1CC] hover:bg-[#ffabbb] text-gray-800 px-8 py-3 rounded-full font-bold transition-all shadow-lg active:scale-95 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {isSaving ? "ĐANG LƯU..." : "LƯU BỘ THẺ"}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-6 px-4">
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 bg-[#FFDDE3] hover:bg-[#ffcbd5] text-gray-700 px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-sm mb-8"
        >
          <ArrowLeft size={18} /> Quay Lại
        </button>

        {/* Ô Nhập Tiêu Đề */}
        <div className="bg-white rounded-3xl p-8 mb-8 border-2 border-pink-100 shadow-sm">
           <label className="block text-[11px] font-black text-pink-400 uppercase tracking-widest mb-3 ml-1">
              Tiêu đề bộ Flashcard
           </label>
           <input
             type="text"
             value={setTitle}
             onChange={(e) => setSetTitle(e.target.value)}
             className="w-full text-2xl font-bold outline-none border-b-2 border-gray-100 focus:border-pink-300 transition-all pb-2 text-gray-700"
             placeholder="Ví dụ: Kanji bài 1 - Minna no Nihongo"
           />
        </div>

        {/* Danh sách các thẻ */}
        {flashcards.map((card, index) => (
          <div key={index} className="bg-white rounded-[2rem] p-8 mb-10 shadow-sm border border-pink-50 relative group animate-in slide-in-from-bottom-4 duration-500">
            <div className="absolute -left-3 -top-3 bg-black text-white w-10 h-10 rounded-2xl flex items-center justify-center font-bold shadow-xl rotate-3">
              {index + 1}
            </div>
            
            <button 
              onClick={() => removeCard(index)}
              className="absolute right-6 top-6 text-gray-300 hover:text-red-400 transition-colors p-2"
            >
              <Trash2 size={20} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[12px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  <Type size={14} /> Mặt Trước
                </label>
                <input
                  type="text"
                  value={card.frontText}
                  onChange={(e) => handleInputChange(index, 'frontText', e.target.value)}
                  className="w-full border-2 border-gray-50 focus:border-[#FFC1CC] rounded-2xl p-4 outline-none transition-all bg-gray-50/30 focus:bg-white text-xl"
                  placeholder="Từ vựng / Kanji..."
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[12px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  <Languages size={14} /> Mặt Sau
                </label>
                <input
                  type="text"
                  value={card.backText}
                  onChange={(e) => handleInputChange(index, 'backText', e.target.value)}
                  className="w-full border-2 border-gray-50 focus:border-[#FFC1CC] rounded-2xl p-4 outline-none transition-all bg-gray-50/30 focus:bg-white text-xl"
                  placeholder="Ý nghĩa tiếng Việt..."
                />
              </div>

              <div className="md:col-span-2 space-y-3">
                <label className="flex items-center gap-2 text-[12px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  <GraduationCap size={14} /> Cấp Độ
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {levels.map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => handleInputChange(index, 'level', lvl)}
                      className={`py-4 rounded-2xl font-black text-lg transition-all border-2 ${
                        card.level === lvl 
                        ? "border-[#FFC1CC] bg-pink-50 text-pink-600 shadow-md" 
                        : "border-gray-100 bg-gray-50 text-gray-300 hover:border-pink-100"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2 space-y-3">
                <label className="flex items-center gap-2 text-[12px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  <Quote size={14} /> Ví Dụ Minh Họa (Không bắt buộc)
                </label>
                <textarea
                  rows="3"
                  value={card.exampleSentence}
                  onChange={(e) => handleInputChange(index, 'exampleSentence', e.target.value)}
                  className="w-full border-2 border-gray-50 focus:border-[#FFC1CC] rounded-2xl p-4 outline-none transition-all bg-gray-50/30 focus:bg-white text-lg shadow-inner"
                  placeholder="Điền ví dụ để dễ ghi nhớ hơn..."
                />
              </div>
            </div>
          </div>
        ))}

        <button 
          onClick={addCard}
          className="w-full py-12 border-4 border-dashed border-pink-200 rounded-[2.5rem] flex flex-col items-center justify-center text-pink-300 hover:border-[#FFC1CC] hover:text-[#FFC1CC] transition-all bg-white/40 hover:bg-white group mb-20"
        >
          <div className="bg-pink-50 p-4 rounded-full group-hover:scale-110 transition-transform mb-3 shadow-sm">
            <Plus size={32} />
          </div>
          <span className="font-black tracking-[0.3em] text-xs uppercase text-pink-400">Thêm Thẻ Tiếp Theo</span>
        </button>
      </div>

      <footer className="text-center py-16 border-t border-pink-100 bg-white">
        <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center border-2 border-pink-50 shadow-sm p-3">
                <div className="w-full h-full bg-[#FFC1CC] rounded-full opacity-80 animate-pulse"></div>
            </div>
            <h2 className="font-black text-3xl tracking-[0.25em] text-gray-800">NIHONLET</h2>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.5em] ml-2">Nihongo For Everyone</p>
        </div>
      </footer>
    </div>
  );
};

export default CreateFlashcardSet;