import React, { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useAccessibility";

// Animation configuration types
export interface ScrollAnimationConfig {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
  duration?: number;
  easing?: string;
}

export interface ParallaxConfig {
  speed?: number;
  direction?: "up" | "down" | "left" | "right";
  scale?: number;
  rotate?: number;
  opacity?: boolean;
}

// Scroll animation hook
export const useScrollAnimation = (
  config: ScrollAnimationConfig = {}
) => {
  const {
    threshold = 0.1,
    rootMargin = "0px",
    triggerOnce = true,
    delay = 0,
    duration = 1000,
    easing = "ease-out"
  } = config;

  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const element = elementRef.current;
    if (!element || prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting;
        
        if (isIntersecting && (!triggerOnce || !hasTriggered)) {
          setTimeout(() => {
            setIsVisible(true);
            setHasTriggered(true);
          }, delay);
        } else if (!triggerOnce && !isIntersecting) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    observer.observe(element);

    return () => observer.unobserve(element);
  }, [threshold, rootMargin, triggerOnce, delay, hasTriggered, prefersReducedMotion]);

  return {
    elementRef,
    isVisible,
    style: prefersReducedMotion ? {} : {
      transition: `all ${duration}ms ${easing}`,
      transitionDelay: `${delay}ms`
    }
  };
};

// Parallax scroll hook
export const useParallax = (config: ParallaxConfig = {}) => {
  const {
    speed = 0.5,
    direction = "up",
    scale = 1,
    rotate = 0,
    opacity = false
  } = config;

  const [transform, setTransform] = useState("");
  const elementRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const updateTransform = useCallback(() => {
    if (!elementRef.current || prefersReducedMotion) return;

    const element = elementRef.current;
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Calculate scroll progress (0 to 1)
    const scrollProgress = (windowHeight - rect.top) / (windowHeight + rect.height);
    
    if (scrollProgress >= 0 && scrollProgress <= 1) {
      const movement = (scrollProgress - 0.5) * 200 * speed;
      const scaleValue = scale + (scrollProgress - 0.5) * 0.1;
      const rotateValue = rotate * scrollProgress;
      const opacityValue = opacity ? Math.max(0.1, 1 - Math.abs(scrollProgress - 0.5) * 2) : 1;
      
      let translateX = 0;
      let translateY = 0;
      
      switch (direction) {
        case "up":
          translateY = -movement;
          break;
        case "down":
          translateY = movement;
          break;
        case "left":
          translateX = -movement;
          break;
        case "right":
          translateX = movement;
          break;
      }
      
      setTransform(
        `translate3d(${translateX}px, ${translateY}px, 0) scale(${scaleValue}) rotate(${rotateValue}deg)${
          opacity ? ` opacity(${opacityValue})` : ""
        }`
      );
    }
  }, [speed, direction, scale, rotate, opacity, prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleScroll = () => {
      requestAnimationFrame(updateTransform);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener("scroll", handleScroll);
  }, [updateTransform, prefersReducedMotion]);

  return {
    elementRef,
    style: prefersReducedMotion ? {} : {
      transform,
      willChange: "transform"
    }
  };
};

// Scroll-triggered animation component
export interface ScrollAnimationProps {
  children: React.ReactNode;
  animation?: "fadeIn" | "slideUp" | "slideDown" | "slideLeft" | "slideRight" | "scaleUp" | "rotateIn";
  className?: string;
  config?: ScrollAnimationConfig;
  as?: keyof JSX.IntrinsicElements;
}

export const ScrollAnimation: React.FC<ScrollAnimationProps> = ({
  children,
  animation = "fadeIn",
  className,
  config = {},
  as: Component = "div"
}) => {
  const { elementRef, isVisible, style } = useScrollAnimation(config);

  const animationClasses = {
    fadeIn: {
      initial: "opacity-0",
      animate: "opacity-100"
    },
    slideUp: {
      initial: "opacity-0 translate-y-8",
      animate: "opacity-100 translate-y-0"
    },
    slideDown: {
      initial: "opacity-0 -translate-y-8",
      animate: "opacity-100 translate-y-0"
    },
    slideLeft: {
      initial: "opacity-0 translate-x-8",
      animate: "opacity-100 translate-x-0"
    },
    slideRight: {
      initial: "opacity-0 -translate-x-8",
      animate: "opacity-100 translate-x-0"
    },
    scaleUp: {
      initial: "opacity-0 scale-95",
      animate: "opacity-100 scale-100"
    },
    rotateIn: {
      initial: "opacity-0 rotate-12 scale-95",
      animate: "opacity-100 rotate-0 scale-100"
    }
  };

  const { initial, animate } = animationClasses[animation];
  const animationClass = isVisible ? animate : initial;
  const combinedClassName = cn(
    "transition-all duration-1000 ease-out",
    animationClass,
    className
  );

  return React.createElement(
    Component,
    {
      ref: elementRef,
      className: combinedClassName,
      style
    },
    children
  );
};

// Parallax container component
export interface ParallaxProps {
  children: React.ReactNode;
  className?: string;
  config?: ParallaxConfig;
  as?: keyof JSX.IntrinsicElements;
}

export const Parallax: React.FC<ParallaxProps> = ({
  children,
  className,
  config = {},
  as: Component = "div"
}) => {
  const { elementRef, style } = useParallax(config);

  return React.createElement(
    Component,
    {
      ref: elementRef,
      className,
      style
    },
    children
  );
};

// Staggered animations for lists
export interface StaggeredAnimationProps {
  children: React.ReactNode[];
  className?: string;
  staggerDelay?: number;
  animation?: ScrollAnimationProps["animation"];
  config?: ScrollAnimationConfig;
}

export const StaggeredAnimation: React.FC<StaggeredAnimationProps> = ({
  children,
  className,
  staggerDelay = 100,
  animation = "slideUp",
  config = {}
}) => {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <ScrollAnimation
          key={index}
          animation={animation}
          config={{
            ...config,
            delay: (config.delay || 0) + index * staggerDelay
          }}
        >
          {child}
        </ScrollAnimation>
      ))}
    </div>
  );
};

