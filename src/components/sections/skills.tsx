import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Code, Server, Cloud, Database, Globe, Users } from "lucide-react";

export const Skills = () => {
  const skillCategories = [
    {
      icon: Code,
      title: "Frontend Development",
      skills: [
        { name: "React/Next.js", level: 95 },
        { name: "TypeScript", level: 90 },
        { name: "JavaScript ES6+", level: 95 },
        { name: "HTML5/CSS3", level: 90 }
      ]
    },
    {
      icon: Server,
      title: "Backend Development", 
      skills: [
        { name: "Node.js", level: 85 },
        { name: "PHP", level: 80 },
        { name: "Python", level: 75 },
        { name: "Java", level: 70 }
      ]
    },
    {
      icon: Cloud,
      title: "Cloud & DevOps",
      skills: [
        { name: "AWS", level: 80 },
        { name: "Docker", level: 75 },
        { name: "GitLab CI/CD", level: 85 },
        { name: "Git", level: 90 }
      ]
    },
    {
      icon: Database,
      title: "Data & Integration",
      skills: [
        { name: "API Development", level: 90 },
        { name: "ETL Pipelines", level: 85 },
        { name: "Machine Learning", level: 70 },
        { name: "ERP/CRM Systems", level: 85 }
      ]
    }
  ];

  const languages = [
    { name: "Amazigh", level: "Native", flag: "🔶" },
    { name: "Arabic", level: "Native", flag: "🇩🇿" },
    { name: "English", level: "Fluent", flag: "🇺🇸" },
    { name: "French", level: "Fluent", flag: "🇫🇷" },
    { name: "Turkish", level: "Proficient", flag: "🇹🇷" },
    { name: "Russian", level: "Intermediate", flag: "🇷🇺" }
  ];

  const technologies = [
    "React", "Node.js", "TypeScript", "AWS", "Docker", "Magento 2",
    "ExtJS", "Angular", "Next.js", "Python", "PHP", "MongoDB",
    "PostgreSQL", "GitLab CI/CD", "JIRA", "Cegid ERP"
  ];

  return (
    <section id="skills" className="py-24 px-6">
      <div className="max-w-6xl mx-auto space-y-20">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Technical <span className="text-primary">Expertise</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A comprehensive toolkit built through years of hands-on experience and continuous learning
          </p>
        </div>

        {/* Core Skills */}
        <div className="grid md:grid-cols-2 gap-8">
          {skillCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Card key={index} className="group hover:shadow-glow transition-all duration-500 hover:scale-[1.02] border-0 shadow-medium">
                <CardHeader className="pb-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl font-bold">{category.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skillIndex} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{skill.name}</span>
                        <span className="text-muted-foreground">{skill.level}%</span>
                      </div>
                      <Progress value={skill.level} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Languages */}
        <Card className="shadow-medium border-0">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">Languages</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {languages.map((lang, index) => (
                <div key={index} className="text-center p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors group">
                  <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                    {lang.flag}
                  </div>
                  <div className="font-medium text-sm">{lang.name}</div>
                  <div className="text-xs text-muted-foreground">{lang.level}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Technologies */}
        <Card className="shadow-medium border-0">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">Technologies & Tools</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {technologies.map((tech, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-sm py-2 px-4 hover:bg-primary/10 hover:border-primary/30 transition-all duration-300 hover:scale-105"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};