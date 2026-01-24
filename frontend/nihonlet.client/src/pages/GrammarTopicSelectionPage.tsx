import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Book, Star, Bookmark } from 'lucide-react';

const TOPICS = [
  { id: 'n5', title: 'Ngữ pháp N5', description: 'Cơ bản cho người mới bắt đầu', level: 'N5', color: 'bg-green-100 text-green-600', icon: Star },
  { id: 'n4', title: 'Ngữ pháp N4', description: 'Sơ cấp & Hội thoại hàng ngày', level: 'N4', color: 'bg-blue-100 text-blue-600', icon: Book },
  { id: 'particles', title: 'Trợ từ (Particles)', description: 'Làm chủ Wa, Ga, Ni, De...', level: 'All', color: 'bg-purple-100 text-purple-600', icon: Bookmark },
];

const GrammarTopicSelectionPage = () => {
  return (
    <div className="min-h-screen bg-[#FFF5F7] p-6 font-literata">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to="/dashboard" className="inline-flex items-center text-gray-600 hover:text-pink-600 transition-colors font-bold mb-4">
            <ArrowLeft className="mr-2" size={20} />
            Quay lại Dashboard
          </Link>
          <h1 className="text-4xl font-lalezar text-gray-800">Chủ đề Ngữ Pháp</h1>
          <p className="text-gray-500 font-lemonada mt-2">Chọn cấp độ hoặc chủ đề bạn muốn ôn luyện hôm nay.</p>
        </div>

        {/* Grid Topics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TOPICS.map((topic, index) => (
            <Link 
              key={topic.id} 
              to={`/grammar/exercise/${topic.id}`}
              className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-pink-50 hover:-translate-y-1 group block"
              style={{
                animation: `fadeInUp 0.5s ease-out forwards ${index * 0.1}s`,
                opacity: 0,
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className={`w-12 h-12 rounded-2xl ${topic.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm`}>
                    <topic.icon size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 font-lalezar mb-2 group-hover:text-pink-600 transition-colors">
                    {topic.title}
                  </h3>
                  <p className="text-gray-500 text-sm font-lemonada">{topic.description}</p>
                </div>
                <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-500 ml-2">
                  {topic.level}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default GrammarTopicSelectionPage;