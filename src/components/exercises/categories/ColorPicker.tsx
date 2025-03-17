
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
    // Unified color palette that matches our exercise categories
    { value: 'bg-indigo-100 text-indigo-800', label: 'Indigo' },
    { value: 'bg-purple-100 text-purple-800', label: 'Purple' },
    { value: 'bg-blue-100 text-blue-800', label: 'Blue' },
    { value: 'bg-teal-100 text-teal-800', label: 'Teal' },
    { value: 'bg-emerald-100 text-emerald-800', label: 'Emerald' },
    { value: 'bg-amber-100 text-amber-800', label: 'Amber' },
    { value: 'bg-rose-100 text-rose-800', label: 'Rose' },
    { value: 'bg-sky-100 text-sky-800', label: 'Sky' },
    { value: 'bg-slate-100 text-slate-800', label: 'Slate' },
    { value: 'bg-cyan-100 text-cyan-800', label: 'Cyan' },
    { value: 'bg-orange-100 text-orange-800', label: 'Orange' },
    { value: 'bg-gray-100 text-gray-800', label: 'Gray' },
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {colorOptions.map((color) => (
        <button
          key={color.value}
          type="button"
          className={cn(
            'flex items-center justify-center h-10 rounded-lg border transition-all duration-200 hover:scale-105',
            color.value,
            selectedColor === color.value && 'ring-2 ring-offset-2 ring-indigo-400 shadow-md'
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
