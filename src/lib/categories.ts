import { supabase } from '@/integrations/supabase/client';
import { Category } from './types';
import { v4 as uuidv4 } from 'uuid';

// CATEGORY FUNCTIONS
export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching categories:', error);
      throw new Error(error.message);
    }
    
    return data;
  } catch (error) {
    console.error('Error in getAllCategories:', error);
    throw error;
  }
};

export const addCategory = async (category: Omit<Category, 'id'>): Promise<Category> => {
  try {
    const newCategory = {
      id: uuidv4(),
      ...category
    };
    
    const { error } = await supabase
      .from('categories')
      .insert([newCategory]);
    
    if (error) {
      console.error('Error adding category:', error);
      throw new Error(error.message);
    }
    
    return newCategory;
  } catch (error) {
    console.error('Error in addCategory:', error);
    throw error;
  }
};

export const updateCategory = async (category: Category): Promise<void> => {
  try {
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
  } catch (error) {
    console.error('Error in updateCategory:', error);
    throw error;
  }
};

export const deleteCategory = async (id: string): Promise<void> => {
  try {
    // Update exercises that use this category to have no category
    const { error: updateError } = await supabase
      .from('exercises')
      .update({ category: null })
      .eq('category', id);
    
    if (updateError) {
      console.error('Error updating exercises with category:', updateError);
      throw new Error(updateError.message);
    }
    
    // Delete the category
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting category:', error);
      throw new Error(error.message);
    }
  } catch (error) {
    console.error('Error in deleteCategory:', error);
    throw error;
  }
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

export const getCategoryByIdSync = (categoryId: string): Category => {
  // If we have this category in our cache, return it
  if (categoryCache[categoryId]) {
    return categoryCache[categoryId];
  }
  
  // Return a placeholder until async data loads
  return { 
    id: categoryId, 
    name: 'Loading...', 
    color: 'bg-[#5f22d9] text-white' 
  };
};
