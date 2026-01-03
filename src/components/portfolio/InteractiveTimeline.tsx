import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  MapPin, 
  Building, 
  Award, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp,
  Star,
  Users,
  TrendingUp,
  Code,
  Briefcase,
  GraduationCap,
  Heart,
  Rocket,
  Target
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useAccessibility";
import { ScrollAnimation } from "./ScrollAnimations";

// Timeline item interface
export interface TimelineItem {
  id: string;
  title: string;
  company?: string;
  location?: string;
  startDate: string;
  endDate?: string; // undefined means current position
  description: string;
  achievements?: string[];
  skills?: string[];
  technologies?: string[];
  projects?: Array<{
    name: string;
    description: string;
    url?: string;
  }>;
  companyLogo?: string;
  companyUrl?: string;
  type: "work" | "education" | "certification" | "project" | "achievement";
  featured?: boolean;
  tags?: string[];
  metrics?: Array<{
    label: string;
    value: string;
    icon?: React.ReactNode;
  }>;
}

// Timeline configuration
export interface TimelineConfig {
  orientation?: "vertical" | "horizontal";
  showConnectors?: boolean;
  showDates?: boolean;
  showIcons?: boolean;
  enableExpansion?: boolean;
  enableFiltering?: boolean;
  enableSearch?: boolean;
  animateOnScroll?: boolean;
  centerMode?: boolean;
  compactMode?: boolean;
}

// Main component props
export interface InteractiveTimelineProps {
  items: TimelineItem[];
  config?: TimelineConfig;
  className?: string;
  onItemClick?: (item: TimelineItem) => void;
  onItemExpand?: (item: TimelineItem, expanded: boolean) => void;
  selectedItemId?: string;
  enableVirtualization?: boolean;
  maxHeight?: string;
}

// Default configuration
const DEFAULT_CONFIG: TimelineConfig = {
  orientation: "vertical",
  showConnectors: true,
  showDates: true,
  showIcons: true,
  enableExpansion: true,
  enableFiltering: true,
  enableSearch: false,
  animateOnScroll: true,
  centerMode: false,
  compactMode: false
};

// Type icons mapping
const TYPE_ICONS = {
  work: <Briefcase className="w-4 h-4" />,
  education: <GraduationCap className="w-4 h-4" />,
  certification: <Award className="w-4 h-4" />,
  project: <Code className="w-4 h-4" />,
  achievement: <Star className="w-4 h-4" />
};

// Type colors mapping
const TYPE_COLORS = {
  work: "bg-blue-500",
  education: "bg-green-500",
  certification: "bg-purple-500",
  project: "bg-orange-500",
  achievement: "bg-yellow-500"
};

// Individual timeline item component
interface TimelineItemComponentProps {
  item: TimelineItem;
  config: TimelineConfig;
  isExpanded: boolean;
  isSelected: boolean;
  onToggleExpand: () => void;
  onClick: () => void;
  index: number;
  isLast: boolean;
}

