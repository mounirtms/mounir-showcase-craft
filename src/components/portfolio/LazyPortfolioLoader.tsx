import React, { Suspense, lazy, useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  Eye, 
  Download, 
  AlertCircle, 
  RefreshCw,
  Zap,
  Package,
  Clock,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";

// Lazy load portfolio components for code splitting
const LazyHeroSection = lazy(() => import("./HeroSection").then(module => ({ default: module.HeroSection })));
const LazySkillVisualization = lazy(() => import("./SkillVisualization").then(module => ({ default: module.SkillVisualization })));
const LazyProjectShowcase = lazy(() => import("./ProjectShowcase").then(module => ({ default: module.ProjectShowcase })));
const LazyContactForm = lazy(() => import("./ContactForm").then(module => ({ default: module.ContactForm })));
const LazyFilterableProjectGallery = lazy(() => import("./FilterableProjectGallery").then(module => ({ default: module.FilterableProjectGallery })));
const LazyInteractiveCodeSnippets = lazy(() => import("./InteractiveCodeSnippets").then(module => ({ default: module.InteractiveCodeSnippets })));
const LazyTestimonialsCarousel = lazy(() => import("./TestimonialsCarousel").then(module => ({ default: module.TestimonialsCarousel })));
const LazyInteractiveTimeline = lazy(() => import("./InteractiveTimeline").then(module => ({ default: module.InteractiveTimeline })));
const LazyProfessionalAvatar = lazy(() => import("./ProfessionalAvatar").then(module => ({ default: module.ProfessionalAvatar })));
const LazyDynamicTypingEffect = lazy(() => import("./DynamicTypingEffect").then(module => ({ default: module.DynamicTypingEffect })));
const LazyAnimationLibrary = lazy(() => import("./AnimationLibrary").then(module => ({ default: module })));
const LazyAnimationLibraryDemo = lazy(() => import("./AnimationLibraryDemo"));

// Demo components (lazy loaded separately)
const LazySkillVisualizationDemo = lazy(() => import("./SkillVisualizationDemo"));
const LazyProjectShowcaseDemo = lazy(() => import("./ProjectShowcaseDemo"));
const LazyScrollAnimationsDemo = lazy(() => import("./ScrollAnimationsDemo"));

// Component metadata for performance tracking
const COMPONENT_METADATA = {
  HeroSection: {
    name: "Hero Section",
    description: "Animated hero section with particle effects",
    estimatedSize: "~25KB",
    priority: "high",
    category: "landing"
  },
  SkillVisualization: {
    name: "Skill Visualization",
    description: "Interactive skill display with progress rings",
    estimatedSize: "~30KB",
    priority: "medium",
    category: "content"
  },
  ProjectShowcase: {
    name: "Project Showcase",
    description: "3D project cards with hover effects",
    estimatedSize: "~35KB",
    priority: "medium",
    category: "content"
  },
  ContactForm: {
    name: "Contact Form",
    description: "Advanced form with real-time validation",
    estimatedSize: "~40KB",
    priority: "low",
    category: "interaction"
  },
  FilterableProjectGallery: {
    name: "Project Gallery",
    description: "Filterable project gallery with isotope layout",
    estimatedSize: "~45KB",
    priority: "medium",
    category: "content"
  },
  InteractiveCodeSnippets: {
    name: "Code Snippets",
    description: "Syntax-highlighted code display",
    estimatedSize: "~30KB",
    priority: "low",
    category: "content"
  },
  TestimonialsCarousel: {
    name: "Testimonials",
    description: "Carousel with smooth transitions",
    estimatedSize: "~25KB",
    priority: "medium",
    category: "social-proof"
  },
  InteractiveTimeline: {
    name: "Career Timeline",
    description: "Interactive career journey timeline",
    estimatedSize: "~35KB",
    priority: "medium",
    category: "content"
  },
  ProfessionalAvatar: {
    name: "Professional Avatar",
    description: "Avatar with hover animations",
    estimatedSize: "~15KB",
    priority: "high",
    category: "identity"
  },
  DynamicTypingEffect: {
    name: "Typing Effect",
    description: "Dynamic typing animation",
    estimatedSize: "~20KB",
    priority: "high",
    category: "animation"
  },
  AnimationLibrary: {
    name: "Animation Library",
    description: "Comprehensive animation components and hooks",
    estimatedSize: "~25KB",
    priority: "medium",
    category: "animation"
  },
  AnimationLibraryDemo: {
    name: "Animation Library Demo",
    description: "Interactive demo of animation library features",
    estimatedSize: "~30KB",
    priority: "low",
    category: "demo"
  }
};

// Loading states and error boundaries
interface LoadingState {
  isLoading: boolean;
  error?: Error;
  loadTime?: number;
}

// Performance-optimized loading wrapper
interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
  onLoadStart?: () => void;
  onLoadComplete?: (loadTime: number) => void;
  onError?: (error: Error) => void;
  priority?: "high" | "medium" | "low";
  className?: string;
}

