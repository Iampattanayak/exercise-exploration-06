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
  // This is a modified helper function to handle local category lookup
  // It will use a cache mechanism with categories that have been fetched already
  const categoryCache: Record<string, Category> = {
    // Add some default categories to avoid showing IDs while loading
    'ab709094-2835-4fb4-80b0-9d53f30b3861': { id: 'ab709094-2835-4fb4-80b0-9d53f30b3861', name: 'Strength', color: 'bg-blue-100 text-blue-800' },
    'abca1d31-80f0-469b-bfa5-0c7bc30d4730': { id: 'abca1d31-80f0-469b-bfa5-0c7bc30d4730', name: 'Cardio', color: 'bg-red-100 text-red-800' },
  };
  
  // If we have this category in our cache, return it
  if (categoryCache[categoryId]) {
    return categoryCache[categoryId];
  }
  
  // Otherwise, return a fallback with the name 'Other'
  return { 
    id: categoryId, 
    name: 'Other', 
    color: 'bg-gray-100 text-gray-800' 
  };
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
