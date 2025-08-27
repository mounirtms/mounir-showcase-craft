import React, { useState, useMemo, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import { useSkills, type Skill } from "@/hooks/useSkills";
import { doc, updateDoc, deleteDoc, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { DataTable, ActionColumn } from "@/components/ui/data-table";
import { validateSkillUpdate } from "@/lib/validation-schemas";
import type { ColumnDef } from "@tanstack/react-table";

import {
  Award,
  Check,
  ChevronDown,
  Edit,
  Eye,
  EyeOff,
  Plus,
  Star,
  Trash2,
  RefreshCw,
  Trash,
  AlertCircle,
  Code,
  Server,
  Palette,
  Layers,
  Cpu,
  Database as DatabaseIcon,
  Globe,
  PencilRuler,
  BarChart,
  FileText,
  LayoutPanelLeft,
  Calendar,
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
import { Progress } from "@/components/ui/progress";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SkillSchema, SkillCategorySchema, type SkillInput } from "@/lib/validation-schemas";

// Map of category to icon
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "Frontend Development": <Code className="h-4 w-4" />,
  "Backend Development": <Server className="h-4 w-4" />,
  "Database": <DatabaseIcon className="h-4 w-4" />,
  "Cloud & DevOps": <Globe className="h-4 w-4" />,
  "Mobile Development": <Layers className="h-4 w-4" />,
  "Machine Learning": <Cpu className="h-4 w-4" />,
  "Design": <Palette className="h-4 w-4" />,
  "Project Management": <BarChart className="h-4 w-4" />,
  "Languages": <FileText className="h-4 w-4" />,
  "Tools": <PencilRuler className="h-4 w-4" />,
  "Other": <LayoutPanelLeft className="h-4 w-4" />,
};

// Schema for the skill form
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  level: z.coerce.number().min(1).max(100),
  yearsOfExperience: z.coerce.number().min(0),
  description: z.string().optional(),
  featured: z.boolean().default(false),
  disabled: z.boolean().default(false),
  priority: z.coerce.number().min(1).max(100).default(50),
  icon: z.string().optional(),
  color: z.string().optional(),
});

