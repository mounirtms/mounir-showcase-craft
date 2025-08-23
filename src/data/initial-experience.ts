import { ExperienceInput } from "@/hooks/useExperience";

export const initialExperience: ExperienceInput[] = [
  {
    title: "Senior Full-Stack Developer",
    company: "Freelance",
    location: "Remote",
    type: "freelance",
    startDate: "2021-01-01",
    current: true,
    description: "Specialized in building scalable web applications and enterprise solutions for international clients. Focus on modern JavaScript frameworks, cloud architecture, and performance optimization.",
    achievements: [
      "Built 15+ production applications serving 100K+ users",
      "Reduced client infrastructure costs by 50% through optimization",
      "Achieved 99.9% uptime across all deployed applications",
      "Mentored 10+ junior developers",
      "Implemented CI/CD pipelines reducing deployment time by 80%"
    ],
    technologies: ["React", "Node.js", "TypeScript", "AWS", "Docker", "PostgreSQL"],
    skills: ["Full-Stack Development", "Cloud Architecture", "Team Leadership", "Performance Optimization"],
    responsibilities: [
      "Architect and develop scalable web applications",
      "Collaborate with international clients to understand requirements",
      "Design and implement database schemas and APIs",
      "Setup and maintain CI/CD pipelines",
      "Optimize application performance and user experience",
      "Mentor team members and conduct code reviews"
    ],
    featured: true,
    disabled: false,
    priority: 100,
    icon: "💼",
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    title: "Lead Frontend Developer",
    company: "HoTech Systems",
    location: "Algeria",
    type: "contract",
    startDate: "2023-06-01",
    endDate: "2024-02-15",
    current: false,
    description: "Led frontend development for enterprise integration platform, managing a team of 3 developers and implementing modern React architecture with TypeScript.",
    achievements: [
      "Led development of platform serving 10K+ users",
      "Improved application performance by 75%",
      "Implemented real-time features with WebSocket",
      "Reduced bundle size by 60% through optimization",
      "Established coding standards and best practices"
    ],
    technologies: ["React", "TypeScript", "WebSocket", "Docker", "AWS"],
    skills: ["Team Leadership", "Frontend Architecture", "Performance Optimization", "Real-time Systems"],
    responsibilities: [
      "Lead frontend development team",
      "Design component architecture and state management",
      "Implement real-time data visualization",
      "Optimize application performance",
      "Mentor junior developers"
    ],
    featured: true,
    disabled: false,
    priority: 95,
    icon: "🏢",
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    title: "Full-Stack Developer",
    company: "TechnoStationery",
    location: "Algeria",
    type: "contract",
    startDate: "2023-03-01",
    endDate: "2023-08-30",
    current: false,
    description: "Developed comprehensive e-commerce platform with payment integration, inventory management, and analytics dashboard.",
    achievements: [
      "Increased online sales by 300%",
      "Integrated 5+ payment gateways",
      "Built automated inventory management system",
      "Implemented customer analytics dashboard",
      "Achieved 2-second page load times"
    ],
    technologies: ["React", "Next.js", "Node.js", "MongoDB", "Stripe"],
    skills: ["E-commerce Development", "Payment Integration", "Database Design", "API Development"],
    responsibilities: [
      "Develop full-stack e-commerce application",
      "Integrate payment and shipping providers",
      "Design and implement database schema",
      "Build admin dashboard and analytics",
      "Optimize for performance and SEO"
    ],
    featured: true,
    disabled: false,
    priority: 90,
    icon: "🛒",
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    title: "Backend Developer",
    company: "Techno DZ",
    location: "Algeria",
    type: "contract",
    startDate: "2023-09-01",
    endDate: "2024-01-15",
    current: false,
    description: "Built high-performance ETL platform for processing large datasets with automated pipelines and monitoring systems.",
    achievements: [
      "Processes 5TB+ data daily",
      "Reduced processing time by 80%",
      "Implemented automated error recovery",
      "Built comprehensive monitoring system",
      "Achieved 99.95% data accuracy"
    ],
    technologies: ["Python", "Apache Airflow", "PostgreSQL", "Docker", "Kubernetes"],
    skills: ["Data Engineering", "ETL Development", "System Architecture", "Monitoring"],
    responsibilities: [
      "Design and implement ETL pipelines",
      "Build data validation and transformation systems",
      "Setup monitoring and alerting",
      "Optimize processing performance",
      "Maintain data quality standards"
    ],
    featured: false,
    disabled: false,
    priority: 85,
    icon: "⚡",
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    title: "Magento Developer",
    company: "Various Clients",
    location: "Remote",
    type: "freelance",
    startDate: "2021-06-01",
    endDate: "2022-12-30",
    current: false,
    description: "Specialized in Magento development and optimization for enterprise e-commerce platforms with advanced features and integrations.",
    achievements: [
      "Built 15+ custom Magento stores",
      "Improved site performance by 65%",
      "Developed 25+ custom modules",
      "Integrated 10+ payment gateways",
      "Managed multi-store configurations"
    ],
    technologies: ["Magento", "PHP", "MySQL", "JavaScript", "Redis"],
    skills: ["E-commerce Development", "PHP Development", "Performance Optimization", "Module Development"],
    responsibilities: [
      "Develop custom Magento extensions",
      "Optimize store performance",
      "Integrate third-party services",
      "Customize themes and functionality",
      "Provide ongoing maintenance and support"
    ],
    featured: false,
    disabled: false,
    priority: 80,
    icon: "🛍️",
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
];
