import React, { useState, useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import type { ColumnDef } from "@tanstack/react-table";

// Project utilities and hooks
import { useProjects, type Project, type ProjectInput, PROJECTS_COLLECTION } from "@/hooks/useProjects";
import { ProjectSchema, validateProjectUpdate } from "@/lib/validation-schemas";
import { handleError } from "@/lib/error-handling-enhanced";
import { useCRUDLoading } from "@/lib/loading-feedback-system";

// Firebase
import { addDoc, collection, doc, updateDoc, deleteDoc, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";

// Enhanced Data Table
import { EnhancedDataTable, type TableAction } from "@/components/ui/enhanced-data-table";

// Icons
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  StarOff,
  Copy,
  Archive,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Globe,
  Github,
  Calendar,
  Users,
  Target,
  Tag,
  Building2,
  Briefcase,
  Code,
  Layers,
  TrendingUp,
  Zap,
  Save,
  X,
} from "lucide-react";

// Form Schema - Use a simpler approach
const projectFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  longDescription: z.string().optional(),
  category: z.enum(["Web Application", "Mobile Application", "Enterprise Integration", "E-commerce", "Machine Learning", "API Development", "DevOps & Infrastructure", "Desktop Application", "Game Development", "Blockchain", "IoT", "Other"]),
  status: z.enum(["completed", "in-progress", "maintenance", "archived", "planned"]).default("completed"),
  achievements: z.array(z.string()).default([]),
  technologies: z.array(z.string()).min(1, "At least one technology is required"),
  tags: z.array(z.string()).default([]),
  image: z.string().optional(),
  logo: z.string().optional(),
  icon: z.string().optional(),
  liveUrl: z.string().optional(),
  githubUrl: z.string().optional(),
  demoUrl: z.string().optional(),
  caseStudyUrl: z.string().optional(),
  featured: z.boolean().default(false),
  disabled: z.boolean().default(false),
  priority: z.number().min(1).max(100).default(50),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  duration: z.string().optional(),
  teamSize: z.number().min(1).default(1),
  role: z.string().min(1, "Role is required"),
  clientInfo: z.object({
    name: z.string().optional(),
    industry: z.string().optional(),
    size: z.enum(["startup", "small", "medium", "large", "enterprise"]).optional(),
    location: z.string().optional(),
    website: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    isPublic: z.boolean().default(false),
    contactPerson: z.string().optional(),
    projectBudget: z.string().optional(),
    testimonial: z.string().optional(),
  }).optional(),
  metrics: z.object({
    usersReached: z.number().optional(),
    performanceImprovement: z.string().optional(),
    revenueImpact: z.string().optional(),
    uptime: z.string().optional(),
    loadTime: z.string().optional(),
    codeReduction: z.string().optional(),
    securityImprovements: z.array(z.string()).default([]),
    customMetrics: z.record(z.union([z.string(), z.number()])).default({}),
  }).optional(),
  challenges: z.array(z.string()).default([]),
  solutions: z.array(z.string()).default([]),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

// Project categories
const PROJECT_CATEGORIES = [
  "Web Application",
  "Mobile Application", 
  "Enterprise Integration",
  "E-commerce",
  "Machine Learning",
  "API Development",
  "DevOps & Infrastructure",
  "Desktop Application",
  "Game Development",
  "Blockchain",
  "IoT",
  "Other"
] as const;

const PROJECT_STATUSES = [
  "completed",
  "in-progress", 
  "maintenance",
  "archived",
  "planned"
] as const;

// Status badge colors
const getStatusColor = (status: string) => {
  switch (status) {
    case "completed": return "bg-green-100 text-green-800";
    case "in-progress": return "bg-blue-100 text-blue-800";
    case "maintenance": return "bg-yellow-100 text-yellow-800";
    case "archived": return "bg-gray-100 text-gray-800";
    case "planned": return "bg-purple-100 text-purple-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

// Enhanced Projects Manager
export function EnhancedProjectsManager() {
  const { projects, loading, addProject, updateProject, deleteProject } = useProjects();
  // Simple mock for useCRUDLoading until the loading system is fully fixed
  const mockCRUDLoading = {
    withLoading: async <T>(
      operation: string,
      message: string,
      asyncFn: (operationId: string) => Promise<T>
    ): Promise<T> => {
      try {
        return await asyncFn('mock-operation-id');
      } catch (error) {
        throw error;
      }
    },
    getActiveOperations: () => []
  };
  
  const { withLoading, getActiveOperations } = mockCRUDLoading;

  // Component state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [projectsToDelete, setProjectsToDelete] = useState<Project[]>([]);
  const [bulkProgress, setBulkProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 });

  // Form
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
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
        email: "",
        phone: "",
        isPublic: false,
        contactPerson: "",
        projectBudget: "",
        testimonial: "",
      },
      metrics: {
        usersReached: 0,
        performanceImprovement: "",
        revenueImpact: "",
        uptime: "",
        loadTime: "",
        codeReduction: "",
        securityImprovements: [],
        customMetrics: {},
      },
      challenges: [],
      solutions: [],
    },
  });

  // Table columns
  const columns: ColumnDef<Project>[] = useMemo(() => [
    {
      accessorKey: "title",
      header: "Project",
      cell: ({ row }) => {
        const project = row.original;
        return (
          <div className="flex items-center space-x-3">
            {project.logo && (
              <img src={project.logo} alt="" className="w-8 h-8 rounded" />
            )}
            <div>
              <div className="font-medium flex items-center gap-2">
                {project.title}
                {project.featured && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
              </div>
              <div className="text-sm text-muted-foreground">{project.category}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge className={getStatusColor(status)}>
            {status.replace("-", " ")}
          </Badge>
        );
      },
    },
    {
      accessorKey: "technologies",
      header: "Technologies",
      cell: ({ row }) => {
        const technologies = row.getValue("technologies") as string[];
        const displayTech = technologies.slice(0, 3);
        const remaining = technologies.length - 3;
        
        return (
          <div className="flex flex-wrap gap-1">
            {displayTech.map((tech) => (
              <Badge key={tech} variant="outline" className="text-xs">
                {tech}
              </Badge>
            ))}
            {remaining > 0 && (
              <Badge variant="outline" className="text-xs">
                +{remaining} more
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => {
        const priority = row.getValue("priority") as number;
        return (
          <div className="flex items-center space-x-2">
            <div className="w-12 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${priority}%` }}
              ></div>
            </div>
            <span className="text-sm text-muted-foreground">{priority}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "updatedAt",
      header: "Last Updated",
      cell: ({ row }) => {
        const date = row.getValue("updatedAt") as number;
        return (
          <div className="text-sm text-muted-foreground">
            {format(new Date(date), "MMM dd, yyyy")}
          </div>
        );
      },
    },
    {
      accessorKey: "disabled",
      header: "Visibility",
      cell: ({ row }) => {
        const disabled = row.getValue("disabled") as boolean;
        return disabled ? (
          <EyeOff className="w-4 h-4 text-gray-400" />
        ) : (
          <Eye className="w-4 h-4 text-green-500" />
        );
      },
    },
  ], []);

  // Table actions
  const tableActions: TableAction[] = [
    {
      id: "toggle-featured",
      label: "Toggle Featured",
      icon: <Star className="w-4 h-4" />,
      onClick: handleBulkToggleFeatured,
      variant: "outline",
    },
    {
      id: "toggle-visibility",
      label: "Toggle Visibility",
      icon: <Eye className="w-4 h-4" />,
      onClick: handleBulkToggleVisibility,
      variant: "outline",
    },
    {
      id: "archive",
      label: "Archive",
      icon: <Archive className="w-4 h-4" />,
      onClick: handleBulkArchive,
      variant: "outline",
    },
    {
      id: "delete",
      label: "Delete",
      icon: <Trash2 className="w-4 h-4" />,
      onClick: handleBulkDelete,
      variant: "destructive",
    },
  ];

  // Form handlers
  const handleCreateProject = useCallback(() => {
    form.reset();
    setEditingProject(null);
    setIsFormOpen(true);
  }, [form]);

  const handleEditProject = useCallback((project: Project) => {
    // Populate form with project data
    form.reset({
      ...project,
      // Ensure arrays are properly handled
      achievements: project.achievements || [],
      technologies: project.technologies || [],
      tags: project.tags || [],
      challenges: project.challenges || [],
      solutions: project.solutions || [],
    });
    setEditingProject(project);
    setIsFormOpen(true);
  }, [form]);

  const onSubmit = useCallback(async (values: ProjectFormValues) => {
    try {
      await withLoading(
        editingProject ? 'update' : 'create',
        editingProject ? 'Updating project...' : 'Creating project...',
        async (operationId) => {
          const projectData: ProjectInput = {
            ...values,
            createdAt: editingProject ? editingProject.createdAt : Date.now(),
            updatedAt: Date.now(),
            version: (editingProject?.version || 0) + 1,
          };

          // Simple validation - just use the Zod schema directly
          try {
            const validatedData = ProjectSchema.parse(projectData);
            
            if (editingProject) {
              await updateProject(editingProject.id, validatedData);
            } else {
              await addProject(validatedData);
            }
          } catch (validationError) {
            if (validationError instanceof z.ZodError) {
              throw new Error(`Validation failed: ${validationError.errors.map(e => e.message).join(', ')}`);
            }
            throw validationError;
          }
        }
      );

      setIsFormOpen(false);
      form.reset();
      setEditingProject(null);
    } catch (error) {
      handleError(error, 'Project form submission');
    }
  }, [editingProject, withLoading, form, addProject, updateProject]);

  // Delete handlers
  const handleDeleteProject = useCallback((project: Project) => {
    setProjectToDelete(project);
  }, []);

  const confirmDeleteProject = useCallback(async () => {
    if (!projectToDelete) return;

    try {
      await withLoading(
        'delete',
        'Deleting project...',
        async () => {
          await deleteProject(projectToDelete.id);
        }
      );
      setProjectToDelete(null);
    } catch (error) {
      handleError(error, 'Project deletion');
    }
  }, [projectToDelete, withLoading, deleteProject]);

  // Bulk operation handlers
  async function handleBulkToggleFeatured(selectedProjects: Project[]) {
    try {
      await withLoading(
        'update',
        `Updating ${selectedProjects.length} projects...`,
        async (operationId) => {
          await processBulkOperation(
            selectedProjects,
            (project) => updateProject(project.id, { featured: !project.featured }),
            operationId
          );
        }
      );
    } catch (error) {
      handleError(error, 'Bulk toggle featured');
    }
  }

  async function handleBulkToggleVisibility(selectedProjects: Project[]) {
    try {
      await withLoading(
        'update',
        `Updating visibility for ${selectedProjects.length} projects...`,
        async (operationId) => {
          await processBulkOperation(
            selectedProjects,
            (project) => updateProject(project.id, { disabled: !project.disabled }),
            operationId
          );
        }
      );
    } catch (error) {
      handleError(error, 'Bulk toggle visibility');
    }
  }

  async function handleBulkArchive(selectedProjects: Project[]) {
    try {
      await withLoading(
        'update',
        `Archiving ${selectedProjects.length} projects...`,
        async (operationId) => {
          await processBulkOperation(
            selectedProjects,
            (project) => updateProject(project.id, { status: 'archived' as const }),
            operationId
          );
        }
      );
    } catch (error) {
      handleError(error, 'Bulk archive');
    }
  }

  function handleBulkDelete(selectedProjects: Project[]) {
    setProjectsToDelete(selectedProjects);
    setBulkDeleteOpen(true);
  }

  const confirmBulkDelete = useCallback(async () => {
    try {
      await withLoading(
        'delete',
        `Deleting ${projectsToDelete.length} projects...`,
        async (operationId) => {
          await processBulkOperation(
            projectsToDelete,
            (project) => deleteProject(project.id),
            operationId
          );
        }
      );
      
      setBulkDeleteOpen(false);
      setProjectsToDelete([]);
    } catch (error) {
      handleError(error, 'Bulk delete');
    }
  }, [projectsToDelete, withLoading, deleteProject]);

  // Bulk operation processor with progress tracking
  const processBulkOperation = async (
    items: Project[],
    operation: (item: Project) => Promise<void>,
    operationId: string
  ) => {
    const total = items.length;
    let completed = 0;
    const errors: string[] = [];

    for (const item of items) {
      try {
        await operation(item);
        completed++;
        
        // Update progress
        setBulkProgress({ current: completed, total });
        
        // Optional: Update operation progress if the loading system supports it
        // updateOperation(operationId, { 
        //   progress: { 
        //     current: completed, 
        //     total, 
        //     percentage: Math.round((completed / total) * 100),
        //     message: `Processing ${item.title}...`
        //   }
        // });
      } catch (error) {
        errors.push(`Failed to process ${item.title}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    setBulkProgress({ current: 0, total: 0 });

    if (errors.length > 0) {
      throw new Error(`${errors.length} operations failed: ${errors.join(', ')}`);
    }
  };

  // Refresh handler
  const handleRefresh = useCallback(() => {
    // The useProjects hook should handle refetching
    window.location.reload();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Projects Manager</h2>
          <p className="text-muted-foreground">
            Manage your portfolio projects with advanced CRUD operations
          </p>
        </div>
        <Button onClick={handleCreateProject}>
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      {/* Enhanced Data Table */}
      <EnhancedDataTable
        data={projects}
        columns={columns}
        loading={loading}
        title="Projects"
        description={`${projects.length} projects total`}
        enableSearch={true}
        enableSelection={true}
        enablePagination={true}
        actions={tableActions}
        onRefresh={handleRefresh}
        onRowClick={handleEditProject}
      />

      {/* Project Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProject ? 'Edit Project' : 'Create Project'}
            </DialogTitle>
            <DialogDescription>
              {editingProject 
                ? 'Update project details and configuration'
                : 'Add a new project to your portfolio'
              }
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Title *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter project title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {PROJECT_CATEGORIES.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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
                        <FormLabel>Description *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Brief project description"
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          A concise description of the project (10-500 characters)
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
                        <FormLabel>Detailed Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Detailed project description"
                            className="min-h-[150px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Comprehensive project description for case studies
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {PROJECT_STATUSES.map((status) => (
                                <SelectItem key={status} value={status}>
                                  {status.replace('-', ' ')}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priority (1-100)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="1" 
                              max="100" 
                              placeholder="50"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 50)}
                            />
                          </FormControl>
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
                              placeholder="1"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex items-center space-x-6">
                    <FormField
                      control={form.control}
                      name="featured"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Featured Project</FormLabel>
                            <FormDescription>
                              Highlight this project in your portfolio
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="disabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Hidden</FormLabel>
                            <FormDescription>
                              Hide this project from public view
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Dialog Footer */}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      {editingProject ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {editingProject ? 'Update Project' : 'Create Project'}
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!projectToDelete} onOpenChange={() => setProjectToDelete(null)}>
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
              onClick={confirmDeleteProject}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Multiple Projects</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {projectsToDelete.length} projects? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          {bulkProgress.total > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{bulkProgress.current} / {bulkProgress.total}</span>
              </div>
              <Progress value={(bulkProgress.current / bulkProgress.total) * 100} />
            </div>
          )}
          
          <AlertDialogFooter>
            <AlertDialogCancel disabled={bulkProgress.total > 0}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBulkDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={bulkProgress.total > 0}
            >
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default EnhancedProjectsManager;