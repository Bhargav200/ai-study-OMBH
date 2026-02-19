import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain, ArrowRight, Target, Zap, Clock, Trophy } from "lucide-react";

const goals = [
  { id: "homework", icon: Zap, label: "Get homework help", desc: "Solve problems faster with AI" },
  { id: "exams", icon: Target, label: "Prepare for exams", desc: "Structured study for upcoming tests" },
  { id: "habits", icon: Clock, label: "Build study habits", desc: "Develop daily learning routines" },
  { id: "compete", icon: Trophy, label: "Compete & improve", desc: "Challenge friends and track progress" },
];

const difficulties = ["Beginner", "Intermediate", "Advanced"];

const LearningGoals = () => {
  const navigate = useNavigate();
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState("");

  const toggleGoal = (id: string) =>
    setSelectedGoals((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="border-b border-border px-6 py-4">
        <div className="flex items-center gap-2.5 font-bold text-lg text-foreground">
          <div className="h-8 w-8 rounded-lg bg-navy flex items-center justify-center">
            <Brain className="h-5 w-5 text-highlight" />
          </div>
          <span className="tracking-tight">StudyMind</span>
        </div>
      </div>

      <div className="w-full bg-muted h-1">
        <div className="bg-accent h-1 w-full rounded-r-full transition-all" />
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex h-12 w-12 rounded-2xl bg-secondary items-center justify-center mb-2">
              <Target className="h-6 w-6 text-navy" />
            </div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">Set your learning goals</h2>
            <p className="text-muted-foreground text-sm">We'll tailor your experience based on your goals</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">What do you want to achieve?</label>
              <div className="grid grid-cols-1 gap-3">
                {goals.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => toggleGoal(g.id)}
                    className={`flex items-center gap-4 px-5 py-4 rounded-xl border transition-colors text-left ${
                      selectedGoals.includes(g.id)
                        ? "bg-navy text-highlight border-navy"
                        : "bg-card border-border text-foreground hover:border-accent/50"
                    }`}
                  >
                    <g.icon className={`h-5 w-5 flex-shrink-0 ${selectedGoals.includes(g.id) ? "text-highlight" : "text-accent"}`} />
                    <div>
                      <div className="text-sm font-semibold">{g.label}</div>
                      <div className={`text-xs mt-0.5 ${selectedGoals.includes(g.id) ? "text-soft" : "text-muted-foreground"}`}>{g.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Difficulty level</label>
              <div className="grid grid-cols-3 gap-3">
                {difficulties.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium border transition-colors ${
                      difficulty === d
                        ? "bg-navy text-highlight border-navy"
                        : "bg-card border-border text-foreground hover:border-accent/50"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Button
            onClick={() => navigate("/dashboard")}
            className="w-full h-11 bg-navy text-highlight hover:bg-navy/90 font-semibold gap-2"
          >
            Start Learning <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LearningGoals;
