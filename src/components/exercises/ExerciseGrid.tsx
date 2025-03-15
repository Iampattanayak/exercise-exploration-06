
import React from 'react';
import { Exercise } from '@/lib/types';
import ExerciseCard from './ExerciseCard';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getCategoryById } from '@/lib/data';

interface ExerciseGridProps {
  exercises: Exercise[];
  onExerciseSelect?: (exercise: Exercise) => void;
}

const ExerciseGrid: React.FC<ExerciseGridProps> = ({ exercises, onExerciseSelect }) => {
  const [selectedExercise, setSelectedExercise] = React.useState<Exercise | null>(null);

  const handleExerciseClick = (exercise: Exercise) => {
    if (onExerciseSelect) {
      onExerciseSelect(exercise);
    } else {
      setSelectedExercise(exercise);
    }
  };

  const handleDialogClose = () => {
    setSelectedExercise(null);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {exercises.map((exercise) => (
          <ExerciseCard 
            key={exercise.id} 
            exercise={exercise} 
            onClick={() => handleExerciseClick(exercise)}
          />
        ))}
      </div>

      <Dialog open={!!selectedExercise} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-3xl">
          {selectedExercise && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>{selectedExercise.name}</span>
                  {selectedExercise.category && (
                    <span className={cn(
                      'text-xs px-2 py-1 rounded-full',
                      getCategoryById(selectedExercise.category)?.color || 'bg-gray-100 text-gray-800'
                    )}>
                      {getCategoryById(selectedExercise.category)?.name || 'Uncategorized'}
                    </span>
                  )}
                </DialogTitle>
                <DialogDescription>
                  Exercise details and instructions
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="aspect-ratio-4/3 rounded-lg overflow-hidden bg-muted/30">
                  <img 
                    src={selectedExercise.imageUrl} 
                    alt={selectedExercise.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-muted-foreground mb-4">{selectedExercise.description}</p>
                  
                  <h4 className="font-medium mb-2">Instructions</h4>
                  <ol className="list-decimal pl-4 text-muted-foreground space-y-2">
                    {selectedExercise.description.split('. ').map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExerciseGrid;
