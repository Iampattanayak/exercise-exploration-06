
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, GripVertical, ArrowUp, ArrowDown } from 'lucide-react';
import { WorkoutExercise, ExerciseSet } from '@/lib/types';
import ExerciseSetForm from './ExerciseSetForm';

interface SortableExerciseItemProps {
  exerciseItem: WorkoutExercise;
  exerciseIndex: number;
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
  onMoveExercise: (exerciseIndex: number, direction: 'up' | 'down') => void;
  isFirst: boolean;
  isLast: boolean;
}

const SortableExerciseItem: React.FC<SortableExerciseItemProps> = ({
  exerciseItem,
  exerciseIndex,
  categoryMap,
  onRemoveExercise,
  onAddSet,
  onRemoveSet,
  onSetChange,
  onMoveExercise,
  isFirst,
  isLast
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: exerciseItem.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  const getCategoryName = (categoryId: string | undefined): string => {
    if (!categoryId) return "Uncategorized";
    return categoryMap[categoryId] || "Uncategorized";
  };

  return (
    <Card 
      ref={setNodeRef} 
      style={style} 
      className={`overflow-hidden mb-6 ${isDragging ? 'border-primary' : ''}`}
    >
      <div className="bg-muted/30 p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="cursor-grab mr-1" 
            {...attributes} 
            {...listeners}
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </Button>
          <div 
            className="h-10 w-10 rounded bg-cover bg-center mr-3" 
            style={{ backgroundImage: `url(${exerciseItem.exercise.imageUrl})` }}
          />
          <div>
            <h4 className="font-medium">{exerciseItem.exercise.name}</h4>
            <p className="text-xs text-muted-foreground">{getCategoryName(exerciseItem.exercise.category)}</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Button 
            variant="ghost" 
            size="icon" 
            disabled={isFirst}
            onClick={() => onMoveExercise(exerciseIndex, 'up')}
          >
            <ArrowUp className="h-4 w-4 text-muted-foreground" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            disabled={isLast}
            onClick={() => onMoveExercise(exerciseIndex, 'down')}
          >
            <ArrowDown className="h-4 w-4 text-muted-foreground" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onRemoveExercise(exerciseItem.exerciseId)}
          >
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
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
  );
};

export default SortableExerciseItem;
