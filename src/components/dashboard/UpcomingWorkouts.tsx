
import React from 'react';
import { getUpcomingWorkouts } from '@/lib/data';
import { Workout } from '@/lib/types';
import WorkoutCard from '@/components/workout/WorkoutCard';
import SectionHeader from '@/components/layout/SectionHeader';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

const UpcomingWorkouts: React.FC = () => {
  const workouts = getUpcomingWorkouts();

  return (
    <div className="mb-10">
      <SectionHeader 
        title="Upcoming Workouts" 
        description="Your scheduled workouts for the next days"
        action={
          <Link to="/calendar">
            <Button size="sm" className="flex items-center gap-1" variant="outline">
              <Calendar className="h-4 w-4" />
              <span>View Calendar</span>
            </Button>
          </Link>
        }
      />

      {workouts.length === 0 ? (
        <div className="bg-muted/50 rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium mb-2">No upcoming workouts</h3>
          <p className="text-muted-foreground mb-4">Plan your fitness routine by scheduling workouts.</p>
          <Link to="/calendar">
            <Button>
              <Calendar className="h-4 w-4 mr-2" />
              <span>View Calendar</span>
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workouts.map((workout: Workout) => (
            <WorkoutCard key={workout.id} workout={workout} />
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingWorkouts;
