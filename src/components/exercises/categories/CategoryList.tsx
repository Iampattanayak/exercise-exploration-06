
import React from 'react';
import { Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Pencil, Trash } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryListProps {
  categories: Category[];
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: string) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  onEditCategory,
  onDeleteCategory,
}) => {
  if (categories.length === 0) {
    return (
      <div className="text-center py-8 border rounded-lg">
        <p className="text-muted-foreground">No categories found. Create your first category.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {categories.map((category) => {
        // Extract color classes directly
        const colorClasses = category.color || 'bg-[#8B5CF6] text-white';
        
        return (
          <div key={category.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className={cn('px-3 py-1.5 rounded-md text-sm shadow-sm', colorClasses)}>
                {category.name}
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onEditCategory(category)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onDeleteCategory(category.id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryList;
