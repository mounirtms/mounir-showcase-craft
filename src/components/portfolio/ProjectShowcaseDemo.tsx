import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectShowcase, { Project } from "./ProjectShowcase";
import { 
  Code2, 
  Smartphone, 
  Monitor, 
  Bot, 
  Coins, 
  Gamepad2,
  ExternalLink,
  Github,
  Play,
  Settings,
  Eye,
  RotateCcw
} from "lucide-react";

// Sample project data
const SAMPLE_PROJECTS: Project[] = [
  {
    id: "ecommerce-platform",
    title: "E-Commerce Platform",
    description: "Full-stack e-commerce solution with real-time inventory management and AI-powered recommendations",
    longDescription: "A comprehensive e-commerce platform built with modern technologies featuring real-time inventory management, AI-powered product recommendations, secure payment processing, and an intuitive admin dashboard.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
    category: "web",
    technologies: ["React", "Node.js", "PostgreSQL", "Stripe", "Redis", "Docker"],
    demoUrl: "https://demo.example.com",
    githubUrl: "https://github.com/example/ecommerce",
    status: "completed",
    featured: true,
    year: 2024,
    teamSize: 4,
    duration: "6 months",
    highlights: [
      "99.9% uptime",
      "Sub-second page load times",
      "Mobile-first responsive design",
      "Advanced analytics dashboard"
    ],
    metrics: {
      stars: 234,
      views: 12500,
      likes: 89
    },
    awards: ["Best UX Design 2024"],
    client: "TechCorp Inc."
  },
  {
    id: "mobile-fitness-app",
    title: "FitTracker Pro",
    description: "Cross-platform mobile app for fitness tracking with AI workout recommendations and social features",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop",
    category: "mobile",
    technologies: ["React Native", "Firebase", "TensorFlow", "Expo"],
    demoUrl: "https://expo.dev/@example/fittracker",
    githubUrl: "https://github.com/example/fittracker",
    status: "completed",
    featured: true,
    year: 2024,
    teamSize: 3,
    duration: "4 months",
    metrics: {
      stars: 156,
      views: 8900,
      likes: 67,
      downloads: 15000
    },
    awards: ["Mobile App of the Year"]
  },
  {
    id: "ai-chatbot",
    title: "Smart Assistant AI",
    description: "Intelligent chatbot with natural language processing and integration with multiple business systems",
    image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=600&h=400&fit=crop",
    category: "ai",
    technologies: ["Python", "OpenAI GPT", "FastAPI", "PostgreSQL", "Docker"],
    githubUrl: "https://github.com/example/smart-assistant",
    status: "in-progress",
    year: 2024,
    teamSize: 2,
    duration: "3 months",
    metrics: {
      stars: 89,
      views: 5600,
      likes: 34
    }
  },
  {
    id: "blockchain-wallet",
    title: "CryptoWallet",
    description: "Secure multi-currency cryptocurrency wallet with DeFi integration and portfolio tracking",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop",
    category: "blockchain",
    technologies: ["Solidity", "Web3.js", "React", "Ethereum", "MetaMask"],
    demoUrl: "https://cryptowallet-demo.example.com",
    githubUrl: "https://github.com/example/cryptowallet",
    status: "completed",
    year: 2023,
    teamSize: 5,
    duration: "8 months",
    metrics: {
      stars: 445,
      views: 23400,
      likes: 178
    },
    awards: ["Best Blockchain App 2023", "Security Excellence Award"]
  },
  {
    id: "game-engine",
    title: "PixelCraft Engine",
    description: "2D game engine with visual scripting system and cross-platform deployment capabilities",
    image: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=600&h=400&fit=crop",
    category: "game",
    technologies: ["C++", "OpenGL", "Lua", "CMake", "SDL2"],
    demoUrl: "https://pixelcraft-demo.example.com",
    githubUrl: "https://github.com/example/pixelcraft",
    status: "completed",
    year: 2023,
    teamSize: 2,
    duration: "12 months",
    metrics: {
      stars: 678,
      views: 34500,
      likes: 234,
      downloads: 8500
    }
  },
  {
    id: "desktop-editor",
    title: "CodeCraft IDE",
    description: "Modern code editor with intelligent auto-completion and collaborative editing features",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop",
    category: "desktop",
    technologies: ["Electron", "TypeScript", "Monaco Editor", "Node.js"],
    demoUrl: "https://codecraft-demo.example.com",
    githubUrl: "https://github.com/example/codecraft",
    status: "completed",
    year: 2023,
    teamSize: 6,
    duration: "10 months",
    metrics: {
      stars: 892,
      views: 45600,
      likes: 345,
      downloads: 25000
    }
  },
  {
    id: "data-visualization",
    title: "DataViz Pro",
    description: "Interactive data visualization platform with real-time dashboards and collaborative features",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
    category: "web",
    technologies: ["D3.js", "React", "WebGL", "Python", "FastAPI"],
    demoUrl: "https://dataviz-demo.example.com",
    githubUrl: "https://github.com/example/dataviz",
    status: "completed",
    featured: true,
    year: 2023,
    teamSize: 4,
    duration: "5 months",
    metrics: {
      stars: 567,
      views: 28900,
      likes: 189
    }
  },
  {
    id: "iot-dashboard",
    title: "IoT Control Center",
    description: "Real-time IoT device monitoring and control dashboard with predictive analytics",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=400&fit=crop",
    category: "web",
    technologies: ["Vue.js", "MQTT", "InfluxDB", "Grafana", "Docker"],
    status: "archived",
    year: 2022,
    teamSize: 3,
    duration: "4 months",
    metrics: {
      stars: 123,
      views: 6700,
      likes: 45
    }
  }
];