const TimelineItemComponent: React.FC<TimelineItemComponentProps> = ({
  item,
  config,
  isExpanded,
  isSelected,
  onToggleExpand,
  onClick,
  index,
  isLast
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [imageError, setImageError] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
  };

  const getDuration = () => {
    const start = new Date(item.startDate);
    const end = item.endDate ? new Date(item.endDate) : new Date();
    const months = (end.getFullYear() - start.getFullYear()) * 12 + 
                   (end.getMonth() - start.getMonth());
    
    if (months < 12) {
      return `${months} month${months !== 1 ? 's' : ''}`;
    }
    
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (remainingMonths === 0) {
      return `${years} year${years !== 1 ? 's' : ''}`;
    }
    
    return `${years} year${years !== 1 ? 's' : ''}, ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
  };

  const isCurrent = !item.endDate;

  return (
    <ScrollAnimation 
      animation="slideUp" 
      config={{ delay: index * 100 }}
      className={cn(
        "relative",
        config.orientation === "horizontal" && "inline-block"
      )}
    >
      <div className={cn(
        "flex gap-4",
        config.orientation === "vertical" && "items-start",
        config.centerMode && config.orientation === "vertical" && (
          index % 2 === 0 ? "flex-row" : "flex-row-reverse"
        )
      )}>
        {/* Timeline connector and icon */}
        {config.orientation === "vertical" && (
          <div className="flex flex-col items-center flex-shrink-0">
            {/* Icon */}
            {config.showIcons && (
              <div className={cn(
                "relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 border-background shadow-lg transition-all duration-300",
                TYPE_COLORS[item.type],
                isSelected && "scale-110 ring-2 ring-primary ring-offset-2",
                isCurrent && "animate-pulse"
              )}>
                <div className="text-white">
                  {TYPE_ICONS[item.type]}
                </div>
                
                {isCurrent && (
                  <div className="absolute inset-0 rounded-full bg-current animate-ping opacity-20" />
                )}
              </div>
            )}
            
            {/* Connector line */}
            {config.showConnectors && !isLast && (
              <div className={cn(
                "w-0.5 h-16 mt-2 transition-colors duration-300",
                isSelected ? "bg-primary" : "bg-border"
              )} />
            )}
          </div>
        )}

        {/* Content */}
        <div className={cn(
          "flex-1 min-w-0",
          config.centerMode && config.orientation === "vertical" && index % 2 === 1 && "text-right"
        )}>
          {/* Date badge */}
          {config.showDates && (
            <div className={cn(
              "inline-flex items-center gap-1 mb-2",
              config.centerMode && config.orientation === "vertical" && index % 2 === 1 && "justify-end"
            )}>
              <Badge variant="outline" className="text-xs">
                <Calendar className="w-3 h-3 mr-1" />
                {formatDate(item.startDate)} - {item.endDate ? formatDate(item.endDate) : 'Present'}
              </Badge>
              
              {item.featured && (
                <Badge variant="default" className="text-xs">
                  <Star className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              )}
            </div>
          )}

          {/* Main card */}
          <Card className={cn(
            "transition-all duration-300 cursor-pointer",
            isSelected && "ring-2 ring-primary shadow-lg",
            isExpanded && "shadow-xl",
            "hover:shadow-md"
          )}>
            <CardHeader 
              className="pb-3 cursor-pointer"
              onClick={onClick}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg leading-tight font-heading">
                    {item.title}
                  </CardTitle>
                  
                  {item.company && (
                    <div className="flex items-center gap-2 mt-1">
                      {item.companyLogo && !imageError ? (
                        <img
                          src={item.companyLogo}
                          alt={item.company}
                          className="w-5 h-5 rounded object-cover"
                          onError={() => setImageError(true)}
                        />
                      ) : (
                        <Building className="w-4 h-4 text-muted-foreground" />
                      )}
                      
                      <span className="text-primary font-medium">
                        {item.companyUrl ? (
                          <a 
                            href={item.companyUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {item.company}
                          </a>
                        ) : (
                          item.company
                        )}
                      </span>
                    </div>
                  )}
                  
                  {item.location && (
                    <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {item.location}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Badge variant="secondary" className="text-xs">
                    {getDuration()}
                  </Badge>
                  
                  {config.enableExpansion && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleExpand();
                      }}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              {/* Description */}
              <p className="text-muted-foreground mb-4">
                {item.description}
              </p>

              {/* Skills and Technologies */}
              {(item.skills || item.technologies) && (
                <div className="space-y-2 mb-4">
                  {item.skills && item.skills.length > 0 && (
                    <div>
                      <span className="text-xs font-medium text-muted-foreground block mb-1">
                        Skills:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {item.skills.slice(0, isExpanded ? undefined : 5).map(skill => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {!isExpanded && item.skills.length > 5 && (
                          <Badge variant="outline" className="text-xs">
                            +{item.skills.length - 5} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {item.technologies && item.technologies.length > 0 && (
                    <div>
                      <span className="text-xs font-medium text-muted-foreground block mb-1">
                        Technologies:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {item.technologies.slice(0, isExpanded ? undefined : 4).map(tech => (
                          <Badge key={tech} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                        {!isExpanded && item.technologies.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{item.technologies.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Expanded content */}
              {isExpanded && (
                <div className="space-y-4 border-t pt-4">
                  {/* Achievements */}
                  {item.achievements && item.achievements.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Target className="w-4 h-4 text-green-500" />
                        Key Achievements
                      </h4>
                      <ul className="space-y-1">
                        {item.achievements.map((achievement, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                            <div className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0" />
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Projects */}
                  {item.projects && item.projects.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Rocket className="w-4 h-4 text-blue-500" />
                        Notable Projects
                      </h4>
                      <div className="space-y-2">
                        {item.projects.map((project, index) => (
                          <div key={index} className="border rounded-lg p-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <h5 className="font-medium text-sm">{project.name}</h5>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {project.description}
                                </p>
                              </div>
                              {project.url && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  asChild
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <a
                                    href={project.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Metrics */}
                  {item.metrics && item.metrics.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-purple-500" />
                        Impact & Results
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {item.metrics.map((metric, index) => (
                          <div key={index} className="text-center p-2 bg-muted/50 rounded">
                            <div className="flex items-center justify-center gap-1 mb-1">
                              {metric.icon}
                              <span className="font-bold text-primary">{metric.value}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {metric.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ScrollAnimation>
  );
};

// Main Interactive Timeline component
export const InteractiveTimeline: React.FC<InteractiveTimelineProps> = ({
  items,
  config = {},
  className,
  onItemClick,
  onItemExpand,
  selectedItemId,
  enableVirtualization = false,
  maxHeight
}) => {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [filteredItems, setFilteredItems] = useState(items);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Sort items by date (newest first)
  const sortedItems = [...filteredItems].sort((a, b) => 
    new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  // Filter and search functionality
  useEffect(() => {
    let filtered = items;

    // Apply type filter
    if (activeFilter) {
      filtered = filtered.filter(item => item.type === activeFilter);
    }

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(term) ||
        item.company?.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term) ||
        item.skills?.some(skill => skill.toLowerCase().includes(term)) ||
        item.technologies?.some(tech => tech.toLowerCase().includes(term))
      );
    }

    setFilteredItems(filtered);
  }, [items, activeFilter, searchTerm]);

  // Handle item expansion
  const handleToggleExpand = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
    
    const item = items.find(i => i.id === itemId);
    if (item) {
      onItemExpand?.(item, newExpanded.has(itemId));
    }
  };

  // Handle item click
  const handleItemClick = (item: TimelineItem) => {
    onItemClick?.(item);
  };

  // Get unique types for filtering
  const uniqueTypes = Array.from(new Set(items.map(item => item.type)));

  return (
    <div className={cn("space-y-6", className)}>
      {/* Filters and Search */}
      {(mergedConfig.enableFiltering || mergedConfig.enableSearch) && (
        <div className="space-y-4">
          {/* Search */}
          {mergedConfig.enableSearch && (
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="Search timeline..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          )}

          {/* Type filters */}
          {mergedConfig.enableFiltering && (
            <div className="flex flex-wrap gap-2">
              <Button
                variant={activeFilter === null ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(null)}
              >
                All
              </Button>
              {uniqueTypes.map(type => (
                <Button
                  key={type}
                  variant={activeFilter === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter(type)}
                  className="gap-2"
                >
                  {TYPE_ICONS[type]}
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Timeline */}
      <div 
        className={cn(
          "relative",
          maxHeight && "overflow-y-auto",
          mergedConfig.orientation === "horizontal" && "overflow-x-auto",
          mergedConfig.compactMode && "space-y-2"
        )}
        style={{ maxHeight }}
      >
        {mergedConfig.orientation === "vertical" ? (
          <div className="space-y-6">
            {sortedItems.map((item, index) => (
              <TimelineItemComponent
                key={item.id}
                item={item}
                config={mergedConfig}
                isExpanded={expandedItems.has(item.id)}
                isSelected={selectedItemId === item.id}
                onToggleExpand={() => handleToggleExpand(item.id)}
                onClick={() => handleItemClick(item)}
                index={index}
                isLast={index === sortedItems.length - 1}
              />
            ))}
          </div>
        ) : (
          <div className="flex gap-6 pb-4">
            {sortedItems.map((item, index) => (
              <div key={item.id} className="min-w-[300px]">
                <TimelineItemComponent
                  item={item}
                  config={mergedConfig}
                  isExpanded={expandedItems.has(item.id)}
                  isSelected={selectedItemId === item.id}
                  onToggleExpand={() => handleToggleExpand(item.id)}
                  onClick={() => handleItemClick(item)}
                  index={index}
                  isLast={index === sortedItems.length - 1}
                />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {sortedItems.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No timeline items found</h3>
            <p className="text-muted-foreground">
              {searchTerm || activeFilter 
                ? "Try adjusting your search or filter criteria"
                : "No timeline items available"
              }
            </p>
          </div>
        )}
      </div>

      {/* Summary */}
      {sortedItems.length > 0 && (
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground border-t pt-4">
          <span>{sortedItems.length} items shown</span>
          <span>•</span>
          <span>{uniqueTypes.length} categories</span>
          <span>•</span>
          <span>{expandedItems.size} expanded</span>
        </div>
      )}
    </div>
  );
};

export default InteractiveTimeline;