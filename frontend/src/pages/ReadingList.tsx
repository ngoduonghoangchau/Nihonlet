import React from 'react';
import Header from '../components/Header';
import { 
  ArrowLeft, 
  Filter, 
  BookOpen, 
  Quote, 
  ArrowRight, 
  PlayCircle, 
  Star, 
  Lock 
} from 'lucide-react';

const ReadingList: React.FC = () => {
  const topics = [
    { name: "Văn hóa & Đời sống", count: 12, active: true },
    { name: "Du lịch", count: 5, active: false },
    { name: "Công sở", count: 8, active: false },
  ];

  const secondaryLessons = [
    { id: "07", title: "Bài 07 - Cuộc sống hàng ngày", grammar: "Động từ thể Te, Câu yêu cầu lịch sự", level: "N4", time: "15 phút", locked: false },
    { id: "08", title: "Bài 08 - Mua sắm tại siêu thị", grammar: "Tính từ i/na, So sánh hơn", level: "N5", time: "10 phút", locked: true },
    { id: "09", title: "Bài 09 - Kế hoạch cuối tuần", grammar: "Thể ý định, Rủ rê", level: "N4", time: "12 phút", locked: true },
  ];

  return (
    <div className="bg-[#fff1f2] min-h-screen flex flex-col font-body text-[#374151]">
      <style>{`
        ruby { display: inline-flex; flex-direction: column-reverse; vertical-align: bottom; line-height: 1; }
        rt { display: block; line-height: 1.2; font-size: 0.6em; text-align: center; margin-bottom: 2px; color: #ec4899; }
      `}</style>
      
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full animate-fadeIn">
        {/* Nút quay lại */}
        <div className="mb-6">
          <a className="inline-flex items-center px-4 py-2 rounded-full bg-white border border-pink-100 text-gray-600 hover:bg-pink-50 hover:text-primary transition-all shadow-sm group" href="#">
            <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium text-sm">Quay lại chọn chủ đề</span>
          </a>
        </div>

        {/* Tiêu đề trang */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">Luyện Đọc Hiểu Sơ Cấp</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Chọn một bài đọc bên dưới để bắt đầu luyện tập. Các bài học được thiết kế để cải thiện vốn từ vựng và khả năng đọc hiểu kanji của bạn.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-pink-100 sticky top-24">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Filter size={18} className="text-primary" /> Chủ đề
              </h3>
              <ul className="space-y-2">
                {topics.map((t, i) => (
                  <li key={i}>
                    <a className={`flex items-center justify-between p-2 rounded-lg transition-all ${t.active ? 'bg-primary text-white shadow-md' : 'hover:bg-pink-50 text-gray-600 hover:text-primary'}`} href="#">
                      <span className="font-medium">{t.name}</span>
                      <span className={`${t.active ? 'bg-white/20' : 'bg-gray-100 text-gray-500'} px-2 py-0.5 rounded-md text-xs`}>{t.count}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Danh sách bài học */}
          <div className="lg:col-span-9 space-y-6">
            {/* Bài học chính (đang học) */}
            <div className="bg-white rounded-xl shadow-md border-l-4 border-primary overflow-hidden transition-all hover:scale-[1.01]">
              <div className="p-6 md:p-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="inline-block px-3 py-1 bg-pink-100 text-primary text-xs font-bold rounded-full mb-2 uppercase tracking-wide">Đang học</span>
                    <h3 className="text-2xl font-display font-bold text-gray-900 mb-1">Bài 06 – 25 Bài Đọc Hiểu – お花見</h3>
                    <p className="text-sm text-gray-500">Đã hoàn thành: <span className="font-medium text-primary">35%</span></p>
                  </div>
                  <BookOpen size={40} className="text-primary opacity-20 hidden sm:block" />
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                  <div className="bg-primary h-2 rounded-full transition-all duration-1000" style={{ width: '35%' }}></div>
                </div>

                <div className="mb-6">
                  <p className="text-gray-600 italic mb-4">Đoạn đọc mô tả một ngày sinh hoạt của nhân vật với các hoạt động quen thuộc.</p>
                  <div className="bg-[#fff1f2] p-6 rounded-lg border border-pink-100 relative overflow-hidden">
                    <Quote size={48} className="absolute top-0 right-0 p-2 opacity-10 text-primary" />
                    <h4 className="text-center text-xl font-bold mb-6 text-gray-800">
                      <ruby>お花見<rt>はなみ</rt></ruby>
                    </h4>
                    <div className="text-lg leading-loose space-y-4 text-center">
                      <p><ruby>奈良<rt>なら</rt></ruby>の <ruby>吉山<rt>よしやま</rt></ruby>へ <ruby>行<rt>い</rt></ruby>きませんか。</p>
                      <p><ruby>吉野山<rt>よしのやま</rt></ruby>で <ruby>お花見<rt>はなmi</rt></ruby>を します。</p>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button className="text-primary text-sm font-bold flex items-center hover:underline">
                        Tiếp tục đọc <ArrowRight size={14} className="ml-1" />
                      </button>
                    </div>
                  </div>
                </div>

                <button className="bg-primary hover:bg-pink-600 text-white px-6 py-2.5 rounded-lg font-medium transition shadow-lg shadow-pink-200 flex items-center justify-center gap-2">
                  <PlayCircle size={18} /> Tiếp tục học
                </button>
              </div>
            </div>

            {/* Các bài học phụ */}
            {secondaryLessons.map((lesson) => (
              <div key={lesson.id} className={`bg-white rounded-xl shadow-sm border border-transparent hover:border-pink-200 hover:shadow-md transition-all group cursor-pointer ${lesson.locked ? 'opacity-75' : ''}`}>
                <div className="p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="h-16 w-16 rounded-lg bg-pink-50 flex items-center justify-center flex-shrink-0 text-2xl font-bold text-primary shadow-inner">
                    {lesson.id}
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">{lesson.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">Ngữ pháp: {lesson.grammar}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className={`flex items-center text-xs ${lesson.level === 'N5' ? 'text-green-500' : 'text-yellow-500'}`}>
                        <Star size={12} className="mr-1 fill-current" /> {lesson.level} Level
                      </span>
                      <span className="text-xs text-gray-400">• {lesson.time}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 self-end sm:self-center">
                    <button className="bg-pink-50 text-primary p-2 rounded-full group-hover:bg-primary group-hover:text-white transition-all transform group-hover:rotate-12">
                      {lesson.locked ? <Lock size={20} /> : <ArrowRight size={20} />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReadingList;