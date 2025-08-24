import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary, AdminErrorFallback } from "@/components/ui/error-boundary";
import { UpdateNotification, NetworkStatus } from "@/components/ui/update-notification";
import { ThemeProvider } from "@/components/theme/theme-provider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";

// Enhanced QueryClient configuration for optimal performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Network errors should retry
        if (error?.code === 'NETWORK_ERROR') return failureCount < 3;
        // Rate limiting should retry with exponential backoff
        if (error?.status === 429) return failureCount < 2;
        // Client errors shouldn't retry
        if (error?.status >= 400 && error?.status < 500) return false;
        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: true,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      networkMode: 'online',
    },
    mutations: {
      retry: (failureCount, error: any) => {
        // Don't retry on authentication errors
        if (error?.code?.includes('auth/')) return false;
        // Don't retry on client errors (400-499)
        if (error?.status >= 400 && error?.status < 500) return false;
        // Retry server errors up to 2 times
        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
      networkMode: 'online',
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <ThemeProvider defaultTheme="system" storageKey="mounir-portfolio-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route 
                path="/myadmin" 
                element={
                  <ErrorBoundary fallback={AdminErrorFallback}>
                    <Admin />
                  </ErrorBoundary>
                } 
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          
          {/* PWA and Offline Features */}
          <UpdateNotification />
          <NetworkStatus />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </ErrorBoundary>
);

export default App;

