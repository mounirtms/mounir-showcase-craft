import React, { useState, useMemo, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import { useProjects, PROJECTS_COLLECTION, type Project } from "@/hooks/useProjects";
import { addDoc, collection, doc, updateDoc, deleteDoc, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { DataTable, ActionColumn, StatusBadge } from "@/components/ui/data-table";
import { validateProjectUpdate } from "@/lib/validation-schemas";
import { format } from "date-fns";
import type { ColumnDef } from "@tanstack/react-table";

import {
  BarChart3,
  Calendar,
  Database,
  Download,
  Edit,
  Eye,
  EyeOff,
  FileText,
  Github,
  Globe,
  Plus,
  Star,
  Trash2,
  Trophy,
  Clock,
  RefreshCw,
  HelpCircle,
  Trash,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function ProjectsManager() {
  const { projects, loading } = useProjects();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [projectsToDelete, setProjectsToDelete] = useState<Project[]>([]);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Data for filter dropdowns
  const categoryOptions = useMemo(() => {
    const categories = [...new Set(projects.map(p => p.category))];
    return categories.map(cat => ({ label: cat, value: cat }));
  }, [projects]);

  const statusOptions = useMemo(() => {
    const statuses = [...new Set(projects.map(p => p.status))];
    return statuses.map(status => ({ label: status.replace(/-/g, ' '), value: status }));
  }, [projects]);

  // Callback functions for table actions (moved before columns definition)
  const handleViewProject = useCallback((project: Project) => {
    setSelectedProject(project);
    setDetailsOpen(true);
  }, []);

  const handleEditProject = useCallback((project: Project) => {
    // Navigate to edit project page or open edit dialog
    window.dispatchEvent(new CustomEvent('edit-project', { detail: project }));
  }, []);

  const handleDuplicateProject = useCallback(async (project: Project) => {
    if (!db) return;

    try {
      const duplicatedProject = {
        ...project,
        title: `${project.title} (Copy)`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        featured: false, // Reset featured status for duplicates
      };

      // Remove the id field since we want to create a new document
      const { id, ...projectData } = duplicatedProject;

      await addDoc(collection(db, PROJECTS_COLLECTION), projectData);
      
      toast({
        title: "Project duplicated",
        description: `"${project.title}" has been duplicated successfully.`,
      });
    } catch (error) {
      console.error("Error duplicating project:", error);
      toast({
        title: "Error",
        description: "Failed to duplicate project. Please try again.",
        variant: "destructive",
      });
    }
  }, []);

  const handleDeleteProject = useCallback(async () => {
    if (!db || !projectToDelete) return;

    try {
      await deleteDoc(doc(db, PROJECTS_COLLECTION, projectToDelete.id));
      setProjectToDelete(null);
      
      toast({
        title: "Project deleted",
        description: `"${projectToDelete.title}" has been deleted successfully.`,
      });
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive",
      });
    }
  }, [projectToDelete]);

  const handleBulkDelete = useCallback(async () => {
    if (!db || projectsToDelete.length === 0) return;

    try {
      const batch = writeBatch(db);
      
      projectsToDelete.forEach((project) => {
        const projectRef = doc(db, PROJECTS_COLLECTION, project.id);
        batch.delete(projectRef);
      });

      await batch.commit();
      setBulkDeleteOpen(false);
      setProjectsToDelete([]);
      
      toast({
        title: "Projects deleted",
        description: `${projectsToDelete.length} projects have been deleted successfully.`,
      });
    } catch (error) {
      console.error("Error deleting projects:", error);
      toast({
        title: "Error",
        description: "Failed to delete projects. Please try again.",
        variant: "destructive",
      });
    }
  }, [projectsToDelete]);

  const handleBulkUpdate = useCallback(async (projects: Project[], update: Partial<Project>) => {
    if (!db || projects.length === 0) return;

    try {
      const batch = writeBatch(db);
      
      projects.forEach((project) => {
        const projectRef = doc(db, PROJECTS_COLLECTION, project.id);
        batch.update(projectRef, {
          ...update,
          updatedAt: Date.now(),
        });
      });

      await batch.commit();
      
      toast({
        title: "Projects updated",
        description: `${projects.length} projects have been updated successfully.`,
      });
    } catch (error) {
      console.error("Error updating projects:", error);
      toast({
        title: "Error",
        description: "Failed to update projects. Please try again.",
        variant: "destructive",
      });
    }
  }, []);

  const handleExport = useCallback((projects: Project[]) => {
    try {
      // Format projects for export
      const exportData = projects.map(project => ({
        title: project.title,
        description: project.description,
        category: project.category,
        status: project.status,
        technologies: project.technologies.join(', '),
        liveUrl: project.liveUrl,
        githubUrl: project.githubUrl,
        featured: project.featured,
        priority: project.priority,
        startDate: project.startDate,
        endDate: project.endDate,
        createdAt: new Date(project.createdAt).toLocaleDateString(),
      }));

      // Create and download CSV
      const csv = [
        Object.keys(exportData[0]).join(','),
        ...exportData.map(row => Object.values(row).map(val => `"${val}"`).join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `projects-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Export successful",
        description: `${projects.length} projects exported to CSV.`,
      });
    } catch (error) {
      console.error("Error exporting projects:", error);
      toast({
        title: "Error",
        description: "Failed to export projects. Please try again.",
        variant: "destructive",
      });
    }
  }, []);

  const toggleProjectFeatured = useCallback(async (project: Project) => {
    if (!db) return;

    try {
      await updateDoc(doc(db, PROJECTS_COLLECTION, project.id), {
        featured: !project.featured,
        updatedAt: Date.now(),
      });
      
      toast({
        title: project.featured ? "Project unfeatured" : "Project featured",
        description: `${project.title} has been ${project.featured ? "unfeatured" : "featured"} successfully`,
      });
    } catch (error) {
      console.error("Failed to update project:", error);
      toast({
        title: "Failed to update",
        description: "There was an error updating the project",
        variant: "destructive",
      });
    }
  }, []);

  const toggleProjectVisibility = useCallback(async (project: Project) => {
    if (!db) return;

    try {
      await updateDoc(doc(db, PROJECTS_COLLECTION, project.id), {
        disabled: !project.disabled,
        updatedAt: Date.now(),
      });
      
      toast({
        title: project.disabled ? "Project visible" : "Project hidden",
        description: `${project.title} is now ${project.disabled ? "visible" : "hidden"} on the portfolio`,
      });
    } catch (error) {
      console.error("Failed to update project:", error);
      toast({
        title: "Failed to update",
        description: "There was an error updating the project",
        variant: "destructive",
      });
    }
  }, []);

  // Table columns definition
  const columns = useMemo<ColumnDef<Project, unknown>[]>(() => [
    {
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
          className="rounded border-gray-300"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={(e) => row.toggleSelected(e.target.checked)}
          className="rounded border-gray-300"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "title",
      header: "Project",
      cell: ({ row }) => {
        const project = row.original;
        return (
          <div className="flex items-start gap-2">
            <div className="w-8 h-8 rounded-md flex-shrink-0 overflow-hidden bg-muted flex items-center justify-center">
              {project.logo ? (
                <img src={project.logo} alt="" className="w-full h-full object-cover" />
              ) : (
                <Database className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <div>
              <div className="font-medium">{project.title}</div>
              <div className="text-sm text-muted-foreground truncate max-w-[300px]">
                {project.description.substring(0, 60)}
                {project.description.length > 60 ? "..." : ""}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {row.original.category}
        </Badge>
      ),
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        let variant: "default" | "secondary" | "destructive" | "outline" = "outline";
        
        if (status === "completed") variant = "default";
        if (status === "in-progress") variant = "secondary";
        if (status === "archived") variant = "destructive";
        
        return <StatusBadge status={status} variant={variant} />;
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "technologies",
      header: "Technologies",
      cell: ({ row }) => {
        const techs = row.original.technologies;
        const displayCount = 2;
        
        return (
          <div className="flex flex-wrap gap-1">
            {techs.slice(0, displayCount).map((tech, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                {tech}
              </Badge>
            ))}
            {techs.length > displayCount && (
              <Badge variant="outline" className="text-xs">
                +{techs.length - displayCount}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "featured",
      header: "Featured",
      cell: ({ row }) => (
        <div className="flex justify-center">
          {row.original.featured ? (
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          ) : (
            <Star className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      ),
    },
    {
      accessorKey: "disabled",
      header: "Visible",
      cell: ({ row }) => (
        <div className="flex justify-center">
          {row.original.disabled ? (
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Eye className="h-4 w-4 text-green-500" />
          )}
        </div>
      ),
    },
    {
      accessorKey: "updatedAt",
      header: "Last Updated",
      cell: ({ row }) => {
        const timestamp = row.original.updatedAt;
        const date = new Date(timestamp);
        return (
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{format(date, "dd MMM yyyy")}</span>
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <ActionColumn
            row={row}
            onView={() => handleViewProject(row.original)}
            onEdit={() => handleEditProject(row.original)}
            onDelete={() => setProjectToDelete(row.original)}
            onDuplicate={() => handleDuplicateProject(row.original)}
            onToggleFeatured={() => toggleProjectFeatured(row.original)}
            onToggleVisibility={() => toggleProjectVisibility(row.original)}
          />
        );
      },
    },
  ], [handleViewProject, handleEditProject, handleDuplicateProject, toggleProjectFeatured, toggleProjectVisibility]);

  return (
    <>
      <Card className="border-0 shadow-medium">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Project Management
              </CardTitle>
              <CardDescription>
                Manage your portfolio projects with advanced filtering and bulk operations
              </CardDescription>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
                className="hidden md:flex"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button 
                size="sm"
                onClick={() => window.dispatchEvent(new CustomEvent('add-project'))}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Project
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={projects}
            loading={loading}
            searchPlaceholder="Search projects..."
            onAdd={() => window.dispatchEvent(new CustomEvent('add-project'))}
            onDelete={(projects) => {
              setProjectsToDelete(projects);
              setBulkDeleteOpen(true);
            }}
            onExport={handleExport}
            onRefresh={() => window.location.reload()}
            filterFields={[
              {
                key: "category",
                title: "Category",
                options: categoryOptions
              },
              {
                key: "status",
                title: "Status",
                options: statusOptions
              }
            ]}
            rowClassName={(row) => {
              if (row.original.disabled) return "opacity-60";
              if (row.original.featured) return "bg-yellow-50/30 dark:bg-yellow-950/20";
              return "";
            }}
          />
        </CardContent>
      </Card>

      {/* Project Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        {selectedProject && (
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md flex-shrink-0 overflow-hidden bg-muted flex items-center justify-center">
                    {selectedProject.logo ? (
                      <img src={selectedProject.logo} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Database className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <span>{selectedProject.title}</span>
                </div>
              </DialogTitle>
              <DialogDescription>
                Project details and information
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Image */}
              {selectedProject.image && (
                <div className="w-full h-48 rounded-lg overflow-hidden bg-muted">
                  <img 
                    src={selectedProject.image} 
                    alt={selectedProject.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              {/* Metadata */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="capitalize">
                  {selectedProject.category}
                </Badge>
                <StatusBadge status={selectedProject.status} />
                {selectedProject.featured && (
                  <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    Featured
                  </Badge>
                )}
                {selectedProject.disabled && (
                  <Badge variant="secondary" className="bg-red-500/10 text-red-600">
                    <EyeOff className="h-3 w-3 mr-1" />
                    Hidden
                  </Badge>
                )}
              </div>
              
              {/* Description */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Description</h3>
                <p className="text-muted-foreground">
                  {selectedProject.description}
                </p>
                {selectedProject.longDescription && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {selectedProject.longDescription}
                  </p>
                )}
              </div>
              
              {/* Technical Details */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="text-md font-semibold">Technologies</h3>
                  <div className="flex flex-wrap gap-1">
                    {selectedProject.technologies.map((tech, i) => (
                      <Badge key={i} variant="outline">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-md font-semibold">Tags</h3>
                  <div className="flex flex-wrap gap-1">
                    {selectedProject.tags.map((tag, i) => (
                      <Badge key={i} variant="secondary" className="bg-muted">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Links */}
              <div className="space-y-2">
                <h3 className="text-md font-semibold">Links</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.liveUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={selectedProject.liveUrl} target="_blank" rel="noopener noreferrer">
                        <Globe className="h-4 w-4 mr-2" />
                        Live Site
                      </a>
                    </Button>
                  )}
                  {selectedProject.githubUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4 mr-2" />
                        GitHub
                      </a>
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Achievements */}
              {selectedProject.achievements && selectedProject.achievements.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-md font-semibold">Key Achievements</h3>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    {selectedProject.achievements.map((achievement, i) => (
                      <li key={i}>{achievement}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Timeline */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {selectedProject.startDate && `Started: ${selectedProject.startDate}`}
                    {selectedProject.duration && ` • Duration: ${selectedProject.duration}`}
                  </div>
                  <div>
                    Priority: {selectedProject.priority}
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => handleEditProject(selectedProject)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Project
              </Button>
              <Button
                variant={selectedProject.featured ? "default" : "outline"}
                onClick={() => toggleProjectFeatured(selectedProject)}
              >
                <Star className={`h-4 w-4 mr-2 ${selectedProject.featured ? 'fill-current' : ''}`} />
                {selectedProject.featured ? "Unfeature" : "Feature"}
              </Button>
              <Button
                variant={selectedProject.disabled ? "default" : "outline"}
                onClick={() => toggleProjectVisibility(selectedProject)}
              >
                {selectedProject.disabled ? (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Show
                  </>
                ) : (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    Hide
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={!!projectToDelete} 
        onOpenChange={(open) => !open && setProjectToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{projectToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteProject}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog 
        open={bulkDeleteOpen} 
        onOpenChange={setBulkDeleteOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bulk Delete Projects</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {projectsToDelete.length} projects? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="max-h-[200px] overflow-y-auto">
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              {projectsToDelete.map((project) => (
                <li key={project.id}>{project.title}</li>
              ))}
            </ul>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setProjectsToDelete([])}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
