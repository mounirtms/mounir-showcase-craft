import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SkillVisualization, { Skill } from "./SkillVisualization";
import { 
  Code2, 
  Database, 
  Palette, 
  Globe, 
  Zap, 
  Star,
  Layout,
  Grid3X3,
  List,
  Circle
} from "lucide-react";

// Sample skill data
const SAMPLE_SKILLS: Skill[] = [
  // Frontend
  {
    id: "react",
    name: "React",
    category: "frontend",
    level: 95,
    experience: "4 years",
    description: "Advanced React development with hooks, context, and modern patterns",
    projects: 15,
    certifications: ["React Professional", "Frontend Masters"],
    trending: true,
    icon: <Code2 className="w-4 h-4" />,
    color: "#61DAFB"
  },
  {
    id: "typescript",
    name: "TypeScript",
    category: "languages",
    level: 90,
    experience: "3 years",
    description: "Type-safe JavaScript development with advanced type patterns",
    projects: 12,
    certifications: ["TypeScript Expert"],
    trending: true,
    color: "#3178C6"
  },
  {
    id: "nextjs",
    name: "Next.js",
    category: "frameworks",
    level: 88,
    experience: "2 years",
    description: "Full-stack React framework with SSR and API routes",
    projects: 8,
    trending: true,
    color: "#000000"
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    category: "design",
    level: 92,
    experience: "2 years",
    description: "Utility-first CSS framework for rapid UI development",
    projects: 10,
    color: "#38BDF8"
  },
  
  // Backend
  {
    id: "nodejs",
    name: "Node.js",
    category: "backend",
    level: 85,
    experience: "3 years",
    description: "Server-side JavaScript with Express and microservices",
    projects: 10,
    certifications: ["Node.js Certified Developer"],
    color: "#339933"
  },
  {
    id: "python",
    name: "Python",
    category: "languages",
    level: 80,
    experience: "2 years",
    description: "Backend development with Django and Flask",
    projects: 6,
    color: "#3776AB"
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    category: "backend",
    level: 75,
    experience: "2 years",
    description: "Advanced SQL queries and database optimization",
    projects: 8,
    color: "#336791"
  },
  {
    id: "mongodb",
    name: "MongoDB",
    category: "backend",
    level: 70,
    experience: "1 year",
    description: "NoSQL database design and aggregation pipelines",
    projects: 5,
    color: "#47A248"
  },

  // Design
  {
    id: "figma",
    name: "Figma",
    category: "design",
    level: 85,
    experience: "3 years",
    description: "UI/UX design and prototyping",
    projects: 12,
    color: "#F24E1E"
  },
  {
    id: "adobe-xd",
    name: "Adobe XD",
    category: "design",
    level: 70,
    experience: "2 years",
    description: "User experience design and wireframing",
    projects: 6,
    color: "#FF61F6"
  },

  // Tools
  {
    id: "git",
    name: "Git",
    category: "tools",
    level: 90,
    experience: "4 years",
    description: "Version control and collaborative development",
    projects: 20,
    certifications: ["Git Professional"],
    color: "#F05032"
  },
  {
    id: "docker",
    name: "Docker",
    category: "tools",
    level: 75,
    experience: "2 years",
    description: "Containerization and deployment",
    projects: 8,
    color: "#2496ED"
  },
  {
    id: "aws",
    name: "AWS",
    category: "tools",
    level: 65,
    experience: "1 year",
    description: "Cloud services and serverless architecture",
    projects: 4,
    certifications: ["AWS Cloud Practitioner"],
    trending: true,
    color: "#FF9900"
  },

  // Additional skills for demonstration
  {
    id: "javascript",
    name: "JavaScript",
    category: "languages",
    level: 95,
    experience: "5 years",
    description: "Modern ES6+ JavaScript development",
    projects: 25,
    color: "#F7DF1E"
  },
  {
    id: "css",
    name: "CSS",
    category: "frontend",
    level: 88,
    experience: "4 years",
    description: "Advanced CSS with animations and responsive design",
    projects: 20,
    color: "#1572B6"
  },
  {
    id: "html",
    name: "HTML",
    category: "frontend",
    level: 95,
    experience: "5 years",
    description: "Semantic HTML and accessibility best practices",
    projects: 25,
    color: "#E34F26"
  }
];

