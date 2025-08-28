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
import { trackButtonClick } from "@/utils/analytics";

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
  className,
  config: userConfig, 
  adminSettings = { showTestimonials: true, showContactForm: true, enableAnimations: true } 
}) => {
  const [activeSection, setActiveSection] = useState("hero");
  const [animationsEnabled, setAnimationsEnabled] = useState(adminSettings.enableAnimations);
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [showContactForm, setShowContactForm] = useState(adminSettings.showContactForm);

  const sectionsRef = useRef<{ [key: string]: HTMLElement | null }>({});

  const config = useMemo(() => {
    const mergedConfig = { ...portfolioConfig, ...userConfig };
    
    if (userConfig?.hero) {
      mergedConfig.hero = { ...portfolioConfig.hero, ...userConfig.hero };
    }
    if (userConfig?.skills) {
      mergedConfig.skills = { ...portfolioConfig.skills, ...userConfig.skills };
    }
    if (userConfig?.projects) {
      mergedConfig.projects = { ...portfolioConfig.projects, ...userConfig.projects };
    }
    if (userConfig?.experience) {
      mergedConfig.experience = { ...portfolioConfig.experience, ...userConfig.experience };
    }
    if (userConfig?.testimonials) {
      mergedConfig.testimonials = userConfig.testimonials;
    }

    return mergedConfig;
  }, [userConfig]);

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

  // State for contact details visibility
  const [showContactDetails, setShowContactDetails] = useState(false);

  return (
    <div className={cn("relative", className)}>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-gradient-to-r from-amber-400/10 to-orange-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-6s' }} />
      </div>

      {/* Hero Section with Parallax */}
      <ScrollAnimation animation="fadeIn">
        <Parallax speed={0.5}>
          <HeroSection 
            name={config.hero.name}
            title={config.hero.titles[currentTitleIndex]}
            description={config.hero.description}
            location={config.hero.location}
            skills={["ETL Architecture", "Data Integration", "Full-Stack Development", "Cloud Solutions"]}
            socialLinks={{
              github: "https://github.com/mounir1",
              linkedin: "https://linkedin.com/in/mounir1badi",
              email: "mailto:mounir.webdev@gmail.com",
              resume: "/Mounir_CV_2025.pdf"
            }}
            avatar={config.hero.avatar}
            enableParticles={animationsEnabled}
            enableTypingEffect={animationsEnabled}
            className="pt-24 pb-16 sm:pt-32 sm:pb-24"
          />
        </Parallax>
      </ScrollAnimation>

      {/* Skills Section */}
      <section id="skills" className="py-16 sm:py-24 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <ScrollAnimation animation="slideInUp">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent font-heading tracking-tight mb-3">
                Technical Expertise
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto font-sans">
                Specialized skills in ETL platforms, data integration, and full-stack development
              </p>
            </div>
          </ScrollAnimation>

          <SkillVisualization 
            categories={config.skills.categories}
            layout="circles"
            defaultCategory="Frontend"
            className="mb-16"
          />

          {/* Stats Section */}
          <ScrollAnimation animation="fadeIn">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
              {Object.entries(config.hero.stats).map(([key, value], index) => (
                <div 
                  key={index} 
                  className="glass-card p-4 sm:p-6 rounded-xl text-center border border-border/50 hover:border-primary/30 transition-all duration-300 hover-lift"
                >
                  <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">{value}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                </div>
              ))}
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Experience Timeline */}
      <section id="experience" className="py-16 sm:py-24 bg-gradient-to-br from-card/30 via-card/50 to-card/30 backdrop-blur-sm border-y border-border/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <ScrollAnimation animation="slideInUp">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent font-heading tracking-tight mb-3">
                Professional Journey
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto font-sans">
                Key milestones and achievements in my career
              </p>
            </div>
          </ScrollAnimation>

          <div className="grid lg:grid-cols-3 gap-8 sm:gap-12">
            <div className="lg:col-span-2">
              <InteractiveTimeline 
                items={config.experience.timeline}
                className="h-full"
              />
            </div>
            
            <div className="space-y-6">
              <h3 className="text-xl sm:text-2xl font-bold font-heading">Key Achievements</h3>
              <div className="space-y-4">
                {config.experience.achievements.map((achievement, index) => (
                  <ScrollAnimation key={index} animation="fadeIn" delay={index * 100}>
                    <div className="glass-card p-4 sm:p-5 rounded-xl border border-border/50 hover:border-primary/30 transition-all duration-300">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 text-primary">
                          {achievement.icon}
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground mb-1">{achievement.title}</h4>
                          <p className="text-sm sm:text-base text-muted-foreground mb-2">{achievement.description}</p>
                          <div className="text-xs font-medium text-primary">{achievement.year}</div>
                        </div>
                      </div>
                    </div>
                  </ScrollAnimation>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Showcase */}
      <section id="projects" className="py-16 sm:py-24 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <ScrollAnimation animation="slideInUp">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent font-heading tracking-tight mb-3">
                Featured Projects
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto font-sans">
                Enterprise solutions and innovative applications
              </p>
            </div>
          </ScrollAnimation>

          <ProjectShowcase 
            projects={config.projects.featured}
            className="mb-12"
          />

          <ScrollAnimation animation="fadeIn">
            <div className="text-center">
              <Button size="lg" className="shadow-glow hover:shadow-large transition-all duration-300" asChild>
                <a href="#contact">
                  <Mail className="w-5 h-5 mr-2" />
                  Discuss Your Project
                </a>
              </Button>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Testimonials */}
      {adminSettings.showTestimonials && (
        <section className="py-16 sm:py-24 bg-gradient-to-br from-card/30 via-card/50 to-card/30 backdrop-blur-sm border-y border-border/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <ScrollAnimation animation="slideInUp">
              <div className="text-center mb-12 sm:mb-16">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent font-heading tracking-tight mb-3">
                  Client Testimonials
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto font-sans">
                  What industry leaders say about working with me
                </p>
              </div>
            </ScrollAnimation>

            <TestimonialsCarousel testimonials={config.testimonials} />
          </div>
        </section>
      )}

      {/* Contact Section */}
      {adminSettings.showContactForm && (
        <section id="contact" className="py-16 sm:py-24 relative">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <ScrollAnimation animation="slideInUp">
              <div className="text-center mb-12 sm:mb-16">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent font-heading tracking-tight mb-3">
                  Get In Touch
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto font-sans">
                  Let's discuss how I can help transform your data challenges into scalable solutions
                </p>
              </div>
            </ScrollAnimation>

            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
              <div>
                <ContactForm />
              </div>
              
              <div className="space-y-6">
                <h3 className="text-xl sm:text-2xl font-bold font-heading">Get In Touch</h3>
                
                {showContactDetails ? (
                  <>
                    <p className="text-muted-foreground font-sans">
                      I'm always interested in discussing new opportunities, innovative projects, 
                      and ways to solve complex data challenges. Reach out and let's start a conversation.
                    </p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                          <Mail className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-medium">Email</div>
                          <a href="mailto:mounir.webdev@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">
                            mounir.webdev@gmail.com
                          </a>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-medium">Location</div>
                          <div className="text-muted-foreground">Algeria • Remote Worldwide</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Button 
                        size="lg" 
                        variant="outline" 
                        className="shadow-medium hover:shadow-large transition-all duration-300"
                        asChild
                        onClick={() => trackButtonClick('download_cv')}
                      >
                        <a href="/Mounir_CV_2025.pdf" download>
                          <Download className="w-5 h-5 mr-2" />
                          Download CV
                        </a>
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="pt-4">
                    <Button 
                      size="lg" 
                      onClick={() => {
                        setShowContactDetails(true);
                        trackButtonClick('show_contact_details');
                      }}
                      className="shadow-medium hover:shadow-large transition-all duration-300"
                    >
                      Show Contact Details
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default EnhancedPortfolioIntegration;