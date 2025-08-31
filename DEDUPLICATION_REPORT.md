# Code Deduplication Analysis Report

Generated on: 2025-08-31T12:54:43.666Z

## Summary

- **Total files analyzed**: 204
- **Duplicate interfaces found**: 2
- **Duplicate functions found**: 10
- **Common imports**: 37
- **Duplicate constants**: 0
- **Large files (>200 lines)**: 106

## 🔄 Duplicate Interfaces


### Interface Pattern
```typescript
interface User { uid: string; email: string | null; displayName?: string | null; }
```

**Found in:**
- `components\admin\layout\AdminHeader.tsx` (User)
- `components\admin\layout\AdminLayoutDemo.tsx` (User)
- `components\admin\layout\AdminLayoutIntegration.tsx` (User)


### Interface Pattern
```typescript
interface ApiError { message: string; status: number; code?: string; details?: Record<string, any>; ...
```

**Found in:**
- `lib\shared\api-utils.ts` (ApiError)
- `lib\shared\types.ts` (ApiError)


## 🔄 Duplicate Functions


### Function Pattern
```typescript
const toggleTheme = () => { setTheme("light"); };
```

**Found in:**
- `components\admin\AdminNavigation.tsx` (toggleTheme, 3 lines, line 26)
- `components\portfolio\ThemeToggle.tsx` (toggleTheme, 3 lines, line 159)


### Function Pattern
```typescript
const handleImageError = () => { setImageError(true); };
```

**Found in:**
- `components\admin\projects\ProjectCard.tsx` (handleImageError, 3 lines, line 106)
- `components\portfolio\TestimonialsCarousel.tsx` (handleImageError, 3 lines, line 154)


### Function Pattern
```typescript
const alignClasses = { left: 'justify-start', center: 'justify-center', right: 'justify-end' };
```

**Found in:**
- `components\base\BaseCard.tsx` (alignClasses, 5 lines, line 135)
- `components\base\BaseForm.tsx` (alignClasses, 5 lines, line 209)


### Function Pattern
```typescript
const scrollToTop = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); };
```

**Found in:**
- `components\portfolio\AnimationLibraryDemo.tsx` (scrollToTop, 3 lines, line 96)
- `components\portfolio\ScrollAnimationsDemo.tsx` (scrollToTop, 3 lines, line 298)


### Function Pattern
```typescript
const handleMouseEnter = () => { setIsHovered(true); onProjectHover?.(project); };
```

**Found in:**
- `components\portfolio\FilterableProjectGallery.tsx` (handleMouseEnter, 4 lines, line 153)
- `components\portfolio\ProjectShowcase.tsx` (handleMouseEnter, 4 lines, line 144)


### Function Pattern
```typescript
const handleClick = () => { onProjectClick?.(project); };
```

**Found in:**
- `components\portfolio\FilterableProjectGallery.tsx` (handleClick, 3 lines, line 163)
- `components\portfolio\ProjectShowcase.tsx` (handleClick, 3 lines, line 155)


### Function Pattern
```typescript
const layoutClasses = { stacked: "space-y-4", inline: "flex flex-wrap gap-4", grid: `grid gap-4 grid-cols-1 md:grid-cols-${columns}` };
```

**Found in:**
- `components\shared\FormBuilder.tsx` (layoutClasses, 5 lines, line 392)
- `components\shared\FormBuilder.tsx` (layoutClasses, 5 lines, line 631)


### Function Pattern
```typescript
const variantClasses = { default: "border border-input bg-background hover:border-primary/50 focus-visible:border-primary", glass: "border border-border/50 bg-background/50 backdrop-blur-sm hover:bg-b...
```

**Found in:**
- `components\ui\input.tsx` (variantClasses, 5 lines, line 12)
- `components\ui\textarea.tsx` (variantClasses, 5 lines, line 14)


### Function Pattern
```typescript
const handleOnline = () => setIsOnline(true); const handleOffline = () => setIsOnline(false); window.addEventListener('online', handleOnline); window.addEventListener('offline', handleOffline); return...
```

**Found in:**
- `hooks\useProjects.ts` (handleOnline, 10 lines, line 126)
- `hooks\useSkills.ts` (handleOnline, 10 lines, line 49)


