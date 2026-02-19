import { Link } from "react-router-dom";
import { BookOpen, MessageCircleQuestion, Gamepad2, Upload, BarChart3, Trophy, Flame, ArrowRight, TrendingUp, AlertTriangle, Zap, Lightbulb, Timer } from "lucide-react";
import { useDashboardData } from "@/hooks/useDashboardData";
import DashboardTimer from "@/components/DashboardTimer";

const quickActions = [
  { icon: MessageCircleQuestion, label: "Ask a Doubt", desc: "Get instant AI help", to: "/doubts", color: "bg-accent/10 text-accent" },
  { icon: Gamepad2, label: "Practice Quiz", desc: "Test your knowledge", to: "/quiz", color: "bg-secondary text-navy" },
  { icon: BookOpen, label: "Continue Learning", desc: "Pick up where you left off", to: "/lessons", color: "bg-accent/10 text-accent" },
  { icon: Upload, label: "Upload Material", desc: "Learn from your docs", to: "/materials", color: "bg-secondary text-navy" },
  { icon: BarChart3, label: "View Progress", desc: "Track your mastery", to: "/progress", color: "bg-accent/10 text-accent" },
];

const Dashboard = () => {
  const { profile, streak, totalXp, studyTime, avgScore, continueLearning, weakTopics, greeting } = useDashboardData();
  const displayName = profile?.full_name?.split(" ")[0] || "there";
  const level = Math.floor(totalXp / 200) + 1;

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">{greeting}, {displayName} 👋</h1>
          <p className="text-muted-foreground mt-1 text-sm">Ready to continue your learning journey?</p>
        </div>
        <div className="flex items-center gap-3">
          <DashboardTimer />
          <div className="hidden sm:flex items-center gap-2 bg-secondary px-4 py-2 rounded-xl">
            <Flame className="h-4 w-4 text-destructive" />
            <span className="text-sm font-bold text-navy">{streak?.current_streak ?? 0} day streak</span>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { value: totalXp.toLocaleString(), label: "Total XP", icon: Zap, accent: true },
          { value: studyTime, label: "Study Time", icon: Timer },
          { value: avgScore !== null ? `${avgScore}%` : "—", label: "Avg. Score", icon: TrendingUp },
          { value: `Lv. ${level}`, label: "Level", icon: Trophy },
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

      {/* Two-column: Continue + Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Continue learning */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Continue Learning</h3>
            <Link to="/lessons" className="text-xs text-accent hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {continueLearning.length > 0 ? (
            continueLearning.map((t: any) => (
              <Link
                key={t.id}
                to={`/lessons/${t.id}`}
                className="flex items-center gap-3 rounded-lg hover:bg-muted/50 p-2 -mx-2 transition-colors"
              >
                <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                  <BookOpen className="h-4 w-4 text-navy" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">{t.title}</div>
                  <div className="text-xs text-muted-foreground">{t.subject} · {t.done}/{t.total} lessons</div>
                </div>
                <span className="text-xs font-bold text-accent">{t.pct}%</span>
              </Link>
            ))
          ) : (
            <div className="text-sm text-muted-foreground py-4 text-center">
              Start a lesson to see your progress here
            </div>
          )}
        </div>

        {/* Your Stats */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Your Stats</h3>
            <Link to="/leaderboard" className="text-xs text-accent hover:underline flex items-center gap-1">
              Leaderboard <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-secondary">
            <span className="text-sm w-6 text-center">🏆</span>
            <span className="flex-1 text-sm font-medium text-navy">{displayName} (You)</span>
            <span className="text-sm font-bold text-accent">{totalXp.toLocaleString()} XP</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-foreground">{streak?.current_streak ?? 0}</div>
              <div className="text-xs text-muted-foreground">Day Streak</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-foreground">{avgScore !== null ? `${avgScore}%` : "—"}</div>
              <div className="text-xs text-muted-foreground">Avg. Score</div>
            </div>
          </div>
        </div>
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
