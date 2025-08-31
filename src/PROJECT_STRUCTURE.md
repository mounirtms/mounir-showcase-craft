# Project Structure Documentation

This document outlines the optimized project structure and organization patterns used in this application.

## Overview

The project has been reorganized to follow a modular, scalable architecture with clear separation of concerns and centralized exports for better maintainability.

## Directory Structure

```
src/
├── components/           # All React components
│   ├── admin/           # Admin dashboard components
│   ├── portfolio/       # Portfolio frontend components
│   ├── base/           # Base/foundational components
│   ├── shared/         # Shared/reusable components
│   ├── ui/             # UI library components
│   ├── theme/          # Theme-related components
│   ├── sections/       # Page section components
│   └── index.ts        # Centralized component exports
├── constants/          # Application constants
│   └── index.ts        # All constants centralized
├── types/              # TypeScript type definitions
│   └── index.ts        # All types centralized
├── hooks/              # Custom React hooks
│   └── index.ts        # Hook exports
├── lib/                # Library code and utilities
│   ├── shared/         # Shared utilities and helpers
│   ├── schema/         # Data validation schemas
│   ├── performance/    # Performance optimization utilities
│   ├── ui/             # UI-specific utilities
│   └── index.ts        # Library exports
├── utils/              # Utility functions
│   ├── common.ts       # Common utilities
│   └── index.ts        # Utility exports
├── contexts/           # React context providers
│   └── index.ts        # Context exports
├── pages/              # Page components
│   └── index.ts        # Page exports
├── data/               # Static data and initial values
│   └── index.ts        # Data exports
├── state/              # State management
│   └── index.ts        # State exports
└── PROJECT_STRUCTURE.md # This documentation
```

## Key Principles

### 1. Centralized Exports

Each directory contains an `index.ts` file that serves as the single point of export for all modules in that directory. This provides:

- **Clean imports**: `import { Button, Card } from '@/components/ui'`
- **Better tree-shaking**: Only import what you need
- **Easier refactoring**: Change internal structure without breaking imports
- **Lazy loading support**: Default exports for code splitting

### 2. Logical Grouping

Components and utilities are grouped by:

- **Functionality**: Admin components separate from portfolio components
- **Reusability**: Shared components separate from specific ones
- **Domain**: UI components separate from business logic

### 3. Type Safety

- All types are centralized in `src/types/index.ts`
- Component-specific types are in dedicated `types.ts` files within component directories
- Shared types are re-exported from `@/lib/shared/types`

### 4. Constants Management

- All constants are centralized in `src/constants/index.ts`
- Magic numbers and repeated values are extracted to constants
- Configuration objects are properly typed and documented

## Import Patterns

### Recommended Import Patterns

```typescript
// ✅ Good - Use centralized exports
import { Button, Card, Input } from '@/components/ui';
import { AdminLayout, AdminHeader } from '@/components/admin/layout';
import { useProjects, useSkills } from '@/hooks';
import { APP_CONFIG, UI_COMPONENT_CONFIG } from '@/constants';
import { Project, Skill, BaseProps } from '@/types';

// ✅ Good - Specific imports for large modules
import { domUtils, performanceUtils } from '@/utils/common';
import { ProjectSchema, SkillSchema } from '@/lib/schema';

// ❌ Avoid - Direct file imports (breaks encapsulation)
import { Button } from '@/components/ui/button';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
```

### Lazy Loading Pattern

```typescript
// For code splitting and performance
const AdminDashboard = lazy(() => import('@/components/admin').then(m => ({ 
  default: m.AdminDashboard 
})));

// Or use the provided lazy loading exports
import componentLoaders from '@/components';
const AdminDashboard = lazy(componentLoaders.AdminDashboard);
```

## Component Organization

### Admin Components (`src/components/admin/`)

```
admin/
├── auth/               # Authentication components
│   ├── AdminAuth.tsx
│   ├── LoginForm.tsx
│   ├── AuthGuard.tsx
│   ├── types.ts        # Auth-specific types
│   └── index.ts        # Auth exports
├── layout/             # Layout components
│   ├── AdminLayout.tsx
│   ├── AdminHeader.tsx
│   ├── AdminSidebar.tsx
│   ├── types.ts        # Layout-specific types
│   └── index.ts        # Layout exports
├── dashboard/          # Dashboard components
├── projects/           # Project management components
├── skills/             # Skill management components
└── index.ts            # All admin exports
```

### Shared Components (`src/components/shared/`)

Reusable components that can be used across different parts of the application:

