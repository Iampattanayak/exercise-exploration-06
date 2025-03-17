
import React from 'react';
import { Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
  onManageCategories?: () => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  onManageCategories,
}) => {
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
        {categories.map((category) => (
          <Button
            key={category.id}
            variant="outline"
            size="sm"
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              "rounded-full",
              selectedCategory === category.id && category.color
            )}
          >
            {category.name}
          </Button>
        ))}
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
