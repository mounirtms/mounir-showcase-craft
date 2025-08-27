import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  Zap, 
  Star, 
  Heart, 
  Eye, 
  Clock,
  Layers,
  Target,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  MousePointer
} from "lucide-react";
import { cn } from "@/lib/utils";

// Import animation components
import { 
  Animation,
  ScrollAnimation,
  Parallax,
  StaggeredAnimation,
  SequenceAnimation,
  useAnimation,
  useScrollAnimation,
  useParallax
} from "./AnimationLibrary";

// Demo card component
const DemoCard: React.FC<{
  title: string;
  description: string;
  children: React.ReactNode;
  animationType?: any;
}> = ({ title, description, children, animationType = "slideUp" }) => {
  return (
    <ScrollAnimation animation={animationType} config={{ delay: 200 }}>
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

// Animation types for selection
const animationTypes = [
  "fadeIn", "fadeOut", "slideUp", "slideDown", "slideLeft", "slideRight", 
  "scaleUp", "scaleDown", "rotateIn", "rotateOut", "bounce", "pulse", 
  "shake", "flip", "flipInX", "flipInY", "zoomIn", "zoomOut"
];

// Parallax configurations
const parallaxConfigs = [
  { speed: 0.3, direction: "up" as const, label: "Slow Up" },
  { speed: 0.8, direction: "down" as const, label: "Fast Down" },
  { speed: 0.5, direction: "left" as const, label: "Medium Left" },
  { speed: 0.6, direction: "right" as const, label: "Medium Right" }
];

// Main demo component
export const AnimationLibraryDemo: React.FC = () => {
  const [selectedAnimation, setSelectedAnimation] = useState<string>("fadeIn");
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Demo sections for navigation
  const demoSections = [
    { id: "hero", title: "Hero", icon: <Sparkles className="w-4 h-4" /> },
    { id: "animations", title: "Animations", icon: <Zap className="w-4 h-4" /> },
    { id: "parallax", title: "Parallax", icon: <Layers className="w-4 h-4" /> },
    { id: "staggered", title: "Staggered", icon: <Target className="w-4 h-4" /> },
    { id: "sequence", title: "Sequence", icon: <Clock className="w-4 h-4" /> }
  ];

  // Scroll to section function
  const scrollTo = (id: string, offset = 0) => {
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen">
      {/* Fixed Navigation */}
      <nav className="fixed top-4 right-4 z-40 bg-background/95 backdrop-blur-sm border rounded-lg p-2 space-y-1">
        {demoSections.map((section) => (
          <Button
            key={section.id}
            variant="ghost"
            size="sm"
            onClick={() => scrollTo(section.id, 80)}
            className="w-full justify-start gap-2"
          >
            {section.icon}
            {section.title}
          </Button>
        ))}
      </nav>

      {/* Hero Section */}
      <section 
        id="hero" 
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
      >
        {/* Parallax Background Elements */}
        <Parallax config={{ speed: 0.2, direction: "up" }}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500 rounded-full blur-xl" />
            <div className="absolute top-40 right-32 w-24 h-24 bg-purple-500 rounded-full blur-lg" />
            <div className="absolute bottom-32 left-1/3 w-28 h-28 bg-pink-500 rounded-full blur-xl" />
          </div>
        </Parallax>

        <Parallax config={{ speed: 0.1, direction: "down" }}>
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-60 right-20 w-40 h-40 bg-indigo-500 rounded-full blur-2xl" />
            <div className="absolute bottom-40 right-1/4 w-36 h-36 bg-cyan-500 rounded-full blur-xl" />
          </div>
        </Parallax>

        <div className="relative z-10 text-center space-y-8 max-w-4xl mx-auto px-4">
          <ScrollAnimation animation="fadeIn" config={{ delay: 300 }}>
            <h1 className="text-6xl lg:text-8xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Animation Library
            </h1>
          </ScrollAnimation>

          <ScrollAnimation animation="slideUp" config={{ delay: 600 }}>
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Experience a comprehensive collection of animations and effects for your portfolio
            </p>
          </ScrollAnimation>

          <ScrollAnimation animation="scaleUp" config={{ delay: 900 }}>
            <div className="flex flex-wrap gap-4 justify-center">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <Sparkles className="w-5 h-5 mr-2" />
                18+ Animations
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
            >
              Explore Animations
              <ArrowDown className="w-5 h-5 ml-2 group-hover:translate-y-1 transition-transform" />
            </Button>
          </ScrollAnimation>
        </div>

        {/* Scroll Indicator */}
        <ScrollAnimation animation="fadeIn" config={{ delay: 1500 }}>
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="animate-bounce">
              <MousePointer className="w-6 h-6 text-muted-foreground" />
            </div>
          </div>
        </ScrollAnimation>
      </section>

      {/* Animation Types Section */}
      <section id="animations" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollAnimation animation="slideUp">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Animation Types</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Choose from a variety of animation effects to bring your content to life
              </p>
            </div>
          </ScrollAnimation>

          {/* Animation Type Selector */}
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
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>
          </ScrollAnimation>

          {/* Animation Examples Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <DemoCard
              title="Fade Effects"
              description="Smooth opacity transitions"
              animationType={selectedAnimation}
            >
              <div className="space-y-4">
                <div className="h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                  <Eye className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Perfect for revealing content with subtle elegance
                </p>
              </div>
            </DemoCard>

            <DemoCard
              title="Slide Animations"
              description="Directional movement effects"
              animationType={selectedAnimation}
            >
              <div className="space-y-4">
                <div className="h-32 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                  <ArrowUp className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Great for creating directional movement and energy
                </p>
              </div>
            </DemoCard>

            <DemoCard
              title="Scale Transformations"
              description="Size-based animations"
              animationType={selectedAnimation}
            >
              <div className="space-y-4">
                <div className="h-32 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                  <Target className="w-8 h-8 text-purple-600" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Adds dynamic scaling effect for emphasis
                </p>
              </div>
            </DemoCard>
          </div>
        </div>
      </section>

      {/* Parallax Effects Section */}
      <section id="parallax" className="relative py-20 overflow-hidden">
        {/* Parallax Background */}
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

      {/* Staggered Animations Section */}
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

          {/* Staggered Cards */}
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

          {/* Staggered Icons */}
          <ScrollAnimation animation="slideUp" config={{ delay: 600 }}>
            <div className="mt-16">
              <h3 className="text-center text-2xl font-semibold mb-8">Icon Showcase</h3>
              <StaggeredAnimation staggerDelay={100} animation="rotateIn">
                {[
                  <Sparkles className="w-16 h-16 text-yellow-500" />,
                  <Zap className="w-16 h-16 text-blue-500" />,
                  <Star className="w-16 h-16 text-purple-500" />,
                  <Heart className="w-16 h-16 text-red-500" />,
                  <Eye className="w-16 h-16 text-green-500" />,
                  <Clock className="w-16 h-16 text-orange-500" />
                ].map((icon, i) => (
                  <div key={i} className="inline-block mx-8 p-4">
                    {icon}
                  </div>
                ))}
              </StaggeredAnimation>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Sequence Animations Section */}
      <section id="sequence" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollAnimation animation="slideUp">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Sequence Animations</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Elements animate in a predefined sequence for storytelling
              </p>
            </div>
          </ScrollAnimation>

          <div className="flex justify-center">
            <Card className="w-full max-w-2xl">
              <CardContent className="p-8">
                <SequenceAnimation 
                  sequenceDelay={500}
                  animations={["fadeIn", "slideUp", "scaleUp"]}
                >
                  <div className="text-center space-y-6">
                    <h3 className="text-2xl font-bold">Step-by-Step Process</h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-100 rounded-lg">
                        <h4 className="font-semibold">1. Planning</h4>
                        <p className="text-sm text-muted-foreground">Define project scope and requirements</p>
                      </div>
                      <div className="p-4 bg-green-100 rounded-lg">
                        <h4 className="font-semibold">2. Design</h4>
                        <p className="text-sm text-muted-foreground">Create wireframes and visual designs</p>
                      </div>
                      <div className="p-4 bg-purple-100 rounded-lg">
                        <h4 className="font-semibold">3. Development</h4>
                        <p className="text-sm text-muted-foreground">Implement features and functionality</p>
                      </div>
                      <div className="p-4 bg-orange-100 rounded-lg">
                        <h4 className="font-semibold">4. Testing</h4>
                        <p className="text-sm text-muted-foreground">Validate and ensure quality</p>
                      </div>
                      <div className="p-4 bg-cyan-100 rounded-lg">
                        <h4 className="font-semibold">5. Deployment</h4>
                        <p className="text-sm text-muted-foreground">Launch to production environment</p>
                      </div>
                    </div>
                  </div>
                </SequenceAnimation>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Navigation Section */}
      <section id="navigation" className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <ScrollAnimation animation="slideUp">
            <div className="space-y-8">
              <h2 className="text-4xl font-bold">Smooth Navigation</h2>
              <p className="text-xl text-muted-foreground">
                Experience buttery-smooth scrolling to any section of the page
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {demoSections.slice(0, -1).map((section) => (
                  <Button
                    key={section.id}
                    variant="outline"
                    size="lg"
                    onClick={() => scrollTo(section.id, 80)}
                    className="gap-2"
                  >
                    {section.icon}
                    {section.title}
                  </Button>
                ))}
              </div>

              <div className="pt-8">
                <Button size="lg" onClick={scrollToTop} className="gap-2">
                  <ArrowUp className="w-5 h-5" />
                  Back to Top
                </Button>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-muted/50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <ScrollAnimation animation="fadeIn">
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Built with React, TypeScript, and Web Animations API
              </p>
              <div className="flex justify-center items-center gap-2 text-sm text-muted-foreground">
                <span>Animation Library v1.0</span>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </footer>
    </div>
  );
};

export default AnimationLibraryDemo;