import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Trophy, 
  Zap, 
  Star, 
  TrendingUp, 
  Code2, 
  Palette, 
  Database, 
  Globe,
  Filter,
  Search,
  SortAsc
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useAccessibility";

// Skill data interface
export interface Skill {
  id: string;
  name: string;
  category: "frontend" | "backend" | "design" | "tools" | "languages" | "frameworks";
  level: number; // 0-100
  experience: string; // e.g., "3 years"
  description?: string;
  projects?: number;
  certifications?: string[];
  trending?: boolean;
  icon?: React.ReactNode;
  color?: string;
}

// Component props
export interface SkillVisualizationProps {
  skills: Skill[];
  className?: string;
  showCategories?: boolean;
  showFilters?: boolean;
  showSearch?: boolean;
  layout?: "grid" | "list" | "circles";
  animationDuration?: number;
  enableHover?: boolean;
  enableClick?: boolean;
  onSkillClick?: (skill: Skill) => void;
  onSkillHover?: (skill: Skill | null) => void;
  sortBy?: "level" | "name" | "experience" | "projects";
  sortOrder?: "asc" | "desc";
}

// Category configuration
const CATEGORY_CONFIG = {
  frontend: { 
    label: "Frontend", 
    icon: <Globe className="w-4 h-4" />, 
    color: "bg-blue-500", 
    lightColor: "bg-blue-100" 
  },
  backend: { 
    label: "Backend", 
    icon: <Database className="w-4 h-4" />, 
    color: "bg-green-500", 
    lightColor: "bg-green-100" 
  },
  design: { 
    label: "Design", 
    icon: <Palette className="w-4 h-4" />, 
    color: "bg-purple-500", 
    lightColor: "bg-purple-100" 
  },
  tools: { 
    label: "Tools", 
    icon: <Code2 className="w-4 h-4" />, 
    color: "bg-orange-500", 
    lightColor: "bg-orange-100" 
  },
  languages: { 
    label: "Languages", 
    icon: <Zap className="w-4 h-4" />, 
    color: "bg-red-500", 
    lightColor: "bg-red-100" 
  },
  frameworks: { 
    label: "Frameworks", 
    icon: <Star className="w-4 h-4" />, 
    color: "bg-indigo-500", 
    lightColor: "bg-indigo-100" 
  }
};

// Progress ring component
interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  showText?: boolean;
  animated?: boolean;
  duration?: number;
  className?: string;
}

const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 120,
  strokeWidth = 8,
  color = "#3b82f6",
  backgroundColor = "#e5e7eb",
  showText = true,
  animated = true,
  duration = 2000,
  className
}) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference.toFixed(3);
  const strokeDashoffset = (circumference - (animatedProgress / 100) * circumference).toFixed(3);

  useEffect(() => {
    if (prefersReducedMotion) {
      setAnimatedProgress(progress);
      return;
    }

    if (!animated) {
      setAnimatedProgress(progress);
      return;
    }

    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 100);

    return () => clearTimeout(timer);
  }, [progress, animated, prefersReducedMotion]);

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: prefersReducedMotion ? 'none' : `stroke-dashoffset ${duration}ms ease-in-out`,
          }}
        />
      </svg>
      
      {showText && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-foreground">
            {Math.round(animatedProgress)}%
          </span>
        </div>
      )}
    </div>
  );
};

// Individual skill card component
interface SkillCardProps {
  skill: Skill;
  layout: "grid" | "list" | "circles";
  enableHover: boolean;
  enableClick: boolean;
  onSkillClick?: (skill: Skill) => void;
  onSkillHover?: (skill: Skill | null) => void;
  animationDuration: number;
}

