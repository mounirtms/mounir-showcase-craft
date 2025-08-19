import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Calendar, Building } from "lucide-react";

export const Experience = () => {
  const experiences = [
    {
      title: "Full Stack Developer & Integration Lead",
      company: "Techno Stationery Retail Tech Project (with Clever Age)",
      period: "Nov 2024 - Present",
      location: "Freelance",
      type: "Contract",
      achievements: [
        "Architected ERP–Magento integration reducing inventory errors by 40%",
        "Engineered ETL pipelines and APIs ensuring real-time synchronization across 25+ retail sources",
        "Designed inventory platform improving stock accuracy by 40%",
        "Collaborated with Clever Age consultants on system scalability and architecture"
      ],
      technologies: ["Magento 2", "Cegid ERP", "PHP", "JavaScript", "API Development"]
    },
    {
      title: "Senior Front-End Developer / Analyst",
      company: "OTELLO Web App (Hotech)",
      period: "Feb 2018 - Present",
      location: "Remote",
      type: "Full-time",
      achievements: [
        "Led front-end design for OTELLO hospitality platform serving 100+ hotels",
        "Developed dashboards and visualization tools improving client satisfaction",
        "Deployed CI/CD pipelines with GitLab and AWS, reducing release cycles by 30%",
        "Improved performance and accessibility, achieving Lighthouse 90+ scores"
      ],
      technologies: ["React", "JavaScript", "AWS", "GitLab CI/CD", "Node.js"]
    },
    {
      title: "Co-Founder & CTO",
      company: "Educaper Startup",
      period: "Jun 2016 - Present",
      location: "Izmit, Turkey",
      type: "Founder",
      achievements: [
        "Built ML-driven education analytics tools with Istanbul Technical University",
        "Launched mobile apps reaching 5,000+ users (App Store/Play Store)",
        "Oversaw full product lifecycle from architecture to deployment",
        "Managed agile development workflow using JIRA and Bitbucket"
      ],
      technologies: ["React Native", "Machine Learning", "Python", "Node.js", "MongoDB"]
    }
  ];

  const typeColors = {
    "Contract": "bg-blue-100 text-blue-800",
    "Full-time": "bg-green-100 text-green-800", 
    "Founder": "bg-purple-100 text-purple-800"
  };

  return (
    <section id="experience" className="py-24 px-6 bg-gradient-subtle">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Professional <span className="text-primary">Experience</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A journey of building scalable solutions and driving digital transformation across industries
          </p>
        </div>
        
        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <Card key={index} className="group hover:shadow-glow transition-all duration-500 hover:scale-[1.02] border-0 shadow-medium bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="space-y-2">
                    <CardTitle className="text-2xl font-bold text-primary group-hover:text-primary/80 transition-colors">
                      {exp.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-foreground font-semibold">
                      <Building className="h-4 w-4" />
                      {exp.company}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Badge variant="secondary" className={`${typeColors[exp.type]} border-0`}>
                      {exp.type}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {exp.period}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {exp.location}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-4 text-foreground">Key Achievements</h4>
                  <ul className="grid md:grid-cols-2 gap-3">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i} className="flex items-start gap-3 group/item">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 group-hover/item:scale-125 transition-transform"></div>
                        <span className="text-muted-foreground leading-relaxed">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 text-foreground">Technologies Used</h4>
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech, i) => (
                      <Badge key={i} variant="outline" className="hover:bg-primary/10 transition-colors">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};