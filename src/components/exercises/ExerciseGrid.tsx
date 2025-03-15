
import React, { useState, useEffect } from 'react';
import { Exercise, Category } from '@/lib/types';
import ExerciseCard from './ExerciseCard';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getCategoryById, getCategoryByIdSync } from '@/lib/categories';
import { cn } from '@/lib/utils';

interface ExerciseGridProps {
  exercises: Exercise[];
  categories?: Category[];
  isLoading?: boolean;
  onEdit?: (exercise: Exercise) => void;
  onDelete?: (exercise: Exercise) => void;
  onExerciseSelect?: (exercise: Exercise) => void;
}

const ExerciseGrid: React.FC<ExerciseGridProps> = ({ 
  exercises, 
  categories = [],
  isLoading = false,
  onEdit,
  onDelete,
  onExerciseSelect 
}) => {
  const [selectedExercise, setSelectedExercise] = React.useState<Exercise | null>(null);
  const [selectedCategory, setSelectedCategory] = React.useState<Category | null>(null);

  const handleExerciseClick = (exercise: Exercise) => {
    if (onExerciseSelect) {
      onExerciseSelect(exercise);
    } else {
      setSelectedExercise(exercise);
    }
  };

  const handleDialogClose = () => {
    setSelectedExercise(null);
    setSelectedCategory(null);
  };
  
  useEffect(() => {
    const loadCategory = async () => {
      if (selectedExercise?.category) {
        // First check if we already have the category in our categories prop
        if (categories.length > 0) {
          const category = categories.find(c => c.id === selectedExercise.category);
          if (category) {
            setSelectedCategory(category);
            return;
          }
        }
        
        // If not found in props, load from API
        const loadedCategory = await getCategoryById(selectedExercise.category);
        if (loadedCategory) {
          setSelectedCategory(loadedCategory);
        }
      }
    };
    
    if (selectedExercise) {
      loadCategory();
    }
  }, [selectedExercise, categories]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div 
            key={index} 
            className="bg-muted/30 rounded-lg h-60 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (exercises.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <p className="text-muted-foreground">No exercises found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {exercises.map((exercise) => (
          <ExerciseCard 
            key={exercise.id} 
            exercise={exercise} 
            onClick={() => handleExerciseClick(exercise)}
            onEdit={onEdit ? () => onEdit(exercise) : undefined}
            onDelete={onDelete ? () => onDelete(exercise) : undefined}
          />
        ))}
      </div>

      <Dialog open={!!selectedExercise} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-3xl">
          {selectedExercise && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>{selectedExercise.name}</span>
                  {selectedCategory && (
                    <span className={cn(
                      'text-xs px-2 py-1 rounded-full',
                      selectedCategory.color
                    )}>
                      {selectedCategory.name}
                    </span>
                  )}
                </DialogTitle>
                <DialogDescription>
                  Exercise details and instructions
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="aspect-ratio-4/3 rounded-lg overflow-hidden bg-muted/30">
                  <img 
                    src={selectedExercise.imageUrl} 
                    alt={selectedExercise.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-muted-foreground mb-4">{selectedExercise.description}</p>
                  
                  <h4 className="font-medium mb-2">Instructions</h4>
                  <ol className="list-decimal pl-4 text-muted-foreground space-y-2">
                    {selectedExercise.description.split('. ').map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExerciseGrid;
