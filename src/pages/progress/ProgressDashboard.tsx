import { BarChart3, Clock, TrendingUp, AlertTriangle, Target } from "lucide-react";

const ProgressDashboard = () => (
  <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-foreground tracking-tight">Progress Dashboard</h1>
      <p className="text-muted-foreground text-sm mt-1">Track your learning journey</p>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { icon: Clock, label: "Total Study", value: "48.5h", sub: "+3.2h this week" },
        { icon: Target, label: "Avg. Score", value: "89%", sub: "+5% from last week" },
        { icon: TrendingUp, label: "Topics Done", value: "24/36", sub: "67% complete" },
        { icon: BarChart3, label: "Quizzes", value: "42", sub: "12 this week" },
      ].map((s) => (
        <div key={s.label} className="bg-card border border-border rounded-xl p-4">
          <s.icon className="h-4 w-4 text-accent mb-2" />
          <div className="text-2xl font-bold text-foreground">{s.value}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
          <div className="text-xs text-accent mt-1">{s.sub}</div>
        </div>
      ))}
    </div>

    {/* Study hours chart mockup */}
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Study Hours This Week</h3>
        <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">This Week</span>
      </div>
      <div className="flex items-end gap-3 h-40">
        {[
          { day: "Mon", hours: 2.5 },
          { day: "Tue", hours: 1.8 },
          { day: "Wed", hours: 3.2 },
          { day: "Thu", hours: 2.0 },
          { day: "Fri", hours: 1.5 },
          { day: "Sat", hours: 0.5 },
          { day: "Sun", hours: 1.0 },
        ].map((d) => (
          <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full bg-accent/20 rounded-t-lg relative" style={{ height: `${(d.hours / 3.5) * 100}%` }}>
              <div className="absolute inset-0 bg-accent rounded-t-lg" style={{ height: "100%" }} />
            </div>
            <span className="text-xs text-muted-foreground">{d.day}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Topic mastery */}
    <div className="bg-card border border-border rounded-xl p-6 space-y-4">
      <h3 className="font-semibold text-foreground">Topic Mastery</h3>
      {[
        { subject: "Mathematics", pct: 92 },
        { subject: "Physics", pct: 78 },
        { subject: "Chemistry", pct: 55 },
        { subject: "Biology", pct: 85 },
        { subject: "English", pct: 70 },
      ].map((s) => (
        <div key={s.subject} className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-foreground font-medium">{s.subject}</span>
            <span className="text-accent font-semibold">{s.pct}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-accent rounded-full" style={{ width: `${s.pct}%` }} />
          </div>
        </div>
      ))}
    </div>

    {/* Weak topics */}
    <div className="bg-secondary/50 border border-accent/10 rounded-xl p-5 space-y-3">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-accent" />
        <span className="font-semibold text-sm text-foreground">Weak Topics</span>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {["Organic Chemistry — 55%", "Thermodynamics — 45%", "Calculus Integration — 60%", "Electromagnetic Waves — 52%"].map((t) => (
          <div key={t} className="bg-card border border-border rounded-lg px-4 py-3 text-sm text-muted-foreground">{t}</div>
        ))}
      </div>
    </div>
  </div>
);

export default ProgressDashboard;
