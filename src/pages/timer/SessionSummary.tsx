import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Flame, Zap, ArrowRight, BookOpen } from "lucide-react";

const SessionSummary = () => {
  const { state } = useLocation();
  const duration = state?.duration ?? 0;
  const mins = Math.floor(duration / 60);
  const xp = mins * 5;

  return (
    <div className="p-6 md:p-8 max-w-lg mx-auto space-y-6 flex flex-col items-center justify-center min-h-[70vh]">
      <div className="text-center space-y-4">
        <div className="inline-flex h-16 w-16 rounded-2xl bg-secondary items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-accent" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Session Complete!</h1>
        <p className="text-muted-foreground text-sm">Great focus session. Keep it up!</p>
      </div>

      <div className="grid grid-cols-3 gap-4 w-full">
        {[
          { icon: BookOpen, label: "Duration", value: `${mins}m` },
          { icon: Zap, label: "XP Earned", value: `+${xp}` },
          { icon: Flame, label: "Streak", value: "7 days" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4 text-center">
            <s.icon className="h-5 w-5 text-accent mx-auto mb-2" />
            <div className="text-lg font-bold text-foreground">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 w-full">
        <Link to="/timer" className="flex-1">
          <Button variant="outline" className="w-full">Study Again</Button>
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

export default SessionSummary;
