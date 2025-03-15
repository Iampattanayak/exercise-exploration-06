
import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ColorOption {
  value: string;
  label: string;
}

interface ColorPickerProps {
  selectedColor: string;
  onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  selectedColor,
  onChange,
}) => {
  const colorOptions: ColorOption[] = [
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
    <div className="grid grid-cols-4 gap-2">
      {colorOptions.map((color) => (
        <button
          key={color.value}
          type="button"
          className={cn(
            'flex items-center justify-center h-10 rounded-md border',
            color.value,
            selectedColor === color.value && 'ring-2 ring-offset-2 ring-ring'
          )}
          onClick={() => onChange(color.value)}
        >
          {selectedColor === color.value && <Check className="h-4 w-4" />}
        </button>
      ))}
    </div>
  );
};

export default ColorPicker;
