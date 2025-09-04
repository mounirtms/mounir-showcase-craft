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

// Define type for dataLayer
interface DataLayerEvent {
  event: string;
  [key: string]: string | number | boolean | object | undefined;
}

// Reusable Dashboard Card Component
interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  width?: 'full' | 'half' | 'third';
  className?: string;
  icon?: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  children, 
  width = 'full',
  className = '',
  icon
}) => {
  // Determine grid column span based on width prop
  const widthClasses = {
    full: 'col-span-12',
    half: 'col-span-12 md:col-span-6',
    third: 'col-span-12 md:col-span-4'
  };
  
  return (
    <Card className={`${widthClasses[width]} ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

export function AdminDashboard() {
  const { skills, loading: skillsLoading, error: skillsError } = useSkills();
  const { projects, loading: projectsLoading, error: projectsError } = useProjects();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("overview");

  // Check online status
  const isOnline = navigator.onLine;

  // Push event to dataLayer if available
  const pushToDataLayer = (eventData: DataLayerEvent) => {
    if (typeof window !== 'undefined' && (window as unknown as { dataLayer: DataLayerEvent[] }).dataLayer) {
      (window as unknown as { dataLayer: DataLayerEvent[] }).dataLayer.push(eventData);
    }
  };

  const handleLogout = async () => {
    // Push event to dataLayer if available
    pushToDataLayer({
      event: 'admin_logout',
      action: 'click'
    });
    
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

  // Theme toggle with dataLayer tracking
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    
    // Push event to dataLayer if available
    pushToDataLayer({
      event: 'theme_toggle',
      theme: newTheme
    });
  };

  return (
    <div className="admin-dashboard">
      {/* Professional Admin Dashboard by Mounir Abderrahmani */}
      <AdminHeader 
        user={user}
        onLogout={handleLogout}
      />
      
      {/* Admin Stats */}
      <div className="admin-dashboard-grid">
        <AdminStats stats={stats} />
      </div>
      
      <div className="admin-dashboard-grid">
        {/* Main Content Area */}
        <main className="col-span-12">
          {/* Tab Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-muted mb-6 rounded-lg p-1 h-auto sm:h-12">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md flex items-center gap-2 py-2 track-click"
                onClick={() => {
                  pushToDataLayer({
                    event: 'admin_tab_change',
                    tab: 'overview'
                  });
                }}
              >
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
                <span className="sm:hidden">Overview</span>
              </TabsTrigger>
              <TabsTrigger 
                value="skills" 
                className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md flex items-center gap-2 py-2 track-click"
                onClick={() => {
                  pushToDataLayer({
                    event: 'admin_tab_change',
                    tab: 'skills'
                  });
                }}
              >
                <Award className="h-4 w-4" />
                <span className="hidden sm:inline">Skills</span>
                <span className="sm:hidden">Skills</span>
              </TabsTrigger>
              <TabsTrigger 
                value="projects" 
                className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md flex items-center gap-2 py-2 track-click"
                onClick={() => {
                  pushToDataLayer({
                    event: 'admin_tab_change',
                    tab: 'projects'
                  });
                }}
              >
                <Database className="h-4 w-4" />
                <span className="hidden sm:inline">Projects</span>
                <span className="sm:hidden">Projects</span>
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md flex items-center gap-2 py-2 track-click"
                onClick={() => {
                  pushToDataLayer({
                    event: 'admin_tab_change',
                    tab: 'analytics'
                  });
                }}
              >
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Analytics</span>
                <span className="sm:hidden">Analytics</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div className="admin-dashboard-grid">
                <DashboardCard 
                  title="System Status" 
                  width="full"
                  icon={<Activity className="h-5 w-5" />}
                >
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                      {isOnline ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <Wifi className="h-5 w-5" />
                          <span>Online</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-red-600">
                          <WifiOff className="h-5 w-5" />
                          <span>Offline</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={toggleTheme}
                        className="track-click"
                      >
                        {theme === "dark" ? (
                          <Sun className="h-4 w-4" />
                        ) : (
                          <Moon className="h-4 w-4" />
                        )}
                        {theme === "dark" ? "Light Mode" : "Dark Mode"}
                      </Button>
                    </div>
                  </div>
                </DashboardCard>
                
                <DashboardCard 
                  title="Quick Actions" 
                  width="full"
                  icon={<Settings className="h-5 w-5" />}
                >
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      variant="outline" 
                      className="track-click"
                      onClick={() => {
                        pushToDataLayer({
                          event: 'admin_action',
                          action: 'refresh_data'
                        });
                      }}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh Data
                    </Button>
                    <Button 
                      variant="outline" 
                      className="track-click"
                      onClick={() => {
                        pushToDataLayer({
                          event: 'admin_action',
                          action: 'export_data'
                        });
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                  </div>
                </DashboardCard>
              </div>
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
        </main>
      </div>
    </div>
  );
}