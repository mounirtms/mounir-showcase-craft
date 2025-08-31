import { Toaster, Sonner, TooltipProvider } from "@/components/ui";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/shared";
import { ThemeProvider, ThemeDemo } from "@/components/theme";
import { AccessibilityProvider } from "@/contexts";
import { RUMProvider } from "@/components";
import { HomePage, AdminPage, NotFoundPage } from "@/pages";



const App = () => {
  const rumConfig = {
    sampleRate: import.meta.env.PROD ? 0.1 : 1.0, // Sample 10% in prod, 100% in dev
    enableConsoleLogging: import.meta.env.DEV,
    enableLocalStorage: true,
    apiEndpoint: import.meta.env.VITE_RUM_API_ENDPOINT,
    apiKey: import.meta.env.VITE_RUM_API_KEY,
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
                <Toaster />
                <Sonner />
                <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/theme-demo" element={<ThemeDemo />} />
                    <Route 
                      path="/admin/*" 
                      element={
                        <ErrorBoundary>
                          <AdminPage />
                        </ErrorBoundary>
                      } 
                    /> 
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </BrowserRouter>
                

              </TooltipProvider>
          </ThemeProvider>
        </AccessibilityProvider>
      </RUMProvider>
    </ErrorBoundary>
  );
};

export default App;