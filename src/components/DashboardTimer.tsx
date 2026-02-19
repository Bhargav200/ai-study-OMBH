import { useState, useEffect, useRef } from "react";
import { Timer, Square } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const DashboardTimer = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(true);
  const interval = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAt = useRef<string>(new Date().toISOString());

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
      interval.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else if (interval.current) {
      clearInterval(interval.current);
    }
    return () => { if (interval.current) clearInterval(interval.current); };
  }, [running]);

  // Auto-save on unmount
  useEffect(() => {
    return () => {
      // We can't async in cleanup, so we fire-and-forget
      if (seconds > 10 && user) {
        saveSession(seconds);
      }
    };
  }, []);

  const fmt = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const saveSession = async (dur: number) => {
    if (!user || dur < 10) return;
    const now = new Date().toISOString();
    const xp = Math.floor(dur / 60) * 5;

    await supabase.from("study_sessions").insert({
      user_id: user.id,
      started_at: startedAt.current,
      ended_at: now,
      duration_seconds: dur,
      xp_awarded: xp,
    });

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

    await supabase.from("user_streaks").update({
      current_streak: newStreak,
      longest_streak: Math.max(newStreak, streak?.longest_streak ?? 0),
      last_study_date: today,
    }).eq("user_id", user.id);

    queryClient.invalidateQueries({ queryKey: ["streak"] });
    queryClient.invalidateQueries({ queryKey: ["xp"] });
  };

  const handleStop = async () => {
    setRunning(false);
    if (interval.current) clearInterval(interval.current);
    await saveSession(seconds);
    toast.success(`Session saved! +${Math.floor(seconds / 60) * 5} XP`);
    setSeconds(0);
    startedAt.current = new Date().toISOString();
  };

  const xpEarned = Math.floor(seconds / 60) * 5;

  return (
    <div className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-2">
      <Timer className={`h-4 w-4 ${running ? "text-accent animate-pulse" : "text-muted-foreground"}`} />
      <span className="font-mono text-sm font-bold text-foreground tabular-nums">{fmt(seconds)}</span>
      {xpEarned > 0 && (
        <span className="text-xs text-accent font-medium">+{xpEarned} XP</span>
      )}
      {running && seconds > 10 && (
        <button
          onClick={handleStop}
          className="ml-1 p-1 rounded-md hover:bg-destructive/10 text-destructive transition-colors"
          title="Stop & save session"
        >
          <Square className="h-3.5 w-3.5" />
        </button>
      )}
      {!running && (
        <button
          onClick={() => { setRunning(true); startedAt.current = new Date().toISOString(); }}
          className="text-xs text-accent hover:underline font-medium"
        >
          Restart
        </button>
      )}
    </div>
  );
};

export default DashboardTimer;
