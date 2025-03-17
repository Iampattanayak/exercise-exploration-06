
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft } from 'lucide-react';

interface CategoryHeaderProps {
  onBack: () => void;
  onAddCategory: () => void;
}

const CategoryHeader: React.FC<CategoryHeaderProps> = ({
  onBack,
  onAddCategory,
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center">
        <Button variant="ghost" onClick={onBack} className="mr-2 p-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h3 className="text-lg font-medium">Manage Categories</h3>
      </div>
      <Button onClick={onAddCategory}>
        <Plus className="h-4 w-4 mr-2" />
        Add Category
      </Button>
    </div>
  );
};

export default CategoryHeader;
