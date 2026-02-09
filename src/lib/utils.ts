import { RiskLevel } from '@/data/types';

// Format date to readable string
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Format date with time
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Format relative time
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return '剛剛';
  if (diffMins < 60) return `${diffMins} 分鐘前`;
  if (diffHours < 24) return `${diffHours} 小時前`;
  if (diffDays < 7) return `${diffDays} 天前`;
  return formatDate(dateString);
}

// Get risk level display info
export function getRiskLevelInfo(level: RiskLevel) {
  const info = {
    H: {
      label: '高風險',
      shortLabel: 'H',
      color: 'bg-red-50 text-red-700 border-red-200',
      dotColor: 'bg-red-500',
      description: '需要立即處理',
    },
    M: {
      label: '中風險',
      shortLabel: 'M',
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      dotColor: 'bg-amber-500',
      description: '建議關注觀察',
    },
    L: {
      label: '低風險',
      shortLabel: 'L',
      color: 'bg-green-50 text-green-700 border-green-200',
      dotColor: 'bg-green-500',
      description: '持續監控中',
    },
  };
  return info[level];
}

// Get platform icon name
export function getPlatformIcon(platform: string): string {
  const icons: Record<string, string> = {
    Instagram: 'instagram',
    Facebook: 'facebook',
    TikTok: 'music',
    Twitter: 'twitter',
  };
  return icons[platform] || 'globe';
}

// Copy text to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch {
      document.body.removeChild(textArea);
      return false;
    }
  }
}

// Format number with commas
export function formatNumber(num: number): string {
  return num.toLocaleString('zh-TW');
}

// Get week range string
export function getWeekRangeString(start: string, end: string): string {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const startStr = `${startDate.getMonth() + 1}/${startDate.getDate()}`;
  const endStr = `${endDate.getMonth() + 1}/${endDate.getDate()}`;
  return `${startStr} - ${endStr}`;
}

// CN class helper
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
