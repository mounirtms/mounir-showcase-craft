import React from "react";
import { Loader2, RefreshCw, Download, Upload, Search, Database } from "lucide-react";
import { cn } from "@/lib/utils";

export type LoadingStateVariant = 
  | "spinner" 
  | "pulse" 
  | "skeleton" 
  | "dots" 
  | "refresh" 
  | "download" 
  | "upload" 
  | "search" 
  | "database";

export type LoadingStateSize = "sm" | "md" | "lg" | "xl";

export interface LoadingStateProps {
  variant?: LoadingStateVariant;
  size?: LoadingStateSize;
  message?: string;
  className?: string;
  inline?: boolean;
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8", 
  xl: "w-12 h-12"
};

const LoadingSpinner: React.FC<{ size: LoadingStateSize; className?: string }> = ({ 
  size, 
  className 
}) => (
  <Loader2 className={cn("animate-spin", sizeClasses[size], className)} />
);

const LoadingPulse: React.FC<{ size: LoadingStateSize; className?: string }> = ({ 
  size, 
  className 
}) => (
  <div className={cn("animate-pulse bg-muted rounded", sizeClasses[size], className)} />
);

const LoadingSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("animate-pulse space-y-2", className)}>
    <div className="h-4 bg-muted rounded w-3/4" />
    <div className="h-4 bg-muted rounded w-1/2" />
    <div className="h-4 bg-muted rounded w-2/3" />
  </div>
);

const LoadingDots: React.FC<{ size: LoadingStateSize; className?: string }> = ({ 
  size, 
  className 
}) => {
  const dotSize = {
    sm: "w-1 h-1",
    md: "w-1.5 h-1.5",
    lg: "w-2 h-2",
    xl: "w-3 h-3"
  };

  return (
    <div className={cn("flex space-x-1", className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            "bg-current rounded-full animate-pulse",
            dotSize[size]
          )}
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: "1s"
          }}
        />
      ))}
    </div>
  );
};

const LoadingRefresh: React.FC<{ size: LoadingStateSize; className?: string }> = ({ 
  size, 
  className 
}) => (
  <RefreshCw className={cn("animate-spin", sizeClasses[size], className)} />
);

const LoadingDownload: React.FC<{ size: LoadingStateSize; className?: string }> = ({ 
  size, 
  className 
}) => (
  <Download className={cn("animate-bounce", sizeClasses[size], className)} />
);

const LoadingUpload: React.FC<{ size: LoadingStateSize; className?: string }> = ({ 
  size, 
  className 
}) => (
  <Upload className={cn("animate-bounce", sizeClasses[size], className)} />
);

const LoadingSearch: React.FC<{ size: LoadingStateSize; className?: string }> = ({ 
  size, 
  className 
}) => (
  <Search className={cn("animate-pulse", sizeClasses[size], className)} />
);

const LoadingDatabase: React.FC<{ size: LoadingStateSize; className?: string }> = ({ 
  size, 
  className 
}) => (
  <Database className={cn("animate-pulse", sizeClasses[size], className)} />
);

export const LoadingStates: React.FC<LoadingStateProps> = ({
  variant = "spinner",
  size = "md",
  message,
  className,
  inline = false
}) => {
  const renderIcon = () => {
    const iconProps = { size, className: "text-muted-foreground" };
    
    switch (variant) {
      case "spinner":
        return <LoadingSpinner {...iconProps} />;
      case "pulse":
        return <LoadingPulse {...iconProps} />;
      case "skeleton":
        return <LoadingSkeleton className={iconProps.className} />;
      case "dots":
        return <LoadingDots {...iconProps} />;
      case "refresh":
        return <LoadingRefresh {...iconProps} />;
      case "download":
        return <LoadingDownload {...iconProps} />;
      case "upload":
        return <LoadingUpload {...iconProps} />;
      case "search":
        return <LoadingSearch {...iconProps} />;
      case "database":
        return <LoadingDatabase {...iconProps} />;
      default:
        return <LoadingSpinner {...iconProps} />;
    }
  };

  if (inline) {
    return (
      <span className={cn("inline-flex items-center gap-2", className)}>
        {renderIcon()}
        {message && <span className="text-sm text-muted-foreground">{message}</span>}
      </span>
    );
  }

  return (
    <div className={cn("flex flex-col items-center justify-center p-8 space-y-2", className)}>
      {renderIcon()}
      {message && (
        <p className="text-sm text-muted-foreground text-center">{message}</p>
      )}
    </div>
  );
};

// Convenience components for common loading scenarios
export const TableLoadingState: React.FC<{ message?: string }> = ({ 
  message = "Loading data..." 
}) => (
  <LoadingStates variant="skeleton" message={message} />
);

export const FormLoadingState: React.FC<{ message?: string }> = ({ 
  message = "Saving..." 
}) => (
  <LoadingStates variant="spinner" size="sm" message={message} inline />
);

export const PageLoadingState: React.FC<{ message?: string }> = ({ 
  message = "Loading page..." 
}) => (
  <LoadingStates variant="spinner" size="lg" message={message} />
);

export const SearchLoadingState: React.FC<{ message?: string }> = ({ 
  message = "Searching..." 
}) => (
  <LoadingStates variant="search" message={message} inline />
);

export const ExportLoadingState: React.FC<{ message?: string }> = ({ 
  message = "Exporting data..." 
}) => (
  <LoadingStates variant="download" message={message} inline />
);

export const ImportLoadingState: React.FC<{ message?: string }> = ({ 
  message = "Importing data..." 
}) => (
  <LoadingStates variant="upload" message={message} inline />
);

export default LoadingStates;