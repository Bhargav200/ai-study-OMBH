import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle2, BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const LessonViewer = () => {
  const { id: topicId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch topic info
  const { data: topic } = useQuery({
    queryKey: ["topic", topicId],
    queryFn: async () => {
      const { data } = await supabase
        .from("topics")
        .select("*, subjects(name)")
        .eq("id", topicId!)
        .single();
      return data;
    },
    enabled: !!topicId,
  });

  // Fetch lessons for this topic
  const { data: lessons, isLoading } = useQuery({
    queryKey: ["lessons", topicId],
    queryFn: async () => {
      const { data } = await supabase
        .from("lessons")
        .select("*")
        .eq("topic_id", topicId!)
        .order("sort_order");
      return data ?? [];
    },
    enabled: !!topicId,
  });

  // Fetch user progress for these lessons
  const { data: progress } = useQuery({
    queryKey: ["lesson-progress", topicId, user?.id],
    queryFn: async () => {
      if (!user || !lessons) return [];
      const { data } = await supabase
        .from("user_lesson_progress")
        .select("*")
        .eq("user_id", user.id)
        .in("lesson_id", lessons.map((l) => l.id));
      return data ?? [];
    },
    enabled: !!user && !!lessons && lessons.length > 0,
  });

  const completedSet = new Set((progress ?? []).filter((p) => p.completed).map((p) => p.lesson_id));

  const currentLesson = lessons?.[currentIndex];
  const isCompleted = currentLesson ? completedSet.has(currentLesson.id) : false;
  const totalLessons = lessons?.length ?? 0;
  const overallPct = totalLessons > 0 ? Math.round(((completedSet.size) / totalLessons) * 100) : 0;

  const markComplete = useMutation({
    mutationFn: async () => {
      if (!user || !currentLesson) return;
      const { error } = await supabase.from("user_lesson_progress").upsert(
        { user_id: user.id, lesson_id: currentLesson.id, completed: true, completed_at: new Date().toISOString() },
        { onConflict: "user_id,lesson_id" }
      );
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lesson-progress"] });
      queryClient.invalidateQueries({ queryKey: ["topics-with-progress"] });
      toast.success("Lesson completed! 🎉");
    },
  });

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-1 w-full" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (!currentLesson) {
    return (
      <div className="p-6 md:p-8 max-w-3xl mx-auto text-center space-y-4">
        <p className="text-muted-foreground">No lessons found for this topic.</p>
        <Link to="/lessons" className="text-accent hover:underline text-sm">← Back to Lessons</Link>
      </div>
    );
  }

  // Simple markdown-ish renderer
  const renderContent = (content: string) => {
    return content.split("\n").map((line, i) => {
      if (line.startsWith("### ")) return <h4 key={i} className="text-base font-semibold mt-4">{line.slice(4)}</h4>;
      if (line.startsWith("## ")) return <h3 key={i} className="text-lg font-semibold mt-6">{line.slice(3)}</h3>;
      if (line.startsWith("```")) return null;
      if (line.startsWith("- ")) return <li key={i} className="text-muted-foreground ml-4">{line.slice(2)}</li>;
      if (/^\d+\.\s/.test(line)) return <li key={i} className="text-muted-foreground ml-4 list-decimal">{line.replace(/^\d+\.\s/, "")}</li>;
      if (line.trim() === "") return <br key={i} />;
      // code-ish lines (inside code blocks)
      if (line.startsWith("  ") || /^[a-zA-Z].*=.*/.test(line.trim())) {
        return <div key={i} className="font-mono text-sm text-accent bg-muted px-3 py-0.5 rounded">{line}</div>;
      }
      return <p key={i} className="text-muted-foreground leading-relaxed">{line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/`(.*?)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">$1</code>')}</p>;
    });
  };

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-6">
      <Link to="/lessons" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Lessons
      </Link>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="bg-secondary text-navy px-2 py-0.5 rounded-full font-medium">
            {(topic?.subjects as any)?.name ?? "Subject"}
          </span>
          <span>Lesson {currentIndex + 1} of {totalLessons}</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">{currentLesson.title}</h1>
      </div>

      <div className="h-1 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${overallPct}%` }} />
      </div>

      <div className="bg-card border border-border rounded-xl p-6 md:p-8 space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <BookOpen className="h-5 w-5 text-accent" />
          <span className="font-semibold text-foreground">Lesson Content</span>
        </div>
        <div className="prose prose-sm max-w-none text-foreground space-y-1">
          {renderContent(currentLesson.content)}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          className="gap-2"
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((i) => i - 1)}
        >
          <ArrowLeft className="h-4 w-4" /> Previous
        </Button>
        <Button
          onClick={() => markComplete.mutate()}
          className={`gap-2 flex-1 ${isCompleted ? "bg-accent/20 text-accent border border-accent/30" : "bg-navy text-highlight hover:bg-navy/90"}`}
          disabled={isCompleted || markComplete.isPending}
        >
          {isCompleted ? <><CheckCircle2 className="h-4 w-4" /> Completed</> : "Mark Complete"}
        </Button>
        <Button
          className="gap-2 bg-navy text-highlight hover:bg-navy/90"
          disabled={currentIndex >= totalLessons - 1}
          onClick={() => setCurrentIndex((i) => i + 1)}
        >
          Next <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default LessonViewer;
