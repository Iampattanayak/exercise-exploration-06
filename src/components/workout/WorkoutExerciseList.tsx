
import React from 'react';
import { Workout, WorkoutExercise, ExerciseSet } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';
import ExerciseSetForm from './ExerciseSetForm';

interface WorkoutExerciseListProps {
  exercises: WorkoutExercise[];
  categoryMap: Record<string, string>;
  onRemoveExercise: (exerciseId: string) => void;
  onAddSet: (exerciseIndex: number) => void;
  onRemoveSet: (exerciseIndex: number, setIndex: number) => void;
  onSetChange: (
    exerciseIndex: number,
    setIndex: number,
    field: keyof ExerciseSet,
    value: any
  ) => void;
}

const WorkoutExerciseList: React.FC<WorkoutExerciseListProps> = ({
  exercises,
  categoryMap,
  onRemoveExercise,
  onAddSet,
  onRemoveSet,
  onSetChange
}) => {
  const getCategoryName = (categoryId: string | undefined): string => {
    if (!categoryId) return "Uncategorized";
    return categoryMap[categoryId] || "Uncategorized";
  };

  if (exercises.length === 0) {
    return (
      <Card className="mb-6">
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground mb-4">No exercises added yet. Search and add exercises from the panel on the right.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 mb-6">
      {exercises.map((exerciseItem, exerciseIndex) => (
        <Card key={exerciseItem.id} className="overflow-hidden">
          <div className="bg-muted/30 p-4 flex items-center justify-between">
            <div className="flex items-center">
              <div 
                className="h-10 w-10 rounded bg-cover bg-center mr-3" 
                style={{ backgroundImage: `url(${exerciseItem.exercise.imageUrl})` }}
              />
              <div>
                <h4 className="font-medium">{exerciseItem.exercise.name}</h4>
                <p className="text-xs text-muted-foreground">{getCategoryName(exerciseItem.exercise.category)}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onRemoveExercise(exerciseItem.exerciseId)}
            >
              <Trash2 className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
          
          <CardContent className="p-4">
            <div className="grid grid-cols-12 gap-2 mb-2 text-sm font-medium">
              <div className="col-span-1">Set</div>
              <div className="col-span-5">Weight</div>
              <div className="col-span-5">Reps</div>
              <div className="col-span-1"></div>
            </div>
            
            {exerciseItem.sets.map((set, setIndex) => (
              <ExerciseSetForm
                key={set.id}
                set={set}
                onWeightChange={(value) => onSetChange(exerciseIndex, setIndex, 'weight', value)}
                onRepsChange={(value) => onSetChange(exerciseIndex, setIndex, 'targetReps', value)}
                onRemove={() => onRemoveSet(exerciseIndex, setIndex)}
                canRemove={exerciseItem.sets.length > 1}
              />
            ))}
            
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2 w-full"
              onClick={() => onAddSet(exerciseIndex)}
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Set
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default WorkoutExerciseList;