const LazyWrapper: React.FC<LazyWrapperProps> = ({
  children,
  fallback,
  errorFallback,
  onLoadStart,
  onLoadComplete,
  onError,
  priority = "medium",
  className
}) => {
  const [loadState, setLoadState] = useState<LoadingState>({ isLoading: true });

  useEffect(() => {
    const startTime = performance.now();
    onLoadStart?.();

    return () => {
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      onLoadComplete?.(loadTime);
    };
  }, [onLoadStart, onLoadComplete]);

  const defaultFallback = (
    <Card className={cn("animate-pulse", className)}>
      <CardContent className="p-8 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">Loading component...</p>
          <Badge variant="outline" className="text-xs">
            Priority: {priority}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );

  const defaultErrorFallback = (
    <Card className={cn("border-red-200 bg-red-50", className)}>
      <CardContent className="p-8 flex flex-col items-center justify-center space-y-4">
        <AlertCircle className="w-8 h-8 text-red-500" />
        <div className="text-center space-y-2">
          <p className="text-sm text-red-600">Failed to load component</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.location.reload()}
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      <div className={className}>
        {children}
      </div>
    </Suspense>
  );
};

// Enhanced error boundary for lazy loaded components
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

class LazyComponentErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode; onError?: (error: Error) => void },
  ErrorBoundaryState
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ error, errorInfo });
    this.props.onError?.(error);
    console.error('Lazy component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6 text-center space-y-4">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
            <div>
              <h3 className="font-medium text-red-800">Component Error</h3>
              <p className="text-sm text-red-600 mt-1">
                {this.state.error?.message || "An unexpected error occurred"}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => this.setState({ hasError: false })}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

// Intersection Observer hook for viewport-based loading
const useInViewport = (threshold = 0.1) => {
  const [ref, setRef] = useState<HTMLDivElement | null>(null);
  const [inViewport, setInViewport] = useState(false);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInViewport(entry.isIntersecting);
      },
      { threshold }
    );

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, threshold]);

  return { ref: setRef, inViewport };
};

// Performance metrics collector
interface PerformanceMetrics {
  componentName: string;
  loadTime: number;
  renderTime: number;
  priority: string;
  timestamp: number;
}

const usePerformanceMetrics = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics[]>([]);

  const recordMetric = (metric: PerformanceMetrics) => {
    setMetrics(prev => [...prev, metric].slice(-50)); // Keep last 50 metrics
  };

  const getAverageLoadTime = () => {
    if (metrics.length === 0) return 0;
    return metrics.reduce((sum, m) => sum + m.loadTime, 0) / metrics.length;
  };

  const getMetricsByPriority = (priority: string) => {
    return metrics.filter(m => m.priority === priority);
  };

  return {
    metrics,
    recordMetric,
    getAverageLoadTime,
    getMetricsByPriority
  };
};

// Main lazy portfolio loader component
export interface LazyPortfolioLoaderProps {
  componentName: keyof typeof COMPONENT_METADATA;
  loadOnViewport?: boolean;
  priority?: "high" | "medium" | "low";
  className?: string;
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
  onLoadComplete?: (metrics: PerformanceMetrics) => void;
  children?: React.ReactNode;
  [key: string]: any; // For component props
}

