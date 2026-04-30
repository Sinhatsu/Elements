import { forwardRef, type ComponentPropsWithoutRef } from 'react';

import { cn } from '@/lib/cn';

export interface SkeletonProps extends ComponentPropsWithoutRef<'div'> {
  animate?: boolean;
}

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, animate = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="skeleton"
        aria-hidden="true"
        className={cn('rounded-md bg-muted', animate && 'animate-pulse', className)}
        {...props}
      />
    );
  },
);

Skeleton.displayName = 'Skeleton';

export { Skeleton };
