import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight, Loader2, Lightbulb, BookOpen, Zap, Flame, SkipForward } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface Question {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const QUIZ_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-quiz`;

const QuizPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { session } = useAuth();
  const topicTitle = (location.state as any)?.topicTitle ?? "Quiz";
  const subjectName = (location.state as any)?.subjectName ?? "";

  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizId, setQuizId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timer, setTimer] = useState(0);
  const [streak, setStreak] = useState(0);
  const fetched = useRef(false);

  // Generate quiz
  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    const run = async () => {
      try {
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (session?.access_token) {
          headers["Authorization"] = `Bearer ${session.access_token}`;
        } else {
          headers["Authorization"] = `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`;
        }

        const resp = await fetch(QUIZ_URL, {
          method: "POST",
          headers,
          body: JSON.stringify({ topic: topicTitle, subject: subjectName, count: 5, topicId: id }),
        });
        if (!resp.ok) {
          const err = await resp.json().catch(() => ({}));
          throw new Error(err.error || "Failed to generate quiz");
        }
        const data = await resp.json();
        setQuestions(data.questions ?? []);
        setQuizId(data.quizId ?? null);
        setAnswers(Array(data.questions?.length ?? 0).fill(null));
      } catch (e: any) {
        toast.error(e.message);
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [topicTitle, subjectName, id, session]);

  // Timer
  useEffect(() => {
    if (loading || questions.length === 0) return;
    const interval = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [loading, questions.length]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const handleNext = () => {
    const newAnswers = [...answers];
    newAnswers[current] = selected;
    setAnswers(newAnswers);

    // Track streak
    if (selected !== null && questions[current] && selected === questions[current].correct) {
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
    }

    if (current < questions.length - 1) {
      setCurrent(current + 1);
      setSelected(null);
    } else {
      const score = newAnswers.filter((a, i) => a === questions[i].correct).length;
      navigate(`/quiz/${id}/results`, {
        state: { score, total: questions.length, topicTitle, topicId: id, quizId, questions, answers: newAnswers, timeSeconds: timer },
      });
    }
  };

  const handleSkip = () => {
    const newAnswers = [...answers];
    newAnswers[current] = null;
    setAnswers(newAnswers);
    setStreak(0);
    if (current < questions.length - 1) {
      setCurrent(current + 1);
      setSelected(null);
    } else {
      const score = newAnswers.filter((a, i) => a === questions[i].correct).length;
      navigate(`/quiz/${id}/results`, {
        state: { score, total: questions.length, topicTitle, topicId: id, quizId, questions, answers: newAnswers, timeSeconds: timer },
      });
    }
  };

  const currentXp = answers.slice(0, current).filter((a, i) => a === questions[i]?.correct).length * 10;

  if (loading) {
    return (
      <div className="p-6 md:p-8 max-w-2xl mx-auto flex flex-col items-center justify-center gap-4 py-20">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
        <p className="text-sm text-muted-foreground">Generating quiz questions with AI...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="p-6 md:p-8 max-w-2xl mx-auto text-center py-20">
        <p className="text-muted-foreground">Couldn't generate questions. Please try again.</p>
        <Button onClick={() => navigate("/quiz")} variant="outline" className="mt-4">Back to Topics</Button>
      </div>
    );
  }

  const q = questions[current];
  const letters = ["A", "B", "C", "D"];

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-sm">
          <span className="text-muted-foreground">Topic: <span className="text-foreground font-medium">{topicTitle}</span></span>
          <span className="text-muted-foreground">|</span>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className="font-mono font-medium">{formatTime(timer)} remaining</span>
          </div>
        </div>
        <button
          onClick={() => navigate("/quiz")}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Save & Exit
        </button>
      </div>

      {/* Quiz label + question number */}
      <div>
        <div className="text-xs font-bold text-accent uppercase tracking-wider mb-1">Smart Quiz</div>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">
            Question {current + 1} <span className="text-muted-foreground font-normal text-base">of {questions.length}</span>
          </h1>
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground">Current Score:</span>
            <span className="text-sm font-bold text-accent">{currentXp * 10 + (current + 1) * 150} XP</span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
      </div>

      {/* Question card */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-6">
        <p className="text-foreground font-medium text-lg leading-relaxed">{q.question}</p>
        <div className="space-y-3">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`w-full text-left px-5 py-4 rounded-xl border text-sm transition-all ${
                selected === i
                  ? "bg-[hsl(var(--navy))] text-[hsl(var(--highlight))] border-[hsl(var(--navy))] shadow-sm"
                  : "bg-background border-border text-foreground hover:border-accent/40"
              }`}
            >
              <span className={`inline-flex h-7 w-7 rounded-full border items-center justify-center text-xs font-bold mr-4 ${
                selected === i ? "border-[hsl(var(--highlight))]" : "border-muted-foreground/30"
              }`}>
                {letters[i]}
              </span>
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <Lightbulb className="h-4 w-4" />
          Ask AI for Hint
        </button>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleSkip}
            className="gap-2"
          >
            Skip
          </Button>
          <Button
            onClick={handleNext}
            disabled={selected === null}
            className="bg-[hsl(var(--navy))] text-[hsl(var(--highlight))] hover:bg-[hsl(var(--navy))]/90 font-semibold gap-2 px-6"
          >
            {current < questions.length - 1 ? "Submit Answer" : "Submit Answer"}
          </Button>
        </div>
      </div>

      {/* Bottom info cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
            <BookOpen className="h-3.5 w-3.5" /> Related Material
          </div>
          <p className="text-xs text-muted-foreground italic">
            Related study content will appear here based on the current question topic.
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
            <Flame className="h-3.5 w-3.5" /> Learning Streak
          </div>
          {streak > 0 ? (
            <p className="text-sm font-bold text-accent">🔥 {streak} correct in a row!</p>
          ) : (
            <p className="text-xs text-muted-foreground">Answer correctly to build a streak!</p>
          )}
        </div>
      </div>

      {/* Keyboard shortcuts */}
      <div className="flex items-center justify-center gap-6 text-[10px] text-muted-foreground uppercase tracking-wider">
        <span>1-4 Select</span>
        <span>Enter Submit</span>
        <span>H Hint</span>
      </div>
    </div>
  );
};

export default QuizPage;
