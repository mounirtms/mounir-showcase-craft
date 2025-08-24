import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy,
  where,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const APPLICATIONS_COLLECTION = 'applications';

export type ApplicationStatus = 
  | 'applied' 
  | 'screening' 
  | 'interview' 
  | 'technical-test' 
  | 'final-interview' 
  | 'offer' 
  | 'rejected' 
  | 'withdrawn' 
  | 'accepted';

export type ApplicationPriority = 'low' | 'medium' | 'high' | 'urgent';

export type ContactMethod = 'email' | 'linkedin' | 'phone' | 'referral' | 'job-board' | 'company-website';

export interface Application {
  id: string;
  companyName: string;
  position: string;
  department?: string;
  jobDescription: string;
  requirements: string[];
  
  // Application Details
  applicationDate: string;
  applicationMethod: ContactMethod;
  jobBoardUrl?: string;
  referralContact?: string;
  
  // Status & Progress
  status: ApplicationStatus;
  priority: ApplicationPriority;
  
  // Company Information
  companyWebsite?: string;
  companySize?: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  companyIndustry?: string;
  companyLocation: string;
  workType: 'remote' | 'hybrid' | 'onsite';
  
  // Compensation
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  benefits?: string[];
  
  // Contact Information
  recruiterName?: string;
  recruiterEmail?: string;
  recruiterPhone?: string;
  recruiterLinkedin?: string;
  
  // Interview Process
  interviews?: {
    id: string;
    type: 'phone' | 'video' | 'in-person' | 'technical' | 'panel';
    date: string;
    time?: string;
    duration?: number; // minutes
    interviewer?: string;
    notes?: string;
    status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
    feedback?: string;
    rating?: number; // 1-5
  }[];
  
  // Tasks & Assignments
  technicalTests?: {
    id: string;
    title: string;
    description: string;
    dueDate?: string;
    submittedDate?: string;
    status: 'pending' | 'in-progress' | 'submitted' | 'reviewed';
    feedback?: string;
    githubUrl?: string;
    liveUrl?: string;
  }[];
  
  // Follow-ups & Timeline
  followUps?: {
    id: string;
    date: string;
    type: 'email' | 'call' | 'linkedin' | 'in-person';
    description: string;
    completed: boolean;
    response?: string;
  }[];
  
  // Notes & Research
  notes: string;
  companyResearch?: string;
  keyContacts?: {
    name: string;
    role: string;
    email?: string;
    linkedin?: string;
    notes?: string;
  }[];
  
  // Outcome
  rejectionReason?: string;
  offerDetails?: {
    salary: number;
    currency: string;
    startDate?: string;
    benefits: string[];
    negotiationNotes?: string;
  };
  
  // Metadata
  tags?: string[];
  createdAt: number;
  updatedAt: number;
  isArchived?: boolean;
}

export type ApplicationInput = Omit<Application, 'id' | 'createdAt' | 'updatedAt'>;

export const DEFAULT_APPLICATION: ApplicationInput = {
  companyName: '',
  position: '',
  jobDescription: '',
  requirements: [],
  applicationDate: new Date().toISOString().split('T')[0],
  applicationMethod: 'job-board',
  status: 'applied',
  priority: 'medium',
  companyLocation: '',
  workType: 'remote',
  notes: '',
  interviews: [],
  technicalTests: [],
  followUps: [],
  isArchived: false
};

export function useApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, APPLICATIONS_COLLECTION),
      where('isArchived', '==', false),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const applicationsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Application));
        
        setApplications(applicationsData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching applications:', error);
        setError(error.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addApplication = async (applicationData: ApplicationInput): Promise<string | null> => {
    if (!db) return null;
    
    try {
      const docRef = await addDoc(collection(db, APPLICATIONS_COLLECTION), {
        ...applicationData,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding application:', error);
      setError(error instanceof Error ? error.message : 'Failed to add application');
      return null;
    }
  };

  const updateApplication = async (id: string, updates: Partial<ApplicationInput>): Promise<boolean> => {
    if (!db) return false;
    
    try {
      await updateDoc(doc(db, APPLICATIONS_COLLECTION, id), {
        ...updates,
        updatedAt: Date.now()
      });
      return true;
    } catch (error) {
      console.error('Error updating application:', error);
      setError(error instanceof Error ? error.message : 'Failed to update application');
      return false;
    }
  };

  const deleteApplication = async (id: string): Promise<boolean> => {
    if (!db) return false;
    
    try {
      await deleteDoc(doc(db, APPLICATIONS_COLLECTION, id));
      return true;
    } catch (error) {
      console.error('Error deleting application:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete application');
      return false;
    }
  };

  const archiveApplication = async (id: string): Promise<boolean> => {
    return updateApplication(id, { isArchived: true });
  };

  const getApplicationsByStatus = (status: ApplicationStatus) => {
    return applications.filter(app => app.status === status);
  };

  const getApplicationsByPriority = (priority: ApplicationPriority) => {
    return applications.filter(app => app.priority === priority);
  };

  const getUpcomingInterviews = () => {
    const today = new Date();
    const upcoming: Array<{ application: Application; interview: Application['interviews'][0] }> = [];
    
    applications.forEach(app => {
      app.interviews?.forEach(interview => {
        const interviewDate = new Date(interview.date);
        if (interviewDate >= today && interview.status === 'scheduled') {
          upcoming.push({ application: app, interview });
        }
      });
    });
    
    return upcoming.sort((a, b) => 
      new Date(a.interview.date).getTime() - new Date(b.interview.date).getTime()
    );
  };

  const getStats = () => {
    const total = applications.length;
    const byStatus = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {} as Record<ApplicationStatus, number>);
    
    const byPriority = applications.reduce((acc, app) => {
      acc[app.priority] = (acc[app.priority] || 0) + 1;
      return acc;
    }, {} as Record<ApplicationPriority, number>);
    
    const pending = applications.filter(app => 
      !['rejected', 'withdrawn', 'accepted'].includes(app.status)
    ).length;
    
    const upcomingInterviews = getUpcomingInterviews().length;
    
    return {
      total,
      pending,
      upcomingInterviews,
      byStatus,
      byPriority
    };
  };

  return {
    applications,
    loading,
    error,
    addApplication,
    updateApplication,
    deleteApplication,
    archiveApplication,
    getApplicationsByStatus,
    getApplicationsByPriority,
    getUpcomingInterviews,
    getStats
  };
}
