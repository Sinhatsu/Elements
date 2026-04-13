import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';

import { fieldControlVariants } from '@/components/field/field-control-variants';
import { FieldMessage } from '@/components/field/field-message';
import { useFieldDescription } from '@/hooks/use-field-description';
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
    const field = useFieldDescription({ ariaDescribedBy, ariaInvalid, error, helperText, id });

    return (
      <div className="grid w-full gap-1.5">
        <textarea
          ref={ref}
          id={field.fieldId}
          disabled={disabled}
          aria-invalid={field.ariaInvalid}
          aria-describedby={field.ariaDescribedBy}
          className={cn(
            fieldControlVariants({ control: 'textarea' }),
            resizeClasses[resize],
            className,
          )}
          {...props}
        />
        {field.message !== undefined && field.message !== null ? (
          <FieldMessage id={field.messageId} error={field.hasError}>
            {field.message}
          </FieldMessage>
        ) : null}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';

export { Textarea };
