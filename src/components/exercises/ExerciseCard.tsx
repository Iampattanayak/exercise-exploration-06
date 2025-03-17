
import React, { useState, useEffect } from 'react';
import { Exercise } from '@/lib/types';
import { getCategoryById, getCategoryByIdSync } from '@/lib/categories';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem } from '@/components/ui/context-menu';
import { Edit, Trash, ImageOff, Dumbbell } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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
  // Force refresh of category data on component mount to get latest colors
  const [category, setCategory] = useState<any>(null);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  useEffect(() => {
    const loadCategory = async () => {
      if (exercise.category) {
        try {
          // Always get fresh data directly from Supabase to ensure we have the latest colors
          const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('id', exercise.category)
            .maybeSingle();
            
          if (data && !error) {
            setCategory({
              id: data.id,
              name: data.name,
              color: data.color || 'bg-[#8B5CF6] text-white' // Ensure default if not set
            });
          } else {
            // Fallback to the sync method if direct query fails
            const syncCategory = getCategoryByIdSync(exercise.category);
            setCategory(syncCategory);
          }
        } catch (err) {
          console.error("Error loading category data:", err);
          // Fallback to sync method on error
          const syncCategory = getCategoryByIdSync(exercise.category);
          setCategory(syncCategory);
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
          className="overflow-hidden border border-stone-200 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] cursor-pointer relative rounded-xl h-[280px] flex flex-col bg-white"
          onClick={onClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <AspectRatio ratio={4/3} className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-stone-100">
            {!imageError && exercise.imageUrl ? (
              <img 
                src={exercise.imageUrl} 
                alt={exercise.name}
                className="object-cover w-full h-full transition-all duration-300 group-hover:scale-105"
                onError={handleImageError}
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full">
                <Dumbbell className="h-12 w-12 text-gray-300" />
              </div>
            )}
            
            <div className={cn(
              "absolute inset-0 bg-black/0 transition-all duration-300",
              isHovered && "bg-black/20"
            )} />

            {category && (
              <div className="absolute bottom-3 left-3 z-10">
                <span className={cn(
                  'text-xs font-medium px-3 py-1.5 rounded-md shadow-sm',
                  category.color // Apply the category color directly from our fresh state
                )}>
                  {category.name}
                </span>
              </div>
            )}
            
            <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 transition-opacity duration-300" 
                 style={{ opacity: isHovered ? 1 : 0 }}>
              {onEdit && (
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="h-8 w-8 bg-white rounded-full shadow-md" 
                  onClick={handleEdit}
                >
                  <Edit className="h-4 w-4 text-gray-700" />
                </Button>
              )}
              {onDelete && (
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="h-8 w-8 bg-white hover:bg-red-500 rounded-full shadow-md" 
                  onClick={handleDelete}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              )}
            </div>
          </AspectRatio>
          
          <div className="p-4 flex flex-col items-center justify-center text-center">
            <h3 className="font-medium text-gray-900 text-base">{exercise.name}</h3>
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        {onEdit && (
          <ContextMenuItem onClick={handleEdit} className="cursor-pointer">
            <Edit className="h-4 w-4 mr-2" />
            Edit Exercise
          </ContextMenuItem>
        )}
        {onDelete && (
          <ContextMenuItem onClick={handleDelete} className="cursor-pointer text-red-500">
            <Trash className="h-4 w-4 mr-2" />
            Delete Exercise
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default ExerciseCard;
