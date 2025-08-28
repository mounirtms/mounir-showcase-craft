#!/bin/bash

# Enhanced Deployment Script for Portfolio Website
# Supports both Firebase and GitHub Pages deployment

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_step() {
    echo -e "${BLUE}==>${NC} $1"
}

print_success() {
    echo -e "${GREEN}✅${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠️${NC} $1"
}

print_error() {
    echo -e "${RED}❌${NC} $1"
}

# Default values
DEPLOY_TARGET="both"
SKIP_BUILD=false
SKIP_TESTS=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -t|--target)
            DEPLOY_TARGET="$2"
            shift 2
            ;;
        --skip-build)
            SKIP_BUILD=true
            shift
            ;;
        --skip-tests)
            SKIP_TESTS=true
            shift
            ;;
        -h|--help)
            echo "Enhanced Portfolio Deployment Script"
            echo ""
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  -t, --target TARGET    Deployment target (firebase, github, both) [default: both]"
            echo "  --skip-build          Skip the build step"
            echo "  --skip-tests          Skip tests and linting"
            echo "  -h, --help            Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0                    # Deploy to both Firebase and GitHub"
            echo "  $0 -t firebase        # Deploy only to Firebase"
            echo "  $0 -t github          # Deploy only to GitHub Pages"
            echo "  $0 --skip-build       # Deploy without rebuilding"
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

print_step "🚀 Starting Enhanced Portfolio Deployment"
echo "Target: $DEPLOY_TARGET"
echo "Skip Build: $SKIP_BUILD"
echo "Skip Tests: $SKIP_TESTS"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Check dependencies
print_step "Checking dependencies..."
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    print_error "npm is not installed"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    print_step "Installing dependencies..."
    npm ci --silent
    print_success "Dependencies installed"
fi

# Run tests and linting (unless skipped)
if [ "$SKIP_TESTS" = false ]; then
    print_step "Running quality checks..."
    
    # TypeScript type checking
    if npm run check &> /dev/null; then
        print_success "TypeScript check passed"
    else
        print_warning "TypeScript check failed, continuing anyway..."
    fi
    
    # ESLint (if available)
    if npm run lint:fix &> /dev/null; then
        print_success "Linting completed"
    else
        print_warning "Linting not available or failed"
    fi
fi

# Build the project (unless skipped)
if [ "$SKIP_BUILD" = false ]; then
    print_step "Building project for production..."
    
    # Clean previous build
    if [ -d "dist" ]; then
        rm -rf dist
    fi
    
    # Build
    npm run build
    print_success "Build completed successfully"
    
    # Copy 404.html for GitHub Pages SPA routing
    if [ -f "dist/index.html" ]; then
        cp dist/index.html dist/404.html
        print_success "Created 404.html for SPA routing"
    fi
else
    print_warning "Skipping build step"
    if [ ! -d "dist" ]; then
        print_error "No dist directory found. Cannot skip build."
        exit 1
    fi
fi

# Deployment functions
deploy_to_firebase() {
    print_step "Deploying to Firebase..."
    
    # Check if Firebase CLI is available
    if ! command -v firebase &> /dev/null; then
        print_error "Firebase CLI is not installed. Install it with: npm install -g firebase-tools"
        return 1
    fi
    
    # Check if logged in
    if ! firebase projects:list &> /dev/null; then
        print_error "Not logged in to Firebase. Run: firebase login"
        return 1
    fi
    
    # Deploy
    firebase deploy --only hosting
    print_success "✨ Deployed to Firebase Hosting"
    
    # Get hosting URL
    PROJECT_ID=$(firebase use | grep "active project" | sed 's/.*(\(.*\)).*/\1/')
    if [ ! -z "$PROJECT_ID" ]; then
        echo -e "${GREEN}🌐 Firebase URL: https://$PROJECT_ID.web.app${NC}"
    fi
}

deploy_to_github() {
    print_step "Deploying to GitHub Pages..."
    
    # Check if gh-pages is available
    if ! npm list gh-pages &> /dev/null; then
        print_error "gh-pages package not found. Installing..."
        npm install --save-dev gh-pages
    fi
    
    # Deploy using gh-pages
    npm run deploy
    print_success "✨ Deployed to GitHub Pages"
    
    # Get repository info
    if command -v git &> /dev/null; then
        REPO_URL=$(git config --get remote.origin.url | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
        if [ ! -z "$REPO_URL" ]; then
            GITHUB_PAGES_URL=$(echo $REPO_URL | sed 's/github\.com/github\.io/' | sed 's/\/mounir1\/mounir1\.github\.io/\/mounir1.github.io/')
            echo -e "${GREEN}🌐 GitHub Pages URL: $GITHUB_PAGES_URL${NC}"
        fi
    fi
}

# Execute deployments based on target
case $DEPLOY_TARGET in
    firebase)
        deploy_to_firebase
        ;;
    github)
        deploy_to_github
        ;;
    both)
        deploy_to_firebase
        deploy_to_github
        ;;
    *)
        print_error "Invalid deployment target: $DEPLOY_TARGET"
        print_error "Valid targets: firebase, github, both"
        exit 1
        ;;
esac

print_success "🎉 Deployment completed successfully!"

# Additional tips
echo ""
print_step "📝 Post-deployment tips:"
echo "1. Admin panel access: /admin"
echo "2. Clear browser cache if changes aren't visible"
echo "3. Check deployment status in respective dashboards"
echo "4. Monitor analytics for user engagement"

# Performance reminder
print_warning "💡 Remember to run Lighthouse audits to maintain performance scores!"

echo ""
print_success "✨ Happy coding! Your portfolio is now live and optimized."