
import React from 'react';
import { ExerciseSet } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ExerciseSetFormProps {
  set: ExerciseSet;
  onWeightChange: (weight: string) => void;
  onRepsChange: (reps: string) => void;
  onRemove: () => void;
  canRemove: boolean;
}

const ExerciseSetForm: React.FC<ExerciseSetFormProps> = ({
  set,
  onWeightChange,
  onRepsChange,
  onRemove,
  canRemove
}) => {
  return (
    <div className="grid grid-cols-12 gap-2 mb-3 items-center">
      <div className="col-span-1 text-center">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-muted text-sm">
          {set.setNumber}
        </span>
      </div>
      <div className="col-span-5">
        <div className="flex items-center">
          <Input 
            type="number" 
            value={set.weight || ''} 
            onChange={(e) => onWeightChange(e.target.value)} 
            className="h-9 bg-white" 
          />
          <span className="ml-2 text-sm text-muted-foreground">kg</span>
        </div>
      </div>
      <div className="col-span-5">
        <div className="flex items-center">
          <Input 
            type="number" 
            value={set.targetReps} 
            onChange={(e) => onRepsChange(e.target.value)} 
            className="h-9 bg-white" 
          />
          <span className="ml-2 text-sm text-muted-foreground">reps</span>
        </div>
      </div>
      <div className="col-span-1 flex justify-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-7 w-7"
          onClick={onRemove}
          disabled={!canRemove}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export default ExerciseSetForm;
