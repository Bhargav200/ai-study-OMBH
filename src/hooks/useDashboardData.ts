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
    greeting: greeting(),
  };
};
