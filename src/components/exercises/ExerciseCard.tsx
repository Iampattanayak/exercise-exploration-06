
import React, { useState, useEffect } from 'react';
import { Exercise } from '@/lib/types';
import { getCategoryById, getCategoryByIdSync } from '@/lib/categories';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem } from '@/components/ui/context-menu';
import { Edit, Trash, ImageOff, Sparkles, Flame, Dumbbell } from 'lucide-react';

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
  const [isHovered, setIsHovered] = useState(false);
  
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
          className="rounded-xl overflow-hidden border border-indigo-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:scale-[1.03] cursor-pointer relative group h-[280px] flex flex-col card-3d-effect"
          onClick={onClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            background: isHovered 
              ? 'linear-gradient(to bottom right, rgba(255, 255, 255, 0.9), rgba(238, 242, 255, 0.8))' 
              : 'linear-gradient(to bottom right, rgba(255, 255, 255, 1), rgba(248, 250, 255, 0.9))'
          }}
        >
          <AspectRatio ratio={4 / 3} className="bg-gradient-to-br from-indigo-50/80 to-purple-50/80 relative overflow-hidden">
            {!imageError && exercise.imageUrl ? (
              <img 
                src={exercise.imageUrl} 
                alt={exercise.name}
                className="object-cover w-full h-full transition-all duration-500 group-hover:scale-110"
                onError={handleImageError}
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-indigo-50 to-purple-50/80">
                <Dumbbell className="h-12 w-12 text-indigo-300 opacity-60" />
              </div>
            )}
            
            {/* Glow overlay for hover */}
            <div className={cn(
              "absolute inset-0 bg-gradient-to-tr from-indigo-600/0 via-purple-500/0 to-pink-500/0 opacity-0 transition-opacity duration-500",
              isHovered && "opacity-30"
            )} />
            
            {/* Category badge repositioned for better visibility */}
            {category && (
              <div className="absolute top-3 right-3 z-10">
                <span className={cn(
                  'text-xs px-2.5 py-1 rounded-full whitespace-nowrap shadow-sm backdrop-blur-sm',
                  category.color,
                  "border border-white/20"
                )}>
                  {category.name}
                </span>
              </div>
            )}
            
            {/* Action buttons that appear on hover with improved styling */}
            <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
              {onEdit && (
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="h-8 w-8 bg-white/90 hover:bg-white rounded-full shadow-md backdrop-blur-sm" 
                  onClick={handleEdit}
                >
                  <Edit className="h-4 w-4 text-indigo-600" />
                </Button>
              )}
              {onDelete && (
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="h-8 w-8 bg-white/90 hover:bg-red-500 rounded-full shadow-md backdrop-blur-sm" 
                  onClick={handleDelete}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              )}
            </div>
          </AspectRatio>
          
          {/* Redesigned content area with better centering and effects */}
          <div className="p-5 flex-grow flex flex-col justify-between relative overflow-hidden">
            {/* Decorative icon */}
            <Flame className="absolute right-3 bottom-3 h-12 w-12 text-purple-100 rotate-12 opacity-50" />
            
            {/* Title with improved styling and icon */}
            <div className="flex items-center justify-between relative z-10">
              <h3 className="font-semibold text-lg truncate pr-2 text-gradient group-hover:scale-[1.02] transition-all duration-300 flex items-center gap-1.5">
                {exercise.name}
                <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              </h3>
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
