#!/usr/bin/env node

/**
 * Code Deduplication Analysis Script
 * Analyzes the codebase for duplicate code patterns and generates a report
 */

const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  srcDir: path.join(__dirname, '../src'),
  outputFile: path.join(__dirname, '../DEDUPLICATION_REPORT.md'),
  extensions: ['.tsx', '.ts', '.js', '.jsx'],
  excludeDirs: ['node_modules', '.git', 'dist', 'build'],
  minFunctionLength: 3, // Minimum lines for function to be considered
  minDuplicateLength: 5, // Minimum lines for duplicate detection
};

// Utility functions
const getAllFiles = (dir, files = []) => {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !config.excludeDirs.includes(item)) {
      getAllFiles(fullPath, files);
    } else if (stat.isFile() && config.extensions.some(ext => item.endsWith(ext))) {
      files.push(fullPath);
    }
  }
  
  return files;
};

const readFileContent = (filePath) => {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.warn(`Warning: Could not read file ${filePath}`);
    return '';
  }
};

// Analysis functions
const findDuplicateInterfaces = (files) => {
  const interfaces = new Map();
  
  files.forEach(file => {
    const content = readFileContent(file);
    const interfaceMatches = content.match(/interface\s+\w+\s*{[^}]*}/g) || [];
    
    interfaceMatches.forEach(match => {
      // Normalize whitespace
      const normalized = match.replace(/\s+/g, ' ').trim();
      const interfaceName = match.match(/interface\s+(\w+)/)?.[1];
      
      if (interfaceName && normalized.length > 50) { // Only consider substantial interfaces
        if (!interfaces.has(normalized)) {
          interfaces.set(normalized, []);
        }
        interfaces.get(normalized).push({ file, name: interfaceName });
      }
    });
  });
  
  return Array.from(interfaces.entries())
    .filter(([, occurrences]) => occurrences.length > 1)
    .map(([interfaceCode, occurrences]) => ({
      interface: interfaceCode.substring(0, 100) + (interfaceCode.length > 100 ? '...' : ''),
      occurrences: occurrences.map(o => ({ file: path.relative(config.srcDir, o.file), name: o.name }))
    }));
};

const findDuplicateFunctions = (files) => {
  const functions = new Map();
  
  files.forEach(file => {
    const content = readFileContent(file);
    const lines = content.split('\n');
    
    // Find function declarations
    const functionMatches = [
      ...content.matchAll(/(?:export\s+)?(?:const|function)\s+(\w+)\s*[=:]?\s*(?:\([^)]*\)\s*(?:=>|{)|{)/g)
    ];
    
    functionMatches.forEach(match => {
      const functionName = match[1];
      const startLine = content.substring(0, match.index).split('\n').length - 1;
      
      // Extract function body (simplified)
      let braceCount = 0;
      let endLine = startLine;
      let started = false;
      
      for (let i = startLine; i < lines.length; i++) {
        const line = lines[i];
        for (const char of line) {
          if (char === '{') {
            braceCount++;
            started = true;
          } else if (char === '}') {
            braceCount--;
          }
        }
        
        if (started && braceCount === 0) {
          endLine = i;
          break;
        }
      }
      
      const functionBody = lines.slice(startLine, endLine + 1).join('\n');
      const lineCount = endLine - startLine + 1;
      
      if (lineCount >= config.minFunctionLength) {
        // Normalize function body for comparison
        const normalized = functionBody
          .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
          .replace(/\/\/.*$/gm, '') // Remove line comments
          .replace(/\s+/g, ' ') // Normalize whitespace
          .trim();
        
        if (!functions.has(normalized)) {
          functions.set(normalized, []);
        }
        
        functions.get(normalized).push({
          file,
          name: functionName,
          lines: lineCount,
          startLine: startLine + 1
        });
      }
    });
  });
  
  return Array.from(functions.entries())
    .filter(([, occurrences]) => occurrences.length > 1)
    .map(([body, occurrences]) => ({
      body: body.substring(0, 200) + (body.length > 200 ? '...' : ''),
      occurrences: occurrences.map(o => ({
        file: path.relative(config.srcDir, o.file),
        name: o.name,
        lines: o.lines,
        startLine: o.startLine
      }))
    }));
};

const findDuplicateImports = (files) => {
  const imports = new Map();
  
  files.forEach(file => {
    const content = readFileContent(file);
    const importMatches = content.match(/import\s+.*?from\s+['"][^'"]+['"]/g) || [];
    
    importMatches.forEach(importStatement => {
      const normalized = importStatement.replace(/\s+/g, ' ').trim();
      
      if (!imports.has(normalized)) {
        imports.set(normalized, []);
      }
      imports.get(normalized).push(file);
    });
  });
  
  return Array.from(imports.entries())
    .filter(([, files]) => files.length > 3) // Only show imports used in 3+ files
    .map(([importStatement, files]) => ({
      import: importStatement,
      count: files.length,
      files: files.slice(0, 5).map(f => path.relative(config.srcDir, f)) // Show first 5 files
    }))
    .sort((a, b) => b.count - a.count);
};

const findDuplicateConstants = (files) => {
  const constants = new Map();
  
  files.forEach(file => {
    const content = readFileContent(file);
    const constantMatches = content.match(/(?:export\s+)?const\s+[A-Z_][A-Z0-9_]*\s*=\s*[^;]+/g) || [];
    
    constantMatches.forEach(constant => {
      const normalized = constant.replace(/\s+/g, ' ').trim();
      
      if (!constants.has(normalized)) {
        constants.set(normalized, []);
      }
      constants.get(normalized).push(file);
    });
  });
  
  return Array.from(constants.entries())
    .filter(([, files]) => files.length > 1)
    .map(([constant, files]) => ({
      constant,
      occurrences: files.map(f => path.relative(config.srcDir, f))
    }));
};

const findLargeFiles = (files) => {
  return files
    .map(file => {
      const content = readFileContent(file);
      const lines = content.split('\n').length;
      return {
        file: path.relative(config.srcDir, file),
        lines
      };
    })
    .filter(f => f.lines > 200) // Files with more than 200 lines
    .sort((a, b) => b.lines - a.lines);
};

// Generate report
const generateReport = () => {
  console.log('🔍 Analyzing codebase for duplicates...');
  
  const files = getAllFiles(config.srcDir);
  console.log(`📁 Found ${files.length} files to analyze`);
  
  const duplicateInterfaces = findDuplicateInterfaces(files);
  const duplicateFunctions = findDuplicateFunctions(files);
  const duplicateImports = findDuplicateImports(files);
  const duplicateConstants = findDuplicateConstants(files);
  const largeFiles = findLargeFiles(files);
  
  const report = `# Code Deduplication Analysis Report

Generated on: ${new Date().toISOString()}

## Summary

- **Total files analyzed**: ${files.length}
- **Duplicate interfaces found**: ${duplicateInterfaces.length}
- **Duplicate functions found**: ${duplicateFunctions.length}
- **Common imports**: ${duplicateImports.length}
- **Duplicate constants**: ${duplicateConstants.length}
- **Large files (>200 lines)**: ${largeFiles.length}

## 🔄 Duplicate Interfaces

${duplicateInterfaces.length === 0 ? 'No duplicate interfaces found.' : 
  duplicateInterfaces.map(item => `
### Interface Pattern
\`\`\`typescript
${item.interface}
\`\`\`

**Found in:**
${item.occurrences.map(o => `- \`${o.file}\` (${o.name})`).join('\n')}
`).join('\n')}

## 🔄 Duplicate Functions

${duplicateFunctions.length === 0 ? 'No duplicate functions found.' : 
  duplicateFunctions.map(item => `
