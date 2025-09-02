# Overview

This is a modern, production-ready portfolio application built for Mounir Abderrahmani - a Senior Full-Stack Developer. The application features a public-facing portfolio website with an integrated admin dashboard for content management. The system is built with React 18, TypeScript, and Firebase, deployed to GitHub Pages with comprehensive CI/CD pipelines and performance monitoring.

The portfolio showcases projects, skills, and professional experience with dynamic content management capabilities. It includes features like real-time data synchronization, Google Analytics integration, SEO optimization, and accessibility compliance. The admin dashboard provides authentication, content management, analytics, and system monitoring capabilities.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for development
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom design system and CSS variables
- **State Management**: React Context API with custom providers for global state
- **Routing**: React Router DOM with client-side routing and SPA configuration
- **Forms**: React Hook Form with Zod validation schemas
- **Animations**: Framer Motion for smooth transitions and interactions

## Backend Architecture
- **Database**: Firebase Firestore for real-time data storage
- **Authentication**: Firebase Auth with Google OAuth and email/password login
- **File Storage**: Firebase Storage for images and assets
- **Offline Support**: Local data fallbacks when Firebase is unavailable
- **Data Validation**: TypeScript interfaces with runtime validation

## Content Management System
- **Projects Management**: Full CRUD operations with categories, technologies, and metrics
- **Skills Management**: Hierarchical skill organization with experience levels and certifications
- **Dynamic Content**: Real-time updates between admin dashboard and public portfolio
- **Media Management**: Image uploads and asset organization
- **SEO Management**: Meta tags, structured data, and sitemap generation

## Performance & Optimization
- **Bundle Optimization**: Code splitting with Vite rollup configuration
- **Performance Monitoring**: Lighthouse CI with automated performance budgets
- **Bundle Analysis**: Automated bundle size tracking and reporting
- **Caching Strategy**: Service worker implementation with multiple cache strategies
- **Image Optimization**: WebP conversion and responsive image loading

## Quality Assurance
- **Testing**: Vitest for unit testing with coverage reports
- **End-to-End Testing**: Playwright for cross-browser testing
- **Linting**: ESLint with TypeScript support and React hooks rules
- **Code Formatting**: Prettier with automated formatting on commit
- **Type Safety**: Strict TypeScript configuration with comprehensive type definitions

## Development Workflow
- **Hot Module Replacement**: Vite development server with fast refresh
- **Git Hooks**: Husky with lint-staged for pre-commit quality checks
- **Code Generation**: Automated component, page, and hook generators
- **Development Scripts**: Comprehensive npm scripts for all development tasks
- **Performance Budgets**: Enforced performance limits with CI integration

## Accessibility & Compliance
- **WCAG Compliance**: Full accessibility support with ARIA attributes
- **Keyboard Navigation**: Complete keyboard navigation support
- **Screen Reader Support**: Semantic HTML with proper landmark usage
- **Focus Management**: Advanced focus trapping and restoration
- **Color Contrast**: High contrast mode support with theme switching

## SEO & Analytics
- **Structured Data**: JSON-LD structured data for search engines
- **Meta Tags**: Dynamic meta tag generation for social sharing
- **Sitemap**: Automated XML sitemap generation
- **Google Analytics**: GA4 integration with custom event tracking
- **Performance Tracking**: Real User Monitoring (RUM) implementation

# External Dependencies

## Core Firebase Services
- **Firestore**: NoSQL document database for projects, skills, and user data
- **Firebase Auth**: Authentication service with Google OAuth provider
- **Firebase Storage**: File storage for images and media assets
- **Firebase Hosting**: Static site hosting with custom domain support

## Development Tools
- **Vite**: Build tool and development server with hot module replacement
- **TypeScript**: Static type checking and enhanced developer experience
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **ESLint & Prettier**: Code quality and formatting tools

## UI Framework
- **Radix UI**: Headless component primitives for accessibility
- **shadcn/ui**: Pre-built component library with consistent styling
- **Lucide React**: Modern icon library with comprehensive icon set
- **Framer Motion**: Animation library for smooth user interactions

## Testing & Quality
- **Vitest**: Fast unit testing framework with TypeScript support
- **Playwright**: End-to-end testing across multiple browsers
- **Lighthouse CI**: Automated performance and accessibility auditing
- **Husky**: Git hooks for pre-commit quality checks

## Analytics & Monitoring
- **Google Analytics 4**: User behavior tracking and conversion analysis
- **Performance Monitoring**: Custom RUM implementation for real-time metrics
- **Bundle Analyzer**: JavaScript bundle size analysis and optimization

## Deployment & CI/CD
- **GitHub Pages**: Static site hosting with custom domain
- **GitHub Actions**: Automated build, test, and deployment pipelines
- **Firebase CLI**: Deployment tools for Firebase services

## External APIs
- **Google Fonts**: Web font loading for Inter, Space Grotesk, and JetBrains Mono
- **Unsplash**: Stock photography for project images and placeholders

## Optional Integrations
- **Vercel**: Alternative deployment platform (configured but not primary)
- **Custom RUM Endpoint**: External performance monitoring service integration
- **Email Services**: Contact form integration capabilities