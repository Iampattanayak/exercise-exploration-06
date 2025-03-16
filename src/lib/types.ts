
export interface Exercise {
  id: string;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  imagePath?: string;
}

export interface ExerciseSet {
  id: string;
  exerciseId: string;
  setNumber: number;
  targetReps: number;
  actualReps?: number;
  weight?: number;
  completed: boolean;
  notes?: string;
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  exercise: Exercise;
  sets: ExerciseSet[];
  order: number;
}

export interface Workout {
  id: string;
  name: string;
  description?: string;
  date: string; // ISO format
  exercises: WorkoutExercise[];
  completed: boolean;
  progress?: number; // 0-100
  archived?: boolean; // New field for archive feature
}

export interface Category {
  id: string;
  name: string;
  color: string;
}
