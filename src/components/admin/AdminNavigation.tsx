import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Zap, 
  Monitor, 
  Clock, 
  Heart, 
  Mail, 
  Pause, 
  Sun, 
  Moon 
} from "lucide-react";
import { useTheme } from "@/components/theme/theme-provider";

export function AdminNavigation() {
  const { theme, setTheme, actualTheme } = useTheme();
  
  const navItems = [
    { icon: Home, label: "Home", active: true },
    { icon: Zap, label: "Skills" },
    { icon: Monitor, label: "Projects" },
    { icon: Clock, label: "Experience" },
    { icon: Heart, label: "Testimonials" },
    { icon: Mail, label: "Contact" },
  ];

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <nav className="fixed top-4 right-4 z-40 bg-background/95 backdrop-blur-sm border rounded-lg p-2 shadow-lg dark:bg-slate-900/95">
      <div className="space-y-1">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Button
              key={index}
              variant={item.active ? "default" : "ghost"}
              size="sm"
              className={`w-full justify-start gap-2 text-xs mb-1 ${
                item.active 
                  ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                  : "hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Button>
          );
        })}
        
        <div className="border-t pt-2 space-y-1 border-border dark:border-slate-700">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-xs hover:bg-accent hover:text-accent-foreground"
          >
            <Pause className="h-4 w-4" />
            Pause
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="w-full gap-2 transition-all duration-300 border border-input bg-background hover:bg-accent hover:text-accent-foreground"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            <div className="relative">
              {actualTheme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </div>
          </Button>
        </div>
      </div>
    </nav>
  );
}