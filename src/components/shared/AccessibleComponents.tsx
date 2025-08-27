import React, { forwardRef, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  useFocusManagement,
  useKeyboardNavigation,
  useScreenReader,
  useAriaAttributes,
  useSkipLinks,
  AriaProps
} from "@/hooks/useAccessibility";

// Skip Links Component
export const SkipLinks: React.FC<{
  links: Array<{ id: string; label: string; target: string }>;
  className?: string;
}> = ({ links, className }) => {
  const { skipTo } = useSkipLinks();

  if (links.length === 0) return null;

  return (
    <nav 
      className={cn("sr-only focus-within:not-sr-only", className)}
      aria-label="Skip navigation"
    >
      <ul className="fixed top-4 left-4 z-[100] bg-primary text-primary-foreground p-3 space-y-2 rounded-lg shadow-lg border border-border/20">
        {links.map((link) => (
          <li key={link.id}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => skipTo(link.target)}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              {link.label}
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

// Accessible Heading Component
export interface AccessibleHeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  id?: string;
  className?: string;
  skipLinkLabel?: string;
}

export const AccessibleHeading: React.FC<AccessibleHeadingProps> = ({
  level,
  children,
  id,
  className,
  skipLinkLabel
}) => {
  const { addSkipLink, removeSkipLink } = useSkipLinks();
  const { generateId } = useAriaAttributes();
  
  const headingId = id || generateId("heading");

  useEffect(() => {
    if (skipLinkLabel && headingId) {
      addSkipLink(headingId, skipLinkLabel, headingId);
      return () => removeSkipLink(headingId);
    }
  }, [skipLinkLabel, headingId, addSkipLink, removeSkipLink]);

  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <HeadingTag
      id={headingId}
      className={className}
      tabIndex={-1}
    >
      {children}
    </HeadingTag>
  );
};

// Accessible Button Component
export interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  loading?: boolean;
  loadingText?: string;
  describedBy?: string;
  expanded?: boolean;
  controls?: string;
  pressed?: boolean;
  children: React.ReactNode;
}

export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(({
  variant = "default",
  size = "default",
  loading = false,
  loadingText = "Loading",
  describedBy,
  expanded,
  controls,
  pressed,
  disabled,
  children,
  onClick,
  className,
  ...props
}, ref) => {
  const { announce } = useScreenReader();
  const { createAriaProps } = useAriaAttributes();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (loading || disabled) return;
    
    onClick?.(e);
    
    // Announce action completion
    if (!e.defaultPrevented) {
      announce("Action completed");
    }
  };

  const ariaProps = createAriaProps({
    describedBy,
    expanded,
    controls,
    pressed,
    disabled: disabled || loading
  });

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      disabled={disabled || loading}
      onClick={handleClick}
      className={className}
      {...ariaProps}
      {...props}
    >
      {loading ? (
        <>
          <span className="sr-only">{loadingText}</span>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
          {children}
        </>
      ) : (
        children
      )}
    </Button>
  );
});

// Accessible Status Badge
export interface AccessibleBadgeProps {
  variant?: "default" | "secondary" | "destructive" | "outline";
  status: "success" | "warning" | "error" | "info" | "neutral";
  children: React.ReactNode;
  className?: string;
  announcement?: string;
}

export const AccessibleBadge: React.FC<AccessibleBadgeProps> = ({
  variant = "default",
  status,
  children,
  className,
  announcement
}) => {
  const { announce } = useScreenReader();
  const { createAriaProps } = useAriaAttributes();

  useEffect(() => {
    if (announcement) {
      announce(announcement);
    }
  }, [announcement, announce]);

  const statusLabels = {
    success: "Success",
    warning: "Warning", 
    error: "Error",
    info: "Information",
    neutral: "Status"
  };

  const ariaProps = createAriaProps({
    label: `${statusLabels[status]}: ${children}`,
    role: "status"
  });

  return (
    <Badge
      variant={variant}
      className={className}
      {...ariaProps}
    >
      <span className="sr-only">{statusLabels[status]}:</span>
      {children}
    </Badge>
  );
};

// Accessible Card Component
export interface AccessibleCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  interactive?: boolean;
  selected?: boolean;
  onClick?: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

export const AccessibleCard = forwardRef<HTMLDivElement, AccessibleCardProps>(({
  children,
  className,
  title,
  description,
  interactive = false,
  selected = false,
  onClick,
  onKeyDown,
  ...props
}, ref) => {
  const { handleKeyDown } = useKeyboardNavigation({
    onEnter: onClick,
    enabled: interactive
  });
  const { createAriaProps, generateId } = useAriaAttributes();

  const titleId = generateId("card-title");
  const descId = generateId("card-desc");

  const ariaProps = createAriaProps({
    labelledBy: title ? titleId : undefined,
    describedBy: description ? descId : undefined,
    selected: interactive ? selected : undefined,
    role: interactive ? "button" : undefined
  });

  const combinedKeyDown = (e: React.KeyboardEvent) => {
    handleKeyDown(e as any);
    onKeyDown?.(e);
  };

  return (
    <Card
      ref={ref}
      className={cn(
        interactive && "cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary",
        selected && "ring-2 ring-primary",
        className
      )}
      onClick={interactive ? onClick : undefined}
      onKeyDown={interactive ? combinedKeyDown : onKeyDown}
      tabIndex={interactive ? 0 : undefined}
      {...ariaProps}
      {...props}
    >
      {title && (
        <h3 id={titleId} className="sr-only">
          {title}
        </h3>
      )}
      {description && (
        <p id={descId} className="sr-only">
          {description}
        </p>
      )}
      {children}
    </Card>
  );
});

