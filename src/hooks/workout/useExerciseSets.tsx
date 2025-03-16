
import { ExerciseSet, Workout } from '@/lib/types';

export const useExerciseSets = (
  setWorkout: React.Dispatch<React.SetStateAction<Partial<Workout>>>
) => {
  const handleSetChange = (
    exerciseIndex: number,
    setIndex: number,
    field: keyof ExerciseSet,
    value: any
  ) => {
    setWorkout(prev => {
      const updatedExercises = [...(prev.exercises || [])];
      const updatedSets = [...updatedExercises[exerciseIndex].sets];
      
      updatedSets[setIndex] = {
        ...updatedSets[setIndex],
        [field]: field === 'targetReps' || field === 'weight' ? parseInt(value) || 0 : value
      };
      
      updatedExercises[exerciseIndex] = {
        ...updatedExercises[exerciseIndex],
        sets: updatedSets
      };
      
      return { ...prev, exercises: updatedExercises };
    });
  };
  
  const handleAddSet = (exerciseIndex: number) => {
    setWorkout(prev => {
      const updatedExercises = [...(prev.exercises || [])];
      const currentSets = updatedExercises[exerciseIndex].sets;
      const exerciseId = updatedExercises[exerciseIndex].exerciseId;
      
      const newSet: ExerciseSet = {
        id: `set-${exerciseId}-${currentSets.length+1}-${Date.now()}`,
        exerciseId,
        setNumber: currentSets.length + 1,
        targetReps: 10,
        weight: currentSets[currentSets.length - 1]?.weight || 0,
        completed: false
      };
      
      updatedExercises[exerciseIndex] = {
        ...updatedExercises[exerciseIndex],
        sets: [...currentSets, newSet]
      };
      
      return { ...prev, exercises: updatedExercises };
    });
  };
  
  const handleRemoveSet = (exerciseIndex: number, setIndex: number) => {
    setWorkout(prev => {
      const updatedExercises = [...(prev.exercises || [])];
      const updatedSets = [...updatedExercises[exerciseIndex].sets];
      
      updatedSets.splice(setIndex, 1);
      
      updatedSets.forEach((set, idx) => {
        set.setNumber = idx + 1;
      });
      
      updatedExercises[exerciseIndex] = {
        ...updatedExercises[exerciseIndex],
        sets: updatedSets
      };
      
      return { ...prev, exercises: updatedExercises };
    });
  };
  
  return {
    handleSetChange,
    handleAddSet,
    handleRemoveSet
  };
};
