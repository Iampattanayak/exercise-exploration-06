
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Workout } from '@/lib/types';
import { addWorkout, updateWorkout, generateWorkoutId } from '@/lib/workouts';
import { toast } from '@/components/ui/use-toast';

export const useSaveWorkout = (
  id: string | undefined,
  workout: Partial<Workout>
) => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  
  const saveWorkout = async () => {
    if (!workout.name) {
      toast({
        title: "Validation Error",
        description: "Please provide a workout name",
        variant: "destructive",
      });
      return;
    }
    
    if (!(workout.exercises?.length ?? 0)) {
      toast({
        title: "Validation Error",
        description: "Please add at least one exercise",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSaving(true);
      
      const completeWorkout: Workout = {
        id: workout.id || generateWorkoutId(),
        name: workout.name || 'Untitled Workout',
        description: workout.description,
        date: workout.date || format(new Date(), 'yyyy-MM-dd'),
        exercises: workout.exercises || [],
        completed: workout.completed || false
      };
      
      if (id && id !== 'new') {
        await updateWorkout(completeWorkout);
        toast({
          title: "Success",
          description: "Workout updated successfully",
        });
      } else {
        await addWorkout(completeWorkout);
        toast({
          title: "Success",
          description: "Workout created successfully",
        });
      }
      
      navigate('/calendar');
    } catch (error) {
      console.error('Error saving workout:', error);
      toast({
        title: "Error",
        description: "Failed to save workout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return {
    isSaving,
    saveWorkout,
    navigate
  };
};
