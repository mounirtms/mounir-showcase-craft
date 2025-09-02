import React, { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  Download, 
  ExternalLink, 
  Github, 
  Linkedin, 
  Mail, 
  MapPin,
  Sparkles,
  Code,
  Palette,
  Zap
} from "lucide-react";
import { CompactSkillsSection } from "./CompactSkillsSection";

// Particle system interfaces
interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
}

interface HeroSectionProps {
  name: string;
  title: string;
  subtitle?: string;
  description: string;
  location?: string;
  skills: string[];
  socialLinks: {
    github?: string;
    linkedin?: string;
    email?: string;
    resume?: string;
  };
  avatar?: string;
  backgroundGradient?: string;
  className?: string;
  enableParticles?: boolean;
  enableTypingEffect?: boolean;
}

// Typing effect hook
const useTypingEffect = (
  texts: string[], 
  speed: number = 100, 
  deleteSpeed: number = 50,
  pauseDuration: number = 2000
) => {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (texts.length === 0) return;

    const timeout = setTimeout(() => {
      if (isPaused) {
        setIsPaused(false);
        setIsDeleting(true);
        return;
      }

      const currentFullText = texts[currentIndex];
      
      if (!isDeleting) {
        // Typing
        if (currentText.length < currentFullText.length) {
          setCurrentText(currentFullText.slice(0, currentText.length + 1));
        } else {
          setIsPaused(true);
        }
      } else {
        // Deleting
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
        }
      }
    }, isPaused ? pauseDuration : isDeleting ? deleteSpeed : speed);

    return () => clearTimeout(timeout);
  }, [currentText, currentIndex, isDeleting, isPaused, texts, speed, deleteSpeed, pauseDuration]);

  return currentText;
};

// Particle system component
const ParticleSystem: React.FC<{
  enabled: boolean;
  particleCount?: number;
  colors?: string[];
}> = ({ 
  enabled, 
  particleCount = 80,
  colors = ["#3b82f6", "#8b5cf6", "#ec4899", "#06b6d4", "#10b981"]
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const animationId = useRef<number>();
  const mousePosition = useRef({ x: 0, y: 0 });

  // Initialize particles
  const initParticles = useCallback(() => {
    particles.current = [];
    for (let i = 0; i < particleCount; i++) {
      particles.current.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: Math.random() * 100,
        maxLife: 100
      });
    }
  }, [particleCount, colors]);

  // Update particles
  const updateParticles = useCallback(() => {
    particles.current.forEach(particle => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Wrap around screen
      if (particle.x < 0) particle.x = window.innerWidth;
      if (particle.x > window.innerWidth) particle.x = 0;
      if (particle.y < 0) particle.y = window.innerHeight;
      if (particle.y > window.innerHeight) particle.y = 0;

      // Update life
      particle.life += 0.2;
      if (particle.life >= particle.maxLife) {
        particle.life = 0;
        particle.opacity = Math.random() * 0.5 + 0.1;
      }

      // Mouse interaction
      const dx = mousePosition.current.x - particle.x;
      const dy = mousePosition.current.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 100) {
        const force = (100 - distance) / 100;
        particle.vx -= (dx / distance) * force * 0.01;
        particle.vy -= (dy / distance) * force * 0.01;
      }

      // Restore original velocity
      particle.vx = particle.vx * 0.99 + (Math.random() - 0.5) * 0.001;
      particle.vy = particle.vy * 0.99 + (Math.random() - 0.5) * 0.001;
    });
  }, []);

  // Draw particles
  const drawParticles = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Draw connections
    particles.current.forEach((particle, i) => {
      particles.current.slice(i + 1).forEach(otherParticle => {
        const dx = particle.x - otherParticle.x;
        const dy = particle.y - otherParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          const opacity = (100 - distance) / 100 * 0.1;
          ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(otherParticle.x, otherParticle.y);
          ctx.stroke();
        }
      });
    });

    // Draw particles
    particles.current.forEach(particle => {
      ctx.fillStyle = particle.color;
      ctx.globalAlpha = particle.opacity;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });
    
    ctx.globalAlpha = 1;
  }, []);

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    
    if (!enabled || !canvas || !ctx) return;

    updateParticles();
    drawParticles(ctx);
    
    animationId.current = requestAnimationFrame(animate);
  }, [enabled, updateParticles, drawParticles]);

  // Mouse move handler
  const handleMouseMove = useCallback((e: MouseEvent) => {
    mousePosition.current = { x: e.clientX, y: e.clientY };
  }, []);

  // Resize handler
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Setup canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Initialize particles
    initParticles();

    // Start animation
    animationId.current = requestAnimationFrame(animate);

    // Event listeners
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    return () => {
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, [enabled, initParticles, animate, handleMouseMove, handleResize]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
};

