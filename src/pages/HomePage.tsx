import React from 'react';
import { ExternalLink, Mail, Phone, Linkedin, Github, MapPin } from "lucide-react";

// UI Components
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Navigation } from "../components/ui/navigation";
import { Signature, ProfessionalSignature } from "../components/ui/signature";
import { SkipLinks } from "../components/shared/AccessibleComponents";
import { useAccessibility } from "../contexts/AccessibilityContext";
import { EnhancedPortfolioIntegration } from "../components/portfolio";
import { ThemeToggle } from "../components/theme/theme-toggle";
import { Skills } from "../components/sections/skills";
import { Projects } from "../components/sections/projects";
import { Experience } from "../components/sections/experience";
import { Hero } from "../components/sections/hero";
import { ContactSection } from "../components/portfolio/ContactSection";

const HomePage = () => {
  const { skipLinks } = useAccessibility();

  // Define skip links for navigation
  const defaultSkipLinks = [
    { id: 'main-navigation', label: 'Skip to Navigation', target: 'main-navigation' },
    { id: 'main-content', label: 'Skip to Main Content', target: 'main-content' },
    { id: 'contact-section', label: 'Skip to Contact', target: 'contact-section' }
  ];

  // Combine default and custom skip links
  const allSkipLinks = [...defaultSkipLinks, ...(skipLinks || [])];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Skip Links for Accessibility */}
      <SkipLinks links={allSkipLinks} />
      
      {/* Navigation */}
      <Navigation />
      
      <main id="main-content" className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section id="hero" className="text-center py-16 md:py-24">
          <Hero />
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-12 md:py-20">
          <div className="max-w-6xl mx-auto">
            <Skills />
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-12 md:py-20 bg-gradient-to-br from-background via-background to-muted/20 rounded-2xl my-6 md:my-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <Projects />
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="py-12 md:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <Experience />
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-12 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <ContactSection />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 bg-muted/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <div className="flex items-center justify-center md:justify-start space-x-2 text-xl font-bold text-primary mb-2">
                <img src="/mounir-icon.svg" alt="Mounir" className="w-8 h-8" />
                <span>Mounir Abderrahmani</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-md">
                Full Stack Developer & Solution Architect with expertise in building scalable web applications.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 text-muted-foreground mb-3">
                <MapPin className="h-4 w-4" />
                <span>Algiers, Algeria</span>
              </div>
              <div className="flex gap-4">
                <a 
                  href="mailto:mounir.a@gmail.com" 
                  className="text-primary hover:text-primary/80 transition-colors"
                  aria-label="Email me"
                >
                  <Mail className="h-5 w-5" />
                </a>
                <a 
                  href="tel:+213555123456" 
                  className="text-primary hover:text-primary/80 transition-colors"
                  aria-label="Call me"
                >
                  <Phone className="h-5 w-5" />
                </a>
                <a 
                  href="https://linkedin.com/in/mounir" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 transition-colors"
                  aria-label="LinkedIn profile"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a 
                  href="https://github.com/mounir" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 transition-colors"
                  aria-label="GitHub profile"
                >
                  <Github className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-border/50 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()} Mounir Abderrahmani. All rights reserved.
            </div>
            <div className="flex items-center">
              <ProfessionalSignature size="sm" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;