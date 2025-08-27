import React from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminAuth, useAdminAuth } from './AdminAuth';

/**
 * Demo component showing how to use AdminAuth wrapper
 */
function ProtectedContent() {
  const { user, logout } = useAdminAuth();

  return (
    <div className="min-h-screen bg-gradient-subtle p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Protected Admin Content</span>
              <Button variant="outline" onClick={logout} size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>Welcome to the admin panel!</p>
              <p className="text-sm text-muted-foreground">
                User: {user?.email}
              </p>
              <p className="text-sm text-muted-foreground">
                This content is only visible to authenticated users.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function AdminAuthDemo() {
  return (
    <AdminAuth>
      <ProtectedContent />
    </AdminAuth>
  );
}