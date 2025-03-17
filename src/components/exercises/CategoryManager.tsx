
import React, { useState, useEffect } from 'react';
import { Category } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import CategoryForm from './categories/CategoryForm';
import CategoryHeader from './categories/CategoryHeader';
import CategoryList from './categories/CategoryList';
import { useCategoryColors } from '@/hooks/useCategoryColors';

interface CategoryManagerProps {
  categories: Category[];
  exercises?: any[];
  onBack: () => void;
  onCategoryAdd?: (category: Omit<Category, 'id'>) => void;
  onCategoryUpdate?: (category: Category) => void;
  onCategoryDelete?: (categoryId: string) => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories: propCategories,
  exercises = [],
  onBack,
  onCategoryAdd,
  onCategoryUpdate,
  onCategoryDelete,
}) => {
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState<Partial<Category>>({
    name: '',
    color: 'bg-[#8B5CF6] text-white',
  });
  
  // Use the centralized hook for consistent category colors
  const { categories, refreshCategories } = useCategoryColors();
  
  // Refresh categories on component mount
  useEffect(() => {
    refreshCategories();
  }, [refreshCategories]);
  
  // Use categories from the hook if available, otherwise fall back to prop categories
  const displayCategories = categories.length > 0 ? categories : propCategories;

  const handleOpenDialog = (category?: Category) => {
    if (category) {
      console.log("Editing category:", category);
      setEditingCategory(category);
      setNewCategory({
        name: category.name,
        color: category.color || 'bg-[#8B5CF6] text-white',
      });
    } else {
      setEditingCategory(null);
      setNewCategory({
        name: '',
        color: 'bg-[#8B5CF6] text-white',
      });
    }
    setFormDialogOpen(true);
  };

  const handleSaveCategory = async () => {
    if (!newCategory.name) {
      toast.error('Category name is required');
      return;
    }

    console.log("Saving category with color:", newCategory.color);

    if (editingCategory) {
      // Update existing category
      const updatedCategory = {
        ...editingCategory,
        name: newCategory.name || '',
        color: newCategory.color || 'bg-[#8B5CF6] text-white',
      };
      
      await onCategoryUpdate?.(updatedCategory);
    } else {
      // Add new category
      const category = {
        name: newCategory.name || '',
        color: newCategory.color || 'bg-[#8B5CF6] text-white',
      };
      
      await onCategoryAdd?.(category);
    }
    
    setFormDialogOpen(false);
    setEditingCategory(null);
    setNewCategory({ name: '', color: 'bg-[#8B5CF6] text-white' });
    
    // Force refresh of category data
    refreshCategories();
  };

  const handleDeleteCategory = async (categoryId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this category? This will affect all exercises using this category.');
    if (confirmed) {
      await onCategoryDelete?.(categoryId);
      // Force refresh of category data
      refreshCategories();
    }
  };

  return (
    <div className="mt-4">
      <CategoryHeader 
        onBack={onBack}
        onAddCategory={() => handleOpenDialog()}
      />

      <CategoryList 
        categories={displayCategories}
        onEditCategory={(category) => handleOpenDialog(category)}
        onDeleteCategory={handleDeleteCategory}
      />

      {/* Form Dialog for adding/editing categories */}
      <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </DialogTitle>
            <DialogDescription>
              {editingCategory 
                ? 'Update the category details below.' 
                : 'Create a new category for organizing exercises.'}
            </DialogDescription>
          </DialogHeader>

          <CategoryForm
            category={newCategory}
            onCategoryChange={setNewCategory}
            onSave={handleSaveCategory}
            onCancel={() => setFormDialogOpen(false)}
            isEditing={!!editingCategory}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoryManager;
