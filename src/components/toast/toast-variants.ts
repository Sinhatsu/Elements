import { cva, type VariantProps } from 'class-variance-authority';

export const toastVariants = cva(
  [
    'group pointer-events-auto relative flex w-full items-center justify-between gap-3 overflow-hidden rounded-md border p-4 pr-8 shadow-lg outline-none',
    'transition-[opacity,transform] duration-200',
    'data-[swipe=move]:transition-none',
    'data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]',
    'data-[swipe=cancel]:translate-x-0',
    'data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)]',
    'data-[state=closed]:opacity-0 data-[state=closed]:translate-x-full',
    'data-[state=open]:opacity-100 data-[state=open]:translate-x-0',
    'motion-reduce:transition-none motion-reduce:data-[state=closed]:translate-x-0',
  ],
  {
    variants: {
      variant: {
        default: 'border-border bg-background text-foreground',
        success: 'border-success/40 bg-success text-success-foreground',
        error: 'border-destructive/40 bg-destructive text-destructive-foreground',
        warning: 'border-warning/40 bg-warning text-warning-foreground',
        info: 'border-primary/40 bg-primary text-primary-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export type ToastVariant = NonNullable<VariantProps<typeof toastVariants>['variant']>;
