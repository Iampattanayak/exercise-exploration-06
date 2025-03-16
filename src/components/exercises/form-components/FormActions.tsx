
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
    <div className="flex justify-end gap-4 pt-5">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel} 
        disabled={isSubmitting}
        className="px-5"
      >
        Cancel
      </Button>
      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="px-6 bg-primary"
      >
        {isSubmitting ? 'Saving...' : submitLabel}
      </Button>
    </div>
  );
};

export default FormActions;
