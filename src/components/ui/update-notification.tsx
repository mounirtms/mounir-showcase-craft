import React from 'react';
import { Button } from './button';
import { Card, CardContent } from './card';
import { X, RefreshCw, Download } from 'lucide-react';
import { useServiceWorker } from '@/utils/sw-registration';

interface UpdateNotificationProps {
  className?: string;
}

export const UpdateNotification: React.FC<UpdateNotificationProps> = ({ className = '' }) => {
  const { showUpdatePrompt, installUpdate, dismissUpdate } = useServiceWorker();

  if (!showUpdatePrompt) return null;

  return (
    <div className={`fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-2 ${className}`}>
      <Card className="max-w-sm shadow-glow border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 p-2 bg-blue-100 dark:bg-blue-900/50 rounded-full">
              <Download className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                Update Available
              </h4>
              <p className="text-xs text-blue-700 dark:text-blue-300 mb-3">
                A new version of the portfolio is ready to install.
              </p>
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={installUpdate}
                  className="h-7 px-2 text-xs bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Update
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={dismissUpdate}
                  className="h-7 px-2 text-xs text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                >
                  Later
                </Button>
              </div>
            </div>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={dismissUpdate}
              className="flex-shrink-0 h-6 w-6 p-0 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50"
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Dismiss</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Network status indicator
export const NetworkStatus: React.FC = () => {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);
  const [showStatus, setShowStatus] = React.useState(false);

  React.useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowStatus(true);
      setTimeout(() => setShowStatus(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowStatus(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showStatus) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2">
      <Card className={`shadow-glow border-0 ${
        isOnline 
          ? 'bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800' 
          : 'bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800'
      }`}>
        <CardContent className="p-3">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              isOnline ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className={`text-sm font-medium ${
              isOnline 
                ? 'text-green-800 dark:text-green-200' 
                : 'text-red-800 dark:text-red-200'
            }`}>
              {isOnline ? 'Back online' : 'You\'re offline'}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Loading skeleton component for better UX
export const LoadingSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="space-y-4">
        <div className="h-4 bg-muted rounded w-3/4"></div>
        <div className="h-4 bg-muted rounded w-1/2"></div>
        <div className="h-4 bg-muted rounded w-5/6"></div>
      </div>
    </div>
  );
};

// Fallback component for suspense boundaries
export const SuspenseFallback: React.FC<{ message?: string }> = ({ 
  message = 'Loading...' 
}) => {
  return (
    <div className="min-h-[200px] flex items-center justify-center p-6">
      <div className="text-center space-y-4">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};
