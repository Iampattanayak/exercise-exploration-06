
import { useState, useCallback, useMemo } from 'react';
import { Exercise } from '@/lib/types';
import { SortOrder } from '@/components/exercises/AlphabeticalFilter';

export function useExerciseFilters(exercises: Exercise[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  
  // Filter exercises based on search term and selected category
  const filteredExercises = useMemo(() => {
    // First, filter by search and category
    const filtered = exercises.filter((exercise: Exercise) => {
      const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory ? exercise.category === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
    
    // Then, sort if a sort order is specified
    if (sortOrder) {
      return [...filtered].sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        
        if (sortOrder === 'asc') {
          return nameA.localeCompare(nameB);
        } else {
          return nameB.localeCompare(nameA);
        }
      });
    }
    
    return filtered;
  }, [exercises, searchTerm, selectedCategory, sortOrder]);

  const handleCategoryChange = useCallback((categoryId: string | null) => {
    setSelectedCategory(categoryId);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);
  
  const handleSortChange = useCallback((order: SortOrder) => {
    setSortOrder(order);
  }, []);

  return {
    searchTerm,
    selectedCategory,
    sortOrder,
    filteredExercises,
    handleSearchChange,
    handleCategoryChange,
    handleSortChange
  };
}
