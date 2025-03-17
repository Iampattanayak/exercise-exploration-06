
import { useState, useCallback, useMemo, useEffect } from 'react';
import { Exercise } from '@/lib/types';
import { SortOrder } from '@/components/exercises/AlphabeticalFilter';

export function useExerciseFilters(exercises: Exercise[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  
  // Log when filters change to help with debugging
  useEffect(() => {
    console.log("Filters updated:", { 
      searchTerm, 
      selectedCategory, 
      sortOrder,
      exercisesCount: exercises?.length
    });
  }, [searchTerm, selectedCategory, sortOrder, exercises?.length]);
  
  // Filter exercises based on search term and selected category
  const filteredExercises = useMemo(() => {
    if (!exercises || exercises.length === 0) {
      return [];
    }
    
    console.log("Filtering exercises with:", {
      searchTerm,
      selectedCategory,
      exercises: exercises.length
    });
    
    // First, filter by search and category
    const filtered = exercises.filter((exercise: Exercise) => {
      const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory ? exercise.category === selectedCategory : true;
      
      return matchesSearch && matchesCategory;
    });
    
    console.log(`Filtered ${exercises.length} exercises to ${filtered.length} results`);
    
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
    console.log("Setting selected category to:", categoryId);
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
