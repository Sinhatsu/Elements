import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { LoaderCircle } from 'lucide-react';
import type { VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/cn';
import { spinnerVariants } from './spinner-variants';

export interface SpinnerProps
  extends ComponentPropsWithoutRef<'svg'>, VariantProps<typeof spinnerVariants> {
  label?: string;
}

const Spinner = forwardRef<SVGSVGElement, SpinnerProps>(
  ({ className, size, variant, label = 'Loading...', ...props }, ref) => {
    return (
      <span role="status" className="inline-flex items-center justify-center">
        <LoaderCircle
          ref={ref}
          data-slot="spinner"
          aria-hidden="true"
          className={cn(spinnerVariants({ size, variant }), className)}
          {...props}
        />
        <span className="sr-only">{label}</span>
      </span>
    );
  },
);

Spinner.displayName = 'Spinner';

export { Spinner };
