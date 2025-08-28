import { z } from "zod";

// URL validation with more specific rules
const urlSchema = z.string()
  .refine(
    (val) => !val || val === "" || /^https?:\/\/.+/.test(val),
    { message: "Must be a valid URL starting with http:// or https://" }
  )
  .optional()
  .or(z.literal(""));

// GitHub URL validation
const githubUrlSchema = z.string()
  .refine(
    (val) => !val || val === "" || /^https:\/\/(www\.)?github\.com\/.+/.test(val),
    { message: "Must be a valid GitHub URL" }
  )
  .optional()
  .or(z.literal(""));

// Email validation
const emailSchema = z.string()
  .email("Must be a valid email address")
  .optional()
  .or(z.literal(""));

// Phone validation
const phoneSchema = z.string()
  .refine(
    (val) => !val || val === "" || /^[\+]?[1-9][\d]{0,15}$/.test(val.replace(/[\s\-\(\)]/g, "")),
    { message: "Must be a valid phone number" }
  )
  .optional()
  .or(z.literal(""));

// Date validation
const dateSchema = z.string()
  .refine(
    (val) => !val || val === "" || !isNaN(Date.parse(val)),
    { message: "Must be a valid date" }
  )
  .optional()
  .or(z.literal(""));

// Future date validation
const futureDateSchema = z.string()
  .refine(
    (val) => !val || val === "" || new Date(val) > new Date(),
    { message: "Date must be in the future" }
  )
  .optional()
  .or(z.literal(""));

// Non-empty array validation
const nonEmptyStringArray = z.array(z.string().min(1, "Item cannot be empty")).min(1, "At least one item is required");

// Optional string array with non-empty items
const optionalStringArray = z.array(z.string().min(1, "Item cannot be empty")).default([]);

// Client Info Schema with enhanced validation
export const ClientInfoSchema = z.object({
  name: z.string()
    .min(1, "Client name is required")
    .max(100, "Client name must be less than 100 characters")
    .optional(),
  industry: z.string()
    .max(50, "Industry must be less than 50 characters")
    .optional(),
  size: z.enum(["startup", "small", "medium", "large", "enterprise"], {
    errorMap: () => ({ message: "Please select a valid company size" })
  }).optional(),
  location: z.string()
    .max(100, "Location must be less than 100 characters")
    .optional(),
  website: urlSchema,
  email: emailSchema,
  phone: phoneSchema,
  isPublic: z.boolean().default(false),
  contactPerson: z.string()
    .max(100, "Contact person name must be less than 100 characters")
    .optional(),
  projectBudget: z.string()
    .max(50, "Budget information must be less than 50 characters")
    .optional(),
  testimonial: z.string()
    .max(500, "Testimonial must be less than 500 characters")
    .optional(),
});

// Project Metrics Schema with enhanced validation
export const ProjectMetricsSchema = z.object({
  usersReached: z.number()
    .int("Must be a whole number")
    .min(0, "Users reached cannot be negative")
    .max(1000000000, "Number seems unrealistic")
    .optional(),
  performanceImprovement: z.string()
    .max(200, "Performance improvement description must be less than 200 characters")
    .optional(),
  revenueImpact: z.string()
    .max(100, "Revenue impact must be less than 100 characters")
    .optional(),
  uptime: z.string()
    .refine(
      (val) => !val || /^\d{1,3}(\.\d{1,2})?%?$/.test(val),
      { message: "Uptime should be a percentage (e.g., 99.9% or 99.9)" }
    )
    .optional(),
  loadTime: z.string()
    .refine(
      (val) => !val || /^\d+(\.\d+)?(ms|s)$/.test(val),
      { message: "Load time should include units (e.g., 500ms or 2.5s)" }
    )
    .optional(),
  codeReduction: z.string()
    .max(100, "Code reduction description must be less than 100 characters")
    .optional(),
  securityImprovements: z.array(z.string().min(1, "Security improvement cannot be empty")).default([]),
  customMetrics: z.record(z.union([z.string(), z.number()])).default({}),
});

