
import React, { useEffect, useState } from 'react';
import { Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';

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
  // Create local state to ensure we always use the latest category data with correct colors
  const [localCategories, setLocalCategories] = useState<Category[]>(categories);

  // Refresh categories from the database directly - bypass cache to ensure fresh colors
  useEffect(() => {
    const fetchFreshCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name');
        
        if (!error && data) {
          // Ensure all categories have valid colors
          const updatedCategories = data.map(cat => ({
            ...cat,
            color: cat.color || 'bg-[#8B5CF6] text-white' // Default color if none is set
          }));
          setLocalCategories(updatedCategories);
        }
      } catch (err) {
        console.error('Error fetching fresh categories:', err);
      }
    };

    fetchFreshCategories();
  }, []);

  // Update localCategories when category props change
  useEffect(() => {
    if (categories.length > 0) {
      setLocalCategories(categories);
    }
  }, [categories]);

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
        {localCategories.map((category) => {
          const isSelected = selectedCategory === category.id;
          
          // Extract color classes from the category color string
          const colorClasses = category.color || 'bg-[#8B5CF6] text-white';
          
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
