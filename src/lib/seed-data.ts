import { collection, addDoc, getDocs, query, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { initialProjects } from "@/data/initial-projects";
import { PROJECTS_COLLECTION } from "@/hooks/useProjects";

export async function seedInitialData() {
  if (!db) {
    console.log("Firebase not configured, skipping data seeding");
    return;
  }

  try {
    // Check if projects already exist
    const projectsQuery = query(collection(db, PROJECTS_COLLECTION), limit(1));
    const existingProjects = await getDocs(projectsQuery);
    
    if (!existingProjects.empty) {
      console.log("Projects already exist, skipping seeding");
      return;
    }

    console.log("Seeding initial project data...");
    
    // Add all initial projects
    const promises = initialProjects.map(project => 
      addDoc(collection(db, PROJECTS_COLLECTION), project)
    );
    
    await Promise.all(promises);
    console.log(`Successfully seeded ${initialProjects.length} projects`);
    
  } catch (error) {
    console.error("Error seeding data:", error);
  }
}

// Additional data for future expansion
export const initialSkills = [
  {
    name: "React",
    category: "Frontend",
    proficiency: 95,
    yearsOfExperience: 6,
    description: "Expert in React ecosystem including hooks, context, and performance optimization",
    projects: ["HoTech Systems", "TechnoStationery", "Analytics Dashboard"],
    certifications: [],
    featured: true
  },
  {
    name: "Node.js",
    category: "Backend",
    proficiency: 92,
    yearsOfExperience: 7,
    description: "Advanced server-side development with Express, NestJS, and microservices",
    projects: ["ETL Platform", "JSKit Toolkit", "IT Collaborator"],
    certifications: [],
    featured: true
  },
  {
    name: "TypeScript",
    category: "Language",
    proficiency: 90,
    yearsOfExperience: 5,
    description: "Strong typing and advanced TypeScript patterns for scalable applications",
    projects: ["HoTech Systems", "JSKit Toolkit", "Analytics Dashboard"],
    certifications: [],
    featured: true
  },
  {
    name: "Firebase",
    category: "Backend",
    proficiency: 88,
    yearsOfExperience: 4,
    description: "Real-time databases, authentication, cloud functions, and hosting",
    projects: ["Noor Al Maarifa", "Portfolio Admin", "JSKit Toolkit"],
    certifications: [],
    featured: true
  },
  {
    name: "Docker & Kubernetes",
    category: "DevOps",
    proficiency: 85,
    yearsOfExperience: 4,
    description: "Containerization, orchestration, and cloud-native deployments",
    projects: ["Microservices Migration", "ETL Platform", "HoTech Systems"],
    certifications: [],
    featured: true
  },
  {
    name: "AWS",
    category: "Cloud",
    proficiency: 82,
    yearsOfExperience: 5,
    description: "EC2, S3, Lambda, RDS, and serverless architecture implementation",
    projects: ["HoTech Systems", "ETL Platform", "Analytics Dashboard"],
    certifications: ["AWS Solutions Architect Associate"],
    featured: false
  }
];

export const initialExperiences = [
  {
    title: "Senior Full-Stack Developer",
    company: "Freelance",
    location: "Remote",
    startDate: "2020-01-01",
    endDate: null,
    current: true,
    description: "Leading full-stack development projects for international clients, specializing in enterprise solutions and modern web applications.",
    achievements: [
      "Delivered 50+ successful projects with 98% client satisfaction",
      "Built scalable applications serving 100K+ users",
      "Reduced client development costs by average 40%",
      "Mentored 20+ junior developers"
    ],
    technologies: ["React", "Node.js", "TypeScript", "AWS", "Docker", "Firebase"],
    featured: true
  },
  {
    title: "Lead Software Engineer",
    company: "TechnoSolutions",
    location: "Algiers, Algeria",
    startDate: "2018-06-01",
    endDate: "2019-12-31",
    current: false,
    description: "Led a team of 8 developers in building enterprise-grade applications and managing complex software architecture decisions.",
    achievements: [
      "Increased team productivity by 60%",
      "Implemented CI/CD pipelines reducing deployment time by 80%",
      "Architected microservices handling 1M+ requests daily",
      "Established coding standards and best practices"
    ],
    technologies: ["Vue.js", "Laravel", "MySQL", "Redis", "Docker", "Jenkins"],
    featured: true
  },
  {
    title: "Full-Stack Developer",
    company: "Digital Innovations",
    location: "Algiers, Algeria",
    startDate: "2016-03-01",
    endDate: "2018-05-31",
    current: false,
    description: "Developed web applications and mobile solutions for various industries including e-commerce, healthcare, and education.",
    achievements: [
      "Built 25+ web applications from scratch",
      "Improved application performance by average 70%",
      "Integrated 15+ third-party APIs and services",
      "Trained team members on modern development practices"
    ],
    technologies: ["JavaScript", "PHP", "MySQL", "Bootstrap", "jQuery", "REST APIs"],
    featured: false
  }
];

export const initialTestimonials = [
  {
    name: "Sarah Johnson",
    title: "CTO at HoTech Systems",
    company: "HoTech Systems",
    content: "Mounir delivered an exceptional enterprise integration platform that exceeded our expectations. His technical expertise and attention to detail are outstanding.",
    rating: 5,
    projectId: "hotech-systems",
    date: "2024-02-20",
    featured: true,
    verified: true
  },
  {
    name: "Ahmed Ben Ali",
    title: "Founder",
    company: "TechnoStationery",
    content: "The e-commerce platform Mounir built for us increased our online sales by 300%. His work is professional, efficient, and results-driven.",
    rating: 5,
    projectId: "technostationery",
    date: "2023-09-15",
    featured: true,
    verified: true
  },
  {
    name: "Dr. Fatima Al-Zahra",
    title: "Director",
    company: "Noor Al Maarifa",
    content: "The educational platform has transformed how we deliver courses to our students. Mounir's solution is intuitive, scalable, and perfectly meets our needs.",
    rating: 5,
    projectId: "noor-almaarifa",
    date: "2023-08-10",
    featured: true,
    verified: true
  }
];