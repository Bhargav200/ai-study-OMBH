import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle2, BookOpen } from "lucide-react";

const LessonViewer = () => {
  const { id } = useParams();
  const [completed, setCompleted] = useState(false);

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-6">
      <Link to="/lessons" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Lessons
      </Link>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="bg-secondary text-navy px-2 py-0.5 rounded-full font-medium">Mathematics</span>
          <span>Lesson 8 of 12</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Solving Quadratic Equations by Factoring</h1>
      </div>

      {/* Progress */}
      <div className="h-1 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-accent rounded-full" style={{ width: "67%" }} />
      </div>

      {/* Lesson content */}
      <div className="bg-card border border-border rounded-xl p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <BookOpen className="h-5 w-5 text-accent" />
          <span className="font-semibold text-foreground">Lesson Content</span>
        </div>

        <div className="prose prose-sm max-w-none text-foreground">
          <h3 className="text-lg font-semibold">Introduction</h3>
          <p className="text-muted-foreground leading-relaxed">
            A quadratic equation is a polynomial equation of degree 2. The general form is <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">ax² + bx + c = 0</code>, where a ≠ 0.
          </p>

          <h3 className="text-lg font-semibold mt-6">Steps to Factor</h3>
          <ol className="space-y-2 text-muted-foreground">
            <li>Write the equation in standard form</li>
            <li>Find two numbers that multiply to give ac and add to give b</li>
            <li>Rewrite the middle term using these two numbers</li>
            <li>Factor by grouping</li>
            <li>Set each factor equal to zero and solve</li>
          </ol>

          <h3 className="text-lg font-semibold mt-6">Example</h3>
          <div className="bg-muted rounded-lg p-4 font-mono text-sm">
            <div>x² + 5x + 6 = 0</div>
            <div className="text-accent mt-1">(x + 2)(x + 3) = 0</div>
            <div className="text-accent">x = -2 or x = -3</div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button variant="outline" className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Previous
        </Button>
        <Button
          onClick={() => setCompleted(true)}
          className={`gap-2 flex-1 ${completed ? "bg-accent/20 text-accent border border-accent/30" : "bg-navy text-highlight hover:bg-navy/90"}`}
          disabled={completed}
        >
          {completed ? <><CheckCircle2 className="h-4 w-4" /> Completed</> : "Mark Complete"}
        </Button>
        <Button className="gap-2 bg-navy text-highlight hover:bg-navy/90">
          Next <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default LessonViewer;
