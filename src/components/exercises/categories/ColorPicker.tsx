
import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ColorOption {
  value: string;
  label: string;
  hex: string;
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
    // New modern color palette with unique, vibrant colors
    { value: 'bg-[#8B5CF6] text-white', label: 'Vivid Purple', hex: '#8B5CF6' },
    { value: 'bg-[#D946EF] text-white', label: 'Magenta Pink', hex: '#D946EF' },
    { value: 'bg-[#F97316] text-white', label: 'Bright Orange', hex: '#F97316' },
    { value: 'bg-[#0EA5E9] text-white', label: 'Ocean Blue', hex: '#0EA5E9' },
    { value: 'bg-[#10B981] text-white', label: 'Emerald Green', hex: '#10B981' },
    { value: 'bg-[#EC4899] text-white', label: 'Hot Pink', hex: '#EC4899' },
    { value: 'bg-[#EF4444] text-white', label: 'Bright Red', hex: '#EF4444' },
    { value: 'bg-[#14B8A6] text-white', label: 'Teal', hex: '#14B8A6' },
    { value: 'bg-[#F59E0B] text-white', label: 'Amber', hex: '#F59E0B' },
    { value: 'bg-[#6366F1] text-white', label: 'Indigo', hex: '#6366F1' },
    { value: 'bg-[#84CC16] text-white', label: 'Lime', hex: '#84CC16' },
    { value: 'bg-[#7C3AED] text-white', label: 'Violet', hex: '#7C3AED' },
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
          title={color.label}
        >
          {selectedColor === color.value && <Check className="h-4 w-4" />}
        </button>
      ))}
    </div>
  );
};

export default ColorPicker;
