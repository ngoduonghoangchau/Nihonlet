import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthInitializer from './components/AuthInitializer';
import ProtectedRoute from './components/ProtectedRoute';

// 1. NHÓM TÀI KHOẢN & HỆ THỐNG
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

// 2. NHÓM FLASHCARDS (THẺ TỪ VỰNG)
import CreateFlashcard from './pages/CreateFlashcard';
import StudySession from './pages/StudySession';

// 3. NHÓM NGỮ PHÁP (GRAMMAR)
import GrammarLibrary from './pages/GrammarLibrary';
import GrammarQuiz from './pages/GrammarQuiz';
import QuizResults from './pages/QuizResults';

// 4. NHÓM TRÒ CHƠI (MINIGAMES)
import MinigameHub from './pages/MinigameHub';
import MinigameSelect from './pages/MinigameSelect';
import MatchingGame1 from './pages/MatchingGame1';
import MatchingGame2 from './pages/MatchingGame2';
import RewritingGame from './pages/RewritingGame';
import RewritingResults from './pages/RewritingResults';

// 5. NHÓM ĐỌC HIỂU (READING)
import ReadingTopic from './pages/ReadingTopics';
import ReadingLevel from './pages/ReadingLevel';
import ReadingList from './pages/ReadingList';
import ReadingExercise from './pages/ReadingExercise';
import ReadingResults from './pages/ReadingResults';

// 6. NHÓM THANH TOÁN (PREMIUM)
import Pricing from './pages/Pricing';
import PremiumCheckout from './pages/PremiumCheckout';

const App: React.FC = () => {
  return (
    <Router>
      <AuthInitializer>
        <Routes>
          {/* === PUBLIC ROUTES (No Auth Required) === */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* === PROTECTED ROUTES (Auth Required) === */}
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

          {/* === FLASHCARDS === */}
          <Route path="/create-flashcard" element={<ProtectedRoute><CreateFlashcard /></ProtectedRoute>} />
          <Route path="/study-session" element={<ProtectedRoute><StudySession /></ProtectedRoute>} />

          {/* === GRAMMAR === */}
          <Route path="/grammar-library" element={<ProtectedRoute><GrammarLibrary /></ProtectedRoute>} />
          <Route path="/grammar-quiz" element={<ProtectedRoute><GrammarQuiz /></ProtectedRoute>} />
          <Route path="/quiz-results" element={<ProtectedRoute><QuizResults /></ProtectedRoute>} />

          {/* === MINIGAMES === */}
          <Route path="/minigameHub" element={<ProtectedRoute><MinigameHub /></ProtectedRoute>} />
          <Route path="/minigameSelect" element={<ProtectedRoute><MinigameSelect /></ProtectedRoute>} />
          <Route path="/matchinggame1" element={<ProtectedRoute><MatchingGame1 /></ProtectedRoute>} />
          <Route path="/matchinggame2" element={<ProtectedRoute><MatchingGame2 /></ProtectedRoute>} />
          <Route path="/rewritinggame" element={<ProtectedRoute><RewritingGame /></ProtectedRoute>} />
          <Route path="/rewriting-results" element={<ProtectedRoute><RewritingResults /></ProtectedRoute>} />

          {/* === READING PRACTICE === */}
          <Route path="/reading-topic" element={<ProtectedRoute><ReadingTopic /></ProtectedRoute>} />
          <Route path="/reading-level" element={<ProtectedRoute><ReadingLevel /></ProtectedRoute>} />
          <Route path="/reading-list" element={<ProtectedRoute><ReadingList /></ProtectedRoute>} />
          <Route path="/reading-exercise" element={<ProtectedRoute><ReadingExercise /></ProtectedRoute>} />
          <Route path="/reading-result" element={<ProtectedRoute><ReadingResults /></ProtectedRoute>} />

          {/* === PREMIUM & PAYMENT === */}
          <Route path="/pricing" element={<ProtectedRoute><Pricing /></ProtectedRoute>} />
          <Route path="/premium-checkout" element={<ProtectedRoute><PremiumCheckout /></ProtectedRoute>} />

          {/* === FALLBACK (404 - Redirect về Login nếu chưa auth, Dashboard nếu đã auth) === */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthInitializer>
    </Router>
  );
};

export default App;