/**
 * Manual test to verify the schema validation system works
 */

import { validateProject, validateSkill } from './validators';
import { ProjectCategory, ProjectStatus, SkillCategory, SkillLevel } from './types';
import { legacyProjectTransformer } from './transformers';
import { MigrationUtils } from './migrations';

// Test basic project validation
console.log('🧪 Testing Project Validation...');

const testProject = {
  title: 'Test E-commerce Platform',
  description: 'A comprehensive e-commerce platform built with modern technologies, featuring user authentication, product catalog, shopping cart, and secure payment processing.',
  category: ProjectCategory.E_COMMERCE,
  status: ProjectStatus.COMPLETED,
  technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
  role: 'Full-Stack Developer',
  featured: true,
  teamSize: 3,
  startDate: new Date('2023-01-15'),
  endDate: new Date('2023-06-30'),
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

const projectResult = validateProject(testProject);
console.log('✅ Project validation result:', projectResult.success ? 'PASSED' : 'FAILED');
if (!projectResult.success) {
  console.log('❌ Errors:', projectResult.errors?.map(e => `${e.field}: ${e.message}`));
}

// Test basic skill validation
console.log('\n🧪 Testing Skill Validation...');

const testSkill = {
  name: 'React',
  category: SkillCategory.FRONTEND_DEVELOPMENT,
  level: SkillLevel.ADVANCED,
  proficiency: 85,
  experience: {
    years: 4,
    months: 6,
  },
  description: 'Extensive experience building complex React applications with hooks, context, and modern patterns.',
  featured: true,
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

const skillResult = validateSkill(testSkill);
console.log('✅ Skill validation result:', skillResult.success ? 'PASSED' : 'FAILED');
if (!skillResult.success) {
  console.log('❌ Errors:', skillResult.errors?.map(e => `${e.field}: ${e.message}`));
}

// Test legacy transformation
console.log('\n🧪 Testing Legacy Transformation...');

const legacyProject = {
  title: 'Legacy Project',
  description: 'This project uses the old data structure that needs to be migrated to the new schema format.',
  category: 'Web Application', // Old string format
  status: 'completed',
  technologies: ['React', 'Express'],
  image: 'https://example.com/old-image.jpg', // Single image field
  liveUrl: 'https://example.com/live',
  githubUrl: 'https://github.com/user/old-project',
  featured: true,
  priority: 75,
  startDate: '2022-01-01',
  endDate: '2022-06-01',
  role: 'Full-Stack Developer',
  createdAt: 1640995200000,
  updatedAt: 1656633600000,
};

try {
  const transformedProject = legacyProjectTransformer.transform(legacyProject);
  const transformedResult = validateProject(transformedProject);
  console.log('✅ Legacy transformation result:', transformedResult.success ? 'PASSED' : 'FAILED');
  if (transformedResult.success) {
    console.log('📋 Transformed features:');
    console.log('  - Images array:', transformedProject.images?.length || 0);
    console.log('  - Links array:', transformedProject.links?.length || 0);
    console.log('  - Schema version:', transformedProject.schemaVersion);
  } else {
    console.log('❌ Transformation errors:', transformedResult.errors?.map(e => `${e.field}: ${e.message}`));
  }
} catch (error) {
  console.log('❌ Transformation failed:', error);
}

// Test migration
console.log('\n🧪 Testing Auto Migration...');

const oldData = {
  title: 'Migration Test Project',
  description: 'This project will be auto-migrated to the latest schema version.',
  category: 'Web Application',
  technologies: ['jQuery', 'PHP'],
  image: 'https://example.com/legacy.jpg',
  liveUrl: 'https://example.com/legacy-live',
  featured: false,
  createdAt: 1577836800000, // 2020-01-01
};

MigrationUtils.autoMigrate(oldData, 'project', '1.0.0')
  .then(migrationResult => {
    console.log('✅ Auto migration result:', migrationResult.success ? 'PASSED' : 'FAILED');
    if (migrationResult.success) {
      console.log(`📈 Migrated from ${migrationResult.fromVersion} to ${migrationResult.toVersion}`);
      
      // Validate migrated data
      const validationResult = validateProject(migrationResult.migratedData);
      console.log('✅ Migrated data validation:', validationResult.success ? 'PASSED' : 'FAILED');
    } else {
      console.log('❌ Migration errors:', migrationResult.errors);
    }
  })
  .catch(error => {
    console.log('❌ Migration failed:', error);
  });

console.log('\n🎉 Schema validation system test completed!');

export { testProject, testSkill, legacyProject };