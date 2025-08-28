# Google Analytics Configuration

## Overview
Your portfolio website is configured with Google Analytics 4 (GA4) to track visitor interactions, performance metrics, and user engagement.

## Configuration Details

### Stream Information
- **Stream Name**: MounirCvApp
- **Stream URL**: https://mounir1.github.io
- **Stream ID**: 10033401139
- **Measurement ID**: G-96R4Z44Y80

### Implementation Status ✅

Your Google Analytics setup is fully implemented and includes:

1. **Basic Tracking** - Configured in `index.html`
2. **Error Tracking** - Configured in `main.tsx`
3. **Performance Monitoring** - Custom implementation in `PerformanceMonitor.tsx`
4. **User Interaction Tracking** - Custom hooks in `useUserTracking.ts`
5. **Admin Verification Tools** - Available in admin dashboard

## Features

### 1. Automatic Page Views
- Tracks all page visits automatically
- Records user navigation patterns
- Monitors page load times

### 2. Error Tracking
- Captures JavaScript errors
- Reports unhandled promise rejections
- Helps identify and fix issues quickly

### 3. Performance Monitoring
- Core Web Vitals tracking
- Custom performance metrics
- Real-time performance alerts

### 4. User Interaction Tracking
- Click tracking on important elements
- Scroll depth monitoring
- Form submission tracking
- Custom event tracking

### 5. Admin Dashboard Integration
- Real-time analytics verification
- Configuration status checking
- Test event sending capability
- Direct links to GA dashboard

## Admin Panel Features

Navigate to the Admin Panel → GA Config tab to access:

### Google Analytics Information
- View all stream details with copy functionality
- Quick links to analytics dashboard
- Implementation status overview
- Direct access to Google Analytics console

### Analytics Verification
- Automated health checks
- Real-time configuration testing
- Network connectivity verification
- Test event sending
- Performance scoring

## Quick Actions

### View Analytics Data
1. Open Admin Panel
2. Go to "GA Config" tab
3. Click "Open Analytics" button
4. Or visit: https://analytics.google.com/analytics/web/#/p10033401139

### Send Test Event
1. In Admin Panel → GA Config → Analytics Verification
2. Click "Send Test Event" button
3. Check GA dashboard in 5-10 minutes for the test event

### Run Health Check
1. In Admin Panel → GA Config → Analytics Verification
2. Click "Run Checks" to verify all components
3. Review results and fix any issues

## Technical Implementation

### Files Involved
- `index.html` - Main GA4 tracking script
- `main.tsx` - Error tracking setup
- `src/components/portfolio/PerformanceMonitor.tsx` - Performance tracking
- `src/hooks/useUserTracking.ts` - User interaction tracking
- `src/components/admin/GoogleAnalyticsInfo.tsx` - Admin configuration panel
- `src/components/admin/GoogleAnalyticsVerification.tsx` - Verification tools

### Key Metrics Tracked
- **Page Views**: All page visits and navigation
- **User Engagement**: Time on page, scroll depth, interactions
- **Performance**: Core Web Vitals, load times, errors
- **Events**: Custom business events, form submissions, clicks
- **Errors**: JavaScript errors, performance issues

## Troubleshooting

### If Analytics Aren't Working
1. Run the health check in Admin Panel
2. Verify internet connectivity
3. Check browser console for errors
4. Ensure ad blockers aren't interfering
5. Confirm GA4 property is active

### Common Issues
- **Ad Blockers**: May block GA requests
- **GDPR/Privacy**: Some users may opt out
- **Network Issues**: Corporate firewalls may block GA
- **Script Loading**: Check if gtag script loads properly

## Privacy & Compliance

Your analytics setup includes:
- IP anonymization enabled
- Sensitive data hashing
- User privacy controls
- GDPR-friendly configuration

## Support Resources

- [GA4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
- [Troubleshooting Guide](https://support.google.com/analytics/answer/9304153)
- [Admin Panel Verification Tools](https://mounir1.github.io/admin)

---

**Last Updated**: August 2025  
**Configuration Status**: ✅ Active and Verified