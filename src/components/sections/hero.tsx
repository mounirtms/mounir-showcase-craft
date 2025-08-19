import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export const Hero = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center bg-gradient-subtle px-6 py-16">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div className="text-center lg:text-left space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-medium mb-4">
              <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></span>
              Available for new opportunities
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Mounir
              </span>
              <br />
              <span className="text-foreground/80">Abderrahmani</span>
            </h1>
            <h2 className="text-2xl md:text-3xl font-medium text-muted-foreground">
              Senior Full-Stack Developer
            </h2>
          </div>
          
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
            Crafting exceptional digital experiences with 
            <span className="text-primary font-semibold"> 10+ years</span> of expertise. 
            Specialized in React, Node.js, and enterprise systems that drive 
            <span className="text-primary font-semibold"> measurable business impact</span>.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
            <Button size="lg" className="text-lg px-10 py-4 shadow-glow hover:shadow-large transition-all duration-300 hover:scale-105">
              <span>View My Work</span>
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-10 py-4 hover:bg-primary/5 transition-all duration-300">
              Download Resume
            </Button>
          </div>
          
          <div className="flex items-center gap-6 pt-8 justify-center lg:justify-start">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">10+</div>
              <div className="text-sm text-muted-foreground">Years</div>
            </div>
            <div className="w-px h-12 bg-border"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">100+</div>
              <div className="text-sm text-muted-foreground">Projects</div>
            </div>
            <div className="w-px h-12 bg-border"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">5K+</div>
              <div className="text-sm text-muted-foreground">Users Reached</div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center lg:justify-end">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-primary rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
            <img 
              src="/src/assets/hero-workspace.jpg" 
              alt="Professional developer workspace showcasing modern development environment"
              className="relative w-full max-w-lg rounded-3xl shadow-large hover:shadow-glow transition-all duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent rounded-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};