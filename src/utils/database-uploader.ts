// Comprehensive database uploader for all portfolio data
import { collection, addDoc, getDocs, deleteDoc, setDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import seedData from "@/data/database-seed.json";

export interface UploadProgress {
  collection: string;
  current: number;
  total: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}

export interface UploadResult {
  collection: string;
  success: number;
  errors: number;
  total: number;
  details: string[];
}

export class DatabaseUploader {
  private onProgress?: (progress: UploadProgress[]) => void;

  constructor(onProgress?: (progress: UploadProgress[]) => void) {
    this.onProgress = onProgress;
  }

  async clearCollection(collectionName: string): Promise<number> {
    if (!db) throw new Error("Firebase not initialized");

    const querySnapshot = await getDocs(collection(db, collectionName));
    const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    return querySnapshot.docs.length;
  }

  async uploadCollection(
    collectionName: string, 
    data: any[], 
    clearFirst = false
  ): Promise<UploadResult> {
    if (!db) throw new Error("Firebase not initialized");

    const result: UploadResult = {
      collection: collectionName,
      success: 0,
      errors: 0,
      total: data.length,
      details: []
    };

    try {
      // Clear existing data if requested
      if (clearFirst) {
        const clearedCount = await this.clearCollection(collectionName);
        result.details.push(`Cleared ${clearedCount} existing items`);
      }

      // Upload new data
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        
        // Update progress
        this.onProgress?.([{
          collection: collectionName,
          current: i + 1,
          total: data.length,
          status: 'uploading'
        }]);

        try {
          const docData = {
            ...item,
            createdAt: item.createdAt || Date.now(),
            updatedAt: item.updatedAt || Date.now(),
            version: item.version || 1
          };

          const docRef = await addDoc(collection(db, collectionName), docData);
          result.success++;
          result.details.push(`✅ ${item.title || item.name || `Item ${i + 1}`} (${docRef.id})`);
        } catch (error: any) {
          result.errors++;
          result.details.push(`❌ ${item.title || item.name || `Item ${i + 1}`}: ${error.message}`);
        }
      }

      // Final progress update
      this.onProgress?.([{
        collection: collectionName,
        current: data.length,
        total: data.length,
        status: result.errors > 0 ? 'error' : 'completed'
      }]);

    } catch (error: any) {
      result.details.push(`💥 Collection upload failed: ${error.message}`);
      this.onProgress?.([{
        collection: collectionName,
        current: 0,
        total: data.length,
        status: 'error',
        error: error.message
      }]);
    }

    return result;
  }

  async uploadAllData(clearFirst = false): Promise<UploadResult[]> {
    const results: UploadResult[] = [];
    const collections = [
      { name: 'projects', data: seedData.projects },
      { name: 'experiences', data: seedData.experiences },
      { name: 'skills', data: seedData.skills },
      { name: 'testimonials', data: seedData.testimonials },
      { name: 'certifications', data: seedData.certifications },
      { name: 'education', data: seedData.education },
      { name: 'services', data: seedData.services }
    ];

    for (const { name, data } of collections) {
      console.log(`📤 Uploading ${name}...`);
      const result = await this.uploadCollection(name, data, clearFirst);
      results.push(result);
      console.log(`${result.success > 0 ? '✅' : '❌'} ${name}: ${result.success}/${result.total} uploaded`);
    }

    // Upload personal info as a single document
    try {
      await setDoc(doc(db, 'settings', 'personalInfo'), {
        ...seedData.personalInfo,
        updatedAt: Date.now()
      });
      console.log('✅ Personal info uploaded');
    } catch (error: any) {
      console.error('❌ Personal info upload failed:', error.message);
    }

    // Initialize analytics
    try {
      await setDoc(doc(db, 'analytics', 'stats'), {
        ...seedData.analytics,
        lastUpdated: Date.now()
      });
      console.log('✅ Analytics initialized');
    } catch (error: any) {
      console.error('❌ Analytics initialization failed:', error.message);
    }

    return results;
  }
}

// Convenience functions for browser console
export async function uploadAllPortfolioData(clearFirst = false) {
  const uploader = new DatabaseUploader((progress) => {
    console.log('📊 Progress:', progress);
  });

  console.log('🚀 Starting comprehensive portfolio data upload...\n');
  
  try {
    const results = await uploader.uploadAllData(clearFirst);
    
    console.log('\n📊 UPLOAD SUMMARY:');
    console.log('═'.repeat(50));
    
    let totalSuccess = 0;
    let totalErrors = 0;
    let totalItems = 0;

    results.forEach(result => {
      totalSuccess += result.success;
      totalErrors += result.errors;
      totalItems += result.total;
      
      console.log(`📁 ${result.collection.toUpperCase()}:`);
      console.log(`   ✅ Success: ${result.success}`);
      console.log(`   ❌ Errors: ${result.errors}`);
      console.log(`   📊 Total: ${result.total}`);
      console.log('');
    });

    console.log('🎯 OVERALL SUMMARY:');
    console.log(`   ✅ Total Success: ${totalSuccess}`);
    console.log(`   ❌ Total Errors: ${totalErrors}`);
    console.log(`   📊 Total Items: ${totalItems}`);
    console.log(`   📈 Success Rate: ${((totalSuccess / totalItems) * 100).toFixed(1)}%`);

    if (totalErrors === 0) {
      console.log('\n🎉 ALL DATA UPLOADED SUCCESSFULLY!');
      console.log('🌐 Your portfolio is now fully populated with comprehensive data.');
      console.log('🔧 Visit /admin to manage your content.');
    } else {
      console.log('\n⚠️  Upload completed with some errors.');
      console.log('🔍 Check the details above for specific error information.');
    }

    return results;
  } catch (error: any) {
    console.error('💥 Upload failed:', error.message);
    throw error;
  }
}

export async function uploadProjectsOnly(clearFirst = false) {
  const uploader = new DatabaseUploader();
  return await uploader.uploadCollection('projects', seedData.projects, clearFirst);
}

export async function uploadSkillsOnly(clearFirst = false) {
  const uploader = new DatabaseUploader();
  return await uploader.uploadCollection('skills', seedData.skills, clearFirst);
}

export async function uploadExperienceOnly(clearFirst = false) {
  const uploader = new DatabaseUploader();
  return await uploader.uploadCollection('experiences', seedData.experiences, clearFirst);
}

// Make functions available globally for console access
if (typeof window !== 'undefined') {
  (window as any).uploadAllPortfolioData = uploadAllPortfolioData;
  (window as any).uploadProjectsOnly = uploadProjectsOnly;
  (window as any).uploadSkillsOnly = uploadSkillsOnly;
  (window as any).uploadExperienceOnly = uploadExperienceOnly;
  (window as any).clearAndUploadAll = () => uploadAllPortfolioData(true);
}