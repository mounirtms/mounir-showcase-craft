import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  SkipLinks, 
  AccessibleHeading, 
  AccessibleButton, 
  AccessibleBadge, 
  AccessibleCard,
  AccessibleNav,
  AccessibleList,
  AccessibleListItem,
  AccessibleProgress,
  FocusTrap,
  AccessibilityMenu
} from "@/components/shared/AccessibleComponents";
import { Badge } from "@/components/ui/badge";
import { 
  Accessibility, 
  Eye, 
  Keyboard, 
  Volume2, 
  Monitor,
  CheckCircle,
  AlertTriangle,
  Info,
  X 
} from "lucide-react";

export const AccessibilityDemo: React.FC = () => {
  const [showFocusTrap, setShowFocusTrap] = React.useState(false);
  const [progress, setProgress] = React.useState(45);

  // Demo skip links
  const demoSkipLinks = [
    { id: 'demo-header', label: 'Skip to Header', target: 'demo-header' },
    { id: 'demo-content', label: 'Skip to Main Content', target: 'demo-content' },
    { id: 'demo-actions', label: 'Skip to Actions', target: 'demo-actions' }
  ];

  const demoListItems = [
    { id: '1', label: 'First accessible list item', selected: false },
    { id: '2', label: 'Second accessible list item', selected: true },
    { id: '3', label: 'Third accessible list item (disabled)', selected: false, disabled: true },
    { id: '4', label: 'Fourth accessible list item', selected: false }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Enhanced Skip Links */}
      <SkipLinks links={demoSkipLinks} />
      
      {/* Accessibility Menu */}
      <AccessibilityMenu position="top-right" showLabel={true} />
      
      <div className="container mx-auto px-6 py-12 space-y-8">
        {/* Header */}
        <div id="demo-header" className="text-center space-y-4">
          <AccessibleHeading 
            level={1} 
            className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
            skipLinkLabel="Main heading"
          >
            Accessibility Components Demo
          </AccessibleHeading>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Experience our enhanced accessibility components with improved design, placement, and user experience.
          </p>
        </div>

        {/* Main Content */}
        <div id="demo-content" className="grid gap-6 lg:grid-cols-2">
          {/* Accessible Buttons */}
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Keyboard className="w-5 h-5 text-blue-600" />
                Accessible Buttons
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <AccessibleButton 
                  variant="default"
                  onClick={() => alert('Primary action completed!')}
                >
                  Primary Action
                </AccessibleButton>
                
                <AccessibleButton 
                  variant="outline"
                  onClick={() => alert('Secondary action completed!')}
                >
                  Secondary
                </AccessibleButton>
                
                <AccessibleButton 
                  variant="destructive"
                  onClick={() => alert('Destructive action completed!')}
                >
                  Delete Item
                </AccessibleButton>
                
                <AccessibleButton 
                  loading={true}
                  loadingText="Processing request"
                  variant="secondary"
                >
                  Loading State
                </AccessibleButton>
              </div>
            </CardContent>
          </Card>

          {/* Accessible Badges */}
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-green-600" />
                Status Badges
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <AccessibleBadge 
                  status="success" 
                  variant="default"
                  announcement="Operation completed successfully"
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Success
                </AccessibleBadge>
                
                <AccessibleBadge 
                  status="warning" 
                  variant="outline"
                >
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Warning
                </AccessibleBadge>
                
                <AccessibleBadge 
                  status="error" 
                  variant="destructive"
                >
                  <X className="w-3 h-3 mr-1" />
                  Error
                </AccessibleBadge>
                
                <AccessibleBadge 
                  status="info" 
                  variant="secondary"
                >
                  <Info className="w-3 h-3 mr-1" />
                  Information
                </AccessibleBadge>
              </div>
            </CardContent>
          </Card>

          {/* Interactive Cards */}
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="w-5 h-5 text-purple-600" />
                Interactive Cards
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <AccessibleCard
                title="Interactive Card Example"
                description="This card responds to clicks and keyboard navigation"
                interactive={true}
                selected={false}
                onClick={() => alert('Card clicked!')}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">
                    Accessible Interactive Card
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Click or press Enter to interact with this card. 
                    It includes proper ARIA attributes and keyboard support.
                  </p>
                </div>
              </AccessibleCard>
            </CardContent>
          </Card>

          {/* Accessible Lists */}
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-orange-600" />
                Accessible Lists
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AccessibleList 
                label="Demo options list"
                role="listbox"
                className="space-y-2"
              >
                {demoListItems.map((item) => (
                  <AccessibleListItem
                    key={item.id}
                    role="option"
                    selected={item.selected}
                    disabled={item.disabled}
                    onClick={() => !item.disabled && alert(`Selected: ${item.label}`)}
                    className="px-3 py-2 rounded-md border border-gray-200 bg-white hover:bg-gray-50"
                  >
                    {item.label}
                  </AccessibleListItem>
                ))}
              </AccessibleList>
            </CardContent>
          </Card>

          {/* Progress Indicator */}
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="w-5 h-5 text-indigo-600" />
                Progress Indicators
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <AccessibleProgress
                value={progress}
                max={100}
                label="Upload Progress"
                description="File upload in progress"
                showPercentage={true}
              />
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={() => setProgress(Math.max(0, progress - 10))}
                >
                  Decrease
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => setProgress(Math.min(100, progress + 10))}
                >
                  Increase
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Focus Trap Demo */}
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Accessibility className="w-5 h-5 text-red-600" />
                Focus Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={() => setShowFocusTrap(!showFocusTrap)}>
                {showFocusTrap ? 'Hide' : 'Show'} Focus Trap Demo
              </Button>
              
              {showFocusTrap && (
                <FocusTrap 
                  enabled={showFocusTrap}
                  restoreFocus={true}
                  className="p-4 border-2 border-blue-400 rounded-lg bg-blue-50 dark:bg-blue-900/20"
                >
                  <div className="space-y-3">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100">
                      Focus Trap Active
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-200">
                      Tab navigation is trapped within this area. Press Escape or click outside to exit.
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Button 1</Button>
                      <Button size="sm" variant="outline">Button 2</Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setShowFocusTrap(false)}
                      >
                        Close Trap
                      </Button>
                    </div>
                  </div>
                </FocusTrap>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Navigation Demo */}
        <div id="demo-actions" className="mt-8">
          <AccessibleNav 
            label="Demo navigation"
            orientation="horizontal"
            className="flex justify-center space-x-4 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200"
          >
            <Button variant="ghost" size="sm">Home</Button>
            <Button variant="ghost" size="sm">About</Button>
            <Button variant="ghost" size="sm">Services</Button>
            <Button variant="ghost" size="sm">Contact</Button>
          </AccessibleNav>
        </div>

        {/* Features Overview */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-indigo-500/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              ✨ Enhanced Accessibility Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <Keyboard className="w-8 h-8 mx-auto text-blue-600" />
                <h3 className="font-semibold">Keyboard Navigation</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Full keyboard support with proper focus management and visual indicators.
                </p>
              </div>
              <div className="space-y-2">
                <Volume2 className="w-8 h-8 mx-auto text-green-600" />
                <h3 className="font-semibold">Screen Reader Support</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Comprehensive ARIA attributes and announcements for screen readers.
                </p>
              </div>
              <div className="space-y-2">
                <Eye className="w-8 h-8 mx-auto text-purple-600" />
                <h3 className="font-semibold">Visual Enhancements</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  High contrast mode, improved focus indicators, and better component placement.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AccessibilityDemo;