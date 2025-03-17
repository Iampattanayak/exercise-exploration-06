
import React from 'react';
import PageContainer from '@/components/layout/PageContainer';
import TodayWorkouts from '@/components/dashboard/TodayWorkouts';
import UpcomingWorkouts from '@/components/dashboard/UpcomingWorkouts';
import RecentWorkouts from '@/components/dashboard/RecentWorkouts';
import { Dumbbell, Sparkles, Zap } from 'lucide-react';

const Index = () => {
  return (
    <PageContainer>
      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center p-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 shadow-glow text-white mb-6">
          <Dumbbell className="h-10 w-10" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-3 bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-700">Welcome to FitTrack</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto flex items-center justify-center">
          Track your workouts, monitor your progress
          <Zap className="h-5 w-5 mx-2 text-amber-400" />
          and achieve your fitness goals
          <Sparkles className="h-5 w-5 ml-2 text-indigo-400" />
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
