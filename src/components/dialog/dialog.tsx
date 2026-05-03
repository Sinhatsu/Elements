import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef } from 'react';

import { cn } from '@/lib/cn';

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogClose = DialogPrimitive.Close;
const DialogPortal = DialogPrimitive.Portal;

export type DialogProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Root>;
export type DialogTriggerProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>;
export type DialogCloseProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Close>;
export type DialogPortalProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Portal>;

export type DialogOverlayProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>;

const DialogOverlay = forwardRef<ComponentRef<typeof DialogPrimitive.Overlay>, DialogOverlayProps>(
  ({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay
      ref={ref}
      data-slot="dialog-overlay"
      className={cn(
        'fixed inset-0 z-50 bg-foreground/35 backdrop-blur-[1px] transition-opacity duration-200 data-[state=closed]:opacity-0',
        className,
      )}
      {...props}
    />
  ),
);

DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

export type DialogContentProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Content>;

const DialogContent = forwardRef<ComponentRef<typeof DialogPrimitive.Content>, DialogContentProps>(
  ({ className, children, ...props }, ref) => (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        data-slot="dialog-content"
        className={cn(
          'fixed top-1/2 left-1/2 z-50 grid w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl border border-border bg-popover p-6 text-popover-foreground shadow-lg outline-none transition-opacity duration-200 data-[state=closed]:opacity-0 sm:w-full',
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="absolute top-2 right-2 inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none">
          <X className="size-4" aria-hidden="true" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  ),
);

DialogContent.displayName = DialogPrimitive.Content.displayName;

export type DialogHeaderProps = ComponentPropsWithoutRef<'div'>;

function DialogHeader({ className, ...props }: DialogHeaderProps) {
  return (
    <div data-slot="dialog-header" className={cn('grid gap-1.5 text-left', className)} {...props} />
  );
}

export type DialogFooterProps = ComponentPropsWithoutRef<'div'>;

function DialogFooter({ className, ...props }: DialogFooterProps) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
      {...props}
    />
  );
}

export type DialogTitleProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Title>;

const DialogTitle = forwardRef<ComponentRef<typeof DialogPrimitive.Title>, DialogTitleProps>(
  ({ className, ...props }, ref) => (
    <DialogPrimitive.Title
      ref={ref}
      data-slot="dialog-title"
      className={cn('text-lg font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  ),
);

DialogTitle.displayName = DialogPrimitive.Title.displayName;

export type DialogDescriptionProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Description>;

const DialogDescription = forwardRef<
  ComponentRef<typeof DialogPrimitive.Description>,
  DialogDescriptionProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    data-slot="dialog-description"
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));

DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
