import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Database, 
  Code, 
  Star, 
  FolderOpen,
  TrendingUp,
  Activity
} from "lucide-react";

interface AdminStatsProps {
  stats: {
    totalSkills: number;
    totalProjects: number;
    featuredSkills: number;
    featuredProjects: number;
  };
}

export const AdminStats: React.FC<AdminStatsProps> = ({ stats }) => {
  // Stats cards data
  const statCards = [
    {
      title: "Total Skills",
      value: stats.totalSkills,
      icon: <Code className="h-5 w-5" />,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      change: "+12% from last month"
    },
    {
      title: "Total Projects",
      value: stats.totalProjects,
      icon: <FolderOpen className="h-5 w-5" />,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      change: "+8% from last month"
    },
    {
      title: "Featured Skills",
      value: stats.featuredSkills,
      icon: <Star className="h-5 w-5" />,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      change: "+5% from last month"
    },
    {
      title: "Featured Projects",
      value: stats.featuredProjects,
      icon: <Database className="h-5 w-5" />,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      change: "+3% from last month"
    }
  ];

  return (
    <div className="col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {statCards.map((stat, index) => (
        <Card key={index} className="border-0 shadow-lg bg-gradient-to-br from-card to-muted/50 hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              {stat.icon}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};