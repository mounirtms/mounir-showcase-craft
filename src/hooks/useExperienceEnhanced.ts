import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const EXPERIENCE_COLLECTION = 'work_experience';

export type EmploymentType = 'full-time' | 'part-time' | 'contract' | 'freelance' | 'internship';
export type WorkArrangement = 'remote' | 'hybrid' | 'onsite';

export interface WorkExperience {
  id: string;
  
  // Basic Information
  jobTitle: string;
  company: string;
  department?: string;
  location: string;
  workArrangement: WorkArrangement;
  
  // Employment Details
  employmentType: EmploymentType;
  startDate: string;
  endDate?: string; // null means current position
  isCurrent: boolean;
  
  // Job Description
  description: string;
  responsibilities: string[];
  achievements: string[];
  keyProjects?: string[];
  
  // Skills & Technologies
  technologiesUsed: string[];
  skillsGained?: string[];
  
  // Company Information
  companySize?: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  companyIndustry?: string;
  companyWebsite?: string;
  companyLogo?: string;
  
  // Performance & Recognition
  promotions?: {
    date: string;
    fromTitle: string;
    toTitle: string;
    reason?: string;
  }[];
  awards?: {
    title: string;
    date: string;
    description?: string;
  }[];
  
  // Team & Management
  teamSize?: number;
  directReports?: number;
  managementLevel?: 'individual' | 'team-lead' | 'manager' | 'senior-manager' | 'director' | 'vp' | 'c-level';
  
  // Financial Impact
  budgetManaged?: number;
  revenueImpact?: string;
  costSavings?: string;
  
  // References & Contacts
  supervisor?: {
    name: string;
    title: string;
    email?: string;
    phone?: string;
    linkedin?: string;
  };
  colleagues?: {
    name: string;
    title: string;
    email?: string;
    linkedin?: string;
  }[];
  
  // Additional Information
  reasonForLeaving?: string;
  wouldRecommend?: boolean;
  companyRating?: number; // 1-5
  workLifeBalance?: number; // 1-5
  learningOpportunities?: number; // 1-5
  
  // Portfolio Integration
  relatedProjects?: string[]; // Project IDs
  portfolioHighlight?: boolean;
  displayOrder?: number;
  
  // Metadata
  tags?: string[];
  notes?: string;
  createdAt: number;
  updatedAt: number;
  isVisible?: boolean;
}

export type WorkExperienceInput = Omit<WorkExperience, 'id' | 'createdAt' | 'updatedAt'>;

export const DEFAULT_WORK_EXPERIENCE: WorkExperienceInput = {
  jobTitle: '',
  company: '',
  location: '',
  workArrangement: 'remote',
  employmentType: 'full-time',
  startDate: '',
  isCurrent: false,
  description: '',
  responsibilities: [],
  achievements: [],
  technologiesUsed: [],
  portfolioHighlight: false,
  displayOrder: 0,
  isVisible: true,
  promotions: [],
  awards: [],
  colleagues: []
};

export function useExperienceEnhanced() {
  const [experiences, setExperiences] = useState<WorkExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, EXPERIENCE_COLLECTION),
      orderBy('displayOrder', 'desc'),
      orderBy('startDate', 'desc')
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const experienceData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as WorkExperience));
        
        setExperiences(experienceData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching experiences:', error);
        setError(error.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addExperience = async (experienceData: WorkExperienceInput): Promise<string | null> => {
    if (!db) return null;
    
    try {
      const docRef = await addDoc(collection(db, EXPERIENCE_COLLECTION), {
        ...experienceData,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding experience:', error);
      setError(error instanceof Error ? error.message : 'Failed to add experience');
      return null;
    }
  };

  const updateExperience = async (id: string, updates: Partial<WorkExperienceInput>): Promise<boolean> => {
    if (!db) return false;
    
    try {
      await updateDoc(doc(db, EXPERIENCE_COLLECTION, id), {
        ...updates,
        updatedAt: Date.now()
      });
      return true;
    } catch (error) {
      console.error('Error updating experience:', error);
      setError(error instanceof Error ? error.message : 'Failed to update experience');
      return false;
    }
  };

  const deleteExperience = async (id: string): Promise<boolean> => {
    if (!db) return false;
    
    try {
      await deleteDoc(doc(db, EXPERIENCE_COLLECTION, id));
      return true;
    } catch (error) {
      console.error('Error deleting experience:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete experience');
      return false;
    }
  };

  const getVisibleExperiences = () => {
    return experiences.filter(exp => exp.isVisible !== false);
  };

  const getHighlightedExperiences = () => {
    return experiences.filter(exp => exp.portfolioHighlight && exp.isVisible !== false);
  };

  const getCurrentPosition = () => {
    return experiences.find(exp => exp.isCurrent);
  };

  const getExperiencesByType = (type: EmploymentType) => {
    return experiences.filter(exp => exp.employmentType === type);
  };

  const getTotalExperienceYears = () => {
    let totalMonths = 0;
    
    experiences.forEach(exp => {
      const startDate = new Date(exp.startDate);
      const endDate = exp.endDate ? new Date(exp.endDate) : new Date();
      
      const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                    (endDate.getMonth() - startDate.getMonth());
      totalMonths += months;
    });
    
    return Math.round(totalMonths / 12 * 10) / 10; // Round to 1 decimal place
  };

  const getAllTechnologies = () => {
    const techSet = new Set<string>();
    experiences.forEach(exp => {
      exp.technologiesUsed?.forEach(tech => techSet.add(tech));
    });
    return Array.from(techSet).sort();
  };

  const getCareerProgression = () => {
    const sortedExperiences = [...experiences]
      .filter(exp => exp.startDate)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    
    return sortedExperiences.map((exp, index) => ({
      ...exp,
      progressionIndex: index,
      yearsFromStart: index === 0 ? 0 : 
        (new Date(exp.startDate).getTime() - new Date(sortedExperiences[0].startDate).getTime()) 
        / (1000 * 60 * 60 * 24 * 365.25)
    }));
  };

  const getStats = () => {
    const total = experiences.length;
    const current = experiences.filter(exp => exp.isCurrent).length;
    const highlighted = experiences.filter(exp => exp.portfolioHighlight).length;
    const companies = new Set(experiences.map(exp => exp.company)).size;
    const totalYears = getTotalExperienceYears();
    
    const byType = experiences.reduce((acc, exp) => {
      acc[exp.employmentType] = (acc[exp.employmentType] || 0) + 1;
      return acc;
    }, {} as Record<EmploymentType, number>);
    
    const byArrangement = experiences.reduce((acc, exp) => {
      acc[exp.workArrangement] = (acc[exp.workArrangement] || 0) + 1;
      return acc;
    }, {} as Record<WorkArrangement, number>);
    
    return {
      total,
      current,
      highlighted,
      companies,
      totalYears,
      byType,
      byArrangement
    };
  };

  return {
    experiences,
    loading,
    error,
    addExperience,
    updateExperience,
    deleteExperience,
    getVisibleExperiences,
    getHighlightedExperiences,
    getCurrentPosition,
    getExperiencesByType,
    getTotalExperienceYears,
    getAllTechnologies,
    getCareerProgression,
    getStats
  };
}
