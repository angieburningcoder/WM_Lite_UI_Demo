import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, padding = 'md', hover = false, onClick }: CardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6 sm:p-8',
    lg: 'p-8 sm:p-10',
  };

  return (
    <div
      className={cn(
        'glass-panel rounded-[32px] text-slate-100 relative overflow-hidden',
        paddingClasses[padding],
        hover && 'transition-all duration-300 hover:shadow-[0_10px_40px_-10px_rgba(34,211,238,0.3)] hover:border-cyan-400/40 hover:-translate-y-2 cursor-pointer',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {hover && (
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/0 via-cyan-500/0 to-cyan-500/5 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      )}
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export function CardHeader({ title, subtitle, action, className }: CardHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between gap-4 mb-6', className)}>
      <div>
        <h3 className="text-xl font-bold text-slate-100 tracking-wide">{title}</h3>
        {subtitle && <p className="text-base text-slate-400 mt-1">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
  padding?: 'none';
}

export function CardContent({ children, className }: CardContentProps) {
  return <div className={className}>{children}</div>;
}

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({ icon, title, description, className }: FeatureCardProps) {
  return (
    <div className={cn('relative overflow-hidden rounded-[40px] p-8 glass-panel group transition-all duration-300 hover:bg-slate-800/90 hover:scale-[1.03] hover:shadow-xl hover:shadow-purple-500/20', className)}>
      {/* Decorative gradient blob */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-cyan-400/10 rounded-full blur-3xl group-hover:bg-cyan-400/20 transition-all duration-500 animate-pulse" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-500 delay-75" />

      <div className="relative z-10 flex flex-col items-center text-center h-full">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-[28px] bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-700 text-cyan-300 mb-6 shadow-lg group-hover:shadow-cyan-400/30 group-hover:border-cyan-400/50 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-4 group-hover:text-cyan-300 transition-colors tracking-wide">{title}</h3>
        <p className="text-slate-300 leading-relaxed text-base group-hover:text-slate-100">{description}</p>
      </div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'stable';
  className?: string;
}

export function StatCard({ label, value, subtext, icon, trend, className }: StatCardProps) {
  const trendColors = {
    up: 'text-emerald-400',
    down: 'text-rose-400',
    stable: 'text-slate-400',
  };

  return (
    <Card className={cn('rounded-[32px]', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400 mb-2">{label}</p>
          <p className="text-3xl font-extrabold text-white tracking-tight">{value}</p>
          {subtext && (
            <p className={cn('text-sm mt-2 font-medium flex items-center gap-1', trend ? trendColors[trend] : 'text-slate-500')}>
              {subtext}
            </p>
          )}
        </div>
        {icon && (
          <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-cyan-400 shadow-inner">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
