import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Code2, 
  Database, 
  Palette, 
  Globe, 
  Zap, 
  Star,
  Trophy,
  TrendingUp,
  Calendar,
  Briefcase
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme/theme-toggle";

// Skill interface
export interface CompactSkill {
  id: string;
  name: string;
  category: "frontend" | "backend" | "design" | "tools" | "languages" | "frameworks";
  level: number; // 0-100
  experience: string;
  description: string;
  projects?: number;
  certifications?: string[];
  trending?: boolean;
  color?: string;
  yearsOfExperience?: number;
  lastUsed?: string;
  proficiency?: "Beginner" | "Intermediate" | "Advanced" | "Expert";
}

// Category configuration
const CATEGORIES = {
  frontend: { 
    label: "Frontend", 
    icon: <Globe className="w-4 h-4" />, 
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    borderColor: "border-blue-200 dark:border-blue-800"
  },
  backend: { 
    label: "Backend", 
    icon: <Database className="w-4 h-4" />, 
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    borderColor: "border-green-200 dark:border-green-800"
  },
  design: { 
    label: "Design", 
    icon: <Palette className="w-4 h-4" />, 
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    borderColor: "border-purple-200 dark:border-purple-800"
  },
  tools: { 
    label: "Tools", 
    icon: <Code2 className="w-4 h-4" />, 
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-50 dark:bg-orange-950/20",
    borderColor: "border-orange-200 dark:border-orange-800"
  },
  languages: { 
    label: "Languages", 
    icon: <Zap className="w-4 h-4" />, 
    color: "from-yellow-500 to-orange-500",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
    borderColor: "border-yellow-200 dark:border-yellow-800"
  },
  frameworks: { 
    label: "Frameworks", 
    icon: <Star className="w-4 h-4" />, 
    color: "from-indigo-500 to-purple-500",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/20",
    borderColor: "border-indigo-200 dark:border-indigo-800"
  }
};

// Default skills data
const DEFAULT_SKILLS: CompactSkill[] = [
  // Frontend
  {
    id: "react",
    name: "React",
    category: "frontend",
    level: 95,
    experience: "5+ years",
    description: "Advanced React development with hooks, context, and modern patterns",
    projects: 25,
    certifications: ["React Professional"],
    trending: true,
    yearsOfExperience: 5,
    lastUsed: "Currently using",
    proficiency: "Expert"
  },
  {
    id: "typescript",
    name: "TypeScript",
    category: "frontend",
    level: 90,
    experience: "4+ years",
    description: "Type-safe JavaScript development with advanced TypeScript features",
    projects: 20,
    yearsOfExperience: 4,
    lastUsed: "Currently using",
    proficiency: "Expert"
  },
  {
    id: "nextjs",
    name: "Next.js",
    category: "frameworks",
    level: 88,
    experience: "3+ years",
    description: "Full-stack React framework with SSR, SSG, and API routes",
    projects: 15,
    trending: true,
    yearsOfExperience: 3,
    lastUsed: "Currently using",
    proficiency: "Advanced"
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    category: "design",
    level: 92,
    experience: "3+ years",
    description: "Utility-first CSS framework for rapid UI development",
    projects: 18,
    yearsOfExperience: 3,
    lastUsed: "Currently using",
    proficiency: "Expert"
  },
  
  // Backend
  {
    id: "nodejs",
    name: "Node.js",
    category: "backend",
    level: 85,
    experience: "4+ years",
    description: "Server-side JavaScript runtime for scalable applications",
    projects: 22,
    yearsOfExperience: 4,
    lastUsed: "Currently using",
    proficiency: "Advanced"
  },
  {
    id: "python",
    name: "Python",
    category: "languages",
    level: 80,
    experience: "3+ years",
    description: "Versatile programming language for web development and data processing",
    projects: 12,
    yearsOfExperience: 3,
    lastUsed: "Last month",
    proficiency: "Advanced"
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    category: "backend",
    level: 82,
    experience: "3+ years",
    description: "Advanced relational database with complex queries and optimization",
    projects: 16,
    yearsOfExperience: 3,
    lastUsed: "Currently using",
    proficiency: "Advanced"
  },
  
  // Tools
  {
    id: "docker",
    name: "Docker",
    category: "tools",
    level: 78,
    experience: "2+ years",
    description: "Containerization platform for consistent development and deployment",
    projects: 14,
    yearsOfExperience: 2,
    lastUsed: "Currently using",
    proficiency: "Intermediate"
  },
  {
    id: "aws",
    name: "AWS",
    category: "tools",
    level: 75,
    experience: "2+ years",
    description: "Cloud computing services for scalable infrastructure",
    projects: 10,
    certifications: ["AWS Solutions Architect"],
    yearsOfExperience: 2,
    lastUsed: "Currently using",
    proficiency: "Intermediate"
  }
];

