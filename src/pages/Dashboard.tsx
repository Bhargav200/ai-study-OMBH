import { Link } from "react-router-dom";
import { BookOpen, MessageCircleQuestion, Gamepad2, Timer, Upload, BarChart3, Trophy, Flame, ArrowRight, TrendingUp, AlertTriangle, Zap } from "lucide-react";

const quickActions = [
  { icon: MessageCircleQuestion, label: "Ask a Doubt", desc: "Get instant AI help", to: "/doubts", color: "bg-accent/10 text-accent" },
  { icon: Gamepad2, label: "Practice Quiz", desc: "Test your knowledge", to: "/quiz", color: "bg-secondary text-navy" },
  { icon: BookOpen, label: "Continue Learning", desc: "Pick up where you left off", to: "/lessons", color: "bg-accent/10 text-accent" },
  { icon: Timer, label: "Study Timer", desc: "Start a focused session", to: "/timer", color: "bg-secondary text-navy" },
  { icon: Upload, label: "Upload Material", desc: "Learn from your docs", to: "/materials", color: "bg-accent/10 text-accent" },
  { icon: BarChart3, label: "View Progress", desc: "Track your mastery", to: "/progress", color: "bg-secondary text-navy" },
];

const Dashboard = () => (
  <div className="p-6 md:p-8 space-y-8 max-w-6xl mx-auto">
    {/* Header */}
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">Good morning, John 👋</h1>
        <p className="text-muted-foreground mt-1 text-sm">Ready to continue your learning journey?</p>
      </div>
      <div className="hidden sm:flex items-center gap-2 bg-secondary px-4 py-2 rounded-xl">
        <Flame className="h-4 w-4 text-destructive" />
        <span className="text-sm font-bold text-navy">7 day streak</span>
      </div>
    </div>

    {/* Stats row */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { value: "1,760", label: "Total XP", icon: Zap, accent: true },
        { value: "12.5h", label: "Study Time", icon: Timer },
        { value: "89%", label: "Avg. Score", icon: TrendingUp },
        { value: "#4", label: "Leaderboard", icon: Trophy },
      ].map((s) => (
        <div key={s.label} className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <s.icon className={`h-4 w-4 ${s.accent ? "text-accent" : "text-muted-foreground"}`} />
            <span className="text-xs text-muted-foreground">{s.label}</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{s.value}</div>
        </div>
      ))}
    </div>

    {/* Quick actions */}
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {quickActions.map((a) => (
          <Link
            key={a.label}
            to={a.to}
            className="group bg-card border border-border rounded-xl p-5 hover:border-accent/50 transition-colors"
          >
            <div className={`h-10 w-10 rounded-lg ${a.color} flex items-center justify-center mb-3`}>
              <a.icon className="h-5 w-5" />
            </div>
            <div className="text-sm font-semibold text-foreground">{a.label}</div>
            <div className="text-xs text-muted-foreground mt-1">{a.desc}</div>
          </Link>
        ))}
      </div>
    </div>

    {/* Two-column: Continue + Leaderboard */}
    <div className="grid md:grid-cols-2 gap-6">
      {/* Continue learning */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Continue Learning</h3>
          <Link to="/lessons" className="text-xs text-accent hover:underline flex items-center gap-1">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        {[
          { topic: "Quadratic Equations", subject: "Mathematics", pct: 65 },
          { topic: "Newton's Laws", subject: "Physics", pct: 40 },
          { topic: "Cell Biology", subject: "Biology", pct: 80 },
        ].map((t) => (
          <div key={t.topic} className="flex items-center gap-4">
            <div className="flex-1">
              <div className="text-sm font-medium text-foreground">{t.topic}</div>
              <div className="text-xs text-muted-foreground">{t.subject}</div>
            </div>
            <div className="w-24">
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-accent rounded-full" style={{ width: `${t.pct}%` }} />
              </div>
            </div>
            <span className="text-xs font-medium text-accent">{t.pct}%</span>
          </div>
        ))}
      </div>

      {/* Leaderboard preview */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Leaderboard</h3>
          <Link to="/leaderboard" className="text-xs text-accent hover:underline flex items-center gap-1">
            See all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        {[
          { rank: "🥇", name: "Sarah K.", xp: "2,450" },
          { rank: "🥈", name: "Alex M.", xp: "2,120" },
          { rank: "🥉", name: "Jordan P.", xp: "1,890" },
          { rank: "4", name: "You", xp: "1,760", isYou: true },
        ].map((u, i) => (
          <div key={i} className={`flex items-center gap-3 px-3 py-2 rounded-lg ${u.isYou ? "bg-secondary" : ""}`}>
            <span className="text-sm w-6 text-center">{u.rank}</span>
            <span className={`flex-1 text-sm font-medium ${u.isYou ? "text-navy" : "text-foreground"}`}>{u.name}</span>
            <span className="text-sm font-bold text-accent">{u.xp} XP</span>
          </div>
        ))}
      </div>
    </div>

    {/* Weak topics alert */}
    <div className="flex items-start gap-3 bg-secondary/50 border border-accent/10 rounded-xl px-5 py-4">
      <AlertTriangle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
      <div>
        <div className="text-sm font-semibold text-foreground">Focus needed: Organic Chemistry</div>
        <div className="text-xs text-muted-foreground mt-1">Your scores dropped 12% this week. We recommend practicing reaction mechanisms.</div>
      </div>
      <Link to="/quiz" className="ml-auto text-xs font-medium text-accent hover:underline whitespace-nowrap">Practice now →</Link>
    </div>
  </div>
);

export default Dashboard;
