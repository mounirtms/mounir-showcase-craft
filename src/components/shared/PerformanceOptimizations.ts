import React, { memo, useCallback, useMemo } from "react";

// Generic memo wrapper with custom comparison
export const createMemoComponent = <T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  compareProps?: (prevProps: T, nextProps: T) => boolean
) => {
  const MemoizedComponent = memo(Component, compareProps);
  MemoizedComponent.displayName = `Memo(${Component.displayName || Component.name})`;
  return MemoizedComponent;
};

// Optimized list item component with deep comparison for complex objects
export const createOptimizedListItem = <T extends { id: string | number }>(
  ItemComponent: React.ComponentType<{ item: T; onEdit?: (item: T) => void; onDelete?: (item: T) => void }>
) => {
  return memo(ItemComponent, (prevProps, nextProps) => {
    // Compare item by reference first (fastest)
    if (prevProps.item === nextProps.item) return true;
    
    // Compare item IDs
    if (prevProps.item.id !== nextProps.item.id) return false;
    
    // Compare function references
    if (prevProps.onEdit !== nextProps.onEdit) return false;
    if (prevProps.onDelete !== nextProps.onDelete) return false;
    
    // Deep compare item properties (only if necessary)
    return JSON.stringify(prevProps.item) === JSON.stringify(nextProps.item);
  });
};

// Hook for stable callback references
export const useStableCallback = <T extends (...args: any[]) => any>(
  callback: T,
  dependencies: React.DependencyList
): T => {
  return useCallback(callback, dependencies);
};

// Hook for stable object references
export const useStableObject = <T extends Record<string, any>>(
  obj: T,
  dependencies: React.DependencyList
): T => {
  return useMemo(() => obj, dependencies);
};

// Hook for memoizing expensive computations
export const useExpensiveComputation = <T>(
  computeFn: () => T,
  dependencies: React.DependencyList,
  options?: {
    shouldRecompute?: (prev: T, deps: React.DependencyList) => boolean;
    debounceMs?: number;
  }
): T => {
  const [debouncedDeps, setDebouncedDeps] = React.useState(dependencies);
  
  // Debounce dependencies if specified
  React.useEffect(() => {
    if (options?.debounceMs) {
      const timeout = setTimeout(() => {
        setDebouncedDeps(dependencies);
      }, options.debounceMs);
      
      return () => clearTimeout(timeout);
    } else {
      setDebouncedDeps(dependencies);
    }
  }, dependencies);
  
  return useMemo(computeFn, options?.debounceMs ? debouncedDeps : dependencies);
};

// Performance monitoring hook
export const usePerformanceMonitor = (componentName: string) => {
  const renderCount = React.useRef(0);
  const startTime = React.useRef<number>(Date.now());
  
  React.useEffect(() => {
    renderCount.current++;
    const renderTime = Date.now() - startTime.current;
    
    if (process.env.NODE_ENV === "development") {
      console.log(`[Performance] ${componentName} render #${renderCount.current} took ${renderTime}ms`);
    }
    
    startTime.current = Date.now();
  });
  
  return {
    renderCount: renderCount.current,
    logRender: (label?: string) => {
      if (process.env.NODE_ENV === "development") {
        console.log(`[Performance] ${componentName}${label ? ` - ${label}` : ""} render #${renderCount.current}`);
      }
    }
  };
};

// Hook for preventing unnecessary re-renders
export const usePreventUnnecessaryRenders = <T extends Record<string, any>>(
  props: T,
  options?: {
    logChanges?: boolean;
    componentName?: string;
  }
) => {
  const previousProps = React.useRef<T>(props);
  const changedProps = React.useRef<Partial<T>>({});
  
  React.useEffect(() => {
    if (options?.logChanges && process.env.NODE_ENV === "development") {
      const changes: Record<string, { prev: any; next: any }> = {};
      
      Object.keys(props).forEach(key => {
        if (previousProps.current[key] !== props[key]) {
          changes[key] = {
            prev: previousProps.current[key],
            next: props[key]
          };
          (changedProps.current as any)[key] = props[key];
        }
      });
      
      if (Object.keys(changes).length > 0) {
        console.log(
          `[Performance] ${options.componentName || 'Component'} props changed:`,
          changes
        );
      }
    }
    
    previousProps.current = props;
  });
  
  return {
    previousProps: previousProps.current,
    changedProps: changedProps.current
  };
};

