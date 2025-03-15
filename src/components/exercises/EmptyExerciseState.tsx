
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Plus } from 'lucide-react';

interface EmptyExerciseStateProps {
  hasExercises: boolean;
  onAddExercise: () => void;
}

const EmptyExerciseState: React.FC<EmptyExerciseStateProps> = ({
  hasExercises,
  onAddExercise,
}) => {
  return (
    <div className="text-center py-12">
      <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium">No exercises found</h3>
      <p className="text-muted-foreground mb-4">
        {hasExercises
          ? "No exercises match your current filters."
          : "Your exercise library is empty. Add your first exercise to get started."}
      </p>
      {!hasExercises && (
        <Button onClick={onAddExercise}>
          <Plus className="h-4 w-4 mr-2" />
          Add Your First Exercise
        </Button>
      )}
    </div>
  );
};

export default EmptyExerciseState;