export const LazyPortfolioLoader: React.FC<LazyPortfolioLoaderProps> = ({
  componentName,
  loadOnViewport = true,
  priority = "medium",
  className,
  fallback,
  errorFallback,
  onLoadComplete,
  children,
  ...componentProps
}) => {
  const { ref, inViewport } = useInViewport(0.1);
  const { recordMetric } = usePerformanceMetrics();
  const [shouldLoad, setShouldLoad] = useState(!loadOnViewport);

  const metadata = COMPONENT_METADATA[componentName];

  useEffect(() => {
    if (loadOnViewport && inViewport) {
      setShouldLoad(true);
    }
  }, [loadOnViewport, inViewport]);

  const handleLoadComplete = (loadTime: number) => {
    const metrics: PerformanceMetrics = {
      componentName,
      loadTime,
      renderTime: performance.now(),
      priority,
      timestamp: Date.now()
    };
    
    recordMetric(metrics);
    onLoadComplete?.(metrics);
  };

  const renderComponent = () => {
    const componentMap = {
      HeroSection: LazyHeroSection,
      SkillVisualization: LazySkillVisualization,
      ProjectShowcase: LazyProjectShowcase,
      ContactForm: LazyContactForm,
      FilterableProjectGallery: LazyFilterableProjectGallery,
      InteractiveCodeSnippets: LazyInteractiveCodeSnippets,
      TestimonialsCarousel: LazyTestimonialsCarousel,
      InteractiveTimeline: LazyInteractiveTimeline,
      ProfessionalAvatar: LazyProfessionalAvatar,
      DynamicTypingEffect: LazyDynamicTypingEffect,
      AnimationLibrary: LazyAnimationLibrary,
      AnimationLibraryDemo: LazyAnimationLibraryDemo
    };

    const Component = componentMap[componentName];
    
    if (!Component) {
      return (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
            <p className="text-sm text-yellow-800">Component not found: {componentName}</p>
          </CardContent>
        </Card>
      );
    }

    return <Component {...componentProps} />;
  };

  const customFallback = (
    <Card className={cn("", className)}>
      <CardContent className="p-8 flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <div className="absolute inset-0 w-8 h-8 border-2 border-primary/20 rounded-full animate-pulse" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="font-medium">{metadata?.name}</h3>
          <p className="text-sm text-muted-foreground">{metadata?.description}</p>
          <div className="flex items-center gap-2 justify-center">
            <Badge variant="outline" className="text-xs gap-1">
              <Package className="w-3 h-3" />
              {metadata?.estimatedSize}
            </Badge>
            <Badge variant="outline" className="text-xs gap-1">
              <Zap className="w-3 h-3" />
              {priority}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (!shouldLoad && loadOnViewport) {
    return (
      <div ref={ref} className={className}>
        <Card className="border-dashed border-2">
          <CardContent className="p-8 text-center space-y-4">
            <Eye className="w-8 h-8 text-muted-foreground mx-auto" />
            <div>
              <h3 className="font-medium text-muted-foreground">{metadata?.name}</h3>
              <p className="text-sm text-muted-foreground">{metadata?.description}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShouldLoad(true)}
                className="mt-4 gap-2"
              >
                <Download className="w-4 h-4" />
                Load Component
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div ref={ref} className={className}>
      <LazyComponentErrorBoundary fallback={errorFallback}>
        <LazyWrapper
          fallback={fallback || customFallback}
          priority={priority}
          onLoadComplete={handleLoadComplete}
          className={className}
        >
          {renderComponent()}
        </LazyWrapper>
      </LazyComponentErrorBoundary>
    </div>
  );
};

// Performance dashboard component
export interface PerformanceDashboardProps {
  metrics: PerformanceMetrics[];
  className?: string;
}

export const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({
  metrics,
  className
}) => {
  const averageLoadTime = metrics.length > 0 
    ? metrics.reduce((sum, m) => sum + m.loadTime, 0) / metrics.length 
    : 0;

  const priorityStats = {
    high: metrics.filter(m => m.priority === 'high'),
    medium: metrics.filter(m => m.priority === 'medium'),
    low: metrics.filter(m => m.priority === 'low')
  };

  return (
    <Card className={className}>
      <CardContent className="p-6 space-y-4">
        <h3 className="font-semibold flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Performance Metrics
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-primary">
              {averageLoadTime.toFixed(0)}ms
            </div>
            <div className="text-sm text-muted-foreground">Avg Load Time</div>
          </div>
          
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {metrics.length}
            </div>
            <div className="text-sm text-muted-foreground">Components Loaded</div>
          </div>
          
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {priorityStats.high.length}
            </div>
            <div className="text-sm text-muted-foreground">High Priority</div>
          </div>
        </div>

        {/* Recent loads */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Recent Loads
          </h4>
          <div className="space-y-1 max-h-32 overflow-auto">
            {metrics.slice(-5).reverse().map((metric, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span>{metric.componentName}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {metric.loadTime.toFixed(0)}ms
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {metric.priority}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Export component interfaces
export interface LazyPortfolioLoaderInterface {
  componentName: keyof typeof COMPONENT_METADATA;
  loadOnViewport?: boolean;
  priority?: "high" | "medium" | "low";
  className?: string;
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
  onLoadComplete?: (metrics: PerformanceMetrics) => void;
  children?: React.ReactNode;
}

export default LazyPortfolioLoader;