import * as ToastPrimitive from '@radix-ui/react-toast';
import { X } from 'lucide-react';
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type ReactElement,
} from 'react';

import { cn } from '@/lib/cn';

import { toastVariants, type ToastVariant } from './toast-variants';

const ToastProvider = ToastPrimitive.Provider;

const ToastViewport = forwardRef<
  ComponentRef<typeof ToastPrimitive.Viewport>,
  ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    data-slot="toast-viewport"
    className={cn(
      'fixed right-4 bottom-4 z-[100] flex max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-[26rem] flex-col gap-3',
      className,
    )}
    {...props}
  />
));

ToastViewport.displayName = ToastPrimitive.Viewport.displayName;

type ToastProps = ComponentPropsWithoutRef<typeof ToastPrimitive.Root> & {
  variant?: ToastVariant;
};

const Toast = forwardRef<ComponentRef<typeof ToastPrimitive.Root>, ToastProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <ToastPrimitive.Root
      ref={ref}
      data-slot="toast"
      data-variant={variant}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  ),
);

Toast.displayName = ToastPrimitive.Root.displayName;

const ToastAction = forwardRef<
  ComponentRef<typeof ToastPrimitive.Action>,
  ComponentPropsWithoutRef<typeof ToastPrimitive.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Action
    ref={ref}
    data-slot="toast-action"
    className={cn(
      'inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-border bg-transparent px-3 text-sm font-medium transition-colors',
      'hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      'group-data-[variant=success]:border-success-foreground/30 group-data-[variant=success]:hover:bg-success-foreground/10',
      'group-data-[variant=error]:border-destructive-foreground/30 group-data-[variant=error]:hover:bg-destructive-foreground/10',
      'group-data-[variant=warning]:border-warning-foreground/30 group-data-[variant=warning]:hover:bg-warning-foreground/10',
      'group-data-[variant=info]:border-primary-foreground/30 group-data-[variant=info]:hover:bg-primary-foreground/10',
      className,
    )}
    {...props}
  />
));

ToastAction.displayName = ToastPrimitive.Action.displayName;

const ToastClose = forwardRef<
  ComponentRef<typeof ToastPrimitive.Close>,
  ComponentPropsWithoutRef<typeof ToastPrimitive.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Close
    ref={ref}
    data-slot="toast-close"
    className={cn(
      'absolute top-2 right-2 rounded-md p-1 opacity-70 transition-opacity',
      'hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      'group-data-[variant=success]:text-success-foreground',
      'group-data-[variant=error]:text-destructive-foreground',
      'group-data-[variant=warning]:text-warning-foreground',
      'group-data-[variant=info]:text-primary-foreground',
      className,
    )}
    toast-close=""
    {...props}
  >
    <X className="size-4" aria-hidden="true" />
    <span className="sr-only">Close</span>
  </ToastPrimitive.Close>
));

ToastClose.displayName = ToastPrimitive.Close.displayName;

const ToastTitle = forwardRef<
  ComponentRef<typeof ToastPrimitive.Title>,
  ComponentPropsWithoutRef<typeof ToastPrimitive.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Title
    ref={ref}
    data-slot="toast-title"
    className={cn('text-base font-semibold leading-5 [&+div]:text-sm', className)}
    {...props}
  />
));

ToastTitle.displayName = ToastPrimitive.Title.displayName;

const ToastDescription = forwardRef<
  ComponentRef<typeof ToastPrimitive.Description>,
  ComponentPropsWithoutRef<typeof ToastPrimitive.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Description
    ref={ref}
    data-slot="toast-description"
    className={cn('text-sm leading-5 opacity-90', className)}
    {...props}
  />
));

ToastDescription.displayName = ToastPrimitive.Description.displayName;

type ToastActionElement = ReactElement;

export type ToastProviderProps = ComponentPropsWithoutRef<typeof ToastPrimitive.Provider>;
export type ToastViewportProps = ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>;
export type { ToastProps };
export type ToastActionProps = ComponentPropsWithoutRef<typeof ToastPrimitive.Action>;
export type ToastCloseProps = ComponentPropsWithoutRef<typeof ToastPrimitive.Close>;
export type ToastTitleProps = ComponentPropsWithoutRef<typeof ToastPrimitive.Title>;
export type ToastDescriptionProps = ComponentPropsWithoutRef<typeof ToastPrimitive.Description>;
export type { ToastActionElement };
export type { ToastVariant };

export {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
};
