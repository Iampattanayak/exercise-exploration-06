
import React, { useState, useEffect } from 'react';
import { getUpcomingWorkouts } from '@/lib/workouts';
import { Workout } from '@/lib/types';
import WorkoutCard from '@/components/workout/WorkoutCard';
import SectionHeader from '@/components/layout/SectionHeader';
import { Skeleton } from '@/components/ui/skeleton';

const UpcomingWorkouts: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        setLoading(true);
        const data = await getUpcomingWorkouts();
        setWorkouts(data);
      } catch (error) {
        console.error('Error fetching upcoming workouts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  if (loading) {
    return (
      <div className="mb-10">
        <SectionHeader 
          title="Upcoming Workouts" 
          description="Your scheduled workouts for the next days"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-5">
              <Skeleton className="h-4 w-20 mb-3" />
              <Skeleton className="h-6 w-40 mb-1" />
              <Skeleton className="h-4 w-full mb-3" />
              <Skeleton className="h-4 w-32 mb-3" />
              <Skeleton className="h-2 w-full mb-6" />
              <div className="border-t pt-3">
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-10">
      <SectionHeader 
        title="Upcoming Workouts" 
        description="Your scheduled workouts for the next days"
      />

      {workouts.length === 0 ? (
        <div className="bg-muted/50 rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium mb-2">No upcoming workouts</h3>
          <p className="text-muted-foreground mb-4">Plan your fitness routine by scheduling workouts.</p>
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
