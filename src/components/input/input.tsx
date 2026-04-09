import { forwardRef, type ComponentPropsWithoutRef } from 'react';

import { cn } from '@/lib/cn';

export interface InputProps extends ComponentPropsWithoutRef<'input'> {
  invalid?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', invalid = false, 'aria-invalid': ariaInvalid, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      aria-invalid={invalid || ariaInvalid || undefined}
      className={cn(
        'flex h-9 w-full min-w-0 rounded-md border border-input bg-background px-3 py-1 text-base text-foreground shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 md:text-sm',
        className,
      )}
      {...props}
    />
  ),
);

Input.displayName = 'Input';

export { Input };
