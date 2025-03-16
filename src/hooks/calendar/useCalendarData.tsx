
import { useState, useEffect, useCallback } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { getWorkoutsByDate } from '@/lib/workouts';
import { Workout } from '@/lib/types';

export const useCalendarData = (initialDate?: string) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedWorkouts, setSelectedWorkouts] = useState<Workout[]>([]);
  const [calendarWorkouts, setCalendarWorkouts] = useState<Record<string, Workout[]>>({});
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const selectedDateString = format(selectedDate, 'yyyy-MM-dd');

  // Function to refresh data after a workout is archived
  const refreshData = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  useEffect(() => {
    const fetchSelectedDateWorkouts = async () => {
      setLoading(true);
      try {
        const workouts = await getWorkoutsByDate(selectedDateString);
        setSelectedWorkouts(workouts);
      } catch (error) {
        console.error('Error fetching workouts for selected date:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSelectedDateWorkouts();
  }, [selectedDateString, refreshTrigger]);

  useEffect(() => {
    const fetchCalendarWorkouts = async () => {
      const monthStart = startOfMonth(currentMonth);
      const monthEnd = endOfMonth(monthStart);
      const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
      
      const workoutsByDate: Record<string, Workout[]> = {};
      
      // Fetch workouts for each day in the month
      for (const day of days) {
        const dateString = format(day, 'yyyy-MM-dd');
        try {
          const dayWorkouts = await getWorkoutsByDate(dateString);
          workoutsByDate[dateString] = dayWorkouts;
        } catch (error) {
          console.error(`Error fetching workouts for ${dateString}:`, error);
          workoutsByDate[dateString] = [];
        }
      }
      
      setCalendarWorkouts(workoutsByDate);
    };

    fetchCalendarWorkouts();
  }, [currentMonth, refreshTrigger]);

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  return {
    currentMonth,
    selectedDate,
    selectedDateString,
    selectedWorkouts,
    calendarWorkouts,
    loading,
    setSelectedDate,
    nextMonth,
    prevMonth,
    refreshData
  };
};
