import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';

import { fieldControlVariants } from '@/components/field/field-control-variants';
import { FieldMessage } from '@/components/field/field-message';
import { cn } from '@/lib/cn';
import { useFieldDescription } from '@/hooks/use-field-description';

export interface InputProps extends ComponentPropsWithoutRef<'input'> {
  error?: ReactNode;
  helperText?: ReactNode;
  invalid?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      invalid = false,
      error,
      helperText,
      id,
      'aria-describedby': ariaDescribedBy,
      'aria-invalid': ariaInvalid,
      ...props
    },
    ref,
  ) => {
    const field = useFieldDescription({
      ariaDescribedBy,
      ariaInvalid: invalid ? true : ariaInvalid,
      error,
      helperText,
      id,
    });

    return (
      <div className="grid w-full gap-1.5">
        <input
          ref={ref}
          id={field.fieldId}
          type={type}
          aria-describedby={field.ariaDescribedBy}
          aria-invalid={field.ariaInvalid}
          className={cn(fieldControlVariants({ control: 'input' }), className)}
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

Input.displayName = 'Input';

export { Input };
