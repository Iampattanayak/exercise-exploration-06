
import { Category, Exercise, Workout, WorkoutExercise, ExerciseSet } from './types';
import { format, addDays, subDays } from 'date-fns';

// Exercise Categories
export const categories: Category[] = [
  { id: 'chest', name: 'Chest', color: 'bg-red-100 text-red-800' },
  { id: 'back', name: 'Back', color: 'bg-blue-100 text-blue-800' },
  { id: 'legs', name: 'Legs', color: 'bg-green-100 text-green-800' },
  { id: 'shoulders', name: 'Shoulders', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'arms', name: 'Arms', color: 'bg-purple-100 text-purple-800' },
  { id: 'core', name: 'Core', color: 'bg-orange-100 text-orange-800' },
  { id: 'cardio', name: 'Cardio', color: 'bg-pink-100 text-pink-800' },
  { id: 'fullbody', name: 'Full Body', color: 'bg-gray-100 text-gray-800' }
];

// Exercises
export const exercises: Exercise[] = [
  {
    id: 'bench-press',
    name: 'Bench Press',
    description: 'Lie on a flat bench, grip the barbell with hands slightly wider than shoulder-width, and press the weight upward until arms are extended.',
    category: 'chest',
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=500&h=500&auto=format&fit=crop',
  },
  {
    id: 'squat',
    name: 'Barbell Squat',
    description: 'Stand with feet shoulder-width apart, barbell across upper back, lower body until thighs are parallel to floor, then return to standing.',
    category: 'legs',
    imageUrl: 'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?q=80&w=500&h=500&auto=format&fit=crop',
  },
  {
    id: 'deadlift',
    name: 'Deadlift',
    description: 'Stand with feet hip-width apart, bend at hips and knees to grip barbell, lift by extending hips and knees, then lower back down.',
    category: 'back',
    imageUrl: 'https://images.unsplash.com/photo-1598268030535-f9273efa94b7?q=80&w=500&h=500&auto=format&fit=crop',
  },
  {
    id: 'overhead-press',
    name: 'Overhead Press',
    description: 'Stand with feet shoulder-width apart, grip barbell at shoulders, and press upward until arms are fully extended overhead.',
    category: 'shoulders',
    imageUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=500&h=500&auto=format&fit=crop',
  },
  {
    id: 'pull-ups',
    name: 'Pull-Ups',
    description: 'Hang from pull-up bar with hands wider than shoulder-width, pull body up until chin clears the bar, then lower back down.',
    category: 'back',
    imageUrl: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=500&h=500&auto=format&fit=crop',
  },
  {
    id: 'lunges',
    name: 'Dumbbell Lunges',
    description: 'Stand with dumbbells at sides, step forward with one leg and lower body until both knees are bent at 90 degrees, then return to standing.',
    category: 'legs',
    imageUrl: 'https://images.unsplash.com/photo-1434682772747-f16d3ea162c3?q=80&w=500&h=500&auto=format&fit=crop',
  },
  {
    id: 'bicep-curls',
    name: 'Bicep Curls',
    description: 'Stand with dumbbells at sides, palms facing forward, bend elbows to curl weights to shoulders, then lower back down.',
    category: 'arms',
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=500&h=500&auto=format&fit=crop',
  },
  {
    id: 'tricep-dips',
    name: 'Tricep Dips',
    description: 'Sit on edge of bench with hands gripping edge, slide off bench and lower body by bending elbows, then push back up.',
    category: 'arms',
    imageUrl: 'https://images.unsplash.com/photo-1530822847171-0e18a992ea40?q=80&w=500&h=500&auto=format&fit=crop',
  },
  {
    id: 'plank',
    name: 'Plank',
    description: 'Get in push-up position but with weight on forearms, maintain straight line from head to heels, hold position.',
    category: 'core',
    imageUrl: 'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?q=80&w=500&h=500&auto=format&fit=crop',
  },
  {
    id: 'running',
    name: 'Running',
    description: 'Run at moderate pace on treadmill or outdoors, maintain consistent tempo and proper form.',
    category: 'cardio',
    imageUrl: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?q=80&w=500&h=500&auto=format&fit=crop',
  },
  {
    id: 'leg-press',
    name: 'Leg Press',
    description: 'Sit on leg press machine, feet shoulder-width on platform, extend legs by pushing platform away, then return to starting position.',
    category: 'legs',
    imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=500&h=500&auto=format&fit=crop',
  },
  {
    id: 'lat-pulldown',
    name: 'Lat Pulldown',
    description: 'Sit at lat pulldown machine, grip bar wider than shoulder-width, pull bar down to chest, then slowly release back up.',
    category: 'back',
    imageUrl: 'https://images.unsplash.com/photo-1633415982831-41dbdddaf8bd?q=80&w=500&h=500&auto=format&fit=crop',
  }
];

// Helper function to create workout exercises with sets
const createWorkoutExercise = (exerciseId: string, order: number, setCount: number): WorkoutExercise => {
  const exercise = exercises.find(ex => ex.id === exerciseId)!;
  
  const sets: ExerciseSet[] = Array.from({ length: setCount }, (_, i) => ({
    id: `set-${exerciseId}-${i+1}`,
    exerciseId,
    setNumber: i + 1,
    targetReps: 10,
    completed: false,
    weight: 50 + Math.floor(Math.random() * 50) // Random weight between 50-100
  }));
  
  return {
    id: `workout-exercise-${exerciseId}`,
    exerciseId,
    exercise,
    sets,
    order
  };
};

