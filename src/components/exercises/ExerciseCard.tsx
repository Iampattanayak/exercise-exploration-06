
import React from 'react';
import { Exercise } from '@/lib/types';
import { getCategoryById } from '@/lib/data';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { cn } from '@/lib/utils';

interface ExerciseCardProps {
  exercise: Exercise;
  onClick?: () => void;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onClick }) => {
  const category = getCategoryById(exercise.category);
  
  return (
    <div 
      className="rounded-lg overflow-hidden bg-white border shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] cursor-pointer"
      onClick={onClick}
    >
      <AspectRatio ratio={1 / 1} className="bg-muted/30">
        <img 
          src={exercise.imageUrl} 
          alt={exercise.name}
          className="object-cover w-full h-full transition-transform duration-300"
        />
      </AspectRatio>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-medium">{exercise.name}</h3>
          {category && (
            <span className={cn('text-xs px-2 py-1 rounded-full', category.color)}>
              {category.name}
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {exercise.description}
        </p>
      </div>
    </div>
  );
};

export default ExerciseCard;
