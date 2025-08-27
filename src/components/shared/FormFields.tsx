import React, { useState, useCallback, forwardRef } from "react";
import { useController, Control, FieldError } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { 
  AlertCircle, 
  CheckCircle, 
  Eye, 
  EyeOff, 
  Calendar as CalendarIcon,
  Upload,
  X,
  Plus
} from "lucide-react";
import { format } from "date-fns";

// Base field props
export interface BaseFieldProps {
  name: string;
  control: Control<any>;
  label?: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  error?: FieldError;
  showValidation?: boolean;
}

// Enhanced Input Field
export interface EnhancedInputProps extends BaseFieldProps {
  type?: "text" | "email" | "password" | "url" | "tel" | "number";
  maxLength?: number;
  showCharCount?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  validation?: {
    pattern?: RegExp;
    message?: string;
  };
  variant?: "default" | "glass" | "modern";
}

export const EnhancedInput = forwardRef<HTMLInputElement, EnhancedInputProps>(({
  name,
  control,
  label,
  description,
  placeholder,
  required = false,
  disabled = false,
  className,
  type = "text",
  maxLength,
  showCharCount = false,
  prefix,
  suffix,
  validation,
  showValidation = true,
  variant = "modern"
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    field,
    fieldState: { error, invalid, isTouched }
  } = useController({
    name,
    control,
    rules: {
      required: required ? `${label || name} is required` : false,
      pattern: validation?.pattern ? {
        value: validation.pattern,
        message: validation.message || "Invalid format"
      } : undefined,
      maxLength: maxLength ? {
        value: maxLength,
        message: `Maximum ${maxLength} characters allowed`
      } : undefined
    }
  });

  const inputType = type === "password" ? (showPassword ? "text" : "password") : type;
  const hasError = invalid && isTouched;
  const isValid = !invalid && isTouched && field.value;

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={name} className="text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      
      <div className="relative">
        {prefix && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            {prefix}
          </div>
        )}
        
        <Input
          {...field}
          id={name}
          type={inputType}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          variant={variant}
          className={cn(
            prefix && "pl-10",
            (suffix || type === "password") && "pr-10",
            hasError && "border-red-500 focus:border-red-500",
            isValid && showValidation && "border-green-500 focus:border-green-500"
          )}
          ref={ref}
        />
        
        {(suffix || type === "password") && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
            {type === "password" && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowPassword(!showPassword)}
                className="h-auto p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            )}
            {suffix}
          </div>
        )}
        
        {showValidation && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            {hasError && <AlertCircle className="w-4 h-4 text-red-500" />}
            {isValid && <CheckCircle className="w-4 h-4 text-green-500" />}
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
          {error && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {error.message}
            </p>
          )}
        </div>
        
        {showCharCount && maxLength && (
          <span className={cn(
            "text-xs",
            (field.value?.length || 0) > maxLength * 0.8 ? "text-orange-500" : "text-muted-foreground"
          )}>
            {field.value?.length || 0}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
});

// Enhanced Select Field
export interface SelectOption {
  label: string;
  value: any;
  disabled?: boolean;
  description?: string;
}

export interface EnhancedSelectProps extends BaseFieldProps {
  options: SelectOption[];
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
}

export const EnhancedSelect: React.FC<EnhancedSelectProps> = ({
  name,
  control,
  label,
  description,
  placeholder = "Select an option...",
  required = false,
  disabled = false,
  className,
  options,
  multiple = false,
  clearable = false
}) => {
  const {
    field,
    fieldState: { error, invalid, isTouched }
  } = useController({
    name,
    control,
    rules: {
      required: required ? `${label || name} is required` : false
    }
  });

  const hasError = invalid && isTouched;
  const selectedOption = options.find(opt => opt.value === field.value);

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={name} className="text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      
      <Select
        value={field.value || ""}
        onValueChange={field.onChange}
        disabled={disabled}
      >
        <SelectTrigger className={cn(hasError && "border-red-500")}>
          <SelectValue placeholder={placeholder}>
            {selectedOption?.label}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {clearable && field.value && (
            <SelectItem value="" className="text-muted-foreground">
              Clear selection
            </SelectItem>
          )}
          {options.map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              <div>
                <div>{option.label}</div>
                {option.description && (
                  <div className="text-xs text-muted-foreground">{option.description}</div>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error.message}
        </p>
      )}
    </div>
  );
};

