# Performance Monitoring System

This document describes the comprehensive performance monitoring system implemented for the portfolio application.

## Overview

The performance monitoring system consists of four main components:

1. **Lighthouse CI** - Automated performance auditing
2. **Bundle Size Monitoring** - JavaScript bundle analysis and alerts
3. **Performance Budgets** - Enforcement of performance standards
4. **Real User Monitoring (RUM)** - Live user experience tracking

## Components

### 1. Lighthouse CI

Automated performance testing using Google Lighthouse.

**Configuration**: `lighthouserc.js`

**Features**:
- Runs on every deployment
- Tests multiple pages (home, admin)
- Checks Core Web Vitals
- Enforces performance budgets
- Generates detailed reports

**Usage**:
```bash
# Run Lighthouse locally
npm run lighthouse

# Run with CI configuration
npm run lighthouse:ci
```

**Metrics Tracked**:
- Performance Score (target: >80)
- First Contentful Paint (<2000ms)
- Largest Contentful Paint (<2500ms)
- Cumulative Layout Shift (<0.1)
- Total Blocking Time (<300ms)
- Speed Index (<3000ms)

### 2. Bundle Size Monitoring

Tracks JavaScript bundle sizes and alerts on regressions.

**Configuration**: `scripts/bundle-analyzer.js`

**Features**:
- Analyzes all build artifacts
- Compares with baseline
- Alerts on size increases >10%
- Tracks compression ratios
- Integrates with Slack/GitHub

**Usage**:
```bash
# Analyze current build
npm run bundle:analyze

# Check against size limits
npm run bundle:size
```

**Bundle Limits**:
- Main bundle: 300KB (gzipped)
- Vendor bundle: 500KB (gzipped)
- CSS bundle: 100KB (gzipped)
- Total: 1MB (gzipped)

### 3. Performance Budgets

Enforces performance standards and fails builds on violations.

**Configuration**: `performance-budgets.json`

**Features**:
- Configurable thresholds
- Multiple severity levels
- Automatic enforcement
- Notification system
- Historical tracking

**Usage**:
```bash
# Check performance budgets
npm run perf:enforce

# Full performance check
npm run perf:full
```

**Budget Categories**:
- **Timing Budgets**: Core Web Vitals thresholds
- **Resource Budgets**: File size limits by type
- **Count Budgets**: Maximum number of resources

### 4. Real User Monitoring (RUM)

Collects performance data from real users in production.

**Implementation**: `src/utils/rum-monitor.ts`

**Features**:
- Core Web Vitals collection
- Custom metrics tracking
- Error monitoring
- User interaction tracking
- Configurable sampling

**Usage**:
```typescript
import { useRUM } from '@/components/RUMProvider';

const { recordMetric, recordCustomMetric } = useRUM();

// Record custom metric
recordMetric('CustomLoadTime', 1500);

// Record user interaction
recordCustomMetric('ButtonClick', { button: 'cta', timestamp: Date.now() });
```

**Metrics Collected**:
- Core Web Vitals (CLS, FCP, FID, LCP, TTFB)
- Time to Interactive (TTI)
- Resource loading metrics
- DOM metrics
- User interactions
- JavaScript errors

## Configuration

### Environment Variables

```bash
# RUM Configuration
VITE_RUM_API_ENDPOINT=https://api.example.com/rum
VITE_RUM_API_KEY=your-api-key

# Notifications
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
GITHUB_TOKEN=ghp_...

# Lighthouse CI
LHCI_GITHUB_APP_TOKEN=your-token
```

### Performance Budgets

Edit `performance-budgets.json` to customize:

```json
{
  "budgets": [
    {
      "path": "/**",
      "timings": [
        {
          "metric": "first-contentful-paint",
          "budget": 2000,
          "tolerance": 200
        }
      ]
    }
  ]
}
```

### Bundle Size Limits

Edit `package.json` bundlesize configuration:

```json
{
  "bundlesize": [
    {
      "path": "./dist/assets/*.js",
      "maxSize": "500kb",
      "compression": "gzip"
    }
  ]
}
```

## GitHub Actions Integration

The performance monitoring system is integrated into the CI/CD pipeline:

```yaml
- name: Analyze bundle size
  run: npm run bundle:analyze

- name: Run Lighthouse CI
  run: npm run lighthouse:ci

- name: Check performance budgets
  run: node scripts/performance-enforcer.js
```

**Workflow**:
1. Build application
2. Analyze bundle sizes
3. Run Lighthouse audits
4. Check performance budgets
5. Upload reports as artifacts
6. Send notifications on failures

## Admin Dashboard

Access the performance dashboard at `/admin/performance`:

**Features**:
- Core Web Vitals visualization
- Bundle size analysis
- Custom metrics display
- Error tracking
- Historical trends
- Data export functionality

## Alerts and Notifications

### Slack Integration

Performance alerts are sent to Slack when:
- Bundle size increases >10%
- Performance budgets are exceeded
- Critical Core Web Vitals thresholds are breached

### GitHub Integration

GitHub Actions will:
- Fail builds on critical performance issues
- Add PR comments with performance reports
- Create annotations for warnings/errors

## Monitoring Schedule

### Automated Checks

- **On every build**: Bundle analysis, Lighthouse CI
- **Daily**: Full performance audit of production
- **Weekly**: Historical trend analysis
- **On deployment**: Complete performance validation

### Manual Checks

```bash
# Quick performance check
npm run perf:monitor

# Full performance audit
npm run perf:full

# Bundle analysis only
npm run bundle:analyze

# Lighthouse audit only
npm run lighthouse
```

## Performance Optimization Guidelines

### Bundle Size Optimization

1. **Code Splitting**: Use dynamic imports for large components
2. **Tree Shaking**: Remove unused code
3. **Compression**: Enable gzip/brotli compression
4. **Minification**: Use terser for JavaScript minification

### Core Web Vitals Optimization

1. **LCP**: Optimize largest content element loading
2. **FID**: Minimize JavaScript execution time
3. **CLS**: Avoid layout shifts during loading

### Resource Optimization

1. **Images**: Use WebP/AVIF formats, lazy loading
2. **Fonts**: Preload critical fonts, use font-display: swap
3. **CSS**: Remove unused styles, use critical CSS
4. **JavaScript**: Defer non-critical scripts

## Troubleshooting

### Common Issues

**Bundle size alerts**:
- Check for new dependencies
- Analyze bundle composition
- Look for duplicate code

**Lighthouse failures**:
- Check network conditions
- Verify server response times
- Review resource loading

**RUM data missing**:
- Check sampling rate
- Verify API endpoint
- Check browser console for errors

### Debug Commands

```bash
# Verbose bundle analysis
DEBUG=1 npm run bundle:analyze

# Lighthouse with debugging
npm run lighthouse -- --view

# Performance enforcer with details
DEBUG=1 npm run perf:enforce
```

## Best Practices

1. **Set realistic budgets** based on your application needs
2. **Monitor trends** rather than absolute values
3. **Test on various devices** and network conditions
4. **Regular baseline updates** as features are added
5. **Prioritize user-facing metrics** over technical metrics

## Resources

- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [Bundle Analysis](https://webpack.js.org/guides/code-splitting/)
- [Performance Budgets](https://web.dev/performance-budgets-101/)

## Support

For issues with the performance monitoring system:

1. Check the GitHub Actions logs
2. Review the performance reports in `./performance-reports/`
3. Check Slack notifications for alerts
4. Consult this documentation for configuration options