import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight } from "lucide-react";

const questions = [
  {
    question: "What is the discriminant of a quadratic equation ax² + bx + c = 0?",
    options: ["b² - 4ac", "b² + 4ac", "2a/b", "4ac - b²"],
    correct: 0,
  },
  {
    question: "If the discriminant is negative, the equation has:",
    options: ["Two real roots", "One real root", "No real roots", "Infinite roots"],
    correct: 2,
  },
  {
    question: "The sum of roots of ax² + bx + c = 0 is:",
    options: ["b/a", "-b/a", "c/a", "-c/a"],
    correct: 1,
  },
];

const QuizPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));

  const q = questions[current];

  const handleNext = () => {
    const newAnswers = [...answers];
    newAnswers[current] = selected;
    setAnswers(newAnswers);
    if (current < questions.length - 1) {
      setCurrent(current + 1);
      setSelected(null);
    } else {
      const score = newAnswers.filter((a, i) => a === questions[i].correct).length;
      navigate(`/quiz/${id}/results`, { state: { score, total: questions.length } });
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-muted-foreground">Quadratic Equations</div>
          <h1 className="text-lg font-bold text-foreground">Question {current + 1} of {questions.length}</h1>
        </div>
        <div className="flex items-center gap-2 bg-secondary px-3 py-1.5 rounded-lg">
          <Clock className="h-4 w-4 text-navy" />
          <span className="text-sm font-mono font-bold text-navy">04:32</span>
        </div>
      </div>

      {/* Progress */}
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
      </div>

      {/* Question */}
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
