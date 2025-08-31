#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync, writeFileSync } from 'fs';
import { join } from 'path';

console.log('🚀 Setting up development environment...\n');

// Function to run command and handle errors
const runCommand = (command, description) => {
  try {
    console.log(`📦 ${description}...`);
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completed\n`);
  } catch (error) {
    console.error(`❌ Failed to ${description.toLowerCase()}`);
    console.error(error.message);
    process.exit(1);
  }
};

// Check if we're in a git repository
const isGitRepo = existsSync('.git');

if (!isGitRepo) {
  console.log('📝 Initializing Git repository...');
  runCommand('git init', 'Initialize Git repository');
}

// Install dependencies
runCommand('npm install', 'Install dependencies');

// Setup Husky for git hooks
try {
  console.log('🪝 Setting up Git hooks with Husky...');
  
  // Initialize husky
  execSync('npx husky install', { stdio: 'inherit' });
  
  // Create pre-commit hook
  execSync('npx husky add .husky/pre-commit "npx lint-staged"', { stdio: 'inherit' });
  
  // Create pre-push hook
  execSync('npx husky add .husky/pre-push "npm run quality"', { stdio: 'inherit' });
  
  // Create commit-msg hook for conventional commits (optional)
  const commitMsgHook = `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Optional: Add commitlint for conventional commits
# npx --no -- commitlint --edit $1
`;
  
  writeFileSync('.husky/commit-msg', commitMsgHook);
  execSync('chmod +x .husky/commit-msg', { stdio: 'inherit' });
  
  console.log('✅ Git hooks setup completed\n');
} catch (error) {
  console.warn('⚠️  Warning: Could not setup Git hooks. You may need to run this manually.');
  console.warn('Run: npx husky install && npx husky add .husky/pre-commit "npx lint-staged"\n');
}

// Setup package.json scripts for husky
try {
  const packageJsonPath = 'package.json';
  const packageJson = JSON.parse(require('fs').readFileSync(packageJsonPath, 'utf8'));
  
  if (!packageJson.scripts.prepare) {
    packageJson.scripts.prepare = 'husky install';
    writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('✅ Added prepare script for Husky\n');
  }
} catch (error) {
  console.warn('⚠️  Warning: Could not update package.json prepare script\n');
}

// Run initial quality checks
console.log('🔍 Running initial quality checks...');
try {
  execSync('npm run quality', { stdio: 'inherit' });
  console.log('✅ Quality checks passed\n');
} catch (error) {
  console.warn('⚠️  Warning: Some quality checks failed. You may need to fix them manually.\n');
}

// Create VS Code settings (optional)
const vscodeDir = '.vscode';
const vscodeSettingsPath = join(vscodeDir, 'settings.json');

if (!existsSync(vscodeSettingsPath)) {
  try {
    require('fs').mkdirSync(vscodeDir, { recursive: true });
    
    const vscodeSettings = {
      "editor.formatOnSave": true,
      "editor.defaultFormatter": "esbenp.prettier-vscode",
      "editor.codeActionsOnSave": {
        "source.fixAll.eslint": "explicit"
      },
      "typescript.preferences.importModuleSpecifier": "relative",
      "typescript.suggest.autoImports": true,
      "emmet.includeLanguages": {
        "typescript": "html",
        "typescriptreact": "html"
      },
      "files.associations": {
        "*.css": "tailwindcss"
      },
      "tailwindCSS.includeLanguages": {
        "typescript": "html",
        "typescriptreact": "html"
      }
    };
    
    writeFileSync(vscodeSettingsPath, JSON.stringify(vscodeSettings, null, 2));
    console.log('✅ Created VS Code settings\n');
  } catch (error) {
    console.warn('⚠️  Warning: Could not create VS Code settings\n');
  }
}

console.log('🎉 Development environment setup completed!\n');
console.log('📋 Available commands:');
console.log('   npm run dev              - Start development server');
console.log('   npm run build            - Build for production');
console.log('   npm run lint             - Run ESLint');
console.log('   npm run format           - Format code with Prettier');
console.log('   npm run quality          - Run all quality checks');
console.log('   npm run generate:component <name> - Generate new component');
console.log('   npm run generate:page <name>      - Generate new page');
console.log('   npm run generate:hook <name>      - Generate new hook');
console.log('');
console.log('🔧 Git hooks are now active:');
console.log('   - Pre-commit: Runs linting and formatting');
console.log('   - Pre-push: Runs quality checks');
console.log('');
console.log('💡 Next steps:');
console.log('   1. Run: npm run dev');
console.log('   2. Start coding! 🚀');