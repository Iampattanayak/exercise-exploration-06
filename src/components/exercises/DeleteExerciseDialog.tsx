
import React from 'react';
import { Exercise } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface DeleteExerciseDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  exercise: Exercise | null;
  onDelete: () => Promise<boolean>;
}

const DeleteExerciseDialog: React.FC<DeleteExerciseDialogProps> = ({
  isOpen,
  onOpenChange,
  exercise,
  onDelete
}) => {
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    if (!exercise) return;
    
    setIsDeleting(true);
    try {
      const success = await onDelete();
      if (success) {
        onOpenChange(false);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Delete Exercise</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{exercise?.name}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 pt-4">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteExerciseDialog;
