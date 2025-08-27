import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sun, 
  Moon, 
  Monitor, 
  Palette, 
  Eye, 
  Settings,
  Check,
  Sparkles,
  Zap,
  Star,
  Contrast,
  Adjust
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme/theme-provider";

// Theme configurations
const THEME_CONFIG = {
  light: {
    label: "Light",
    icon: <Sun className="w-4 h-4" />,
    description: "Clean and bright interface",
    preview: {
      bg: "bg-white",
      text: "text-gray-900",
      accent: "bg-blue-500",
      border: "border-gray-200"
    },
    colors: {
      primary: "#3b82f6",
      background: "#ffffff",
      foreground: "#0f172a",
      muted: "#f8fafc",
      accent: "#e2e8f0"
    }
  },
  dark: {
    label: "Dark",
    icon: <Moon className="w-4 h-4" />,
    description: "Easy on the eyes",
    preview: {
      bg: "bg-gray-900",
      text: "text-gray-100",
      accent: "bg-blue-400",
      border: "border-gray-700"
    },
    colors: {
      primary: "#60a5fa",
      background: "#0f172a",
      foreground: "#f1f5f9",
      muted: "#1e293b",
      accent: "#334155"
    }
  },
  system: {
    label: "System",
    icon: <Monitor className="w-4 h-4" />,
    description: "Matches your device settings",
    preview: {
      bg: "bg-gradient-to-br from-gray-100 to-gray-200",
      text: "text-gray-800",
      accent: "bg-purple-500",
      border: "border-gray-300"
    },
    colors: {
      primary: "#8b5cf6",
      background: "auto",
      foreground: "auto",
      muted: "auto",
      accent: "auto"
    }
  }
};

// Color scheme presets
const COLOR_SCHEMES = [
  {
    name: "Blue Ocean",
    primary: "#3b82f6",
    secondary: "#1e40af",
    accent: "#dbeafe",
    gradient: "from-blue-400 to-blue-600"
  },
  {
    name: "Purple Galaxy",
    primary: "#8b5cf6",
    secondary: "#7c3aed",
    accent: "#ede9fe",
    gradient: "from-purple-400 to-purple-600"
  },
  {
    name: "Green Forest",
    primary: "#10b981",
    secondary: "#059669",
    accent: "#d1fae5",
    gradient: "from-green-400 to-green-600"
  },
  {
    name: "Orange Sunset",
    primary: "#f59e0b",
    secondary: "#d97706",
    accent: "#fef3c7",
    gradient: "from-orange-400 to-orange-600"
  },
  {
    name: "Rose Garden",
    primary: "#f43f5e",
    secondary: "#e11d48",
    accent: "#fce7e9",
    gradient: "from-rose-400 to-rose-600"
  },
  {
    name: "Cyan Wave",
    primary: "#06b6d4",
    secondary: "#0891b2",
    accent: "#cffafe",
    gradient: "from-cyan-400 to-cyan-600"
  }
];

// Animation presets
const ANIMATION_PRESETS = [
  { name: "Instant", duration: "0ms", easing: "linear" },
  { name: "Quick", duration: "150ms", easing: "ease-out" },
  { name: "Normal", duration: "300ms", easing: "ease-in-out" },
  { name: "Smooth", duration: "500ms", easing: "cubic-bezier(0.4, 0, 0.2, 1)" },
  { name: "Elegant", duration: "700ms", easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)" }
];

// Component interfaces
export interface ThemeToggleProps {
  className?: string;
  variant?: "icon" | "button" | "dropdown" | "advanced";
  showLabel?: boolean;
  showPreview?: boolean;
  enableColorSchemes?: boolean;
  enableAnimationControls?: boolean;
  size?: "sm" | "md" | "lg";
}

export interface ThemeCustomizationProps {
  className?: string;
  onClose?: () => void;
}

// Simple icon toggle component
const IconToggle: React.FC<{ size?: "sm" | "md" | "lg"; showLabel?: boolean }> = ({ 
  size = "md", 
  showLabel = false 
}) => {
  const { theme, setTheme, actualTheme } = useTheme();
  
  const toggleTheme = () => {
    setTheme(actualTheme === "dark" ? "light" : "dark");
  };

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12"
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={cn(
        "relative transition-all duration-300 hover:scale-110",
        sizeClasses[size]
      )}
      aria-label={`Switch to ${actualTheme === "dark" ? "light" : "dark"} mode`}
    >
      <div className="relative w-full h-full">
        <Sun
          className={cn(
            "absolute inset-0 m-auto transition-all duration-300",
            actualTheme === "dark" 
              ? "rotate-90 scale-0 opacity-0" 
              : "rotate-0 scale-100 opacity-100"
          )}
        />
        <Moon
          className={cn(
            "absolute inset-0 m-auto transition-all duration-300",
            actualTheme === "dark" 
              ? "rotate-0 scale-100 opacity-100" 
              : "-rotate-90 scale-0 opacity-0"
          )}
        />
      </div>
      {showLabel && (
        <span className="sr-only">
          {actualTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        </span>
      )}
    </Button>
  );
};

