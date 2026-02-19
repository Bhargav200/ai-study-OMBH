import { BarChart3, Clock, TrendingUp, AlertTriangle, Target } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

const ProgressDashboard = () => {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["progress-dashboard", user?.id],
    queryFn: async () => {
      if (!user) return null;

      // Total study time
      const { data: sessions } = await supabase
        .from("study_sessions")
        .select("duration_seconds, created_at")
        .eq("user_id", user.id);

      const totalSeconds = (sessions ?? []).reduce((s, r) => s + r.duration_seconds, 0);
      const totalHours = (totalSeconds / 3600).toFixed(1);

      // This week's study by day
      const now = new Date();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      const weekSessions = (sessions ?? []).filter(
        (s) => new Date(s.created_at) >= startOfWeek
      );
      const weekSeconds = weekSessions.reduce((s, r) => s + r.duration_seconds, 0);
      const weekHours = (weekSeconds / 3600).toFixed(1);

      const dayMap: Record<string, number> = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      weekSessions.forEach((s) => {
        const d = dayNames[new Date(s.created_at).getDay()];
        dayMap[d] += s.duration_seconds / 3600;
      });
      const chartData = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => ({
        day,
        hours: parseFloat(dayMap[day].toFixed(1)),
      }));

      // Quiz stats
      const { data: quizzes } = await supabase
        .from("quiz_attempts")
        .select("score, total_questions, created_at")
        .eq("user_id", user.id);

      const totalQuizzes = quizzes?.length ?? 0;
      const avgScore =
        totalQuizzes > 0
          ? Math.round(
              ((quizzes ?? []).reduce((s, q) => s + (q.total_questions > 0 ? q.score / q.total_questions : 0), 0) /
                totalQuizzes) *
                100
            )
          : 0;

      const weekQuizzes = (quizzes ?? []).filter((q) => new Date(q.created_at) >= startOfWeek).length;

      // Topic mastery from lesson progress
      const { data: subjects } = await supabase.from("subjects").select("id, name");
      const { data: topics } = await supabase.from("topics").select("id, subject_id");
      const { data: lessons } = await supabase.from("lessons").select("id, topic_id");
      const { data: progress } = await supabase
        .from("user_lesson_progress")
        .select("lesson_id, completed")
        .eq("user_id", user.id);

      const completedSet = new Set((progress ?? []).filter((p) => p.completed).map((p) => p.lesson_id));

      const mastery = (subjects ?? []).map((sub) => {
        const subTopicIds = (topics ?? []).filter((t) => t.subject_id === sub.id).map((t) => t.id);
        const subLessons = (lessons ?? []).filter((l) => subTopicIds.includes(l.topic_id));
        const done = subLessons.filter((l) => completedSet.has(l.id)).length;
        const total = subLessons.length;
        return { subject: sub.name, pct: total > 0 ? Math.round((done / total) * 100) : 0, done, total };
      });

      const totalTopics = (topics ?? []).length;
      const doneTopics = (topics ?? []).filter((t) => {
        const tLessons = (lessons ?? []).filter((l) => l.topic_id === t.id);
        return tLessons.length > 0 && tLessons.every((l) => completedSet.has(l.id));
      }).length;

      // Weak topics (< 50% mastery)
      const weakTopics = mastery.filter((m) => m.pct < 50 && m.total > 0);

      return { totalHours, weekHours, avgScore, totalQuizzes, weekQuizzes, chartData, mastery, doneTopics, totalTopics, weakTopics };
    },
    enabled: !!user,
  });

  const maxHours = Math.max(...(data?.chartData?.map((d) => d.hours) ?? [1]), 0.5);

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Progress Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Track your learning journey</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-4">
                <Skeleton className="h-4 w-4 mb-2" />
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-3 w-20" />
              </div>
            ))
          : [
              { icon: Clock, label: "Total Study", value: `${data?.totalHours}h`, sub: `+${data?.weekHours}h this week` },
              { icon: Target, label: "Avg. Score", value: `${data?.avgScore}%`, sub: `${data?.totalQuizzes} quizzes taken` },
              { icon: TrendingUp, label: "Topics Done", value: `${data?.doneTopics}/${data?.totalTopics}`, sub: data?.totalTopics ? `${Math.round(((data?.doneTopics ?? 0) / data.totalTopics) * 100)}% complete` : "0%" },
              { icon: BarChart3, label: "Quizzes", value: `${data?.totalQuizzes}`, sub: `${data?.weekQuizzes} this week` },
            ].map((s) => (
              <div key={s.label} className="bg-card border border-border rounded-xl p-4">
                <s.icon className="h-4 w-4 text-accent mb-2" />
                <div className="text-2xl font-bold text-foreground">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
                <div className="text-xs text-accent mt-1">{s.sub}</div>
              </div>
            ))}
      </div>

      {/* Study hours chart */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Study Hours This Week</h3>
          <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">This Week</span>
        </div>
        <div className="flex items-end gap-3 h-40">
          {(data?.chartData ?? [{ day: "Mon", hours: 0 }, { day: "Tue", hours: 0 }, { day: "Wed", hours: 0 }, { day: "Thu", hours: 0 }, { day: "Fri", hours: 0 }, { day: "Sat", hours: 0 }, { day: "Sun", hours: 0 }]).map((d) => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full rounded-t-lg relative" style={{ height: `${Math.max((d.hours / maxHours) * 100, 4)}%` }}>
                <div className="absolute inset-0 bg-accent rounded-t-lg" />
              </div>
              <span className="text-xs text-muted-foreground">{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Topic mastery */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h3 className="font-semibold text-foreground">Topic Mastery</h3>
        {(data?.mastery ?? []).map((s) => (
          <div key={s.subject} className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-foreground font-medium">{s.subject}</span>
              <span className="text-accent font-semibold">{s.pct}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${s.pct}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Weak topics */}
      {(data?.weakTopics?.length ?? 0) > 0 && (
        <div className="bg-secondary/50 border border-accent/10 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-accent" />
            <span className="font-semibold text-sm text-foreground">Needs Attention</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {data?.weakTopics?.map((t) => (
              <div key={t.subject} className="bg-card border border-border rounded-lg px-4 py-3 text-sm text-muted-foreground">
                {t.subject} — {t.pct}%
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressDashboard;
