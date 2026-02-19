import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X, ArrowRight, CheckCircle2 } from "lucide-react";

const mockFiles = [
  { name: "Biology_Chapter_5.pdf", size: "2.4 MB", status: "ready" },
  { name: "Physics_Notes.pdf", size: "1.8 MB", status: "ready" },
];

const MaterialUpload = () => {
  const [files, setFiles] = useState(mockFiles);

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Upload Materials</h1>
        <p className="text-muted-foreground text-sm mt-1">Upload documents and learn from them with AI</p>
      </div>

      {/* Drop zone */}
      <div className="border-2 border-dashed border-border rounded-xl p-10 text-center hover:border-accent/50 transition-colors cursor-pointer">
        <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
        <div className="text-sm font-medium text-foreground">Drop files here or click to browse</div>
        <div className="text-xs text-muted-foreground mt-1">PDF, DOCX, TXT up to 10MB</div>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Uploaded Files</h3>
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-4 bg-card border border-border rounded-xl p-4">
              <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                <FileText className="h-5 w-5 text-navy" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground truncate">{f.name}</div>
                <div className="text-xs text-muted-foreground">{f.size}</div>
              </div>
              <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
              <Link to="/materials/learn">
                <Button size="sm" className="bg-navy text-highlight hover:bg-navy/90 text-xs gap-1">
                  Learn <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
              <button onClick={() => setFiles(files.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-destructive">
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
