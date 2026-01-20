import { BookOpen, BarChart2, MessageCircle, Mic, Layers, Edit3 } from "lucide-react";

export const FEATURE_ITEMS = [
  {
    id: 1,
    title: "Thống Kê",
    description: "Theo dõi tiến độ học tập.",
    icon: BarChart2,
    color: "bg-yellow-100 text-yellow-600",
    path: "/statistics",
  },
  {
    id: 2,
    title: "Đọc hiểu",
    description: "Kho sách và bài đọc.",
    icon: BookOpen,
    color: "bg-blue-100 text-blue-600",
    path: "/reading",
  },
  {
    id: 3,
    title: "Flashcard",
    description: "Học từ vựng nhanh.",
    icon: Layers,
    color: "bg-green-100 text-green-600",
    path: "/flashcard",
  },
  {
    id: 4,
    title: "Hội thoại AI",
    description: "Luyện giao tiếp phản xạ.",
    icon: MessageCircle,
    color: "bg-purple-100 text-purple-600",
    path: "/chat-ai",
  },
  {
    id: 5,
    title: "Ngữ Pháp",
    description: "Tổng hợp ngữ pháp JLPT.",
    icon: Edit3,
    color: "bg-orange-100 text-orange-600",
    path: "/grammar",
  },
  {
    id: 6,
    title: "Phát Âm",
    description: "Chấm điểm phát âm.",
    icon: Mic,
    color: "bg-red-100 text-red-600",
    path: "/speaking",
  },
];
