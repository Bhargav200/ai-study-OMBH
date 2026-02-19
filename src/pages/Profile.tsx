import { User, Zap, Trophy, BookOpen, Clock, Flame, Target, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Profile = () => (
  <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-6">
    {/* Profile header */}
    <div className="bg-card border border-border rounded-xl p-6 flex flex-col sm:flex-row items-center gap-6">
      <div className="h-20 w-20 rounded-full bg-navy flex items-center justify-center">
        <User className="h-10 w-10 text-highlight" />
      </div>
      <div className="flex-1 text-center sm:text-left">
        <h1 className="text-xl font-bold text-foreground">John Doe</h1>
        <p className="text-sm text-muted-foreground">Grade 11 · Science Stream</p>
        <div className="flex items-center gap-4 mt-3 justify-center sm:justify-start">
          <div className="flex items-center gap-1">
            <Zap className="h-4 w-4 text-accent" />
            <span className="text-sm font-bold text-foreground">1,760 XP</span>
          </div>
          <div className="flex items-center gap-1">
            <Trophy className="h-4 w-4 text-accent" />
            <span className="text-sm font-bold text-foreground">Level 8</span>
          </div>
          <div className="flex items-center gap-1">
            <Flame className="h-4 w-4 text-destructive" />
            <span className="text-sm font-bold text-foreground">7 days</span>
          </div>
        </div>
      </div>
      <Link to="/settings">
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="h-4 w-4" /> Edit
        </Button>
      </Link>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {[
        { icon: Clock, label: "Study Hours", value: "48.5h" },
        { icon: BookOpen, label: "Lessons Done", value: "24" },
        { icon: Target, label: "Quizzes", value: "42" },
        { icon: Trophy, label: "Badges", value: "4" },
      ].map((s) => (
        <div key={s.label} className="bg-card border border-border rounded-xl p-4 text-center">
          <s.icon className="h-4 w-4 text-accent mx-auto mb-2" />
          <div className="text-lg font-bold text-foreground">{s.value}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
        </div>
      ))}
    </div>

    {/* Achievements preview */}
    <div className="bg-card border border-border rounded-xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Recent Achievements</h3>
        <Link to="/achievements" className="text-xs text-accent hover:underline">View all →</Link>
      </div>
      <div className="flex gap-3 overflow-x-auto">
        {[
          { icon: Flame, name: "7-Day Streak" },
          { icon: Trophy, name: "Quiz Master" },
          { icon: Target, name: "Sharp Shooter" },
        ].map((b) => (
          <div key={b.name} className="flex flex-col items-center gap-2 min-w-[80px]">
            <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center">
              <b.icon className="h-5 w-5 text-accent" />
            </div>
            <span className="text-xs text-muted-foreground text-center">{b.name}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Subjects */}
    <div className="bg-card border border-border rounded-xl p-5 space-y-3">
      <h3 className="font-semibold text-foreground">Subjects</h3>
      <div className="flex flex-wrap gap-2">
        {["Mathematics", "Physics", "Chemistry", "Biology"].map((s) => (
          <span key={s} className="bg-secondary text-navy text-xs font-medium px-3 py-1.5 rounded-full">{s}</span>
        ))}
      </div>
    </div>
  </div>
);

export default Profile;
