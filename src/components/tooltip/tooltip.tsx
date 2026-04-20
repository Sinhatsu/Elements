import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef } from 'react';

import { cn } from '@/lib/cn';

/**
 * Shared tooltip timing and behavior. Wrap a subtree (or the app) once so
 * adjacent tooltips can share delay and skip-delay settings.
 *
 * - `delayDuration` — ms before open on hover/focus (default `200`)
 * - `skipDelayDuration` — ms window where a subsequent tooltip opens immediately
 */
function TooltipProvider({
  delayDuration = 200,
  skipDelayDuration = 300,
  ...props
}: ComponentPropsWithoutRef<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      delayDuration={delayDuration}
      skipDelayDuration={skipDelayDuration}
      {...props}
    />
  );
}

TooltipProvider.displayName = TooltipPrimitive.Provider.displayName;

/**
 * Tooltip root. Supports controlled (`open` + `onOpenChange`) and uncontrolled
 * (`defaultOpen`) usage. Per-tooltip `delayDuration` overrides the provider.
 * Opens on hover and focus; dismisses on Escape, blur, and pointer leave.
 */
const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = forwardRef<
  ComponentRef<typeof TooltipPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger>
>((props, ref) => <TooltipPrimitive.Trigger ref={ref} data-slot="tooltip-trigger" {...props} />);

TooltipTrigger.displayName = TooltipPrimitive.Trigger.displayName;

const TooltipPortal = TooltipPrimitive.Portal;

type TooltipContentProps = ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> & {
  /** Portal mount target. Defaults to `document.body`. */
  container?: ComponentPropsWithoutRef<typeof TooltipPrimitive.Portal>['container'];
};

/**
 * Portaled tooltip surface. Positioning uses Floating UI via Radix:
 * `side` (`top` | `right` | `bottom` | `left`), `align` (`start` | `center` | `end`),
 * and collision avoidance (`avoidCollisions`, default `true`).
 *
 * Content should be plain text or non-interactive markup for accessibility.
 */
const TooltipContent = forwardRef<
  ComponentRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
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
    <TooltipPortal container={container}>
      <TooltipPrimitive.Content
        ref={ref}
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        align={align}
        avoidCollisions={avoidCollisions}
        className={cn(
          'z-50 max-w-xs origin-[var(--radix-tooltip-content-transform-origin)] rounded-md border border-border bg-popover px-3 py-1.5 text-xs text-popover-foreground shadow-md outline-none',
          'transition-opacity duration-150 data-[state=closed]:opacity-0',
          'motion-reduce:transition-none',
          className,
        )}
        {...props}
      >
        {children}
      </TooltipPrimitive.Content>
    </TooltipPortal>
  ),
);

TooltipContent.displayName = TooltipPrimitive.Content.displayName;

const TooltipArrow = forwardRef<
  ComponentRef<typeof TooltipPrimitive.Arrow>,
  ComponentPropsWithoutRef<typeof TooltipPrimitive.Arrow>
>(({ className, width = 10, height = 5, ...props }, ref) => (
  <TooltipPrimitive.Arrow
    ref={ref}
    data-slot="tooltip-arrow"
    width={width}
    height={height}
    className={cn('fill-popover', className)}
    {...props}
  />
));

TooltipArrow.displayName = TooltipPrimitive.Arrow.displayName;

export type TooltipProviderProps = ComponentPropsWithoutRef<typeof TooltipPrimitive.Provider>;
export type TooltipProps = ComponentPropsWithoutRef<typeof TooltipPrimitive.Root>;
export type TooltipTriggerProps = ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger>;
export type { TooltipContentProps };
export type TooltipArrowProps = ComponentPropsWithoutRef<typeof TooltipPrimitive.Arrow>;
export type TooltipPortalProps = ComponentPropsWithoutRef<typeof TooltipPrimitive.Portal>;

export { Tooltip, TooltipArrow, TooltipContent, TooltipPortal, TooltipProvider, TooltipTrigger };
