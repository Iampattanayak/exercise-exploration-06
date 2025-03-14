
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
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';

interface EditExerciseDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  exercise: Exercise | null;
  categories: Category[];
  onSubmit: (exerciseData: Partial<Exercise>, uploadedImage: File | null) => Promise<boolean>;
  onDelete: () => void;
}

const EditExerciseDialog: React.FC<EditExerciseDialogProps> = ({
  isOpen,
  onOpenChange,
  exercise,
  categories,
  onSubmit,
  onDelete
}) => {
  const handleSubmit = async (exerciseData: Partial<Exercise>, uploadedImage: File | null) => {
    if (!exercise) return false;
    
    const success = await onSubmit(exerciseData, uploadedImage);
    if (success) {
      onOpenChange(false);
    }
    return success;
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleDelete = () => {
    onOpenChange(false);
    onDelete();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Exercise</DialogTitle>
          <DialogDescription>
            Update the details of this exercise
          </DialogDescription>
        </DialogHeader>
        {exercise && (
          <>
            <ExerciseForm 
              exercise={exercise}
              categories={categories}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              submitLabel="Save Changes"
            />
            <div className="flex justify-end mt-4">
              <Button 
                variant="destructive" 
                size="sm"
                onClick={handleDelete}
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete Exercise
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditExerciseDialog;
