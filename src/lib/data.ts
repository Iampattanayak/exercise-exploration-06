
import { supabase } from '@/integrations/supabase/client';
import { Category, Exercise } from './types';

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

// EXERCISE FUNCTIONS
export const getAllExercises = async (): Promise<Exercise[]> => {
  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching exercises:', error);
    throw new Error(error.message);
  }
  
  return data.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description || '',
    category: item.category,
    imageUrl: item.image_url || ''
  }));
};

export const getExerciseById = async (id: string): Promise<Exercise | null> => {
  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  
  if (error) {
    console.error('Error fetching exercise:', error);
    throw new Error(error.message);
  }
  
  if (!data) return null;
  
  return {
    id: data.id,
    name: data.name,
    description: data.description || '',
    category: data.category,
    imageUrl: data.image_url || ''
  };
};

export const addExercise = async (exercise: Exercise): Promise<void> => {
  // If there's an image upload, we would handle storage here
  // For now, we just store the image URL
  
  const { error } = await supabase
    .from('exercises')
    .insert([{
      id: exercise.id,
      name: exercise.name,
      description: exercise.description,
      category: exercise.category,
      image_url: exercise.imageUrl
    }]);
  
  if (error) {
    console.error('Error adding exercise:', error);
    throw new Error(error.message);
  }
};

export const updateExercise = async (exercise: Exercise): Promise<void> => {
  const { error } = await supabase
    .from('exercises')
    .update({
      name: exercise.name,
      description: exercise.description,
      category: exercise.category,
      image_url: exercise.imageUrl,
      updated_at: new Date().toISOString()
    })
    .eq('id', exercise.id);
  
  if (error) {
    console.error('Error updating exercise:', error);
    throw new Error(error.message);
  }
};

export const deleteExercise = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('exercises')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting exercise:', error);
    throw new Error(error.message);
  }
};
