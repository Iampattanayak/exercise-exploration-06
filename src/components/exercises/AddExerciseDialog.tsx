
import React from 'react';
import { Exercise, Category } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import ExerciseForm from './ExerciseForm';

interface AddExerciseDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  onSubmit: (exerciseData: Partial<Exercise>, uploadedImage: File | null) => Promise<boolean>;
}

const AddExerciseDialog: React.FC<AddExerciseDialogProps> = ({
  isOpen,
  onOpenChange,
  categories,
  onSubmit
}) => {
  const handleSubmit = async (exerciseData: Partial<Exercise>, uploadedImage: File | null) => {
    const success = await onSubmit(exerciseData, uploadedImage);
    if (success) {
      onOpenChange(false);
    }
    return success;
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Exercise</DialogTitle>
          <DialogDescription>
            Create a new exercise to add to your library
          </DialogDescription>
        </DialogHeader>
        <ExerciseForm 
          categories={categories}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitLabel="Add Exercise"
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddExerciseDialog;
