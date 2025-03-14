
import React from 'react';
import { getTodayWorkouts } from '@/lib/data';
import { Workout } from '@/lib/types';
import WorkoutCard from '@/components/workout/WorkoutCard';
import SectionHeader from '@/components/layout/SectionHeader';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const TodayWorkouts: React.FC = () => {
  const workouts = getTodayWorkouts();
  const today = format(new Date(), 'EEEE, MMMM d');

  return (
    <div className="mb-10">
      <SectionHeader 
        title={`Today's Workouts`}
        description={today}
        action={
          <Link to="/workout/new">
            <Button size="sm" className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              <span>Add Workout</span>
            </Button>
          </Link>
        }
      />

      {workouts.length === 0 ? (
        <div className="bg-muted/50 rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium mb-2">No workouts scheduled for today</h3>
          <p className="text-muted-foreground mb-4">Start your fitness journey by adding a workout for today.</p>
          <Link to="/workout/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              <span>Create Workout</span>
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

export default TodayWorkouts;