// Advanced theme selector
const ThemeSelector: React.FC<{ variant?: "horizontal" | "vertical" }> = ({ 
  variant = "horizontal" 
}) => {
  const { theme, setTheme, actualTheme } = useTheme();
  const [hoveredTheme, setHoveredTheme] = useState<string | null>(null);

  const themes = Object.entries(THEME_CONFIG);

  return (
    <div className={cn(
      "grid gap-3",
      variant === "horizontal" ? "grid-cols-3" : "grid-cols-1"
    )}>
      {themes.map(([key, config]) => (
        <Card
          key={key}
          className={cn(
            "cursor-pointer transition-all duration-300 hover:scale-105",
            theme === key && "ring-2 ring-primary ring-offset-2",
            hoveredTheme === key && "shadow-lg"
          )}
          onClick={() => setTheme(key as any)}
          onMouseEnter={() => setHoveredTheme(key)}
          onMouseLeave={() => setHoveredTheme(null)}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg transition-colors",
                theme === key ? "bg-primary text-primary-foreground" : "bg-muted"
              )}>
                {config.icon}
              </div>
              <div className="flex-1">
                <div className="font-medium flex items-center gap-2">
                  {config.label}
                  {theme === key && <Check className="w-4 h-4 text-primary" />}
                </div>
                <div className="text-xs text-muted-foreground">
                  {config.description}
                </div>
              </div>
            </div>
            
            {/* Theme preview */}
            <div className="mt-3 flex gap-1">
              <div className={cn("h-2 w-full rounded", config.preview.bg)} />
              <div className={cn("h-2 w-4 rounded", config.preview.accent)} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Color scheme picker
const ColorSchemePicker: React.FC<{ onSchemeChange?: (scheme: any) => void }> = ({ 
  onSchemeChange 
}) => {
  const [selectedScheme, setSelectedScheme] = useState(COLOR_SCHEMES[0]);
  const [hoveredScheme, setHoveredScheme] = useState<any>(null);

  const handleSchemeSelect = (scheme: any) => {
    setSelectedScheme(scheme);
    onSchemeChange?.(scheme);
    
    // Apply the color scheme to CSS variables
    const root = document.documentElement;
    root.style.setProperty('--primary', scheme.primary);
    root.style.setProperty('--primary-rgb', hexToRgb(scheme.primary));
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 
      `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
      '';
  };

  return (
    <div className="space-y-4">
      <h4 className="font-medium flex items-center gap-2">
        <Palette className="w-4 h-4" />
        Color Schemes
      </h4>
      
      <div className="grid grid-cols-2 gap-3">
        {COLOR_SCHEMES.map((scheme, index) => (
          <Card
            key={index}
            className={cn(
              "cursor-pointer transition-all duration-300",
              selectedScheme.name === scheme.name && "ring-2 ring-primary ring-offset-2",
              hoveredScheme?.name === scheme.name && "scale-105"
            )}
            onClick={() => handleSchemeSelect(scheme)}
            onMouseEnter={() => setHoveredScheme(scheme)}
            onMouseLeave={() => setHoveredScheme(null)}
          >
            <CardContent className="p-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full border border-white/20" 
                    style={{ backgroundColor: scheme.primary }}
                  />
                  <span className="text-sm font-medium">{scheme.name}</span>
                  {selectedScheme.name === scheme.name && (
                    <Check className="w-3 h-3 text-primary ml-auto" />
                  )}
                </div>
                
                <div className={cn(
                  "h-6 rounded bg-gradient-to-r",
                  scheme.gradient
                )} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Animation controls
const AnimationControls: React.FC<{ onAnimationChange?: (preset: any) => void }> = ({ 
  onAnimationChange 
}) => {
  const [selectedPreset, setSelectedPreset] = useState(ANIMATION_PRESETS[2]); // Normal by default
  
  const handlePresetSelect = (preset: any) => {
    setSelectedPreset(preset);
    onAnimationChange?.(preset);
    
    // Apply animation settings to CSS variables
    const root = document.documentElement;
    root.style.setProperty('--theme-transition-duration', preset.duration);
    root.style.setProperty('--theme-transition-easing', preset.easing);
  };

  return (
    <div className="space-y-4">
      <h4 className="font-medium flex items-center gap-2">
        <Zap className="w-4 h-4" />
        Animation Speed
      </h4>
      
      <div className="space-y-2">
        {ANIMATION_PRESETS.map((preset, index) => (
          <Button
            key={index}
            variant={selectedPreset.name === preset.name ? "default" : "outline"}
            size="sm"
            onClick={() => handlePresetSelect(preset)}
            className="w-full justify-between"
          >
            <span>{preset.name}</span>
            <Badge variant="secondary" className="text-xs">
              {preset.duration}
            </Badge>
          </Button>
        ))}
      </div>
    </div>
  );
};

// Advanced theme customization panel
export const ThemeCustomization: React.FC<ThemeCustomizationProps> = ({ 
  className, 
  onClose 
}) => {
  const { theme } = useTheme();
  const [selectedColorScheme, setSelectedColorScheme] = useState(COLOR_SCHEMES[0]);
  const [selectedAnimation, setSelectedAnimation] = useState(ANIMATION_PRESETS[2]);

  return (
    <Card className={cn("w-full max-w-2xl", className)}>
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Theme Customization
          </h3>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          )}
        </div>

        {/* Theme Selector */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Theme Mode
          </h4>
          <ThemeSelector variant="horizontal" />
        </div>

        {/* Color Schemes */}
        <ColorSchemePicker onSchemeChange={setSelectedColorScheme} />

        {/* Animation Controls */}
        <AnimationControls onAnimationChange={setSelectedAnimation} />

        {/* Preview Section */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Star className="w-4 h-4" />
            Live Preview
          </h4>
          
          <Card className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="font-medium">Sample Card</h5>
              <Badge>Featured</Badge>
            </div>
            
            <p className="text-sm text-muted-foreground">
              This is how your theme will look with the current settings. 
              The colors and animations will apply throughout the interface.
            </p>
            
            <div className="flex gap-2">
              <Button size="sm">Primary Button</Button>
              <Button size="sm" variant="outline">Secondary</Button>
            </div>
          </Card>
        </div>

        {/* Applied Settings Summary */}
        <div className="bg-muted p-4 rounded-lg space-y-2">
          <h5 className="font-medium text-sm">Current Settings</h5>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-muted-foreground">Theme:</span> {theme}
            </div>
            <div>
              <span className="text-muted-foreground">Color:</span> {selectedColorScheme.name}
            </div>
            <div>
              <span className="text-muted-foreground">Animation:</span> {selectedAnimation.name}
            </div>
            <div>
              <span className="text-muted-foreground">Duration:</span> {selectedAnimation.duration}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Main theme toggle component
export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className,
  variant = "button",
  showLabel = false,
  showPreview = false,
  enableColorSchemes = false,
  enableAnimationControls = false,
  size = "md"
}) => {
  const { theme, setTheme, actualTheme } = useTheme();
  const [showCustomization, setShowCustomization] = useState(false);

  // Icon-only toggle
  if (variant === "icon") {
    return (
      <IconToggle 
        size={size} 
        showLabel={showLabel}
      />
    );
  }

  // Button toggle
  if (variant === "button") {
    const config = THEME_CONFIG[theme];
    
    return (
      <Button
        variant="outline"
        size={size}
        onClick={() => setTheme(actualTheme === "dark" ? "light" : "dark")}
        className={cn("gap-2 transition-all duration-300", className)}
      >
        <div className="relative">
          {config.icon}
        </div>
        {showLabel && <span>{config.label}</span>}
      </Button>
    );
  }

  // Dropdown selector
  if (variant === "dropdown") {
    return (
      <div className={cn("space-y-3", className)}>
        <ThemeSelector />
        {showPreview && (
          <Card className="p-3">
            <div className="text-sm text-muted-foreground">
              Preview: Current theme is <strong>{THEME_CONFIG[theme].label}</strong>
            </div>
          </Card>
        )}
      </div>
    );
  }

  // Advanced customization
  if (variant === "advanced") {
    return (
      <div className={className}>
        <Button
          variant="outline"
          onClick={() => setShowCustomization(!showCustomization)}
          className="gap-2"
        >
          <Palette className="w-4 h-4" />
          Customize Theme
        </Button>
        
        {showCustomization && (
          <div className="mt-4">
            <ThemeCustomization onClose={() => setShowCustomization(false)} />
          </div>
        )}
      </div>
    );
  }

  return null;
};

// Export types and interfaces
export interface ThemeToggleInterface {
  className?: string;
  variant?: "icon" | "button" | "dropdown" | "advanced";
  showLabel?: boolean;
  showPreview?: boolean;
  enableColorSchemes?: boolean;
  enableAnimationControls?: boolean;
  size?: "sm" | "md" | "lg";
}

export default ThemeToggle;