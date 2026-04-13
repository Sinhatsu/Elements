import type { VariantProps } from 'class-variance-authority';
import { LoaderCircle } from 'lucide-react';
import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';

import { cn } from '@/lib/cn';

import { buttonVariants } from './button-variants';

export interface ButtonProps
  extends ComponentPropsWithoutRef<'button'>, VariantProps<typeof buttonVariants> {
  loading?: boolean;
  loadingText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading = false,
      loadingText,
      leftIcon,
      rightIcon,
      disabled,
      children,
      type = 'button',
      'aria-label': ariaLabel,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type={type}
        className={cn(buttonVariants({ variant, size }), loading && 'cursor-wait', className)}
        disabled={isDisabled}
        aria-label={loading ? (loadingText ?? 'Loading') : ariaLabel}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading ? (
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
        ) : leftIcon ? (
          <span className="shrink-0" aria-hidden="true">
            {leftIcon}
          </span>
        ) : null}
        {loading && loadingText ? loadingText : children}
        {!loading && rightIcon ? (
          <span className="shrink-0" aria-hidden="true">
            {rightIcon}
          </span>
        ) : null}
      </button>
    );
  },
);

Button.displayName = 'Button';

export { Button };
