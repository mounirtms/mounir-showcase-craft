import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "./theme-toggle"
import { useTheme, useThemeVariables, useThemePersistence } from "./use-theme"
import { Monitor, Sun, Moon, Palette, Settings, Check } from "lucide-react"

/**
 * Demo component to showcase the comprehensive theme system
 */
export function ThemeDemo() {
  const { 
    theme, 
    actualTheme, 
    systemTheme, 
    isSystemTheme, 
    isTransitioning,
    setTheme,
    toggleTheme 
  } = useTheme()
  
  const { isDark, isLight, glassBackground, cardBackground, borderColor } = useThemeVariables()
  const { saveThemePreference, clearThemePreference } = useThemePersistence()
  
  const [showAdvanced, setShowAdvanced] = useState(false)

  const themeOptions = [
    {
      value: 'light' as const,
      label: 'Light',
      icon: Sun,
      description: 'Clean and bright interface',
      preview: 'bg-white text-gray-900 border-gray-200'
    },
    {
      value: 'dark' as const,
      label: 'Dark',
      icon: Moon,
      description: 'Easy on the eyes in low light',
      preview: 'bg-gray-900 text-white border-gray-700'
    },
    {
      value: 'system' as const,
      label: 'System',
      icon: Monitor,
      description: 'Follows your device preference',
      preview: 'bg-gradient-to-r from-white to-gray-900 text-gray-600 border-gray-400'
    }
  ]

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-display">Theme System Demo</h1>
        <p className="text-muted-foreground">
          Comprehensive theme system with light, dark, and system preference support
        </p>
      </div>

      {/* Current Theme Status */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Current Theme Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Selected Theme
              </label>
              <div className="flex items-center gap-2">
                <Badge variant={theme === 'system' ? 'default' : 'secondary'}>
                  {theme}
                </Badge>
                {isTransitioning && (
                  <Badge variant="outline" className="animate-pulse">
                    Transitioning...
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Active Theme
              </label>
              <Badge variant={actualTheme === 'dark' ? 'default' : 'secondary'}>
                {actualTheme}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                System Preference
              </label>
              <Badge variant="outline">
                {systemTheme}
              </Badge>
            </div>
          </div>

          <Separator />

          <div className="flex flex-wrap gap-2">
            <ThemeToggle variant="default" showLabel />
            <ThemeToggle variant="compact" />
            <ThemeToggle variant="icon-only" />
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              disabled={isTransitioning}
            >
              Quick Toggle
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Theme Options */}
      <Card>
        <CardHeader>
          <CardTitle>Theme Options</CardTitle>
          <CardDescription>
            Choose your preferred theme or let the system decide
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {themeOptions.map((option) => {
              const Icon = option.icon
              const isSelected = theme === option.value
              
              return (
                <Card
                  key={option.value}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    isSelected ? 'ring-2 ring-primary shadow-glow' : ''
                  }`}
                  onClick={() => setTheme(option.value)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{option.label}</span>
                      </div>
                      {isSelected && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {option.description}
                    </p>
                    
                    {/* Theme Preview */}
                    <div className={`h-8 rounded border-2 ${option.preview}`} />
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Advanced Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Advanced Theme Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? 'Hide' : 'Show'} Advanced Settings
          </Button>

          {showAdvanced && (
            <div className="space-y-4 pt-4 border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Theme Variables</label>
                  <div className="text-xs space-y-1 font-mono bg-muted p-3 rounded">
                    <div>isDark: {isDark.toString()}</div>
                    <div>isLight: {isLight.toString()}</div>
                    <div>isSystemTheme: {isSystemTheme.toString()}</div>
                    <div>glassBackground: {glassBackground}</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Theme Actions</label>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => saveThemePreference(theme)}
                      className="w-full"
                    >
                      Save Current Preference
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearThemePreference}
                      className="w-full"
                    >
                      Reset to System
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Visual Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Theme-Aware Components</CardTitle>
          <CardDescription>
            Examples of how components adapt to different themes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Glass morphism example */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Glass Morphism Effect</label>
            <div 
              className="p-4 rounded-lg border backdrop-blur-md"
              style={{ 
                background: glassBackground,
                borderColor: borderColor 
              }}
            >
              <p className="text-sm">
                This card uses theme-aware glass morphism with dynamic background and border colors.
              </p>
            </div>
          </div>

          {/* Card background example */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Dynamic Card Background</label>
            <div 
              className="p-4 rounded-lg border"
              style={{ 
                background: cardBackground,
                borderColor: borderColor 
              }}
            >
              <p className="text-sm">
                This card adapts its background opacity and color based on the current theme.
              </p>
            </div>
          </div>

          {/* Gradient examples */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Theme-Aware Gradients</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-20 rounded-lg bg-gradient-primary flex items-center justify-center text-primary-foreground font-medium">
                Primary Gradient
              </div>
              <div className="h-20 rounded-lg bg-gradient-subtle flex items-center justify-center font-medium">
                Subtle Gradient
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}