import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Crown, Check, Clock, X } from 'lucide-react';

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  features: string[];
  is_active: boolean;
}

interface UserSubscription {
  id: string;
  plan_id: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  subscription_plans: SubscriptionPlan;
}

export const SubscriptionSection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscription | null>(null);
  const [availablePlans, setAvailablePlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSubscriptionData();
    }
  }, [user]);

  const fetchSubscriptionData = async () => {
    try {
      // Fetch current subscription
      const { data: subscriptionData, error: subError } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          subscription_plans (*)
        `)
        .eq('user_id', user?.id)
        .eq('status', 'active')
        .single();

      if (subError && subError.code !== 'PGRST116') {
        throw subError;
      }

      if (subscriptionData) {
        const transformedSubscription: UserSubscription = {
          ...subscriptionData,
          subscription_plans: {
            ...subscriptionData.subscription_plans,
            features: Array.isArray(subscriptionData.subscription_plans.features) 
              ? subscriptionData.subscription_plans.features as string[]
              : []
          }
        };
        setCurrentSubscription(transformedSubscription);
      }

      // Fetch all available plans
      const { data: plansData, error: plansError } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price_monthly');

      if (plansError) throw plansError;

      if (plansData) {
        const transformedPlans: SubscriptionPlan[] = plansData.map(plan => ({
          ...plan,
          features: Array.isArray(plan.features) ? plan.features as string[] : []
        }));
        setAvailablePlans(transformedPlans);
      }
    } catch (error) {
      console.error('Error fetching subscription data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load subscription information.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Active', variant: 'default' as const },
      trialing: { label: 'Trial', variant: 'secondary' as const },
      past_due: { label: 'Past Due', variant: 'destructive' as const },
      canceled: { label: 'Canceled', variant: 'outline' as const },
      incomplete: { label: 'Incomplete', variant: 'destructive' as const },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-20 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Subscription */}
      {currentSubscription ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5" />
              Current Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{currentSubscription.subscription_plans.name}</h3>
                <p className="text-muted-foreground">{currentSubscription.subscription_plans.description}</p>
              </div>
              {getStatusBadge(currentSubscription.status)}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
              <div>
                <div className="text-sm text-muted-foreground">Current Period</div>
                <div className="font-medium">
                  {new Date(currentSubscription.current_period_start).toLocaleDateString()} - {' '}
                  {new Date(currentSubscription.current_period_end).toLocaleDateString()}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Auto-Renewal</div>
                <div className="font-medium flex items-center gap-1">
                  {currentSubscription.cancel_at_period_end ? (
                    <>
                      <X className="h-4 w-4 text-destructive" />
                      Canceling at period end
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 text-green-600" />
                      Enabled
                    </>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Included Features:</h4>
              <ul className="space-y-1">
                {currentSubscription.subscription_plans.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-600" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {currentSubscription.cancel_at_period_end && (
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center gap-2 text-orange-800">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">Subscription Ending</span>
                </div>
                <p className="text-sm text-orange-700 mt-1">
                  Your subscription will end on {new Date(currentSubscription.current_period_end).toLocaleDateString()}.
                  You'll still have access to all features until then.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Active Subscription</CardTitle>
            <CardDescription>
              You're currently on the free plan. Upgrade to unlock premium features.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Available Plans */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Available Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {availablePlans.map((plan) => (
            <Card key={plan.id} className={plan.name === 'Pro' ? 'border-primary' : ''}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{plan.name}</CardTitle>
                  {plan.name === 'Pro' && (
                    <Badge>Popular</Badge>
                  )}
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold">
                    ${plan.price_monthly}
                    <span className="text-lg font-normal text-muted-foreground">/mo</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    or ${plan.price_yearly}/year
                  </div>
                </div>

                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button 
                  className="w-full" 
                  variant={currentSubscription?.subscription_plans.id === plan.id ? 'outline' : 'default'}
                  disabled={currentSubscription?.subscription_plans.id === plan.id}
                >
                  {currentSubscription?.subscription_plans.id === plan.id 
                    ? 'Current Plan' 
                    : plan.price_monthly === 0 
                      ? 'Current Plan' 
                      : 'Upgrade'
                  }
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
