-- Create user_events table for behavioral tracking
CREATE TABLE public.user_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_name TEXT NOT NULL,
  event_category TEXT NOT NULL,
  event_properties JSONB DEFAULT '{}'::jsonb,
  page_url TEXT,
  referrer TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create indexes for fast querying
CREATE INDEX idx_user_events_user_id ON public.user_events(user_id);
CREATE INDEX idx_user_events_event_name ON public.user_events(event_name);
CREATE INDEX idx_user_events_event_category ON public.user_events(event_category);
CREATE INDEX idx_user_events_created_at ON public.user_events(created_at DESC);
CREATE INDEX idx_user_events_user_created ON public.user_events(user_id, created_at DESC);

-- Enable RLS
ALTER TABLE public.user_events ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert their own events
CREATE POLICY "Users can insert their own events"
ON public.user_events
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow users to view their own events
CREATE POLICY "Users can view their own events"
ON public.user_events
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Create view for analytics (daily active users)
CREATE OR REPLACE VIEW public.analytics_daily_active_users AS
SELECT 
  DATE(created_at) as date,
  COUNT(DISTINCT user_id) as active_users
FROM public.user_events
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Create view for feature adoption
CREATE OR REPLACE VIEW public.analytics_feature_adoption AS
SELECT 
  event_category,
  event_name,
  COUNT(*) as event_count,
  COUNT(DISTINCT user_id) as unique_users
FROM public.user_events
GROUP BY event_category, event_name
ORDER BY event_count DESC;