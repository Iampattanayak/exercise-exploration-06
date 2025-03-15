
import { useState, useCallback } from 'react';
import { Exercise } from '@/lib/types';

export function useExerciseFilters(exercises: Exercise[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Filter exercises based on search term and selected category
  const filteredExercises = exercises.filter((exercise: Exercise) => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? exercise.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const handleCategoryChange = useCallback((categoryId: string | null) => {
    setSelectedCategory(categoryId);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  return {
    searchTerm,
    selectedCategory,
    filteredExercises,
    handleSearchChange,
    handleCategoryChange
  };
}
