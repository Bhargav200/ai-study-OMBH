import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, Pause, Square, Timer } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const StudyTimerPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [saving, setSaving] = useState(false);
  const interval = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAt = useRef<string | null>(null);

  const { data: streak } = useQuery({
    queryKey: ["streak", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase.from("user_streaks").select("*").eq("user_id", user.id).maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (running) {
      if (!startedAt.current) startedAt.current = new Date().toISOString();
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

  const xpEarned = Math.floor(seconds / 60) * 5;

  const handleStop = async () => {
    setRunning(false);
    if (!user || seconds < 10) {
      navigate("/timer/summary", { state: { duration: seconds, xp: 0, streak: streak?.current_streak ?? 0 } });
      return;
    }

    setSaving(true);
    const now = new Date().toISOString();
    const xp = xpEarned;

    // Save session
    await supabase.from("study_sessions").insert({
      user_id: user.id,
      started_at: startedAt.current || now,
      ended_at: now,
      duration_seconds: seconds,
      xp_awarded: xp,
    });

    // Award XP
    if (xp > 0) {
      await supabase.from("xp_logs").insert({
        user_id: user.id,
        source_type: "study_session",
        xp_amount: xp,
      });
    }

    // Update streak
    const today = new Date().toISOString().split("T")[0];
    const lastDate = streak?.last_study_date;
    let newStreak = 1;
    if (lastDate) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];
      if (lastDate === today) {
        newStreak = streak?.current_streak ?? 1;
      } else if (lastDate === yesterdayStr) {
        newStreak = (streak?.current_streak ?? 0) + 1;
      }
    }
    const longestStreak = Math.max(newStreak, streak?.longest_streak ?? 0);

    await supabase.from("user_streaks").update({
      current_streak: newStreak,
      longest_streak: longestStreak,
      last_study_date: today,
    }).eq("user_id", user.id);

    setSaving(false);
    navigate("/timer/summary", { state: { duration: seconds, xp, streak: newStreak } });
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

      <div className="flex gap-3">
        {!running ? (
          <Button onClick={() => setRunning(true)} disabled={saving} className="gap-2 bg-navy text-highlight hover:bg-navy/90 font-semibold px-8 h-11">
            <Play className="h-4 w-4" /> {seconds > 0 ? "Resume" : "Start"}
          </Button>
        ) : (
          <Button onClick={() => setRunning(false)} variant="outline" className="gap-2 px-8 h-11">
            <Pause className="h-4 w-4" /> Pause
          </Button>
        )}
        {seconds > 0 && (
          <Button onClick={handleStop} disabled={saving} variant="outline" className="gap-2 px-8 h-11 border-destructive text-destructive hover:bg-destructive/10">
            <Square className="h-4 w-4" /> {saving ? "Saving..." : "Stop"}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <div className="text-lg font-bold text-foreground">+{xpEarned}</div>
          <div className="text-xs text-muted-foreground mt-0.5">XP Earned</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <div className="text-lg font-bold text-foreground">{streak?.current_streak ?? 0}</div>
          <div className="text-xs text-muted-foreground mt-0.5">Day Streak</div>
        </div>
      </div>
    </div>
  );
};

export default StudyTimerPage;
