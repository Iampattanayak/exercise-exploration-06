
import { useWorkoutFormState } from './useWorkoutFormState';
import { useExerciseManagement } from './useExerciseManagement';
import { useExerciseSets } from './useExerciseSets';
import { useCategoryData } from './useCategoryData';
import { useSaveWorkout } from './useSaveWorkout';

export const useWorkoutForm = () => {
  const {
    id,
    workout,
    setWorkout,
    selectedDate,
    setSelectedDate,
    isLoading,
    isSaving,
    handleInputChange
  } = useWorkoutFormState();
  
  const {
    availableExercises,
    searchTerm,
    setSearchTerm,
    handleReorderExercises,
    handleMoveExercise,
    handleAddExercise,
    handleRemoveExercise
  } = useExerciseManagement(workout, setWorkout);
  
  const {
    handleSetChange,
    handleAddSet,
    handleRemoveSet
  } = useExerciseSets(setWorkout);
  
  const {
    categoryMap,
    categories
  } = useCategoryData();
  
  const {
    saveWorkout,
    navigate
  } = useSaveWorkout(id, workout);

  return {
    // Form state
    id,
    workout,
    selectedDate,
    isLoading,
    isSaving,
    
    // Exercise data
    availableExercises,
    searchTerm,
    categoryMap,
    categories,
    
    // Setters
    setSelectedDate,
    setSearchTerm,
    
    // Event handlers
    handleInputChange,
    handleReorderExercises,
    handleMoveExercise,
    handleAddExercise,
    handleRemoveExercise,
    handleSetChange,
    handleAddSet,
    handleRemoveSet,
    
    // Actions
    saveWorkout,
    navigate
  };
};
