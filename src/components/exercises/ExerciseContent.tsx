
import React from 'react';
import { Exercise, Category } from '@/lib/types';
import FilterSection from './FilterSection';
import ExerciseGrid from './ExerciseGrid';
import EmptyExerciseState from './EmptyExerciseState';
import { Card } from '@/components/ui/card';
import { SortOrder, SortType } from './AlphabeticalFilter';

interface ExerciseContentProps {
  exercises: Exercise[];
  filteredExercises: Exercise[];
  categories: Category[];
  isLoading: boolean;
  searchTerm: string;
  selectedCategory: string | null;
  sortOrder: SortOrder;
  sortType: SortType;
  onSearchChange: (value: string) => void;
  onCategoryChange: (categoryId: string | null) => void;
  onSortChange: (order: SortOrder, type: SortType) => void;
  onManageCategories: () => void;
  onOpenAddExercise: () => void;
  onEditExercise: (exercise: Exercise) => void;
  onDeleteExercise: (exercise: Exercise) => void;
  onClearFilters: () => void;
}

const ExerciseContent: React.FC<ExerciseContentProps> = ({
  exercises,
  filteredExercises,
  categories,
  isLoading,
  searchTerm,
  selectedCategory,
  sortOrder,
  sortType,
  onSearchChange,
  onCategoryChange,
  onSortChange,
  onManageCategories,
  onOpenAddExercise,
  onEditExercise,
  onDeleteExercise,
  onClearFilters
}) => {
  return (
    <div className="flex flex-col space-y-6 pb-10 animate-in fade-in duration-500">
      <FilterSection 
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        sortOrder={sortOrder}
        sortType={sortType}
        categories={categories}
        onSearchChange={onSearchChange}
        onCategoryChange={onCategoryChange}
        onSortChange={onSortChange}
        onManageCategories={onManageCategories}
      />

      <Card className="bg-gradient-to-br from-white/80 via-white/60 to-indigo-50/30 backdrop-blur-sm border border-indigo-100/50 p-6 pt-7 rounded-xl shadow-sm overflow-hidden">
        <ExerciseGrid 
          exercises={filteredExercises} 
          categories={categories}
          isLoading={isLoading}
          onEdit={onEditExercise}
          onDelete={onDeleteExercise}
        />
        
        {filteredExercises.length === 0 && !isLoading && (
          <EmptyExerciseState 
            hasExercises={exercises.length > 0}
            onAddExercise={onOpenAddExercise}
            onClearFilters={onClearFilters}
          />
        )}
      </Card>
    </div>
  );
};

export default ExerciseContent;
