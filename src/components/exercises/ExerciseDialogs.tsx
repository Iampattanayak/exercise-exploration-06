
import React from 'react';
import { Exercise, Category } from '@/lib/types';
import AddExerciseDialog from './AddExerciseDialog';
import EditExerciseDialog from './EditExerciseDialog';
import DeleteExerciseDialog from './DeleteExerciseDialog';
import CuratedExercisesDialog from './CuratedExercisesDialog';

interface ExerciseDialogsProps {
  isAddExerciseOpen: boolean;
  isEditExerciseOpen: boolean;
  isDeleteExerciseOpen: boolean;
  isCuratedExercisesOpen: boolean;
  selectedExercise: Exercise | null;
  exercises: Exercise[];
  categories: Category[];
  onAddExerciseOpenChange: (open: boolean) => void;
  onEditExerciseOpenChange: (open: boolean) => void;
  onDeleteExerciseOpenChange: (open: boolean) => void;
  onCuratedExercisesOpenChange: (open: boolean) => void;
  onCreateExercise: (exerciseData: Partial<Exercise>, uploadedImage: File | null) => Promise<boolean>;
  onUpdateExercise: (exerciseData: Partial<Exercise>, uploadedImage: File | null) => Promise<boolean>;
  onDeleteExercise: () => Promise<boolean>;
  onCreateMultipleExercises: (exercises: Exercise[]) => Promise<boolean>;
}

const ExerciseDialogs: React.FC<ExerciseDialogsProps> = ({
  isAddExerciseOpen,
  isEditExerciseOpen,
  isDeleteExerciseOpen,
  isCuratedExercisesOpen,
  selectedExercise,
  exercises,
  categories,
  onAddExerciseOpenChange,
  onEditExerciseOpenChange,
  onDeleteExerciseOpenChange,
  onCuratedExercisesOpenChange,
  onCreateExercise,
  onUpdateExercise,
  onDeleteExercise,
  onCreateMultipleExercises,
}) => {
  return (
    <>
      <AddExerciseDialog
        isOpen={isAddExerciseOpen}
        onOpenChange={onAddExerciseOpenChange}
        categories={categories}
        onSubmit={onCreateExercise}
      />

      <EditExerciseDialog
        isOpen={isEditExerciseOpen}
        onOpenChange={onEditExerciseOpenChange}
        exercise={selectedExercise}
        categories={categories}
        onSubmit={onUpdateExercise}
        onDelete={() => {
          onEditExerciseOpenChange(false);
          onDeleteExerciseOpenChange(true);
        }}
      />

      <DeleteExerciseDialog
        isOpen={isDeleteExerciseOpen}
        onOpenChange={onDeleteExerciseOpenChange}
        exercise={selectedExercise}
        onDelete={onDeleteExercise}
      />

      <CuratedExercisesDialog
        isOpen={isCuratedExercisesOpen}
        onOpenChange={onCuratedExercisesOpenChange}
        existingExercises={exercises}
        categories={categories}
        onAddExercises={onCreateMultipleExercises}
      />
    </>
  );
};

export default ExerciseDialogs;
