import React from 'react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { ProfessionalSignature } from '@/components/ui/signature';
import { Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface User {
  uid: string;
  email: string | null;
  displayName?: string | null;
}

interface HeaderAction {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'ghost';
}

interface AdminHeaderProps {
  user: User | null;
  onLogout: () => void;
  showUserMenu?: boolean;
  actions?: HeaderAction[];
  className?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  user,
  onLogout,
  showUserMenu = true,
  actions = [],
  className
}) => {
  return (
    <div className={cn(
      "glass border-b border-border/30 sticky top-0 z-50",
      className
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative bg-white/10 dark:bg-gray-800/10 rounded-full p-1.5 sm:p-2 backdrop-blur-sm">
                <img 
                  src="/mounir-icon.svg" 
                  alt="Admin" 
                  className="w-7 h-7 sm:w-8 sm:h-8 transition-transform duration-300 group-hover:scale-110" 
                />
              </div>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Portfolio Admin
              </h1>
              <p className="hidden sm:block text-xs sm:text-sm text-muted-foreground">Content Management System</p>
            </div>
          </div>

          {/* Actions and User Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Custom Actions */}
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || 'outline'}
                onClick={action.onClick}
                size="sm"
                className="hover-lift glass border-border/30 hover:glow-primary hidden sm:flex"
              >
                <action.icon className="w-4 h-4 mr-2" />
                {action.label}
              </Button>
            ))}

            {/* Mobile view actions */}
            {actions.map((action, index) => (
              <Button
                key={`mobile-${index}`}
                variant={action.variant || 'outline'}
                onClick={action.onClick}
                size="sm"
                className="hover-lift glass border-border/30 hover:glow-primary sm:hidden"
              >
                <action.icon className="w-4 h-4" />
                <span className="sr-only">{action.label}</span>
              </Button>
            ))}

            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Professional Signature */}
            <div className="hidden lg:block">
              <ProfessionalSignature />
            </div>
            
            {/* User Menu */}
            {showUserMenu && user && (
              <Button 
                variant="outline" 
                onClick={onLogout} 
                size="sm"
                className="hover-lift glass border-border/30 hover:glow-primary hidden md:flex"
              >
                <Settings className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            )}
            
            {/* Mobile user menu */}
            {showUserMenu && user && (
              <Button 
                variant="outline" 
                onClick={onLogout} 
                size="sm"
                className="hover-lift glass border-border/30 hover:glow-primary md:hidden"
              >
                <Settings className="w-4 h-4" />
                <span className="sr-only">Sign Out</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;