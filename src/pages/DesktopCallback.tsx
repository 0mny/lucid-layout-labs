
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const DesktopCallback = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [token, setToken] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const appId = searchParams.get('app_id') || 'default';

  useEffect(() => {
    if (!user) {
      // Redirect to auth page if not logged in
      navigate('/auth?redirect=/desktop-callback' + window.location.search);
      return;
    }

    generateDesktopToken();
  }, [user, appId]);

  const generateDesktopToken = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setStatus('error');
        setError('No active session found');
        return;
      }

      const response = await fetch('/functions/v1/generate-desktop-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ app_id: appId }),
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
        description: 'Your desktop app should now be authenticated.',
      });
    } catch (err) {
      console.error('Error generating desktop token:', err);
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      toast({
        title: 'Authentication Failed',
        description: 'Failed to authenticate desktop app.',
        variant: 'destructive',
      });
    }
  };

  const copyToken = () => {
    navigator.clipboard.writeText(token);
    toast({
      title: 'Token Copied',
      description: 'JWT token copied to clipboard',
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

        <div className="bg-zinc-900 rounded-lg p-8 border border-zinc-800">
          {status === 'loading' && (
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-white mx-auto mb-4" />
              <p className="text-white mb-2">Generating authentication token...</p>
              <p className="text-zinc-400 text-sm">App ID: {appId}</p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-4" />
              <p className="text-white mb-4">Authentication successful!</p>
              <p className="text-zinc-400 text-sm mb-6">
                Your desktop app should automatically receive the authentication token.
                If it doesn't open automatically, you can copy the token below.
              </p>
              
              <div className="bg-zinc-800 p-4 rounded border mb-4">
                <p className="text-xs text-zinc-400 mb-2">JWT Token:</p>
                <p className="text-white text-sm font-mono break-all">
                  {token.substring(0, 50)}...
                </p>
              </div>

              <div className="space-y-3">
                <Button onClick={copyToken} className="w-full">
                  Copy Token
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/')}
                  className="w-full"
                >
                  Return to App
                </Button>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center">
              <XCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
              <p className="text-white mb-2">Authentication failed</p>
              <p className="text-red-400 text-sm mb-6">{error}</p>
              
              <div className="space-y-3">
                <Button onClick={generateDesktopToken} className="w-full">
                  Retry
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/auth')}
                  className="w-full"
                >
                  Sign In Again
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-zinc-500 text-sm">
            Desktop App Authentication Flow
          </p>
        </div>
      </div>
    </div>
  );
};

export default DesktopCallback;
