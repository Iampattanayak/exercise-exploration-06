
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDownAZ, ArrowUpAZ, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SortOrder = 'asc' | 'desc' | null;
export type SortType = 'name' | 'category' | null;

interface AlphabeticalFilterProps {
  sortOrder: SortOrder;
  sortType: SortType;
  onSortChange: (order: SortOrder, type: SortType) => void;
}

const AlphabeticalFilter: React.FC<AlphabeticalFilterProps> = ({
  sortOrder,
  sortType,
  onSortChange,
}) => {
  const toggleNameSort = () => {
    if (sortType !== 'name' || sortOrder === null) {
      onSortChange('asc', 'name');
    } else if (sortOrder === 'asc') {
      onSortChange('desc', 'name');
    } else {
      onSortChange(null, null);
    }
  };

  const toggleCategorySort = () => {
    if (sortType !== 'category' || sortOrder === null) {
      onSortChange('asc', 'category');
    } else if (sortOrder === 'asc') {
      onSortChange('desc', 'category');
    } else {
      onSortChange(null, null);
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={toggleNameSort}
        className={cn(
          "rounded-full flex items-center gap-1 whitespace-nowrap min-w-[80px] justify-center",
          sortType === 'name' && sortOrder && "border-indigo-300 bg-indigo-50"
        )}
      >
        {sortType === 'name' && sortOrder === 'asc' ? (
          <>
            <ArrowDownAZ className="h-4 w-4" />
            <span>A-Z</span>
          </>
        ) : sortType === 'name' && sortOrder === 'desc' ? (
          <>
            <ArrowUpAZ className="h-4 w-4" />
            <span>Z-A</span>
          </>
        ) : (
          <>
            <ArrowDownAZ className="h-4 w-4" />
            <span>Name</span>
          </>
        )}
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={toggleCategorySort}
        className={cn(
          "rounded-full flex items-center gap-1 whitespace-nowrap min-w-[100px] justify-center",
          sortType === 'category' && sortOrder && "border-indigo-300 bg-indigo-50"
        )}
      >
        {sortType === 'category' && sortOrder === 'asc' ? (
          <>
            <Layers className="h-4 w-4" />
            <span>Cat: A-Z</span>
          </>
        ) : sortType === 'category' && sortOrder === 'desc' ? (
          <>
            <Layers className="h-4 w-4" />
            <span>Cat: Z-A</span>
          </>
        ) : (
          <>
            <Layers className="h-4 w-4" />
            <span>Category</span>
          </>
        )}
      </Button>
    </div>
  );
};

export default AlphabeticalFilter;
