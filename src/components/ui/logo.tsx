import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const Logo = ({ className, size = "md" }: LogoProps) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10", 
    lg: "w-12 h-12"
  };

  return (
    <div className={cn("relative group", sizeClasses[size], className)}>
      <svg 
        viewBox="0 0 40 40" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full transition-transform duration-300 group-hover:scale-110"
      >
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" className="text-primary" style={{stopColor: "currentColor"}} />
            <stop offset="100%" className="text-blue-500" style={{stopColor: "currentColor"}} />
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Main circle background */}
        <circle 
          cx="20" 
          cy="20" 
          r="18" 
          fill="url(#logoGradient)" 
          filter="url(#glow)"
          className="drop-shadow-lg"
        />
        
        {/* Letter M with professional styling */}
        <path 
          d="M10 28V12h3l4 10 4-10h3v16h-2.5V16.5L17.5 26h-1L12.5 16.5V28H10z" 
          fill="white" 
          stroke="white" 
          strokeWidth="0.5"
          className="drop-shadow-sm"
        />
        
        {/* Signature underline */}
        <path 
          d="M12 30 Q20 28 28 30" 
          stroke="white" 
          strokeWidth="1.5" 
          fill="none" 
          strokeLinecap="round"
          className="opacity-90"
        />
        
        {/* Small dots for professional touch */}
        <circle cx="32" cy="12" r="1" fill="white" className="opacity-80 animate-pulse" style={{animationDelay: "0s"}} />
        <circle cx="35" cy="15" r="0.8" fill="white" className="opacity-60 animate-pulse" style={{animationDelay: "0.5s"}} />
      </svg>
    </div>
  );
};

export const SignatureLogo = ({ className }: { className?: string }) => {
  return (
    <div className={cn("relative", className)}>
      <svg 
        viewBox="0 0 120 40" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="signatureGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" className="text-primary" style={{stopColor: "currentColor"}} />
            <stop offset="50%" className="text-blue-500" style={{stopColor: "currentColor"}} />
            <stop offset="100%" className="text-purple-500" style={{stopColor: "currentColor"}} />
          </linearGradient>
        </defs>
        
        {/* Signature text path */}
        <path 
          d="M5 25 Q15 15 25 25 Q35 35 45 25 Q55 15 65 25 Q75 35 85 25 Q95 15 105 25 Q110 30 115 25" 
          stroke="url(#signatureGradient)" 
          strokeWidth="2" 
          fill="none" 
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-80"
        />
        
        {/* Decorative dots */}
        <circle cx="10" cy="20" r="1.5" fill="currentColor" className="text-primary opacity-60" />
        <circle cx="110" cy="20" r="1.5" fill="currentColor" className="text-primary opacity-60" />
      </svg>
    </div>
  );
};