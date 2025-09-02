import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getSkillIcon } from "@/lib/skill-icons";
import { Code, Server, Cloud, Database, Globe, Users } from "lucide-react";
import { useEffect, useRef } from "react";
import { useInView, motion } from "framer-motion";
import { cn } from "@/lib/utils";

const SkillProgress = ({ name, level }: { name: string; level: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px 0px -50px 0px" });

  return (
    <div ref={ref} className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 flex items-center justify-center">
            {getSkillIcon(name)}
          </div>
          <span className="font-medium">{name}</span>
        </div>
        <span className="text-muted-foreground font-medium">{level}%</span>
      </div>
      <Progress 
        value={isInView ? level : 0} 
        className="h-2 bg-secondary/20 transition-all duration-1000 ease-out"
        style={{
          '--progress-color': `hsl(var(--primary))`,
        } as React.CSSProperties}
      />
    </div>
  );
};

export const Skills = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px 0px -100px 0px" });

  useEffect(() => {
    if (isInView && sectionRef.current) {
      sectionRef.current.style.scrollMarginTop = '80px';
    }
  }, [isInView]);
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
    <section 
      ref={sectionRef}
      id="skills" 
      className={cn(
        "py-16 md:py-24 px-4 sm:px-6 scroll-mt-20 transition-opacity duration-700",
        isInView ? "opacity-100" : "opacity-0 translate-y-8"
      )}
    >
      <div className="max-w-6xl mx-auto space-y-12 md:space-y-20">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Technical <span className="text-primary">Expertise</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A comprehensive toolkit built through years of hands-on experience and continuous learning
          </p>
        </div>

        {/* Core Skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skillCategories.map((category, index) => {
            const Icon = category.icon;
            const delay = index * 100;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: delay / 1000 }}
              >
                <Card className="group h-full hover:shadow-glow transition-all duration-300 hover:shadow-lg border-0 shadow-sm bg-card/50 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg font-bold">{category.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {category.skills.map((skill, skillIndex) => (
                      <SkillProgress key={skillIndex} name={skill.name} level={skill.level} />
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Languages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="shadow-sm border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-primary/10 rounded-xl">
                  <Globe className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-xl font-bold">Languages</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {languages.map((lang, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.3, delay: 0.2 + (index * 0.05) }}
                    className="text-center p-4 rounded-xl bg-muted/20 hover:bg-muted/40 transition-all duration-300 group"
                    whileHover={{ y: -5, scale: 1.03 }}
                  >
                    <div className="text-2xl mb-2 transition-transform duration-300 group-hover:scale-110">
                      {lang.flag}
                    </div>
                    <div className="font-medium text-sm">{lang.name}</div>
                    <div className="text-xs text-muted-foreground">{lang.level}</div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Technologies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="shadow-sm border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-primary/10 rounded-xl">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-xl font-bold">Technologies & Tools</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.2, delay: 0.3 + (index * 0.02) }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Badge 
                      variant="outline" 
                      className="text-xs sm:text-sm py-1.5 sm:py-2 px-3 sm:px-4 hover:bg-primary/10 hover:border-primary/30 transition-all duration-300 flex items-center gap-1.5 sm:gap-2 shadow-sm"
                    >
                      <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex items-center justify-center">
                        {getSkillIcon(tech)}
                      </div>
                      <span>{tech}</span>
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};