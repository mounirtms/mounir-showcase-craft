import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, TrendingUp, Users, Award, Code } from "lucide-react";
import { Signature } from "@/components/ui/signature";

const experiences = [
  {
    id: 1,
    title: "Senior Full-Stack Developer",
    company: "Freelance",
    location: "Remote",
    period: "2020 - Present",
    type: "Freelance",
    description: "Leading full-stack development projects for international clients, specializing in enterprise solutions and modern web applications. Delivering scalable, high-performance solutions that drive business growth.",
    achievements: [
      "Delivered 50+ successful projects with 98% client satisfaction",
      "Built scalable applications serving 100K+ users",
      "Reduced client development costs by average 40%",
      "Mentored 20+ junior developers across various projects"
    ],
    technologies: ["React", "Node.js", "TypeScript", "AWS", "Docker", "Firebase", "PostgreSQL", "MongoDB"],
    current: true
  },
  {
    id: 2,
    title: "Lead Software Engineer",
    company: "TechnoSolutions",
    location: "Algiers, Algeria",
    period: "2018 - 2019",
    type: "Full-time",
    description: "Led a team of 8 developers in building enterprise-grade applications and managing complex software architecture decisions. Focused on scalable solutions and team development.",
    achievements: [
      "Increased team productivity by 60%",
      "Implemented CI/CD pipelines reducing deployment time by 80%",
      "Architected microservices handling 1M+ requests daily",
      "Established coding standards and best practices"
    ],
    technologies: ["Vue.js", "Laravel", "MySQL", "Redis", "Docker", "Jenkins", "AWS", "Nginx"],
    current: false
  },
  {
    id: 3,
    title: "Full-Stack Developer",
    company: "Digital Innovations",
    location: "Algiers, Algeria",
    period: "2016 - 2018",
    type: "Full-time",
    description: "Developed web applications and mobile solutions for various industries including e-commerce, healthcare, and education. Focused on creating user-centric solutions with modern technologies.",
    achievements: [
      "Built 25+ web applications from scratch",
      "Improved application performance by average 70%",
      "Integrated 15+ third-party APIs and services",
      "Trained team members on modern development practices"
    ],
    technologies: ["JavaScript", "PHP", "MySQL", "Bootstrap", "jQuery", "REST APIs", "Git", "Linux"],
    current: false
  }
];

export const Experience = () => {
  return (
    <section id="experience" className="py-20 px-6 bg-gradient-to-br from-card/20 via-background to-card/20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Professional Experience
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            A journey of continuous learning, innovation, and delivering exceptional results across diverse projects and technologies
          </p>
          <div className="flex justify-center mt-6">
            <Signature size="sm" className="opacity-30" />
          </div>
        </div>

        <div className="space-y-8">
          {experiences.map((experience, index) => (
            <Card key={experience.id} className="group border-0 shadow-medium hover:shadow-large transition-all duration-500 bg-card/50 backdrop-blur-sm overflow-hidden">
              <div className="flex">
                {/* Timeline indicator */}
                <div className="flex flex-col items-center mr-6 ml-6 mt-6">
                  <div className={`w-4 h-4 rounded-full border-2 ${experience.current ? 'bg-primary border-primary shadow-glow' : 'bg-background border-primary/50'} transition-all duration-300 group-hover:scale-125`} />
                  {index < experiences.length - 1 && (
                    <div className="w-0.5 h-full bg-gradient-to-b from-primary/50 to-transparent mt-2" />
                  )}
                </div>

                <div className="flex-1 py-6 pr-6">
                  <CardHeader className="pb-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                      <CardTitle className="text-2xl group-hover:text-primary transition-colors duration-300">
                        {experience.title}
                      </CardTitle>
                      {experience.current && (
                        <Badge className="w-fit bg-green-500/10 text-green-600 border-green-500/20 shadow-glow">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Current
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-3">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-primary" />
                        <span className="font-semibold text-foreground">{experience.company}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{experience.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{experience.period}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {experience.type}
                      </Badge>
                    </div>
                    
                    <CardDescription className="text-base leading-relaxed">
                      {experience.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Key Achievements */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        Key Achievements
                      </h4>
                      <div className="grid md:grid-cols-2 gap-2">
                        {experience.achievements.map((achievement, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                            <span className="text-muted-foreground">{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Technologies */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Code className="w-4 h-4 text-primary" />
                        Technologies Used
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {experience.technologies.map((tech) => (
                          <Badge key={tech} variant="outline" className="hover:bg-primary/10 transition-colors">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-6 rounded-2xl bg-card/30 backdrop-blur-sm border border-border/50 hover:shadow-medium transition-all duration-300">
            <div className="text-3xl font-bold text-primary mb-2">10+</div>
            <div className="text-sm text-muted-foreground">Years Experience</div>
          </div>
          <div className="text-center p-6 rounded-2xl bg-card/30 backdrop-blur-sm border border-border/50 hover:shadow-medium transition-all duration-300">
            <div className="text-3xl font-bold text-primary mb-2">150+</div>
            <div className="text-sm text-muted-foreground">Projects Completed</div>
          </div>
          <div className="text-center p-6 rounded-2xl bg-card/30 backdrop-blur-sm border border-border/50 hover:shadow-medium transition-all duration-300">
            <div className="text-3xl font-bold text-primary mb-2">20+</div>
            <div className="text-sm text-muted-foreground">Technologies Mastered</div>
          </div>
          <div className="text-center p-6 rounded-2xl bg-card/30 backdrop-blur-sm border border-border/50 hover:shadow-medium transition-all duration-300">
            <div className="text-3xl font-bold text-primary mb-2">10K+</div>
            <div className="text-sm text-muted-foreground">Users Served</div>
          </div>
        </div>

        {/* Professional Footer */}
        <div className="text-center mt-16 pt-8 border-t border-border/20">
          <div className="flex justify-center mb-4">
            <Signature size="md" className="opacity-40" />
          </div>
          <p className="text-sm text-muted-foreground">
            Committed to delivering excellence in every project
          </p>
        </div>
      </div>
    </section>
  );
};