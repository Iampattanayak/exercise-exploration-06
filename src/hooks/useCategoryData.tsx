
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addCategory, updateCategory, deleteCategory } from '@/lib/categories';
import { Category } from '@/lib/types';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

export function useCategoryData() {
  const queryClient = useQueryClient();

  const addCategoryMutation = useMutation({
    mutationFn: (category: Category) => addCategory(category),
    onSuccess: () => {
      // Force immediate refresh of category data with no delay
      queryClient.invalidateQueries({ queryKey: ['categories'], refetchType: 'active' });
      queryClient.invalidateQueries({ queryKey: ['exercises'], refetchType: 'active' });
      toast.success('Category added successfully');
    },
    onError: (error) => {
      toast.error(`Failed to add category: ${error.message}`);
    }
  });

  const updateCategoryMutation = useMutation({
    mutationFn: (category: Category) => updateCategory(category),
    onSuccess: () => {
      // Force immediate refresh of all relevant query data
      queryClient.invalidateQueries({ queryKey: ['categories'], refetchType: 'active' });
      queryClient.invalidateQueries({ queryKey: ['exercises'], refetchType: 'active' });
      toast.success('Category updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update category: ${error.message}`);
    }
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (categoryId: string) => deleteCategory(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'], refetchType: 'active' });
      queryClient.invalidateQueries({ queryKey: ['exercises'], refetchType: 'active' });
      toast.success('Category deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete category: ${error.message}`);
    }
  });

  const handleAddCategory = async (category: Omit<Category, 'id'> & { id?: string }): Promise<boolean> => {
    try {
      // Generate a proper UUID for the category
      const newCategory: Category = {
        ...category,
        id: uuidv4(),
        color: category.color || 'bg-[#8B5CF6] text-white' // Ensure new color default
      };
      
      await addCategoryMutation.mutateAsync(newCategory);
      
      // Force immediate refresh of all data
      queryClient.resetQueries({ queryKey: ['categories'], exact: true });
      queryClient.resetQueries({ queryKey: ['exercises'] });
      
      return true;
    } catch (error) {
      console.error('Error adding category:', error);
      return false;
    }
  };
  
  const handleUpdateCategory = async (category: Category): Promise<boolean> => {
    try {
      // Ensure the color is valid
      const updatedCategory = {
        ...category,
        color: category.color || 'bg-[#8B5CF6] text-white'
      };
      
      await updateCategoryMutation.mutateAsync(updatedCategory);
      
      // Force immediate refresh of all relevant data
      queryClient.resetQueries({ queryKey: ['categories'], exact: true });
      queryClient.resetQueries({ queryKey: ['exercises'] });
      
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
      
      // Force immediate refresh of all data
      queryClient.resetQueries({ queryKey: ['categories'], exact: true });
      queryClient.resetQueries({ queryKey: ['exercises'] });
      
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
