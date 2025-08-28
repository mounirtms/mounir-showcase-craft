import type { ProjectInput } from "@/hooks/useProjects";

export const initialProjects: ProjectInput[] = [
  {
    title: "HoTech Systems - Enterprise Integration Platform",
    description: "Comprehensive enterprise integration platform with real-time data synchronization and advanced analytics dashboard.",
    longDescription: "Built a complete enterprise integration platform for HoTech Systems, featuring real-time data synchronization across multiple systems, advanced analytics dashboard, and automated workflow management. The platform handles over 10,000 transactions daily with 99.9% uptime. Implemented microservices architecture with Docker containers and Kubernetes orchestration.",
    category: "Enterprise Integration",
    status: "completed",
    achievements: [
      "Reduced data processing time by 75%",
      "Achieved 99.9% system uptime",
      "Integrated 15+ enterprise systems seamlessly",
      "Processed over 1M transactions monthly",
      "Implemented real-time monitoring dashboard",
      "Built automated failover mechanisms",
      "Reduced manual intervention by 90%"
    ],
    technologies: ["React", "Node.js", "TypeScript", "PostgreSQL", "Redis", "Docker", "AWS", "WebSocket", "Kubernetes", "Nginx"],
    tags: ["enterprise", "integration", "real-time", "scalable", "microservices", "b2b"],
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop",
    logo: "/hotech-logo.svg",
    icon: "🏢",
    liveUrl: "https://hotech.systems",
    githubUrl: "",
    demoUrl: "",
    caseStudyUrl: "",
    featured: true,
    disabled: false,
    priority: 95,
    startDate: "2023-06-01",
    endDate: "2024-02-15",
    duration: "8 months",
    clientInfo: {
      name: "HoTech Systems",
      industry: "Technology Integration",
      size: "enterprise",
      location: "International",
      website: "https://hotech.systems",
      isPublic: true
    },
    metrics: {
      usersReached: 10000,
      performanceImprovement: "75% faster processing",
      uptime: "99.9%",
      revenueImpact: "$2M+ cost savings",
      customMetrics: {
        transactions_monthly: 1000000,
        systems_integrated: 15,
        cost_savings: "40%",
        automation_level: "90%"
      }
    },
    challenges: [
      "Complex legacy system integration",
      "Real-time data synchronization",
      "High availability requirements",
      "Scalability for growing transaction volume"
    ],
    solutions: [
      "Microservices architecture implementation",
      "Event-driven data synchronization",
      "Automated failover and monitoring",
      "Horizontal scaling with Kubernetes"
    ],
    teamSize: 5,
    role: "Lead Full-Stack Developer",
    createdAt: 1704067200000,
    updatedAt: 1706745600000,
    version: 1
  },
  {
    title: "TechnoStationery E-commerce Platform",
    description: "Modern e-commerce platform with advanced inventory management, multi-payment gateway integration, and real-time analytics.",
    longDescription: "Developed a comprehensive e-commerce solution for TechnoStationery with advanced features including inventory management, multi-payment gateway integration, customer analytics, and automated order processing. The platform supports multiple currencies and languages with real-time inventory tracking and automated reorder points.",
    category: "E-commerce",
    status: "completed",
    achievements: [
      "Increased online sales by 300%",
      "Reduced cart abandonment by 45%",
      "Implemented multi-currency support",
      "Achieved 2-second page load times",
      "Integrated 5+ payment gateways",
      "Built automated inventory management",
      "Implemented customer loyalty program"
    ],
    technologies: ["React", "Next.js", "Stripe", "PayPal", "MongoDB", "Node.js", "Tailwind CSS", "Vercel", "Algolia", "SendGrid"],
    tags: ["ecommerce", "payments", "inventory", "analytics", "responsive", "b2c"],
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
    logo: "/technostationery-logo.svg",
    icon: "🛒",
    liveUrl: "https://technostationery.com",
    githubUrl: "",
    demoUrl: "",
    caseStudyUrl: "",
    featured: true,
    disabled: false,
    priority: 90,
    startDate: "2023-03-01",
    endDate: "2023-08-30",
    duration: "6 months",
    clientInfo: {
      name: "TechnoStationery",
      industry: "Office Supplies & Stationery",
      size: "medium",
      location: "Algeria",
      website: "https://technostationery.com",
      isPublic: true
    },
    metrics: {
      usersReached: 5000,
      performanceImprovement: "300% sales increase",
      revenueImpact: "$500K+ annual revenue",
      customMetrics: {
        cart_abandonment_reduction: "45%",
        page_load_time: "2s",
        payment_gateways: 5,
        inventory_automation: "95%"
      }
    },
    teamSize: 3,
    role: "Full-Stack Developer",
    createdAt: 1701475200000,
    updatedAt: 1705881600000,
    version: 1
  },
  {
    title: "ETL Data Processing Platform",
    description: "High-performance ETL platform for processing large datasets with automated data validation and transformation pipelines.",
    longDescription: "Built a robust ETL (Extract, Transform, Load) platform capable of processing terabytes of data daily. Features include automated data validation, transformation pipelines, error handling, and comprehensive monitoring with alerting systems. Implemented using Apache Airflow for workflow orchestration and Kubernetes for scalable processing.",
    category: "DevOps & Infrastructure",
    status: "completed",
    achievements: [
      "Processes 5TB+ data daily",
      "Reduced processing time by 80%",
      "Implemented automated error recovery",
      "Built comprehensive monitoring system",
      "Achieved 99.95% data accuracy",
      "Automated 95% of data workflows",
      "Reduced manual data processing by 90%"
    ],
    technologies: ["Python", "Apache Airflow", "PostgreSQL", "Redis", "Docker", "Kubernetes", "Grafana", "Prometheus", "Apache Spark", "Elasticsearch"],
    tags: ["etl", "big-data", "automation", "monitoring", "scalable", "data-engineering"],
    image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&h=600&fit=crop",
    logo: "/etl-platform-logo.svg",
    icon: "⚡",
    liveUrl: "https://etl.techno-dz.com",
    githubUrl: "",
    demoUrl: "",
    caseStudyUrl: "",
    featured: true,
    disabled: false,
    priority: 85,
    startDate: "2023-09-01",
    endDate: "2024-01-15",
    duration: "4.5 months",
    clientInfo: {
      name: "Techno DZ",
      industry: "Data Processing",
      size: "medium",
      location: "Algeria",
      website: "https://etl.techno-dz.com",
      isPublic: true
    },
    metrics: {
      performanceImprovement: "80% faster processing",
      uptime: "99.95%",
      customMetrics: {
        daily_data_processed: "5TB",
        accuracy_rate: "99.95%",
        automation_level: "95%",
        processing_speed_improvement: "80%"
      }
    },
    teamSize: 4,
    role: "Lead Data Engineer",
    createdAt: 1698883200000,
    updatedAt: 1706140800000,
    version: 1
  },
  {
    title: "Magento E-commerce Solutions",
    description: "Custom Magento development and optimization for enterprise e-commerce platforms with advanced features.",
    longDescription: "Developed and optimized multiple Magento e-commerce platforms for enterprise clients, featuring custom modules, payment integrations, inventory management, and performance optimizations. Specialized in Magento 2.x development with custom themes, extensions, and multi-store configurations. Implemented advanced SEO, caching strategies, and third-party integrations.",
    category: "E-commerce",
    status: "completed",
    achievements: [
      "Built 15+ custom Magento stores",
      "Improved site performance by 65%",
      "Integrated 10+ payment gateways",
      "Developed 25+ custom modules",
      "Managed multi-store configurations",
      "Implemented advanced SEO strategies",
      "Reduced server response time by 70%"
    ],
    technologies: ["Magento", "PHP", "MySQL", "JavaScript", "LESS", "XML", "Composer", "Redis", "Elasticsearch", "Varnish"],
    tags: ["magento", "ecommerce", "php", "enterprise", "optimization", "b2b", "b2c"],
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop",
    logo: "/magento-logo.svg",
    icon: "🛍️",
    liveUrl: "",
    githubUrl: "",
    demoUrl: "",
    caseStudyUrl: "",
    featured: true,
    disabled: false,
    priority: 87,
    startDate: "2021-06-01",
    endDate: "2022-12-30",
    duration: "18 months",
    clientInfo: {
      name: "Multiple Enterprise Clients",
      industry: "E-commerce",
      size: "enterprise",
      location: "International",
      isPublic: false
    },
    metrics: {
      usersReached: 50000,
      performanceImprovement: "65% faster loading",
      customMetrics: {
        stores_built: 15,
        custom_modules: 25,
        payment_gateways: 10,
        performance_improvement: "65%",
        seo_improvement: "200%"
      }
    },
    teamSize: 6,
    role: "Senior Magento Developer",
    createdAt: 1688169600000,
    updatedAt: 1703980800000,
    version: 1
  },
  {
    title: "JSKit Development Toolkit",
    description: "Comprehensive JavaScript development toolkit with code generators, testing utilities, and performance optimization tools.",
    longDescription: "Created a complete JavaScript development toolkit that includes code generators, automated testing utilities, performance optimization tools, and debugging helpers. Used by 500+ developers worldwide for rapid application development. Features include React component generators, API client generators, testing boilerplates, and performance monitoring tools.",
    category: "Web Application",
    status: "maintenance",
    achievements: [
      "Used by 500+ developers globally",
      "Reduced development time by 60%",
      "Generated 10,000+ code snippets",
      "Integrated with popular IDEs",
      "Maintained 95% user satisfaction",
      "Built CLI tools for automation",
      "Created comprehensive documentation"
    ],
    technologies: ["JavaScript", "TypeScript", "Node.js", "Webpack", "Babel", "Jest", "ESLint", "Prettier", "CLI", "NPM"],
    tags: ["toolkit", "development", "automation", "testing", "productivity", "open-source"],
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop",
    logo: "/jskit-logo.svg",
    icon: "🔧",
    liveUrl: "https://jskit-app.web.app",
    githubUrl: "https://github.com/mounir1/jskit",
    demoUrl: "https://jskit-app.web.app/demo",
    caseStudyUrl: "",
    featured: false,
    disabled: false,
    priority: 75,
    startDate: "2022-11-01",
    endDate: "2023-05-30",
    duration: "7 months",
    metrics: {
      usersReached: 500,
      performanceImprovement: "60% faster development",
      customMetrics: {
        code_snippets_generated: 10000,
        user_satisfaction: "95%",
        development_time_saved: "60%",
        ide_integrations: 5
      }
    },
    teamSize: 2,
    role: "Lead Developer",
    createdAt: 1695945600000,
    updatedAt: 1704931200000,
    version: 1
  },
  {
    title: "AI-Powered Analytics Dashboard",
    description: "Advanced analytics dashboard with AI-driven insights, real-time data visualization, and predictive analytics for business intelligence.",
    longDescription: "Developed a sophisticated analytics dashboard that leverages artificial intelligence to provide actionable business insights. Features include real-time data visualization, predictive analytics, automated report generation, and machine learning-powered recommendations. The platform processes millions of data points daily and provides insights that have helped clients increase revenue by up to 40%.",
    category: "Machine Learning",
    status: "completed",
    achievements: [
      "Increased client revenue by 40%",
      "Processed 10M+ data points daily",
      "Achieved 92% prediction accuracy",
      "Reduced manual reporting by 85%",
      "Implemented real-time streaming analytics",
      "Built automated alert systems",
      "Created custom ML models for forecasting"
    ],
    technologies: ["Python", "TensorFlow", "React", "D3.js", "Apache Kafka", "ClickHouse", "Redis", "FastAPI", "Docker", "AWS SageMaker"],
    tags: ["ai", "machine-learning", "analytics", "real-time", "dashboard", "predictive"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    logo: "/ai-dashboard-logo.svg",
    icon: "🤖",
    liveUrl: "https://analytics.demo-ai.com",
    githubUrl: "",
    demoUrl: "https://analytics.demo-ai.com/demo",
    caseStudyUrl: "",
    featured: true,
    disabled: false,
    priority: 92,
    startDate: "2024-01-01",
    endDate: "2024-06-30",
    duration: "6 months",
    clientInfo: {
      name: "Enterprise Analytics Corp",
      industry: "Business Intelligence",
      size: "large",
      location: "United States",
      website: "https://analytics.demo-ai.com",
      isPublic: true
    },
    metrics: {
      usersReached: 15000,
      performanceImprovement: "40% revenue increase",
      revenueImpact: "$5M+ generated insights",
      customMetrics: {
        data_points_daily: "10M",
        prediction_accuracy: "92%",
        manual_reporting_reduction: "85%",
        ml_models: 15
      }
    },
    challenges: [
      "Real-time data processing at scale",
      "Complex ML model deployment",
      "Multi-tenant architecture design",
      "High-performance data visualization"
    ],
    solutions: [
      "Apache Kafka for real-time streaming",
      "TensorFlow Serving for model deployment",
      "Microservices with Docker containers",
      "WebGL-powered visualization engine"
    ],
    teamSize: 8,
    role: "Lead AI Engineer",
    createdAt: 1704067200000,
    updatedAt: 1719705600000,
    version: 1
  },
  {
    title: "Mobile Banking Application",
    description: "Secure mobile banking app with biometric authentication, real-time transactions, and advanced security features.",
    longDescription: "Built a comprehensive mobile banking application from scratch with enterprise-grade security, biometric authentication, real-time transaction processing, and comprehensive financial management tools. The app handles over 100,000 daily transactions with 99.99% uptime and bank-level security standards including end-to-end encryption and fraud detection.",
    category: "Mobile Application",
    status: "completed",
    achievements: [
      "Handles 100K+ daily transactions",
      "Achieved 99.99% uptime",
      "Implemented bank-level security",
      "Built biometric authentication",
      "Integrated fraud detection AI",
      "Supported 5+ languages",
      "Achieved 4.8/5 user rating"
    ],
    technologies: ["React Native", "Node.js", "PostgreSQL", "Redis", "AWS", "Firebase", "Stripe", "Face ID", "Touch ID", "OpenSSL"],
    tags: ["mobile", "banking", "security", "fintech", "payments", "biometric"],
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
    logo: "/mobile-banking-logo.svg",
    icon: "📱",
    liveUrl: "",
    githubUrl: "",
    demoUrl: "",
    caseStudyUrl: "",
    featured: true,
    disabled: false,
    priority: 88,
    startDate: "2023-02-01",
    endDate: "2023-11-30",
    duration: "10 months",
    clientInfo: {
      name: "SecureBank International",
      industry: "Financial Services",
      size: "enterprise",
      location: "International",
      isPublic: false
    },
    metrics: {
      usersReached: 50000,
      performanceImprovement: "99.99% uptime",
      customMetrics: {
        daily_transactions: "100000",
        security_incidents: 0,
        user_rating: "4.8/5",
        languages_supported: 5,
        fraud_detection_accuracy: "99.7%"
      }
    },
    challenges: [
      "Bank-level security implementation",
      "Real-time transaction processing",
      "Biometric authentication integration",
      "Cross-platform compatibility"
    ],
    solutions: [
      "End-to-end encryption with OpenSSL",
      "Event-driven microservices architecture",
      "Native biometric API integration",
      "React Native for unified codebase"
    ],
    teamSize: 7,
    role: "Lead Mobile Developer",
    createdAt: 1675209600000,
    updatedAt: 1701388800000,
    version: 1
  },
  {
    title: "Microservices Migration Platform",
    description: "Enterprise platform for migrating monolithic applications to microservices architecture with automated deployment.",
    longDescription: "Designed and implemented a comprehensive platform for migrating legacy monolithic applications to modern microservices architecture. The platform includes automated code analysis, service decomposition recommendations, containerization tools, and deployment automation. Successfully migrated 20+ enterprise applications with 70% reduction in deployment time.",
    category: "DevOps & Infrastructure",
    status: "completed",
    achievements: [
      "Migrated 20+ enterprise applications",
      "Reduced deployment time by 70%",
      "Automated 90% of migration process",
      "Improved system scalability by 300%",
      "Reduced infrastructure costs by 40%",
      "Built automated testing pipelines",
      "Implemented zero-downtime deployments"
    ],
    technologies: ["Docker", "Kubernetes", "Jenkins", "Terraform", "AWS", "Consul", "Istio", "Prometheus", "Grafana", "Helm"],
    tags: ["microservices", "migration", "devops", "kubernetes", "automation", "enterprise"],
    image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&h=600&fit=crop",
    logo: "/microservices-logo.svg",
    icon: "🔄",
    liveUrl: "",
    githubUrl: "",
    demoUrl: "",
    caseStudyUrl: "",
    featured: false,
    disabled: false,
    priority: 82,
    startDate: "2022-08-01",
    endDate: "2023-04-30",
    duration: "9 months",
    clientInfo: {
      name: "Multiple Enterprise Clients",
      industry: "Technology Consulting",
      size: "enterprise",
      location: "International",
      isPublic: false
    },
    metrics: {
      performanceImprovement: "70% faster deployments",
      customMetrics: {
        applications_migrated: 20,
        deployment_time_reduction: "70%",
        scalability_improvement: "300%",
        cost_reduction: "40%",
        automation_level: "90%"
      }
    },
    challenges: [
      "Complex legacy system dependencies",
      "Zero-downtime migration requirements",
      "Multi-tenant architecture design",
      "Service mesh implementation"
    ],
    solutions: [
      "Automated dependency analysis tools",
      "Blue-green deployment strategies",
      "Kubernetes namespace isolation",
      "Istio service mesh integration"
    ],
    teamSize: 6,
    role: "DevOps Architect",
    createdAt: 1659312000000,
    updatedAt: 1682899200000,
    version: 1
  },
  {
    title: "Real-time Collaboration Platform",
    description: "WebRTC-powered collaboration platform with video conferencing, shared whiteboards, and document editing.",
    longDescription: "Developed a comprehensive real-time collaboration platform that enables teams to work together seamlessly with video conferencing, shared whiteboards, collaborative document editing, and project management tools. The platform supports up to 100 concurrent users per session with sub-200ms latency and integrates with popular productivity tools.",
    category: "Web Application",
    status: "completed",
    achievements: [
      "Supports 100+ concurrent users",
      "Achieved sub-200ms latency",
      "Built real-time document editing",
      "Implemented HD video conferencing",
      "Created collaborative whiteboard",
      "Integrated 15+ productivity tools",
      "Achieved 99.5% user satisfaction"
    ],
    technologies: ["React", "Node.js", "WebRTC", "Socket.io", "MongoDB", "Redis", "Nginx", "Docker", "AWS", "WebAssembly"],
    tags: ["collaboration", "webrtc", "real-time", "video", "productivity", "saas"],
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=600&fit=crop",
    logo: "/collaboration-logo.svg",
    icon: "🤝",
    liveUrl: "https://collaborate.example.com",
    githubUrl: "",
    demoUrl: "https://collaborate.example.com/demo",
    caseStudyUrl: "",
    featured: false,
    disabled: false,
    priority: 78,
    startDate: "2023-07-01",
    endDate: "2024-01-31",
    duration: "7 months",
    clientInfo: {
      name: "ProductivityCorp",
      industry: "Software Development",
      size: "medium",
      location: "Europe",
      website: "https://collaborate.example.com",
      isPublic: true
    },
    metrics: {
      usersReached: 25000,
      performanceImprovement: "Sub-200ms latency",
      customMetrics: {
        concurrent_users_max: 100,
        latency_ms: 180,
        user_satisfaction: "99.5%",
        tool_integrations: 15,
        session_duration_avg: "45min"
      }
    },
    challenges: [
      "Real-time synchronization at scale",
      "WebRTC connection optimization",
      "Cross-browser compatibility",
      "Low-latency global distribution"
    ],
    solutions: [
      "Operational transformation algorithms",
      "TURN/STUN server optimization",
      "WebAssembly for performance-critical code",
      "CDN with edge computing"
    ],
    teamSize: 5,
    role: "Full-Stack Developer",
    createdAt: 1688169600000,
    updatedAt: 1706745600000,
    version: 1
  }
];