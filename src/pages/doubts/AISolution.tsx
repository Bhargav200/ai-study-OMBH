import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Lightbulb, Gamepad2 } from "lucide-react";

const AISolution = () => (
  <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-6">
    <Link to="/doubts" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
      <ArrowLeft className="h-4 w-4" /> Ask another doubt
    </Link>

    {/* Original question */}
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="text-xs text-muted-foreground mb-2">Your Question</div>
      <p className="text-sm text-foreground font-medium">How do I solve integrals by substitution?</p>
    </div>

    {/* AI solution */}
    <div className="bg-card border border-border rounded-xl p-6 space-y-5">
      <div className="flex items-center gap-2 pb-3 border-b border-border">
        <Sparkles className="h-5 w-5 text-accent" />
        <span className="font-semibold text-sm text-foreground">Step-by-Step Solution</span>
      </div>

      <div className="space-y-4">
        {[
          { step: 1, title: "Identify the substitution", content: "Look for a composite function f(g(x)). Choose u = g(x), the inner function." },
          { step: 2, title: "Compute du", content: "Differentiate u with respect to x: du = g'(x)dx. Express dx in terms of du." },
          { step: 3, title: "Substitute", content: "Replace all x-terms in the integral with u-terms. The integral should now only contain u." },
          { step: 4, title: "Integrate", content: "Evaluate the simpler integral in terms of u." },
          { step: 5, title: "Back-substitute", content: "Replace u with the original expression g(x) to get the final answer." },
        ].map((s) => (
          <div key={s.step} className="flex gap-4">
            <div className="h-7 w-7 rounded-full bg-navy text-highlight flex items-center justify-center flex-shrink-0 text-xs font-bold">
              {s.step}
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">{s.title}</div>
              <div className="text-sm text-muted-foreground mt-0.5">{s.content}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Example */}
      <div className="bg-muted rounded-lg p-4 space-y-2">
        <div className="text-xs font-semibold text-foreground flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-accent" /> Example
        </div>
        <div className="font-mono text-sm text-muted-foreground space-y-1">
          <div>∫ 2x · cos(x²) dx</div>
          <div className="text-accent">Let u = x², du = 2x dx</div>
          <div className="text-accent">∫ cos(u) du = sin(u) + C</div>
          <div className="text-accent font-semibold">= sin(x²) + C</div>
        </div>
      </div>
    </div>

    {/* Concept explanation */}
    <div className="bg-secondary/50 border border-accent/10 rounded-xl p-5 space-y-2">
      <div className="text-sm font-semibold text-foreground">💡 Key Concept</div>
      <p className="text-sm text-muted-foreground">
        U-substitution is essentially the reverse of the chain rule. Whenever you see a function and its derivative together in an integral, substitution is likely the right approach.
      </p>
    </div>

    <div className="flex gap-3">
      <Link to="/doubts" className="flex-1">
        <Button variant="outline" className="w-full">Ask Another Doubt</Button>
      </Link>
      <Link to="/quiz" className="flex-1">
        <Button className="w-full bg-navy text-highlight hover:bg-navy/90 gap-2">
          <Gamepad2 className="h-4 w-4" /> Practice This Topic
        </Button>
      </Link>
    </div>
  </div>
);

export default AISolution;
