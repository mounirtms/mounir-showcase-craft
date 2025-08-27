import * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  actualTheme: "dark" | "light"
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  actualTheme: "light",
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<Theme>(() => {
    if (typeof window === 'undefined' || !window.localStorage) {
      return defaultTheme;
    }
    try {
      return (localStorage.getItem(storageKey) as Theme) || defaultTheme;
    } catch (error) {
      console.warn('Failed to read from localStorage:', error);
      return defaultTheme;
    }
  });

  const [actualTheme, setActualTheme] = React.useState<"dark" | "light">("light");

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const root = window.document.documentElement

    root.classList.remove("light", "dark")

    let resolvedTheme: "dark" | "light" = "light"

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"
      resolvedTheme = systemTheme
      root.classList.add(systemTheme)
    } else {
      resolvedTheme = theme
      root.classList.add(theme)
    }

    setActualTheme(resolvedTheme)

    // Add theme-specific CSS variables
    root.style.setProperty('--theme-transition', 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)')
    
    if (resolvedTheme === 'dark') {
      root.style.setProperty('--glass-bg', 'rgba(15, 23, 42, 0.7)')
      root.style.setProperty('--glass-border', 'rgba(148, 163, 184, 0.1)')
      root.style.setProperty('--glow-color', 'rgba(139, 92, 246, 0.3)')
      root.style.setProperty('--gradient-start', '#0f172a')
      root.style.setProperty('--gradient-end', '#1e293b')
      root.style.setProperty('--card-bg', 'rgba(30, 41, 59, 0.8)')
      
      // Admin dashboard specific variables
      root.style.setProperty('--admin-bg', '#0f172a')
      root.style.setProperty('--admin-card-bg', 'rgba(30, 41, 59, 0.8)')
      root.style.setProperty('--admin-border', 'rgba(148, 163, 184, 0.1)')
      root.style.setProperty('--admin-text', '#f1f5f9')
      root.style.setProperty('--admin-text-muted', '#94a3b8')
    } else {
      root.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.7)')
      root.style.setProperty('--glass-border', 'rgba(15, 23, 42, 0.1)')
      root.style.setProperty('--glow-color', 'rgba(139, 92, 246, 0.2)')
      root.style.setProperty('--gradient-start', '#ffffff')
      root.style.setProperty('--gradient-end', '#f8fafc')
      root.style.setProperty('--card-bg', 'rgba(255, 255, 255, 0.9)')
      
      // Admin dashboard specific variables
      root.style.setProperty('--admin-bg', '#f8fafc')
      root.style.setProperty('--admin-card-bg', 'rgba(255, 255, 255, 0.9)')
      root.style.setProperty('--admin-border', 'rgba(15, 23, 42, 0.1)')
      root.style.setProperty('--admin-text', '#0f172a')
      root.style.setProperty('--admin-text-muted', '#64748b')
    }
  }, [theme])

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    const handleChange = () => {
      if (theme === "system") {
        const systemTheme = mediaQuery.matches ? "dark" : "light"
        document.documentElement.classList.remove("light", "dark")
        document.documentElement.classList.add(systemTheme)
        setActualTheme(systemTheme)
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [theme])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          localStorage.setItem(storageKey, theme);
        } catch (error) {
          console.warn('Failed to save theme to localStorage:', error);
        }
      }
      setTheme(theme);
    },
    actualTheme,
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}