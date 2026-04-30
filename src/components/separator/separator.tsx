import { forwardRef, type ComponentPropsWithoutRef } from 'react';

import { cn } from '@/lib/cn';

export interface SeparatorProps extends ComponentPropsWithoutRef<'div'> {
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;
}

const Separator = forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, orientation = 'horizontal', decorative = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="separator"
        role={decorative ? 'none' : 'separator'}
        aria-orientation={decorative ? undefined : orientation}
        className={cn(
          'shrink-0 bg-border',
          orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
          className,
        )}
        {...props}
      />
    );
  },
);

Separator.displayName = 'Separator';

export { Separator };
