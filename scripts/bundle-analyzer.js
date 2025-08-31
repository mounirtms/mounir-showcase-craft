#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { gzipSync } from 'zlib';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

// Bundle size limits (in KB)
const BUNDLE_LIMITS = {
  'index.js': 300,
  'vendor.js': 500,
  'firebase.js': 200,
  'ui.js': 150,
  'router.js': 50,
  'icons.js': 100,
  total: 1000,
};

// Performance budget thresholds
const PERFORMANCE_BUDGETS = {
  javascript: 500, // KB
  css: 100,        // KB
  images: 1000,    // KB
  fonts: 200,      // KB
  total: 1500,     // KB
};

class BundleAnalyzer {
  constructor() {
    this.distPath = join(projectRoot, 'dist');
    this.reportPath = join(projectRoot, 'bundle-report.json');
    this.results = {
      timestamp: new Date().toISOString(),
      bundles: {},
      assets: {},
      summary: {},
      budgets: {},
      alerts: [],
    };
  }

  async analyze() {
    console.log('🔍 Analyzing bundle sizes...');
    
    if (!existsSync(this.distPath)) {
      throw new Error('Build directory not found. Run "npm run build" first.');
    }

    this.analyzeBundles();
    this.analyzeAssets();
    this.calculateSummary();
    this.checkBudgets();
    await this.generateReport();
    this.displayResults();
  }

  analyzeBundles() {
    const assetsPath = join(this.distPath, 'assets');
    if (!existsSync(assetsPath)) return;

    const files = this.getFilesRecursively(assetsPath);
    
    files.forEach(file => {
      const content = readFileSync(file);
      const gzipped = gzipSync(content);
      const relativePath = file.replace(assetsPath + '/', '');
      
      const bundleType = this.getBundleType(relativePath);
      
      this.results.bundles[relativePath] = {
        size: content.length,
        gzipped: gzipped.length,
        type: bundleType,
        path: relativePath,
      };
    });
  }

  analyzeAssets() {
    const files = this.getFilesRecursively(this.distPath);
    
    files.forEach(file => {
      const content = readFileSync(file);
      const relativePath = file.replace(this.distPath + '/', '');
      const extension = relativePath.split('.').pop();
      
      if (!this.results.assets[extension]) {
        this.results.assets[extension] = {
          count: 0,
          totalSize: 0,
          files: [],
        };
      }
      
      this.results.assets[extension].count++;
      this.results.assets[extension].totalSize += content.length;
      this.results.assets[extension].files.push({
        path: relativePath,
        size: content.length,
      });
    });
  }

  calculateSummary() {
    const totalSize = Object.values(this.results.bundles)
      .reduce((sum, bundle) => sum + bundle.size, 0);
    
    const totalGzipped = Object.values(this.results.bundles)
      .reduce((sum, bundle) => sum + bundle.gzipped, 0);

    this.results.summary = {
      totalBundles: Object.keys(this.results.bundles).length,
      totalSize: totalSize,
      totalGzipped: totalGzipped,
      compressionRatio: totalSize > 0 ? (totalGzipped / totalSize) : 0,
      largestBundle: this.getLargestBundle(),
      bundlesByType: this.getBundlesByType(),
    };
  }

  checkBudgets() {
    // Check individual bundle limits
    Object.entries(this.results.bundles).forEach(([path, bundle]) => {
      const bundleName = this.getBundleType(path);
      const limit = BUNDLE_LIMITS[bundleName];
      
      if (limit && bundle.gzipped > limit * 1024) {
        this.results.alerts.push({
          type: 'bundle_size_exceeded',
          severity: 'error',
          message: `Bundle ${bundleName} (${this.formatBytes(bundle.gzipped)}) exceeds limit of ${limit}KB`,
          bundle: bundleName,
          actual: bundle.gzipped,
          limit: limit * 1024,
        });
      }
    });

    // Check performance budgets
    Object.entries(PERFORMANCE_BUDGETS).forEach(([type, limit]) => {
      const actual = this.getAssetSizeByType(type);
      
      if (actual > limit * 1024) {
        this.results.alerts.push({
          type: 'performance_budget_exceeded',
          severity: 'warning',
          message: `${type} assets (${this.formatBytes(actual)}) exceed budget of ${limit}KB`,
          assetType: type,
          actual: actual,
          limit: limit * 1024,
        });
      }
    });

    // Check total bundle size
    if (this.results.summary.totalGzipped > BUNDLE_LIMITS.total * 1024) {
      this.results.alerts.push({
        type: 'total_size_exceeded',
        severity: 'error',
        message: `Total bundle size (${this.formatBytes(this.results.summary.totalGzipped)}) exceeds limit of ${BUNDLE_LIMITS.total}KB`,
        actual: this.results.summary.totalGzipped,
        limit: BUNDLE_LIMITS.total * 1024,
      });
    }

    this.results.budgets = {
      bundleLimits: BUNDLE_LIMITS,
      performanceBudgets: PERFORMANCE_BUDGETS,
      status: this.results.alerts.length === 0 ? 'passed' : 'failed',
    };
  }

