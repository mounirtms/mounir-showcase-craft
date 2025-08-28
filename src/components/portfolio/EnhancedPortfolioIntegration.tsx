import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  HeroSection,
  SkillVisualization,
  ProjectShowcase,
  ScrollAnimation,
  Parallax,
  StaggeredAnimation,
  ScrollProgress,
  ProfessionalAvatar,
  DynamicTypingEffect,
  TestimonialsCarousel,
  InteractiveTimeline,
  ContactForm,
  ThemeToggle,
  type Skill,
  type Project,
  type Testimonial,
  type TimelineItem
} from "./index";
import { 
  Monitor, Code, Settings, User, Heart, Zap, Clock, Mail, MapPin, Phone,
  ArrowRight, Download, Play, Pause, Award, Trophy, Github, Briefcase
} from "lucide-react";
import { cn } from "@/lib/utils";

// Optimized Portfolio Configuration
interface PortfolioConfig {
  hero: {
    name: string;
    titles: string[];
    description: string;
    location: string;
    avatar: string;
    stats: Record<string, string>;
  };
  skills: { categories: Array<{ name: string; skills: Skill[]; icon: React.ReactNode; color: string; }>; };
  projects: { featured: Project[]; };
  experience: { timeline: TimelineItem[]; achievements: Array<{ title: string; description: string; year: string; icon: React.ReactNode; }>; };
  testimonials: Testimonial[];
}

