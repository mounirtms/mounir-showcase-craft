/**
 * Code Deduplication Utilities
 * Tools for identifying and removing duplicate code patterns
 */

import { formatters } from '@/lib/shared/formatters';
import { apiUtils } from '@/lib/shared/api-utils';

// Common validation patterns that can be reused
export const commonValidators = {
  required: (value: any) => value != null && value !== '',
  email: (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  url: (url: string) => {
    try { 
      new URL(url); 
      return true; 
    } catch { 
      return false; 
    }
  },
  minLength: (min: number) => (value: string) => value.length >= min,
  maxLength: (max: number) => (value: string) => value.length <= max,
  pattern: (regex: RegExp) => (value: string) => regex.test(value),
  numeric: (value: string) => !isNaN(Number(value)),
  positive: (value: number) => value > 0,
  range: (min: number, max: number) => (value: number) => value >= min && value <= max
};

// Common CSS class combinations
export const commonClasses = {
  // Layout
  flexCenter: 'flex items-center justify-center',
  flexBetween: 'flex items-center justify-between',
  flexCol: 'flex flex-col',
  flexColCenter: 'flex flex-col items-center justify-center',
  
  // Spacing
  spaceY2: 'space-y-2',
  spaceY4: 'space-y-4',
  spaceY6: 'space-y-6',
  spaceX2: 'space-x-2',
  spaceX4: 'space-x-4',
  
  // Borders
  border: 'border border-border',
  borderRounded: 'border border-border rounded-lg',
  borderTop: 'border-t border-border',
  
  // Text
  textMuted: 'text-muted-foreground',
  textSm: 'text-sm',
  textLg: 'text-lg',
  fontMedium: 'font-medium',
  fontSemibold: 'font-semibold',
  
  // Backgrounds
  bgCard: 'bg-card',
  bgMuted: 'bg-muted',
  bgPrimary: 'bg-primary',
  
  // Transitions
  transition: 'transition-all duration-200',
  transitionColors: 'transition-colors duration-200',
  
  // Hover states
  hoverBg: 'hover:bg-muted/50',
  hoverScale: 'hover:scale-105',
  hoverShadow: 'hover:shadow-lg',
  
  // Focus states
  focusRing: 'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
  
  // Grid layouts
  grid2: 'grid grid-cols-1 md:grid-cols-2 gap-4',
  grid3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
  grid4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4',
  
  // Card styles
  card: 'bg-card text-card-foreground border border-border rounded-lg p-4',
  cardHover: 'bg-card text-card-foreground border border-border rounded-lg p-4 hover:shadow-lg transition-shadow',
  
  // Button styles
  btnPrimary: 'bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md transition-colors',
  btnSecondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-md transition-colors',
  btnOutline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground px-4 py-2 rounded-md transition-colors',
  
  // Form styles
  formField: 'space-y-2',
  formLabel: 'text-sm font-medium text-foreground',
  formInput: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  formError: 'text-xs text-destructive'
};

// Common component patterns
export const componentPatterns = {
  // Loading state component
  LoadingSpinner: () => (
    <div className="flex items-center justify-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  ),
  
  // Empty state component
  EmptyState: ({ message = 'No data available', action }: { message?: string; action?: React.ReactNode }) => (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <p className="text-muted-foreground mb-4">{message}</p>
      {action}
    </div>
  ),
  
  // Error state component
  ErrorState: ({ message = 'Something went wrong', retry }: { message?: string; retry?: () => void }) => (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <p className="text-destructive mb-4">{message}</p>
      {retry && (
        <button onClick={retry} className="text-primary hover:underline">
          Try again
        </button>
      )}
    </div>
  )
};

// Common hooks patterns
export const commonHooks = {
  // Debounced value hook
  useDebounce: function<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

    React.useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  },
  
  // Local storage hook
  useLocalStorage: function<T>(key: string, initialValue: T): [T, (value: T) => void] {
    const [storedValue, setStoredValue] = React.useState<T>(() => {
      try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
      } catch (error) {
        return initialValue;
      }
    });

    const setValue = (value: T) => {
      try {
        setStoredValue(value);
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    };

    return [storedValue, setValue];
  },
  
  // Previous value hook
  usePrevious: function<T>(value: T): T | undefined {
    const ref = React.useRef<T>();
    React.useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }
};

// Utility functions for code analysis
export const codeAnalysis = {
  // Find duplicate function signatures
  findDuplicateFunctions: (codebase: string[]) => {
    const functionSignatures = new Map<string, string[]>();
    
    codebase.forEach((file, index) => {
      const functionMatches = file.match(/function\s+(\w+)\s*\([^)]*\)/g) || [];
      const arrowFunctionMatches = file.match(/const\s+(\w+)\s*=\s*\([^)]*\)\s*=>/g) || [];
      
      [...functionMatches, ...arrowFunctionMatches].forEach(match => {
        const signature = match.replace(/\s+/g, ' ').trim();
        if (!functionSignatures.has(signature)) {
          functionSignatures.set(signature, []);
        }
        functionSignatures.get(signature)!.push(`file-${index}`);
      });
    });
    
    return Array.from(functionSignatures.entries())
      .filter(([, files]) => files.length > 1)
      .map(([signature, files]) => ({ signature, files }));
  },
  
  // Find duplicate interfaces
  findDuplicateInterfaces: (codebase: string[]) => {
    const interfaces = new Map<string, string[]>();
    
    codebase.forEach((file, index) => {
      const interfaceMatches = file.match(/interface\s+(\w+)\s*{[^}]*}/g) || [];
      
      interfaceMatches.forEach(match => {
        const normalized = match.replace(/\s+/g, ' ').trim();
        if (!interfaces.has(normalized)) {
          interfaces.set(normalized, []);
        }
        interfaces.get(normalized)!.push(`file-${index}`);
      });
    });
    
    return Array.from(interfaces.entries())
      .filter(([, files]) => files.length > 1)
      .map(([interface_, files]) => ({ interface: interface_, files }));
  },
  
  // Find duplicate CSS classes
  findDuplicateClasses: (codebase: string[]) => {
    const classPatterns = new Map<string, string[]>();
    
    codebase.forEach((file, index) => {
      const classMatches = file.match(/className=["']([^"']+)["']/g) || [];
      
      classMatches.forEach(match => {
        const classes = match.replace(/className=["']([^"']+)["']/, '$1');
        if (classes.length > 20) { // Only consider longer class combinations
          if (!classPatterns.has(classes)) {
            classPatterns.set(classes, []);
          }
          classPatterns.get(classes)!.push(`file-${index}`);
        }
      });
    });
    
    return Array.from(classPatterns.entries())
      .filter(([, files]) => files.length > 1)
      .map(([classes, files]) => ({ classes, files }));
  }
};

// Refactoring suggestions
export const refactoringSuggestions = {
  // Suggest extracting common utilities
  suggestUtilityExtraction: (duplicates: any[]) => {
    return duplicates.map(duplicate => ({
      type: 'utility-extraction',
      description: `Extract common utility: ${duplicate.signature || duplicate.interface || duplicate.classes}`,
      files: duplicate.files,
      suggestion: 'Move to shared utility file'
    }));
  },
  
  // Suggest component composition
  suggestComponentComposition: (components: string[]) => {
    return components.map(component => ({
      type: 'component-composition',
      description: `Consider breaking down large component: ${component}`,
      suggestion: 'Split into smaller, focused components'
    }));
  },
  
  // Suggest hook extraction
  suggestHookExtraction: (patterns: string[]) => {
    return patterns.map(pattern => ({
      type: 'hook-extraction',
      description: `Extract reusable logic: ${pattern}`,
      suggestion: 'Create custom hook for shared logic'
    }));
  }
};

// Export commonly used utilities
export { formatters, apiUtils, commonValidators as validators };

// Re-export React for hook patterns
import React from 'react';
export { React };