import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useAppSelector } from "../hooks/useRedux";
import { Rocket, ArrowRight, CheckCircle2, Layers, FileText, UploadCloud, Minus, Crown, Settings } from "lucide-react";

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const isPremium = user?.isPremium ?? false;

  return (
    <div className="bg-[#fcf8fa] min-h-screen flex flex-col font-display text-[#1b0d14]">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-16 md:py-20 px-4">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
            <div className="absolute -top-[10%] -right-[5%] w-[40rem] h-[40rem] bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute top-[20%] -left-[10%] w-[30rem] h-[30rem] bg-pink-300/10 rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-6xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2 border border-primary/20">
              <Rocket size={14} />
              Premium Access
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
              Supercharge your <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
                Japanese Fluency
              </span>
            </h1>
            <p className="text-[#9a4c73] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Unlock unlimited flashcards, smart document processing, and advanced analytics to master the language
              faster.
            </p>
          </div>
        </section>

        <div className="max-w-[1200px] mx-auto px-4 pb-20">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left Content: Features & Comparison */}
            <div className="lg:col-span-8 order-2 lg:order-1 space-y-12">
              <div>
                <h3 className="text-2xl font-bold mb-6">Why Go Premium?</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Feature 1 */}
                  <div className="bg-white border border-[#f3e7ed] p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4">
                    <div className="w-full h-40 rounded-lg bg-pink-50 flex items-center justify-center overflow-hidden relative">
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{
                          backgroundImage: "radial-gradient(#f04299 1px, transparent 1px)",
                          backgroundSize: "10px 10px",
                        }}
                      ></div>
                      <Layers size={64} className="text-primary/40" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-2">Unlimited Flashcards</h4>
                      <p className="text-sm text-[#9a4c73] leading-relaxed">
                        Don't let limits stop your learning. Create as many decks as you need for Kanji, Vocabulary, and
                        Grammar. The Free plan is strictly limited to 10 decks.
                      </p>
                    </div>
                  </div>

                  {/* Feature 2 */}
                  <div className="bg-white border border-[#f3e7ed] p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4">
                    <div className="w-full h-40 rounded-lg bg-indigo-50 flex items-center justify-center overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-100 to-transparent opacity-50"></div>
                      <div className="relative flex items-center gap-2">
                        <FileText size={64} className="text-indigo-400 drop-shadow-sm" />
                        <span className="absolute -bottom-2 -right-2 bg-indigo-500 text-white rounded-full p-1 border-2 border-white">
                          <UploadCloud size={16} strokeWidth={3} />
                        </span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-2">Bulk Card Creation</h4>
                      <p className="text-sm text-[#9a4c73] leading-relaxed">
                        Instantly generate comprehensive decks by simply uploading files. We support PDF, DOCX, and CSV
                        formats to extract key terms automatically.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comparison Table */}
              <div className="bg-white border border-[#f3e7ed] rounded-2xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-[#f3e7ed] bg-gray-50/50">
                  <h3 className="text-xl font-bold">Compare Plans</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead>
                      <tr className="bg-white border-b border-[#f3e7ed]">
                        <th className="py-4 px-6 text-left w-1/3 text-sm font-semibold text-[#9a4c73]">Feature</th>
                        <th className="py-4 px-6 text-center w-1/3 text-sm font-bold text-[#1b0d14]">Free Plan</th>
                        <th className="py-4 px-6 text-center w-1/3 text-sm font-bold text-primary">Premium Plan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f3e7ed]">
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6 text-sm font-medium">Flashcard Sets</td>
                        <td className="py-4 px-6 text-center text-sm text-[#9a4c73]">Limited to 10</td>
                        <td className="py-4 px-6 text-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800">
                            Unlimited
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6 text-sm font-medium">Bulk Card Creation via File Upload</td>
                        <td className="py-4 px-6 text-center text-sm text-gray-300">
                          <Minus size={20} className="mx-auto" />
                        </td>
                        <td className="py-4 px-6 text-center text-sm font-bold flex items-center justify-center gap-2">
                          <UploadCloud size={18} className="text-primary" />
                          Included (PDF, CSV)
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Content: Sticky Pricing Card */}
            <div className="lg:col-span-4 lg:sticky lg:top-24 order-1 lg:order-2">
              <div className="bg-white border border-primary/20 rounded-2xl shadow-xl overflow-hidden relative group">
                <div className="bg-gradient-to-br from-primary to-pink-600 p-6 text-white relative overflow-hidden">
                  <div className="absolute -right-6 -top-6 bg-white/10 w-32 h-32 rounded-full blur-2xl"></div>
                  <h3 className="font-bold text-lg mb-1 relative z-10">Premium Plan</h3>
                  <p className="text-pink-100 text-sm relative z-10">Best for serious learners</p>
                </div>
                <div className="p-6 md:p-8 flex flex-col gap-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black tracking-tight">29k</span>
                    <span className="text-[#9a4c73] font-medium">/ month</span>
                  </div>

                  {isPremium ? (
                    <button
                      onClick={() => navigate("/subscription")}
                      className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Crown size={20} />
                      <span>Manage Subscription</span>
                      <Settings size={18} />
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate("/premium-checkout")}
                      className="w-full bg-primary hover:bg-pink-600 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <span>Upgrade Now</span>
                      <ArrowRight size={20} />
                    </button>
                  )}

                  <p className="text-center text-xs text-[#9a4c73]">30-day money-back guarantee. Cancel anytime.</p>
                  <div className="w-full h-px bg-[#f3e7ed]"></div>
                  <ul className="space-y-4">
                    {[
                      "Unlimited Flashcard Sets",
                      "Bulk Upload (PDF, CSV)",
                      "Priority Support",
                      "Ad-free Experience",
                    ].map((feature, idx) => (
                      <li key={idx} className="flex gap-3 items-start">
                        <CheckCircle2 size={18} className="text-primary shrink-0 mt-0.5" fill="#f04299" color="white" />
                        <span className="text-sm font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Trust Badge / Avatars */}
              <div className="mt-6 flex items-center justify-center gap-3 text-sm text-[#9a4c73]">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((n) => (
                    <div
                      key={n}
                      className="size-8 rounded-full border-2 border-white bg-gray-200 bg-center bg-cover"
                      style={{ backgroundImage: `url(https://i.pravatar.cc/100?img=${n + 10})` }}
                    />
                  ))}
                </div>
                <p>Trusted by 10k+ learners</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Pricing;
