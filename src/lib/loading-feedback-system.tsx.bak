import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  Clock,
  Upload,
  Download,
  Save,
  Trash2,
  Edit,
  Plus,
  X,
  PlayCircle,
  PauseCircle,
  StopCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Loading operation types
export type LoadingOperation = 
  | 'create' 
  | 'read' 
  | 'update' 
  | 'delete' 
  | 'upload' 
  | 'download' 
  | 'export' 
  | 'import' 
  | 'sync' 
  | 'validate' 
  | 'process'
  | 'custom';

// Loading states
export type LoadingState = 'idle' | 'loading' | 'success' | 'error' | 'cancelled';

// Progress information
export interface ProgressInfo {
  current: number;
  total: number;
  percentage: number;
  message?: string;
  estimatedTimeRemaining?: number;
}

// Loading operation details
export interface LoadingOperationDetails {
  id: string;
  type: LoadingOperation;
  state: LoadingState;
  message: string;
  startTime: Date;
  endTime?: Date;
  progress?: ProgressInfo;
  error?: string;
  canCancel?: boolean;
  retryCount: number;
  maxRetries: number;
  metadata?: Record<string, any>;
}

// Feedback configuration
export interface FeedbackConfig {
  showToast: boolean;
  showProgress: boolean;
  showInline: boolean;
  autoHide: boolean;
  autoHideDelay: number;
  persistOnError: boolean;
}

// Default feedback configuration
const DEFAULT_FEEDBACK_CONFIG: FeedbackConfig = {
  showToast: true,
  showProgress: true,
  showInline: true,
  autoHide: true,
  autoHideDelay: 3000,
  persistOnError: true
};

