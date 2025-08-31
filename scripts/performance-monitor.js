#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

class PerformanceMonitor {
  constructor() {
    this.budgetsPath = join(projectRoot, 'performance-budgets.json');
    this.reportsDir = join(projectRoot, 'performance-reports');
    this.historyPath = join(this.reportsDir, 'history.json');
    
    this.budgets = this.loadBudgets();
    this.history = this.loadHistory();
    
    this.ensureReportsDirectory();
  }

  loadBudgets() {
    if (!existsSync(this.budgetsPath)) {
      throw new Error('Performance budgets file not found');
    }
    return JSON.parse(readFileSync(this.budgetsPath, 'utf8'));
  }

  loadHistory() {
    if (!existsSync(this.historyPath)) {
      return [];
    }
    return JSON.parse(readFileSync(this.historyPath, 'utf8'));
  }

  ensureReportsDirectory() {
    if (!existsSync(this.reportsDir)) {
      mkdirSync(this.reportsDir, { recursive: true });
    }
  }

  async runLighthouse(url) {
    return new Promise((resolve, reject) => {
      const lighthouse = spawn('npx', [
        'lighthouse',
        url,
        '--output=json',
        '--output-path=./performance-reports/lighthouse-report.json',
        '--chrome-flags="--headless --no-sandbox"',
        '--preset=desktop',
        '--only-categories=performance'
      ], {
        stdio: 'pipe',
        cwd: projectRoot
      });

      let output = '';
      let error = '';

      lighthouse.stdout.on('data', (data) => {
        output += data.toString();
      });

      lighthouse.stderr.on('data', (data) => {
        error += data.toString();
      });

      lighthouse.on('close', (code) => {
        if (code === 0) {
          try {
            const reportPath = join(this.reportsDir, 'lighthouse-report.json');
            const report = JSON.parse(readFileSync(reportPath, 'utf8'));
            resolve(report);
          } catch (err) {
            reject(new Error(`Failed to parse Lighthouse report: ${err.message}`));
          }
        } else {
          reject(new Error(`Lighthouse failed with code ${code}: ${error}`));
        }
      });
    });
  }

  extractMetrics(lighthouseReport) {
    const audits = lighthouseReport.audits;
    
    return {
      'first-contentful-paint': audits['first-contentful-paint']?.numericValue || 0,
      'largest-contentful-paint': audits['largest-contentful-paint']?.numericValue || 0,
      'cumulative-layout-shift': audits['cumulative-layout-shift']?.numericValue || 0,
      'total-blocking-time': audits['total-blocking-time']?.numericValue || 0,
      'speed-index': audits['speed-index']?.numericValue || 0,
      'interactive': audits['interactive']?.numericValue || 0,
      'performance-score': lighthouseReport.categories.performance.score * 100,
    };
  }

  extractResourceMetrics(lighthouseReport) {
    const audits = lighthouseReport.audits;
    const resourceSummary = audits['resource-summary'];
    
    if (!resourceSummary || !resourceSummary.details) {
      return {};
    }

    const resources = {};
    resourceSummary.details.items.forEach(item => {
      resources[item.resourceType] = {
        size: item.transferSize,
        count: item.requestCount
      };
    });

    return resources;
  }

  checkBudgets(metrics, resources, budgetConfig) {
    const violations = [];
    const warnings = [];
    const passed = [];

    // Check timing budgets
    if (budgetConfig.timings) {
      budgetConfig.timings.forEach(budget => {
        const actual = metrics[budget.metric];
        const budgetValue = budget.budget;
        const tolerance = budget.tolerance || 0;

        if (actual > budgetValue) {
          violations.push({
            type: 'timing',
            metric: budget.metric,
            actual: actual,
            budget: budgetValue,
            tolerance: tolerance,
            severity: 'error',
            message: `${budget.metric} (${actual.toFixed(0)}ms) exceeds budget of ${budgetValue}ms`
          });
        } else if (actual > budgetValue - tolerance) {
          warnings.push({
            type: 'timing',
            metric: budget.metric,
            actual: actual,
            budget: budgetValue,
            tolerance: tolerance,
            severity: 'warning',
            message: `${budget.metric} (${actual.toFixed(0)}ms) is within tolerance of budget ${budgetValue}ms`
          });
        } else {
          passed.push({
            type: 'timing',
            metric: budget.metric,
            actual: actual,
            budget: budgetValue,
            message: `${budget.metric} (${actual.toFixed(0)}ms) is within budget of ${budgetValue}ms`
          });
        }
      });
    }

    // Check resource size budgets
    if (budgetConfig.resourceSizes) {
      budgetConfig.resourceSizes.forEach(budget => {
        const resourceType = budget.resourceType;
        const actual = resources[resourceType]?.size || 0;
        const budgetValue = budget.budget * 1024; // Convert KB to bytes
        const tolerance = (budget.tolerance || 0) * 1024;

        if (actual > budgetValue) {
          violations.push({
            type: 'resource-size',
            metric: resourceType,
            actual: actual,
            budget: budgetValue,
            tolerance: tolerance,
            severity: 'error',
            message: `${resourceType} size (${this.formatBytes(actual)}) exceeds budget of ${budget.budget}KB`
          });
        } else if (actual > budgetValue - tolerance) {
          warnings.push({
            type: 'resource-size',
            metric: resourceType,
            actual: actual,
            budget: budgetValue,
            tolerance: tolerance,
            severity: 'warning',
            message: `${resourceType} size (${this.formatBytes(actual)}) is within tolerance of budget ${budget.budget}KB`
          });
        } else {
          passed.push({
            type: 'resource-size',
            metric: resourceType,
            actual: actual,
            budget: budgetValue,
            message: `${resourceType} size (${this.formatBytes(actual)}) is within budget of ${budget.budget}KB`
          });
        }
      });
    }

    // Check resource count budgets
    if (budgetConfig.resourceCounts) {
      budgetConfig.resourceCounts.forEach(budget => {
        const resourceType = budget.resourceType;
        const actual = resources[resourceType]?.count || 0;
        const budgetValue = budget.budget;
        const tolerance = budget.tolerance || 0;

        if (actual > budgetValue) {
          violations.push({
            type: 'resource-count',
            metric: resourceType,
            actual: actual,
            budget: budgetValue,
            tolerance: tolerance,
            severity: 'error',
            message: `${resourceType} count (${actual}) exceeds budget of ${budgetValue}`
          });
        } else if (actual > budgetValue - tolerance) {
          warnings.push({
            type: 'resource-count',
            metric: resourceType,
            actual: actual,
            budget: budgetValue,
            tolerance: tolerance,
            severity: 'warning',
            message: `${resourceType} count (${actual}) is within tolerance of budget ${budgetValue}`
          });
        } else {
          passed.push({
            type: 'resource-count',
            metric: resourceType,
            actual: actual,
            budget: budgetValue,
            message: `${resourceType} count (${actual}) is within budget of ${budgetValue}`
          });
        }
      });
    }

    return { violations, warnings, passed };
  }

