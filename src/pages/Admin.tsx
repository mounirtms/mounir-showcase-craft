import { useEffect, useMemo, useState } from "react";
import { 
  Award,
  Check
} from "lucide-react";
import { auth, db, isFirebaseEnabled } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SkipLinks } from "@/components/shared/AccessibleComponents";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { AccessibilitySettings } from "@/components/admin/AccessibilitySettings";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProjects, PROJECTS_COLLECTION, type ProjectInput, DEFAULT_PROJECT, type Project } from "@/hooks/useProjects";
import { addDoc, collection, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { ProfessionalSignature } from "@/components/ui/signature";
import { ProjectsManager } from "@/components/admin/ProjectsManager";
import { SkillsTab } from "@/components/admin/skills";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { DashboardOverview } from "@/components/admin/dashboard";
import { 
  BarChart3, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Star, 
  Calendar,
  Globe,
  Github,
  ExternalLink,
  Settings,
  Users,
  TrendingUp,
  Database,
  Upload,
  Activity,
  Zap,
  Shield,
  Sparkles,
  Crown,
  Palette,
  Code,
  Cpu,
  Server,
  Layers,
  Building2,
  Briefcase,
  Clock,
  MapPin,
  Phone,
  Mail,
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Target,
  LineChart
} from "lucide-react";
import type { ClientInfo, ProjectMetrics, ProjectCategory, ProjectStatus } from "@/hooks/useProjects";

export default function Admin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(() => auth?.currentUser ?? null);
  const [activeTab, setActiveTab] = useState("overview");
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [editingProjectData, setEditingProjectData] = useState<ProjectInput | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { projects, loading } = useProjects();
  const { skipLinks } = useAccessibility();

  // Define skip links for admin navigation
  const adminSkipLinks = [
    { id: 'admin-header', label: 'Skip to Header', target: 'admin-header' },
    { id: 'admin-main', label: 'Skip to Main Content', target: 'admin-main' },
    { id: 'admin-tabs', label: 'Skip to Navigation Tabs', target: 'admin-tabs' }
  ];

  useEffect(() => {
    if (!auth) return;
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const canUseAdmin = isFirebaseEnabled && !!db && !!auth;

  const stats = useMemo(() => {
    const projectStats = {
      total: projects.length,
      featured: projects.filter(p => p.featured).length,
      active: projects.filter(p => !p.disabled).length,
      categories: [...new Set(projects.map(p => p.category))].length
    };
    
    return {
      projects: projectStats
    };
  }, [projects]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!auth) return;
    
    setAuthLoading(true);
    setAuthError(null);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail("");
      setPassword("");
    } catch (error: unknown) {
      console.error("Login failed:", error);
      setAuthError(error instanceof Error ? error.message : "Login failed. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleLogout() {
    if (!auth) return;
    await signOut(auth);
  }

  async function addProject(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!db) return;
    
    const form = new FormData(e.currentTarget);
    
    const data: ProjectInput = {
      ...DEFAULT_PROJECT,
      title: String(form.get("title") || "Untitled"),
      description: String(form.get("description") || ""),
      longDescription: String(form.get("longDescription") || ""),
      category: String(form.get("category") || "Web Application") as ProjectCategory,
      status: String(form.get("status") || "completed") as ProjectStatus,
      achievements: String(form.get("achievements") || "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      technologies: String(form.get("technologies") || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      tags: String(form.get("tags") || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      image: String(form.get("image") || ""),
      logo: String(form.get("logo") || ""),
      icon: String(form.get("icon") || ""),
      liveUrl: String(form.get("liveUrl") || ""),
      githubUrl: String(form.get("githubUrl") || ""),
      demoUrl: String(form.get("demoUrl") || ""),
      caseStudyUrl: String(form.get("caseStudyUrl") || ""),
      featured: form.get("featured") === "on",
      disabled: form.get("disabled") === "on",
      priority: Number(form.get("priority") || 50),
      startDate: String(form.get("startDate") || ""),
      endDate: String(form.get("endDate") || ""),
      duration: String(form.get("duration") || ""),
      teamSize: Number(form.get("teamSize") || 1),
      role: String(form.get("role") || "Full-Stack Developer"),
      clientInfo: {
        name: String(form.get("clientName") || ""),
        industry: String(form.get("clientIndustry") || ""),
        size: String(form.get("clientSize") || "medium") as ClientInfo['size'],
        location: String(form.get("clientLocation") || ""),
        website: String(form.get("clientWebsite") || ""),
        isPublic: form.get("clientIsPublic") === "on"
      },
      metrics: {
        usersReached: Number(form.get("usersReached") || 0),
        performanceImprovement: String(form.get("performanceImprovement") || ""),
        revenueImpact: String(form.get("revenueImpact") || ""),
        uptime: String(form.get("uptime") || ""),
        customMetrics: {}
      },
      challenges: String(form.get("challenges") || "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      solutions: String(form.get("solutions") || "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      version: 1
    };

    try {
      await addDoc(collection(db, PROJECTS_COLLECTION), data);
      e.currentTarget.reset();
    } catch (error) {
      console.error("Failed to add project:", error);
    }
  }

  async function updateProject(id: string, updates: Partial<ProjectInput>) {
    if (!db) return;
    try {
      await updateDoc(doc(db, PROJECTS_COLLECTION, id), {
        ...updates,
        updatedAt: Date.now(),
      });
    } catch (error) {
      console.error("Failed to update project:", error);
    }
  }

  async function deleteProject(id: string) {
    if (!db || !confirm("Are you sure you want to delete this project?")) return;
    try {
      await deleteDoc(doc(db, PROJECTS_COLLECTION, id));
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  }

  function startEditingProject(project: Project) {
    setEditingProject(project.id);
    setEditingProjectData({ ...project });
    setActiveTab("add-project");
  }

  async function saveEditedProject(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!db || !editingProject || !editingProjectData) return;
    
    try {
      await updateDoc(doc(db, PROJECTS_COLLECTION, editingProject), {
        ...editingProjectData,
        updatedAt: Date.now(),
      });
      
      setEditingProject(null);
      setEditingProjectData(null);
      setActiveTab("projects");
    } catch (error) {
      console.error("Failed to update project:", error);
    }
  }

  function handleProjectFormChange(field: keyof ProjectInput, value: string | number | boolean | string[]) {
    if (editingProjectData) {
      setEditingProjectData({
        ...editingProjectData,
        [field]: value
      });
    }
  }

  function handleClientInfoChange(field: keyof ClientInfo, value: string | boolean) {
    if (editingProjectData?.clientInfo) {
      setEditingProjectData({
        ...editingProjectData,
        clientInfo: {
          ...editingProjectData.clientInfo,
          [field]: value
        }
      });
    }
  }

  function handleMetricsChange(field: keyof ProjectMetrics, value: string | number) {
    if (editingProjectData?.metrics) {
      setEditingProjectData({
        ...editingProjectData,
        metrics: {
          ...editingProjectData.metrics,
          [field]: value
        }
      });
    }
  }

  if (!canUseAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-mesh relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl animate-float" />
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '-6s' }} />
        </div>
        
        <Card className="glass-card max-w-lg w-full shadow-2xl animate-scale-in border-0 backdrop-blur-xl relative z-10">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto mb-6 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-lg opacity-75 group-hover:opacity-100 animate-glow transition-opacity" />
              <div className="relative bg-white dark:bg-gray-900 rounded-full p-4">
                <img src="/mounir-icon.svg" alt="Admin" className="w-12 h-12" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Admin Panel Unavailable
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Shield className="w-5 h-5" />
                <span className="font-medium">Configuration Required</span>
              </div>
              <p className="text-sm text-red-200">
                Firebase is not configured properly. Please check your environment variables and restart the development server.
              </p>
            </div>
            
            <div className="text-xs text-white/50 space-y-1">
              <div>Required: Firebase Auth, Firestore Database</div>
              <div>Check: .env.local file and VITE_FIREBASE_ENABLE_DEV=true</div>
            </div>
            
            <Button 
              onClick={() => window.location.reload()} 
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-0"
            >
              <Activity className="w-4 h-4 mr-2" />
              Retry Connection
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-mesh">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl animate-float" />
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '-6s' }} />
        </div>
        
        <div className="relative flex items-center justify-center min-h-screen p-6">
          <Card className="glass-card max-w-md w-full shadow-2xl animate-scale-in border-0 backdrop-blur-xl">
            <CardHeader className="text-center pb-8">
              <div className="mx-auto mb-6 relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-lg opacity-75 group-hover:opacity-100 animate-glow transition-opacity" />
                <div className="relative bg-white dark:bg-gray-900 rounded-full p-4">
                  <img src="/mounir-icon.svg" alt="Admin" className="w-12 h-12" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                Welcome Back
              </CardTitle>
              <p className="text-white/80 mt-2 font-medium">Portfolio Admin Panel</p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Error Display */}
              {authError && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-sm backdrop-blur-sm animate-slide-up">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span className="font-medium">Authentication Error</span>
                  </div>
                  <p className="mt-1 text-red-200">{authError}</p>
                </div>
              )}

              {/* Email/Password Form */}
              <form className="space-y-5" onSubmit={handleLogin}>
                <div className="space-y-2">
                  <Label className="text-white/90 font-medium flex items-center gap-2">
                    <div className="w-1 h-4 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full" />
                    Email Address
                  </Label>
                  <Input 
                    id="email"
                    type="email" 
                    placeholder="admin@example.com" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    disabled={authLoading}
                    required 
                    className="h-12 bg-white/10 border-white/20 text-white placeholder-white/50 focus:bg-white/15 focus:border-purple-400/50 transition-all duration-300 backdrop-blur-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/90 font-medium flex items-center gap-2">
                    <div className="w-1 h-4 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full" />
                    Password
                  </Label>
                  <Input 
                    id="password"
                    type="password" 
                    placeholder="••••••••••" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    disabled={authLoading}
                    required 
                    className="h-12 bg-white/10 border-white/20 text-white placeholder-white/50 focus:bg-white/15 focus:border-purple-400/50 transition-all duration-300 backdrop-blur-sm"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={authLoading} 
                  className="w-full h-14 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-500 hover:via-pink-500 hover:to-blue-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-0 relative overflow-hidden group"
                >
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                  
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {authLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Authenticating...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5" />
                        Access Admin Panel
                      </>
                    )}
                  </span>
                </Button>
              </form>
              
              {/* Footer */}
              <div className="text-center pt-4">
                <p className="text-white/50 text-xs">
                  Secured by Firebase Authentication
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Skip Links for Accessibility */}
      <SkipLinks links={skipLinks.length > 0 ? skipLinks : adminSkipLinks} />
      
      {/* Header */}
      <div id="admin-header" className="glass border-b border-border/30 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative bg-white/10 dark:bg-gray-800/10 rounded-full p-2 backdrop-blur-sm">
                  <img src="/mounir-icon.svg" alt="Admin" className="w-8 h-8" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Portfolio Admin
                </h1>
                <p className="text-sm text-muted-foreground">Content Management System</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <ProfessionalSignature />
              <Button 
                variant="outline" 
                onClick={handleLogout} 
                size="sm"
                className="hover-lift glass border-border/30 hover:glow-primary"
              >
                <Settings className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Stats Overview */}
        <main id="admin-main">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <Card className="border-0 shadow-medium hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Database className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.projects.total}</div>
                  <div className="text-sm text-muted-foreground">Projects</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-medium hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-500/10 rounded-xl">
                  <Star className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.projects.featured}</div>
                  <div className="text-sm text-muted-foreground">Featured</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-medium hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/10 rounded-xl">
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.projects.active}</div>
                  <div className="text-sm text-muted-foreground">Active</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-medium hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-xl">
                  <Layers className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.projects.categories}</div>
                  <div className="text-sm text-muted-foreground">Categories</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6" id="admin-tabs">
          <div className="flex flex-wrap gap-2">
            <TabsList className="grid grid-cols-5 lg:w-auto lg:grid-cols-5">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="projects" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Projects
              </TabsTrigger>
              <TabsTrigger value="add-project" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Project
              </TabsTrigger>
              <TabsTrigger value="skills" className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                Skills
              </TabsTrigger>
              <TabsTrigger value="accessibility" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Accessibility
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6">
            <DashboardOverview 
              onNavigateToTab={setActiveTab}
              onStatClick={(statType) => {
                // Handle stat clicks - could show filtered views
                console.log('Stat clicked:', statType);
              }}
              onQuickAction={(actionId) => {
                // Handle quick actions
                console.log('Quick action:', actionId);
              }}
            />
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <ProjectsManager />
          </TabsContent>

          <TabsContent value="add-project" className="space-y-6">
            <Card className="border-0 shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {editingProject ? (
                    <>
                      <Edit className="h-5 w-5" />
                      Edit Project
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5" />
                      Add New Project
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-8" onSubmit={editingProject ? saveEditedProject : addProject}>
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Project Title *</Label>
                          <Input 
                            id="title" 
                            name="title" 
                            placeholder="Amazing Project" 
                            required 
                            value={editingProjectData?.title || ""}
                            onChange={(e) => handleProjectFormChange("title", e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="description">Short Description *</Label>
                          <Textarea 
                            id="description" 
                            name="description" 
                            placeholder="Brief project description..." 
                            required 
                            value={editingProjectData?.description || ""}
                            onChange={(e) => handleProjectFormChange("description", e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="longDescription">Detailed Description</Label>
                          <Textarea 
                            id="longDescription" 
                            name="longDescription" 
                            placeholder="Detailed project description..." 
                            rows={4} 
                            value={editingProjectData?.longDescription || ""}
                            onChange={(e) => handleProjectFormChange("longDescription", e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select 
                              name="category"
                              value={editingProjectData?.category || "Web Application"}
                              onValueChange={(value) => handleProjectFormChange("category", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Web Application">Web Application</SelectItem>
                                <SelectItem value="Mobile Application">Mobile Application</SelectItem>
                                <SelectItem value="Enterprise Integration">Enterprise Integration</SelectItem>
                                <SelectItem value="E-commerce">E-commerce</SelectItem>
                                <SelectItem value="Machine Learning">Machine Learning</SelectItem>
                                <SelectItem value="API Development">API Development</SelectItem>
                                <SelectItem value="DevOps & Infrastructure">DevOps & Infrastructure</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select 
                              name="status"
                              value={editingProjectData?.status || "completed"}
                              onValueChange={(value) => handleProjectFormChange("status", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="in-progress">In Progress</SelectItem>
                                <SelectItem value="maintenance">Maintenance</SelectItem>
                                <SelectItem value="archived">Archived</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="technologies">Technologies (comma separated)</Label>
                          <Textarea 
                            id="technologies" 
                            name="technologies" 
                            placeholder="React, Node.js, TypeScript..." 
                            value={editingProjectData?.technologies?.join(", ") || ""}
                            onChange={(e) => handleProjectFormChange("technologies", e.target.value.split(",").map(t => t.trim()).filter(t => t))}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="tags">Tags (comma separated)</Label>
                          <Input 
                            id="tags" 
                            name="tags" 
                            placeholder="react, frontend, responsive..." 
                            value={editingProjectData?.tags?.join(", ") || ""}
                            onChange={(e) => handleProjectFormChange("tags", e.target.value.split(",").map(t => t.trim()).filter(t => t))}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Media & Links */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Media & Links</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="image">Featured Image URL</Label>
                          <Input 
                            id="image" 
                            name="image" 
                            type="url" 
                            placeholder="https://example.com/image.jpg" 
                            value={editingProjectData?.image || ""}
                            onChange={(e) => handleProjectFormChange("image", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="logo">Company Logo URL</Label>
                          <Input 
                            id="logo" 
                            name="logo" 
                            type="url" 
                            placeholder="/company-logo.svg" 
                            value={editingProjectData?.logo || ""}
                            onChange={(e) => handleProjectFormChange("logo", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="icon">Project Icon (emoji)</Label>
                          <Input 
                            id="icon" 
                            name="icon" 
                            placeholder="🚀" 
                            value={editingProjectData?.icon || ""}
                            onChange={(e) => handleProjectFormChange("icon", e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="liveUrl">Live URL</Label>
                          <Input 
                            id="liveUrl" 
                            name="liveUrl" 
                            type="url" 
                            placeholder="https://example.com" 
                            value={editingProjectData?.liveUrl || ""}
                            onChange={(e) => handleProjectFormChange("liveUrl", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="githubUrl">GitHub URL</Label>
                          <Input 
                            id="githubUrl" 
                            name="githubUrl" 
                            type="url" 
                            placeholder="https://github.com/..." 
                            value={editingProjectData?.githubUrl || ""}
                            onChange={(e) => handleProjectFormChange("githubUrl", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="demoUrl">Demo URL</Label>
                          <Input 
                            id="demoUrl" 
                            name="demoUrl" 
                            type="url" 
                            placeholder="https://demo.example.com" 
                            value={editingProjectData?.demoUrl || ""}
                            onChange={(e) => handleProjectFormChange("demoUrl", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="caseStudyUrl">Case Study URL</Label>
                          <Input 
                            id="caseStudyUrl" 
                            name="caseStudyUrl" 
                            type="url" 
                            placeholder="https://case-study.com" 
                            value={editingProjectData?.caseStudyUrl || ""}
                            onChange={(e) => handleProjectFormChange("caseStudyUrl", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Project Details</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="achievements">Key Achievements (one per line)</Label>
                          <Textarea 
                            id="achievements" 
                            name="achievements" 
                            placeholder="Improved performance by 40%&#10;Reduced loading time by 2 seconds&#10;Increased user engagement by 25%" 
                            rows={4} 
                            value={editingProjectData?.achievements?.join("\n") || ""}
                            onChange={(e) => handleProjectFormChange("achievements", e.target.value.split("\n").map(a => a.trim()).filter(a => a))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="challenges">Challenges (one per line)</Label>
                          <Textarea 
                            id="challenges" 
                            name="challenges" 
                            placeholder="Complex data integration&#10;Performance optimization&#10;Scalability requirements" 
                            rows={3} 
                            value={editingProjectData?.challenges?.join("\n") || ""}
                            onChange={(e) => handleProjectFormChange("challenges", e.target.value.split("\n").map(c => c.trim()).filter(c => c))}
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="solutions">Solutions (one per line)</Label>
                          <Textarea 
                            id="solutions" 
                            name="solutions" 
                            placeholder="Implemented microservices&#10;Used caching strategies&#10;Built auto-scaling system" 
                            rows={3} 
                            value={editingProjectData?.solutions?.join("\n") || ""}
                            onChange={(e) => handleProjectFormChange("solutions", e.target.value.split("\n").map(s => s.trim()).filter(s => s))}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="teamSize">Team Size</Label>
                            <Input 
                              id="teamSize" 
                              name="teamSize" 
                              type="number" 
                              min="1" 
                              value={editingProjectData?.teamSize || 1}
                              onChange={(e) => handleProjectFormChange("teamSize", parseInt(e.target.value) || 1)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="role">Your Role</Label>
                            <Input 
                              id="role" 
                              name="role" 
                              placeholder="Full-Stack Developer" 
                              value={editingProjectData?.role || "Full-Stack Developer"}
                              onChange={(e) => handleProjectFormChange("role", e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Timeline</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input 
                          id="startDate" 
                          name="startDate" 
                          type="date" 
                          value={editingProjectData?.startDate || ""}
                          onChange={(e) => handleProjectFormChange("startDate", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endDate">End Date</Label>
                        <Input 
                          id="endDate" 
                          name="endDate" 
                          type="date" 
                          value={editingProjectData?.endDate || ""}
                          onChange={(e) => handleProjectFormChange("endDate", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="duration">Duration</Label>
                        <Input 
                          id="duration" 
                          name="duration" 
                          placeholder="3 months" 
                          value={editingProjectData?.duration || ""}
                          onChange={(e) => handleProjectFormChange("duration", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Client Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Client Information</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="clientName">Client Name</Label>
                          <Input 
                            id="clientName" 
                            name="clientName" 
                            placeholder="Company Name" 
                            value={editingProjectData?.clientInfo?.name || ""}
                            onChange={(e) => handleClientInfoChange("name", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="clientIndustry">Industry</Label>
                          <Input 
                            id="clientIndustry" 
                            name="clientIndustry" 
                            placeholder="Technology" 
                            value={editingProjectData?.clientInfo?.industry || ""}
                            onChange={(e) => handleClientInfoChange("industry", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="clientWebsite">Client Website</Label>
                          <Input 
                            id="clientWebsite" 
                            name="clientWebsite" 
                            type="url" 
                            placeholder="https://client.com" 
                            value={editingProjectData?.clientInfo?.website || ""}
                            onChange={(e) => handleClientInfoChange("website", e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="clientSize">Company Size</Label>
                          <Select 
                            name="clientSize"
                            value={editingProjectData?.clientInfo?.size || "medium"}
                            onValueChange={(value) => handleClientInfoChange("size", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select size" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="startup">Startup</SelectItem>
                              <SelectItem value="small">Small</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="large">Large</SelectItem>
                              <SelectItem value="enterprise">Enterprise</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="clientLocation">Location</Label>
                          <Input 
                            id="clientLocation" 
                            name="clientLocation" 
                            placeholder="City, Country" 
                            value={editingProjectData?.clientInfo?.location || ""}
                            onChange={(e) => handleClientInfoChange("location", e.target.value)}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch 
                            id="clientIsPublic" 
                            name="clientIsPublic" 
                            checked={editingProjectData?.clientInfo?.isPublic || false}
                            onCheckedChange={(checked) => handleClientInfoChange("isPublic", checked)}
                          />
                          <Label htmlFor="clientIsPublic">Public Client</Label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Project Metrics</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="usersReached">Users Reached</Label>
                          <Input 
                            id="usersReached" 
                            name="usersReached" 
                            type="number" 
                            placeholder="10000" 
                            value={editingProjectData?.metrics?.usersReached || 0}
                            onChange={(e) => handleMetricsChange("usersReached", parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="performanceImprovement">Performance Improvement</Label>
                          <Input 
                            id="performanceImprovement" 
                            name="performanceImprovement" 
                            placeholder="75% faster processing" 
                            value={editingProjectData?.metrics?.performanceImprovement || ""}
                            onChange={(e) => handleMetricsChange("performanceImprovement", e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="revenueImpact">Revenue Impact</Label>
                          <Input 
                            id="revenueImpact" 
                            name="revenueImpact" 
                            placeholder="$1M+ revenue increase" 
                            value={editingProjectData?.metrics?.revenueImpact || ""}
                            onChange={(e) => handleMetricsChange("revenueImpact", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="uptime">Uptime</Label>
                          <Input 
                            id="uptime" 
                            name="uptime" 
                            placeholder="99.9%" 
                            value={editingProjectData?.metrics?.uptime || ""}
                            onChange={(e) => handleMetricsChange("uptime", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Settings */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Settings</h3>
                    <div className="flex items-center gap-8">
                      <div className="flex items-center gap-2">
                        <Switch 
                          id="featured" 
                          name="featured" 
                          checked={editingProjectData?.featured || false}
                          onCheckedChange={(checked) => handleProjectFormChange("featured", checked)}
                        />
                        <Label htmlFor="featured">Featured Project</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch 
                          id="disabled" 
                          name="disabled" 
                          checked={editingProjectData?.disabled || false}
                          onCheckedChange={(checked) => handleProjectFormChange("disabled", checked)}
                        />
                        <Label htmlFor="disabled">Hide from Portfolio</Label>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="priority">Priority (1-100)</Label>
                        <Input 
                          id="priority" 
                          name="priority" 
                          type="number" 
                          min="1" 
                          max="100" 
                          value={editingProjectData?.priority || 50}
                          onChange={(e) => handleProjectFormChange("priority", parseInt(e.target.value) || 50)}
                          className="w-20" 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button type="submit" className="flex-1 shadow-glow">
                      {editingProject ? (
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
                    {editingProject && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setEditingProject(null);
                          setEditingProjectData(null);
                          setActiveTab("projects");
                        }}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            <SkillsTab />
          </TabsContent>

          <TabsContent value="accessibility" className="space-y-6">
            <AccessibilitySettings />
          </TabsContent>
        </Tabs>
        </main>
      </div>
    </div>
  );
}