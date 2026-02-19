
-- 1. Topic Progress (mastery tracking per topic per user)
CREATE TABLE public.topic_progress (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  topic_id uuid NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
  mastery_score numeric NOT NULL DEFAULT 0,
  quiz_count integer NOT NULL DEFAULT 0,
  avg_quiz_score numeric NOT NULL DEFAULT 0,
  lessons_completed integer NOT NULL DEFAULT 0,
  last_updated timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, topic_id)
);

ALTER TABLE public.topic_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own topic progress" ON public.topic_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own topic progress" ON public.topic_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own topic progress" ON public.topic_progress FOR UPDATE USING (auth.uid() = user_id);

-- 2. Friends system
CREATE TABLE public.friends (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id uuid NOT NULL,
  addressee_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(requester_id, addressee_id)
);

ALTER TABLE public.friends ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own friend records" ON public.friends FOR SELECT
  USING (auth.uid() = requester_id OR auth.uid() = addressee_id);
CREATE POLICY "Users can send friend requests" ON public.friends FOR INSERT
  WITH CHECK (auth.uid() = requester_id);
CREATE POLICY "Users can update friend requests they received" ON public.friends FOR UPDATE
  USING (auth.uid() = addressee_id);
CREATE POLICY "Users can delete own friend records" ON public.friends FOR DELETE
  USING (auth.uid() = requester_id OR auth.uid() = addressee_id);

-- 3. User Recommendations
CREATE TABLE public.user_recommendations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  recommendation_type text NOT NULL,
  reference_id uuid,
  title text NOT NULL,
  description text,
  priority_score integer NOT NULL DEFAULT 0,
  generated_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone,
  dismissed boolean NOT NULL DEFAULT false
);

ALTER TABLE public.user_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own recommendations" ON public.user_recommendations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own recommendations" ON public.user_recommendations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own recommendations" ON public.user_recommendations FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Index for fast lookups
CREATE INDEX idx_topic_progress_user ON public.topic_progress(user_id);
CREATE INDEX idx_friends_requester ON public.friends(requester_id);
CREATE INDEX idx_friends_addressee ON public.friends(addressee_id);
CREATE INDEX idx_recommendations_user ON public.user_recommendations(user_id);
