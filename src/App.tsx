import React from 'react';
import { Toaster, Sonner, TooltipProvider } from "@/components/ui";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/shared";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ThemeTransition } from "@/components/theme/theme-transition";
import { AccessibilityProvider } from "@/contexts";
import { RUMProvider } from "@/components";

// Import the HomePage component
import HomePage from "./pages/HomePage";
// Import other pages
import AdminPage from "./pages/Admin";
import NotFoundPage from "./pages/NotFound";

// Loading component for Suspense
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
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
                  <React.Suspense fallback={<LoadingFallback />}>
                    <Routes>
                      <Route 
                        path="/" 
                        element={
                          <ErrorBoundary>
                            <HomePage />
                          </ErrorBoundary>
                        } 
                      />
                      <Route 
                        path="/admin/*" 
                        element={
                          <ErrorBoundary>
                            <AdminPage />
                          </ErrorBoundary>
                        } 
                      />
                      <Route 
                        path="*" 
                        element={
                          <ErrorBoundary>
                            <NotFoundPage />
                          </ErrorBoundary>
                        } 
                      />
                    </Routes>
                  </React.Suspense>
                </BrowserRouter>
              </ThemeTransition>
            </TooltipProvider>
          </ThemeProvider>
        </AccessibilityProvider>
      </RUMProvider>
    </ErrorBoundary>
  );
}