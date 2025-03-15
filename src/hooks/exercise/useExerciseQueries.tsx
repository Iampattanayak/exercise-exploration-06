
import { useQuery } from '@tanstack/react-query';
import { getAllExercises, getAllCategories } from '@/lib/data';
import { useCallback } from 'react';
import { toast } from 'sonner';

export function useExerciseQueries() {
  // Fetch exercises using React Query
  const { 
    data: exercises = [], 
    isLoading: exercisesLoading,
    error: exercisesError,
    refetch: refetchExercises
  } = useQuery({
    queryKey: ['exercises'],
    queryFn: getAllExercises,
    onError: (error) => {
      toast.error(`Failed to load exercises: ${error.message}`);
      console.error('Failed to load exercises:', error);
    }
  });

  // Fetch categories using React Query
  const { 
    data: categories = [], 
    isLoading: categoriesLoading,
    error: categoriesError,
    refetch: refetchCategories
  } = useQuery({
    queryKey: ['categories'],
    queryFn: getAllCategories,
    onError: (error) => {
      toast.error(`Failed to load categories: ${error.message}`);
      console.error('Failed to load categories:', error);
    }
  });

  // Function to reload all data
  const refreshAllData = useCallback(() => {
    toast.info('Refreshing data...');
    Promise.all([refetchExercises(), refetchCategories()])
      .then(() => toast.success('Data refreshed successfully'))
      .catch((error) => toast.error(`Refresh failed: ${error.message}`));
  }, [refetchExercises, refetchCategories]);

  return {
    exercises,
    categories,
    exercisesLoading,
    categoriesLoading,
    exercisesError,
    categoriesError,
    refreshAllData
  };
}
