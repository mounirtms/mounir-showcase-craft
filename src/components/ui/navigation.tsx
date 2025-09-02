import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { trackButtonClick } from "@/utils/analytics";

const navItems = [
  { label: "Home", href: "#hero" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" }
];

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
    
    // Track navigation clicks
    trackButtonClick('navigation_click', { 
      section: sectionId.replace('#', ''),
      location: 'main_navigation'
    });
  };

  const toggleMobileMenu = () => {
    setIsOpen(!isOpen);
    trackButtonClick('mobile_menu_toggle', { 
      action: isOpen ? 'close' : 'open',
      location: 'main_navigation'
    });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => {
                scrollToSection("#hero");
                trackButtonClick('logo_click', { location: 'main_navigation' });
              }}
              className="flex items-center space-x-2 text-xl font-bold text-primary hover:text-primary/80 transition-colors"
            >
              <img src="/mounir-icon.svg" alt="Mounir" className="w-8 h-8" />
              <span>Mounir</span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={() => scrollToSection(item.href)}
                className="text-muted-foreground hover:text-primary transition-colors duration-300 font-medium relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
            <ThemeToggle />
            <Button 
              size="sm" 
              className="shadow-glow hover:shadow-medium transition-all duration-300" 
              onClick={() => {
                scrollToSection("#contact");
                trackButtonClick('lets_talk_button', { 
                  location: 'main_navigation',
                  button_type: 'cta'
                });
              }}
            >
              Let's Talk
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={toggleMobileMenu}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className={cn(
          "md:hidden overflow-hidden transition-all duration-500 ease-in-out",
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}>
          <div className="py-4 space-y-2">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={() => scrollToSection(item.href)}
                className="block w-full text-left px-4 py-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors duration-200"
              >
                {item.label}
              </button>
            ))}
            <div className="pt-2">
              <Button 
                size="sm" 
                className="w-full shadow-glow hover:shadow-medium transition-all duration-300" 
                onClick={() => {
                  scrollToSection("#contact");
                  trackButtonClick('lets_talk_button_mobile', { 
                    location: 'mobile_navigation',
                    button_type: 'cta'
                  });
                }}
              >
                Let's Talk
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};