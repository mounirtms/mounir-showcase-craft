import { z } from "zod";

// Project validation schema
export const ProjectSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().min(1, "Description is required").max(500, "Description must be less than 500 characters"),
  technologies: z.array(z.string()).min(1, "At least one technology is required"),
  githubUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  liveUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  featured: z.boolean().default(false),
  status: z.enum(["planning", "in-progress", "completed", "cancelled"]).default("planning"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  category: z.enum(["web", "mobile", "desktop", "api", "other"]).default("web"),
  imageUrl: z.string().optional(),
});

export type ProjectInput = z.infer<typeof ProjectSchema>;

// Skill validation schema
export const SkillSchema = z.object({
  name: z.string().min(1, "Skill name is required").max(50, "Skill name must be less than 50 characters"),
  category: z.enum(["frontend", "backend", "database", "devops", "design", "other"]),
  level: z.enum(["beginner", "intermediate", "advanced", "expert"]).default("intermediate"),
  yearsOfExperience: z.number().min(0, "Years of experience must be positive").max(50, "Years of experience must be realistic"),
  featured: z.boolean().default(false),
  visible: z.boolean().default(true),
  description: z.string().max(200, "Description must be less than 200 characters").optional(),
});

export type SkillInput = z.infer<typeof SkillSchema>;

// Skill category schema
export const SkillCategorySchema = z.enum(["frontend", "backend", "database", "devops", "design", "other"]);

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