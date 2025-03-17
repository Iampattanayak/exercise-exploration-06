
import React from 'react';
import { Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, Save, X } from 'lucide-react';
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
    <div className="grid gap-4 py-4 animate-fade-in">
      <div className="flex items-center justify-center mb-2">
        <div className="p-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-glow">
          <Sparkles className="h-5 w-5" />
        </div>
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="name" className="text-sm font-medium text-gray-700">Category Name</Label>
        <Input
          id="name"
          value={category.name || ''}
          onChange={(e) => onCategoryChange({ ...category, name: e.target.value })}
          placeholder="e.g., Upper Body"
          className="rounded-lg"
        />
      </div>

      <div className="grid gap-2">
        <Label className="text-sm font-medium text-gray-700">Color</Label>
        <ColorPicker
          selectedColor={category.color || 'bg-[#8B5CF6] text-white'}
          onChange={(color) => onCategoryChange({ ...category, color })}
        />
      </div>

      <div className="flex justify-end space-x-2 mt-4">
        <Button 
          variant="outline" 
          onClick={onCancel}
          className="rounded-full border-gray-200 hover:bg-gray-50"
        >
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
        <Button 
          onClick={onSave}
          className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
        >
          <Save className="mr-2 h-4 w-4" />
          {isEditing ? 'Update Category' : 'Add Category'}
        </Button>
      </div>
    </div>
  );
};

export default CategoryForm;