  async generateReport() {
    // Compare with baseline
    this.compareWithBaseline();
    
    // Send alerts for critical issues
    for (const alert of this.results.alerts) {
      await this.sendAlert(alert);
    }
    
    writeFileSync(this.reportPath, JSON.stringify(this.results, null, 2));
    console.log(`📊 Bundle report saved to ${this.reportPath}`);
  }

  displayResults() {
    console.log('\n📦 Bundle Analysis Results');
    console.log('=' .repeat(50));
    
    console.log(`\n📈 Summary:`);
    console.log(`  Total bundles: ${this.results.summary.totalBundles}`);
    console.log(`  Total size: ${this.formatBytes(this.results.summary.totalSize)}`);
    console.log(`  Gzipped size: ${this.formatBytes(this.results.summary.totalGzipped)}`);
    console.log(`  Compression ratio: ${(this.results.summary.compressionRatio * 100).toFixed(1)}%`);

    console.log(`\n📊 Bundles by type:`);
    Object.entries(this.results.summary.bundlesByType).forEach(([type, data]) => {
      console.log(`  ${type}: ${this.formatBytes(data.size)} (${data.count} files)`);
    });

    if (this.results.alerts.length > 0) {
      console.log(`\n⚠️  Alerts (${this.results.alerts.length}):`);
      this.results.alerts.forEach(alert => {
        const icon = alert.severity === 'error' ? '❌' : '⚠️';
        console.log(`  ${icon} ${alert.message}`);
      });
    } else {
      console.log(`\n✅ All bundle size checks passed!`);
    }

    // Exit with error code if there are critical alerts
    const hasErrors = this.results.alerts.some(alert => alert.severity === 'error');
    if (hasErrors) {
      process.exit(1);
    }
  }

  // Send alerts to external services
  async sendAlert(alert) {
    // GitHub Actions integration
    if (process.env.GITHUB_ACTIONS) {
      const message = `::${alert.severity === 'error' ? 'error' : 'warning'}::${alert.message}`;
      console.log(message);
    }

    // Slack webhook integration (if configured)
    if (process.env.SLACK_WEBHOOK_URL) {
      try {
        const payload = {
          text: `🚨 Bundle Size Alert: ${alert.message}`,
          attachments: [{
            color: alert.severity === 'error' ? 'danger' : 'warning',
            fields: [
              { title: 'Type', value: alert.type, short: true },
              { title: 'Severity', value: alert.severity, short: true },
              { title: 'Actual Size', value: this.formatBytes(alert.actual), short: true },
              { title: 'Limit', value: this.formatBytes(alert.limit), short: true }
            ]
          }]
        };

        const response = await fetch(process.env.SLACK_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          console.warn('Failed to send Slack alert:', response.statusText);
        }
      } catch (error) {
        console.warn('Failed to send Slack alert:', error.message);
      }
    }
  }

