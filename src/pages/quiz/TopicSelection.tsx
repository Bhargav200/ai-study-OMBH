import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Gamepad2, Search, Calculator, Atom, FlaskConical, Leaf } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const iconMap: Record<string, React.ReactNode> = {
  calculator: <Gamepad2 className="h-5 w-5 text-navy" />,
  atom: <Atom className="h-5 w-5 text-navy" />,
  "flask-conical": <FlaskConical className="h-5 w-5 text-navy" />,
  leaf: <Leaf className="h-5 w-5 text-navy" />,
};

const TopicSelection = () => {
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
    queryKey: ["quiz-topics"],
    queryFn: async () => {
      const { data } = await supabase
        .from("topics")
        .select("*, subjects(name, icon)")
        .order("sort_order");
      return (data ?? []).map((t) => ({
        ...t,
        subjectName: (t.subjects as any)?.name ?? "",
        subjectIcon: (t.subjects as any)?.icon ?? "",
      }));
    },
  });

  const subjectNames = ["All", ...(subjects?.map((s) => s.name) ?? [])];
  const filtered = (topics ?? []).filter(
    (t) => (filter === "All" || t.subjectName === filter) && t.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Practice Quiz</h1>
        <p className="text-muted-foreground text-sm mt-1">Select a topic to start practicing</p>
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

      <div className="grid sm:grid-cols-2 gap-3">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-5">
                <Skeleton className="h-10 w-10 rounded-lg mb-3" />
                <Skeleton className="h-4 w-40 mb-2" />
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-9 w-full mt-4" />
              </div>
            ))
          : filtered.map((t) => (
              <Link
                key={t.id}
                to={`/quiz/${t.id}`}
                state={{ topicTitle: t.title, subjectName: t.subjectName }}
                className="bg-card border border-border rounded-xl p-5 hover:border-accent/50 transition-colors group"
              >
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                    {iconMap[t.subjectIcon] ?? <Gamepad2 className="h-5 w-5 text-navy" />}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-foreground">{t.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{t.subjectName} · {t.lesson_count} lessons</div>
                  </div>
                </div>
                <Button size="sm" className="w-full mt-4 bg-navy text-highlight hover:bg-navy/90 text-xs">
                  Start Quiz
                </Button>
              </Link>
            ))}
      </div>
    </div>
  );
};

export default TopicSelection;
