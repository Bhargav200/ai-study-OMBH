import { User, Zap, Trophy, BookOpen, Clock, Flame, Target, Settings, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  const { data: stats } = useQuery({
    queryKey: ["profile-stats", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const [xpRes, streakRes, quizRes, progressRes, sessionRes, badgeRes] = await Promise.all([
        supabase.from("xp_logs").select("xp_amount").eq("user_id", user.id),
        supabase.from("user_streaks").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("quiz_attempts").select("id").eq("user_id", user.id),
        supabase.from("user_lesson_progress").select("id").eq("user_id", user.id).eq("completed", true),
        supabase.from("study_sessions").select("duration_seconds").eq("user_id", user.id),
        supabase.from("user_achievements").select("achievement_id, achievements(name, icon)").eq("user_id", user.id).limit(3),
      ]);
      const totalXp = (xpRes.data ?? []).reduce((s, r) => s + r.xp_amount, 0);
      const totalStudySeconds = (sessionRes.data ?? []).reduce((s, r) => s + r.duration_seconds, 0);
      return {
        totalXp,
        level: Math.floor(totalXp / 200) + 1,
        streak: streakRes.data,
        quizCount: quizRes.data?.length ?? 0,
        lessonsCompleted: progressRes.data?.length ?? 0,
        studyHours: (totalStudySeconds / 3600).toFixed(1),
        badges: badgeRes.data ?? [],
        badgeCount: badgeRes.data?.length ?? 0,
      };
    },
    enabled: !!user,
  });

  const displayName = profile?.full_name ?? "Student";
  const gradeLevel = profile?.grade_level ?? "—";

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
        <span>›</span>
        <span className="text-foreground font-medium">Profile</span>
      </div>

      {/* Profile header */}
      <div className="bg-card border border-border rounded-xl p-6 flex flex-col sm:flex-row items-center gap-6">
        <div className="h-20 w-20 rounded-full bg-[hsl(var(--navy))] flex items-center justify-center">
          <User className="h-10 w-10 text-[hsl(var(--highlight))]" />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-xl font-bold text-foreground">{displayName}</h1>
          <p className="text-sm text-muted-foreground">{gradeLevel} · {profile?.study_preference ?? "Student"}</p>
          <div className="flex items-center gap-4 mt-3 justify-center sm:justify-start">
            <div className="flex items-center gap-1">
              <Zap className="h-4 w-4 text-accent" />
              <span className="text-sm font-bold text-foreground">{(stats?.totalXp ?? 0).toLocaleString()} XP</span>
            </div>
            <div className="flex items-center gap-1">
              <Trophy className="h-4 w-4 text-accent" />
              <span className="text-sm font-bold text-foreground">Level {stats?.level ?? 1}</span>
            </div>
            <div className="flex items-center gap-1">
              <Flame className="h-4 w-4 text-destructive" />
              <span className="text-sm font-bold text-foreground">{stats?.streak?.current_streak ?? 0} days</span>
            </div>
          </div>
        </div>
        <Link to="/settings">
          <Button variant="outline" size="sm" className="gap-2">
            <Settings className="h-4 w-4" /> Edit
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: Clock, label: "Study Hours", value: `${stats?.studyHours ?? "0"}h` },
          { icon: BookOpen, label: "Lessons Done", value: String(stats?.lessonsCompleted ?? 0) },
          { icon: Target, label: "Quizzes", value: String(stats?.quizCount ?? 0) },
          { icon: Trophy, label: "Badges", value: String(stats?.badgeCount ?? 0) },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4 text-center">
            <s.icon className="h-4 w-4 text-accent mx-auto mb-2" />
            <div className="text-lg font-bold text-foreground">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Achievements preview */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Recent Achievements</h3>
          <Link to="/achievements" className="text-xs text-accent hover:underline">View all →</Link>
        </div>
        <div className="flex gap-3 overflow-x-auto">
          {(stats?.badges ?? []).length > 0 ? (
            stats?.badges.map((b: any, i: number) => (
              <div key={i} className="flex flex-col items-center gap-2 min-w-[80px]">
                <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-accent" />
                </div>
                <span className="text-xs text-muted-foreground text-center">{(b.achievements as any)?.name ?? "Badge"}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground py-2">No badges earned yet. Start learning to unlock achievements!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
