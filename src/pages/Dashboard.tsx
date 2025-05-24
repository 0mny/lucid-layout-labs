
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { PersonalInfoSection } from '@/components/dashboard/PersonalInfoSection';
import { DataSharingSection } from '@/components/dashboard/DataSharingSection';
import { SubscriptionSection } from '@/components/dashboard/SubscriptionSection';
import { SettingsSection } from '@/components/dashboard/SettingsSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Dashboard = () => {
  const { user, loading, hasProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth');
      } else if (hasProfile === false) {
        navigate('/finish-profile');
      }
    }
  }, [user, loading, hasProfile, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || hasProfile === false) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
          
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
              <TabsTrigger value="subscription">Plan</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-6">
              <PersonalInfoSection />
            </TabsContent>
            
            <TabsContent value="privacy" className="space-y-6">
              <DataSharingSection />
            </TabsContent>
            
            <TabsContent value="subscription" className="space-y-6">
              <SubscriptionSection />
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-6">
              <SettingsSection />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