### Function Pattern
```typescript
const handleOffline = () => setIsOnline(false); window.addEventListener('online', handleOnline); window.addEventListener('offline', handleOffline); return () => { window.removeEventListener('online', ...
```

**Found in:**
- `hooks\useProjects.ts` (handleOffline, 9 lines, line 127)
- `hooks\useSkills.ts` (handleOffline, 9 lines, line 50)


## 📦 Common Imports


### import { cn } from "@/lib/utils"
**Used in 63 files:**
- `components\admin\AdminDataTable.tsx`
- `components\admin\GoogleAnalyticsInfo.tsx`
- `components\admin\GoogleAnalyticsVerification.tsx`
- `components\portfolio\AnimationLibrary.tsx`
- `components\portfolio\AnimationLibraryDemo.tsx`
- ... and more


### import { Button } from "@/components/ui/button"
**Used in 58 files:**
- `components\admin\AccessibilitySettings.tsx`
- `components\admin\ActionColumn.tsx`
- `components\admin\AdminDashboard.tsx`
- `components\admin\AdminDataTable.tsx`
- `components\admin\AdminNavigation.tsx`
- ... and more


### import { Badge } from "@/components/ui/badge"
**Used in 48 files:**
- `components\admin\AdminDashboard.tsx`
- `components\admin\AdminDataTable.tsx`
- `components\admin\AdminDataTableExample.tsx`
- `components\admin\AdminStats.tsx`
- `components\admin\AnalyticsDashboard.tsx`
- ... and more


### import * as React from "react"
**Used in 33 files:**
- `components\admin\AdminDataTable.tsx`
- `components\admin\AdminDataTableExample.tsx`
- `components\theme\theme-provider.tsx`
- `components\ui\alert-dialog.tsx`
- `components\ui\alert.tsx`
- ... and more


### import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
**Used in 19 files:**
- `components\admin\AdminDashboard.tsx`
- `components\admin\AdminDataTable.tsx`
- `components\admin\AnalyticsDashboard.tsx`
- `components\admin\DataExportManager.tsx`
- `components\admin\enhanced\EnhancedProjectsManager.tsx`
- ... and more


### import React from 'react'
**Used in 18 files:**
- `components\admin\AdminDataTableTest.tsx`
- `components\admin\auth\AdminAuth.tsx`
- `components\admin\auth\AdminAuthDemo.tsx`
- `components\admin\auth\AdminAuthIntegration.tsx`
- `components\admin\auth\AuthGuard.tsx`
- ... and more


### import React from "react"
**Used in 16 files:**
- `components\admin\AccessibilitySettings.tsx`
- `components\admin\AdminNavigation.tsx`
- `components\admin\AdminStats.tsx`
- `components\admin\SkillForm.tsx`
- `components\admin\skills\SkillBulkActions.tsx`
- ... and more


### import { Input } from "@/components/ui/input"
**Used in 16 files:**
- `components\admin\AdminDataTable.tsx`
- `components\admin\enhanced\EnhancedProjectsManager.tsx`
- `components\admin\ImageUpload.tsx`
- `components\admin\projects\ProjectForm.tsx`
- `components\admin\ProjectsManager.tsx`
- ... and more


### import { Button } from '@/components/ui/button'
**Used in 15 files:**
- `components\admin\auth\AdminAuthDemo.tsx`
- `components\admin\auth\AuthGuard.tsx`
- `components\admin\auth\LoginForm.tsx`
- `components\admin\dashboard\QuickActions.tsx`
- `components\admin\dashboard\RecentActivity.tsx`
- ... and more


### import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
**Used in 11 files:**
- `components\admin\auth\AdminAuthDemo.tsx`
- `components\admin\auth\AuthGuard.tsx`
- `components\admin\auth\LoginForm.tsx`
- `components\admin\dashboard\DashboardOverview.tsx`
- `components\admin\dashboard\QuickActions.tsx`
- ... and more


### import { toast } from "@/hooks/use-toast"
**Used in 11 files:**
- `components\admin\DataExportManager.tsx`
- `components\admin\enhanced\EnhancedProjectsManager.tsx`
- `components\admin\projects\ProjectBulkActions.tsx`
- `components\admin\projects\ProjectForm.tsx`
- `components\admin\projects\ProjectsTab.tsx`
- ... and more


