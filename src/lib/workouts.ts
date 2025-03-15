
import { v4 as uuidv4 } from 'uuid';
import { Workout, WorkoutExercise, ExerciseSet, Exercise } from './types';
import { supabase } from '@/integrations/supabase/client';

// Initial workouts for demo purposes will now just be for reference
// They're now stored in the database

// WORKOUT FUNCTIONS - Now using Supabase
export const getRecentWorkouts = async (): Promise<Workout[]> => {
  // Return completed workouts, sorted by date (most recent first)
  const { data, error } = await supabase
    .from('workouts')
    .select(`
      *,
      workout_exercises(
        *,
        exercises(id, name, description, category, image_url),
        exercise_sets(*)
      )
    `)
    .eq('completed', true)
    .order('date', { ascending: false })
    .limit(3);
  
  if (error) {
    console.error('Error fetching recent workouts:', error);
    return [];
  }
  
  return formatWorkoutsFromDb(data || []);
};

export const getTodayWorkouts = async (): Promise<Workout[]> => {
  // Get today's date in yyyy-MM-dd format
  const today = new Date().toISOString().split('T')[0];
  
  // Return workouts scheduled for today
  const { data, error } = await supabase
    .from('workouts')
    .select(`
      *,
      workout_exercises(
        *,
        exercises(id, name, description, category, image_url),
        exercise_sets(*)
      )
    `)
    .eq('date', today);
  
  if (error) {
    console.error('Error fetching today workouts:', error);
    return [];
  }
  
  return formatWorkoutsFromDb(data || []);
};

export const getUpcomingWorkouts = async (): Promise<Workout[]> => {
  // Get today's date in yyyy-MM-dd format
  const today = new Date().toISOString().split('T')[0];
  
  // Return future workouts, sorted by date (soonest first)
  const { data, error } = await supabase
    .from('workouts')
    .select(`
      *,
      workout_exercises(
        *,
        exercises(id, name, description, category, image_url),
        exercise_sets(*)
      )
    `)
    .gt('date', today)
    .order('date', { ascending: true })
    .limit(3);
  
  if (error) {
    console.error('Error fetching upcoming workouts:', error);
    return [];
  }
  
  return formatWorkoutsFromDb(data || []);
};

export const getWorkoutsByDate = async (date: string): Promise<Workout[]> => {
  // Return workouts scheduled for the specified date
  const { data, error } = await supabase
    .from('workouts')
    .select(`
      *,
      workout_exercises(
        *,
        exercises(id, name, description, category, image_url),
        exercise_sets(*)
      )
    `)
    .eq('date', date);
  
  if (error) {
    console.error('Error fetching workouts by date:', error);
    return [];
  }
  
  return formatWorkoutsFromDb(data || []);
};

export const getWorkoutById = async (id: string): Promise<Workout | null> => {
  // Find workout by ID
  const { data, error } = await supabase
    .from('workouts')
    .select(`
      *,
      workout_exercises(
        *,
        exercises(id, name, description, category, image_url),
        exercise_sets(*)
      )
    `)
    .eq('id', id)
    .maybeSingle();
  
  if (error) {
    console.error('Error fetching workout by id:', error);
    return null;
  }
  
  if (!data) return null;
  
  return formatWorkoutFromDb(data);
};

export const addWorkout = async (workout: Workout): Promise<void> => {
  try {
    // First, insert the workout
    const { data: workoutData, error: workoutError } = await supabase
      .from('workouts')
      .insert({
        id: workout.id,
        name: workout.name,
        description: workout.description || null,
        date: workout.date,
        completed: workout.completed,
        progress: workout.progress || 0
      })
      .select('id')
      .single();

    if (workoutError) throw workoutError;

    // Then, insert all workout exercises
    for (const exerciseItem of workout.exercises) {
      const { data: workoutExerciseData, error: workoutExerciseError } = await supabase
        .from('workout_exercises')
        .insert({
          workout_id: workoutData.id,
          exercise_id: exerciseItem.exerciseId,
          order_index: exerciseItem.order
        })
        .select('id')
        .single();

      if (workoutExerciseError) throw workoutExerciseError;

      // Finally, insert all sets for this exercise
      const setsToInsert = exerciseItem.sets.map((set, index) => ({
        workout_exercise_id: workoutExerciseData.id,
        set_number: set.setNumber,
        weight: set.weight || null,
        target_reps: set.targetReps,
        actual_reps: set.actualReps || null,
        completed: set.completed
      }));

      const { error: setsError } = await supabase
        .from('exercise_sets')
        .insert(setsToInsert);

      if (setsError) throw setsError;
    }
  } catch (error) {
    console.error('Error adding workout:', error);
  }
};

