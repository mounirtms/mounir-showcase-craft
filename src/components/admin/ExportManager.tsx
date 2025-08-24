import { useState } from 'react';
import { useProjects } from '@/hooks/useProjects';
import { useApplications } from '@/hooks/useApplications';
import { useExperienceEnhanced } from '@/hooks/useExperienceEnhanced';
import { useSkills } from '@/hooks/useSkills';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import {
  FileText,
  Download,
  Database,
  Building2,
  Briefcase,
  Award,
  Calendar,
  Users,
  CheckCircle2,
  Loader2
} from 'lucide-react';

interface ExportStats {
  totalRecords: number;
  fileSize: string;
  lastExport?: string;
}

export function ExportManager() {
  const { projects } = useProjects();
  const { applications } = useApplications();
  const { experiences } = useExperienceEnhanced();
  const { skills } = useSkills();
  
  const [isExporting, setIsExporting] = useState<string | null>(null);

  const downloadJson = (data: any, filename: string) => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getDataSize = (data: any): string => {
    const jsonString = JSON.stringify(data);
    return formatFileSize(new Blob([jsonString]).size);
  };

  const handleExport = async (type: string, data: any, filename: string) => {
    setIsExporting(type);
    
    try {
      // Add metadata
      const exportData = {
        metadata: {
          exportedAt: new Date().toISOString(),
          exportedBy: 'Portfolio Admin Panel',
          version: '1.0.0',
          type,
          count: Array.isArray(data) ? data.length : 1
        },
        data
      };
      
      downloadJson(exportData, filename);
      
      toast({
        title: 'Export Successful',
        description: `${filename} has been downloaded successfully.`,
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: 'Export Failed',
        description: 'There was an error exporting the data. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsExporting(null);
    }
  };

  const exportAllData = async () => {
    setIsExporting('all');
    
    try {
      const allData = {
        metadata: {
          exportedAt: new Date().toISOString(),
          exportedBy: 'Portfolio Admin Panel',
          version: '1.0.0',
          type: 'complete_portfolio',
          summary: {
            projects: projects.length,
            applications: applications.length,
            experiences: experiences.length,
            skills: skills.length,
            totalRecords: projects.length + applications.length + experiences.length + skills.length
          }
        },
        projects,
        applications,
        experiences,
        skills
      };
      
      const timestamp = new Date().toISOString().split('T')[0];
      downloadJson(allData, `portfolio_complete_${timestamp}.json`);
      
      toast({
        title: 'Complete Export Successful',
        description: 'All portfolio data has been exported successfully.',
      });
    } catch (error) {
      console.error('Complete export failed:', error);
      toast({
        title: 'Export Failed',
        description: 'There was an error exporting all data. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsExporting(null);
    }
  };

  const exportItems = [
    {
      id: 'projects',
      title: 'Projects',
      icon: Database,
      data: projects,
      color: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      stats: {
        totalRecords: projects.length,
        fileSize: getDataSize(projects)
      }
    },
    {
      id: 'applications',
      title: 'Applications',
      icon: Building2,
      data: applications,
      color: 'bg-green-500/10 text-green-600 border-green-500/20',
      stats: {
        totalRecords: applications.length,
        fileSize: getDataSize(applications)
      }
    },
    {
      id: 'experiences',
      title: 'Work Experience',
      icon: Briefcase,
      data: experiences,
      color: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
      stats: {
        totalRecords: experiences.length,
        fileSize: getDataSize(experiences)
      }
    },
    {
      id: 'skills',
      title: 'Skills',
      icon: Award,
      data: skills,
      color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
      stats: {
        totalRecords: skills.length,
        fileSize: getDataSize(skills)
      }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Export All */}
      <Card className="border-0 shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Complete Portfolio Export
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg border">
            <div>
              <h3 className="text-lg font-semibold">Export All Data</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Download complete portfolio including projects, applications, experience, and skills
              </p>
              <div className="flex items-center gap-4 mt-3">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Database className="h-3 w-3" />
                  {projects.length + applications.length + experiences.length + skills.length} Records
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {getDataSize({ projects, applications, experiences, skills })}
                </Badge>
              </div>
            </div>
            <Button
              onClick={exportAllData}
              disabled={isExporting === 'all'}
              className="min-w-[120px]"
            >
              {isExporting === 'all' ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export All
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Individual Exports */}
      <div className="grid md:grid-cols-2 gap-6">
        {exportItems.map(item => {
          const Icon = item.icon;
          return (
            <Card key={item.id} className="border-0 shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon className="h-5 w-5" />
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge className={item.color}>
                          {item.stats.totalRecords} Records
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        File Size: {item.stats.fileSize}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.stats.totalRecords > 0 ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <div className="h-5 w-5 rounded-full bg-gray-200 dark:bg-gray-700" />
                      )}
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      const timestamp = new Date().toISOString().split('T')[0];
                      handleExport(
                        item.id,
                        item.data,
                        `${item.id}_${timestamp}.json`
                      );
                    }}
                    disabled={item.stats.totalRecords === 0 || isExporting === item.id}
                  >
                    {isExporting === item.id ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Exporting...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Export {item.title}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Export Information */}
      <Card className="border-0 shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Export Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm text-muted-foreground">
            <div>
              <h4 className="font-semibold text-foreground mb-2">Export Format</h4>
              <p>All exports are in JSON format with metadata including export timestamp, version, and record counts.</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-2">Data Structure</h4>
              <p>Each export includes complete data with all fields, relationships, and timestamps preserved.</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-2">Import Compatibility</h4>
              <p>Exported data can be re-imported using the Data Manager upload functionality.</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-2">Security</h4>
              <p>Exports are generated client-side. No sensitive authentication data is included.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
