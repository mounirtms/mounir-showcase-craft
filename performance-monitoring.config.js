// Performance Monitoring Configuration
// This file centralizes all performance monitoring settings

export const performanceConfig = {
  // Lighthouse CI Configuration
  lighthouse: {
    ci: {
      collect: {
        url: [
          'http://localhost:4173/',
          'http://localhost:4173/admin',
        ],
        startServerCommand: 'npm run preview',
        startServerReadyPattern: 'Local:',
        startServerReadyTimeout: 30000,
        numberOfRuns: 3,
        settings: {
          chromeFlags: '--no-sandbox --headless',
          preset: 'desktop',
          onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
          skipAudits: ['uses-http2'],
        },
      },
      assert: {
        assertions: {
          // Performance category
          'categories:performance': ['error', { minScore: 0.8 }],
          'categories:accessibility': ['error', { minScore: 0.9 }],
          'categories:best-practices': ['error', { minScore: 0.8 }],
          'categories:seo': ['error', { minScore: 0.8 }],
          
          // Core Web Vitals
          'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
          'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
          'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
          'total-blocking-time': ['error', { maxNumericValue: 300 }],
          'speed-index': ['error', { maxNumericValue: 3000 }],
          
          // Resource budgets
          'resource-summary:document:size': ['error', { maxNumericValue: 50000 }],
          'resource-summary:script:size': ['error', { maxNumericValue: 500000 }],
          'resource-summary:stylesheet:size': ['error', { maxNumericValue: 100000 }],
          'resource-summary:image:size': ['error', { maxNumericValue: 1000000 }],
          'resource-summary:font:size': ['error', { maxNumericValue: 200000 }],
          
          // Network budgets
          'resource-summary:total:count': ['error', { maxNumericValue: 50 }],
          'resource-summary:script:count': ['error', { maxNumericValue: 10 }],
          'resource-summary:stylesheet:count': ['error', { maxNumericValue: 5 }],
          
          // Modern web standards
          'uses-webp-images': 'warn',
          'efficient-animated-content': 'warn',
          'modern-image-formats': 'warn',
          'unused-css-rules': 'warn',
          'unused-javascript': 'warn',
        },
      },
      upload: {
        target: 'temporary-public-storage',
      },
      server: {
        port: 9001,
        storage: './lighthouse-reports',
      },
    },
  },

  // Bundle Size Monitoring
  bundleSize: {
    limits: {
      'index.js': 300, // KB
      'vendor.js': 500,
      'firebase.js': 200,
      'ui.js': 150,
      'router.js': 50,
      'icons.js': 100,
      total: 1000,
    },
    performanceBudgets: {
      javascript: 500, // KB
      css: 100,
      images: 1000,
      fonts: 200,
      total: 1500,
    },
    alerts: {
      slack: {
        enabled: true,
        webhookUrl: process.env.SLACK_WEBHOOK_URL,
        channel: '#performance-alerts',
      },
      github: {
        enabled: true,
        createIssue: false,
        addComment: true,
      },
    },
  },

  // Real User Monitoring (RUM)
  rum: {
    production: {
      sampleRate: 0.1, // 10% of users
      enableConsoleLogging: false,
      enableLocalStorage: true,
      apiEndpoint: process.env.VITE_RUM_API_ENDPOINT,
      apiKey: process.env.VITE_RUM_API_KEY,
    },
    development: {
      sampleRate: 1.0, // 100% of users
      enableConsoleLogging: true,
      enableLocalStorage: true,
      apiEndpoint: 'http://localhost:3001/api/rum',
    },
    metrics: {
      coreWebVitals: ['CLS', 'FCP', 'FID', 'LCP', 'TTFB'],
      customMetrics: [
        'TTI', // Time to Interactive
        'ResourceCount',
        'ResourceTotalSize',
        'DOMContentLoaded',
        'DOMElements',
        'TotalVisibleTime',
      ],
      trackingEvents: [
        'click',
        'navigation',
        'form_submission',
        'error',
        'page_visibility',
      ],
    },
  },

  // Performance Budgets
  budgets: {
    timings: {
      'first-contentful-paint': { budget: 2000, tolerance: 200 },
      'largest-contentful-paint': { budget: 2500, tolerance: 300 },
      'cumulative-layout-shift': { budget: 0.1, tolerance: 0.02 },
      'total-blocking-time': { budget: 300, tolerance: 50 },
      'speed-index': { budget: 3000, tolerance: 400 },
      'interactive': { budget: 3500, tolerance: 500 },
    },
    resources: {
      script: { budget: 500, tolerance: 50 }, // KB
      stylesheet: { budget: 100, tolerance: 20 },
      image: { budget: 1000, tolerance: 200 },
      font: { budget: 200, tolerance: 50 },
      document: { budget: 50, tolerance: 10 },
      total: { budget: 1500, tolerance: 200 },
    },
    counts: {
      script: { budget: 10, tolerance: 2 },
      stylesheet: { budget: 5, tolerance: 1 },
      image: { budget: 20, tolerance: 5 },
      font: { budget: 4, tolerance: 1 },
      total: { budget: 50, tolerance: 10 },
    },
  },

  // Enforcement Rules
  enforcement: {
    failOnBudgetExceeded: true,
    failOnToleranceExceeded: false,
    allowedFailures: 2,
    retryOnFailure: true,
    maxRetries: 3,
    notifications: {
      slack: {
        enabled: true,
        webhookUrl: process.env.SLACK_WEBHOOK_URL,
        channel: '#performance-alerts',
      },
      email: {
        enabled: false,
        recipients: ['team@example.com'],
      },
      github: {
        enabled: true,
        createIssue: false,
        addComment: true,
      },
    },
    thresholds: {
      critical: {
        performanceScore: 50,
        fcpMs: 4000,
        lcpMs: 4000,
        clsScore: 0.25,
      },
      warning: {
        performanceScore: 70,
        fcpMs: 3000,
        lcpMs: 3500,
        clsScore: 0.15,
      },
    },
  },

  // Monitoring Schedule
  schedule: {
    lighthouse: {
      frequency: 'daily', // daily, weekly, on-deploy
      time: '02:00', // UTC time
      urls: [
        'https://your-domain.com',
        'https://your-domain.com/admin',
      ],
    },
    bundleAnalysis: {
      frequency: 'on-build',
      compareWithBaseline: true,
      alertOnRegression: true,
      regressionThreshold: 10, // percent
    },
    rumReporting: {
      frequency: 'hourly',
      aggregationPeriod: '24h',
      alertThresholds: {
        errorRate: 0.05, // 5%
        performanceRegression: 20, // 20% slower
      },
    },
  },

  // Reporting Configuration
  reporting: {
    formats: ['json', 'html', 'console'],
    outputPath: './performance-reports',
    includeHistory: true,
    maxHistoryEntries: 50,
    compareWithBaseline: true,
    generateTrends: true,
    dashboardUrl: '/admin/performance',
  },

  // Integration Settings
  integrations: {
    github: {
      enabled: true,
      token: process.env.GITHUB_TOKEN,
      repository: process.env.GITHUB_REPOSITORY,
      createPRComments: true,
      createIssues: false,
    },
    slack: {
      enabled: true,
      webhookUrl: process.env.SLACK_WEBHOOK_URL,
      channel: '#performance-alerts',
      mentionOnCritical: ['@channel'],
    },
    datadog: {
      enabled: false,
      apiKey: process.env.DATADOG_API_KEY,
      appKey: process.env.DATADOG_APP_KEY,
    },
    newrelic: {
      enabled: false,
      licenseKey: process.env.NEW_RELIC_LICENSE_KEY,
    },
  },
};

export default performanceConfig;