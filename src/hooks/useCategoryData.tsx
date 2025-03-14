
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addCategory, updateCategory, deleteCategory } from '@/lib/data';
import { Category } from '@/lib/types';
import { toast } from 'sonner';

export function useCategoryData() {
  const queryClient = useQueryClient();

  const addCategoryMutation = useMutation({
    mutationFn: addCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category added successfully');
    },
    onError: (error) => {
      toast.error(`Failed to add category: ${error.message}`);
    }
  });

  const updateCategoryMutation = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update category: ${error.message}`);
    }
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete category: ${error.message}`);
    }
  });

  const handleAddCategory = async (category: Category): Promise<boolean> => {
    try {
      await addCategoryMutation.mutateAsync(category);
      return true;
    } catch (error) {
      console.error('Error adding category:', error);
      return false;
    }
  };
  
  const handleUpdateCategory = async (category: Category): Promise<boolean> => {
    try {
      await updateCategoryMutation.mutateAsync(category);
      return true;
    } catch (error) {
      console.error('Error updating category:', error);
      return false;
    }
  };
  
  const handleDeleteCategory = async (categoryId: string, exercisesUsingCategory: number = 0): Promise<boolean> => {
    try {
      if (exercisesUsingCategory > 0) {
        toast.error(`Cannot delete category. ${exercisesUsingCategory} exercises are using this category.`);
        return false;
      }
      
      await deleteCategoryMutation.mutateAsync(categoryId);
      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      return false;
    }
  };

  return {
    handleAddCategory,
    handleUpdateCategory,
    handleDeleteCategory
  };
}
