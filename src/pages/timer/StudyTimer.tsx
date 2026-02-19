import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, Pause, Square, Timer } from "lucide-react";

const StudyTimerPage = () => {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const interval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (running) {
      interval.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else if (interval.current) {
      clearInterval(interval.current);
    }
    return () => { if (interval.current) clearInterval(interval.current); };
  }, [running]);

  const fmt = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const handleStop = () => {
    setRunning(false);
    navigate("/timer/summary", { state: { duration: seconds } });
  };

  return (
    <div className="p-6 md:p-8 max-w-lg mx-auto space-y-8 flex flex-col items-center justify-center min-h-[70vh]">
      <div className="text-center space-y-2">
        <div className="inline-flex h-12 w-12 rounded-2xl bg-secondary items-center justify-center">
          <Timer className="h-6 w-6 text-navy" />
        </div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Study Timer</h1>
        <p className="text-muted-foreground text-sm">Stay focused and earn XP</p>
      </div>

      {/* Timer display */}
      <div className="relative">
        <div className="h-52 w-52 rounded-full border-4 border-border flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl font-mono font-bold text-foreground tracking-wider">{fmt(seconds)}</div>
            <div className="text-xs text-muted-foreground mt-1">{running ? "Studying..." : seconds > 0 ? "Paused" : "Ready"}</div>
          </div>
        </div>
        {running && (
          <div className="absolute inset-0 rounded-full border-4 border-accent animate-pulse" />
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        {!running ? (
          <Button onClick={() => setRunning(true)} className="gap-2 bg-navy text-highlight hover:bg-navy/90 font-semibold px-8 h-11">
            <Play className="h-4 w-4" /> {seconds > 0 ? "Resume" : "Start"}
          </Button>
        ) : (
          <Button onClick={() => setRunning(false)} variant="outline" className="gap-2 px-8 h-11">
            <Pause className="h-4 w-4" /> Pause
          </Button>
        )}
        {seconds > 0 && (
          <Button onClick={handleStop} variant="outline" className="gap-2 px-8 h-11 border-destructive text-destructive hover:bg-destructive/10">
            <Square className="h-4 w-4" /> Stop
          </Button>
        )}
      </div>

      {/* Session info */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <div className="text-lg font-bold text-foreground">+{Math.floor(seconds / 60) * 5}</div>
          <div className="text-xs text-muted-foreground mt-0.5">XP Earned</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <div className="text-lg font-bold text-foreground">7</div>
          <div className="text-xs text-muted-foreground mt-0.5">Day Streak</div>
        </div>
      </div>
    </div>
  );
};

export default StudyTimerPage;