// Enhanced Textarea Field
export interface EnhancedTextareaProps extends BaseFieldProps {
  rows?: number;
  maxLength?: number;
  showCharCount?: boolean;
  autoResize?: boolean;
  variant?: "default" | "glass" | "modern";
}

export const EnhancedTextarea: React.FC<EnhancedTextareaProps> = ({
  name,
  control,
  label,
  description,
  placeholder,
  required = false,
  disabled = false,
  className,
  rows = 3,
  maxLength,
  showCharCount = false,
  autoResize = false,
  variant = "modern"
}) => {
  const {
    field,
    fieldState: { error, invalid, isTouched }
  } = useController({
    name,
    control,
    rules: {
      required: required ? `${label || name} is required` : false,
      maxLength: maxLength ? {
        value: maxLength,
        message: `Maximum ${maxLength} characters allowed`
      } : undefined
    }
  });

  const hasError = invalid && isTouched;

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={name} className="text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      
      <Textarea
        {...field}
        id={name}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        variant={variant}
        className={cn(
          hasError && "border-red-500 focus:border-red-500",
          autoResize && "resize-none"
        )}
        style={autoResize ? { height: 'auto', minHeight: `${rows * 1.5}em` } : undefined}
      />
      
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
          {error && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {error.message}
            </p>
          )}
        </div>
        
        {showCharCount && maxLength && (
          <span className={cn(
            "text-xs",
            (field.value?.length || 0) > maxLength * 0.8 ? "text-orange-500" : "text-muted-foreground"
          )}>
            {field.value?.length || 0}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
};

// Date Picker Field
export interface DatePickerProps extends BaseFieldProps {
  mode?: "single" | "range";
  showTime?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  name,
  control,
  label,
  description,
  placeholder = "Select date...",
  required = false,
  disabled = false,
  className,
  mode = "single"
}) => {
  const {
    field,
    fieldState: { error, invalid, isTouched }
  } = useController({
    name,
    control,
    rules: {
      required: required ? `${label || name} is required` : false
    }
  });

  const hasError = invalid && isTouched;

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={name} className="text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !field.value && "text-muted-foreground",
              hasError && "border-red-500"
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {field.value ? format(field.value, "PPP") : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={field.value}
            onSelect={field.onChange}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error.message}
        </p>
      )}
    </div>
  );
};

// File Upload Field
export interface FileUploadProps extends BaseFieldProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  maxFiles?: number;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  name,
  control,
  label,
  description,
  required = false,
  disabled = false,
  className,
  accept,
  multiple = false,
  maxSize,
  maxFiles = 1
}) => {
  const {
    field,
    fieldState: { error, invalid, isTouched }
  } = useController({
    name,
    control,
    rules: {
      required: required ? `${label || name} is required` : false
    }
  });

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    field.onChange(multiple ? files : files[0]);
  }, [field, multiple]);

  const removeFile = useCallback((index: number) => {
    if (multiple && Array.isArray(field.value)) {
      const newFiles = field.value.filter((_, i) => i !== index);
      field.onChange(newFiles);
    } else {
      field.onChange(null);
    }
  }, [field, multiple]);

  const hasError = invalid && isTouched;
  const files = multiple ? (field.value || []) : (field.value ? [field.value] : []);

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={name} className="text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      
      <div className={cn(
        "border-2 border-dashed rounded-lg p-4 transition-colors",
        hasError ? "border-red-500" : "border-muted-foreground/25",
        !disabled && "hover:border-muted-foreground/50"
      )}>
        <input
          id={name}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          disabled={disabled}
          className="hidden"
        />
        
        <Label htmlFor={name} className="cursor-pointer">
          <div className="text-center">
            <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              Click to upload or drag and drop
            </p>
            {accept && (
              <p className="text-xs text-muted-foreground mt-1">
                Accepted formats: {accept}
              </p>
            )}
          </div>
        </Label>
        
        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                <span className="text-sm truncate">{file.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  disabled={disabled}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error.message}
        </p>
      )}
    </div>
  );
};

export type {
  BaseFieldProps,
  EnhancedInputProps,
  EnhancedSelectProps,
  EnhancedTextareaProps,
  FileUploadProps
};