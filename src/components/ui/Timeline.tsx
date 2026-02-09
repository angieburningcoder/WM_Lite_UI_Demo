import { Check, Circle } from 'lucide-react';
import { StatusTimelineItem } from '@/data/types';
import { formatDateTime, cn } from '@/lib/utils';

interface TimelineProps {
  items: StatusTimelineItem[];
  className?: string;
}

export function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn('relative', className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={item.status} className="relative flex gap-4 pb-6 last:pb-0">
            {/* Vertical line */}
            {!isLast && (
              <div
                className={cn(
                  'absolute left-3 top-6 w-0.5 h-full -ml-px',
                  item.completed ? 'bg-blue-200' : 'bg-gray-200'
                )}
              />
            )}

            {/* Icon */}
            <div
              className={cn(
                'relative flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center',
                item.completed
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-400 border-2 border-gray-200'
              )}
            >
              {item.completed ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Circle className="w-2.5 h-2.5" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p
                className={cn(
                  'text-sm font-medium',
                  item.completed ? 'text-gray-900' : 'text-gray-400'
                )}
              >
                {item.label}
              </p>
              {item.timestamp && (
                <p className="text-xs text-gray-500 mt-0.5">
                  {formatDateTime(item.timestamp)}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
