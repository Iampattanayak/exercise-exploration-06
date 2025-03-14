
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export const uploadExerciseImage = async (
  file: File,
  folderName: string = 'exercises'
): Promise<{ path: string; url: string }> => {
  try {
    // Generate a unique file name to prevent collisions
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${folderName}/${fileName}`;
    
    // Upload the file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('exercise-images')
      .upload(filePath, file);
      
    if (uploadError) {
      throw uploadError;
    }
    
    // Get the public URL for the file
    const { data } = supabase.storage
      .from('exercise-images')
      .getPublicUrl(filePath);
    
    return {
      path: filePath,
      url: data.publicUrl
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const deleteExerciseImage = async (filePath: string): Promise<void> => {
  try {
    // Remove the file from Supabase Storage
    const { error } = await supabase.storage
      .from('exercise-images')
      .remove([filePath]);
      
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};
