
import { useQuery } from '@tanstack/react-query';
import { getAllCategories } from '@/lib/categories';
import { Category } from '@/lib/types';
import { toast } from '@/components/ui/use-toast';

export const useCategoryData = () => {
  const {
    data: categories = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['categories'],
    queryFn: getAllCategories,
    retry: 2,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: true
  });
  
  // Create a map of category IDs to names for easy lookup
  const categoryMap: Record<string, string> = {};
  
  categories.forEach(category => {
    categoryMap[category.id] = category.name;
  });
  
  // Show error toast if categories loading fails and it's not the initial load
  if (error && !isLoading) {
    console.error('Error fetching categories:', error);
    toast({
      title: "Error",
      description: "Failed to load categories. Please try again.",
      variant: "destructive",
    });
  }
  
  return {
    categoryMap,
    categories,
    isLoading
  };
};
