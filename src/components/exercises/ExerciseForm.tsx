import React, { useState, useEffect } from 'react';
import { Exercise, Category } from '@/lib/types';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { toast } from 'sonner';

// Import our component sections
import DetailsSection from './form-components/DetailsSection';
import ImageSection from './form-components/ImageSection';
import FormActions from './form-components/FormActions';

interface ExerciseFormProps {
  exercise?: Exercise;
  categories: Category[];
  onSubmit: (exerciseData: Partial<Exercise>, uploadedImage: File | null) => Promise<boolean>;
  onCancel: () => void;
  submitLabel?: string;
  showDeleteButton?: boolean;
}

const ExerciseForm: React.FC<ExerciseFormProps> = ({
  exercise,
  categories,
  onSubmit,
  onCancel,
  submitLabel = 'Save',
  showDeleteButton = true
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
      // Set the image preview directly from the exercise's imageUrl
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
        <div className="grid md:grid-cols-2 gap-8">
          {/* Details section (name, category, description) */}
          <div className="space-y-6">
            <h3 className="font-medium text-sm text-gray-500 mb-4">Exercise Details</h3>
            <DetailsSection form={form} categories={categories} />
          </div>
          
          {/* Image section */}
          <div className="space-y-6">
            <h3 className="font-medium text-sm text-gray-500 mb-4">Exercise Image</h3>
            <ImageSection 
              form={form} 
              onImageChange={handleImageChange} 
              imagePreview={imagePreview} 
            />
          </div>
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
