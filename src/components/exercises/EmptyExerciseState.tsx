
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Plus, Filter } from 'lucide-react';

interface EmptyExerciseStateProps {
  hasExercises: boolean;
  onAddExercise: () => void;
  onClearFilters?: () => void;
}

const EmptyExerciseState: React.FC<EmptyExerciseStateProps> = ({
  hasExercises,
  onAddExercise,
  onClearFilters,
}) => {
  return (
    <div className="text-center py-12 px-4 border border-dashed border-gray-200 rounded-lg bg-gray-50/50">
      <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium">No exercises found</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        {hasExercises
          ? "No exercises match your current filters. Try adjusting your search or category filters."
          : "Your exercise library is empty. Add your first exercise to get started with your fitness journey."}
      </p>
      {hasExercises ? (
        <Button variant="outline" onClick={onClearFilters}>
          <Filter className="h-4 w-4 mr-2" />
          Clear Filters
        </Button>
      ) : (
        <Button onClick={onAddExercise} className="animate-pulse">
          <Plus className="h-4 w-4 mr-2" />
          Add Your First Exercise
        </Button>
      )}
    </div>
  );
};

export default EmptyExerciseState;