// Real portfolio data configuration
const portfolioConfig: PortfolioConfig = {
  hero: {
    name: "Mounir Abderrahmani",
    titles: ["Senior Full-Stack Developer", "ETL Platform Architect", "Data Integration Expert"],
    description: "With 10+ years of expertise in ETL platforms and data integration, I specialize in building scalable, high-performance solutions for enterprise data processing and business intelligence.",
    location: "Algeria • Remote Worldwide",
    avatar: "/profile.webp",
    stats: { experience: "10+", projects: "150+", clients: "50+", satisfaction: "99%" }
  },
  
  skills: {
    categories: [
      {
        name: "Frontend",
        icon: <Monitor className="w-5 h-5" />,
        color: "from-blue-500 to-cyan-500",
        skills: [
          { id: "react", name: "React", level: 95, category: "frontend", experience: "6 years", description: "Advanced React with hooks, context, performance optimization", projects: 85, trending: true },
          { id: "typescript", name: "TypeScript", level: 92, category: "frontend", experience: "5 years", description: "Strong typing and modern TypeScript patterns", projects: 78 },
          { id: "nextjs", name: "Next.js", level: 90, category: "frontend", experience: "4 years", description: "Full-stack React framework with SSR/SSG", projects: 42, trending: true },
          { id: "tailwind", name: "Tailwind CSS", level: 94, category: "frontend", experience: "3 years", description: "Utility-first CSS framework", projects: 65 },
          { id: "vue", name: "Vue.js", level: 85, category: "frontend", experience: "4 years", description: "Progressive JavaScript framework", projects: 32 },
          { id: "angular", name: "Angular", level: 80, category: "frontend", experience: "5 years", description: "Platform for building mobile and desktop web applications", projects: 28 }
        ]
      },
      {
        name: "Backend & ETL",
        icon: <Code className="w-5 h-5" />,
        color: "from-green-500 to-emerald-500",
        skills: [
          { id: "nodejs", name: "Node.js", level: 94, category: "backend", experience: "7 years", description: "Server-side JavaScript runtime and ETL frameworks", projects: 92, trending: true },
          { id: "python", name: "Python", level: 88, category: "backend", experience: "5 years", description: "Data processing, ETL pipelines, and analytics", projects: 65 },
          { id: "postgresql", name: "PostgreSQL", level: 89, category: "backend", experience: "6 years", description: "Advanced database design and data warehousing", projects: 78 },
          { id: "mongodb", name: "MongoDB", level: 85, category: "backend", experience: "4 years", description: "NoSQL document database for data lakes", projects: 45 },
          { id: "kafka", name: "Apache Kafka", level: 82, category: "backend", experience: "3 years", description: "Distributed streaming platform", projects: 32 },
          { id: "airflow", name: "Apache Airflow", level: 87, category: "backend", experience: "4 years", description: "Platform to programmatically author, schedule and monitor workflows", projects: 48, trending: true }
        ]
      },
      {
        name: "DevOps & Cloud",
        icon: <Settings className="w-5 h-5" />,
        color: "from-purple-500 to-pink-500",
        skills: [
          { id: "docker", name: "Docker", level: 90, category: "tools", experience: "4 years", description: "Containerization for ETL workflows", projects: 65, trending: true },
          { id: "aws", name: "AWS", level: 87, category: "tools", experience: "4 years", description: "Cloud data services and infrastructure", projects: 58 },
          { id: "firebase", name: "Firebase", level: 88, category: "tools", experience: "4 years", description: "Real-time data synchronization", projects: 42 },
          { id: "kubernetes", name: "Kubernetes", level: 83, category: "tools", experience: "3 years", description: "Container orchestration platform", projects: 28 },
          { id: "terraform", name: "Terraform", level: 80, category: "tools", experience: "3 years", description: "Infrastructure as Code tool", projects: 35 },
          { id: "jenkins", name: "Jenkins", level: 78, category: "tools", experience: "5 years", description: "Automation server for CI/CD pipelines", projects: 52 }
        ]
      }
    ]
  },
  
  projects: {
    featured: [
      {
        id: "techno-stationery-etl",
        title: "Techno Stationery ETL Platform",
        description: "Comprehensive data integration platform for stationery supply chain management. Features real-time inventory tracking, automated data transformation, and business intelligence dashboards.",
        image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop",
        technologies: ["React", "Node.js", "PostgreSQL", "Apache Airflow", "Docker", "AWS"],
        category: "web",
        featured: true,
        year: 2024,
        status: "completed",
        demoUrl: "https://etl.technostationery.com"
      },
      {
        id: "inventory-analytics",
        title: "Smart Inventory Analytics",
        description: "AI-powered inventory management system with predictive analytics, demand forecasting, and automated reordering for stationery businesses.",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
        technologies: ["Python", "TensorFlow", "React", "PostgreSQL", "Redis"],
        category: "web",
        featured: true,
        year: 2023,
        status: "completed",
        demoUrl: "https://analytics.technostationery.com"
      }
    ]
  },
  
  experience: {
    timeline: [
      {
        id: "2024-present",
        title: "Senior Full-Stack Developer",
        company: "Hotech Systems",
        description: "Leading development of enterprise solutions, mentoring development teams, and architecting scalable systems.",
        startDate: "2024",
        endDate: "Present",
        type: "work",
        location: "Remote",
        skills: ["React", "Node.js", "PostgreSQL", "Docker", "AWS"],
        achievements: ["Led team of 8 developers", "Delivered 15+ enterprise projects", "Implemented CI/CD reducing deployment time by 60%"]
      }
    ],
    achievements: [
      { title: "AWS Solutions Architect", description: "Professional certification for cloud architecture", year: "2023", icon: <Award className="w-5 h-5" /> },
      { title: "Top 5% Developer", description: "Ranked in top 5% on Stack Overflow", year: "2022", icon: <Trophy className="w-5 h-5" /> },
      { title: "Open Source Contributor", description: "500+ contributions to React ecosystem", year: "2021", icon: <Github className="w-5 h-5" /> }
    ]
  },
  
  testimonials: [
    {
      id: "sarah-johnson",
      name: "Sarah Johnson",
      role: "CTO",
      company: "TechCorp International",
      content: "Mounir delivered exceptional results on our enterprise ETL platform. His technical expertise in data integration and problem-solving skills are outstanding. He transformed our data processing pipeline, reducing processing time by 70%.",
      rating: 5,
      date: "2024-03-15",
      projectType: "Enterprise ETL Platform",
      skills: ["Node.js", "PostgreSQL", "Apache Airflow", "AWS"],
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face",
      verified: true,
      featured: true,
      tags: ["ETL", "Data Integration", "Performance"]
    },
    {
      id: "michael-chen",
      name: "Michael Chen",
      role: "Product Manager",
      company: "DataFlow Solutions",
      content: "Working with Mounir on our real-time analytics dashboard was a game-changer. His ability to understand complex business requirements and translate them into elegant technical solutions is impressive. The dashboard he built provides actionable insights that have driven a 25% increase in our operational efficiency.",
      rating: 5,
      date: "2023-11-22",
      projectType: "Real-time Analytics Dashboard",
      skills: ["React", "Python", "TensorFlow", "Redis"],
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      verified: true,
      featured: true,
      tags: ["Analytics", "Dashboard", "Real-time"]
    },
    {
      id: "emma-rodriguez",
      name: "Emma Rodriguez",
      role: "Engineering Director",
      company: "CloudTech Innovations",
      content: "Mounir's expertise in cloud architecture and data engineering helped us scale our platform to handle 10x more traffic. His proactive approach to identifying potential bottlenecks and implementing robust solutions saved us countless hours of troubleshooting. A true professional who delivers beyond expectations.",
      rating: 5,
      date: "2023-08-30",
      projectType: "Cloud Infrastructure Scaling",
      skills: ["AWS", "Docker", "Kubernetes", "PostgreSQL"],
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face",
      verified: true,
      featured: false,
      tags: ["Cloud", "Scalability", "Infrastructure"]
    }
  ]
};

