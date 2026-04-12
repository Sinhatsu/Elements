import { cva } from 'class-variance-authority';

export const badgeVariants = cva(
  'inline-flex w-fit shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold leading-none transition-colors',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        success: 'bg-emerald-600 text-white',
        warning: 'bg-amber-500 text-white',
        destructive: 'bg-destructive text-destructive-foreground',
        outline: 'border-border bg-transparent text-foreground',
      },
      size: {
        sm: 'px-2 py-0.5 text-[0.625rem]',
        md: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);
