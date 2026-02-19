import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, Search, Flame, Medal, Star, Trophy } from "lucide-react";

const friends = [
  { name: "Sarah K.", xp: "2,450", status: "online", avatar: "SK" },
  { name: "Alex M.", xp: "2,120", status: "studying", avatar: "AM" },
  { name: "Jordan P.", xp: "1,890", status: "offline", avatar: "JP" },
  { name: "Riley T.", xp: "1,640", status: "online", avatar: "RT" },
];

const activities = [
  { icon: Flame, user: "Alex", action: "completed a 14-day streak", color: "text-destructive" },
  { icon: Medal, user: "Sarah", action: 'earned "Physics Pro" badge', color: "text-accent" },
  { icon: Star, user: "Jordan", action: "scored 98% on Calculus quiz", color: "text-accent" },
  { icon: Trophy, user: "Riley", action: "reached #5 on leaderboard", color: "text-accent" },
];

const Friends = () => {
  const [search, setSearch] = useState("");

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Users className="h-6 w-6 text-accent" />
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Friends</h1>
          <p className="text-muted-foreground text-sm">Study together, improve faster</p>
        </div>
      </div>

      {/* Add friend */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Find friends by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 h-10" />
        </div>
        <Button className="bg-navy text-highlight hover:bg-navy/90 gap-2">
          <UserPlus className="h-4 w-4" /> Add
        </Button>
      </div>

      {/* Friend list */}
      <div className="space-y-2">
        {friends.map((f) => (
          <div key={f.name} className="flex items-center gap-4 bg-card border border-border rounded-xl px-4 py-3">
            <div className="relative">
              <div className="h-10 w-10 rounded-full bg-navy flex items-center justify-center text-highlight text-sm font-bold">
                {f.avatar}
              </div>
              <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card ${
                f.status === "online" ? "bg-green-500" : f.status === "studying" ? "bg-accent" : "bg-muted-foreground"
              }`} />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-foreground">{f.name}</div>
              <div className="text-xs text-muted-foreground capitalize">{f.status}</div>
            </div>
            <span className="text-sm font-bold text-accent">{f.xp} XP</span>
          </div>
        ))}
      </div>

      {/* Activity feed */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <h3 className="font-semibold text-foreground">Friend Activity</h3>
        <div className="space-y-3">
          {activities.map((a, i) => (
            <div key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
              <a.icon className={`h-4 w-4 ${a.color} flex-shrink-0`} />
              <span><strong className="text-foreground">{a.user}</strong> {a.action}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Friends;
