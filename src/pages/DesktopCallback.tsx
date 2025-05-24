import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Loader2, User } from 'lucide-react';

const DesktopCallback = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'auth' | 'loading' | 'success' | 'error'>('auth');
  const [token, setToken] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const {
    user,
    signIn,
    signUp
  } = useAuth();
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const appId = searchParams.get('app_id') || 'default';
  useEffect(() => {
    if (user) {
      setStatus('auth'); // Show confirmation for logged in users
    }
  }, [user]);
  const handleAuth = async (e: React.FormEvent) => {
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
  const generateDesktopToken = async () => {
    setStatus('loading');
    try {
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      if (!session) {
        setStatus('error');
        setError('No active session found');
        return;
      }
      const response = await fetch('/functions/v1/generate-desktop-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          app_id: appId
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate token');
      }
      setToken(data.token);
      setStatus('success');

      // Attempt to redirect to custom protocol
      const customProtocolUrl = `browse://auth-callback?token=${data.token}&app_id=${appId}`;

      // Try to open the custom protocol
      window.location.href = customProtocolUrl;
      toast({
        title: 'Authentication Successful',
        description: 'Your desktop app should now be authenticated.'
      });
    } catch (err) {
      console.error('Error generating desktop token:', err);
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      toast({
        title: 'Authentication Failed',
        description: 'Failed to authenticate desktop app.',
        variant: 'destructive'
      });
    }
  };
  const copyToken = () => {
    navigator.clipboard.writeText(token);
    toast({
      title: 'Token Copied',
      description: 'JWT token copied to clipboard'
    });
  };
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: 'Signed Out',
      description: 'You have been signed out successfully.'
    });
  };
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <img 
              src="/lovable-uploads/0698279a-9918-4c6a-9e5d-5177e1aae3f9.png" 
              alt="Logo" 
              className="h-12 w-12 object-contain"
            />
          </div>
          <h1 className="text-2xl font-medium text-white mb-2">
            Desktop App Authentication
          </h1>
        </div>

        <div className="rounded-lg p-8 border border-zinc-800 bg-[#191919]">
          {/* User is logged in - show confirmation */}
          {user && status === 'auth' && (
            <div className="text-center">
              <User className="h-8 w-8 text-white mx-auto mb-4" />
              <p className="text-white mb-2">Continue with this account?</p>
              <p className="text-[#9E9E9E] text-sm mb-6">{user.email}</p>
              <p className="text-[#9E9E9E] text-sm mb-6">App ID: {appId}</p>
              
              <div className="space-y-3">
                <Button 
                  onClick={generateDesktopToken} 
                  className="w-full bg-white text-black hover:bg-zinc-200"
                >
                  Yes, Continue
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleSignOut} 
                  className="w-full bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-600"
                >
                  Sign Out
                </Button>
              </div>
            </div>
          )}

          {/* User is not logged in - show auth form */}
          {!user && status === 'auth' && (
            <div>
              <div className="text-center mb-6">
                <p className="text-white mb-2">
                  {isSignUp ? 'Create account for desktop app' : 'Sign in for desktop app'}
                </p>
                <p className="text-[#9E9E9E] text-sm">App ID: {appId}</p>
              </div>

              <form onSubmit={handleAuth} className="space-y-6">
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
                  className="w-full bg-white text-black hover:bg-zinc-200" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Please wait...' : 'Continue'}
                </Button>
              </form>

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
            </div>
          )}

          {/* Loading state */}
          {status === 'loading' && (
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-white mx-auto mb-4" />
              <p className="text-white mb-2">Generating authentication token...</p>
              <p className="text-[#9E9E9E] text-sm">App ID: {appId}</p>
            </div>
          )}

          {/* Success state */}
          {status === 'success' && (
            <div className="text-center">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-4" />
              <p className="text-white mb-4">Authentication successful!</p>
              <p className="text-[#9E9E9E] text-sm mb-6">
                Your desktop app should automatically receive the authentication token.
                If it doesn't open automatically, you can copy the token below.
              </p>
              
              <div className="bg-[#131313] p-4 rounded border border-[#434343] mb-4">
                <p className="text-xs text-[#9E9E9E] mb-2">JWT Token:</p>
                <p className="text-white text-sm font-mono break-all">
                  {token.substring(0, 50)}...
                </p>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={copyToken} 
                  className="w-full bg-white text-black hover:bg-zinc-200"
                >
                  Copy Token
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/')} 
                  className="w-full bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-600"
                >
                  Return to App
                </Button>
              </div>
            </div>
          )}

          {/* Error state */}
          {status === 'error' && (
            <div className="text-center">
              <XCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
              <p className="text-white mb-2">Authentication failed</p>
              <p className="text-red-400 text-sm mb-6">{error}</p>
              
              <div className="space-y-3">
                <Button 
                  onClick={generateDesktopToken} 
                  className="w-full bg-white text-black hover:bg-zinc-200"
                >
                  Retry
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setStatus('auth')} 
                  className="w-full bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-600"
                >
                  Back to Login
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-[#9E9E9E] text-sm">
            Desktop App Authentication Flow
          </p>
        </div>
      </div>
    </div>
  );
};

export default DesktopCallback;
