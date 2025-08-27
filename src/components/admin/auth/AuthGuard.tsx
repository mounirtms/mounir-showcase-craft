import React from 'react';
import { Shield, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { LoginForm } from './LoginForm';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { isAuthenticated, canUseAdmin } = useAdminAuth();

  // If Firebase is not configured properly
  if (!canUseAdmin) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-mesh relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl animate-float" />
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '-6s' }} />
        </div>
        
        <Card className="glass-card max-w-lg w-full shadow-2xl animate-scale-in border-0 backdrop-blur-xl relative z-10">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto mb-6 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-lg opacity-75 group-hover:opacity-100 animate-glow transition-opacity" />
              <div className="relative bg-white dark:bg-gray-900 rounded-full p-4">
                <img src="/mounir-icon.svg" alt="Admin" className="w-12 h-12" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Admin Panel Unavailable
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Shield className="w-5 h-5" />
                <span className="font-medium">Configuration Required</span>
              </div>
              <p className="text-sm text-red-200">
                Firebase is not configured properly. Please check your environment variables and restart the development server.
              </p>
            </div>
            
            <div className="text-xs text-white/50 space-y-1">
              <div>Required: Firebase Auth, Firestore Database</div>
              <div>Check: .env.local file and VITE_FIREBASE_ENABLE_DEV=true</div>
            </div>
            
            <Button 
              onClick={() => window.location.reload()} 
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-0"
            >
              <Activity className="w-4 h-4 mr-2" />
              Retry Connection
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If not authenticated, show login form
  if (!isAuthenticated) {
    return <LoginForm />;
  }

  // If authenticated, render children
  return <>{children}</>;
}