
import React, { useState, useEffect } from 'react';
import { getRecentWorkouts } from '@/lib/workouts';
import { Workout } from '@/lib/types';
import WorkoutCard from '@/components/workout/WorkoutCard';
import SectionHeader from '@/components/layout/SectionHeader';
import { Button } from '@/components/ui/button';
import { History, ArrowRight, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';

const RecentWorkouts: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshWorkouts = async () => {
    try {
      setLoading(true);
      const data = await getRecentWorkouts();
      setWorkouts(data);
    } catch (error) {
      console.error('Error fetching recent workouts:', error);
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
          title="Recent Workouts" 
          description="Your most recent workout sessions" 
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
    <div className="mb-10 bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 p-6 rounded-xl shadow-md border border-teal-100 hover:shadow-xl transition-all duration-500">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <div className="mr-4 bg-gradient-to-r from-teal-600 to-cyan-600 p-2 rounded-full text-white shadow-glow">
            <TrendingUp className="h-5 w-5" />
          </div>
          <SectionHeader 
            title="Recent Workouts" 
            description="Your most recent workout sessions" 
          />
        </div>
        <Link to="/workout-history">
          <Button variant="outline" size="sm" className="gap-1 bg-white/50 border-teal-200 hover:bg-white hover:border-teal-300 text-teal-700 rounded-full">
            View All
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>

      {workouts.length === 0 ? (
        <div className="glass-card p-8 text-center rounded-2xl shadow-inner">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-teal-100 to-cyan-100 rounded-full text-teal-600 mb-4">
            <History className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-gradient-teal">No recent workouts</h3>
          <p className="text-muted-foreground">Complete a workout to see it here.</p>
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

export default RecentWorkouts;
