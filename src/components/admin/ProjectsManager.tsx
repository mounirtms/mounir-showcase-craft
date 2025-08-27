import React, { useState, useMemo, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import { useProjects, PROJECTS_COLLECTION, type Project } from "@/hooks/useProjects";
import { addDoc, collection, doc, updateDoc, deleteDoc, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { DataTable, ActionColumn, StatusBadge } from "@/components/ui/data-table";
import { validateProjectUpdate } from "@/lib/validation-schemas";
import { format } from "date-fns";
import type { ColumnDef } from "@tanstack/react-table";
import { DataExportManager } from "@/components/admin/DataExportManager";
import { ImageUpload } from "@/components/admin/ImageUpload";

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
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imagePath, setImagePath] = useState<string>("");
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [logoPath, setLogoPath] = useState<string>("");

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
    if (!db) {
      toast({
        title: "Service Unavailable",
        description: "Firebase is not configured. Please check your environment settings.",
        variant: "destructive",
      });
      return;
    }

    try {
      toast({
        title: "Duplicating project...",
        description: "Please wait while we create a copy of your project.",
      });
      
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
        title: "Project duplicated successfully",
        description: `"${project.title}" has been duplicated and added to your portfolio.`,
      });
    } catch (error) {
      console.error("Error duplicating project:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      toast({
        title: "Failed to duplicate project",
        description: `Error: ${errorMessage}. Please try again or contact support if the issue persists.`,
        variant: "destructive",
      });
    }
  }, []);

  const handleDeleteProject = useCallback(async () => {
    if (!db || !projectToDelete) return;

    try {
      toast({
        title: "Deleting project...",
        description: "Please wait while we remove the project from your portfolio.",
      });
      
      await deleteDoc(doc(db, PROJECTS_COLLECTION, projectToDelete.id));
      setProjectToDelete(null);
      
      toast({
        title: "Project deleted successfully",
        description: `"${projectToDelete.title}" has been permanently removed from your portfolio.`,
      });
    } catch (error) {
      console.error("Error deleting project:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      
      // Provide specific error guidance
      let userMessage = "Failed to delete project. Please try again.";
      if (errorMessage.includes('permission')) {
        userMessage = "You don't have permission to delete this project. Please check your access rights.";
      } else if (errorMessage.includes('network')) {
        userMessage = "Network error. Please check your internet connection and try again.";
      }
      
      toast({
        title: "Failed to delete project",
        description: userMessage,
        variant: "destructive",
      });
    }
  }, [projectToDelete]);

  const handleBulkDelete = useCallback(async () => {
    if (!db || projectsToDelete.length === 0) {
      toast({
        title: "Nothing to delete",
        description: "Please select projects to delete.",
        variant: "destructive",
      });
      return;
    }

    try {
      toast({
        title: "Deleting projects...",
        description: `Removing ${projectsToDelete.length} projects from your portfolio.`,
      });
      
      const batch = writeBatch(db);
      
      projectsToDelete.forEach((project) => {
        const projectRef = doc(db, PROJECTS_COLLECTION, project.id);
        batch.delete(projectRef);
      });

      await batch.commit();
      setBulkDeleteOpen(false);
      setProjectsToDelete([]);
      
      toast({
        title: "Projects deleted successfully",
        description: `${projectsToDelete.length} projects have been permanently removed from your portfolio.`,
      });
    } catch (error) {
      console.error("Error deleting projects:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      
      // Provide specific error guidance
      let userMessage = "Failed to delete projects. Please try again.";
      if (errorMessage.includes('permission')) {
        userMessage = "You don't have permission to delete these projects. Please check your access rights.";
      } else if (errorMessage.includes('network')) {
        userMessage = "Network error. Please check your internet connection and try again.";
      }
      
      toast({
        title: "Failed to delete projects",
        description: userMessage,
        variant: "destructive",
      });
    }
  }, [projectsToDelete]);

  // Columns definition
  const columns: ColumnDef<Project>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("title")}</div>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
          {row.getValue("category")}
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge status={row.getValue("status")} />
      ),
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
      cell: ({ row }) => (
        <div>{format(new Date(row.getValue("startDate")), 'MMM yyyy')}</div>
      ),
    },
    {
      accessorKey: "endDate",
      header: "End Date",
      cell: ({ row }) => {
        const endDate = row.getValue("endDate");
        return (
          <div>
            {endDate ? format(new Date(endDate as string), 'MMM yyyy') : 'Present'}
          </div>
        );
      },
    },
    {
      accessorKey: "featured",
      header: "Featured",
      cell: ({ row }) => (
        row.getValue("featured") ? 
        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" /> : 
        <Star className="h-4 w-4 text-muted-foreground" />
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <ActionColumn
          row={row}
          onView={() => handleViewProject(row.original)}
          onEdit={() => handleEditProject(row.original)}
          onDelete={() => setProjectToDelete(row.original)}
          onDuplicate={() => handleDuplicateProject(row.original)}
          onToggleStatus={async () => {
            try {
              const updatedProject = {
                ...row.original,
                featured: !row.original.featured,
                updatedAt: Date.now(),
              };
              
              if (db) {
                await updateDoc(doc(db, PROJECTS_COLLECTION, row.original.id), updatedProject);
                toast({
                  title: "Project updated",
                  description: `${row.original.title} featured status has been updated.`,
                });
              }
            } catch (error) {
              console.error("Error updating project:", error);
              toast({
                title: "Failed to update project",
                description: "Please try again.",
                variant: "destructive",
              });
            }
          }}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <DataExportManager />
      
      <Card className="border-0 shadow-medium bg-card text-card-foreground">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold">Projects Management</CardTitle>
              <CardDescription>
                Manage your portfolio projects
              </CardDescription>
            </div>
            <Button 
              onClick={() => window.dispatchEvent(new CustomEvent('create-project'))}
              className="shadow-glow"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={projects}
            loading={loading}
            searchPlaceholder="Search projects..."
            filterFields={[
              {
                key: "category",
                title: "Category",
                options: categoryOptions,
              },
              {
                key: "status",
                title: "Status",
                options: statusOptions,
              },
            ]}
            onRefresh={() => window.location.reload()}
            onDelete={(items) => {
              setProjectsToDelete(items as Project[]);
              setBulkDeleteOpen(true);
            }}
            onAdd={() => window.dispatchEvent(new CustomEvent('create-project'))}
            emptyStateMessage="No projects found"
            emptyStateDescription="Get started by adding a new project"
          />
        </CardContent>
      </Card>

      {/* Project Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-background text-foreground">
          {selectedProject && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <DialogTitle className="text-2xl">{selectedProject.title}</DialogTitle>
                    <DialogDescription>
                      {selectedProject.category} • {selectedProject.status.replace(/-/g, ' ')}
                    </DialogDescription>
                  </div>
                  {selectedProject.logo && (
                    <img 
                      src={selectedProject.logo} 
                      alt={selectedProject.title} 
                      className="w-16 h-16 object-contain rounded-lg border"
                    />
                  )}
                </div>
              </DialogHeader>
              
              <div className="space-y-6">
                {selectedProject.featured && (
                  <Badge className="w-fit bg-yellow-500 hover:bg-yellow-600 text-yellow-foreground">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    Featured Project
                  </Badge>
                )}
                
                {selectedProject.description && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground">{selectedProject.description}</p>
                  </div>
                )}
                
                {selectedProject.technologies && selectedProject.technologies.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Technologies</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.technologies.map((tech, index) => (
                        <Badge key={index} variant="secondary" className="bg-secondary text-secondary-foreground">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Timeline</h3>
                    <div className="space-y-2 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Started: {format(new Date(selectedProject.startDate), 'MMMM yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>
                          Ended: {selectedProject.endDate ? format(new Date(selectedProject.endDate), 'MMMM yyyy') : 'Present'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Links</h3>
                    <div className="space-y-2">
                      {selectedProject.githubUrl && (
                        <Button variant="outline" size="sm" asChild className="w-full justify-start bg-background text-foreground border-input hover:bg-accent hover:text-accent-foreground">
                          <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer">
                            <Github className="h-4 w-4 mr-2" />
                            GitHub Repository
                          </a>
                        </Button>
                      )}
                      {selectedProject.liveUrl && (
                        <Button variant="outline" size="sm" asChild className="w-full justify-start bg-background text-foreground border-input hover:bg-accent hover:text-accent-foreground">
                          <a href={selectedProject.liveUrl} target="_blank" rel="noopener noreferrer">
                            <Globe className="h-4 w-4 mr-2" />
                            Live Demo
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                
                {selectedProject.image && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Project Image</h3>
                    <img 
                      src={selectedProject.image} 
                      alt={selectedProject.title} 
                      className="w-full rounded-lg border object-cover max-h-96"
                    />
                  </div>
                )}
              </div>
              
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDetailsOpen(false)}
                  className="bg-background text-foreground border-input hover:bg-accent hover:text-accent-foreground"
                >
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!projectToDelete} onOpenChange={() => setProjectToDelete(null)}>
        <AlertDialogContent className="bg-background text-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the project <strong>{projectToDelete?.title}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => setProjectToDelete(null)}
              className="bg-background text-foreground border-input hover:bg-accent hover:text-accent-foreground"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProject}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
        <AlertDialogContent className="bg-background text-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Multiple Projects</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{projectsToDelete.length}</strong> projects.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => setBulkDeleteOpen(false)}
              className="bg-background text-foreground border-input hover:bg-accent hover:text-accent-foreground"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
