import { cn } from "@/lib/utils";

interface SignatureProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const Signature = ({ className, size = "md" }: SignatureProps) => {
  const sizeClasses = {
    sm: "w-20 h-10",
    md: "w-32 h-16",
    lg: "w-48 h-24"
  };

  return (
    <div className={cn("relative flex items-center justify-center", sizeClasses[size], className)}>
      <div className="flex items-center gap-4">
        {/* Mounir Icon */}
        <div className="relative">
          <img 
            src="/mounir-icon.svg" 
            alt="Mounir Signature" 
            className="w-12 h-12 opacity-90 hover:opacity-100 transition-opacity duration-300"
          />
        </div>
        
        {/* Signature Text */}
        <div className="relative">
          <svg 
            viewBox="0 0 160 40" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="w-32 h-8"
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
            
            {/* Stylized "Mounir Abderrahmani" signature */}
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
            
            {/* Small decorative elements */}
            <circle cx="20" cy="15" r="1" fill="#4361ee" className="opacity-70 animate-pulse" style={{animationDelay: "0s"}} />
            <circle cx="80" cy="15" r="0.8" fill="#7209b7" className="opacity-60 animate-pulse" style={{animationDelay: "1s"}} />
            <circle cx="140" cy="15" r="1" fill="#f72585" className="opacity-70 animate-pulse" style={{animationDelay: "2s"}} />
          </svg>
        </div>
      </div>
    </div>
  );
};

export const ProfessionalSignature = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <img 
        src="/mounir-icon.svg" 
        alt="Mounir Professional Signature" 
        className="w-8 h-8 opacity-80"
      />
      <div className="text-sm font-medium text-muted-foreground">
        Mounir Abderrahmani
      </div>
    </div>
  );
};