import { Trophy } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const mockUsers = [
  { rank: 1, name: "Sarah K.", avatar: "SK", badge: "Math Wizard" },
  { rank: 2, name: "Alex M.", avatar: "AM", badge: "Quiz Master" },
  { rank: 3, name: "Jordan P.", avatar: "JP", badge: "Streak King" },
  { rank: 5, name: "Riley T.", avatar: "RT", badge: "Biology Pro" },
  { rank: 6, name: "Taylor W.", avatar: "TW", badge: "Night Owl" },
  { rank: 7, name: "Morgan L.", avatar: "ML", badge: "Consistent" },
  { rank: 8, name: "Casey N.", avatar: "CN", badge: "Newcomer" },
];

const Leaderboard = () => {
  const { user } = useAuth();

  const { data: totalXp } = useQuery({
    queryKey: ["my-xp", user?.id],
    queryFn: async () => {
      if (!user) return 0;
      const { data } = await supabase.from("xp_logs").select("xp_amount").eq("user_id", user.id);
      return (data ?? []).reduce((s, r) => s + r.xp_amount, 0);
    },
    enabled: !!user,
  });

  const { data: profile } = useQuery({
    queryKey: ["my-profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase.from("profiles").select("full_name").eq("user_id", user.id).maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  const myXp = totalXp ?? 0;
  const myName = profile?.full_name || "You";
  const myInitials = myName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  // Merge mock + real user, sorted by XP
  const mockXps = [2450, 2120, 1890, 1640, 1520, 1380, 1200];
  const allUsers = [
    ...mockUsers.map((u, i) => ({ ...u, xp: mockXps[i], isYou: false })),
    { rank: 0, name: myName, avatar: myInitials, badge: "You", xp: myXp, isYou: true },
  ]
    .sort((a, b) => b.xp - a.xp)
    .map((u, i) => ({ ...u, rank: i + 1 }));

  const top3 = allUsers.slice(0, 3);

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Trophy className="h-6 w-6 text-accent" />
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Leaderboard</h1>
          <p className="text-muted-foreground text-sm">Weekly rankings among friends</p>
        </div>
      </div>

      {/* Top 3 podium */}
      <div className="flex items-end justify-center gap-4 py-6">
        {[top3[1], top3[0], top3[2]].filter(Boolean).map((u, i) => {
          const heights = ["h-24", "h-32", "h-20"];
          const medals = ["🥈", "🥇", "🥉"];
          return (
            <div key={u.rank} className="flex flex-col items-center gap-2">
              <span className="text-2xl">{medals[i]}</span>
              <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold ${u.isYou ? "bg-accent text-accent-foreground" : "bg-navy text-highlight"}`}>
                {u.avatar}
              </div>
              <span className="text-xs font-semibold text-foreground">{u.isYou ? "You" : u.name}</span>
              <span className="text-xs text-accent font-bold">{u.xp.toLocaleString()} XP</span>
              <div className={`${heights[i]} w-20 rounded-t-lg bg-secondary`} />
            </div>
          );
        })}
      </div>

      {/* Full list */}
      <div className="space-y-2">
        {allUsers.map((u) => (
          <div
            key={u.rank}
            className={`flex items-center gap-4 px-4 py-3 rounded-xl ${
              u.isYou ? "bg-secondary border border-accent/20" : "bg-card border border-border"
            }`}
          >
            <span className="text-sm font-bold text-muted-foreground w-6 text-center">{u.rank}</span>
            <div className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${u.isYou ? "bg-accent text-accent-foreground" : "bg-navy text-highlight"}`}>
              {u.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <span className={`text-sm font-medium ${u.isYou ? "text-navy" : "text-foreground"}`}>{u.isYou ? "You" : u.name}</span>
              {!u.isYou && <span className="ml-2 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{u.badge}</span>}
            </div>
            <span className="text-sm font-bold text-accent">{u.xp.toLocaleString()} XP</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