export function SkillsManager() {
  const { skills, loading, addSkill, updateSkill, deleteSkill } = useSkills();
  const [skillToDelete, setSkillToDelete] = useState<Skill | null>(null);
  const [skillToEdit, setSkillToEdit] = useState<Skill | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [skillsToDelete, setSkillsToDelete] = useState<Skill[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form setup
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "Frontend Development",
      level: 50,
      yearsOfExperience: 0,
      description: "",
      featured: false,
      disabled: false,
      priority: 50,
      icon: "",
      color: "",
    },
  });

  // Reset form when modal closes
  const resetForm = useCallback(() => {
    form.reset({
      name: "",
      category: "Frontend Development",
      level: 50,
      yearsOfExperience: 0,
      description: "",
      featured: false,
      disabled: false,
      priority: 50,
      icon: "",
      color: "",
    });
    setSkillToEdit(null);
  }, [form]);

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (skillToEdit) {
        // Update existing skill
        await updateSkill(skillToEdit.id, {
          ...values,
          updatedAt: Date.now(),
        });
        toast({
          title: "Skill updated",
          description: `${values.name} has been updated successfully.`,
        });
      } else {
        // Add new skill
        await addSkill({
          ...values,
          certifications: [],
          projects: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
        toast({
          title: "Skill added",
          description: `${values.name} has been added successfully.`,
        });
      }
      setIsFormOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving skill:", error);
      toast({
        title: "Error",
        description: "Failed to save skill. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Open form for editing
  const handleEditSkill = useCallback((skill: Skill) => {
    setSkillToEdit(skill);
    form.reset({
      name: skill.name,
      category: skill.category,
      level: skill.level,
      yearsOfExperience: skill.yearsOfExperience,
      description: skill.description || "",
      featured: skill.featured,
      disabled: skill.disabled,
      priority: skill.priority,
      icon: skill.icon || "",
      color: skill.color || "",
    });
    setIsFormOpen(true);
  }, [form]);

  // Data for filter dropdowns
  const categoryOptions = useMemo(() => {
    const categories = Object.values(SkillCategorySchema.enum);
    return categories.map(cat => ({ label: cat, value: cat }));
  }, []);

  // Table columns definition
  const columns = useMemo<ColumnDef<Skill, unknown>[]>(() => [
    {
      accessorKey: "name",
      header: "Skill",
      cell: ({ row }) => {
        const skill = row.original;
        return (
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-md flex-shrink-0 overflow-hidden flex items-center justify-center text-white`} style={{ backgroundColor: skill.color || "#6E56CF" }}>
              {skill.icon ? (
                <span className="text-lg">{skill.icon}</span>
              ) : (
                CATEGORY_ICONS[skill.category] || <Award className="h-4 w-4" />
              )}
            </div>
            <div>
              <div className="font-medium">{skill.name}</div>
              <div className="text-xs text-muted-foreground">
                {skill.yearsOfExperience} {skill.yearsOfExperience === 1 ? "year" : "years"} of experience
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
        <Badge variant="outline" className="capitalize flex items-center gap-1">
          {CATEGORY_ICONS[row.original.category]}
          <span>{row.original.category}</span>
        </Badge>
      ),
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "level",
      header: "Proficiency",
      cell: ({ row }) => {
        const level = row.original.level;
        
        let color = "bg-blue-500";
        if (level >= 90) color = "bg-purple-500";
        else if (level >= 75) color = "bg-green-500";
        else if (level >= 50) color = "bg-yellow-500";
        else if (level < 30) color = "bg-gray-500";
        
        return (
          <div className="flex items-center gap-2">
            <Progress value={level} className="h-2 w-24" indicatorClassName={color} />
            <span className="text-sm">{level}%</span>
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
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => (
        <Badge variant="outline">{row.original.priority}</Badge>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <ActionColumn
            row={row}
            onEdit={() => handleEditSkill(row.original)}
            onDelete={() => setSkillToDelete(row.original)}
          />
        );
      },
    },
  ], [handleEditSkill]);

  // Delete a single skill
  const handleDeleteSkill = useCallback(async () => {
    if (!skillToDelete) return;

    try {
      await deleteSkill(skillToDelete.id);
      toast({
        title: "Skill deleted",
        description: `${skillToDelete.name} has been deleted successfully.`,
      });
      setSkillToDelete(null);
    } catch (error) {
      console.error("Failed to delete skill:", error);
      toast({
        title: "Failed to delete",
        description: "There was an error deleting the skill.",
        variant: "destructive",
      });
    }
  }, [skillToDelete, deleteSkill]);

  // Delete multiple skills
  const handleBulkDelete = useCallback(async () => {
    if (!db || skillsToDelete.length === 0) return;

    try {
      const batch = writeBatch(db);
      
      skillsToDelete.forEach(skill => {
        const skillRef = doc(db, "skills", skill.id);
        batch.delete(skillRef);
      });

      await batch.commit();
      
      toast({
        title: "Skills deleted",
        description: `${skillsToDelete.length} skills have been deleted successfully.`,
      });
      setBulkDeleteOpen(false);
      setSkillsToDelete([]);
    } catch (error) {
      console.error("Failed to delete skills:", error);
      toast({
        title: "Failed to delete",
        description: "There was an error deleting the skills.",
        variant: "destructive",
      });
    }
  }, [skillsToDelete]);

  // Export skills
  const handleExport = useCallback((skills: Skill[]) => {
    try {
      // Format skills for export
      const exportData = {
        metadata: {
          exportedAt: new Date().toISOString(),
          count: skills.length,
          type: "skills_export"
        },
        skills
      };
      
      // Create file and download
      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      const date = new Date();
      const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      link.download = `skills_export_${formattedDate}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export successful",
        description: `${skills.length} skills exported successfully.`,
      });
    } catch (error) {
      console.error("Failed to export skills:", error);
      toast({
        title: "Export failed",
        description: "There was an error exporting the skills.",
        variant: "destructive",
      });
    }
  }, []);

  return (
    <>
      <Card className="border-0 shadow-medium">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Skills Management
              </CardTitle>
              <CardDescription>
                Manage your skills and expertise with advanced filtering and bulk operations
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
                onClick={() => {
                  resetForm();
                  setIsFormOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Skill
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={skills}
            loading={loading}
            searchPlaceholder="Search skills..."
            onAdd={() => {
              resetForm();
              setIsFormOpen(true);
            }}
            onDelete={(skills) => {
              setSkillsToDelete(skills);
              setBulkDeleteOpen(true);
            }}
            onExport={handleExport}
            onRefresh={() => window.location.reload()}
            filterFields={[
              {
                key: "category",
                title: "Category",
                options: categoryOptions
              }
            ]}
            rowClassName={(row) => {
              if (row.original.disabled) return "opacity-60";
              if (row.original.featured) return "bg-blue-50/30 dark:bg-blue-950/20";
              return "";
            }}
          />
        </CardContent>
      </Card>

      {/* Skill Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={(open) => {
        if (!open) {
          resetForm();
        }
        setIsFormOpen(open);
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{skillToEdit ? 'Edit Skill' : 'Add New Skill'}</DialogTitle>
            <DialogDescription>
              {skillToEdit 
                ? 'Update the details of this skill' 
                : 'Add a new skill to your portfolio'}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Skill Name*</FormLabel>
                        <FormControl>
                          <Input placeholder="React.js" {...field} />
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
                        <FormLabel>Category*</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.values(SkillCategorySchema.enum).map((category) => (
                              <SelectItem key={category} value={category}>
                                <div className="flex items-center gap-2">
                                  {CATEGORY_ICONS[category]}
                                  <span>{category}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Proficiency Level (1-100)*</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-4">
                            <Input 
                              type="range" 
                              min="1" 
                              max="100" 
                              {...field} 
                              className="w-full" 
                            />
                            <span className="w-10 text-center">{field.value}%</span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="yearsOfExperience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Years of Experience*</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" step="0.5" {...field} />
                        </FormControl>
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
                          placeholder="Brief description of your expertise with this skill..." 
                          className="resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Visual Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Visual Settings</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="icon"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Icon (emoji)</FormLabel>
                        <FormControl>
                          <Input placeholder="🚀" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter an emoji or leave blank to use default icon
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <Input 
                              type="color" 
                              {...field} 
                              className="w-12 h-9 p-1" 
                              value={field.value || "#6E56CF"}
                            />
                            <Input 
                              placeholder="#6E56CF" 
                              {...field} 
                              value={field.value || ""}
                              onChange={(e) => field.onChange(e.target.value)}
                              className="flex-1"
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Choose a color for the skill badge
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              {/* Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Settings</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="featured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Featured</FormLabel>
                          <FormDescription>
                            Highlight in your portfolio
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="disabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Hidden</FormLabel>
                          <FormDescription>
                            Hide from portfolio
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Display Priority (1-100)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1" 
                            max="100" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Lower is higher priority
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsFormOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {skillToEdit ? 'Update Skill' : 'Add Skill'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={!!skillToDelete} 
        onOpenChange={(open) => !open && setSkillToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Skill</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{skillToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteSkill}
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
            <AlertDialogTitle>Bulk Delete Skills</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {skillsToDelete.length} skills? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="max-h-[200px] overflow-y-auto">
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              {skillsToDelete.map((skill) => (
                <li key={skill.id}>{skill.name}</li>
              ))}
            </ul>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSkillsToDelete([])}>
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
