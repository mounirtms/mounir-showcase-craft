import { Moon, Sun, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "./theme-provider"

export function ThemeToggle() {
  const { setTheme, theme, actualTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative h-9 w-9 px-0 hover:bg-accent/50 transition-all duration-300 group"
        >
          <div className="relative">
            <Sun className={`h-[1.2rem] w-[1.2rem] transition-all duration-300 ${
              actualTheme === 'dark' 
                ? 'rotate-90 scale-0 opacity-0' 
                : 'rotate-0 scale-100 opacity-100'
            }`} />
            <Moon className={`absolute inset-0 h-[1.2rem] w-[1.2rem] transition-all duration-300 ${
              actualTheme === 'dark' 
                ? 'rotate-0 scale-100 opacity-100' 
                : '-rotate-90 scale-0 opacity-0'
            }`} />
          </div>
          <span className="sr-only">Toggle theme</span>
          
          {/* Glow effect */}
          <div className={`absolute inset-0 rounded-md bg-gradient-to-r from-violet-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-48 border border-border/50 bg-background/95 backdrop-blur-md shadow-xl"
      >
        <DropdownMenuItem 
          onClick={() => setTheme("light")}
          className={`cursor-pointer transition-all duration-200 ${
            theme === 'light' ? 'bg-accent/50' : ''
          }`}
        >
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")}
          className={`cursor-pointer transition-all duration-200 ${
            theme === 'dark' ? 'bg-accent/50' : ''
          }`}
        >
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("system")}
          className={`cursor-pointer transition-all duration-200 ${
            theme === 'system' ? 'bg-accent/50' : ''
          }`}
        >
          <Monitor className="mr-2 h-4 w-4" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
