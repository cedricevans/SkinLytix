import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface TrackEventParams {
  eventName: string;
  eventCategory: string;
  eventProperties?: Record<string, any>;
}

export const trackEvent = async ({
  eventName,
  eventCategory,
  eventProperties = {},
}: TrackEventParams) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return; // Only track authenticated users

    await supabase.from('user_events').insert({
      user_id: user.id,
      event_name: eventName,
      event_category: eventCategory,
      event_properties: eventProperties,
      page_url: window.location.pathname,
      referrer: document.referrer,
      user_agent: navigator.userAgent,
    });
  } catch (error) {
    // Silently fail - don't disrupt user experience
    console.debug('Tracking event failed:', error);
  }
};

export const useTracking = (pageName: string) => {
  const location = useLocation();

  useEffect(() => {
    // Auto-track page views
    trackEvent({
      eventName: 'page_viewed',
      eventCategory: 'navigation',
      eventProperties: {
        page_name: pageName,
        path: location.pathname,
      },
    });
  }, [location.pathname, pageName]);

  return { trackEvent };
};
