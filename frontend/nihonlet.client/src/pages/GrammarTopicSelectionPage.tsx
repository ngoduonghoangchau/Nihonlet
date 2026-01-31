import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Star, Book, LayoutGrid, Loader2 } from 'lucide-react';

interface Exercise {
  id: number;
  title: string;
  level: string;
}

const GrammarTopicSelectionPage = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // API này nên trả về toàn bộ danh sách bài tập (chỉ cần id, title, level)
    // Bạn có thể tạo thêm endpoint: GET /api/GrammarExercises
    fetch('/api/GrammarExercises') 
      .then(res => res.json())
      .then(data => {
        setExercises(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const renderLevelSection = (level: string, icon: React.ReactNode, colorClass: string) => {
    // Thêm .trim() và .toUpperCase() để so sánh chính xác tuyệt đối
    const filtered = exercises.filter(ex => 
        ex.level && ex.level.trim().toUpperCase() === level.toUpperCase()
    );
    
    if (filtered.length === 0) return null;

    return (
      <div className="mb-12 animate-in fade-in duration-700">
        <div className={`flex items-center gap-2 mb-6 pb-2 border-b-2 ${colorClass}`}>
          {icon}
          <h2 className="text-2xl font-bold font-lalezar">Trình độ {level}</h2>
          <span className="ml-auto text-sm font-medium bg-white px-3 py-1 rounded-full shadow-sm">
            {filtered.length} bài tập
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((ex) => (
            <Link 
              key={ex.id} 
              to={`/grammar/exercise/${ex.id}`}
              className="bg-white p-5 rounded-2xl shadow-sm border border-pink-50 hover:border-pink-300 hover:shadow-md transition-all group relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-800 group-hover:text-pink-600 transition-colors">
                    {ex.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">Trắc nghiệm 20 câu</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-pink-500 group-hover:bg-pink-500 group-hover:text-white transition-all">
                  →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF5F7]">
        <Loader2 className="animate-spin text-pink-500" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF5F7] p-6 font-literata">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <Link to="/dashboard" className="inline-flex items-center text-gray-600 hover:text-pink-600 transition-colors font-bold mb-4">
            <ArrowLeft className="mr-2" size={20} /> Quay lại Dashboard
          </Link>
          <div className="flex items-end gap-4">
            <h1 className="text-4xl font-black text-gray-800 font-lalezar">Luyện tập Ngữ Pháp</h1>
            <LayoutGrid className="text-pink-300 mb-1" size={32} />
          </div>
          <p className="text-gray-500 mt-2">Hệ thống bài tập trắc nghiệm JLPT từ N5 đến N4</p>
        </div>

        {/* Sections */}
        {renderLevelSection('N5', <Star className="text-green-500" />, 'border-green-200 text-green-700')}
        {renderLevelSection('N4', <Book className="text-blue-500" />, 'border-blue-200 text-blue-700')}

        {exercises.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-pink-200">
                <p className="text-gray-400">Chưa có bài tập nào trong cơ sở dữ liệu.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default GrammarTopicSelectionPage;