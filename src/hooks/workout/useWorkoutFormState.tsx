
import { useState, useEffect } from 'react';
import { format, parse } from 'date-fns';
import { useParams, useSearchParams } from 'react-router-dom';
import { Workout } from '@/lib/types';
import { getWorkoutById } from '@/lib/workouts';
import { toast } from '@/components/ui/use-toast';

export const useWorkoutFormState = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const initialDateParam = searchParams.get('date');
  
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
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
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
      } else {
        setIsLoading(false);
      }
    };
    
    fetchWorkout();
  }, [id]);
  
  useEffect(() => {
    if (selectedDate) {
      setWorkout(prev => ({ ...prev, date: format(selectedDate, 'yyyy-MM-dd') }));
    }
  }, [selectedDate]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setWorkout(prev => ({ ...prev, [name]: value }));
  };
  
  return {
    id,
    workout,
    setWorkout,
    selectedDate,
    setSelectedDate,
    isLoading,
    setIsLoading,
    isSaving,
    setIsSaving,
    handleInputChange
  };
};
