import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, ChevronRight, Search, Calculator, Atom, FlaskConical, Leaf } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const iconMap: Record<string, React.ReactNode> = {
  calculator: <Calculator className="h-5 w-5 text-navy" />,
  atom: <Atom className="h-5 w-5 text-navy" />,
  "flask-conical": <FlaskConical className="h-5 w-5 text-navy" />,
  leaf: <Leaf className="h-5 w-5 text-navy" />,
};

const LessonList = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const { data: subjects } = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      const { data } = await supabase.from("subjects").select("*").order("name");
      return data ?? [];
    },
  });

  const { data: topics, isLoading } = useQuery({
    queryKey: ["topics-with-progress", user?.id],
    queryFn: async () => {
      const { data: topicsData } = await supabase
        .from("topics")
        .select("*, subjects(name, icon)")
        .order("sort_order");

      if (!topicsData) return [];

      // Get all lessons grouped by topic
      const { data: lessons } = await supabase.from("lessons").select("id, topic_id");

      // Get user progress
      const { data: progress } = user
        ? await supabase.from("user_lesson_progress").select("lesson_id, completed").eq("user_id", user.id)
        : { data: [] };

      const completedSet = new Set((progress ?? []).filter((p) => p.completed).map((p) => p.lesson_id));

      return topicsData.map((t) => {
        const topicLessons = (lessons ?? []).filter((l) => l.topic_id === t.id);
        const completedCount = topicLessons.filter((l) => completedSet.has(l.id)).length;
        const total = topicLessons.length || t.lesson_count;
        return {
          ...t,
          subjectName: (t.subjects as any)?.name ?? "",
          subjectIcon: (t.subjects as any)?.icon ?? "book-open",
          totalLessons: total,
          completedLessons: completedCount,
          pct: total > 0 ? Math.round((completedCount / total) * 100) : 0,
        };
      });
    },
  });

  const subjectNames = ["All", ...(subjects?.map((s) => s.name) ?? [])];

  const filtered = (topics ?? []).filter(
    (t) =>
      (filter === "All" || t.subjectName === filter) &&
      t.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Lessons</h1>
        <p className="text-muted-foreground text-sm mt-1">Browse topics and continue learning</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search topics..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 h-10" />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {subjectNames.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-2 rounded-lg text-xs font-medium border whitespace-nowrap transition-colors ${
                filter === s ? "bg-navy text-highlight border-navy" : "bg-card border-border text-foreground hover:border-accent/50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 bg-card border border-border rounded-xl p-5">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-1.5 w-full max-w-xs" />
                </div>
              </div>
            ))
          : filtered.map((t) => (
              <Link
                key={t.id}
                to={`/lessons/${t.id}`}
                className="flex items-center gap-4 bg-card border border-border rounded-xl p-5 hover:border-accent/50 transition-colors group"
              >
                <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                  {iconMap[t.subjectIcon] ?? <BookOpen className="h-5 w-5 text-navy" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-foreground">{t.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {t.subjectName} · {t.completedLessons}/{t.totalLessons} lessons
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-2 w-full max-w-xs">
                    <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${t.pct}%` }} />
                  </div>
                </div>
                <span className="text-xs font-bold text-accent">{t.pct}%</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </Link>
            ))}
      </div>
    </div>
  );
};

export default LessonList;
