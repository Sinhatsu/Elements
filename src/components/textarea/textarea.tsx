import { forwardRef, type ComponentPropsWithoutRef, type ReactNode, useId } from 'react';

import { cn } from '@/lib/cn';

const resizeClasses = {
  none: 'resize-none',
  vertical: 'resize-y',
  horizontal: 'resize-x',
  both: 'resize',
} as const;

export interface TextareaProps extends ComponentPropsWithoutRef<'textarea'> {
  error?: ReactNode;
  helperText?: ReactNode;
  resize?: keyof typeof resizeClasses;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      error,
      helperText,
      resize = 'vertical',
      id,
      disabled,
      'aria-describedby': ariaDescribedBy,
      'aria-invalid': ariaInvalid,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const fieldId = id ?? generatedId;
    const message = error ?? helperText;
    const messageId = `${fieldId}-description`;
    const describedBy = [ariaDescribedBy, message ? messageId : undefined]
      .filter(Boolean)
      .join(' ');
    const isInvalid = Boolean(error) || ariaInvalid;

    return (
      <div className="grid w-full gap-1.5">
        <textarea
          ref={ref}
          id={fieldId}
          disabled={disabled}
          aria-invalid={isInvalid || undefined}
          aria-describedby={describedBy || undefined}
          className={cn(
            'flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-base text-foreground shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 md:text-sm',
            resizeClasses[resize],
            className,
          )}
          {...props}
        />
        {message ? (
          <p
            id={messageId}
            className={cn('text-sm', error ? 'text-destructive' : 'text-muted-foreground')}
          >
            {message}
          </p>
        ) : null}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';

export { Textarea };
