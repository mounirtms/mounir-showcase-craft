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
  TrendingUp
} from "lucide-react";
import { useSkills } from "@/hooks/useSkills";
import { useProjects } from "@/hooks/useProjects";
import { useTheme } from "@/components/theme/theme-provider";
import { DataExportManager } from "@/components/admin/DataExportManager";
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";
import { AdminNavigation } from "@/components/admin/AdminNavigation";
import { AdminHeader } from "./layout/AdminHeader";
import { SkillsManager } from "./SkillsManager";
import { ProjectsManager } from "./ProjectsManager";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

export function AdminDashboard() {
  const { skills, loading: skillsLoading, error: skillsError } = useSkills();
  const { projects, loading: projectsLoading, error: projectsError } = useProjects();
  const { actualTheme, setTheme } = useTheme();
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
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content Area */}
        <main className="flex-1">
          {/* Tab Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-muted mb-6 rounded-lg p-1 h-12">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md flex items-center gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="skills" 
                className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md flex items-center gap-2"
              >
                <Award className="h-4 w-4" />
                Skills
              </TabsTrigger>
              <TabsTrigger 
                value="projects" 
                className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md flex items-center gap-2"
              >
                <Database className="h-4 w-4" />
                Projects
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md flex items-center gap-2"
              >
                <TrendingUp className="h-4 w-4" />
                Analytics
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
    </div>
  );
}