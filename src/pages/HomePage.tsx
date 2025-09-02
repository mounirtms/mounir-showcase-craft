import React from 'react';
import { ExternalLink, Mail, Phone, Linkedin, Github } from "lucide-react";

// UI Components
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Navigation } from "../components/ui/navigation";
import { Signature } from "../components/ui/signature";
import { SkipLinks } from "../components/shared/AccessibleComponents";
import { useAccessibility } from "../contexts/AccessibilityContext";
import { EnhancedPortfolioIntegration } from "../components/portfolio";
import { ThemeToggle } from "../components/theme/theme-toggle";

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
        <section className="text-center py-20">
          <h1 className="text-5xl font-bold mb-4">Mounir Temsamani</h1>
          <p className="text-xl text-muted-foreground">
            Senior Software Engineer & Tech Enthusiast
          </p>
        </section>

        {/* Portfolio Section */}
        <section className="py-12">
          <EnhancedPortfolioIntegration />
        </section>

        {/* Contact Section */}
        <section id="contact-section" className="py-12">
          <h2 className="text-3xl font-bold mb-6">Get In Touch</h2>
          <div className="flex flex-col md:flex-row gap-6">
            <a 
              href="mailto:your.email@example.com" 
              className="flex items-center gap-2 text-primary hover:underline"
              aria-label="Email me"
            >
              <Mail className="h-5 w-5" />
              <span>your.email@example.com</span>
            </a>
            <a 
              href="tel:+1234567890" 
              className="flex items-center gap-2 text-primary hover:underline"
              aria-label="Call me"
            >
              <Phone className="h-5 w-5" />
              <span>+1 (234) 567-890</span>
            </a>
          </div>
          <div className="flex gap-4 mt-4">
            <a 
              href="https://linkedin.com/in/yourusername" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80"
              aria-label="LinkedIn profile"
            >
              <Linkedin className="h-6 w-6" />
            </a>
            <a 
              href="https://github.com/yourusername" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80"
              aria-label="GitHub profile"
            >
              <Github className="h-6 w-6" />
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Mounir Temsamani. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;