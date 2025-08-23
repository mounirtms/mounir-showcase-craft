# GitHub Pages Deployment Script for mounir1.github.io
# This script builds the project and deploys it to GitHub Pages

Write-Host "🚀 Starting deployment to GitHub Pages..." -ForegroundColor Green

# Build the project
Write-Host "📦 Building the project..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

# Copy dist files to root
Write-Host "📁 Copying files to root directory..." -ForegroundColor Yellow
Copy-Item "dist\*" "." -Recurse -Force

# Add files to git
Write-Host "📝 Adding files to git..." -ForegroundColor Yellow
git add index.html assets/ .nojekyll

# Commit changes
$commitMessage = "🚀 Deploy portfolio - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
Write-Host "💾 Committing changes: $commitMessage" -ForegroundColor Yellow
git commit -m $commitMessage

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ No changes to commit" -ForegroundColor Yellow
}

# Push to main branch
Write-Host "⬆️ Pushing to GitHub..." -ForegroundColor Yellow
git push origin tsbuild:main --force

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Deployment successful!" -ForegroundColor Green
    Write-Host "🌐 Your site will be live at https://mounir1.github.io in a few minutes" -ForegroundColor Cyan
    Write-Host "🔗 Custom domain: https://mounir.bio" -ForegroundColor Cyan
} else {
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    exit 1
}