// Demo component
export const ProjectShowcaseDemo: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const [showcaseSettings, setShowcaseSettings] = useState({
    layout: "grid" as "grid" | "masonry" | "list",
    aspectRatio: "landscape" as "square" | "landscape" | "portrait",
    columns: 3,
    enableHover3D: true,
    showFilters: true,
    showSearch: true
  });

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
  };

  const handleProjectHover = (project: Project | null) => {
    setHoveredProject(project);
  };

  // Calculate statistics
  const stats = {
    totalProjects: SAMPLE_PROJECTS.length,
    completedProjects: SAMPLE_PROJECTS.filter(p => p.status === "completed").length,
    featuredProjects: SAMPLE_PROJECTS.filter(p => p.featured).length,
    totalStars: SAMPLE_PROJECTS.reduce((sum, p) => sum + (p.metrics?.stars || 0), 0),
    totalViews: SAMPLE_PROJECTS.reduce((sum, p) => sum + (p.metrics?.views || 0), 0),
    categories: Array.from(new Set(SAMPLE_PROJECTS.map(p => p.category))).length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            3D Project Showcase
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Interactive project portfolio with stunning 3D card effects and advanced filtering
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalProjects}</div>
              <div className="text-sm text-muted-foreground">Total Projects</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.completedProjects}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.featuredProjects}</div>
              <div className="text-sm text-muted-foreground">Featured</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.totalStars}</div>
              <div className="text-sm text-muted-foreground">Total Stars</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{(stats.totalViews / 1000).toFixed(1)}K</div>
              <div className="text-sm text-muted-foreground">Total Views</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-indigo-600">{stats.categories}</div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Project Showcase */}
          <div className="xl:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="w-5 h-5" />
                    Project Portfolio
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowcaseSettings(prev => ({ ...prev, enableHover3D: !prev.enableHover3D }))}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    {showcaseSettings.enableHover3D ? "Disable" : "Enable"} 3D
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ProjectShowcase
                  projects={SAMPLE_PROJECTS}
                  layout={showcaseSettings.layout}
                  cardAspectRatio={showcaseSettings.aspectRatio}
                  columns={showcaseSettings.columns}
                  enableHover3D={showcaseSettings.enableHover3D}
                  showFilters={showcaseSettings.showFilters}
                  showSearch={showcaseSettings.showSearch}
                  onProjectClick={handleProjectClick}
                  onProjectHover={handleProjectHover}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Showcase Settings */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Showcase Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Layout */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Layout</label>
                  <div className="grid grid-cols-3 gap-1">
                    <Button
                      variant={showcaseSettings.layout === "grid" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setShowcaseSettings(prev => ({ ...prev, layout: "grid" }))}
                    >
                      Grid
                    </Button>
                    <Button
                      variant={showcaseSettings.layout === "masonry" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setShowcaseSettings(prev => ({ ...prev, layout: "masonry" }))}
                    >
                      Masonry
                    </Button>
                    <Button
                      variant={showcaseSettings.layout === "list" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setShowcaseSettings(prev => ({ ...prev, layout: "list" }))}
                    >
                      List
                    </Button>
                  </div>
                </div>

                {/* Aspect Ratio */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Card Aspect Ratio</label>
                  <div className="grid grid-cols-3 gap-1">
                    <Button
                      variant={showcaseSettings.aspectRatio === "square" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setShowcaseSettings(prev => ({ ...prev, aspectRatio: "square" }))}
                    >
                      Square
                    </Button>
                    <Button
                      variant={showcaseSettings.aspectRatio === "landscape" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setShowcaseSettings(prev => ({ ...prev, aspectRatio: "landscape" }))}
                    >
                      Landscape
                    </Button>
                    <Button
                      variant={showcaseSettings.aspectRatio === "portrait" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setShowcaseSettings(prev => ({ ...prev, aspectRatio: "portrait" }))}
                    >
                      Portrait
                    </Button>
                  </div>
                </div>

                {/* Columns */}
                {showcaseSettings.layout === "grid" && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Columns: {showcaseSettings.columns}</label>
                    <input
                      type="range"
                      min="1"
                      max="4"
                      value={showcaseSettings.columns}
                      onChange={(e) => setShowcaseSettings(prev => ({ ...prev, columns: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                  </div>
                )}

                {/* Toggles */}
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={showcaseSettings.enableHover3D}
                      onChange={(e) => setShowcaseSettings(prev => ({ ...prev, enableHover3D: e.target.checked }))}
                    />
                    <span className="text-sm">Enable 3D Hover Effects</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={showcaseSettings.showFilters}
                      onChange={(e) => setShowcaseSettings(prev => ({ ...prev, showFilters: e.target.checked }))}
                    />
                    <span className="text-sm">Show Filters</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={showcaseSettings.showSearch}
                      onChange={(e) => setShowcaseSettings(prev => ({ ...prev, showSearch: e.target.checked }))}
                    />
                    <span className="text-sm">Show Search</span>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Hovered Project */}
            {hoveredProject && (
              <Card className="border-blue-200 bg-blue-50/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    {hoveredProject.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Badge variant="outline" className="w-fit">
                    {hoveredProject.category}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    {hoveredProject.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {hoveredProject.technologies.slice(0, 3).map(tech => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Selected Project Detail */}
            {selectedProject && (
              <Card className="border-green-200 bg-green-50/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{selectedProject.title}</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedProject(null)}
                    >
                      ×
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <img
                      src={selectedProject.image}
                      alt={selectedProject.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <p className="text-sm">{selectedProject.longDescription || selectedProject.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Year</span>
                      <span>{selectedProject.year}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Status</span>
                      <Badge variant={selectedProject.status === "completed" ? "default" : "secondary"}>
                        {selectedProject.status}
                      </Badge>
                    </div>
                    {selectedProject.teamSize && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Team Size</span>
                        <span>{selectedProject.teamSize} members</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {selectedProject.technologies.map(tech => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    {selectedProject.demoUrl && (
                      <Button size="sm" className="flex-1">
                        <Play className="w-4 h-4 mr-2" />
                        Demo
                      </Button>
                    )}
                    {selectedProject.githubUrl && (
                      <Button size="sm" variant="outline" className="flex-1">
                        <Github className="w-4 h-4 mr-2" />
                        Code
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Stats */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Portfolio Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Completion Rate</span>
                  <span className="font-medium">{Math.round((stats.completedProjects / stats.totalProjects) * 100)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Average Stars</span>
                  <span className="font-medium">{Math.round(stats.totalStars / stats.totalProjects)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Technologies</span>
                  <span className="font-medium">
                    {Array.from(new Set(SAMPLE_PROJECTS.flatMap(p => p.technologies))).length}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectShowcaseDemo;