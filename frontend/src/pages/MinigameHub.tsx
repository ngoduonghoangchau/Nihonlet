import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import Header from '../components/Header';
import { Puzzle, ArrowRight, FileEdit } from 'lucide-react';

const MinigameHub: React.FC = () => {
  const navigate = useNavigate();

  // 3. Hàm xử lý điều hướng (có thể truyền thêm state để trang sau biết game nào được chọn)
  const handlePlayNow = (gameType: string) => {
    navigate('/minigameSelect', { state: { selectedGame: gameType } });
  };

  return (
    <div className="bg-background-light font-display text-[#1b0d14] transition-colors duration-300">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden japanese-pattern">
        <Header />
        <main className="flex flex-1 flex-col items-center py-12 px-6 animate-fadeIn">
          <div className="max-w-[1100px] w-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight">
                  Minigame Hub <span className="text-primary">✨</span>
                </h1>
                <p className="text-[#9a4c73] text-lg font-medium max-w-2xl">
                  Master Japanese through play. Choose a challenge below to sharpen your memory.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Matching Game */}
              <div className="group relative bg-white rounded-[2.5rem] p-4 border border-[#f3e7ed] shadow-xl transition-all duration-500 hover:-translate-y-2 flex flex-col">
                <div className="relative aspect-video w-full bg-[#fef1f7] rounded-[2rem] overflow-hidden flex items-center justify-center">
                  <div className="w-3/4 h-3/4 bg-center bg-contain bg-no-repeat transition-transform duration-500 group-hover:scale-110" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBfIZyynE1WmlkhCT-TDfPvGACX955RMiUXcGVg4qiH5zsvAqNgDZRv8w327vJPtdEqmhESulpnSSViHfURBHI7gkDfhLWIK_P22hSADF_v1JngUZySbRpS0jKwVBWyw-s1nfQr-OVJGzfb4e2O0c1nN7U0rWJONYxZQmiZsFHZDteT5LmjqQcFcPsDiioEBv4ldyPPTAelT150Qg0Vsb_qJTUmDexHYJuvA2m1w0AMSh7RR8dKCp7Ma_COCa1d7aPbYYXXFjiV_g")'}}></div>
                  <div className="absolute top-4 right-4 bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Match Words</div>
                </div>
                <div className="p-8 pt-6 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <Puzzle size={24} />
                    </div>
                    <h3 className="text-2xl font-black">Matching Game</h3>
                  </div>
                  <p className="text-[#9a4c73]/80 mb-8">Pair Japanese vocabulary with Vietnamese translations.</p>
                  
                  <button 
                    onClick={() => handlePlayNow('matching')}
                    className="w-full bg-primary hover:bg-[#d83b8a] text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2 group/btn"
                  >
                    Play Now <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Rewriting Game */}
              <div className="group relative bg-white rounded-[2.5rem] p-4 border border-[#f3e7ed] shadow-xl transition-all duration-500 hover:-translate-y-2 flex flex-col">
                <div className="relative aspect-video w-full bg-[#fef9f1] rounded-[2rem] overflow-hidden flex items-center justify-center">
                  <div className="w-3/4 h-3/4 bg-center bg-contain bg-no-repeat transition-transform duration-500 group-hover:scale-110" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDVjK8CnZ5Ri4yEbp_StFp8swVuTalxILsqHM5Llbiyo3L57ApbqFpHIOcYXzHa_Bz-RIAJLRpsKqzZAA5WdFtGJ7zQkSyS_hN6rjQHAPvzPXQPIsj-z-Ml6ZxdV53XDYPzttp11lqG_13AjkW8wqK2Xc8J7DAVfF59f0nceS5A9vIQ3xuWeaIP-3IAxwTRFhQIV6WMdsEhlTRimygshYknbR1s6Wdi0_rPP0j4iCSW_DW66qLUsRrTP3Uf1IZq_z8hDMiNK76wFw")'}}></div>
                  <div className="absolute top-4 right-4 bg-yellow-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Kanji Mastery</div>
                </div>
                <div className="p-8 pt-6 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="size-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-600">
                      <FileEdit size={24} />
                    </div>
                    <h3 className="text-2xl font-black">Rewriting Game</h3>
                  </div>
                  <p className="text-[#9a4c73]/80 mb-8">Convert Kanji to Hiragana or Romaji proficiency.</p>
                  
                  <button 
                    onClick={() => handlePlayNow('rewriting')}
                    className="w-full bg-[#1b0d14] text-white py-4 rounded-2xl font-black text-lg shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 group/btn"
                  >
                    Play Now <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MinigameHub;