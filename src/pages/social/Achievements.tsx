import { Trophy, Star, Flame, Target, Zap, BookOpen, Medal, Award } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

const Achievements = () => {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["achievements", user?.id],
    queryFn: async () => {
      if (!user) return null;

      const [xpRes, streakRes, quizRes, progressRes] = await Promise.all([
        supabase.from("xp_logs").select("xp_amount").eq("user_id", user.id),
        supabase.from("user_streaks").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("quiz_attempts").select("score, total_questions").eq("user_id", user.id),
        supabase.from("user_lesson_progress").select("completed").eq("user_id", user.id).eq("completed", true),
      ]);

      const totalXp = (xpRes.data ?? []).reduce((s, r) => s + r.xp_amount, 0);
      const streak = streakRes.data;
      const quizzes = quizRes.data ?? [];
      const lessonsCompleted = progressRes.data?.length ?? 0;
      const perfectQuizzes = quizzes.filter((q) => q.score === q.total_questions && q.total_questions > 0).length;
      const high90 = quizzes.filter((q) => q.total_questions > 0 && (q.score / q.total_questions) >= 0.9).length;

      // Level calc: 200 XP per level
      const level = Math.floor(totalXp / 200) + 1;
      const xpInLevel = totalXp % 200;
      const xpForNext = 200;

      const levelTitle =
        level >= 10 ? "Legend" : level >= 7 ? "Master" : level >= 5 ? "Scholar" : level >= 3 ? "Rising Star" : "Beginner";

      return { totalXp, level, xpInLevel, xpForNext, levelTitle, streak, quizCount: quizzes.length, perfectQuizzes, high90, lessonsCompleted };
    },
    enabled: !!user,
  });

  const badges = [
    { icon: Flame, name: "7-Day Streak", desc: "Study 7 days in a row", earned: (data?.streak?.longest_streak ?? 0) >= 7, progress: data?.streak?.current_streak, total: 7 },
    { icon: Trophy, name: "Quiz Master", desc: "Complete 50 quizzes", earned: (data?.quizCount ?? 0) >= 50, progress: data?.quizCount, total: 50 },
    { icon: Star, name: "Perfect Score", desc: "Get 100% on a quiz", earned: (data?.perfectQuizzes ?? 0) >= 1 },
    { icon: Target, name: "Sharp Shooter", desc: "90%+ on 10 quizzes", earned: (data?.high90 ?? 0) >= 10, progress: data?.high90, total: 10 },
    { icon: BookOpen, name: "Bookworm", desc: "Complete 20 lessons", earned: (data?.lessonsCompleted ?? 0) >= 20, progress: data?.lessonsCompleted, total: 20 },
    { icon: Zap, name: "XP Hunter", desc: "Earn 1,000 XP", earned: (data?.totalXp ?? 0) >= 1000, progress: data?.totalXp, total: 1000 },
    { icon: Medal, name: "First Quiz", desc: "Complete your first quiz", earned: (data?.quizCount ?? 0) >= 1 },
    { icon: Award, name: "30-Day Streak", desc: "Study 30 days in a row", earned: (data?.streak?.longest_streak ?? 0) >= 30, progress: data?.streak?.current_streak, total: 30 },
  ];

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-20 w-full rounded-xl" />
        <div className="grid sm:grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Trophy className="h-6 w-6 text-accent" />
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Achievements</h1>
          <p className="text-muted-foreground text-sm">Collect badges and milestones</p>
        </div>
      </div>

      {/* XP progress */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-foreground">Level {data?.level} — {data?.levelTitle}</span>
          <span className="text-xs text-accent font-bold">{data?.xpInLevel} / {data?.xpForNext} XP</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${((data?.xpInLevel ?? 0) / (data?.xpForNext ?? 200)) * 100}%` }} />
        </div>
        <div className="text-xs text-muted-foreground mt-2">{(data?.xpForNext ?? 200) - (data?.xpInLevel ?? 0)} XP to Level {(data?.level ?? 1) + 1} · Total: {data?.totalXp?.toLocaleString()} XP</div>
      </div>

      {/* Badge grid */}
      <div className="grid sm:grid-cols-2 gap-3">
        {badges.map((b) => (
          <div
            key={b.name}
            className={`bg-card border rounded-xl p-5 transition-colors ${
              b.earned ? "border-accent/30" : "border-border opacity-60"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                b.earned ? "bg-secondary" : "bg-muted"
              }`}>
                <b.icon className={`h-6 w-6 ${b.earned ? "text-accent" : "text-muted-foreground"}`} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-foreground">{b.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{b.desc}</div>
                {!b.earned && b.progress !== undefined && b.total !== undefined && (
                  <div className="mt-2">
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-accent rounded-full" style={{ width: `${Math.min((b.progress / b.total) * 100, 100)}%` }} />
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{Math.min(b.progress, b.total)}/{b.total}</div>
                  </div>
                )}
                {b.earned && (
                  <span className="inline-block mt-2 text-xs font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-full">Earned ✓</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
