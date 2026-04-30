import { cva } from 'class-variance-authority';

export const spinnerVariants = cva('animate-spin text-muted-foreground', {
  variants: {
    size: {
      sm: 'size-4',
      md: 'size-6',
      lg: 'size-8',
    },
    variant: {
      default: 'text-muted-foreground',
      primary: 'text-primary',
      secondary: 'text-secondary-foreground',
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'default',
  },
});
