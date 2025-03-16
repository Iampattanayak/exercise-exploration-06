
import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { Workout } from '@/lib/types';

interface CalendarGridProps {
  currentMonth: Date;
  selectedDate: Date;
  calendarWorkouts: Record<string, Workout[]>;
  onSelectDate: (date: Date) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentMonth,
  selectedDate,
  calendarWorkouts,
  onSelectDate,
}) => {
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
      const dayWorkouts = calendarWorkouts[dateString] || [];
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
          onClick={() => onSelectDate(day)}
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
    <>
      {renderDaysOfWeek()}
      {renderDays()}
    </>
  );
};

export default CalendarGrid;
