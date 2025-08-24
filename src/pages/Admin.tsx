import { useEffect, useMemo, useState } from "react";
import { useSkills, type SkillCategory, type Skill } from "@/hooks/useSkills";
import { 
  Plus as PlusIcon, 
  Edit as EditIcon, 
  Trash2 as TrashIcon,
  Award,
  Check
} from "lucide-react";
import { auth, db, isFirebaseEnabled } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProjects, PROJECTS_COLLECTION, type ProjectInput, DEFAULT_PROJECT, type Project } from "@/hooks/useProjects";
import { useApplications, type Application, type ApplicationInput, DEFAULT_APPLICATION } from "@/hooks/useApplications";
import { useExperienceEnhanced, type WorkExperience, type WorkExperienceInput, DEFAULT_WORK_EXPERIENCE } from "@/hooks/useExperienceEnhanced";
import { addDoc, collection, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";
import { ProfessionalSignature } from "@/components/ui/signature";
import { DataManager } from "@/components/admin/DataManager";
import { ApplicationsManager } from "@/components/admin/ApplicationsManager";
import { ExportManager } from "@/components/admin/ExportManager";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ThemeToggle } from "@/components/theme/theme-toggle";
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
import type { ClientInfo, ProjectMetrics } from "@/hooks/useProjects";

