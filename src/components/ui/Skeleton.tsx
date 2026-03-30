import { Shield, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-2xl border border-slate-700/50 bg-slate-900/40 p-6 animate-pulse', className)}>
      <div className="h-5 bg-slate-700/50 rounded w-1/3 mb-4" />
      <div className="space-y-3">
        <div className="h-4 bg-slate-700/50 rounded w-full" />
        <div className="h-4 bg-slate-700/50 rounded w-5/6" />
        <div className="h-4 bg-slate-700/50 rounded w-4/6" />
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="py-6 sm:py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6 animate-pulse">
        <div className="h-9 bg-slate-700/50 rounded w-1/3" />
        <div className="h-5 bg-slate-700/50 rounded w-1/2" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-800/40 rounded-2xl border border-slate-700/50" />
          ))}
        </div>
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: 'shield' | 'search';
  action?: React.ReactNode;
}

export function EmptyState({ title, description, icon = 'shield', action }: EmptyStateProps) {
  return (
    <div className="text-center py-20 bg-slate-900/30 rounded-3xl border-2 border-dashed border-slate-800">
      <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
        {icon === 'shield' ? (
          <Shield className="w-10 h-10 text-slate-600" />
        ) : (
          <Search className="w-10 h-10 text-slate-600" />
        )}
      </div>
      <p className="text-slate-400 text-lg font-medium mb-2">{title}</p>
      <p className="text-slate-600 text-sm mb-6">{description}</p>
      {action}
    </div>
  );
}
