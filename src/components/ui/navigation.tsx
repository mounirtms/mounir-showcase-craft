import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState, useCallback, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
};

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navItems: NavItem[] = useMemo(() => [
    { label: "Home", href: "#home" },
    { label: "Experience", href: "#experience" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
    { label: "Contact", href: "#contact" }
  ], []);

  const scrollToSection = useCallback((href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ 
        behavior: "smooth",
        block: "start",
        inline: "nearest"
      });
      setIsOpen(false);
    }
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled ? "bg-background/95 backdrop-blur-lg border-b border-border/50 shadow-md" : "bg-transparent border-b border-transparent"
    )}>
      <div className="max-w-6xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 sm:space-x-3 cursor-pointer transition-transform duration-300 hover:scale-105 rtl:space-x-reverse"
            onClick={() => scrollToSection("#home")}
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative bg-white/10 dark:bg-gray-800/10 rounded-full p-1 sm:p-1.5 backdrop-blur-sm">
                <img 
                  src="/mounir-icon.svg" 
                  alt="Mounir" 
                  className="w-7 h-7 sm:w-8 sm:h-8 transition-transform duration-300 group-hover:scale-110" 
                />
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-lg text-foreground leading-none">Mounir</div>
              <div className="text-xs text-muted-foreground leading-none mt-0.5">Full-Stack Developer</div>
            </div>
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
            <Button size="sm" className="shadow-glow hover:shadow-medium transition-all duration-300" onClick={() => scrollToSection("#contact")}>
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
          <div className="flex flex-col space-y-2 pt-4 mt-4 border-t border-border/50">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={() => scrollToSection(item.href)}
                className="text-left text-muted-foreground hover:text-primary transition-colors duration-300 font-medium py-2 rounded-md px-3 hover:bg-muted"
              >
                {item.label}
              </button>
            ))}
            <Button size="sm" className="self-start mt-3" onClick={() => scrollToSection("#contact")}>
              Let's Talk
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};