export default function Admin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(() => auth?.currentUser ?? null);
  const [activeTab, setActiveTab] = useState("overview");
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [editingProjectData, setEditingProjectData] = useState<ProjectInput | null>(null);
  const [editingSkill, setEditingSkill] = useState<string | null>(null);
  const [editingSkillData, setEditingSkillData] = useState<Skill | null>(null);
  const { skills, loading: skillsLoading, addSkill, updateSkill, deleteSkill } = useSkills();
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { projects, loading } = useProjects();
  
  // Applications Management
  const { applications, loading: applicationsLoading, addApplication, updateApplication, deleteApplication, getStats: getApplicationStats } = useApplications();
  const [editingApplication, setEditingApplication] = useState<string | null>(null);
  const [editingApplicationData, setEditingApplicationData] = useState<ApplicationInput | null>(null);
  
  // Experience Management
  const { experiences, loading: experiencesLoading, addExperience, updateExperience, deleteExperience, getStats: getExperienceStats } = useExperienceEnhanced();
  const [editingExperience, setEditingExperience] = useState<string | null>(null);
  const [editingExperienceData, setEditingExperienceData] = useState<WorkExperienceInput | null>(null);

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
    
    const applicationStats = getApplicationStats();
    const experienceStats = getExperienceStats();
    
    return {
      projects: projectStats,
      applications: applicationStats,
      experiences: experienceStats
    };
  }, [projects, applications, experiences]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!auth) return;
    
    setAuthLoading(true);
    setAuthError(null);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail("");
      setPassword("");
    } catch (error: any) {
      console.error("Login failed:", error);
      setAuthError(error.message || "Login failed. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleGoogleLogin() {
    if (!auth) return;
    
    setAuthLoading(true);
    setAuthError(null);
    
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Google login failed:", error);
      if (error.code !== 'auth/popup-closed-by-user') {
        setAuthError(error.message || "Google login failed. Please try again.");
      }
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
      category: String(form.get("category") || "Web Application") as any,
      status: String(form.get("status") || "completed") as any,
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
        size: String(form.get("clientSize") || "medium") as any,
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

  function handleProjectFormChange(field: keyof ProjectInput, value: any) {
    if (editingProjectData) {
      setEditingProjectData({
        ...editingProjectData,
        [field]: value
      });
    }
  }

  function handleClientInfoChange(field: keyof ClientInfo, value: any) {
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

  function handleMetricsChange(field: keyof ProjectMetrics, value: any) {
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
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-subtle">
        <Card className="max-w-lg w-full shadow-glow border-0">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <img src="/mounir-icon.svg" alt="Admin" className="w-16 h-16 mx-auto opacity-80" />
            </div>
            <CardTitle className="text-2xl">Admin Panel Unavailable</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              Firebase is not configured properly. Please check your environment variables and rebuild the application.
            </p>
            <div className="text-xs text-muted-foreground/70">
              Required: Firebase Auth, Firestore Database
            </div>
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

              {/* Google Sign In */}
              <Button 
                onClick={handleGoogleLogin}
                disabled={authLoading}
                className="w-full h-14 text-base font-semibold bg-white hover:bg-gray-50 text-gray-900 border-0 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 group relative overflow-hidden"
              >
                {/* Shimmer Effect */}
                <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100" />
                
                <svg className="w-5 h-5 mr-3 z-10" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                
                <span className="z-10">
                  {authLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                      Signing in...
                    </div>
                  ) : (
                    "Continue with Google"
                  )}
                </span>
                
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 text-xs uppercase tracking-wider text-white/60 bg-gradient-to-r from-purple-900/50 via-purple-800/80 to-purple-900/50 backdrop-blur-sm rounded-full">
                    Or continue with email
                  </span>
                </div>
              </div>

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
      {/* Header */}
      <div className="glass border-b border-border/30 sticky top-0 z-50">
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
        {/* Enhanced Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-6">
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
                <div className="p-3 bg-blue-500/10 rounded-xl">
                  <Building2 className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.applications.total}</div>
                  <div className="text-sm text-muted-foreground">Applications</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-medium hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-500/10 rounded-xl">
                  <Clock className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.applications.pending}</div>
                  <div className="text-sm text-muted-foreground">Pending</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-medium hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500/10 rounded-xl">
                  <Briefcase className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.experiences.total}</div>
                  <div className="text-sm text-muted-foreground">Experience</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-medium hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/10 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.experiences.totalYears}y</div>
                  <div className="text-sm text-muted-foreground">Total Exp</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex flex-wrap gap-2">
            <TabsList className="grid grid-cols-4 lg:w-auto lg:grid-cols-4">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload Data
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <LineChart className="h-4 w-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="export" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Export
              </TabsTrigger>
            </TabsList>
            
            <TabsList className="grid grid-cols-3 lg:w-auto lg:grid-cols-3">
              <TabsTrigger value="projects" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Projects
              </TabsTrigger>
              <TabsTrigger value="applications" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Applications
              </TabsTrigger>
              <TabsTrigger value="experience" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Experience
              </TabsTrigger>
            </TabsList>
            
            <TabsList className="grid grid-cols-2 lg:w-auto lg:grid-cols-2">
              <TabsTrigger value="add-project" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Project
              </TabsTrigger>
              <TabsTrigger value="skills" className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                Skills
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-medium">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {projects.slice(0, 5).map((project) => (
                      <div key={project.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <div className="flex-1">
                          <div className="font-medium">{project.title}</div>
                          <div className="text-xs text-muted-foreground">{project.category}</div>
                        </div>
                        <Badge variant={project.featured ? "default" : "outline"}>
                          {project.featured ? "Featured" : "Standard"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-medium">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    onClick={() => setActiveTab("upload")} 
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Portfolio Data
                  </Button>
                  <Button 
                    onClick={() => setActiveTab("add-project")} 
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Project
                  </Button>
                  <Button 
                    onClick={() => setActiveTab("projects")} 
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Database className="h-4 w-4 mr-2" />
                    Manage Projects
                  </Button>
                  <Button 
                    onClick={() => window.open("/", "_blank")} 
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Live Site
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            <DataManager />
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <ApplicationsManager />
          </TabsContent>

          <TabsContent value="experience" className="space-y-6">
            <Card className="border-0 shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Experience Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                {experiencesLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading experiences...</div>
                ) : !experiences.length ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No work experiences found. Add your first experience to get started.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {experiences.map((experience) => (
                      <div key={experience.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              {experience.companyLogo && (
                                <img src={experience.companyLogo} alt="" className="w-6 h-6 object-contain" />
                              )}
                              <h3 className="font-semibold text-lg">{experience.jobTitle}</h3>
                              <div className="flex gap-2">
                                {experience.portfolioHighlight && (
                                  <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20">
                                    <Star className="h-3 w-3 mr-1" />
                                    Highlighted
                                  </Badge>
                                )}
                                <Badge variant="outline">{experience.employmentType}</Badge>
                                {experience.isCurrent && (
                                  <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                                    Current
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <p className="text-muted-foreground">{experience.company} • {experience.location}</p>
                            <div className="text-sm text-muted-foreground">
                              {experience.startDate} - {experience.endDate || 'Present'} • {experience.workArrangement}
                            </div>
                            {experience.technologiesUsed && experience.technologiesUsed.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {experience.technologiesUsed.slice(0, 5).map((tech, i) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {tech}
                                  </Badge>
                                ))}
                                {experience.technologiesUsed.length > 5 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{experience.technologiesUsed.length - 5} more
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {experience.companyWebsite && (
                              <Button size="sm" variant="outline" asChild>
                                <a href={experience.companyWebsite} target="_blank" rel="noopener noreferrer">
                                  <Globe className="h-4 w-4" />
                                </a>
                              </Button>
                            )}
                            <Button size="sm" variant="outline" onClick={() => {
                              setEditingExperience(experience.id);
                              setEditingExperienceData({ ...experience });
                              // TODO: Switch to experience form tab
                            }}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateExperience(experience.id, { isVisible: !experience.isVisible })}
                            >
                              {experience.isVisible === false ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateExperience(experience.id, { portfolioHighlight: !experience.portfolioHighlight })}
                            >
                              <Star className={`h-4 w-4 ${experience.portfolioHighlight ? 'fill-current text-purple-500' : ''}`} />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                if (confirm('Are you sure you want to delete this experience?')) {
                                  deleteExperience(experience.id);
                                }
                              }}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="border-0 shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  Portfolio Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Analytics dashboard coming soon...
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="export" className="space-y-6">
            <ExportManager />
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <Card className="border-0 shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Project Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading projects...</div>
                ) : !projects.length ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No projects found. Upload your portfolio data or add your first project to get started.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {projects.map((project) => (
                      <div key={project.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              {project.logo && (
                                <img src={project.logo} alt="" className="w-6 h-6 object-contain" />
                              )}
                              <h3 className="font-semibold text-lg">{project.title}</h3>
                              <div className="flex gap-2">
                                {project.featured && (
                                  <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                                    <Star className="h-3 w-3 mr-1" />
                                    Featured
                                  </Badge>
                                )}
                                <Badge variant="outline">{project.category}</Badge>
                                {project.disabled && (
                                  <Badge variant="secondary" className="bg-red-500/10 text-red-600">
                                    <EyeOff className="h-3 w-3 mr-1" />
                                    Hidden
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <p className="text-muted-foreground">{project.description}</p>
                            {project.technologies && project.technologies.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {project.technologies.slice(0, 5).map((tech, i) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {tech}
                                  </Badge>
                                ))}
                                {project.technologies.length > 5 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{project.technologies.length - 5} more
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {project.liveUrl && (
                              <Button size="sm" variant="outline" asChild>
                                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                                  <Globe className="h-4 w-4" />
                                </a>
                              </Button>
                            )}
                            {project.githubUrl && (
                              <Button size="sm" variant="outline" asChild>
                                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                  <Github className="h-4 w-4" />
                                </a>
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => startEditingProject(project)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateProject(project.id, { disabled: !project.disabled })}
                            >
                              {project.disabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateProject(project.id, { featured: !project.featured })}
                            >
                              <Star className={`h-4 w-4 ${project.featured ? 'fill-current text-yellow-500' : ''}`} />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteProject(project.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
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
            <Card className="border-0 shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {editingSkill ? (
                    <>
                      <EditIcon className="h-5 w-5" />
                      Edit Skill
                    </>
                  ) : (
                    <>
                      <PlusIcon className="h-5 w-5" />
                      Add Skill
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form 
                  className="space-y-6" 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!editingSkillData) return;
                    
                    if (editingSkill) {
                      updateSkill(editingSkill, editingSkillData);
                    } else {
                      addSkill(editingSkillData);
                    }
                    
                    setEditingSkill(null);
                    setEditingSkillData(null);
                  }}
                >
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="skill-name">Skill Name *</Label>
                      <Input
                        id="skill-name"
                        value={editingSkillData?.name || ""}
                        onChange={(e) => setEditingSkillData({
                          ...editingSkillData!,
                          name: e.target.value
                        })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="skill-category">Category *</Label>
                      <Select
                        value={editingSkillData?.category || "technical"}
                        onValueChange={(value) => setEditingSkillData({
                          ...editingSkillData!,
                          category: value as SkillCategory
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technical">Technical</SelectItem>
                          <SelectItem value="framework">Framework</SelectItem>
                          <SelectItem value="language">Language</SelectItem>
                          <SelectItem value="tool">Tool</SelectItem>
                          <SelectItem value="methodology">Methodology</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="skill-proficiency">Proficiency (1-100)</Label>
                      <div className="flex items-center gap-4">
                        <Input
                          id="skill-proficiency"
                          type="number"
                          min="1"
                          max="100"
                          value={editingSkillData?.proficiency || 50}
                          onChange={(e) => setEditingSkillData({
                            ...editingSkillData!,
                            proficiency: parseInt(e.target.value) || 50
                          })}
                        />
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${editingSkillData?.proficiency || 50}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="skill-logo">Logo URL</Label>
                      <Input
                        id="skill-logo"
                        value={editingSkillData?.logo || ""}
                        onChange={(e) => setEditingSkillData({
                          ...editingSkillData!,
                          logo: e.target.value
                        })}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button type="submit" className="flex-1">
                      {editingSkill ? (
                        <><EditIcon className="h-4 w-4 mr-2" /> Update Skill</>
                      ) : (
                        <><PlusIcon className="h-4 w-4 mr-2" /> Add Skill</>
                      )}
                    </Button>
                    {editingSkill && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setEditingSkill(null);
                          setEditingSkillData(null);
                        }}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>

                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Skill List</h3>
                  {skillsLoading ? (
                    <div className="text-center py-4">Loading skills...</div>
                  ) : (
                    <div className="space-y-3">
                      {skills.map((skill) => (
                        <div 
                          key={skill.id} 
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            {skill.logo && (
                              <img src={skill.logo} alt={skill.name} className="w-6 h-6 object-contain" />
                            )}
                            <div>
                              <div className="font-medium">{skill.name}</div>
                              <div className="text-xs text-muted-foreground capitalize">{skill.category}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{skill.proficiency}%</Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingSkill(skill.id);
                                setEditingSkillData(skill);
                              }}
                            >
                              <EditIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteSkill(skill.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
