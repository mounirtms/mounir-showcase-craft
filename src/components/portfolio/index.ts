// Portfolio components exports

// Task 15: Portfolio Frontend Enhancements
export { HeroSection } from "./HeroSection";
export type { HeroSectionProps } from "./HeroSection";

export { SkillVisualization } from "./SkillVisualization";
export { default as SkillVisualizationDemo } from "./SkillVisualizationDemo";
export type { 
  Skill, 
  SkillVisualizationProps 
} from "./SkillVisualization";

export { ProjectShowcase } from "./ProjectShowcase";
export { default as ProjectShowcaseDemo } from "./ProjectShowcaseDemo";
export type { 
  Project, 
  ProjectShowcaseProps 
} from "./ProjectShowcase";

export {
  ScrollAnimation,
  Parallax,
  StaggeredAnimation,
  ScrollProgress,
  useScrollAnimation,
  useParallax,
  useSmoothScroll,
  useScrollSpy,
  useInView,
  smoothScrollTo
} from "./ScrollAnimations";
export { default as ScrollAnimationsDemo } from "./ScrollAnimationsDemo";
export type {
  ScrollAnimationConfig,
  ParallaxConfig,
  ScrollAnimationProps,
  ParallaxProps,
  StaggeredAnimationProps,
  ScrollProgressProps
} from "./ScrollAnimations";

// Task 16: Portfolio Identity Components
export { ProfessionalAvatar } from "./ProfessionalAvatar";
export type { ProfessionalAvatarProps } from "./ProfessionalAvatar";

export { DynamicTypingEffect } from "./DynamicTypingEffect";
export type { DynamicTypingEffectProps } from "./DynamicTypingEffect";

export { TestimonialsCarousel } from "./TestimonialsCarousel";
export type { 
  TestimonialsCarouselProps,
  Testimonial 
} from "./TestimonialsCarousel";

export { InteractiveTimeline } from "./InteractiveTimeline";
export type { 
  InteractiveTimelineProps,
  TimelineItem 
} from "./InteractiveTimeline";

// Task 17: Portfolio Interactive Features
export { FilterableProjectGallery } from "./FilterableProjectGallery";
export type { 
  FilterableProjectGalleryProps,
  GalleryProject,
  LayoutType
} from "./FilterableProjectGallery";

export { ContactForm } from "./ContactForm";
export type { 
  ContactFormProps,
  ContactFormData
} from "./ContactForm";

export { ThemeToggle, ThemeCustomization } from "./ThemeToggle";
export type { 
  ThemeToggleProps,
  ThemeCustomizationProps
} from "./ThemeToggle";

export { InteractiveCodeSnippets } from "./InteractiveCodeSnippets";
export type { 
  InteractiveCodeSnippetsProps,
  CodeSnippetProps
} from "./InteractiveCodeSnippets";

// Task 19: Portfolio Animation Library
export {
  Animation,
  ScrollAnimation as LibraryScrollAnimation,
  Parallax as LibraryParallax,
  StaggeredAnimation as LibraryStaggeredAnimation,
  SequenceAnimation,
  MorphAnimation,
  useAnimation,
  useScrollAnimation as useLibraryScrollAnimation,
  useParallax as useLibraryParallax
} from "./AnimationLibrary";

// Task 18: Portfolio Performance Optimizations
export { LazyPortfolioLoader } from "./LazyPortfolioLoader";
export { OptimizedImage } from "./OptimizedImage";
export { PerformanceMonitor } from "./PerformanceMonitor";

// Task 15: Enhanced Portfolio Integration
export { EnhancedPortfolioIntegration } from "./EnhancedPortfolioIntegration";
export type { EnhancedPortfolioIntegrationProps } from "./EnhancedPortfolioIntegration";
export { default as AnimationLibraryDemo } from "./AnimationLibraryDemo";
export type {
  AnimationType,
  AnimationConfig,
  ScrollAnimationConfig,
  ParallaxConfig,
  AnimationProps,
  ScrollAnimationProps,
  ParallaxProps,
  StaggeredAnimationProps,
  SequenceAnimationProps,
  MorphAnimationProps
} from "./AnimationLibrary";