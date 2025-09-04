export interface SkillExperience {
  years: number;
  months: number;
  firstUsed?: Date;
  lastUsed?: Date;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  proficiency: number;
  experience?: SkillExperience;
  featured?: boolean;
  description?: string;
  icon?: string;
  color?: string;
  tags?: string[];
  visibility?: 'public' | 'private';
  isVerified?: boolean;
  yearsOfExperience?: number;
  certifications?: string[];
  projects?: string[];
  priority?: number;
  createdAt: number;
  updatedAt: number;
  disabled?: boolean;
}

export interface SkillInput {
  name: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  proficiency: number;
  experience: SkillExperience;
  featured: boolean;
  description?: string;
  icon?: string;
  color?: string;
  tags: string[];
  visibility: 'public' | 'private';
  isVerified?: boolean;
  yearsOfExperience?: number;
  certifications?: string[];
  projects?: string[];
}
