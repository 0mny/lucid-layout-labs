import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const FinishProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    // Check if user already has a profile
    const checkProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (data) {
        // Profile exists, redirect to dashboard
        navigate('/dashboard');
      }
    };

    checkProfile();
  }, [user, navigate]);

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email || '',
          first_name: firstName,
          last_name: lastName,
        });

      if (error) {
        toast({
          title: 'Profile Creation Failed',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Profile Created!',
          description: 'Your profile has been created successfully.',
        });
        navigate('/dashboard');
      }
    } catch (error) {
      toast({
        title: 'Profile Creation Failed',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <img 
              src="/lovable-uploads/0698279a-9918-4c6a-9e5d-5177e1aae3f9.png" 
              alt="Logo" 
              className="h-12 w-12 object-contain"
            />
          </div>
          <h1 className="text-2xl font-medium text-white mb-2">
            Complete Your Profile
          </h1>
          <p className="text-zinc-400 text-sm">
            Let's finish setting up your account
          </p>
        </div>

        {/* Profile Form */}
        <div className="bg-[#191919] rounded-lg p-8 border border-zinc-800">
          <form onSubmit={handleCreateProfile} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white text-sm">
                Email
              </Label>
              <Input 
                id="email" 
                type="email" 
                value={user.email || ''} 
                disabled 
                className="bg-black border-zinc-700 text-zinc-500 placeholder:text-zinc-600 opacity-75" 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-white text-sm">
                First Name
              </Label>
              <Input
                id="firstName"
                type="text"
                placeholder="Enter your first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="bg-black border-zinc-700 text-white placeholder:text-zinc-500 focus:border-zinc-500 focus:ring-zinc-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-white text-sm">
                Last Name
              </Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Enter your last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="bg-black border-zinc-700 text-white placeholder:text-zinc-500 focus:border-zinc-500 focus:ring-zinc-500"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-white text-black hover:bg-zinc-200" 
              disabled={isLoading}
            >
              {isLoading ? 'Creating Profile...' : 'Complete Profile'}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-zinc-600 text-sm">
            Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default FinishProfile;