  // Compare with previous builds
  compareWithBaseline() {
    const baselinePath = join(projectRoot, 'bundle-baseline.json');
    if (!existsSync(baselinePath)) {
      console.log('📊 No baseline found, creating new baseline...');
      writeFileSync(baselinePath, JSON.stringify(this.results, null, 2));
      return;
    }

    const baseline = JSON.parse(readFileSync(baselinePath, 'utf8'));
    const comparison = {
      sizeDiff: this.results.summary.totalGzipped - baseline.summary.totalGzipped,
      percentChange: ((this.results.summary.totalGzipped - baseline.summary.totalGzipped) / baseline.summary.totalGzipped) * 100,
      bundleChanges: {}
    };

    // Compare individual bundles
    Object.entries(this.results.bundles).forEach(([path, bundle]) => {
      const baselineBundle = baseline.bundles[path];
      if (baselineBundle) {
        const sizeDiff = bundle.gzipped - baselineBundle.gzipped;
        const percentDiff = (sizeDiff / baselineBundle.gzipped) * 100;
        
        if (Math.abs(percentDiff) > 5) { // Alert on >5% change
          comparison.bundleChanges[path] = {
            sizeDiff,
            percentDiff,
            current: bundle.gzipped,
            baseline: baselineBundle.gzipped
          };
        }
      }
    });

    this.results.comparison = comparison;

    // Alert on significant size increases
    if (comparison.percentChange > 10) {
      this.results.alerts.push({
        type: 'bundle_size_regression',
        severity: 'warning',
        message: `Total bundle size increased by ${comparison.percentChange.toFixed(1)}% (${this.formatBytes(comparison.sizeDiff)})`,
        actual: this.results.summary.totalGzipped,
        baseline: baseline.summary.totalGzipped,
        change: comparison.sizeDiff
      });
    }

    console.log(`\n📈 Bundle Size Comparison:`);
    console.log(`  Size change: ${comparison.sizeDiff > 0 ? '+' : ''}${this.formatBytes(comparison.sizeDiff)} (${comparison.percentChange.toFixed(1)}%)`);
    
    if (Object.keys(comparison.bundleChanges).length > 0) {
      console.log(`\n📊 Significant bundle changes:`);
      Object.entries(comparison.bundleChanges).forEach(([path, change]) => {
        const icon = change.sizeDiff > 0 ? '📈' : '📉';
        console.log(`  ${icon} ${path}: ${change.sizeDiff > 0 ? '+' : ''}${this.formatBytes(change.sizeDiff)} (${change.percentDiff.toFixed(1)}%)`);
      });
    }
  }

  // Helper methods
  getFilesRecursively(dir) {
    const files = [];
    
    try {
      const items = readdirSync(dir);
      items.forEach(item => {
        const fullPath = join(dir, item);
        const stat = statSync(fullPath);
        
        if (stat.isDirectory()) {
          files.push(...this.getFilesRecursively(fullPath));
        } else {
          files.push(fullPath);
        }
      });
    } catch (error) {
      console.warn(`Failed to read directory ${dir}:`, error.message);
    }
    
    return files;
  }

  getBundleType(path) {
    if (path.includes('vendor')) return 'vendor.js';
    if (path.includes('firebase')) return 'firebase.js';
    if (path.includes('ui')) return 'ui.js';
    if (path.includes('router')) return 'router.js';
    if (path.includes('icons')) return 'icons.js';
    if (path.includes('index')) return 'index.js';
    return 'other';
  }

  getLargestBundle() {
    return Object.entries(this.results.bundles)
      .reduce((largest, [path, bundle]) => 
        bundle.size > (largest?.size || 0) ? { path, ...bundle } : largest, null);
  }

  getBundlesByType() {
    const byType = {};
    
    Object.entries(this.results.bundles).forEach(([path, bundle]) => {
      const type = bundle.type;
      if (!byType[type]) {
        byType[type] = { count: 0, size: 0 };
      }
      byType[type].count++;
      byType[type].size += bundle.gzipped;
    });
    
    return byType;
  }

  getAssetSizeByType(type) {
    const extensions = {
      javascript: ['js', 'mjs'],
      css: ['css'],
      images: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif', 'svg'],
      fonts: ['woff', 'woff2', 'ttf', 'otf', 'eot'],
    };

    const relevantExtensions = extensions[type] || [];
    
    return Object.entries(this.results.assets)
      .filter(([ext]) => relevantExtensions.includes(ext))
      .reduce((total, [, data]) => total + data.totalSize, 0);
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }
}

// Run analyzer if called directly
const currentFile = fileURLToPath(import.meta.url);
const isMainModule = process.argv[1] === currentFile;

if (isMainModule) {
  (async () => {
    try {
      console.log('🔍 Starting bundle analysis...');
      const analyzer = new BundleAnalyzer();
      await analyzer.analyze();
    } catch (error) {
      console.error('❌ Bundle analysis failed:', error.message);
      console.error(error.stack);
      process.exit(1);
    }
  })();
}

export default BundleAnalyzer;