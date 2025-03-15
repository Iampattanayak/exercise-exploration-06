
import React from 'react';
import { Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ColorPicker from './ColorPicker';

interface CategoryFormProps {
  category: Partial<Category>;
  onCategoryChange: (category: Partial<Category>) => void;
  onSave: () => void;
  onCancel: () => void;
  isEditing: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  onCategoryChange,
  onSave,
  onCancel,
  isEditing,
}) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Category Name</Label>
        <Input
          id="name"
          value={category.name || ''}
          onChange={(e) => onCategoryChange({ ...category, name: e.target.value })}
          placeholder="e.g., Upper Body"
        />
      </div>

      <div className="grid gap-2">
        <Label>Color</Label>
        <ColorPicker
          selectedColor={category.color || 'bg-gray-100 text-gray-800'}
          onChange={(color) => onCategoryChange({ ...category, color })}
        />
      </div>

      <div className="flex justify-end space-x-2 mt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSave}>
          {isEditing ? 'Update Category' : 'Add Category'}
        </Button>
      </div>
    </div>
  );
};

export default CategoryForm;
