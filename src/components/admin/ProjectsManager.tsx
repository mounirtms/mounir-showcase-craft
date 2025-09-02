import React, { useState, useMemo, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import { useProjects, PROJECTS_COLLECTION, type Project, type ProjectInput } from "@/hooks/useProjects";
import { addDoc, collection, doc, updateDoc, deleteDoc, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { createActionColumnDef } from "@/components/admin/ActionColumn";
import { StatusBadge } from "@/components/ui/StatusBadge";
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
  Link,
  Users,
  Target,
  TrendingUp,
  Code,
  Server,
  Palette,
  Layers,
  Building2,
  Briefcase,
  MapPin,
  Phone,
  Mail,
  FileText as FileTextIcon,
  Check,
  X,
  AlertTriangle,
  Zap,
  Shield,
  Sparkles,
  Crown,
  Cpu,
  LineChart,
  Copy
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ProjectSchema } from "@/lib/schema/projectSchema";

export function ProjectsManager() {
  const { projects, loading, refetch } = useProjects();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [projectsToDelete, setProjectsToDelete] = useState<Project[]>([]);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imagePath, setImagePath] = useState<string>("");
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [logoPath, setLogoPath] = useState<string>("");

  // Form setup
  const form = useForm<ProjectInput>({
    resolver: zodResolver(ProjectSchema),
    defaultValues: {
      title: "",
      description: "",
      longDescription: "",
      category: "Web Application",
      status: "completed",
      achievements: [],
      technologies: [],
      tags: [],
      image: "",
      logo: "",
      icon: "",
      liveUrl: "",
      githubUrl: "",
      demoUrl: "",
      caseStudyUrl: "",
      featured: false,
      disabled: false,
      priority: 50,
      startDate: "",
      endDate: "",
      duration: "",
      teamSize: 1,
      role: "Full-Stack Developer",
      clientInfo: {
        name: "",
        industry: "",
        size: "medium",
        location: "",
        website: "",
        isPublic: false,
      },
      metrics: {
        usersReached: 0,
        performanceImprovement: "",
        revenueImpact: "",
        uptime: "",
        customMetrics: {},
      },
      challenges: [],
      solutions: [],
    },
  });

  // Handle form submission with better validation and error handling
  const onSubmit = async (values: ProjectInput) => {
    try {
      // Show loading state
      const loadingToast = toast({
        title: projectToEdit ? "Updating project..." : "Creating project...",
        description: "Please wait while we save your project.",
      });

      if (!db) {
        toast({
          title: "Database Error",
          description: "Firebase connection is not available.",
          variant: "destructive",
        });
        return;
      }

      if (projectToEdit) {
        // Check if this is a local project (can't be updated in Firebase)
        if (projectToEdit.id.startsWith('local-') || projectToEdit.id.startsWith('fallback-')) {
          toast({
            title: "Cannot Edit Local Project",
            description: "This is a local/demo project. Please create a new project instead.",
            variant: "destructive",
          });
          return;
        }
        
        // Update existing project
        await updateDoc(doc(db, PROJECTS_COLLECTION, projectToEdit.id), {
          ...values,
          image: imageUrl || values.image,
          logo: logoUrl || values.logo,
          updatedAt: Date.now(),
          version: (projectToEdit.version || 1) + 1,
        } as Partial<Project>);
        
        toast({
          title: "Project updated successfully",
          description: `"${values.title}" has been updated and synced to Firebase.`,
        });
      } else {
        // Add new project
        const newProject = {
          ...values,
          image: imageUrl || values.image,
          logo: logoUrl || values.logo,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          version: 1,
        } as ProjectInput;
        
        const docRef = await addDoc(collection(db, PROJECTS_COLLECTION), newProject);
        
        toast({
          title: "Project created successfully",
          description: `"${values.title}" has been added to your portfolio and synced to Firebase.`,
        });
      }
      
      setIsFormOpen(false);
      resetForm();
      setImageUrl("");
      setImagePath("");
      setLogoUrl("");
      setLogoPath("");
      refetch();
    } catch (error) {
      console.error("Error saving project:", error);
      let errorMessage = "Unknown error occurred";
      
      if (error instanceof Error) {
        errorMessage = error.message;
        if (errorMessage.includes('permission')) {
          errorMessage = "You don't have permission to modify projects. Please check your access rights.";
        } else if (errorMessage.includes('network')) {
          errorMessage = "Network error. Please check your internet connection and try again.";
        }
      }
      
      toast({
        title: "Failed to save project",
        description: `Error: ${errorMessage}. Please try again or contact support if the issue persists.`,
        variant: "destructive",
      });
    }
  };

  // Reset form
  const resetForm = useCallback(() => {
    form.reset({
      title: "",
      description: "",
      longDescription: "",
      category: "Web Application",
      status: "completed",
      achievements: [],
      technologies: [],
      tags: [],
      image: "",
      logo: "",
      icon: "",
      liveUrl: "",
      githubUrl: "",
      demoUrl: "",
      caseStudyUrl: "",
      featured: false,
      disabled: false,
      priority: 50,
      startDate: "",
      endDate: "",
      duration: "",
      teamSize: 1,
      role: "Full-Stack Developer",
      clientInfo: {
        name: "",
        industry: "",
        size: "medium",
        location: "",
        website: "",
        isPublic: false,
      },
      metrics: {
        usersReached: 0,
        performanceImprovement: "",
        revenueImpact: "",
        uptime: "",
        customMetrics: {},
      },
      challenges: [],
      solutions: [],
    });
  }, [form]);

  // Handle edit project
  const handleEditProject = useCallback((project: Project) => {
    setProjectToEdit(project);
    form.reset({
      title: project.title,
      description: project.description || "",
      longDescription: project.longDescription || "",
      category: project.category,
      status: project.status,
      achievements: project.achievements || [],
      technologies: project.technologies || [],
      tags: project.tags || [],
      image: project.image || "",
      logo: project.logo || "",
      icon: project.icon || "",
      liveUrl: project.liveUrl || "",
      githubUrl: project.githubUrl || "",
      demoUrl: project.demoUrl || "",
      caseStudyUrl: project.caseStudyUrl || "",
      featured: project.featured,
      disabled: project.disabled,
      priority: project.priority,
      startDate: project.startDate || "",
      endDate: project.endDate || "",
      duration: project.duration || "",
      teamSize: project.teamSize || 1,
      role: project.role || "Full-Stack Developer",
      clientInfo: {
        name: project.clientInfo?.name || "",
        industry: project.clientInfo?.industry || "",
        size: project.clientInfo?.size || "medium",
        location: project.clientInfo?.location || "",
        website: project.clientInfo?.website || "",
        isPublic: project.clientInfo?.isPublic || false,
      },
      metrics: {
        usersReached: project.metrics?.usersReached || 0,
        performanceImprovement: project.metrics?.performanceImprovement || "",
        revenueImpact: project.metrics?.revenueImpact || "",
        uptime: project.metrics?.uptime || "",
        customMetrics: project.metrics?.customMetrics ? Object.fromEntries(
          Object.entries(project.metrics.customMetrics).map(([key, value]) => [key, String(value)])
        ) : {},
      },
      challenges: project.challenges || [],
      solutions: project.solutions || [],
    });
    setImageUrl(project.image || "");
    setLogoUrl(project.logo || "");
    setIsFormOpen(true);
  }, [form]);

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
      refetch();
    } catch (error) {
      console.error("Error duplicating project:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      toast({
        title: "Failed to duplicate project",
        description: `Error: ${errorMessage}. Please try again or contact support if the issue persists.`,
        variant: "destructive",
      });
    }
  }, [refetch]);

  // Handle delete project with enhanced validation and error handling
  const handleDeleteProject = useCallback(async () => {
    if (!db || !projectToDelete) return;

    // Check if this is a local project (can't be deleted from Firebase)
    if (projectToDelete.id.startsWith('local-') || projectToDelete.id.startsWith('fallback-')) {
      toast({
        title: "Cannot Delete Local Project",
        description: "This is a local/demo project and cannot be deleted from Firebase. It will only be hidden in local mode.",
        variant: "destructive",
      });
      setProjectToDelete(null);
      return;
    }

    try {
      const loadingToast = toast({
        title: "Deleting project...",
        description: "Please wait while we remove the project from your portfolio.",
      });
      
      await deleteDoc(doc(db, PROJECTS_COLLECTION, projectToDelete.id));
      setProjectToDelete(null);
      
      toast({
        title: "Project deleted successfully",
        description: `"${projectToDelete.title}" has been permanently removed from your portfolio and synced to Firebase.`,
      });
      refetch();
    } catch (error) {
      console.error("Error deleting project:", error);
      let errorMessage = "Failed to delete project. Please try again.";
      
      if (error instanceof Error) {
        if (error.message.includes('permission')) {
          errorMessage = "You don't have permission to delete this project. Please check your access rights.";
        } else if (error.message.includes('network')) {
          errorMessage = "Network error. Please check your internet connection and try again.";
        } else if (error.message.includes('not-found')) {
          errorMessage = "Project not found. It may have already been deleted.";
        }
      }
      
      toast({
        title: "Failed to delete project",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [projectToDelete, refetch]);

  const handleBulkDelete = useCallback(async (projectsToDelete: Project[]) => {
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
      
      if (!db) {
        toast({
          title: "Database Error",
          description: "Firebase connection is not available.",
          variant: "destructive",
        });
        return;
      }
      
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
      refetch();
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
  }, [refetch]);

  // Data for filter dropdowns
  const categoryOptions = useMemo(() => {
    const categories = [...new Set(projects.map(p => p.category))];
    return categories.map(cat => ({ label: cat, value: cat }));
  }, [projects]);

  const statusOptions = useMemo(() => {
    const statuses = [...new Set(projects.map(p => p.status))];
    return statuses.map(status => ({ label: status.replace(/-/g, ' '), value: status }));
  }, [projects]);

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
      cell: ({ row }) => {
        const date = row.getValue("startDate");
        if (!date || typeof date !== 'string') return null;
        try {
          return <div>{format(new Date(date), 'MMM yyyy')}</div>
        } catch (e) {
          return <div>Invalid Date</div>
        }
      },
    },
    {
      accessorKey: "endDate",
      header: "End Date",
      cell: ({ row }) => {
        const endDate = row.getValue("endDate");
        if (!endDate || typeof endDate !== 'string') return <div>Present</div>;
        try {
          return <div>{format(new Date(endDate), 'MMM yyyy')}</div>
        } catch (e) {
          return <div>Invalid Date</div>
        }
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
    createActionColumnDef({
      onEdit: handleEditProject,
      onDelete: (item) => setProjectToDelete(item),
    }),
  ];

  return (
    <div className="space-y-6">
      <DataExportManager />
      
      <Card className="border-0 shadow-medium bg-card text-card-foreground">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold font-heading">Projects Management</CardTitle>
              <CardDescription className="font-sans leading-relaxed">
                Manage your portfolio projects
              </CardDescription>
            </div>
            <Button onClick={() => setIsFormOpen(true)} className="shadow-glow">
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <AdminDataTable
            title="Projects"
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
            onRefresh={refetch}
            onDelete={handleBulkDelete}
            onAdd={() => setIsFormOpen(true)}
          />
        </CardContent>
      </Card>

      {/* Project Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background text-foreground">
          <DialogHeader>
            <DialogTitle>{projectToEdit ? "Edit Project" : "Add Project"}</DialogTitle>
            <DialogDescription>
              {projectToEdit 
                ? "Update the project details below" 
                : "Fill in the details for your new project"}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Project title" 
                          {...field} 
                          className="bg-background text-foreground border-input"
                        />
                      </FormControl>
                      <FormDescription>
                        The name of your project
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-background text-foreground border-input">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-popover text-popover-foreground border-border">
                          <SelectItem value="Web Application">Web Application</SelectItem>
                          <SelectItem value="Mobile App">Mobile App</SelectItem>
                          <SelectItem value="Data Pipeline">Data Pipeline</SelectItem>
                          <SelectItem value="API Service">API Service</SelectItem>
                          <SelectItem value="Machine Learning">Machine Learning</SelectItem>
                          <SelectItem value="Cloud Infrastructure">Cloud Infrastructure</SelectItem>
                          <SelectItem value="DevOps Tool">DevOps Tool</SelectItem>
                          <SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The category this project belongs to
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-background text-foreground border-input">
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-popover text-popover-foreground border-border">
                          <SelectItem value="planning">Planning</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="on-hold">On Hold</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Current status of the project
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Your role in the project" 
                          {...field} 
                          className="bg-background text-foreground border-input"
                        />
                      </FormControl>
                      <FormDescription>
                        Your role or position in this project
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          {...field} 
                          className="bg-background text-foreground border-input"
                        />
                      </FormControl>
                      <FormDescription>
                        When did you start working on this project?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          {...field} 
                          className="bg-background text-foreground border-input"
                        />
                      </FormControl>
                      <FormDescription>
                        When did you finish this project? (Leave blank if ongoing)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1" 
                          max="100" 
                          {...field} 
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          className="bg-background text-foreground border-input"
                        />
                      </FormControl>
                      <FormDescription>
                        Display priority (1-100, higher means more prominent)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="teamSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team Size</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1" 
                          {...field} 
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          className="bg-background text-foreground border-input"
                        />
                      </FormControl>
                      <FormDescription>
                        Number of people working on this project
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description of the project..."
                        className="min-h-[100px] bg-background text-foreground border-input"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A short summary of what the project is about
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="longDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Long Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Detailed description of the project..."
                        className="min-h-[150px] bg-background text-foreground border-input"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A comprehensive description of the project, including goals, scope, and outcomes
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="technologies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Technologies</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="React, Node.js, Firebase..." 
                          {...field} 
                          value={field.value?.join(", ") || ""}
                          onChange={(e) => field.onChange(e.target.value.split(",").map(t => t.trim()).filter(t => t))}
                          className="bg-background text-foreground border-input"
                        />
                      </FormControl>
                      <FormDescription>
                        Technologies used in this project (comma separated)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="web, backend, frontend..." 
                          {...field} 
                          value={field.value?.join(", ") || ""}
                          onChange={(e) => field.onChange(e.target.value.split(",").map(t => t.trim()).filter(t => t))}
                          className="bg-background text-foreground border-input"
                        />
                      </FormControl>
                      <FormDescription>
                        Tags to categorize this project (comma separated)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="liveUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Live URL</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://project-demo.com" 
                          {...field} 
                          className="bg-background text-foreground border-input"
                        />
                      </FormControl>
                      <FormDescription>
                        URL to the live project
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="githubUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GitHub URL</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://github.com/user/project" 
                          {...field} 
                          className="bg-background text-foreground border-input"
                        />
                      </FormControl>
                      <FormDescription>
                        URL to the GitHub repository
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="demoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Demo URL</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://demo.project.com" 
                          {...field} 
                          className="bg-background text-foreground border-input"
                        />
                      </FormControl>
                      <FormDescription>
                        URL to the project demo
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="caseStudyUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Case Study URL</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://casestudy.project.com" 
                          {...field} 
                          className="bg-background text-foreground border-input"
                        />
                      </FormControl>
                      <FormDescription>
                        URL to the project case study
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Achievements */}
              <FormField
                control={form.control}
                name="achievements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Achievements</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="List key achievements (one per line)..."
                        className="min-h-[100px] bg-background text-foreground border-input"
                        value={field.value?.join("\n") || ""}
                        onChange={(e) => field.onChange(e.target.value.split("\n").map(a => a.trim()).filter(a => a))}
                      />
                    </FormControl>
                    <FormDescription>
                      Key accomplishments and results from this project (one per line)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Challenges and Solutions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="challenges"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Challenges</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="List main challenges faced (one per line)..."
                          className="min-h-[100px] bg-background text-foreground border-input"
                          value={field.value?.join("\n") || ""}
                          onChange={(e) => field.onChange(e.target.value.split("\n").map(c => c.trim()).filter(c => c))}
                        />
                      </FormControl>
                      <FormDescription>
                        Key challenges encountered during the project
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="solutions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Solutions</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="List solutions implemented (one per line)..."
                          className="min-h-[100px] bg-background text-foreground border-input"
                          value={field.value?.join("\n") || ""}
                          onChange={(e) => field.onChange(e.target.value.split("\n").map(s => s.trim()).filter(s => s))}
                        />
                      </FormControl>
                      <FormDescription>
                        How challenges were addressed and solved
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Client Information Section */}
              <div className="space-y-4 border rounded-lg p-4 bg-muted/20">
                <h3 className="text-lg font-semibold">Client Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="clientInfo.name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Client or company name" 
                            {...field} 
                            className="bg-background text-foreground border-input"
                          />
                        </FormControl>
                        <FormDescription>
                          Name of the client or organization
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="clientInfo.industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Industry</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Technology, Healthcare, Finance..." 
                            {...field} 
                            className="bg-background text-foreground border-input"
                          />
                        </FormControl>
                        <FormDescription>
                          Industry or sector of the client
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="clientInfo.size"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Size</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-background text-foreground border-input">
                              <SelectValue placeholder="Select company size" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-popover text-popover-foreground border-border">
                            <SelectItem value="startup">Startup (1-10 employees)</SelectItem>
                            <SelectItem value="small">Small (11-50 employees)</SelectItem>
                            <SelectItem value="medium">Medium (51-250 employees)</SelectItem>
                            <SelectItem value="large">Large (251-1000 employees)</SelectItem>
                            <SelectItem value="enterprise">Enterprise (1000+ employees)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Size of the client organization
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="clientInfo.location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="City, Country" 
                            {...field} 
                            className="bg-background text-foreground border-input"
                          />
                        </FormControl>
                        <FormDescription>
                          Geographic location of the client
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="clientInfo.website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client Website</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://client.com" 
                            {...field} 
                            className="bg-background text-foreground border-input"
                          />
                        </FormControl>
                        <FormDescription>
                          Client's official website
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="clientInfo.isPublic"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center gap-2 space-y-0">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-input"
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Public Client
                        </FormLabel>
                        <FormDescription>
                          Can the client information be displayed publicly?
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              {/* Project Metrics Section */}
              <div className="space-y-4 border rounded-lg p-4 bg-muted/20">
                <h3 className="text-lg font-semibold">Project Metrics & Impact</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="metrics.usersReached"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Users Reached</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            placeholder="10000" 
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                            className="bg-background text-foreground border-input"
                          />
                        </FormControl>
                        <FormDescription>
                          Number of users who benefited from this project
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="metrics.performanceImprovement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Performance Improvement</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="50% faster loading times" 
                            {...field} 
                            className="bg-background text-foreground border-input"
                          />
                        </FormControl>
                        <FormDescription>
                          Measurable performance improvements achieved
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="metrics.revenueImpact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Revenue Impact</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="$100K+ annual savings" 
                            {...field} 
                            className="bg-background text-foreground border-input"
                          />
                        </FormControl>
                        <FormDescription>
                          Financial impact or revenue generated
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="metrics.uptime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>System Uptime</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="99.9%" 
                            {...field} 
                            className="bg-background text-foreground border-input"
                          />
                        </FormControl>
                        <FormDescription>
                          System availability and reliability metrics
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div>
                  <FormLabel>Project Image</FormLabel>
                  <ImageUpload
                    onUploadComplete={(url, path) => {
                      setImageUrl(url);
                      setImagePath(path);
                      form.setValue("image", url);
                    }}
                    currentImageUrl={imageUrl}
                    folder="project-images"
                  />
                </div>
                
                <div>
                  <FormLabel>Project Logo</FormLabel>
                  <ImageUpload
                    onUploadComplete={(url, path) => {
                      setLogoUrl(url);
                      setLogoPath(path);
                      form.setValue("logo", url);
                    }}
                    currentImageUrl={logoUrl}
                    folder="project-logos"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-6 pt-4">
                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center gap-2 space-y-0">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-input"
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Featured Project
                      </FormLabel>
                      <FormDescription>
                        Display this project prominently
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="disabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center gap-2 space-y-0">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-input"
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Disable Project
                      </FormLabel>
                      <FormDescription>
                        Hide this project from display
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter className="gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsFormOpen(false);
                    resetForm();
                    setImageUrl("");
                    setImagePath("");
                    setLogoUrl("");
                    setLogoPath("");
                  }}
                  className="bg-background text-foreground border-input hover:bg-accent hover:text-accent-foreground"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="shadow-glow"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : projectToEdit ? (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Update Project
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Project
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

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
                        <span>Started: {selectedProject.startDate ? format(new Date(selectedProject.startDate), 'MMMM yyyy') : 'N/A'}</span>
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
              onClick={() => handleBulkDelete(projectsToDelete)}
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
