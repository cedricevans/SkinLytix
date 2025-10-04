-- Create skin type enum
CREATE TYPE public.skin_type_enum AS ENUM ('oily', 'dry', 'combination', 'sensitive', 'normal');

-- Add skin profile columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN skin_type public.skin_type_enum,
ADD COLUMN skin_concerns JSONB DEFAULT '[]'::jsonb,
ADD COLUMN is_profile_complete BOOLEAN DEFAULT false;

-- Create index for faster profile lookups
CREATE INDEX idx_profiles_complete ON public.profiles(is_profile_complete) WHERE is_profile_complete = false;