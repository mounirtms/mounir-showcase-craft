import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import type { SkillInput } from "@/hooks/useSkills";
import { SkillCategorySchema } from "@/lib/validation-schemas";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  level: z.coerce.number().min(1).max(100),
  yearsOfExperience: z.coerce.number().min(0),
  description: z.string().optional(),
  featured: z.boolean().default(false),
  disabled: z.boolean().default(false),
  priority: z.coerce.number().min(1).max(100).default(50),
  icon: z.string().optional(),
  color: z.string().optional(),
});

export type SkillFormValues = z.infer<typeof formSchema>;

export type SkillFormProps = {
  defaultValues?: Partial<SkillFormValues>;
  submitLabel?: string;
  onSubmit: (values: SkillInput | SkillFormValues) => void | Promise<void>;
  onCancel?: () => void;
};

export const SkillForm: React.FC<SkillFormProps> = ({ defaultValues, submitLabel = "Save Skill", onSubmit, onCancel }) => {
  const form = useForm<SkillFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "Frontend Development",
      level: 50,
      yearsOfExperience: 0,
      description: "",
      featured: false,
      disabled: false,
      priority: 50,
      icon: "",
      color: "",
      ...defaultValues,
    },
  });

  const categories = Object.values(SkillCategorySchema.enum);

  const handleSubmit = async (values: SkillFormValues) => {
    await onSubmit({
      ...values,
      certifications: [],
      projects: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    } as SkillInput);
  };

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="TypeScript" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Proficiency Level (1-100)</FormLabel>
                <FormControl>
                  <Input type="number" min={1} max={100} {...field} />
                </FormControl>
                <FormDescription>Percentage indicating your proficiency.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="yearsOfExperience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Years of Experience</FormLabel>
                <FormControl>
                  <Input type="number" min={0} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <FormControl>
                  <Input type="number" min={1} max={100} {...field} />
                </FormControl>
                <FormDescription>Higher priority surfaces the skill first.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Icon (emoji)</FormLabel>
                <FormControl>
                  <Input placeholder="🚀" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color (hex)</FormLabel>
                <FormControl>
                  <Input placeholder="#6E56CF" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="featured"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between p-3 border rounded-md">
                <div>
                  <FormLabel>Featured</FormLabel>
                  <FormDescription>Showcase this skill prominently.</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="disabled"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between p-3 border rounded-md">
                <div>
                  <FormLabel>Hidden</FormLabel>
                  <FormDescription>Hide this skill from public view.</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea rows={3} placeholder="Short description..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          )}
          <Button type="submit">{submitLabel}</Button>
        </div>
      </form>
    </Form>
  );
};

export default SkillForm;
