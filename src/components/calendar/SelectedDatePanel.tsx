
import React from 'react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { Workout } from '@/lib/types';
import WorkoutCard from '@/components/workout/WorkoutCard';
import { Skeleton } from '@/components/ui/skeleton';

interface SelectedDatePanelProps {
  selectedDate: Date;
  selectedWorkouts: Workout[];
  loading: boolean;
  onArchive: () => void;
}

const SelectedDatePanel: React.FC<SelectedDatePanelProps> = ({
  selectedDate,
  selectedWorkouts,
  loading,
  onArchive,
}) => {
  const selectedDateString = format(selectedDate, 'yyyy-MM-dd');

  return (
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

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : selectedWorkouts.length > 0 ? (
        <div className="space-y-4">
          {selectedWorkouts.map((workout: Workout) => (
            <WorkoutCard 
              key={workout.id} 
              workout={workout} 
              onArchive={onArchive}
            />
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
  );
};

export default SelectedDatePanel;
