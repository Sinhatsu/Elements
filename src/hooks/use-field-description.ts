import { type ReactNode, useId } from 'react';

type AriaInvalid = boolean | 'true' | 'false' | 'grammar' | 'spelling' | undefined;

interface UseFieldDescriptionOptions {
  ariaDescribedBy?: string;
  ariaInvalid?: AriaInvalid;
  error?: ReactNode;
  helperText?: ReactNode;
  id?: string;
}

export function useFieldDescription({
  ariaDescribedBy,
  ariaInvalid,
  error,
  helperText,
  id,
}: UseFieldDescriptionOptions) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const message = error ?? helperText;
  const hasError = Boolean(error);
  const hasMessage = Boolean(message);
  const messageId = `${fieldId}-description`;
  const describedBy = [ariaDescribedBy, hasMessage ? messageId : undefined]
    .filter(Boolean)
    .join(' ');
  const isInvalid =
    hasError ||
    ariaInvalid === true ||
    ariaInvalid === 'true' ||
    ariaInvalid === 'grammar' ||
    ariaInvalid === 'spelling';

  return {
    ariaDescribedBy: describedBy || undefined,
    ariaInvalid: isInvalid || undefined,
    fieldId,
    hasError,
    message,
    messageId,
  };
}
