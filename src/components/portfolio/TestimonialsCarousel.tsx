import React, { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Quote, 
  Play, 
  Pause,
  ExternalLink,
  User,
  Building,
  Calendar,
  Heart,
  Share2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useAccessibility";

// Rating component
interface RatingProps {
  rating: number;
  maxRating?: number;
  showNumber?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Rating: React.FC<RatingProps> = ({ 
  rating, 
  maxRating = 5, 
  showNumber = false, 
  size = "md",
  className 
}) => {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4", 
    lg: "w-5 h-5"
  };

  const iconSize = sizeClasses[size];

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: maxRating }, (_, i) => (
        <Star
          key={i}
          className={cn(
            iconSize,
            i < rating 
              ? "fill-yellow-400 text-yellow-400" 
              : "fill-muted text-muted-foreground"
          )}
        />
      ))}
      {showNumber && (
        <span className="text-sm text-muted-foreground ml-2">
          {rating}/{maxRating}
        </span>
      )}
    </div>
  );
};

// Testimonial data interface
export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar?: string;
  content: string;
  rating?: number;
  date?: string;
  projectType?: string;
  skills?: string[];
  verified?: boolean;
  featured?: boolean;
  linkedInUrl?: string;
  companyUrl?: string;
  tags?: string[];
}

// Carousel configuration
export interface CarouselConfig {
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  showProgress?: boolean;
  pauseOnHover?: boolean;
  infinite?: boolean;
  slidesToShow?: number;
  slidesToScroll?: number;
  centerMode?: boolean;
  adaptiveHeight?: boolean;
  transitionDuration?: number;
  swipeThreshold?: number;
}

// Main component props
export interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
  config?: CarouselConfig;
  className?: string;
  cardVariant?: "default" | "minimal" | "detailed" | "compact";
  showFilters?: boolean;
  onTestimonialClick?: (testimonial: Testimonial) => void;
  onShare?: (testimonial: Testimonial) => void;
  enableKeyboardNavigation?: boolean;
  enableSwipeGestures?: boolean;
}

// Default configuration
const DEFAULT_CONFIG: CarouselConfig = {
  autoPlay: true,
  autoPlayInterval: 5000,
  showDots: true,
  showArrows: true,
  showProgress: false,
  pauseOnHover: true,
  infinite: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  centerMode: false,
  adaptiveHeight: false,
  transitionDuration: 500,
  swipeThreshold: 50
};

