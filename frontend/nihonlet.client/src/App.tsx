import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import GrammarExercisePage from "./pages/GrammarExercisePage";
import GrammarTopicSelectionPage from "./pages/GrammarTopicSelectionPage";
import FlashcardApp from "./pages/Flashcard/FlashcardApp";
import CreateFlashcardSet from "./pages/Flashcard/CreateFlashCardSet";
// import FlashcardLearning from "./pages/Flashcard/FlashCardLearning";
import MyFlashcardLibrary from "./pages/Flashcard/MyFlashcardLibrary";
import FlashcardLearning from "./pages/Flashcard/FlashcardLearning";
import MiniGamePage from "./pages/Minigame/MiniGamePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/grammar" element={<GrammarTopicSelectionPage />} />
        <Route path="/grammar/exercise/:topicId" element={<GrammarExercisePage />} />
        <Route path="/flashcard" element={<FlashcardApp />} />
        <Route path="/createflashcard" element={<CreateFlashcardSet />} />
        <Route path="/flashcardlearning/:id" element={<FlashcardLearning />} />
        <Route path="/myflashcardlibrary" element={<MyFlashcardLibrary />} />
        <Route path="/minigame" element={<MiniGamePage />} />
      </Routes>
    </Router>
  );
}

export default App;
