
import { useState, useEffect } from 'react';
import { format, parse } from 'date-fns';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Exercise, WorkoutExercise, ExerciseSet, Workout, Category } from '@/lib/types';
import { getWorkoutById, addWorkout, updateWorkout, generateWorkoutId } from '@/lib/workouts';
import { getAllExercises } from '@/lib/exercises';
import { getAllCategories } from '@/lib/data';
import { toast } from '@/components/ui/use-toast';

export const useWorkoutForm = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const initialDateParam = searchParams.get('date');
  const navigate = useNavigate();
  
  const [workout, setWorkout] = useState<Partial<Workout>>({
    name: '',
    description: '',
    date: initialDateParam || format(new Date(), 'yyyy-MM-dd'),
    exercises: [],
    completed: false
  });
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    initialDateParam 
      ? parse(initialDateParam, 'yyyy-MM-dd', new Date()) 
      : new Date()
  );
  
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [categoryMap, setCategoryMap] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<Category[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [exercisesData, categoriesData] = await Promise.all([
          getAllExercises(),
          getAllCategories()
        ]);
        
        const catMap: Record<string, string> = {};
        categoriesData.forEach(category => {
          catMap[category.id] = category.name;
        });
        
        setCategoryMap(catMap);
        setCategories(categoriesData);
        setAvailableExercises(exercisesData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load exercises and categories. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  useEffect(() => {
    const fetchWorkout = async () => {
      if (id && id !== 'new') {
        try {
          setIsLoading(true);
          const existingWorkout = await getWorkoutById(id);
          if (existingWorkout) {
            setWorkout(existingWorkout);
            setSelectedDate(parse(existingWorkout.date, 'yyyy-MM-dd', new Date()));
          }
        } catch (error) {
          console.error('Error fetching workout:', error);
          toast({
            title: "Error",
            description: "Failed to load workout. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchWorkout();
  }, [id]);
  
  useEffect(() => {
    if (selectedDate) {
      setWorkout(prev => ({ ...prev, date: format(selectedDate, 'yyyy-MM-dd') }));
    }
  }, [selectedDate]);
  
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
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setWorkout(prev => ({ ...prev, [name]: value }));
  };
  
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
    id,
    workout,
    selectedDate,
    availableExercises,
    searchTerm,
    isLoading,
    isSaving,
    categoryMap,
    categories,
    setSelectedDate,
    setSearchTerm,
    handleInputChange,
    handleReorderExercises,
    handleMoveExercise,
    handleAddExercise,
    handleRemoveExercise,
    handleSetChange,
    handleAddSet,
    handleRemoveSet,
    saveWorkout,
    navigate
  };
};
