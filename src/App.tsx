import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ProfileSetup from "./pages/onboarding/ProfileSetup";
import LearningGoals from "./pages/onboarding/LearningGoals";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import LessonList from "./pages/lessons/LessonList";
import LessonViewer from "./pages/lessons/LessonViewer";
import DoubtInput from "./pages/doubts/DoubtInput";
import AISolution from "./pages/doubts/AISolution";
import TopicSelection from "./pages/quiz/TopicSelection";
import QuizPage from "./pages/quiz/QuizPage";
import QuizResults from "./pages/quiz/QuizResults";
import StudyTimerPage from "./pages/timer/StudyTimer";
import SessionSummary from "./pages/timer/SessionSummary";
import MaterialUpload from "./pages/materials/MaterialUpload";
import AILearning from "./pages/materials/AILearning";
import ProgressDashboard from "./pages/progress/ProgressDashboard";
import Leaderboard from "./pages/social/Leaderboard";
import Friends from "./pages/social/Friends";
import Achievements from "./pages/social/Achievements";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/onboarding/profile" element={<ProfileSetup />} />
          <Route path="/onboarding/goals" element={<LearningGoals />} />

          {/* App screens with sidebar layout */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/lessons" element={<LessonList />} />
            <Route path="/lessons/:id" element={<LessonViewer />} />
            <Route path="/doubts" element={<DoubtInput />} />
            <Route path="/doubts/solution" element={<AISolution />} />
            <Route path="/quiz" element={<TopicSelection />} />
            <Route path="/quiz/:id" element={<QuizPage />} />
            <Route path="/quiz/:id/results" element={<QuizResults />} />
            <Route path="/timer" element={<StudyTimerPage />} />
            <Route path="/timer/summary" element={<SessionSummary />} />
            <Route path="/materials" element={<MaterialUpload />} />
            <Route path="/materials/learn" element={<AILearning />} />
            <Route path="/progress" element={<ProgressDashboard />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
