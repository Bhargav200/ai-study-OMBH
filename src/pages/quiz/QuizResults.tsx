import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trophy, RotateCcw, ArrowRight, Target, TrendingUp } from "lucide-react";

const QuizResults = () => {
  const { state } = useLocation();
  const score = state?.score ?? 2;
  const total = state?.total ?? 3;
  const pct = Math.round((score / total) * 100);

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <div className="inline-flex h-16 w-16 rounded-2xl bg-secondary items-center justify-center">
          <Trophy className={`h-8 w-8 ${pct >= 70 ? "text-accent" : "text-muted-foreground"}`} />
        </div>
        <h1 className="text-2xl font-bold text-foreground">
          {pct >= 80 ? "Excellent!" : pct >= 50 ? "Good effort!" : "Keep practicing!"}
        </h1>
        <p className="text-muted-foreground text-sm">You completed the Quadratic Equations quiz</p>
      </div>

      {/* Score card */}
      <div className="bg-card border border-border rounded-xl p-6 text-center">
        <div className="text-5xl font-bold text-accent">{pct}%</div>
        <div className="text-sm text-muted-foreground mt-2">{score} out of {total} correct</div>
        <div className="h-2 bg-muted rounded-full overflow-hidden mt-4 max-w-xs mx-auto">
          <div className="h-full bg-accent rounded-full" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Target, label: "Accuracy", value: `${pct}%` },
          { icon: TrendingUp, label: "XP Earned", value: "+50" },
          { icon: Trophy, label: "Best Score", value: `${pct}%` },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4 text-center">
            <s.icon className="h-4 w-4 text-accent mx-auto mb-2" />
            <div className="text-lg font-bold text-foreground">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Weak topics */}
      {pct < 100 && (
        <div className="bg-secondary/50 border border-accent/10 rounded-xl p-5">
          <div className="text-sm font-semibold text-foreground mb-2">Topics to Review</div>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• Discriminant properties</li>
            <li>• Sum and product of roots</li>
          </ul>
        </div>
      )}

      <div className="flex gap-3">
        <Link to="/quiz" className="flex-1">
          <Button variant="outline" className="w-full gap-2">
            <RotateCcw className="h-4 w-4" /> Retry
          </Button>
        </Link>
        <Link to="/dashboard" className="flex-1">
          <Button className="w-full bg-navy text-highlight hover:bg-navy/90 gap-2">
            Dashboard <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default QuizResults;
