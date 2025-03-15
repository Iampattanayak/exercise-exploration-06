
import React from 'react';
import { Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Pencil, Trash } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryItemProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border">
      <div className="flex items-center space-x-3">
        <div className={cn('px-3 py-1 rounded-full text-sm', category.color)}>
          {category.name}
        </div>
      </div>
      <div className="flex space-x-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => onEdit(category)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => onDelete(category.id)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CategoryItem;
