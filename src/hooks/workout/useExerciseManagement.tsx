
import { useState, useEffect } from 'react';
import { Exercise, WorkoutExercise, ExerciseSet, Workout } from '@/lib/types';
import { getAllExercises } from '@/lib/exercises';
import { toast } from '@/components/ui/use-toast';

export const useExerciseManagement = (
  workout: Partial<Workout>,
  setWorkout: React.Dispatch<React.SetStateAction<Partial<Workout>>>
) => {
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const exercisesData = await getAllExercises();
        setAvailableExercises(exercisesData);
      } catch (error) {
        console.error('Error fetching exercises:', error);
        toast({
          title: "Error",
          description: "Failed to load exercises. Please try again.",
          variant: "destructive",
        });
      }
    };
    
    fetchExercises();
  }, []);
  
  useEffect(() => {
    const fetchFilteredExercises = async () => {
      if (searchTerm) {
        const allExercises = await getAllExercises();
        const filtered = allExercises.filter(exercise => 
          exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setAvailableExercises(filtered);
      } else {
        const exercises = await getAllExercises();
        setAvailableExercises(exercises);
      }
    };
    
    fetchFilteredExercises();
  }, [searchTerm]);
  
  const handleReorderExercises = (activeId: string, overId: string) => {
    setWorkout(prev => {
      if (!prev.exercises) return prev;

      const oldExercises = [...prev.exercises];
      const activeIndex = oldExercises.findIndex(ex => ex.id === activeId);
      const overIndex = oldExercises.findIndex(ex => ex.id === overId);
      
      if (activeIndex === -1 || overIndex === -1) return prev;
      
      const reorderedExercises = [...oldExercises];
      const [movedItem] = reorderedExercises.splice(activeIndex, 1);
      reorderedExercises.splice(overIndex, 0, movedItem);
      
      const updatedExercises = reorderedExercises.map((ex, idx) => ({
        ...ex,
        order: idx + 1
      }));
      
      return {
        ...prev,
        exercises: updatedExercises
      };
    });
  };
  
  const handleMoveExercise = (exerciseIndex: number, direction: 'up' | 'down') => {
    setWorkout(prev => {
      if (!prev.exercises) return prev;
      
      const oldExercises = [...prev.exercises];
      
      if (direction === 'up' && exerciseIndex > 0) {
        [oldExercises[exerciseIndex], oldExercises[exerciseIndex - 1]] = 
        [oldExercises[exerciseIndex - 1], oldExercises[exerciseIndex]];
      } else if (direction === 'down' && exerciseIndex < oldExercises.length - 1) {
        [oldExercises[exerciseIndex], oldExercises[exerciseIndex + 1]] = 
        [oldExercises[exerciseIndex + 1], oldExercises[exerciseIndex]];
      } else {
        return prev;
      }
      
      const updatedExercises = oldExercises.map((ex, idx) => ({
        ...ex,
        order: idx + 1
      }));
      
      return {
        ...prev,
        exercises: updatedExercises
      };
    });
  };
  
  const handleAddExercise = (exercise: Exercise) => {
    const isExerciseAdded = workout.exercises?.some(
      (ex) => ex.exerciseId === exercise.id
    );
    
    if (isExerciseAdded) {
      toast({
        title: "Exercise already added",
        description: `${exercise.name} is already in this workout.`,
        variant: "destructive",
      });
      return;
    }
    
    const defaultSets = Array.from({ length: 3 }, (_, i) => ({
      id: `set-${exercise.id}-${i+1}-${Date.now()}`,
      exerciseId: exercise.id,
      setNumber: i + 1,
      targetReps: 10,
      weight: 0,
      completed: false
    }));
    
    const workoutExercise: WorkoutExercise = {
      id: `workout-exercise-${Date.now()}`,
      exerciseId: exercise.id,
      exercise: exercise,
      sets: defaultSets,
      order: (workout.exercises?.length || 0) + 1
    };
    
    setWorkout(prev => ({
      ...prev,
      exercises: [...(prev.exercises || []), workoutExercise]
    }));
    
    setSearchTerm('');
  };
  
  const handleRemoveExercise = (exerciseId: string) => {
    setWorkout(prev => ({
      ...prev,
      exercises: prev.exercises?.filter(ex => ex.exerciseId !== exerciseId)
    }));
  };
  
  return {
    availableExercises,
    searchTerm,
    setSearchTerm,
    handleReorderExercises,
    handleMoveExercise,
    handleAddExercise,
    handleRemoveExercise
  };
};
