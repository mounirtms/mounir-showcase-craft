import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ErrorBoundary } from './components/shared/ErrorBoundary'

// Enhanced error handling for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  
  // Report to analytics if available
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'exception', {
      description: `Unhandled Promise: ${event.reason}`,
      fatal: false
    });
  }
});

// Global error handler
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  
  // Report to analytics if available
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'exception', {
      description: event.error?.message || 'Unknown error',
      fatal: false
    });
  }
});

import { ThemeProvider } from './contexts/ThemeContext';

import { CustomThemeProvider } from './contexts/CustomThemeProvider';

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <CustomThemeProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </CustomThemeProvider>
  </ErrorBoundary>
);
