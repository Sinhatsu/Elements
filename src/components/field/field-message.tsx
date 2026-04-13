import { type ReactNode } from 'react';

import { cn } from '@/lib/cn';

interface FieldMessageProps {
  children: ReactNode;
  error?: boolean;
  id: string;
}

export function FieldMessage({ children, error = false, id }: FieldMessageProps) {
  return (
    <p
      id={id}
      role={error ? 'alert' : undefined}
      className={cn('text-sm', error ? 'text-destructive' : 'text-muted-foreground')}
    >
      {children}
    </p>
  );
}
