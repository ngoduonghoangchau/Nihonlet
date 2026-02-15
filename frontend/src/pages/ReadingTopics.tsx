import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import api from '../api/axios';
import { 
  Sun, 
  Plane, 
  GraduationCap, 
  Sparkles, 
  ShoppingBag, 
  Utensils, 
  HeartPulse, 
  Heart, 
  CheckCircle2,
  ArrowLeft,
  BookOpen,
  Loader2,
  Newspaper,
  Train,
  CloudSun,
  Camera,
  ArrowRight,
  ChevronRight,
  Lightbulb,
  Briefcase
} from 'lucide-react';

interface ReadingCategoryDto {
  readingCategoryId?: number;
  ReadingCategoryId?: number;
  catId?: number;
  CatId?: number;
  id?: number;
  Id?: number;
  nameVi: string;
  nameJp: string;
  description?: string;
  iconUrl?: string;
}

const ReadingTopic: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentLevel = searchParams.get('level') || 'N5';
  
  const [topics, setTopics] = useState<ReadingCategoryDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await api.get('/Reading/categories');
        setTopics(response.data || []);
      } catch (error) {
        console.error("Lỗi khi tải danh sách chủ đề:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Helper chọn icon dựa trên tên chủ đề (Đã thêm các từ khóa tiếng Việt)
  const getIcon = (name: string) => {
    if (!name) return <BookOpen className="w-8 h-8 md:w-10 md:h-10" />;
    const n = name.toLowerCase();
    if (n.includes('daily') || n.includes('life') || n.includes('đời sống') || n.includes('sinh hoạt')) return <Sun className="w-8 h-8 md:w-10 md:h-10" />;
    if (n.includes('travel') || n.includes('trip') || n.includes('du lịch')) return <Plane className="w-8 h-8 md:w-10 md:h-10" />;
    if (n.includes('school') || n.includes('education') || n.includes('trường') || n.includes('giáo dục')) return <GraduationCap className="w-8 h-8 md:w-10 md:h-10" />;
    if (n.includes('culture') || n.includes('festival') || n.includes('văn hóa') || n.includes('lễ hội')) return <Sparkles className="w-8 h-8 md:w-10 md:h-10" />;
    if (n.includes('shop') || n.includes('store') || n.includes('mua sắm')) return <ShoppingBag className="w-8 h-8 md:w-10 md:h-10" />;
    if (n.includes('food') || n.includes('eat') || n.includes('ẩm thực') || n.includes('ăn uống')) return <Utensils className="w-8 h-8 md:w-10 md:h-10" />;
    if (n.includes('health') || n.includes('body') || n.includes('sức khỏe')) return <HeartPulse className="w-8 h-8 md:w-10 md:h-10" />;
    if (n.includes('family') || n.includes('friend') || n.includes('gia đình') || n.includes('bạn bè')) return <Heart className="w-8 h-8 md:w-10 md:h-10" />;
    if (n.includes('news') || n.includes('tin tức')) return <Newspaper className="w-8 h-8 md:w-10 md:h-10" />;
    if (n.includes('transport') || n.includes('traffic') || n.includes('giao thông')) return <Train className="w-8 h-8 md:w-10 md:h-10" />;
    if (n.includes('weather') || n.includes('thời tiết')) return <CloudSun className="w-8 h-8 md:w-10 md:h-10" />;
    if (n.includes('hobby') || n.includes('sở thích')) return <Camera className="w-8 h-8 md:w-10 md:h-10" />;
    if (n.includes('work') || n.includes('job') || n.includes('công việc') || n.includes('kỹ năng')) return <Briefcase className="w-8 h-8 md:w-10 md:h-10" />;
    return <BookOpen className="w-8 h-8 md:w-10 md:h-10" />;
  };

  return (
    <div className="bg-[#FCF8FA] min-h-screen flex flex-col font-display text-[#1b0d14]">
      <Header />

      <main className="flex-grow max-w-[1200px] mx-auto px-4 md:px-6 py-8 md:py-12 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* --- Header Section (Breadcrumb & Title) --- */}
        <div className="mb-10 md:mb-16">
          <button 
            onClick={() => navigate('/reading-level')}
            className="group inline-flex items-center gap-2 text-[#9a4c73] hover:text-primary font-bold text-sm mb-6 transition-colors bg-white px-4 py-2 rounded-xl border-2 border-[#f3e7ed] hover:border-primary/30 shadow-sm"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Quay lại Cấp độ
          </button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <nav className="flex items-center gap-2 text-[#9a4c73] text-xs md:text-sm mb-3 font-medium uppercase tracking-wider">
                <span>Học tập</span>
                <ChevronRight size={12} />
                <span>Đọc hiểu</span>
                <ChevronRight size={12} />
                <span className="font-black text-primary">CẤP ĐỘ {currentLevel}</span>
              </nav>
              <h2 className="text-3xl md:text-5xl font-black text-[#1b0d14] tracking-tight mb-4">
                Khám phá Chủ đề
              </h2>
              <p className="text-sm md:text-lg text-[#9a4c73] font-medium max-w-2xl">
                Lựa chọn một chủ đề yêu thích để bắt đầu. Mỗi bài học đều cung cấp từ vựng ngữ cảnh và câu hỏi để kiểm tra khả năng đọc hiểu của bạn.
              </p>
            </div>
            
            {/* Badge Cấp độ hiển thị to bên phải trên Desktop */}
            <div className="hidden md:flex flex-col items-center justify-center bg-white border-2 border-[#f3e7ed] p-4 rounded-2xl shadow-sm min-w-[120px]">
                <span className="text-[10px] font-black uppercase text-[#9a4c73] tracking-widest mb-1">Đang học</span>
                <span className="text-3xl font-black text-primary">{currentLevel}</span>
            </div>
          </div>
        </div>

        {/* --- Grid Chủ Đề (Topic Cards) --- */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-primary mb-4" size={48} />
            <p className="text-[#9a4c73] font-bold">Đang tải danh sách chủ đề...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {topics?.map((topic, index) => {
              const topicId = topic.readingCategoryId || topic.ReadingCategoryId || topic.catId || topic.CatId || topic.id || topic.Id;
              
              return (
                <div 
                  key={topicId || index}
                  onClick={() => {
                    if (topicId) {
                      navigate(`/reading-list?level=${currentLevel}&catId=${topicId}`);
                    } else {
                      console.error("Không tìm thấy ID chủ đề:", topic);
                      alert("Không thể mở chủ đề này do lỗi dữ liệu.");
                    }
                  }}
                  className="group bg-white rounded-[2rem] p-6 md:p-8 border-2 border-[#f3e7ed] hover:border-primary shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden cursor-pointer"
                >
                  {/* Icon Box */}
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-[1.5rem] flex items-center justify-center mb-5 transition-transform duration-300 bg-[#fcf8fa] text-primary group-hover:scale-110 shadow-inner group-hover:bg-pink-50">
                    {getIcon(topic.nameVi || topic.nameJp)}
                  </div>

                  {/* Title & Desc */}
                  <h3 className="font-black text-xl md:text-2xl mb-2 text-[#1b0d14] group-hover:text-primary transition-colors line-clamp-2">
                    {topic.nameVi}
                  </h3>
                  <p className="text-sm md:text-base text-[#9a4c73] font-medium mb-6 line-clamp-2 flex-grow">
                    {topic.description || "Khám phá các bài đọc thú vị về chủ đề này."}
                  </p>

                  {/* Nút bấm giả (Giúp card trông giống app hơn) */}
                  <div className="mt-auto w-full flex items-center justify-center gap-2 bg-[#fcf8fa] group-hover:bg-primary group-hover:text-white text-primary font-black text-sm uppercase tracking-widest py-3 md:py-4 rounded-xl transition-colors">
                    Học ngay <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* --- Banner Bổ Sung (Why Read?) --- */}
        <section className="mt-16 md:mt-24 bg-white rounded-[2.5rem] p-6 md:p-12 shadow-lg border-2 border-[#f3e7ed] flex flex-col lg:flex-row items-center gap-10 overflow-hidden relative">
          {/* Background pattern mờ */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-pink-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

          <div className="w-full lg:w-3/5 z-10">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary/10 p-3 rounded-2xl text-primary">
                    <BookOpen size={28} />
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-[#1b0d14] tracking-tight">Tại sao nên luyện đọc mỗi ngày?</h3>
            </div>
            
            <ul className="space-y-4 md:space-y-5">
              {[
                "Ghi nhớ từ vựng tự nhiên và lâu hơn thông qua ngữ cảnh thực tế.",
                "Nắm bắt cách người bản xứ sử dụng ngữ pháp trong đời sống.",
                "Tăng cường khả năng nhận diện Kanji và tăng tốc độ đọc hiểu.",
                "Mở rộng hiểu biết về văn hóa, xã hội và con người Nhật Bản."
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-3 bg-[#fcf8fa] p-4 rounded-2xl border border-[#f3e7ed] hover:border-primary/30 transition-colors">
                  <CheckCircle2 className="text-primary mt-0.5 shrink-0 w-5 h-5 md:w-6 md:h-6" />
                  <span className="text-[#64324d] font-medium text-sm md:text-base leading-relaxed">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="w-full lg:w-2/5 relative h-full min-h-[250px] rounded-[2rem] overflow-hidden bg-gradient-to-br from-pink-100 to-rose-50 border-2 border-white shadow-inner flex flex-col items-center justify-center p-8 text-center z-10 hover:scale-[1.02] transition-transform duration-500">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/japanese-sayagata.png')]"></div>
            
            <Lightbulb className="w-12 h-12 text-primary mb-4 drop-shadow-md animate-pulse" />
            <p className="font-black text-primary text-xl md:text-2xl mb-3 uppercase tracking-wider">Có thể bạn chưa biết?</p>
            <p className="text-[#9a4c73] font-medium italic leading-relaxed text-sm md:text-lg">
              "Hanami (Ngắm hoa) là một truyền thống có từ nhiều thế kỷ trước của Nhật Bản, mang ý nghĩa tận hưởng vẻ đẹp rực rỡ nhưng ngắn ngủi của hoa anh đào."
            </p>
          </div>
        </section>

      </main>
    </div>
  );
};

export default ReadingTopic;