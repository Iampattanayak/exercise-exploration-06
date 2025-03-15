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

// Create a dynamic cache for categories that will be populated at runtime
const categoryCache: Record<string, Category> = {};

export const getCategoryById = async (categoryId: string): Promise<Category | null> => {
  // If we have this category in our cache, return it
  if (categoryCache[categoryId]) {
    return categoryCache[categoryId];
  }
  
  try {
    // Fetch the category from the database
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', categoryId)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching category:', error);
      return null;
    }
    
    if (data) {
      // Store in cache for future use
      const category: Category = {
        id: data.id,
        name: data.name,
        color: data.color
      };
      categoryCache[categoryId] = category;
      return category;
    }
    
    return null;
  } catch (error) {
    console.error('Error in getCategoryById:', error);
    return null;
  }
};

// Helper for synchronous access with fallback for UI rendering
export const getCategoryByIdSync = (categoryId: string): Category => {
  // If we have this category in our cache, return it
  if (categoryCache[categoryId]) {
    return categoryCache[categoryId];
  }
  
  // Return a placeholder until async data loads
  return { 
    id: categoryId, 
    name: 'Loading...', 
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
