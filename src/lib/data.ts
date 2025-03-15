
// Import from categories.ts for backward compatibility
export { getCategoryById, getCategoryByIdSync, getAllCategories, addCategory, updateCategory, deleteCategory } from './categories';

// Import from exercises.ts for backward compatibility
export { getAllExercises, getExerciseById, addExercise, updateExercise, deleteExercise } from './exercises';

// Import from workouts.ts for backward compatibility
export { 
  getRecentWorkouts, 
  getTodayWorkouts, 
  getUpcomingWorkouts, 
  getWorkoutsByDate,
  getWorkoutById,
  addWorkout,
  updateWorkout,
  deleteWorkout,
  generateWorkoutId
} from './workouts';
