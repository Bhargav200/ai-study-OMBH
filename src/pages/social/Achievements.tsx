import { Trophy, Star, Flame, Target, Zap, BookOpen, Medal, Award } from "lucide-react";

const badges = [
  { icon: Flame, name: "7-Day Streak", desc: "Study 7 days in a row", earned: true },
  { icon: Trophy, name: "Quiz Master", desc: "Complete 50 quizzes", earned: true },
  { icon: Star, name: "Perfect Score", desc: "Get 100% on a quiz", earned: true },
  { icon: Target, name: "Sharp Shooter", desc: "90%+ on 10 quizzes", earned: true },
  { icon: BookOpen, name: "Bookworm", desc: "Complete 20 lessons", earned: false, progress: 15, total: 20 },
  { icon: Zap, name: "Speed Learner", desc: "Finish a lesson in under 5 min", earned: false },
  { icon: Medal, name: "Top 3", desc: "Reach top 3 on leaderboard", earned: false },
  { icon: Award, name: "30-Day Streak", desc: "Study 30 days in a row", earned: false, progress: 7, total: 30 },
];

const Achievements = () => (
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
        <span className="text-sm font-semibold text-foreground">Level 8 — Rising Star</span>
        <span className="text-xs text-accent font-bold">1,760 / 2,000 XP</span>
      </div>
      <div className="h-3 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-accent rounded-full" style={{ width: "88%" }} />
      </div>
      <div className="text-xs text-muted-foreground mt-2">240 XP to Level 9</div>
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
              {b.progress !== undefined && (
                <div className="mt-2">
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full" style={{ width: `${(b.progress / b.total!) * 100}%` }} />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{b.progress}/{b.total}</div>
                </div>
              )}
              {b.earned && !b.progress && (
                <span className="inline-block mt-2 text-xs font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-full">Earned ✓</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Achievements;
