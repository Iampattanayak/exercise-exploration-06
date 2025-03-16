
import React from 'react';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

interface WorkoutBasicInfoFormProps {
  name: string;
  description: string;
  selectedDate: Date | undefined;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onDateChange: (date: Date | undefined) => void;
}

const WorkoutBasicInfoForm: React.FC<WorkoutBasicInfoFormProps> = ({
  name,
  description,
  selectedDate,
  onNameChange,
  onDescriptionChange,
  onDateChange
}) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Workout Name
            </label>
            <Input 
              id="name" 
              name="name" 
              value={name} 
              onChange={onNameChange} 
              placeholder="e.g., Chest & Triceps"
              className="bg-white"
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description (Optional)
            </label>
            <Textarea 
              id="description" 
              name="description" 
              value={description || ''} 
              onChange={onDescriptionChange} 
              placeholder="Brief description of this workout..."
              className="bg-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Workout Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-white",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? (
                    format(selectedDate, "EEEE, MMMM d, yyyy")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={onDateChange}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkoutBasicInfoForm;
