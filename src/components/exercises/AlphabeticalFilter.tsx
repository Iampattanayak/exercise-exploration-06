
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDownAZ, ArrowUpAZ } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SortOrder = 'asc' | 'desc' | null;

interface AlphabeticalFilterProps {
  sortOrder: SortOrder;
  onSortChange: (order: SortOrder) => void;
}

const AlphabeticalFilter: React.FC<AlphabeticalFilterProps> = ({
  sortOrder,
  onSortChange,
}) => {
  const toggleSort = () => {
    if (sortOrder === null) {
      onSortChange('asc');
    } else if (sortOrder === 'asc') {
      onSortChange('desc');
    } else {
      onSortChange(null);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleSort}
      className={cn(
        "rounded-full flex items-center gap-1 whitespace-nowrap min-w-[80px] justify-center",
        sortOrder && "border-indigo-300 bg-indigo-50"
      )}
    >
      {sortOrder === 'asc' ? (
        <>
          <ArrowDownAZ className="h-4 w-4" />
          <span>A-Z</span>
        </>
      ) : sortOrder === 'desc' ? (
        <>
          <ArrowUpAZ className="h-4 w-4" />
          <span>Z-A</span>
        </>
      ) : (
        <>
          <ArrowDownAZ className="h-4 w-4" />
          <span>Sort</span>
        </>
      )}
    </Button>
  );
};

export default AlphabeticalFilter;