// Accessible Navigation Component
export interface AccessibleNavProps {
  children: React.ReactNode;
  label: string;
  className?: string;
  orientation?: "horizontal" | "vertical";
}

export const AccessibleNav: React.FC<AccessibleNavProps> = ({
  children,
  label,
  className,
  orientation = "horizontal"
}) => {
  const { createAriaProps } = useAriaAttributes();

  const ariaProps = createAriaProps({
    label,
    role: "navigation"
  });

  return (
    <nav 
      className={className}
      data-orientation={orientation}
      {...ariaProps}
    >
      {children}
    </nav>
  );
};

// Accessible List Component
export interface AccessibleListProps {
  children: React.ReactNode;
  className?: string;
  label?: string;
  ordered?: boolean;
  role?: "list" | "listbox" | "menu";
}

export const AccessibleList: React.FC<AccessibleListProps> = ({
  children,
  className,
  label,
  ordered = false,
  role = "list"
}) => {
  const { createAriaProps } = useAriaAttributes();

  const ariaProps = createAriaProps({
    label,
    role
  });

  const ListTag = ordered ? "ol" : "ul";

  return (
    <ListTag
      className={className}
      {...ariaProps}
    >
      {children}
    </ListTag>
  );
};

// Accessible List Item Component
export interface AccessibleListItemProps {
  children: React.ReactNode;
  className?: string;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  role?: "listitem" | "option" | "menuitem";
}

export const AccessibleListItem: React.FC<AccessibleListItemProps> = ({
  children,
  className,
  selected = false,
  disabled = false,
  onClick,
  role = "listitem"
}) => {
  const { handleKeyDown } = useKeyboardNavigation({
    onEnter: onClick,
    enabled: !!onClick && !disabled
  });
  const { createAriaProps } = useAriaAttributes();

  const ariaProps = createAriaProps({
    selected: role === "option" ? selected : undefined,
    disabled,
    role
  });

  return (
    <li
      className={cn(
        onClick && !disabled && "cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary",
        selected && "bg-accent",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onClick={!disabled ? onClick : undefined}
      onKeyDown={!disabled ? handleKeyDown : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
      {...ariaProps}
    >
      {children}
    </li>
  );
};

// Accessible Progress Component
export interface AccessibleProgressProps {
  value: number;
  max?: number;
  label?: string;
  description?: string;
  className?: string;
  showPercentage?: boolean;
}

export const AccessibleProgress: React.FC<AccessibleProgressProps> = ({
  value,
  max = 100,
  label,
  description,
  className,
  showPercentage = true
}) => {
  const { announce } = useScreenReader();
  const { createAriaProps, generateId } = useAriaAttributes();
  const prevValueRef = useRef(value);

  const percentage = Math.round((value / max) * 100);
  const labelId = generateId("progress-label");
  const descId = generateId("progress-desc");

  // Announce progress changes
  useEffect(() => {
    const prevPercentage = Math.round((prevValueRef.current / max) * 100);
    if (percentage !== prevPercentage && percentage % 10 === 0) {
      announce(`Progress: ${percentage}%`);
    }
    prevValueRef.current = value;
  }, [percentage, announce, max, value]);

  const ariaProps = createAriaProps({
    labelledBy: label ? labelId : undefined,
    describedBy: description ? descId : undefined,
    role: "progressbar"
  });

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <div id={labelId} className="flex justify-between items-center">
          <span className="text-sm font-medium">{label}</span>
          {showPercentage && (
            <span className="text-sm text-muted-foreground">{percentage}%</span>
          )}
        </div>
      )}
      
      <div
        className="w-full bg-secondary rounded-full h-2"
        {...ariaProps}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuetext={`${percentage}%`}
      >
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {description && (
        <p id={descId} className="text-xs text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
};

// Focus Trap Component
export interface FocusTrapProps {
  children: React.ReactNode;
  enabled?: boolean;
  restoreFocus?: boolean;
  className?: string;
}

export const FocusTrap: React.FC<FocusTrapProps> = ({
  children,
  enabled = true,
  restoreFocus = true,
  className
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { storeFocus, restoreFocus: restore, trapFocus, focusFirst } = useFocusManagement();

  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    if (restoreFocus) {
      storeFocus();
    }

    const cleanup = trapFocus(containerRef.current);
    focusFirst(containerRef.current);

    return () => {
      cleanup?.();
      if (restoreFocus) {
        restore();
      }
    };
  }, [enabled, restoreFocus, storeFocus, restore, trapFocus, focusFirst]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
};

