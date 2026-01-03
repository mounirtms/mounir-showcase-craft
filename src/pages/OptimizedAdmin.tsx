/**
 * Professional Admin Panel
 * @author Mounir Abderrahmani
 * @description Clean, optimized admin interface with Firebase authentication
 */

import React, { useEffect, useState } from 'react';
import { auth, isFirebaseEnabled } from '@/lib/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Shield, Zap, AlertCircle } from 'lucide-react';
import { ProfessionalAdminDashboard } from '@/components/admin/ProfessionalAdminDashboard';

export default function OptimizedAdmin() {
  const [user, setUser] = useState(() => auth?.currentUser ?? null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setError(null);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
      setError('Firebase Auth is not available');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail('');
      setPassword('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // If Firebase is not configured
  if (!isFirebaseEnabled) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <CardTitle className="text-xl text-slate-900 dark:text-white">
              Configuration Required
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-slate-600 dark:text-slate-400">
              Firebase configuration is missing or incomplete. Please check your environment variables.
            </p>
            <Button onClick={() => window.location.reload()} variant="outline" className="w-full">
              Retry Connection
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If user is authenticated, show the dashboard
  if (user) {
    return <ProfessionalAdminDashboard user={user} />;
  }

  // Login form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="w-full max-w-md">
        {/* Professional Branding */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <img 
              src="/mounir-signature.svg" 
              alt="Mounir Signature" 
              className="h-12 w-auto mx-auto"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'block';
              }}
            />
            <div className="text-2xl font-bold text-slate-900 dark:text-white hidden">
              Mounir Abderrahmani
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Professional Admin
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Portfolio Management System
          </p>
        </div>

        <Card className="shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-0">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-slate-900 dark:text-white">
              Secure Access
            </CardTitle>
            <p className="text-slate-600 dark:text-slate-400">
              Enter your credentials to access the admin panel
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/30">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700 dark:text-red-400">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  disabled={loading}
                  className="h-12 bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  required
                  disabled={loading}
                  className="h-12 bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    Access Dashboard
                  </>
                )}
              </Button>
            </form>

            <div className="text-center pt-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Protected by Firebase Authentication
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Professional Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} Mounir Abderrahmani. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
