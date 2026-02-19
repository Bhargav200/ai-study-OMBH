
-- Achievements definition table
CREATE TABLE public.achievements (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key text NOT NULL UNIQUE,
  name text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL DEFAULT 'trophy',
  category text NOT NULL DEFAULT 'general',
  threshold integer NOT NULL DEFAULT 1,
  xp_reward integer NOT NULL DEFAULT 50,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Achievements viewable by everyone"
  ON public.achievements FOR SELECT USING (true);

-- User earned achievements
CREATE TABLE public.user_achievements (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  achievement_id uuid NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own achievements"
  ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON public.user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Seed achievement definitions
INSERT INTO public.achievements (key, name, description, icon, category, threshold, xp_reward, sort_order) VALUES
  ('streak_7', '7-Day Streak', 'Study 7 days in a row', 'flame', 'streak', 7, 100, 1),
  ('streak_30', '30-Day Streak', 'Study 30 days in a row', 'flame', 'streak', 30, 500, 2),
  ('first_quiz', 'First Quiz', 'Complete your first quiz', 'medal', 'quiz', 1, 25, 3),
  ('quiz_master', 'Quiz Master', 'Complete 50 quizzes', 'trophy', 'quiz', 50, 300, 4),
  ('perfect_score', 'Perfect Score', 'Get 100% on a quiz', 'star', 'quiz', 1, 75, 5),
  ('sharp_shooter', 'Sharp Shooter', '90%+ on 10 quizzes', 'target', 'quiz', 10, 200, 6),
  ('bookworm', 'Bookworm', 'Complete 20 lessons', 'book-open', 'lesson', 20, 150, 7),
  ('xp_hunter', 'XP Hunter', 'Earn 1,000 XP', 'zap', 'xp', 1000, 100, 8),
  ('xp_legend', 'XP Legend', 'Earn 5,000 XP', 'zap', 'xp', 5000, 500, 9),
  ('first_doubt', 'Curious Mind', 'Ask your first doubt', 'message-circle-question', 'doubt', 1, 25, 10),
  ('study_hour', 'Study Hour', 'Study for 1 hour total', 'clock', 'study', 3600, 50, 11),
  ('study_marathon', 'Study Marathon', 'Study for 10 hours total', 'clock', 'study', 36000, 200, 12);
