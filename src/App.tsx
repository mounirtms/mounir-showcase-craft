import React, { Suspense, lazy } from 'react';
import { Toaster, Sonner, TooltipProvider } from "@/components/ui";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/shared";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ThemeTransition } from "@/components/theme/theme-transition";
import { AccessibilityProvider } from "@/contexts";
import { RUMProvider } from "@/components";

// Lazy load pages for better performance
const HomePage = lazy(() => import("./pages/HomePage"));
const AdminPage = lazy(() => import("./pages/Admin"));
const NotFoundPage = lazy(() => import("./pages/NotFound"));

// Enhanced loading component with better UX
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      <p className="text-muted-foreground text-sm">Loading...</p>
    </div>
  </div>
);



// Define the App component
export default function App() {
  const rumConfig = {
    sampleRate: import.meta.env.PROD ? 0.1 : 1.0, // Sample 10% in prod, 100% in dev
    enableConsoleLogging: import.meta.env.DEV,
    enableLocalStorage: true,
    ...(import.meta.env.VITE_RUM_API_ENDPOINT && { apiEndpoint: import.meta.env.VITE_RUM_API_ENDPOINT }),
    ...(import.meta.env.VITE_RUM_API_KEY && { apiKey: import.meta.env.VITE_RUM_API_KEY }),
  };

  return (
    <ErrorBoundary>
      <RUMProvider config={rumConfig} enabled={true}>
        <AccessibilityProvider>
          <ThemeProvider 
            defaultTheme="system" 
            storageKey="mounir-portfolio-theme"
            enableSystem={true}
            disableTransitionOnChange={false}
            enableColorSchemeChange={true}
          >
            <TooltipProvider>
              <ThemeTransition>
                <Toaster />
                <Sonner />
                <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                  <Suspense fallback={<LoadingFallback />}>
                    <Routes>
                      <Route 
                        path="/" 
                        element={<HomePage />} 
                      />
                      <Route 
                        path="/admin/*" 
                        element={<AdminPage />} 
                      />
                      <Route 
                        path="*" 
                        element={<NotFoundPage />} 
                      />
                    </Routes>
                  </Suspense>
                </BrowserRouter>
              </ThemeTransition>
            </TooltipProvider>
          </ThemeProvider>
        </AccessibilityProvider>
      </RUMProvider>
    </ErrorBoundary>
  );
}