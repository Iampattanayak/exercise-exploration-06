import React, { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, parseISO, isSameDay } from 'date-fns';
import { workouts, getWorkoutsByDate } from '@/lib/data';
import { Workout } from '@/lib/types';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import WorkoutCard from '@/components/workout/WorkoutCard';
import { Link } from 'react-router-dom';

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const selectedDateString = format(selectedDate, 'yyyy-MM-dd');
  const selectedWorkouts = getWorkoutsByDate(selectedDateString);

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const renderCalendarHeader = () => {
    return (
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{format(currentMonth, 'MMMM yyyy')}</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  const renderDaysOfWeek = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="grid grid-cols-7 mb-2">
        {days.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = monthStart;
    const endDate = monthEnd;

    const dateFormat = 'd';
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const startDay = monthStart.getDay();
    
    const rows = [];
    let cells = [];
    
    for (let i = 0; i < startDay; i++) {
      cells.push(
        <div key={`empty-${i}`} className="p-2 border border-transparent h-[90px]"></div>
      );
    }

    days.forEach((day) => {
      const formattedDate = format(day, dateFormat);
      const dateString = format(day, 'yyyy-MM-dd');
      const dayWorkouts = getWorkoutsByDate(dateString);
      const hasWorkouts = dayWorkouts.length > 0;
      
      cells.push(
        <div
          key={day.toString()}
          className={cn(
            'p-2 border hover:bg-muted/20 cursor-pointer h-[90px] relative group transition-colors',
            isToday(day) ? 'bg-blue-50 border-blue-200' : 'border-border',
            isSameDay(day, selectedDate) ? 'ring-2 ring-primary ring-inset' : '',
            !isSameMonth(day, monthStart) ? 'text-muted-foreground' : ''
          )}
          onClick={() => setSelectedDate(day)}
        >
          <div className="flex justify-between items-start">
            <span 
              className={cn(
                "h-7 w-7 flex items-center justify-center rounded-full text-sm",
                isToday(day) ? "bg-primary text-primary-foreground" : ""
              )}
            >
              {formattedDate}
            </span>
            {hasWorkouts && (
              <span className="bg-primary h-2 w-2 rounded-full"></span>
            )}
          </div>
          {hasWorkouts && (
            <div className="mt-1 text-xs text-muted-foreground line-clamp-2">
              {dayWorkouts.map(workout => workout.name).join(', ')}
            </div>
          )}
        </div>
      );
      
      if (cells.length === 7) {
        rows.push(
          <div key={`row-${rows.length}`} className="grid grid-cols-7">
            {cells}
          </div>
        );
        cells = [];
      }
    });
    
    if (cells.length > 0) {
      while (cells.length < 7) {
        cells.push(
          <div key={`empty-end-${cells.length}`} className="p-2 border border-transparent h-[90px]"></div>
        );
      }
      rows.push(
        <div key={`row-${rows.length}`} className="grid grid-cols-7">
          {cells}
        </div>
      );
    }
    
    return <div className="rounded-lg overflow-hidden border">{rows}</div>;
  };

  return (
    <PageContainer>
      <PageHeader 
        title="Calendar" 
        description="Schedule and manage your workout sessions"
        action={
          <Link to={`/workout/new?date=${selectedDateString}`}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              <span>Add Workout</span>
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {renderCalendarHeader()}
          {renderDaysOfWeek()}
          {renderDays()}
        </div>
        
        <div>
          <div className="sticky top-20">
            <div className="bg-muted/30 rounded-lg p-4 mb-4">
              <h3 className="font-medium mb-1">Selected Date</h3>
              <p className="text-lg">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
              
              <div className="mt-4 flex">
                <Link to={`/workout/new?date=${selectedDateString}`} className="w-full">
                  <Button className="w-full" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    <span>Add Workout</span>
                  </Button>
                </Link>
              </div>
            </div>

            <h3 className="font-medium mb-3">
              {selectedWorkouts.length > 0 
                ? `Workouts on ${format(selectedDate, 'MMM d')}` 
                : `No workouts on ${format(selectedDate, 'MMM d')}`}
            </h3>

            {selectedWorkouts.length > 0 ? (
              <div className="space-y-4">
                {selectedWorkouts.map((workout: Workout) => (
                  <WorkoutCard key={workout.id} workout={workout} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  <p>No workouts scheduled for this date.</p>
                  <p className="mt-2">Click the button above to add one.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Calendar;
