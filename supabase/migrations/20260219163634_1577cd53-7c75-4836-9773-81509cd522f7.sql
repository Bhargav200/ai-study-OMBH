
-- Section D: Material Upload & RAG

-- Storage bucket for materials
INSERT INTO storage.buckets (id, name, public) VALUES ('materials', 'materials', false);

-- Storage policies
CREATE POLICY "Users can upload own materials"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'materials' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own materials"
ON storage.objects FOR SELECT
USING (bucket_id = 'materials' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own materials"
ON storage.objects FOR DELETE
USING (bucket_id = 'materials' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Materials metadata table
CREATE TABLE public.materials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  file_name VARCHAR NOT NULL,
  storage_path VARCHAR NOT NULL,
  content_type VARCHAR,
  file_size INTEGER DEFAULT 0,
  processing_status VARCHAR NOT NULL DEFAULT 'pending',
  extracted_text TEXT,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own materials"
ON public.materials FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own materials"
ON public.materials FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own materials"
ON public.materials FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can update own materials"
ON public.materials FOR UPDATE USING (auth.uid() = user_id);

-- Material chunks for RAG
CREATE TABLE public.material_chunks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  material_id UUID NOT NULL REFERENCES public.materials(id) ON DELETE CASCADE,
  chunk_text TEXT NOT NULL,
  chunk_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.material_chunks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own material chunks"
ON public.material_chunks FOR SELECT
USING (
  EXISTS (SELECT 1 FROM public.materials m WHERE m.id = material_id AND m.user_id = auth.uid())
);
