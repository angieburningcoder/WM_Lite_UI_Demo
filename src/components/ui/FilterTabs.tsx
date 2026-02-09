'use client';

import { cn } from '@/lib/utils';

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface FilterTabsProps {
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function FilterTabs({ options, value, onChange, className }: FilterTabsProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200',
            value === option.value
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          )}
        >
          {option.label}
          {typeof option.count === 'number' && (
            <span
              className={cn(
                'text-xs px-1.5 py-0.5 rounded-full',
                value === option.value
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-500'
              )}
            >
              {option.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
