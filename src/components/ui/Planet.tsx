import { cn } from '@/lib/utils';

interface PlanetProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    color?: 'purple' | 'blue' | 'cyan' | 'pink' | 'orange';
    hasRing?: boolean;
    className?: string;
    delay?: number;
}

export function Planet({ size = 'md', color = 'purple', hasRing = false, className, delay = 0 }: PlanetProps) {
    const sizeClasses = {
        sm: 'w-16 h-16',
        md: 'w-32 h-32',
        lg: 'w-48 h-48',
        xl: 'w-64 h-64',
    };

    const colorClasses = {
        purple: 'from-purple-600 to-indigo-900 shadow-purple-500/30',
        blue: 'from-blue-500 to-slate-900 shadow-blue-500/30',
        cyan: 'from-cyan-400 to-blue-900 shadow-cyan-400/30',
        pink: 'from-pink-400 to-rose-900 shadow-pink-500/30',
        orange: 'from-orange-400 to-red-900 shadow-orange-500/30',
    };

    return (
        <div
            className={cn('relative rounded-full', sizeClasses[size], className)}
            style={{ animationDelay: `${delay}s` }}
        >
            {/* Planet Body */}
            <div className={cn(
                'absolute inset-0 rounded-full bg-gradient-to-br shadow-2xl animate-float',
                colorClasses[color]
            )}>
                {/* Surface Texture (pseudo-random spots) */}
                <div className="absolute top-[20%] left-[30%] w-[15%] h-[10%] bg-black/10 rounded-full blur-[2px]" />
                <div className="absolute bottom-[30%] right-[20%] w-[25%] h-[15%] bg-black/10 rounded-full blur-[3px]" />

                {/* Atmosphere Glow */}
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/20 to-transparent blur-md" />
            </div>

            {/* Ring (Optional) */}
            {hasRing && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[40%] rounded-[100%] border-[8px] border-white/10 blur-[1px] rotate-[-20deg] animate-pulse">
                    <div className="absolute inset-0 rounded-[100%] border-t-[4px] border-white/30" />
                </div>
            )}
        </div>
    );
}
