import type { VariantProps } from 'class-variance-authority';
import { type ComponentPropsWithoutRef, type ReactNode } from 'react';

import { cn } from '@/lib/cn';

import { badgeVariants } from './badge-variants';

export interface BadgeProps
  extends ComponentPropsWithoutRef<'span'>, VariantProps<typeof badgeVariants> {
  icon?: ReactNode;
  iconPosition?: 'start' | 'end';
}

function Badge({
  className,
  variant,
  size,
  icon,
  iconPosition = 'start',
  children,
  ...props
}: BadgeProps) {
  const iconElement = icon ? (
    <span className="shrink-0" aria-hidden="true">
      {icon}
    </span>
  ) : null;

  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {iconPosition === 'start' ? iconElement : null}
      {children}
      {iconPosition === 'end' ? iconElement : null}
    </span>
  );
}

export { Badge };
