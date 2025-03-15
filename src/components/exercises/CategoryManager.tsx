
import React, { useState } from 'react';
import { Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import CategoryItem from './categories/CategoryItem';
import CategoryForm from './categories/CategoryForm';

interface CategoryManagerProps {
  categories: Category[];
  exercises?: any[];
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onCategoryAdd?: (category: Omit<Category, 'id'>) => void;
  onCategoryUpdate?: (category: Category) => void;
  onCategoryDelete?: (categoryId: string) => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  exercises = [],
  isOpen = false,
  onOpenChange,
  onCategoryAdd,
  onCategoryUpdate,
  onCategoryDelete,
}) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState<Partial<Category>>({
    name: '',
    color: 'bg-gray-100 text-gray-800',
  });

  const effectiveIsOpen = onOpenChange ? isOpen : editDialogOpen;
  const effectiveSetIsOpen = onOpenChange || setEditDialogOpen;

  const handleOpenDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setNewCategory({
        name: category.name,
        color: category.color,
      });
    } else {
      setEditingCategory(null);
      setNewCategory({
        name: '',
        color: 'bg-gray-100 text-gray-800',
      });
    }
    effectiveSetIsOpen(true);
  };

  const handleSaveCategory = async () => {
    if (!newCategory.name) {
      toast.error('Category name is required');
      return;
    }

    if (editingCategory) {
      // Update existing category
      const updatedCategory = {
        ...editingCategory,
        name: newCategory.name || '',
        color: newCategory.color || 'bg-gray-100 text-gray-800',
      };
      
      await onCategoryUpdate?.(updatedCategory);
    } else {
      // Add new category
      const category = {
        name: newCategory.name || '',
        color: newCategory.color || 'bg-gray-100 text-gray-800',
      };
      
      await onCategoryAdd?.(category);
    }
    
    effectiveSetIsOpen(false);
    setEditingCategory(null);
    setNewCategory({ name: '', color: 'bg-gray-100 text-gray-800' });
  };

  const handleDeleteCategory = async (categoryId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this category? This will affect all exercises using this category.');
    if (confirmed) {
      await onCategoryDelete?.(categoryId);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Categories</h3>
        <Button size="sm" onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {categories.map((category) => (
          <CategoryItem
            key={category.id}
            category={category}
            onEdit={handleOpenDialog}
            onDelete={handleDeleteCategory}
          />
        ))}

        {categories.length === 0 && (
          <div className="text-center py-8 border rounded-lg">
            <p className="text-muted-foreground">No categories found. Create your first category.</p>
          </div>
        )}
      </div>

      <Dialog open={effectiveIsOpen} onOpenChange={effectiveSetIsOpen}>
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
            onCancel={() => effectiveSetIsOpen(false)}
            isEditing={!!editingCategory}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoryManager;
