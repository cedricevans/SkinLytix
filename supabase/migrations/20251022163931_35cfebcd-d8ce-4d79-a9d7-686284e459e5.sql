-- Fix security definer view issues by explicitly setting SECURITY INVOKER
-- This ensures views use the permissions of the querying user, not the view creator

DROP VIEW IF EXISTS public.analytics_daily_active_users;
DROP VIEW IF EXISTS public.analytics_feature_adoption;

-- Recreate views with SECURITY INVOKER
CREATE OR REPLACE VIEW public.analytics_daily_active_users
WITH (security_invoker = true) AS
SELECT 
  DATE(created_at) as date,
  COUNT(DISTINCT user_id) as active_users
FROM public.user_events
GROUP BY DATE(created_at)
ORDER BY date DESC;

CREATE OR REPLACE VIEW public.analytics_feature_adoption
WITH (security_invoker = true) AS
SELECT 
  event_category,
  event_name,
  COUNT(*) as event_count,
  COUNT(DISTINCT user_id) as unique_users
FROM public.user_events
GROUP BY event_category, event_name
ORDER BY event_count DESC;