// Demo component
export const SkillVisualizationDemo: React.FC = () => {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null);
  const [currentLayout, setCurrentLayout] = useState<"grid" | "list" | "circles">("grid");

  const handleSkillClick = (skill: Skill) => {
    setSelectedSkill(skill);
  };

  const handleSkillHover = (skill: Skill | null) => {
    setHoveredSkill(skill);
  };

  // Calculate statistics
  const stats = {
    totalSkills: SAMPLE_SKILLS.length,
    averageLevel: Math.round(SAMPLE_SKILLS.reduce((sum, skill) => sum + skill.level, 0) / SAMPLE_SKILLS.length),
    expertSkills: SAMPLE_SKILLS.filter(skill => skill.level >= 90).length,
    trendingSkills: SAMPLE_SKILLS.filter(skill => skill.trending).length,
    totalProjects: SAMPLE_SKILLS.reduce((sum, skill) => sum + (skill.projects || 0), 0),
    totalCertifications: SAMPLE_SKILLS.reduce((sum, skill) => sum + (skill.certifications?.length || 0), 0)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Interactive Skill Visualization
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore technical skills with animated progress rings and interactive filters
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalSkills}</div>
              <div className="text-sm text-muted-foreground">Total Skills</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.averageLevel}%</div>
              <div className="text-sm text-muted-foreground">Avg Level</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.expertSkills}</div>
              <div className="text-sm text-muted-foreground">Expert Level</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.trendingSkills}</div>
              <div className="text-sm text-muted-foreground">Trending</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.totalProjects}</div>
              <div className="text-sm text-muted-foreground">Projects</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-indigo-600">{stats.totalCertifications}</div>
              <div className="text-sm text-muted-foreground">Certifications</div>
            </CardContent>
          </Card>
        </div>

        {/* Layout Controls */}
        <div className="flex justify-center">
          <div className="flex rounded-lg border bg-background">
            <Button
              variant={currentLayout === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setCurrentLayout("grid")}
              className="rounded-r-none"
            >
              <Grid3X3 className="w-4 h-4 mr-2" />
              Grid
            </Button>
            <Button
              variant={currentLayout === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setCurrentLayout("list")}
              className="rounded-none border-x"
            >
              <List className="w-4 h-4 mr-2" />
              List
            </Button>
            <Button
              variant={currentLayout === "circles" ? "default" : "ghost"}
              size="sm"
              onClick={() => setCurrentLayout("circles")}
              className="rounded-l-none"
            >
              <Circle className="w-4 h-4 mr-2" />
              Circles
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Skill Visualization */}
          <div className="xl:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layout className="w-5 h-5" />
                  Skills Overview - {currentLayout.charAt(0).toUpperCase() + currentLayout.slice(1)} Layout
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SkillVisualization
                  skills={SAMPLE_SKILLS}
                  layout={currentLayout}
                  showCategories={true}
                  showFilters={true}
                  showSearch={true}
                  enableHover={true}
                  enableClick={true}
                  onSkillClick={handleSkillClick}
                  onSkillHover={handleSkillHover}
                  animationDuration={2000}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Hovered Skill */}
            {hoveredSkill && (
              <Card className="border-blue-200 bg-blue-50/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {hoveredSkill.icon}
                    {hoveredSkill.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Proficiency</span>
                    <span className="font-semibold">{hoveredSkill.level}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Experience</span>
                    <span className="font-semibold">{hoveredSkill.experience}</span>
                  </div>
                  {hoveredSkill.projects && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Projects</span>
                      <span className="font-semibold">{hoveredSkill.projects}</span>
                    </div>
                  )}
                  {hoveredSkill.description && (
                    <p className="text-sm text-muted-foreground">
                      {hoveredSkill.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Selected Skill Detail */}
            {selectedSkill && (
              <Card className="border-green-200 bg-green-50/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {selectedSkill.icon}
                    {selectedSkill.name}
                    <Badge variant="secondary" className="ml-auto">
                      Selected
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Level</span>
                      <span className="font-semibold">{selectedSkill.level}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${selectedSkill.level}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Experience</span>
                    <span className="font-semibold">{selectedSkill.experience}</span>
                  </div>

                  {selectedSkill.projects && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Projects</span>
                      <span className="font-semibold">{selectedSkill.projects}</span>
                    </div>
                  )}

                  {selectedSkill.description && (
                    <div>
                      <span className="text-sm text-muted-foreground block mb-1">Description</span>
                      <p className="text-sm">{selectedSkill.description}</p>
                    </div>
                  )}

                  {selectedSkill.certifications && selectedSkill.certifications.length > 0 && (
                    <div>
                      <span className="text-sm text-muted-foreground block mb-2">Certifications</span>
                      <div className="space-y-1">
                        {selectedSkill.certifications.map((cert, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedSkill.trending && (
                    <Badge variant="secondary" className="w-full justify-center">
                      🔥 Trending Skill
                    </Badge>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedSkill(null)}
                    className="w-full"
                  >
                    Close Details
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const expertSkills = SAMPLE_SKILLS.filter(skill => skill.level >= 90);
                    if (expertSkills.length > 0) {
                      setSelectedSkill(expertSkills[Math.floor(Math.random() * expertSkills.length)]);
                    }
                  }}
                  className="w-full justify-start"
                >
                  <Star className="w-4 h-4 mr-2" />
                  View Expert Skills
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const trendingSkills = SAMPLE_SKILLS.filter(skill => skill.trending);
                    if (trendingSkills.length > 0) {
                      setSelectedSkill(trendingSkills[Math.floor(Math.random() * trendingSkills.length)]);
                    }
                  }}
                  className="w-full justify-start"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Show Trending
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedSkill(null)}
                  className="w-full justify-start"
                >
                  Clear Selection
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillVisualizationDemo;