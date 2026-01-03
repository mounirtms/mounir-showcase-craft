export interface Experience {
  id: string;
  title: string;
  company: string;
  description: string;
  startDate: string;
  endDate?: string;
  location?: string;
  technologies?: string[];
  achievements?: string[];
  responsibilities?: string[];
  createdAt: number;
  updatedAt: number;
  disabled?: boolean;
}

export interface ExperienceInput {
  title: string;
  company: string;
  description: string;
  startDate: string;
  endDate?: string;
  location?: string;
  technologies?: string[];
  achievements?: string[];
  responsibilities?: string[];
}
