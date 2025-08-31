/**
 * Core type definitions for the schema validation system
 */

import { z } from 'zod';

// Base schema metadata
export interface SchemaMetadata {
  version: number;
  createdAt: Date;
  updatedAt: Date;
  schemaVersion: string;
}

// Validation result types
export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: ValidationError[];
  warnings?: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: unknown;
}

export interface ValidationWarning {
  field: string;
  message: string;
  suggestion?: string;
}

// Schema validation context
export interface ValidationContext {
  strict?: boolean;
  skipOptional?: boolean;
  allowUnknown?: boolean;
  transformData?: boolean;
}

// Migration types
export interface MigrationStep {
  version: string;
  description: string;
  up: (data: unknown) => unknown;
  down: (data: unknown) => unknown;
  validate?: (data: unknown) => boolean;
}

export interface MigrationResult {
  success: boolean;
  fromVersion: string;
  toVersion: string;
  migratedData?: unknown;
  errors?: string[];
  warnings?: string[];
}

// Schema registry types
export interface SchemaDefinition<T = unknown> {
  name: string;
  version: string;
  schema: z.ZodSchema<T>;
  migrations: MigrationStep[];
  defaultValues: Partial<T>;
}

// Bulk validation types
export interface BulkValidationResult<T> {
  valid: T[];
  invalid: Array<{
    index: number;
    data: unknown;
    errors: ValidationError[];
  }>;
  summary: {
    total: number;
    validCount: number;
    invalidCount: number;
    processingTime: number;
  };
}

// Form validation types
export interface FieldValidationState {
  isValid: boolean;
  isDirty: boolean;
  isTouched: boolean;
  errors: string[];
  warnings: string[];
}

export interface FormValidationState {
  isValid: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
  fields: Record<string, FieldValidationState>;
  globalErrors: string[];
}

// Schema comparison types
export interface SchemaComparison {
  isCompatible: boolean;
  differences: SchemaDifference[];
  breakingChanges: BreakingChange[];
  recommendations: string[];
}

export interface SchemaDifference {
  type: 'added' | 'removed' | 'modified' | 'renamed';
  field: string;
  oldValue?: unknown;
  newValue?: unknown;
  impact: 'low' | 'medium' | 'high';
}

export interface BreakingChange {
  field: string;
  reason: string;
  migrationRequired: boolean;
  suggestion?: string;
}

// Performance monitoring types
export interface ValidationMetrics {
  validationTime: number;
  fieldCount: number;
  errorCount: number;
  warningCount: number;
  memoryUsage?: number;
}

// Common enums used across schemas
export enum ProjectStatus {
  PLANNING = 'planning',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  ON_HOLD = 'on-hold',
  CANCELLED = 'cancelled',
  MAINTENANCE = 'maintenance',
  ARCHIVED = 'archived'
}

export enum ProjectCategory {
  WEB_APPLICATION = 'web-application',
  MOBILE_APPLICATION = 'mobile-application',
  ENTERPRISE_INTEGRATION = 'enterprise-integration',
  E_COMMERCE = 'e-commerce',
  MACHINE_LEARNING = 'machine-learning',
  API_DEVELOPMENT = 'api-development',
  DEVOPS_INFRASTRUCTURE = 'devops-infrastructure',
  DESKTOP_APPLICATION = 'desktop-application',
  GAME_DEVELOPMENT = 'game-development',
  BLOCKCHAIN = 'blockchain',
  IOT = 'iot',
  OTHER = 'other'
}

export enum ProjectPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum SkillCategory {
  FRONTEND_DEVELOPMENT = 'frontend-development',
  BACKEND_DEVELOPMENT = 'backend-development',
  DATABASE = 'database',
  CLOUD_DEVOPS = 'cloud-devops',
  MOBILE_DEVELOPMENT = 'mobile-development',
  MACHINE_LEARNING = 'machine-learning',
  AI_DATA_SCIENCE = 'ai-data-science',
  CYBERSECURITY = 'cybersecurity',
  BLOCKCHAIN = 'blockchain',
  GAME_DEVELOPMENT = 'game-development',
  DESIGN = 'design',
  PROJECT_MANAGEMENT = 'project-management',
  LANGUAGES = 'languages',
  TOOLS = 'tools',
  OTHER = 'other'
}

export enum SkillLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;