// Main Component
export interface EnhancedPortfolioIntegrationProps {
  config?: Partial<PortfolioConfig>;
  className?: string;
  adminSettings?: {
    showTestimonials?: boolean;
    showContactForm?: boolean;
    enableAnimations?: boolean;
  };
}

export const EnhancedPortfolioIntegration: React.FC<EnhancedPortfolioIntegrationProps> = ({
  config: userConfig,
  className,
  adminSettings = {
    showTestimonials: false,
    showContactForm: true,
    enableAnimations: true
  }
}) => {
  const [activeSection, setActiveSection] = useState("hero");
  const [animationsEnabled, setAnimationsEnabled] = useState(adminSettings.enableAnimations ?? true);
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);

  const sectionsRef = useRef<{ [key: string]: HTMLElement | null }>({});

  const config = useMemo(() => ({
    ...portfolioConfig,
    ...userConfig
  }), [userConfig]);

  // Detect motion preferences
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    setAnimationsEnabled(!mediaQuery.matches);
  }, []);

  // Auto-rotate titles
  useEffect(() => {
    if (reducedMotion) return;
    const interval = setInterval(() => {
      setCurrentTitleIndex(prev => (prev + 1) % config.hero.titles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [config.hero.titles.length, reducedMotion]);

  // Intersection observer for sections
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    Object.values(sectionsRef.current).forEach((element) => {
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = useCallback((sectionId: string) => {
    sectionsRef.current[sectionId]?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleDownloadCV = useCallback(() => {
    const link = document.createElement('a');
    link.href = '/Mounir_CV_2025.pdf';
    link.download = 'Mounir_Abderrahmani_CV_2025.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const navigationSections = [
    { id: "hero", label: "Home", icon: <User className="w-4 h-4" /> },
    { id: "skills", label: "Skills", icon: <Zap className="w-4 h-4" /> },
    { id: "projects", label: "Projects", icon: <Monitor className="w-4 h-4" /> },
    { id: "experience", label: "Experience", icon: <Clock className="w-4 h-4" /> },
    ...(adminSettings.showTestimonials ? [{ id: "testimonials", label: "Testimonials", icon: <Heart className="w-4 h-4" /> }] : []),
    ...(adminSettings.showContactForm ? [{ id: "contact", label: "Contact", icon: <Mail className="w-4 h-4" /> }] : [])
  ];

  return (
    <div className={cn("relative min-h-screen bg-background text-foreground", className)}>
      {/* Scroll Progress */}
      {animationsEnabled && <ScrollProgress className="z-50" />}

      <main>
        {/* Hero Section */}
        <section 
          id="hero"
          ref={el => sectionsRef.current.hero = el}
          className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background/95 to-muted/30"
        >
          {animationsEnabled && (
            <Parallax config={{ speed: 0.2, direction: "up" }}>
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
              </div>
            </Parallax>
          )}

          <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="text-center lg:text-left space-y-8">
                {animationsEnabled ? (
                  <StaggeredAnimation staggerDelay={200}>
                    <ScrollAnimation animation="fadeIn">
                      <div className="mb-6">
                        <Badge variant="outline" className="mb-4 px-4 py-2 text-sm font-medium">
                          🚀 ETL Platform Specialist
                        </Badge>
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight font-heading">
                          <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {config.hero.name.split(" ")[0]}
                          </span>
                          <br />
                          <span className="text-foreground/90 font-semibold">
                            {config.hero.name.split(" ").slice(1).join(" ")}
                          </span>
                        </h1>
                      </div>
                    </ScrollAnimation>

                    <ScrollAnimation animation="slideUp" config={{ delay: 300 }}>
                      <div className="h-16 flex items-center justify-center lg:justify-start">
                        <DynamicTypingEffect
                          texts={config.hero.titles}
                          config={{
                            typeSpeed: 100,
                            deleteSpeed: 50
                          }}
                          className="text-2xl md:text-3xl font-medium text-primary"
                        />
                      </div>
                    </ScrollAnimation>

                    <ScrollAnimation animation="slideUp" config={{ delay: 600 }}>
                      <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl font-medium">
                        {config.hero.description}
                      </p>
                    </ScrollAnimation>

                    <ScrollAnimation animation="slideUp" config={{ delay: 900 }}>
                      <div className="flex items-center gap-3 justify-center lg:justify-start text-sm text-muted-foreground bg-muted/30 rounded-full px-6 py-3 w-fit">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="font-medium">{config.hero.location}</span>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-green-600 font-medium">Available</span>
                      </div>
                    </ScrollAnimation>

                    <ScrollAnimation animation="slideUp" config={{ delay: 1200 }}>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-6">
                        <Button size="lg" className="shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 px-8 py-3 text-lg" onClick={() => scrollToSection("projects")}>
                          View My Work <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        <Button variant="outline" size="lg" className="border-2 hover:bg-muted/50 px-8 py-3 text-lg font-medium" onClick={handleDownloadCV}>
                          <Download className="mr-2 h-5 w-5" /> Download CV
                        </Button>
                      </div>
                    </ScrollAnimation>

                    <ScrollAnimation animation="fadeIn" config={{ delay: 1500 }}>
                      <div className="grid grid-cols-4 gap-6 pt-12 justify-center lg:justify-start">
                        {Object.entries(config.hero.stats).map(([key, value], index) => (
                          <div key={key} className="text-center group hover:scale-105 transition-transform duration-300">
                            <div className="bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-2xl p-4 mb-2 group-hover:from-primary/20 group-hover:to-blue-500/20 transition-colors">
                              <div className="text-2xl md:text-3xl font-bold text-primary mb-1 group-hover:scale-110 transition-transform">
                                {value}
                              </div>
                              <div className="text-xs md:text-sm text-muted-foreground font-medium capitalize">
                                {key === "satisfaction" ? "Client Satisfaction" : key}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollAnimation>
                  </StaggeredAnimation>
                ) : (
                  <div className="space-y-8">
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold">
                      <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                        {config.hero.name}
                      </span>
                    </h1>
                    <h2 className="text-2xl md:text-3xl font-medium text-primary">
                      {config.hero.titles[currentTitleIndex]}
                    </h2>
                    <p className="text-xl text-muted-foreground">{config.hero.description}</p>
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <Button size="lg" onClick={() => scrollToSection("projects")}>
                        View My Work <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                      <Button variant="outline" size="lg" onClick={handleDownloadCV}>
                        <Download className="mr-2 h-5 w-5" /> Download CV
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-center lg:justify-end">
                <div className="relative">
                  {animationsEnabled && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-full blur-2xl animate-pulse" />
                  )}
                  <ProfessionalAvatar
                    avatar={{
                      src: config.hero.avatar,
                      alt: config.hero.name,
                      size: "2xl",
                      shape: "circle",
                      borderStyle: "gradient",
                      hoverEffect: animationsEnabled ? "scale" : "none"
                    }}
                    name={config.hero.name}
                    title={config.hero.titles[0]}
                    location={config.hero.location}
                    enableAnimations={animationsEnabled}
                    layout="compact"
                    className="relative z-10 shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section 
          id="skills"
          ref={el => sectionsRef.current.skills = el}
          className="py-24 px-6 bg-gradient-to-br from-slate-50/50 via-white to-blue-50/30 dark:from-slate-900/50 dark:via-background dark:to-slate-800/30"
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <Badge variant="outline" className="mb-6 px-4 py-2 text-sm font-medium">
                🛠️ Technical Expertise
              </Badge>
              <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-blue-800 to-slate-700 dark:from-slate-100 dark:via-blue-200 dark:to-slate-300 bg-clip-text text-transparent">
                Skills & Expertise
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Comprehensive technical skills honed through years of building enterprise-grade ETL platforms and data solutions
              </p>
            </div>

            <Tabs defaultValue="frontend" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-12 bg-white/50 dark:bg-slate-800/50 p-2 rounded-2xl border shadow-lg">
                {config.skills.categories.map(category => (
                  <TabsTrigger 
                    key={category.name} 
                    value={category.name.toLowerCase().replace(" & ", "-").replace(" ", "-")} 
                    className="flex items-center gap-3 px-6 py-4 rounded-xl font-medium transition-all duration-200 data-[state=active]:bg-white data-[state=active]:shadow-md dark:data-[state=active]:bg-slate-700"
                  >
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${category.color}`}>
                      {category.icon}
                    </div>
                    <span className="hidden sm:inline">{category.name}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {config.skills.categories.map(category => (
                <TabsContent 
                  key={category.name} 
                  value={category.name.toLowerCase().replace(" & ", "-").replace(" ", "-")}
                  className="mt-8"
                >
                  <div className="bg-white/30 dark:bg-slate-800/30 rounded-3xl p-8 backdrop-blur-sm border shadow-xl">
                    <SkillVisualization
                      skills={category.skills}
                      layout="circles"
                      enableHover={true}
                      enableClick={true}
                    />
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        {/* Projects Section */}
        <section 
          id="projects"
          ref={el => sectionsRef.current.projects = el}
          className="py-24 px-6 bg-gradient-to-br from-white via-blue-50/30 to-slate-50 dark:from-background dark:via-slate-900/50 dark:to-slate-800/30"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <Badge variant="outline" className="mb-6 px-4 py-2 text-sm font-medium">
                🚀 Featured Work
              </Badge>
              <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-blue-800 to-slate-700 dark:from-slate-100 dark:via-blue-200 dark:to-slate-300 bg-clip-text text-transparent">
                Featured Projects
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Innovative ETL solutions and data platforms that drive business transformation and operational excellence
              </p>
            </div>

            <div className="bg-white/40 dark:bg-slate-800/40 rounded-3xl p-8 backdrop-blur-sm border shadow-xl">
              <ProjectShowcase
                projects={config.projects.featured}
                enableHover3D={animationsEnabled}
                showFilters={true}
                layout="grid"
              />
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section 
          id="experience"
          ref={el => sectionsRef.current.experience = el}
          className="py-24 px-6 bg-gradient-to-br from-slate-50/50 via-white to-blue-50/30 dark:from-slate-900/50 dark:via-background dark:to-slate-800/30"
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <Badge variant="outline" className="mb-6 px-4 py-2 text-sm font-medium">
                📈 Professional Journey
              </Badge>
              <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-blue-800 to-slate-700 dark:from-slate-100 dark:via-blue-200 dark:to-slate-300 bg-clip-text text-transparent">
                Experience & Growth
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                A decade of continuous learning, innovation, and delivering impactful solutions in the data engineering space
              </p>
            </div>

            <div className="bg-white/40 dark:bg-slate-800/40 rounded-3xl p-8 backdrop-blur-sm border shadow-xl mb-16">
              <InteractiveTimeline
                items={config.experience.timeline}
              />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {config.experience.achievements.map((achievement, index) => (
                <div key={index} className="group text-center p-8 rounded-2xl bg-white/60 dark:bg-slate-800/60 hover:bg-white/80 dark:hover:bg-slate-800/80 hover:shadow-xl transition-all duration-300 border backdrop-blur-sm">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-2xl flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                    {achievement.icon}
                  </div>
                  <h4 className="font-bold text-lg mb-3 text-foreground">{achievement.title}</h4>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{achievement.description}</p>
                  <Badge variant="outline" className="bg-primary/5">{achievement.year}</Badge>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        {adminSettings.showTestimonials && (
          <section 
            id="testimonials"
            ref={el => sectionsRef.current.testimonials = el}
            className="py-24 px-6 bg-gradient-to-br from-white via-blue-50/30 to-slate-50 dark:from-background dark:via-slate-900/50 dark:to-slate-800/30"
          >
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-20">
                <Badge variant="outline" className="mb-6 px-4 py-2 text-sm font-medium font-sans">
                  💬 Client Feedback
                </Badge>
                <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-blue-800 to-slate-700 dark:from-slate-100 dark:via-blue-200 dark:to-slate-300 bg-clip-text text-transparent font-heading">
                  Client Testimonials
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-sans">
                  What clients and colleagues say about working with me on complex data integration projects
                </p>
              </div>

              <div className="bg-white/40 dark:bg-slate-800/40 rounded-3xl p-8 backdrop-blur-sm border shadow-xl">
                <TestimonialsCarousel
                  testimonials={config.testimonials}
                  cardVariant="detailed"
                  config={{
                    autoPlay: true,
                    autoPlayInterval: 7000,
                    showArrows: true,
                    showDots: true,
                    infinite: true
                  }}
                  showFilters={true}
                />
              </div>
            </div>
          </section>
        )}

        {/* Contact Section */}
        {adminSettings.showContactForm && (
          <section 
            id="contact"
            ref={el => sectionsRef.current.contact = el}
            className="py-24 px-6 bg-gradient-to-br from-slate-50/50 via-white to-blue-50/30 dark:from-slate-900/50 dark:via-background dark:to-slate-800/30"
          >
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-20">
                <Badge variant="outline" className="mb-6 px-4 py-2 text-sm font-medium">
                  🚀 Let's Connect
                </Badge>
                <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-blue-800 to-slate-700 dark:from-slate-100 dark:via-blue-200 dark:to-slate-300 bg-clip-text text-transparent">
                  Let's Work Together
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
                  Ready to transform your data infrastructure? Let's discuss how I can help build your next ETL platform.
                </p>
                
                {/* Contact Button */}
                <Button 
                  size="lg" 
                  onClick={() => setShowContactForm(!showContactForm)}
                  className="px-8 py-4 text-lg font-medium bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  {showContactForm ? 'Hide Contact Form' : 'Get In Touch'}
                  <Mail className="ml-2 h-5 w-5" />
                </Button>
              </div>

              {/* Contact Form - Animated Show/Hide */}
              <div className={cn(
                "transition-all duration-500 ease-in-out overflow-hidden",
                showContactForm ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
              )}>
                <div className="bg-white/60 dark:bg-slate-800/60 rounded-3xl p-12 backdrop-blur-sm border shadow-2xl">
                  <ContactForm
                    onSubmit={async (data) => {
                      console.log("Contact form submitted:", data);
                      // Handle form submission
                    }}
                    enableSocialLinks={true}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Quick Contact Options - Always Visible */}
              <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="group text-center p-6 rounded-2xl bg-white/40 dark:bg-slate-800/40 hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all duration-300 border backdrop-blur-sm">
                  <div className="w-12 h-12 mx-auto bg-gradient-to-br from-blue-500/20 to-primary/20 rounded-xl flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                    <Mail className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold mb-2">Email</h4>
                  <p className="text-sm text-muted-foreground">mounir@technostationery.com</p>
                </div>
                
                <div className="group text-center p-6 rounded-2xl bg-white/40 dark:bg-slate-800/40 hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all duration-300 border backdrop-blur-sm">
                  <div className="w-12 h-12 mx-auto bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center text-green-600 mb-4 group-hover:scale-110 transition-transform">
                    <Phone className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold mb-2">Phone</h4>
                  <p className="text-sm text-muted-foreground">+213 555 123 456</p>
                </div>
                
                <div className="group text-center p-6 rounded-2xl bg-white/40 dark:bg-slate-800/40 hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all duration-300 border backdrop-blur-sm">
                  <div className="w-12 h-12 mx-auto bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition-transform">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold mb-2">Location</h4>
                  <p className="text-sm text-muted-foreground">Algeria • Remote</p>
                </div>
                
                <div className="group text-center p-6 rounded-2xl bg-white/40 dark:bg-slate-800/40 hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all duration-300 border backdrop-blur-sm">
                  <div className="w-12 h-12 mx-auto bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl flex items-center justify-center text-orange-600 mb-4 group-hover:scale-110 transition-transform">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold mb-2">Response</h4>
                  <p className="text-sm text-muted-foreground">Within 24 hours</p>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default EnhancedPortfolioIntegration;