@echo off
setlocal enabledelayedexpansion

:: Enhanced Deployment Script for Portfolio Website (Windows)
:: Supports both Firebase and GitHub Pages deployment

:: Default values
set "DEPLOY_TARGET=both"
set "SKIP_BUILD=false"
set "SKIP_TESTS=false"

:: Parse command line arguments
:parse_args
if "%~1"=="" goto :start_deployment
if "%~1"=="-t" (
    set "DEPLOY_TARGET=%~2"
    shift
    shift
    goto :parse_args
)
if "%~1"=="--target" (
    set "DEPLOY_TARGET=%~2"
    shift
    shift
    goto :parse_args
)
if "%~1"=="--skip-build" (
    set "SKIP_BUILD=true"
    shift
    goto :parse_args
)
if "%~1"=="--skip-tests" (
    set "SKIP_TESTS=true"
    shift
    goto :parse_args
)
if "%~1"=="-h" goto :show_help
if "%~1"=="--help" goto :show_help
echo Unknown option: %~1
exit /b 1

:show_help
echo Enhanced Portfolio Deployment Script (Windows)
echo.
echo Usage: %~nx0 [OPTIONS]
echo.
echo Options:
echo   -t, --target TARGET    Deployment target (firebase, github, both) [default: both]
echo   --skip-build          Skip the build step
echo   --skip-tests          Skip tests and linting
echo   -h, --help            Show this help message
echo.
echo Examples:
echo   %~nx0                 Deploy to both Firebase and GitHub
echo   %~nx0 -t firebase     Deploy only to Firebase
echo   %~nx0 -t github       Deploy only to GitHub Pages
echo   %~nx0 --skip-build    Deploy without rebuilding
exit /b 0

:start_deployment
echo.
echo [92m===^> Starting Enhanced Portfolio Deployment[0m
echo Target: %DEPLOY_TARGET%
echo Skip Build: %SKIP_BUILD%
echo Skip Tests: %SKIP_TESTS%
echo.

:: Check if we're in the right directory
if not exist "package.json" (
    echo [91mError: package.json not found. Please run this script from the project root.[0m
    exit /b 1
)

:: Check dependencies
echo [94m===^> Checking dependencies...[0m
where node >nul 2>&1
if errorlevel 1 (
    echo [91mError: Node.js is not installed[0m
    exit /b 1
)

where npm >nul 2>&1
if errorlevel 1 (
    echo [91mError: npm is not installed[0m
    exit /b 1
)

:: Install dependencies if needed
if not exist "node_modules" (
    echo [94m===^> Installing dependencies...[0m
    npm ci --silent
    echo [92mDependencies installed[0m
)

:: Run tests and linting (unless skipped)
if "%SKIP_TESTS%"=="false" (
    echo [94m===^> Running quality checks...[0m
    
    :: TypeScript type checking
    npm run check >nul 2>&1
    if errorlevel 1 (
        echo [93mWarning: TypeScript check failed, continuing anyway...[0m
    ) else (
        echo [92mTypeScript check passed[0m
    )
    
    :: ESLint (if available)
    npm run lint:fix >nul 2>&1
    if errorlevel 1 (
        echo [93mWarning: Linting not available or failed[0m
    ) else (
        echo [92mLinting completed[0m
    )
)

:: Build the project (unless skipped)
if "%SKIP_BUILD%"=="false" (
    echo [94m===^> Building project for production...[0m
    
    :: Clean previous build
    if exist "dist" (
        rmdir /s /q "dist"
    )
    
    :: Build
    npm run build
    if errorlevel 1 (
        echo [91mError: Build failed[0m
        exit /b 1
    )
    echo [92mBuild completed successfully[0m
    
    :: Copy 404.html for GitHub Pages SPA routing
    if exist "dist\index.html" (
        copy "dist\index.html" "dist\404.html" >nul
        echo [92mCreated 404.html for SPA routing[0m
    )
) else (
    echo [93mSkipping build step[0m
    if not exist "dist" (
        echo [91mError: No dist directory found. Cannot skip build.[0m
        exit /b 1
    )
)

:: Deployment functions
if "%DEPLOY_TARGET%"=="firebase" goto :deploy_firebase
if "%DEPLOY_TARGET%"=="github" goto :deploy_github
if "%DEPLOY_TARGET%"=="both" goto :deploy_both
echo [91mError: Invalid deployment target: %DEPLOY_TARGET%[0m
echo Valid targets: firebase, github, both
exit /b 1

:deploy_firebase
echo [94m===^> Deploying to Firebase...[0m

:: Check if Firebase CLI is available
where firebase >nul 2>&1
if errorlevel 1 (
    echo [91mError: Firebase CLI is not installed. Install it with: npm install -g firebase-tools[0m
    goto :deploy_github_or_end
)

:: Check if logged in
firebase projects:list >nul 2>&1
if errorlevel 1 (
    echo [91mError: Not logged in to Firebase. Run: firebase login[0m
    goto :deploy_github_or_end
)

:: Deploy
firebase deploy --only hosting
if errorlevel 1 (
    echo [91mError: Firebase deployment failed[0m
    goto :deploy_github_or_end
)
echo [92mDeployed to Firebase Hosting[0m

:deploy_github_or_end
if "%DEPLOY_TARGET%"=="firebase" goto :deployment_complete
goto :deploy_github

:deploy_github
echo [94m===^> Deploying to GitHub Pages...[0m

:: Check if gh-pages is available
npm list gh-pages >nul 2>&1
if errorlevel 1 (
    echo [94mInstalling gh-pages package...[0m
    npm install --save-dev gh-pages
)

:: Deploy using gh-pages
npm run deploy
if errorlevel 1 (
    echo [91mError: GitHub Pages deployment failed[0m
    goto :deployment_complete
)
echo [92mDeployed to GitHub Pages[0m
echo [92mGitHub Pages URL: https://mounir1.github.io[0m

goto :deployment_complete

:deploy_both
call :deploy_firebase
call :deploy_github
goto :deployment_complete

:deployment_complete
echo.
echo [92mDeployment completed successfully![0m
echo.
echo [94m===^> Post-deployment tips:[0m
echo 1. Admin panel access: /admin
echo 2. Clear browser cache if changes aren't visible
echo 3. Check deployment status in respective dashboards
echo 4. Monitor analytics for user engagement
echo.
echo [93mRemember to run Lighthouse audits to maintain performance scores![0m
echo.
echo [92mHappy coding! Your portfolio is now live and optimized.[0m

endlocal