import { Link } from "react-router-dom";
import { BookOpen, MessageCircleQuestion, Gamepad2, Upload, BarChart3, Trophy, Flame, ArrowRight, TrendingUp, AlertTriangle, Zap, Lightbulb, Timer, Moon, FileText, Bot } from "lucide-react";
import { useDashboardData } from "@/hooks/useDashboardData";
import DashboardTimer from "@/components/DashboardTimer";

const Dashboard = () => {
  const { profile, streak, totalXp, studyTime, avgScore, continueLearning, weakTopics, greeting } = useDashboardData();
  const displayName = profile?.full_name?.split(" ")[0] || "there";
  const level = Math.floor(totalXp / 200) + 1;
  const currentStreak = streak?.current_streak ?? 0;

  // Generate streak calendar (last 7 days)
  const streakDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayNames = ["S", "M", "T", "W", "T", "F", "S"];
    return {
      label: dayNames[d.getDay()],
      active: i >= 7 - currentStreak,
    };
  });

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
            Welcome back, {displayName} 👋
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Ready to crush your study goals today?</p>
        </div>
        <div className="flex items-center gap-3">
          <DashboardTimer />
        </div>
      </div>

      {/* Two hero action cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <Link
          to="/materials"
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent to-[hsl(var(--navy))] p-6 text-white group hover:shadow-lg transition-shadow"
        >
          <div className="relative z-10">
            <h3 className="text-lg font-bold">New Document</h3>
            <p className="text-sm opacity-80 mt-1">Upload a PDF or notes to start learning</p>
          </div>
          <Upload className="absolute right-6 bottom-6 h-12 w-12 opacity-20 group-hover:opacity-30 transition-opacity" />
        </Link>
        <Link
          to="/materials/tutor"
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[hsl(var(--navy))] to-[hsl(var(--deep))] p-6 text-white group hover:shadow-lg transition-shadow"
        >
          <div className="relative z-10">
            <h3 className="text-lg font-bold">AI Tutor Chat</h3>
            <p className="text-sm opacity-80 mt-1">Ask anything about your course materials</p>
          </div>
          <Bot className="absolute right-6 bottom-6 h-12 w-12 opacity-20 group-hover:opacity-30 transition-opacity" />
        </Link>
      </div>

      {/* Middle row: Streak + Subject Mastery + Leaderboard */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Streak */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-destructive" />
              <span className="font-semibold text-foreground">{currentStreak}-Day Streak</span>
            </div>
          </div>
          <div className="text-4xl font-bold text-foreground">{currentStreak} <span className="text-base font-normal text-muted-foreground">Days</span></div>
          <div className="flex gap-2">
            {streakDays.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                  d.active
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {d.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subject Mastery */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-3">
          <h3 className="font-semibold text-foreground text-sm">Subject Mastery</h3>
          {weakTopics.length > 0 ? (
            weakTopics.slice(0, 3).map((t: any) => (
              <div key={t.topicId} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{t.topicTitle}</span>
                  <span className="text-accent font-semibold">{t.mastery}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full" style={{ width: `${t.mastery}%` }} />
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm text-muted-foreground py-2">Take quizzes to see mastery</div>
          )}
        </div>

        {/* Leaderboard preview */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground text-sm">Leaderboard</h3>
            <span className="text-[10px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full">Top 5%</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-accent/5">
              <div className="h-7 w-7 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold">
                {(displayName[0] ?? "Y").toUpperCase()}
              </div>
              <span className="flex-1 text-sm font-medium text-foreground">You ({displayName})</span>
              <span className="text-xs font-bold text-accent">{totalXp.toLocaleString()} XP</span>
            </div>
          </div>
          <Link to="/leaderboard" className="text-xs text-accent hover:underline">View all rankings →</Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Recent Activity</h3>
          <Link to="/progress" className="text-xs text-accent hover:underline">View all history →</Link>
        </div>
        {continueLearning.length > 0 ? (
          <div className="grid sm:grid-cols-3 gap-4">
            {continueLearning.map((t: any) => (
              <Link
                key={t.id}
                to={`/lessons/${t.id}`}
                className="flex items-center gap-3 rounded-lg hover:bg-muted/50 p-3 border border-border transition-colors"
              >
                <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                  <BookOpen className="h-4 w-4 text-navy" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">{t.title}</div>
                  <div className="text-xs text-muted-foreground">{t.subject} · {t.pct}%</div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground py-4 text-center">
            Start a lesson to see your recent activity
          </div>
        )}
      </div>

      {/* Quick actions row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { icon: MessageCircleQuestion, label: "Ask a Doubt", to: "/doubts" },
          { icon: Gamepad2, label: "Practice Quiz", to: "/quiz" },
          { icon: BookOpen, label: "Continue Learning", to: "/lessons" },
          { icon: BarChart3, label: "View Progress", to: "/progress" },
          { icon: Trophy, label: "Achievements", to: "/achievements" },
        ].map((a) => (
          <Link
            key={a.label}
            to={a.to}
            className="group bg-card border border-border rounded-xl p-4 hover:border-accent/50 transition-colors text-center"
          >
            <a.icon className="h-5 w-5 text-accent mx-auto mb-2" />
            <div className="text-xs font-semibold text-foreground">{a.label}</div>
          </Link>
        ))}
      </div>

      {/* Weak topics / recommendations */}
      {weakTopics.length > 0 ? (
        <div className="bg-secondary/50 border border-accent/10 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-accent" />
            <span className="font-semibold text-sm text-foreground">Recommended Focus Areas</span>
          </div>
          <p className="text-xs text-muted-foreground">Based on your quiz scores, these topics need more practice:</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {weakTopics.map((t: any) => (
              <Link
                key={t.topicId}
                to={`/lessons/${t.topicId}`}
                className="bg-card border border-border rounded-lg px-4 py-3 hover:border-accent/50 transition-colors"
              >
                <div className="text-sm font-medium text-foreground">{t.topicTitle}</div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-muted-foreground">{t.subject}</span>
                  <span className="text-xs font-bold text-destructive">{t.mastery}% mastery</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3 bg-secondary/50 border border-accent/10 rounded-xl px-5 py-4">
          <AlertTriangle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-sm font-semibold text-foreground">Complete quizzes to identify weak topics</div>
            <div className="text-xs text-muted-foreground mt-1">Take a quiz to get personalized recommendations on where to focus.</div>
          </div>
          <Link to="/quiz" className="ml-auto text-xs font-medium text-accent hover:underline whitespace-nowrap">Take quiz →</Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
