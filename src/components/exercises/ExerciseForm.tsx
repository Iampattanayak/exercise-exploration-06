
import React, { useState, useEffect } from 'react';
import { Exercise, Category } from '@/lib/types';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { toast } from 'sonner';

// Import our new component sections
import DetailsSection from './form-components/DetailsSection';
import ImageSection from './form-components/ImageSection';
import FormActions from './form-components/FormActions';

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
          {/* Details section (name, category, description) */}
          <DetailsSection form={form} categories={categories} />
          
          {/* Image section */}
          <ImageSection 
            form={form} 
            onImageChange={handleImageChange} 
            imagePreview={imagePreview} 
          />
        </div>
        
        {/* Form actions (cancel/submit buttons) */}
        <FormActions 
          onCancel={onCancel} 
          isSubmitting={isSubmitting} 
          submitLabel={submitLabel} 
        />
      </form>
    </Form>
  );
};

export default ExerciseForm;
