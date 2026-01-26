import { Link } from "lucide-react";
import { FC, useState } from "react";

enum CreationMode {
  TEXT = "Văn bản",
  UPLOAD = "Tải Lên",
  YOUTUBE = "Youtube",
}


const App: FC = () => {
  const [mode, setMode] = useState<CreationMode>(CreationMode.UPLOAD);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    // giả lập gọi AI / API
    setTimeout(() => {
      setIsGenerating(false);
      alert("Flashcard đã được tạo (demo)");
    }, 1500);
  };


  return (
    <div className="min-h-screen bg-white text-gray-800 font-literata overflow-x-hidden">
      <header className="fixed top-0 w-full bg-white/70 backdrop-blur-md z-50 border-b border-pink-100">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-3xl font-lalezar text-pink-600 tracking-wider cursor-pointer">
            NIHONLET
          </div>
          <div className="hidden md:flex space-x-8 font-bold text-sm tracking-widest text-gray-600">
            <a href="#flashcard" className="hover:text-pink-500 transition">
              TỪ VỰNG
            </a>
            <a href="#reading" className="hover:text-pink-500 transition">
              ĐỌC HIỂU
            </a>
            <a href="#grammar" className="hover:text-pink-500 transition">
              NGỮ PHÁP
            </a>
          </div>
          <Link
            to="/login"
            className="px-6 py-2 bg-gray-900 text-white rounded-full font-lalezar hover:bg-pink-600 transition-colors shadow-lg"
          >Đăng nhập
          </Link>
        </div>
      </header>

      <main className="text-center px-6 py-20 pt-32">
        <h1 className="text-5xl font-extrabold text-pink-500 mb-6">
          Tạo Flashcard AI
        </h1>

        <p className="max-w-2xl mx-auto text-lg mb-16">
          Tạm biệt học vẹt! Hãy để flashcard thông minh tự động hóa việc học của bạn
          <br />– tiết kiệm thời gian, tăng hiệu quả, và nâng tầm trí nhớ.
        </p>

        <section className="bg-white max-w-4xl mx-auto p-10 rounded-2xl">
          {/* Tabs */}
          <div className="inline-flex rounded-full bg-pink-100 overflow-hidden mb-6">
            <button
              onClick={() => setMode(CreationMode.TEXT)}
              className={`px-8 py-3 ${
                mode === CreationMode.TEXT ? "bg-pink-400 text-white" : ""
              }`}
            >
              Văn bản
            </button>
            <button
              onClick={() => setMode(CreationMode.UPLOAD)}
              className={`px-8 py-3 ${
                mode === CreationMode.UPLOAD ? "bg-pink-400 text-white" : ""
              }`}
            >
              Tải Lên
            </button>
            <button
              onClick={() => setMode(CreationMode.YOUTUBE)}
              className={`px-8 py-3 ${
                mode === CreationMode.YOUTUBE ? "bg-pink-400 text-white" : ""
              }`}
            >
              Youtube
            </button>
          </div>

          <div className="mb-6">
            <select className="px-4 py-2 rounded-lg bg-pink-300 font-semibold">
              <option>10 thẻ - Học nhanh</option>
            </select>
          </div>

          {/* CONTENT */}
          {mode === CreationMode.UPLOAD && (
            <div className="border-2 border-dashed border-pink-300 rounded-xl p-10 mb-10">
              {/* <div className="text-3xl mb-4">📄 📕 📊</div> */}
              <p className="font-semibold mb-2">
                Kéo và thả — flashcard tự tạo trong tích tắc!
              </p>
              <p className="text-gray-500 mb-2">
                PDF, Doc, Docs · Tối đa 10MB
              </p>
              <p className="text-pink-500 mb-6 cursor-pointer">
                Hoặc tải lên từ Google Drive
              </p>
              <button className="px-8 py-3 rounded-lg text-white font-bold bg-gradient-to-r from-pink-500 to-red-500">
                CHỌN TỆP
              </button>
            </div>
          )}

          {mode === CreationMode.TEXT && (
            <textarea
              className="w-full h-64 p-6 border-2 border-pink-200 rounded-xl focus:outline-none focus:border-pink-400 mb-10"
              placeholder="Dán nội dung bạn muốn tạo flashcard..."
            />
          )}

          {mode === CreationMode.YOUTUBE && (
            <input
              type="text"
              placeholder="Dán link Youtube tại đây..."
              className="w-full p-4 border-2 border-pink-200 rounded-xl mb-10"
            />
          )}

          {/* GENERATE BUTTON */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="mt-4 px-12 py-4 rounded-full text-white font-extrabold text-lg bg-gradient-to-r from-pink-500 to-red-500 hover:opacity-90 disabled:opacity-50 transition"
          >
            {isGenerating ? "ĐANG TẠO..." : "TẠO FLASHCARD"}
          </button>
        </section>
      </main>
    </div>
  );
};

export default App;

