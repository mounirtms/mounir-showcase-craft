import React from 'react';
import { Mail, Phone, Linkedin, Github, MapPin } from "lucide-react";

// Core Components
import { Navigation } from "../components/ui/navigation";
import { Skills } from "../components/sections/skills";
import { Projects } from "../components/sections/projects";
import { Experience } from "../components/sections/experience";
import { Hero } from "../components/sections/hero";
import { ContactSection } from "../components/portfolio/ContactSection";

// Define type for dataLayer
interface DataLayerEvent {
  event: string;
  [key: string]: string | number | boolean | undefined;
}

/**
 * Professional Portfolio Homepage
 * @author Mounir Abderrahmani
 * @description Modern, responsive portfolio showcasing full-stack development expertise
 */
const HomePage = () => {
  // Analytics tracking
  const pushToDataLayer = (eventData: DataLayerEvent) => {
    if (typeof window !== 'undefined' && (window as unknown as { dataLayer: DataLayerEvent[] }).dataLayer) {
      (window as unknown as { dataLayer: DataLayerEvent[] }).dataLayer.push(eventData);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      <main className="container mx-auto px-4">
        {/* Hero Section */}
        <section id="hero" className="py-20 lg:py-32">
          <Hero />
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-16">
          <Skills />
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-16 bg-muted/30 rounded-2xl my-8">
          <div className="px-6">
            <Projects />
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="py-16">
          <Experience />
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16">
          <ContactSection />
        </section>
      </main>

      {/* Professional Footer */}
      <footer className="border-t border-border/50 py-12 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start space-x-3 text-2xl font-bold text-foreground mb-3">
                <img src="/mounir-icon.svg" alt="Mounir Abderrahmani" className="w-10 h-10 rounded-full" />
                <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  Mounir Abderrahmani
                </span>
              </div>
              <p className="text-muted-foreground max-w-lg leading-relaxed mb-4">
                Senior Full-Stack Developer & Solution Architect specializing in modern web technologies,
                scalable applications, and innovative digital solutions.
              </p>
              <div className="flex items-center justify-center lg:justify-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Algiers, Algeria • Available Worldwide</span>
              </div>
            </div>
            
            <div className="flex flex-col items-center lg:items-end gap-4">
              <div className="flex gap-3">
                <a 
                  href="mailto:mounir.a@gmail.com" 
                  className="text-primary hover:text-primary/80 transition-colors track-click"
                  aria-label="Email me"
                  onClick={() => {
                    pushToDataLayer({
                      event: 'footer_link_click',
                      link: 'email'
                    });
                  }}
                >
                  <Mail className="h-5 w-5" />
                </a>
                <a 
                  href="tel:+213555123456" 
                  className="text-primary hover:text-primary/80 transition-colors track-click"
                  aria-label="Call me"
                  onClick={() => {
                    pushToDataLayer({
                      event: 'footer_link_click',
                      link: 'phone'
                    });
                  }}
                >
                  <Phone className="h-5 w-5" />
                </a>
                <a 
                  href="https://linkedin.com/in/mounir" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 transition-colors track-click"
                  aria-label="LinkedIn profile"
                  onClick={() => {
                    pushToDataLayer({
                      event: 'footer_link_click',
                      link: 'linkedin'
                    });
                  }}
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a 
                  href="https://github.com/mounir" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 transition-colors track-click"
                  aria-label="GitHub profile"
                  onClick={() => {
                    pushToDataLayer({
                      event: 'footer_link_click',
                      link: 'github'
                    });
                  }}
                >
                  <Github className="h-5 w-5" />
                </a>
              </div>
              
              <div className="text-center lg:text-right">
                <div className="text-xs text-muted-foreground mb-2">
                  Let's build something amazing together
                </div>
                <a href="mailto:mounir.webdev@gmail.com" 
                   className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                  mounir.webdev@gmail.com
                </a>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-border/30 text-center">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Mounir Abderrahmani. Crafted with ❤️ using React & TypeScript
              </p>
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span className="hover:text-foreground transition-colors cursor-pointer">Privacy</span>
                <span className="hover:text-foreground transition-colors cursor-pointer">Terms</span>
                <span className="hover:text-foreground transition-colors cursor-pointer">Sitemap</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;