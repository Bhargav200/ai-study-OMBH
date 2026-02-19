import { Trophy } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const Leaderboard = () => {
  const { user } = useAuth();

  const { data: myXp } = useQuery({
    queryKey: ["my-xp", user?.id],
    queryFn: async () => {
      if (!user) return 0;
      const { data } = await supabase.from("xp_logs").select("xp_amount").eq("user_id", user.id);
      return (data ?? []).reduce((s, r) => s + r.xp_amount, 0);
    },
    enabled: !!user,
  });

  const { data: myProfile } = useQuery({
    queryKey: ["my-profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase.from("profiles").select("full_name").eq("user_id", user.id).maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  // Fetch accepted friends
  const { data: friendUsers } = useQuery({
    queryKey: ["leaderboard-friends", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data: friends } = await supabase
        .from("friends")
        .select("requester_id, addressee_id")
        .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
        .eq("status", "accepted");

      if (!friends || friends.length === 0) return [];

      const friendIds = friends.map((f) => (f.requester_id === user.id ? f.addressee_id : f.requester_id));

      const [profileRes, xpRes] = await Promise.all([
        supabase.from("profiles").select("user_id, full_name").in("user_id", friendIds),
        supabase.from("xp_logs").select("user_id, xp_amount").in("user_id", friendIds),
      ]);

      const xpMap: Record<string, number> = {};
      (xpRes.data ?? []).forEach((r) => {
        xpMap[r.user_id] = (xpMap[r.user_id] || 0) + r.xp_amount;
      });

      return (profileRes.data ?? []).map((p) => ({
        name: p.full_name || "Unknown",
        avatar: (p.full_name || "??").split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase(),
        xp: xpMap[p.user_id] || 0,
        isYou: false,
        isFriend: true,
      }));
    },
    enabled: !!user,
  });

  const myName = myProfile?.full_name || "You";
  const myInitials = myName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const xp = myXp ?? 0;

  // Combine: you + friends
  const allUsers = [
    { name: myName, avatar: myInitials, xp, isYou: true, isFriend: false },
    ...(friendUsers ?? []),
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
          <p className="text-muted-foreground text-sm">
            {(friendUsers ?? []).length > 0 ? "Rankings among friends" : "Add friends to compete!"}
          </p>
        </div>
      </div>

      {/* Top 3 podium */}
      {top3.length >= 3 && (
        <div className="flex items-end justify-center gap-4 py-6">
          {[top3[1], top3[0], top3[2]].filter(Boolean).map((u, i) => {
            const heights = ["h-24", "h-32", "h-20"];
            const medals = ["🥈", "🥇", "🥉"];
            return (
              <div key={`${u.name}-${i}`} className="flex flex-col items-center gap-2">
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
      )}

      {/* Full list */}
      <div className="space-y-2">
        {allUsers.map((u) => (
          <div
            key={`${u.name}-${u.rank}`}
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
            </div>
            <span className="text-sm font-bold text-accent">{u.xp.toLocaleString()} XP</span>
          </div>
        ))}
      </div>

      {allUsers.length <= 1 && (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">Add friends to see them on the leaderboard!</p>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
