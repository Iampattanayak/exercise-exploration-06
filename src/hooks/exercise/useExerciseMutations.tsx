
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addExercise, updateExercise, deleteExercise } from '@/lib/data';
import { Exercise } from '@/lib/types';
import { toast } from 'sonner';
import { uploadExerciseImage } from '@/lib/storage';
import { v4 as uuidv4 } from 'uuid';

export function useExerciseMutations() {
  const queryClient = useQueryClient();

  // Create Exercise Mutation
  const createExerciseMutation = useMutation({
    mutationFn: addExercise,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
      toast.success('Exercise added successfully');
    },
    onError: (error: Error) => {
      console.error('Mutation error:', error);
      toast.error(`Failed to add exercise: ${error.message}`);
    }
  });

  // Update Exercise Mutation
  const updateExerciseMutation = useMutation({
    mutationFn: updateExercise,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
      toast.success('Exercise updated successfully');
    },
    onError: (error: Error) => {
      console.error('Mutation error:', error);
      toast.error(`Failed to update exercise: ${error.message}`);
    }
  });

  // Delete Exercise Mutation
  const deleteExerciseMutation = useMutation({
    mutationFn: deleteExercise,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
      toast.success('Exercise deleted successfully');
    },
    onError: (error: Error) => {
      console.error('Mutation error:', error);
      toast.error(`Failed to delete exercise: ${error.message}`);
    }
  });

  // Create Exercise handler
  const handleCreateExercise = async (exerciseData: Partial<Exercise>, uploadedImage: File | null) => {
    try {
      // Generate a unique ID for the exercise
      const exerciseId = uuidv4();
      let imageUrl = exerciseData.imageUrl || '';
      
      // If there's an uploaded image, process it
      if (uploadedImage) {
        try {
          const result = await uploadExerciseImage(uploadedImage);
          imageUrl = result.url;
          console.log('Image uploaded successfully:', result);
        } catch (uploadError) {
          console.error('Error uploading image:', uploadError);
          toast.error('Failed to upload image, but will continue with exercise creation');
        }
      }
      
      // Create the exercise object
      const exercise: Exercise = {
        id: exerciseId,
        name: exerciseData.name || '',
        description: exerciseData.description || '',
        category: exerciseData.category || '',
        imageUrl: imageUrl
      };
      
      console.log('Creating exercise with data:', exercise);
      
      // Save to database
      await createExerciseMutation.mutateAsync(exercise);
      return true;
    } catch (error) {
      console.error('Error adding exercise:', error);
      toast.error('Failed to add exercise');
      return false;
    }
  };

  // Update Exercise handler
  const handleUpdateExercise = async (
    exerciseId: string,
    exerciseData: Partial<Exercise>,
    uploadedImage: File | null
  ) => {
    try {
      let imageUrl = exerciseData.imageUrl || '';
      
      // If there's an uploaded image, process it
      if (uploadedImage) {
        try {
          const result = await uploadExerciseImage(uploadedImage);
          imageUrl = result.url;
        } catch (uploadError) {
          console.error('Error uploading image:', uploadError);
          toast.error('Failed to upload image, but will continue with exercise update');
        }
      }
      
      // Create the exercise object
      const exercise: Exercise = {
        id: exerciseId,
        name: exerciseData.name || '',
        description: exerciseData.description || '',
        category: exerciseData.category || '',
        imageUrl: imageUrl
      };
      
      // Update in database
      await updateExerciseMutation.mutateAsync(exercise);
      return true;
    } catch (error) {
      console.error('Error updating exercise:', error);
      toast.error('Failed to update exercise');
      return false;
    }
  };

  // Delete Exercise handler
  const handleDeleteExercise = async (exerciseId: string) => {
    try {
      await deleteExerciseMutation.mutateAsync(exerciseId);
      return true;
    } catch (error) {
      console.error('Error deleting exercise:', error);
      toast.error('Failed to delete exercise');
      return false;
    }
  };

  return {
    handleCreateExercise,
    handleUpdateExercise,
    handleDeleteExercise
  };
}
