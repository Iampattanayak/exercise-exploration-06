
import React from 'react';
import { Exercise, WorkoutExercise, ExerciseSet, Category } from '@/lib/types';
import WorkoutBasicInfoForm from '@/components/workout/WorkoutBasicInfoForm';
import WorkoutExerciseList from '@/components/workout/WorkoutExerciseList';
import ExerciseSearch from '@/components/workout/ExerciseSearch';

interface WorkoutFormContentProps {
  workout: any;
  selectedDate: Date | undefined;
  availableExercises: Exercise[];
  searchTerm: string;
  categoryMap: Record<string, string>;
  categories: Category[];
  isLoading: boolean;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onDateChange: (date: Date | undefined) => void;
  onSearchChange: (value: string) => void;
  onExerciseAdd: (exercise: Exercise) => void;
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

const WorkoutFormContent: React.FC<WorkoutFormContentProps> = ({
  workout,
  selectedDate,
  availableExercises,
  searchTerm,
  categoryMap,
  categories,
  isLoading,
  onNameChange,
  onDescriptionChange,
  onDateChange,
  onSearchChange,
  onExerciseAdd,
  onRemoveExercise,
  onAddSet,
  onRemoveSet,
  onSetChange,
  onReorderExercises,
  onMoveExercise
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <WorkoutBasicInfoForm
          name={workout.name || ''}
          description={workout.description || ''}
          selectedDate={selectedDate}
          onNameChange={onNameChange}
          onDescriptionChange={onDescriptionChange}
          onDateChange={onDateChange}
        />
        
        <h3 className="font-medium text-lg mb-4">Exercises</h3>
        
        <WorkoutExerciseList
          exercises={workout.exercises || []}
          categoryMap={categoryMap}
          onRemoveExercise={onRemoveExercise}
          onAddSet={onAddSet}
          onRemoveSet={onRemoveSet}
          onSetChange={onSetChange}
          onReorderExercises={onReorderExercises}
          onMoveExercise={onMoveExercise}
        />
      </div>
      
      <div>
        <ExerciseSearch
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          availableExercises={availableExercises}
          categories={categories}
          isLoading={isLoading}
          onExerciseAdd={onExerciseAdd}
          categoryMap={categoryMap}
        />
      </div>
    </div>
  );
};

export default WorkoutFormContent;
