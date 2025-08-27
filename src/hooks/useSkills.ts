import { useState, useEffect, useMemo, useCallback } from "react";
import { collection, query, orderBy, onSnapshot, where, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db, isFirebaseEnabled } from "@/lib/firebase";
import { initialSkills } from "@/data/initial-skills";

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

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: number; // 1-100
  yearsOfExperience: number;
  description?: string;
  certifications?: string[];
  projects?: string[];
  icon?: string;
  color?: string;
  featured: boolean;
  disabled: boolean;
  priority: number;
  createdAt: number;
  updatedAt: number;
}

export type SkillInput = Omit<Skill, "id">;

export const SKILLS_COLLECTION = "skills";

export function useSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
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
      console.log('Using local skills data - Firebase disabled or offline');
      const localSkills: Skill[] = initialSkills.map((skill, index) => ({
        id: `local-skill-${index}`,
        ...skill
      }));
      setSkills(localSkills);
      setLoading(false);
      setError(null);
      return;
    }

    // Use Firebase in production
    const q = query(
      collection(db, SKILLS_COLLECTION),
      where("disabled", "==", false),
      orderBy("priority", "desc"),
      orderBy("level", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const skillsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Skill[];
        
        setSkills(skillsData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error fetching skills from Firebase:", err);
        const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
        setError(`Failed to load skills: ${errorMessage}. Showing local data instead.`);
        console.log('Falling back to local skills data');
        // Fallback to local data on Firebase error
        const localSkills: Skill[] = initialSkills.map((skill, index) => ({
          id: `fallback-skill-${index}`,
          ...skill
        }));
        setSkills(localSkills);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [isOnline]);

  const skillsByCategory = useMemo(() => {
    const grouped = skills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {} as Record<SkillCategory, Skill[]>);

    // Sort skills within each category by level
    Object.keys(grouped).forEach(category => {
      grouped[category as SkillCategory].sort((a, b) => b.level - a.level);
    });

    return grouped;
  }, [skills]);

  const featuredSkills = useMemo(() => 
    skills.filter(skill => skill.featured && !skill.disabled)
  , [skills]);

  // CRUD Operations
  const addSkill = useCallback(async (skillData: SkillInput) => {
    if (!isFirebaseEnabled || !db) {
      console.log("Firebase not enabled, cannot add skill");
      throw new Error("Firebase is not configured. Please check your environment settings.");
    }

    try {
      const docRef = await addDoc(collection(db, SKILLS_COLLECTION), {
        ...skillData,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding skill:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(`Failed to add skill: ${errorMessage}. Please try again.`);
    }
  }, []);

  const updateSkill = useCallback(async (id: string, updates: Partial<SkillInput>) => {
    if (!isFirebaseEnabled || !db) {
      console.log("Firebase not enabled, cannot update skill");
      throw new Error("Firebase is not configured. Please check your environment settings.");
    }

    // Check if this is a fallback/local ID that doesn't exist in Firebase
    if (id.startsWith('fallback-') || id.startsWith('local-')) {
      console.log("Cannot update local/fallback skill in Firebase. Please add as new skill.");
      throw new Error("Cannot update local/demo skill. Please create a new skill instead.");
    }

    try {
      await updateDoc(doc(db, SKILLS_COLLECTION, id), {
        ...updates,
        updatedAt: Date.now()
      });
    } catch (error) {
      console.error("Error updating skill:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      // Provide specific error guidance
      let userMessage = `Failed to update skill: ${errorMessage}. Please try again.`;
      if (errorMessage.includes('permission')) {
        userMessage = "You don't have permission to update this skill. Please check your access rights.";
      } else if (errorMessage.includes('network')) {
        userMessage = "Network error. Please check your internet connection and try again.";
      }
      throw new Error(userMessage);
    }
  }, []);

  const deleteSkill = useCallback(async (id: string) => {
    if (!isFirebaseEnabled || !db) {
      console.log("Firebase not enabled, cannot delete skill");
      throw new Error("Firebase is not configured. Please check your environment settings.");
    }

    // Check if this is a fallback/local ID that doesn't exist in Firebase
    if (id.startsWith('fallback-') || id.startsWith('local-')) {
      console.log("Cannot delete local/fallback skill from Firebase.");
      throw new Error("Cannot delete local/demo skill.");
    }

    try {
      await deleteDoc(doc(db, SKILLS_COLLECTION, id));
    } catch (error) {
      console.error("Error deleting skill:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      // Provide specific error guidance
      let userMessage = `Failed to delete skill: ${errorMessage}. Please try again.`;
      if (errorMessage.includes('permission')) {
        userMessage = "You don't have permission to delete this skill. Please check your access rights.";
      } else if (errorMessage.includes('network')) {
        userMessage = "Network error. Please check your internet connection and try again.";
      }
      throw new Error(userMessage);
    }
  }, []);

  const getStats = useCallback(() => {
    return {
      total: skills.length,
      featured: skills.filter(s => s.featured).length,
      categories: Object.keys(skillsByCategory).length,
      averageLevel: skills.length > 0 ? Math.round(skills.reduce((sum, s) => sum + s.level, 0) / skills.length) : 0
    };
  }, [skills, skillsByCategory]);

  return {
    skills,
    skillsByCategory,
    featuredSkills,
    loading,
    error,
    addSkill,
    updateSkill,
    deleteSkill,
    getStats
  };
}