
import React from 'react';
import { Exercise, Category } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import ExerciseForm from './ExerciseForm';
import { Button } from '@/components/ui/button';
import { Trash, Sparkles } from 'lucide-react';

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
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b mb-4">
          <DialogTitle className="text-xl font-bold flex items-center justify-center">
            Edit Exercise 
            <Sparkles className="h-4 w-4 ml-2 text-indigo-400" />
          </DialogTitle>
          <DialogDescription className="mt-1 text-sm text-center">
            Update the details and image of this exercise
          </DialogDescription>
        </DialogHeader>
        {exercise && (
          <>
            <div className="py-2">
              <ExerciseForm 
                exercise={exercise}
                categories={categories}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                submitLabel="Save Changes"
                showDeleteButton={true}
                onDelete={handleDelete}
              />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditExerciseDialog;
