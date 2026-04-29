import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';

import { FieldMessage } from '@/components/field/field-message';
import { useFieldDescription } from '@/hooks/use-field-description';
import { cn } from '@/lib/cn';

export interface OtpInputProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'defaultValue' | 'onChange'
> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  length?: number;
  autoFocus?: boolean;
  disabled?: boolean;
  type?: 'numeric' | 'alphanumeric';
  label?: ReactNode;
  helperText?: ReactNode;
  error?: ReactNode;
  invalid?: boolean;
}

function sanitize(value: string, type: OtpInputProps['type']) {
  const pattern = type === 'alphanumeric' ? /[^a-zA-Z0-9]/g : /\D/g;
  return value.replace(pattern, '');
}

const OtpInput = forwardRef<HTMLDivElement, OtpInputProps>(
  (
    {
      value,
      defaultValue = '',
      onValueChange,
      onComplete,
      length = 6,
      autoFocus = false,
      disabled = false,
      type = 'numeric',
      label = 'One-time password',
      helperText,
      error,
      invalid = false,
      id,
      className,
      'aria-describedby': ariaDescribedBy,
      'aria-invalid': ariaInvalid,
      ...props
    },
    ref,
  ) => {
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
    const [uncontrolledValue, setUncontrolledValue] = useState(() =>
      sanitize(defaultValue, type).slice(0, length),
    );
    const currentValue = sanitize(value ?? uncontrolledValue, type).slice(0, length);
    const field = useFieldDescription({
      ariaDescribedBy,
      ariaInvalid: invalid ? true : ariaInvalid,
      error,
      helperText,
      id,
    });

    useEffect(() => {
      if (autoFocus && !disabled) inputRefs.current[0]?.focus();
    }, [autoFocus, disabled]);

    const commitValue = (nextValue: string) => {
      const next = sanitize(nextValue, type).slice(0, length);
      if (value === undefined) setUncontrolledValue(next);
      onValueChange?.(next);
      if (next.length === length && next !== currentValue) onComplete?.(next);
    };

    const setCharactersFrom = (startIndex: number, characters: string) => {
      const allowedCharacters = sanitize(characters, type);
      if (!allowedCharacters) return;
      const slots = currentValue.padEnd(length, ' ').split('');
      allowedCharacters
        .slice(0, length - startIndex)
        .split('')
        .forEach((character, offset) => {
          slots[startIndex + offset] = character;
        });
      const next = slots.join('').replace(/\s+$/g, '');
      commitValue(next);
      const nextFocus = Math.min(startIndex + allowedCharacters.length, length - 1);
      inputRefs.current[nextFocus]?.focus();
    };

    const clearCharacter = (index: number) => {
      const slots = currentValue.padEnd(length, ' ').split('');
      slots[index] = ' ';
      commitValue(slots.join('').replace(/\s+$/g, ''));
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>, index: number) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        inputRefs.current[Math.max(index - 1, 0)]?.focus();
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        inputRefs.current[Math.min(index + 1, length - 1)]?.focus();
      }
      if (event.key === 'Backspace' && !currentValue[index] && index > 0) {
        event.preventDefault();
        clearCharacter(index - 1);
        inputRefs.current[index - 1]?.focus();
      }
    };

    return (
      <div ref={ref} data-slot="otp-input" className={cn('grid gap-1.5', className)} {...props}>
        {label ? (
          <p id={`${field.fieldId}-label`} className="text-sm font-medium text-foreground">
            {label}
          </p>
        ) : null}
        <div
          role="group"
          aria-labelledby={label ? `${field.fieldId}-label` : undefined}
          aria-describedby={field.ariaDescribedBy}
          aria-invalid={field.ariaInvalid}
          className="flex items-center gap-2"
        >
          {Array.from({ length }, (_, index) => (
            <input
              key={index}
              ref={(element) => {
                inputRefs.current[index] = element;
              }}
              value={currentValue[index] ?? ''}
              onChange={(event) => {
                if (event.target.value === '') clearCharacter(index);
                else setCharactersFrom(index, event.target.value);
              }}
              onKeyDown={(event) => handleKeyDown(event, index)}
              onPaste={(event) => {
                event.preventDefault();
                setCharactersFrom(index, event.clipboardData.getData('text'));
              }}
              aria-label={`${type === 'numeric' ? 'Digit' : 'Character'} ${index + 1} of ${length}`}
              aria-describedby={field.ariaDescribedBy}
              aria-invalid={field.ariaInvalid}
              autoComplete={index === 0 ? 'one-time-code' : 'off'}
              inputMode={type === 'numeric' ? 'numeric' : 'text'}
              maxLength={length - index}
              disabled={disabled}
              type="text"
              className="size-10 rounded-md border border-input bg-background text-center text-lg font-medium text-foreground shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20"
            />
          ))}
        </div>
        {field.message !== undefined && field.message !== null ? (
          <FieldMessage id={field.messageId} error={field.hasError}>
            {field.message}
          </FieldMessage>
        ) : null}
      </div>
    );
  },
);

OtpInput.displayName = 'OtpInput';

export { OtpInput };
