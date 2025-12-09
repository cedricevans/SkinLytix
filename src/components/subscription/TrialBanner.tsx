import { useState } from 'react';
import { Clock, Sparkles, Crown, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PaywallModal } from '@/components/paywall/PaywallModal';
import { useSubscription } from '@/hooks/useSubscription';

interface TrialBannerProps {
  className?: string;
  variant?: 'inline' | 'floating';
}

export function TrialBanner({ className, variant = 'inline' }: TrialBannerProps) {
  const { isInTrial, trialEndsAt, effectiveTier, isLoading } = useSubscription();
  const [showPaywall, setShowPaywall] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isLoading || isDismissed) return null;

  const getTrialDaysRemaining = () => {
    if (!trialEndsAt) return 0;
    const now = new Date();
    const diffMs = trialEndsAt.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  };

  const trialDays = getTrialDaysRemaining();

  // Show urgent banner if trial is ending soon
  if (isInTrial && trialDays <= 3) {
    const urgencyColor = trialDays === 0 
      ? 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400'
      : trialDays === 1 
        ? 'bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400'
        : 'bg-primary/10 border-primary/20 text-primary';

    return (
      <>
        <Card className={`p-4 ${urgencyColor} ${className}`}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-background/50">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold">
                  {trialDays === 0 
                    ? '🔥 Trial ends today!' 
                    : trialDays === 1 
                      ? '⚠️ Trial ends tomorrow' 
                      : `${trialDays} days left in your Premium trial`
                  }
                </p>
                <p className="text-sm opacity-80">
                  Keep your Premium features - upgrade now!
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={() => setShowPaywall(true)}>
                <Crown className="w-4 h-4 mr-2" />
                Upgrade Now
              </Button>
              <button 
                onClick={() => setIsDismissed(true)}
                className="p-1 hover:bg-background/50 rounded"
              >
                <X className="w-4 h-4 opacity-60" />
              </button>
            </div>
          </div>
        </Card>

        <PaywallModal 
          open={showPaywall} 
          onOpenChange={setShowPaywall}
          feature="Premium Access"
          featureDescription="Continue enjoying full EpiQ breakdowns, AI explanations, and unlimited routine optimization"
          showTrial={false}
        />
      </>
    );
  }

  // Show trial active badge for longer trials
  if (isInTrial) {
    return (
      <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20">
        <Sparkles className="w-3 h-3 mr-1" />
        Premium Trial • {trialDays} days left
      </Badge>
    );
  }

  // Show upgrade prompt for free users (non-intrusive)
  if (effectiveTier === 'free') {
    return (
      <>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowPaywall(true)}
          className={`border-primary/30 hover:border-primary ${className}`}
        >
          <Crown className="w-4 h-4 mr-2 text-primary" />
          <span>Try Premium Free</span>
          <ArrowRight className="w-3 h-3 ml-2" />
        </Button>

        <PaywallModal 
          open={showPaywall} 
          onOpenChange={setShowPaywall}
          feature="Premium Features"
          featureDescription="Start your 7-day free trial with full access to all Premium features"
          showTrial={true}
        />
      </>
    );
  }

  return null;
}