// Today, upcoming and recent dates
const today = new Date();
const todayStr = format(today, 'yyyy-MM-dd');
const yesterday = format(subDays(today, 1), 'yyyy-MM-dd');
const dayBeforeYesterday = format(subDays(today, 2), 'yyyy-MM-dd');
const tomorrow = format(addDays(today, 1), 'yyyy-MM-dd');
const dayAfterTomorrow = format(addDays(today, 2), 'yyyy-MM-dd');
const nextWeek = format(addDays(today, 7), 'yyyy-MM-dd');
const lastWeek = format(subDays(today, 7), 'yyyy-MM-dd');

// Workouts
export const workouts: Workout[] = [
  // Today's workouts
  {
    id: 'workout-1',
    name: 'Morning Chest & Triceps',
    description: 'Focus on heavy compound movements for chest with tricep accessory work',
    date: todayStr,
    exercises: [
      createWorkoutExercise('bench-press', 1, 4),
      createWorkoutExercise('tricep-dips', 2, 3)
    ],
    completed: false,
    progress: 0
  },
  
  // Upcoming workouts
  {
    id: 'workout-2',
    name: 'Leg Day',
    description: 'Full lower body session with emphasis on quads and hamstrings',
    date: tomorrow,
    exercises: [
      createWorkoutExercise('squat', 1, 4),
      createWorkoutExercise('leg-press', 2, 3),
      createWorkoutExercise('lunges', 3, 3)
    ],
    completed: false
  },
  {
    id: 'workout-3',
    name: 'Back & Biceps',
    description: 'Pull-focused workout targeting the entire back with bicep finishers',
    date: dayAfterTomorrow,
    exercises: [
      createWorkoutExercise('deadlift', 1, 3),
      createWorkoutExercise('pull-ups', 2, 4),
      createWorkoutExercise('lat-pulldown', 3, 3),
      createWorkoutExercise('bicep-curls', 4, 3)
    ],
    completed: false
  },
  {
    id: 'workout-4',
    name: 'Cardio & Core',
    description: 'High-intensity interval training with core strengthening',
    date: nextWeek,
    exercises: [
      createWorkoutExercise('running', 1, 1),
      createWorkoutExercise('plank', 2, 3)
    ],
    completed: false
  },
  
  // Recent completed workouts
  {
    id: 'workout-5',
    name: 'Full Body Strength',
    description: 'Compound movements targeting all major muscle groups',
    date: yesterday,
    exercises: [
      createWorkoutExercise('squat', 1, 3),
      createWorkoutExercise('bench-press', 2, 3),
      createWorkoutExercise('deadlift', 3, 2)
    ],
    completed: true,
    progress: 100
  },
  {
    id: 'workout-6',
    name: 'Shoulder Focus',
    description: 'Deltoid-focused session with accessory shoulder movements',
    date: dayBeforeYesterday,
    exercises: [
      createWorkoutExercise('overhead-press', 1, 4)
    ],
    completed: true,
    progress: 100
  },
  {
    id: 'workout-7',
    name: 'Arm Day',
    description: 'Biceps and triceps isolation training',
    date: lastWeek,
    exercises: [
      createWorkoutExercise('bicep-curls', 1, 3),
      createWorkoutExercise('tricep-dips', 2, 3)
    ],
    completed: true,
    progress: 100
  }
];

// Utility functions for workout data management
export const getWorkoutsByDate = (date: string): Workout[] => {
  return workouts.filter(workout => workout.date === date);
};

export const getWorkoutById = (id: string): Workout | undefined => {
  return workouts.find(workout => workout.id === id);
};

export const getExerciseById = (id: string): Exercise | undefined => {
  return exercises.find(ex => ex.id === id);
};

export const getCategoryById = (id: string): Category | undefined => {
  return categories.find(category => category.id === id);
};

export const getTodayWorkouts = (): Workout[] => {
  return getWorkoutsByDate(format(new Date(), 'yyyy-MM-dd'));
};

export const getUpcomingWorkouts = (): Workout[] => {
  const today = format(new Date(), 'yyyy-MM-dd');
  return workouts
    .filter(workout => workout.date > today && !workout.completed)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);
};

export const getRecentWorkouts = (): Workout[] => {
  const today = format(new Date(), 'yyyy-MM-dd');
  return workouts
    .filter(workout => workout.date <= today)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
};

export const updateWorkout = (updatedWorkout: Workout): void => {
  const index = workouts.findIndex(w => w.id === updatedWorkout.id);
  if (index !== -1) {
    workouts[index] = updatedWorkout;
  }
};

export const addWorkout = (workout: Workout): void => {
  workouts.push(workout);
};

export const deleteWorkout = (id: string): void => {
  const index = workouts.findIndex(w => w.id === id);
  if (index !== -1) {
    workouts.splice(index, 1);
  }
};

export const addExercise = (exercise: Exercise): void => {
  exercises.push(exercise);
};

export const deleteExercise = (id: string): void => {
  const index = exercises.findIndex(e => e.id === id);
  if (index !== -1) {
    exercises.splice(index, 1);
  }
};

export const generateWorkoutId = (): string => {
  return `workout-${Date.now()}`;
};

export const generateExerciseId = (): string => {
  return `exercise-${Date.now()}`;
};
