
import React from 'react';
import { cn } from '@/lib/utils';

const Logo = ({ variant = 'default', size = 'md', className }) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  const variantClasses = {
    default: 'text-primary',
    light: 'text-white',
    dark: 'text-slate-900',
  };

  return (
    <div className={cn("flex items-center gap-1.5 font-bold", sizeClasses[size], variantClasses[variant], className)}>
      <div className={cn("relative bg-gradient-to-r from-blue-500 to-cyan-400 rounded-md p-1 flex items-center justify-center", {
        'p-0.5': size === 'sm',
        'p-1': size === 'md',
        'p-1.5': size === 'lg',
        'p-2': size === 'xl',
      })}>
        <div className="absolute inset-0 blur-sm bg-gradient-to-r from-blue-500 to-cyan-400 rounded-md"></div>
        <span className="relative z-10 text-white font-bold uppercase">P</span>
      </div>
      <span className={cn("tracking-tight relative", {
        'text-white': variant === 'light',
        'text-primary': variant === 'default',
        'text-slate-900': variant === 'dark',
      })}>
        <span className="mr-1">PLEX</span>
        <span className="text-blue-500 font-extrabold">STREAM</span>
      </span>
    </div>
  );
};

export default Logo;
