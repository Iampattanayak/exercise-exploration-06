
import React, { useState } from 'react';
import { Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import CategoryForm from './categories/CategoryForm';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

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
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState<Partial<Category>>({
    name: '',
    color: 'bg-gray-100 text-gray-800',
  });

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
    setFormDialogOpen(true);
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
    
    setFormDialogOpen(false);
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
    <div className="space-y-4 mt-8">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Categories</h3>
        <Button size="sm" onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      <div className="space-y-2">
        {categories.map((category) => (
          <div key={category.id} className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center space-x-3">
              <div className={cn('px-3 py-1 rounded-full text-sm', category.color)}>
                {category.name}
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handleOpenDialog(category)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => handleDeleteCategory(category.id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        {categories.length === 0 && (
          <div className="text-center py-8 border rounded-lg">
            <p className="text-muted-foreground">No categories found. Create your first category.</p>
          </div>
        )}
      </div>

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
