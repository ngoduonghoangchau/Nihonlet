import React, { useState } from 'react';
import Header from '../components/Header';
import { Eye, EyeOff, Umbrella, ClipboardCheck } from 'lucide-react';

const ReadingExercise: React.FC = () => {
  const [showFurigana, setShowFurigana] = useState(true);

  return (
    <div className="bg-[#fff1f2] min-h-screen flex flex-col font-display text-[#333333] transition-colors duration-300">
      <style>{`
        ruby {
          display: inline-flex;
          flex-direction: column-reverse;
          vertical-align: bottom;
          align-items: center;
        }
        rt {
          font-size: 0.6em;
          line-height: 1;
          margin-bottom: -0.2em;
          user-select: none;
          color: #ec4899;
        }
      `}</style>
      
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full animate-fadeIn">
        {/* Header Section */}
        <header className="mb-8 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                BÀI 06 – 25 BÀI ĐỌC HIỂU – <span className="text-primary font-japanese">お花見</span>
              </h1>
              <p className="text-gray-600 text-sm max-w-2xl font-japanese">
                Đoạn đọc mô tả một ngày sinh hoạt của nhân vật với các hoạt động quen thuộc. Người học luyện theo dõi trình tự hành động.
              </p>
            </div>
            <button 
              onClick={() => setShowFurigana(!showFurigana)}
              className="bg-primary hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center w-full sm:w-auto"
            >
              {showFurigana ? (
                <><Eye size={20} className="mr-2" /> Ẩn Furigana</>
              ) : (
                <><EyeOff size={20} className="mr-2" /> Hiện Furigana</>
              )}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: READING CONTENT */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex space-x-2 border-b border-gray-200 mb-4">
              <div className="pb-2 px-4 border-b-2 border-primary text-primary font-bold">Đọc hiểu</div>
            </div>

            <div className="bg-white rounded-2xl shadow-soft p-6 sm:p-8 font-japanese text-lg leading-loose border border-pink-100">
              <h2 className="text-3xl text-center font-bold text-primary mb-8 mt-2">
                <ruby>お花見{showFurigana && <rt>はなみ</rt>}</ruby>
              </h2>

              <div className="space-y-6 text-gray-800 text-center sm:text-left">
                <div className="text-center mb-6">
                  <ruby>お花見{showFurigana && <rt>はなみ</rt>}</ruby>を　しましょう。
                </div>
                <p><ruby>奈良{showFurigana && <rt>なら</rt>}</ruby>の　<ruby>吉山{showFurigana && <rt>よしやま</rt>}</ruby>へ　<ruby>行{showFurigana && <rt>い</rt>}</ruby>きませんか。</p>
                <p><ruby>吉野山{showFurigana && <rt>よしのやま</rt>}</ruby>で　<ruby>お花見{showFurigana && <rt>はなみ</rt>}</ruby>を　します。</p>
                <p><ruby>電車{showFurigana && <rt>でんしゃ</rt>}</ruby>と　ロープウエーで　<ruby>行{showFurigana && <rt>い</rt>}</ruby>きますか。</p>
                <p><ruby>吉野山{showFurigana && <rt>よしのやま</rt>}</ruby>で　<ruby>昼{showFurigana && <rt>ひる</rt>}</ruby><ruby>ご飯{showFurigana && <rt>はん</rt>}</ruby>を　<ruby>食{showFurigana && <rt>た</rt>}</ruby>べます。</p>
                <p><ruby>桜{showFurigana && <rt>さくら</rt>}</ruby>の　<ruby>写真{showFurigana && <rt>しゃしん</rt>}</ruby>を　<ruby>取{showFurigana && <rt>と</rt>}</ruby>りましょう。</p>
                <p className="mb-8">みなさん、いっしょに　<ruby>行{showFurigana && <rt>い</rt>}</ruby>きましょう。</p>

                {/* Event Details Card */}
                <div className="bg-[#fff1f2] rounded-lg p-6 space-y-3 border border-pink-100 text-left">
                  {[
                    { label: "いつ", value: <><ruby>4月{showFurigana && <rt>がつ</rt>}</ruby><ruby>18日{showFurigana && <rt>nichi</rt>}</ruby> （<ruby>土曜日{showFurigana && <rt>どようび</rt>}</ruby>）</> },
                    { label: "どこで", value: <>あべの<ruby>橋駅{showFurigana && <rt>はしえき</rt>}</ruby>で　<ruby>午前{showFurigana && <rt>ごぜん</rt>}</ruby>　<ruby>7時{showFurigana && <rt>じ</rt>}</ruby><ruby>30分{showFurigana && <rt>ぷん</rt>}</ruby>に　<ruby>会{showFurigana && <rt>あ</rt>}</ruby>います</> },
                    { label: "いくら", value: <>２，５００<ruby>円{showFurigana && <rt>えん</rt>}</ruby>　（<ruby>電車{showFurigana && <rt>でんしゃ</rt>}</ruby>ロープウエー）</> },
                    { label: "持ち物", value: <>お<ruby>弁当{showFurigana && <rt>べんとう</rt>}</ruby>、<ruby>飲{showFurigana && <rt>の</rt>}</ruby>み<ruby>物{showFurigana && <rt>もの</rt>}</ruby></> },
                    { label: "申し込み", value: <><ruby>田中{showFurigana && <rt>たなか</rt>}</ruby> （Tel.194-0873）</> },
                  ].map((item, idx) => (
                    <div key={idx} className="grid grid-cols-[80px_1fr] gap-2">
                      <span className="font-bold text-gray-500">{item.label}</span>
                      <span>：{item.value}</span>
                    </div>
                  ))}
                  <div className="grid grid-cols-[80px_1fr] gap-2 mt-2 pt-2 border-t border-dashed border-gray-200">
                    <Umbrella className="text-primary" size={18} />
                    <span>：<ruby>行{showFurigana && <rt>い</rt>}</ruby>きません</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: PRACTICE SECTION */}
          <div className="lg:col-span-5 space-y-6">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl shadow-soft border border-pink-100 overflow-hidden">
                <div className="bg-pink-100 px-6 py-4 border-b border-pink-200 flex items-center justify-between">
                  <h3 className="font-bold text-primary-dark flex items-center">
                    <ClipboardCheck className="mr-2" size={20} />
                    Luyện tập (Practice)
                  </h3>
                  <span className="text-xs bg-white text-primary px-2 py-1 rounded font-bold">5 Questions</span>
                </div>

                <div className="p-6 space-y-8 font-japanese">
                  <div className="text-sm text-gray-500 italic mb-4">
                    アンさんは　「<ruby>お花見{showFurigana && <rt>はなみ</rt>}</ruby>をしましょう」を　<ruby>読{showFurigana && <rt>よ</rt>}</ruby>みました。<br/>
                    メルさんに　<ruby>会{showFurigana && <rt>あ</rt>}</ruby>いました。
                  </div>

                  {/* Question 1 */}
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-pink-100 text-primary font-bold flex items-center justify-center mr-3 text-sm">Q1</span>
                      <div className="text-gray-800">
                        <p className="mb-2"><span className="font-bold text-primary">アン：</span><ruby>何曜日{showFurigana && <rt>なんようび</rt>}</ruby>ですか。</p>
                        <p><span className="font-bold text-purple-500">メル：</span>（① ___________ ）です。</p>
                      </div>
                    </div>
                    <div className="ml-11 grid grid-cols-1 gap-2">
                      {["日曜日", "土曜日"].map((opt) => (
                        <label key={opt} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-pink-50 cursor-pointer transition-colors group">
                          <input className="form-radio text-primary focus:ring-primary h-4 w-4" name="q1" type="radio"/>
                          <span className="ml-3 text-gray-700 group-hover:text-primary transition-colors">
                            <ruby>{opt}{showFurigana && <rt>{opt === "日曜日" ? "にちようび" : "どようび"}</rt>}</ruby>
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Question 3 (Input type) */}
                  <div className="space-y-3 pt-4 border-t border-dashed border-gray-200">
                    <div className="flex items-start">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-pink-100 text-primary font-bold flex items-center justify-center mr-3 text-sm">Q3</span>
                      <div className="text-gray-800">
                        <p className="mb-2"><span className="font-bold text-primary">アン：</span><ruby>何時{showFurigana && <rt>なんじ</rt>}</ruby>に　<ruby>行{showFurigana && <rt>い</rt>}</ruby>きますか。</p>
                        <p><span className="font-bold text-purple-500">メル：</span>（③ ___________ ）7<ruby>時{showFurigana && <rt>じ</rt>}</ruby>30<ruby>分{showFurigana && <rt>ぷん</rt>}</ruby>に...</p>
                      </div>
                    </div>
                    <div className="ml-11">
                      <input 
                        className="w-full rounded-lg border-gray-300 bg-white text-gray-900 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-20 shadow-sm transition-all" 
                        placeholder="Type your answer here..." 
                        type="text"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t border-gray-100">
                  <button className="text-gray-500 hover:text-gray-700 text-sm font-semibold">Reset</button>
                  <button className="bg-primary hover:bg-pink-600 text-white font-bold py-2 px-6 rounded-lg shadow-lg hover:shadow-primary/50 transition-all transform hover:-translate-y-0.5">
                    Submit Answers
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReadingExercise;