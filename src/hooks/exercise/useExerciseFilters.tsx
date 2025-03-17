
import { useState, useCallback, useMemo, useEffect } from 'react';
import { Exercise, Category } from '@/lib/types';
import { SortOrder, SortType } from '@/components/exercises/AlphabeticalFilter';

export function useExerciseFilters(exercises: Exercise[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [sortType, setSortType] = useState<SortType>(null);
  
  // Log when filters change to help with debugging
  useEffect(() => {
    console.log("Filters updated:", { 
      searchTerm, 
      selectedCategory, 
      sortOrder,
      sortType,
      exercisesCount: exercises?.length
    });
  }, [searchTerm, selectedCategory, sortOrder, sortType, exercises?.length]);
  
  // Filter exercises based on search term and selected category
  const filteredExercises = useMemo(() => {
    if (!exercises || exercises.length === 0) {
      return [];
    }
    
    console.log("Filtering exercises with:", {
      searchTerm,
      selectedCategory,
      sortOrder,
      sortType,
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
    if (sortOrder && sortType) {
      return [...filtered].sort((a, b) => {
        if (sortType === 'name') {
          const nameA = a.name.toLowerCase();
          const nameB = b.name.toLowerCase();
          
          if (sortOrder === 'asc') {
            return nameA.localeCompare(nameB);
          } else {
            return nameB.localeCompare(nameA);
          }
        } else if (sortType === 'category') {
          // Get category IDs for sorting since we don't have categoryName
          const categoryA = a.category?.toLowerCase() || '';
          const categoryB = b.category?.toLowerCase() || '';
          
          if (sortOrder === 'asc') {
            return categoryA.localeCompare(categoryB);
          } else {
            return categoryB.localeCompare(categoryA);
          }
        }
        
        return 0;
      });
    }
    
    return filtered;
  }, [exercises, searchTerm, selectedCategory, sortOrder, sortType]);

  const handleCategoryChange = useCallback((categoryId: string | null) => {
    console.log("Setting selected category to:", categoryId);
    setSelectedCategory(categoryId);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);
  
  const handleSortChange = useCallback((order: SortOrder, type: SortType) => {
    console.log("Setting sort to:", { order, type });
    setSortOrder(order);
    setSortType(type);
  }, []);

  return {
    searchTerm,
    selectedCategory,
    sortOrder,
    sortType,
    filteredExercises,
    handleSearchChange,
    handleCategoryChange,
    handleSortChange
  };
}
