import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bot, FileText, ArrowRight, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Material {
  id: string;
  file_name: string;
  processing_status: string;
  uploaded_at: string;
}

const AITutor = () => {
  const { user } = useAuth();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchMaterials = async () => {
      const { data } = await supabase
        .from("materials")
        .select("id, file_name, processing_status, uploaded_at")
        .eq("user_id", user.id)
        .eq("processing_status", "completed")
        .order("uploaded_at", { ascending: false });
      setMaterials(data || []);
      setLoading(false);
    };
    fetchMaterials();
  }, [user]);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
          <Bot className="h-6 w-6 text-accent" /> AI Tutor
        </h1>
        <p className="text-muted-foreground text-sm">
          Select a material to start learning with your AI tutor. It will explain concepts, answer questions, and suggest YouTube playlists.
        </p>
      </div>

      {materials.length === 0 ? (
        <div className="border border-dashed border-border rounded-xl p-10 text-center space-y-4">
          <Upload className="h-10 w-10 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground text-sm">No materials uploaded yet. Upload study materials first to use the AI Tutor.</p>
          <Button asChild variant="outline">
            <Link to="/materials">Upload Materials</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {materials.map((m) => (
            <Link
              key={m.id}
              to={`/materials/learn/${m.id}`}
              className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-accent/50 transition-colors group"
            >
              <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                <FileText className="h-5 w-5 text-navy" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground truncate">{m.file_name}</div>
                <div className="text-xs text-muted-foreground">
                  Uploaded {new Date(m.uploaded_at).toLocaleDateString()}
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default AITutor;
