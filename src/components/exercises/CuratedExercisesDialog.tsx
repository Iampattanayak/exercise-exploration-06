
import React, { useState, useEffect } from 'react';
import { Exercise, Category } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { curatedExercises, mapCuratedExercisesToCategories, findExistingExercise } from '@/lib/curatedExercises';
import { toast } from 'sonner';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { cn } from '@/lib/utils';

interface CuratedExercisesDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  existingExercises: Exercise[];
  categories: Category[];
  onAddExercises: (exercises: Exercise[]) => Promise<boolean>;
}

const CuratedExercisesDialog: React.FC<CuratedExercisesDialogProps> = ({
  isOpen,
  onOpenChange,
  existingExercises,
  categories,
  onAddExercises
}) => {
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mappedExercises, setMappedExercises] = useState<Exercise[]>([]);
  
  // Create a map of category names to their UUIDs
  useEffect(() => {
    const categoryMap: Record<string, string> = {};
    
    // Map generic names to specific category IDs
    categories.forEach(category => {
      const name = category.name.toLowerCase();
      if (name.includes('chest')) categoryMap['chest'] = category.id;
      if (name.includes('back')) categoryMap['back'] = category.id;
      if (name.includes('leg')) categoryMap['legs'] = category.id;
      if (name.includes('shoulder')) categoryMap['shoulders'] = category.id;
      if (name.includes('arm')) categoryMap['arms'] = category.id;
      if (name.includes('core') || name.includes('ab')) categoryMap['core'] = category.id;
    });
    
    // Set default category to the first one if we don't have a mapping
    const defaultCategory = categories.length > 0 ? categories[0].id : '';
    
    const mapped = mapCuratedExercisesToCategories(categoryMap).map(exercise => ({
      ...exercise,
      category: categoryMap[exercise.category] || defaultCategory
    }));
    
    setMappedExercises(mapped);
  }, [categories]);

  // Find which exercises already exist
  const getExistingState = (exercise: Exercise) => {
    return !!findExistingExercise(existingExercises, exercise.name);
  };

  const handleToggleExercise = (id: string) => {
    setSelectedExercises(prev => 
      prev.includes(id) 
        ? prev.filter(exId => exId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const allIds = mappedExercises
      .filter(ex => !getExistingState(ex))
      .map(ex => ex.id);
    setSelectedExercises(allIds);
  };

  const handleDeselectAll = () => {
    setSelectedExercises([]);
  };

  const handleSubmit = async () => {
    if (selectedExercises.length === 0) {
      toast.error('Please select at least one exercise');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const exercisesToAdd = mappedExercises.filter(ex => 
        selectedExercises.includes(ex.id)
      );
      
      const success = await onAddExercises(exercisesToAdd);
      if (success) {
        toast.success(`Added ${exercisesToAdd.length} new exercises to your library`);
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error adding exercises:', error);
      toast.error('Failed to add exercises');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryById = (categoryId: string) => {
    return categories.find(c => c.id === categoryId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Add Curated Exercises</DialogTitle>
          <DialogDescription>
            Select from our curated list of exercises to add to your library
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-between mb-4">
          <div className="space-x-2">
            <Button variant="outline" size="sm" onClick={handleSelectAll}>
              Select All New
            </Button>
            <Button variant="outline" size="sm" onClick={handleDeselectAll}>
              Deselect All
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            {selectedExercises.length} selected
          </div>
        </div>
        
        <ScrollArea className="h-[400px] rounded-md border p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mappedExercises.map(exercise => {
              const isExisting = getExistingState(exercise);
              const category = getCategoryById(exercise.category);
              
              return (
                <div 
                  key={exercise.id}
                  className={cn(
                    "border rounded-md overflow-hidden", 
                    isExisting ? "opacity-50" : "",
                    selectedExercises.includes(exercise.id) ? "ring-2 ring-primary" : ""
                  )}
                >
                  <div className="flex">
                    <div className="w-1/3">
                      <AspectRatio ratio={1/1}>
                        <img 
                          src={exercise.imageUrl} 
                          alt={exercise.name}
                          className="object-cover w-full h-full"
                        />
                      </AspectRatio>
                    </div>
                    <div className="p-3 w-2/3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-medium">{exercise.name}</h4>
                          {category && (
                            <span className={cn("text-xs px-2 py-0.5 rounded-full", category.color)}>
                              {category.name}
                            </span>
                          )}
                        </div>
                        
                        {!isExisting && (
                          <Checkbox 
                            id={`check-${exercise.id}`}
                            checked={selectedExercises.includes(exercise.id)}
                            onCheckedChange={() => handleToggleExercise(exercise.id)}
                          />
                        )}
                      </div>
                      
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                        {exercise.description}
                      </p>
                      
                      {isExisting && (
                        <p className="text-xs text-yellow-600 mt-1">
                          Already in your library
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || selectedExercises.length === 0}
          >
            {isSubmitting ? 'Adding...' : `Add ${selectedExercises.length} Exercises`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CuratedExercisesDialog;
