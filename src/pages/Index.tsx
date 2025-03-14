
import React from 'react';
import PageContainer from '@/components/layout/PageContainer';
import TodayWorkouts from '@/components/dashboard/TodayWorkouts';
import UpcomingWorkouts from '@/components/dashboard/UpcomingWorkouts';
import RecentWorkouts from '@/components/dashboard/RecentWorkouts';
import { Dumbbell } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';

const Index = () => {
  return (
    <>
      <Navbar />
      <PageContainer>
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-full text-primary mb-4">
            <Dumbbell className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome to FitTrack</h1>
          <p className="text-lg text-muted-foreground">
            Track your workouts, monitor your progress, and achieve your fitness goals
          </p>
        </div>

        <TodayWorkouts />
        <UpcomingWorkouts />
        <RecentWorkouts />
      </PageContainer>
    </>
  );
};

export default Index;
