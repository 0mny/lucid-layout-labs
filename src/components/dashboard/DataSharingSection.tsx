import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Shield, Bell, BarChart3 } from 'lucide-react';

interface UserPreferences {
  data_sharing_analytics: boolean;
  data_sharing_marketing: boolean;
  data_sharing_third_party: boolean;
  notifications_email: boolean;
  notifications_desktop: boolean;
  privacy_level: 'minimal' | 'standard' | 'enhanced';
}

export const DataSharingSection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<UserPreferences>({
    data_sharing_analytics: false,
    data_sharing_marketing: false,
    data_sharing_third_party: false,
    notifications_email: true,
    notifications_desktop: true,
    privacy_level: 'standard',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchPreferences();
    }
  }, [user]);

  const fetchPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setPreferences({
          data_sharing_analytics: data.data_sharing_analytics,
          data_sharing_marketing: data.data_sharing_marketing,
          data_sharing_third_party: data.data_sharing_third_party,
          notifications_email: data.notifications_email,
          notifications_desktop: data.notifications_desktop,
          privacy_level: (data.privacy_level as 'minimal' | 'standard' | 'enhanced') || 'standard',
        });
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
      toast({
        title: 'Error',
        description: 'Failed to load privacy preferences.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user?.id,
          ...preferences,
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Privacy preferences updated successfully.',
      });
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast({
        title: 'Error',
        description: 'Failed to update preferences.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const updatePreference = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-6 bg-muted rounded"></div>
            <div className="h-6 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Privacy Level */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy Level
          </CardTitle>
          <CardDescription>
            Choose your overall privacy preference for data handling.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={preferences.privacy_level}
            onValueChange={(value) => updatePreference('privacy_level', value as 'minimal' | 'standard' | 'enhanced')}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="minimal" id="minimal" />
              <Label htmlFor="minimal" className="flex-1">
                <div className="font-medium">Minimal</div>
                <div className="text-sm text-muted-foreground">
                  Only essential data processing for core functionality
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="standard" id="standard" />
              <Label htmlFor="standard" className="flex-1">
                <div className="font-medium">Standard</div>
                <div className="text-sm text-muted-foreground">
                  Balanced approach with opt-in analytics for improvement
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="enhanced" id="enhanced" />
              <Label htmlFor="enhanced" className="flex-1">
                <div className="font-medium">Enhanced</div>
                <div className="text-sm text-muted-foreground">
                  Full personalization and optimization features
                </div>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Data Sharing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Data Sharing Preferences
          </CardTitle>
          <CardDescription>
            Control how your data is used to improve our services.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="analytics">Analytics Data</Label>
              <div className="text-sm text-muted-foreground">
                Help us improve Browse by sharing usage analytics
              </div>
            </div>
            <Switch
              id="analytics"
              checked={preferences.data_sharing_analytics}
              onCheckedChange={(checked) => updatePreference('data_sharing_analytics', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="marketing">Marketing Communications</Label>
              <div className="text-sm text-muted-foreground">
                Receive personalized product updates and offers
              </div>
            </div>
            <Switch
              id="marketing"
              checked={preferences.data_sharing_marketing}
              onCheckedChange={(checked) => updatePreference('data_sharing_marketing', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="third-party">Third-Party Integrations</Label>
              <div className="text-sm text-muted-foreground">
                Allow data sharing with trusted third-party services
              </div>
            </div>
            <Switch
              id="third-party"
              checked={preferences.data_sharing_third_party}
              onCheckedChange={(checked) => updatePreference('data_sharing_third_party', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Choose how you'd like to receive updates and alerts.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <div className="text-sm text-muted-foreground">
                Receive important updates via email
              </div>
            </div>
            <Switch
              id="email-notifications"
              checked={preferences.notifications_email}
              onCheckedChange={(checked) => updatePreference('notifications_email', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="desktop-notifications">Desktop Notifications</Label>
              <div className="text-sm text-muted-foreground">
                Show notifications on your desktop
              </div>
            </div>
            <Switch
              id="desktop-notifications"
              checked={preferences.notifications_desktop}
              onCheckedChange={(checked) => updatePreference('notifications_desktop', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={updatePreferences} disabled={saving}>
          {saving ? 'Saving...' : 'Save Preferences'}
        </Button>
      </div>
    </div>
  );
};
