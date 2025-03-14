
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
  const [form, setForm] = useState<Partial<Exercise>>({
    name: '',
    description: '',
    category: '',
    imageUrl: ''
  });
  
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (exercise) {
      setForm({
        name: exercise.name,
        description: exercise.description,
        category: exercise.category,
        imageUrl: exercise.imageUrl
      });
      setImagePreview(exercise.imageUrl);
    }
  }, [exercise]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  };

  const handleCategorySelect = (value: string) => {
    setForm({
      ...form,
      category: value
    });
  };
  
  const handleImageChange = (file: File | null, preview: string | null) => {
    setUploadedImage(file);
    setImagePreview(preview);
  };

  const handleFormSubmit = async () => {
    if (!form.name || !form.category) {
      toast.error('Exercise name and category are required');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const success = await onSubmit(form, uploadedImage);
      if (success) {
        // Form will be closed by parent component on success
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid gap-6 py-4">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Exercise Name *</Label>
            <Input 
              id="name" 
              name="name" 
              value={form.name}
              onChange={handleInputChange}
              placeholder="e.g., Bench Press"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="category">Category *</Label>
            <Select onValueChange={handleCategorySelect} value={form.category}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              name="description" 
              value={form.description}
              onChange={handleInputChange}
              placeholder="Describe how to perform this exercise..."
              rows={4}
            />
          </div>
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
          
          <div className="grid gap-2">
            <Label htmlFor="imageUrl">Or use an image URL</Label>
            <Input 
              id="imageUrl" 
              name="imageUrl" 
              value={form.imageUrl}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
              disabled={!!imagePreview && imagePreview !== form.imageUrl}
            />
            {(!imagePreview && !form.imageUrl) && (
              <p className="text-xs text-muted-foreground">
                Either upload an image or provide a URL
              </p>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button onClick={handleFormSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : submitLabel}
        </Button>
      </div>
    </div>
  );
};

export default ExerciseForm;
