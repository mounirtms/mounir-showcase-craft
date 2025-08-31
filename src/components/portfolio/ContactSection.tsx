/**
 * Contact and Networking Section
 * Animated contact form, social media integration, availability status, and downloadable resume
 */

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Download,
  ExternalLink,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
  Github,
  Linkedin,
  Twitter,
  Globe,
  MessageSquare,
  Clock,
  User,
  Building2
} from 'lucide-react';

// Contact form data interface
interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
  projectType?: 'web-development' | 'mobile-app' | 'consulting' | 'other';
  budget?: 'under-5k' | '5k-15k' | '15k-50k' | '50k-plus' | 'discuss';
  timeline?: 'asap' | '1-month' | '3-months' | '6-months' | 'flexible';
}

// Social media links interface
interface SocialLink {
  platform: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  username?: string;
  followers?: number;
  verified?: boolean;
}

// Availability status interface
interface AvailabilityStatus {
  available: boolean;
  status: 'available' | 'busy' | 'partially-available' | 'unavailable';
  message: string;
  nextAvailable?: Date;
  responseTime: string;
  workingHours: {
    timezone: string;
    start: string;
    end: string;
    days: string[];
  };
}

interface ContactSectionProps {
  className?: string;
  contactInfo: {
    email: string;
    phone?: string;
    location: string;
    resumeUrl?: string;
  };
  socialLinks: SocialLink[];
  availability: AvailabilityStatus;
  onSubmit: (data: ContactFormData) => Promise<void>;
}

// Floating label input component
interface FloatingLabelInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
  className?: string;
}

