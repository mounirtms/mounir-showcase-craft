import { useEffect, useMemo, useState, useCallback } from "react";
import { db, isFirebaseEnabled } from "@/lib/firebase";
import { collection, onSnapshot, orderBy, query, where, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { initialProjects } from "@/data/initial-projects";

export type ProjectCategory = 
  | "Web Application"
  | "Mobile Application" 
  | "Enterprise Integration"
  | "E-commerce"
  | "Machine Learning"
  | "API Development"
  | "DevOps & Infrastructure"
  | "Other";

export type ProjectStatus = "completed" | "in-progress" | "maintenance" | "archived";

export interface ClientInfo {
  name: string;
  industry: string;
  size: "startup" | "small" | "medium" | "large" | "enterprise";
  location: string;
  website?: string;
  isPublic: boolean;
}

export interface ProjectMetrics {
  usersReached?: number;
  performanceImprovement?: string;
  revenueImpact?: string;
  uptime?: string;
  customMetrics?: Record<string, string | number>;
}

export interface ProjectInput {
  title: string;
  description: string;
  longDescription?: string;
  category: ProjectCategory;
  status: ProjectStatus;
  achievements: string[];
  technologies: string[];
  tags: string[];
  image?: string;
  logo?: string;
  icon?: string;
  liveUrl?: string;
  githubUrl?: string;
  demoUrl?: string;
  caseStudyUrl?: string;
  featured: boolean;
  disabled: boolean;
  priority: number;
  startDate?: string;
  endDate?: string;
  duration?: string;
  clientInfo?: ClientInfo;
  metrics?: ProjectMetrics;
  challenges?: string[];
  solutions?: string[];
  teamSize?: number;
  role?: string;
  createdAt: number;
  updatedAt: number;
  version?: number;
}

export interface Project extends ProjectInput {
  id: string;
}

export const PROJECTS_COLLECTION = "projects";

// Default project template
export const DEFAULT_PROJECT: Omit<ProjectInput, 'title' | 'description' | 'category'> = {
  longDescription: "",
  status: "completed",
  achievements: [],
  technologies: [],
  tags: [],
  image: "",
  logo: "",
  icon: "",
  liveUrl: "",
  githubUrl: "",
  demoUrl: "",
  caseStudyUrl: "",
  featured: false,
  disabled: false,
  priority: 50,
  startDate: "",
  endDate: "",
  duration: "",
  clientInfo: {
    name: "",
    industry: "",
    size: "medium",
    location: "",
    website: "",
    isPublic: true
  },
  metrics: {
    usersReached: 0,
    performanceImprovement: "",
    revenueImpact: "",
    uptime: "",
    customMetrics: {}
  },
  challenges: [],
  solutions: [],
  teamSize: 1,
  role: "Full-Stack Developer",
  createdAt: Date.now(),
  updatedAt: Date.now(),
  version: 1
};

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Update online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    // Use local data when Firebase is not enabled (development mode) or offline
    if (!isFirebaseEnabled || !db || !isOnline) {
      console.log('Using local project data - Firebase disabled or offline');
      const localProjects: Project[] = initialProjects.map((project, index) => ({
        id: `local-${index}`,
        ...project
      }));
      setProjects(localProjects);
      setLoading(false);
      setError(null);
      return;
    }

    // Use Firebase in production
    const q = query(
      collection(db, PROJECTS_COLLECTION),
      where("disabled", "==", false),
      orderBy("priority", "desc"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const projectsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Project[];
        
        setProjects(projectsData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error fetching projects from Firebase:", err);
        const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
        setError(`Failed to load projects: ${errorMessage}. Showing local data instead.`);
        console.log('Falling back to local project data');
        // Fallback to local data on Firebase error
        const localProjects: Project[] = initialProjects.map((project, index) => ({
          id: `fallback-${index}`,
          ...project
        }));
        setProjects(localProjects);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [isOnline]);

  const featured = useMemo(() => 
    projects.filter(project => project.featured && !project.disabled)
  , [projects]);

  const others = useMemo(() => 
    projects.filter(project => !project.featured && !project.disabled)
  , [projects]);

  return {
    projects,
    featured,
    others,
    loading,
    error
  };
}