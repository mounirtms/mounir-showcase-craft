// Database Schema for Portfolio Projects
export interface ProjectSchema {
  // Core Information
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  category: ProjectCategory;
  
  // Technical Details
  technologies: string[];
  achievements: string[];
  challenges?: string[];
  solutions?: string[];
  
  // Media & Links
  image?: string;
  gallery?: string[];
  liveUrl?: string;
  githubUrl?: string;
  demoUrl?: string;
  caseStudyUrl?: string;
  
  // Project Metadata
  featured: boolean;
  disabled: boolean;
  priority: number; // For ordering (1 = highest priority)
  status: ProjectStatus;
  
  // Business Impact
  metrics?: ProjectMetrics;
  clientInfo?: ClientInfo;
  
  // Timeline
  startDate?: string; // ISO date string
  endDate?: string;   // ISO date string
  duration?: string;  // e.g., "3 months"
  
  // SEO & Content
  tags: string[];
  slug?: string;
  metaDescription?: string;
  
  // System Fields
  createdAt: number;
  updatedAt: number;
  createdBy?: string; // User ID
  version: number;
}

export type ProjectCategory = 
  | "Enterprise Integration"
  | "Web Application" 
  | "Mobile Application"
  | "Machine Learning"
  | "E-commerce"
  | "API Development"
  | "DevOps & Infrastructure"
  | "UI/UX Design"
  | "Consulting"
  | "Other";

export type ProjectStatus = 
  | "completed"
  | "in-progress" 
  | "maintenance"
  | "archived"
  | "concept";

export interface ProjectMetrics {
  usersReached?: number;
  performanceImprovement?: string; // e.g., "40% faster"
  costSavings?: string;
  revenueImpact?: string;
  uptime?: string; // e.g., "99.9%"
  customMetrics?: { [key: string]: string | number };
}

export interface ClientInfo {
  name?: string;
  industry?: string;
  size?: "startup" | "small" | "medium" | "enterprise";
  location?: string;
  testimonial?: string;
  logo?: string;
  website?: string;
  isPublic: boolean; // Whether client info can be displayed publicly
}

// Experience Schema
export interface ExperienceSchema {
  id: string;
  title: string;
  company: string;
  companyUrl?: string;
  companyLogo?: string;
  location: string;
  type: "full-time" | "part-time" | "contract" | "freelance" | "internship";
  startDate: string; // ISO date string
  endDate?: string;  // ISO date string, null if current
  current: boolean;
  
  description: string;
  achievements: string[];
  technologies: string[];
  projects?: string[]; // Project IDs related to this experience
  
  skills: string[];
  responsibilities: string[];
  
  featured: boolean;
  disabled: boolean;
  priority: number;
  
  createdAt: number;
  updatedAt: number;
}

// Skills Schema
export interface SkillSchema {
  id: string;
  name: string;
  category: SkillCategory;
  level: number; // 1-100
  yearsOfExperience: number;
  
  description?: string;
  certifications?: string[];
  projects?: string[]; // Project IDs where this skill was used
  
  icon?: string; // Icon name or URL
  color?: string; // Hex color for theming
  
  featured: boolean;
  disabled: boolean;
  priority: number;
  
  createdAt: number;
  updatedAt: number;
}

export type SkillCategory = 
  | "Frontend Development"
  | "Backend Development"
  | "Database"
  | "Cloud & DevOps"
  | "Mobile Development"
  | "Machine Learning"
  | "Design"
  | "Project Management"
  | "Languages"
  | "Tools"
  | "Other";

// Testimonials Schema
export interface TestimonialSchema {
  id: string;
  clientName: string;
  clientTitle: string;
  clientCompany: string;
  clientPhoto?: string;
  
  content: string;
  rating: number; // 1-5
  
  projectId?: string; // Related project
  experienceId?: string; // Related experience
  
  featured: boolean;
  disabled: boolean;
  priority: number;
  
  createdAt: number;
  updatedAt: number;
}

// Blog Posts Schema (for future expansion)
export interface BlogPostSchema {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  
  featuredImage?: string;
  tags: string[];
  category: string;
  
  published: boolean;
  featured: boolean;
  
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  
  readTime: number; // in minutes
  views: number;
  likes: number;
  
  createdAt: number;
  updatedAt: number;
  publishedAt?: number;
}

// Analytics Schema
export interface AnalyticsSchema {
  id: string;
  type: "page_view" | "project_view" | "contact_form" | "cv_download" | "link_click";
  
  metadata: {
    page?: string;
    projectId?: string;
    referrer?: string;
    userAgent?: string;
    country?: string;
    device?: string;
    [key: string]: any;
  };
  
  timestamp: number;
  sessionId?: string;
  userId?: string;
}

// Firestore Collections
export const COLLECTIONS = {
  PROJECTS: "projects",
  EXPERIENCES: "experiences", 
  SKILLS: "skills",
  TESTIMONIALS: "testimonials",
  BLOG_POSTS: "blog_posts",
  ANALYTICS: "analytics",
  USERS: "users", // For admin users
} as const;

// Default values for new projects
export const DEFAULT_PROJECT: Partial<ProjectSchema> = {
  featured: false,
  disabled: false,
  priority: 50,
  status: "completed",
  technologies: [],
  achievements: [],
  tags: [],
  version: 1,
  createdAt: Date.now(),
  updatedAt: Date.now(),
};