
import React, { useState, useEffect } from 'react';
import { Exercise } from '@/lib/types';
import { getCategoryById, getCategoryByIdSync } from '@/lib/categories';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem } from '@/components/ui/context-menu';
import { Edit, Trash, ImageOff, Sparkles } from 'lucide-react';

interface ExerciseCardProps {
  exercise: Exercise;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ 
  exercise, 
  onClick,
  onEdit,
  onDelete 
}) => {
  const [category, setCategory] = useState(getCategoryByIdSync(exercise.category));
  const [imageError, setImageError] = useState(false);
  
  useEffect(() => {
    const loadCategory = async () => {
      if (exercise.category) {
        const loadedCategory = await getCategoryById(exercise.category);
        if (loadedCategory) {
          setCategory(loadedCategory);
        }
      }
    };
    
    loadCategory();
  }, [exercise.category]);
  
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) onEdit();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) onDelete();
  };

  const handleImageError = () => {
    setImageError(true);
  };
  
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div 
          className="rounded-xl overflow-hidden bg-white border border-indigo-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.03] cursor-pointer relative group h-[280px] flex flex-col card-3d-effect"
          onClick={onClick}
        >
          <AspectRatio ratio={4 / 3} className="bg-gray-50">
            {!imageError && exercise.imageUrl ? (
              <img 
                src={exercise.imageUrl} 
                alt={exercise.name}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                onError={handleImageError}
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-indigo-50 to-purple-50">
                <ImageOff className="h-12 w-12 text-indigo-300 opacity-50" />
              </div>
            )}
            
            {/* Action buttons that appear on hover */}
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {onEdit && (
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="h-8 w-8 bg-white/90 hover:bg-white rounded-full shadow-md" 
                  onClick={handleEdit}
                >
                  <Edit className="h-4 w-4 text-indigo-600" />
                </Button>
              )}
              {onDelete && (
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="h-8 w-8 bg-white/90 hover:bg-red-500 rounded-full shadow-md" 
                  onClick={handleDelete}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              )}
            </div>
          </AspectRatio>
          <div className="p-4 flex-grow flex flex-col justify-between bg-gradient-to-b from-white to-indigo-50/30">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-lg truncate pr-2 flex items-center">
                {exercise.name}
                <Sparkles className="h-3 w-3 ml-1 text-indigo-400" />
              </h3>
              {category && (
                <span className={cn('text-xs px-2.5 py-1 rounded-full whitespace-nowrap shadow-sm', category.color)}>
                  {category.name}
                </span>
              )}
            </div>
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="rounded-xl border-indigo-100 shadow-lg">
        {onEdit && (
          <ContextMenuItem onClick={handleEdit} className="cursor-pointer focus:bg-indigo-50 focus:text-indigo-600">
            <Edit className="h-4 w-4 mr-2 text-indigo-500" />
            Edit Exercise
          </ContextMenuItem>
        )}
        {onDelete && (
          <ContextMenuItem onClick={handleDelete} className="cursor-pointer text-red-500 focus:bg-red-50 focus:text-red-600">
            <Trash className="h-4 w-4 mr-2" />
            Delete Exercise
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default ExerciseCard;