// Smooth scroll utility
export const smoothScrollTo = (
  element: Element | string,
  options: ScrollIntoViewOptions = {}
) => {
  const target = typeof element === "string" 
    ? document.querySelector(element) 
    : element;

  if (target) {
    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
      ...options
    });
  }
};

// Smooth scroll hook for navigation
export const useSmoothScroll = () => {
  const scrollTo = useCallback((elementId: string, offset: number = 0) => {
    const element = document.getElementById(elementId);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, []);

  return { scrollTo, scrollToTop };
};

// Scroll progress indicator component
export interface ScrollProgressProps {
  className?: string;
  color?: string;
  height?: number;
  position?: "top" | "bottom";
}

export const ScrollProgress: React.FC<ScrollProgressProps> = ({
  className,
  color = "bg-primary",
  height = 3,
  position = "top"
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
      const scrollCurrent = window.pageYOffset;
      const progress = (scrollCurrent / scrollTotal) * 100;
      setScrollProgress(Math.min(Math.max(progress, 0), 100));
    };

    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    updateScrollProgress(); // Initial call

    return () => window.removeEventListener("scroll", updateScrollProgress);
  }, []);

  return (
    <div
      className={cn(
        "fixed left-0 right-0 z-50",
        position === "top" ? "top-0" : "bottom-0",
        className
      )}
      style={{ height: `${height}px` }}
    >
      <div
        className={cn("h-full transition-all duration-300 ease-out", color)}
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
};

// Scroll spy hook for navigation highlighting
export const useScrollSpy = (
  sectionIds: string[],
  offset: number = 100
) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.pageYOffset + offset;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const section = document.getElementById(sectionIds[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sectionIds[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener("scroll", handleScroll);
  }, [sectionIds, offset]);

  return activeSection;
};

// Intersection Observer hook for elements
export const useInView = (
  threshold: number = 0.1,
  rootMargin: string = "0px"
) => {
  const [inView, setInView] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        setEntry(entry);
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.unobserve(element);
  }, [threshold, rootMargin]);

  return { elementRef, inView, entry };
};