// Loading context
interface LoadingContextType {
  operations: Map<string, LoadingOperationDetails>;
  startOperation: (type: LoadingOperation, message: string, config?: Partial<FeedbackConfig>) => string;
  updateOperation: (id: string, updates: Partial<LoadingOperationDetails>) => void;
  completeOperation: (id: string, result?: 'success' | 'error', message?: string) => void;
  cancelOperation: (id: string) => void;
  retryOperation: (id: string) => void;
  clearOperation: (id: string) => void;
  clearAllOperations: () => void;
  isOperationLoading: (id: string) => boolean;
  getOperation: (id: string) => LoadingOperationDetails | undefined;
  getOperationsByType: (type: LoadingOperation) => LoadingOperationDetails[];
  getActiveOperations: () => LoadingOperationDetails[];
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

// Generate unique operation ID
const generateOperationId = (): string => {
  return `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Operation icons mapping
const OPERATION_ICONS: Record<LoadingOperation, React.ReactNode> = {
  create: <Plus className="w-4 h-4" />,
  read: <RefreshCw className="w-4 h-4" />,
  update: <Edit className="w-4 h-4" />,
  delete: <Trash2 className="w-4 h-4" />,
  upload: <Upload className="w-4 h-4" />,
  download: <Download className="w-4 h-4" />,
  export: <Download className="w-4 h-4" />,
  import: <Upload className="w-4 h-4" />,
  sync: <RefreshCw className="w-4 h-4" />,
  validate: <CheckCircle2 className="w-4 h-4" />,
  process: <PlayCircle className="w-4 h-4" />,
  custom: <Clock className="w-4 h-4" />
};

// State icons mapping
const STATE_ICONS: Record<LoadingState, React.ReactNode> = {
  idle: <Clock className="w-4 h-4" />,
  loading: <Loader2 className="w-4 h-4 animate-spin" />,
  success: <CheckCircle2 className="w-4 h-4 text-green-500" />,
  error: <AlertCircle className="w-4 h-4 text-red-500" />,
  cancelled: <X className="w-4 h-4 text-gray-500" />
};

// Loading Provider Component
export const LoadingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [operations, setOperations] = useState<Map<string, LoadingOperationDetails>>(new Map());

  const startOperation = useCallback(
    (type: LoadingOperation, message: string, config: Partial<FeedbackConfig> = {}): string => {
      const id = generateOperationId();
      const mergedConfig = { ...DEFAULT_FEEDBACK_CONFIG, ...config };
      
      const operation: LoadingOperationDetails = {
        id,
        type,
        state: 'loading',
        message,
        startTime: new Date(),
        retryCount: 0,
        maxRetries: 3,
        canCancel: true
      };

      setOperations(prev => new Map(prev).set(id, operation));

      // Show toast notification if configured
      if (mergedConfig.showToast) {
        toast({
          title: `${type.charAt(0).toUpperCase() + type.slice(1)} Started`,
          description: message,
          duration: mergedConfig.autoHide ? mergedConfig.autoHideDelay : undefined
        });
      }

      return id;
    },
    []
  );

  const updateOperation = useCallback(
    (id: string, updates: Partial<LoadingOperationDetails>) => {
      setOperations(prev => {
        const newMap = new Map(prev);
        const existing = newMap.get(id);
        if (existing) {
          newMap.set(id, { ...existing, ...updates });
        }
        return newMap;
      });
    },
    []
  );

  const completeOperation = useCallback(
    (id: string, result: 'success' | 'error' = 'success', message?: string) => {
      setOperations(prev => {
        const newMap = new Map(prev);
        const existing = newMap.get(id);
        if (existing) {
          const updatedOperation = {
            ...existing,
            state: result as LoadingState,
            endTime: new Date(),
            message: message || existing.message
          };
          newMap.set(id, updatedOperation);

          // Show completion toast
          toast({
            title: result === 'success' ? 'Operation Completed' : 'Operation Failed',
            description: message || existing.message,
            variant: result === 'error' ? 'destructive' : 'default'
          });

          // Auto-clear successful operations
          if (result === 'success') {
            setTimeout(() => {
              setOperations(current => {
                const newest = new Map(current);
                newest.delete(id);
                return newest;
              });
            }, 3000);
          }
        }
        return newMap;
      });
    },
    []
  );

  const cancelOperation = useCallback(
    (id: string) => {
      updateOperation(id, { state: 'cancelled', endTime: new Date() });
      toast({
        title: 'Operation Cancelled',
        description: 'The operation was cancelled by user request'
      });
    },
    [updateOperation]
  );

  const retryOperation = useCallback(
    (id: string) => {
      setOperations(prev => {
        const newMap = new Map(prev);
        const existing = newMap.get(id);
        if (existing && existing.retryCount < existing.maxRetries) {
          newMap.set(id, {
            ...existing,
            state: 'loading',
            retryCount: existing.retryCount + 1,
            endTime: undefined
          });
        }
        return newMap;
      });
    },
    []
  );

  const clearOperation = useCallback(
    (id: string) => {
      setOperations(prev => {
        const newMap = new Map(prev);
        newMap.delete(id);
        return newMap;
      });
    },
    []
  );

  const clearAllOperations = useCallback(() => {
    setOperations(new Map());
  }, []);

  const isOperationLoading = useCallback(
    (id: string): boolean => {
      const operation = operations.get(id);
      return operation?.state === 'loading';
    },
    [operations]
  );

  const getOperation = useCallback(
    (id: string): LoadingOperationDetails | undefined => {
      return operations.get(id);
    },
    [operations]
  );

  const getOperationsByType = useCallback(
    (type: LoadingOperation): LoadingOperationDetails[] => {
      return Array.from(operations.values()).filter(op => op.type === type);
    },
    [operations]
  );

  const getActiveOperations = useCallback(
    (): LoadingOperationDetails[] => {
      return Array.from(operations.values()).filter(op => op.state === 'loading');
    },
    [operations]
  );

  const value: LoadingContextType = {
    operations,
    startOperation,
    updateOperation,
    completeOperation,
    cancelOperation,
    retryOperation,
    clearOperation,
    clearAllOperations,
    isOperationLoading,
    getOperation,
    getOperationsByType,
    getActiveOperations
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};

// Hook to use loading context
export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

// Operation Progress Component
export interface OperationProgressProps {
  operationId: string;
  className?: string;
  compact?: boolean;
}

export const OperationProgress: React.FC<OperationProgressProps> = ({
  operationId,
  className,
  compact = false
}) => {
  const { getOperation, cancelOperation, retryOperation, clearOperation } = useLoading();
  const operation = getOperation(operationId);

  if (!operation) return null;

  const getOperationColor = (state: LoadingState) => {
    switch (state) {
      case 'loading': return 'text-blue-600';
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'cancelled': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getDuration = () => {
    const start = operation.startTime;
    const end = operation.endTime || new Date();
    const duration = Math.round((end.getTime() - start.getTime()) / 1000);
    return `${duration}s`;
  };

  if (compact) {
    return (
      <div className={cn('flex items-center gap-2 text-sm', className)}>
        {STATE_ICONS[operation.state]}
        <span className={getOperationColor(operation.state)}>
          {operation.message}
        </span>
        {operation.progress && (
          <span className="text-muted-foreground">
            {operation.progress.percentage}%
          </span>
        )}
      </div>
    );
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {OPERATION_ICONS[operation.type]}
              <span className="font-medium capitalize">{operation.type}</span>
              {STATE_ICONS[operation.state]}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {getDuration()}
              </span>
              {operation.state === 'loading' && operation.canCancel && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => cancelOperation(operationId)}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
              {operation.state === 'error' && operation.retryCount < operation.maxRetries && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => retryOperation(operationId)}
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              )}
              {['success', 'error', 'cancelled'].includes(operation.state) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => clearOperation(operationId)}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Message */}
          <p className={cn('text-sm', getOperationColor(operation.state))}>
            {operation.message}
          </p>

          {/* Progress */}
          {operation.progress && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{operation.progress.percentage}%</span>
              </div>
              <Progress value={operation.progress.percentage} className="h-2" />
              {operation.progress.message && (
                <p className="text-xs text-muted-foreground">
                  {operation.progress.message}
                </p>
              )}
              {operation.progress.estimatedTimeRemaining && (
                <p className="text-xs text-muted-foreground">
                  Estimated time remaining: {Math.round(operation.progress.estimatedTimeRemaining / 1000)}s
                </p>
              )}
            </div>
          )}

          {/* Error details */}
          {operation.state === 'error' && operation.error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {operation.error}
              </AlertDescription>
            </Alert>
          )}

          {/* Retry information */}
          {operation.retryCount > 0 && (
            <p className="text-xs text-muted-foreground">
              Retry {operation.retryCount} of {operation.maxRetries}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Operations Manager Component
export const OperationsManager: React.FC<{ className?: string }> = ({ className }) => {
  const { operations, clearAllOperations, getActiveOperations } = useLoading();
  const activeOps = getActiveOperations();
  const allOps = Array.from(operations.values());

  if (allOps.length === 0) {
    return null;
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">
          Operations ({activeOps.length} active, {allOps.length} total)
        </h3>
        <Button variant="outline" size="sm" onClick={clearAllOperations}>
          Clear All
        </Button>
      </div>
      
      <div className="space-y-2">
        {allOps.map(operation => (
          <OperationProgress
            key={operation.id}
            operationId={operation.id}
            compact={true}
          />
        ))}
      </div>
    </div>
  );
};

// Hook for CRUD operations with loading states
export const useCRUDLoading = () => {
  const loading = useLoading();

  const withLoading = useCallback(
    async <T>(
      operation: LoadingOperation,
      message: string,
      asyncFn: (operationId: string) => Promise<T>,
      config?: Partial<FeedbackConfig>
    ): Promise<T> => {
      const operationId = loading.startOperation(operation, message, config);
      
      try {
        const result = await asyncFn(operationId);
        loading.completeOperation(operationId, 'success', `${operation} completed successfully`);
        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Operation failed';
        loading.completeOperation(operationId, 'error', errorMessage);
        throw error;
      }
    },
    [loading]
  );

  return {
    ...loading,
    withLoading
  };
};

export default LoadingProvider;