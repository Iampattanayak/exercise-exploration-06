
import React, { useState, useEffect } from 'react';
import { Exercise, Category } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { ImageUpload } from '@/components/ui/image-upload';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface ExerciseFormProps {
  exercise?: Exercise;
  categories: Category[];
  onSubmit: (exerciseData: Partial<Exercise>, uploadedImage: File | null) => Promise<boolean>;
  onCancel: () => void;
  submitLabel?: string;
}

const ExerciseForm: React.FC<ExerciseFormProps> = ({
  exercise,
  categories,
  onSubmit,
  onCancel,
  submitLabel = 'Save'
}) => {
  const form = useForm<Partial<Exercise>>({
    defaultValues: {
      name: exercise?.name || '',
      description: exercise?.description || '',
      category: exercise?.category || '',
      imageUrl: exercise?.imageUrl || ''
    }
  });
  
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (exercise) {
      form.reset({
        name: exercise.name,
        description: exercise.description,
        category: exercise.category,
        imageUrl: exercise.imageUrl
      });
      setImagePreview(exercise.imageUrl);
    }
  }, [exercise, form]);

  const handleImageChange = (file: File | null, preview: string | null) => {
    setUploadedImage(file);
    setImagePreview(preview);
    
    // If we have a new image, clear the image URL field
    if (file) {
      form.setValue('imageUrl', '');
    }
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    form.setValue('imageUrl', url);
    
    // If we set a URL manually, clear the uploaded image
    if (url && url !== exercise?.imageUrl) {
      setUploadedImage(null);
      setImagePreview(null);
    }
  };

  const handleFormSubmit = async (data: Partial<Exercise>) => {
    if (!data.name || !data.category) {
      toast.error('Exercise name and category are required');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const success = await onSubmit(data, uploadedImage);
      if (success) {
        // Form will be closed by parent component on success
      }
    } catch (error) {
      console.error("Error submitting exercise form:", error);
      toast.error("Failed to save exercise");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exercise Name *</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="e.g., Bench Press"
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
                  <FormLabel>Category *</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
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
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field}
                      placeholder="Describe how to perform this exercise..."
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label>Exercise Image</Label>
              <ImageUpload
                onImageChange={handleImageChange}
                previewUrl={imagePreview}
                maxSizeMB={5}
                minWidth={500}
                minHeight={500}
                maxWidth={1500}
                maxHeight={1500}
                aspectRatio={1}
                helpText="Square images work best (1:1 ratio). Non-square images will be auto-cropped from the center."
              />
            </div>
            
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Or use an image URL</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleImageUrlChange(e);
                      }}
                      placeholder="https://example.com/image.jpg"
                      disabled={!!uploadedImage}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {(!imagePreview && !form.getValues('imageUrl')) && (
              <p className="text-xs text-muted-foreground">
                Either upload an image or provide a URL
              </p>
            )}
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel} 
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ExerciseForm;
