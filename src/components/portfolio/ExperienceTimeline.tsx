/**
 * Professional Experience Timeline Component
 * Vertical timeline with company logos, scroll-triggered animations, and expandable sections
 */

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ChevronDown, 
  ChevronUp, 
  MapPin, 
  Calendar,
  Award,
  ExternalLink,
  Building2,
  Clock
} from 'lucide-react';

// Experience data interface
export interface Experience {
  id: string;
  company: string;
  position: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  location?: string;
  type: 'full-time' | 'part-time' | 'contract' | 'freelance' | 'internship';
  skills: string[];
  achievements: string[];
  companyLogo?: string;
  companyUrl?: string;
  projects?: Array<{
    name: string;
    description: string;
    technologies: string[];
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    date: Date;
    url?: string;
  }>;
}

interface ExperienceTimelineProps {
  experiences: Experience[];
  className?: string;
  showAnimations?: boolean;
  compactMode?: boolean;
}

// Individual timeline item component
interface TimelineItemProps {
  experience: Experience;
  index: number;
  isLast: boolean;
  showAnimations: boolean;
  compactMode: boolean;
}

const TimelineItem: React.FC<TimelineItemProps> = ({
  experience,
  index,
  isLast,
  showAnimations,
  compactMode
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(!showAnimations);
  const itemRef = useRef<HTMLDivElement>(null);

  // Intersection observer for scroll animations
  useEffect(() => {
    if (!showAnimations) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), index * 200);
        }
      },
      { threshold: 0.2 }
    );

    if (itemRef.current) {
      observer.observe(itemRef.current);
    }

    return () => observer.disconnect();
  }, [showAnimations, index]);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const calculateDuration = (): string => {
    const start = experience.startDate;
    const end = experience.endDate || new Date();
    
    const months = (end.getFullYear() - start.getFullYear()) * 12 + 
                   (end.getMonth() - start.getMonth());
    
    if (months < 12) {
      return `${months} month${months !== 1 ? 's' : ''}`;
    }
    
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    let duration = `${years} year${years !== 1 ? 's' : ''}`;
    if (remainingMonths > 0) {
      duration += ` ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    }
    
    return duration;
  };

  const getTypeColor = (type: Experience['type']): string => {
    const colors = {
      'full-time': 'bg-blue-100 text-blue-800 border-blue-200',
      'part-time': 'bg-green-100 text-green-800 border-green-200',
      'contract': 'bg-purple-100 text-purple-800 border-purple-200',
      'freelance': 'bg-orange-100 text-orange-800 border-orange-200',
      'internship': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[type] || colors['full-time'];
  };

  return (
    <div
      ref={itemRef}
      className={cn(
        'relative flex gap-6 pb-8',
        !isLast && 'border-l-2 border-muted ml-6',
        showAnimations && !isVisible && 'opacity-0 translate-y-8',
        showAnimations && isVisible && 'opacity-100 translate-y-0 transition-all duration-700 ease-out'
      )}
    >
      {/* Timeline dot and line */}
      <div className="relative flex-shrink-0">
        <div 
          className={cn(
            'absolute -left-[25px] top-2 w-12 h-12 rounded-full border-4 border-background shadow-lg flex items-center justify-center transition-all duration-300',
            experience.current 
              ? 'bg-primary text-primary-foreground animate-pulse' 
              : 'bg-card hover:scale-110'
          )}
        >
          {experience.companyLogo ? (
            <img
              src={experience.companyLogo}
              alt={`${experience.company} logo`}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <Building2 className="w-6 h-6 text-muted-foreground" />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <Card className={cn(
          'transition-all duration-300 hover:shadow-lg',
          compactMode ? 'p-4' : 'p-6'
        )}>
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-foreground truncate">
                    {experience.position}
                  </h3>
                  {experience.current && (
                    <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                      Current
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  {experience.companyUrl ? (
                    <a
                      href={experience.companyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-medium flex items-center gap-1"
                    >
                      {experience.company}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="font-medium text-muted-foreground">
                      {experience.company}
                    </span>
                  )}
                  
                  <Badge className={getTypeColor(experience.type)}>
                    {experience.type.replace('-', ' ')}
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {formatDate(experience.startDate)} - {' '}
                      {experience.current ? 'Present' : formatDate(experience.endDate!)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{calculateDuration()}</span>
                  </div>
                  
                  {experience.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{experience.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {!compactMode && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex-shrink-0"
                >
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <p className="text-muted-foreground mb-4 leading-relaxed">
              {experience.description}
            </p>

            {/* Skills */}
            {experience.skills.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-foreground mb-2">Technologies & Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {experience.skills.map((skill, skillIndex) => (
                    <Badge
                      key={skillIndex}
                      variant="secondary"
                      className="text-xs"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Expandable content */}
            {(isExpanded || compactMode) && (
              <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                {/* Achievements */}
                {experience.achievements.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      Key Achievements
                    </h4>
                    <ul className="space-y-1">
                      {experience.achievements.map((achievement, achievementIndex) => (
                        <li
                          key={achievementIndex}
                          className="text-sm text-muted-foreground flex items-start gap-2"
                        >
                          <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Projects */}
                {experience.projects && experience.projects.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">Notable Projects</h4>
                    <div className="space-y-3">
                      {experience.projects.map((project, projectIndex) => (
                        <div key={projectIndex} className="border-l-2 border-muted pl-3">
                          <h5 className="text-sm font-medium text-foreground">{project.name}</h5>
                          <p className="text-xs text-muted-foreground mb-2">{project.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {project.technologies.map((tech, techIndex) => (
                              <Badge
                                key={techIndex}
                                variant="outline"
                                className="text-xs px-1 py-0"
                              >
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Certifications */}
                {experience.certifications && experience.certifications.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">Certifications</h4>
                    <div className="space-y-2">
                      {experience.certifications.map((cert, certIndex) => (
                        <div key={certIndex} className="flex items-center justify-between">
                          <div>
                            <span className="text-sm font-medium text-foreground">{cert.name}</span>
                            <span className="text-xs text-muted-foreground ml-2">by {cert.issuer}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {formatDate(cert.date)}
                            </span>
                            {cert.url && (
                              <a
                                href={cert.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:text-primary/80"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
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
  );
};

// Main timeline component
export const ExperienceTimeline: React.FC<ExperienceTimelineProps> = ({
  experiences,
  className,
  showAnimations = true,
  compactMode = false
}) => {
  const [filter, setFilter] = useState<'all' | Experience['type']>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Sort and filter experiences
  const processedExperiences = React.useMemo(() => {
    let filtered = experiences;
    
    if (filter !== 'all') {
      filtered = experiences.filter(exp => exp.type === filter);
    }
    
    return filtered.sort((a, b) => {
      const dateA = a.startDate.getTime();
      const dateB = b.startDate.getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });
  }, [experiences, filter, sortOrder]);

  const experienceTypes = Array.from(new Set(experiences.map(exp => exp.type)));

  return (
    <div className={cn('w-full max-w-4xl mx-auto', className)}>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-4">Professional Experience</h2>
        <p className="text-muted-foreground mb-6">
          My career journey and professional growth over the years
        </p>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">Filter:</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
              className="text-sm border border-input rounded-md px-2 py-1 bg-background"
            >
              <option value="all">All Types</option>
              {experienceTypes.map(type => (
                <option key={type} value={type}>
                  {type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">Sort:</span>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as typeof sortOrder)}
              className="text-sm border border-input rounded-md px-2 py-1 bg-background"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {processedExperiences.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No experiences found for the selected filter.</p>
          </div>
        ) : (
          processedExperiences.map((experience, index) => (
            <TimelineItem
              key={experience.id}
              experience={experience}
              index={index}
              isLast={index === processedExperiences.length - 1}
              showAnimations={showAnimations}
              compactMode={compactMode}
            />
          ))
        )}
      </div>

      {/* Summary */}
      <div className="mt-12 p-6 bg-muted/50 rounded-lg">
        <h3 className="text-lg font-semibold text-foreground mb-4">Career Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{experiences.length}</div>
            <div className="text-sm text-muted-foreground">Positions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {Array.from(new Set(experiences.map(exp => exp.company))).length}
            </div>
            <div className="text-sm text-muted-foreground">Companies</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {Array.from(new Set(experiences.flatMap(exp => exp.skills))).length}
            </div>
            <div className="text-sm text-muted-foreground">Technologies</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {Math.ceil((new Date().getTime() - Math.min(...experiences.map(exp => exp.startDate.getTime()))) / (1000 * 60 * 60 * 24 * 365))}
            </div>
            <div className="text-sm text-muted-foreground">Years</div>
          </div>
        </div>
      </div>
    </div>
  );
};