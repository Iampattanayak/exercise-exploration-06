
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getAllExercises, 
  getAllCategories, 
  addExercise, 
  updateExercise, 
  deleteExercise 
} from '@/lib/data';
import { uploadExerciseImage } from '@/lib/storage';
import { Exercise, Category } from '@/lib/types';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

export function useExerciseData() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Fetch exercises using React Query
  const { 
    data: exercises = [], 
    isLoading: exercisesLoading,
    error: exercisesError
  } = useQuery({
    queryKey: ['exercises'],
    queryFn: getAllExercises
  });

  // Fetch categories using React Query
  const { 
    data: categories = [], 
    isLoading: categoriesLoading,
    error: categoriesError
  } = useQuery({
    queryKey: ['categories'],
    queryFn: getAllCategories
  });

  // Mutations for CRUD operations
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

  // Filter exercises based on search term and selected category
  const filteredExercises = exercises.filter((exercise: Exercise) => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? exercise.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

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
    exercises,
    categories,
    filteredExercises,
    exercisesLoading,
    categoriesLoading,
    exercisesError,
    categoriesError,
    searchTerm,
    selectedCategory,
    handleSearchChange,
    handleCategoryChange,
    handleCreateExercise,
    handleUpdateExercise,
    handleDeleteExercise
  };
}