// Stable event handlers factory
export const createStableHandlers = <T extends Record<string, (...args: any[]) => any>>(
  handlers: T,
  dependencies: React.DependencyList
): T => {
  return useMemo(() => {
    const stableHandlers = {} as T;
    
    Object.keys(handlers).forEach(key => {
      (stableHandlers as any)[key] = handlers[key];
    });
    
    return stableHandlers;
  }, dependencies);
};

// Hook for optimized list rendering with virtualization support
export const useOptimizedList = <T extends { id: string | number }>(
  items: T[],
  options?: {
    pageSize?: number;
    enableVirtualization?: boolean;
    filterFn?: (item: T) => boolean;
    sortFn?: (a: T, b: T) => number;
  }
) => {
  const {
    pageSize = 50,
    enableVirtualization = false,
    filterFn,
    sortFn
  } = options || {};
  
  const processedItems = useMemo(() => {
    let result = [...items];
    
    // Apply filter
    if (filterFn) {
      result = result.filter(filterFn);
    }
    
    // Apply sort
    if (sortFn) {
      result.sort(sortFn);
    }
    
    return result;
  }, [items, filterFn, sortFn]);
  
  const [visibleItems, setVisibleItems] = React.useState(() => 
    enableVirtualization ? processedItems.slice(0, pageSize) : processedItems
  );
  
  const loadMore = useCallback(() => {
    if (enableVirtualization) {
      setVisibleItems(prev => [
        ...prev,
        ...processedItems.slice(prev.length, prev.length + pageSize)
      ]);
    }
  }, [processedItems, pageSize, enableVirtualization]);
  
  const hasMore = enableVirtualization ? visibleItems.length < processedItems.length : false;
  
  React.useEffect(() => {
    if (enableVirtualization) {
      setVisibleItems(processedItems.slice(0, Math.min(pageSize, processedItems.length)));
    } else {
      setVisibleItems(processedItems);
    }
  }, [processedItems, pageSize, enableVirtualization]);
  
  return {
    items: visibleItems,
    totalItems: processedItems.length,
    hasMore,
    loadMore
  };
};

// Higher-order component for performance optimization
export const withPerformanceOptimization = <P extends Record<string, any>>(
  Component: React.ComponentType<P>,
  options?: {
    memoDeps?: (props: P) => React.DependencyList;
    displayName?: string;
    logPerformance?: boolean;
  }
) => {
  const OptimizedComponent = memo((props: P) => {
    if (options?.logPerformance) {
      usePerformanceMonitor(options.displayName || Component.displayName || Component.name);
    }
    
    return React.createElement(Component, props);
  }, options?.memoDeps ? (prevProps, nextProps) => {
    const prevDeps = options.memoDeps!(prevProps);
    const nextDeps = options.memoDeps!(nextProps);
    
    return prevDeps.every((dep, index) => dep === nextDeps[index]);
  } : undefined);
  
  OptimizedComponent.displayName = options?.displayName || `Optimized(${Component.displayName || Component.name})`;
  
  return OptimizedComponent;
};

// React.memo wrapper with debug information
export const debugMemo = <T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  componentName?: string
) => {
  return memo(Component, (prevProps, nextProps) => {
    if (process.env.NODE_ENV === "development") {
      const changes: string[] = [];
      
      Object.keys(nextProps).forEach(key => {
        if (prevProps[key] !== nextProps[key]) {
          changes.push(key);
        }
      });
      
      if (changes.length > 0) {
        console.log(
          `[Memo Debug] ${componentName || Component.displayName || Component.name} props changed:`,
          changes
        );
        return false;
      }
      
      console.log(
        `[Memo Debug] ${componentName || Component.displayName || Component.name} props unchanged, skipping render`
      );
    }
    
    return Object.keys(nextProps).every(key => prevProps[key] === nextProps[key]);
  });
};