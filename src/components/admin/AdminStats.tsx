import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Users, Target, Clock, Star, Database, Award } from "lucide-react";

interface StatItem {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    period: string;
  };
  badge?: string;
}

interface AdminStatsProps {
  stats: {
    totalSkills: number;
    totalProjects: number;
    featuredSkills: number;
    featuredProjects: number;
  };
}

export const AdminStats: React.FC<AdminStatsProps> = ({ stats }) => {
  const statItems: StatItem[] = [
    {
      title: "Total Skills",
      value: stats.totalSkills,
      description: "Technical proficiencies",
      icon: <Database className="h-5 w-5 text-blue-500" />
    },
    {
      title: "Total Projects",
      value: stats.totalProjects,
      description: "Portfolio items",
      icon: <Target className="h-5 w-5 text-emerald-500" />
    },
    {
      title: "Featured Skills",
      value: stats.featuredSkills,
      description: "Highlighted in portfolio",
      icon: <Star className="h-5 w-5 text-amber-500" />
    },
    {
      title: "Featured Projects",
      value: stats.featuredProjects,
      description: "Showcased prominently",
      icon: <Award className="h-5 w-5 text-violet-500" />
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statItems.map((item, index) => (
        <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex-1">
              {item.title}
            </CardTitle>
            <div className="text-muted-foreground ml-2">
              {item.icon}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {item.description}
              </p>
              {item.trend && (
                <Badge variant="outline" className={`text-xs ml-auto ${
                  item.trend.direction === 'up' ? 'text-green-500' : 
                  item.trend.direction === 'down' ? 'text-red-500' : 
                  'text-muted-foreground'
                }`}>
                  {item.trend.direction === 'up' ? '+' : item.trend.direction === 'down' ? '-' : ''}{item.trend.value}% {item.trend.period}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};