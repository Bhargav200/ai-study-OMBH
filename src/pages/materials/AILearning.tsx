import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, FileText, Send, Sparkles, ListChecks } from "lucide-react";

const AILearning = () => {
  const [question, setQuestion] = useState("");

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      <Link to="/materials" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Materials
      </Link>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Document viewer */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-border">
            <FileText className="h-5 w-5 text-accent" />
            <span className="font-semibold text-sm text-foreground">Biology_Chapter_5.pdf</span>
          </div>
          <div className="bg-muted rounded-lg p-6 min-h-[300px] text-sm text-muted-foreground leading-relaxed">
            <h3 className="text-foreground font-semibold mb-3">Chapter 5: Cell Division</h3>
            <p>Cell division is the process by which a parent cell divides into two or more daughter cells. Cell division usually occurs as part of a larger cell cycle...</p>
            <p className="mt-3">Mitosis is a process of cell division that results in two genetically identical daughter cells developing from a single parent cell...</p>
            <p className="mt-3">Meiosis is a special type of cell division that reduces the chromosome number by half, creating four haploid cells...</p>
          </div>
        </div>

        {/* AI panel */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4 flex flex-col">
          <div className="flex items-center gap-2 pb-3 border-b border-border">
            <Sparkles className="h-5 w-5 text-accent" />
            <span className="font-semibold text-sm text-foreground">AI Assistant</span>
          </div>

          <div className="flex-1 space-y-3 min-h-[200px]">
            <div className="bg-navy rounded-xl px-4 py-3 text-sm text-highlight max-w-[90%]">
              I've analyzed Chapter 5. Ask me anything about cell division, or I can generate a summary or quiz!
            </div>
            <div className="bg-muted rounded-xl px-4 py-3 text-sm text-foreground max-w-[80%] ml-auto">
              What's the difference between mitosis and meiosis?
            </div>
            <div className="bg-navy rounded-xl px-4 py-3 text-sm text-highlight max-w-[90%]">
              <strong>Mitosis</strong> produces 2 identical diploid cells (for growth/repair). <strong>Meiosis</strong> produces 4 genetically unique haploid cells (for reproduction). Key difference: meiosis has crossing over and two divisions.
            </div>
          </div>

          <div className="flex gap-2 pt-2 border-t border-border">
            <Button variant="outline" size="sm" className="gap-1 text-xs">
              <ListChecks className="h-3 w-3" /> Generate Quiz
            </Button>
            <Button variant="outline" size="sm" className="text-xs">Summarize</Button>
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Ask a question about this document..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="h-10"
            />
            <Button size="icon" className="bg-navy text-highlight hover:bg-navy/90 h-10 w-10">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AILearning;
