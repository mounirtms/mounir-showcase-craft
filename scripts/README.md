# Development Scripts

This directory contains various development scripts to help with project setup, code generation, and maintenance.

## Available Scripts

### Code Generation

#### `generate-component.js`
Generates a new React component with TypeScript, tests, and Storybook stories.

```bash
# Generate a basic component
npm run generate:component Button

# Generate a component in a specific path
npm run generate:component AdminCard admin

# Windows alternative
scripts\run.bat generate-component Button
```

**Generated files:**
- `ComponentName.tsx` - Main component file
- `index.ts` - Export file
- `ComponentName.stories.tsx` - Storybook stories
- `ComponentName.test.tsx` - Unit tests

#### `generate-page.js`
Generates a new page component with routing setup.

```bash
# Generate a regular page
npm run generate:page Dashboard

# Generate an admin page
npm run generate:page UserManagement --admin

# Windows alternative
scripts\run.bat generate-page Dashboard
```

**Generated files:**
- `PageName.tsx` - Main page component
- `PageName.test.tsx` - Unit tests

#### `generate-hook.js`
Generates a custom React hook with TypeScript and tests.

```bash
# Generate different types of hooks
npm run generate:hook useCounter custom
npm run generate:hook useProjects api
npm run generate:hook useLocalStorage state
npm run generate:hook useInterval effect

# Windows alternative
scripts\run.bat generate-hook useCounter custom
```

**Hook types:**
- `custom` - Basic custom hook template
- `api` - API data fetching hook with CRUD operations
- `state` - State management hook with actions
- `effect` - Effect-based hook with cleanup

### Development Setup

#### `setup-dev.js`
Sets up the complete development environment including Git hooks, dependencies, and configurations.

```bash
npm run setup

# Windows alternative
scripts\run.bat setup-dev
```

**What it does:**
- Installs all dependencies
- Sets up Husky for Git hooks
- Configures pre-commit and pre-push hooks
- Creates VS Code settings
- Runs initial quality checks

#### `dev-utils.js`
Provides various development utilities and project information.

```bash
# Show project information
npm run info

# Run comprehensive checks
npm run check

# Show detailed statistics
npm run stats

# Show help
npm run utils

# Windows alternatives
scripts\run.bat dev-utils info
scripts\run.bat dev-utils check
scripts\run.bat dev-utils stats
```

**Available commands:**
- `info` - Project overview and basic statistics
- `clean` - Clean build artifacts and cache
- `check` - Run all quality checks
- `deps` - Check dependencies and security
- `stats` - Detailed project statistics
- `help` - Show available commands

### Performance Scripts

#### `performance-monitor.js`
Monitors build performance and generates reports.

```bash
npm run performance
npm run perf:monitor
npm run perf:full
```

#### `bundle-analyzer.js`
Analyzes bundle size and composition.

```bash
npm run bundle:analyze
npm run bundle:size
```

#### `performance-enforcer.js`
Enforces performance budgets and fails builds if exceeded.

```bash
npm run perf:enforce
```

## NPM Scripts Reference

### Development
- `npm run dev` - Start development server
- `npm run dev:host` - Start with host binding
- `npm run dev:debug` - Start with debug mode
- `npm run dev:full` - Clean cache and start dev server

### Building
- `npm run build` - Build for production with type checking
- `npm run build:prod` - Production build
- `npm run build:analyze` - Build and analyze bundle
- `npm run build:full` - Full build with quality checks

### Code Quality
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run lint:check` - Check without fixing
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check formatting
- `npm run quality` - Run all quality checks
- `npm run quality:fix` - Fix all quality issues

### Testing
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage
- `npm run type-check` - TypeScript type checking

### Maintenance
- `npm run clean` - Clean build artifacts
- `npm run clean:all` - Clean everything and reinstall
- `npm run deps:check` - Check for outdated packages
- `npm run deps:update` - Update dependencies
- `npm run deps:audit` - Security audit

### Git Hooks
- `npm run pre-commit` - Pre-commit quality checks
- `npm run pre-push` - Pre-push quality checks

### Performance
- `npm run perf:monitor` - Monitor performance
- `npm run perf:ci` - CI performance checks
- `npm run perf:full` - Full performance analysis

## Configuration Files

### `.prettierrc`
Prettier configuration for code formatting.

### `.lintstagedrc.json`
Lint-staged configuration for pre-commit hooks.

### `.prettierignore`
Files and directories to ignore during formatting.

## Git Hooks

The setup script configures the following Git hooks:

### Pre-commit
- Runs ESLint with auto-fix
- Formats code with Prettier
- Runs TypeScript type checking

### Pre-push
- Runs all quality checks
- Ensures code passes linting and formatting
- Validates TypeScript compilation

## Usage Examples

### Setting up a new development environment
```bash
# Clone the repository
git clone <repository-url>
cd <project-directory>

# Setup development environment
npm run setup

# Start development
npm run dev
```

### Creating a new feature
```bash
# Generate components
npm run generate:component FeatureCard features
npm run generate:component FeatureList features

# Generate a page
npm run generate:page Features

# Generate hooks
npm run generate:hook useFeatures api

# Run quality checks
npm run quality
```

### Before committing
```bash
# Check code quality
npm run check

# Fix issues automatically
npm run quality:fix

# Commit (hooks will run automatically)
git add .
git commit -m "feat: add new feature"
```

### Performance monitoring
```bash
# Full performance analysis
npm run perf:full

# Check bundle size
npm run bundle:analyze

# Monitor in CI
npm run ci
```

## Troubleshooting

### Windows Users
If you encounter issues with npm scripts, use the batch file alternative:
```cmd
scripts\run.bat <script-name> [arguments]
```

### Permission Issues
On Unix systems, make scripts executable:
```bash
chmod +x scripts/*.js
```

### Git Hooks Not Working
Reinstall Husky:
```bash
npm run setup
# or manually
npx husky install
```

### Type Checking Errors
Run type checking separately to see detailed errors:
```bash
npm run type-check
```

## Contributing

When adding new scripts:

1. Follow the existing naming convention
2. Add proper error handling
3. Include help text and usage examples
4. Update this README
5. Add corresponding npm scripts to package.json
6. Test on both Windows and Unix systems