import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ErrorBoundary } from "@/components/shared/SimpleErrorBoundary";
import { Toaster } from "@/components/ui/simple-toaster";
import { TooltipProvider } from "@/components/ui/simple-tooltip";

// Lazy load pages for better performance
const HomePage = lazy(() => import("./pages/HomePage"));
const AdminPage = lazy(() => import("./pages/OptimizedAdmin"));
const NotFoundPage = lazy(() => import("./pages/NotFound"));

// Professional loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
      <p className="text-muted-foreground text-sm font-medium">Loading...</p>
    </div>
  </div>
);


// Professional portfolio app by Mounir Abderrahmani
export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider 
        defaultTheme="system" 
        storageKey="mounir-portfolio-theme"
        enableSystem={true}
        disableTransitionOnChange={false}
        enableColorSchemeChange={true}
      >
        <TooltipProvider>
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/admin/*" element={<AdminPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
            <Toaster />
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
