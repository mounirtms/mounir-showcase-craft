import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Github, ArrowRight } from "lucide-react";

export const Projects = () => {
  const projects = [
    {
      title: "ERP-Magento Integration Platform",
      description: "Enterprise-grade integration system connecting Cegid ERP with Magento 2, enabling real-time inventory synchronization across 25+ retail sources.",
      category: "Enterprise Integration",
      achievements: [
        "Reduced inventory errors by 40%",
        "Real-time sync across 25+ sources",
        "Improved stock accuracy by 40%",
        "Scalable ETL architecture"
      ],
      technologies: ["Magento 2", "Cegid ERP", "PHP", "API Development", "ETL"],
      image: "/placeholder-project.svg",
      liveUrl: "#",
      githubUrl: "#",
      featured: true
    },
    {
      title: "OTELLO Hospitality Platform",
      description: "Modern web application serving 100+ hotels with advanced dashboard and analytics capabilities, achieving 90+ Lighthouse performance scores.",
      category: "Web Application",
      achievements: [
        "Serving 100+ hotels globally",
        "Lighthouse 90+ performance",
        "30% faster release cycles",
        "Improved client satisfaction"
      ],
      technologies: ["React", "Node.js", "AWS", "GitLab CI/CD", "JavaScript"],
      image: "/placeholder-project.svg",
      liveUrl: "#",
      githubUrl: "#",
      featured: true
    },
    {
      title: "Educaper ML Analytics",
      description: "AI-driven education analytics platform built in collaboration with Istanbul Technical University, reaching 5,000+ mobile app users.",
      category: "Machine Learning",
      achievements: [
        "5,000+ active users",
        "ML-driven insights",
        "University partnership",
        "Mobile app deployment"
      ],
      technologies: ["React Native", "Python", "Machine Learning", "Node.js", "MongoDB"],
      image: "/placeholder-project.svg",
      liveUrl: "#",
      githubUrl: "#",
      featured: true
    },
    {
      title: "E-commerce Solutions Portfolio",
      description: "Collection of custom e-commerce platforms and integrations built for various clients, featuring payment gateways and CRM connections.",
      category: "E-commerce",
      achievements: [
        "Multiple client deployments",
        "Payment gateway integrations",
        "CRM system connections",
        "Custom reporting dashboards"
      ],
      technologies: ["Magento", "WordPress", "PHP", "JavaScript", "MySQL"],
      image: "/placeholder-project.svg",
      liveUrl: "#",
      githubUrl: "#",
      featured: false
    }
  ];

  const categories = ["All", "Enterprise Integration", "Web Application", "Machine Learning", "E-commerce"];

  return (
    <section id="projects" className="py-24 px-6 bg-gradient-subtle">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Featured <span className="text-primary">Projects</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real-world solutions that drive business value and user satisfaction
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-16">
          {categories.map((category, index) => (
            <Button 
              key={index} 
              variant={index === 0 ? "default" : "outline"}
              className="hover:scale-105 transition-transform duration-300"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Featured Projects Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {projects.filter(p => p.featured).map((project, index) => (
            <Card key={index} className="group hover:shadow-glow transition-all duration-500 hover:scale-[1.02] border-0 shadow-medium overflow-hidden">
              <div className="aspect-video bg-gradient-primary/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <div className="text-6xl font-mono text-primary/30">{"</>"}</div>
                </div>
                <div className="absolute top-4 left-4">
                  <Badge className="bg-primary/90 text-primary-foreground">
                    {project.category}
                  </Badge>
                </div>
              </div>
              
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors">
                  {project.title}
                </CardTitle>
                <p className="text-muted-foreground leading-relaxed">
                  {project.description}
                </p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3 text-foreground">Key Achievements</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {project.achievements.map((achievement, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                        <span className="text-muted-foreground">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 text-foreground">Technologies</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, i) => (
                      <Badge key={i} variant="outline" className="text-xs hover:bg-primary/10">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-4 pt-4">
                  <Button size="sm" className="flex-1 group/btn">
                    <span>View Project</span>
                    <ExternalLink className="ml-2 h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 group/btn">
                    <Github className="mr-2 h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                    <span>Code</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Other Projects */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-center mb-8">Other Notable Projects</h3>
          <div className="grid gap-6">
            {projects.filter(p => !p.featured).map((project, index) => (
              <Card key={index} className="group hover:shadow-medium transition-all duration-300 border-0 shadow-soft">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className="text-xs">
                          {project.category}
                        </Badge>
                        <h4 className="text-xl font-bold group-hover:text-primary transition-colors">
                          {project.title}
                        </h4>
                      </div>
                      <p className="text-muted-foreground">{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.slice(0, 4).map((tech, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="group/btn">
                        <span>View</span>
                        <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-20">
          <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-12 shadow-medium border-0">
            <h3 className="text-3xl font-bold mb-6">Ready to Build Something Amazing?</h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Let's discuss your next project and create solutions that drive real business results.
            </p>
            <Button size="lg" className="text-lg px-10 py-4 shadow-glow hover:shadow-large transition-all duration-300 hover:scale-105">
              <span>Start a Conversation</span>
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
