/**
 * Examples demonstrating how to use the schema validation system
 */

import {
  validateProject,
  validateProjectCreate,
  validateSkill,
  validateSkillCreate,
  validateProjectsBulk,
} from './validators';
import { legacyProjectTransformer, legacySkillTransformer } from './transformers';
import { MigrationUtils } from './migrations';
import { ProjectCategory, ProjectStatus, SkillCategory, SkillLevel } from './types';

/**
 * Example 1: Basic project validation
 */
export function exampleBasicProjectValidation() {
  const projectData = {
    title: 'E-commerce Platform',
    description: 'A comprehensive e-commerce platform built with React and Node.js, featuring user authentication, product catalog, shopping cart, and payment processing.',
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

  const result = validateProject(projectData);
  
  if (result.success) {
    console.log('✅ Project validation successful:', result.data);
  } else {
    console.log('❌ Project validation failed:', result.errors);
  }

  return result;
}

/**
 * Example 2: Creating a new project with validation
 */
export function exampleCreateProject() {
  const newProjectData = {
    title: 'Portfolio Website',
    description: 'A modern, responsive portfolio website showcasing my projects and skills with smooth animations and dark mode support.',
    category: ProjectCategory.WEB_APPLICATION,
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    role: 'Frontend Developer',
    featured: false,
    images: [
      {
        url: 'https://example.com/portfolio-screenshot.jpg',
        alt: 'Portfolio website homepage',
        isPrimary: true,
      },
    ],
    links: [
      {
        type: 'live' as const,
        url: 'https://myportfolio.com',
        label: 'Live Site',
        isPrimary: true,
      },
      {
        type: 'github' as const,
        url: 'https://github.com/user/portfolio',
        label: 'Source Code',
        isPrimary: false,
      },
    ],
  };

  const result = validateProjectCreate(newProjectData);
  
  if (result.success) {
    console.log('✅ New project created successfully:', result.data);
    // Here you would save to database
  } else {
    console.log('❌ Project creation failed:', result.errors);
  }

  return result;
}

/**
 * Example 3: Skill validation with certifications
 */
export function exampleSkillValidation() {
  const skillData = {
    name: 'React',
    category: SkillCategory.FRONTEND_DEVELOPMENT,
    level: SkillLevel.ADVANCED,
    proficiency: 85,
    experience: {
      years: 4,
      months: 6,
      firstUsed: new Date('2019-03-01'),
      lastUsed: new Date(),
      frequency: 'daily' as const,
    },
    description: 'Extensive experience building complex React applications with hooks, context, and modern patterns.',
    certifications: [
      {
        name: 'React Developer Certification',
        issuer: 'Meta',
        issueDate: new Date('2022-08-15'),
        url: 'https://certificates.meta.com/react-cert-123',
        verified: true,
        score: 92,
      },
    ],
    learningResources: [
      {
        title: 'React Documentation',
        url: 'https://react.dev',
        type: 'documentation' as const,
        completed: true,
        rating: 5,
      },
      {
        title: 'Advanced React Patterns',
        url: 'https://course-platform.com/advanced-react',
        type: 'course' as const,
        provider: 'Course Platform',
        duration: '40 hours',
        difficulty: 'advanced' as const,
        completed: true,
        rating: 4,
      },
    ],
    projects: ['project-1', 'project-2', 'project-3'],
    featured: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const result = validateSkill(skillData);
  
  if (result.success) {
    console.log('✅ Skill validation successful:', result.data);
  } else {
    console.log('❌ Skill validation failed:', result.errors);
  }

  return result;
}

/**
 * Example 4: Bulk validation of multiple projects
 */
export function exampleBulkValidation() {
  const projects = [
    {
      title: 'Project A',
      description: 'A valid project with all required fields and proper structure.',
      category: ProjectCategory.WEB_APPLICATION,
      status: ProjectStatus.COMPLETED,
      technologies: ['React', 'Node.js'],
      role: 'Developer',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      title: 'Project B',
      description: 'Another valid project with different technologies and status.',
      category: ProjectCategory.MOBILE_APPLICATION,
      status: ProjectStatus.IN_PROGRESS,
      technologies: ['React Native', 'Firebase'],
      role: 'Mobile Developer',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      title: 'Invalid Project',
      // Missing required fields - this will fail validation
      description: 'Short',
    },
  ];

  const result = validateProjectsBulk(projects);
  
  console.log(`📊 Bulk validation results:`);
  console.log(`  Total: ${result.summary.total}`);
  console.log(`  Valid: ${result.summary.validCount}`);
  console.log(`  Invalid: ${result.summary.invalidCount}`);
  console.log(`  Processing time: ${result.summary.processingTime.toFixed(2)}ms`);
  
  if (result.invalid.length > 0) {
    console.log('❌ Invalid items:');
    result.invalid.forEach(item => {
      console.log(`  Item ${item.index}:`, item.errors.map(e => e.message));
    });
  }

  return result;
}

/**
 * Example 5: Legacy data transformation
 */
export function exampleLegacyTransformation() {
  // Simulate old project format
  const legacyProject = {
    title: 'Old Project Format',
    description: 'This project uses the old data structure that needs to be migrated.',
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
    createdAt: 1640995200000, // Timestamp
    updatedAt: 1656633600000,
  };

  console.log('🔄 Transforming legacy project data...');
  
  try {
    const transformedProject = legacyProjectTransformer.transform(legacyProject);
    const validationResult = validateProject(transformedProject);
    
    if (validationResult.success) {
      console.log('✅ Legacy project transformed and validated successfully');
      console.log('📋 Transformed structure:');
      console.log('  Images:', transformedProject.images?.length || 0);
      console.log('  Links:', transformedProject.links?.length || 0);
      console.log('  Schema version:', transformedProject.schemaVersion);
    } else {
      console.log('❌ Transformed project failed validation:', validationResult.errors);
    }
    
    return { transformedProject, validationResult };
  } catch (error) {
    console.log('❌ Transformation failed:', error);
    return null;
  }
}

/**
 * Example 6: Auto-migration with version detection
 */
export async function exampleAutoMigration() {
  const oldProjectData = {
    title: 'Legacy Project',
    description: 'This project needs to be migrated to the latest schema version.',
    category: 'Web Application',
    technologies: ['jQuery', 'PHP'],
    image: 'https://example.com/legacy.jpg',
    liveUrl: 'https://example.com/legacy-live',
    featured: false,
    createdAt: 1577836800000, // 2020-01-01
  };

  console.log('🔍 Detecting data version...');
  const detectedVersion = MigrationUtils.detectDataVersion(oldProjectData, 'project');
  console.log(`📅 Detected version: ${detectedVersion}`);

  console.log('🚀 Starting auto-migration...');
  const migrationResult = await MigrationUtils.autoMigrate(oldProjectData, 'project', '1.0.0');
  
  if (migrationResult.success) {
    console.log('✅ Migration successful!');
    console.log(`📈 Migrated from ${migrationResult.fromVersion} to ${migrationResult.toVersion}`);
    
    // Validate the migrated data
    const validationResult = validateProject(migrationResult.migratedData);
    if (validationResult.success) {
      console.log('✅ Migrated data passes validation');
    } else {
      console.log('❌ Migrated data failed validation:', validationResult.errors);
    }
  } else {
    console.log('❌ Migration failed:', migrationResult.errors);
  }

  return migrationResult;
}

/**
 * Example 7: Field-level validation for forms
 */
export function exampleFieldValidation() {
  console.log('🔍 Testing field-level validation...');

  // Test various field validations
  const testCases = [
    { field: 'title', value: 'Valid Project Title', shouldPass: true },
    { field: 'title', value: '', shouldPass: false },
    { field: 'description', value: 'This is a sufficiently long description for the project', shouldPass: true },
    { field: 'description', value: 'Too short', shouldPass: false },
    { field: 'technologies', value: ['React', 'TypeScript'], shouldPass: true },
    { field: 'technologies', value: [], shouldPass: false },
    { field: 'teamSize', value: 5, shouldPass: true },
    { field: 'teamSize', value: 0, shouldPass: false },
  ];

  testCases.forEach(({ field, value, shouldPass }) => {
    // Note: This is a simplified example. In practice, you'd use the validateProjectField function
    console.log(`  ${field}: ${JSON.stringify(value)} - Expected: ${shouldPass ? 'PASS' : 'FAIL'}`);
  });
}

/**
 * Example 8: Error handling and user feedback
 */
export function exampleErrorHandling() {
  const invalidProject = {
    title: '', // Invalid: empty
    description: 'Short', // Invalid: too short
    category: 'InvalidCategory', // Invalid: not in enum
    technologies: [], // Invalid: empty array
    teamSize: -1, // Invalid: negative
    startDate: new Date('2023-12-31'),
    endDate: new Date('2023-01-01'), // Invalid: before start date
  };

  const result = validateProject(invalidProject);
  
  if (!result.success && result.errors) {
    console.log('📋 Validation errors found:');
    
    // Group errors by field for better user experience
    const errorsByField = result.errors.reduce((acc, error) => {
      if (!acc[error.field]) {
        acc[error.field] = [];
      }
      acc[error.field].push(error.message);
      return acc;
    }, {} as Record<string, string[]>);

    Object.entries(errorsByField).forEach(([field, messages]) => {
      console.log(`  ${field}:`);
      messages.forEach(message => {
        console.log(`    - ${message}`);
      });
    });

    // Generate user-friendly error summary
    const errorCount = result.errors.length;
    const fieldCount = Object.keys(errorsByField).length;
    console.log(`\n📊 Summary: ${errorCount} errors across ${fieldCount} fields`);
  }

  return result;
}

/**
 * Run all examples
 */
export function runAllExamples() {
  console.log('🚀 Running Schema Validation Examples\n');

  console.log('1️⃣ Basic Project Validation');
  exampleBasicProjectValidation();
  console.log('\n');

  console.log('2️⃣ Create New Project');
  exampleCreateProject();
  console.log('\n');

  console.log('3️⃣ Skill Validation');
  exampleSkillValidation();
  console.log('\n');

  console.log('4️⃣ Bulk Validation');
  exampleBulkValidation();
  console.log('\n');

  console.log('5️⃣ Legacy Data Transformation');
  exampleLegacyTransformation();
  console.log('\n');

  console.log('6️⃣ Auto Migration');
  exampleAutoMigration();
  console.log('\n');

  console.log('7️⃣ Field Validation');
  exampleFieldValidation();
  console.log('\n');

  console.log('8️⃣ Error Handling');
  exampleErrorHandling();
  console.log('\n');

  console.log('✅ All examples completed!');
}