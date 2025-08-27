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
  User
} from 'lucide-react';

interface User {
  uid: string;
  email: string | null;
  displayName?: string | null;
}

interface AdminLayoutDemoProps {
  user?: User;
  onLogout?: () => void;
}

export const AdminLayoutDemo: React.FC<AdminLayoutDemoProps> = ({
  user = { uid: '1', email: 'admin@example.com' },
  onLogout = () => console.log('Logout clicked')
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
      badge: '12'
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
      active: activeTab === 'skills',
      badge: '8'
    }
  ];

  const breadcrumbItems = [
    {
      label: 'Dashboard',
      onClick: () => setActiveTab('overview')
    },
    {
      label: activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' '),
      active: true
    }
  ];

  const headerActions = [
    {
      label: 'Settings',
      icon: Settings,
      onClick: () => console.log('Settings clicked'),
      variant: 'outline' as const
    },
    {
      label: 'Profile',
      icon: User,
      onClick: () => console.log('Profile clicked'),
      variant: 'ghost' as const
    }
  ];

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
        <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-68'}`}>
          <AdminLayout>
            {/* Breadcrumb */}
            <AdminBreadcrumb items={breadcrumbItems} />

            {/* Content */}
            <div className="space-y-6">
              <Card className="border-0 shadow-medium">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {sidebarItems.find(item => item.id === activeTab)?.icon && (
                      React.createElement(sidebarItems.find(item => item.id === activeTab)!.icon, {
                        className: "h-5 w-5"
                      })
                    )}
                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    This is the {activeTab} section. The layout components are working together to provide
                    a cohesive admin interface with responsive design, collapsible sidebar, and proper navigation.
                  </p>
                  
                  <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-medium mb-2">Layout Features:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Responsive grid system with CSS Grid and Flexbox</li>
                      <li>• Collapsible sidebar with mobile overlay</li>
                      <li>• Sticky header with user actions</li>
                      <li>• Breadcrumb navigation for context</li>
                      <li>• Consistent spacing and visual hierarchy</li>
                      <li>• Glass morphism effects and smooth transitions</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </AdminLayout>
        </div>
      </div>
    </div>
  );
};

export default AdminLayoutDemo;