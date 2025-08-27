import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { AdminDataTable } from "./AdminDataTable";
import { ActionColumn, createActionColumnDef, commonActionConfigs } from "./ActionColumn";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  FileText, 
  FileSpreadsheet, 
  FileJson,
  Trash2,
  Archive,
  Star,
  Eye,
  EyeOff,
} from "lucide-react";

// Example data type
interface ExampleProject {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'completed' | 'in-progress' | 'cancelled';
  featured: boolean;
  disabled: boolean;
  priority: number;
  createdAt: number;
  updatedAt: number;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  image?: string;
  logo?: string;
}

// Example usage component
export const AdminDataTableExample: React.FC = () => {
  const [data, setData] = React.useState<ExampleProject[]>([
    {
      id: "1",
      title: "E-commerce Platform",
      description: "Full-stack e-commerce solution with React and Node.js",
      category: "Web Application",
      status: "completed",
      featured: true,
      disabled: false,
      priority: 90,
      createdAt: Date.now() - 86400000,
      updatedAt: Date.now() - 3600000,
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/example/repo",
      image: "/placeholder.svg",
      logo: "/placeholder.svg",
    },
    // Add more example data...
  ]);

  const [loading, setLoading] = React.useState(false);

  // Define columns
  const columns: ColumnDef<ExampleProject>[] = [
    {
      id: "project",
      header: "Project",
      cell: ({ row }) => {
        const project = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={project.logo} alt={project.title} />
              <AvatarFallback>
                {project.title.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{project.title}</div>
              <div className="text-sm text-muted-foreground">
                {project.description.substring(0, 50)}...
              </div>
            </div>
          </div>
        );
      },
      size: 300,
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <Badge variant="outline">{row.getValue("category")}</Badge>
      ),
      size: 150,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const variants = {
          completed: "default",
          "in-progress": "secondary",
          cancelled: "destructive",
        } as const;
        return (
          <Badge variant={variants[status as keyof typeof variants]}>
            {status}
          </Badge>
        );
      },
      size: 120,
    },
    {
      accessorKey: "technologies",
      header: "Technologies",
      cell: ({ row }) => {
        const technologies = row.getValue("technologies") as string[];
        return (
          <div className="flex flex-wrap gap-1">
            {technologies.slice(0, 3).map((tech) => (
              <Badge key={tech} variant="secondary" className="text-xs">
                {tech}
              </Badge>
            ))}
            {technologies.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{technologies.length - 3}
              </Badge>
            )}
          </div>
        );
      },
      size: 200,
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => {
        const priority = row.getValue("priority") as number;
        return (
          <div className="flex items-center gap-2">
            <div className="w-16 bg-muted rounded-full h-2">
              <div
                className="h-2 rounded-full bg-primary"
                style={{ width: `${priority}%` }}
              />
            </div>
            <span className="text-sm text-muted-foreground">{priority}%</span>
          </div>
        );
      },
      size: 120,
    },
    {
      id: "featured",
      header: "Featured",
      cell: ({ row }) => {
        const featured = row.original.featured;
        return featured ? (
          <Star className="h-4 w-4 fill-current text-yellow-500" />
        ) : (
          <Star className="h-4 w-4 text-muted-foreground" />
        );
      },
      size: 80,
    },
    {
      id: "visibility",
      header: "Visible",
      cell: ({ row }) => {
        const disabled = row.original.disabled;
        return disabled ? (
          <EyeOff className="h-4 w-4 text-muted-foreground" />
        ) : (
          <Eye className="h-4 w-4 text-green-500" />
        );
      },
      size: 80,
    },
    // Action column using the reusable ActionColumn component
    createActionColumnDef({
      ...commonActionConfigs.project({
        onView: (item) => console.log("View project:", item),
        onEdit: (item) => console.log("Edit project:", item),
        onToggleFeatured: (item) => {
          setData(prev => prev.map(p => 
            p.id === item.id ? { ...p, featured: !p.featured } : p
          ));
        },
        onToggleVisibility: (item) => {
          setData(prev => prev.map(p => 
            p.id === item.id ? { ...p, disabled: !p.disabled } : p
          ));
        },
        onDuplicate: (item) => {
          const newItem = { 
            ...item, 
            id: Date.now().toString(), 
            title: `${item.title} (Copy)` 
          };
          setData(prev => [...prev, newItem]);
        },
        onDelete: (item) => {
          if (confirm(`Are you sure you want to delete "${item.title}"?`)) {
            setData(prev => prev.filter(p => p.id !== item.id));
          }
        },
      }),
      customActions: [
        {
          id: 'archive',
          label: 'Archive Project',
          icon: Archive,
          onClick: (item) => console.log("Archive project:", item),
          variant: 'secondary',
        },
      ],
    }),
  ];

  // Bulk actions
  const bulkActions = [
    {
      label: "Delete Selected",
      icon: Trash2,
      onClick: (items: ExampleProject[]) => {
        if (confirm(`Delete ${items.length} selected projects?`)) {
          const ids = items.map(item => item.id);
          setData(prev => prev.filter(p => !ids.includes(p.id)));
        }
      },
      variant: 'destructive' as const,
      requiresConfirmation: true,
    },
    {
      label: "Feature Selected",
      icon: Star,
      onClick: (items: ExampleProject[]) => {
        const ids = items.map(item => item.id);
        setData(prev => prev.map(p => 
          ids.includes(p.id) ? { ...p, featured: true } : p
        ));
      },
    },
    {
      label: "Archive Selected",
      icon: Archive,
      onClick: (items: ExampleProject[]) => {
        console.log("Archive projects:", items);
      },
      variant: 'secondary' as const,
    },
  ];

  // Export options
  const exportOptions = [
    {
      label: "Export as CSV",
      format: 'csv' as const,
      icon: FileSpreadsheet,
      fileName: "projects-export",
      transform: (data: ExampleProject[]) => 
        data.map(item => ({
          title: item.title,
          category: item.category,
          status: item.status,
          featured: item.featured,
          technologies: item.technologies.join(", "),
          priority: item.priority,
        })),
    },
    {
      label: "Export as JSON",
      format: 'json' as const,
      icon: FileJson,
      fileName: "projects-export",
    },
  ];

  // Filter fields
  const filterFields = [
    {
      key: "category",
      title: "Category",
      options: [
        { label: "Web Application", value: "Web Application" },
        { label: "Mobile App", value: "Mobile App" },
        { label: "Desktop App", value: "Desktop App" },
        { label: "API", value: "API" },
      ],
    },
    {
      key: "status",
      title: "Status",
      options: [
        { label: "Completed", value: "completed" },
        { label: "In Progress", value: "in-progress" },
        { label: "Cancelled", value: "cancelled" },
      ],
    },
  ];

  const handleRefresh = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleAddProject = () => {
    const newProject: ExampleProject = {
      id: Date.now().toString(),
      title: "New Project",
      description: "A new project description",
      category: "Web Application",
      status: "in-progress",
      featured: false,
      disabled: false,
      priority: 50,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      technologies: ["React", "TypeScript"],
    };
    setData(prev => [newProject, ...prev]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Enhanced Admin Data Table</h2>
        <p className="text-muted-foreground">
          Demonstration of the optimized AdminDataTable with virtual scrolling, 
          bulk operations, sticky headers, and column resizing.
        </p>
      </div>

      <AdminDataTable
        title="Projects Management"
        description="Manage your portfolio projects with advanced table features"
        columns={columns}
        data={data}
        loading={loading}
        searchPlaceholder="Search projects..."
        createButton={{
          label: "Add Project",
          onClick: handleAddProject,
        }}
        bulkActions={bulkActions}
        exportOptions={exportOptions}
        filterFields={filterFields}
        virtualScrolling={data.length > 50}
        stickyHeader={true}
        enableColumnResizing={true}
        rowHeight={80}
        containerHeight={600}
        onRefresh={handleRefresh}
        emptyStateMessage="No projects found"
        emptyStateDescription="Create your first project to get started"
      />
    </div>
  );
};

export default AdminDataTableExample;