const SkillCard: React.FC<SkillCardProps> = ({
  skill,
  layout,
  enableHover,
  enableClick,
  onSkillClick,
  onSkillHover,
  animationDuration
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const category = CATEGORY_CONFIG[skill.category];

  const handleMouseEnter = () => {
    if (enableHover) {
      setIsHovered(true);
      onSkillHover?.(skill);
    }
  };

  const handleMouseLeave = () => {
    if (enableHover) {
      setIsHovered(false);
      onSkillHover?.(null);
    }
  };

  const handleClick = () => {
    if (enableClick) {
      onSkillClick?.(skill);
    }
  };

  if (layout === "circles") {
    return (
      <div 
        className={cn(
          "relative group cursor-pointer transition-all duration-300",
          isHovered && "scale-110 z-10"
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <div className="flex flex-col items-center space-y-2">
          <ProgressRing
            progress={skill.level}
            color={skill.color || category.color.replace('bg-', '#')}
            animated={true}
            duration={animationDuration}
            size={100}
            className="drop-shadow-lg"
          />
          
          <div className="text-center">
            <h3 className="font-semibold text-sm">{skill.name}</h3>
            <p className="text-xs text-muted-foreground">{skill.experience}</p>
          </div>
          
          {skill.trending && (
            <Badge variant="secondary" className="absolute -top-2 -right-2">
              <TrendingUp className="w-3 h-3" />
            </Badge>
          )}
        </div>
        
        {/* Hover tooltip */}
        {isHovered && skill.description && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-popover text-popover-foreground text-xs rounded-lg shadow-lg border whitespace-nowrap z-20">
            {skill.description}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-popover"></div>
          </div>
        )}
      </div>
    );
  }

  return (
    <Card
      className={cn(
        "transition-all duration-300 hover:shadow-lg",
        enableClick && "cursor-pointer",
        isHovered && "shadow-xl scale-[1.02]",
        layout === "list" && "flex items-center"
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <CardContent className={cn(
        "p-4",
        layout === "list" && "flex items-center space-x-4 w-full"
      )}>
        <div className={cn(
          layout === "grid" && "flex flex-col items-center space-y-4",
          layout === "list" && "flex items-center space-x-4 flex-1"
        )}>
          {/* Progress Ring */}
          <ProgressRing
            progress={skill.level}
            color={skill.color || category.color.replace('bg-', '#')}
            animated={true}
            duration={animationDuration}
            size={layout === "list" ? 60 : 80}
          />
          
          {/* Skill Info */}
          <div className={cn(
            layout === "grid" && "text-center",
            layout === "list" && "flex-1"
          )}>
            <div className="flex items-center gap-2 mb-1">
              {category.icon}
              <h3 className="font-semibold">{skill.name}</h3>
              {skill.trending && (
                <Badge variant="secondary">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Trending
                </Badge>
              )}
            </div>
            
            <p className="text-sm text-muted-foreground mb-2">{skill.experience}</p>
            
            {skill.description && (
              <p className="text-xs text-muted-foreground mb-2">{skill.description}</p>
            )}
            
            <div className="flex flex-wrap gap-1 mb-2">
              <Badge 
                variant="outline" 
                className={cn(category.lightColor, "text-xs")}
              >
                {category.label}
              </Badge>
              
              {skill.projects && (
                <Badge variant="outline" className="text-xs">
                  {skill.projects} projects
                </Badge>
              )}
            </div>
            
            {skill.certifications && skill.certifications.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Trophy className="w-3 h-3" />
                <span>{skill.certifications.length} cert{skill.certifications.length > 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Main skill visualization component
export const SkillVisualization: React.FC<SkillVisualizationProps> = ({
  skills,
  className,
  showCategories = true,
  showFilters = true,
  showSearch = true,
  layout = "grid",
  animationDuration = 2000,
  enableHover = true,
  enableClick = true,
  onSkillClick,
  onSkillHover,
  sortBy = "level",
  sortOrder = "desc"
}) => {
  const [filteredSkills, setFilteredSkills] = useState(skills);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSort, setCurrentSort] = useState({ by: sortBy, order: sortOrder });
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter and sort skills
  useEffect(() => {
    let filtered = [...skills];

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(skill => skill.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(skill =>
        skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort skills
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (currentSort.by) {
        case "level":
          comparison = a.level - b.level;
          break;
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "experience":
          comparison = parseInt(a.experience) - parseInt(b.experience);
          break;
        case "projects":
          comparison = (a.projects || 0) - (b.projects || 0);
          break;
      }
      
      return currentSort.order === "desc" ? -comparison : comparison;
    });

    setFilteredSkills(filtered);
  }, [skills, selectedCategory, searchTerm, currentSort]);

  // Get unique categories
  const categories = Array.from(new Set(skills.map(skill => skill.category)));

  // Layout classes
  const layoutClasses = {
    grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",
    list: "space-y-3",
    circles: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6"
  };

  return (
    <div ref={containerRef} className={cn("space-y-6", className)}>
      {/* Controls */}
      {(showFilters || showSearch) && (
        <div className="space-y-4">
          {/* Search */}
          {showSearch && (
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          )}

          {/* Filters and Sort */}
          {showFilters && (
            <div className="flex flex-wrap items-center gap-4">
              {/* Category Filter */}
              {showCategories && (
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedCategory === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(null)}
                  >
                    All Categories
                  </Button>
                  {categories.map(category => {
                    const config = CATEGORY_CONFIG[category];
                    return (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                        className="gap-2"
                      >
                        {config.icon}
                        {config.label}
                      </Button>
                    );
                  })}
                </div>
              )}

              {/* Sort */}
              <div className="flex items-center gap-2">
                <SortAsc className="w-4 h-4 text-muted-foreground" />
                <select
                  value={`${currentSort.by}-${currentSort.order}`}
                  onChange={(e) => {
                    const [by, order] = e.target.value.split('-') as [typeof sortBy, typeof sortOrder];
                    setCurrentSort({ by, order });
                  }}
                  className="px-3 py-1 border rounded text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="level-desc">Level (High to Low)</option>
                  <option value="level-asc">Level (Low to High)</option>
                  <option value="name-asc">Name (A to Z)</option>
                  <option value="name-desc">Name (Z to A)</option>
                  <option value="experience-desc">Experience (Most to Least)</option>
                  <option value="experience-asc">Experience (Least to Most)</option>
                  <option value="projects-desc">Projects (Most to Least)</option>
                  <option value="projects-asc">Projects (Least to Most)</option>
                </select>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Skills Grid */}
      <div className={layoutClasses[layout]}>
        {filteredSkills.map((skill) => (
          <SkillCard
            key={skill.id}
            skill={skill}
            layout={layout}
            enableHover={enableHover}
            enableClick={enableClick}
            onSkillClick={onSkillClick}
            onSkillHover={onSkillHover}
            animationDuration={animationDuration}
          />
        ))}
      </div>

      {/* Empty state */}
      {filteredSkills.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No skills found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search terms or category filters.
          </p>
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory(null);
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Stats Summary */}
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        <span>{filteredSkills.length} skills shown</span>
        <span>•</span>
        <span>Average level: {Math.round(filteredSkills.reduce((sum, skill) => sum + skill.level, 0) / filteredSkills.length)}%</span>
        <span>•</span>
        <span>{categories.length} categories</span>
      </div>
    </div>
  );
};

export default SkillVisualization;