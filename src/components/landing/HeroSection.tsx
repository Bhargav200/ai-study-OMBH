import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Bot, BarChart3, Trophy, Timer, BookOpen } from "lucide-react";

const HeroSection = () => (
  <section className="relative overflow-hidden bg-deep text-deep-foreground">
    {/* Gradient orbs */}
    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-interface/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-highlight/8 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />

    <div className="container relative max-w-7xl mx-auto px-4 py-24 md:py-32 lg:py-40">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        {/* Left */}
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 bg-navy/80 border border-interface/30 rounded-full px-4 py-1.5 text-xs font-medium text-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-highlight animate-pulse" />
            AI-Powered Learning Platform
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
            Your AI Study Companion for{" "}
            <span className="text-highlight">Smarter Learning.</span>
          </h1>

          <p className="text-soft text-lg md:text-xl leading-relaxed max-w-lg">
            Solve homework instantly. Study with AI guidance. Track progress, compete with friends, and build daily study habits.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button className="bg-highlight text-navy hover:bg-highlight/90 font-semibold text-sm h-12 px-7 rounded-xl gap-2">
              Start Learning Free
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="border-interface/40 text-soft hover:text-highlight hover:border-highlight/50 h-12 px-7 rounded-xl gap-2 bg-transparent">
              <Play className="h-4 w-4" />
              See How It Works
            </Button>
          </div>

          <div className="flex items-center gap-6 pt-2 text-sm text-soft">
            <span className="flex items-center gap-1.5">✓ Free to start</span>
            <span className="flex items-center gap-1.5">✓ No credit card</span>
            <span className="flex items-center gap-1.5">✓ Instant AI access</span>
          </div>
        </div>

        {/* Right - Abstract UI Cards */}
        <div className="relative hidden lg:block">
          <div className="relative w-full h-[500px]">
            {/* Main dashboard card */}
            <div className="absolute top-0 left-8 w-80 bg-navy/60 backdrop-blur-md border border-interface/20 rounded-2xl p-5 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 rounded-lg bg-interface/30 flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 text-highlight" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-highlight">Study Dashboard</div>
                  <div className="text-xs text-soft">Today's Progress</div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-xs text-soft">
                  <span>Mathematics</span><span className="text-highlight">85%</span>
                </div>
                <div className="h-2 bg-deep rounded-full overflow-hidden">
                  <div className="h-full w-[85%] bg-gradient-to-r from-interface to-highlight rounded-full" />
                </div>
                <div className="flex justify-between text-xs text-soft">
                  <span>Physics</span><span className="text-highlight">62%</span>
                </div>
                <div className="h-2 bg-deep rounded-full overflow-hidden">
                  <div className="h-full w-[62%] bg-gradient-to-r from-interface to-highlight rounded-full" />
                </div>
              </div>
            </div>

            {/* AI Chat card */}
            <div className="absolute top-32 right-0 w-72 bg-navy/60 backdrop-blur-md border border-interface/20 rounded-2xl p-4 shadow-2xl">
              <div className="flex items-center gap-2 mb-3">
                <Bot className="h-5 w-5 text-highlight" />
                <span className="text-sm font-semibold text-highlight">AI Tutor</span>
              </div>
              <div className="space-y-2">
                <div className="bg-deep/60 rounded-lg px-3 py-2 text-xs text-soft max-w-[85%]">
                  Explain the Pythagorean theorem
                </div>
                <div className="bg-interface/20 rounded-lg px-3 py-2 text-xs text-highlight/90 ml-auto max-w-[90%]">
                  The Pythagorean theorem states that a² + b² = c², where c is the hypotenuse...
                </div>
              </div>
            </div>

            {/* Leaderboard card */}
            <div className="absolute bottom-8 left-16 w-64 bg-navy/60 backdrop-blur-md border border-interface/20 rounded-2xl p-4 shadow-2xl">
              <div className="flex items-center gap-2 mb-3">
                <Trophy className="h-5 w-5 text-highlight" />
                <span className="text-sm font-semibold text-highlight">Leaderboard</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-highlight">
                  <span>🥇 Sarah K.</span><span>2,450 XP</span>
                </div>
                <div className="flex items-center justify-between text-soft">
                  <span>🥈 Alex M.</span><span>2,120 XP</span>
                </div>
                <div className="flex items-center justify-between text-soft">
                  <span>🥉 You</span><span>1,890 XP</span>
                </div>
              </div>
            </div>

            {/* Streak badge */}
            <div className="absolute bottom-4 right-8 bg-navy/60 backdrop-blur-md border border-interface/20 rounded-xl px-4 py-3 shadow-2xl flex items-center gap-3">
              <Timer className="h-5 w-5 text-highlight" />
              <div>
                <div className="text-sm font-bold text-highlight">7-Day Streak 🔥</div>
                <div className="text-xs text-soft">Keep going!</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
