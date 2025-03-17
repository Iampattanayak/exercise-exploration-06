
import React, { useEffect } from 'react';
import { Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCategoryColors } from '@/hooks/useCategoryColors';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
  onManageCategories?: () => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories: propCategories,
  selectedCategory,
  onCategoryChange,
  onManageCategories,
}) => {
  // Use the centralized hook for category colors
  const { categories, getCategoryColor, refreshCategories } = useCategoryColors();
  
  // Refresh categories when component mounts
  useEffect(() => {
    refreshCategories();
  }, [refreshCategories]);

  // Use categories from the hook, falling back to prop categories if needed
  const displayCategories = categories.length > 0 ? categories : propCategories;

  return (
    <div className="pb-4 overflow-x-auto">
      <div className="flex space-x-2 min-w-max">
        <Button
          variant={!selectedCategory ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(null)}
          className="rounded-full"
        >
          All Exercises
        </Button>
        {displayCategories.map((category) => {
          const isSelected = selectedCategory === category.id;
          
          // Get color from centralized hook
          const colorClasses = getCategoryColor(category.id);
          
          return (
            <Button
              key={category.id}
              variant="outline"
              size="sm"
              onClick={() => onCategoryChange(category.id)}
              className={cn(
                "rounded-full",
                isSelected && colorClasses // Only apply color when selected
              )}
            >
              {category.name}
            </Button>
          );
        })}
        {onManageCategories && (
          <Button
            variant="outline"
            size="sm"
            onClick={onManageCategories}
            className="rounded-full ml-2"
          >
            Manage Categories
          </Button>
        )}
      </div>
    </div>
  );
};

export default CategoryFilter;
