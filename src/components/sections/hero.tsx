import { Button } from "@/components/ui/button";
import { ChevronRight, Download, MapPin, Calendar } from "lucide-react";

export const Hero = () => {
  const handleDownloadCV = () => {
    const link = document.createElement('a');
    link.href = '/Mounir_CV_2025.pdf';
    link.download = 'Mounir_Abderrahmani_CV_2025.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center bg-gradient-subtle px-6 py-16">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div className="text-center lg:text-left space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-medium mb-4 backdrop-blur-sm">
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
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-medium text-muted-foreground">
                Senior Full-Stack Developer & Software Architect
              </h2>
              <div className="flex items-center gap-4 justify-center lg:justify-start text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>Algeria • Remote</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>10+ Years Experience</span>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
            Transforming complex business challenges into elegant digital solutions. 
            Specialized in <span className="text-primary font-semibold">React, Node.js, and enterprise integrations</span> 
            with a proven track record of delivering 
            <span className="text-primary font-semibold"> scalable systems</span> that drive measurable business growth.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
            <Button 
              size="lg" 
              className="text-lg px-10 py-4 shadow-glow hover:shadow-large transition-all duration-300 hover:scale-105" 
              onClick={() => document.querySelector('#projects')?.scrollIntoView({behavior:'smooth'})}
            >
              <span>View My Work</span>
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-10 py-4 hover:bg-primary/5 transition-all duration-300 hover:scale-105"
              onClick={handleDownloadCV}
            >
              <Download className="mr-2 h-5 w-5" />
              <span>Download CV</span>
            </Button>
          </div>
          
          <div className="flex items-center gap-6 pt-8 justify-center lg:justify-start">
            <div className="text-center group">
              <div className="text-2xl font-bold text-primary group-hover:scale-110 transition-transform">10+</div>
              <div className="text-sm text-muted-foreground">Years</div>
            </div>
            <div className="w-px h-12 bg-border"></div>
            <div className="text-center group">
              <div className="text-2xl font-bold text-primary group-hover:scale-110 transition-transform">150+</div>
              <div className="text-sm text-muted-foreground">Projects</div>
            </div>
            <div className="w-px h-12 bg-border"></div>
            <div className="text-center group">
              <div className="text-2xl font-bold text-primary group-hover:scale-110 transition-transform">10K+</div>
              <div className="text-sm text-muted-foreground">Users Served</div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center lg:justify-end">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-primary rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
            <div className="relative">
              <img 
                src="/profile.webp" 
                alt="Mounir Abderrahmani - Senior Full-Stack Developer"
                className="relative w-full max-w-lg rounded-3xl shadow-large hover:shadow-glow transition-all duration-500 group-hover:scale-105 object-cover aspect-square"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent rounded-3xl"></div>
              
              {/* Professional badge overlay */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-background/90 backdrop-blur-md rounded-2xl p-4 border border-border/50 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <div>
                      <div className="font-semibold text-sm">Currently Available</div>
                      <div className="text-xs text-muted-foreground">Open to new opportunities</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};