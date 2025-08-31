import React, { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProjects } from "@/hooks/useProjects";
import { useSkills } from "@/hooks/useSkills";
import { useUserTracking } from "@/hooks/useUserTracking";
import { usePerformanceMonitoring } from "@/hooks/usePerformanceMonitoring";
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
  Activity as ActivityIcon,
  MousePointer,
  Thermometer,
  TestTube,
  Monitor,
  Gauge,
  Wifi,
  HardDrive,
  Cpu,
  MemoryStick,
  Network,
  Timer,
  Layers,
  Filter,
  Settings,
  Play,
  Pause,
  RotateCcw
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

interface VisitorData {
  id: string;
  timestamp: number;
  page: string;
  userAgent: string;
  location?: string;
  sessionDuration: number;
  interactions: number;
  referrer?: string;
}

interface HeatmapData {
  x: number;
  y: number;
  intensity: number;
  element: string;
  count: number;
}

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  threshold: number;
  status: 'good' | 'warning' | 'critical';
}

interface ABTestVariant {
  id: string;
  name: string;
  traffic: number;
  conversions: number;
  conversionRate: number;
  isActive: boolean;
}

export function AnalyticsDashboard() {
  const { projects, loading: projectsLoading } = useProjects();
  const { skills, loading: skillsLoading } = useSkills();
  const { events, getEventStats, isTracking, setIsTracking } = useUserTracking();
  const { metrics: performanceMetrics, isMonitoring, startMonitoring, stopMonitoring } = usePerformanceMonitoring();
  
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("30d");
  const [heatmapEnabled, setHeatmapEnabled] = useState(false);
  const [abTestingEnabled, setAbTestingEnabled] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState("control");
  
  // Mock visitor data (in real implementation, this would come from analytics service)
  const [visitorData, setVisitorData] = useState<VisitorData[]>([]);
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);
  const [abTestVariants, setAbTestVariants] = useState<ABTestVariant[]>([
    { id: 'control', name: 'Control', traffic: 50, conversions: 45, conversionRate: 4.5, isActive: true },
    { id: 'variant-a', name: 'Variant A', traffic: 30, conversions: 32, conversionRate: 5.2, isActive: true },
    { id: 'variant-b', name: 'Variant B', traffic: 20, conversions: 18, conversionRate: 3.8, isActive: false }
  ]);

  // Generate mock visitor data based on user tracking events
  useEffect(() => {
    const mockVisitors: VisitorData[] = events
      .filter(event => event.type === 'page_view')
      .slice(-100) // Last 100 page views
      .map((event, index) => ({
        id: `visitor_${index}`,
        timestamp: event.timestamp,
        page: event.metadata?.path || '/',
        userAgent: event.metadata?.userAgent || 'Unknown',
        location: 'Unknown',
        sessionDuration: Math.random() * 300000, // 0-5 minutes
        interactions: Math.floor(Math.random() * 20),
        referrer: event.metadata?.referrer
      }));
    
    setVisitorData(mockVisitors);
  }, [events]);

  // Generate heatmap data from click events
  useEffect(() => {
    const clickEvents = events.filter(event => event.type === 'click');
    const heatmapPoints: HeatmapData[] = [];
    
    clickEvents.forEach(event => {
      if (event.metadata?.coordinates) {
        const { x, y } = event.metadata.coordinates;
        const existing = heatmapPoints.find(point => 
          Math.abs(point.x - x) < 50 && Math.abs(point.y - y) < 50
        );
        
        if (existing) {
          existing.count++;
          existing.intensity = Math.min(existing.intensity + 0.1, 1);
        } else {
          heatmapPoints.push({
            x,
            y,
            intensity: 0.3,
            element: event.target || 'unknown',
            count: 1
          });
        }
      }
    });
    
    setHeatmapData(heatmapPoints);
  }, [events]);

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

    // Visitor analytics
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    const recentVisitors = visitorData.filter(v => now - v.timestamp < dayMs);
    const uniquePages = new Set(visitorData.map(v => v.page)).size;
    const avgSessionDuration = visitorData.length > 0 
      ? visitorData.reduce((sum, v) => sum + v.sessionDuration, 0) / visitorData.length 
      : 0;

    // User interaction analytics
    const eventStats = getEventStats();
    const clickEvents = events.filter(e => e.type === 'click').length;
    const scrollEvents = events.filter(e => e.type === 'scroll').length;
    const formSubmissions = events.filter(e => e.type === 'form_submit').length;

    return {
      projects: projectMetrics,
      skills: skillMetrics,
      categories: categoryData,
      projectsByCategory,
      visitors: {
        total: visitorData.length,
        recent: recentVisitors.length,
        uniquePages,
        avgSessionDuration: Math.round(avgSessionDuration / 1000), // Convert to seconds
        bounceRate: Math.round((recentVisitors.filter(v => v.interactions < 2).length / recentVisitors.length) * 100) || 0
      },
      interactions: {
        total: eventStats.totalEvents,
        clicks: clickEvents,
        scrolls: scrollEvents,
        forms: formSubmissions,
        heatmapPoints: heatmapData.length
      }
    };
  }, [projects, skills, visitorData, events, getEventStats, heatmapData]);

  const overviewMetrics: AnalyticsMetric[] = [
    {
      title: "Total Visitors",
      value: analytics.visitors.total,
      change: 12,
      icon: <Users className="w-5 h-5" />,
      color: "text-blue-600",
      description: "Unique portfolio visitors"
    },
    {
      title: "Recent Visitors",
      value: analytics.visitors.recent,
      change: 8,
      icon: <Eye className="w-5 h-5" />,
      color: "text-green-600",
      description: "Visitors in last 24 hours"
    },
    {
      title: "User Interactions",
      value: analytics.interactions.total,
      change: 15,
      icon: <MousePointer className="w-5 h-5" />,
      color: "text-purple-600",
      description: "Total user interactions"
    },
    {
      title: "Avg Session Duration",
      value: `${Math.floor(analytics.visitors.avgSessionDuration / 60)}m ${analytics.visitors.avgSessionDuration % 60}s`,
      change: 5,
      icon: <Clock className="w-5 h-5" />,
      color: "text-orange-600",
      description: "Average time on site"
    },
    {
      title: "Bounce Rate",
      value: `${analytics.visitors.bounceRate}%`,
      change: -3,
      icon: <TrendingUp className="w-5 h-5" />,
      color: "text-red-600",
      description: "Single page visits"
    },
    {
      title: "Heatmap Points",
      value: analytics.interactions.heatmapPoints,
      change: 7,
      icon: <Thermometer className="w-5 h-5" />,
      color: "text-pink-600",
      description: "Click interaction zones"
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
            Monitor your portfolio performance, visitor behavior, and user interactions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 mr-4">
            <Label htmlFor="tracking-toggle" className="text-sm">User Tracking</Label>
            <Switch
              id="tracking-toggle"
              checked={isTracking}
              onCheckedChange={setIsTracking}
            />
          </div>
          <div className="flex items-center gap-2 mr-4">
            <Label htmlFor="performance-toggle" className="text-sm">Performance Monitor</Label>
            <Switch
              id="performance-toggle"
              checked={isMonitoring}
              onCheckedChange={(checked) => checked ? startMonitoring() : stopMonitoring()}
            />
          </div>
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
                        {metric.change > 
                      </Badge>
                    )}
                  </div>
                  {metric.description && (
                    <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
                  )}
                </div>
                <div className={`p-3 rounded-xl bg-muted/50`}>
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
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="visitors" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Visitors
          </TabsTrigger>
          <TabsTrigger value="heatmap" className="flex items-center gap-2">
            <Thermometer className="w-4 h-4" />
            Heatmap
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Monitor className="w-4 h-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="abtesting" className="flex items-center gap-2">
            <TestTube className="w-4 h-4" />
            A/B Testing
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Projects
          </TabsTrigger>
          <TabsTrigger value="skills" className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            Skills
          </TabsTrigger>
        </TabsList>

        <TabsContent value="visitors" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Visitor Overview */}
            <Card className="border-0 shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users clas
                  Visitor Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-24">
                    <div className="text-cent
                      <div className=
                      <div clv>
                    </div>
                    <div className="text-center p-lg">
                      <div className="text-2xl font-bold text-green-6>
                      <div className="text-sm text-muted-foregdiv>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div cla>
                      <spaned</span>
                      <Badge variant="outline">{analytics.visitors.uniqu
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Bounce Rate</span>
                      <Badge variant={analytics.visitors.bounceRate > 70 ? "destructive" : "second}>
                        {analynceRate}%
                      </adge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Visit
            <Card classNamedium">
              <CardHeader>
                <Carap-2">
/>
                  Recent Visitor Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64">
                  {visitorData.slice
                    <div key={visitored">
                      <div classNa
                        <div>
                        <div className="texd">
                          {new Date(visitor.timestamp).toLocaleTimeString()} • {visitor.i
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {Math.round(visitor.sessionDuration / 1000)}s
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>


        <TabsConten-6">
          <div classNa gap-6">
  ols */}
            <Card className="border-0 shadow-mediu
              <CardHeader>
                <CardTitlep-2">
                  <Settin />
                  Heatmaps
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-cen">
                  <Label htmlFor="hel>
                  <Switch
                    id="heatmap-toggle"
                    checked={heatmaed}
                    onCheckedChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Time >
                  <Select vameRange}>
                    <SelectTrir>
                      <SelectV/>
                    </Sel>
                    <Selntent>
                     
                m>
                      <SelectItemItem>
                   
  tent>
                  </Select>
                </div>

                <Button clas
                  <RotateCcw cl" />
                  Reset Heatmap Data
                </But>
              </CardContent>
            </Card>

            {/* Heatmap Stati
            <Card classNam
              <CardHeader>
                <CardTitle cla2">
                  <Thermo
                  Click 
                </Cardtle>
ader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 ga">
                  <div className="text-center>
                    <div className="text-xl font-bold text-red-600
                    <div classNa>
                  </div>
                  <div cd-lg">
                    <div class
                   , 0)}
                  
                    <d
  
                  <div className="text-center p-3 bg-muted>
                    <div class
                      {Mat
                    </div>
                    <div className="text-xs text-/div>
                  </div>
                  <div className="
                    <div class">
                      {net)).size}
                    </di
                    <dv>
                  </div>
                </div>

                {/* He}

                  <div className="text-center">
                    <Thermometer className="w-12 h-12 mx-auto mb->
                    <h3 classNa
                    <p className="text-sm text-muted-
                      Visue
                    </p>
                    <dier">
                      {heatm (
                     
           clicks
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" cl">
          <div className="grid grid-cols-1  gap-6">
            {/* Real-time Performance Metrics */}
            <Card className="bordermedium">
              <CardHeader>
                <CardTitle className">
                  <Gauge className= h-5" />
                  Real-time Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div c">
                  {performa(
                    <d
>
                      
">
                          {typeof metric === 'object' ? `${
                        </Badge>
                      </div>
                      <Progress value={Math.min(50, 100)}"h-2" />
                    </div>
                  ))}
>
              </CardContent>
            </Card>

            {/* System Re*/}
            <Card className=">
              <Card

                  <Monit/>
                  System Resources
                </CardTi
              </CardHeader>
              <CardContent>
                <div className="grid grip-4">
                  <div classd-lg">
                    <Cpu cl/>
                    <div cl">
                      * 100)}%
                    </div>
                    <div className="text-xs text-muted-foreground">CPU Ue</div>
                  </div>
                  <div cd-lg">
                    <Memo600" />
                    <div className="text-lg font-bold">
                      {Math.r}%
                    v>
                    <div clas>
                  </div>
                  <div
                 " />
            
           s
  

                  </div>
     ">
                    <HardDrive >
             >
                      {M 100)}%
       /div>
                    <div cla
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Summary */}
          <Card className="border-0 shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
            5 h-5" />
                Performan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-semibold mb-2">Portfoth</h3>
                  <div className="text-3xl font-bold text-green-600 m-1">
                    {Ma%
            v>
                  <p classing</p>
                </div>
                <div className="text-center p-4 bg-mutedd-lg">
                  <h3 cl
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {Math.round((1 - analytics.visitors.bounceRate / 10
                  </div>
                  <p className="text-xs text-muted-foreground">Engagement>
                </div>
                <div className="text-cent">
                  
                  <div mb-1">
                    {Math.round(analyt 1))}
                  </div>
                  <p className="text-xs text-muted-foreground">Avg interaction
          
              </div>
            </CardContent>

        </TabsContent>

        <TabsContent value=6">
          <div classN
            {/* A/B Test C/}
            <Card className="border-0 sh
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TestTube className="w-5 h-5" />
                  A/B Test Configuration
                </CardTitle>
der>
              4">
                <div className="fle>
                  <Labebel>
                  <Switch
                    id="ab-testing-toggle"
                    checked={abd}
                    onCheckedChange={setAbTestingEnabled}
                  />
                </div>

                <div className="spacey-2">
                  <Label>Ael>
                  <Select value={selectedVariant} onValnt}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {abTestVariants.map((variant) =
                        <SelectItem>
                          {variant.name}c)
                   
                    ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <h4 className="foiants</h4>

                   -lg">
                      <div c>
              00'}`} />
                        <span clpan>
                      </div>
                      <Badge variant={v>
                        {variant.traffic}%
                      </Badge>
                    <v>
                  ))}
                </div>

>
                  <Button classNa
                    < />
                    Start Tes
                  <>
                  <Button className="flex-1" var">
                    <Pause className="w-4 h-4 mr-2" />
                    Pause Test
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* A/B Test Results */}
            <Card className="border-0 shadow-m">
ader>
                <Car
                  <BarChart className-5" />
                  Test Results
                </CardTi
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {abTestVariants.map((variant) => (
                    <div
                      <div class">
                        <span className="fontspan>
                        <Bad>
                          {variant.conversionRate}% CVR
                        </Badge>
                      </div>

                      ">
                          <spa
                          <span>Conversions: {variant.conve
                        </div>
                        <Progress value={var" />
                      </div>
                    </div>
                  ))}
                </div>

                <div classNaded-lg">
                  <h4 className="font
                  <div className="text-sm text-muted-round">
                    <p>Sample size: {abTestVariants.reduce((s
                    5%</p>
                    <p>Test duration: 7 days</p>
                  </div>
                </div>
              </CardContent>
>
          </div>

          {/* Ason */}
          <Card className="borderium">
            <Cardeader>
              <CardTitle cla2">
                <LineChart c>
                Performance Comparison
              </CardTitle>
            </CardHeader>
            <CardCont>
              <div className="gri
                <div clas
                  <h3 className="font-semibold mb-2">Best Performer</h3>
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {abTestVariants.sort((a, b) => b.conversionRate - a.conver
                  <div>
                  <p className="text-sm texound">
                    {abTestVariane
                  </p>
                </div>
                
                <div class">
                  <h3 className="f/h3>
                  <div className="text-2xl font-bold tex">
                    +{Math.round|| 0) - 
                    (abTestVariants.find(v =}%
                  </div>
                  <p classNp>
                </div>
                
                <div className="text-center p-4 bg-muted/50 
                  <h3 className="font-semibold mb-2">Recommend/h3>
                  -1">
                    {abTestVariants.sort((a, b) => b.> 
                     (abTestVariant
v>
                  <p classN
                   te > 
                     (abTestV'}
                  </p>
                </
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Project St/}
            <Card className="border-0 shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Project Status Distrin
                </CardTitle>
              </CardHeader>
   ent>
                <d
                  <div cla>
                    <span className="text-sm">Completed</span>
             gap-2">
                      <Progress value={(analytics.projects.completed / analytic" />
                      <span className="text-sm font-medium">{analytics.pron>
                    </div>
                  </div>
                  <div className="flex justify-
                    <span className="text-sm">In Progpan>
                    <div cap-2">
                      <Progress value={(analytics.projects.inPr
                      <span className="text-sm fon/span>
                    </div>
                  </div>
                  <div clas
                    <span c/span>
                    <div className="flex it">
                      <Progress value={(analytics.projects.featured /
                      <span className="text-sm font-medium">{aan>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills by Category */}
            <Card className="border-0 shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChar
                  Skillsry
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(analytics.categories).map(([category, data]) => (
                    <div k">
                      <dnter">
                      span>
                        <Bad>
                   g
ge>
                      </div>
                      <Progress value={data.averageLe>
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
                <div classNa3">
                  {projectCategoryData.map((item) => (
                    <div kn">
                     }</span>
                      2">
                        <dived">
                    
                 
                      yle={{ 
or,
                              width: `${(item.value / Math.m 
                            }}
                          />
                        </div>
                        <span className="text-sm font-med
                      </div
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
                  <div classNalg">
                    <span cln>
                    <Badge var
                      {Object.entries(analytics.projectsByCategory).sort(([,a], ["}
                    </Badge>
                  </div>
                  <dided-lg">
                    <san>
                    <Badge vndary">
                   0)}%
</Badge>
                  </div>
                  <div claed-lg">
                    <span className="text-sm">Completion>
                    <Badge y">
                      {Math 100)}%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <div className="grid grid-cols-1 lg:g-6">
            <Card className="border-0 shadow-medium">
              <CardHeader>
                <CardTit
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { label:" },
                    { la},
                    {  },
                    { label:" }
                  ]
                >
                      
/>
                        <span className="text-sm">{level.lan>
                      </div>
                      <Badge variant="outline">{level
                    </div>
                  ))}
                </div>
              </CardContent
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
                    .map((sk
                      <div key={skill.id} className="flex items-centween">
                        <d>
                     span>
                      0" />}
                        </di
                   ">
 />
                          <span className="text-sm fo>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AnalyticsDashbod;ar