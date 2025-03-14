
import React, { useState } from 'react';
import { Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pencil, Trash, Plus, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface CategoryManagerProps {
  categories: Category[];
  onCategoryAdd?: (category: Category) => void;
  onCategoryUpdate?: (category: Category) => void;
  onCategoryDelete?: (categoryId: string) => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  onCategoryAdd,
  onCategoryUpdate,
  onCategoryDelete,
}) => {
  const [isOpen, setIsOpen] = useState(false);
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
    setIsOpen(true);
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
      const categoryId = newCategory.name?.toLowerCase().replace(/\s+/g, '-') || `category-${Date.now()}`;
      const category: Category = {
        id: categoryId,
        name: newCategory.name || '',
        color: newCategory.color || 'bg-gray-100 text-gray-800',
      };
      
      await onCategoryAdd?.(category);
    }
    
    setIsOpen(false);
    setEditingCategory(null);
    setNewCategory({ name: '', color: 'bg-gray-100 text-gray-800' });
  };

  const handleDeleteCategory = async (categoryId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this category? This will affect all exercises using this category.');
    if (confirmed) {
      await onCategoryDelete?.(categoryId);
    }
  };

  // Predefined color options
  const colorOptions = [
    { value: 'bg-red-100 text-red-800', label: 'Red' },
    { value: 'bg-blue-100 text-blue-800', label: 'Blue' },
    { value: 'bg-green-100 text-green-800', label: 'Green' },
    { value: 'bg-yellow-100 text-yellow-800', label: 'Yellow' },
    { value: 'bg-purple-100 text-purple-800', label: 'Purple' },
    { value: 'bg-orange-100 text-orange-800', label: 'Orange' },
    { value: 'bg-pink-100 text-pink-800', label: 'Pink' },
    { value: 'bg-gray-100 text-gray-800', label: 'Gray' },
  ];

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
          <div 
            key={category.id}
            className="flex items-center justify-between p-3 rounded-lg border"
          >
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

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
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

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                value={newCategory.name || ''}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                placeholder="e.g., Upper Body"
              />
            </div>

            <div className="grid gap-2">
              <Label>Color</Label>
              <div className="grid grid-cols-4 gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    className={cn(
                      'flex items-center justify-center h-10 rounded-md border',
                      color.value,
                      newCategory.color === color.value && 'ring-2 ring-offset-2 ring-ring'
                    )}
                    onClick={() => setNewCategory({ ...newCategory, color: color.value })}
                  >
                    {newCategory.color === color.value && <Check className="h-4 w-4" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCategory}>
              {editingCategory ? 'Update Category' : 'Add Category'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoryManager;
