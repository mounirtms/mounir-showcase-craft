import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2, RefreshCw, Database, BarChart3 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface LoadingProps {
  variant?: 'spinner' | 'dots' | 'pulse' | 'skeleton' | 'card';
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
}

export function Loading({ 
  variant = 'spinner', 
  size = 'md', 
  message,
  className 
}: LoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const containerClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  if (variant === 'spinner') {
    return (
      <div className={cn('flex items-center justify-center', containerClasses[size], className)}>
        <div className="flex flex-col items-center gap-3">
          <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
          {message && (
            <p className="text-sm text-muted-foreground animate-pulse">{message}</p>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={cn('flex items-center justify-center', containerClasses[size], className)}>
        <div className="flex flex-col items-center gap-3">
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  'rounded-full bg-primary animate-bounce',
                  size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'
                )}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
          {message && (
            <p className="text-sm text-muted-foreground">{message}</p>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={cn('flex items-center justify-center', containerClasses[size], className)}>
        <div className="flex flex-col items-center gap-3">
          <div className={cn(
            'rounded-full bg-primary/20 animate-pulse',
            sizeClasses[size]
          )} />
          {message && (
            <p className="text-sm text-muted-foreground animate-pulse">{message}</p>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'skeleton') {
    return (
      <div className={cn('space-y-3', className)}>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="h-4 bg-muted rounded w-5/6"></div>
        </div>
        {message && (
          <p className="text-sm text-muted-foreground">{message}</p>
        )}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <Card className={cn('border-0 shadow-medium', className)}>
        <CardContent className={containerClasses[size]}>
          <div className="flex items-center justify-center">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
              </div>
              {message && (
                <div>
                  <p className="font-medium text-foreground">{message}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    This may take a few moments...
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}

// Specialized loading components for specific use cases
export function AdminLoading({ message = "Loading admin dashboard..." }: { message?: string }) {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="p-4 bg-primary/10 rounded-xl">
          <Database className="w-8 h-8 animate-pulse text-primary" />
        </div>
        <div>
          <p className="font-medium text-lg">{message}</p>
          <p className="text-sm text-muted-foreground mt-1">
            Setting up your workspace...
          </p>
        </div>
      </div>
    </div>
  );
}

export function DataLoading({ message = "Loading data..." }: { message?: string }) {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="flex items-center gap-3">
        <RefreshCw className="w-5 h-5 animate-spin text-primary" />
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
}

export function AnalyticsLoading({ message = "Generating analytics..." }: { message?: string }) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="p-3 bg-blue-500/10 rounded-xl">
          <BarChart3 className="w-6 h-6 animate-bounce text-blue-600" />
        </div>
        <div>
          <p className="font-medium">{message}</p>
          <p className="text-sm text-muted-foreground mt-1">
            Crunching the numbers...
          </p>
        </div>
      </div>
    </div>
  );
}

// Table loading skeleton
export function TableLoading({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-3">
      {/* Header skeleton */}
      <div className="flex gap-4 p-4 border-b">
        {Array.from({ length: columns }, (_, i) => (
          <div key={i} className="h-4 bg-muted rounded animate-pulse flex-1" />
        ))}
      </div>
      {/* Rows skeleton */}
      {Array.from({ length: rows }, (_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 p-4">
          {Array.from({ length: columns }, (_, colIndex) => (
            <div 
              key={colIndex} 
              className="h-4 bg-muted rounded animate-pulse flex-1"
              style={{ animationDelay: `${(rowIndex * columns + colIndex) * 0.05}s` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Loading;