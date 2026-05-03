import { type ComponentPropsWithoutRef } from 'react';

import { cn } from '@/lib/cn';

export type CardProps = ComponentPropsWithoutRef<'section'>;

export function Card({ className, ...props }: CardProps) {
  return (
    <section
      data-slot="card"
      className={cn(
        'rounded-xl border border-border bg-card text-card-foreground shadow-sm',
        className,
      )}
      {...props}
    />
  );
}

export type CardHeaderProps = ComponentPropsWithoutRef<'div'>;

export function CardHeader({ className, ...props }: CardHeaderProps) {
  return (
    <div data-slot="card-header" className={cn('grid gap-1.5 px-6 pt-6', className)} {...props} />
  );
}

export type CardTitleProps = ComponentPropsWithoutRef<'h3'>;

export function CardTitle({ className, ...props }: CardTitleProps) {
  return (
    <h3
      data-slot="card-title"
      className={cn('font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  );
}

export type CardDescriptionProps = ComponentPropsWithoutRef<'p'>;

export function CardDescription({ className, ...props }: CardDescriptionProps) {
  return (
    <p
      data-slot="card-description"
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
}

export type CardContentProps = ComponentPropsWithoutRef<'div'>;

export function CardContent({ className, ...props }: CardContentProps) {
  return <div data-slot="card-content" className={cn('px-6 py-6', className)} {...props} />;
}

export type CardFooterProps = ComponentPropsWithoutRef<'div'>;

export function CardFooter({ className, ...props }: CardFooterProps) {
  return (
    <div
      data-slot="card-footer"
      className={cn('flex items-center px-6 pb-6', className)}
      {...props}
    />
  );
}
