
import React from 'react';
import PageContainer from '@/components/layout/PageContainer';
import TodayWorkouts from '@/components/dashboard/TodayWorkouts';
import UpcomingWorkouts from '@/components/dashboard/UpcomingWorkouts';
import RecentWorkouts from '@/components/dashboard/RecentWorkouts';
import { Dumbbell, Sparkles, Zap, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <PageContainer>
      <div className="mb-16 text-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8 rounded-2xl shadow-md border border-indigo-100 animate-fade-in">
        <div className="inline-flex items-center justify-center p-6 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 shadow-glow text-white mb-8">
          <Dumbbell className="h-12 w-12" />
        </div>
        <h1 className="text-5xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600">Welcome to FitTrack</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto flex items-center justify-center mb-8">
          Track your workouts, monitor your progress
          <Zap className="h-5 w-5 mx-2 text-amber-400" />
          and achieve your fitness goals
          <Sparkles className="h-5 w-5 ml-2 text-indigo-400" />
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <Link to="/exercise-library">
            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 px-6 py-6">
              <Dumbbell className="mr-2 h-5 w-5" />
              Exercise Library
            </Button>
          </Link>
          <Link to="/workout/new">
            <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 px-6 py-6">
              <Rocket className="mr-2 h-5 w-5" />
              Create Workout
            </Button>
          </Link>
        </div>
      </div>

      <div className="space-y-12">
        <TodayWorkouts />
        <UpcomingWorkouts />
        <RecentWorkouts />
      </div>
    </PageContainer>
  );
};

export default Index;
