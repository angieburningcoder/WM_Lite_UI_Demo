import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-offset-slate-900 active:scale-95';

    const variants = {
      primary: 'bg-yellow-400 text-purple-900 hover:bg-yellow-300 hover:shadow-[0_0_25px_rgba(250,204,21,0.6)] focus:ring-yellow-400/50 font-bold tracking-wide border-2 border-transparent',
      secondary: 'bg-slate-800/80 text-cyan-300 border-2 border-slate-600 hover:bg-slate-700 hover:text-cyan-200 hover:border-cyan-400/50 focus:ring-slate-500 backdrop-blur-sm',
      outline: 'border-2 border-cyan-400/50 bg-transparent text-cyan-300 hover:bg-cyan-400/10 hover:border-cyan-300 focus:ring-cyan-400/50',
      ghost: 'text-slate-300 hover:bg-slate-800 hover:text-white focus:ring-slate-500',
      danger: 'bg-rose-500 text-white hover:bg-rose-400 hover:shadow-[0_0_20px_rgba(244,63,94,0.5)] focus:ring-rose-500 border-2 border-transparent',
    };

    const sizes = {
      sm: 'text-sm px-4 py-1.5 gap-1.5',
      md: 'text-base px-6 py-2.5 gap-2',
      lg: 'text-lg px-8 py-3.5 gap-2.5',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