### import { cn } from '@/lib/utils'
**Used in 11 files:**
- `components\admin\layout\AdminBreadcrumb.tsx`
- `components\admin\layout\AdminHeader.tsx`
- `components\admin\layout\AdminLayout.tsx`
- `components\admin\layout\AdminSidebar.tsx`
- `components\base\BaseCard.tsx`
- ... and more


### import { useReducedMotion } from "@/hooks/useAccessibility"
**Used in 10 files:**
- `components\portfolio\AnimationLibrary.tsx`
- `components\portfolio\DynamicTypingEffect.tsx`
- `components\portfolio\FilterableProjectGallery.tsx`
- `components\portfolio\HeroSection.tsx`
- `components\portfolio\InteractiveTimeline.tsx`
- ... and more


### import { Card, CardContent } from "@/components/ui/card"
**Used in 9 files:**
- `components\portfolio\ContactForm.tsx`
- `components\portfolio\FilterableProjectGallery.tsx`
- `components\portfolio\LazyPortfolioLoader.tsx`
- `components\portfolio\OptimizedImage.tsx`
- `components\portfolio\ProjectShowcase.tsx`
- ... and more


### import { Label } from "@/components/ui/label"
**Used in 8 files:**
- `components\admin\AccessibilitySettings.tsx`
- `components\admin\enhanced\EnhancedProjectsManager.tsx`
- `components\admin\ImageUpload.tsx`
- `components\admin\projects\ProjectBulkActions.tsx`
- `components\admin\projects\ProjectForm.tsx`
- ... and more


### import { Switch } from "@/components/ui/switch"
**Used in 8 files:**
- `components\admin\AccessibilitySettings.tsx`
- `components\admin\enhanced\EnhancedProjectsManager.tsx`
- `components\admin\projects\ProjectBulkActions.tsx`
- `components\admin\projects\ProjectForm.tsx`
- `components\admin\ProjectsManager.tsx`
- ... and more


### import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
**Used in 8 files:**
- `components\admin\AccessibilitySettings.tsx`
- `components\admin\AdminDataTable.tsx`
- `components\admin\skills\SkillForm.tsx`
- `components\portfolio\SkillVisualization.tsx`
- `components\shared\AnalyticsCharts.tsx`
- ... and more


### import { z } from "zod"
**Used in 8 files:**
- `components\admin\enhanced\EnhancedProjectsManager.tsx`
- `components\admin\projects\ProjectForm.tsx`
- `components\admin\ProjectsManager.tsx`
- `components\admin\skills\SkillForm.tsx`
- `components\admin\SkillsManager.tsx`
- ... and more


### import { Textarea } from "@/components/ui/textarea"
**Used in 8 files:**
- `components\admin\enhanced\EnhancedProjectsManager.tsx`
- `components\admin\projects\ProjectForm.tsx`
- `components\admin\ProjectsManager.tsx`
- `components\admin\skills\SkillForm.tsx`
- `components\admin\SkillsManager.tsx`
- ... and more


### import React, { useState } from "react"
**Used in 7 files:**
- `components\admin\AdminDashboard.tsx`
- `components\admin\GoogleAnalyticsInfo.tsx`
- `components\admin\projects\ProjectCard.tsx`
- `components\portfolio\AnimationLibraryDemo.tsx`
- `components\portfolio\ProjectShowcaseDemo.tsx`
- ... and more


### import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
**Used in 7 files:**
- `components\admin\AdminDashboard.tsx`
- `components\admin\AnalyticsDashboard.tsx`
- `components\admin\projects\ProjectsTab.tsx`
- `components\portfolio\EnhancedPortfolioIntegration.tsx`
- `components\portfolio\ProjectShowcaseDemo.tsx`
- ... and more


### import { Badge } from '@/components/ui/badge'
**Used in 7 files:**
- `components\admin\AdminDataTableTest.tsx`
- `components\admin\dashboard\QuickActions.tsx`
- `components\admin\dashboard\RecentActivity.tsx`
- `components\admin\dashboard\StatsGrid.tsx`
- `components\shared\BaseComponents.tsx`
- ... and more


