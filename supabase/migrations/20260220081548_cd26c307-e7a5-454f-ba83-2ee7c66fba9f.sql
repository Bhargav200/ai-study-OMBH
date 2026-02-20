-- Add social profile username columns to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS instagram_username TEXT,
  ADD COLUMN IF NOT EXISTS discord_username TEXT,
  ADD COLUMN IF NOT EXISTS facebook_username TEXT;