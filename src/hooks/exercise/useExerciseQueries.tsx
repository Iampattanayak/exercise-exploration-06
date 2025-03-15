
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
    queryFn: getAllExercises
  });

  // Fetch categories using React Query
  const { 
    data: categories = [], 
    isLoading: categoriesLoading,
    error: categoriesError,
    refetch: refetchCategories
  } = useQuery({
    queryKey: ['categories'],
    queryFn: getAllCategories
  });

  // Function to reload all data
  const refreshAllData = useCallback(() => {
    toast.info('Refreshing data...');
    refetchExercises();
    refetchCategories();
    toast.success('Data refreshed successfully');
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
