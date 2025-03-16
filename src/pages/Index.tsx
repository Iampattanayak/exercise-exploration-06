
import React from 'react';
import PageContainer from '@/components/layout/PageContainer';
import TodayWorkouts from '@/components/dashboard/TodayWorkouts';
import UpcomingWorkouts from '@/components/dashboard/UpcomingWorkouts';
import RecentWorkouts from '@/components/dashboard/RecentWorkouts';
import { Dumbbell } from 'lucide-react';

const Index = () => {
  return (
    <PageContainer>
      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full text-primary mb-5">
          <Dumbbell className="h-10 w-10" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-3">Welcome to FitTrack</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Track your workouts, monitor your progress, and achieve your fitness goals
        </p>
      </div>

      <div className="space-y-10">
        <TodayWorkouts />
        <UpcomingWorkouts />
        <RecentWorkouts />
      </div>
    </PageContainer>
  );
};

export default Index;