### Function Pattern
\`\`\`typescript
${item.body}
\`\`\`

**Found in:**
${item.occurrences.map(o => `- \`${o.file}\` (${o.name}, ${o.lines} lines, line ${o.startLine})`).join('\n')}
`).join('\n')}

## 📦 Common Imports

${duplicateImports.length === 0 ? 'No frequently used imports found.' : 
  duplicateImports.map(item => `
### ${item.import}
**Used in ${item.count} files:**
${item.files.map(f => `- \`${f}\``).join('\n')}
${item.count > 5 ? '- ... and more' : ''}
`).join('\n')}

## 🔢 Duplicate Constants

${duplicateConstants.length === 0 ? 'No duplicate constants found.' : 
  duplicateConstants.map(item => `
### \`${item.constant}\`
**Found in:**
${item.occurrences.map(f => `- \`${f}\``).join('\n')}
`).join('\n')}

## 📏 Large Files

${largeFiles.length === 0 ? 'No large files found.' : 
  largeFiles.map(item => `- \`${item.file}\` (${item.lines} lines)`).join('\n')}

## 🛠️ Recommendations

### High Priority
1. **Extract duplicate interfaces** into shared type files
2. **Consolidate duplicate functions** into utility modules
3. **Break down large files** into smaller, focused components

### Medium Priority
1. **Create shared constants** file for duplicate constants
2. **Optimize imports** by creating barrel exports
3. **Implement base components** for common UI patterns

### Low Priority
1. **Review and refactor** similar code patterns
2. **Consider using composition** over inheritance
3. **Implement code splitting** for large modules

## 📋 Action Items

- [x] Create \`src/lib/shared/types.ts\` for common interfaces
- [x] Create \`src/lib/shared/constants.ts\` for shared constants
- [x] Create \`src/lib/shared/utils.ts\` for common utilities
- [x] Implement base components in \`src/components/base/\`
- [ ] Refactor large files into smaller modules
- [ ] Set up ESLint rules to prevent future duplication

---

*This report was generated automatically. Review suggestions carefully before implementing changes.*
`;

  fs.writeFileSync(config.outputFile, report);
  console.log(`📊 Report generated: ${config.outputFile}`);
  
  // Print summary to console
  console.log('\n📊 Analysis Summary:');
  console.log(`   Duplicate interfaces: ${duplicateInterfaces.length}`);
  console.log(`   Duplicate functions: ${duplicateFunctions.length}`);
  console.log(`   Common imports: ${duplicateImports.length}`);
  console.log(`   Duplicate constants: ${duplicateConstants.length}`);
  console.log(`   Large files: ${largeFiles.length}`);
  
  if (duplicateInterfaces.length > 0 || duplicateFunctions.length > 0 || duplicateConstants.length > 0) {
    console.log('\n⚠️  Duplicates found! Check the report for details.');
    return 1; // Exit with error code
  } else {
    console.log('\n✅ No significant duplicates found!');
    return 0;
  }
};

// Run the analysis
if (require.main === module) {
  const exitCode = generateReport();
  process.exit(exitCode);
}

module.exports = { generateReport };