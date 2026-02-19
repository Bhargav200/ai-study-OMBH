import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const PROCESS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/process-material`;

const MaterialUpload = () => {
  const { user, session } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const { data: materials, isLoading } = useQuery({
    queryKey: ["materials", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from("materials")
        .select("*")
        .eq("user_id", user.id)
        .order("uploaded_at", { ascending: false });
      return data ?? [];
    },
    enabled: !!user,
  });

  const handleUpload = async (files: FileList | null) => {
    if (!files || !user || !session) return;

    setUploading(true);
    for (const file of Array.from(files)) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 10MB)`);
        continue;
      }

      try {
        const path = `${user.id}/${Date.now()}_${file.name}`;
        const { error: uploadErr } = await supabase.storage.from("materials").upload(path, file);
        if (uploadErr) throw uploadErr;

        // Save metadata
        const { data: material, error: insertErr } = await supabase
          .from("materials")
          .insert({
            user_id: user.id,
            file_name: file.name,
            storage_path: path,
            content_type: file.type,
            file_size: file.size,
            processing_status: "processing",
          })
          .select("id")
          .single();

        if (insertErr) throw insertErr;

        toast.success(`${file.name} uploaded. Processing...`);

        // Trigger processing
        fetch(PROCESS_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ materialId: material.id }),
        }).then(async (resp) => {
          if (resp.ok) {
            toast.success(`${file.name} processed and ready!`);
          } else {
            toast.error(`Failed to process ${file.name}`);
          }
          queryClient.invalidateQueries({ queryKey: ["materials"] });
        });
      } catch (e: any) {
        toast.error(`Upload failed: ${e.message}`);
      }
    }
    setUploading(false);
    queryClient.invalidateQueries({ queryKey: ["materials"] });
  };

  const handleDelete = async (id: string, storagePath: string) => {
    await supabase.storage.from("materials").remove([storagePath]);
    await supabase.from("materials").delete().eq("id", id);
    queryClient.invalidateQueries({ queryKey: ["materials"] });
    toast.success("File deleted");
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Upload Materials</h1>
        <p className="text-muted-foreground text-sm mt-1">Upload documents and learn from them with AI</p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.txt,.md"
        multiple
        className="hidden"
        onChange={(e) => handleUpload(e.target.files)}
      />

      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
        onDrop={(e) => { e.preventDefault(); e.stopPropagation(); handleUpload(e.dataTransfer.files); }}
        className="border-2 border-dashed border-border rounded-xl p-10 text-center hover:border-accent/50 transition-colors cursor-pointer"
      >
        {uploading ? (
          <Loader2 className="h-10 w-10 text-accent mx-auto mb-4 animate-spin" />
        ) : (
          <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
        )}
        <div className="text-sm font-medium text-foreground">{uploading ? "Uploading..." : "Drop files here or click to browse"}</div>
        <div className="text-xs text-muted-foreground mt-1">PDF, DOCX, TXT up to 10MB</div>
      </div>

      {(materials?.length ?? 0) > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Your Materials</h3>
          {materials?.map((f) => (
            <div key={f.id} className="flex items-center gap-4 bg-card border border-border rounded-xl p-4">
              <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                <FileText className="h-5 w-5 text-navy" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground truncate">{f.file_name}</div>
                <div className="text-xs text-muted-foreground">{formatSize(f.file_size)} · {f.processing_status}</div>
              </div>
              {f.processing_status === "ready" && (
                <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
              )}
              {f.processing_status === "processing" && (
                <Loader2 className="h-4 w-4 text-muted-foreground animate-spin flex-shrink-0" />
              )}
              {f.processing_status === "ready" && (
                <Link to={`/materials/learn/${f.id}`}>
                  <Button size="sm" className="bg-navy text-highlight hover:bg-navy/90 text-xs gap-1">
                    Learn <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              )}
              <button onClick={() => handleDelete(f.id, f.storage_path)} className="text-muted-foreground hover:text-destructive">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MaterialUpload;
