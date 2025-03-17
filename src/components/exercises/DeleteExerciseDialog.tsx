
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
import { Trash, AlertTriangle, X } from 'lucide-react';

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
          <div className="mx-auto bg-red-100 text-red-600 rounded-full p-3 mb-4">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <DialogTitle className="text-xl text-center mb-2">Delete Exercise</DialogTitle>
          <DialogDescription className="text-center">
            Are you sure you want to delete "{exercise?.name}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center gap-3 pt-4">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
            className="rounded-full border-gray-200 hover:bg-gray-50"
          >
            <X className="mr-2 h-4 w-4" /> 
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded-full"
          >
            {isDeleting ? (
              'Deleting...'
            ) : (
              <>
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteExerciseDialog;
