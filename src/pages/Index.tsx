import { Navigation } from "@/components/ui/navigation";
import { EnhancedPortfolioIntegration } from "@/components/portfolio";
import { Signature } from "@/components/ui/signature";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SkipLinks } from "@/components/shared/AccessibleComponents";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { ExternalLink, Mail, Phone, Linkedin, Github } from "lucide-react";

const Index = () => {
  const { skipLinks } = useAccessibility();
  
  // Define skip links for navigation
  const defaultSkipLinks = [
    { id: 'main-navigation', label: 'Skip to Navigation', target: 'main-navigation' },
    { id: 'main-content', label: 'Skip to Main Content', target: 'main-content' },
    { id: 'contact-section', label: 'Skip to Contact', target: 'contact-section' }
  ];
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Skip Links for Accessibility */}
      <SkipLinks links={skipLinks.length > 0 ? skipLinks : defaultSkipLinks} />
      
      <div id="main-navigation">
        <Navigation />
      </div>
      
      {/* Enhanced Portfolio Integration */}
      <main id="main-content">
        <EnhancedPortfolioIntegration 
          className="relative"
        />
      </main>
      
      {/* Professional Footer */}
      <footer id="contact-section" className="py-16 px-6 bg-gradient-to-br from-card/30 via-card/50 to-card/30 backdrop-blur-sm border-t border-border/50">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Contact CTA */}
          <div className="text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent font-heading tracking-tight">
              Ready to Build Something Amazing?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-sans leading-relaxed">
              Let's transform your ideas into scalable, high-performance solutions that drive real business results.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button size="lg" className="shadow-glow hover:shadow-large transition-all duration-300" asChild>
                <a href="mailto:mounir.webdev@gmail.com" className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Start a Conversation
                </a>
              </Button>
              
              <div className="flex gap-4">
                <Button variant="outline" size="sm" asChild>
                  <a href="https://linkedin.com/in/mounir1badi" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href="https://github.com/mounir1" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <Github className="w-4 h-4" />
                    GitHub
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href="tel:+213674094855" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Call
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Featured Work */}
          <div className="grid gap-6">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2 font-heading">Recent Collaborations</h3>
              <p className="text-muted-foreground mb-6 font-sans">Explore some of my latest professional projects</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-primary font-heading">Enterprise Solutions</h4>
                <div className="flex flex-wrap gap-2 text-sm">
                  <a
                    href="https://hotech.systems"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1 border rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors text-xs font-sans"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Hotech Systems
                  </a>
                  <a
                    href="https://technostationery.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1 border rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors text-xs font-sans"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Techno Stationery
                  </a>
                  <a
                    href="https://etl.techno-dz.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1 border rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors text-xs font-sans"
                  >
                    <ExternalLink className="w-3 h-3" />
                    ETL Platform
                  </a>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-primary font-heading">Web Applications</h4>
                <div className="flex flex-wrap gap-2 text-sm">
                  <a
                    href="https://jskit-app.web.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1 border rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors text-xs font-sans"
                  >
                    <ExternalLink className="w-3 h-3" />
                    JSKit Developer Tools
                  </a>
                  <a
                    href="https://www.nooralmaarifa.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1 border rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors text-xs font-sans"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Noor Al Maarifa
                  </a>
                  <a
                    href="https://it-collaborator-techno.web.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1 border rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors text-xs font-sans"
                  >
                    <ExternalLink className="w-3 h-3" />
                    IT Collaborator
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Signature and Copyright */}
          <div className="pt-8 border-t border-border/50 space-y-6">
            <div className="flex justify-center">
              <Signature size="lg" className="text-primary hover:scale-105 transition-transform duration-300" />
            </div>
            
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground font-sans">
                &copy; 2025 Mounir Abderrahmani. Crafted with passion using modern web technologies.
              </p>
              <p className="text-xs text-muted-foreground/70 font-sans">
                Built with React, TypeScript, Tailwind CSS, and Firebase • Optimized for Performance & Accessibility
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

