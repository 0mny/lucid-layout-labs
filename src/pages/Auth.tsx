import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const {
    user,
    signIn,
    signUp,
    hasProfile,
    session
  } = useAuth();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (hasProfile === false) {
        navigate('/finish-profile');
      } else if (hasProfile === true) {
        navigate('/dashboard');
      }
    }
  }, [user, hasProfile, navigate]);

  // Function to redirect to desktop app with JWT token
  const redirectToDesktopApp = (jwtToken: string) => {
    // 1. Encode the JWT token to handle special characters
    const encodedToken = encodeURIComponent(jwtToken);
    
    // 2. Create the custom protocol URL with the token
    const desktopAppUrl = `browse://auth-callback?token=${encodedToken}`;
    
    // 3. Redirect the browser to this URL
    window.location.href = desktopAppUrl;
    
    // 4. Optional: Show a message in case the app doesn't open
    setTimeout(() => {
      toast({
        title: 'Desktop App Redirect',
        description: 'If the desktop app didn\'t open, please make sure it\'s installed and try again.',
      });
    }, 2000);
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp && password !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'Please make sure your passwords match.',
        variant: 'destructive'
      });
      return;
    }
    setIsLoading(true);
    try {
      if (isSignUp) {
        const {
          error
        } = await signUp(email, password, fullName);
        if (error) {
          toast({
            title: 'Signup Failed',
            description: error.message,
            variant: 'destructive'
          });
        } else {
          toast({
            title: 'Account Created!',
            description: 'Your account has been created successfully.'
          });
          // Navigation will be handled by useEffect when user state changes
        }
      } else {
        const {
          error
        } = await signIn(email, password);
        if (error) {
          toast({
            title: 'Login Failed',
            description: error.message,
            variant: 'destructive'
          });
        } else {
          toast({
            title: 'Welcome back!',
            description: 'You have been successfully logged in.'
          });
          
          // Check if we should redirect to desktop app
          if (session?.access_token) {
            redirectToDesktopApp(session.access_token);
          }
          // Navigation will be handled by useEffect when user state changes
        }
      }
    } catch (error) {
      toast({
        title: isSignUp ? 'Signup Failed' : 'Login Failed',
        description: 'An unexpected error occurred.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

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
            {isSignUp ? 'Sign up' : 'Sign in'}
          </h1>
        </div>

        {/* Auth Form */}
        <div className="rounded-lg p-8 border border-zinc-800 bg-[#191919]">
          <form onSubmit={handleEmailAuth} className="space-y-6">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-white text-sm">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="bg-[#131313] border-[#434343] text-white placeholder:text-[#9E9E9E] focus:border-[#434343] focus:ring-[#434343]"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white text-sm">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-[#131313] border-[#434343] text-white placeholder:text-[#9E9E9E] focus:border-[#434343] focus:ring-[#434343]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white text-sm">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-[#131313] border-[#434343] text-white placeholder:text-[#9E9E9E] focus:border-[#434343] focus:ring-[#434343]"
              />
            </div>

            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white text-sm">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="bg-[#131313] border-[#434343] text-white placeholder:text-[#9E9E9E] focus:border-[#434343] focus:ring-[#434343]"
                />
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-white text-black hover:bg-zinc-200 border-0" 
              disabled={isLoading}
            >
              {isLoading ? 'Please wait...' : 'Continue'}
            </Button>
          </form>

          {/* Toggle Sign Up/Sign In */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setEmail('');
                setPassword('');
                setFullName('');
                setConfirmPassword('');
              }}
              className="text-[#9E9E9E] hover:text-white text-sm transition-colors"
            >
              {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
            </button>
          </div>

          {/* Desktop App Redirect Message */}
          <div id="app-redirect-message" className="mt-4 text-center text-[#9E9E9E] text-sm"></div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-[#9E9E9E] text-sm">
            Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
