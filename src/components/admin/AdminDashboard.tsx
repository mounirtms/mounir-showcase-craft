import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Database, 
  BarChart3, 
  Settings, 
  Upload, 
  Download, 
  RefreshCw, 
  AlertCircle,
  CheckCircle2,
  Wifi,
  WifiOff
} from "lucide-react";
import { useSkills } from "@/hooks/useSkills";
import { useProjects } from "@/hooks/useProjects";
import { useTheme } from "@/components/theme/theme-provider";
import { DataExportManager } from "@/components/admin/DataExportManager";
import { SkillsManager } from "@/components/admin/SkillsManager";
import { ProjectsManager } from "@/components/admin/ProjectsManager";
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";
import { AdminNavigation } from "@/components/admin/AdminNavigation";

export function AdminDashboard() {
  const { skills, loading: skillsLoading, error: skillsError } = useSkills();
  const { projects, loading: projectsLoading, error: projectsError } = useProjects();
  const { actualTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("overview");

  // Check online status
  const isOnline = navigator.onLine;

  // Calculate stats
  const stats = {
    totalSkills: skills.length,
    totalProjects: projects.length,
    featuredSkills: skills.filter(s => s.featured).length,
    featuredProjects: projects.filter(p => p.featured).length,
  };

  return (
    <div className="space-y-6">
      {/* Admin Navigation */}
      <AdminNavigation />
      
      {/* Header with status indicators */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your portfolio content and settings
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Online status indicator */}
          <div className="flex items-center gap-2">
            {isOnline ? (
              <>
                <Wifi className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-500">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-500">Offline</span>
              </>
            )}
          </div>
          
          {/* Data status indicator */}
          <div className="flex items-center gap-2">
            {skillsLoading || projectsLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin text-yellow-500" />
                <span className="text-sm text-yellow-500">Loading</span>
              </>
            ) : skillsError || projectsError ? (
              <>
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-500">Error</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-500">Ready</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className={`border-0 shadow-sm bg-white/50`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Skills</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSkills}</div>
            <p className="text-xs text-muted-foreground">
              {stats.featuredSkills} featured
            </p>
          </CardContent>
        </Card>
        
        <Card className={`border-0 shadow-sm bg-white/50`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              {stats.featuredProjects} featured
            </p>
          </CardContent>
        </Card>
        
        <Card className={`border-0 shadow-sm bg-white/50`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Status</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isOnline ? "Online" : "Offline"}
            </div>
            <p className="text-xs text-muted-foreground">
              {isOnline ? "Connected to Firebase" : "Using local data"}
            </p>
          </CardContent>
        </Card>
        
        <Card className={`border-0 shadow-sm bg-white/50`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Export Data</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm" className="w-full bg-background text-foreground border-input hover:bg-accent hover:text-accent-foreground">
              <Upload className="h-4 w-4 mr-2" />
              Export All
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-muted">
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="skills" 
            className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            Skills
          </TabsTrigger>
          <TabsTrigger 
            value="projects" 
            className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            Projects
          </TabsTrigger>
          <TabsTrigger 
            value="analytics" 
            className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            Analytics
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <DataExportManager />
          <AnalyticsDashboard />
        </TabsContent>
        
        <TabsContent value="skills">
          <SkillsManager />
        </TabsContent>
        
        <TabsContent value="projects">
          <ProjectsManager />
        </TabsContent>
        
        <TabsContent value="analytics">
          <AnalyticsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}