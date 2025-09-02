import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Check, 
  X, 
  AlertCircle, 
  Loader2, 
  Mail, 
  User, 
  MessageSquare,
  Phone,
  Building,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Clock,
  MapPin
} from "lucide-react";
import { cn } from "@/lib/utils";
import { trackButtonClick, trackFormSubmit } from "@/utils/analytics";

// Types
interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  customValidator?: (value: string) => string | null;
}

interface FieldError {
  message: string;
  type: "error" | "warning" | "info";
}

interface FormField {
  label: string;
  placeholder: string;
  icon: React.ReactNode;
  validation: ValidationRule;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  website: string;
  subject: string;
  message: string;
  newsletter: boolean;
}

export interface ContactFormProps {
  className?: string;
  onSubmit?: (data: ContactFormData) => Promise<void>;
  enableSocialLinks?: boolean;
  showSuccessMessage?: boolean;
}

// Form configuration
const FORM_FIELDS: Record<keyof ContactFormData, FormField> = {
  name: {
    label: "Full Name",
    placeholder: "Enter your full name",
    icon: <User className="w-4 h-4" />,
    validation: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-Z\s'-]+$/,
      customValidator: (value: string) => {
        if (value.trim().split(' ').length < 2) {
          return "Please enter your first and last name";
        }
        return null;
      }
    }
  },
  email: {
    label: "Email Address",
    placeholder: "your.email@example.com",
    icon: <Mail className="w-4 h-4" />,
    validation: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      customValidator: (value: string) => {
        const commonDomains = ['gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com'];
        const domain = value.split('@')[1];
        if (domain && !commonDomains.includes(domain) && !domain.includes('.')) {
          return "Please use a valid email domain";
        }
        return null;
      }
    }
  },
  phone: {
    label: "Phone Number",
    placeholder: "+1 (555) 123-4567",
    icon: <Phone className="w-4 h-4" />,
    validation: {
      pattern: /^[+]?[1-9][\d]{0,15}$/,
      customValidator: (value: string) => {
        if (value && value.length < 10) {
          return "Phone number should be at least 10 digits";
        }
        return null;
      }
    }
  },
  company: {
    label: "Company / Organization",
    placeholder: "Your company name",
    icon: <Building className="w-4 h-4" />,
    validation: {
      maxLength: 100
    }
  },
  website: {
    label: "Website",
    placeholder: "https://yourwebsite.com",
    icon: <Globe className="w-4 h-4" />,
    validation: {
      pattern: /^https?:\/\/.+\..+/,
      customValidator: (value: string) => {
        if (value && !value.startsWith('http')) {
          return "Website URL should start with http:// or https://";
        }
        return null;
      }
    }
  },
  subject: {
    label: "Subject",
    placeholder: "Brief description of your inquiry",
    icon: <MessageSquare className="w-4 h-4" />,
    validation: {
      required: true,
      minLength: 5,
      maxLength: 100
    }
  },
  message: {
    label: "Message",
    placeholder: "Tell me about your project, goals, or any questions you have...",
    icon: <MessageSquare className="w-4 h-4" />,
    validation: {
      required: true,
      minLength: 10,
      maxLength: 1000
    }
  },
  newsletter: {
    label: "Newsletter",
    placeholder: "",
    icon: <Mail className="w-4 h-4" />,
    validation: {}
  }
};

// Social links
const SOCIAL_LINKS = [
  {
    icon: <Github className="w-5 h-5" />,
    label: "GitHub",
    url: "https://github.com/mounir",
    username: "@mounir"
  },
  {
    icon: <Linkedin className="w-5 h-5" />,
    label: "LinkedIn",
    url: "https://linkedin.com/in/mounir",
    username: "Mounir"
  },
  {
    icon: <Twitter className="w-5 h-5" />,
    label: "Twitter",
    url: "https://twitter.com/mounir",
    username: "@mounir"
  }
];

