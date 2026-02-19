import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useDashboardData = () => {
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user!.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: streak } = useQuery({
    queryKey: ["streak", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_streaks")
        .select("*")
        .eq("user_id", user!.id)
        .single();
      if (error && error.code !== "PGRST116") throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: totalXp } = useQuery({
    queryKey: ["totalXp", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("xp_logs")
        .select("xp_amount")
        .eq("user_id", user!.id);
      if (error) throw error;
      return (data || []).reduce((sum, row) => sum + (row.xp_amount || 0), 0);
    },
    enabled: !!user,
  });

  const { data: studyTime } = useQuery({
    queryKey: ["studyTime", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("study_sessions")
        .select("duration_seconds")
        .eq("user_id", user!.id);
      if (error) throw error;
      const totalSeconds = (data || []).reduce((sum, row) => sum + (row.duration_seconds || 0), 0);
      const hours = (totalSeconds / 3600).toFixed(1);
      return `${hours}h`;
    },
    enabled: !!user,
  });

  const { data: avgScore } = useQuery({
    queryKey: ["avgScore", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quiz_attempts")
        .select("score, total_questions")
        .eq("user_id", user!.id);
      if (error) throw error;
      if (!data || data.length === 0) return null;
      const avg = data.reduce((s, q) => s + (q.total_questions > 0 ? q.score / q.total_questions : 0), 0) / data.length;
      return Math.round(avg * 100);
    },
    enabled: !!user,
  });

  const { data: continueLearning } = useQuery({
    queryKey: ["continueLearning", user?.id],
    queryFn: async () => {
      if (!user) return [];
      // Get user's lesson progress
      const { data: progress } = await supabase
        .from("user_lesson_progress")
        .select("lesson_id, completed")
        .eq("user_id", user.id);

      const completedSet = new Set((progress ?? []).filter((p) => p.completed).map((p) => p.lesson_id));

      // Get all topics with their lessons
      const { data: topics } = await supabase
        .from("topics")
        .select("id, title, subject_id, subjects(name)")
        .order("sort_order");

      const { data: lessons } = await supabase
        .from("lessons")
        .select("id, topic_id")
        .order("sort_order");

      if (!topics || !lessons) return [];

      // Find topics that are in-progress (some but not all lessons done)
      const inProgress = topics
        .map((t) => {
          const topicLessons = lessons.filter((l) => l.topic_id === t.id);
          const done = topicLessons.filter((l) => completedSet.has(l.id)).length;
          const total = topicLessons.length;
          if (total === 0 || done === 0 || done === total) return null;
          return {
            id: t.id,
            title: t.title,
            subject: (t.subjects as any)?.name ?? "",
            done,
            total,
            pct: Math.round((done / total) * 100),
          };
        })
        .filter(Boolean)
        .slice(0, 3);

      return inProgress;
    },
    enabled: !!user,
  });

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return {
    profile,
    streak,
    totalXp: totalXp ?? 0,
    studyTime: studyTime ?? "0h",
    avgScore: avgScore ?? null,
    continueLearning: continueLearning ?? [],
    greeting: greeting(),
  };
};
