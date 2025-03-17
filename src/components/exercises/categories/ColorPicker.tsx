
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
    // Modern color palette based on provided color styles
    { value: 'bg-[#5f22d9] text-white', label: 'Purple Heart', hex: '#5f22d9' },
    { value: 'bg-[#2c016d] text-white', label: 'Christalle', hex: '#2c016d' },
    { value: 'bg-[#0c58c6] text-white', label: 'Denim', hex: '#0c58c6' },
    { value: 'bg-[#6a93d9] text-white', label: 'Danube', hex: '#6a93d9' },
    { value: 'bg-[#85d2d8] text-white', label: 'Bermuda', hex: '#85d2d8' },
    { value: 'bg-[#51d6ca] text-white', label: 'Viking', hex: '#51d6ca' },
    { value: 'bg-[#ecb20d] text-white', label: 'Buttercup', hex: '#ecb20d' },
    { value: 'bg-[#d7ad0d] text-white', label: 'Galliano', hex: '#d7ad0d' },
    { value: 'bg-[#fc5110] text-white', label: 'Orange', hex: '#fc5110' },
    { value: 'bg-[#f14c36] text-white', label: 'Flamingo', hex: '#f14c36' },
    { value: 'bg-[#c82b28] text-white', label: 'Persian Red', hex: '#c82b28' },
    { value: 'bg-[#dd95c3] text-white', label: 'Light Orchid', hex: '#dd95c3' },
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
