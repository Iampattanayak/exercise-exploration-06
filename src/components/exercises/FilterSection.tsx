
import React from 'react';
import SearchBar from '@/components/exercises/SearchBar';
import CategoryFilter from '@/components/exercises/CategoryFilter';
import AlphabeticalFilter, { SortOrder } from '@/components/exercises/AlphabeticalFilter';
import { Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface FilterSectionProps {
  searchTerm: string;
  selectedCategory: string | null;
  sortOrder: SortOrder;
  categories: Category[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (categoryId: string | null) => void;
  onSortChange: (order: SortOrder) => void;
  onManageCategories: () => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  searchTerm,
  selectedCategory,
  sortOrder,
  categories,
  onSearchChange,
  onCategoryChange,
  onSortChange,
  onManageCategories,
}) => {
  const hasActiveFilters = searchTerm || selectedCategory || sortOrder;

  const handleClearFilters = () => {
    onSearchChange('');
    onCategoryChange(null);
    onSortChange(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <SearchBar 
            searchTerm={searchTerm} 
            onSearchChange={onSearchChange} 
          />
        </div>
        <div className="flex-none flex gap-2 items-center overflow-x-auto pb-2 md:pb-0">
          <AlphabeticalFilter 
            sortOrder={sortOrder}
            onSortChange={onSortChange}
          />
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
              className="rounded-full"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>
      <div className="flex-none">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
          onManageCategories={onManageCategories}
        />
      </div>
    </div>
  );
};

export default FilterSection;