// Project validation schema with enhanced validation
export const ProjectSchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters")
    .refine(
      (val) => val.trim().length > 0,
      { message: "Title cannot be just whitespace" }
    ),
  description: z.string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters")
    .refine(
      (val) => val.trim().length >= 10,
      { message: "Description must contain meaningful content" }
    ),
  longDescription: z.string()
    .max(5000, "Long description must be less than 5000 characters")
    .optional(),
  category: z.enum([
    "Web Application", 
    "Mobile Application", 
    "Enterprise Integration", 
    "E-commerce", 
    "Machine Learning", 
    "API Development", 
    "DevOps & Infrastructure", 
    "Desktop Application",
    "Game Development",
    "Blockchain",
    "IoT",
    "Other"
  ], {
    errorMap: () => ({ message: "Please select a valid project category" })
  }),
  status: z.enum(["completed", "in-progress", "maintenance", "archived", "planned"], {
    errorMap: () => ({ message: "Please select a valid project status" })
  }).default("completed"),
  achievements: optionalStringArray,
  technologies: nonEmptyStringArray,
  tags: optionalStringArray,
  image: urlSchema,
  logo: urlSchema,
  icon: z.string().optional(),
  liveUrl: urlSchema,
  githubUrl: githubUrlSchema,
  demoUrl: urlSchema,
  caseStudyUrl: urlSchema,
  featured: z.boolean().default(false),
  disabled: z.boolean().default(false),
  priority: z.number()
    .int("Priority must be a whole number")
    .min(1, "Priority must be at least 1")
    .max(100, "Priority cannot exceed 100")
    .default(50),
  startDate: dateSchema,
  endDate: dateSchema,
  duration: z.string()
    .max(50, "Duration must be less than 50 characters")
    .optional(),
  clientInfo: ClientInfoSchema.optional(),
  metrics: ProjectMetricsSchema.optional(),
  challenges: optionalStringArray,
  solutions: optionalStringArray,
  teamSize: z.number()
    .int("Team size must be a whole number")
    .min(1, "Team size must be at least 1")
    .max(100, "Team size cannot exceed 100")
    .default(1),
  role: z.string()
    .min(1, "Role is required")
    .max(100, "Role must be less than 100 characters"),
  createdAt: z.number().positive("Created date must be valid"),
  updatedAt: z.number().positive("Updated date must be valid"),
  version: z.number().int().min(1).default(1),
}).refine(
  (data) => {
    // Validate date logic: end date should be after start date
    if (data.startDate && data.endDate) {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return end >= start;
    }
    return true;
  },
  {
    message: "End date must be after start date",
    path: ["endDate"]
  }
).refine(
  (data) => {
    // If project is completed, it should have an end date
    if (data.status === "completed" && data.startDate && !data.endDate) {
      return false;
    }
    return true;
  },
  {
    message: "Completed projects should have an end date",
    path: ["endDate"]
  }
).refine(
  (data) => {
    // Featured projects should have better descriptions
    if (data.featured && data.description.length < 50) {
      return false;
    }
    return true;
  },
  {
    message: "Featured projects should have detailed descriptions (at least 50 characters)",
    path: ["description"]
  }
);

export type ProjectInput = z.infer<typeof ProjectSchema>;

