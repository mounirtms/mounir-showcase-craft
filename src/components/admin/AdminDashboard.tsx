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
  WifiOff,
  Sun,
  Moon,
  Laptop,
  Trash2,
  Edit,
  Plus,
  Award,
  TrendingUp,
  Activity
} from "lucide-react";
import { useSkills } from "@/hooks/useSkills";
import { useProjects } from "@/hooks/useProjects";
import { useTheme } from "@/components/theme/use-theme";
import { DataExportManager } from "@/components/admin/DataExportManager";
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";
import { AdminNavigation } from "@/components/admin/AdminNavigation";
import { AdminHeader } from "./layout/AdminHeader";
import { SkillsManager } from "./SkillsManager";
import { ProjectsManager } from "./ProjectsManager";
import { AdminStats } from "./AdminStats";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

export function AdminDashboard() {
  const { skills, loading: skillsLoading, error: skillsError } = useSkills();
  const { projects, loading: projectsLoading, error: projectsError } = useProjects();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("overview");

  // Check online status
  const isOnline = navigator.onLine;

  const handleLogout = async () => {
    if (auth) {
      try {
        await signOut(auth);
      } catch (error) {
        console.error("Error signing out:", error);
      }
    }
  };

  // Calculate stats
  const stats = {
    totalSkills: skills.length,
    totalProjects: projects.length,
    featuredSkills: skills.filter(s => s.featured).length,
    featuredProjects: projects.filter(p => p.featured).length,
  };

  const user = auth?.currentUser || null;

  return (
    <div className="space-y-6">
      {/* Admin Header with status indicators */}
      <AdminHeader 
        user={user}
        onLogout={handleLogout}
      />
      
      {/* Admin Stats */}
      <AdminStats stats={stats} />
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content Area */}
        <main className="flex-1">
          {/* Tab Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-muted mb-6 rounded-lg p-1 h-auto sm:h-12">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md flex items-center gap-2 py-2"
              >
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
                <span className="sm:hidden">Overview</span>
              </TabsTrigger>
              <TabsTrigger 
                value="skills" 
                className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md flex items-center gap-2 py-2"
              >
                <Award className="h-4 w-4" />
                <span className="hidden sm:inline">Skills</span>
                <span className="sm:hidden">Skills</span>
              </TabsTrigger>
              <TabsTrigger 
                value="projects" 
                className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md flex items-center gap-2 py-2"
              >
                <Database className="h-4 w-4" />
                <span className="hidden sm:inline">Projects</span>
                <span className="sm:hidden">Projects</span>
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md flex items-center gap-2 py-2"
              >
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Analytics</span>
                <span className="sm:hidden">Analytics</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Dashboard Overview */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DataExportManager />
                <AnalyticsDashboard />
              </div>
            </TabsContent>
            
            {/* Skills Management */}
            <TabsContent value="skills">
              <SkillsManager />
            </TabsContent>
            
            {/* Projects Management */}
            <TabsContent value="projects">
              <ProjectsManager />
            </TabsContent>
            
            {/* Analytics Dashboard */}
            <TabsContent value="analytics">
              <AnalyticsDashboard />
            </TabsContent>
          </Tabs>
        </main>
      </div>
      
      {/* Enhanced Footer Information */}
      <footer className="border-t border-border bg-background/50 py-6 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                Data Management
              </h3>
              <p className="text-sm text-muted-foreground">
                Manage your skills and project data with our comprehensive tools.
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <Button variant="outline" size="sm" className="gap-1">
                  <Download className="h-3 w-3" />
                  Export Data
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <RefreshCw className="h-3 w-3" />
                  Sync Data
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Analytics Overview
              </h3>
              <p className="text-sm text-muted-foreground">
                Get insights into your portfolio performance and visitor analytics.
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <Button variant="outline" size="sm" className="gap-1">
                  <BarChart3 className="h-3 w-3" />
                  View Reports
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <Activity className="h-3 w-3" />
                  Real-time Stats
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Quick Settings
              </h3>
              <p className="text-sm text-muted-foreground">
                Customize your admin experience and manage preferences.
              </p>
              <div className="space-y-3 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Theme</span>
                  <div className="flex items-center gap-2">
                    {theme === "system" ? (
                      <Laptop className="h-4 w-4" />
                    ) : theme === "dark" ? (
                      <Moon className="h-4 w-4" />
                    ) : (
                      <Sun className="h-4 w-4" />
                    )}
                    <span className="text-sm capitalize">
                      {theme === "system" ? "System Theme" : theme === "dark" ? "Dark Mode" : "Light Mode"}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Online Status</span>
                  <div className="flex items-center gap-2">
                    {isOnline ? (
                      <Wifi className="h-4 w-4 text-green-500" />
                    ) : (
                      <WifiOff className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-sm">
                      {isOnline ? "Connected" : "Offline"}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 pt-2">
                <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Documentation
                </a>
                <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Privacy Policy
                </a>
                <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