### import { z } from 'zod'
**Used in 7 files:**
- `lib\schema\hooks.ts`
- `lib\schema\migrations.ts`
- `lib\schema\projectSchema.ts`
- `lib\schema\skillSchema.ts`
- `lib\schema\transformers.ts`
- ... and more


### import { zodResolver } from "@hookform/resolvers/zod"
**Used in 6 files:**
- `components\admin\enhanced\EnhancedProjectsManager.tsx`
- `components\admin\projects\ProjectForm.tsx`
- `components\admin\ProjectsManager.tsx`
- `components\admin\skills\SkillForm.tsx`
- `components\admin\SkillsManager.tsx`
- ... and more


### import { useTheme } from "@/components/theme/theme-provider"
**Used in 5 files:**
- `components\admin\AdminDashboard.tsx`
- `components\admin\AdminNavigation.tsx`
- `components\admin\DataExportManager.tsx`
- `components\admin\ImageUpload.tsx`
- `components\portfolio\ThemeToggle.tsx`



### import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
**Used in 5 files:**
- `components\admin\AdminStats.tsx`
- `components\sections\experience.tsx`
- `components\sections\projects.tsx`
- `components\shared\ErrorBoundary.tsx`
- `components\theme\theme-demo.tsx`



### import { Progress } from "@/components/ui/progress"
**Used in 5 files:**
- `components\admin\AnalyticsDashboard.tsx`
- `components\admin\enhanced\EnhancedProjectsManager.tsx`
- `components\admin\skills\SkillCard.tsx`
- `components\admin\SkillsManager.tsx`
- `components\sections\skills.tsx`



### import { useForm } from "react-hook-form"
**Used in 5 files:**
- `components\admin\enhanced\EnhancedProjectsManager.tsx`
- `components\admin\projects\ProjectForm.tsx`
- `components\admin\ProjectsManager.tsx`
- `components\admin\skills\SkillForm.tsx`
- `components\admin\SkillsManager.tsx`



### import { format } from "date-fns"
**Used in 5 files:**
- `components\admin\enhanced\EnhancedProjectsManager.tsx`
- `components\admin\projects\ProjectCard.tsx`
- `components\admin\projects\ProjectsTab.tsx`
- `components\admin\ProjectsManager.tsx`
- `components\shared\FormFields.tsx`



### import { db } from "@/lib/firebase"
**Used in 5 files:**
- `components\admin\enhanced\EnhancedProjectsManager.tsx`
- `components\admin\projects\ProjectBulkActions.tsx`
- `components\admin\projects\ProjectForm.tsx`
- `components\admin\ProjectsManager.tsx`
- `components\admin\SkillsManager.tsx`



### import { cva, type VariantProps } from "class-variance-authority"
**Used in 5 files:**
- `components\ui\alert.tsx`
- `components\ui\badge.tsx`
- `components\ui\button.tsx`
- `components\ui\label.tsx`
- `components\ui\toast.tsx`



### import { useProjects } from "@/hooks/useProjects"
**Used in 4 files:**
- `components\admin\AdminDashboard.tsx`
- `components\admin\AnalyticsDashboard.tsx`
- `components\admin\DataExportManager.tsx`
- `components\sections\projects.tsx`



### import { Checkbox } from "@/components/ui/checkbox"
**Used in 4 files:**
- `components\admin\AdminDataTable.tsx`
- `components\admin\projects\ProjectCard.tsx`
- `components\shared\AdvancedTable.tsx`
- `components\shared\FormFields.tsx`



### import { useAdminAuth } from '@/hooks/useAdminAuth'
**Used in 4 files:**
- `components\admin\auth\AdminAuth.tsx`
- `components\admin\auth\AuthGuard.tsx`
- `components\admin\auth\LoginForm.tsx`
- `components\admin\auth\__tests__\useAdminAuth.test.ts`



### import React, { useState } from 'react'
**Used in 4 files:**
- `components\admin\auth\LoginForm.tsx`
- `components\admin\layout\AdminLayoutDemo.tsx`
- `components\admin\layout\AdminLayoutIntegration.tsx`
- `components\admin\layout\AdminSidebar.tsx`



### import type { ColumnDef } from "@tanstack/react-table"
**Used in 4 files:**
- `components\admin\enhanced\EnhancedProjectsManager.tsx`
- `components\admin\projects\ProjectsTab.tsx`
- `components\admin\ProjectsManager.tsx`
- `components\admin\SkillsManager.tsx`



### import { Slider } from "@/components/ui/slider"
**Used in 4 files:**
- `components\admin\projects\ProjectBulkActions.tsx`
- `components\admin\projects\ProjectForm.tsx`
- `components\admin\SkillForm.tsx`
- `components\admin\SkillsManager.tsx`



## 🔢 Duplicate Constants

No duplicate constants found.

## 📏 Large Files

- `components\admin\ProjectsManager.tsx` (1642 lines)
- `components\admin\enhanced\EnhancedProjectsManager.tsx` (950 lines)
- `components\admin\SkillsManager.tsx` (922 lines)
- `components\admin\projects\ProjectForm.tsx` (893 lines)
- `components\shared\AdvancedTable.tsx` (885 lines)
- `components\portfolio\FilterableProjectGallery.tsx` (855 lines)
- `components\admin\AdminDataTable.tsx` (846 lines)
- `components\portfolio\ContactForm.tsx` (739 lines)
- `lib\shared\utilities.ts` (716 lines)
- `components\shared\FormBuilder.tsx` (714 lines)
- `pages\Admin.tsx` (685 lines)
- `components\portfolio\TestimonialsCarousel.tsx` (672 lines)
- `components\portfolio\PerformanceMonitor.tsx` (665 lines)
- `components\portfolio\InteractiveTimeline.tsx` (654 lines)
- `components\portfolio\OptimizedImage.tsx` (650 lines)
- `lib\schema\migrations.ts` (648 lines)
- `components\portfolio\SkillVisualization.tsx` (641 lines)
- `components\admin\projects\ProjectBulkActions.tsx` (639 lines)
- `lib\schema\transformers.ts` (632 lines)
- `lib\validation-schemas.ts` (630 lines)
- `components\shared\AccessibleComponents.tsx` (629 lines)
- `components\ui\data-table.tsx` (629 lines)
- `components\portfolio\AnimationLibrary.tsx` (617 lines)
- `components\portfolio\ProjectShowcase.tsx` (611 lines)
- `components\portfolio\EnhancedPortfolioIntegration.tsx` (576 lines)
- `components\shared\FormFields.tsx` (572 lines)
- `lib\schema\hooks.ts` (569 lines)
- `components\portfolio\LazyPortfolioLoader.tsx` (558 lines)
- `components\portfolio\ThemeToggle.tsx` (554 lines)
- `components\shared\BaseComponents.tsx` (554 lines)
- `components\portfolio\ProjectShowcaseDemo.tsx` (552 lines)
- `data\initial-projects.ts` (546 lines)
- `components\portfolio\ProfessionalAvatar.tsx` (544 lines)
- `components\admin\projects\ProjectCard.tsx` (542 lines)
- `lib\loading-feedback-system.tsx` (539 lines)
- `components\base\BaseDataTable.tsx` (525 lines)
- `hooks\useAdminActions.ts` (504 lines)
- `lib\shared\component-props.ts` (501 lines)
- `components\portfolio\DynamicTypingEffect.tsx` (490 lines)
- `lib\error-handling-enhanced.ts` (486 lines)
- `components\portfolio\HeroSection.tsx` (481 lines)
- `components\portfolio\AnimationLibraryDemo.tsx` (475 lines)
- `contexts\GlobalStateContext.tsx` (473 lines)
- `components\admin\AnalyticsDashboard.tsx` (466 lines)
- `components\shared\AnalyticsCharts.tsx` (451 lines)
- `components\portfolio\InteractiveCodeSnippets.tsx` (449 lines)
- `hooks\useAccessibility.ts` (449 lines)
- `lib\shared\types.ts` (441 lines)
- `components\admin\projects\ProjectsTab.tsx` (439 lines)
- `lib\data-population-service.ts` (439 lines)
- `lib\error-handling.ts` (434 lines)
- `components\ui\enhanced-data-table.tsx` (430 lines)
- `data\initial-skills.ts` (427 lines)
- `hooks\useUserTracking.ts` (420 lines)
- `components\portfolio\SkillVisualizationDemo.tsx` (415 lines)
- `hooks\useAdminActivityLogging.ts` (410 lines)
- `hooks\useAutoSave.ts` (404 lines)
- `hooks\usePerformanceMonitoring.ts` (401 lines)
- `lib\performance.ts` (400 lines)
- `lib\schema\examples.ts` (398 lines)
- `lib\schema\validators.ts` (394 lines)
- `components\shared\ConfirmDialog.tsx` (380 lines)
- `lib\schema\projectSchema.ts` (379 lines)
- `components\shared\ErrorBoundary.tsx` (378 lines)
- `components\theme\themes.ts` (375 lines)
- `components\admin\AdminDataTableExample.tsx` (366 lines)
- `lib\firebase-data-service.ts` (362 lines)
- `lib\schema\skillSchema.ts` (362 lines)
- `hooks\useProjects.ts` (358 lines)
- `lib\shared\validators.ts` (356 lines)
- `demos\AccessibilityDemo.tsx` (350 lines)
- `contexts\AdminStatsContext.tsx` (341 lines)
- `hooks\useAdminNavigation.ts` (341 lines)
- `components\portfolio\ScrollAnimationsDemo.tsx` (338 lines)
- `components\theme\theme-system.test.tsx` (324 lines)
- `components\sections\projects.tsx` (323 lines)
- `components\admin\layout\AdminLayoutIntegration.tsx` (322 lines)
- `lib\skill-icons.tsx` (322 lines)
- `components\shared\EmptyStates.tsx` (315 lines)
- `lib\shared\constants.ts` (313 lines)
- `hooks\useSkills.ts` (301 lines)
- `components\shared\MobileOptimized.tsx` (300 lines)
- `components\admin\GoogleAnalyticsVerification.tsx` (299 lines)
- `contexts\AccessibilityContext.tsx` (295 lines)
- `lib\schema\__tests__\validators.test.ts` (295 lines)
- `components\admin\GoogleAnalyticsInfo.tsx` (286 lines)
- `components\theme\theme-demo.tsx` (286 lines)
- `utils\tableExport.ts` (283 lines)
- `components\shared\PerformanceOptimizations.ts` (281 lines)
- `lib\utils\deduplication.ts` (281 lines)
- `components\admin\dashboard\RecentActivity.tsx` (273 lines)
- `components\admin\SkillForm.tsx` (272 lines)
- `components\ui\error-boundary.tsx` (268 lines)
- `components\admin\layout\__tests__\AdminLayout.test.tsx` (263 lines)
- `components\shared\LoadingStates.tsx` (257 lines)
- `components\shared\VirtualScroll.tsx` (254 lines)
- `components\ui\signature.tsx` (246 lines)
- `lib\shared\index.ts` (242 lines)
- `components\admin\skills\SkillForm.tsx` (238 lines)
- `components\admin\AccessibilitySettings.tsx` (229 lines)
- `lib\shared\api-utils.ts` (225 lines)
- `components\admin\dashboard\StatsGrid.tsx` (224 lines)
- `components\base\BaseForm.tsx` (220 lines)
- `components\admin\DataExportManager.tsx` (207 lines)
- `components\admin\dashboard\QuickActions.tsx` (202 lines)
- `lib\schema\types.ts` (201 lines)

## 🛠️ Recommendations

### High Priority
1. **Extract duplicate interfaces** into shared type files
2. **Consolidate duplicate functions** into utility modules
3. **Break down large files** into smaller, focused components

### Medium Priority
1. **Create shared constants** file for duplicate constants
2. **Optimize imports** by creating barrel exports
3. **Implement base components** for common UI patterns

### Low Priority
1. **Review and refactor** similar code patterns
2. **Consider using composition** over inheritance
3. **Implement code splitting** for large modules

## 📋 Action Items

- [x] Create `src/lib/shared/types.ts` for common interfaces
- [x] Create `src/lib/shared/constants.ts` for shared constants
- [x] Create `src/lib/shared/utils.ts` for common utilities
- [x] Implement base components in `src/components/base/`
- [ ] Refactor large files into smaller modules
- [ ] Set up ESLint rules to prevent future duplication

---

*This report was generated automatically. Review suggestions carefully before implementing changes.*
