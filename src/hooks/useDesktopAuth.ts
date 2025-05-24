
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DesktopSession {
  id: string;
  app_id: string;
  jwt_token: string;
  expires_at: string;
  created_at: string;
  used_at: string | null;
}

export const useDesktopAuth = () => {
  const [loading, setLoading] = useState(false);

  const generateToken = async (appId: string = 'default') => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session found');
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

      return data;
    } finally {
      setLoading(false);
    }
  };

  const verifyToken = async (token: string) => {
    setLoading(true);
    try {
      const response = await fetch('/functions/v1/verify-desktop-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Token verification failed');
      }

      return data;
    } finally {
      setLoading(false);
    }
  };

  const getDesktopSessions = async () => {
    const { data, error } = await supabase
      .from('desktop_sessions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data as DesktopSession[];
  };

  const revokeSession = async (sessionId: string) => {
    const { error } = await supabase
      .from('desktop_sessions')
      .delete()
      .eq('id', sessionId);

    if (error) {
      throw error;
    }
  };

  return {
    generateToken,
    verifyToken,
    getDesktopSessions,
    revokeSession,
    loading,
  };
};
