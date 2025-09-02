/**
 * Section Components Index
 * Centralized exports for all section components
 */

export { Hero as HeroSection } from './hero';
export { Skills as SkillsSection } from './skills';
export { Projects as ProjectsSection } from './projects';
export { Experience as ExperienceSection } from './experience';

// Types
export type { HeroProps as HeroSectionProps } from './hero';
// Note: The Skills component does not have props, so no type is exported.
export type { ProjectsProps as ProjectsSectionProps } from './projects';
export type { ExperienceProps as ExperienceSectionProps } from './experience';

// Default exports for lazy loading, now compatible with React.lazy
export default {
  Hero: () => import('./hero').then(m => ({ default: m.Hero })),
  Skills: () => import('./skills').then(m => ({ default: m.Skills })),
  Projects: () => import('./projects').then(m => ({ default: m.Projects })),
  Experience: () => import('./experience').then(m => ({ default: m.Experience })),
};