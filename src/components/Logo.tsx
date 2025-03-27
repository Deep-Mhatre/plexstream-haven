
import React from 'react';
import { Film } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
  variant?: 'default' | 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({
  variant = 'default',
  size = 'md',
  className
}) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const variantClasses = {
    default: 'text-primary',
    light: 'text-white',
    dark: 'text-slate-900',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <div className={cn("flex items-center gap-1.5 font-bold", sizeClasses[size], variantClasses[variant], className)}>
      <div className={cn("bg-primary rounded-sm p-1 flex items-center justify-center", {
        'p-0.5': size === 'sm',
        'p-1': size === 'md',
        'p-1.5': size === 'lg',
      })}>
        <Film className="text-white" size={iconSizes[size]} strokeWidth={2.5} />
      </div>
      <span className={cn("tracking-tight", {
        'text-white': variant === 'light',
        'text-primary': variant === 'default',
        'text-slate-900': variant === 'dark',
      })}>
        PLEXSTREAM
      </span>
    </div>
  );
};

export default Logo;