const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  required = false,
  error,
  className
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.length > 0;

  return (
    <div className={cn('relative', className)}>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        required={required}
        className={cn(
          'w-full px-4 pt-6 pb-2 text-sm bg-background border border-input rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent peer',
          error && 'border-destructive focus:ring-destructive',
          hasValue && 'border-primary/50'
        )}
      />
      <label
        className={cn(
          'absolute left-4 text-muted-foreground transition-all duration-200 pointer-events-none',
          (isFocused || hasValue) 
            ? 'top-2 text-xs text-primary' 
            : 'top-4 text-sm',
          error && 'text-destructive'
        )}
      >
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      {error && (
        <p className="mt-1 text-xs text-destructive flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
};

// Floating label textarea component
interface FloatingLabelTextareaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
  rows?: number;
  className?: string;
}

const FloatingLabelTextarea: React.FC<FloatingLabelTextareaProps> = ({
  label,
  value,
  onChange,
  required = false,
  error,
  rows = 4,
  className
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.length > 0;

  return (
    <div className={cn('relative', className)}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        required={required}
        rows={rows}
        className={cn(
          'w-full px-4 pt-6 pb-2 text-sm bg-background border border-input rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none',
          error && 'border-destructive focus:ring-destructive',
          hasValue && 'border-primary/50'
        )}
      />
      <label
        className={cn(
          'absolute left-4 text-muted-foreground transition-all duration-200 pointer-events-none',
          (isFocused || hasValue) 
            ? 'top-2 text-xs text-primary' 
            : 'top-4 text-sm',
          error && 'text-destructive'
        )}
      >
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      {error && (
        <p className="mt-1 text-xs text-destructive flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
};

// Contact form component
const ContactForm: React.FC<{
  onSubmit: (data: ContactFormData) => Promise<void>;
}> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
    projectType: undefined,
    budget: undefined,
    timeline: undefined
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        company: '',
        subject: '',
        message: '',
        projectType: undefined,
        budget: undefined,
        timeline: undefined
      });
    } catch (error) {
      console.error('Failed to submit form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="p-8 text-center">
        <div className="mb-4">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">Message Sent!</h3>
          <p className="text-muted-foreground">
            Thank you for reaching out. I'll get back to you within 24 hours.
          </p>
        </div>
        <Button 
          onClick={() => setIsSubmitted(false)}
          variant="outline"
        >
          Send Another Message
        </Button>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Let's Work Together
        </CardTitle>
        <p className="text-muted-foreground">
          Have a project in mind? I'd love to hear about it. Fill out the form below and I'll get back to you soon.
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FloatingLabelInput
              label="Full Name"
              value={formData.name}
              onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
              required
              error={errors.name}
            />
            
            <FloatingLabelInput
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
              required
              error={errors.email}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FloatingLabelInput
              label="Company (Optional)"
              value={formData.company || ''}
              onChange={(value) => setFormData(prev => ({ ...prev, company: value }))}
            />
            
            <FloatingLabelInput
              label="Subject"
              value={formData.subject}
              onChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}
              required
              error={errors.subject}
            />
          </div>

          {/* Project Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Project Type
              </label>
              <select
                value={formData.projectType || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  projectType: e.target.value as ContactFormData['projectType'] 
                }))}
                className="w-full px-3 py-2 text-sm bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select type</option>
                <option value="web-development">Web Development</option>
                <option value="mobile-app">Mobile App</option>
                <option value="consulting">Consulting</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Budget Range
              </label>
              <select
                value={formData.budget || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  budget: e.target.value as ContactFormData['budget'] 
                }))}
                className="w-full px-3 py-2 text-sm bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select budget</option>
                <option value="under-5k">Under $5,000</option>
                <option value="5k-15k">$5,000 - $15,000</option>
                <option value="15k-50k">$15,000 - $50,000</option>
                <option value="50k-plus">$50,000+</option>
                <option value="discuss">Let's discuss</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Timeline
              </label>
              <select
                value={formData.timeline || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  timeline: e.target.value as ContactFormData['timeline'] 
                }))}
                className="w-full px-3 py-2 text-sm bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select timeline</option>
                <option value="asap">ASAP</option>
                <option value="1-month">Within 1 month</option>
                <option value="3-months">Within 3 months</option>
                <option value="6-months">Within 6 months</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>
          </div>

          {/* Message */}
          <FloatingLabelTextarea
            label="Tell me about your project"
            value={formData.message}
            onChange={(value) => setFormData(prev => ({ ...prev, message: value }))}
            required
            error={errors.message}
            rows={6}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full md:w-auto"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

// Availability status component
const AvailabilityCard: React.FC<{ availability: AvailabilityStatus }> = ({ availability }) => {
  const getStatusColor = (status: AvailabilityStatus['status']) => {
    const colors = {
      available: 'bg-green-100 text-green-800 border-green-200',
      busy: 'bg-red-100 text-red-800 border-red-200',
      'partially-available': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      unavailable: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status];
  };

  const getStatusIcon = (status: AvailabilityStatus['status']) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="w-4 h-4" />;
      case 'busy':
        return <AlertCircle className="w-4 h-4" />;
      case 'partially-available':
        return <Clock className="w-4 h-4" />;
      case 'unavailable':
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Availability Status
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Badge className={cn('flex items-center gap-2', getStatusColor(availability.status))}>
            {getStatusIcon(availability.status)}
            {availability.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </Badge>
        </div>

        <p className="text-muted-foreground">{availability.message}</p>

        {availability.nextAvailable && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            Next available: {availability.nextAvailable.toLocaleDateString()}
          </div>
        )}

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-medium">Response time:</span>
            <span className="text-muted-foreground">{availability.responseTime}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="font-medium">Working hours:</span>
            <span className="text-muted-foreground">
              {availability.workingHours.start} - {availability.workingHours.end} ({availability.workingHours.timezone})
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="font-medium">Available days:</span>
            <span className="text-muted-foreground">
              {availability.workingHours.days.join(', ')}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Social links component
const SocialLinksCard: React.FC<{ socialLinks: SocialLink[] }> = ({ socialLinks }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="w-5 h-5" />
          Connect With Me
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 gap-3">
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <link.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <div>
                  <div className="font-medium text-foreground flex items-center gap-2">
                    {link.platform}
                    {link.verified && (
                      <CheckCircle className="w-4 h-4 text-blue-500" />
                    )}
                  </div>
                  {link.username && (
                    <div className="text-sm text-muted-foreground">@{link.username}</div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {link.followers && (
                  <span className="text-xs text-muted-foreground">
                    {link.followers.toLocaleString()} followers
                  </span>
                )}
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Main contact section component
export const ContactSection: React.FC<ContactSectionProps> = ({
  className,
  contactInfo,
  socialLinks,
  availability,
  onSubmit
}) => {
  return (
    <section className={cn('py-16', className)}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Let's Build Something Amazing Together
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ready to bring your ideas to life? I'm here to help you create exceptional digital experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <ContactForm onSubmit={onSubmit} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <a 
                    href={`mailto:${contactInfo.email}`}
                    className="text-primary hover:underline"
                  >
                    {contactInfo.email}
                  </a>
                </div>

                {contactInfo.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                    <a 
                      href={`tel:${contactInfo.phone}`}
                      className="text-primary hover:underline"
                    >
                      {contactInfo.phone}
                    </a>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <span className="text-muted-foreground">{contactInfo.location}</span>
                </div>

                {contactInfo.resumeUrl && (
                  <div className="pt-4 border-t border-border">
                    <a
                      href={contactInfo.resumeUrl}
                      download
                      className="inline-flex items-center gap-2 text-primary hover:underline"
                    >
                      <Download className="w-4 h-4" />
                      Download Resume
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Availability Status */}
            <AvailabilityCard availability={availability} />

            {/* Social Links */}
            <SocialLinksCard socialLinks={socialLinks} />
          </div>
        </div>
      </div>
    </section>
  );
};