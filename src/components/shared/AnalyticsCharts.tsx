import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, BarChart3, LineChart, PieChart, Activity } from "lucide-react";

// Chart data types
export interface ChartDataPoint {
  label: string;
  value: number;
  date?: string;
  category?: string;
  color?: string;
}

export interface TimeSeriesData {
  timestamp: string;
  value: number;
  category?: string;
}

export interface ChartProps {
  data: ChartDataPoint[] | TimeSeriesData[];
  title?: string;
  description?: string;
  height?: number;
  width?: number;
  className?: string;
  loading?: boolean;
  error?: string;
  emptyMessage?: string;
}

// Simple Bar Chart Component
export const SimpleBarChart: React.FC<ChartProps & {
  orientation?: "horizontal" | "vertical";
  showValues?: boolean;
  maxBars?: number;
}> = ({
  data,
  title,
  description,
  height = 300,
  className,
  orientation = "vertical",
  showValues = true,
  maxBars = 10,
  loading = false,
  error,
  emptyMessage = "No data available"
}) => {
  const chartData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    const limitedData = data.slice(0, maxBars) as ChartDataPoint[];
    const maxValue = Math.max(...limitedData.map(d => d.value));
    
    return limitedData.map(item => ({
      ...item,
      percentage: maxValue > 0 ? (item.value / maxValue) * 100 : 0
    }));
  }, [data, maxBars]);

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-8 bg-muted rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">{emptyMessage}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent>
        <div className="space-y-3" style={{ height }}>
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-20 text-sm truncate">{item.label}</div>
              <div className="flex-1 relative">
                <div className="w-full bg-muted rounded-full h-6">
                  <div
                    className="bg-primary h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                    style={{ width: `${item.percentage}%` }}
                  >
                    {showValues && (
                      <span className="text-xs text-primary-foreground font-medium">
                        {item.value}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Simple Line Chart Component
export const SimpleLineChart: React.FC<ChartProps & {
  showDots?: boolean;
  showTrend?: boolean;
}> = ({
  data,
  title,
  description,
  height = 300,
  className,
  showDots = true,
  showTrend = true,
  loading = false,
  error,
  emptyMessage = "No data available"
}) => {
  const chartData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    const timeSeriesData = data as TimeSeriesData[];
    const maxValue = Math.max(...timeSeriesData.map(d => d.value));
    const minValue = Math.min(...timeSeriesData.map(d => d.value));
    
    return timeSeriesData.map((item, index) => ({
      ...item,
      x: (index / (timeSeriesData.length - 1)) * 100,
      y: maxValue > minValue ? ((maxValue - item.value) / (maxValue - minValue)) * 80 + 10 : 50
    }));
  }, [data]);

  const trend = useMemo(() => {
    if (chartData.length < 2) return null;
    const firstValue = chartData[0].value;
    const lastValue = chartData[chartData.length - 1].value;
    const change = ((lastValue - firstValue) / firstValue) * 100;
    return {
      direction: change > 0 ? "up" : "down",
      percentage: Math.abs(change).toFixed(1)
    };
  }, [chartData]);

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-64 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">{emptyMessage}</p>
        </CardContent>
      </Card>
    );
  }

  const pathData = chartData
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </div>
          {showTrend && trend && (
            <Badge variant={trend.direction === "up" ? "default" : "destructive"} className="gap-1">
              {trend.direction === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {trend.percentage}%
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div style={{ height }}>
          <svg width="100%" height="100%" viewBox="0 0 100 100" className="overflow-visible">
            <path
              d={pathData}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              className="transition-all duration-500"
            />
            {showDots && chartData.map((point, index) => (
              <circle
                key={index}
                cx={point.x}
                cy={point.y}
                r="3"
                fill="hsl(var(--primary))"
                className="transition-all duration-500"
              >
                <title>{`${point.timestamp}: ${point.value}`}</title>
              </circle>
            ))}
          </svg>
        </div>
      </CardContent>
    </Card>
  );
};

// Metrics Cards Component
export interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: "increase" | "decrease";
    period: string;
  };
  icon?: React.ReactNode;
  description?: string;
  className?: string;
  loading?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon,
  description,
  className,
  loading = false
}) => {
  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-muted rounded w-1/2" />
            <div className="h-8 bg-muted rounded w-3/4" />
            <div className="h-3 bg-muted rounded w-1/3" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {change && (
              <div className="flex items-center gap-1">
                {change.type === "increase" ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span className={cn(
                  "text-sm font-medium",
                  change.type === "increase" ? "text-green-500" : "text-red-500"
                )}>
                  {change.value}%
                </span>
                <span className="text-sm text-muted-foreground">{change.period}</span>
              </div>
            )}
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          {icon && (
            <div className="text-muted-foreground">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Analytics Dashboard Component
export interface AnalyticsDashboardProps {
  metrics?: MetricCardProps[];
  charts?: Array<{
    id: string;
    type: "bar" | "line" | "pie";
    props: ChartProps;
  }>;
  timeRange?: "1d" | "7d" | "30d" | "90d";
  onTimeRangeChange?: (range: string) => void;
  className?: string;
  loading?: boolean;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  metrics = [],
  charts = [],
  timeRange = "7d",
  onTimeRangeChange,
  className,
  loading = false
}) => {
  const [selectedChart, setSelectedChart] = useState(charts[0]?.id);

  const timeRangeOptions = [
    { value: "1d", label: "Last 24 hours" },
    { value: "7d", label: "Last 7 days" },
    { value: "30d", label: "Last 30 days" },
    { value: "90d", label: "Last 90 days" }
  ];

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Monitor your application performance and usage</p>
        </div>
        <Select value={timeRange} onValueChange={onTimeRangeChange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {timeRangeOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Metrics Grid */}
      {metrics.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} loading={loading} />
          ))}
        </div>
      )}

      {/* Charts Section */}
      {charts.length > 0 && (
        <div className="space-y-4">
          {charts.length > 1 && (
            <div className="flex gap-2">
              {charts.map(chart => (
                <Button
                  key={chart.id}
                  variant={selectedChart === chart.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedChart(chart.id)}
                >
                  {chart.type === "bar" && <BarChart3 className="w-4 h-4 mr-2" />}
                  {chart.type === "line" && <LineChart className="w-4 h-4 mr-2" />}
                  {chart.type === "pie" && <PieChart className="w-4 h-4 mr-2" />}
                  {chart.props.title || `${chart.type} Chart`}
                </Button>
              ))}
            </div>
          )}

          {charts.map(chart => (
            <div
              key={chart.id}
              className={cn(
                "transition-all duration-300",
                charts.length > 1 && selectedChart !== chart.id && "hidden"
              )}
            >
              {chart.type === "bar" && <SimpleBarChart {...chart.props} loading={loading} />}
              {chart.type === "line" && <SimpleLineChart {...chart.props} loading={loading} />}
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {metrics.length === 0 && charts.length === 0 && !loading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Activity className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Analytics Data</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Start using your application to see analytics data here. 
              Charts and metrics will appear as data becomes available.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AnalyticsDashboard;