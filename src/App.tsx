import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ui/error-boundary";

import { ThemeProvider } from "@/components/theme/theme-provider";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";



const App = () => (
  <ErrorBoundary>
    <AccessibilityProvider>
      <ThemeProvider defaultTheme="system" storageKey="mounir-portfolio-theme">
        <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route 
                  path="/myadmin" 
                  element={
                    <ErrorBoundary>
                      <Admin />
                    </ErrorBoundary>
                  } 
                />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
            

          </TooltipProvider>
      </ThemeProvider>
    </AccessibilityProvider>
  </ErrorBoundary>
);

export default App;