import React, { useState, useMemo, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import { useSkills, type Skill } from "@/hooks/useSkills";
import { doc, updateDoc, deleteDoc, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { DataTable, ActionColumn } from "@/components/ui/data-table";
import { validateSkillUpdate } from "@/lib/validation-schemas";
import { getSkillIcon, getSkillColor } from "@/lib/skill-icons";
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
import { Slider } from "@/components/ui/slider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SkillSchema, SkillCategorySchema, type SkillInput } from "@/lib/validation-schemas";
import { DataExportManager } from "@/components/admin/DataExportManager";
import { ImageUpload } from "@/components/admin/ImageUpload";

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
  const [iconUrl, setIconUrl] = useState<string>("");
  const [iconPath, setIconPath] = useState<string>("");

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

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (skillToEdit) {
        // Check if this is a local skill (can't be updated in Firebase)
        if (skillToEdit.id.startsWith('local-') || skillToEdit.id.startsWith('fallback-')) {
          toast({
            title: "Cannot Edit Local Skill",
            description: "This is a local/demo skill. Please create a new skill instead.",
            variant: "destructive",
          });
          return;
        }
        
        // Update existing skill
        await updateSkill(skillToEdit.id, {
          ...values,
          icon: iconUrl || values.icon,
          disabled: values.disabled ?? false,
          updatedAt: Date.now(),
        } as Partial<Skill>);
        toast({
          title: "Skill updated",
          description: `${values.name} has been updated successfully.`,
        });
      } else {
        // Add new skill
        await addSkill({
          ...values,
          icon: iconUrl || values.icon,
          certifications: [],
          projects: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          disabled: values.disabled ?? false,
        } as SkillInput);
        toast({
          title: "Skill added",
          description: `${values.name} has been added successfully.`,
        });
      }
      setIsFormOpen(false);
      resetForm();
      setIconUrl("");
      setIconPath("");
    } catch (error) {
      console.error("Error saving skill:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      toast({
        title: "Failed to save skill",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // Reset form
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
  }, [form]);

  // Handle edit skill
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
      icon: skill.icon,
      color: skill.color,
    });
    setIconUrl(skill.icon);
    setIsFormOpen(true);
  }, [form]);

  // Handle delete skill
  const handleDeleteSkill = useCallback((skill: Skill) => {
    setSkillToDelete(skill);
  }, []);

  // Confirm delete skill
  const confirmDeleteSkill = useCallback(async () => {
    if (!skillToDelete || !db) return;

    try {
      // Check if this is a local skill (can't be deleted from Firebase)
      if (skillToDelete.id.startsWith('local-') || skillToDelete.id.startsWith('fallback-')) {
        toast({
          title: "Cannot Delete Local Skill",
          description: "This is a local/demo skill and cannot be deleted.",
          variant: "destructive",
        });
        setSkillToDelete(null);
        return;
      }

      await deleteSkill(skillToDelete.id);
      toast({
        title: "Skill deleted",
        description: `${skillToDelete.name} has been deleted successfully.`,
      });
      setSkillToDelete(null);
    } catch (error) {
      console.error("Error deleting skill:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      toast({
        title: "Failed to delete skill",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [skillToDelete, deleteSkill]);

  // Handle bulk delete
  const handleBulkDelete = useCallback((skills: Skill[]) => {
    setSkillsToDelete(skills);
    setBulkDeleteOpen(true);
  }, []);

  // Confirm bulk delete
  const confirmBulkDelete = useCallback(async () => {
    if (skillsToDelete.length === 0 || !db) return;

    try {
      const batch = writeBatch(db);
      const deletableSkills = skillsToDelete.filter(
        skill => !skill.id.startsWith('local-') && !skill.id.startsWith('fallback-')
      );

      if (deletableSkills.length === 0) {
        toast({
          title: "Cannot Delete Local Skills",
          description: "Local/demo skills cannot be deleted.",
          variant: "destructive",
        });
        setBulkDeleteOpen(false);
        setSkillsToDelete([]);
        return;
      }

      deletableSkills.forEach((skill) => {
        const skillRef = doc(db, "skills", skill.id);
        batch.delete(skillRef);
      });

      await batch.commit();
      
      toast({
        title: "Skills deleted",
        description: `${deletableSkills.length} skills have been deleted successfully.`,
      });
      
      setBulkDeleteOpen(false);
      setSkillsToDelete([]);
    } catch (error) {
      console.error("Error deleting skills:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      toast({
        title: "Failed to delete skills",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [skillsToDelete]);

  // Columns definition
  const columns: ColumnDef<Skill>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="text-lg">{row.original.icon}</span>
          <span>{row.getValue("name")}</span>
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {CATEGORY_ICONS[row.original.category] || <LayoutPanelLeft className="h-4 w-4" />}
          <span>{row.getValue("category")}</span>
        </div>
      ),
    },
    {
      accessorKey: "level",
      header: "Level",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Progress 
            value={row.getValue("level")} 
            className="w-24" 
            indicatorClassName="bg-primary"
          />
          <span className="text-sm text-muted-foreground w-8">{row.getValue("level")}%</span>
        </div>
      ),
    },
    {
      accessorKey: "yearsOfExperience",
      header: "Years",
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
      accessorKey: "disabled",
      header: "Status",
      cell: ({ row }) => (
        row.getValue("disabled") ? 
        <Badge variant="destructive">Disabled</Badge> : 
        <Badge variant="default" className="bg-green-500 hover:bg-green-600">Active</Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <ActionColumn
          row={row}
          onView={() => console.log("View skill", row.original)}
          onEdit={() => handleEditSkill(row.original)}
          onDelete={() => handleDeleteSkill(row.original)}
          onDuplicate={() => console.log("Duplicate skill", row.original)}
          onToggleStatus={async () => {
            try {
              await updateSkill(row.original.id, {
                ...row.original,
                disabled: !row.original.disabled,
                updatedAt: Date.now(),
              } as Partial<Skill>);
              toast({
                title: "Skill updated",
                description: `${row.original.name} status has been updated.`,
              });
            } catch (error) {
              console.error("Error updating skill:", error);
              toast({
                title: "Failed to update skill",
                description: "Please try again.",
                variant: "destructive",
              });
            }
          }}
          onToggleFeatured={async () => {
            try {
              await updateSkill(row.original.id, {
                ...row.original,
                featured: !row.original.featured,
                updatedAt: Date.now(),
              } as Partial<Skill>);
              toast({
                title: "Skill updated",
                description: `${row.original.name} featured status has been updated.`,
              });
            } catch (error) {
              console.error("Error updating skill:", error);
              toast({
                title: "Failed to update skill",
                description: "Please try again.",
                variant: "destructive",
              });
            }
          }}
        />
      ),
    },
  ];

  // Filter options
  const categoryOptions = useMemo(() => {
    const categories = [...new Set(skills.map(s => s.category))];
    return categories.map(cat => ({ label: cat, value: cat }));
  }, [skills]);

  const statusOptions = useMemo(() => [
    { label: "Active", value: "false" },
    { label: "Disabled", value: "true" },
  ], []);

  return (
    <div className="space-y-6">
      <DataExportManager />
      
      <Card className="border-0 shadow-medium bg-card text-card-foreground">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold">Skills Management</CardTitle>
              <CardDescription>
                Manage your technical skills and expertise
              </CardDescription>
            </div>
            <Button onClick={() => setIsFormOpen(true)} className="shadow-glow">
              <Plus className="h-4 w-4 mr-2" />
              Add Skill
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={skills}
            loading={loading}
            searchPlaceholder="Search skills..."
            filterFields={[
              {
                key: "category",
                title: "Category",
                options: categoryOptions,
              },
              {
                key: "disabled",
                title: "Status",
                options: statusOptions,
              },
            ]}
            onRefresh={() => window.location.reload()}
            onDelete={(items) => {
              setSkillsToDelete(items);
              setBulkDeleteOpen(true);
            }}
            onAdd={() => setIsFormOpen(true)}
            emptyStateMessage="No skills found"
            emptyStateDescription="Get started by adding a new skill"
          />
        </CardContent>
      </Card>

      {/* Skill Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background text-foreground">
          <DialogHeader>
            <DialogTitle>{skillToEdit ? "Edit Skill" : "Add Skill"}</DialogTitle>
            <DialogDescription>
              {skillToEdit 
                ? "Update the skill details below" 
                : "Fill in the details for your new skill"}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., React, Node.js" 
                          {...field} 
                          className="bg-background text-foreground border-input"
                        />
                      </FormControl>
                      <FormDescription>
                        The name of the skill or technology
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
                          {Object.keys(CATEGORY_ICONS).map((category) => (
                            <SelectItem 
                              key={category} 
                              value={category}
                              className="focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="flex items-center gap-2">
                                {CATEGORY_ICONS[category]}
                                {category}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The category this skill belongs to
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Proficiency Level</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <Slider
                            min={1}
                            max={100}
                            step={1}
                            value={[field.value]}
                            onValueChange={(vals) => field.onChange(vals[0])}
                            className="w-full"
                          />
                          <div className="flex justify-between text-sm">
                            <span>Beginner</span>
                            <span className="font-medium">{field.value}%</span>
                            <span>Expert</span>
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Your proficiency level (1-100%)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="yearsOfExperience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years of Experience</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          {...field} 
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          className="bg-background text-foreground border-input"
                        />
                      </FormControl>
                      <FormDescription>
                        Your years of experience with this skill
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
                
                <div className="flex items-end gap-4">
                  <FormField
                    control={form.control}
                    name="icon"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Icon</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., ⚛️, 🟢" 
                            {...field} 
                            className="bg-background text-foreground border-input"
                          />
                        </FormControl>
                        <FormDescription>
                          Emoji or text icon representing the skill
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
                        <div className="flex items-center gap-2">
                          <FormControl>
                            <Input 
                              type="color" 
                              {...field} 
                              className="w-12 h-10 p-1 border-input"
                            />
                          </FormControl>
                          <div 
                            className="w-8 h-8 rounded border" 
                            style={{ backgroundColor: field.value || "#000000" }}
                          />
                        </div>
                        <FormDescription>
                          Color associated with this skill
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your experience with this skill..."
                        className="min-h-[100px] bg-background text-foreground border-input"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A brief description of your experience and expertise
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex flex-col md:flex-row gap-6 pt-4">
                <ImageUpload
                  onUploadComplete={(url, path) => {
                    setIconUrl(url);
                    setIconPath(path);
                    form.setValue("icon", url);
                  }}
                  currentImageUrl={iconUrl}
                  folder="skill-icons"
                  title="Skill Icon"
                  description="Upload an icon for this skill (optional)"
                />
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
                        Featured Skill
                      </FormLabel>
                      <FormDescription>
                        Display this skill prominently
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
                        Disable Skill
                      </FormLabel>
                      <FormDescription>
                        Hide this skill from display
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
                    setIconUrl("");
                    setIconPath("");
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
                  ) : skillToEdit ? (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Update Skill
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Skill
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!skillToDelete} onOpenChange={() => setSkillToDelete(null)}>
        <AlertDialogContent className="bg-background text-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the skill <strong>{skillToDelete?.name}</strong>.
              {skillToDelete?.id.startsWith('local-') || skillToDelete?.id.startsWith('fallback-') ? (
                <span className="block mt-2 text-yellow-500 font-medium">
                  This is a local/demo skill and cannot be deleted from Firebase.
                </span>
              ) : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => setSkillToDelete(null)}
              className="bg-background text-foreground border-input hover:bg-accent hover:text-accent-foreground"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteSkill}
              disabled={skillToDelete?.id.startsWith('local-') || skillToDelete?.id.startsWith('fallback-')}
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
            <AlertDialogTitle>Delete Multiple Skills</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{skillsToDelete.length}</strong> skills.
              {skillsToDelete.some(s => s.id.startsWith('local-') || s.id.startsWith('fallback-')) ? (
                <span className="block mt-2 text-yellow-500 font-medium">
                  Note: Local/demo skills cannot be deleted and will be skipped.
                </span>
              ) : null}
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
              onClick={confirmBulkDelete}
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