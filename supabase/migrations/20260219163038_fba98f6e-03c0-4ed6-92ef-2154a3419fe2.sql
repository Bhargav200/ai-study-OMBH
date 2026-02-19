
-- Section B: Doubt History System

-- Doubt sessions
CREATE TABLE public.doubt_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  topic_id UUID REFERENCES public.topics(id) ON DELETE SET NULL,
  question_preview TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.doubt_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own doubt sessions"
ON public.doubt_sessions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own doubt sessions"
ON public.doubt_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Doubt messages
CREATE TABLE public.doubt_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  doubt_session_id UUID NOT NULL REFERENCES public.doubt_sessions(id) ON DELETE CASCADE,
  role VARCHAR NOT NULL CHECK (role IN ('user', 'assistant')),
  message_text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.doubt_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own doubt messages"
ON public.doubt_messages FOR SELECT
USING (
  EXISTS (SELECT 1 FROM public.doubt_sessions ds WHERE ds.id = doubt_session_id AND ds.user_id = auth.uid())
);

CREATE POLICY "Users can insert own doubt messages"
ON public.doubt_messages FOR INSERT
WITH CHECK (
  EXISTS (SELECT 1 FROM public.doubt_sessions ds WHERE ds.id = doubt_session_id AND ds.user_id = auth.uid())
);

-- AI usage logs
CREATE TABLE public.ai_usage_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  feature_type VARCHAR NOT NULL,
  model_name VARCHAR,
  prompt_tokens INTEGER DEFAULT 0,
  completion_tokens INTEGER DEFAULT 0,
  total_tokens INTEGER DEFAULT 0,
  estimated_cost NUMERIC DEFAULT 0,
  request_status VARCHAR DEFAULT 'success',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own ai usage"
ON public.ai_usage_logs FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ai usage"
ON public.ai_usage_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_ai_usage_user_created ON public.ai_usage_logs(user_id, created_at);
