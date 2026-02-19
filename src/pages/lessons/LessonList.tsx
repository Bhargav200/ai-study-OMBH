import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, ChevronRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const subjects = ["All", "Mathematics", "Physics", "Chemistry", "Biology"];

const lessons = [
  { id: "1", title: "Quadratic Equations", subject: "Mathematics", lessons: 12, completed: 8, pct: 65 },
  { id: "2", title: "Newton's Laws of Motion", subject: "Physics", lessons: 8, completed: 3, pct: 40 },
  { id: "3", title: "Cell Structure & Function", subject: "Biology", lessons: 10, completed: 8, pct: 80 },
  { id: "4", title: "Chemical Bonding", subject: "Chemistry", lessons: 9, completed: 2, pct: 22 },
  { id: "5", title: "Trigonometry", subject: "Mathematics", lessons: 14, completed: 14, pct: 100 },
  { id: "6", title: "Thermodynamics", subject: "Physics", lessons: 11, completed: 0, pct: 0 },
  { id: "7", title: "Organic Chemistry", subject: "Chemistry", lessons: 15, completed: 4, pct: 27 },
  { id: "8", title: "Genetics", subject: "Biology", lessons: 8, completed: 6, pct: 75 },
];

const LessonList = () => {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = lessons.filter(
    (l) => (filter === "All" || l.subject === filter) && l.title.toLowerCase().includes(search.toLowerCase())
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
          {subjects.map((s) => (
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
        {filtered.map((l) => (
          <Link
            key={l.id}
            to={`/lessons/${l.id}`}
            className="flex items-center gap-4 bg-card border border-border rounded-xl p-5 hover:border-accent/50 transition-colors group"
          >
            <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
              <BookOpen className="h-5 w-5 text-navy" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-foreground">{l.title}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{l.subject} · {l.completed}/{l.lessons} lessons</div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-2 w-full max-w-xs">
                <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${l.pct}%` }} />
              </div>
            </div>
            <span className="text-xs font-bold text-accent">{l.pct}%</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LessonList;
