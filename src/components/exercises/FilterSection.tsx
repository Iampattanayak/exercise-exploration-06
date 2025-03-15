
import React from 'react';
import SearchBar from '@/components/exercises/SearchBar';
import CategoryFilter from '@/components/exercises/CategoryFilter';
import { Category } from '@/lib/types';

interface FilterSectionProps {
  searchTerm: string;
  selectedCategory: string | null;
  categories: Category[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (categoryId: string | null) => void;
  onManageCategories: () => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  searchTerm,
  selectedCategory,
  categories,
  onSearchChange,
  onCategoryChange,
  onManageCategories,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <SearchBar 
          searchTerm={searchTerm} 
          onSearchChange={onSearchChange} 
        />
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