// Compact skill card component
const CompactSkillCard: React.FC<{ skill: CompactSkill; category: any }> = ({ skill, category }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md cursor-pointer",
      category.bgColor,
      category.borderColor,
      "border-l-4"
    )}
    onClick={() => setIsExpanded(!isExpanded)}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {category.icon}
              <h3 className="font-semibold text-sm">{skill.name}</h3>
              {skill.trending && (
                <Badge variant="secondary" className="px-1.5 py-0.5 text-xs">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Hot
                </Badge>
              )}
            </div>
            <div className="text-right">
              <div className="text-xs font-medium">{skill.level}%</div>
              <div className="text-xs text-muted-foreground">{skill.proficiency}</div>
            </div>
          </div>

          {/* Progress Bar */}
          <Progress value={skill.level} className="h-2" />

          {/* Basic Info */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{skill.experience}</span>
              </div>
              {skill.projects && (
                <div className="flex items-center gap-1">
                  <Briefcase className="w-3 h-3" />
                  <span>{skill.projects} projects</span>
                </div>
              )}
            </div>
            <div className="text-xs">
              {skill.lastUsed}
            </div>
          </div>

          {/* Expanded Details */}
          {isExpanded && (
            <div className="space-y-2 pt-2 border-t border-border/50">
              <p className="text-sm text-muted-foreground">
                {skill.description}
              </p>
              
              {skill.certifications && skill.certifications.length > 0 && (
                <div className="flex items-center gap-2">
                  <Trophy className="w-3 h-3 text-yellow-500" />
                  <div className="flex flex-wrap gap-1">
                    {skill.certifications.map((cert, index) => (
                      <Badge key={index} variant="outline" className="text-xs px-1.5 py-0.5">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Main component props
export interface CompactSkillsSectionProps {
  skills?: CompactSkill[];
  className?: string;
  showHeader?: boolean;
  defaultTab?: string;
}

// Main compact skills section component
export const CompactSkillsSection: React.FC<CompactSkillsSectionProps> = ({
  skills = DEFAULT_SKILLS,
  className,
  showHeader = true,
  defaultTab = "frontend"
}) => {
  // Group skills by category
  const skillsByCategory = useMemo(() => {
    const grouped = skills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {} as Record<string, CompactSkill[]>);

    // Sort skills within each category by level (descending)
    Object.keys(grouped).forEach(category => {
      grouped[category].sort((a, b) => b.level - a.level);
    });

    return grouped;
  }, [skills]);

  // Get available categories
  const availableCategories = Object.keys(skillsByCategory).filter(
    category => skillsByCategory[category].length > 0
  );

  // Calculate category stats
  const categoryStats = useMemo(() => {
    return availableCategories.reduce((acc, category) => {
      const categorySkills = skillsByCategory[category];
      const avgLevel = categorySkills.reduce((sum, skill) => sum + skill.level, 0) / categorySkills.length;
      const totalProjects = categorySkills.reduce((sum, skill) => sum + (skill.projects || 0), 0);
      
      acc[category] = {
        count: categorySkills.length,
        avgLevel: Math.round(avgLevel),
        totalProjects,
        expertSkills: categorySkills.filter(s => s.level >= 90).length
      };
      return acc;
    }, {} as Record<string, any>);
  }, [skillsByCategory, availableCategories]);

  return (
    <section className={cn("py-16 px-4", className)}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        {showHeader && (
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-4">
              <h2 className="text-3xl font-bold">Technical Skills</h2>
              <ThemeToggle />
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A comprehensive overview of my technical expertise across different domains
            </p>
          </div>
        )}

        {/* Skills Tabs */}
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-8">
            {availableCategories.map((category) => {
              const config = CATEGORIES[category as keyof typeof CATEGORIES];
              const stats = categoryStats[category];
              
              return (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  className="flex flex-col items-center gap-1 p-3"
                >
                  <div className="flex items-center gap-1">
                    {config.icon}
                    <span className="hidden sm:inline">{config.label}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                    {stats.count}
                  </Badge>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Tab Content */}
          {availableCategories.map((category) => {
            const config = CATEGORIES[category as keyof typeof CATEGORIES];
            const categorySkills = skillsByCategory[category];
            const stats = categoryStats[category];

            return (
              <TabsContent key={category} value={category} className="space-y-6">
                {/* Category Header */}
                <Card className={cn(config.bgColor, config.borderColor, "border-l-4")}>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2">
                      {config.icon}
                      {config.label} Skills
                    </CardTitle>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-semibold text-lg">{stats.count}</div>
                        <div className="text-muted-foreground">Skills</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-lg">{stats.avgLevel}%</div>
                        <div className="text-muted-foreground">Avg Level</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-lg">{stats.totalProjects}</div>
                        <div className="text-muted-foreground">Projects</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-lg">{stats.expertSkills}</div>
                        <div className="text-muted-foreground">Expert Level</div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {/* Skills Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categorySkills.map((skill) => (
                    <CompactSkillCard 
                      key={skill.id} 
                      skill={skill} 
                      category={config}
                    />
                  ))}
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </section>
  );
};

export default CompactSkillsSection;