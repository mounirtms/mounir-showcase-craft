#!/usr/bin/env node

import { execSync } from 'child_process';
import { readdirSync, statSync, readFileSync } from 'fs';
import { join, extname } from 'path';

const command = process.argv[2];

// Utility functions
const runCommand = (cmd, description) => {
  try {
    console.log(`🔄 ${description}...`);
    const output = execSync(cmd, { encoding: 'utf8' });
    console.log(`✅ ${description} completed`);
    return output;
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    return null;
  }
};

const getFileSize = (filePath) => {
  try {
    const stats = statSync(filePath);
    return stats.size;
  } catch {
    return 0;
  }
};

const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const scanDirectory = (dir, extensions = ['.ts', '.tsx', '.js', '.jsx']) => {
  let files = [];
  try {
    const items = readdirSync(dir);
    for (const item of items) {
      const fullPath = join(dir, item);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        files = files.concat(scanDirectory(fullPath, extensions));
      } else if (stat.isFile() && extensions.includes(extname(item))) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    // Ignore errors for directories we can't read
  }
  return files;
};

const countLines = (filePath) => {
  try {
    const content = readFileSync(filePath, 'utf8');
    return content.split('\n').length;
  } catch {
    return 0;
  }
};

// Command handlers
const commands = {
  info: () => {
    console.log('📊 Project Information\n');
    
    // Package info
    try {
      const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
      console.log(`📦 Project: ${packageJson.name}`);
      console.log(`🏷️  Version: ${packageJson.version}`);
      console.log(`📝 Description: ${packageJson.description || 'No description'}\n`);
    } catch {
      console.log('❌ Could not read package.json\n');
    }
    
    // File statistics
    const srcFiles = scanDirectory('src');
    const totalLines = srcFiles.reduce((sum, file) => sum + countLines(file), 0);
    const totalSize = srcFiles.reduce((sum, file) => sum + getFileSize(file), 0);
    
    console.log('📁 Source Code Statistics:');
    console.log(`   Files: ${srcFiles.length}`);
    console.log(`   Lines: ${totalLines.toLocaleString()}`);
    console.log(`   Size: ${formatBytes(totalSize)}\n`);
    
    // Dependencies
    try {
      const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
      const deps = Object.keys(packageJson.dependencies || {}).length;
      const devDeps = Object.keys(packageJson.devDependencies || {}).length;
      console.log('📚 Dependencies:');
      console.log(`   Production: ${deps}`);
      console.log(`   Development: ${devDeps}`);
      console.log(`   Total: ${deps + devDeps}\n`);
    } catch {
      console.log('❌ Could not read dependencies\n');
    }
  },

  clean: () => {
    console.log('🧹 Cleaning project...\n');
    
    const cleanCommands = [
      { cmd: 'npm run clean', desc: 'Clean build artifacts' },
      { cmd: 'npm run clean:cache', desc: 'Clean cache files' },
    ];
    
    cleanCommands.forEach(({ cmd, desc }) => {
      runCommand(cmd, desc);
    });
    
    console.log('\n✨ Project cleaned successfully!');
  },

  check: () => {
    console.log('🔍 Running comprehensive checks...\n');
    
    const checks = [
      { cmd: 'npm run type-check', desc: 'TypeScript type checking' },
      { cmd: 'npm run lint:check', desc: 'ESLint checking' },
      { cmd: 'npm run format:check', desc: 'Prettier format checking' },
    ];
    
    let allPassed = true;
    
    checks.forEach(({ cmd, desc }) => {
      const result = runCommand(cmd, desc);
      if (!result) allPassed = false;
    });
    
    if (allPassed) {
      console.log('\n🎉 All checks passed!');
    } else {
      console.log('\n❌ Some checks failed. Run "npm run quality:fix" to fix automatically.');
    }
  },

  deps: () => {
    console.log('📦 Dependency Management\n');
    
    const depCommands = [
      { cmd: 'npm outdated', desc: 'Check for outdated packages' },
      { cmd: 'npm audit', desc: 'Security audit' },
    ];
    
    depCommands.forEach(({ cmd, desc }) => {
      console.log(`\n--- ${desc} ---`);
      try {
        execSync(cmd, { stdio: 'inherit' });
      } catch (error) {
        console.log(`ℹ️  ${desc} completed with warnings`);
      }
    });
  },

  stats: () => {
    console.log('📈 Detailed Project Statistics\n');
    
    // File type breakdown
    const allFiles = scanDirectory('src', ['.ts', '.tsx', '.js', '.jsx', '.css', '.json']);
    const fileTypes = {};
    let totalSize = 0;
    let totalLines = 0;
    
    allFiles.forEach(file => {
      const ext = extname(file);
      const size = getFileSize(file);
      const lines = countLines(file);
      
      if (!fileTypes[ext]) {
        fileTypes[ext] = { count: 0, size: 0, lines: 0 };
      }
      
      fileTypes[ext].count++;
      fileTypes[ext].size += size;
      fileTypes[ext].lines += lines;
      totalSize += size;
      totalLines += lines;
    });
    
    console.log('📊 File Type Breakdown:');
    Object.entries(fileTypes)
      .sort(([,a], [,b]) => b.count - a.count)
      .forEach(([ext, stats]) => {
        console.log(`   ${ext.padEnd(6)} ${stats.count.toString().padStart(3)} files  ${formatBytes(stats.size).padStart(8)}  ${stats.lines.toLocaleString().padStart(6)} lines`);
      });
    
    console.log(`\n📋 Totals: ${allFiles.length} files, ${formatBytes(totalSize)}, ${totalLines.toLocaleString()} lines\n`);
    
    // Component analysis
    const componentFiles = scanDirectory('src/components', ['.tsx']);
    console.log(`🧩 Components: ${componentFiles.length} files`);
    
    const pageFiles = scanDirectory('src/pages', ['.tsx']);
    console.log(`📄 Pages: ${pageFiles.length} files`);
    
    const hookFiles = scanDirectory('src/hooks', ['.ts', '.tsx']);
    console.log(`🪝 Hooks: ${hookFiles.length} files`);
  },

  help: () => {
    console.log('🛠️  Development Utilities\n');
    console.log('Available commands:');
    console.log('  info    - Show project information');
    console.log('  clean   - Clean project artifacts and cache');
    console.log('  check   - Run all quality checks');
    console.log('  deps    - Check dependencies and security');
    console.log('  stats   - Show detailed project statistics');
    console.log('  help    - Show this help message\n');
    console.log('Usage: node scripts/dev-utils.js <command>');
  }
};

// Execute command
if (!command || !commands[command]) {
  console.log('❌ Invalid or missing command\n');
  commands.help();
  process.exit(1);
}

commands[command]();