import { Trophy, Medal } from "lucide-react";

const users = [
  { rank: 1, name: "Sarah K.", xp: "2,450", badge: "Math Wizard", avatar: "SK" },
  { rank: 2, name: "Alex M.", xp: "2,120", badge: "Quiz Master", avatar: "AM" },
  { rank: 3, name: "Jordan P.", xp: "1,890", badge: "Streak King", avatar: "JP" },
  { rank: 4, name: "You", xp: "1,760", badge: "Rising Star", avatar: "JD", isYou: true },
  { rank: 5, name: "Riley T.", xp: "1,640", badge: "Biology Pro", avatar: "RT" },
  { rank: 6, name: "Taylor W.", xp: "1,520", badge: "Night Owl", avatar: "TW" },
  { rank: 7, name: "Morgan L.", xp: "1,380", badge: "Consistent", avatar: "ML" },
  { rank: 8, name: "Casey N.", xp: "1,200", badge: "Newcomer", avatar: "CN" },
];

const Leaderboard = () => (
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
      {[users[1], users[0], users[2]].map((u, i) => {
        const heights = ["h-24", "h-32", "h-20"];
        const medals = ["🥈", "🥇", "🥉"];
        return (
          <div key={u.rank} className="flex flex-col items-center gap-2">
            <span className="text-2xl">{medals[i]}</span>
            <div className="h-10 w-10 rounded-full bg-navy flex items-center justify-center text-highlight text-sm font-bold">
              {u.avatar}
            </div>
            <span className="text-xs font-semibold text-foreground">{u.name}</span>
            <span className="text-xs text-accent font-bold">{u.xp} XP</span>
            <div className={`${heights[i]} w-20 rounded-t-lg bg-secondary`} />
          </div>
        );
      })}
    </div>

    {/* Full list */}
    <div className="space-y-2">
      {users.map((u) => (
        <div
          key={u.rank}
          className={`flex items-center gap-4 px-4 py-3 rounded-xl ${
            u.isYou ? "bg-secondary border border-accent/20" : "bg-card border border-border"
          }`}
        >
          <span className="text-sm font-bold text-muted-foreground w-6 text-center">{u.rank}</span>
          <div className="h-9 w-9 rounded-full bg-navy flex items-center justify-center text-highlight text-xs font-bold flex-shrink-0">
            {u.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <span className={`text-sm font-medium ${u.isYou ? "text-navy" : "text-foreground"}`}>{u.name}</span>
            <span className="ml-2 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{u.badge}</span>
          </div>
          <span className="text-sm font-bold text-accent">{u.xp} XP</span>
        </div>
      ))}
    </div>
  </div>
);

export default Leaderboard;
