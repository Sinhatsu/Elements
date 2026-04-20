import * as PopoverPrimitive from '@radix-ui/react-popover';
import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef } from 'react';

import { cn } from '@/lib/cn';

/**
 * Popover root. Supports controlled (`open` + `onOpenChange`) and uncontrolled
 * (`defaultOpen`) usage. Set `modal` to trap focus and block outside interaction
 * while open (recommended for forms); non-modal is the default for lightweight menus.
 *
 * Opens from the trigger click; closes on Escape, outside click/pointer-down
 * (when non-modal or via dismiss), and `PopoverClose`.
 */
const Popover = PopoverPrimitive.Root;

const PopoverTrigger = forwardRef<
  ComponentRef<typeof PopoverPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>
>((props, ref) => <PopoverPrimitive.Trigger ref={ref} data-slot="popover-trigger" {...props} />);

PopoverTrigger.displayName = PopoverPrimitive.Trigger.displayName;

const PopoverAnchor = forwardRef<
  ComponentRef<typeof PopoverPrimitive.Anchor>,
  ComponentPropsWithoutRef<typeof PopoverPrimitive.Anchor>
>((props, ref) => <PopoverPrimitive.Anchor ref={ref} data-slot="popover-anchor" {...props} />);

PopoverAnchor.displayName = PopoverPrimitive.Anchor.displayName;

const PopoverPortal = PopoverPrimitive.Portal;

const PopoverClose = forwardRef<
  ComponentRef<typeof PopoverPrimitive.Close>,
  ComponentPropsWithoutRef<typeof PopoverPrimitive.Close>
>((props, ref) => <PopoverPrimitive.Close ref={ref} data-slot="popover-close" {...props} />);

PopoverClose.displayName = PopoverPrimitive.Close.displayName;

type PopoverContentProps = ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & {
  /** Portal mount target. Defaults to `document.body`. */
  container?: ComponentPropsWithoutRef<typeof PopoverPrimitive.Portal>['container'];
};

/**
 * Portaled popover surface. Positioning uses Floating UI via Radix:
 * `side` (`top` | `right` | `bottom` | `left`), `align` (`start` | `center` | `end`),
 * and collision avoidance (`avoidCollisions`, default `true`).
 *
 * Renders with `role="dialog"` when `modal` is set on the root. Prefer an
 * accessible name (`aria-label` or a labelled heading) for modal content.
 */
const PopoverContent = forwardRef<
  ComponentRef<typeof PopoverPrimitive.Content>,
  PopoverContentProps
>(
  (
    {
      className,
      sideOffset = 4,
      align = 'center',
      avoidCollisions = true,
      container,
      children,
      ...props
    },
    ref,
  ) => (
    <PopoverPortal container={container}>
      <PopoverPrimitive.Content
        ref={ref}
        data-slot="popover-content"
        sideOffset={sideOffset}
        align={align}
        avoidCollisions={avoidCollisions}
        className={cn(
          'z-50 w-72 origin-[var(--radix-popover-content-transform-origin)] rounded-md border border-border bg-popover p-4 text-sm text-popover-foreground shadow-md outline-none',
          'transition-opacity duration-150 data-[state=closed]:opacity-0',
          'motion-reduce:transition-none',
          className,
        )}
        {...props}
      >
        {children}
      </PopoverPrimitive.Content>
    </PopoverPortal>
  ),
);

PopoverContent.displayName = PopoverPrimitive.Content.displayName;

const PopoverArrow = forwardRef<
  ComponentRef<typeof PopoverPrimitive.Arrow>,
  ComponentPropsWithoutRef<typeof PopoverPrimitive.Arrow>
>(({ className, width = 10, height = 5, ...props }, ref) => (
  <PopoverPrimitive.Arrow
    ref={ref}
    data-slot="popover-arrow"
    width={width}
    height={height}
    className={cn('fill-popover', className)}
    {...props}
  />
));

PopoverArrow.displayName = PopoverPrimitive.Arrow.displayName;

export type PopoverProps = ComponentPropsWithoutRef<typeof PopoverPrimitive.Root>;
export type PopoverTriggerProps = ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>;
export type PopoverAnchorProps = ComponentPropsWithoutRef<typeof PopoverPrimitive.Anchor>;
export type PopoverCloseProps = ComponentPropsWithoutRef<typeof PopoverPrimitive.Close>;
export type { PopoverContentProps };
export type PopoverArrowProps = ComponentPropsWithoutRef<typeof PopoverPrimitive.Arrow>;
export type PopoverPortalProps = ComponentPropsWithoutRef<typeof PopoverPrimitive.Portal>;

export {
  Popover,
  PopoverAnchor,
  PopoverArrow,
  PopoverClose,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
};
