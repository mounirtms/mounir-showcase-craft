import React, { useState } from 'react';
import { AdminLayout } from './AdminLayout';
import { AdminHeader } from './AdminHeader';
import { AdminSidebar } from './AdminSidebar';
import { AdminBreadcrumb } from './AdminBreadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart3, 
  Database, 
  Plus, 
  Award, 
  Settings,
  User,
  TrendingUp,
  CheckCircle2,
  Clock,
  Target
} from 'lucide-react';

interface User {
  uid: string;
  email: string | null;
  displayName?: string | null;
}

interface AdminLayoutIntegrationProps {
  user: User;
  onLogout: () => void;
  projects?: any[];
  loading?: boolean;
}

export const AdminLayoutIntegration: React.FC<AdminLayoutIntegrationProps> = ({
  user,
  onLogout,
  projects = [],
  loading = false
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Calculate stats from projects
  const stats = {
    total: projects.length,
    featured: projects.filter(p => p.featured).length,
    active: projects.filter(p => !p.disabled).length,
    completed: projects.filter(p => p.status === 'completed').length,
    inProgress: projects.filter(p => p.status === 'in-progress').length,
    categories: [...new Set(projects.map(p => p.category))].length
  };

  const sidebarItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: BarChart3,
      onClick: () => setActiveTab('overview'),
      active: activeTab === 'overview'
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: Database,
      onClick: () => setActiveTab('projects'),
      active: activeTab === 'projects',
      badge: stats.total.toString()
    },
    {
      id: 'add-project',
      label: 'Add Project',
      icon: Plus,
      onClick: () => setActiveTab('add-project'),
      active: activeTab === 'add-project'
    },
    {
      id: 'skills',
      label: 'Skills',
      icon: Award,
      onClick: () => setActiveTab('skills'),
      active: activeTab === 'skills'
    }
  ];

  const getBreadcrumbItems = () => {
    const baseItems = [
      {
        label: 'Dashboard',
        onClick: () => setActiveTab('overview')
      }
    ];

    switch (activeTab) {
      case 'overview':
        return [...baseItems, { label: 'Overview', active: true }];
      case 'projects':
        return [...baseItems, { label: 'Projects', active: true }];
      case 'add-project':
        return [
          ...baseItems,
          { label: 'Projects', onClick: () => setActiveTab('projects') },
          { label: 'Add Project', active: true }
        ];
      case 'skills':
        return [...baseItems, { label: 'Skills', active: true }];
      default:
        return baseItems;
    }
  };

  const headerActions = [
    {
      label: 'Settings',
      icon: Settings,
      onClick: () => console.log('Settings clicked'),
      variant: 'outline' as const
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              <Card className="border-0 shadow-medium hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <Database className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{stats.total}</div>
                      <div className="text-sm text-muted-foreground">Total Projects</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-medium hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-500/10 rounded-xl">
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{stats.completed}</div>
                      <div className="text-sm text-muted-foreground">Completed</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-medium hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-500/10 rounded-xl">
                      <Clock className="h-6 w-6 text-orange-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{stats.inProgress}</div>
                      <div className="text-sm text-muted-foreground">In Progress</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-medium hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-500/10 rounded-xl">
                      <Target className="h-6 w-6 text-purple-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {Math.round((stats.featured / Math.max(stats.total, 1)) * 100)}%
                      </div>
                      <div className="text-sm text-muted-foreground">Featured Rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Projects */}
            <Card className="border-0 shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Recent Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground mt-2">Loading projects...</p>
                  </div>
                ) : projects.length === 0 ? (
                  <div className="text-center py-8">
                    <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No projects found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {projects
                      .sort((a, b) => b.updatedAt - a.updatedAt)
                      .slice(0, 5)
                      .map((project) => (
                        <div 
                          key={project.id} 
                          className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                        >
                          <div className="w-10 h-10 rounded-md flex-shrink-0 overflow-hidden bg-muted flex items-center justify-center">
                            {project.logo ? (
                              <img src={project.logo} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <Database className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{project.title}</div>
                            <div className="text-xs text-muted-foreground">{project.category}</div>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(project.updatedAt).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case 'projects':
        return (
          <Card className="border-0 shadow-medium">
            <CardHeader>
              <CardTitle>Projects Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This is where the ProjectsManager component would be integrated.
                The existing ProjectsManager component can be used here with the new layout structure.
              </p>
            </CardContent>
          </Card>
        );

      case 'add-project':
        return (
          <Card className="border-0 shadow-medium">
            <CardHeader>
              <CardTitle>Add New Project</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This is where the project creation form would be integrated.
                The existing form logic from Admin.tsx can be extracted into a separate component.
              </p>
            </CardContent>
          </Card>
        );

      case 'skills':
        return (
          <Card className="border-0 shadow-medium">
            <CardHeader>
              <CardTitle>Skills Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This is where the SkillsManager component would be integrated.
                The existing SkillsManager component can be used here with the new layout structure.
              </p>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <AdminHeader
        user={user}
        onLogout={onLogout}
        actions={headerActions}
      />

      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar
          items={sidebarItems}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          activeItem={activeTab}
        />

        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${
          sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-68'
        }`}>
          <AdminLayout>
            {/* Breadcrumb */}
            <AdminBreadcrumb items={getBreadcrumbItems()} />

            {/* Content */}
            {renderContent()}
          </AdminLayout>
        </div>
      </div>
    </div>
  );
};

export default AdminLayoutIntegration;