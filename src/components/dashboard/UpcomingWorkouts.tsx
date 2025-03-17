
import React, { useState, useEffect } from 'react';
import { getUpcomingWorkouts } from '@/lib/workouts';
import { Workout } from '@/lib/types';
import WorkoutCard from '@/components/workout/WorkoutCard';
import SectionHeader from '@/components/layout/SectionHeader';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';

const UpcomingWorkouts: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshWorkouts = async () => {
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

  useEffect(() => {
    refreshWorkouts();
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
    <div className="mb-10 bg-gradient-to-br from-violet-50 via-indigo-50 to-purple-50 p-6 rounded-xl shadow-md border border-violet-100 hover:shadow-xl transition-all duration-500">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <div className="mr-4 bg-gradient-to-r from-violet-600 to-indigo-600 p-2 rounded-full text-white shadow-glow">
            <Clock className="h-5 w-5" />
          </div>
          <SectionHeader 
            title="Upcoming Workouts" 
            description="Your scheduled workouts for the next days"
          />
        </div>
        <Link to="/workout/new">
          <Button className="flex items-center bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg rounded-full">
            <Calendar className="mr-2 h-4 w-4" />
            View Calendar
          </Button>
        </Link>
      </div>

      {workouts.length === 0 ? (
        <div className="glass-card p-8 text-center rounded-2xl shadow-inner">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-violet-100 to-indigo-100 rounded-full text-violet-600 mb-4">
            <Rocket className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-gradient">No upcoming workouts</h3>
          <p className="text-muted-foreground mb-4">Plan your fitness routine by scheduling workouts.</p>
          <Link to="/workout/new">
            <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 rounded-full">
              Schedule a Workout
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workouts.map((workout: Workout) => (
            <WorkoutCard key={workout.id} workout={workout} onArchive={refreshWorkouts} />
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingWorkouts;
