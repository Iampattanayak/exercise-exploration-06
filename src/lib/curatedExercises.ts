
import { v4 as uuidv4 } from 'uuid';
import { Exercise } from './types';

// Curated list of exercises with descriptions and images
export const curatedExercises: Exercise[] = [
  {
    id: uuidv4(),
    name: "Barbell Bench Press",
    description: "Lie on a flat bench with your feet on the ground. Grip the barbell slightly wider than shoulder width. Lower the bar to your chest, then press it back up to the starting position.",
    category: "chest",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop"
  },
  {
    id: uuidv4(),
    name: "Pull-Up",
    description: "Grab a pull-up bar with hands wider than shoulder-width apart, palms facing away. Pull your body up until your chin passes the bar, then lower back to the starting position.",
    category: "back",
    imageUrl: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=800&auto=format&fit=crop"
  },
  {
    id: uuidv4(),
    name: "Squat",
    description: "Stand with feet shoulder-width apart. Bend your knees and lower your body as if sitting in a chair. Keep your chest up and knees tracking over your toes. Return to standing position.",
    category: "legs",
    imageUrl: "https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?w=800&auto=format&fit=crop"
  },
  {
    id: uuidv4(),
    name: "Deadlift",
    description: "Stand with feet hip-width apart, barbell over mid-foot. Bend at the hips and knees to grip the bar. Keep your back straight as you lift the bar by extending hips and knees.",
    category: "back",
    imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop"
  },
  {
    id: uuidv4(),
    name: "Shoulder Press",
    description: "Sit or stand with a dumbbell in each hand at shoulder height. Press the weights directly overhead until arms are extended, then lower back to starting position.",
    category: "shoulders",
    imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop"
  },
  {
    id: uuidv4(),
    name: "Bicep Curl",
    description: "Stand with a dumbbell in each hand, arms fully extended. Keep your elbows close to your torso and curl the weights up to shoulder level, then lower back down.",
    category: "arms",
    imageUrl: "https://images.unsplash.com/photo-1584863231364-2edc166de576?w=800&auto=format&fit=crop"
  },
  {
    id: uuidv4(),
    name: "Tricep Dip",
    description: "Support your body between parallel bars with arms extended. Lower your body by bending your elbows until upper arms are parallel to the ground, then press back up.",
    category: "arms",
    imageUrl: "https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?w=800&auto=format&fit=crop"
  },
  {
    id: uuidv4(),
    name: "Plank",
    description: "Start in a push-up position, then bend your elbows to rest your weight on your forearms. Keep your body in a straight line from head to heels, engaging your core.",
    category: "core",
    imageUrl: "https://images.unsplash.com/photo-1566241142704-36642d47589f?w=800&auto=format&fit=crop"
  }
];

// Function to map category names to UUIDs
export const mapCuratedExercisesToCategories = (categoryMap: Record<string, string>): Exercise[] => {
  return curatedExercises.map(exercise => ({
    ...exercise,
    category: categoryMap[exercise.category] || exercise.category
  }));
};

// Function to check if an exercise already exists based on name
export const findExistingExercise = (exercises: Exercise[], name: string): Exercise | undefined => {
  return exercises.find(exercise => 
    exercise.name.toLowerCase() === name.toLowerCase()
  );
};
