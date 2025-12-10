'use client';

import { cn } from '@/utils/cn';
import * as React from 'react';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(({ className, value = 0, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'relative h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800',
      className
    )}
    {...props}
  >
    <div
      className="h-full w-full flex-1 bg-slate-900 transition-all dark:bg-slate-100"
      style={{ transform: `translateX(-${100 - Math.min(100, Math.max(0, value))}%)` }}
    />
  </div>
));
Progress.displayName = 'Progress';

export { Progress };
