import React from 'react';
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

export function FloatingThemeToggle({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn(
        "fixed bottom-6 right-6 z-50 transition-all duration-300",
        "hover:scale-105 hover:shadow-lg active:scale-95",
        className
      )}
      {...props}
    >
      <div className="relative group">
        <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full opacity-0 group-hover:opacity-100 blur transition-all duration-500" />
        <ThemeToggle 
          className={cn(
            "relative bg-background/80 backdrop-blur-md border-2 border-border/50",
            "shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/70",
            "flex items-center justify-center w-12 h-12 rounded-full"
          )}
          showLabel={false}
        />
      </div>
    </div>
  );
}
