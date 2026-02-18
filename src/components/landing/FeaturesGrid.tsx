import { Brain, Zap, Timer, BarChart3, Upload, Compass } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Homework Solver",
    description: "Get step-by-step solutions and explanations for any problem, powered by advanced AI models.",
  },
  {
    icon: Zap,
    title: "Smart Quiz Engine",
    description: "Auto-generated quizzes that adapt to your knowledge gaps and strengthen weak areas.",
  },
  {
    icon: Timer,
    title: "Study Timer & Streaks",
    description: "Build consistent habits with timed study sessions and motivating daily streaks.",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description: "Visualize your improvement over time with detailed analytics and mastery indicators.",
  },
  {
    icon: Upload,
    title: "Material Upload Learning",
    description: "Upload notes, PDFs, or textbooks — AI reads and creates study material from your content.",
  },
  {
    icon: Compass,
    title: "Personalized Recommendations",
    description: "AI analyzes your performance to suggest exactly what to study next for maximum growth.",
  },
];

const FeaturesGrid = () => (
  <section id="features" className="py-24 bg-background">
    <div className="container max-w-7xl mx-auto px-4">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-4">Core Features</p>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
          Everything you need to study smarter
        </h2>
        <p className="text-muted-foreground text-lg">
          A complete toolkit designed to transform how you learn, practice, and grow.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f) => (
          <div
            key={f.title}
            className="group bg-card border border-border rounded-2xl p-7 hover:shadow-lg hover:border-accent/30 transition-all duration-300"
          >
            <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center mb-5 group-hover:bg-accent/15 transition-colors">
              <f.icon className="h-6 w-6 text-navy" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesGrid;
