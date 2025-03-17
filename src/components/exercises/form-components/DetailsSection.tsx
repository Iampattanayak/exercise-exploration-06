
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Exercise, Category } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { FormField, FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';

interface DetailsSectionProps {
  form: UseFormReturn<any>;
  categories: Category[];
}

const DetailsSection: React.FC<DetailsSectionProps> = ({
  form,
  categories
}) => {
  return (
    <div className="space-y-5 h-full flex flex-col">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-medium">Exercise Name *</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder="e.g., Bench Press"
                className="mt-1"
              />
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
            <FormLabel className="font-medium">Category *</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
              value={field.value || undefined}
            >
              <FormControl>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {categories.map(category => {
                  const categoryClass = cn(
                    "inline-block w-3 h-3 rounded-full mr-2",
                    category.color.split(' ')[0] // Extract just the background color
                  );
                  
                  return (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center">
                        <span className={categoryClass}></span>
                        {category.name}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem className="flex-grow">
            <FormLabel className="font-medium">Description</FormLabel>
            <FormControl>
              <Textarea 
                {...field}
                placeholder="Describe how to perform this exercise..."
                rows={8}
                className="mt-1 resize-none flex-grow"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default DetailsSection;
