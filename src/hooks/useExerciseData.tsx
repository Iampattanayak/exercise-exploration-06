
import { useExerciseQueries } from './exercise/useExerciseQueries';
import { useExerciseFilters } from './exercise/useExerciseFilters';
import { useExerciseMutations } from './exercise/useExerciseMutations';
import { Exercise } from '@/lib/types';

export function useExerciseData() {
  // Get query-related data and operations
  const {
    exercises,
    categories,
    exercisesLoading,
    categoriesLoading,
    exercisesError,
    categoriesError,
    refreshAllData
  } = useExerciseQueries();

  // Get filter-related data and operations
  const {
    searchTerm,
    selectedCategory,
    sortOrder,
    filteredExercises,
    handleSearchChange,
    handleCategoryChange,
    handleSortChange
  } = useExerciseFilters(exercises as Exercise[]);

  // Get mutation-related operations
  const {
    handleCreateExercise,
    handleCreateMultipleExercises,
    handleUpdateExercise,
    handleDeleteExercise
  } = useExerciseMutations();

  return {
    // Data
    exercises,
    categories,
    filteredExercises,
    
    // Loading states
    exercisesLoading,
    categoriesLoading,
    
    // Error states
    exercisesError,
    categoriesError,
    
    // Filter states and handlers
    searchTerm,
    selectedCategory,
    sortOrder,
    handleSearchChange,
    handleCategoryChange,
    handleSortChange,
    
    // CRUD operations
    handleCreateExercise,
    handleCreateMultipleExercises,
    handleUpdateExercise,
    handleDeleteExercise,
    
    // Utilities
    refreshAllData
  };
}