// Skill validation schema with enhanced validation
export const SkillSchema = z.object({
  name: z.string()
    .min(1, "Skill name is required")
    .max(50, "Skill name must be less than 50 characters")
    .refine(
      (val) => val.trim().length > 0,
      { message: "Skill name cannot be just whitespace" }
    )
    .refine(
      (val) => !/^\d+$/.test(val),
      { message: "Skill name cannot be just numbers" }
    ),
  category: z.enum([
    "Frontend Development", 
    "Backend Development", 
    "Database", 
    "Cloud & DevOps", 
    "Mobile Development", 
    "Machine Learning", 
    "AI & Data Science",
    "Cybersecurity",
    "Blockchain",
    "Game Development",
    "Design", 
    "Project Management", 
    "Languages", 
    "Tools", 
    "Other"
  ], {
    errorMap: () => ({ message: "Please select a valid skill category" })
  }),
  level: z.number()
    .int("Skill level must be a whole number")
    .min(1, "Skill level must be at least 1")
    .max(100, "Skill level cannot exceed 100")
    .refine(
      (val) => val % 5 === 0 || val >= 90,
      { message: "Skill level should be in increments of 5 (except for expert levels 90+)" }
    ),
  yearsOfExperience: z.number()
    .min(0, "Years of experience cannot be negative")
    .max(50, "Years of experience must be realistic (max 50 years)")
    .refine(
      (val) => val % 0.5 === 0,
      { message: "Years of experience should be in increments of 0.5" }
    ),
  description: z.string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  certifications: z.array(
    z.object({
      name: z.string().min(1, "Certificate name is required"),
      issuer: z.string().min(1, "Certificate issuer is required"),
      date: dateSchema,
      url: urlSchema,
      expiryDate: futureDateSchema,
    })
  ).default([]),
  projects: z.array(z.string().min(1, "Project reference cannot be empty")).default([]),
  icon: urlSchema,
  color: z.string()
    .refine(
      (val) => !val || /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(val),
      { message: "Color must be a valid hex color (e.g., #FF0000)" }
    )
    .optional(),
  featured: z.boolean().default(false),
  disabled: z.boolean().default(false),
  priority: z.number()
    .int("Priority must be a whole number")
    .min(1, "Priority must be at least 1")
    .max(100, "Priority cannot exceed 100")
    .default(50),
  tags: optionalStringArray,
  relatedSkills: z.array(z.string()).default([]),
  learningResources: z.array(
    z.object({
      title: z.string().min(1, "Resource title is required"),
      url: urlSchema,
      type: z.enum(["course", "book", "article", "video", "documentation", "other"]),
    })
  ).default([]),
  createdAt: z.number().positive("Created date must be valid"),
  updatedAt: z.number().positive("Updated date must be valid"),
}).refine(
  (data) => {
    // Validate skill level vs years of experience relationship
    const expectedMinLevel = Math.min(data.yearsOfExperience * 15, 90);
    if (data.level < expectedMinLevel && data.yearsOfExperience > 2) {
      return false;
    }
    return true;
  },
  {
    message: "Skill level seems low for the years of experience. Consider adjusting either value.",
    path: ["level"]
  }
).refine(
  (data) => {
    // Featured skills should have higher levels
    if (data.featured && data.level < 70) {
      return false;
    }
    return true;
  },
  {
    message: "Featured skills should have high proficiency levels (70+)",
    path: ["level"]
  }
).refine(
  (data) => {
    // Skills with high levels should have some experience or certifications
    if (data.level >= 80 && data.yearsOfExperience === 0 && data.certifications.length === 0) {
      return false;
    }
    return true;
  },
  {
    message: "High-level skills should be backed by experience or certifications",
    path: ["yearsOfExperience"]
  }
);

export type SkillInput = z.infer<typeof SkillSchema>;

// Skill category schema
export const SkillCategorySchema = z.enum(["Frontend Development", "Backend Development", "Database", "Cloud & DevOps", "Mobile Development", "Machine Learning", "Design", "Project Management", "Languages", "Tools", "Other"]);

// Enhanced validation functions with error handling
export const validateProjectUpdate = (data: unknown): { success: true; data: ProjectInput } | { success: false; errors: string[] } => {
  try {
    const validated = ProjectSchema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      return { success: false, errors };
    }
    return { success: false, errors: ['Unknown validation error'] };
  }
};

export const validateSkillUpdate = (data: unknown): { success: true; data: SkillInput } | { success: false; errors: string[] } => {
  try {
    const validated = SkillSchema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      return { success: false, errors };
    }
    return { success: false, errors: ['Unknown validation error'] };
  }
};

export const validateExperienceUpdate = (data: unknown): { success: true; data: ExperienceInput } | { success: false; errors: string[] } => {
  try {
    const validated = ExperienceSchema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      return { success: false, errors };
    }
    return { success: false, errors: ['Unknown validation error'] };
  }
};

// Form validation helpers
export const getFieldError = (errors: z.ZodError, fieldPath: string): string | undefined => {
  const error = errors.errors.find(err => err.path.join('.') === fieldPath);
  return error?.message;
};

export const hasFieldError = (errors: z.ZodError, fieldPath: string): boolean => {
  return errors.errors.some(err => err.path.join('.') === fieldPath);
};

// Partial validation for real-time form validation
export const validateProjectField = (field: string, value: unknown): string | null => {
  try {
    // Get the base schema from ZodEffects wrapper by accessing the innerType
    let baseSchema: any = ProjectSchema;
    while (baseSchema._def && baseSchema._def.innerType) {
      baseSchema = baseSchema._def.innerType;
    }
    
    const fieldSchema = baseSchema.shape?.[field];
    if (fieldSchema) {
      fieldSchema.parse(value);
    }
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors[0]?.message || 'Invalid value';
    }
    return 'Validation error';
  }
};

