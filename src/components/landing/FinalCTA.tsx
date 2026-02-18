import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const FinalCTA = () => (
  <section className="py-28 bg-deep text-deep-foreground relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-navy/50 to-transparent" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-interface/8 rounded-full blur-[120px]" />

    <div className="container relative max-w-3xl mx-auto px-4 text-center">
      <div className="inline-flex items-center gap-2 bg-navy/60 border border-interface/20 rounded-full px-4 py-1.5 text-xs font-medium text-soft mb-8">
        <Sparkles className="h-3.5 w-3.5 text-highlight" />
        Free to get started
      </div>

      <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
        Start Studying Smarter <span className="text-highlight">Today.</span>
      </h2>

      <p className="text-soft text-lg mb-10 max-w-xl mx-auto">
        Free access, instant AI tutoring, and daily improvement. Join thousands of students already learning smarter.
      </p>

      <div className="flex flex-wrap gap-4 justify-center">
        <Button className="bg-highlight text-navy hover:bg-highlight/90 font-semibold h-12 px-8 rounded-xl text-sm gap-2">
          Start Free
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Button variant="outline" className="border-interface/40 text-soft hover:text-highlight hover:border-highlight/40 h-12 px-8 rounded-xl text-sm bg-transparent">
          Try Demo
        </Button>
      </div>
    </div>
  </section>
);

export default FinalCTA;
