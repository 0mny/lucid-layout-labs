
import React, { useState, useEffect } from 'react';
import { useDesktopAuth, DesktopSession } from '@/hooks/useDesktopAuth';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Monitor, Calendar, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const DesktopSessions = () => {
  const [sessions, setSessions] = useState<DesktopSession[]>([]);
  const [newAppId, setNewAppId] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { generateToken, getDesktopSessions, revokeSession, loading } = useDesktopAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const data = await getDesktopSessions();
      setSessions(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load desktop sessions',
        variant: 'destructive',
      });
    }
  };

  const handleGenerateToken = async () => {
    try {
      const result = await generateToken(newAppId || 'default');
      
      // Copy token to clipboard
      await navigator.clipboard.writeText(result.token);
      
      toast({
        title: 'Token Generated',
        description: 'JWT token copied to clipboard',
      });
      
      setNewAppId('');
      setIsDialogOpen(false);
      loadSessions();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate token',
        variant: 'destructive',
      });
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      await revokeSession(sessionId);
      toast({
        title: 'Session Revoked',
        description: 'Desktop session has been revoked',
      });
      loadSessions();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to revoke session',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Desktop App Sessions</h2>
          <p className="text-muted-foreground">
            Manage authentication tokens for desktop applications
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Generate Token
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate Desktop Token</DialogTitle>
              <DialogDescription>
                Create a new authentication token for your desktop application.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="appId">App ID (optional)</Label>
                <Input
                  id="appId"
                  placeholder="my-desktop-app"
                  value={newAppId}
                  onChange={(e) => setNewAppId(e.target.value)}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Identifier for your desktop application
                </p>
              </div>
              <Button 
                onClick={handleGenerateToken} 
                disabled={loading}
                className="w-full"
              >
                Generate & Copy Token
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {sessions.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Monitor className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Desktop Sessions</h3>
              <p className="text-muted-foreground text-center mb-4">
                You haven't created any desktop authentication tokens yet.
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                Generate Your First Token
              </Button>
            </CardContent>
          </Card>
        ) : (
          sessions.map((session) => (
            <Card key={session.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="h-5 w-5" />
                    {session.app_id}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant={isExpired(session.expires_at) ? "destructive" : "default"}>
                      {isExpired(session.expires_at) ? "Expired" : "Active"}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRevokeSession(session.id)}
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Created</p>
                      <p className="text-muted-foreground">
                        {formatDate(session.created_at)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Expires</p>
                      <p className="text-muted-foreground">
                        {formatDate(session.expires_at)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Last Used</p>
                      <p className="text-muted-foreground">
                        {session.used_at ? formatDate(session.used_at) : 'Never'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default DesktopSessions;
