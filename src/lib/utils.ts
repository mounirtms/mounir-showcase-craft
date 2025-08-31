/**
 * Core utility functions
 * Consolidated and deduplicated utilities
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Re-export shared utilities for convenience
export * from './shared';

/**
 * Combine class names with Tailwind CSS merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generate a unique ID
 */
export function generateId(prefix = 'id'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Check if code is running in browser
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}
