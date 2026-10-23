import { cn } from '../lib/utils.js';

export function Badge({ children, variant = 'idle', className }) {
  return (
    <span className={cn('badge', `badge-${variant}`, className)}>
      {children}
    </span>
  );
}

export function StatusDot({ variant = 'idle' }) {
  const colors = {
    running: 'bg-green-400',
    queued: 'bg-yellow-400',
    done: 'bg-indigo-400',
    failed: 'bg-red-400',
    idle: 'bg-zinc-500',
  };
  return (
    <span
      className={cn(
        'inline-block w-1.5 h-1.5 rounded-full',
        colors[variant] ?? colors.idle,
        variant === 'running' && 'animate-pulse'
      )}
    />
  );
}
