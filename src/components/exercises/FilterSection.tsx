
import React from 'react';
import SearchBar from '@/components/exercises/SearchBar';
import CategoryFilter from '@/components/exercises/CategoryFilter';
import AlphabeticalFilter, { SortOrder, SortType } from '@/components/exercises/AlphabeticalFilter';
import { Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface FilterSectionProps {
  searchTerm: string;
  selectedCategory: string | null;
  sortOrder: SortOrder;
  sortType: SortType;
  categories: Category[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (categoryId: string | null) => void;
  onSortChange: (order: SortOrder, type: SortType) => void;
  onManageCategories: () => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  searchTerm,
  selectedCategory,
  sortOrder,
  sortType,
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
    onSortChange(null, null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar 
          searchTerm={searchTerm} 
          onSearchChange={onSearchChange} 
        />
        <div className="flex items-center justify-end gap-2">
          <AlphabeticalFilter 
            sortOrder={sortOrder}
            sortType={sortType}
            onSortChange={onSortChange}
          />
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
              className="rounded-full whitespace-nowrap"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>
      <div>
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
