import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useProjects } from "@/hooks/useProjects";
import { useSkills } from "@/hooks/useSkills";
import {
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  Target,
  Eye,
  Star,
  Activity,
  Zap,
  Award,
  Database,
  Globe,
  Calendar,
  RefreshCw,
  Download,
  FileText,
  LineChart,
  PieChart,
  BarChart,
  Activity as ActivityIcon
} from "lucide-react";

interface AnalyticsMetric {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color: string;
  description?: string;
}

interface ChartData {
  name: string;
  value: number;
  color: string;
}

export function AnalyticsDashboard() {
  const { projects, loading: projectsLoading } = useProjects();
  const { skills, loading: skillsLoading } = useSkills();
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("30d");

  // Calculate analytics metrics
  const analytics = useMemo(() => {
    const projectMetrics = {
      total: projects.length,
      featured: projects.filter(p => p.featured).length,
      active: projects.filter(p => !p.disabled).length,
      completed: projects.filter(p => p.status === "completed").length,
      inProgress: projects.filter(p => p.status === "in-progress").length,
    };

    const skillMetrics = {
      total: skills.length,
      featured: skills.filter(s => s.featured).length,
      averageLevel: skills.length > 0 ? Math.round(skills.reduce((sum, s) => sum + s.level, 0) / skills.length) : 0,
      expertLevel: skills.filter(s => s.level >= 90).length,
    };

    const categoryData = skills.reduce((acc, skill) => {
      const category = skill.category;
      if (!acc[category]) {
        acc[category] = { count: 0, averageLevel: 0, totalLevel: 0 };
      }
      acc[category].count++;
      acc[category].totalLevel += skill.level;
      acc[category].averageLevel = Math.round(acc[category].totalLevel / acc[category].count);
      return acc;
    }, {} as Record<string, { count: number; averageLevel: number; totalLevel: number }>);

    const projectsByCategory = projects.reduce((acc, project) => {
      const category = project.category;
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      projects: projectMetrics,
      skills: skillMetrics,
      categories: categoryData,
      projectsByCategory
    };
  }, [projects, skills]);

  const overviewMetrics: AnalyticsMetric[] = [
    {
      title: "Total Projects",
      value: analytics.projects.total,
      change: 12,
      icon: <Database className="w-5 h-5" />,
      color: "text-blue-600",
      description: "Active portfolio projects"
    },
    {
      title: "Featured Projects",
      value: analytics.projects.featured,
      change: 8,
      icon: <Star className="w-5 h-5" />,
      color: "text-yellow-600",
      description: "Highlighted showcase projects"
    },
    {
      title: "Skills Mastered",
      value: analytics.skills.total,
      change: 15,
      icon: <Award className="w-5 h-5" />,
      color: "text-green-600",
      description: "Technical competencies"
    },
    {
      title: "Average Skill Level",
      value: `${analytics.skills.averageLevel}%`,
      change: 5,
      icon: <TrendingUp className="w-5 h-5" />,
      color: "text-purple-600",
      description: "Overall proficiency"
    },
    {
      title: "Expert Skills",
      value: analytics.skills.expertLevel,
      change: 3,
      icon: <Target className="w-5 h-5" />,
      color: "text-red-600",
      description: "90%+ proficiency level"
    },
    {
      title: "Active Projects",
      value: analytics.projects.active,
      change: 7,
      icon: <Activity className="w-5 h-5" />,
      color: "text-indigo-600",
      description: "Currently visible projects"
    }
  ];

  const skillCategoryData: ChartData[] = Object.entries(analytics.categories).map(([category, data], index) => ({
    name: category,
    value: data.count,
    color: [
      "#3b82f6", "#ef4444", "#10b981", "#f59e0b", 
      "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"
    ][index % 8]
  }));

  const projectCategoryData: ChartData[] = Object.entries(analytics.projectsByCategory).map(([category, count], index) => ({
    name: category,
    value: count,
    color: [
      "#6366f1", "#ef4444", "#10b981", "#f59e0b", 
      "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"
    ][index % 8]
  }));

  if (projectsLoading || skillsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Loading analytics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor your portfolio performance and insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {overviewMetrics.map((metric, index) => (
          <Card key={index} className="border-0 shadow-medium hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <p className="text-2xl font-bold">{metric.value}</p>
                    {metric.change && (
                      <Badge variant="secondary" className="text-xs">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +{metric.change}%
                      </Badge>
                    )}
                  </div>
                  {metric.description && (
                    <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
                  )}
                </div>
                <div className={`p-3 rounded-xl bg-${metric.color.split('-')[1]}-100 dark:bg-${metric.color.split('-')[1]}-900/20`}>
                  <div className={metric.color}>
                    {metric.icon}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Projects
          </TabsTrigger>
          <TabsTrigger value="skills" className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            Skills
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <ActivityIcon className="w-4 h-4" />
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Project Status Distribution */}
            <Card className="border-0 shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Project Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Completed</span>
                    <div className="flex items-center gap-2">
                      <Progress value={(analytics.projects.completed / analytics.projects.total) * 100} className="w-20" />
                      <span className="text-sm font-medium">{analytics.projects.completed}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">In Progress</span>
                    <div className="flex items-center gap-2">
                      <Progress value={(analytics.projects.inProgress / analytics.projects.total) * 100} className="w-20" />
                      <span className="text-sm font-medium">{analytics.projects.inProgress}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Featured</span>
                    <div className="flex items-center gap-2">
                      <Progress value={(analytics.projects.featured / analytics.projects.total) * 100} className="w-20" />
                      <span className="text-sm font-medium">{analytics.projects.featured}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills by Category */}
            <Card className="border-0 shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="w-5 h-5" />
                  Skills by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(analytics.categories).map(([category, data]) => (
                    <div key={category} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{category}</span>
                        <Badge variant="outline" className="text-xs">
                          {data.count} skills • {data.averageLevel}% avg
                        </Badge>
                      </div>
                      <Progress value={data.averageLevel} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-medium">
              <CardHeader>
                <CardTitle>Project Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {projectCategoryData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <span className="text-sm">{item.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-2 rounded-full bg-muted">
                          <div 
                            className="h-2 rounded-full" 
                            style={{ 
                              backgroundColor: item.color,
                              width: `${(item.value / Math.max(...projectCategoryData.map(d => d.value))) * 100}%` 
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium">{item.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-medium">
              <CardHeader>
                <CardTitle>Project Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm">Most Common Category</span>
                    <Badge variant="default">
                      {Object.entries(analytics.projectsByCategory).sort(([,a], [,b]) => b - a)[0]?.[0] || "N/A"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm">Featured Rate</span>
                    <Badge variant="secondary">
                      {Math.round((analytics.projects.featured / analytics.projects.total) * 100)}%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm">Completion Rate</span>
                    <Badge variant="secondary">
                      {Math.round((analytics.projects.completed / analytics.projects.total) * 100)}%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-medium">
              <CardHeader>
                <CardTitle>Skill Proficiency Levels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { label: "Expert (90-100%)", count: skills.filter(s => s.level >= 90).length, color: "bg-green-500" },
                    { label: "Advanced (75-89%)", count: skills.filter(s => s.level >= 75 && s.level < 90).length, color: "bg-blue-500" },
                    { label: "Intermediate (60-74%)", count: skills.filter(s => s.level >= 60 && s.level < 75).length, color: "bg-yellow-500" },
                    { label: "Beginner (0-59%)", count: skills.filter(s => s.level < 60).length, color: "bg-red-500" }
                  ].map((level) => (
                    <div key={level.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${level.color}`} />
                        <span className="text-sm">{level.label}</span>
                      </div>
                      <Badge variant="outline">{level.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-medium">
              <CardHeader>
                <CardTitle>Top Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {skills
                    .sort((a, b) => b.level - a.level)
                    .slice(0, 5)
                    .map((skill) => (
                      <div key={skill.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{skill.name}</span>
                          {skill.featured && <Star className="w-3 h-3 text-yellow-500" />}
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={skill.level} className="w-20 h-2" />
                          <span className="text-sm font-medium">{skill.level}%</span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card className="border-0 shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ActivityIcon className="w-5 h-5" />
                Performance Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-semibold mb-2">Portfolio Health</h3>
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    {Math.round(((analytics.projects.active / analytics.projects.total) + (analytics.skills.averageLevel / 100)) / 2 * 100)}%
                  </div>
                  <p className="text-xs text-muted-foreground">Overall portfolio rating</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-semibold mb-2">Content Quality</h3>
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {Math.round((analytics.projects.featured / analytics.projects.total) * 100)}%
                  </div>
                  <p className="text-xs text-muted-foreground">Featured content ratio</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-semibold mb-2">Skill Coverage</h3>
                  <div className="text-3xl font-bold text-purple-600 mb-1">
                    {Object.keys(analytics.categories).length}
                  </div>
                  <p className="text-xs text-muted-foreground">Skill categories covered</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AnalyticsDashboard;