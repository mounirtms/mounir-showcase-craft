import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollAnimation } from "./ScrollAnimations";
import { Parallax, StaggeredAnimation } from "./AnimationLibrary";
import { 
  ArrowDown, 
  ArrowUp, 
  Sparkles, 
  Zap, 
  Star, 
  Heart,
  Eye,
  Clock,
  Target,
  Layers,
  Navigation,
  MousePointer,
  Scroll
} from "lucide-react";
import { cn } from "@/lib/utils";

// Data for demo sections
const demoSections = [
  { id: "hero", title: "Hero Section", icon: <Star className="w-4 h-4" /> },
  { id: "animations", title: "Scroll Animations", icon: <Zap className="w-4 h-4" /> },
  { id: "parallax", title: "Parallax Effects", icon: <Layers className="w-4 h-4" /> },
  { id: "staggered", title: "Staggered Animations", icon: <Target className="w-4 h-4" /> },
  { id: "advanced", title: "Advanced Examples", icon: <Sparkles className="w-4 h-4" /> },
  { id: "navigation", title: "Smooth Navigation", icon: <Navigation className="w-4 h-4" /> }
];

// Reusable DemoCard component
const DemoCard: React.FC<{
  title: string;
  description: string;
  children: React.ReactNode;
  animation?: "fadeIn" | "slideUp" | "slideDown" | "slideLeft" | "slideRight" | "scaleUp" | "rotateIn";
}> = ({ title, description, children, animation = "slideUp" }) => {
  return (
    <ScrollAnimation animation={animation} config={{ delay: 200 }}>
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </ScrollAnimation>
  );
};

// Hero Section Component
const HeroSectionDemo: React.FC<{ scrollTo: (id: string, offset: number) => void }> = ({ scrollTo }) => {
  const elementRef = React.useRef<HTMLDivElement>(null);

  return (
    <section 
      id="hero" 
      ref={elementRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
    >
      {/* Performance Note: Use parallax with care. Too many elements can impact performance. */}
      <Parallax config={{ speed: 0.2, direction: "up" }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500 rounded-full blur-xl" />
          <div className="absolute top-40 right-32 w-24 h-24 bg-purple-500 rounded-full blur-lg" />
          <div className="absolute bottom-32 left-1/3 w-28 h-28 bg-pink-500 rounded-full blur-xl" />
        </div>
      </Parallax>

      <div className="relative z-10 text-center space-y-8 max-w-4xl mx-auto px-4">
        <ScrollAnimation animation="fadeIn" config={{ delay: 300 }}>
          <h1 className="text-6xl lg:text-8xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Scroll Magic
          </h1>
        </ScrollAnimation>

        <ScrollAnimation animation="slideUp" config={{ delay: 600 }}>
          <p className="text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Experience smooth scroll animations and mesmerizing parallax effects that bring your content to life
          </p>
        </ScrollAnimation>

        <ScrollAnimation animation="scaleUp" config={{ delay: 900 }}>
          <div className="flex flex-wrap gap-4 justify-center">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Scroll className="w-5 h-5 mr-2" />
              Smooth Scrolling
            </Badge>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Layers className="w-5 h-5 mr-2" />
              Parallax Effects
            </Badge>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Zap className="w-5 h-5 mr-2" />
              Scroll Animations
            </Badge>
          </div>
        </ScrollAnimation>

        <ScrollAnimation animation="fadeIn" config={{ delay: 1200 }}>
          <Button 
            size="lg" 
            onClick={() => scrollTo("animations", 80)}
            className="group text-lg px-8 py-4"
            aria-label="Explore scroll animations"
          >
            Explore Animations
            <ArrowDown className="w-5 h-5 ml-2 group-hover:translate-y-1 transition-transform" />
          </Button>
        </ScrollAnimation>
      </div>

      <ScrollAnimation animation="fadeIn" config={{ delay: 1500 }}>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="animate-bounce">
            <MousePointer className="w-6 h-6 text-muted-foreground" />
          </div>
        </div>
      </ScrollAnimation>
    </section>
  );
};

// Animations Section Component
const AnimationsSection: React.FC = () => {
  const [selectedAnimation, setSelectedAnimation] = useState<string>("slideUp");
  const animationTypes = [
    "fadeIn", "slideUp", "slideDown", "slideLeft", "slideRight", "scaleUp", "rotateIn"
  ];

  return (
    <section id="animations" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <ScrollAnimation animation="slideUp">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Scroll-Triggered Animations</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Elements come to life as you scroll through the page with various animation types
            </p>
          </div>
        </ScrollAnimation>

        <ScrollAnimation animation="fadeIn" config={{ delay: 300 }}>
          <div className="text-center mb-12">
            <h3 className="text-lg font-semibold mb-4">Try Different Animation Types:</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {animationTypes.map((type) => (
                <Button
                  key={type}
                  variant={selectedAnimation === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedAnimation(type)}
                  aria-label={`Select ${type} animation`}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <DemoCard
            title="Fade In"
            description="Elements smoothly fade into view"
            animation={selectedAnimation as any}
          >
            <div className="h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
              <Eye className="w-8 h-8 text-blue-600" />
            </div>
          </DemoCard>

          <DemoCard
            title="Slide Up"
            description="Content slides up from below"
            animation={selectedAnimation as any}
          >
            <div className="h-32 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
              <ArrowUp className="w-8 h-8 text-green-600" />
            </div>
          </DemoCard>

          <DemoCard
            title="Scale Up"
            description="Elements grow into view"
            animation={selectedAnimation as any}
          >
            <div className="h-32 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
              <Target className="w-8 h-8 text-purple-600" />
            </div>
          </DemoCard>
        </div>
      </div>
    </section>
  );
};

// Parallax Section Component
const ParallaxSection: React.FC = () => {
  const parallaxConfigs = [
    { speed: 0.3, direction: "up" as const, label: "Slow Up" },
    { speed: 0.8, direction: "down" as const, label: "Fast Down" },
    { speed: 0.5, direction: "left" as const, label: "Medium Left" },
    { speed: 0.6, direction: "right" as const, label: "Medium Right" }
  ];

  return (
    <section id="parallax" className="relative py-20 overflow-hidden">
      <Parallax config={{ speed: 0.3, direction: "up" }}>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-10" />
      </Parallax>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <ScrollAnimation animation="slideUp">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Parallax Effects</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Create depth and immersion with elements that move at different speeds
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {parallaxConfigs.map((config, index) => (
            <ScrollAnimation key={index} animation="slideUp" config={{ delay: index * 200 }}>
              <Card className="relative overflow-hidden">
                <Parallax config={config}>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-purple-200 opacity-50" />
                </Parallax>
                <CardContent className="relative z-10 p-6">
                  <div className="text-center space-y-4">
                    <Layers className="w-12 h-12 mx-auto text-primary" />
                    <h3 className="font-semibold">{config.label}</h3>
                    <p className="text-sm text-muted-foreground">
                      Speed: {config.speed}x<br />
                      Direction: {config.direction}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  );
};

// Staggered Section Component
const StaggeredSection: React.FC = () => (
  <section id="staggered" className="py-20 bg-muted/30">
    <div className="max-w-7xl mx-auto px-4">
      <ScrollAnimation animation="slideUp">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Staggered Animations</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Elements animate in sequence, creating a wave-like effect
          </p>
        </div>
      </ScrollAnimation>

      <StaggeredAnimation staggerDelay={150} animation="scaleUp">
        {Array.from({ length: 6 }, (_, i) => (
          <Card key={i} className="mb-4">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-semibold">Staggered Item {i + 1}</h3>
                  <p className="text-sm text-muted-foreground">
                    This item animates with a {i * 150}ms delay
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </StaggeredAnimation>
    </div>
  </section>
);

// Main demo component
export const ScrollAnimationsDemo: React.FC = () => {
  const scrollTo = (id: string, offset: number = 0) => {
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen">

      <nav className="fixed top-4 right-4 z-40 bg-background/95 backdrop-blur-sm border rounded-lg p-2 space-y-1">
        {demoSections.map((section) => (
          <Button
            key={section.id}
            variant={activeSection === section.id ? "default" : "ghost"}
            size="sm"
            onClick={() => scrollTo(section.id, 80)}
            className="w-full justify-start gap-2"
          >
            {section.icon}
            {section.title}
          </Button>
        ))}
      </nav>

      <HeroSectionDemo scrollTo={scrollTo} />
      <AnimationsSection />
      <ParallaxSection />
      <StaggeredSection />

      <footer className="py-12 bg-muted/50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <ScrollAnimation animation="fadeIn">
            <p className="text-muted-foreground">
              Built with React, TypeScript, and Intersection Observer API
            </p>
          </ScrollAnimation>
        </div>
      </footer>
    </div>
  );
};

export default ScrollAnimationsDemo;