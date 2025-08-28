import { z } from "zod";

// Client Info Schema
export const ClientInfoSchema = z.object({
  name: z.string().optional(),
  industry: z.string().optional(),
  size: z.enum(["startup", "small", "medium", "large", "enterprise"]).optional(),
  location: z.string().optional(),
  website: z.string().optional(),
  isPublic: z.boolean().default(false),
});

// Project Metrics Schema
export const ProjectMetricsSchema = z.object({
  usersReached: z.number().optional(),
  performanceImprovement: z.string().optional(),
  revenueImpact: z.string().optional(),
  uptime: z.string().optional(),
  customMetrics: z.record(z.union([z.string(), z.number()])).optional(),
});

// Project validation schema
export const ProjectSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().min(1, "Description is required").max(500, "Description must be less than 500 characters"),
  longDescription: z.string().optional(),
  category: z.enum(["Web Application", "Mobile Application", "Enterprise Integration", "E-commerce", "Machine Learning", "API Development", "DevOps & Infrastructure", "Other"]),
  status: z.enum(["completed", "in-progress", "maintenance", "archived"]).default("completed"),
  achievements: z.array(z.string()).default([]),
  technologies: z.array(z.string()).min(1, "At least one technology is required"),
  tags: z.array(z.string()).default([]),
  image: z.string().optional(),
  logo: z.string().optional(),
  icon: z.string().optional(),
  liveUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  githubUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  demoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  caseStudyUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  featured: z.boolean().default(false),
  disabled: z.boolean().default(false),
  priority: z.number().min(1).max(100).default(50),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  duration: z.string().optional(),
  clientInfo: ClientInfoSchema.optional(),
  metrics: ProjectMetricsSchema.optional(),
  challenges: z.array(z.string()).default([]),
  solutions: z.array(z.string()).default([]),
  teamSize: z.number().min(1).default(1),
  role: z.string().min(1, "Role is required"),
  createdAt: z.number(),
  updatedAt: z.number(),
  version: z.number().default(1),
});

export type ProjectInput = z.infer<typeof ProjectSchema>;

// Skill validation schema
export const SkillSchema = z.object({
  name: z.string().min(1, "Skill name is required").max(50, "Skill name must be less than 50 characters"),
  category: z.enum(["Frontend Development", "Backend Development", "Database", "Cloud & DevOps", "Mobile Development", "Machine Learning", "Design", "Project Management", "Languages", "Tools", "Other"]),
  level: z.number().min(1).max(100),
  yearsOfExperience: z.number().min(0, "Years of experience must be positive").max(50, "Years of experience must be realistic"),
  description: z.string().max(200, "Description must be less than 200 characters").optional(),
  certifications: z.array(z.string()).default([]),
  projects: z.array(z.string()).default([]),
  icon: z.string().optional(),
  color: z.string().optional(),
  featured: z.boolean().default(false),
  disabled: z.boolean().default(false),
  priority: z.number().min(1).max(100).default(50),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export type SkillInput = z.infer<typeof SkillSchema>;

// Skill category schema
export const SkillCategorySchema = z.enum(["Frontend Development", "Backend Development", "Database", "Cloud & DevOps", "Mobile Development", "Machine Learning", "Design", "Project Management", "Languages", "Tools", "Other"]);

// Validation functions
export const validateProjectUpdate = (data: unknown): ProjectInput => {
  return ProjectSchema.parse(data);
};

export const validateSkillUpdate = (data: unknown): SkillInput => {
  return SkillSchema.parse(data);
};

// Experience validation schema
export const ExperienceSchema = z.object({
  company: z.string().min(1, "Company name is required").max(100, "Company name must be less than 100 characters"),
  position: z.string().min(1, "Position is required").max(100, "Position must be less than 100 characters"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  description: z.string().max(1000, "Description must be less than 1000 characters").optional(),
  technologies: z.array(z.string()).default([]),
  location: z.string().max(100, "Location must be less than 100 characters").optional(),
});

export type ExperienceInput = z.infer<typeof ExperienceSchema>;

export const validateExperienceUpdate = (data: unknown): ExperienceInput => {
  return ExperienceSchema.parse(data);
};