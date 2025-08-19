import { cn } from "@/lib/utils";

interface SignatureProps {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "text" | "icon" | "full" | "minimal" | "artistic";
  interactive?: boolean;
  showTitle?: boolean;
}

const sizeClasses = {
  xs: "text-sm",
  sm: "text-base",
  md: "text-lg", 
  lg: "text-xl",
  xl: "text-2xl"
};

const iconSizes = {
  xs: "w-4 h-4",
  sm: "w-5 h-5",
  md: "w-6 h-6",
  lg: "w-8 h-8",
  xl: "w-10 h-10"
};

const artisticSizes = {
  xs: "w-16 h-6",
  sm: "w-20 h-8",
  md: "w-32 h-12",
  lg: "w-40 h-16",
  xl: "w-48 h-20"
};

export function Signature({ 
  className, 
  size = "md", 
  variant = "artistic",
  interactive = false,
  showTitle = false
}: SignatureProps) {
  const baseClasses = cn(
    "font-signature select-none transition-all duration-300",
    sizeClasses[size],
    interactive && "hover:scale-105 cursor-pointer hover:text-primary",
    className
  );

  if (variant === "icon") {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        <img 
          src="/mounir-icon.svg" 
          alt="Mounir Abderrahmani" 
          className={cn(iconSizes[size], interactive && "hover:scale-110 transition-transform duration-300")}
        />
      </div>
    );
  }

  if (variant === "text") {
    return (
      <div className={baseClasses}>
        Mounir Abderrahmani
      </div>
    );
  }

  if (variant === "full") {
    return (
      <div className={cn("flex flex-col items-center gap-1", className)}>
        <div className="flex items-center gap-2">
          <img 
            src="/mounir-icon.svg" 
            alt="Mounir Abderrahmani" 
            className={cn(iconSizes[size], interactive && "hover:scale-110 transition-transform duration-300")}
          />
          <div className={baseClasses}>
            Mounir Abderrahmani
          </div>
        </div>
        {showTitle && (
          <div className={cn(
            "text-muted-foreground font-medium",
            size === "xs" && "text-xs",
            size === "sm" && "text-xs",
            size === "md" && "text-sm",
            size === "lg" && "text-base",
            size === "xl" && "text-lg"
          )}>
            Senior Full-Stack Developer
          </div>
        )}
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className={cn(
          "w-2 h-2 rounded-full bg-gradient-to-r from-primary to-primary/60",
          interactive && "animate-pulse"
        )} />
        <div className={cn(baseClasses, "text-muted-foreground")}>
          MAB
        </div>
      </div>
    );
  }

  // Artistic signature (default)
  return (
    <div className={cn("relative flex items-center justify-center", artisticSizes[size], className)}>
      <div className="flex items-center gap-2">
        {/* Mounir Icon */}
        <div className="relative">
          <img 
            src="/mounir-icon.svg" 
            alt="Mounir Signature" 
            className={cn(
              iconSizes[size], 
              "opacity-90 hover:opacity-100 transition-opacity duration-300",
              interactive && "hover:scale-110"
            )}
          />
        </div>
        
        {/* Signature SVG */}
        <div className="relative">
          <svg 
            viewBox="0 0 160 40" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className={cn(
              size === "xs" && "w-20 h-5",
              size === "sm" && "w-24 h-6",
              size === "md" && "w-32 h-8",
              size === "lg" && "w-40 h-10",
              size === "xl" && "w-48 h-12"
            )}
          >
            <defs>
              <linearGradient id="signatureGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{stopColor: "#4361ee", stopOpacity: 0.9}} />
                <stop offset="50%" style={{stopColor: "#7209b7", stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: "#f72585", stopOpacity: 0.8}} />
              </linearGradient>
              <filter id="signatureGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Stylized signature path */}
            <path 
              d="M5 25 Q15 15 25 25 Q35 35 45 25 Q55 15 65 25 Q75 35 85 25 Q95 15 105 25 Q115 35 125 25 Q135 15 145 25 Q150 20 155 25" 
              stroke="url(#signatureGradient)" 
              strokeWidth="2.5" 
              fill="none" 
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#signatureGlow)"
              className="opacity-90"
            />
            
            {/* Decorative underline */}
            <path 
              d="M5 32 Q80 29 155 32" 
              stroke="url(#signatureGradient)" 
              strokeWidth="1" 
              fill="none" 
              strokeLinecap="round"
              className="opacity-60"
            />
            
            {/* Animated decorative elements */}
            <circle cx="20" cy="15" r="1" fill="#4361ee" className="opacity-70 animate-pulse" style={{animationDelay: "0s"}} />
            <circle cx="80" cy="15" r="0.8" fill="#7209b7" className="opacity-60 animate-pulse" style={{animationDelay: "1s"}} />
            <circle cx="140" cy="15" r="1" fill="#f72585" className="opacity-70 animate-pulse" style={{animationDelay: "2s"}} />
          </svg>
        </div>
      </div>
    </div>
  );
}

export function ProfessionalSignature({ 
  className, 
  size = "md",
  interactive = false,
  showTitle = false
}: SignatureProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <img 
        src="/mounir-icon.svg" 
        alt="Mounir Abderrahmani" 
        className={cn(
          iconSizes[size], 
          "opacity-80",
          interactive && "hover:scale-110 transition-transform duration-300"
        )}
      />
      <div className="flex flex-col">
        <div className={cn("font-medium text-muted-foreground", sizeClasses[size])}>
          Mounir Abderrahmani
        </div>
        {showTitle && (
          <div className={cn(
            "text-muted-foreground/70 font-normal",
            size === "xs" && "text-xs",
            size === "sm" && "text-xs", 
            size === "md" && "text-sm",
            size === "lg" && "text-base",
            size === "xl" && "text-lg"
          )}>
            Senior Full-Stack Developer
          </div>
        )}
      </div>
    </div>
  );
}

// Mobile-optimized signature for headers and footers
export function MobileSignature({ 
  className,
  size = "sm"
}: Pick<SignatureProps, "className" | "size">) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <img 
        src="/mounir-icon.svg" 
        alt="MA" 
        className={iconSizes[size]}
      />
      <div className={cn("font-signature", sizeClasses[size])}>
        <span className="hidden sm:inline">Mounir Abderrahmani</span>
        <span className="sm:hidden">M. Abderrahmani</span>
      </div>
    </div>
  );
}

// Compact signature for small spaces
export function CompactSignature({ 
  className,
  size = "xs"
}: Pick<SignatureProps, "className" | "size">) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
      <div className={cn("font-signature text-muted-foreground", sizeClasses[size])}>
        MAB
      </div>
    </div>
  );
}