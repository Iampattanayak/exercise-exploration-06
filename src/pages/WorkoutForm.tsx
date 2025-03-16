import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { format, parse } from 'date-fns';
import { getWorkoutById, addWorkout, updateWorkout, generateWorkoutId } from '@/lib/workouts';
import { Exercise, WorkoutExercise, ExerciseSet, Workout } from '@/lib/types';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, Loader2, Save } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { getAllExercises } from '@/lib/exercises';
import { getAllCategories } from '@/lib/data';

// Import refactored components
import WorkoutBasicInfoForm from '@/components/workout/WorkoutBasicInfoForm';
import WorkoutExerciseList from '@/components/workout/WorkoutExerciseList';
import ExerciseSearch from '@/components/workout/ExerciseSearch';

const WorkoutForm = () => {
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
  
  return (
    <PageContainer>
      <PageHeader 
        title={id === 'new' ? "Create Workout" : "Edit Workout"} 
        description="Plan your workout routine"
        action={
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => navigate(-1)} disabled={isSaving}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={saveWorkout} disabled={isSaving || isLoading}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Workout
                </>
              )}
            </Button>
          </div>
        }
      />
      
      {isLoading ? (
        <Card className="p-8">
          <div className="flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading workout data...</span>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Basic workout info form */}
            <WorkoutBasicInfoForm
              name={workout.name || ''}
              description={workout.description || ''}
              selectedDate={selectedDate}
              onNameChange={(e) => handleInputChange(e)}
              onDescriptionChange={(e) => handleInputChange(e)}
              onDateChange={setSelectedDate}
            />
            
            <h3 className="font-medium text-lg mb-4">Exercises</h3>
            
            {/* Exercise list */}
            <WorkoutExerciseList
              exercises={workout.exercises || []}
              categoryMap={categoryMap}
              onRemoveExercise={handleRemoveExercise}
              onAddSet={handleAddSet}
              onRemoveSet={handleRemoveSet}
              onSetChange={handleSetChange}
            />
          </div>
          
          <div>
            {/* Exercise search */}
            <ExerciseSearch
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              availableExercises={availableExercises}
              isLoading={isLoading}
              onExerciseAdd={handleAddExercise}
              categoryMap={categoryMap}
            />
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default WorkoutForm;
