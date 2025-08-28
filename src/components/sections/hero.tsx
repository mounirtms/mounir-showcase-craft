import { Button } from "@/components/ui/button";
import { ChevronRight, Download } from "lucide-react";
import { trackButtonClick } from "@/utils/analytics";

export const Hero = () => {
  const handleDownloadCV = () => {
    trackButtonClick('download_cv', { 
      location: 'hero_section',
      button_type: 'download'
    });
    
    const link = document.createElement('a');
    link.href = '/Mounir_CV_2025.pdf';
    link.download = 'Mounir_Abderrahmani_CV_2025.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewWork = () => {
    trackButtonClick('view_work', { 
      location: 'hero_section',
      button_type: 'cta'
    });
    
    document.querySelector('#projects')?.scrollIntoView({behavior:'smooth'});
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center py-20">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          {/* Profile Image */}
          <div className="relative mx-auto w-32 h-32 sm:w-40 sm:h-40 mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-xl opacity-50 animate-pulse" />
            <div className="relative bg-white dark:bg-gray-900 rounded-full p-2 shadow-2xl">
              <img 
                src="/profile.webp" 
                alt="Mounir Abderrahmani" 
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                  Mounir Abderrahmani
                </span>
              </h1>
              
              <div className="text-xl sm:text-2xl lg:text-3xl text-muted-foreground font-medium">
                Full-Stack Developer & Data Engineer
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
              onClick={handleViewWork}
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
              <div className="text-2xl font-bold text-primary">5+</div>
              <div className="text-sm text-muted-foreground">Years Experience</div>
            </div>
            <div className="w-px h-12 bg-border"></div>
            <div className="text-center group">
              <div className="text-2xl font-bold text-primary">50+</div>
              <div className="text-sm text-muted-foreground">Projects Completed</div>
            </div>
            <div className="w-px h-12 bg-border"></div>
            <div className="text-center group">
              <div className="text-2xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};