export const updateWorkout = async (updatedWorkout: Workout): Promise<void> => {
  try {
    // First, update the workout
    const { error: workoutError } = await supabase
      .from('workouts')
      .update({
        name: updatedWorkout.name,
        description: updatedWorkout.description || null,
        date: updatedWorkout.date,
        completed: updatedWorkout.completed,
        progress: updatedWorkout.progress || 0
      })
      .eq('id', updatedWorkout.id);

    if (workoutError) throw workoutError;

    // Then handle exercises and sets
    // Get existing workout exercises
    const { data: existingWorkoutExercises, error: fetchError } = await supabase
      .from('workout_exercises')
      .select('id, exercise_id')
      .eq('workout_id', updatedWorkout.id);

    if (fetchError) throw fetchError;

    // For each exercise in the updated workout
    for (const exerciseItem of updatedWorkout.exercises) {
      const existingWorkoutExercise = existingWorkoutExercises?.find(
        we => we.exercise_id === exerciseItem.exerciseId
      );

      if (existingWorkoutExercise) {
        // Update existing workout exercise
        const { error: updateExerciseError } = await supabase
          .from('workout_exercises')
          .update({ order_index: exerciseItem.order })
          .eq('id', existingWorkoutExercise.id);

        if (updateExerciseError) throw updateExerciseError;

        // Get existing sets
        const { data: existingSets, error: fetchSetsError } = await supabase
          .from('exercise_sets')
          .select('id, set_number')
          .eq('workout_exercise_id', existingWorkoutExercise.id);

        if (fetchSetsError) throw fetchSetsError;

        // Update or insert sets
        for (const set of exerciseItem.sets) {
          const existingSet = existingSets?.find(s => s.set_number === set.setNumber);

          if (existingSet) {
            // Update existing set
            const { error: updateSetError } = await supabase
              .from('exercise_sets')
              .update({
                weight: set.weight || null,
                target_reps: set.targetReps,
                actual_reps: set.actualReps || null,
                completed: set.completed
              })
              .eq('id', existingSet.id);

            if (updateSetError) throw updateSetError;
          } else {
            // Insert new set
            const { error: insertSetError } = await supabase
              .from('exercise_sets')
              .insert({
                workout_exercise_id: existingWorkoutExercise.id,
                set_number: set.setNumber,
                weight: set.weight || null,
                target_reps: set.targetReps,
                actual_reps: set.actualReps || null,
                completed: set.completed
              });

            if (insertSetError) throw insertSetError;
          }
        }

        // Remove sets that no longer exist
        const setNumbersToKeep = exerciseItem.sets.map(s => s.setNumber);
        const setsToDelete = existingSets?.filter(
          s => !setNumbersToKeep.includes(s.set_number)
        );

        if (setsToDelete && setsToDelete.length > 0) {
          const { error: deleteSetError } = await supabase
            .from('exercise_sets')
            .delete()
            .in('id', setsToDelete.map(s => s.id));

          if (deleteSetError) throw deleteSetError;
        }
      } else {
        // Insert new workout exercise
        const { data: newWorkoutExercise, error: insertExerciseError } = await supabase
          .from('workout_exercises')
          .insert({
            workout_id: updatedWorkout.id,
            exercise_id: exerciseItem.exerciseId,
            order_index: exerciseItem.order
          })
          .select('id')
          .single();

        if (insertExerciseError) throw insertExerciseError;

        // Insert all sets for this new exercise
        const setsToInsert = exerciseItem.sets.map(set => ({
          workout_exercise_id: newWorkoutExercise.id,
          set_number: set.setNumber,
          weight: set.weight || null,
          target_reps: set.targetReps,
          actual_reps: set.actualReps || null,
          completed: set.completed
        }));

        const { error: insertSetsError } = await supabase
          .from('exercise_sets')
          .insert(setsToInsert);

        if (insertSetsError) throw insertSetsError;
      }
    }

    // Remove workout exercises that no longer exist
    const exerciseIdsToKeep = updatedWorkout.exercises.map(e => e.exerciseId);
    const workoutExercisesToDelete = existingWorkoutExercises?.filter(
      we => !exerciseIdsToKeep.includes(we.exercise_id)
    );

    if (workoutExercisesToDelete && workoutExercisesToDelete.length > 0) {
      const { error: deleteExerciseError } = await supabase
        .from('workout_exercises')
        .delete()
        .in('id', workoutExercisesToDelete.map(we => we.id));

      if (deleteExerciseError) throw deleteExerciseError;
    }
  } catch (error) {
    console.error('Error updating workout:', error);
  }
};

export const deleteWorkout = async (id: string): Promise<void> => {
  // Delete workout - cascade will handle related records
  const { error } = await supabase
    .from('workouts')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting workout:', error);
  }
};

export const generateWorkoutId = (): string => {
  // Generate a unique ID for a new workout
  return uuidv4();
};

// Helper function to format workout data from the database into our app's Workout type
const formatWorkoutFromDb = (dbWorkout: any): Workout => {
  const exercises: WorkoutExercise[] = (dbWorkout.workout_exercises || []).map((we: any) => {
    // Format the sets for this exercise
    const sets: ExerciseSet[] = (we.exercise_sets || []).map((set: any) => ({
      id: set.id,
      exerciseId: we.exercise_id,
      setNumber: set.set_number,
      targetReps: set.target_reps,
      actualReps: set.actual_reps,
      weight: set.weight,
      completed: set.completed,
      notes: set.notes
    }));

    // Create the exercise object
    return {
      id: we.id,
      exerciseId: we.exercise_id,
      exercise: {
        id: we.exercises.id,
        name: we.exercises.name,
        description: we.exercises.description || '',
        category: we.exercises.category,
        imageUrl: we.exercises.image_url || ''
      },
      sets: sets,
      order: we.order_index
    };
  });

  // Create the workout object
  return {
    id: dbWorkout.id,
    name: dbWorkout.name,
    description: dbWorkout.description || '',
    date: dbWorkout.date,
    exercises: exercises,
    completed: dbWorkout.completed,
    progress: dbWorkout.progress
  };
};

// Helper function to format an array of workout data from the database
const formatWorkoutsFromDb = (dbWorkouts: any[]): Workout[] => {
  return dbWorkouts.map(formatWorkoutFromDb);
};
