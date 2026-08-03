import { cva, type VariantProps } from 'class-variance-authority';

export const sheetVariants = cva(
  'fixed z-50 gap-4 bg-popover p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-300',
  {
    variants: {
      side: {
        top: 'inset-x-0 top-0 border-b border-border data-[state=closed]:-translate-y-full data-[state=open]:translate-y-0',
        bottom:
          'inset-x-0 bottom-0 border-t border-border data-[state=closed]:translate-y-full data-[state=open]:translate-y-0',
        left: 'inset-y-0 left-0 h-full w-3/4 border-r border-border data-[state=closed]:-translate-x-full data-[state=open]:translate-x-0 sm:max-w-sm',
        right:
          'inset-y-0 right-0 h-full w-3/4 border-l border-border data-[state=closed]:translate-x-full data-[state=open]:translate-x-0 sm:max-w-sm',
      },
    },
    defaultVariants: {
      side: 'right',
    },
  },
);

export type SheetVariantProps = VariantProps<typeof sheetVariants>;
