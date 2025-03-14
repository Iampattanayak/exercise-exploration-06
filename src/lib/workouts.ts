
import { v4 as uuidv4 } from 'uuid';
import { Workout, WorkoutExercise } from './types';

// Mock data for workouts until we implement them in Supabase
export const workouts: Workout[] = [
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

// WORKOUT FUNCTIONS (Currently mocked)
export const getRecentWorkouts = (): Workout[] => {
  // Return completed workouts, sorted by date (most recent first)
  return [...workouts]
    .filter(workout => workout.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
};

export const getTodayWorkouts = (): Workout[] => {
  // Get today's date in yyyy-MM-dd format
  const today = new Date().toISOString().split('T')[0];
  
  // Return workouts scheduled for today
  return workouts.filter(workout => workout.date === today);
};

export const getUpcomingWorkouts = (): Workout[] => {
  // Get today's date
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Return future workouts, sorted by date (soonest first)
  return [...workouts]
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
  return workouts.filter(workout => workout.date === date);
};

export const getWorkoutById = (id: string): Workout | null => {
  // Find workout by ID
  return workouts.find(workout => workout.id === id) || null;
};

export const addWorkout = (workout: Workout): void => {
  // Add workout to mock data
  workouts.push(workout);
};

export const updateWorkout = (updatedWorkout: Workout): void => {
  // Find workout index
  const index = workouts.findIndex(workout => workout.id === updatedWorkout.id);
  
  // Update if found
  if (index !== -1) {
    workouts[index] = updatedWorkout;
  }
};

export const deleteWorkout = (id: string): void => {
  // Remove workout from mock data
  const index = workouts.findIndex(workout => workout.id === id);
  if (index !== -1) {
    workouts.splice(index, 1);
  }
};

export const generateWorkoutId = (): string => {
  // Generate a unique ID for a new workout
  return uuidv4();
};
