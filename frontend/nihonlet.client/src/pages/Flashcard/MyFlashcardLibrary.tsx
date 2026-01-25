import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, BookOpen, Edit3, Trash2, 
  Layers, Calendar, ChevronRight, Filter, Loader2 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyFlashcardLibrary = () => {
  const navigate = useNavigate();
  
  // 1. Khởi tạo state rỗng để chứa dữ liệu từ API
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // 2. useEffect sẽ chạy ngay khi trang vừa load
  useEffect(() => {
    fetchFlashcardSets();
  }, []);

  // 3. Hàm gọi API lấy danh sách bộ thẻ
  const fetchFlashcardSets = async () => {
    try {
      setLoading(true);
      // Gọi API GET (Không cần Token nếu bạn đang để chế độ Test ẩn danh)
      const response = await fetch('http://localhost:5024/api/FlashcardSet', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${localStorage.getItem('token')}` // Mở lại khi dùng đăng nhập
        }
      });

      if (response.ok) {
        const data = await response.json();
        setFlashcardSets(data); // Đẩy dữ liệu từ database vào state
      } else {
        console.error("Lỗi lấy dữ liệu từ server");
      }
    } catch (error) {
      console.error("Lỗi kết nối API:", error);
    } finally {
      setLoading(false);
    }
  };

  // 4. Logic tìm kiếm bộ thẻ
  const filteredSets = flashcardSets.filter(set => 
    set.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- THÊM HÀM NÀY: Xử lý xóa bộ thẻ ---
  const handleDeleteSet = async (id, title) => {
    const confirmDelete = window.confirm(`Bạn có chắc chắn muốn xóa bộ thẻ "${title}" không?`);
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5024/api/FlashcardSet/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Cập nhật lại danh sách trên giao diện ngay lập tức
        setFlashcardSets(prevSets => prevSets.filter(set => set.id !== id));
        alert("Xóa thành công!");
      } else {
        alert("Lỗi: Không thể xóa bộ thẻ.");
      }
    } catch (error) {
      console.error("Lỗi xóa:", error);
      alert("Lỗi kết nối server.");
    }
  };
  return (
    <div className="min-h-screen bg-[#FFF0F3]/30 font-sans text-gray-800 pt-24 pb-20">
      {/* Header (Giữ nguyên) */}
      <header className="fixed top-0 w-full bg-white/70 backdrop-blur-md z-50 border-b border-pink-100">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-3xl font-lalezar text-pink-600 tracking-wider cursor-pointer" onClick={() => navigate('/')}>
            NIHONLET
          </div>
          <div className="hidden md:flex space-x-8 font-bold text-sm tracking-widest text-gray-600">
            <a href="#vocabulary" className="text-pink-500 uppercase border-b-2 border-pink-500 pb-1">TỪ VỰNG</a>
            <a href="#reading" className="hover:text-pink-500 transition uppercase">ĐỌC HIỂU</a>
            <a href="#grammar" className="hover:text-pink-500 transition uppercase">NGỮ PHÁP</a>
          </div>
          <button className="px-6 py-2 bg-gray-900 text-white rounded-full font-bold hover:bg-pink-600 transition-colors shadow-lg text-sm">
            Đăng nhập
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-gray-800 mb-2">Bộ Thẻ Của Tôi</h1>
            <p className="text-gray-500 font-medium">
              {loading ? "Đang tải..." : `Bạn có tổng cộng ${flashcardSets.length} bộ thẻ`}
            </p>
          </div>
          
          <button 
            onClick={() => navigate('/createflashcard')} // Đường dẫn tới trang tạo thẻ của bạn
            className="flex items-center justify-center gap-3 bg-black text-white px-8 py-4 rounded-2xl font-black shadow-xl hover:bg-pink-600 transition-all active:scale-95"
          >
            <Plus size={24} />
            TẠO BỘ THẺ MỚI
          </button>
        </div>

        {/* Tìm kiếm & Lọc */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Tìm kiếm bộ thẻ theo tên..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-white bg-white shadow-sm focus:border-pink-200 outline-none transition-all font-medium"
            />
          </div>
        </div>

        {/* Hiển thị Loading hoặc Grid dữ liệu */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-pink-500" size={48} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSets.map((set) => (
              <div 
                key={set.id} 
                className="bg-white rounded-[2.5rem] p-8 border border-pink-50 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0">
                  <div className={`px-6 py-2 rounded-bl-[1.5rem] font-black text-xs tracking-widest ${
                    set.level === 'N5' ? 'bg-pink-100 text-pink-600' : 'bg-gray-900 text-white'
                  }`}>
                    {set.level}
                  </div>
                </div>

                <div className="mb-6">
                  <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-400 mb-4 group-hover:scale-110 transition-transform">
                    <Layers size={24} />
                  </div>
                  <h3 className="text-xl font-black text-gray-800 leading-tight mb-2 group-hover:text-pink-600 transition-colors">
                    {set.title}
                  </h3>
                  <div className="flex items-center gap-4 text-gray-400 text-[11px] font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1"><BookOpen size={14} /> {set.count} thẻ</span>
                    <span className="flex items-center gap-1"><Calendar size={14} /> {set.createdAt}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-8">
                  <button 
                    onClick={() => navigate(`/flashcardlearning/${set.id}`)} // Đường dẫn tới trang học
                    className="flex-1 bg-[#FFC1CC]/40 hover:bg-[#FFC1CC] text-gray-800 py-3 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    HỌC NGAY <ChevronRight size={16} />
                  </button>
                  <button 
                    onClick={() => handleDeleteSet(set.id, set.title)} // Gọi hàm xóa khi click
                    className="p-3 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-gray-100 active:scale-90"
                    >
                      <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}

            {/* Nút thêm nhanh */}
            <button 
              onClick={() => navigate('/createflashcard')}
              className="border-4 border-dashed border-pink-100 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-pink-200 hover:border-pink-300 hover:text-pink-400 transition-all bg-white/40 hover:bg-white group"
            >
              <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Plus size={32} />
              </div>
              <span className="font-black tracking-widest uppercase text-sm">Thêm bộ mới</span>
            </button>
          </div>
        )}
      </main>

      {/* Footer (Giữ nguyên) */}
      <footer className="mt-32 bg-white pt-24 pb-12 border-t border-pink-100">
         {/* ... JSX Footer của bạn ... */}
      </footer>
    </div>
  );
};

export default MyFlashcardLibrary;