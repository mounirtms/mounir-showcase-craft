#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Building Mounir Abderrahmani Portfolio for Production...\n');

// Check if environment variables are set
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
  'VITE_FIREBASE_MEASUREMENT_ID'
];

console.log('📋 Checking environment variables...');
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.warn('⚠️  Warning: Missing environment variables:');
  missingVars.forEach(varName => console.warn(`   - ${varName}`));
  console.warn('   Portfolio will work in static mode without Firebase features.\n');
} else {
  console.log('✅ All Firebase environment variables are set.\n');
}

// Clean previous build
console.log('🧹 Cleaning previous build...');
try {
  execSync('rm -rf dist', { stdio: 'inherit' });
} catch (error) {
  // Directory might not exist, continue
}

// Run type checking
console.log('🔍 Running TypeScript type checking...');
try {
  execSync('npx tsc --noEmit', { stdio: 'inherit' });
  console.log('✅ TypeScript check passed.\n');
} catch (error) {
  console.error('❌ TypeScript errors found. Please fix them before building.');
  process.exit(1);
}

// Run linting
console.log('🔧 Running ESLint...');
try {
  execSync('npx eslint . --ext .ts,.tsx --max-warnings 0', { stdio: 'inherit' });
  console.log('✅ Linting passed.\n');
} catch (error) {
  console.warn('⚠️  Linting warnings found. Consider fixing them.\n');
}

// Build the project
console.log('🏗️  Building the project...');
try {
  execSync('npm run build:prod', { stdio: 'inherit' });
  console.log('✅ Build completed successfully.\n');
} catch (error) {
  console.error('❌ Build failed.');
  process.exit(1);
}

// Verify build output
console.log('🔍 Verifying build output...');
const distPath = path.join(__dirname, '..', 'dist');
const indexPath = path.join(distPath, 'index.html');

if (!fs.existsSync(indexPath)) {
  console.error('❌ Build verification failed: index.html not found.');
  process.exit(1);
}

const indexContent = fs.readFileSync(indexPath, 'utf8');
if (!indexContent.includes('Mounir Abderrahmani')) {
  console.error('❌ Build verification failed: Content not found in index.html.');
  process.exit(1);
}

// Verify PWA files
const requiredFiles = [
  'sw.js',
  'site.webmanifest', 
  'offline.html',
  'CNAME',
  'mounir-icon.svg'
];

console.log('🔍 Verifying PWA files...');
const missingFiles = requiredFiles.filter(file => !fs.existsSync(path.join(distPath, file)));

if (missingFiles.length > 0) {
  console.warn('⚠️  Warning: Missing PWA files:');
  missingFiles.forEach(file => console.warn(`   - ${file}`));
  console.warn('   PWA features may not work correctly.\n');
} else {
  console.log('✅ All PWA files are present.');
}

console.log('✅ Build verification passed.\n');

// Calculate build size
const buildStats = execSync('du -sh dist', { encoding: 'utf8' }).trim();
console.log(`📊 Build size: ${buildStats.split('\t')[0]}\n`);

// Success message
console.log('🎉 Production build completed successfully!');
console.log('📁 Build output is in the "dist" directory.');
console.log('🚀 Ready for deployment to GitHub Pages or any static hosting service.');
console.log('\n📋 Next steps:');
console.log('   1. Test the build locally: npm run preview');
console.log('   2. Deploy to GitHub Pages: git push origin main');
console.log('   3. Or deploy manually: upload "dist" folder to your hosting service');
console.log('\n✨ Portfolio by Mounir Abderrahmani - Built with modern web technologies');