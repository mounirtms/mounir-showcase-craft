import { useEffect, useMemo, useState, useCallback } from "react";
import { db, isFirebaseEnabled } from "@/lib/firebase";
import { collection, getDocs, onSnapshot, orderBy, query, where } from "firebase/firestore";

export type Project = {
  id: string;
  title: string;
  description: string;
  category: string;
  achievements?: string[];
  technologies?: string[];
  image?: string;
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  disabled?: boolean;
  createdAt?: number;
};

export type ProjectInput = Omit<Project, "id">;

export const PROJECTS_COLLECTION = "projects";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseEnabled || !db) {
      setLoading(false);
      return;
    }

    try {
      const q = query(collection(db, PROJECTS_COLLECTION), orderBy("createdAt", "desc"));
      const unsub = onSnapshot(
        q,
        (snap) => {
          const items: Project[] = [];
          snap.forEach((doc) => {
            const data = doc.data() as any;
            items.push({ id: doc.id, ...data });
          });
          setProjects(items);
          setLoading(false);
        },
        (err) => {
          setError(err.message);
          setLoading(false);
        }
      );
      return () => unsub();
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
    }
  }, []);

  const visible = useMemo(() => projects.filter((p) => !p.disabled), [projects]);
  const featured = useMemo(() => visible.filter((p) => p.featured), [visible]);
  const others = useMemo(() => visible.filter((p) => !p.featured), [visible]);

  return { projects, visible, featured, others, loading, error };
}
