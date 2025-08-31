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
  Eye,
  MousePointer,
  Thermometer,
  TestTube,
  Monitor,
  Gauge,
  Cpu,
  MemoryStick,
  Network,
  HardDrive,
  Settings,
  Play,
  Pause,
  RotateCcw,
  RefreshCw,