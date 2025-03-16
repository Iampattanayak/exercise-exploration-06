
import React from 'react';
import { format, parseISO } from 'date-fns';
import { Workout } from '@/lib/types';
import { Link } from 'react-router-dom';
import { 
  CalendarIcon, 
  CheckCircle, 
  Circle, 
  Dumbbell,
  ArrowRight
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface WorkoutCardProps {
  workout: Workout;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout }) => {
  const dateObj = parseISO(workout.date);
  const formattedDate = format(dateObj, 'EEE, MMM d');
  
  // Get total number of exercises
  const exerciseCount = workout.exercises.length;
  
  // Get total number of sets across all exercises
  const totalSets = workout.exercises.reduce(
    (total, exercise) => total + exercise.sets.length,
    0
  );

  return (
    <div className="workout-card flex flex-col border border-slate-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      <div className="p-5 flex-grow">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarIcon className="h-4 w-4 mr-1" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center">
            {workout.completed ? (
              <div className="flex items-center text-sm text-green-600 font-medium">
                <CheckCircle className="h-4 w-4 mr-1" />
                <span>Completed</span>
              </div>
            ) : (
              <div className="flex items-center text-sm text-muted-foreground font-medium">
                <Circle className="h-4 w-4 mr-1" />
                <span>Pending</span>
              </div>
            )}
          </div>
        </div>

        <h3 className="font-semibold text-lg mb-1">{workout.name}</h3>
        
        {workout.description && (
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
            {workout.description}
          </p>
        )}

        <div className="flex items-center mb-3 text-sm text-muted-foreground">
          <Dumbbell className="h-4 w-4 mr-1" />
          <span>
            {exerciseCount} {exerciseCount === 1 ? 'exercise' : 'exercises'} 
            {' • '}
            {totalSets} {totalSets === 1 ? 'set' : 'sets'}
          </span>
        </div>

        {workout.progress !== undefined && (
          <div className="mt-2 mb-1">
            <div className="flex justify-between text-xs mb-1">
              <span>Progress</span>
              <span>{workout.progress}%</span>
            </div>
            <Progress className="h-1.5" value={workout.progress} />
          </div>
        )}
      </div>

      <div className="border-t p-3 bg-muted/30 flex justify-between items-center">
        <Link to={`/workout/${workout.id}`}>
          <Button variant="ghost" size="sm" className="text-sm">
            View Details
          </Button>
        </Link>
        
        {!workout.completed && (
          <Link to={`/workout-session/${workout.id}`}>
            <Button size="sm" className="text-sm flex items-center">
              Start Workout
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default WorkoutCard;
