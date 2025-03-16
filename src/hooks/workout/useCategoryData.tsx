
import { useState, useEffect } from 'react';
import { Category } from '@/lib/types';
import { getAllCategories } from '@/lib/data';
import { toast } from '@/components/ui/use-toast';

export const useCategoryData = () => {
  const [categoryMap, setCategoryMap] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<Category[]>([]);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getAllCategories();
        
        const catMap: Record<string, string> = {};
        categoriesData.forEach(category => {
          catMap[category.id] = category.name;
        });
        
        setCategoryMap(catMap);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast({
          title: "Error",
          description: "Failed to load categories. Please try again.",
          variant: "destructive",
        });
      }
    };
    
    fetchCategories();
  }, []);
  
  return {
    categoryMap,
    categories
  };
};
