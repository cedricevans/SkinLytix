-- Fix security definer view warning by recreating with security_invoker
DROP VIEW IF EXISTS public.rate_limit_abuse_alerts;

CREATE OR REPLACE VIEW public.rate_limit_abuse_alerts
WITH (security_invoker=on)
AS
SELECT 
  endpoint,
  identifier AS ip_address,
  COUNT(*) as total_requests,
  COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '5 minutes') as requests_last_5min,
  MIN(created_at) as first_request,
  MAX(created_at) as last_request
FROM public.rate_limit_log
WHERE created_at > NOW() - INTERVAL '1 hour'
GROUP BY endpoint, identifier
HAVING COUNT(*) > 100
ORDER BY total_requests DESC;