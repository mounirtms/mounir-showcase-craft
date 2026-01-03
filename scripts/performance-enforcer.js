#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

class PerformanceBudgetEnforcer {
  constructor() {
    this.budgetsPath = join(projectRoot, 'performance-budgets.json');
    this.reportsPath = join(projectRoot, 'performance-reports');
    this.budgets = this.loadBudgets();
    this.violations = [];
    this.warnings = [];
  }

  loadBudgets() {
    if (!existsSync(this.budgetsPath)) {
      throw new Error('Performance budgets configuration not found');
    }
    return JSON.parse(readFileSync(this.budgetsPath, 'utf8'));
  }

  async enforce() {
    console.log('🔒 Enforcing performance budgets...');

    // Load latest performance report
    const latestReport = this.getLatestReport();
    if (!latestReport) {
      console.warn('⚠️  No performance reports found. Run performance monitoring first.');
      return;
    }

    // Check budgets
    this.checkPerformanceBudgets(latestReport);
    this.checkResourceBudgets(latestReport);
    
    // Generate enforcement report
    const enforcementReport = this.generateEnforcementReport(latestReport);
    
    // Send notifications
    await this.sendNotifications(enforcementReport);
    
    // Display results
    this.displayResults(enforcementReport);
    
    // Handle enforcement actions
    this.handleEnforcement(enforcementReport);
  }

  getLatestReport() {
    if (!existsSync(this.reportsPath)) return null;
    
    const historyPath = join(this.reportsPath, 'history.json');
    if (!existsSync(historyPath)) return null;
    
    const history = JSON.parse(readFileSync(historyPath, 'utf8'));
    return history.length > 0 ? history[0] : null;
  }

  checkPerformanceBudgets(report) {
    const { thresholds } = this.budgets.enforcement;
    const metrics = report.metrics;

    // Check performance score
    if (metrics['performance-score'] < thresholds.critical.performanceScore) {
      this.violations.push({
        type: 'performance_score',
        severity: 'critical',
        metric: 'Performance Score',
        actual: metrics['performance-score'],
        threshold: thresholds.critical.performanceScore,
        message: `Performance score (${metrics['performance-score'].toFixed(1)}) is below critical threshold (${thresholds.critical.performanceScore})`
      });
    } else if (metrics['performance-score'] < thresholds.warning.performanceScore) {
      this.warnings.push({
        type: 'performance_score',
        severity: 'warning',
        metric: 'Performance Score',
        actual: metrics['performance-score'],
        threshold: thresholds.warning.performanceScore,
        message: `Performance score (${metrics['performance-score'].toFixed(1)}) is below warning threshold (${thresholds.warning.performanceScore})`
      });
    }

    // Check Core Web Vitals
    this.checkCoreWebVital('first-contentful-paint', 'fcpMs', metrics, thresholds);
    this.checkCoreWebVital('largest-contentful-paint', 'lcpMs', metrics, thresholds);
    this.checkCoreWebVital('cumulative-layout-shift', 'clsScore', metrics, thresholds);
  }

  checkCoreWebVital(metricKey, thresholdKey, metrics, thresholds) {
    const actual = metrics[metricKey];
    const criticalThreshold = thresholds.critical[thresholdKey];
    const warningThreshold = thresholds.warning[thresholdKey];

    if (actual > criticalThreshold) {
      this.violations.push({
        type: 'core_web_vital',
        severity: 'critical',
        metric: metricKey,
        actual: actual,
        threshold: criticalThreshold,
        message: `${metricKey} (${this.formatMetric(metricKey, actual)}) exceeds critical threshold (${this.formatMetric(metricKey, criticalThreshold)})`
      });
    } else if (actual > warningThreshold) {
      this.warnings.push({
        type: 'core_web_vital',
        severity: 'warning',
        metric: metricKey,
        actual: actual,
        threshold: warningThreshold,
        message: `${metricKey} (${this.formatMetric(metricKey, actual)}) exceeds warning threshold (${this.formatMetric(metricKey, warningThreshold)})`
      });
    }
  }

  checkResourceBudgets(report) {
    const budgetConfig = this.budgets.budgets.find(budget => 
      report.url.match(new RegExp(budget.path.replace('*', '.*')))
    ) || this.budgets.budgets[0];

    if (!budgetConfig.resourceSizes) return;

    budgetConfig.resourceSizes.forEach(budget => {
      const resourceType = budget.resourceType;
      const actual = report.resources[resourceType]?.size || 0;
      const budgetBytes = budget.budget * 1024;

      if (actual > budgetBytes) {
        this.violations.push({
          type: 'resource_budget',
          severity: 'error',
          metric: `${resourceType} size`,
          actual: actual,
          threshold: budgetBytes,
          message: `${resourceType} size (${this.formatBytes(actual)}) exceeds budget (${budget.budget}KB)`
        });
      }
    });
  }

