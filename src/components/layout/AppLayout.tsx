import { Link, Outlet, useLocation } from "react-router-dom";
import { Brain, LayoutDashboard, BookOpen, MessageCircleQuestion, Timer, Trophy, BarChart3, Upload, Settings, User, Flame, Gamepad2 } from "lucide-react";

const sidebarLinks = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/lessons", icon: BookOpen, label: "Lessons" },
  { to: "/doubts", icon: MessageCircleQuestion, label: "Ask Doubt" },
  { to: "/quiz", icon: Gamepad2, label: "Practice Quiz" },
  { to: "/timer", icon: Timer, label: "Study Timer" },
  { to: "/materials", icon: Upload, label: "Materials" },
  { to: "/progress", icon: BarChart3, label: "Progress" },
  { to: "/leaderboard", icon: Trophy, label: "Leaderboard" },
  { to: "/achievements", icon: Flame, label: "Achievements" },
  { to: "/profile", icon: User, label: "Profile" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

const AppLayout = () => {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card fixed inset-y-0 left-0 z-30">
        <div className="px-5 py-5 border-b border-border">
          <Link to="/" className="flex items-center gap-2.5 font-bold text-lg text-foreground">
            <div className="h-8 w-8 rounded-lg bg-navy flex items-center justify-center">
              <Brain className="h-5 w-5 text-highlight" />
            </div>
            <span className="tracking-tight">StudyMind</span>
          </Link>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const active = pathname === link.to || pathname.startsWith(link.to + "/");
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-navy text-highlight"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <link.icon className="h-4 w-4 flex-shrink-0" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-4 py-4 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center">
              <User className="h-4 w-4 text-navy" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-foreground truncate">John Doe</div>
              <div className="text-xs text-muted-foreground">1,760 XP</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-card border-t border-border flex">
        {[sidebarLinks[0], sidebarLinks[1], sidebarLinks[3], sidebarLinks[4], sidebarLinks[6]].map((link) => {
          const active = pathname === link.to || pathname.startsWith(link.to + "/");
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors ${
                active ? "text-navy" : "text-muted-foreground"
              }`}
            >
              <link.icon className="h-5 w-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Main content */}
      <main className="flex-1 md:ml-64 pb-20 md:pb-0">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
