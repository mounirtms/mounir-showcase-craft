#!/usr/bin/env node

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get hook name from command line arguments
const hookName = process.argv[2];
const hookType = process.argv[3] || 'custom'; // custom, api, state, effect

if (!hookName) {
  console.error('❌ Please provide a hook name');
  console.log('Usage: npm run generate:hook <hookName> [type]');
  console.log('Types: custom, api, state, effect');
  console.log('Example: npm run generate:hook useCounter custom');
  console.log('Example: npm run generate:hook useProjects api');
  process.exit(1);
}

// Validate hook name (should start with 'use')
if (!hookName.startsWith('use') || !/^use[A-Z][a-zA-Z0-9]*$/.test(hookName)) {
  console.error('❌ Hook name must start with "use" and be in camelCase (e.g., useMyHook)');
  process.exit(1);
}

// Create directory path
const hooksPath = join(process.cwd(), 'src', 'hooks');
const filePath = join(hooksPath, `${hookName}.ts`);

// Check if hook already exists
if (existsSync(filePath)) {
  console.error(`❌ Hook ${hookName} already exists`);
  process.exit(1);
}

// Create directory if it doesn't exist
mkdirSync(hooksPath, { recursive: true });

// Hook templates based on type
const getHookTemplate = (type) => {
  const entityName = hookName.replace('use', '').toLowerCase();
  
  switch (type) {
    case 'api':
      return `import { useState, useEffect, useCallback } from 'react';

interface ${hookName.replace('use', '')}Data {
  // Define your data structure here
  id: string;
  name: string;
  // Add more fields as needed
}

interface ${hookName}Return {
  data: ${hookName.replace('use', '')}Data[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  create: (item: Omit<${hookName.replace('use', '')}Data, 'id'>) => Promise<void>;
  update: (id: string, item: Partial<${hookName.replace('use', '')}Data>) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export const ${hookName} = (): ${hookName}Return => {
  const [data, setData] = useState<${hookName.replace('use', '')}Data[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Replace with your actual API call
      const response = await fetch('/api/${entityName}');
      if (!response.ok) {
        throw new Error(\`Failed to fetch ${entityName}: \${response.statusText}\`);
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (item: Omit<${hookName.replace('use', '')}Data, 'id'>) => {
    try {
      setError(null);
      
      const response = await fetch('/api/${entityName}', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      
      if (!response.ok) {
        throw new Error(\`Failed to create ${entityName}: \${response.statusText}\`);
      }
      
      await fetchData(); // Refetch data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  }, [fetchData]);

  const update = useCallback(async (id: string, item: Partial<${hookName.replace('use', '')}Data>) => {
    try {
      setError(null);
      
      const response = await fetch(\`/api/${entityName}/\${id}\`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      
      if (!response.ok) {
        throw new Error(\`Failed to update ${entityName}: \${response.statusText}\`);
      }
      
      await fetchData(); // Refetch data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  }, [fetchData]);

  const remove = useCallback(async (id: string) => {
    try {
      setError(null);
      
      const response = await fetch(\`/api/${entityName}/\${id}\`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(\`Failed to delete ${entityName}: \${response.statusText}\`);
      }
      
      await fetchData(); // Refetch data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    create,
    update,
    remove,
  };
};

export default ${hookName};
`;

    case 'state':
      return `import { useState, useCallback } from 'react';

interface ${hookName}State {
  // Define your state structure here
  value: string;
  count: number;
  // Add more fields as needed
}

interface ${hookName}Actions {
  setValue: (value: string) => void;
  setCount: (count: number) => void;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

interface ${hookName}Return extends ${hookName}State, ${hookName}Actions {}

const initialState: ${hookName}State = {
  value: '',
  count: 0,
};

export const ${hookName} = (initial?: Partial<${hookName}State>): ${hookName}Return => {
  const [state, setState] = useState<${hookName}State>({
    ...initialState,
    ...initial,
  });

  const setValue = useCallback((value: string) => {
    setState(prev => ({ ...prev, value }));
  }, []);

  const setCount = useCallback((count: number) => {
    setState(prev => ({ ...prev, count }));
  }, []);

  const increment = useCallback(() => {
    setState(prev => ({ ...prev, count: prev.count + 1 }));
  }, []);

  const decrement = useCallback(() => {
    setState(prev => ({ ...prev, count: prev.count - 1 }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    ...state,
    setValue,
    setCount,
    increment,
    decrement,
    reset,
  };
};

export default ${hookName};
`;

    case 'effect':
      return `import { useEffect, useRef, useCallback } from 'react';

interface ${hookName}Options {
  // Define your options here
  delay?: number;
  immediate?: boolean;
  // Add more options as needed
}

export const ${hookName} = (
  callback: () => void | (() => void),
  options: ${hookName}Options = {}
) => {
  const { delay = 1000, immediate = false } = options;
  const callbackRef = useRef(callback);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const start = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      const cleanup = callbackRef.current();
      if (typeof cleanup === 'function') {
        return cleanup;
      }
    }, delay);
  }, [delay]);

  const stop = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  }, []);

  const restart = useCallback(() => {
    stop();
    start();
  }, [start, stop]);

  useEffect(() => {
    if (immediate) {
      start();
    }

    return () => {
      stop();
    };
  }, [immediate, start, stop]);

  return { start, stop, restart };
};

export default ${hookName};
`;

    default: // custom
      return `import { useState, useCallback } from 'react';

interface ${hookName}Return {
  // Define your return type here
  value: string;
  setValue: (value: string) => void;
  reset: () => void;
  // Add more properties as needed
}

export const ${hookName} = (initialValue: string = ''): ${hookName}Return => {
  const [value, setValue] = useState(initialValue);

  const reset = useCallback(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleSetValue = useCallback((newValue: string) => {
    setValue(newValue);
  }, []);

  return {
    value,
    setValue: handleSetValue,
    reset,
  };
};

export default ${hookName};
`;
  }
};

// Test template
const testTemplate = `import { renderHook, act } from '@testing-library/react';
import { ${hookName} } from './${hookName}';

describe('${hookName}', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => ${hookName}());
    
    // Add your assertions here based on the hook's return type
    expect(result.current).toBeDefined();
  });

  it('should handle state updates correctly', () => {
    const { result } = renderHook(() => ${hookName}());
    
    act(() => {
      // Add your test actions here
      // Example: result.current.setValue('test');
    });
    
    // Add your assertions here
    // Example: expect(result.current.value).toBe('test');
  });

  it('should cleanup properly on unmount', () => {
    const { unmount } = renderHook(() => ${hookName}());
    
    // Test cleanup behavior
    expect(() => unmount()).not.toThrow();
  });
});
`;

try {
  // Write hook file
  writeFileSync(filePath, getHookTemplate(hookType));
  
  // Write test file
  writeFileSync(join(hooksPath, `${hookName}.test.ts`), testTemplate);

  console.log('✅ Hook generated successfully!');
  console.log(`📁 Location: src/hooks/${hookName}.ts`);
  console.log(`🔧 Type: ${hookType}`);
  console.log('📄 Files created:');
  console.log(`   - ${hookName}.ts (main hook)`);
  console.log(`   - ${hookName}.test.ts (tests)`);
  console.log('');
  console.log('💡 Next steps:');
  console.log(`   1. Implement your hook logic in ${hookName}.ts`);
  console.log(`   2. Add the hook to your main exports if needed`);
  console.log(`   3. Run tests: npm run test`);
  console.log(`   4. Use the hook in your components`);

} catch (error) {
  console.error('❌ Error generating hook:', error.message);
  process.exit(1);
}