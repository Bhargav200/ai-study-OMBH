import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Sparkles, BookOpen, Calculator, Atom } from "lucide-react";

const DoubtInput = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");

  const handleSubmit = () => {
    if (question.trim()) {
      navigate("/doubts/solution", { state: { question: question.trim() } });
    }
  };

  const recentDoubts = [
    "How do I solve integrals by substitution?",
    "Explain the photoelectric effect",
    "What is the difference between mitosis and meiosis?",
  ];

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Ask a Doubt</h1>
        <p className="text-muted-foreground text-sm mt-1">Get step-by-step explanations from AI</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border">
          <Sparkles className="h-5 w-5 text-accent" />
          <span className="font-semibold text-sm text-foreground">AI Doubt Solver</span>
        </div>

        <Textarea
          placeholder="Type your question here... e.g. 'How do I find the derivative of sin(x)?'"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="min-h-[120px] resize-none"
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey && question.trim()) { e.preventDefault(); handleSubmit(); } }}
        />

        <div className="flex items-center gap-3">
          <div className="flex-1" />
          <Button
            onClick={handleSubmit}
            className="gap-2 bg-navy text-highlight hover:bg-navy/90 font-semibold"
            disabled={!question.trim()}
          >
            <Send className="h-4 w-4" /> Get Solution
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Calculator, label: "Math", color: "bg-secondary text-navy" },
          { icon: Atom, label: "Science", color: "bg-accent/10 text-accent" },
          { icon: BookOpen, label: "English", color: "bg-secondary text-navy" },
        ].map((s) => (
          <button
            key={s.label}
            onClick={() => setQuestion(`Help me with ${s.label}: `)}
            className="bg-card border border-border rounded-xl p-4 text-center hover:border-accent/50 transition-colors"
          >
            <div className={`h-10 w-10 rounded-lg ${s.color} flex items-center justify-center mx-auto mb-2`}>
              <s.icon className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium text-foreground">{s.label}</span>
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Try These</h3>
        {recentDoubts.map((d) => (
          <button
            key={d}
            onClick={() => { setQuestion(d); }}
            className="w-full text-left bg-card border border-border rounded-lg px-4 py-3 text-sm text-muted-foreground hover:border-accent/50 transition-colors"
          >
            {d}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DoubtInput;
