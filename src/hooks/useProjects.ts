import { useEffect, useMemo, useState, useCallback } from "react";
import { db, isFirebaseEnabled } from "@/lib/firebase";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
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

// Import types from main type file to avoid conflicts
import type { Project as MainProject, ProjectInput as MainProjectInput } from '@/types/project';

export type Project = MainProject;
export type ProjectInput = MainProjectInput;

export const PROJECTS_COLLECTION = "projects";

// Default project template matching main Project interface
export const DEFAULT_PROJECT: Omit<ProjectInput, 'title' | 'description' | 'category'> = {
  role: "Full-Stack Developer",
  technologies: [],
  status: "completed",
  priority: 50,
  startDate: "",
  endDate: "",
  githubUrl: "",
  liveUrl: "",
  images: [],
  achievements: [],
  challenges: [],
  lessons: [],
  collaborators: [],
  featured: false
};

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isOnline = useOnlineStatus();

  const setupFirebaseListener = useCallback(() => {
    let unsubscribe: (() => void) | undefined;
    let retryTimeout: NodeJS.Timeout;
    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 2000; // 2 seconds

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

    // Enhanced Firebase query with better error handling
    try {
      const q = query(
        collection(db, PROJECTS_COLLECTION),
        where("disabled", "==", false),
        orderBy("priority", "desc"),
        orderBy("createdAt", "desc")
      );

      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          try {
            const projectsData = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            })) as Project[];
            
            // Validate and sanitize data
            const validProjects = projectsData.filter(project => 
              project.title && project.description && project.category
            );
            
            setProjects(validProjects);
            setLoading(false);
            setError(null);
            retryCount = 0; // Reset retry count on success
            console.log(`✅ Loaded ${validProjects.length} projects from Firebase`);
          } catch (processingError) {
            console.error("Error processing Firebase data:", processingError);
            setError("Error processing project data");
          }
        },
        (err) => {
          console.error("Firebase listener error:", err);
          const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
          
          // Implement retry logic for transient errors
          if (retryCount < maxRetries && (
            errorMessage.includes('network') || 
            errorMessage.includes('timeout') ||
            errorMessage.includes('unavailable')
          )) {
            retryCount++;
            console.log(`🔄 Retrying Firebase connection (attempt ${retryCount}/${maxRetries})`);
            retryTimeout = setTimeout(() => {
              setupFirebaseListener();
            }, retryDelay * retryCount); // Exponential backoff
            return;
          }
          
          setError(`Failed to load projects: ${errorMessage}. Showing local data instead.`);
          console.log('Falling back to local project data due to Firebase error');
          
          // Fallback to local data on Firebase error
          const localProjects: Project[] = initialProjects.map((project, index) => ({
            id: `fallback-${index}`,
            ...project
          }));
          setProjects(localProjects);
          setLoading(false);
        }
      );
    } catch (setupError) {
      console.error("Error setting up Firebase listener:", setupError);
      setError("Failed to initialize data connection");
      // Fallback to local data
      const localProjects: Project[] = initialProjects.map((project, index) => ({
        id: `setup-fallback-${index}`,
        ...project
      }));
      setProjects(localProjects);
      setLoading(false);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [isOnline]);

  useEffect(() => {
    const cleanup = setupFirebaseListener();
    return cleanup;
  }, [setupFirebaseListener]);

  const featured = useMemo(() => 
    projects.filter(project => project.featured && !project.disabled)
  , [projects]);

  const others = useMemo(() => 
    projects.filter(project => !project.featured && !project.disabled)
  , [projects]);

  // CRUD Operations with enhanced error handling
  const addProject = useCallback(async (projectData: ProjectInput) => {
    if (!isFirebaseEnabled || !db) {
      console.log("Firebase not enabled, cannot add project");
      throw new Error("Firebase is not configured. Please check your environment settings.");
    }

    try {
      const docRef = await addDoc(collection(db, PROJECTS_COLLECTION), {
        ...projectData,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        version: 1
      });
      console.log(`✅ Project added to Firebase with ID: ${docRef.id}`);
      return docRef.id;
    } catch (error) {
      console.error("Error adding project:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(`Failed to add project: ${errorMessage}. Please try again.`);
    }
  }, []);

  const updateProject = useCallback(async (id: string, updates: Partial<ProjectInput>) => {
    if (!isFirebaseEnabled || !db) {
      console.log("Firebase not enabled, cannot update project");
      throw new Error("Firebase is not configured. Please check your environment settings.");
    }

    // Check if this is a fallback/local ID that doesn't exist in Firebase
    if (id.startsWith('fallback-') || id.startsWith('local-') || id.startsWith('setup-fallback-')) {
      console.log("Cannot update local/fallback project in Firebase. Please add as new project.");
      throw new Error("Cannot update local/demo project. Please create a new project instead.");
    }

    try {
      await updateDoc(doc(db, PROJECTS_COLLECTION, id), {
        ...updates,
        updatedAt: Date.now(),
        version: (updates.version || 1) + 1
      });
      console.log(`✅ Project ${id} updated in Firebase`);
    } catch (error) {
      console.error("Error updating project:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      // Provide specific error guidance
      let userMessage = `Failed to update project: ${errorMessage}. Please try again.`;
      if (errorMessage.includes('permission')) {
        userMessage = "You don't have permission to update this project. Please check your access rights.";
      } else if (errorMessage.includes('network')) {
        userMessage = "Network error. Please check your internet connection and try again.";
      } else if (errorMessage.includes('not-found')) {
        userMessage = "Project not found. It may have been deleted.";
      }
      throw new Error(userMessage);
    }
  }, []);

  const deleteProject = useCallback(async (id: string) => {
    if (!isFirebaseEnabled || !db) {
      console.log("Firebase not enabled, cannot delete project");
      throw new Error("Firebase is not configured. Please check your environment settings.");
    }

    // Check if this is a fallback/local ID that doesn't exist in Firebase
    if (id.startsWith('fallback-') || id.startsWith('local-') || id.startsWith('setup-fallback-')) {
      console.log("Cannot delete local/fallback project from Firebase.");
      throw new Error("Cannot delete local/demo project.");
    }

    try {
      await deleteDoc(doc(db, PROJECTS_COLLECTION, id));
      console.log(`✅ Project ${id} deleted from Firebase`);
    } catch (error) {
      console.error("Error deleting project:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      // Provide specific error guidance
      let userMessage = `Failed to delete project: ${errorMessage}. Please try again.`;
      if (errorMessage.includes('permission')) {
        userMessage = "You don't have permission to delete this project. Please check your access rights.";
      } else if (errorMessage.includes('network')) {
        userMessage = "Network error. Please check your internet connection and try again.";
      } else if (errorMessage.includes('not-found')) {
        userMessage = "Project not found. It may have already been deleted.";
      }
      throw new Error(userMessage);
    }
  }, []);

  return {
    projects,
    featured,
    others,
    loading,
    error,
    addProject,
    updateProject,
    deleteProject,
    isOnline,
    refetch: setupFirebaseListener,
  };
}
