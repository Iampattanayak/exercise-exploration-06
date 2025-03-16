
import React from 'react';
import { Button } from '@/components/ui/button';

interface FormActionsProps {
  onCancel: () => void;
  isSubmitting: boolean;
  submitLabel: string;
}

const FormActions: React.FC<FormActionsProps> = ({
  onCancel,
  isSubmitting,
  submitLabel
}) => {
  return (
    <div className="flex justify-end gap-3 pt-4 border-t mt-6">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel} 
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="px-6"
      >
        {isSubmitting ? 'Saving...' : submitLabel}
      </Button>
    </div>
  );
};

export default FormActions;