// Main Hero Section Component
export const HeroSection: React.FC<HeroSectionProps> = ({
  name,
  title,
  subtitle,
  description,
  location,
  skills,
  socialLinks,
  avatar,
  backgroundGradient = "from-blue-50 via-indigo-50 to-purple-50",
  className,
  enableParticles = true,
  enableTypingEffect = true
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);

  // Typing effect for titles
  const typingTitles = [title, subtitle].filter(Boolean) as string[];
  const animatedTitle = useTypingEffect(
    enableTypingEffect && !prefersReducedMotion ? typingTitles : [title],
    100,
    50,
    2000
  );

  // Intersection observer for animations
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section 
      className={cn(
        "relative min-h-[120vh] flex items-center justify-center overflow-hidden",
        `bg-gradient-to-br ${backgroundGradient}`,
        className
      )}
    >
      {/* Particle Background */}
      <ParticleSystem enabled={enableParticles && !prefersReducedMotion} />

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="grid grid-cols-1 gap-12 items-center">
          
          {/* Text Content */}
          <div className={cn(
            "space-y-8 transition-all duration-1000 ease-out",
            isVisible 
              ? "opacity-100 translate-x-0" 
              : "opacity-0 -translate-x-10"
          )}>
            {/* Greeting */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-lg text-muted-foreground">
                <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                <span>Hello, I'm</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight font-heading tracking-tight">
                {name}
              </h1>
              
              <div className="text-2xl lg:text-3xl font-semibold text-primary min-h-[2em] font-heading tracking-normal">
                {enableTypingEffect && !prefersReducedMotion ? (
                  <span>
                    {animatedTitle}
                    <span className="animate-pulse">|</span>
                  </span>
                ) : (
                  title
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl font-sans">
              {description}
            </p>

            {/* Location */}
            {location && (
              <div className="flex items-center gap-2 text-gray-500">
                <MapPin className="w-4 h-4" />
                <span>{location}</span>
              </div>
            )}

            {/* Skills Section */}
            <div className="mt-8">
              <CompactSkillsSection showHeader={false} />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg"
                className="group transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <Mail className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                Get In Touch
              </Button>
              
              {socialLinks.resume && (
                <Button 
                  variant="outline" 
                  size="lg"
                  className="group transition-all duration-300 hover:scale-105"
                >
                  <Download className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                  Resume
                </Button>
              )}
            </div>

            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.github && (
                <Button variant="ghost" size="icon" className="hover:scale-110 transition-transform">
                  <Github className="w-5 h-5" />
                </Button>
              )}
              {socialLinks.linkedin && (
                <Button variant="ghost" size="icon" className="hover:scale-110 transition-transform">
                  <Linkedin className="w-5 h-5" />
                </Button>
              )}
              {socialLinks.email && (
                <Button variant="ghost" size="icon" className="hover:scale-110 transition-transform">
                  <Mail className="w-5 h-5" />
                </Button>
              )}
            </div>
          </div>

          {/* Avatar/Visual Content */}
          <div className={cn(
            "relative transition-all duration-1000 ease-out delay-300",
            isVisible 
              ? "opacity-100 translate-x-0" 
              : "opacity-0 translate-x-10"
          )}>
            {/* Decorative Elements */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full blur-3xl" />
            
            {/* Avatar Container */}
            <div className="relative z-10 aspect-square max-w-md mx-auto">
              {avatar ? (
                <img 
                  src={avatar}
                  alt={name}
                  className="w-full h-full object-cover rounded-full shadow-2xl"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
                  <span className="text-6xl font-bold text-white">
                    {name.charAt(0)}
                  </span>
                </div>
              )}
              
              {/* Floating Icons */}
              <div className="absolute -top-4 -right-4 bg-white rounded-full p-3 shadow-lg animate-bounce">
                <Code className="w-6 h-6 text-primary" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-full p-3 shadow-lg animate-bounce delay-150">
                <Palette className="w-6 h-6 text-purple-600" />
              </div>
              <div className="absolute top-1/2 -right-8 bg-white rounded-full p-3 shadow-lg animate-bounce delay-300">
                <Zap className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
export type { HeroSectionProps };