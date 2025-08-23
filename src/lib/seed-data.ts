import { collection, addDoc, getDocs } from "firebase/firestore";
import { db, isFirebaseEnabled } from "@/lib/firebase";
import { initialProjects } from "@/data/initial-projects";
import { PROJECTS_COLLECTION } from "@/hooks/useProjects";

export async function seedInitialData() {
  if (!isFirebaseEnabled || !db) {
    console.log("Firebase not configured, skipping data seeding");
    return false;
  }

  try {
    // Check if projects already exist
    const projectsSnapshot = await getDocs(collection(db, PROJECTS_COLLECTION));
    
    if (projectsSnapshot.docs.length > 0) {
      console.log("Projects already exist, skipping seeding");
      return false;
    }

    console.log("🌱 Seeding initial project data...");
    
    // Add initial projects
    const promises = initialProjects.map(async (project) => {
      try {
        const docRef = await addDoc(collection(db, PROJECTS_COLLECTION), {
          ...project,
          createdAt: project.createdAt || Date.now(),
          updatedAt: project.updatedAt || Date.now(),
          version: project.version || 1
        });
        console.log(`✅ Added project: ${project.title} (${docRef.id})`);
        return docRef;
      } catch (error) {
        console.error(`❌ Failed to add project: ${project.title}`, error);
        return null;
      }
    });

    const results = await Promise.all(promises);
    const successCount = results.filter(Boolean).length;
    
    console.log(`🎉 Successfully seeded ${successCount}/${initialProjects.length} projects`);
    return true;
  } catch (error) {
    console.error("Failed to seed initial data:", error);
    return false;
  }
}