import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import GrammarExercisePage from "./pages/GrammarExercisePage";
import GrammarTopicSelectionPage from "./pages/GrammarTopicSelectionPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/grammar" element={<GrammarTopicSelectionPage />} />
        <Route path="/grammar/exercise/:exerciseId" element={<GrammarExercisePage />} />
      </Routes>
    </Router>
  );
}

export default App;