export const validateSkillField = (field: string, value: unknown): string | null => {
  try {
    // Get the base schema from ZodEffects wrapper by accessing the innerType
    let baseSchema: any = SkillSchema;
    while (baseSchema._def && baseSchema._def.innerType) {
      baseSchema = baseSchema._def.innerType;
    }
    
    const fieldSchema = baseSchema.shape?.[field];
    if (fieldSchema) {
      fieldSchema.parse(value);
    }
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors[0]?.message || 'Invalid value';
    }
    return 'Validation error';
  }
};

// Validation state helpers
export type ValidationState = 'idle' | 'validating' | 'valid' | 'invalid';

export interface FieldValidation {
  state: ValidationState;
  message?: string;
}

export const createFieldValidation = (state: ValidationState, message?: string): FieldValidation => ({
  state,
  message
});

// Bulk validation utilities
export const validateProjectBatch = (projects: unknown[]): {
  valid: ProjectInput[];
  invalid: { index: number; errors: string[] }[];
} => {
  const valid: ProjectInput[] = [];
  const invalid: { index: number; errors: string[] }[] = [];

  projects.forEach((project, index) => {
    const result = validateProjectUpdate(project);
    if (result.success) {
      valid.push(result.data);
    } else {
      invalid.push({ index, errors: result.errors });
    }
  });

  return { valid, invalid };
};

export const validateSkillBatch = (skills: unknown[]): {
  valid: SkillInput[];
  invalid: { index: number; errors: string[] }[];
} => {
  const valid: SkillInput[] = [];
  const invalid: { index: number; errors: string[] }[] = [];

  skills.forEach((skill, index) => {
    const result = validateSkillUpdate(skill);
    if (result.success) {
      valid.push(result.data);
    } else {
      invalid.push({ index, errors: result.errors });
    }
  });

  return { valid, invalid };
};

// Experience validation schema with enhanced validation
export const ExperienceSchema = z.object({
  company: z.string()
    .min(1, "Company name is required")
    .max(100, "Company name must be less than 100 characters")
    .refine(
      (val) => val.trim().length > 0,
      { message: "Company name cannot be just whitespace" }
    ),
  position: z.string()
    .min(1, "Position is required")
    .max(100, "Position must be less than 100 characters")
    .refine(
      (val) => val.trim().length > 0,
      { message: "Position cannot be just whitespace" }
    ),
  startDate: dateSchema.refine(
    (val) => val !== "",
    { message: "Start date is required" }
  ),
  endDate: dateSchema,
  current: z.boolean().default(false),
  description: z.string()
    .max(2000, "Description must be less than 2000 characters")
    .optional(),
  technologies: optionalStringArray,
  achievements: optionalStringArray,
  location: z.string()
    .max(100, "Location must be less than 100 characters")
    .optional(),
  employmentType: z.enum([
    "full-time", 
    "part-time", 
    "contract", 
    "freelance", 
    "internship", 
    "volunteer"
  ]).optional(),
  companySize: z.enum([
    "startup", 
    "small", 
    "medium", 
    "large", 
    "enterprise"
  ]).optional(),
  industry: z.string()
    .max(50, "Industry must be less than 50 characters")
    .optional(),
  website: urlSchema,
  salary: z.object({
    amount: z.number().positive().optional(),
    currency: z.string().length(3).optional(),
    period: z.enum(["hourly", "monthly", "yearly"]).optional(),
    isPublic: z.boolean().default(false),
  }).optional(),
}).refine(
  (data) => {
    // Validate date logic: end date should be after start date
    if (data.startDate && data.endDate && !data.current) {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return end >= start;
    }
    return true;
  },
  {
    message: "End date must be after start date",
    path: ["endDate"]
  }
).refine(
  (data) => {
    // Current positions shouldn't have end dates
    if (data.current && data.endDate) {
      return false;
    }
    return true;
  },
  {
    message: "Current positions should not have an end date",
    path: ["endDate"]
  }
).refine(
  (data) => {
    // Non-current positions should have end dates
    if (!data.current && data.startDate && !data.endDate) {
      return false;
    }
    return true;
  },
  {
    message: "Past positions should have an end date",
    path: ["endDate"]
  }
);

export type ExperienceInput = z.infer<typeof ExperienceSchema>;

