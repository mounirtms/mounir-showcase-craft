import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getSkillIcon } from "@/lib/skill-icons";
import { Code, Server, Cloud, Database, Globe, Users } from "lucide-react";
import { useEffect, useRef } from "react";
import { useInView, motion, useAnimation } from "framer-motion";
import { cn } from "@/lib/utils";

const SkillProgress = ({ name, level, index = 0 }: { name: string; level: number; index?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const isInView = useInView(ref, { once: true, margin: "-80px 0px -80px 0px" });

  useEffect(() => {
    if (isInView) {
      const delay = index * 100; // Stagger animations
      controls.start({
        width: `${level}%`,
        opacity: 1,
        transition: {
          duration: 1.2,
          delay: delay / 1000,
          ease: [0.23, 1, 0.320, 1] // Custom easing for smoother animation
        }
      });
    }
  }, [isInView, level, controls, index]);

  return (
    <motion.div 
      ref={ref} 
      className="space-y-2 sm:space-y-3"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: (index * 50) / 1000 }}
    >
      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center gap-2 sm:gap-3">
          <motion.div 
            className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center p-1 bg-primary/10 rounded-md"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {getSkillIcon(name)}
          </motion.div>
          <span className="font-medium text-foreground text-sm sm:text-base">{name}</span>
        </div>
        <motion.span 
          className="text-muted-foreground font-semibold text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 bg-secondary/30 rounded-full"
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ duration: 0.3, delay: (index * 80) / 1000 }}
        >
          {level}%
        </motion.span>
      </div>
      <div className="relative h-2 sm:h-2.5 bg-secondary/30 rounded-full overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-primary/80 rounded-full shadow-sm"
          initial={{ width: "0%", opacity: 0.7 }}
          animate={controls}
          style={{
            boxShadow: "0 0 10px hsla(var(--primary), 0.3)"
          }}
        />
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-white/20 to-transparent rounded-full"
          initial={{ width: "0%" }}
          animate={isInView ? { width: `${level}%` } : {}}
          transition={{ 
            duration: 1.2, 
            delay: (index * 100) / 1000 + 0.2,
            ease: [0.23, 1, 0.320, 1]
          }}
        />
      </div>
    </motion.div>
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
        { name: "HTML5/CSS3", level: 90 },
        { name: "Tailwind CSS", level: 85 }
      ]
    },
    {
      icon: Server,
      title: "Backend Development", 
      skills: [
        { name: "Node.js", level: 85 },
        { name: "PHP", level: 80 },
        { name: "Python", level: 75 },
        { name: "Java", level: 70 },
        { name: "RESTful APIs", level: 90 }
      ]
    },
    {
      icon: Cloud,
      title: "Cloud & DevOps",
      skills: [
        { name: "AWS", level: 80 },
        { name: "Docker", level: 75 },
        { name: "GitLab CI/CD", level: 85 },
        { name: "Git", level: 90 },
        { name: "Terraform", level: 70 }
      ]
    },
    {
      icon: Database,
      title: "Data & Integration",
      skills: [
        { name: "API Development", level: 90 },
        { name: "ETL Pipelines", level: 85 },
        { name: "Machine Learning", level: 70 },
        { name: "ERP/CRM Systems", level: 85 },
        { name: "MongoDB", level: 80 }
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
    "PostgreSQL", "GitLab CI/CD", "JIRA", "Cegid ERP", "Tailwind CSS",
    "REST APIs", "Terraform", "Kubernetes"
  ];

  return (
    <section 
      ref={sectionRef}
      id="skills" 
      className={cn(
        "py-16 md:py-24 px-4 sm:px-6 scroll-mt-20 relative",
        "bg-gradient-to-br from-background via-background to-muted/20"
      )}
    >
      <div className="max-w-6xl mx-auto space-y-12 md:space-y-20">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Technical <span className="text-primary">Expertise</span>
          </motion.h2>
          <motion.p 
            className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            A comprehensive toolkit built through years of hands-on experience and continuous learning
          </motion.p>
          <motion.div
            className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0 rounded-full"
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1, delay: 0.6 }}
          />
        </motion.div>

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
                <Card className="group h-full modern-card hover:shadow-glow transition-all duration-500 hover:scale-[1.02] border border-border/20 bg-card/80 backdrop-blur-md">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-4">
                      <motion.div 
                        className="p-3 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300 shadow-sm"
                        whileHover={{ scale: 1.05, rotate: 3 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <Icon className="h-5 w-5 text-primary drop-shadow-sm" />
                      </motion.div>
                      <CardTitle className="text-lg font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                        {category.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    {category.skills.map((skill, skillIndex) => (
                      <SkillProgress key={skillIndex} name={skill.name} level={skill.level} index={skillIndex} />
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