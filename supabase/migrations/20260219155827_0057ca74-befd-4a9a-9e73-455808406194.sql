
-- Subjects table
CREATE TABLE public.subjects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  icon TEXT,
  color TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Subjects are viewable by everyone"
ON public.subjects FOR SELECT
USING (true);

-- Topics table (belongs to a subject)
CREATE TABLE public.topics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  lesson_count INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Topics are viewable by everyone"
ON public.topics FOR SELECT
USING (true);

-- Lessons table (belongs to a topic)
CREATE TABLE public.lessons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lessons are viewable by everyone"
ON public.lessons FOR SELECT
USING (true);

-- User lesson progress (tracks completion per user per lesson)
CREATE TABLE public.user_lesson_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

ALTER TABLE public.user_lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own lesson progress"
ON public.user_lesson_progress FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own lesson progress"
ON public.user_lesson_progress FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own lesson progress"
ON public.user_lesson_progress FOR UPDATE
USING (auth.uid() = user_id);

-- Seed subjects
INSERT INTO public.subjects (name, icon, color) VALUES
  ('Mathematics', 'calculator', 'hsl(220, 70%, 50%)'),
  ('Physics', 'atom', 'hsl(280, 60%, 55%)'),
  ('Chemistry', 'flask-conical', 'hsl(150, 60%, 40%)'),
  ('Biology', 'leaf', 'hsl(100, 55%, 45%)');

-- Seed topics
INSERT INTO public.topics (subject_id, title, description, lesson_count, sort_order) VALUES
  ((SELECT id FROM public.subjects WHERE name='Mathematics'), 'Quadratic Equations', 'Learn to solve quadratic equations using various methods', 5, 1),
  ((SELECT id FROM public.subjects WHERE name='Mathematics'), 'Trigonometry', 'Master trigonometric functions and identities', 6, 2),
  ((SELECT id FROM public.subjects WHERE name='Physics'), 'Newton''s Laws of Motion', 'Understand the three fundamental laws of motion', 4, 1),
  ((SELECT id FROM public.subjects WHERE name='Physics'), 'Thermodynamics', 'Study heat, energy, and work', 5, 2),
  ((SELECT id FROM public.subjects WHERE name='Chemistry'), 'Chemical Bonding', 'Explore ionic, covalent, and metallic bonds', 4, 1),
  ((SELECT id FROM public.subjects WHERE name='Chemistry'), 'Organic Chemistry', 'Introduction to carbon compounds', 6, 2),
  ((SELECT id FROM public.subjects WHERE name='Biology'), 'Cell Structure & Function', 'Understand the building blocks of life', 5, 1),
  ((SELECT id FROM public.subjects WHERE name='Biology'), 'Genetics', 'Study heredity and variation', 4, 2);

-- Seed a few lessons for Quadratic Equations
INSERT INTO public.lessons (topic_id, title, content, sort_order) VALUES
  ((SELECT id FROM public.topics WHERE title='Quadratic Equations'), 'What is a Quadratic Equation?', '## Introduction\n\nA **quadratic equation** is a polynomial equation of degree 2. The general form is:\n\n```\nax² + bx + c = 0\n```\n\nwhere **a ≠ 0**.\n\n## Key Terms\n\n- **Coefficient**: The numbers a, b, and c\n- **Degree**: The highest power of the variable (2 for quadratics)\n- **Roots/Solutions**: Values of x that satisfy the equation\n\n## Examples\n\n- `x² + 5x + 6 = 0` (a=1, b=5, c=6)\n- `2x² - 3x + 1 = 0` (a=2, b=-3, c=1)\n- `x² - 9 = 0` (a=1, b=0, c=-9)', 1),
  ((SELECT id FROM public.topics WHERE title='Quadratic Equations'), 'Solving by Factoring', '## Factoring Method\n\nFactoring involves rewriting the quadratic as a product of two binomials.\n\n### Steps\n\n1. Write the equation in standard form: ax² + bx + c = 0\n2. Find two numbers that multiply to give **ac** and add to give **b**\n3. Rewrite the middle term using these two numbers\n4. Factor by grouping\n5. Set each factor equal to zero and solve\n\n### Example\n\n```\nx² + 5x + 6 = 0\n(x + 2)(x + 3) = 0\nx = -2 or x = -3\n```', 2),
  ((SELECT id FROM public.topics WHERE title='Quadratic Equations'), 'The Quadratic Formula', '## The Quadratic Formula\n\nFor any quadratic equation ax² + bx + c = 0:\n\n```\nx = (-b ± √(b² - 4ac)) / 2a\n```\n\n### The Discriminant\n\nThe expression **b² - 4ac** is called the discriminant (Δ):\n\n- If Δ > 0: Two distinct real roots\n- If Δ = 0: One repeated real root\n- If Δ < 0: No real roots (two complex roots)\n\n### Example\n\nSolve 2x² - 4x - 6 = 0:\n\n```\na=2, b=-4, c=-6\nΔ = 16 + 48 = 64\nx = (4 ± 8) / 4\nx = 3 or x = -1\n```', 3),
  ((SELECT id FROM public.topics WHERE title='Quadratic Equations'), 'Completing the Square', '## Completing the Square\n\nThis method transforms the equation into a perfect square trinomial.\n\n### Steps\n\n1. Move the constant to the right side\n2. If a ≠ 1, divide everything by a\n3. Add (b/2)² to both sides\n4. Factor the left side as a perfect square\n5. Take the square root of both sides and solve\n\n### Example\n\n```\nx² + 6x + 5 = 0\nx² + 6x = -5\nx² + 6x + 9 = -5 + 9\n(x + 3)² = 4\nx + 3 = ±2\nx = -1 or x = -5\n```', 4),
  ((SELECT id FROM public.topics WHERE title='Quadratic Equations'), 'Word Problems with Quadratics', '## Applying Quadratics to Real Problems\n\nQuadratic equations appear in many real-world scenarios.\n\n### Projectile Motion\n\nThe height h of a projectile at time t:\n```\nh(t) = -½gt² + v₀t + h₀\n```\n\n### Area Problems\n\nA garden has length (x+3) and width (x+1). If the area is 35m²:\n```\n(x+3)(x+1) = 35\nx² + 4x + 3 = 35\nx² + 4x - 32 = 0\n(x+8)(x-4) = 0\nx = 4 (reject x = -8)\n```\n\nSo the garden is 7m × 5m.', 5);