  generateEnforcementReport(performanceReport) {
    return {
      timestamp: new Date().toISOString(),
      performanceReport: performanceReport.timestamp,
      violations: this.violations,
      warnings: this.warnings,
      summary: {
        totalViolations: this.violations.length,
        totalWarnings: this.warnings.length,
        criticalIssues: this.violations.filter(v => v.severity === 'critical').length,
        status: this.violations.length === 0 ? 'passed' : 'failed',
        enforcementAction: this.determineEnforcementAction()
      }
    };
  }

  determineEnforcementAction() {
    const { enforcement } = this.budgets;
    const criticalViolations = this.violations.filter(v => v.severity === 'critical').length;
    const totalViolations = this.violations.length;

    if (criticalViolations > 0) {
      return 'fail_build';
    }

    if (enforcement.failOnBudgetExceeded && totalViolations > 0) {
      return totalViolations <= enforcement.allowedFailures ? 'warn' : 'fail_build';
    }

    return 'pass';
  }

  async sendNotifications(report) {
    const { notifications } = this.budgets.enforcement;

    // GitHub Actions annotations
    if (notifications.github?.enabled && process.env.GITHUB_ACTIONS) {
      this.violations.forEach(violation => {
        console.log(`::error::${violation.message}`);
      });
      this.warnings.forEach(warning => {
        console.log(`::warning::${warning.message}`);
      });
    }

    // Slack notifications
    if (notifications.slack?.enabled && process.env.SLACK_WEBHOOK_URL) {
      await this.sendSlackNotification(report, notifications.slack);
    }
  }

  async sendSlackNotification(report, slackConfig) {
    try {
      const color = report.summary.status === 'failed' ? 'danger' : 
                   report.summary.totalWarnings > 0 ? 'warning' : 'good';

      const payload = {
        channel: slackConfig.channel,
        text: `🎯 Performance Budget Report`,
        attachments: [{
          color: color,
          title: `Performance Budget ${report.summary.status.toUpperCase()}`,
          fields: [
            { title: 'Status', value: report.summary.status, short: true },
            { title: 'Violations', value: report.summary.totalViolations, short: true },
            { title: 'Warnings', value: report.summary.totalWarnings, short: true },
            { title: 'Action', value: report.summary.enforcementAction, short: true }
          ],
          footer: 'Performance Budget Enforcer',
          ts: Math.floor(Date.now() / 1000)
        }]
      };

      if (report.violations.length > 0) {
        payload.attachments[0].text = report.violations
          .slice(0, 5) // Limit to first 5 violations
          .map(v => `• ${v.message}`)
          .join('\n');
      }

      const response = await fetch(process.env.SLACK_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        console.warn('Failed to send Slack notification:', response.statusText);
      }
    } catch (error) {
      console.warn('Failed to send Slack notification:', error.message);
    }
  }

  displayResults(report) {
    console.log('\n🔒 Performance Budget Enforcement Results');
    console.log('=' .repeat(50));
    
    console.log(`\n📊 Summary:`);
    console.log(`  Status: ${report.summary.status.toUpperCase()}`);
    console.log(`  Violations: ${report.summary.totalViolations}`);
    console.log(`  Warnings: ${report.summary.totalWarnings}`);
    console.log(`  Action: ${report.summary.enforcementAction}`);

    if (report.violations.length > 0) {
      console.log(`\n❌ Budget Violations (${report.violations.length}):`);
      report.violations.forEach(violation => {
        console.log(`  • ${violation.message}`);
      });
    }

    if (report.warnings.length > 0) {
      console.log(`\n⚠️  Warnings (${report.warnings.length}):`);
      report.warnings.forEach(warning => {
        console.log(`  • ${warning.message}`);
      });
    }

    if (report.violations.length === 0 && report.warnings.length === 0) {
      console.log(`\n✅ All performance budgets are within limits!`);
    }
  }

  handleEnforcement(report) {
    const action = report.summary.enforcementAction;
    
    switch (action) {
      case 'fail_build':
        console.log('\n💥 Build failed due to performance budget violations!');
        process.exit(1);
        break;
      case 'warn':
        console.log('\n⚠️  Performance budget warnings detected. Consider optimizing.');
        break;
      case 'pass':
        console.log('\n✅ Performance budgets passed!');
        break;
    }
  }

  formatMetric(metricKey, value) {
    if (metricKey.includes('paint') || metricKey.includes('time')) {
      return `${Math.round(value)}ms`;
    }
    if (metricKey.includes('shift')) {
      return value.toFixed(3);
    }
    return value.toString();
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }
}

// Run enforcer if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    const enforcer = new PerformanceBudgetEnforcer();
    await enforcer.enforce();
  } catch (error) {
    console.error('❌ Performance budget enforcement failed:', error.message);
    process.exit(1);
  }
}

export default PerformanceBudgetEnforcer;