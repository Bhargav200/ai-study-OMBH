import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight, Loader2 } from "lucide-react";
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

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-muted-foreground">{topicTitle}</div>
          <h1 className="text-lg font-bold text-foreground">Question {current + 1} of {questions.length}</h1>
        </div>
        <div className="flex items-center gap-2 bg-secondary px-3 py-1.5 rounded-lg">
          <Clock className="h-4 w-4 text-navy" />
          <span className="text-sm font-mono font-bold text-navy">{formatTime(timer)}</span>
        </div>
      </div>

      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-5">
        <p className="text-foreground font-medium">{q.question}</p>
        <div className="space-y-3">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`w-full text-left px-5 py-4 rounded-xl border text-sm font-medium transition-colors ${
                selected === i
                  ? "bg-navy text-highlight border-navy"
                  : "bg-background border-border text-foreground hover:border-accent/50"
              }`}
            >
              <span className="inline-flex h-6 w-6 rounded-full border border-current items-center justify-center text-xs mr-3">
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          ))}
        </div>
      </div>

      <Button
        onClick={handleNext}
        disabled={selected === null}
        className="w-full h-11 bg-navy text-highlight hover:bg-navy/90 font-semibold gap-2"
      >
        {current < questions.length - 1 ? <>Next Question <ArrowRight className="h-4 w-4" /></> : "Submit Quiz"}
      </Button>
    </div>
  );
};

export default QuizPage;