// Individual testimonial card
interface TestimonialCardProps {
  testimonial: Testimonial;
  variant: "default" | "minimal" | "detailed" | "compact";
  isActive?: boolean;
  onClick?: () => void;
  onShare?: () => void;
  className?: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  testimonial,
  variant,
  isActive = false,
  onClick,
  onShare,
  className
}) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const renderAvatar = () => (
    <div className="relative">
      {testimonial.avatar && !imageError ? (
        <img
          src={testimonial.avatar}
          alt={testimonial.name}
          className="w-12 h-12 rounded-full object-cover"
          onError={handleImageError}
        />
      ) : (
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
          <User className="w-6 h-6 text-muted-foreground" />
        </div>
      )}
      
      {testimonial.verified && (
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background flex items-center justify-center">
          <Star className="w-2 h-2 text-white fill-white" />
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (variant) {
      case "minimal":
        return (
          <div className="text-center space-y-4">
            <Quote className="w-8 h-8 text-primary mx-auto opacity-50" />
            <blockquote className="text-lg italic text-muted-foreground leading-relaxed font-sans">
              "{testimonial.content}"
            </blockquote>
            <div className="flex items-center justify-center gap-3">
              {renderAvatar()}
              <div>
                <p className="font-semibold text-lg font-heading">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground font-sans">{testimonial.role}</p>
              </div>
            </div>
          </div>
        );

      case "compact":
        return (
          <div className="flex gap-3">
            {renderAvatar()}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-sm font-heading">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground font-sans">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
                {testimonial.rating && (
                  <Rating rating={testimonial.rating} size="sm" />
                )}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed font-sans">
                "{testimonial.content}"
              </p>
            </div>
          </div>
        );

      case "detailed":
        return (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                {renderAvatar()}
                <div>
                  <h4 className="font-semibold text-lg font-heading">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground font-sans">{testimonial.role}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Building className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground font-sans">{testimonial.company}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                {testimonial.rating && (
                  <Rating rating={testimonial.rating} size="sm" showNumber />
                )}
                {testimonial.date && (
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {testimonial.date}
                  </div>
                )}
              </div>
            </div>

            <blockquote className="text-muted-foreground italic relative">
              <Quote className="w-6 h-6 text-primary/30 absolute -top-2 -left-2" />
              <p className="relative z-10 text-lg leading-relaxed font-sans">{testimonial.content}</p>
            </blockquote>

            {(testimonial.projectType || testimonial.skills) && (
              <div className="space-y-3">
                {testimonial.projectType && (
                  <div>
                    <span className="text-xs font-medium text-muted-foreground font-sans">Project:</span>
                    <Badge variant="secondary" className="ml-2 text-xs font-sans">
                      {testimonial.projectType}
                    </Badge>
                  </div>
                )}
                
                {testimonial.skills && testimonial.skills.length > 0 && (
                  <div>
                    <span className="text-xs font-medium text-muted-foreground font-sans">Skills:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {testimonial.skills.slice(0, 4).map(skill => (
                        <Badge key={skill} variant="outline" className="text-xs font-sans">
                          {skill}
                        </Badge>
                      ))}
                      {testimonial.skills.length > 4 && (
                        <Badge variant="outline" className="text-xs font-sans">
                          +{testimonial.skills.length - 4}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {(testimonial.linkedInUrl || testimonial.companyUrl) && (
              <div className="flex gap-2 pt-4 border-t border-border">
                {testimonial.linkedInUrl && (
                  <Button variant="outline" size="sm" asChild className="font-sans">
                    <a href={testimonial.linkedInUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      LinkedIn
                    </a>
                  </Button>
                )}
                {testimonial.companyUrl && (
                  <Button variant="outline" size="sm" asChild className="font-sans">
                    <a href={testimonial.companyUrl} target="_blank" rel="noopener noreferrer">
                      <Building className="w-3 h-3 mr-1" />
                      Company
                    </a>
                  </Button>
                )}
                {onShare && (
                  <Button variant="ghost" size="sm" onClick={onShare} className="font-sans">
                    <Share2 className="w-3 h-3 mr-1" />
                    Share
                  </Button>
                )}
              </div>
            )}
          </div>
        );

      default: // "default"
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {renderAvatar()}
              <div className="flex-1">
                <h4 className="font-semibold text-lg font-heading">{testimonial.name}</h4>
                <p className="text-sm text-muted-foreground font-sans">
                  {testimonial.role} at {testimonial.company}
                </p>
              </div>
              {testimonial.rating && (
                <Rating rating={testimonial.rating} size="sm" />
              )}
            </div>

            <blockquote className="text-muted-foreground italic text-lg leading-relaxed font-sans">
              "{testimonial.content}"
            </blockquote>

            {testimonial.tags && testimonial.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {testimonial.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs font-sans">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <Card 
      className={cn(
        "h-full transition-all duration-300 cursor-pointer",
        isActive ? "ring-2 ring-primary shadow-lg" : "hover:shadow-md",
        testimonial.featured && "border-primary/50",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-6">
        {testimonial.featured && (
          <Badge className="mb-4" variant="default">
            <Star className="w-3 h-3 mr-1" />
            Featured
          </Badge>
        )}
        {renderContent()}
      </CardContent>
    </Card>
  );
};

// Main Testimonials Carousel component
export const TestimonialsCarousel: React.FC<TestimonialsCarouselProps> = ({
  testimonials,
  config = {},
  className,
  cardVariant = "detailed",
  showFilters = false,
  onTestimonialClick,
  onShare,
  enableKeyboardNavigation = true,
  enableSwipeGestures = true
}) => {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  const prefersReducedMotion = useReducedMotion();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(mergedConfig.autoPlay);
  const [filter, setFilter] = useState<string | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  const intervalRef = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter testimonials
  const filteredTestimonials = filter 
    ? testimonials.filter(t => 
        t.company.toLowerCase().includes(filter.toLowerCase()) ||
        t.role.toLowerCase().includes(filter.toLowerCase()) ||
        t.tags?.some(tag => tag.toLowerCase().includes(filter.toLowerCase()))
      )
    : testimonials;

  const totalSlides = filteredTestimonials.length;

  // Navigation functions
  const goToSlide = useCallback((index: number) => {
    if (mergedConfig.infinite) {
      setCurrentIndex((index + totalSlides) % totalSlides);
    } else {
      setCurrentIndex(Math.max(0, Math.min(index, totalSlides - 1)));
    }
  }, [totalSlides, mergedConfig.infinite]);

  const nextSlide = useCallback(() => {
    goToSlide(currentIndex + (mergedConfig.slidesToScroll || 1));
  }, [currentIndex, goToSlide, mergedConfig.slidesToScroll]);

  const prevSlide = useCallback(() => {
    goToSlide(currentIndex - (mergedConfig.slidesToScroll || 1));
  }, [currentIndex, goToSlide, mergedConfig.slidesToScroll]);

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && !prefersReducedMotion && totalSlides > 1) {
      intervalRef.current = setInterval(nextSlide, mergedConfig.autoPlayInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, nextSlide, mergedConfig.autoPlayInterval, prefersReducedMotion, totalSlides]);

  // Keyboard navigation
  useEffect(() => {
    if (!enableKeyboardNavigation) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          prevSlide();
          break;
        case "ArrowRight":
          e.preventDefault();
          nextSlide();
          break;
        case " ":
          e.preventDefault();
          setIsPlaying(prev => !prev);
          break;
        case "Home":
          e.preventDefault();
          goToSlide(0);
          break;
        case "End":
          e.preventDefault();
          goToSlide(totalSlides - 1);
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [enableKeyboardNavigation, prevSlide, nextSlide, goToSlide, totalSlides]);

  // Touch/Swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!enableSwipeGestures) return;
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!enableSwipeGestures) return;
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!enableSwipeGestures || !touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > (mergedConfig.swipeThreshold || 50);
    const isRightSwipe = distance < -(mergedConfig.swipeThreshold || 50);

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  // Pause on hover
  const handleMouseEnter = () => {
    if (mergedConfig.pauseOnHover) {
      setIsPlaying(false);
    }
  };

  const handleMouseLeave = () => {
    if (mergedConfig.pauseOnHover && mergedConfig.autoPlay) {
      setIsPlaying(true);
    }
  };

  // Get unique companies/roles for filter
  const filterOptions = Array.from(new Set([
    ...testimonials.map(t => t.company),
    ...testimonials.map(t => t.role),
    ...testimonials.flatMap(t => t.tags || [])
  ])).sort();

  if (totalSlides === 0) {
    return (
      <div className="text-center py-12">
        <Quote className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No testimonials available</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Filters */}
      {showFilters && filterOptions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filter === null ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(null)}
          >
            All
          </Button>
          {filterOptions.slice(0, 6).map(option => (
            <Button
              key={option}
              variant={filter === option ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(option)}
            >
              {option}
            </Button>
          ))}
        </div>
      )}

      {/* Carousel Container */}
      <div
        ref={containerRef}
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Navigation Arrows */}
        {mergedConfig.showArrows && totalSlides > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 shadow-lg"
              onClick={prevSlide}
              disabled={!mergedConfig.infinite && currentIndex === 0}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 shadow-lg"
              onClick={nextSlide}
              disabled={!mergedConfig.infinite && currentIndex >= totalSlides - 1}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </>
        )}

        {/* Slides */}
        <div className="overflow-hidden rounded-lg">
          <div 
            className={cn(
              "flex transition-transform duration-500 ease-out",
              prefersReducedMotion && "transition-none"
            )}
            style={{
              transform: `translateX(-${currentIndex * 100}%)`
            }}
          >
            {filteredTestimonials.map((testimonial, index) => (
              <div 
                key={testimonial.id} 
                className="w-full flex-shrink-0 px-2"
              >
                <TestimonialCard
                  testimonial={testimonial}
                  variant={cardVariant}
                  isActive={index === currentIndex}
                  onClick={() => onTestimonialClick?.(testimonial)}
                  onShare={() => onShare?.(testimonial)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        {mergedConfig.showProgress && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="h-1 bg-background/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / totalSlides) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        {/* Dots Navigation */}
        {mergedConfig.showDots && totalSlides > 1 && (
          <div className="flex gap-2">
            {filteredTestimonials.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-200",
                  index === currentIndex 
                    ? "bg-primary scale-125" 
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                )}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Play/Pause Control */}
        {mergedConfig.autoPlay && totalSlides > 1 && (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </Button>
            <span className="text-sm text-muted-foreground">
              {currentIndex + 1} / {totalSlides}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonialsCarousel;