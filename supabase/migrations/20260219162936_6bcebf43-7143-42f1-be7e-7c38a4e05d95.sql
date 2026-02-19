
-- Section A: Schema Enhancements

-- Add description to subjects
ALTER TABLE public.subjects ADD COLUMN IF NOT EXISTS description TEXT;

-- Add difficulty_level to topics
ALTER TABLE public.topics ADD COLUMN IF NOT EXISTS difficulty_level INTEGER DEFAULT 1;

-- Add content_type and estimated_duration_minutes to lessons
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS content_type VARCHAR DEFAULT 'text';
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS estimated_duration_minutes INTEGER DEFAULT 10;

-- Update existing seed data with descriptions
UPDATE public.subjects SET description = 'Study of numbers, quantities, and shapes' WHERE name = 'Mathematics';
UPDATE public.subjects SET description = 'Study of matter, energy, and their interactions' WHERE name = 'Physics';
UPDATE public.subjects SET description = 'Study of substances and their properties' WHERE name = 'Chemistry';
UPDATE public.subjects SET description = 'Study of living organisms' WHERE name = 'Biology';

-- Update topic difficulty levels
UPDATE public.topics SET difficulty_level = 2 WHERE title IN ('Quadratic Equations', 'Chemical Bonding', 'Cell Structure & Function');
UPDATE public.topics SET difficulty_level = 3 WHERE title IN ('Trigonometry', 'Thermodynamics', 'Organic Chemistry', 'Genetics');
UPDATE public.topics SET difficulty_level = 1 WHERE title = 'Newton''s Laws of Motion';