// Validation hook
const useFormValidation = (initialData: ContactFormData) => {
  const [formData, setFormData] = useState<ContactFormData>(initialData);
  const [errors, setErrors] = useState<Record<keyof ContactFormData, FieldError | null>>({} as Record<keyof ContactFormData, FieldError | null>);
  const [touchedFields, setTouchedFields] = useState<Set<keyof ContactFormData>>(new Set());
  const [isValid, setIsValid] = useState(false);

  const validateField = (name: keyof ContactFormData, value: string): FieldError | null => {
    const field = FORM_FIELDS[name];
    if (!field) return null;

    const { validation } = field;

    // Required validation
    if (validation.required && (!value || value.trim() === '')) {
      return { message: `${field.label} is required`, type: 'error' };
    }

    // Skip other validations if field is empty and not required
    if (!value || value.trim() === '') {
      return null;
    }

    // Length validation
    if ('minLength' in validation && validation.minLength && value.length < validation.minLength) {
      return { 
        message: `${field.label} must be at least ${validation.minLength} characters`, 
        type: 'error' 
      };
    }

    if ('maxLength' in validation && validation.maxLength && value.length > validation.maxLength) {
      return { 
        message: `${field.label} cannot exceed ${validation.maxLength} characters`, 
        type: 'warning' 
      };
    }

    // Pattern validation
    if ('pattern' in validation && validation.pattern && !validation.pattern.test(value)) {
      switch (name) {
        case 'email':
          return { message: 'Please enter a valid email address', type: 'error' };
        case 'phone':
          return { message: 'Please enter a valid phone number', type: 'error' };
        case 'website':
          return { message: 'Please enter a valid website URL', type: 'error' };
        case 'name':
          return { message: 'Name can only contain letters, spaces, hyphens, and apostrophes', type: 'error' };
        default:
          return { message: 'Invalid format', type: 'error' };
      }
    }

    // Custom validation
    if ('customValidator' in validation && validation.customValidator) {
      const customError = validation.customValidator(value);
      if (customError) {
        return { message: customError, type: 'error' };
      }
    }

    return null;
  };

  const updateField = (name: keyof ContactFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setTouchedFields(prev => new Set(prev).add(name));

    // Real-time validation (only for string values)
    if (typeof value === 'string') {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const validateAllFields = () => {
    const newErrors: Record<keyof ContactFormData, FieldError | null> = {} as Record<keyof ContactFormData, FieldError | null>;
    let hasErrors = false;

    Object.keys(FORM_FIELDS).forEach(fieldName => {
      const key = fieldName as keyof ContactFormData;
      const value = formData[key];
      if (typeof value === 'string') {
        const error = validateField(key, value);
        newErrors[key] = error;
        if (error && error.type === 'error') {
          hasErrors = true;
        }
      }
    });

    setErrors(newErrors);
    setIsValid(!hasErrors);
    return !hasErrors;
  };

  useEffect(() => {
    const hasErrors = Object.values(errors).some(error => error && error.type === 'error');
    const requiredFields = Object.entries(FORM_FIELDS)
      .filter(([, config]) => 'required' in config.validation && config.validation.required)
      .map(([name]) => name as keyof ContactFormData);
    
    const requiredFieldsFilled = requiredFields.every(field => {
      const value = formData[field];
      return typeof value === 'string' && value.trim() !== '';
    });

    setIsValid(!hasErrors && requiredFieldsFilled);
  }, [formData, errors]);

  return {
    formData,
    errors,
    touchedFields,
    isValid,
    updateField,
    validateAllFields,
    setFormData
  };
};

// Form field component
interface FormFieldProps {
  name: keyof ContactFormData;
  type?: "text" | "email" | "tel" | "url" | "textarea";
  value: string;
  error: FieldError | null;
  touched: boolean;
  onChange: (name: keyof ContactFormData, value: string) => void;
  disabled?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  name,
  type = "text",
  value,
  error,
  touched,
  onChange,
  disabled
}) => {
  const field = FORM_FIELDS[name];
  if (!field) return null;

  const hasError = error && error.type === 'error';
  const hasWarning = error && error.type === 'warning';
  const isValid = touched && !error && value.trim() !== '';

  const inputClasses = cn(
    "transition-all duration-200 bg-white/50 border-2 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-offset-2",
    hasError && "border-red-400 focus:border-red-500 focus:ring-red-500/20 bg-red-50/50",
    hasWarning && "border-yellow-400 focus:border-yellow-500 focus:ring-yellow-500/20 bg-yellow-50/50",
    isValid && "border-green-400 focus:border-green-500 focus:ring-green-500/20 bg-green-50/50",
    !hasError && !hasWarning && !isValid && "border-border hover:border-primary/50 focus:border-primary focus:ring-primary/20"
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(name, e.target.value);
  };

  return (
    <div className="space-y-3">
      <label htmlFor={name} className="text-sm font-semibold text-foreground flex items-center gap-2 font-heading">
        <div className="p-1 rounded-md bg-primary/10 text-primary">
          {field.icon}
        </div>
        {field.label}
        {'required' in field.validation && field.validation.required && <span className="text-red-500 text-lg">*</span>}
      </label>
      
      <div className="relative group">
        {type === "textarea" ? (
          <Textarea
            id={name}
            value={value}
            onChange={handleChange}
            placeholder={field.placeholder}
            disabled={disabled}
            className={cn(inputClasses, "min-h-[120px] resize-y leading-relaxed")}
            rows={5}
          />
        ) : (
          <Input
            id={name}
            type={type}
            value={value}
            onChange={handleChange}
            placeholder={field.placeholder}
            disabled={disabled}
            className={inputClasses}
          />
        )}
        
        {/* Validation icon */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          {hasError && <X className="w-5 h-5 text-red-500" />}
          {hasWarning && <AlertCircle className="w-5 h-5 text-yellow-500" />}
          {isValid && <Check className="w-5 h-5 text-green-500" />}
        </div>
      </div>

      {/* Error/Warning message */}
      {error && touched && (
        <div className={cn(
          "text-sm flex items-center gap-2 px-3 py-2 rounded-lg backdrop-blur-sm",
          hasError && "text-red-700 bg-red-50/80 border border-red-200 dark:text-red-400 dark:bg-red-900/20 dark:border-red-800",
          hasWarning && "text-yellow-700 bg-yellow-50/80 border border-yellow-200 dark:text-yellow-400 dark:bg-yellow-900/20 dark:border-yellow-800"
        )}>
          {hasError && <X className="w-4 h-4" />}
          {hasWarning && <AlertCircle className="w-4 h-4" />}
          {error.message}
        </div>
      )}

      {/* Character count for text fields */}
      {(type === "textarea" || name === "subject") && 'maxLength' in field.validation && field.validation.maxLength && (
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span></span>
          <span className={cn(
            "px-2 py-1 rounded-md",
            field.validation.maxLength && value.length > (field.validation.maxLength * 0.9) && "text-amber-600 bg-amber-50 dark:bg-amber-900/20",
            field.validation.maxLength && value.length >= field.validation.maxLength && "text-red-600 bg-red-50 dark:bg-red-900/20"
          )}>
            {value.length} / {field.validation.maxLength}
          </span>
        </div>
      )}
    </div>
  );
};

// Main component
export const ContactForm: React.FC<ContactFormProps> = ({
  className,
  onSubmit,
  enableSocialLinks = true,
  showSuccessMessage = true
}) => {
  const initialData: ContactFormData = {
    name: "",
    email: "",
    phone: "",
    company: "",
    website: "",
    subject: "",
    message: "",
    newsletter: false
  };

  const {
    formData,
    errors,
    touchedFields,
    isValid,
    updateField,
    validateAllFields,
    setFormData
  } = useFormValidation(initialData);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateAllFields()) {
      setSubmitStatus("error");
      setSubmitMessage("Please fix the errors above before submitting.");
      trackFormSubmit('contact_form', { status: 'validation_error' });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      setSubmitStatus("success");
      setSubmitMessage("Thank you for your message! I'll get back to you within 24 hours.");
      trackFormSubmit('contact_form', { status: 'success' });
      
      if (showSuccessMessage) {
        // Reset form after success
        setTimeout(() => {
          setFormData(initialData);
          setSubmitStatus("idle");
          setSubmitMessage("");
        }, 3000);
      }
    } catch (error: unknown) {
      setSubmitStatus("error");
      setSubmitMessage("Sorry, there was an error sending your message. Please try again.");
      trackFormSubmit('contact_form', { status: 'error', error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPercentage = Math.round(
    (Object.keys(FORM_FIELDS).filter(field => {
      const key = field as keyof ContactFormData;
      const value = formData[key];
      return typeof value === 'string' && value.trim() !== '';
    }).length / Object.keys(FORM_FIELDS).length) * 100
  );

  return (
    <div className={cn("w-full max-w-7xl mx-auto", className)}>
      <div className="space-y-8">
        {/* Form Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-4">
            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent flex-1" />
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full">
              <MessageSquare className="w-5 h-5 text-primary" />
              <span className="font-medium text-primary">Contact Form</span>
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent flex-1" />
          </div>
          
          {progressPercentage > 0 && (
            <div className="max-w-md mx-auto space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Progress</span>
                <Badge variant="outline" className="gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  {progressPercentage}% Complete
                </Badge>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-primary to-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Main Form Card */}
        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardContent className="p-12">
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information Row */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <FormField
                    name="name"
                    value={formData.name}
                    error={errors.name}
                    touched={touchedFields.has('name')}
                    onChange={updateField}
                    disabled={isSubmitting}
                  />
                  <FormField
                    name="email"
                    type="email"
                    value={formData.email}
                    error={errors.email}
                    touched={touchedFields.has('email')}
                    onChange={updateField}
                    disabled={isSubmitting}
                  />
                  <FormField
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    error={errors.phone}
                    touched={touchedFields.has('phone')}
                    onChange={updateField}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Professional Information Row */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Building className="w-5 h-5 text-primary" />
                  Professional Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    name="company"
                    value={formData.company}
                    error={errors.company}
                    touched={touchedFields.has('company')}
                    onChange={updateField}
                    disabled={isSubmitting}
                  />
                  <FormField
                    name="website"
                    type="url"
                    value={formData.website}
                    error={errors.website}
                    touched={touchedFields.has('website')}
                    onChange={updateField}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Project Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Project Details
                </h3>
                <div className="space-y-6">
                  <FormField
                    name="subject"
                    value={formData.subject}
                    error={errors.subject}
                    touched={touchedFields.has('subject')}
                    onChange={updateField}
                    disabled={isSubmitting}
                  />
                  <FormField
                    name="message"
                    type="textarea"
                    value={formData.message}
                    error={errors.message}
                    touched={touchedFields.has('message')}
                    onChange={updateField}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Submit Section */}
              <div className="space-y-6 pt-6 border-t border-border/50">
                {/* Newsletter opt-in */}
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="newsletter"
                    checked={formData.newsletter}
                    onChange={(e) => updateField('newsletter', e.target.checked)}
                    disabled={isSubmitting}
                    className="w-4 h-4 rounded border-border focus:ring-primary focus:ring-2 focus:ring-offset-2"
                  />
                  <label htmlFor="newsletter" className="text-sm text-muted-foreground cursor-pointer">
                    Subscribe to my newsletter for updates on new projects and data engineering insights
                  </label>
                </div>

                {/* Submit Status */}
                {submitMessage && (
                  <div className={cn(
                    "p-4 rounded-xl flex items-center gap-3 border backdrop-blur-sm",
                    submitStatus === "success" && "bg-green-50/80 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
                    submitStatus === "error" && "bg-red-50/80 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
                  )}>
                    {submitStatus === "success" && <Check className="w-5 h-5" />}
                    {submitStatus === "error" && <X className="w-5 h-5" />}
                    {submitMessage}
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  disabled={!isValid || isSubmitting}
                  className="w-full gap-3 py-4 text-lg font-medium bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </Button>

                {/* Form validation summary */}
                <div className="text-sm text-center">
                  {!isValid && touchedFields.size > 0 && (
                    <div className="flex items-center justify-center gap-2 text-amber-600">
                      <AlertCircle className="w-4 h-4" />
                      Please complete all required fields to send your message
                    </div>
                  )}
                  {isValid && (
                    <div className="flex items-center justify-center gap-2 text-green-600">
                      <Check className="w-4 h-4" />
                      Form is ready to submit
                    </div>
                  )}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Social Links Section */}
        {enableSocialLinks && (
          <div className="mt-12 space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">Connect with me</h3>
              <p className="text-muted-foreground">Let's stay in touch on social media</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {SOCIAL_LINKS.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 p-4 rounded-xl bg-white/40 dark:bg-slate-800/40 hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all duration-300 border backdrop-blur-sm hover:shadow-lg"
                  onClick={() => trackButtonClick('social_link_click', { platform: social.label })}
                >
                  <div className="p-3 bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-xl group-hover:from-primary/20 group-hover:to-blue-500/20 transition-colors">
                    {social.icon}
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{social.label}</div>
                    <div className="text-sm text-muted-foreground">{social.username}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactForm;