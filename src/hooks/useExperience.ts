import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot, where } from "firebase/firestore";
import { db, isFirebaseEnabled } from "@/lib/firebase";

export interface Experience {
  id: string;
  title: string;
  company: string;
  companyUrl?: string;
  companyLogo?: string;
  location: string;
  type: "full-time" | "part-time" | "contract" | "freelance" | "internship";
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  achievements: string[];
  technologies: string[];
  projects?: string[];
  skills: string[];
  responsibilities: string[];
  featured: boolean;
  disabled: boolean;
  priority: number;
  icon?: string;
  createdAt: number;
  updatedAt: number;
}

export type ExperienceInput = Omit<Experience, "id">;

export const EXPERIENCE_COLLECTION = "experiences";

export function useExperience() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseEnabled || !db) {
      setLoading(false);
      setError("Firebase not configured");
      return;
    }

    const q = query(
      collection(db, EXPERIENCE_COLLECTION),
      where("disabled", "==", false),
      orderBy("priority", "desc"),
      orderBy("startDate", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const experienceData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Experience[];
        
        setExperiences(experienceData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error fetching experience:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return {
    experiences,
    loading,
    error
  };
}