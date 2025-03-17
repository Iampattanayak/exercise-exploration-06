
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
  
  // Refresh categories when component mounts or when propCategories changes
  useEffect(() => {
    refreshCategories();
    console.log("CategoryFilter refreshed with categories:", propCategories);
  }, [refreshCategories, propCategories]);

  // Use categories from the hook, falling back to prop categories if needed
  const displayCategories = categories.length > 0 ? categories : propCategories;

  return (
    <div className="overflow-x-auto py-2">
      <div className="flex space-x-2 min-w-max">
        <Button
          variant={!selectedCategory ? "default" : "outline"}
          size="sm"
          onClick={() => {
            console.log("All Exercises clicked, setting category to null");
            onCategoryChange(null);
          }}
          className="rounded-full"
        >
          All Exercises
        </Button>
        
        {displayCategories.map((category) => {
          const isSelected = selectedCategory === category.id;
          const colorClasses = getCategoryColor(category.id);
          
          return (
            <Button
              key={category.id}
              variant="outline"
              size="sm"
              onClick={() => {
                console.log(`Category ${category.name} clicked, setting to:`, category.id);
                onCategoryChange(category.id);
              }}
              className={cn(
                "rounded-full",
                isSelected && colorClasses
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
