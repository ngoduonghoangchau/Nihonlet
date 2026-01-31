import React from 'react';
import Header from '../components/Header';
import { 
  Save, 
  Trash2, 
  Wand2, 
  Plus, 
  ChevronRight, 
  LayoutList, 
  Globe, 
  Mail, 
  Megaphone 
} from 'lucide-react';

const CreateFlashcard: React.FC = () => {
  return (
    <div className="bg-[#fcf8fa] min-h-screen flex flex-col text-[#1b0d14] font-display">
      <Header />
      
      <main className="flex-grow max-w-[1000px] w-full mx-auto px-6 py-10 animate-fadeIn space-y-12">
        
        {/* Breadcrumbs & Title */}
        <section>
          <nav className="flex items-center gap-2 text-xs font-bold text-primary mb-4 uppercase tracking-widest">
            <span>Decks</span>
            <ChevronRight size={14} />
            <span className="opacity-60">Create New Set</span>
          </nav>
          <h1 className="text-4xl font-black tracking-tight mb-2">Advanced Flashcard Creator</h1>
          <p className="text-[#9a4c73] text-lg">Quickly build comprehensive Japanese decks with 4-field bulk import support.</p>
        </section>

        {/* Section 1: Meta Information */}
        <section className="bg-white rounded-3xl p-8 shadow-sm border border-[#f3e7ed] space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold ml-1">Deck Title</label>
              <input className="w-full h-12 px-5 rounded-xl bg-[#f8f5f7] border-none focus:ring-2 focus:ring-primary/20 transition-all" placeholder="e.g., JLPT N5 Vocabulary - Week 1" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold ml-1">Category / Tags</label>
              <input className="w-full h-12 px-5 rounded-xl bg-[#f8f5f7] border-none focus:ring-2 focus:ring-primary/20 transition-all" placeholder="Japanese, JLPT N5, Verbs" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold ml-1">Description (Optional)</label>
            <textarea className="w-full min-h-[100px] p-5 rounded-xl bg-[#f8f5f7] border-none focus:ring-2 focus:ring-primary/20 transition-all resize-none" placeholder="Describe what this deck covers..." />
          </div>
        </section>

        {/* Section 2: Bulk Creation */}
        <section className="bg-white rounded-3xl p-8 shadow-sm border border-[#f3e7ed] relative">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <LayoutList size={22} />
              </div>
              <h3 className="text-2xl font-black">Bulk Creation</h3>
            </div>
            <span className="px-3 py-1 bg-pink-50 text-primary text-[10px] font-bold uppercase rounded-full border border-primary/10">4 Fields Supported</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Input Area */}
            <div className="lg:col-span-8 space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold uppercase tracking-wider">Paste Data (4 Fields per card)</label>
                <span className="text-[10px] italic text-[#9a4c73]">Format: Hiragana [tab] Kanji [tab] Meaning [tab] Example</span>
              </div>
              <textarea 
                className="w-full min-h-[300px] p-6 rounded-2xl bg-[#f8f5f7] border-none font-mono text-sm text-[#9a4c73] focus:ring-2 focus:ring-primary/10 transition-all leading-relaxed" 
                defaultValue={`ねこ  猫  Cat  吾輩は猫である\nたべる  食べる  To eat  私は寿司を食べる\nさくら  桜  Cherry Blossom  桜の花が綺麗です`}
              />
            </div>

            {/* Sidebar Settings */}
            <div className="lg:col-span-4 space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-wider">Field Delimiter</label>
                <div className="flex flex-col gap-2">
                  <button className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-primary bg-primary/5 text-sm font-bold">
                    <div className="size-3 rounded-full border-4 border-primary bg-white" /> Tab
                  </button>
                  <button className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-transparent bg-[#f8f5f7] text-sm font-medium">
                    <div className="size-3 rounded-full border-2 border-gray-300 bg-white" /> Comma
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-wider">Field Mapping</label>
                <div className="bg-[#f8f5f7] p-4 rounded-2xl space-y-3 text-xs">
                  <p className="text-[#9a4c73] mb-4">Ensure your data is ordered as follows to match the card fields:</p>
                  {[
                    { n: 1, l: 'Hiragana/Katakana' },
                    { n: 2, l: 'Kanji' },
                    { n: 3, l: 'Meaning' },
                    { n: 4, l: 'Example' }
                  ].map(f => (
                    <div key={f.n} className="flex items-center gap-3 font-bold">
                      <span className="text-primary">{f.n}</span>
                      <span>{f.l}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-wider">Card Separation</label>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-primary bg-primary/5 text-sm font-bold">
                  <div className="size-3 rounded-full border-4 border-primary bg-white" /> New Line
                </button>
              </div>
            </div>
          </div>

          {/* Data Preview Table */}
          <div className="mt-12 space-y-4">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-primary">Data Preview</label>
              <span className="text-[10px] text-[#9a4c73]">Sample Row Processing</span>
            </div>
            <div className="overflow-hidden rounded-xl border border-[#f3e7ed]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#fef1f7] text-primary font-bold uppercase">
                  <tr>
                    <th className="px-6 py-4">Hiragana/Katakana</th>
                    <th className="px-6 py-4">Kanji</th>
                    <th className="px-6 py-4">Meaning</th>
                    <th className="px-6 py-4">Example</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f3e7ed]">
                  <tr>
                    <td className="px-6 py-4">ねこ</td>
                    <td className="px-6 py-4">猫</td>
                    <td className="px-6 py-4 italic">Cat</td>
                    <td className="px-6 py-4">吾輩は猫である</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Section 3: Generated Cards */}
        <section className="space-y-6">
          <div className="flex justify-between items-end">
            <h3 className="text-2xl font-black">Generated Cards</h3>
            <span className="text-xs font-bold text-primary px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10">3 Cards Recognized</span>
          </div>

          <div className="space-y-4">
            {[1].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl p-8 shadow-sm border border-[#f3e7ed] flex gap-8 relative">
                <span className="text-gray-300 font-black text-2xl absolute left-6 top-8">1</span>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 ml-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-primary tracking-widest">Hiragana/Katakana</label>
                    <input className="w-full h-12 px-5 rounded-xl bg-[#f8f5f7] border-none" defaultValue="ねこ" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-primary tracking-widest">Kanji</label>
                    <input className="w-full h-12 px-5 rounded-xl bg-[#f8f5f7] border-none" defaultValue="猫" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-primary tracking-widest">Meaning</label>
                    <div className="relative">
                      <input className="w-full h-12 px-5 rounded-xl bg-[#f8f5f7] border-none" defaultValue="Cat" />
                      <Wand2 className="absolute right-4 top-3.5 text-primary opacity-30" size={18} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-primary tracking-widest">Example</label>
                    <div className="relative">
                      <input className="w-full h-12 px-5 rounded-xl bg-[#f8f5f7] border-none" defaultValue="吾輩は猫である" />
                      <Wand2 className="absolute right-4 top-3.5 text-primary opacity-30" size={18} />
                    </div>
                  </div>
                </div>
                <button className="text-gray-300 hover:text-red-500 transition-colors mt-2">
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          <button className="w-full py-10 rounded-[2rem] border-2 border-dashed border-pink-200 bg-white hover:bg-primary/5 transition-all group flex flex-col items-center justify-center gap-3">
            <div className="size-10 rounded-full bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
              <Plus size={24} />
            </div>
            <span className="font-bold text-primary">Add Another Manual Card</span>
          </button>
        </section>

        {/* Footer Info Area */}
        <footer className="pt-16 pb-32 border-t border-[#f3e7ed] grid grid-cols-1 md:grid-cols-4 gap-12 text-sm">
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2 text-primary font-black text-2xl">
              <span className="p-1.5 bg-primary text-white rounded-lg"><Save size={20} fill="currentColor" /></span>
              Sakura
            </div>
            <p className="text-[#9a4c73] leading-relaxed">Master Japanese through the power of spaced repetition and AI-enhanced flashcards.</p>
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-widest mb-6">Product</h4>
            <ul className="space-y-4 text-[#9a4c73]">
              <li>Study Modes</li>
              <li>AI Assistant</li>
              <li>JLPT Guides</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-widest mb-6">Resources</h4>
            <ul className="space-y-4 text-[#9a4c73]">
              <li>Help Center</li>
              <li>Community</li>
              <li>API</li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="font-bold uppercase tracking-widest mb-6">Connect</h4>
            <div className="flex gap-4">
              <div className="size-8 rounded-full border border-pink-100 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors cursor-pointer"><Globe size={16} /></div>
              <div className="size-8 rounded-full border border-pink-100 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors cursor-pointer"><Mail size={16} /></div>
              <div className="size-8 rounded-full border border-pink-100 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors cursor-pointer"><Megaphone size={16} /></div>
            </div>
          </div>
        </footer>
      </main>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-[#f3e7ed] z-50">
        <div className="max-w-[1000px] mx-auto px-6 py-5 flex items-center justify-between">
          <div className="hidden md:flex items-center gap-8 text-[10px] font-bold text-[#9a4c73]">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-pink-50 text-primary rounded">TAB</span>
              <span>Next field</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-pink-50 text-primary rounded">ENTER</span>
              <span>New card</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button className="text-sm font-bold text-[#9a4c73] hover:text-primary transition-colors">Cancel</button>
            <button className="px-10 py-3.5 rounded-xl bg-primary text-white font-bold shadow-xl shadow-primary/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2">
              <Save size={18} /> Save Deck
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#fcf8fa] px-10 py-6 text-center text-[10px] font-bold text-[#9a4c73] uppercase tracking-widest">
        © 2024 Sakura Flashcards. All rights reserved. 
        <span className="mx-4 text-gray-200">|</span> 
        <span className="hover:text-primary cursor-pointer">Privacy Policy</span>
        <span className="mx-4 text-gray-200">|</span> 
        <span className="hover:text-primary cursor-pointer">Terms of Service</span>
      </div>
    </div>
  );
};

export default CreateFlashcard;