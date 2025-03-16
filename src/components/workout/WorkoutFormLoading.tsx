
import React from 'react';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const WorkoutFormLoading: React.FC = () => {
  return (
    <Card className="p-8">
      <div className="flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading workout data...</span>
      </div>
    </Card>
  );
};

export default WorkoutFormLoading;
