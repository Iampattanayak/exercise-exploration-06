
import { supabase } from '@/integrations/supabase/client';
import { Category } from './types';

// CATEGORY FUNCTIONS
export const getAllCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching categories:', error);
    throw new Error(error.message);
  }
  
  return data.map(item => ({
    id: item.id,
    name: item.name,
    color: item.color
  }));
};

export const getCategoryById = (categoryId: string): Category | null => {
  // This is a helper function used by components for immediate rendering
  // It will be called with data that's already been fetched
  return { id: categoryId, name: categoryId, color: 'bg-gray-100 text-gray-800' };
};

export const addCategory = async (category: Category): Promise<void> => {
  const { error } = await supabase
    .from('categories')
    .insert([{
      id: category.id,
      name: category.name,
      color: category.color
    }]);
  
  if (error) {
    console.error('Error adding category:', error);
    throw new Error(error.message);
  }
};

export const updateCategory = async (category: Category): Promise<void> => {
  const { error } = await supabase
    .from('categories')
    .update({
      name: category.name,
      color: category.color
    })
    .eq('id', category.id);
  
  if (error) {
    console.error('Error updating category:', error);
    throw new Error(error.message);
  }
};

export const deleteCategory = async (categoryId: string): Promise<void> => {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', categoryId);
  
  if (error) {
    console.error('Error deleting category:', error);
    throw new Error(error.message);
  }
};
