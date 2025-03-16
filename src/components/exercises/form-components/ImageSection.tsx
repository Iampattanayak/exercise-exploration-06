
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ImageUpload } from '@/components/ui/image-upload';
import { FormField, FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { Exercise } from '@/lib/types';

interface ImageSectionProps {
  form: UseFormReturn<Partial<Exercise>>;
  onImageChange: (file: File | null, preview: string | null) => void;
  imagePreview: string | null;
}

const ImageSection: React.FC<ImageSectionProps> = ({
  form,
  onImageChange,
  imagePreview
}) => {
  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    form.setValue('imageUrl', url);
    
    // If we set a URL manually, clear the uploaded image
    if (url) {
      onImageChange(null, null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <ImageUpload
          onImageChange={onImageChange}
          previewUrl={imagePreview}
          maxSizeMB={5}
          minWidth={500}
          minHeight={500}
          maxWidth={1500}
          maxHeight={1500}
          aspectRatio={1}
          helpText={imagePreview ? "Current image shown. Click to replace." : "Square images work best (1:1 ratio). Non-square images will be auto-cropped from the center."}
        />
      </div>
      
      <div className="pt-2 border-t border-gray-100">
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm">Or use an image URL</FormLabel>
              <FormControl>
                <Input 
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    handleImageUrlChange(e);
                  }}
                  placeholder="https://example.com/image.jpg"
                  disabled={!!imagePreview && !field.value}
                  className="mt-1"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {(!imagePreview && !form.getValues('imageUrl')) && (
          <p className="text-xs text-muted-foreground mt-2">
            Either upload an image or provide a URL
          </p>
        )}
      </div>
    </div>
  );
};

export default ImageSection;
