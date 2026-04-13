import { cva } from 'class-variance-authority';

export const fieldControlVariants = cva(
  'flex w-full rounded-md border border-input bg-background text-base text-foreground shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 md:text-sm',
  {
    variants: {
      control: {
        input: 'h-9 min-w-0 px-3 py-1',
        textarea: 'min-h-20 px-3 py-2',
      },
    },
  },
);