  generateReport(url, metrics, resources, budgetResults) {
    const timestamp = new Date().toISOString();
    
    const report = {
      timestamp,
      url,
      metrics,
      resources,
      budgetResults,
      summary: {
        totalViolations: budgetResults.violations.length,
        totalWarnings: budgetResults.warnings.length,
        totalPassed: budgetResults.passed.length,
        overallStatus: budgetResults.violations.length === 0 ? 'passed' : 'failed',
        performanceScore: metrics['performance-score']
      }
    };

    // Save individual report
    const reportPath = join(this.reportsDir, `report-${Date.now()}.json`);
    writeFileSync(reportPath, JSON.stringify(report, null, 2));

    // Update history
    this.history.unshift(report);
    if (this.history.length > (this.budgets.reporting?.maxHistoryEntries || 50)) {
      this.history = this.history.slice(0, this.budgets.reporting.maxHistoryEntries);
    }
    writeFileSync(this.historyPath, JSON.stringify(this.history, null, 2));

    return report;
  }

  displayResults(report) {
    console.log('\n🎯 Performance Budget Results');
    console.log('=' .repeat(50));
    
    console.log(`\n📊 Performance Score: ${report.summary.performanceScore.toFixed(1)}/100`);
    console.log(`📈 Overall Status: ${report.summary.overallStatus.toUpperCase()}`);
    
    if (report.budgetResults.violations.length > 0) {
      console.log(`\n❌ Budget Violations (${report.budgetResults.violations.length}):`);
      report.budgetResults.violations.forEach(violation => {
        console.log(`  • ${violation.message}`);
      });
    }

    if (report.budgetResults.warnings.length > 0) {
      console.log(`\n⚠️  Warnings (${report.budgetResults.warnings.length}):`);
      report.budgetResults.warnings.forEach(warning => {
        console.log(`  • ${warning.message}`);
      });
    }

    if (report.budgetResults.passed.length > 0) {
      console.log(`\n✅ Passed Checks (${report.budgetResults.passed.length}):`);
      report.budgetResults.passed.forEach(check => {
        console.log(`  • ${check.message}`);
      });
    }

    // Show trend if history available
    if (this.history.length > 1) {
      const previousReport = this.history[1];
      const scoreDiff = report.summary.performanceScore - previousReport.summary.performanceScore;
      const trendIcon = scoreDiff > 0 ? '📈' : scoreDiff < 0 ? '📉' : '➡️';
      console.log(`\n${trendIcon} Performance Trend: ${scoreDiff > 0 ? '+' : ''}${scoreDiff.toFixed(1)} points`);
    }
  }

  async monitor(url = 'http://localhost:4173') {
    console.log(`🔍 Monitoring performance for ${url}...`);
    
    try {
      // Run Lighthouse audit
      const lighthouseReport = await this.runLighthouse(url);
      
      // Extract metrics
      const metrics = this.extractMetrics(lighthouseReport);
      const resources = this.extractResourceMetrics(lighthouseReport);
      
      // Find matching budget configuration
      const budgetConfig = this.budgets.budgets.find(budget => 
        url.match(new RegExp(budget.path.replace('*', '.*')))
      ) || this.budgets.budgets[0];
      
      // Check against budgets
      const budgetResults = this.checkBudgets(metrics, resources, budgetConfig);
      
      // Generate report
      const report = this.generateReport(url, metrics, resources, budgetResults);
      
      // Display results
      this.displayResults(report);
      
      // Handle enforcement
      if (this.budgets.enforcement?.failOnBudgetExceeded && budgetResults.violations.length > 0) {
        console.log('\n💥 Build failed due to performance budget violations!');
        process.exit(1);
      }
      
      return report;
      
    } catch (error) {
      console.error('❌ Performance monitoring failed:', error.message);
      process.exit(1);
    }
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }
}

// Run monitor if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const url = process.argv[2] || 'http://localhost:4173';
  const monitor = new PerformanceMonitor();
  monitor.monitor(url);
}

export default PerformanceMonitor;