- `BaseComponents.tsx` - Foundational UI components
- `ErrorBoundary.tsx` - Error handling
- `LoadingStates.tsx` - Loading indicators
- `ConfirmDialog.tsx` - Confirmation dialogs
- `FormBuilder.tsx` - Dynamic form generation

### UI Components (`src/components/ui/`)

Low-level UI library components based on design system:

- Buttons, inputs, cards, tables, etc.
- Consistent styling and behavior
- Accessibility built-in
- Theme support

## Utility Organization

### Common Utilities (`src/utils/common.ts`)

Frequently used utility functions organized by category:

- `domUtils` - DOM manipulation and browser APIs
- `performanceUtils` - Performance optimization helpers
- `animationUtils` - Animation and transition utilities
- `dataUtils` - Data manipulation and transformation
- `formUtils` - Form handling utilities
- `errorUtils` - Error handling and retry logic
- `storageUtils` - Local/session storage helpers

### Specialized Utilities

- `analytics.ts` - Analytics and tracking
- `rum-monitor.ts` - Real User Monitoring
- `tableExport.ts` - Data export functionality

## Constants Organization

### Application Constants (`src/constants/index.ts`)

```typescript
// App configuration
export const APP_CONFIG = { /* ... */ };

// UI component constants
export const UI_COMPONENT_CONFIG = { /* ... */ };

// Breakpoints and responsive design
export const BREAKPOINT_VALUES = { /* ... */ };

// Animation and timing
export const ANIMATION_VARIANTS = { /* ... */ };

// Common CSS classes
export const CSS_CLASSES = { /* ... */ };
```

## Type Organization

### Centralized Types (`src/types/index.ts`)

- Re-exports all shared types from `@/lib/shared/types`
- App-specific types and interfaces
- Component prop types
- State management types
- Utility types for better type safety

### Component-Specific Types

Each component directory can have its own `types.ts` file for types that are specific to that domain:

```typescript
// src/components/admin/auth/types.ts
export interface LoginFormProps extends BaseProps {
  onLogin: (credentials: LoginCredentials) => Promise<void>;
  loading?: boolean;
  error?: string;
}
```

## Best Practices

### 1. Import Organization

```typescript
// 1. External libraries
import React from 'react';
import { useCallback, useState } from 'react';

// 2. Internal components (by hierarchy)
import { Button, Card } from '@/components/ui';
import { AdminLayout } from '@/components/admin/layout';

// 3. Hooks and utilities
import { useProjects } from '@/hooks';
import { domUtils } from '@/utils/common';

// 4. Types and constants
import { Project, ProjectFormProps } from '@/types';
import { APP_CONFIG } from '@/constants';

// 5. Relative imports (avoid when possible)
import './ComponentName.css';
```

### 2. Component Structure

```typescript
// Component file structure
import { /* imports */ } from '...';

// Types (if not in separate file)
interface ComponentProps extends BaseProps {
  // props
}

// Component implementation
export const ComponentName: React.FC<ComponentProps> = ({
  // props
}) => {
  // hooks
  // state
  // effects
  // handlers
  // render
};

// Default export for lazy loading
export default ComponentName;
```

### 3. Index File Pattern

```typescript
// Export pattern for index files
export { ComponentA } from './ComponentA';
export { ComponentB } from './ComponentB';

// Re-export types
export type { ComponentAProps } from './ComponentA';
export type { ComponentBProps } from './ComponentB';

// Default exports for lazy loading
export default {
  ComponentA: () => import('./ComponentA'),
  ComponentB: () => import('./ComponentB'),
};
```

## Migration Guide

When moving from the old structure to this new structure:

1. **Update imports**: Replace direct file imports with centralized exports
2. **Move constants**: Extract magic numbers to the constants file
3. **Consolidate types**: Move types to appropriate type files
4. **Use utilities**: Replace duplicate code with shared utilities
5. **Follow patterns**: Use the established patterns for new components

## Benefits

This structure provides:

- **Better maintainability**: Clear organization and separation of concerns
- **Improved performance**: Tree-shaking and lazy loading support
- **Enhanced developer experience**: Cleaner imports and better IDE support
- **Easier testing**: Isolated components and utilities
- **Scalability**: Easy to add new features without breaking existing code
- **Consistency**: Standardized patterns across the codebase

## Tools and Scripts

Consider adding these npm scripts to help maintain the structure:

```json
{
  "scripts": {
    "lint:imports": "eslint --rule 'import/no-relative-parent-imports: error'",
    "analyze:bundle": "npm run build && npx webpack-bundle-analyzer dist/static/js/*.js",
    "check:unused": "npx unimported",
    "check:duplicates": "npx jscpd src/"
  }
}
```