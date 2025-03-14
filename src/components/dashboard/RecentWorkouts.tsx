
import React from 'react';
import { getRecentWorkouts } from '@/lib/data';
import { Workout } from '@/lib/types';
import WorkoutCard from '@/components/workout/WorkoutCard';
import SectionHeader from '@/components/layout/SectionHeader';
import { History } from 'lucide-react';

const RecentWorkouts: React.FC = () => {
  const workouts = getRecentWorkouts();

  return (
    <div className="mb-10">
      <SectionHeader 
        title="Recent Workouts" 
        description="Your most recent workout sessions" 
      />

      {workouts.length === 0 ? (
        <div className="bg-muted/50 rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium mb-2">No recent workouts</h3>
          <p className="text-muted-foreground">Complete a workout to see it here.</p>
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

export default RecentWorkouts;
