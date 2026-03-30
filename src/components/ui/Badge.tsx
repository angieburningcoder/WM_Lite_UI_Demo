import { RiskLevel, CaseStatus } from '@/data/types';
import { getRiskLevelInfo, cn } from '@/lib/utils';

interface RiskBadgeProps {
  level: RiskLevel;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function RiskBadge({ level, showLabel = true, size = 'md' }: RiskBadgeProps) {
  const info = getRiskLevelInfo(level);

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  // Override colors for dark theme "bouncy" look
  const colorMap: Record<RiskLevel, string> = {
    H: 'bg-rose-600 text-white shadow-[0_0_10px_rgba(225,29,72,0.6)] border-rose-500 font-bold',
    M: 'bg-amber-500 text-black shadow-[0_0_10px_rgba(245,158,11,0.6)] border-amber-400 font-bold',
    L: 'bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.6)] border-emerald-400 font-bold',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-bold rounded-full border transition-transform hover:scale-105',
        colorMap[level],
        sizeClasses[size]
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", level === 'M' ? 'bg-black' : 'bg-white')} />
      {showLabel ? info.label : info.shortLabel}
    </span>
  );
}

interface StatusBadgeProps {
  status: CaseStatus;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const statusInfo: Record<CaseStatus, { label: string; color: string }> = {
    detected: { label: '偵測中', color: 'bg-slate-600 text-white border-slate-400' },
    scheduled: { label: '已排程', color: 'bg-rose-600 text-white border-rose-400 shadow-[0_0_10px_rgba(225,29,72,0.4)]' },
    submitted: { label: '已送件', color: 'bg-blue-600 text-white border-blue-400 shadow-[0_0_10px_rgba(37,99,235,0.4)]' },
    resolved: { label: '已下架成功', color: 'bg-green-600 text-white border-green-400 shadow-[0_0_10px_rgba(22,163,74,0.4)]' },
    monitoring: { label: '監控中', color: 'bg-purple-600 text-white border-purple-400 shadow-[0_0_10px_rgba(147,51,234,0.4)]' },
  };

  const info = statusInfo[status];
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';

  return (
    <span className={cn('inline-flex items-center font-bold rounded-full border transition-transform hover:scale-105', info.color, sizeClasses)}>
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
    Instagram: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-pink-400 shadow-[0_0_10px_rgba(236,72,153,0.4)]',
    Facebook: 'bg-blue-600 text-white border-blue-400 shadow-[0_0_10px_rgba(37,99,235,0.4)]',
    Threads: 'bg-slate-800 text-white border-slate-500 shadow-[0_0_10px_rgba(0,0,0,0.4)]',
  };

  const color = platformColors[platform] || 'bg-slate-600 text-white border-slate-500';
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';

  return (
    <span className={cn('inline-flex items-center font-bold rounded-full border transition-transform hover:scale-105', color, sizeClasses)}>
      {platform}
    </span>
  );
}
