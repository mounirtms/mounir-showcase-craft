import React, { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileJson, FileSpreadsheet } from "lucide-react";
import { useSkills } from "@/hooks/useSkills";
import { useProjects } from "@/hooks/useProjects";
import { toast } from "@/hooks/use-toast";
import { useTheme } from "@/components/theme/theme-provider";

interface DataExportManagerProps {
  onExportComplete?: () => void;
}

export function DataExportManager({ onExportComplete }: DataExportManagerProps) {
  const { skills } = useSkills();
  const { projects } = useProjects();
  const { actualTheme } = useTheme();

  const exportToJSON = useCallback((data: any, fileName: string) => {
    try {
      const jsonContent = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${fileName}.json`;
      link.click();
      toast({
        title: "Export Successful",
        description: `Data exported to ${fileName}.json`,
      });
    } catch (error) {
      console.error("Export failed:", error);
      toast({
        title: "Export Failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive",
      });
    }
  }, []);

  const exportToCSV = useCallback((data: any[], fileName: string) => {
    try {
      if (data.length === 0) {
        toast({
          title: "Export Warning",
          description: "No data to export",
          variant: "destructive",
        });
        return;
      }

      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${fileName}.csv`;
      link.click();
      toast({
        title: "Export Successful",
        description: `Data exported to ${fileName}.csv`,
      });
    } catch (error) {
      console.error("Export failed:", error);
      toast({
        title: "Export Failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive",
      });
    }
  }, []);

  const handleExportSkills = useCallback((format: 'json' | 'csv') => {
    if (format === 'json') {
      exportToJSON(skills, 'skills-data');
    } else {
      exportToCSV(skills, 'skills-data');
    }
    onExportComplete?.();
  }, [skills, exportToJSON, exportToCSV, onExportComplete]);

  const handleExportProjects = useCallback((format: 'json' | 'csv') => {
    if (format === 'json') {
      exportToJSON(projects, 'projects-data');
    } else {
      exportToCSV(projects, 'projects-data');
    }
    onExportComplete?.();
  }, [projects, exportToJSON, exportToCSV, onExportComplete]);

  const handleExportAllData = useCallback(() => {
    const allData = {
      skills,
      projects,
      exportDate: new Date().toISOString(),
      totalSkills: skills.length,
      totalProjects: projects.length,
      theme: actualTheme
    };
    exportToJSON(allData, 'portfolio-all-data');
    onExportComplete?.();
  }, [skills, projects, exportToJSON, onExportComplete, actualTheme]);

  return (
    <Card className="border-0 shadow-medium bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Data Export</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className={`border-0 shadow-sm ${actualTheme === 'dark' ? 'bg-slate-800/50' : 'bg-white/50'}`}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileJson className="h-5 w-5" />
                Skills Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className={`text-sm ${actualTheme === 'dark' ? 'text-slate-300' : 'text-muted-foreground'}`}>
                Export all skills in JSON or CSV format
              </p>
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleExportSkills('json')}
                  variant="outline" 
                  size="sm"
                  className="flex-1"
                >
                  <FileJson className="h-4 w-4 mr-2" />
                  JSON
                </Button>
                <Button 
                  onClick={() => handleExportSkills('csv')}
                  variant="outline" 
                  size="sm"
                  className="flex-1"
                >
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  CSV
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className={`border-0 shadow-sm ${actualTheme === 'dark' ? 'bg-slate-800/50' : 'bg-white/50'}`}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileJson className="h-5 w-5" />
                Projects Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className={`text-sm ${actualTheme === 'dark' ? 'text-slate-300' : 'text-muted-foreground'}`}>
                Export all projects in JSON or CSV format
              </p>
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleExportProjects('json')}
                  variant="outline" 
                  size="sm"
                  className="flex-1"
                >
                  <FileJson className="h-4 w-4 mr-2" />
                  JSON
                </Button>
                <Button 
                  onClick={() => handleExportProjects('csv')}
                  variant="outline" 
                  size="sm"
                  className="flex-1"
                >
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  CSV
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className={`border-0 shadow-sm ${actualTheme === 'dark' ? 'bg-slate-800/50' : 'bg-white/50'}`}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Download className="h-5 w-5" />
                Complete Export
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className={`text-sm ${actualTheme === 'dark' ? 'text-slate-300' : 'text-muted-foreground'}`}>
                Export all skills and projects in a single JSON file
              </p>
              <Button 
                onClick={handleExportAllData}
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                Export All Data
              </Button>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}