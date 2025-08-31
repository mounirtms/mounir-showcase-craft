import React, { useState, useCallback, useEffect, useRef } from "react";
import { useForm, useFormContext, FormProvider, Controller, FieldError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  ChevronRight,
  Save,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Clock,
  Eye,
  EyeOff
} from "lucide-react";
import { cn } from "@/lib/utils";

// Form field types
export interface BaseFieldConfig {
  id: string;
  label: string;
  type: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  validation?: z.ZodSchema<any>;
  dependsOn?: string; // Field ID that this field depends on
  dependsOnValue?: any; // Value that the dependency field must have
  className?: string;
}

export interface TextFieldConfig extends BaseFieldConfig {
  type: "text" | "email" | "password" | "url" | "tel";
  maxLength?: number;
  minLength?: number;
  pattern?: string;
}

export interface TextareaFieldConfig extends BaseFieldConfig {
  type: "textarea";
  rows?: number;
  maxLength?: number;
  minLength?: number;
}

export interface NumberFieldConfig extends BaseFieldConfig {
  type: "number";
  min?: number;
  max?: number;
  step?: number;
}

export interface SelectFieldConfig extends BaseFieldConfig {
  type: "select";
  options: Array<{ label: string; value: any; disabled?: boolean }>;
  multiple?: boolean;
  searchable?: boolean;
}

export interface CheckboxFieldConfig extends BaseFieldConfig {
  type: "checkbox";
  options?: Array<{ label: string; value: any; disabled?: boolean }>;
}

export interface RadioFieldConfig extends BaseFieldConfig {
  type: "radio";
  options: Array<{ label: string; value: any; disabled?: boolean }>;
  inline?: boolean;
}

export interface DateFieldConfig extends BaseFieldConfig {
  type: "date" | "datetime" | "time";
  min?: string;
  max?: string;
}

export interface FileFieldConfig extends BaseFieldConfig {
  type: "file";
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  maxFiles?: number;
}

export interface CustomFieldConfig extends BaseFieldConfig {
  type: "custom";
  component: React.ComponentType<any>;
  props?: Record<string, any>;
}

export type FieldConfig = 
  | TextFieldConfig 
  | TextareaFieldConfig 
  | NumberFieldConfig 
  | SelectFieldConfig 
  | CheckboxFieldConfig 
  | RadioFieldConfig 
  | DateFieldConfig 
  | FileFieldConfig 
  | CustomFieldConfig;

// Form section configuration
export interface FormSection {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  fields: FieldConfig[];
  className?: string;
  validation?: z.ZodSchema<any>;
  dependsOn?: string; // Section ID that this section depends on
  dependsOnValue?: any;
}

// Auto-save configuration
export interface AutoSaveConfig {
  enabled: boolean;
  interval?: number; // in milliseconds
  key: string; // localStorage key
  onSave?: (data: any) => void;
  onRestore?: (data: any) => void;
}

// Form builder props
export interface FormBuilderProps {
  // Form configuration
  sections: FormSection[];
  schema?: z.ZodSchema<any>;
  defaultValues?: Record<string, any>;
  
  // Auto-save
  autoSave?: AutoSaveConfig;
  
  // Validation
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  
  // UI customization
  className?: string;
  sectionClassName?: string;
  fieldClassName?: string;
  
  // Layout
  layout?: "stacked" | "inline" | "grid";
  columns?: number;
  spacing?: "compact" | "normal" | "relaxed";
  
  // Navigation
  showSectionNavigation?: boolean;
  stickyNavigation?: boolean;
  
  // Actions
  actions?: React.ReactNode;
  onSubmit?: (data: any) => void | Promise<void>;
  onReset?: () => void;
  onFieldChange?: (fieldId: string, value: any, allValues: any) => void;
  
  // Loading states
  loading?: boolean;
  submitting?: boolean;
  
  // Debug
  showDebugInfo?: boolean;
}

