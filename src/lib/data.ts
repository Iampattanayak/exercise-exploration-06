
import { supabase } from '@/integrations/supabase/client';
import { Category, Exercise, Workout, WorkoutExercise } from './types';
import { v4 as uuidv4 } from 'uuid';

// Mock data for workouts until we implement them in Supabase
const mockWorkouts: Workout[] = [
  {
    id: '1',
    name: 'Monday Push Day',
    description: 'Chest, shoulders and triceps workout',
    date: '2023-10-09',
    exercises: [],
    completed: false
  },
  {
    id: '2',
    name: 'Tuesday Pull Day',
    description: 'Back and biceps focused workout',
    date: '2023-10-10',
    exercises: [],
    completed: false
  },
  {
    id: '3',
    name: 'Wednesday Leg Day',
    description: 'Full lower body workout',
    date: '2023-10-11',
    exercises: [],
    completed: true,
    progress: 100
  }
];

// Export mockWorkouts for components that need it directly
export const workouts = mockWorkouts;

// Helper to get exercises for the mockWorkouts
export const exercises: Exercise[] = [];

// CATEGORY FUNCTIONS
export const getAllCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching categories:', error);
    throw new Error(error.message);
  }
  
  return data.map(item => ({
    id: item.id,
    name: item.name,
    color: item.color
  }));
};

export const getCategoryById = (categoryId: string): Category | null => {
  // This is a helper function used by components for immediate rendering
  // It will be called with data that's already been fetched
  return { id: categoryId, name: categoryId, color: 'bg-gray-100 text-gray-800' };
};

export const addCategory = async (category: Category): Promise<void> => {
  const { error } = await supabase
    .from('categories')
    .insert([{
      id: category.id,
      name: category.name,
      color: category.color
    }]);
  
  if (error) {
    console.error('Error adding category:', error);
    throw new Error(error.message);
  }
};

export const updateCategory = async (category: Category): Promise<void> => {
  const { error } = await supabase
    .from('categories')
    .update({
      name: category.name,
      color: category.color
    })
    .eq('id', category.id);
  
  if (error) {
    console.error('Error updating category:', error);
    throw new Error(error.message);
  }
};

export const deleteCategory = async (categoryId: string): Promise<void> => {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', categoryId);
  
  if (error) {
    console.error('Error deleting category:', error);
    throw new Error(error.message);
  }
};

// EXERCISE FUNCTIONS
export const getAllExercises = async (): Promise<Exercise[]> => {
  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching exercises:', error);
    throw new Error(error.message);
  }
  
  return data.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description || '',
    category: item.category,
    imageUrl: item.image_url || ''
  }));
};

export const getExerciseById = async (id: string): Promise<Exercise | null> => {
  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  
  if (error) {
    console.error('Error fetching exercise:', error);
    throw new Error(error.message);
  }
  
  if (!data) return null;
  
  return {
    id: data.id,
    name: data.name,
    description: data.description || '',
    category: data.category,
    imageUrl: data.image_url || ''
  };
};

export const addExercise = async (exercise: Exercise): Promise<void> => {
  // If there's an image upload, we would handle storage here
  // For now, we just store the image URL
  
  const { error } = await supabase
    .from('exercises')
    .insert([{
      id: exercise.id,
      name: exercise.name,
      description: exercise.description,
      category: exercise.category,
      image_url: exercise.imageUrl
    }]);
  
  if (error) {
    console.error('Error adding exercise:', error);
    throw new Error(error.message);
  }
};

export const updateExercise = async (exercise: Exercise): Promise<void> => {
  const { error } = await supabase
    .from('exercises')
    .update({
      name: exercise.name,
      description: exercise.description,
      category: exercise.category,
      image_url: exercise.imageUrl,
      updated_at: new Date().toISOString()
    })
    .eq('id', exercise.id);
  
  if (error) {
    console.error('Error updating exercise:', error);
    throw new Error(error.message);
  }
};

export const deleteExercise = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('exercises')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting exercise:', error);
    throw new Error(error.message);
  }
};

// WORKOUT FUNCTIONS (Currently mocked)
export const getRecentWorkouts = (): Workout[] => {
  // Return completed workouts, sorted by date (most recent first)
  return [...mockWorkouts]
    .filter(workout => workout.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
};

export const getTodayWorkouts = (): Workout[] => {
  // Get today's date in yyyy-MM-dd format
  const today = new Date().toISOString().split('T')[0];
  
  // Return workouts scheduled for today
  return mockWorkouts.filter(workout => workout.date === today);
};

export const getUpcomingWorkouts = (): Workout[] => {
  // Get today's date
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Return future workouts, sorted by date (soonest first)
  return [...mockWorkouts]
    .filter(workout => {
      const workoutDate = new Date(workout.date);
      workoutDate.setHours(0, 0, 0, 0);
      return workoutDate.getTime() > today.getTime();
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);
};

export const getWorkoutsByDate = (date: string): Workout[] => {
  // Return workouts scheduled for the specified date
  return mockWorkouts.filter(workout => workout.date === date);
};

export const getWorkoutById = (id: string): Workout | null => {
  // Find workout by ID
  return mockWorkouts.find(workout => workout.id === id) || null;
};

export const addWorkout = (workout: Workout): void => {
  // Add workout to mock data
  mockWorkouts.push(workout);
};

export const updateWorkout = (updatedWorkout: Workout): void => {
  // Find workout index
  const index = mockWorkouts.findIndex(workout => workout.id === updatedWorkout.id);
  
  // Update if found
  if (index !== -1) {
    mockWorkouts[index] = updatedWorkout;
  }
};

export const deleteWorkout = (id: string): void => {
  // Remove workout from mock data
  const index = mockWorkouts.findIndex(workout => workout.id === id);
  if (index !== -1) {
    mockWorkouts.splice(index, 1);
  }
};

export const generateWorkoutId = (): string => {
  // Generate a unique ID for a new workout
  return uuidv4();
};
