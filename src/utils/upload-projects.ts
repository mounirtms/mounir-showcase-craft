// Browser-based project upload utility
// This can be called from the admin dashboard or browser console

import { collection, addDoc, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { initialProjects } from "@/data/initial-projects";

export async function clearExistingProjects() {
  if (!db) {
    throw new Error("Firebase not initialized");
  }

  console.log('🗑️  Clearing existing projects...');
  const querySnapshot = await getDocs(collection(db, 'projects'));
  const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
  await Promise.all(deletePromises);
  console.log(`✅ Cleared ${querySnapshot.docs.length} existing projects`);
  return querySnapshot.docs.length;
}

export async function uploadProjectsToFirestore(clearFirst = false) {
  if (!db) {
    throw new Error("Firebase not initialized");
  }

  console.log('🚀 Starting project upload to Firebase Firestore...\n');

  try {
    // Optional: Clear existing projects
    if (clearFirst) {
      await clearExistingProjects();
    }

    console.log('📤 Uploading projects...');
    let successCount = 0;
    let errorCount = 0;

    for (const project of initialProjects) {
      try {
        const docRef = await addDoc(collection(db, 'projects'), {
          ...project,
          version: 1,
          createdAt: project.createdAt || Date.now(),
          updatedAt: project.updatedAt || Date.now()
        });
        
        console.log(`✅ Uploaded: ${project.title} (ID: ${docRef.id})`);
        successCount++;
      } catch (error: any) {
        console.error(`❌ Failed to upload: ${project.title}`, error.message);
        errorCount++;
      }
    }

    const summary = {
      success: successCount,
      errors: errorCount,
      total: initialProjects.length
    };

    console.log('\n📊 Upload Summary:');
    console.log(`✅ Successfully uploaded: ${successCount} projects`);
    console.log(`❌ Failed uploads: ${errorCount} projects`);
    console.log(`📁 Total projects: ${initialProjects.length}`);

    if (successCount > 0) {
      console.log('\n🎉 Projects successfully uploaded to Firebase Firestore!');
      console.log('🌐 You can now view them in your portfolio application.');
      console.log('🔧 Admin dashboard: /admin');
    }

    return summary;

  } catch (error: any) {
    console.error('💥 Upload failed:', error.message);
    throw error;
  }
}

// Function to upload projects from browser console
export function uploadProjectsFromConsole() {
  uploadProjectsToFirestore(false)
    .then((summary) => {
      console.log('🎉 Upload completed!', summary);
    })
    .catch((error) => {
      console.error('💥 Upload failed:', error);
    });
}

// Make it available globally for console access
if (typeof window !== 'undefined') {
  (window as any).uploadProjects = uploadProjectsFromConsole;
  (window as any).clearAndUploadProjects = () => uploadProjectsToFirestore(true);
}