// Form builder component
export const FormBuilder: React.FC<FormBuilderProps> = ({
  sections,
  schema,
  defaultValues = {},
  autoSave,
  validateOnChange = true,
  validateOnBlur = true,
  className = "",
  sectionClassName = "",
  fieldClassName = "",
  layout = "stacked",
  columns = 1,
  spacing = "normal",
  showSectionNavigation = true,
  stickyNavigation = false,
  actions,
  onSubmit,
  onReset,
  onFieldChange,
  loading = false,
  submitting = false,
  showDebugInfo = false
}) => {
  // Form state
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    new Set(sections.filter(s => s.defaultCollapsed).map(s => s.id))
  );
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || "");
  const [autoSaveStatus, setAutoSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  
  // Auto-save timer ref
  const autoSaveTimer = useRef<NodeJS.Timeout>();
  const lastSaveData = useRef<string>("");

  // Initialize form with react-hook-form
  const form = useForm({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues,
    mode: validateOnChange ? "onChange" : validateOnBlur ? "onBlur" : "onSubmit"
  });

  const { 
    handleSubmit, 
    reset, 
    watch, 
    formState: { errors, isDirty, isValid },
    setValue,
    getValues
  } = form;

  // Watch all form values for auto-save
  const watchedValues = watch();

  // Auto-save functionality
  useEffect(() => {
    if (!autoSave?.enabled || !isDirty) return;

    const currentData = JSON.stringify(watchedValues);
    if (currentData === lastSaveData.current) return;

    // Clear existing timer
    if (autoSaveTimer.current) {
      clearTimeout(autoSaveTimer.current);
    }

    // Set new timer
    autoSaveTimer.current = setTimeout(() => {
      setAutoSaveStatus("saving");
      
      try {
        // Save to localStorage
        localStorage.setItem(autoSave.key, currentData);
        lastSaveData.current = currentData;
        
        // Call custom save handler
        autoSave.onSave?.(watchedValues);
        
        setAutoSaveStatus("saved");
        
        // Reset status after 2 seconds
        setTimeout(() => setAutoSaveStatus("idle"), 2000);
      } catch (error) {
        console.error("Auto-save failed:", error);
        setAutoSaveStatus("error");
        setTimeout(() => setAutoSaveStatus("idle"), 3000);
      }
    }, autoSave.interval || 2000);

    return () => {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
      }
    };
  }, [watchedValues, isDirty, autoSave]);

  // Restore from auto-save on mount
  useEffect(() => {
    if (!autoSave?.enabled) return;

    try {
      const savedData = localStorage.getItem(autoSave.key);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        
        // Merge with default values
        const mergedData = { ...defaultValues, ...parsedData };
        
        // Reset form with saved data
        reset(mergedData);
        lastSaveData.current = savedData;
        
        // Call custom restore handler
        autoSave.onRestore?.(parsedData);
      }
    } catch (error) {
      console.error("Failed to restore auto-saved data:", error);
    }
  }, [autoSave, defaultValues, reset]);

  // Handle field changes
  useEffect(() => {
    if (onFieldChange) {
      const subscription = watch((value, { name }) => {
        if (name) {
          onFieldChange(name, value[name], value);
        }
      });
      return () => subscription.unsubscribe();
    }
  }, [watch, onFieldChange]);

  // Section navigation
  const toggleSection = useCallback((sectionId: string) => {
    setCollapsedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  }, []);

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(`section-${sectionId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(sectionId);
    }
  }, []);

  // Check if field should be visible based on dependencies
  const isFieldVisible = useCallback((field: FieldConfig, allValues: any) => {
    if (field.hidden) return false;
    if (!field.dependsOn) return true;
    
    const dependencyValue = allValues[field.dependsOn];
    return dependencyValue === field.dependsOnValue;
  }, []);

  // Check if section should be visible
  const isSectionVisible = useCallback((section: FormSection, allValues: any) => {
    if (!section.dependsOn) return true;
    
    const dependencyValue = allValues[section.dependsOn];
    return dependencyValue === section.dependsOnValue;
  }, []);

  // Get section validation errors
  const getSectionErrors = useCallback((section: FormSection) => {
    return section.fields.filter(field => errors[field.id]).length;
  }, [errors]);

  // Handle form submission
  const onFormSubmit = handleSubmit(async (data) => {
    if (onSubmit) {
      await onSubmit(data);
      
      // Clear auto-save after successful submission
      if (autoSave?.enabled) {
        localStorage.removeItem(autoSave.key);
        lastSaveData.current = "";
      }
    }
  });

  // Handle form reset
  const onFormReset = useCallback(() => {
    reset(defaultValues);
    onReset?.();
    
    // Clear auto-save
    if (autoSave?.enabled) {
      localStorage.removeItem(autoSave.key);
      lastSaveData.current = "";
    }
  }, [reset, defaultValues, onReset, autoSave]);

  // Spacing classes
  const spacingClasses = {
    compact: "space-y-2",
    normal: "space-y-4",
    relaxed: "space-y-6"
  };

  // Layout classes
  const layoutClasses = {
    stacked: "space-y-4",
    inline: "flex flex-wrap gap-4",
    grid: `grid gap-4 grid-cols-1 md:grid-cols-${columns}`
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Loading form...</span>
      </div>
    );
  }

  return (
    <FormProvider {...form}>
      <div className={cn("space-y-6", className)}>
        {/* Section Navigation */}
        {showSectionNavigation && sections.length > 1 && (
          <Card className={cn(stickyNavigation && "sticky top-4 z-10")}>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-2">
                {sections
                  .filter(section => isSectionVisible(section, watchedValues))
                  .map((section) => {
                    const errorCount = getSectionErrors(section);
                    const isActive = activeSection === section.id;
                    
                    return (
                      <Button
                        key={section.id}
                        variant={isActive ? "default" : "outline"}
                        size="sm"
                        onClick={() => scrollToSection(section.id)}
                        className="relative"
                      >
                        {section.icon}
                        {section.title}
                        {errorCount > 0 && (
                          <Badge 
                            variant="destructive" 
                            className="ml-2 h-5 w-5 rounded-full p-0 text-xs"
                          >
                            {errorCount}
                          </Badge>
                        )}
                      </Button>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Auto-save Status */}
        {autoSave?.enabled && (
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              {autoSaveStatus === "saving" && (
                <>
                  <Clock className="w-4 h-4 animate-pulse" />
                  <span>Saving...</span>
                </>
              )}
              {autoSaveStatus === "saved" && (
                <>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Auto-saved</span>
                </>
              )}
              {autoSaveStatus === "error" && (
                <>
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span>Save failed</span>
                </>
              )}
            </div>
            
            {isDirty && autoSaveStatus === "idle" && (
              <span>Unsaved changes</span>
            )}
          </div>
        )}

        {/* Form */}
        <form onSubmit={onFormSubmit} className="space-y-6">
          {/* Sections */}
          <div className={cn(layoutClasses[layout], spacingClasses[spacing])}>
            {sections
              .filter(section => isSectionVisible(section, watchedValues))
              .map((section) => {
                const isCollapsed = collapsedSections.has(section.id);
                const errorCount = getSectionErrors(section);
                
                return (
                  <Card
                    key={section.id}
                    id={`section-${section.id}`}
                    className={cn(sectionClassName, section.className)}
                  >
                    <Collapsible
                      open={!isCollapsed}
                      onOpenChange={() => section.collapsible && toggleSection(section.id)}
                    >
                      <CardHeader className="pb-4">
                        <CollapsibleTrigger asChild={section.collapsible}>
                          <div 
                            className={cn(
                              "flex items-center justify-between",
                              section.collapsible && "cursor-pointer hover:bg-muted/50 -m-2 p-2 rounded"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              {section.collapsible && (
                                isCollapsed ? 
                                  <ChevronRight className="w-4 h-4" /> : 
                                  <ChevronDown className="w-4 h-4" />
                              )}
                              {section.icon}
                              <div>
                                <CardTitle className="flex items-center gap-2">
                                  {section.title}
                                  {errorCount > 0 && (
                                    <Badge variant="destructive" className="h-5 text-xs">
                                      {errorCount} error{errorCount > 1 ? 's' : ''}
                                    </Badge>
                                  )}
                                </CardTitle>
                                {section.description && (
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {section.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </CollapsibleTrigger>
                      </CardHeader>

                      <CollapsibleContent>
                        <CardContent className="pt-0">
                          <FormSection
                            section={section}
                            allValues={watchedValues}
                            isFieldVisible={isFieldVisible}
                            fieldClassName={fieldClassName}
                            layout={layout}
                            columns={columns}
                          />
                        </CardContent>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                );
              })}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button
                type="submit"
                disabled={submitting || !isValid}
                className="gap-2"
              >
                {submitting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {submitting ? "Saving..." : "Save"}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={onFormReset}
                disabled={submitting || !isDirty}
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </div>

            {actions}
          </div>
        </form>

        {/* Debug Info */}
        {showDebugInfo && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Debug Information</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-40">
                <pre className="text-xs">
                  {JSON.stringify({ 
                    values: watchedValues, 
                    errors, 
                    isDirty, 
                    isValid 
                  }, null, 2)}
                </pre>
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </div>
    </FormProvider>
  );
};

// Form section renderer component
interface FormSectionProps {
  section: FormSection;
  allValues: any;
  isFieldVisible: (field: FieldConfig, allValues: any) => boolean;
  fieldClassName: string;
  layout: "stacked" | "inline" | "grid";
  columns: number;
}

const FormSection: React.FC<FormSectionProps> = ({
  section,
  allValues,
  isFieldVisible,
  fieldClassName,
  layout,
  columns
}) => {
  const visibleFields = section.fields.filter(field => isFieldVisible(field, allValues));

  if (visibleFields.length === 0) {
    return null;
  }

  const layoutClasses = {
    stacked: "space-y-4",
    inline: "flex flex-wrap gap-4",
    grid: `grid gap-4 grid-cols-1 md:grid-cols-${columns}`
  };

  return (
    <div className={layoutClasses[layout]}>
      {visibleFields.map((field) => (
        <FormField
          key={field.id}
          field={field}
          className={cn(fieldClassName, field.className)}
        />
      ))}
    </div>
  );
};

// Form field renderer component
interface FormFieldProps {
  field: FieldConfig;
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({ field, className }) => {
  const { control, formState: { errors } } = useFormContext();
  const error = errors[field.id] as FieldError;

  return (
    <div className={cn("space-y-2", className)}>
      <Controller
        name={field.id}
        control={control}
        render={({ field: formField }) => (
          <FieldRenderer 
            field={field} 
            formField={formField} 
            error={error}
          />
        )}
      />
    </div>
  );
};

// Field renderer component
interface FieldRendererProps {
  field: FieldConfig;
  formField: any;
  error?: FieldError;
}

const FieldRenderer: React.FC<FieldRendererProps> = ({ field, formField, error }) => {
  // Handle different field types
  const renderField = () => {
    switch (field.type) {
      case "text":
      case "email":
      case "password":
      case "url":
      case "tel":
        return (
          <input
            {...formField}
            type={field.type}
            placeholder={field.placeholder}
            disabled={field.disabled}
            className="w-full px-3 py-2 border rounded-md"
          />
        );
      
      case "textarea":
        return (
          <textarea
            {...formField}
            placeholder={field.placeholder}
            disabled={field.disabled}
            rows={(field as TextareaFieldConfig).rows || 3}
            className="w-full px-3 py-2 border rounded-md"
          />
        );
      
      case "number":
        return (
          <input
            {...formField}
            type="number"
            placeholder={field.placeholder}
            disabled={field.disabled}
            min={(field as NumberFieldConfig).min}
            max={(field as NumberFieldConfig).max}
            step={(field as NumberFieldConfig).step}
            className="w-full px-3 py-2 border rounded-md"
          />
        );
      
      case "select":
        const selectField = field as SelectFieldConfig;
        return (
          <select
            {...formField}
            disabled={field.disabled}
            multiple={selectField.multiple}
            className="w-full px-3 py-2 border rounded-md"
          >
            {selectField.options.map((option) => (
              <option 
                key={option.value} 
                value={option.value} 
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case "checkbox":
        const checkboxField = field as CheckboxFieldConfig;
        if (checkboxField.options && checkboxField.options.length > 0) {
          return (
            <div className="flex flex-col space-y-2">
              {checkboxField.options.map((option) => (
                <label key={option.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={option.value}
                    checked={formField.value?.includes(option.value)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        formField.onChange([...(formField.value || []), option.value]);
                      } else {
                        formField.onChange(formField.value.filter((v: any) => v !== option.value));
                      }
                    }}
                    disabled={option.disabled || field.disabled}
                    className="rounded"
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          );
        } else {
          return (
            <div className="flex items-center space-x-2">
              <input
                {...formField}
                type="checkbox"
                checked={formField.value || false}
                onChange={(e) => formField.onChange(e.target.checked)}
                disabled={field.disabled}
                className="rounded"
              />
              <span>{field.label}</span>
            </div>
          );
        }
      
      case "radio":
        const radioField = field as RadioFieldConfig;
        return (
          <div className={radioField.inline ? "flex space-x-4" : "flex flex-col space-y-2"}>
            {radioField.options.map((option) => (
              <label key={option.value} className="flex items-center space-x-2">
                <input
                  type="radio"
                  value={option.value}
                  checked={formField.value === option.value}
                  onChange={() => formField.onChange(option.value)}
                  disabled={option.disabled || field.disabled}
                  className="rounded"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        );
      
      case "date":
      case "datetime":
      case "time":
        return (
          <input
            {...formField}
            type={field.type === "datetime" ? "datetime-local" : field.type}
            placeholder={field.placeholder}
            disabled={field.disabled}
            min={(field as DateFieldConfig).min}
            max={(field as DateFieldConfig).max}
            className="w-full px-3 py-2 border rounded-md"
          />
        );
      
      case "file":
        return (
          <input
            {...formField}
            type="file"
            placeholder={field.placeholder}
            disabled={field.disabled}
            accept={(field as FileFieldConfig).accept}
            multiple={(field as FileFieldConfig).multiple}
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              formField.onChange(files);
            }}
            className="w-full px-3 py-2 border rounded-md"
          />
        );
      
      case "custom":
        const customField = field as CustomFieldConfig;
        return <customField.component {...formField} {...customField.props} />;
      
      default:
        return (
          <input
            {...formField}
            type="text"
            placeholder={field.placeholder}
            disabled={field.disabled}
            className="w-full px-3 py-2 border rounded-md"
          />
        );
    }
  };

  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {renderField()}
      
      {field.description && (
        <p className="text-xs text-muted-foreground">{field.description}</p>
      )}
      
      {error && (
        <p className="text-xs text-red-500">{error.message}</p>
      )}
    </div>
  );
};

export default FormBuilder;