import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Database, 
  Award, 
  Edit, 
  Plus, 
  Trash2,
  Eye,
  Star,
  Clock,
  Calendar,
  Activity,
  MoreHorizontal
} from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import { useSkills } from '@/hooks/useSkills';
import { formatDistanceToNow } from 'date-fns';

interface ActivityItem {
  id: string;
  type: 'project' | 'skill' | 'system';
  action: 'created' | 'updated' | 'deleted' | 'featured' | 'published';
  title: string;
  description?: string;
  timestamp: number;
  metadata?: {
    category?: string;
    status?: string;
    featured?: boolean;
    [key: string]: any;
  };
}

interface RecentActivityProps {
  maxItems?: number;
  showActions?: boolean;
  onItemClick?: (item: ActivityItem) => void;
  onViewAll?: () => void;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ 
  maxItems = 10,
  showActions = true,
  onItemClick,
  onViewAll
}) => {
  const { projects } = useProjects();
  const { skills } = useSkills();

  const activities = useMemo(() => {
    const projectActivities: ActivityItem[] = projects
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, maxItems)
      .map(project => ({
        id: project.id,
        type: 'project' as const,
        action: project.createdAt === project.updatedAt ? 'created' : 'updated',
        title: project.title,
        description: project.description,
        timestamp: project.updatedAt,
        metadata: {
          category: project.category,
          status: project.status,
          featured: project.featured
        }
      }));

    const skillActivities: ActivityItem[] = skills
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, Math.floor(maxItems / 2))
      .map(skill => ({
        id: skill.id,
        type: 'skill' as const,
        action: skill.createdAt === skill.updatedAt ? 'created' : 'updated',
        title: skill.name,
        description: skill.description,
        timestamp: skill.updatedAt,
        metadata: {
          category: skill.category,
          level: skill.level,
          featured: skill.featured
        }
      }));

    // Combine and sort by timestamp
    return [...projectActivities, ...skillActivities]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, maxItems);
  }, [projects, skills, maxItems]);

  const getActivityIcon = (item: ActivityItem) => {
    if (item.type === 'project') {
      switch (item.action) {
        case 'created': return Plus;
        case 'updated': return Edit;
        case 'deleted': return Trash2;
        case 'featured': return Star;
        case 'published': return Eye;
        default: return Database;
      }
    } else if (item.type === 'skill') {
      switch (item.action) {
        case 'created': return Plus;
        case 'updated': return Edit;
        case 'deleted': return Trash2;
        case 'featured': return Star;
        default: return Award;
      }
    }
    return Activity;
  };

  const getActivityColor = (item: ActivityItem) => {
    switch (item.action) {
      case 'created': return 'text-green-500 bg-green-500/10';
      case 'updated': return 'text-blue-500 bg-blue-500/10';
      case 'deleted': return 'text-red-500 bg-red-500/10';
      case 'featured': return 'text-yellow-500 bg-yellow-500/10';
      case 'published': return 'text-purple-500 bg-purple-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'created': return 'Created';
      case 'updated': return 'Updated';
      case 'deleted': return 'Deleted';
      case 'featured': return 'Featured';
      case 'published': return 'Published';
      default: return 'Modified';
    }
  };

  const formatTimestamp = (timestamp: number) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  if (activities.length === 0) {
    return (
      <Card className="border-0 shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Recent Activity</h3>
            <p className="text-muted-foreground mb-4">
              Start by creating projects or updating skills to see activity here.
            </p>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add New Project
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-medium">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Recent Activity
        </CardTitle>
        {onViewAll && (
          <Button variant="ghost" size="sm" onClick={onViewAll}>
            View All
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((item) => {
            const Icon = getActivityIcon(item);
            const colorClasses = getActivityColor(item);
            
            return (
              <div 
                key={`${item.type}-${item.id}-${item.timestamp}`}
                className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                onClick={() => onItemClick?.(item)}
              >
                <div className={`p-2 rounded-lg ${colorClasses} flex-shrink-0`}>
                  <Icon className="h-4 w-4" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">
                        {item.title}
                      </div>
                      {item.description && (
                        <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {item.description}
                        </div>
                      )}
                    </div>
                    
                    {showActions && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                      >
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {getActionLabel(item.action)}
                    </Badge>
                    
                    {item.metadata?.category && (
                      <Badge variant="secondary" className="text-xs">
                        {item.metadata.category}
                      </Badge>
                    )}
                    
                    {item.metadata?.featured && (
                      <Badge variant="default" className="text-xs">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    
                    <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                      <Clock className="h-3 w-3" />
                      {formatTimestamp(item.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {activities.length === maxItems && (
          <div className="mt-4 pt-4 border-t">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full"
              onClick={onViewAll}
            >
              <Calendar className="h-4 w-4 mr-2" />
              View All Activity
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;