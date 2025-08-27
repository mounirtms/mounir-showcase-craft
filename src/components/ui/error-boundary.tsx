import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  RefreshCw, 
  Bug, 
  FileText, 
  Mail,
  ExternalLink 
} from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Call the onError callback if provided
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { error, errorInfo } = this.state;

      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <Card className="max-w-2xl w-full border-destructive/20 bg-destructive/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-destructive/10 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <CardTitle className="text-destructive">Something went wrong</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    An unexpected error occurred in this component
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Error Summary */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Bug className="h-4 w-4 text-destructive" />
                  <span className="font-medium text-sm">Error Details</span>
                </div>
                <p className="text-sm text-muted-foreground font-mono">
                  {error?.message || 'Unknown error occurred'}
                </p>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-3">
                <Button 
                  onClick={this.handleReset}
                  variant="default"
                  size="sm"
                  className="flex-1 min-w-[120px]"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button 
                  onClick={this.handleReload}
                  variant="outline"
                  size="sm"
                  className="flex-1 min-w-[120px]"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Reload Page
                </Button>
              </div>

              {/* Development Info */}
              {process.env.NODE_ENV === 'development' && (
                <details className="mt-4">
                  <summary className="cursor-pointer flex items-center gap-2 text-sm font-medium mb-2">
                    <FileText className="h-4 w-4" />
                    Technical Details (Development Mode)
                  </summary>
                  <div className="space-y-3">
                    <div className="p-3 bg-muted rounded-lg text-xs font-mono">
                      <div className="font-medium text-destructive mb-2">Error Stack:</div>
                      <pre className="whitespace-pre-wrap text-muted-foreground">
                        {error?.stack}
                      </pre>
                    </div>
                    {errorInfo && (
                      <div className="p-3 bg-muted rounded-lg text-xs font-mono">
                        <div className="font-medium text-destructive mb-2">Component Stack:</div>
                        <pre className="whitespace-pre-wrap text-muted-foreground">
                          {errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}

              {/* Help Text */}
              <div className="text-center pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  If this problem persists, please try refreshing the page or contact support.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for easier usage
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

// Admin-specific error fallback component
export const AdminErrorFallback = ({ error, resetError }: { 
  error: Error | null; 
  resetError?: () => void;
}) => (
  <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-mesh relative overflow-hidden">
    {/* Animated Background Elements */}
    <div className="absolute inset-0">
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-red-400/20 rounded-full blur-3xl animate-float" />
      <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-red-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-red-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '-6s' }} />
    </div>
    
    <Card className="glass-card max-w-lg w-full shadow-2xl animate-scale-in border-0 backdrop-blur-xl relative z-10">
      <CardHeader className="text-center pb-8">
        <div className="mx-auto mb-6 relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-600 rounded-full blur-lg opacity-75 group-hover:opacity-100 animate-glow transition-opacity" />
          <div className="relative bg-white dark:bg-gray-900 rounded-full p-4">
            <AlertTriangle className="w-12 h-12 text-red-500" />
          </div>
        </div>
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-red-600 via-red-500 to-red-600 bg-clip-text text-transparent">
          Admin Panel Error
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-6">
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 backdrop-blur-sm">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Bug className="w-5 h-5" />
            <span className="font-medium">Something went wrong</span>
          </div>
          <p className="text-sm text-red-200">
            {error?.message || "An unexpected error occurred in the admin panel."}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={resetError || (() => window.location.reload())} 
            className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white border-0"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/'}
            className="flex-1 border-red-500/30 text-red-300 hover:bg-red-500/10"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Return Home
          </Button>
        </div>
        
        {process.env.NODE_ENV === 'development' && error?.stack && (
          <details className="text-left">
            <summary className="cursor-pointer text-sm font-medium mb-2">Error Details</summary>
            <pre className="text-xs p-3 bg-black/20 rounded-lg max-h-40 overflow-auto">
              {error.stack}
            </pre>
          </details>
        )}
      </CardContent>
    </Card>
  </div>
);

// Simple error boundary for inline usage
export function ErrorBoundaryWrapper({ 
  children, 
  fallback 
}: { 
  children: ReactNode; 
  fallback?: ReactNode;
}) {
  return (
    <ErrorBoundary fallback={fallback}>
      {children}
    </ErrorBoundary>
  );
}

export default ErrorBoundary;
