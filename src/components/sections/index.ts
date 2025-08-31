/**
 * Section Components Index
 * Centralized exports for all section components
 */

export { default as HeroSection } from './hero';
export { default as SkillsSection } from './skills';
export { default as ProjectsSection } from './projects';
export { default as ExperienceSection } from './experience';

// Types
export type { HeroSectionProps } from './hero';
export type { SkillsSectionProps } from './skills';
export type { ProjectsSectionProps } from './projects';
export type { ExperienceSectionProps } from './experience';

// Default exports for lazy loading
export default {
  Hero: () => import('./hero'),
  Skills: () => import('./skills'),
  Projects: () => import('./projects'),
  Experience: () => import('./experience'),
};