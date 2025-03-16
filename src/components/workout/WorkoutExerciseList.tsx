
import React from 'react';
import { WorkoutExercise, ExerciseSet } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableExerciseItem from './SortableExerciseItem';

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
  onReorderExercises: (activeId: string, overId: string) => void;
  onMoveExercise: (exerciseIndex: number, direction: 'up' | 'down') => void;
}

const WorkoutExerciseList: React.FC<WorkoutExerciseListProps> = ({
  exercises,
  categoryMap,
  onRemoveExercise,
  onAddSet,
  onRemoveSet,
  onSetChange,
  onReorderExercises,
  onMoveExercise
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      onReorderExercises(active.id as string, over.id as string);
    }
  }

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
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={exercises.map(ex => ex.id)}
        strategy={verticalListSortingStrategy}
      >
        <div>
          {exercises.map((exerciseItem, exerciseIndex) => (
            <SortableExerciseItem
              key={exerciseItem.id}
              exerciseItem={exerciseItem}
              exerciseIndex={exerciseIndex}
              categoryMap={categoryMap}
              onRemoveExercise={onRemoveExercise}
              onAddSet={onAddSet}
              onRemoveSet={onRemoveSet}
              onSetChange={onSetChange}
              onMoveExercise={onMoveExercise}
              isFirst={exerciseIndex === 0}
              isLast={exerciseIndex === exercises.length - 1}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default WorkoutExerciseList;
