
import React from 'react';
import { Exercise } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface ExerciseSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  availableExercises: Exercise[];
  isLoading: boolean;
  onExerciseAdd: (exercise: Exercise) => void;
  categoryMap: Record<string, string>;
}

const ExerciseSearch: React.FC<ExerciseSearchProps> = ({
  searchTerm,
  onSearchChange,
  availableExercises,
  isLoading,
  onExerciseAdd,
  categoryMap
}) => {
  const getCategoryName = (categoryId: string | undefined): string => {
    if (!categoryId) return "Uncategorized";
    return categoryMap[categoryId] || "Uncategorized";
  };

  return (
    <div className="sticky top-20">
      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium mb-3">Add Exercises</h3>
          <Input 
            placeholder="Search exercises..." 
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="mb-3 bg-white"
          />
          
          <div className="max-h-[500px] overflow-y-auto">
            {isLoading ? (
              <p className="text-center text-muted-foreground py-4">Loading exercises...</p>
            ) : availableExercises.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No exercises found</p>
            ) : (
              <div className="space-y-1">
                {availableExercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    className="flex items-center p-2 rounded-md hover:bg-muted/50 cursor-pointer"
                    onClick={() => onExerciseAdd(exercise)}
                  >
                    <div 
                      className="h-10 w-10 rounded bg-cover bg-center mr-3" 
                      style={{ backgroundImage: `url(${exercise.imageUrl})` }}
                    />
                    <div className="flex-1">
                      <p className="font-medium">{exercise.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{getCategoryName(exercise.category)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExerciseSearch;
