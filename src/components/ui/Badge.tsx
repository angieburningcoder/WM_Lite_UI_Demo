import { RiskLevel } from '@/data/types';
import { getRiskLevelInfo, cn } from '@/lib/utils';

interface RiskBadgeProps {
  level: RiskLevel;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function RiskBadge({ level, showLabel = true, size = 'md' }: RiskBadgeProps) {
  const info = getRiskLevelInfo(level);

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-0.5',
    lg: 'text-base px-2.5 py-1',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium rounded-full border',
        info.color,
        sizeClasses[size]
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', info.dotColor)} />
      {showLabel ? info.label : info.shortLabel}
    </span>
  );
}

interface StatusBadgeProps {
  status: 'active' | 'pending' | 'completed' | 'monitoring';
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const statusInfo = {
    active: { label: '處理中', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    pending: { label: '待處理', color: 'bg-gray-50 text-gray-700 border-gray-200' },
    completed: { label: '已完成', color: 'bg-green-50 text-green-700 border-green-200' },
    monitoring: { label: '監控中', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  };

  const info = statusInfo[status];
  const sizeClasses = size === 'sm' ? 'text-xs px-1.5 py-0.5' : 'text-sm px-2 py-0.5';

  return (
    <span className={cn('inline-flex items-center font-medium rounded-full border', info.color, sizeClasses)}>
      {info.label}
    </span>
  );
}

interface PlatformBadgeProps {
  platform: string;
  size?: 'sm' | 'md';
}

export function PlatformBadge({ platform, size = 'md' }: PlatformBadgeProps) {
  const platformColors: Record<string, string> = {
    Instagram: 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 border-purple-200',
    Facebook: 'bg-blue-50 text-blue-700 border-blue-200',
    TikTok: 'bg-gray-900 text-white border-gray-900',
    Twitter: 'bg-sky-50 text-sky-700 border-sky-200',
  };

  const color = platformColors[platform] || 'bg-gray-50 text-gray-700 border-gray-200';
  const sizeClasses = size === 'sm' ? 'text-xs px-1.5 py-0.5' : 'text-sm px-2 py-0.5';

  return (
    <span className={cn('inline-flex items-center font-medium rounded-full border', color, sizeClasses)}>
      {platform}
    </span>
  );
}
