import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Check, X, Loader2, Award } from 'lucide-react';

const GrammarExercisePage = () => {
    // 1. Đổi topicId thành exerciseId cho đúng ý nghĩa (ID của bài tập)
    const { exerciseId } = useParams(); 
    const [exercise, setExercise] = useState<any>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                // 2. Sửa URL: Gọi trực tiếp vào ID bài tập
                const res = await fetch(`/api/GrammarExercises/${exerciseId}`);
                if (res.ok) {
                    setExercise(await res.json());
                } else {
                    console.error("Lỗi fetch bài tập:", res.status);
                }
            } catch (err) {
                console.error("Lỗi kết nối:", err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [exerciseId]);

    const handleCheck = async () => {
    if (selectedId === null) return;
    setIsSubmitting(true);
    try {
        const res = await fetch('/api/GrammarExercises/submit-answer', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json' 
            },
            body: JSON.stringify({
                questionId: exercise.questions[currentIndex].id,
                selectedOptionId: selectedId,
                userId: "3fa85f64-5717-4562-b3fc-2c963f66afa6" 
            })
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error("Server Error:", errorText);
            alert("Lỗi server khi gửi đáp án!");
            return;
        }

        const data = await res.json();
        setResult(data);
        if (data.isCorrect) setScore(s => s + 1);
    } catch (err) {
        console.error("Network Error:", err);
    } finally {
        setIsSubmitting(false);
    }
};

    if (loading) return <div className="h-screen flex items-center justify-center text-pink-500 font-bold">Đang tải bài tập...</div>;
    if (!exercise) return <div className="p-10 text-center">Không tìm thấy dữ liệu.</div>;

    if (isFinished) return (
        <div className="min-h-screen bg-[#FFF5F7] flex items-center justify-center p-4">
            <div className="bg-white p-10 rounded-[40px] shadow-2xl text-center max-w-sm w-full border border-pink-50">
                <div className="w-20 h-20 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="text-white" size={40} />
                </div>
                <h2 className="text-2xl font-bold mb-2">Hoàn thành!</h2>
                <p className="text-gray-500 mb-6">Bạn đạt được {score}/{exercise.questions.length} câu đúng</p>
                <button onClick={() => window.location.reload()} className="w-full py-3 bg-pink-500 text-white rounded-xl font-bold">Làm lại</button>
                <Link to="/grammar" className="block mt-4 text-gray-400">Về danh sách</Link>
            </div>
        </div>
    );

    const q = exercise.questions[currentIndex];

    return (
        <div className="min-h-screen bg-[#FFF5F7] p-6 font-literata">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8 flex items-center justify-between">
                    <Link to="/grammar" className="flex items-center text-gray-600 font-bold hover:text-pink-600">
                        <ArrowLeft className="mr-2" /> {exercise.title}
                    </Link>
                    <span className="text-sm font-bold text-pink-400">CÂU {currentIndex + 1} / {exercise.questions.length}</span>
                </div>

                <div className="bg-white rounded-3xl p-8 shadow-xl shadow-pink-100/50 border border-pink-50">
                    <h3 className="text-2xl font-bold text-gray-800 mb-8">{q.questionText}</h3>
                    
                    <div className="space-y-4">
                        {q.options.map((opt: any) => {
                            const isSelected = selectedId === opt.id;
                            const isCorrect = result?.correctOptionId === opt.id;
                            const isWrong = isSelected && result && !result.isCorrect;

                            let style = "border-gray-100 hover:border-pink-200 bg-white";
                            if (isSelected) style = "border-pink-500 bg-pink-50 ring-1 ring-pink-500";
                            if (result) {
                                if (isCorrect) style = "border-green-500 bg-green-50 ring-1 ring-green-500";
                                else if (isWrong) style = "border-red-500 bg-red-50 ring-1 ring-red-500";
                                else style = "opacity-50 border-gray-100";
                            }

                            return (
                                <button key={opt.id} disabled={!!result} onClick={() => setSelectedId(opt.id)}
                                    className={`w-full p-4 text-left border-2 rounded-2xl transition-all flex items-center ${style}`}>
                                    <span className={`w-8 h-8 flex items-center justify-center rounded-lg mr-4 font-bold ${isSelected ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                        {opt.label}
                                    </span>
                                    <span className="text-lg font-medium text-gray-700">{opt.content}</span>
                                    {result && isCorrect && <Check className="ml-auto text-green-500" />}
                                    {result && isWrong && <X className="ml-auto text-red-500" />}
                                </button>
                            );
                        })}
                    </div>

                    {result && (
                        <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-2xl animate-in fade-in slide-in-from-bottom-2">
                            <p className="text-blue-700 text-sm"><strong>💡 Giải thích:</strong> {result.explanation}</p>
                        </div>
                    )}

                    <div className="mt-10 flex justify-end">
                        {!result ? (
                            <button onClick={handleCheck} disabled={selectedId === null || isSubmitting}
                                className="px-12 py-3 bg-pink-500 text-white rounded-2xl font-bold shadow-lg shadow-pink-200 disabled:bg-gray-200 flex items-center">
                                {isSubmitting && <Loader2 className="animate-spin mr-2" />} Kiểm tra
                            </button>
                        ) : (
                            <button onClick={() => currentIndex < exercise.questions.length - 1 ? (setCurrentIndex(c => c+1), setSelectedId(null), setResult(null)) : setIsFinished(true)}
                                className="px-12 py-3 bg-gray-800 text-white rounded-2xl font-bold hover:bg-black">
                                Tiếp theo
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GrammarExercisePage;